import React from 'react';
import { motion } from 'motion/react';
import { Medal, X, CheckCircle2, Lock, Trophy } from 'lucide-react';
import { playClick } from '../lib/audio';
import { useTranslation } from '../lib/LanguageContext';
import CikoMascot from './CikoMascot';

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
      return { id: `Capai Level ${target} di CIKO.`, en: `Reach Level ${target} in CIKO.` };
    },
    condition: (coins: number, level: number) => {
      const target = level >= 5 ? 5 : level >= 3 ? 5 : 3;
      return level >= target;
    },
    progress: (coins: number, level: number) => {
      const target = level >= 5 ? 5 : level >= 3 ? 5 : 3;
      return Math.min(level, target);
    },
    max: (c: number, l: number, u: any) => l >= 5 ? 5 : l >= 3 ? 5 : 3
  },
  {
    id: 'play_a_lot',
    icon: (c: number, l: number, u: any) => {
      const activityCount = Math.max(u?.totalGamesPlayed || 0, u?.loginCount || 1, u?.streakCount || 0);
      return activityCount >= 20 ? '🔥' : activityCount >= 5 ? '📅' : '👋';
    },
    title: (c: number, l: number, u: any) => {
      const activityCount = Math.max(u?.totalGamesPlayed || 0, u?.loginCount || 1, u?.streakCount || 0);
      if (activityCount >= 20) return { id: 'Pemain Legenda', en: 'Legendary Player' };
      if (activityCount >= 5) return { id: 'Pemain Setia', en: 'Loyal Player' };
      return { id: 'Baru Mulai', en: 'Just Starting' };
    },
    desc: (c: number, l: number, u: any) => {
      const activityCount = Math.max(u?.totalGamesPlayed || 0, u?.loginCount || 1, u?.streakCount || 0);
      const target = activityCount >= 20 ? 50 : activityCount >= 5 ? 20 : 5;
      return { id: `Login atau main ${target} kali.`, en: `Login or play ${target} times.` };
    },
    condition: (coins: number, level: number, userData?: any) => {
      const activityCount = Math.max(userData?.totalGamesPlayed || 0, userData?.loginCount || 1, userData?.streakCount || 0);
      const target = activityCount >= 20 ? 50 : activityCount >= 5 ? 20 : 5;
      return activityCount >= target;
    },
    progress: (coins: number, level: number, userData?: any) => {
      const activityCount = Math.max(userData?.totalGamesPlayed || 0, userData?.loginCount || 1, userData?.streakCount || 0);
      const target = activityCount >= 20 ? 50 : activityCount >= 5 ? 20 : 5;
      return Math.min(activityCount, target);
    },
    max: (c: number, l: number, u: any) => {
      const activityCount = Math.max(u?.totalGamesPlayed || 0, u?.loginCount || 1, u?.streakCount || 0);
      return activityCount >= 20 ? 50 : activityCount >= 5 ? 20 : 5;
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
        className="absolute inset-0 bg-[#0D1117]/80"
        onClick={() => { playClick(); onClose(); }}
      ></div>
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-lg relative overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-6 flex flex-col shrink-0 bg-[#0D1117] text-white relative gap-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3.5">
              <CikoMascot size={48} pose="wealth" animated={false} />
              <div>
                <h2 className="text-xl font-poppins font-black text-white">
                  {language === 'id' ? 'Pencapaian' : 'Achievements'}
                </h2>
                <p className="text-xs font-bold text-slate-400">
                  {language === 'id' ? 'Trofi Koleksimu' : 'Your Trophies'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => { playClick(); onClose(); }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="bg-white/10 p-3.5 rounded-2xl">
             <div className="flex justify-between items-center mb-2">
               <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                 <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                 {language === 'id' ? 'Total Penyelesaian' : 'Total Completion'}
               </span>
               <span className="text-xs font-black text-emerald-400 tabular-nums">{globalCompletion}%</span>
             </div>
             <div className="h-2 w-full bg-white/15 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${globalCompletion}%` }} />
             </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-3 bg-white">
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
                className={`flex gap-4 p-4 rounded-2xl transition-colors ${
                  isUnlocked 
                    ? 'bg-emerald-50' 
                    : 'bg-[#F4F5F7]'
                }`}
              >
                <div className={`w-13 h-13 shrink-0 rounded-2xl flex items-center justify-center text-2xl ${
                  isUnlocked ? 'bg-white' : 'bg-slate-200/70'
                }`}>
                  {isUnlocked ? iconStr : <Lock className="w-5 h-5 text-slate-400" />}
                </div>

                <div className="flex-grow min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-poppins font-bold text-sm sm:text-base ${isUnlocked ? 'text-[#0D1117]' : 'text-slate-600'}`}>
                      {language === 'id' ? titleObj.id : titleObj.en}
                    </h3>
                    {isUnlocked && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-snug mb-2.5">
                    {language === 'id' ? descObj.id : descObj.en}
                  </p>

                  <div className="flex items-center gap-2.5">
                    <div className="flex-grow h-2 bg-white rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${isUnlocked ? 'bg-emerald-600' : 'bg-slate-400'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-slate-500 whitespace-nowrap tabular-nums">
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

