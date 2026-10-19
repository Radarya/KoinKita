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
  UserCircle
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

// Lazy load heavy game components - each loads only when user opens that game
const UserProfile   = lazy(() => import('./UserProfile'));
const KokiAnggaran = lazy(() => import('./KokiAnggaran'));
const DetektifCuan = lazy(() => import('./DetektifCuan'));
const PohonAset    = lazy(() => import('./PohonAset'));
const FinWordle    = lazy(() => import('./FinWordle'));
const Arena        = lazy(() => import('./Arena'));

import TermsModal from './TermsModal';
import { SettingsModal } from './SettingsModal';
import InboxModal from './InboxModal';
import { TopicSelection } from './TopicSelection';
import { AchievementsModal, ACHIEVEMENTS } from './AchievementsModal';
import { QuestsTab } from './QuestsTab';
import { ProfileTab } from './ProfileTab';
import { BottomNavBar } from './BottomNavBar';
import { CikoMascot } from './CikoMascot';
import { playClick, playWin, setGameViewTrack } from '../lib/audio';
import { useTranslation } from '../lib/LanguageContext';
import { getCurrentWeekId, calculateInitialLeague, getLeagueInfo, getDemotionRank } from '../lib/leagueUtils';

// Fallback spinner untuk lazy-loaded components
const GameLoadingFallback = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
  </div>
);

interface DashboardProps {
  user: any;
  onShowTerms: () => void;
  triggerToast?: (msg: string, type: 'success' | 'warning' | 'error' | 'info') => void;
  /** Called when a guest user "logs out" — keeps Firebase session alive, just navigates back to login choice */
  onGuestLogout?: () => void;
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

export default function Dashboard({ user, onShowTerms, triggerToast, onGuestLogout, onSwitchGoogle }: DashboardProps) {
  const { t, language } = useTranslation();
  const [userData, setUserData] = useState<any>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'quests' | 'arena' | 'social' | 'profile'>('home');
  const [showTopicSelection, setShowTopicSelection] = useState(false);
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

  const [tutorialGameId, setTutorialGameId] = useState<string | null>(null);
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
    import('../lib/audio').then(m => m.setGameViewTrack('dashboard'));
  }, [activeGame]);

  // Weekly League Processing
  useEffect(() => {
    if (!userData || !user?.uid || leagueCheckDone) return;
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

  // Sync firestore user statistics
  useEffect(() => {
    let unsubscribe = () => {};
    let unsubscribeInbox = () => {};
    const fetchUserData = async () => {
      setIsDataLoading(true);
      if (user?.uid) {
        const docRef = doc(db, 'users', user.uid);
        unsubscribe = onSnapshot(docRef, async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const coins = data.totalCoins || data.coins || 0;
            const dbLevel = data.level !== undefined ? data.level : 0;
            const calculated = calculateLevelFromCoins(coins);
            
            if (!data.tag) {
               const newTag = Math.floor(1000 + Math.random() * 9000).toString();
               updateDoc(docRef, { tag: newTag }).catch(console.warn);
               data.tag = newTag;
            }
            setUserData(data);

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
            
            // Daily Streak Tracking
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
                lastActiveDate: todayStr
              }).catch(console.warn);
              data.streakCount = newStreak;
            }

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
    return () => { unsubscribe(); unsubscribeInbox(); };
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
            const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication');
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
          const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication');
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


  
  const userLevel = userData?.league !== undefined ? userData?.league : 0;

  const getLevelName = (lvl: number, lang: 'id' | 'en') => {
    switch (lvl) {
      case 5: return lang === 'id' ? 'Master Kekayaan' : 'Wealth Master';
      case 4: return lang === 'id' ? 'Ahli Anggaran' : 'Budget Expert';
      case 3: return lang === 'id' ? 'Investor Cerdas' : 'Smart Investor';
      case 2: return lang === 'id' ? 'Bijak Belanja' : 'Wise Spender';
      case 1: return lang === 'id' ? 'Sadar Finansial' : 'Financially Aware';
      default: return lang === 'id' ? 'Pemula' : 'Beginner';
    }
  };

  const games = [
    {
      id: "detektif-cuan",
      title: t.detektifCuanTitle,
      description: language === 'id'
        ? 'Saring pesan mencurigakan, kenali modus phishing, dan amankan aset dari penipuan digital.'
        : 'Filter suspicious texts, identify phishing threats, and secure assets from digital scams.',
      icon: <ShieldAlert className="w-6 h-6 text-blue-600" />,
      tag: language === 'id' ? "Keamanan Digital" : "Digital Security",
      unlockLevel: 0
    },
    {
      id: "fin-wordle",
      title: t.tebakKataTitle,
      description: language === 'id'
        ? 'Tebak istilah finansial tersembunyi dengan bantuan petunjuk definisi resmi regulator perbankan.'
        : 'Guess hidden financial terms using clues and official banking regulatory definitions.',
      icon: <MessageSquareText className="w-6 h-6 text-amber-600" />,
      tag: language === 'id' ? "Kamus Istilah" : "Glossary Quiz",
      unlockLevel: 0
    },
    {
      id: "koki-anggaran",
      title: t.kokiAnggaranTitle,
      description: language === 'id'
        ? 'Alokasikan porsi pengeluaran dengan metode 50/30/20 untuk kebutuhan, keinginan, dan tabungan.'
        : 'Allocate spending using the 50/30/20 formula for needs, wants, and emergency savings.',
      icon: <ChefHat className="w-6 h-6 text-emerald-600" />,
      tag: language === 'id' ? "Manajemen Anggaran" : "Budgeting",
      unlockLevel: 2
    },
    {
      id: "pohon-aset",
      title: t.pohonAsetTitle,
      description: language === 'id'
        ? 'Tumbuhkan modal portofolio hingga target 100 juta melalui instrumen aman dan pertumbuhan cepat.'
        : 'Grow your portfolio capital toward 100 million target through balanced safe and growth assets.',
      icon: <Leaf className="w-6 h-6 text-green-600" />,
      tag: language === 'id' ? "Investasi & Portofolio" : "Asset Investment",
      unlockLevel: 3
    }
  ];

  if (showTopicSelection) {
    return <TopicSelection onSelect={(gameId) => {
      const currentLives = userData?.lives !== undefined ? userData.lives : 5;
      if (currentLives <= 0) {
        if (triggerToast) triggerToast(language === 'id' ? 'Nyawa habis! Tunggu besok atau minta ke teman.' : 'Out of lives! Wait tomorrow or ask a friend.', 'error');
        return;
      }
      startTransition(() => {
        setShowTopicSelection(false); 
        setActiveGame(gameId); 
      });
    }} onBack={() => startTransition(() => setShowTopicSelection(false))} userLevel={userLevel} />;
  }

  

  if (activeGame === 'koki-anggaran') {
    return <Suspense fallback={<GameLoadingFallback />}><KokiAnggaran user={user} userData={userData} onBack={() => startTransition(() => setActiveGame(null))} /></Suspense>;
  }

  if (activeGame === 'detektif-cuan') {
    return <Suspense fallback={<GameLoadingFallback />}><DetektifCuan user={user} userData={userData} onBack={() => startTransition(() => setActiveGame(null))} /></Suspense>;
  }
  
  if (activeGame === 'pohon-aset') {
    return <Suspense fallback={<GameLoadingFallback />}><PohonAset user={user} userData={userData} onBack={() => startTransition(() => setActiveGame(null))} /></Suspense>;
  }
  
  if (activeGame === 'fin-wordle') {
    return <Suspense fallback={<GameLoadingFallback />}><FinWordle user={user} userData={userData} onBack={() => startTransition(() => setActiveGame(null))} /></Suspense>;
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
      <div className="min-h-screen flex items-center justify-center p-6 text-emerald-600 bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200/50 overflow-clip relative pb-16 lg:pb-0 lg:flex lg:justify-center lg:items-start lg:h-screen lg:overflow-hidden">
      {/* Desktop Sidebar (Hidden on mobile) */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-white border-r border-slate-200 h-full shrink-0 relative z-20 py-8 px-6">
        <div 
          className="flex items-center gap-3 mb-10 px-2 cursor-pointer transition-transform active:scale-95" 
          onClick={() => { playClick(); setActiveTab('home'); }}
        >
          <CikoMascot size={36} />
          <span className="text-2xl font-black text-slate-900 tracking-tight">CIKO</span>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <button 
            onClick={() => { playClick(); setActiveTab('home'); }} 
            className={`flex items-center gap-3.5 px-4 py-3 rounded-full font-bold transition-colors cursor-pointer text-sm ${activeTab === 'home' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Gamepad2 className="w-5 h-5 shrink-0" />
            <span>{language === 'id' ? 'Beranda Belajar' : 'Learning Hub'}</span>
          </button>
          <button 
            onClick={() => { playClick(); setActiveTab('quests'); }} 
            className={`flex items-center gap-3.5 px-4 py-3 rounded-full font-bold transition-colors cursor-pointer text-sm ${activeTab === 'quests' ? 'bg-indigo-50 text-indigo-800' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Star className="w-5 h-5 shrink-0" />
            <span>{language === 'id' ? 'Misi Harian' : 'Daily Quests'}</span>
          </button>
          <button 
            onClick={() => { playClick(); setActiveTab('arena'); }} 
            className={`flex items-center gap-3.5 px-4 py-3 rounded-full font-bold transition-colors cursor-pointer text-sm ${activeTab === 'arena' ? 'bg-rose-50 text-rose-800' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Swords className="w-5 h-5 shrink-0" />
            <span>{language === 'id' ? 'Arena Liga' : 'League Arena'}</span>
          </button>
          <button 
            onClick={() => { playClick(); setActiveTab('social'); }} 
            className={`flex items-center gap-3.5 px-4 py-3 rounded-full font-bold transition-colors cursor-pointer text-sm ${activeTab === 'social' ? 'bg-sky-50 text-sky-800' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Users className="w-5 h-5 shrink-0" />
            <span>{language === 'id' ? 'Klub & Sosial' : 'Social & Clubs'}</span>
          </button>
          <button 
            onClick={() => { playClick(); setActiveTab('profile'); }} 
            className={`flex items-center gap-3.5 px-4 py-3 rounded-full font-bold transition-colors cursor-pointer text-sm ${activeTab === 'profile' ? 'bg-amber-50 text-amber-800' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <UserCircle className="w-5 h-5 shrink-0" />
            <span>{language === 'id' ? 'Profil Pengguna' : 'User Profile'}</span>
          </button>
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-100">
          <button 
            onClick={() => { playClick(); setShowSettings(true); }} 
            className="flex items-center gap-3.5 px-4 py-3 rounded-full font-bold text-slate-600 hover:bg-slate-100 transition-colors w-full text-left cursor-pointer text-sm"
          >
            <Settings className="w-5 h-5 shrink-0" />
            <span>{language === 'id' ? 'Pengaturan' : 'Settings'}</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <div className="w-full max-w-2xl mx-auto lg:mx-0 lg:h-full lg:overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10 flex flex-col min-h-screen lg:min-h-0 bg-transparent lg:border-x lg:border-slate-200 hide-scrollbar">
        
        {/* ================= HEADER STATUS BAR ================= */}
        {activeTab === 'home' && (
        <header className="sticky top-0 z-40 flex items-center justify-between mb-6 bg-white px-4 py-3 sm:px-6 border-b border-slate-200 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] -mx-4 sm:-mx-6 -mt-6 sm:-mt-8">
          {/* Level Pill */}
          <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3.5 py-1.5 border border-slate-200/80 shrink-0">
            <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-xs font-bold text-slate-800 tracking-tight">
              {getLevelName(userLevel, language)}
            </span>
          </div>
          
          {/* Metrics Pill Group */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Coins */}
            <div className="flex items-center gap-1.5 bg-slate-100 rounded-full px-3 py-1.5 border border-slate-200/80 shrink-0">
              <Coins className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
              <span className="font-bold text-xs sm:text-sm text-slate-900 tabular-nums">
                {isDataLoading ? '...' : displayCoins.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1.5 bg-slate-100 rounded-full px-3 py-1.5 border border-slate-200/80 shrink-0">
              <Flame className={`w-4 h-4 shrink-0 ${(userData?.streakCount || 0) > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-400'}`} />
              <span className="font-bold text-xs sm:text-sm text-slate-900 tabular-nums">
                {userData?.streakCount || 0}
              </span>
            </div>

            {/* Lives */}
            <div className="flex items-center gap-1.5 bg-slate-100 rounded-full px-3 py-1.5 border border-slate-200/80 shrink-0">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
              <span className="font-bold text-xs sm:text-sm text-slate-900 tabular-nums">
                {userData?.lives !== undefined ? userData.lives : 5}/5
              </span>
            </div>

            {/* Inbox */}
            <button 
              onClick={() => {
                playClick();
                setShowInbox(true);
              }}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors relative shrink-0 cursor-pointer text-slate-700"
              aria-label="Pemberitahuan"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadInboxCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white"></span>
              )}
            </button>
          </div>
        </header>
        )}

        {/* ================= BERANDA BELAJAR (MAIN GAME HUB) ================= */}
        {activeTab === 'home' && (
        <main className="flex-grow flex flex-col w-full pb-8">
          {/* Welcome Banner with Ciko Mascot */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center sm:text-left">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-3">
                {language === 'id' ? 'Beranda Belajar' : 'Learning Hub'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {language === 'id' ? `Halo, ${displayName}` : `Hello, ${displayName}`}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed max-w-md">
                {language === 'id'
                  ? 'Pilih modul simulasi di bawah untuk mengasah literasi dan ketangkasan finansialmu.'
                  : 'Choose a simulation module below to strengthen your financial skills and habits.'}
              </p>
              
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-5 text-xs text-slate-500 font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{language === 'id' ? '4 Modul Simulasi' : '4 Simulation Modules'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>{language === 'id' ? `${displayCoins.toLocaleString('id-ID')} Koin Terkumpul` : `${displayCoins.toLocaleString('id-ID')} Coins Earned`}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-center p-2 bg-slate-50 rounded-2xl border border-slate-100">
              <CikoMascot size={86} />
            </div>
          </div>

          {/* Section Heading */}
          <div className="mb-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {language === 'id' ? 'Modul Simulasi Keuangan' : 'Financial Simulation Modules'}
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              {language === 'id'
                ? 'Selesaikan setiap skenario untuk mengumpulkan koin dan menaikkan peringkat liga.'
                : 'Complete each scenario to earn coins and climb the league rankings.'}
            </p>
          </div>

          {/* Game Modules List */}
          <div className="grid grid-cols-1 gap-4">
            {games.map((game) => {
              const isLocked = userLevel < game.unlockLevel;
              return (
                <div 
                  key={game.id}
                  className={`bg-white rounded-3xl p-5 sm:p-6 border transition-colors ${isLocked ? 'border-slate-200 bg-slate-50/70 opacity-90' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`p-3 rounded-2xl shrink-0 ${isLocked ? 'bg-slate-200 text-slate-500' : 'bg-slate-100'}`}>
                        {isLocked ? <Lock className="w-6 h-6 text-slate-400" /> : game.icon}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                          {game.tag}
                        </span>
                        <h4 className={`text-lg font-black tracking-tight ${isLocked ? 'text-slate-500' : 'text-slate-900'}`}>
                          {game.title}
                        </h4>
                      </div>
                    </div>

                    {isLocked && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-200 text-slate-600 shrink-0">
                        {language === 'id' ? `Buka di Liga ${game.unlockLevel}` : `Unlocks at League ${game.unlockLevel}`}
                      </span>
                    )}
                  </div>

                  <p className={`text-sm mt-3 leading-relaxed ${isLocked ? 'text-slate-400' : 'text-slate-600'}`}>
                    {game.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-500">
                      {isLocked 
                        ? (language === 'id' ? 'Selesaikan misi arena untuk membuka liga berikutnya' : 'Complete arena challenges to unlock next league')
                        : (language === 'id' ? 'Biaya main: 1 Nyawa' : 'Cost: 1 Heart')
                      }
                    </div>

                    {isLocked ? (
                      <button
                        disabled
                        className="px-5 py-2 rounded-full font-bold text-xs bg-slate-100 text-slate-400 cursor-not-allowed"
                      >
                        {language === 'id' ? 'Terkunci' : 'Locked'}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          playClick();
                          setTutorialGameId(game.id);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                      >
                        <span>{language === 'id' ? 'Mulai Modul' : 'Start Module'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
        )}

        {activeTab === 'quests' && (
           <QuestsTab user={user} userData={userData} triggerToast={triggerToast!} />
        )}
        
        {activeTab === 'arena' && (
           <Suspense fallback={<GameLoadingFallback />}><Arena onBack={() => setActiveTab('home')} currentUserUid={user.uid} userData={userData} mode="arena" initialTab="leaderboard" /></Suspense>
        )}
        
        {activeTab === 'social' && (
           <Suspense fallback={<GameLoadingFallback />}><Arena onBack={() => setActiveTab('home')} currentUserUid={user.uid} userData={userData} mode="social" initialTab="friends" triggerToast={triggerToast} /></Suspense>
        )}
        
        {activeTab === 'profile' && (
           <ProfileTab user={user} userData={userData} onShowSettings={() => setShowSettings(true)} triggerToast={triggerToast} />
        )}

        <div className="lg:hidden w-full">
          <BottomNavBar activeTab={activeTab} onChangeTab={setActiveTab} />
        </div>
      </div>

      {/* Desktop Right Panel (CIKO Financial Habit & Stats) */}
      <aside className="hidden xl:flex flex-col w-[320px] bg-slate-50 h-full shrink-0 relative z-20 py-8 px-6 overflow-y-auto hide-scrollbar border-l border-slate-200">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 sticky top-8 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <CikoMascot size={40} />
            <div>
              <h4 className="font-black text-slate-900 text-base leading-tight">
                {language === 'id' ? 'Tips CIKOSmart' : 'CIKOSmart Tips'}
              </h4>
              <span className="text-xs text-slate-500 font-medium">
                {language === 'id' ? 'Kebiasaan Finansial Hari Ini' : 'Financial Habit of the Day'}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {language === 'id'
              ? 'Terapkan aturan 24 jam sebelum membeli barang non-esensial untuk menyaring antara kebutuhan nyata dan keinginan sesaat.'
              : 'Apply the 24-hour rule before purchasing non-essential items to distinguish true needs from impulse wants.'}
          </p>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>{language === 'id' ? 'Pemulihan Nyawa' : 'Heart Refill'}</span>
              <span className="text-slate-900 tabular-nums">24 Jam</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>{language === 'id' ? 'Peringkat Liga' : 'League Tier'}</span>
              <span className="text-emerald-700 font-extrabold">{getLevelName(userLevel, language)}</span>
            </div>
          </div>
        </div>
      </aside>
      
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />

      {/* League Promotion/Demotion Popup */}
      <AnimatePresence>
        {leaguePopup && (() => {
          const lInfo = getLeagueInfo(leaguePopup.newLeague);
          const isPromoted = leaguePopup.status === 'promoted';
          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80" onClick={() => setLeaguePopup(null)}>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl p-8 max-w-sm w-full text-center border border-slate-200"
                onClick={e => e.stopPropagation()}
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className={`w-8 h-8 ${isPromoted ? 'text-emerald-600' : 'text-slate-500'}`} />
                </div>
                <h2 className={`text-2xl font-black mb-2 tracking-tight ${isPromoted ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {isPromoted ? (language === 'id' ? 'Naik Liga' : 'Promoted') : (language === 'id' ? 'Turun Liga' : 'Demoted')}
                </h2>
                <p className="text-slate-600 text-sm font-medium mb-6 leading-relaxed">
                  {language === 'id' ? 'Kamu sekarang berada di liga ' : 'You are now in '} 
                  <strong className="font-black text-slate-900">{language === 'id' ? lInfo.nameId : lInfo.nameEn}</strong>.
                </p>
                <button 
                  onClick={() => { playClick(); setLeaguePopup(null); }}
                  className="w-full py-3 rounded-full font-bold text-white transition-colors cursor-pointer bg-slate-900 hover:bg-slate-800 text-sm"
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
              className="absolute inset-0 bg-slate-900/80 "
              onClick={() => { setPendingFriendData(null); localStorage.removeItem('pendingFriendRequest'); }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full "></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white opacity-10 rounded-full "></div>
                
                <div className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 overflow-hidden border-4 border-white">
                  {pendingFriendData.profilePictureUrl || pendingFriendData.profilePicUrl ? (
                    <img src={pendingFriendData.profilePictureUrl || pendingFriendData.profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-slate-300" />
                  )}
                </div>
                <h3 className="relative z-10 text-2xl font-black text-white tracking-tight">{pendingFriendData.displayName || pendingFriendData.name}</h3>
                <div className="relative z-10 bg-black/10 px-3 py-1 rounded-full mt-2">
                  <p className="text-white font-bold text-sm tracking-widest">#{pendingFriendData.tag || '0000'}</p>
                </div>
              </div>
              <div className="p-6 text-center bg-slate-50">
                <h4 className="text-lg font-black text-slate-800 mb-2">
                  {language === 'id' ? 'Permintaan Berteman' : 'Friend Request'}
                </h4>
                <p className="text-slate-600 font-medium mb-6 text-sm">
                  {language === 'id' 
                    ? 'Pemain ini mengundangmu untuk berteman. Tambahkan mereka untuk bermain bersama!' 
                    : 'This player invited you to be friends. Add them to play together!'}
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => { setPendingFriendData(null); localStorage.removeItem('pendingFriendRequest'); }}
                    className="flex-1 py-3 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-colors active:scale-95"
                  >
                    {language === 'id' ? 'Batal' : 'Cancel'}
                  </button>
                  <button 
                    onClick={handleSendPendingRequest}
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex justify-center items-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" /> {language === 'id' ? 'Tambah' : 'Add'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pre-Game Tutorial Modal */}
      <AnimatePresence>
        {tutorialGameId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 "
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full border border-slate-200 overflow-hidden relative"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {tutorialGameId === 'detektif-cuan' && (language === 'id' ? 'Panduan Detektif Cuan' : 'How to Play Detektif Cuan')}
                  {tutorialGameId === 'koki-anggaran' && (language === 'id' ? 'Panduan Koki Anggaran' : 'How to Play Budget Chef')}
                  {tutorialGameId === 'pohon-aset' && (language === 'id' ? 'Panduan Pohon Aset' : 'How to Play Asset Tree')}
                  {tutorialGameId === 'fin-wordle' && (language === 'id' ? 'Panduan Tebak Kata' : 'How to Play Guess Terms')}
                </h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">
                  {language === 'id' ? 'Petunjuk Modul' : 'Module Briefing'}
                </p>
              </div>

              {/* Description Body */}
              <div className="space-y-4 mb-6 text-left text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-5 rounded-2xl border border-slate-100 max-h-[360px] overflow-y-auto">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">
                    {language === 'id' ? 'Misi Kamu:' : 'Your Mission:'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tutorialGameId === 'detektif-cuan' && (language === 'id' 
                      ? 'Warga butuh bantuanmu menyaring SMS / Aplikasi mencurigakan. Tentukan setiap pesan penawaran itu AMAN atau BAHAYA (Scam/Phishing).'
                      : 'Help citizens filter fake draws and dangerous APK text. Decide if each message is SAFE or THREAT.')}
                    {tutorialGameId === 'koki-anggaran' && (language === 'id' 
                      ? 'Kelola porsi keuangan dengan metode 50/30/20! Geser/klik panci yang pas untuk menyortir pengeluaran: KEBUTUHAN (50%), KEINGINAN (30%), atau TABUNGAN (20%). Hindari pinjol ilegal dan penipuan.'
                      : 'Sort transactions based on the 50/30/20 rule: Needs (50%), Wants (30%), or Savings (20%). Drag scams or illegal loans to the bin.')}
                    {tutorialGameId === 'pohon-aset' && (language === 'id' 
                      ? 'Targetkan pertumbuhan modal mencapai Rp 100.000.000 dalam batas waktu 60 detik. Tempatkan instrumen pada cabang Pertumbuhan Cepat atau cabang Aman & Stabil.'
                      : 'Grow your seed capital to Rp 100,000,000 within 60 seconds. Plant assets onto fast growth or safe branches.')}
                    {tutorialGameId === 'fin-wordle' && (language === 'id' 
                      ? 'Tebak istilah keuangan rahasia dari petunjuk definisi akurat yang tersedia.'
                      : 'Guess the secret financial vocabulary terms based on defined outlines.')}
                  </p>
                </div>

                <div className="border-t border-slate-200/80 pt-3">
                  <h4 className="font-bold text-rose-600 text-xs uppercase tracking-wider mb-1">
                    {language === 'id' ? 'Aturan & Konsekuensi:' : 'Rules & Caution:'}
                  </h4>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                    {tutorialGameId === 'detektif-cuan' && (language === 'id' 
                      ? 'Memilih "AMAN" pada pesan penipuan memotong -25 Koin dan 1 Nyawa. Waktu berpikir makin ketat seiring tingginya level.'
                      : 'Choosing SAFE on a scam costs -25 Coins and 1 Heart. The timer tightens with account level.')}
                    {tutorialGameId === 'koki-anggaran' && (language === 'id' 
                      ? 'Keadaan darurat acak dapat terjadi di tengah permainan. Jika tabungan kosong, penalti koin dan nyawa akan berlaku.'
                      : 'Emergencies strike mid-game. Lacking savings triggers direct coin and heart penalties.')}
                    {tutorialGameId === 'pohon-aset' && (language === 'id' 
                      ? 'Koreksi pasar mendadak dapat mengurangi akumulasi portofolio. Hindari penempatan modal berlebih pada aset spekulatif.'
                      : 'Sudden market corrections can lower accumulated portfolio value. Diversify between safe and fast assets.')}
                    {tutorialGameId === 'fin-wordle' && (language === 'id' 
                      ? 'Jawab secepat mungkin dengan kesalahan seminimal mungkin untuk mendapatkan skor maksimal.'
                      : 'Answer swiftly with minimal mistakes to lock maximum score.')}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    playClick();
                    setTutorialGameId(null);
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-full cursor-pointer transition-colors"
                >
                  {language === 'id' ? 'Batal' : 'Cancel'}
                </button>
                <button
                  onClick={() => {
                    playClick();
                    const currentLives = userData?.lives !== undefined ? userData.lives : 5;
                    if (currentLives <= 0) {
                      if (triggerToast) triggerToast(language === 'id' ? 'Nyawa habis! Tunggu besok atau minta ke teman.' : 'Out of lives! Wait tomorrow or ask a friend.', 'error');
                      return;
                    }
                    const target = tutorialGameId;
                    setTutorialGameId(null);
                    startTransition(() => {
                      setActiveGame(target);
                    });
                    // DAILY QUEST TRACKING
                    const today = new Date().toISOString().split('T')[0];
                    if (user?.uid) {
                      const docRef = doc(db, 'users', user.uid);
                      updateDoc(docRef, {
                        [`dailyStats.${today}.gamesPlayed`]: increment(1)
                      }).catch(console.warn);
                    }
                  }}
                  className="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full cursor-pointer transition-colors"
                >
                  {language === 'id' ? 'Mulai Bermain' : 'Start Game'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Announcement Overlay Animation */}
      <AnimatePresence>
        {levelUpNotice.show && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center border border-slate-200 relative overflow-hidden"
            >
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-50 rounded-full mb-5 flex items-center justify-center border border-amber-200">
                  <Trophy className="w-8 h-8 text-amber-500" />
                </div>

                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-2">
                  {t.levelUpTitle}
                </h1>
                
                <p className="text-slate-600 text-sm font-medium mb-6 leading-relaxed">
                  {t.levelUpDesc.replace('{newLevel}', levelUpNotice.newLevel.toString())}
                </p>

                <div className="bg-slate-100 rounded-full px-6 py-2.5 border border-slate-200 text-slate-900 font-bold text-base mb-6 flex items-center gap-3">
                  <span className="line-through text-slate-400 font-medium text-sm">LV {levelUpNotice.oldLevel}</span>
                  <span className="text-emerald-700 font-extrabold">Level {levelUpNotice.newLevel}</span>
                </div>

                <button
                  onClick={() => {
                    playClick();
                    setLevelUpNotice({ show: false, oldLevel: 0, newLevel: 0 });
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full transition-colors cursor-pointer"
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
                  initial={{ opacity: 0, scale: 0.8, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 50, transition: { duration: 0.2 } }}
                  className="bg-white/95  border border-amber-200/60 shadow-xl shadow-amber-500/10 p-3 rounded-2xl flex items-center gap-3 w-72 pointer-events-auto cursor-pointer"
                  onClick={() => { playClick(); setToastQueue(q => q.filter(t => t.id !== ach.id)); setShowAchievements(true); }}
               >
                  <div className="w-10 h-10 bg-gradient-to-tr from-amber-100 to-amber-200 rounded-xl flex items-center justify-center text-xl shadow-inner shrink-0">
                     {iconStr}
                  </div>
                  <div>
                     <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none mb-0.5">
                       {language === 'id' ? 'Trofi Terbuka!' : 'Trophy Unlocked!'}
                     </div>
                     <div className="text-sm font-bold text-slate-800 leading-tight">
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
