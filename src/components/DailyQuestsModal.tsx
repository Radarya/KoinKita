import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Target, CheckCircle2, CircleDollarSign, Loader2, Sparkles, Clock } from 'lucide-react';
import { doc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from '../lib/LanguageContext';
import { playClick, playWin } from '../lib/audio';

interface DailyQuestsModalProps {
  user: any;
  userData: any;
  onClose: () => void;
  triggerToast: (msg: string, type: 'success' | 'warning' | 'error' | 'info') => void;
}

export function DailyQuestsModal({ user, userData, onClose, triggerToast }: DailyQuestsModalProps) {
  const { language } = useTranslation();
  const [claiming, setClaiming] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const calcTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      return `${h}j ${m}m`; // Default to indonesian j for jam, m for menit, we can adjust based on language below
    };

    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      setTimeLeft(language === 'id' ? `${h}j ${m}m` : `${h}h ${m}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [language]);
  
  // Initialize quests dynamically based on userData interactions
  const quests = [
    {
      id: 'login',
      title: language === 'id' ? 'Login Harian' : 'Daily Login',
      desc: language === 'id' ? 'Login ke KoinKita hari ini.' : 'Log in to KoinKita today.',
      reward: 15,
      progress: 1, // Always 1 if they are here
      max: 1,
      completed: userData?.claimedQuests?.[today]?.includes('login')
    },
    {
      id: 'play_any',
      title: language === 'id' ? 'Petualang Cuan' : 'Coin Adventurer',
      desc: language === 'id' ? 'Mainkan minigame apa saja 1 kali.' : 'Play any minigame 1 time.',
      reward: 30,
      progress: Math.min(userData?.dailyStats?.[today]?.gamesPlayed || 0, 1),
      max: 1,
      completed: userData?.claimedQuests?.[today]?.includes('play_any')
    },
    {
      id: 'play_three',
      title: language === 'id' ? 'Si Ahli Rajin' : 'The Diligent Expert',
      desc: language === 'id' ? 'Mainkan minigame apa saja 3 kali.' : 'Play any minigame 3 times.',
      reward: 50,
      progress: Math.min(userData?.dailyStats?.[today]?.gamesPlayed || 0, 3),
      max: 3,
      completed: userData?.claimedQuests?.[today]?.includes('play_three')
    }
  ];

  const handleClaim = async (questId: string, reward: number) => {
    if (!user?.uid || claiming) return;
    try {
      playClick();
      setClaiming(questId);
      const userRef = doc(db, 'users', user.uid);
      
      await updateDoc(userRef, {
        totalCoins: increment(reward),
        [`claimedQuests.${today}`]: arrayUnion(questId)
      });
      
      playWin();
      triggerToast(language === 'id' ? `Berhasil klaim +${reward} Koin!` : `Successfully claimed +${reward} Coins!`, 'success');
    } catch (e) {
      console.error(e);
      triggerToast(language === 'id' ? `Gagal mengklaim misi.` : `Failed to claim quest.`, 'error');
    } finally {
      setClaiming(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 font-poppins text-slate-800">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
      >
        <div className="p-5 sm:p-6 sm:pb-5 border-b border-slate-100 flex justify-between items-start bg-gradient-to-r from-blue-50 to-indigo-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center border border-blue-200 shrink-0">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight leading-tight">
                {language === 'id' ? 'Misi Harian' : 'Daily Quests'}
              </h2>
              <p className="text-xs font-medium text-slate-500 mb-1">
                {language === 'id' ? 'Selesaikan untuk koin setiap hari!' : 'Complete them for coins every day!'}
              </p>
              <div className="flex items-center gap-1 mt-0.5 text-[10px] sm:text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200 w-fit">
                <Clock className="w-3 h-3" />
                <span>{language === 'id' ? 'Selesai dalam:' : 'Resets in:'} {timeLeft}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => { playClick(); onClose(); }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {quests.map((q) => {
            const isFinished = q.progress >= q.max;
            
            return (
              <div key={q.id} className={`bg-white rounded-2xl p-4 border transition-all ${q.completed ? 'border-emerald-200 bg-emerald-50/30' : isFinished ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200'}`}>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight mb-1 truncate">
                      {q.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      {q.desc}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden w-full max-w-[200px] mb-1.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(q.progress / q.max) * 100}%` }}
                        className={`absolute top-0 left-0 h-full ${q.completed ? 'bg-emerald-400' : 'bg-blue-500'} rounded-full`}
                      />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 tracking-wide">
                      {q.progress} / {q.max}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center shrink-0 w-24">
                    <div className="flex items-center gap-1 mb-2 text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded-lg text-sm border border-amber-100">
                      <span>+{q.reward}</span>
                    </div>
                    
                    {q.completed ? (
                      <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        {language === 'id' ? 'Diklaim' : 'Claimed'}
                      </div>
                    ) : isFinished ? (
                      <button 
                        onClick={() => handleClaim(q.id, q.reward)}
                        disabled={claiming === q.id}
                        className="w-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-bold py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
                      >
                        {claiming === q.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        {language === 'id' ? 'Klaim' : 'Claim'}
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="w-full bg-slate-100 text-slate-400 text-xs font-bold py-2 rounded-xl border border-slate-200 cursor-not-allowed"
                      >
                        {language === 'id' ? 'Belum Tuntas' : 'Unfinished'}
                      </button>
                    )}
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
