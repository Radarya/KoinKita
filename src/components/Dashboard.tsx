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
  User,
  Settings,
  Sparkles,
  Gamepad2,
  ChevronRight,
  Loader2,
  Medal,
  Gift,
  Share2
} from 'lucide-react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { 
  doc, 
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
import Leaderboard from './Leaderboard';
import { SettingsModal } from './SettingsModal';
import { DailyQuestsModal } from './DailyQuestsModal';
import { AchievementsModal, ACHIEVEMENTS } from './AchievementsModal';
import { playClick, playWin, setGameViewTrack } from '../lib/audio';
import { useTranslation } from '../lib/LanguageContext';
import { FINANCIAL_TIPS } from '../lib/tips';

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
  if (coins >= 6001) return 5; // Level 5 is 6001-10000+
  if (coins >= 4001) return 4; // Level 4 is 4001-6000
  if (coins >= 2001) return 3; // Level 3 is 2001-4000
  if (coins >= 601) return 2;  // Level 2 is 601-2000
  if (coins >= 100) return 1;  // Level 1 is 100-600
  return 0;                    // Level 0 is 0-99 (starting level)
}

export default function Dashboard({ user, onShowTerms, triggerToast }: DashboardProps) {
  const { t, language } = useTranslation();
  const [userData, setUserData] = useState<any>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  // Settings & Level state triggers
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showDailyQuests, setShowDailyQuests] = useState(false);
  const [tutorialGameId, setTutorialGameId] = useState<string | null>(null);
  const [levelUpNotice, setLevelUpNotice] = useState<{ show: boolean, oldLevel: number, newLevel: number }>({ show: false, oldLevel: 0, newLevel: 0 });
  const [toastQueue, setToastQueue] = useState<any[]>([]);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    if (toastQueue.length > 0) {
      playWin();
      const timer = setTimeout(() => {
         setToastQueue(prev => prev.slice(1));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastQueue]);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % FINANCIAL_TIPS.length);
    }, 5000);
    return () => clearInterval(tipInterval);
  }, []);

  // Autoplay background music
  useEffect(() => {
    import('../lib/audio').then(m => m.setGameViewTrack('dashboard'));
  }, [activeGame]);

  // Sync firestore user statistics
  useEffect(() => {
    let unsubscribe = () => {};
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
            
            setUserData(data);
            
            // Level-up condition trigger check
            if (calculated > dbLevel && dbLevel !== undefined) {
              try {
                await updateDoc(docRef, { level: calculated });
                if (dbLevel > 0) {
                  playWin();
                  setLevelUpNotice({ show: true, oldLevel: dbLevel, newLevel: calculated });
                }
              } catch (e) {
                console.error("Failed to update user level doc:", e);
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
                  console.error("Failed to update unlockedAchievements:", e);
               }
            }
          }
          setIsDataLoading(false);
        }, (err) => {
          console.error("Failed to fetch user data:", err);
          setIsDataLoading(false);
        });
      } else {
        setIsDataLoading(false);
      }
    };
    fetchUserData();
    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    try {
      if (triggerToast) {
        triggerToast(language === 'id' ? 'Berhasil keluar. Sampai jumpa!' : 'Successfully logged out. See you!', 'info');
      }
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleShare = async () => {
    playClick();
    const title = language === 'id' ? 'KoinKita' : 'KoinKita';
    const text = language === 'id' 
      ? `Saya baru saja mencapai Level ${userLevel} di KoinKita dengan koleksi ${userData?.totalCoins || 0} Koin! Bergabunglah sekarang!` 
      : `I just reached Level ${userLevel} on KoinKita with a collection of ${userData?.totalCoins || 0} Coins! Join now!`;
    const shareUrl = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        if (triggerToast) triggerToast(language === 'id' ? 'Berhasil dibagikan!' : 'Successfully shared!', 'success');
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${text} ${shareUrl}`);
        if (triggerToast) triggerToast(language === 'id' ? 'Disalin ke papan klip!' : 'Copied to clipboard!', 'success');
      } catch (err) {
        if (triggerToast) triggerToast(language === 'id' ? 'Gagal menyalin' : 'Failed to copy', 'error');
      }
    }
  };

  const userLevel = calculateLevelFromCoins(userData?.totalCoins || userData?.coins || 0);

  const getLevelName = (lvl: number, lang: 'id' | 'en') => {
    switch (lvl) {
      case 5: return lang === 'id' ? 'Sultan Cuan 💎' : 'Wealth Master 💎';
      case 4: return lang === 'id' ? 'Ahli Anggaran 👑' : 'Budget Expert 👑';
      case 3: return lang === 'id' ? 'Investor Cerdas 📈' : 'Smart Investor 📈';
      case 2: return lang === 'id' ? 'Bijak Belanja 🛒' : 'Wise Spender 🛒';
      case 1: return lang === 'id' ? 'Sadar Finansial 📘' : 'Financially Aware 📘';
      default: return lang === 'id' ? 'Pemula Keuangan 🌱' : 'Finance Beginner 🌱';
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
      icon: <ChefHat className="w-10 h-10 text-emerald-500 mb-4" />,
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
    <div className="min-h-screen text-slate-800 font-sans relative overflow-hidden transition-colors selection:bg-emerald-500 selection:text-white pb-12" style={{ backgroundColor: '#f8fafc', backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)', backgroundSize: '18px 18px' }}>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10 flex flex-col min-h-screen">
        
        {/* ================= HEADER PART ================= */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 sm:mb-12 bg-white p-6 rounded-[2rem] border border-slate-150/60 shadow-sm gap-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50/50 rounded-full blur-3xl pointer-events-none -mr-12 -mt-12"></div>
          
          {/* User Profile Info on Left */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              playClick();
              setShowProfile(true);
            }}
            className="flex items-center gap-4 cursor-pointer hover:opacity-95 group min-w-0"
          >
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-[3px] border-emerald-500/10 group-hover:border-emerald-500 bg-emerald-50 flex items-center justify-center shrink-0 transition-all shadow-sm">
              {displayPic ? (
                <img 
                  src={displayPic} 
                  alt="Profile" 
                  className="w-full h-full object-cover group-hover:scale-105 duration-200" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-7 h-7 text-emerald-500" />
              )}
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md tracking-wider">
                  Level {userLevel}
                </span>
                <span className="text-xs text-slate-400 font-bold tracking-wide">
                  {userLevel === 0 ? "Pemula" : userLevel === 1 ? "Sadar Finansial" : userLevel === 2 ? "Bijak Belanja" : userLevel === 3 ? "Investor Cerdas" : userLevel === 4 ? "Ahli Anggaran" : "Sultan Cuan"}
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
            <div className="flex items-center gap-3 bg-[#eefcf7] p-1.5 pl-3.5 pr-4 rounded-2xl border border-[#cef4e6] shadow-sm">
              <div className="p-1.5 bg-[#d8f8ed] rounded-full shrink-0 flex items-center justify-center">
                <Coins className="w-5 h-5 text-emerald-500 fill-emerald-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest leading-none">{t.totalCoins}</p>
                <div className="font-poppins font-black text-lg text-slate-800 tracking-tight mt-0.5">
                  {isDataLoading ? (
                     <span className="w-14 h-4 bg-slate-200 animate-pulse rounded block"></span>
                  ) : (
                     displayCoins.toLocaleString('id-ID')
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                playClick();
                setShowDailyQuests(true);
              }}
              className="flex items-center justify-center bg-emerald-100 hover:bg-emerald-200 text-emerald-600 border border-emerald-200 p-3 rounded-2xl shadow-sm transition-all cursor-pointer hover:scale-105"
              title={language === 'id' ? 'Misi Harian' : 'Daily Quests'}
            >
              <Gift className="w-5 h-5 fill-emerald-500/15" />
            </button>

            {/* Leaderboard Button */}
            <button 
              onClick={() => {
                playClick();
                setShowLeaderboard(true);
              }}
              className="flex items-center justify-center bg-amber-100 hover:bg-amber-200 text-amber-600 border border-amber-200 p-3 rounded-2xl shadow-sm transition-all cursor-pointer hover:scale-105"
              title={t.leaderboard}
            >
              <Trophy className="w-5 h-5 fill-amber-500/15" />
            </button>

            {/* Achievements Button */}
            <button 
              onClick={() => {
                playClick();
                setShowAchievements(true);
              }}
              className="flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 p-3 rounded-2xl shadow-sm transition-all cursor-pointer hover:scale-105"
              title={language === 'id' ? 'Pencapaian' : 'Achievements'}
            >
              <Medal className="w-5 h-5 fill-indigo-500/15" />
            </button>

            {/* Share Button */}
            <button 
              onClick={handleShare}
              className="flex items-center justify-center bg-purple-100 hover:bg-purple-200 text-purple-600 border border-purple-200 p-3 rounded-2xl shadow-sm transition-all cursor-pointer hover:scale-105"
              title={language === 'id' ? 'Bagikan' : 'Share'}
            >
              <Share2 className="w-5 h-5 fill-purple-500/15" />
            </button>

            {/* Settings Gear Button */}
            <button 
              onClick={() => {
                playClick();
                setShowSettings(true);
              }}
              className="flex items-center justify-center bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/80 p-3 rounded-2xl shadow-sm transition-all cursor-pointer hover:scale-105"
              title={language === 'id' ? 'Pengaturan' : 'Settings'}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </motion.header>

        {/* ================= MAIN SPACIOUS MENU GRID ================= */}
        <main className="flex-grow flex flex-col space-y-8">
          
          {/* Welcome Banner Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.01, boxShadow: "0px 20px 25px -5px rgba(16, 185, 129, 0.4)" }}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[2rem] p-6 sm:p-8 text-white shadow-lg relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16"></div>
            <div className="relative z-10 space-y-2 max-w-xl">
              <span className="text-[10px] font-black tracking-widest uppercase bg-emerald-450 text-white px-2.5 py-1 rounded-lg">
                EDUGAME
              </span>
              <h2 className="text-xl sm:text-2xl font-poppins font-black leading-tight">
                {language === 'id' ? 'Mulai Cerdas Finansial Bersama KoinKita!' : 'Start Financial Wisdom with KoinKita!'}
              </h2>
              
              <div className="pt-2 min-h-[5rem] relative flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTipIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-start text-xs sm:text-sm text-emerald-50 font-medium leading-relaxed w-full"
                  >
                    <div className="flex gap-2 w-full">
                       <span className="text-xl mt-0.5" aria-hidden="true">💡</span>
                       <div className="flex-1">
                         <p className="font-bold text-white mb-0.5">{language === 'id' ? FINANCIAL_TIPS[currentTipIndex].title_id : FINANCIAL_TIPS[currentTipIndex].title_en}</p>
                         <p className="break-words">{language === 'id' ? FINANCIAL_TIPS[currentTipIndex].tip_id : FINANCIAL_TIPS[currentTipIndex].tip_en}</p>
                       </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            {/* Visual Icon */}
            <Gamepad2 className="absolute right-8 bottom-4 w-24 h-24 text-white/10 hidden md:block" />
          </motion.div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 mt-4">
            <h3 className="text-base font-poppins font-black text-slate-800 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-emerald-500" />
              {language === 'id' ? 'Petualangan Finansial' : 'Financial Arcade Adventures'}
            </h3>
            <span className="text-xs text-slate-400 font-bold font-mono">4 {language === 'id' ? 'Gim Tersedia' : 'Games Available'}</span>
          </div>
          
          {/* Centered spacious multi-column layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game, index) => {
              const isLocked = userLevel < game.unlockLevel;
              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  whileHover={!isLocked ? { y: -8, scale: 1.02, transition: { duration: 0.2 } } : {}}
                  onClick={() => {
                    if (!isLocked) {
                      playClick();
                      setTutorialGameId(game.id);
                    }
                  }}
                  className={`bg-white rounded-[2rem] p-6 border-2 border-slate-150/50 shadow-sm transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden group ${
                    !isLocked 
                      ? `cursor-pointer hover:shadow-xl hover:border-emerald-400/50 ${game.color}`
                      : 'opacity-60 cursor-not-allowed select-none'
                  }`}
                >
                  {/* Visual Background Deco */}
                  <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-slate-50 group-hover:bg-emerald-50/20 rounded-full transition-all duration-300"></div>
                  
                  <div className="relative z-10 flex-grow">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700 rounded-lg transition-colors leading-none">
                        {game.badge}
                      </span>
                      {!isLocked ? (
                        <Sparkles className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <span className="text-xs">🔒</span>
                      )}
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl w-fit mb-5">
                      {game.icon}
                    </div>

                    <h3 className="font-poppins font-black text-base sm:text-lg text-slate-800 leading-tight mb-2 group-hover:text-emerald-600 transition-colors">
                      {game.title}
                    </h3>

                    <p className="text-xs text-slate-500 font-sans leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  {/* Locked UI Overlay */}
                  {isLocked && (
                    <div className="absolute inset-x-0 bottom-[75px] top-0 bg-slate-900/60 backdrop-blur-[1.5px] z-20 flex flex-col items-center justify-center text-center p-4">
                      <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner mb-3">
                        <span className="text-xl">🔒</span>
                      </div>
                      <p className="text-white font-poppins font-black text-xs uppercase tracking-wider mb-1">
                        {language === 'id' ? 'Terkunci' : 'Locked'}
                      </p>
                      <p className="text-emerald-300 font-black text-[11px] max-w-[170px] leading-snug">
                        {language === 'id' 
                          ? `Terbuka pada Lvl ${game.unlockLevel} (${getLevelName(game.unlockLevel, 'id').split(' ')[0]})`
                          : `Unlocked at Lvl ${game.unlockLevel} (${getLevelName(game.unlockLevel, 'en').split(' ')[0]})`
                        }
                      </p>
                    </div>
                  )}

                  <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between relative z-10 shrink-0">
                    <span className={`text-[11px] font-black uppercase tracking-wider ${!isLocked ? 'text-emerald-500 group-hover:text-emerald-600' : 'text-slate-400'}`}>
                      {!isLocked ? (language === 'id' ? 'MAIN SEKARANG' : 'PLAY NOW') : (language === 'id' ? 'Terkunci' : 'Locked')}
                    </span>
                    <button
                      disabled={isLocked}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${!isLocked ? 'bg-slate-50 text-slate-500 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </main>

        {/* ================= FOOTER / CONTROLS ================= */}
        <footer className="mt-16 pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                playClick();
                setShowTermsModal(true);
              }}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer text-slate-500 hover:text-emerald-600"
            >
              <FileText className="w-4 h-4 text-emerald-500" /> {language === 'id' ? "Aturan & Kebijakan Privasi" : "Rules & Privacy Policy"}
            </button>
          </div>
          
          <button 
            onClick={() => {
              playClick();
              handleLogout();
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-all cursor-pointer text-sm"
          >
            <LogOut className="w-4 h-4" /> {t.logout}
          </button>
        </footer>
        
      </div>

      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />

      {/* Settings Modal Dialog */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        onShowProfile={() => {
          setShowSettings(false);
          setShowProfile(true);
        }}
      />

      {/* Pre-Game Tutorial Modal */}
      <AnimatePresence>
        {tutorialGameId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
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
                    const target = tutorialGameId;
                    setTutorialGameId(null);
                    setActiveGame(target);
                    // DAILY QUEST TRACKING
                    const today = new Date().toISOString().split('T')[0];
                    if (user?.uid) {
                      const docRef = doc(db, 'users', user.uid);
                      updateDoc(docRef, {
                        [`dailyStats.${today}.gamesPlayed`]: increment(1)
                      }).catch(console.error);
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
      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} currentUserUid={user.uid} />
      )}

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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1, transition: { type: 'spring', damping: 15 } }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center border border-amber-200 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/10 via-transparent to-emerald-100/10 pointer-events-none"></div>
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-amber-200/20 rounded-full blur-xl pointer-events-none"></div>
              <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-emerald-200/20 rounded-full blur-xl pointer-events-none"></div>

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
                  className="bg-white/95 backdrop-blur-md border border-amber-200/60 shadow-xl shadow-amber-500/10 p-3 rounded-2xl flex items-center gap-3 w-72 pointer-events-auto cursor-pointer"
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
