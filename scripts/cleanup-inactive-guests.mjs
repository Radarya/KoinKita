/**
 * Maintenance script for purging inactive Guest (Anonymous) accounts in Firebase Auth & Firestore.
 *
 * Prerequisites (when running on an admin machine / scheduled CI job):
 *   1. Install firebase-admin in a scratch/tooling environment or globally:
 *      npm install --no-save firebase-admin
 *   2. Provide a Firebase service account JSON via GOOGLE_APPLICATION_CREDENTIALS:
 *      export GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json
 *
 * Usage:
 *   node scripts/cleanup-inactive-guests.mjs            # Dry run (default, 30 days)
 *   node scripts/cleanup-inactive-guests.mjs --days=14  # Dry run with 14-day threshold
 *   node scripts/cleanup-inactive-guests.mjs --execute  # Permanently delete matched anonymous guests
 *
 * Tip: Pair this with Firestore TTL Policy in Firebase Console -> Firestore -> TTL
 *      on collection `users`, timestamp field `guestExpiresAt` (automatically stamped by the app
 *      for guest accounts and cleared upon Google/Email linking).
 */

import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const args = process.argv.slice(2);
const execute = args.includes('--execute');
const daysArg = args.find((a) => a.startsWith('--days='));
const inactiveDays = daysArg ? Math.max(1, parseInt(daysArg.split('=')[1], 10) || 30) : 30;
const cutoffMs = Date.now() - inactiveDays * 24 * 60 * 60 * 1000;

let admin;
try {
  admin = require('firebase-admin');
} catch {
  console.error(
    'Package `firebase-admin` not found. Run `npm install --no-save firebase-admin` before running this admin cleanup.'
  );
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const auth = admin.auth();
const db = admin.firestore();

async function run() {
  console.log(
    `[Guest Cleanup] Mode: ${execute ? 'EXECUTE (PERMANENT DELETE)' : 'DRY-RUN'} | Inactive > ${inactiveDays} days`
  );

  let nextPageToken;
  let inspected = 0;
  let staleCount = 0;
  let deletedCount = 0;

  do {
    const listRes = await auth.listUsers(1000, nextPageToken);
    for (const userRecord of listRes.users) {
      inspected++;
      const isAnonymous = userRecord.providerData.length === 0;
      if (!isAnonymous) continue;

      const lastSignInMs = userRecord.metadata.lastSignInTime
        ? new Date(userRecord.metadata.lastSignInTime).getTime()
        : new Date(userRecord.metadata.creationTime).getTime();

      if (lastSignInMs > cutoffMs) continue;

      staleCount++;
      if (execute) {
        await db.collection('users').doc(userRecord.uid).delete().catch(() => {});
        await auth.deleteUser(userRecord.uid);
        deletedCount++;
      } else {
        console.log(
          `  [DRY-RUN] Stale guest UID=${userRecord.uid} lastSignIn=${new Date(lastSignInMs).toISOString()}`
        );
      }
    }
    nextPageToken = listRes.pageToken;
  } while (nextPageToken);

  console.log(
    `[Guest Cleanup] Done. Inspected=${inspected}, MatchedStaleGuests=${staleCount}, Deleted=${deletedCount}`
  );
}

run().catch((err) => {
  console.error('[Guest Cleanup] Failed:', err);
  process.exit(1);
});
