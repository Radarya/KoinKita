import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  ChefHat, 
  Leaf, 
  MessageSquareText, 
  LogOut, 
  FileText,
  Coins,
  Trophy,
  Users,
  User,
  UserPlus,
  Settings,
  Sparkles,
  Gamepad2,
  ChevronRight,
  Loader2,
  Medal,
  Heart,
  Bell,
  Gift,
  Share2
} from 'lucide-react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { 
  collection, query, where, getDocs, doc, 
  onSnapshot, 
  updateDoc,
  setDoc,
  increment,
  arrayUnion
} from 'firebase/firestore';
import UserProfile from './UserProfile';
import KokiAnggaran from './KokiAnggaran';
import DetektifCuan from './DetektifCuan';
import PohonAset from './PohonAset';
import FinWordle from './FinWordle';
import TermsModal from './TermsModal';
import Arena from './Arena';
import { SettingsModal } from './SettingsModal';
import InboxModal from './InboxModal';
import { DailyQuestsModal } from './DailyQuestsModal';
import { TopicSelection } from './TopicSelection';
import { AchievementsModal, ACHIEVEMENTS } from './AchievementsModal';
import { playClick, playWin, setGameViewTrack } from '../lib/audio';
import { useTranslation } from '../lib/LanguageContext';
import { FINANCIAL_TIPS } from '../lib/tips';
import { getCurrentWeekId, calculateInitialLeague, getLeagueInfo } from '../lib/leagueUtils';

interface DashboardProps {
  user: any;
  onShowTerms: () => void;
  triggerToast?: (msg: string, type: 'success' | 'warning' | 'error' | 'info') => void;
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

export default function Dashboard({ user, onShowTerms, triggerToast }: DashboardProps) {
  const { t, language } = useTranslation();
  const [userData, setUserData] = useState<any>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leagueCheckDone, setLeagueCheckDone] = useState(false);

  const [pendingFriendData, setPendingFriendData] = useState<any | null>(null);
  const [unreadInboxCount, setUnreadInboxCount] = useState(0);
  const [leaguePopup, setLeaguePopup] = useState<{status: string, newLeague: number} | null>(null);

  useEffect(() => {
    const checkPendingFriend = async () => {
      const pendingUid = localStorage.getItem('pendingFriendRequest');
      if (pendingUid && user) {
        if (pendingUid === user.uid) {
           localStorage.removeItem('pendingFriendRequest');
           return;
        }
        try {
          const { doc, getDoc } = await import('firebase/firestore');
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
  }, [user]);

  const handleSendPendingRequest = async () => {
    if (!pendingFriendData) return;
    try {
      const { collection, addDoc } = await import('firebase/firestore');
      await addDoc(collection(db, 'inbox'), {
        userId: pendingFriendData.id,
        type: 'friend_request',
        fromUserId: user.uid,
        fromUserName: userData?.displayName || userData?.name || 'Player',
        status: 'unread',
        createdAt: Date.now()
      });
      if (triggerToast) triggerToast(language === 'id' ? 'Permintaan pertemanan dikirim!' : 'Friend request sent!', 'success');
    } catch(e) {
      if (triggerToast) triggerToast(language === 'id' ? 'Gagal mengirim permintaan' : 'Failed to send request', 'error');
    } finally {
      setPendingFriendData(null);
      localStorage.removeItem('pendingFriendRequest');
    }
  };

  const [showSocial, setShowSocial] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  // Settings & Level state triggers
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showDailyQuests, setShowDailyQuests] = useState(false);
  const [showTopicSelection, setShowTopicSelection] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
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
    
    const processLeague = async () => {
      try {
        const currentWeekId = getCurrentWeekId();
        let userLeague = userData.league;
        
        // Initialize league if undefined
        if (userLeague === undefined) {
          userLeague = calculateInitialLeague(userData.totalXp || 0);
          await updateDoc(doc(db, 'users', user.uid), { league: userLeague });
        }
        
        // If week has changed
        if (userData.currentWeekId !== currentWeekId) {
          let newLeague = userLeague;
          let status = 'stayed';
          let oldRank = null;
          
          // Check previous group standings if exists
          if (userData.leagueGroupId) {
            const oldGroupRef = doc(db, 'league_groups', userData.leagueGroupId);
            const { getDoc } = await import('firebase/firestore');
            const oldGroupSnap = await getDoc(oldGroupRef);
            
            if (oldGroupSnap.exists()) {
              const oldGroupData = oldGroupSnap.data();
              const playersObj = oldGroupData.players || {};
              // Convert to array and sort by XP
              const playersArr = Object.entries(playersObj).map(([uid, data]: [string, any]) => ({ uid, xp: data.xp || 0 }));
              playersArr.sort((a, b) => b.xp - a.xp);
              
              const myIndex = playersArr.findIndex(p => p.uid === user.uid);
              if (myIndex !== -1) {
                oldRank = myIndex + 1;
                if (oldRank <= 5) {
                  newLeague = Math.min(5, newLeague + 1);
                  status = 'promoted';
                } else if (oldRank >= 25) {
                  newLeague = Math.max(0, newLeague - 1);
                  status = 'demoted';
                }
                
                // Send inbox message about promotion/demotion
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
            }
          }
          
          // Find or create new group for current week
          
          const groupsRef = collection(db, 'league_groups');
          const q = query(groupsRef, where('weekId', '==', currentWeekId));
          const snap = await getDocs(q);
          
          let newGroupId = '';
          const playerEntry = { xp: 0, displayName: userData.displayName || userData.name || 'Pemain', photoUrl: userData.profilePictureUrl || userData.profilePicUrl || '' };
          
          const groupDoc = snap.docs.find(d => d.data().league === newLeague && d.data().playerCount < 30);
          if (groupDoc) {
            newGroupId = groupDoc.id;
            await updateDoc(doc(db, 'league_groups', newGroupId), {
              playerCount: increment(1),
              [`players.${user.uid}`]: playerEntry
            });
          } else {
            const newGroupRef = doc(groupsRef);
            newGroupId = newGroupRef.id;
            await setDoc(newGroupRef, {
              weekId: currentWeekId,
              league: newLeague,
              playerCount: 1,
              players: {
                [user.uid]: playerEntry
              },
              createdAt: Date.now()
            });
          }
          
          // Update user doc
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
        }
      } catch (error) {
        if ((error as any).code === 'permission-denied') {
          console.warn("Permission denied for league processing. Please update Firestore rules.");
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
            
            // Level-up condition trigger check

            // Process Referral
            const refTag = localStorage.getItem('referralTag');
            if (refTag && refTag !== data.tag) {
               localStorage.removeItem('referralTag');
               const processReferral = async () => {
                 try {
                   const usersRef = collection(db, 'users');
                   const q = query(usersRef, where('tag', '==', refTag));
                   const snap = await getDocs(q);
                   if (!snap.empty) {
                     const friendDoc = snap.docs[0];
                     const friendId = friendDoc.id;
                     
                     // Check if already friends
                     const friendsList = data.friends || [];
                     if (!friendsList.includes(friendId)) {
                        // Add Friend directly or send request
                        // Let's just add them as friends mutually
                        await updateDoc(docRef, { friends: arrayUnion(friendId) });
                        await updateDoc(doc(db, 'users', friendId), { friends: arrayUnion(user.uid) });
                        
                        // Give both 50 coins as affiliate reward if it's a new user
                        // We can check if calculated level == 0 or totalCoins < 100 to guess if they are new.
                        // Let's just give it unconditionally as a referral bonus once per connection.
                        // Wait, it could be farmed. Better to just give 50 coins if the current user has < 50 coins.
                        if (coins <= 50) {
                            await updateDoc(docRef, { 
                               totalCoins: coins + 100, 
                               coins: coins + 100 
                            });
                            const friendData = friendDoc.data();
                            const fCoins = friendData.totalCoins || friendData.coins || 0;
                            await updateDoc(doc(db, 'users', friendId), {
                               totalCoins: fCoins + 100,
                               coins: fCoins + 100
                            });
                            if (triggerToast) triggerToast(language === 'id' ? 'Bonus afiliasi! +100 Koin' : 'Affiliate bonus! +100 Coins', 'success');
                        } else {
                            if (triggerToast) triggerToast(language === 'id' ? 'Teman ditambahkan dari link!' : 'Friend added from link!', 'success');
                        }
                     }
                   }
                 } catch (e) {
                   console.warn("Referral processing error", e);
                 }
               };
               processReferral();
            }

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
      if (triggerToast) {
        triggerToast(language === 'id' ? 'Berhasil keluar. Sampai jumpa!' : 'Successfully logged out. See you!', 'info');
      }
      await signOut(auth);
    } catch (error) {
      console.warn("Logout error:", error);
    }
  };

  
  const userLevel = userData?.league !== undefined ? userData?.league : 0;

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

  const games = [
    {
      id: "detektif-cuan",
      title: t.detektifCuanTitle,
      description: t.detektifCuanDesc,
      icon: <ShieldAlert className="w-10 h-10 text-blue-500 mb-4" />,
      color: "hover:border-blue-400 hover:shadow-blue-500/20 hover:text-blue-600",
      active: true,
      badge: language === 'id' ? "Investasi" : "Finance IQ",
      unlockLevel: 0
    },
    {
      id: "koki-anggaran",
      title: t.kokiAnggaranTitle,
      description: t.kokiAnggaranDesc,
      icon: <ChefHat className="w-10 h-10 text-slate-400 mb-4" />,
      color: "hover:border-emerald-400 hover:shadow-emerald-500/20 hover:text-emerald-600",
      active: true,
      badge: language === 'id' ? "Anggaran" : "Budgeting",
      unlockLevel: 2
    },
    {
      id: "pohon-aset",
      title: t.pohonAsetTitle,
      description: t.pohonAsetDesc,
      icon: <Leaf className="w-10 h-10 text-green-600 mb-4" />,
      color: "hover:border-green-600 hover:shadow-green-600/20 hover:text-green-700",
      active: true,
      badge: language === 'id' ? "Pasif Income" : "Assets Plan",
      unlockLevel: 3
    },
    {
      id: "fin-wordle",
      title: t.tebakKataTitle,
      description: t.tebakKataDesc,
      icon: <MessageSquareText className="w-10 h-10 text-amber-500 mb-4" />,
      color: "hover:border-amber-400 hover:shadow-amber-500/20 hover:text-amber-600",
      active: true,
      badge: language === 'id' ? "Kuis Istilah" : "Quiz Game",
      unlockLevel: 0
    }
  ];

  if (showProfile) {
    return <UserProfile user={user} userData={userData} onBack={() => setShowProfile(false)} />;
  }

  if (showTopicSelection) {
    return <TopicSelection onSelect={(gameId) => {
      const currentLives = userData?.lives !== undefined ? userData.lives : 5;
      if (currentLives <= 0) {
        if (triggerToast) triggerToast(language === 'id' ? 'Nyawa habis! Tunggu besok atau minta ke teman.' : 'Out of lives! Wait tomorrow or ask a friend.', 'error');
        return;
      }
      setShowTopicSelection(false); 
      setActiveGame(gameId); 
    }} onBack={() => setShowTopicSelection(false)} userLevel={userLevel} />;
  }

  

  if (activeGame === 'koki-anggaran') {
    return <KokiAnggaran user={user} userData={userData} onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'detektif-cuan') {
    return <DetektifCuan user={user} userData={userData} onBack={() => setActiveGame(null)} />;
  }
  
  if (activeGame === 'pohon-aset') {
    return <PohonAset user={user} userData={userData} onBack={() => setActiveGame(null)} />;
  }
  
  if (activeGame === 'fin-wordle') {
    return <FinWordle user={user} userData={userData} onBack={() => setActiveGame(null)} />;
  }

  const displayName = userData?.name || userData?.fullName || user?.displayName || 'Pemain';
  const displayCoins = userData?.totalCoins || userData?.coins || 0;
  const displayPic = (userData?.profilePictureUrl === null || userData?.profilePictureUrl === '' || userData?.profilePicUrl === null || userData?.profilePicUrl === '') 
    ? '' 
    : (userData?.profilePictureUrl || userData?.profilePicUrl || user?.photoURL || '');
  
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-200/50 overflow-x-hidden relative pb-12">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Glow Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200/30 rounded-full "></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-amber-200/30 rounded-full "></div>
        
        {/* Cyber Grid Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] opacity-40"></div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10 flex flex-col min-h-screen">
        
        {/* ================= HEADER PART ================= */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 sm:mb-12 bg-white/95  p-6 rounded-[2rem] border border-slate-200 shadow-sm gap-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50/50 rounded-full  pointer-events-none -mr-12 -mt-12"></div>
          
          {/* User Profile Info on Left */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              playClick();
              setShowProfile(true);
            }}
            className="flex items-center gap-4 cursor-pointer hover:opacity-95 group min-w-0"
          >
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-[3px] border-slate-200 group-hover:border-slate-400 bg-white flex items-center justify-center shrink-0 transition-all shadow-sm">
              {displayPic ? (
                <img 
                  src={displayPic} 
                  alt="Profile" 
                  className="w-full h-full object-cover group-hover:scale-105 duration-200" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-7 h-7 text-slate-400" />
              )}
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase bg-slate-800 text-white px-2 py-0.5 rounded-md tracking-wider">
                  {language === 'id' ? 'Liga' : 'League'}
                </span>
                <span className="text-xs text-slate-400 font-bold tracking-wide">
                  {getLevelName(userLevel, language as 'id' | 'en')}
                </span>
              </div>
              
              <h1 className="text-xl sm:text-2xl font-poppins font-black text-slate-800 tracking-tight leading-tight mt-0.5 break-words flex flex-wrap items-center gap-1.5 max-w-full">
                <span>{welcomeText},</span>
                <span className="text-emerald-600 truncate max-w-[120px] sm:max-w-[200px] md:max-w-[280px] block" title={displayName}>{displayName}</span>
                <span>👋</span>
              </h1>
            </div>
          </motion.div>
          
          {/* Total Coins, Leaderboard Icon, Settings Icon, strictly displaying only these 3 on Right */}
          <div className="flex items-center justify-start md:justify-end gap-3 flex-wrap sm:flex-nowrap shrink-0">
            {/* Elegant Coins Badge */}
            <div className="flex items-center gap-3 bg-white p-1.5 pl-3.5 pr-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="p-1.5 bg-slate-50 rounded-full shrink-0 flex items-center justify-center">
                <Coins className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">{t.totalCoins}</p>
                <div className="font-poppins font-black text-lg text-slate-800 tracking-tight mt-0.5">
                  {isDataLoading ? (
                     <span className="w-14 h-4 bg-slate-200 animate-pulse rounded block"></span>
                  ) : (
                     displayCoins.toLocaleString('id-ID')
                  )}
                </div>
              </div>
            </div>

            {/* Lives Badge */}
            <div className="flex items-center gap-3 bg-white p-1.5 pl-3.5 pr-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="p-1.5 bg-rose-50 rounded-full shrink-0 flex items-center justify-center">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">{language === 'id' ? 'Nyawa' : 'Energy'}</p>
                <div className="font-poppins font-black text-lg text-slate-800 tracking-tight mt-0.5">
                  {isDataLoading ? (
                     <span className="w-8 h-4 bg-slate-200 animate-pulse rounded block"></span>
                  ) : (
                     <>{userData?.lives !== undefined ? userData.lives : 5}<span className="text-sm text-slate-400">/5</span></>
                  )}
                </div>
              </div>
            </div>

            {/* Inbox Button */}
            <button 
              onClick={() => {
                playClick();
                setShowInbox(true);
              }}
              className="p-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95 relative"
            >
              <Bell className="w-6 h-6 text-slate-600" />
              {unreadInboxCount > 0 && (
                <span className="absolute top-2 right-2 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>
          </div>
        </motion.header>

        {/* ================= MAIN SPACIOUS MENU GRID ================= */}
        <main className="flex-grow flex flex-col items-center justify-center w-full px-4 sm:px-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center text-center mt-4 sm:mt-8 w-full"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10 border-2 border-emerald-50 mb-6 sm:mb-8">
              <Gamepad2 className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-500" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-poppins font-black text-slate-800 mb-3 tracking-tight">
              {language === 'id' ? 'Selamat Datang di KoinKita' : 'Welcome to KoinKita'}
            </h2>
            <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 text-sm sm:text-base leading-relaxed px-4">
              {language === 'id' 
                ? 'Petualangan finansialmu dimulai di sini. Tingkatkan literasi dan jadilah master pengelola keuangan.' 
                : 'Your financial adventure starts here. Improve your literacy and become a money management master.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 w-full max-w-4xl mx-auto px-2">
              
              {/* Main Action - Quick Play */}
              <button 
                onClick={() => {
                  playClick();
                  setShowTopicSelection(true);
                }}
                className="sm:col-span-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[2rem] p-6 sm:p-8 flex items-center justify-between shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden text-left"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <div className="flex items-center gap-4 sm:gap-5 relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0  border border-white/20">
                    <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">{language === 'id' ? 'MULAI MAIN' : 'QUICK PLAY'}</h3>
                    <p className="text-emerald-50 font-medium text-xs sm:text-sm mt-1 opacity-90">{language === 'id' ? 'Lanjutkan petualangan finansialmu' : 'Continue your financial adventure'}</p>
                  </div>
                </div>
                <ChevronRight className="w-8 h-8 relative z-10 opacity-70 group-hover:opacity-100 group-hover:translate-x-2 transition-all hidden sm:block" />
              </button>

              {/* Misi Harian */}
              <button 
                onClick={() => {
                  playClick();
                  setShowDailyQuests(true);
                }}
                className="sm:col-span-2 bg-white border-2 border-slate-100 hover:border-orange-200 hover:bg-orange-50 rounded-[2rem] p-5 sm:p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all active:scale-95 group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Gift className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="font-bold text-slate-700 text-sm sm:text-base">{language === 'id' ? 'Misi Harian' : 'Daily Quests'}</span>
              </button>

              {/* Arena */}
              <button 
                onClick={() => {
                  playClick();
                  setShowLeaderboard(true);
                }}
                className="sm:col-span-2 bg-white border-2 border-slate-100 hover:border-amber-200 hover:bg-amber-50 rounded-[2rem] p-5 sm:p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all active:scale-95 group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="font-bold text-slate-700 text-sm sm:text-base">{language === 'id' ? 'Arena' : 'Arena'}</span>
              </button>

              {/* Pencapaian */}
              <button 
                onClick={() => {
                  playClick();
                  setShowSocial(true);
                }}
                className="sm:col-span-2 bg-white border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 rounded-[2rem] p-5 sm:p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all active:scale-95 group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="font-bold text-slate-700 text-sm sm:text-base">{language === 'id' ? 'Sosial' : 'Social'}</span>
              </button>

              {/* Small utilities container */}
              <div className="sm:col-span-2 grid grid-cols-2 grid-rows-2 gap-3">
                
                <button 
                  onClick={() => {
                    playClick();
                    setShowSettings(true);
                  }}
                  className="col-span-1 row-span-1 bg-white border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-300 rounded-2xl flex items-center justify-center gap-2 text-center shadow-sm hover:shadow transition-all group p-3 active:scale-95"
                >
                  <Settings className="w-5 h-5 text-slate-500 group-hover:rotate-45 transition-transform" />
                  <span className="font-bold text-[11px] text-slate-600">{language === 'id' ? 'Pengaturan' : 'Settings'}</span>
                </button>
                
                <button 
                  onClick={() => {
                    playClick();
                    setShowTermsModal(true);
                  }}
                  className="col-span-1 row-span-1 bg-white border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-300 rounded-2xl flex items-center justify-center gap-2 text-center shadow-sm hover:shadow transition-all group p-3 active:scale-95"
                >
                  <FileText className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-[11px] text-slate-600">{language === 'id' ? 'Aturan' : 'Rules'}</span>
                </button>

                <button 
                  onClick={() => {
                    playClick();
                    setShowAchievements(true);
                  }}
                  className="col-span-2 row-span-1 bg-white border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-300 rounded-2xl flex items-center justify-center gap-2 text-center shadow-sm hover:shadow transition-all group p-3 active:scale-95"
                >
                  <Medal className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-[11px] text-slate-600">{language === 'id' ? 'Pencapaian' : 'Achievements'}</span>
                </button>
              </div>

            </div>
          </motion.div>
        </main>
        
        {/* ================= FOOTER / CONTROLS ================= */}
        <footer className="mt-12 pt-6 flex flex-row items-center justify-center shrink-0 w-full">
          <button 
            onClick={() => {
              playClick();
              handleLogout();
            }}
            className="flex items-center gap-2 px-5 py-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 font-bold rounded-xl transition-all cursor-pointer text-sm active:scale-95"
          >
            <LogOut className="w-4 h-4" /> {t.logout}
          </button>
        </footer>
        
      </div>

      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />

      {/* League Promotion/Demotion Popup */}
      <AnimatePresence>
        {leaguePopup && (() => {
          const lInfo = getLeagueInfo(leaguePopup.newLeague);
          const isPromoted = leaguePopup.status === 'promoted';
          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 " onClick={() => setLeaguePopup(null)}>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                className={`bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl border-4 ${isPromoted ? 'border-emerald-400' : 'border-rose-400'}`}
                onClick={e => e.stopPropagation()}
              >
                <div className="text-6xl mb-4 animate-bounce">
                  {lInfo.emoji}
                </div>
                <h2 className={`text-3xl font-black mb-2 ${isPromoted ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isPromoted ? (language === 'id' ? 'NAIK LIGA!' : 'PROMOTED!') : (language === 'id' ? 'TURUN LIGA' : 'DEMOTED')}
                </h2>
                <p className="text-slate-600 font-medium mb-6">
                  {language === 'id' ? `Kamu sekarang berada di ` : `You are now in `} 
                  <strong className={`font-black ${lInfo.color}`}>{language === 'id' ? lInfo.nameId : lInfo.nameEn}</strong>.
                </p>
                <button 
                  onClick={() => { playClick(); setLeaguePopup(null); }}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all active:scale-95 ${isPromoted ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-800 hover:bg-slate-900'}`}
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
        onShowProfile={() => {
          setShowSettings(false);
          setShowProfile(true);
        }}
      />
      <AnimatePresence>
        {showLeaderboard && <Arena onBack={() => setShowLeaderboard(false)} currentUserUid={user.uid} userData={userData} mode="arena" initialTab="leaderboard" />}
        {showSocial && <Arena onBack={() => setShowSocial(false)} currentUserUid={user.uid} userData={userData} mode="social" initialTab="friends" triggerToast={triggerToast} />}
      </AnimatePresence>

      
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
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-sm sm:max-w-md w-full shadow-2xl border border-slate-100/80 overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 bg-emerald-500 h-2 w-full"></div>
              
              {/* Header */}
              <div className="text-center mb-6">
                <span className="text-3xl mb-3 block">📖</span>
                <h3 className="text-xl sm:text-2xl font-poppins font-black text-slate-800 leading-tight">
                  {tutorialGameId === 'detektif-cuan' && (language === 'id' ? 'Cara Bermain Detektif Cuan' : 'How to Play Detektif Cuan')}
                  {tutorialGameId === 'koki-anggaran' && (language === 'id' ? 'Cara Bermain Koki Anggaran' : 'How to Play Budget Chef')}
                  {tutorialGameId === 'pohon-aset' && (language === 'id' ? 'Cara Bermain Pohon Aset' : 'How to Play Asset Tree')}
                  {tutorialGameId === 'fin-wordle' && (language === 'id' ? 'Cara Bermain Tebak Kata' : 'How to Play Guess Terms')}
                </h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
                  {language === 'id' ? 'Panduan Singkat' : 'Quick Guidebook'}
                </p>
              </div>

              {/* Description Body */}
              <div className="space-y-4 mb-6 text-left text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-5 rounded-3xl border border-slate-100 max-h-[360px] overflow-y-auto">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">
                    {language === 'id' ? 'Misi Kamu:' : 'Your Mission:'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {tutorialGameId === 'detektif-cuan' && (language === 'id' 
                      ? 'Warga butuh bantuanmu menyaring SMS / Aplikasi mencurigakan. Tentukan setiap pesan penawaran itu AMAN atau BAHAYA (Scam/Phishing).'
                      : 'Help citizens filter fake draws and dangerous APK text. Decide if each message is SAFE or THREAT.')}
                    {tutorialGameId === 'koki-anggaran' && (language === 'id' 
                      ? 'Kelola porsi keuangan dengan metode 50/30/20! Geser/klik panci yang pas untuk menyortir pengeluaran sehari-hari: KEBUTUHAN (Hijau), KEINGINAN (Kuning/Perak), atau TABUNGAN (Biru). Buang arisan bodong/pinjol (SCAM) ke tempat sampah!'
                      : 'Sort financial transactions based on the 50/30/20 rule: KEBUTUHAN (Needs), KEINGINAN (Wants), or TABUNGAN/DANA DARURAT (Savings). Drag scams or loans to the bin!')}
                    {tutorialGameId === 'pohon-aset' && (language === 'id' 
                      ? 'Targetkan pertumbuhan modal mencapai Rp 100.000.000 dalam batas waktu 60 detik! Tempatkan aset investasi pada Cabang TUMBUH CEPAT (Saham/Kripto) atau Cabang AMAN (Emas/SBN) dengan presisi.'
                      : 'Grow your seed capital to Rp 100,000,000 within 60 seconds! Plant correct assets onto their corresponding branches: FAST GROWTH (high-yield) or SAFE & STABLE (bond notes).')}
                    {tutorialGameId === 'fin-wordle' && (language === 'id' 
                      ? 'Tebak istilah keuangan rahasia dari petunjuk definisi akurat yang tersedia!'
                      : 'Guess the secret financial vocabulary terms based on defined outlines.')}
                  </p>
                </div>

                <div className="border-t border-slate-200/65 pt-3">
                  <h4 className="font-bold text-red-500 text-xs uppercase tracking-wider mb-1">
                    {language === 'id' ? 'Peringatan & Aturan:' : 'Rules & Caution:'}
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold">
                    {tutorialGameId === 'detektif-cuan' && (language === 'id' 
                      ? '⚠️ Memilih "AMAN" pada pesan penipuan memotong -25 Koin & 1 Nyawa! Detik waktu berpikir dikurangi per level akun!'
                      : '⚠️ Choosing SAFE on a scam costs -25 Coins & 1 Heart! The game timer tightens with your account level!')}
                    {tutorialGameId === 'koki-anggaran' && (language === 'id' 
                      ? '⚠️ Ada keadaan DARURAT MEDIS acak di tengah game. Jika kamu lalai mengisi Panci Tabungan, kamu dipotong -40 Koin & 1 Nyawa!'
                      : '⚠️ Medical EMERGENCIES strike mid-game! Lacking savings triggers direct online loan penalties of -40 Coins & -1 Life!')}
                    {tutorialGameId === 'pohon-aset' && (language === 'id' 
                      ? '⚠️ Ada bahaya "MARKET CRASH" mendadak yang meruntuhkan total tabungan kamu 25%-40% dan mengoyak aset cepat tumbuh!'
                      : '⚠️ Sudden MARKET CRASHES can destroy 25%-40% of accumulate asset portfolios! Avoid over-investing in fast growth assets.')}
                    {tutorialGameId === 'fin-wordle' && (language === 'id' 
                      ? '⚠️ Jawab secepat mungkin untuk bonus tertinggi!'
                      : '⚠️ Answer swiftly to lock maximum score!')}
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
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-sm rounded-2xl cursor-pointer transition-all active:translate-y-[1px]"
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
                    setActiveGame(target);
                    // DAILY QUEST TRACKING
                    const today = new Date().toISOString().split('T')[0];
                    if (user?.uid) {
                      const docRef = doc(db, 'users', user.uid);
                      updateDoc(docRef, {
                        [`dailyStats.${today}.gamesPlayed`]: increment(1)
                      }).catch(console.warn);
                    }
                  }}
                  className="flex-[2] py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm rounded-2xl cursor-pointer transition-all active:translate-y-[1px] border-b-[3px] border-emerald-700 hover:scale-[1.01]"
                >
                  {language === 'id' ? 'MULAI BERMAIN 🚀' : 'START GAME 🚀'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaderboard Modal Dialog */}
      

      {/* Achievements Modal Dialog */}
      <AnimatePresence>
        {showAchievements && (
          <AchievementsModal onClose={() => setShowAchievements(false)} userData={userData} userLevel={userLevel} />
        )}
      </AnimatePresence>

      {/* Daily Quests Modal Dialog */}
      <AnimatePresence>
        {showDailyQuests && (
          <DailyQuestsModal onClose={() => setShowDailyQuests(false)} user={user} userData={userData} triggerToast={triggerToast!} />
        )}
      </AnimatePresence>

      {/* Level Up Announcement Overlay Animation */}
      <AnimatePresence>
        {levelUpNotice.show && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 "
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1, transition: { type: 'spring', damping: 15 } }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center border border-amber-200 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/10 via-transparent to-emerald-100/10 pointer-events-none"></div>
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-amber-200/20 rounded-full  pointer-events-none"></div>
              <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-emerald-200/20 rounded-full  pointer-events-none"></div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-amber-100 border-4 border-amber-300 rounded-full mb-6 flex items-center justify-center shadow-lg relative animate-bounce">
                  <span className="text-4xl">👑</span>
                  <div className="absolute -top-1 right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black animate-pulse">UP</div>
                </div>

                <h1 className="text-3xl font-poppins font-black text-amber-600 tracking-tight leading-none mb-2">
                  {t.levelUpTitle}
                </h1>
                
                <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
                  {t.levelUpDesc.replace('{newLevel}', levelUpNotice.newLevel.toString())}
                </p>

                <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl px-6 py-4 border border-amber-300 shadow-lg text-white font-poppins font-extrabold text-xl mb-8 flex items-center gap-3">
                  <span className="line-through text-amber-200 font-medium text-sm">LV {levelUpNotice.oldLevel}</span>
                  <span className="text-white">🚀 LV {levelUpNotice.newLevel}</span>
                </div>

                <button
                  onClick={() => {
                    playClick();
                    setLevelUpNotice({ show: false, oldLevel: 0, newLevel: 0 });
                  }}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 hover:scale-[1.02] active:scale-95 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-500/15 duration-200 cursor-pointer transition-all"
                >
                  {language === 'id' ? 'Lanjutkan Keren!' : 'Continue Rocking!'}
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
