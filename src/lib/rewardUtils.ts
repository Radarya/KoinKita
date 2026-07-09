import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const changeUserLives = async (userUid: string, amount: number) => {
  if (!userUid) return;
  const userRef = doc(db, 'users', userUid);
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      const currentLives = data.lives !== undefined ? data.lives : 5;
      const newLives = Math.max(0, currentLives + amount);
      await updateDoc(userRef, { lives: newLives });
    }
  } catch (e) {
    console.warn("Error updating user lives:", e);
  }
};

export const rewardUser = async (userUid: string, leagueGroupId: string | undefined | null, coins: number, xp: number = coins) => {
  if (!userUid) return;
  const userRef = doc(db, 'users', userUid);
  const updates: any = {};
  
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
