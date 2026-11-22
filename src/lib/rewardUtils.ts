import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getCurrentWeekId } from './leagueUtils';
import { loadLocalGuestSnapshot, saveLocalGuestSnapshot } from './guestLifecycle';

export const MAX_LIVES = 5;
export const DAILY_PRACTICE_HEART_LIMIT = 2;
export const LIFE_SHOP_COST_COINS = 50;

const isLocalOnlyUid = (uid?: string | null) =>
  !uid || uid.startsWith('local_guest_');

export const getLocalTodayStr = (d: Date = new Date()): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
};

const getRecoveryStorageKey = (userUid?: string | null) =>
  `koinkita_heart_recovery_v1_${userUid || 'guest'}`;

export interface DailyHeartRecoveryStatus {
  date: string;
  recoveredToday: number;
  limit: number;
  remaining: number;
}

export const getDailyHeartRecoveryStatus = (
  userData: any,
  userUid?: string | null
): DailyHeartRecoveryStatus => {
  const today = getLocalTodayStr();
  let localCount = 0;

  try {
    const raw = localStorage.getItem(getRecoveryStorageKey(userUid));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.date === today && typeof parsed.count === 'number') {
        localCount = parsed.count;
      }
    }
  } catch {
    // ignore storage errors
  }

  const dbRec = userData?.dailyHeartRecoveries;
  const dbCount =
    dbRec && dbRec.date === today && typeof dbRec.count === 'number'
      ? dbRec.count
      : 0;

  const recoveredToday = Math.max(localCount, dbCount);
  const remaining = Math.max(0, DAILY_PRACTICE_HEART_LIMIT - recoveredToday);
  return {
    date: today,
    recoveredToday,
    limit: DAILY_PRACTICE_HEART_LIMIT,
    remaining,
  };
};

const saveLocalRecoveryCount = (
  userUid: string | null | undefined,
  date: string,
  count: number
) => {
  try {
    localStorage.setItem(
      getRecoveryStorageKey(userUid),
      JSON.stringify({ date, count })
    );
  } catch {
    // ignore storage errors
  }
};

export const recordGameSession = async (userUid: string) => {
  if (!userUid) return;
  const today = getLocalTodayStr();
  const currentWeekId = getCurrentWeekId();

  if (isLocalOnlyUid(userUid)) {
    const snap = loadLocalGuestSnapshot();
    const curDaily = snap?.dailyStats?.[today]?.gamesPlayed || 0;
    const curWeekly = snap?.weeklyStats?.[currentWeekId]?.gamesPlayed || 0;
    saveLocalGuestSnapshot({
      dailyStats: {
        ...(snap?.dailyStats || {}),
        [today]: { gamesPlayed: curDaily + 1 },
      },
      weeklyStats: {
        ...(snap?.weeklyStats || {}),
        [currentWeekId]: { gamesPlayed: curWeekly + 1 },
      },
    });
    return;
  }

  const userRef = doc(db, 'users', userUid);
  try {
    await updateDoc(userRef, {
      [`dailyStats.${today}.gamesPlayed`]: increment(1),
      [`weeklyStats.${currentWeekId}.gamesPlayed`]: increment(1),
      totalGamesPlayed: increment(1),
      loginCount: increment(1),
      lastActiveAt: Date.now()
    });
  } catch (e) {
    console.warn("Error recording game session:", e);
  }
};

export const changeUserLives = async (userUid: string, amount: number) => {
  if (!userUid) return;
  if (isLocalOnlyUid(userUid)) {
    const snap = loadLocalGuestSnapshot();
    const currentLives = snap?.lives !== undefined ? snap.lives : MAX_LIVES;
    const newLives = Math.min(MAX_LIVES, Math.max(0, currentLives + amount));
    saveLocalGuestSnapshot({ lives: newLives });
    return;
  }

  const userRef = doc(db, 'users', userUid);
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      const currentLives = data.lives !== undefined ? data.lives : MAX_LIVES;
      const newLives = Math.min(MAX_LIVES, Math.max(0, currentLives + amount));
      await updateDoc(userRef, { lives: newLives, lastActiveAt: Date.now() });
    }
  } catch (e) {
    console.warn("Error updating user lives:", e);
  }
};

export interface PracticeHeartRecoveryResult {
  recovered: boolean;
  reason: 'ok' | 'full_lives' | 'daily_limit_reached';
  newLives: number;
  remainingQuota: number;
}

export const tryRecoverHeartFromPractice = async (
  userUid: string | null | undefined,
  userData: any
): Promise<PracticeHeartRecoveryResult> => {
  const currentLives = userData?.lives !== undefined ? userData.lives : MAX_LIVES;
  const status = getDailyHeartRecoveryStatus(userData, userUid);

  if (currentLives >= MAX_LIVES) {
    return {
      recovered: false,
      reason: 'full_lives',
      newLives: currentLives,
      remainingQuota: status.remaining,
    };
  }

  if (status.remaining <= 0) {
    return {
      recovered: false,
      reason: 'daily_limit_reached',
      newLives: currentLives,
      remainingQuota: 0,
    };
  }

  const nextCount = status.recoveredToday + 1;
  const newLives = Math.min(MAX_LIVES, currentLives + 1);
  saveLocalRecoveryCount(userUid, status.date, nextCount);

  if (isLocalOnlyUid(userUid)) {
    saveLocalGuestSnapshot({
      lives: newLives,
      dailyHeartRecoveries: { date: status.date, count: nextCount },
    });
  } else if (userUid) {
    const userRef = doc(db, 'users', userUid);
    try {
      await updateDoc(userRef, {
        lives: newLives,
        dailyHeartRecoveries: { date: status.date, count: nextCount },
        lastActiveAt: Date.now(),
      });
    } catch (e) {
      console.warn('Error recovering heart from practice:', e);
    }
  }

  return {
    recovered: true,
    reason: 'ok',
    newLives,
    remainingQuota: Math.max(0, DAILY_PRACTICE_HEART_LIMIT - nextCount),
  };
};

export interface BuyLifeResult {
  purchased: boolean;
  reason: 'ok' | 'full_lives' | 'insufficient_coins';
  newLives: number;
}

export const buyLifeWithCoins = async (
  userUid: string | null | undefined,
  userData: any
): Promise<BuyLifeResult> => {
  const currentLives = userData?.lives !== undefined ? userData.lives : MAX_LIVES;
  const coins = userData?.totalCoins ?? userData?.coins ?? 0;

  if (currentLives >= MAX_LIVES) {
    return { purchased: false, reason: 'full_lives', newLives: currentLives };
  }
  if (coins < LIFE_SHOP_COST_COINS) {
    return { purchased: false, reason: 'insufficient_coins', newLives: currentLives };
  }

  const newLives = Math.min(MAX_LIVES, currentLives + 1);
  if (isLocalOnlyUid(userUid)) {
    const snap = loadLocalGuestSnapshot();
    const curCoins = snap?.totalCoins ?? coins;
    saveLocalGuestSnapshot({
      lives: newLives,
      totalCoins: Math.max(0, curCoins - LIFE_SHOP_COST_COINS),
    });
  } else if (userUid) {
    const userRef = doc(db, 'users', userUid);
    try {
      await updateDoc(userRef, {
        lives: newLives,
        totalCoins: increment(-LIFE_SHOP_COST_COINS),
        lastActiveAt: Date.now(),
      });
    } catch (e) {
      console.warn('Error buying life with coins:', e);
    }
  }

  return { purchased: true, reason: 'ok', newLives };
};

export const rewardUser = async (userUid: string, leagueGroupId: string | undefined | null, coins: number, xp: number = coins) => {
  if (!userUid) return;
  if (isLocalOnlyUid(userUid)) {
    const snap = loadLocalGuestSnapshot();
    const curCoins = snap?.totalCoins ?? 0;
    const curXp = snap?.totalXp ?? 0;
    saveLocalGuestSnapshot({
      totalCoins: curCoins + coins,
      totalXp: curXp + xp,
    });
    return;
  }

  const userRef = doc(db, 'users', userUid);
  const updates: any = { lastActiveAt: Date.now() };
  
  if (coins !== 0) updates.totalCoins = increment(coins);
  if (xp !== 0) updates.totalXp = increment(xp);

  if (Object.keys(updates).length > 0) {
    try {
      await updateDoc(userRef, updates);
    } catch (e) {
      console.warn("Error updating user rewards:", e);
    }
  }

  if (leagueGroupId && xp > 0) {
    const groupRef = doc(db, 'league_groups', leagueGroupId);
    try {
      await updateDoc(groupRef, {
        [`players.${userUid}.xp`]: increment(xp)
      });
    } catch (e) {
      console.warn("Error updating league xp:", e);
    }
  }
};
