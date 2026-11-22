import { deleteField, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { deleteUser, type User as FirebaseUser } from 'firebase/auth';
import { db } from '../firebase';

export const GUEST_INACTIVITY_DAYS = 30;
export const GUEST_TTL_MS = GUEST_INACTIVITY_DAYS * 24 * 60 * 60 * 1000;
const GUEST_MAX_LIVES = 5;

const getLocalToday = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
};

const DEVICE_GUEST_KEY = 'koinkita_device_guest_v1';
const DEVICE_GUEST_INITIALIZED_KEY = 'koinkita_device_guest_initialized_v1';

export interface LocalGuestSnapshot {
  guestUid: string;
  name: string;
  fullName: string;
  tag: string;
  totalCoins: number;
  totalXp: number;
  lives: number;
  streakCount: number;
  lastActiveDate: string;
  lastLivesReset: string;
  dailyStats: Record<string, { gamesPlayed?: number }>;
  weeklyStats: Record<string, { gamesPlayed?: number }>;
  claimedQuests: Record<string, string[]>;
  dailyHeartRecoveries?: { date: string; count: number };
  lastActiveAt: number;
  createdAt: number;
  upgradedToUid?: string;
}

export interface LocalGuestSessionUser {
  uid: string;
  isAnonymous: true;
  isLocalGuest: true;
  displayName: string;
  email: string;
  photoURL: string;
}

export function isLocalGuestUser(user: any): user is LocalGuestSessionUser {
  return Boolean(user && user.isLocalGuest);
}

export function markDeviceGuestInitialized() {
  try {
    localStorage.setItem(DEVICE_GUEST_INITIALIZED_KEY, 'true');
  } catch {
    // ignore storage errors
  }
}

export function hasDeviceGuestBeenInitialized(): boolean {
  try {
    return (
      localStorage.getItem(DEVICE_GUEST_INITIALIZED_KEY) === 'true' ||
      Boolean(localStorage.getItem(DEVICE_GUEST_KEY))
    );
  } catch {
    return false;
  }
}

export function loadLocalGuestSnapshot(): LocalGuestSnapshot | null {
  try {
    const raw = localStorage.getItem(DEVICE_GUEST_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LocalGuestSnapshot;
    if (!parsed || typeof parsed !== 'object') return null;

    // Purge stale inactive local guest snapshots older than 30 days
    if (
      parsed.lastActiveAt &&
      Date.now() - parsed.lastActiveAt > GUEST_TTL_MS
    ) {
      localStorage.removeItem(DEVICE_GUEST_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function persistLocalGuestSnapshot(
  snapshot: LocalGuestSnapshot,
  dispatch = true
): LocalGuestSnapshot {
  try {
    localStorage.setItem(DEVICE_GUEST_KEY, JSON.stringify(snapshot));
    markDeviceGuestInitialized();
    if (dispatch) {
      window.dispatchEvent(new Event('koinkita:local-guest-updated'));
    }
  } catch {
    // ignore storage errors
  }
  return snapshot;
}

export function getOrCreateLocalGuestSnapshot(
  seedUid?: string
): LocalGuestSnapshot {
  const existing = loadLocalGuestSnapshot();
  if (existing && (!seedUid || existing.guestUid === seedUid || existing.upgradedToUid === undefined)) {
    return {
      ...existing,
      lastActiveAt: Date.now(),
    };
  }

  const now = Date.now();
  const today = getLocalToday();
  const created: LocalGuestSnapshot = {
    guestUid: seedUid || existing?.guestUid || `local_guest_${Math.random().toString(36).slice(2, 10)}`,
    name: existing?.name || 'Tamu',
    fullName: existing?.fullName || 'Tamu',
    tag: existing?.tag || Math.floor(1000 + Math.random() * 9000).toString(),
    totalCoins: existing?.totalCoins ?? 0,
    totalXp: existing?.totalXp ?? 0,
    lives: existing?.lives ?? GUEST_MAX_LIVES,
    streakCount: existing?.streakCount ?? 1,
    lastActiveDate: existing?.lastActiveDate || today,
    lastLivesReset: existing?.lastLivesReset || today,
    dailyStats: existing?.dailyStats || {},
    weeklyStats: existing?.weeklyStats || {},
    claimedQuests: existing?.claimedQuests || {},
    dailyHeartRecoveries: existing?.dailyHeartRecoveries,
    lastActiveAt: now,
    createdAt: existing?.createdAt || now,
  };
  return persistLocalGuestSnapshot(created, false);
}

export function saveLocalGuestSnapshot(
  partial: Partial<LocalGuestSnapshot>
): LocalGuestSnapshot {
  const current = loadLocalGuestSnapshot() || getOrCreateLocalGuestSnapshot(partial.guestUid);
  const merged: LocalGuestSnapshot = {
    ...current,
    ...partial,
    lastActiveAt: Date.now(),
  };
  return persistLocalGuestSnapshot(merged, true);
}

export function createLocalGuestUserObject(
  snapshot?: LocalGuestSnapshot | null
): LocalGuestSessionUser {
  const snap = snapshot || getOrCreateLocalGuestSnapshot();
  return {
    uid: snap.guestUid,
    isAnonymous: true,
    isLocalGuest: true,
    displayName: snap.fullName || 'Tamu',
    email: 'guest@koinkita.xyz',
    photoURL: '',
  };
}

export function clearDeviceGuestData() {
  try {
    localStorage.removeItem(DEVICE_GUEST_KEY);
    localStorage.removeItem(DEVICE_GUEST_INITIALIZED_KEY);
    localStorage.removeItem('hasSeenOnboarding');
    localStorage.removeItem('koinkita_guest_prompt_seen');
  } catch {
    // ignore storage errors
  }
}

export function buildGuestFirestoreExpiryFields() {
  return {
    isAnonymous: true,
    lastActiveAt: Date.now(),
    guestExpiresAt: Timestamp.fromMillis(Date.now() + GUEST_TTL_MS),
  };
}

export function buildRegisteredAccountFirestoreFields() {
  return {
    isAnonymous: false,
    lastActiveAt: Date.now(),
    guestExpiresAt: deleteField(),
  };
}

export function isEmptyGuestAccount(
  userData: any,
  completedPathsCount: number
): boolean {
  const coins = userData?.totalCoins ?? userData?.coins ?? 0;
  const xp = userData?.totalXp ?? 0;
  return coins <= 0 && xp <= 0 && completedPathsCount <= 0;
}

/**
 * Deletes the currently signed-in Firebase Anonymous account and its Firestore doc
 * when the user switches into an existing registered account while the guest had 0 progress.
 */
export async function cleanupCurrentEmptyAnonymousUser(
  anonUser: FirebaseUser | null,
  hasProgress: boolean
): Promise<boolean> {
  if (!anonUser || !anonUser.isAnonymous || hasProgress) return false;
  try {
    await deleteDoc(doc(db, 'users', anonUser.uid)).catch(() => {});
    await deleteUser(anonUser);
    return true;
  } catch (err) {
    console.warn('Empty anonymous account cleanup skipped:', err);
    return false;
  }
}
