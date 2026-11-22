import React, { useState, useEffect, startTransition, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';

import { 
  Mail, 
  Lock, 
  Calendar, 
  ShieldCheck, 
  Coins, 
  ArrowRight, 
  LogIn, 
  UserPlus,
  X,
  FileText,
  Shield,
  Eye,
  EyeOff,
  Info,
  Globe,
  Copy,
  Check,
  ShieldAlert,
  Settings,
  Flame,
  ArrowUp,
  MapPin,
  Camera,
  PlayCircle,
  Gamepad2,
  Star,
  Trophy,
  Bell,
  Heart,
  TrendingUp,
  Award,
  Zap,
  Target,
  ChefHat, 
  Leaf, 
  MessageSquareText, 
  LogOut, 
  Users,
  User,
  Sparkles,
  ChevronRight,
  Loader2,
  Medal,
  Gift,
  Swords,
  UserCircle,
  Dumbbell
} from 'lucide-react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { 
  collection, query, where, getDocs, doc, 
  onSnapshot, 
  updateDoc,
  setDoc,
  increment,
  arrayUnion,
  getDoc,
  addDoc,
  deleteField
} from 'firebase/firestore';

// Lazy load heavy components - each loads only when opened
const UserProfile   = lazy(() => import('./UserProfile'));
const Arena        = lazy(() => import('./Arena'));
const LessonRunner = lazy(() => import('./curriculum/LessonRunner'));
const ExamRunner   = lazy(() => import('./curriculum/ExamRunner'));
const GuidebookModal = lazy(() => import('./curriculum/GuidebookModal'));
const QuestsTab    = lazy(() => import('./QuestsTab').then(m => ({ default: m.QuestsTab })));
const PracticeTab  = lazy(() => import('./PracticeTab').then(m => ({ default: m.PracticeTab })));
const ProfileTab   = lazy(() => import('./ProfileTab').then(m => ({ default: m.ProfileTab })));
import { CurriculumMap } from './curriculum/CurriculumMap';
import type { ExamRunnerMode } from './curriculum/ExamRunner';
import type { LessonConfig, UserCurriculumProgress } from '../curriculum/types';
import { UNIT_MAP } from '../curriculum';
import {
  loadCurriculumProgress,
  loadLocalCurriculumProgress,
  mergeCurriculumProgress,
  saveCurriculumProgress,
} from '../curriculum/progression';

import TermsModal from './TermsModal';
import { SettingsModal } from './SettingsModal';
import InboxModal from './InboxModal';
import { AchievementsModal, ACHIEVEMENTS } from './AchievementsModal';
import { BottomNavBar, type NavTabId } from './BottomNavBar';
import {
  LIFE_SHOP_COST_COINS,
  MAX_LIVES,
  buyLifeWithCoins,
  changeUserLives,
  getLocalTodayStr,
  recordGameSession,
  rewardUser,
  tryRecoverHeartFromPractice,
} from '../lib/rewardUtils';
import {
  buildGuestFirestoreExpiryFields,
  getOrCreateLocalGuestSnapshot,
  isLocalGuestUser,
  saveLocalGuestSnapshot,
} from '../lib/guestLifecycle';
import CikoMascot from './CikoMascot';
import { FINANCIAL_TIPS } from '../lib/tips';
import { playClick, playWin, setGameViewTrack } from '../lib/audio';
import { useTranslation } from '../lib/LanguageContext';
import { getCurrentWeekId, calculateInitialLeague, getLeagueInfo, getDemotionRank } from '../lib/leagueUtils';

// Fallback spinner untuk lazy-loaded components
const GameLoadingFallback = () => (
  <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
    <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
  </div>
);

interface DashboardProps {
  user: any;
  onShowTerms: () => void;
  triggerToast?: (msg: string, type: 'success' | 'warning' | 'error' | 'info') => void;
  /** Called when a guest user logs out cleanly on web */
  onGuestLogout?: () => void;
  /** Called to trigger Google linking/sign-in */
  onLinkGoogle?: () => void;
  /** Called to open Email Auth view */
  onOpenAuth?: () => void;
  /** Called after guest deletes local data */
  onGuestDeleted?: () => void;
  /** Called to trigger a fresh Google sign-in (switch account). Dashboard signs out first, then App.tsx handles sign-in. */
  onSwitchGoogle?: () => void;
}

/**
 * @description Calculates player level based on cumulative coins
 * @param {number} coins - The total wallet coins
 * @returns {number} The calculated level (0 to 5)
 */
export function calculateLevelFromCoins(coins: number): number {
  if (coins >= 50000) return 5;
  if (coins >= 30000) return 4;
  if (coins >= 15000) return 3;
  if (coins >= 5000) return 2;
  if (coins >= 1000) return 1;
  return 0;
}

export default function Dashboard({
  user,
  onShowTerms,
  triggerToast,
  onGuestLogout,
  onLinkGoogle,
  onOpenAuth,
  onGuestDeleted,
  onSwitchGoogle,
}: DashboardProps) {
  const { t, language } = useTranslation();
  const [userData, setUserData] = useState<any>(null);
  const [curriculumProgress, setCurriculumProgress] = useState<UserCurriculumProgress>(() =>
    loadLocalCurriculumProgress(user?.uid)
  );
  const [activeCurriculumLesson, setActiveCurriculumLesson] = useState<{
    lesson: LessonConfig;
    reviewItemIds?: string[];
  } | null>(null);
  const [activeCurriculumExam, setActiveCurriculumExam] = useState<ExamRunnerMode | null>(null);
  const [guidebookUnitId, setGuidebookUnitId] = useState<string | null>(null);
  const [curriculumUnitFocus, setCurriculumUnitFocus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<NavTabId>('home');
  const [showSettings, setShowSettings] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [leagueCheckDone, setLeagueCheckDone] = useState(false);

  const [pendingFriendData, setPendingFriendData] = useState<any | null>(null);
  const [unreadInboxCount, setUnreadInboxCount] = useState(0);
  const [leaguePopup, setLeaguePopup] = useState<{status: string, newLeague: number} | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [showDailyQuests, setShowDailyQuests] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadCurriculumProgress(user?.uid).then((merged) => {
      if (!mounted) return;
      setCurriculumProgress((curr) => mergeCurriculumProgress(curr, merged));
    });
    return () => {
      mounted = false;
    };
  }, [user?.uid]);

  useEffect(() => {
    if (userData?.curriculumProgress) {
      setCurriculumProgress((curr) =>
        mergeCurriculumProgress(curr, userData.curriculumProgress)
      );
    }
  }, [userData?.curriculumProgress]);

  useEffect(() => {
    const checkPendingFriend = async () => {
      const pendingUid = localStorage.getItem('pendingFriendRequest');
      if (pendingUid && user) {
        if (pendingUid === user.uid) {
           localStorage.removeItem('pendingFriendRequest');
           return;
        }
        try {
          const docRef = doc(db, 'users', pendingUid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPendingFriendData({ id: docSnap.id, ...docSnap.data() });
          } else {
             localStorage.removeItem('pendingFriendRequest');
          }
        } catch(e) {
          console.warn(e);
        }
      }
    };
    checkPendingFriend();

    // Listen to changes (e.g. from dynamic deep links)
    window.addEventListener('pendingFriendRequestUpdated', checkPendingFriend);
    return () => {
      window.removeEventListener('pendingFriendRequestUpdated', checkPendingFriend);
    };
  }, [user]);

  // Hardware Back Button modal interceptor
  useEffect(() => {
    const handleBack = (e: Event) => {
      if (showTermsModal || showInbox || showDailyQuests || showSocial || showAchievements || leaguePopup || pendingFriendData) {
        e.preventDefault();
        setShowTermsModal(false);
        setShowInbox(false);
        setShowDailyQuests(false);
        setShowSocial(false);
        setShowAchievements(false);
        setLeaguePopup(null);
        setPendingFriendData(null);
      }
    };
    window.addEventListener('hardwareBackButton', handleBack);
    return () => window.removeEventListener('hardwareBackButton', handleBack);
  }, [showTermsModal, showInbox, showDailyQuests, showSocial, showAchievements, leaguePopup, pendingFriendData]);

  const handleSendPendingRequest = async () => {
    if (!pendingFriendData) return;
    try {
      const refTag = localStorage.getItem('referralTag');
      const isRef = refTag === pendingFriendData.tag || refTag === pendingFriendData.id;
      await addDoc(collection(db, 'inbox'), {
        userId: pendingFriendData.id,
        type: 'friend_request',
        fromUserId: user.uid,
        fromUserName: userData?.fullName || userData?.name || 'Player',
        isReferral: !!isRef,
        status: 'unread',
        createdAt: Date.now()
      });
      if (triggerToast) triggerToast(language === 'id' ? 'Permintaan pertemanan dikirim!' : 'Friend request sent!', 'success');
    } catch(e) {
      if (triggerToast) triggerToast(language === 'id' ? 'Gagal mengirim permintaan' : 'Failed to send request', 'error');
    } finally {
      setPendingFriendData(null);
      localStorage.removeItem('pendingFriendRequest');
      localStorage.removeItem('referralTag');
    }
  };

  const [levelUpNotice, setLevelUpNotice] = useState<{ show: boolean, oldLevel: number, newLevel: number }>({ show: false, oldLevel: 0, newLevel: 0 });
  const [toastQueue, setToastQueue] = useState<any[]>([]);


  useEffect(() => {
    if (toastQueue.length > 0) {
      playWin();
      const timer = setTimeout(() => {
         setToastQueue(prev => prev.slice(1));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastQueue]);
  // Autoplay background music
  useEffect(() => {
    setGameViewTrack('dashboard');
  }, []);

  // Weekly League Processing
  useEffect(() => {
    if (!userData || !user?.uid || isLocalGuestUser(user) || leagueCheckDone) return;
    setLeagueCheckDone(true);
    
    const processLeague = async () => {
      try {
        const currentWeekId = getCurrentWeekId();
        let userLeague = userData.league;
        
        // Initialize league if undefined
        if (userLeague === undefined) {
          userLeague = calculateInitialLeague(userData.totalXp || 0);
          await updateDoc(doc(db, 'users', user.uid), { league: userLeague });
        }

        // ── BUG FIX 2c: Guard – user already has a valid group for THIS week ──
        // If the user's current leagueGroupId belongs to this week, we just need
        // to stamp currentWeekId on the user doc (in case it was missing) and stop.
        // This prevents duplicate groups when a user logs out/in within the same week.
        if (userData.leagueGroupId && userData.currentWeekId === currentWeekId) {
          // Nothing to do – already in correct group for this week
          setLeagueCheckDone(true);
          return;
        }

        // Verify the existing group really IS for the current week
        // (edge case: leagueGroupId set but weekId mismatch on user doc)
        if (userData.leagueGroupId && userData.currentWeekId !== currentWeekId) {
          const existingGroupSnap = await getDoc(doc(db, 'league_groups', userData.leagueGroupId));
          if (existingGroupSnap.exists() && existingGroupSnap.data().weekId === currentWeekId) {
            // Group is already for this week – just update user's weekId stamp
            await updateDoc(doc(db, 'users', user.uid), { currentWeekId });
            setLeagueCheckDone(true);
            return;
          }
        }
        
        // ── Week has changed (or first time) – process promotion/demotion ──
        let newLeague = userLeague;
        let status = 'stayed';
        let oldRank = null;
        const oldGroupId = userData.leagueGroupId || null;
        
        // Check previous group standings
        if (oldGroupId) {
          const oldGroupRef = doc(db, 'league_groups', oldGroupId);
          const oldGroupSnap = await getDoc(oldGroupRef);
          
          if (oldGroupSnap.exists()) {
            const oldGroupData = oldGroupSnap.data();
            // Only process standings if old group belongs to a PREVIOUS week
            if (oldGroupData.weekId !== currentWeekId) {
              const groupLeague = oldGroupData.league || 0;
              const demotionRank = getDemotionRank(groupLeague);

              const playersObj = oldGroupData.players || {};
              const playersArr = Object.entries(playersObj)
                .map(([uid, data]: [string, any]) => ({ uid, xp: data.xp || 0 }))
                .sort((a, b) => b.xp - a.xp);
              
              const myIndex = playersArr.findIndex(p => p.uid === user.uid);
              if (myIndex !== -1) {
                oldRank = myIndex + 1;
                if (oldRank <= 3) {
                  newLeague = Math.min(5, newLeague + 1);
                  status = 'promoted';
                } else if (oldRank >= demotionRank) {
                  newLeague = Math.max(0, newLeague - 1);
                  status = 'demoted';
                }
                
                if (status !== 'stayed') {
                  const inboxRef = collection(db, 'inbox');
                  await setDoc(doc(inboxRef), {
                    type: 'league_result',
                    userId: user.uid,
                    fromUserId: 'system',
                    fromUserName: 'Sistem Liga',
                    status,
                    oldRank,
                    newLeague,
                    createdAt: Date.now()
                  });
                }
              }

              // ── BUG FIX 2b: Remove player entry from OLD group ──
              // Previously the player stayed in both leagues simultaneously.
              await updateDoc(oldGroupRef, {
                [`players.${user.uid}`]: deleteField(),
                playerCount: increment(-1)
              });
            }
          }
        }
        
        // Reverted to single field query to avoid Firestore composite index errors
        const groupsRef = collection(db, 'league_groups');
        const q = query(
          groupsRef,
          where('weekId', '==', currentWeekId)
        );
        const snap = await getDocs(q);
        
        let newGroupId = '';
        const playerEntry = {
          xp: 0,
          displayName: userData.username || userData.name || userData.displayName || 'Pemain',
          photoUrl: userData.profilePictureUrl || userData.profilePicUrl || user.photoURL || '',
          username: userData.username || ''
        };
        
        // Filter in JS for league matching and playerCount < 15
        const availableGroups = snap.docs
          .map(d => ({ id: d.id, data: d.data() }))
          .filter(g => g.data.league === newLeague && (g.data.playerCount || 0) < 15)
          .sort((a, b) => (b.data.playerCount || 0) - (a.data.playerCount || 0));

        if (availableGroups.length > 0) {
          newGroupId = availableGroups[0].id;
          await updateDoc(doc(db, 'league_groups', newGroupId), {
            playerCount: increment(1),
            [`players.${user.uid}`]: playerEntry
          });
        } else {
          // No available group – create a new one
          const newGroupRef = doc(groupsRef);
          newGroupId = newGroupRef.id;
          await setDoc(newGroupRef, {
            weekId: currentWeekId,
            league: newLeague,
            playerCount: 1,
            players: { [user.uid]: playerEntry },
            createdAt: Date.now()
          });
        }
        
        // Update user doc with new group and week
        await updateDoc(doc(db, 'users', user.uid), {
          currentWeekId,
          leagueGroupId: newGroupId,
          league: newLeague,
          lastLeagueStatus: status,
          lastLeagueRank: oldRank
        });
        
        if (status === 'promoted' || status === 'demoted') {
          setLeaguePopup({ status, newLeague });
        }

      } catch (error) {
        if ((error as any).code === 'permission-denied') {
          console.warn("Permission denied for league processing. Please update Firestore rules.");
        } else if ((error as any).code === 'failed-precondition') {
          // Composite index not yet created – log a helpful message
          console.warn(
            "League query needs a Firestore composite index. " +
            "Check the Firebase console error link to create it automatically.",
            error
          );
        } else {
          console.warn("League processing warning:", error);
        }
      } finally {
        setLeagueCheckDone(true);
      }
    };
    
    processLeague();
  }, [userData, user, leagueCheckDone]);

  // Sync firestore or local guest user statistics
  useEffect(() => {
    let unsubscribe = () => {};
    let unsubscribeInbox = () => {};
    let removeLocalListener = () => {};

    const fetchUserData = async () => {
      setIsDataLoading(true);
      if (isLocalGuestUser(user)) {
        const applyLocalSnapshot = () => {
          const snap = getOrCreateLocalGuestSnapshot(user.uid);
          const todayStr = getLocalTodayStr();
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = getLocalTodayStr(yesterday);

          const nextPatch: Record<string, any> = {};
          if (snap.lastLivesReset !== todayStr) {
            if (snap.lives < MAX_LIVES) nextPatch.lives = MAX_LIVES;
            nextPatch.lastLivesReset = todayStr;
          }
          if (snap.lastActiveDate !== todayStr) {
            nextPatch.streakCount =
              snap.lastActiveDate === yesterdayStr ? (snap.streakCount || 0) + 1 : 1;
            nextPatch.lastActiveDate = todayStr;
          }
          const finalSnap =
            Object.keys(nextPatch).length > 0
              ? saveLocalGuestSnapshot(nextPatch)
              : snap;
          setUserData({ ...finalSnap, friends: [] });
        };

        applyLocalSnapshot();
        const handler = () => applyLocalSnapshot();
        window.addEventListener('koinkita:local-guest-updated', handler);
        removeLocalListener = () =>
          window.removeEventListener('koinkita:local-guest-updated', handler);
        setIsDataLoading(false);
        return;
      }

      if (user?.uid) {
        const docRef = doc(db, 'users', user.uid);
        unsubscribe = onSnapshot(docRef, async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const coins = data.totalCoins || data.coins || 0;
            const permanentXp = Math.max(data.totalXp || 0, coins);
            const dbLevel = data.level !== undefined ? data.level : 0;
            const calculated = calculateLevelFromCoins(permanentXp);
            
            if (!data.tag) {
               const newTag = Math.floor(1000 + Math.random() * 9000).toString();
               updateDoc(docRef, { tag: newTag }).catch(console.warn);
               data.tag = newTag;
            }
            setUserData(data);

            if (user.isAnonymous) {
              saveLocalGuestSnapshot({
                guestUid: user.uid,
                name: data.name || 'Tamu',
                fullName: data.fullName || data.name || 'Tamu',
                tag: data.tag || '0000',
                totalCoins: data.totalCoins ?? data.coins ?? 0,
                totalXp: data.totalXp ?? 0,
                lives: data.lives ?? MAX_LIVES,
                streakCount: data.streakCount ?? 1,
                lastActiveDate: data.lastActiveDate || getLocalTodayStr(),
                lastLivesReset: data.lastLivesReset || getLocalTodayStr(),
                dailyStats: data.dailyStats || {},
                weeklyStats: data.weeklyStats || {},
                claimedQuests: data.claimedQuests || {},
                dailyHeartRecoveries: data.dailyHeartRecoveries,
              });
              // Keep 30-day inactivity TTL stamped once stale by >1 hour
              if (!data.lastActiveAt || Date.now() - data.lastActiveAt > 3600000) {
                updateDoc(docRef, buildGuestFirestoreExpiryFields()).catch(console.warn);
              }
            }

            // ── Daily Lives Regeneration ──────────────────────────────────────
            // Regenerate lives to 5 once per calendar day (matching the UI promise
            // "Tunggu besok" / "Wait tomorrow").
            const getLocalYMD = (d: Date) => {
              const y = d.getFullYear();
              const m = String(d.getMonth() + 1).padStart(2, '0');
              const dd = String(d.getDate()).padStart(2, '0');
              return `${y}-${m}-${dd}`;
            };
            
            const todayStr = getLocalYMD(new Date()); // Local YYYY-MM-DD
            const lastReset = data.lastLivesReset || '';
            const currentLivesVal = data.lives !== undefined ? data.lives : 5;
            if (lastReset !== todayStr && currentLivesVal < 5) {
              try {
                await updateDoc(docRef, {
                  lives: 5,
                  lastLivesReset: todayStr
                });
                if (triggerToast) {
                  triggerToast(
                    language === 'id'
                      ? '❤️ Nyawa telah dipulihkan! Semangat bermain hari ini!'
                      : '❤️ Lives restored! Have fun playing today!',
                    'success'
                  );
                }
              } catch (e) {
                console.warn('Failed to reset daily lives:', e);
              }
            } else if (lastReset !== todayStr && currentLivesVal >= 5) {
              // Just update the reset date marker without changing lives
              updateDoc(docRef, { lastLivesReset: todayStr }).catch(console.warn);
            }
            
            // 🔥 Daily Streak Tracking 🔥
            const lastActiveDate = data.lastActiveDate || '';
            const currentStreak = data.streakCount || 0;
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = getLocalYMD(yesterday);
            
            if (lastActiveDate !== todayStr) {
              let newStreak = currentStreak;
              if (lastActiveDate === yesterdayStr) {
                // Played yesterday, increment streak!
                newStreak += 1;
              } else {
                // Missed a day or first time, reset to 1
                newStreak = 1;
              }
              
              updateDoc(docRef, {
                streakCount: newStreak,
                lastActiveDate: todayStr,
                loginCount: increment(1)
              }).catch(console.warn);
              data.streakCount = newStreak;
            }
            // 🔥─────────────────────────────────────────────────────────────────

            // Level-up condition trigger check

            if (calculated > dbLevel && dbLevel !== undefined) {
              try {
                await updateDoc(docRef, { level: calculated });
                if (dbLevel > 0) {
                  playWin();
                  setLevelUpNotice({ show: true, oldLevel: dbLevel, newLevel: calculated });
                }
              } catch (e) {
                console.warn("Failed to update user level doc:", e);
              }
            }

            // Achievement unlock trigger check
            const unlockedDb: string[] = data.unlockedAchievements || [];
            const newUnlocked: string[] = [];
            const newToasts: any[] = [];
            ACHIEVEMENTS.forEach(ach => {
               if (!unlockedDb.includes(ach.id) && ach.condition(coins, calculated, data)) {
                  newUnlocked.push(ach.id);
                  newToasts.push(ach);
               }
            });
            
            if (newUnlocked.length > 0) {
               try {
                  await updateDoc(docRef, { unlockedAchievements: arrayUnion(...newUnlocked) });
                  setToastQueue(prev => [...prev, ...newToasts]);
               } catch (e) {
                  console.warn("Failed to update unlockedAchievements:", e);
               }
            }
          } else {
            // Pemulihan jika dokumen user tidak ada di database namun Auth masih login
            const newTag = Math.floor(1000 + Math.random() * 9000).toString();
            const basicData = {
               uid: user.uid,
               name: user.displayName || 'Pemain',
               fullName: user.displayName || 'Pemain',
               email: user.email || '',
               tag: newTag,
               totalCoins: 0,
               createdAt: new Date().toISOString(),
               lastLogin: new Date().toISOString()
            };
            setDoc(docRef, basicData).catch(console.warn);
            setUserData(basicData as any);
          }
          setIsDataLoading(false);
        }, (err) => {
          console.warn("Dashboard snapshot error:", err);
          setIsDataLoading(false);
        });

        const inboxQuery = query(collection(db, 'inbox'), where('userId', '==', user.uid), where('status', '==', 'unread'));
        unsubscribeInbox = onSnapshot(inboxQuery, (snap) => {
          setUnreadInboxCount(snap.docs.length);
        });
      } else {
        setIsDataLoading(false);
      }
    };
    fetchUserData();
    return () => { unsubscribe(); unsubscribeInbox(); removeLocalListener(); };
  }, [user]);


  const handleLogout = async () => {
    try {
      if (user?.isAnonymous) {
        // Guest: do NOT sign out - keep Firebase anonymous session alive so progress is retained.
        // Just navigate back to login choice screen.
        if (triggerToast) {
          triggerToast(
            language === 'id' ? 'Keluar sementara. Akun tamu kamu tersimpan!' : 'Exited. Your guest account is saved!',
            'info'
          );
        }
        onGuestLogout?.();
      } else {
        // Google / Email: perform a real sign out
        if (Capacitor.isNativePlatform()) {
          try {
            await FirebaseAuthentication.signOut();
          } catch (e) {}
        }
        if (triggerToast) {
          triggerToast(language === 'id' ? 'Berhasil keluar. Sampai jumpa!' : 'Successfully logged out. See you!', 'info');
        }
        await signOut(auth);
      }
    } catch (error) {
      console.warn("Logout error:", error);
    }
  };

  const handleSwitchGoogleAccount = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        try {
          await FirebaseAuthentication.signOut();
        } catch (e) {}
      }
      if (triggerToast) {
        triggerToast(language === 'id' ? 'Silakan masuk dengan akun Google yang baru' : 'Please sign in with your new Google account', 'info');
      }
      await signOut(auth);
    } catch (error) {
      console.warn("Switch Google error:", error);
    }
  };


  
  const userLeague = userData?.league !== undefined ? userData?.league : 0;
  const userLevel = userLeague;
  const accountLevel = userData?.level !== undefined
    ? userData.level
    : calculateLevelFromCoins(Math.max(userData?.totalXp || 0, userData?.totalCoins || userData?.coins || 0));

  const getLevelName = (lvl: number, lang: 'id' | 'en') => {
    switch (lvl) {
      case 5: return lang === 'id' ? 'Master Kekayaan 👑' : 'Wealth Master 👑';
      case 4: return lang === 'id' ? 'Ahli Anggaran 💎' : 'Budget Expert 💎';
      case 3: return lang === 'id' ? 'Investor Cerdas 🏅' : 'Smart Investor 🏅';
      case 2: return lang === 'id' ? 'Bijak Belanja 🥇' : 'Wise Spender 🥇';
      case 1: return lang === 'id' ? 'Sadar Finansial 🥈' : 'Financially Aware 🥈';
      default: return lang === 'id' ? 'Pemula 🥉' : 'Beginner 🥉';
    }
  };

  const currentLives = userData?.lives !== undefined ? userData.lives : MAX_LIVES;

  const handleConsumeCurriculumLife = () => {
    setUserData((prev: any) => {
      const cur = prev?.lives !== undefined ? prev.lives : MAX_LIVES;
      return { ...(prev || {}), lives: Math.max(0, cur - 1) };
    });
    if (user?.uid) {
      changeUserLives(user.uid, -1);
    }
  };

  const handlePracticeRecovery = async () => {
    const res = await tryRecoverHeartFromPractice(user?.uid, userData);
    if (res.recovered) {
      setUserData((prev: any) => ({ ...(prev || {}), lives: res.newLives }));
      triggerToast?.(
        language === 'id'
          ? `+1 Nyawa berhasil ditebus! Kuota gratis tersisa ${res.remainingQuota} hari ini.`
          : `+1 Heart recovered! Daily free quota left: ${res.remainingQuota}.`,
        'success'
      );
    } else if (res.reason === 'daily_limit_reached') {
      triggerToast?.(
        language === 'id'
          ? 'Latihan selesai! Kuota tebus nyawa gratis hari ini sudah terpakai semua.'
          : 'Practice finished! Daily free heart recovery limit reached.',
        'info'
      );
    }
    return res;
  };

  const handleBuyLifeWithCoins = async () => {
    const res = await buyLifeWithCoins(user?.uid, userData);
    if (res.purchased) {
      setUserData((prev: any) => ({
        ...(prev || {}),
        lives: res.newLives,
        totalCoins: Math.max(0, (prev?.totalCoins ?? prev?.coins ?? 0) - LIFE_SHOP_COST_COINS),
      }));
      triggerToast?.(
        language === 'id' ? '+1 Nyawa ditambahkan!' : '+1 Heart added!',
        'success'
      );
    } else if (res.reason === 'insufficient_coins') {
      triggerToast?.(
        language === 'id'
          ? `Koin Saku belum cukup untuk menukar ${LIFE_SHOP_COST_COINS} Koin.`
          : `Not enough Coins to spend ${LIFE_SHOP_COST_COINS} Coins.`,
        'error'
      );
    }
  };

  const handleCurriculumProgressUpdated = (next: UserCurriculumProgress) => {
    setCurriculumProgress(next);
    saveCurriculumProgress(user?.uid, next);
  };

  const handleStartRemedialUnit = (unitId: string) => {
    const unit = UNIT_MAP[unitId];
    if (!unit) {
      setActiveCurriculumExam(null);
      return;
    }
    const unitPaths = unit.stages.flatMap((s) => s.paths);
    const targetLesson =
      unitPaths.find((p) => !curriculumProgress.completedPathIds.includes(p.pathId)) ||
      unitPaths[0];
    setActiveCurriculumExam(null);
    setCurriculumUnitFocus(unitId);
    if (targetLesson) {
      setActiveCurriculumLesson({ lesson: targetLesson });
    }
  };

  if (activeCurriculumLesson) {
    return (
      <Suspense fallback={<GameLoadingFallback />}>
        <LessonRunner
          key={activeCurriculumLesson.lesson.pathId}
          lesson={activeCurriculumLesson.lesson}
          reviewMistakeItemIds={activeCurriculumLesson.reviewItemIds}
          userUid={user?.uid || null}
          leagueGroupId={userData?.leagueGroupId}
          progress={curriculumProgress}
          lives={currentLives}
          onConsumeLife={handleConsumeCurriculumLife}
          onPracticeReviewCompleted={async (res) => {
            if (res.correctCount > 0) {
              return handlePracticeRecovery();
            }
          }}
          onOpenPractice={() => {
            setActiveCurriculumLesson(null);
            setActiveTab('practice');
          }}
          onProgressUpdated={handleCurriculumProgressUpdated}
          onOpenGuidebook={(uId) => setGuidebookUnitId(uId)}
          onStartNextPath={(nextLesson) => {
            setCurriculumUnitFocus(nextLesson.unitId);
            setActiveCurriculumLesson({ lesson: nextLesson });
          }}
          onBack={() => setActiveCurriculumLesson(null)}
        />
        <GuidebookModal unitId={guidebookUnitId} onClose={() => setGuidebookUnitId(null)} />
      </Suspense>
    );
  }

  if (activeCurriculumExam) {
    return (
      <Suspense fallback={<GameLoadingFallback />}>
        <ExamRunner
          mode={activeCurriculumExam}
          progress={curriculumProgress}
          onProgressUpdated={handleCurriculumProgressUpdated}
          onStartRemedialUnit={handleStartRemedialUnit}
          onBack={() => setActiveCurriculumExam(null)}
        />
      </Suspense>
    );
  }

  const displayName = userData?.fullName || userData?.name || user?.displayName || 'Pemain';
  const displayCoins = userData?.totalCoins || userData?.coins || 0;
  const explicitlyRemoved = userData?.profilePictureUrl === '' && userData?.profilePicUrl === '';
  const fallbackRemoved = userData?.profilePicUrl === '' && !userData?.profilePictureUrl;
  
  let displayPic = '';
  if (userData?.profilePictureUrl) {
    displayPic = userData.profilePictureUrl;
  } else if (userData?.profilePicUrl) {
    displayPic = userData.profilePicUrl;
  } else if (explicitlyRemoved || fallbackRemoved) {
    displayPic = '';
  } else {
    displayPic = user?.photoURL || '';
  }
  
  const isReturningUser = displayCoins > 0 || (userData?.dailyStats && Object.keys(userData.dailyStats).length > 0) || (userData?.claimedQuests && Object.keys(userData.claimedQuests).length > 0) || userLevel > 0;
  // Fallback checking TypeScript types locally in code: 'any' allows indexing
  const welcomeText = isReturningUser ? (t as any).welcomeBack : (t as any).welcomeNew;

  if (isDataLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-emerald-600 bg-[#FAFAFA] gap-4">
        <CikoMascot size={72} pose="hero" animated={true} />
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  const activeLeagueInfo = getLeagueInfo(userLevel);
  const dailyTip = FINANCIAL_TIPS[new Date().getDate() % FINANCIAL_TIPS.length];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0D1117] font-sans selection:bg-emerald-200/50 overflow-clip relative pb-12 lg:pb-0 lg:flex lg:justify-center lg:items-start lg:h-screen lg:overflow-hidden">

      {/* Desktop Sidebar (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col w-[260px] bg-white border-r border-slate-200 h-full shrink-0 relative z-20 py-8 px-6">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]" onClick={() => { playClick(); setActiveTab('home'); }}>
          <CikoMascot size={40} pose="hero" animated={false} />
          <span className="font-poppins font-black text-2xl text-[#0D1117] tracking-tight uppercase">CIKO</span>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <button onClick={() => { playClick(); setActiveTab('home'); }} className={`flex items-center gap-3.5 px-5 py-3.5 rounded-full font-bold text-sm transition-colors cursor-pointer ${activeTab === 'home' ? 'bg-[#0D1117] text-white' : 'text-slate-600 hover:bg-[#F4F5F7] hover:text-[#0D1117]'}`}>
            <Gamepad2 className="w-5 h-5 shrink-0" /> <span>{language === 'id' ? 'Beranda' : 'Dashboard'}</span>
          </button>
          <button onClick={() => { playClick(); setActiveTab('practice'); }} className={`flex items-center gap-3.5 px-5 py-3.5 rounded-full font-bold text-sm transition-colors cursor-pointer ${activeTab === 'practice' ? 'bg-[#0D1117] text-white' : 'text-slate-600 hover:bg-[#F4F5F7] hover:text-[#0D1117]'}`}>
            <Dumbbell className="w-5 h-5 shrink-0" /> <span>{language === 'id' ? 'Latihan' : 'Practice'}</span>
          </button>
          <button onClick={() => { playClick(); setActiveTab('quests'); }} className={`flex items-center gap-3.5 px-5 py-3.5 rounded-full font-bold text-sm transition-colors cursor-pointer ${activeTab === 'quests' ? 'bg-[#0D1117] text-white' : 'text-slate-600 hover:bg-[#F4F5F7] hover:text-[#0D1117]'}`}>
            <Star className="w-5 h-5 shrink-0" /> <span>{language === 'id' ? 'Misi' : 'Quests'}</span>
          </button>
          <button onClick={() => { playClick(); setActiveTab('arena'); }} className={`flex items-center gap-3.5 px-5 py-3.5 rounded-full font-bold text-sm transition-colors cursor-pointer ${activeTab === 'arena' ? 'bg-[#0D1117] text-white' : 'text-slate-600 hover:bg-[#F4F5F7] hover:text-[#0D1117]'}`}>
            <Swords className="w-5 h-5 shrink-0" /> <span>{language === 'id' ? 'Arena' : 'Arena'}</span>
          </button>
          <button onClick={() => { playClick(); setActiveTab('social'); }} className={`flex items-center gap-3.5 px-5 py-3.5 rounded-full font-bold text-sm transition-colors cursor-pointer ${activeTab === 'social' ? 'bg-[#0D1117] text-white' : 'text-slate-600 hover:bg-[#F4F5F7] hover:text-[#0D1117]'}`}>
            <Users className="w-5 h-5 shrink-0" /> <span>{language === 'id' ? 'Sosial' : 'Social'}</span>
          </button>
          <button onClick={() => { playClick(); setActiveTab('profile'); }} className={`flex items-center gap-3.5 px-5 py-3.5 rounded-full font-bold text-sm transition-colors cursor-pointer ${activeTab === 'profile' ? 'bg-[#0D1117] text-white' : 'text-slate-600 hover:bg-[#F4F5F7] hover:text-[#0D1117]'}`}>
            <UserCircle className="w-5 h-5 shrink-0" /> <span>{language === 'id' ? 'Profil' : 'Profile'}</span>
          </button>
        </nav>

        <div className="mt-auto">
          <button onClick={() => { playClick(); setShowSettings(true); }} className="flex items-center gap-3.5 px-5 py-3.5 rounded-full font-bold text-sm text-slate-600 hover:bg-[#F4F5F7] hover:text-[#0D1117] transition-colors w-full text-left cursor-pointer">
            <Settings className="w-5 h-5 shrink-0" /> <span>{language === 'id' ? 'Pengaturan' : 'Settings'}</span>
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="w-full max-w-xl mx-auto lg:mx-0 lg:h-full lg:overflow-y-auto px-4 sm:px-6 pt-0 pb-8 relative z-10 flex flex-col min-h-screen lg:min-h-0 bg-transparent lg:border-x lg:border-slate-200/70 hide-scrollbar">
        
        {/* ================= HEADER PART ================= */}
        {(activeTab === 'home' || activeTab === 'practice') && (
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="sticky top-0 z-50 flex items-center justify-center mb-4 bg-white px-4 py-3 sm:px-6 border-b border-slate-200 gap-2 sm:gap-4 rounded-none w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] -mx-4 sm:-mx-6"
        >
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 flex-nowrap shrink-0 w-full overflow-x-auto no-scrollbar px-1 sm:px-0">
            {/* Coins Pill */}
            <div className="flex items-center gap-2 bg-[#F4F5F7] px-4 py-2 rounded-full shrink-0">
              <Coins className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />
              <div className="font-poppins font-black text-sm sm:text-base text-[#0D1117] tracking-tight tabular-nums">
                {isDataLoading ? (
                   <span className="w-10 sm:w-14 h-4 bg-slate-200 animate-pulse rounded block"></span>
                ) : (
                   displayCoins.toLocaleString('id-ID')
                )}
              </div>
            </div>

            {/* Streak Pill */}
            <div className="flex items-center gap-2 bg-[#F4F5F7] px-4 py-2 rounded-full shrink-0">
              <Flame className={`w-5 h-5 shrink-0 ${(userData?.streakCount || 0) > 7 ? 'text-cyan-600 fill-cyan-600' : (userData?.streakCount || 0) > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-400'}`} />
              <div className="font-poppins font-black text-sm sm:text-base text-[#0D1117] tracking-tight tabular-nums">
                {isDataLoading ? (
                   <span className="w-6 sm:w-8 h-4 bg-slate-200 animate-pulse rounded block"></span>
                ) : (
                  <span>{userData?.streakCount || 0}</span>
                )}
              </div>
            </div>

            {/* Lives Pill */}
            <div className="flex items-center gap-2 bg-[#F4F5F7] px-4 py-2 rounded-full shrink-0">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500 shrink-0" />
              <div className="font-poppins font-black text-sm sm:text-base text-[#0D1117] tracking-tight tabular-nums">
                {isDataLoading ? (
                   <span className="w-6 sm:w-8 h-4 bg-slate-200 animate-pulse rounded block"></span>
                ) : (
                   <>{userData?.lives !== undefined ? userData.lives : 5}<span className="text-xs text-slate-500 font-bold">/5</span></>
                )}
              </div>
            </div>

            {/* Inbox Button */}
            <button 
              onClick={() => {
                playClick();
                setShowInbox(true);
              }}
              aria-label="Inbox"
              className="p-2.5 bg-[#F4F5F7] hover:bg-slate-200 rounded-full transition-colors relative shrink-0 cursor-pointer"
            >
              <Bell className="w-5 h-5 text-[#0D1117]" />
              {unreadInboxCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
              )}
            </button>
          </div>
        </motion.header>
        )}

        {/* ================= DIRECT DUOLINGO LEARNING PATH ON DASHBOARD ================= */}
        {activeTab === 'home' && (
        <main className="flex-grow flex flex-col items-stretch w-full">
          <CurriculumMap
            embedded={true}
            progress={curriculumProgress}
            onProgressUpdated={handleCurriculumProgressUpdated}
            onStartLesson={(lesson, reviewItemIds) => {
              const isReview = Boolean(reviewItemIds && reviewItemIds.length > 0);
              if (!isReview && currentLives <= 0) {
                triggerToast?.(
                  language === 'id'
                    ? 'Nyawa habis! Tebus nyawa gratis di menu Latihan atau tukar Koin.'
                    : 'Out of hearts! Recover a heart in Practice or use Coins.',
                  'error'
                );
                setActiveTab('practice');
                return;
              }
              setCurriculumUnitFocus(lesson.unitId);
              setActiveCurriculumLesson({ lesson, reviewItemIds });
            }}
            onStartSemesterExam={(examId) =>
              setActiveCurriculumExam({ kind: 'semester', examId })
            }
            onStartSkipExam={(skipExamId) =>
              setActiveCurriculumExam({ kind: 'skip', skipExamId })
            }
            onStartPlacementTest={() => setActiveCurriculumExam({ kind: 'placement' })}
            onOpenGuidebook={(uId) => setGuidebookUnitId(uId)}
            initialUnitFocusId={curriculumUnitFocus}
          />
        </main>
        )}

        {activeTab === 'practice' && (
          <Suspense fallback={<GameLoadingFallback />}>
            <PracticeTab
              user={user}
              userData={userData}
              progress={curriculumProgress}
              onStartReviewLesson={(lesson, reviewItemIds) => {
                setCurriculumUnitFocus(lesson.unitId);
                setActiveCurriculumLesson({ lesson, reviewItemIds });
              }}
              onFlashcardCompleted={async () => {
                await handlePracticeRecovery();
                if (user?.uid) {
                  try {
                    await recordGameSession(user.uid);
                    await rewardUser(user.uid, userData?.leagueGroupId || null, 5, 5);
                  } catch (err) {
                    console.warn('[PracticeTab] Flashcard reward error:', err);
                  }
                }
              }}
              onBuyLifeWithCoins={handleBuyLifeWithCoins}
              onOpenSocial={() => setActiveTab('social')}
            />
          </Suspense>
        )}

        {activeTab === 'quests' && (
          <Suspense fallback={<GameLoadingFallback />}>
            <QuestsTab user={user} userData={userData} triggerToast={triggerToast!} />
          </Suspense>
        )}
        
        {activeTab === 'arena' && (
           <Suspense fallback={<GameLoadingFallback />}><Arena onBack={() => setActiveTab('home')} currentUserUid={user.uid} userData={userData} mode="arena" initialTab="leaderboard" /></Suspense>
        )}
        
        {activeTab === 'social' && (
           <Suspense fallback={<GameLoadingFallback />}><Arena onBack={() => setActiveTab('home')} currentUserUid={user.uid} userData={userData} mode="social" initialTab="friends" triggerToast={triggerToast} /></Suspense>
        )}
        
        {activeTab === 'profile' && (
          <Suspense fallback={<GameLoadingFallback />}>
            <ProfileTab
              user={user}
              userData={userData}
              onShowSettings={() => setShowSettings(true)}
              onLinkGoogle={onLinkGoogle}
              onOpenAuth={onOpenAuth}
              triggerToast={triggerToast}
            />
          </Suspense>
        )}

        <div className="lg:hidden w-full">
          <BottomNavBar activeTab={activeTab} onChangeTab={setActiveTab} />
        </div>
      </div>

      {/* Desktop Right Panel (Ciko League & Quick Modes) */}
      <div className="hidden xl:flex flex-col w-[320px] bg-transparent h-full shrink-0 relative z-20 py-8 px-6 overflow-y-auto hide-scrollbar">
         <div className="bg-white p-6 rounded-3xl sticky top-8 space-y-4">
            <div className="flex items-center gap-3.5">
              <CikoMascot size={54} pose="scholar" animated={false} />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-500">
                  {language === 'id' ? 'Liga Saat Ini' : 'Current League'}
                </p>
                <h3 className="font-poppins font-black text-lg text-[#0D1117] truncate">
                  {language === 'id' ? activeLeagueInfo.nameId : activeLeagueInfo.nameEn}
                </h3>
                <p className="text-xs font-bold text-emerald-700 tabular-nums">
                  {curriculumProgress.completedPathIds.length}/175 Keping Materi · Lv.{accountLevel}
                </p>
              </div>
            </div>

            {!curriculumProgress.placementTest.consumedBySubmit && (
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setActiveCurriculumExam({ kind: 'placement' });
                }}
                className="block w-full bg-[#FEF7E0] hover:bg-amber-100 text-[#8C6D00] rounded-2xl p-3.5 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider">
                    <Target className="w-3.5 h-3.5 shrink-0" />
                    TPB
                  </span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </div>
                <p className="text-xs font-extrabold leading-snug">
                  {language === 'id' ? 'Tes Penempatan Bersama' : 'Joint Placement Test'}
                </p>
              </button>
            )}

            <div className="bg-[#F4F5F7] p-4 rounded-2xl space-y-1">
              <p className="text-xs font-bold text-[#0D1117]">
                {language === 'id' ? dailyTip.title_id : dailyTip.title_en}
              </p>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {language === 'id' ? dailyTip.tip_id : dailyTip.tip_en}
              </p>
            </div>
         </div>
      </div>

      <Suspense fallback={null}>
        <GuidebookModal unitId={guidebookUnitId} onClose={() => setGuidebookUnitId(null)} />
      </Suspense>
      
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} initialTab="guide" />

      {/* League Promotion/Demotion Popup */}
      <AnimatePresence>
        {leaguePopup && (() => {
          const lInfo = getLeagueInfo(leaguePopup.newLeague);
          const isPromoted = leaguePopup.status === 'promoted';
          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D1117]/80" onClick={() => setLeaguePopup(null)}>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-center mb-4">
                  <CikoMascot size={80} pose={isPromoted ? 'wealth' : 'scholar'} animated={true} />
                </div>
                <h2 className={`text-2xl font-poppins font-black mb-2 ${isPromoted ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isPromoted ? (language === 'id' ? 'Naik Liga!' : 'Promoted!') : (language === 'id' ? 'Turun Liga' : 'Demoted')}
                </h2>
                <p className="text-slate-700 font-medium text-sm mb-6 leading-relaxed">
                  {language === 'id' ? `Kamu sekarang berada di ` : `You are now in `} 
                  <strong className="font-black text-[#0D1117]">{language === 'id' ? lInfo.nameId : lInfo.nameEn}</strong>.
                </p>
                <button 
                  onClick={() => { playClick(); setLeaguePopup(null); }}
                  className={`w-full py-3.5 rounded-full font-bold text-sm text-white transition-colors cursor-pointer ${isPromoted ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#0D1117] hover:bg-slate-800'}`}
                >
                  {language === 'id' ? 'Lanjutkan' : 'Continue'}
                </button>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Settings Modal Dialog */}
      {showInbox && <InboxModal onClose={() => setShowInbox(false)} user={user} userData={userData} triggerToast={triggerToast} />}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        isGuest={Boolean(user?.isAnonymous)}
        onLinkGoogle={onLinkGoogle}
        onOpenAuth={onOpenAuth}
        onGuestDeleted={onGuestDeleted}
        onShowTerms={() => {
          setShowSettings(false);
          setShowTermsModal(true);
        }}
        onLogout={!user?.isAnonymous ? () => {
          setShowSettings(false);
          handleLogout();
        } : undefined}
        onShowProfile={() => {
          setShowSettings(false);
          startTransition(() => {
            setActiveTab('profile');
          });
        }}
        onSwitchGoogle={onSwitchGoogle ? handleSwitchGoogleAccount : undefined}
      />

      
      {/* Pending Friend Request Modal */}
      <AnimatePresence>
        {pendingFriendData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-[#0D1117]/80"
              onClick={() => { setPendingFriendData(null); localStorage.removeItem('pendingFriendRequest'); }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="bg-[#0D1117] p-8 flex flex-col items-center justify-center text-center text-white">
                <div className="w-24 h-24 bg-[#F4F5F7] rounded-full flex items-center justify-center mb-4 overflow-hidden">
                  {pendingFriendData.profilePictureUrl || pendingFriendData.profilePicUrl ? (
                    <img src={pendingFriendData.profilePictureUrl || pendingFriendData.profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-slate-400" />
                  )}
                </div>
                <h3 className="text-2xl font-poppins font-black text-white tracking-tight">{pendingFriendData.displayName || pendingFriendData.name}</h3>
                <div className="bg-white/10 px-3 py-1 rounded-full mt-2">
                  <p className="text-slate-300 font-bold text-xs tabular-nums">#{pendingFriendData.tag || '0000'}</p>
                </div>
              </div>
              <div className="p-6 text-center bg-[#F4F5F7]">
                <h4 className="text-lg font-black text-[#0D1117] mb-2">
                  {language === 'id' ? 'Permintaan Berteman' : 'Friend Request'}
                </h4>
                <p className="text-slate-700 font-medium mb-6 text-sm leading-relaxed">
                  {language === 'id' 
                    ? 'Pemain ini mengundangmu untuk berteman. Tambahkan mereka untuk bermain bersama!' 
                    : 'This player invited you to be friends. Add them to play together!'}
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => { setPendingFriendData(null); localStorage.removeItem('pendingFriendRequest'); }}
                    className="flex-1 py-3.5 bg-white hover:bg-slate-200 text-[#0D1117] font-bold text-sm rounded-full transition-colors cursor-pointer"
                  >
                    {language === 'id' ? 'Batal' : 'Cancel'}
                  </button>
                  <button 
                    onClick={handleSendPendingRequest}
                    className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full transition-colors flex justify-center items-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" /> {language === 'id' ? 'Tambah' : 'Add'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Level Up Announcement Overlay Animation */}
      <AnimatePresence>
        {levelUpNotice.show && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1117]/80"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1, transition: { type: 'spring', damping: 18 } }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="flex flex-col items-center">
                <div className="mb-5">
                  <CikoMascot size={88} pose="wealth" animated={true} />
                </div>

                <h1 className="text-3xl font-poppins font-black text-[#0D1117] tracking-tight leading-none mb-2">
                  {t.levelUpTitle}
                </h1>
                
                <p className="text-slate-700 text-sm font-medium mb-6 leading-relaxed">
                  {t.levelUpDesc.replace('{newLevel}', levelUpNotice.newLevel.toString())}
                </p>

                <div className="bg-[#F4F5F7] text-[#0D1117] rounded-2xl px-6 py-4 font-poppins font-black text-xl mb-8 flex items-center gap-3 tabular-nums">
                  <span className="line-through text-slate-400 font-bold text-sm">LV {levelUpNotice.oldLevel}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">LV {levelUpNotice.newLevel}</span>
                </div>

                <button
                  onClick={() => {
                    playClick();
                    setLevelUpNotice({ show: false, oldLevel: 0, newLevel: 0 });
                  }}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full cursor-pointer transition-colors"
                >
                  {language === 'id' ? 'Lanjutkan' : 'Continue'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Toasts */}
      <div className="fixed top-4 right-4 z-[999] flex flex-col gap-2 pointer-events-none">
         <AnimatePresence>
            {toastQueue.slice(0, 3).map((ach, i) => {
               const coins = userData?.totalCoins || userData?.coins || 0;
               const iconStr = ach.icon(coins, userLevel, userData);
               const titleObj = ach.title(coins, userLevel, userData);
               return (
               <motion.div
                  key={ach.id + i}
                  initial={{ opacity: 0, scale: 0.9, x: 40 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 40, transition: { duration: 0.2 } }}
                  className="bg-[#0D1117] text-white shadow-2xl p-4 rounded-2xl flex items-center gap-3 w-72 pointer-events-auto cursor-pointer"
                  onClick={() => { playClick(); setToastQueue(q => q.filter(t => t.id !== ach.id)); setShowAchievements(true); }}
               >
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl shrink-0">
                     {iconStr}
                  </div>
                  <div>
                     <div className="text-xs font-bold text-emerald-400 leading-none mb-1">
                       {language === 'id' ? 'Trofi Terbuka' : 'Trophy Unlocked'}
                     </div>
                     <div className="text-sm font-bold text-white leading-tight">
                       {language === 'id' ? titleObj.id : titleObj.en}
                     </div>
                  </div>
               </motion.div>
            )})}
         </AnimatePresence>
      </div>
    </div>
  );
}
