import React from 'react';
import { motion } from 'motion/react';
import { Medal, X, CheckCircle2, Lock, Trophy } from 'lucide-react';
import { playClick } from '../lib/audio';
import { useTranslation } from '../lib/LanguageContext';

interface AchievementsModalProps {
  onClose: () => void;
  userData: any;
  userLevel: number;
}

export const ACHIEVEMENTS = [
  {
    id: 'first_blood',
    icon: (c: number, l: number, u: any) => '🐣',
    title: (c: number, l: number, u: any) => ({ id: 'Pemula Bijak', en: 'Wise Beginner' }),
    desc: (c: number, l: number, u: any) => ({ id: 'Mulai perjalanan finansialmu. Selamat datang!', en: 'Start your financial journey. Welcome!' }),
    condition: (coins: number, level: number) => true,
    progress: (coins: number, level: number) => 1,
    max: (c: number, l: number, u: any) => 1
  },
  {
    id: 'coin_collector',
    icon: (c: number, l: number, u: any) => c >= 10000 ? '👑' : c >= 2000 ? '💼' : '💰',
    title: (c: number, l: number, u: any) => {
      if (c >= 10000) return { id: 'Sultan Finansial', en: 'Financial Sultan' };
      if (c >= 2000) return { id: 'Pebisnis Cerdik', en: 'Smart Entrepreneur' };
      if (c >= 500) return { id: 'Penabung Handal', en: 'Reliable Saver' };
      return { id: 'Kolektor Koin', en: 'Coin Collector' };
    },
    desc: (c: number, l: number, u: any) => {
      const target = c >= 10000 ? 50000 : c >= 2000 ? 10000 : c >= 500 ? 2000 : 500;
      return { id: `Kumpulkan total ${target.toLocaleString('id-ID')} koin.`, en: `Collect a total of ${target.toLocaleString('en-US')} coins.` };
    },
    condition: (coins: number, level: number) => {
      const target = coins >= 10000 ? 50000 : coins >= 2000 ? 10000 : coins >= 500 ? 2000 : 500;
      return coins >= target;
    },
    progress: (coins: number, level: number) => {
      const target = coins >= 10000 ? 50000 : coins >= 2000 ? 10000 : coins >= 500 ? 2000 : 500;
      return Math.min(coins, target);
    },
    max: (c: number, l: number, u: any) => c >= 10000 ? 50000 : c >= 2000 ? 10000 : c >= 500 ? 2000 : 500
  },
  {
    id: 'level_climber',
    icon: (c: number, l: number, u: any) => l >= 5 ? '🚀' : l >= 3 ? '🕵️‍♂️' : '🎓',
    title: (c: number, l: number, u: any) => {
      if (l >= 5) return { id: 'Bintang Bersinar (Max Level!)', en: 'Rising Star (Max Level!)' };
      if (l >= 3) return { id: 'Detektif Cuan', en: 'Cuan Detective' };
      return { id: 'Siswa Cerdas', en: 'Smart Student' };
    },
    desc: (c: number, l: number, u: any) => {
      const target = l >= 5 ? 5 : l >= 3 ? 5 : 3;
      return { id: `Capai Level ${target} di KoinKita.`, en: `Reach Level ${target} in KoinKita.` };
    },
    condition: (coins: number, level: number) => {
      const target = level >= 5 ? 5 : level >= 3 ? 5 : 3;
      return level >= target;
    },
    progress: (coins: number, level: number) => {
      const target = level >= 5 ? 5 : level >= 3 ? 5 : 3;
      return Math.min(level, target);
    },
    max: (c: number, l: number, u: any) => c >= 5 ? 5 : c >= 3 ? 5 : 3
  },
  {
    id: 'play_a_lot',
    icon: (c: number, l: number, u: any) => {
      const logins = u?.loginCount || 1;
      return logins >= 20 ? '🔥' : logins >= 5 ? '📅' : '👋';
    },
    title: (c: number, l: number, u: any) => {
      const logins = u?.loginCount || 1;
      if (logins >= 20) return { id: 'Pemain Legenda', en: 'Legendary Player' };
      if (logins >= 5) return { id: 'Pemain Setia', en: 'Loyal Player' };
      return { id: 'Baru Mulai', en: 'Just Starting' };
    },
    desc: (c: number, l: number, u: any) => {
      const logins = u?.loginCount || 1;
      const target = logins >= 20 ? 50 : logins >= 5 ? 20 : 5;
      return { id: `Login atau main ${target} kali.`, en: `Login or play ${target} times.` };
    },
    condition: (coins: number, level: number, userData?: any) => {
      const logins = userData?.loginCount || 1;
      const target = logins >= 20 ? 50 : logins >= 5 ? 20 : 5;
      return logins >= target;
    },
    progress: (coins: number, level: number, userData?: any) => {
      const logins = userData?.loginCount || 1;
      const target = logins >= 20 ? 50 : logins >= 5 ? 20 : 5;
      return Math.min(logins, target);
    },
    max: (c: number, l: number, u: any) => {
      const logins = u?.loginCount || 1;
      return logins >= 20 ? 50 : logins >= 5 ? 20 : 5;
    }
  }
];

export function AchievementsModal({ onClose, userData, userLevel }: AchievementsModalProps) {
  const { language } = useTranslation();
  const displayCoins = userData?.totalCoins || userData?.coins || 0;

  let unlockedCount = 0;
  ACHIEVEMENTS.forEach(ach => {
    if (ach.condition(displayCoins, userLevel, userData)) unlockedCount++;
  });
  const totalAch = ACHIEVEMENTS.length;
  const globalCompletion = Math.round((unlockedCount / totalAch) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/70 "
        onClick={() => { playClick(); onClose(); }}
      ></div>
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-6 border-b border-slate-100 flex flex-col shrink-0 bg-gradient-to-r from-amber-50 to-orange-50 relative overflow-hidden gap-3">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/40 rounded-full  -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex items-center justify-between relative z-10 w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shadow-inner">
                <Medal className="w-5 h-5 fill-amber-500/20" />
              </div>
              <div>
                <h2 className="text-xl font-poppins font-black text-slate-800">
                  {language === 'id' ? 'Pencapaian' : 'Achievements'}
                </h2>
                <p className="text-xs font-bold text-amber-600 tracking-wide uppercase">
                  {language === 'id' ? 'Trofi Kamu' : 'Your Trophies'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => { playClick(); onClose(); }}
              className="p-2 hover:bg-black/5 rounded-full transition-colors relative z-10 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative z-10 bg-white/95 p-3 rounded-xl border border-amber-100/50 ">
             <div className="flex justify-between items-center mb-1.5">
               <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                 <Trophy className="w-3.5 h-3.5 text-amber-500" />
                 {language === 'id' ? 'Total Penyelesaian' : 'Total Completion'}
               </span>
               <span className="text-xs font-black text-amber-600">{globalCompletion}%</span>
             </div>
             <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden">
               <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${globalCompletion}%` }} />
             </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 bg-[#FDFDFD]">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = ach.condition(displayCoins, userLevel, userData);
            const currentProgress = ach.progress(displayCoins, userLevel, userData);
            const currentMax = ach.max(displayCoins, userLevel, userData);
            const percentage = (currentProgress / currentMax) * 100;

            const iconStr = ach.icon(displayCoins, userLevel, userData);
            const titleObj = ach.title(displayCoins, userLevel, userData);
            const descObj = ach.desc(displayCoins, userLevel, userData);

            return (
              <div 
                key={ach.id} 
                className={`flex gap-4 p-4 rounded-2xl border transition-all ${
                  isUnlocked 
                    ? 'bg-white border-amber-200 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 opacity-80'
                }`}
              >
                <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${
                  isUnlocked ? 'bg-amber-100/50' : 'bg-slate-200 grayscale'
                }`}>
                  {isUnlocked ? iconStr : <Lock className="w-6 h-6 text-slate-400" />}
                </div>

                <div className="flex-grow min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-poppins font-bold text-sm sm:text-base ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                      {language === 'id' ? titleObj.id : titleObj.en}
                    </h3>
                    {isUnlocked && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-tight mb-2">
                    {language === 'id' ? descObj.id : descObj.en}
                  </p>

                  <div className="flex items-center gap-2">
                    <div className="flex-grow h-2 bg-slate-200/70 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isUnlocked ? 'bg-amber-400' : 'bg-slate-400'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                      {currentProgress.toLocaleString('id-ID')} / {currentMax.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

