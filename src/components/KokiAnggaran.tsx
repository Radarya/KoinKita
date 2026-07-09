import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Clock, Utensils, CheckCircle2, ArrowLeft, Loader2, Coins, Settings } from 'lucide-react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { playCorrect, playWrong, playLose, playWin, playClick, setGameViewTrack, subscribeToPause } from '../lib/audio';
import { useTranslation } from '../lib/LanguageContext';

import { SettingsModal } from './SettingsModal';
import { LEVEL_ORDERS, EMERGENCY_SCENARIOS } from './KokiAnggaranData';

// KEBUTUHAN (Needs), KEINGINAN (Wants), or TABUNGAN (Savings)
const OVEN_POTS = [
  { id: 'KEBUTUHAN', name: 'Kebutuhan', name_en: 'Needs', icon: '🛒', color: 'bg-emerald-500 hover:bg-emerald-600', ring: 'ring-emerald-200' },
  { id: 'KEINGINAN', name: 'Keinginan', name_en: 'Wants', icon: '🎮', color: 'bg-amber-500 hover:bg-amber-600', ring: 'ring-amber-200' },
  { id: 'TABUNGAN', name: 'Tabungan', name_en: 'Savings', icon: '🐷', color: 'bg-blue-500 hover:bg-blue-600', ring: 'ring-blue-200' }
];

interface KokiAnggaranProps {
  user: any;
  userData?: any;
  onBack: () => void;
}

export default function KokiAnggaran({ user, userData, onBack }: KokiAnggaranProps) {
  const { language } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Game Stats
  const [score, setScore] = useState(0);
  const scoreRef = React.useRef(score);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  
  const [hearts, setHearts] = useState(3);
  const [gameTimer, setGameTimer] = useState(0);
  
  // Emergency Events Logic
  const [savingsCount, setSavingsCount] = useState(0);
  const [emergencyTriggered, setEmergencyTriggered] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyStatus, setEmergencyStatus] = useState<'SAVED' | 'PENALIZED' | null>(null);
  const [emergencyCountdown, setEmergencyCountdown] = useState(5);
  
  // Difficulty System
  const [timeLimit, setTimeLimit] = useState(5); // Start with 5 seconds per order
  const [timeLeft, setTimeLeft] = useState(5);
  
  // Real level
  const displayCoins = userData?.totalCoins || userData?.coins || 0;
  const playerLevel = userData?.league !== undefined ? userData?.league : 0;
  
  // Current Order
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [shuffledOrders, setShuffledOrders] = useState<typeof LEVEL_ORDERS[0]>([]);
  
  const [currentScenario, setCurrentScenario] = useState<any>(null);
  
  // Visual Effects
  const [activePot, setActivePot] = useState<string | null>(null);
  const [screenShake, setScreenShake] = useState(false);
  const [particle, setParticle] = useState<{ id: number, text: string, type: 'success' | 'warn' } | null>(null);
  const [particleId, setParticleId] = useState(0);

  const [showSettings, setShowSettings] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setGameViewTrack('koki-anggaran');
    const unsub = subscribeToPause((paused) => setIsPaused(paused));
    return () => unsub();
  }, []);
  
  const currentOrder = shuffledOrders[currentOrderIndex];
  
  const isFrenzy = gameTimer >= 20 && gameTimer < 30;

  useEffect(() => {
    let limit = Math.max(3, 5 - playerLevel * 0.4); // Starts tighter at higher player levels (eg 3 sec at level 5)
    if (score >= 200) limit = Math.max(1.5, limit - 1.5);
    else if (score >= 100) limit = Math.max(1.8, limit - 1.0);
    else if (score >= 50) limit = Math.max(2.2, limit - 0.5);
    
    if (isFrenzy) limit = limit / 2;
    
    setTimeLimit(limit);
  }, [score, isFrenzy, playerLevel]);

  // Overall Game Timer
  useEffect(() => {
    if (!isPlaying || gameOver || gameWon || showEmergencyModal || isPaused) return;
    const timer = setInterval(() => {
      setGameTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, gameOver, gameWon, showEmergencyModal, isPaused]);

  // Emergency Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showEmergencyModal && !isPaused) {
      setEmergencyCountdown(5);
      interval = setInterval(() => {
        setEmergencyCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showEmergencyModal, isPaused]);

  const getLevelBadgeName = (lvl: number) => {
    switch (lvl) {
      case 5: return language === 'id' ? 'Master Kekayaan 👑' : 'Wealth Master 👑';
      case 4: return language === 'id' ? 'Ahli Anggaran 💎' : 'Budget Expert 💎';
      case 3: return language === 'id' ? 'Investor Cerdas 🏅' : 'Smart Investor 🏅';
      case 2: return language === 'id' ? 'Bijak Belanja 🥇' : 'Wise Spender 🥇';
      case 1: return language === 'id' ? 'Sadar Finansial 🥈' : 'Financially Aware 🥈';
      default: return language === 'id' ? 'Pemula 🥉' : 'Beginner 🥉';
    }
  };

  // Start Game
  const startGame = () => {
    setScore(0);
    setHearts(3);
    setGameTimer(0);
    setSavingsCount(0);
    setEmergencyTriggered(false);
    setShowEmergencyModal(false);
    setEmergencyStatus(null);
    const initialLimit = Math.max(3, 5 - (playerLevel) * 0.4);
    setTimeLimit(initialLimit);
    setTimeLeft(initialLimit);
    setIsPlaying(true);
    setGameOver(false);
    setGameWon(false);
    
    // Select exactly 5 orders per game session for high playability/scarcity
    const pool = LEVEL_ORDERS[playerLevel] || LEVEL_ORDERS[0];
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 5);
    setShuffledOrders(shuffled);
    setCurrentOrderIndex(0);
    setCurrentScenario(EMERGENCY_SCENARIOS[Math.floor(Math.random() * EMERGENCY_SCENARIOS.length)]);
  };

  // Timer Effect (per order)
  useEffect(() => {
    if (!isPlaying || gameOver || gameWon || showEmergencyModal || isPaused) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          // Time out! Lose a heart, move to next order
          handleTimeout();
          return timeLimit;
        }
        return prev - 0.1;
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, [isPlaying, gameOver, gameWon, showEmergencyModal, timeLimit, isPaused]);

  const handleTimeout = () => {
    triggerShake();
    setHearts(prev => {
      if (prev <= 1) {
        endGame();
        return 0;
      }
      return prev - 1;
    });
    nextOrder();
  };
  
  const triggerShake = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);
  };

  const showParticle = (text: string, type: 'success' | 'warn') => {
    setParticle({ id: Date.now(), text, type });
    setTimeout(() => setParticle(null), 1000);
  };

  // Handle Answer
  const handleCategorySelect = (selectedType: string) => {
    if (gameOver || gameWon || !currentOrder) return;
    
    if (selectedType === currentOrder.type) {
      // Correct
      playCorrect();
      if (selectedType === 'TABUNGAN') {
        setSavingsCount(prev => prev + 1);
      }
      const points = isFrenzy ? 20 : 10;
      setScore(prev => prev + points);
      setActivePot(selectedType);
      setTimeout(() => setActivePot(null), 500);
      showParticle(isFrenzy ? `+${points} FRENZY!` : `+${points} ${language === 'id' ? "Mantap!" : "Awesome!"}`, 'success');
      nextOrder();
    } else {
      // Wrong
      playWrong();
      setScore(prev => Math.max(0, prev - 5));
      triggerShake();
      showParticle("-5 Oops!", 'warn');
      setHearts(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
      nextOrder();
    }
  };

  const handleCloseEmergencyModal = () => {
    setShowEmergencyModal(false);
    if (currentOrderIndex + 1 >= shuffledOrders.length) {
      handleVictory();
    } else {
      setCurrentOrderIndex(prev => prev + 1);
      setTimeLeft(timeLimit);
    }
  };

  const nextOrder = () => {
    if (!gameOver && !gameWon) {
      if (currentOrderIndex === 2 && !emergencyTriggered) {
        setEmergencyTriggered(true);
        if (savingsCount > 0) {
          setEmergencyStatus('SAVED');
        } else {
          setEmergencyStatus('PENALIZED');
          setScore(prev => Math.max(0, prev - 40));
          setHearts(prev => Math.max(1, prev - 1));
        }
        setShowEmergencyModal(true);
      } else if (currentOrderIndex + 1 >= shuffledOrders.length) {
        handleVictory();
      } else {
        setCurrentOrderIndex(prev => prev + 1);
        setTimeLeft(timeLimit); // Reset timer for next order
      }
    }
  };

  const handleVictory = async () => {
    playWin();
    setGameWon(true);
    setIsPlaying(false);
    
    const finalScore = scoreRef.current;
    if (user?.uid && finalScore > 0) {
      setIsSaving(true);
      try {
        const docRef = doc(db, 'users', user.uid);
        await import("../lib/rewardUtils").then(m => m.rewardUser(user.uid, userData?.leagueGroupId, finalScore));
      } catch (err) {
        console.warn("Gagal menyimpan skor kemenangan Koki Anggaran:", err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const endGame = async () => {
    playLose();
    setGameOver(true);
    setIsPlaying(false);
    
    const finalScore = scoreRef.current;
    if (user?.uid && finalScore > 0) {
      setIsSaving(true);
      try {
        const docRef = doc(db, 'users', user.uid);
        await import("../lib/rewardUtils").then(m => m.rewardUser(user.uid, userData?.leagueGroupId, finalScore));
      } catch (err) {
        console.warn("Gagal menyimpan skor Koki Anggaran:", err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (gameWon) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl text-center border-2 border-amber-300 overflow-hidden relative"
        >
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-amber-100 border-4 border-amber-400 rounded-full flex items-center justify-center mb-6 shadow-lg animate-bounce">
              <span className="text-4xl">👨‍🍳</span>
            </div>

            <h2 className="text-3xl font-poppins font-black text-amber-600 mb-2">
              {language === 'id' ? "Sajian Sempurna!" : "Perfect Budget Dish!"}
            </h2>
            <p className="text-slate-500 font-semibold text-sm mb-6 max-w-[250px] leading-relaxed mx-auto">
              {language === 'id' 
                ? "Selamat! Kamu berhasil menyajikan seluruh 5 menu anggaran keuangan dengan gizi terbaik!" 
                : "Great work! You successfully prepared all 5 core budget menus with immaculate details!"}
            </p>
            
            <div className="bg-emerald-50 rounded-2xl p-6 mb-6 border border-emerald-100 flex flex-col items-center w-full">
              <div className="flex justify-between w-full mb-3 pb-3 border-b border-emerald-200/50">
                <div className="text-left">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    {language === 'id' ? "Liga Koki" : "Chef League"}
                  </p>
                  <p className="text-base font-black text-slate-800 font-poppins flex flex-col items-start leading-tight mt-0.5">
                    <span>{language === 'id' ? 'Liga' : 'League'} {playerLevel}</span>
                    <span className="text-[11px] text-emerald-600 font-black mt-0.5">{getLevelBadgeName(playerLevel)}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    {language === 'id' ? "Bonus Koin" : "Coins Won"}
                  </p>
                  <p className="text-lg font-bold text-emerald-600 font-poppins">{score}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-bold bg-emerald-100/50 rounded-full px-4 py-1.5 text-xs">
                <Coins className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>
                  {language === 'id' ? `+ ${score} Koin berhasil didapatkan!` : `+ ${score} Coins successfully earned!`}
                </span>
              </div>
            </div>

            <div className="space-y-3 w-full">
              <button 
                onClick={startGame}
                disabled={isSaving}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-2xl shadow-lg transition-transform active:scale-95 flex justify-center items-center gap-2 cursor-pointer border-b-[3px] border-emerald-700 hover:border-emerald-700/50 active:border-b-0 active:translate-y-[3px]"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (language === 'id' ? 'Main Lagi' : 'Play Again')}
              </button>
              <button 
                onClick={onBack}
                disabled={isSaving}
                className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all cursor-pointer text-sm"
              >
                {language === 'id' ? "Kembali ke Dashboard" : "Back to Dashboard"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border overflow-hidden relative"
        >
          {/* Confetti or decorative background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200 via-transparent to-transparent"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-poppins font-black text-slate-800 mb-2">
              {language === 'id' ? "Piring Kosong!" : "Empty Plate!"}
            </h2>
            <p className="text-slate-500 font-medium mb-6">
              {language === 'id' ? "Waktu memasak sudah habis atau energimu habis." : "Cooking time or your energy has run out."}
            </p>
            
            <div className="bg-amber-50 rounded-2xl p-6 mb-6 border border-amber-100">
              <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">
                {language === 'id' ? "Skor Koki" : "Chef Score"}
              </p>
              <p className="text-5xl font-black text-amber-600 font-poppins drop-shadow-sm">{score}</p>
              <div className="flex items-center justify-center gap-1 mt-2 text-amber-700 font-medium bg-amber-100/50 rounded-full inline-flex px-3 py-1 text-xs">
                <Coins className="w-3 h-3" />
                <span>
                  {language === 'id' ? "Koin berhasil ditambahkan ke dompetmu!" : "Coins successfully added to your wallet!"}
                </span>
              </div>
            </div>

            <p className="text-emerald-600 font-bold mb-8">
              {score > 100 
                ? (language === 'id' ? "Luar biasa! Kamu adalah Master Koki Anggaran!" : "Spectacular! You are a Master Budget Chef!") 
                : score > 50 
                  ? (language === 'id' ? "Bagus sekali! Pengelolaan uangmu cukup sehat." : "Wonderful job! Your financial management is quite healthy.") 
                  : (language === 'id' ? "Jangan menyerah! Ayo latih insting belanja dan nabungmu lagi." : "Don't give up! Let's practice your shopping and saving instincts again.")}
            </p>

            <div className="space-y-3">
              <button 
                onClick={startGame}
                disabled={isSaving}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-colors flex justify-center items-center gap-2"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (language === 'id' ? 'Main Lagi' : 'Play Again')}
              </button>
              <button 
                onClick={onBack}
                disabled={isSaving}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
              >
                {language === 'id' ? "Kembali ke Dashboard" : "Back to Dashboard"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Pre-game screen
  if (!isPlaying && !gameOver) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border border-emerald-100"
        >
          <button onClick={onBack} className="p-2 -ml-2 mb-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors inline-block animate-pulse">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-emerald-100 rounded-2xl">
              <Utensils className="w-12 h-12 text-emerald-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-poppins font-bold text-center text-slate-800 mb-2">
            {language === 'id' ? "Koki Anggaran" : "Budget Chef"}
          </h1>
          <p className="text-center text-slate-500 mb-8 font-medium">
            {language === 'id' 
              ? "Jadi ahli keuangan! Kelompokkan pesanan belanja ke panci yang tepat sebelum waktu habis." 
              : "Become a financial expert! Categorize shopping orders into the right pot before time runs out."}
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <p className="text-sm text-slate-600">
                <strong className={`text-emerald-700`}>{language === 'id' ? "Kebutuhan:" : "Needs:"}</strong>{" "}
                {language === 'id' ? "Hal yang wajib dibayar (makan, tagihan)." : "Essential items you must pay for (food, bills)."}
              </p>
            </div>
            <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-sm text-slate-600">
                <strong className={`text-amber-700`}>{language === 'id' ? "Keinginan:" : "Wants:"}</strong>{" "}
                {language === 'id' ? "Hal yang bisa ditunda (jajan, mainan)." : "Optional/flexible comfort items (snacks, hobbies)."}
              </p>
            </div>
            <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-sm text-slate-600">
                <strong className={`text-blue-700`}>{language === 'id' ? "Tabungan:" : "Savings:"}</strong>{" "}
                {language === 'id' ? "Uang disisihkan untuk masa depan." : "Money set aside or invested for the future."}
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => {
              playClick();
              setShowTutorial(true);
            }}
            className="w-full py-4 bg-gradient-to-b from-emerald-400 to-emerald-600 text-white font-black text-lg rounded-xl shadow-[0_8px_16px_-6px_rgba(16,185,129,0.5)] active:scale-[0.98] transition-all border-b-[3px] border-emerald-700 hover:border-emerald-700/50 active:border-b-0 active:translate-y-[3px]"
          >
            {language === 'id' ? "Masuk ke Dapur!" : "Enter Kitchen!"}
          </button>
        </motion.div>
 
        {/* Tutorial Overlays */}
        <AnimatePresence>
          {showTutorial && (
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
                className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-emerald-100 overflow-hidden relative text-center"
              >
                <div className="absolute top-0 left-0 bg-emerald-500 h-2 w-full"></div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                    <Utensils className="w-10 h-10 text-emerald-600 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-poppins font-black text-slate-800 mb-1">
                    {language === 'id' ? "Resep Koki Anggaran" : "Budget Chef Guidebook"}
                  </h3>
                  <p className="text-slate-400 text-xs font-semibold mb-6">
                    {language === 'id' ? "Pilah alur belanja dengan formula 50/30/20!" : "Sort out expenses with standard 50/30/20 proportions!"}
                  </p>
 
                  <div className="space-y-4 text-left w-full mb-8">
                    <div className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {language === 'id' 
                          ? "Baca rincian pesanan pengeluaran yang muncul di bagian atas layar." 
                          : "Read through household item descriptions appearing at the top center."}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {language === 'id' 
                          ? "Pilih wadah panci yang pas: Panci hijau KEBUTUHAN, panci kuning KEINGINAN, atau panci biru TABUNGAN." 
                          : "Tap matching pots: Green for NEEDS, Amber for WANTS, or Blue for SAVINGS."}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {language === 'id' 
                          ? "Loloskan 5 sajian anggaran berturut-turut untuk membuktikan kejeniusan finansialmu!" 
                          : "Successfully complete 5 entries to prove your ultimate budget mastering instincts!"}
                      </p>
                    </div>
                  </div>
 
                  <button 
                    onClick={() => {
                      playClick();
                      setShowTutorial(false);
                      startGame();
                    }}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:translate-y-[2px] transition-all cursor-pointer border-b-[3px] border-emerald-700 hover:scale-[1.01]"
                  >
                    {language === 'id' ? "Mulai Main!" : "Start Cook!"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Active Game screen
  return (
    <div className={`min-h-screen ${isFrenzy ? 'bg-red-50' : 'bg-emerald-50'} flex flex-col font-sans transition-colors duration-500`}>
      {/* Top HUD */}
      <header className={`${isFrenzy ? 'bg-red-100 border-red-200' : 'bg-white border-emerald-100'} p-4 shadow-sm flex items-center justify-between border-b sticky top-0 z-10 transition-colors duration-500`}>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart 
                key={i} 
                className={`w-5 h-5 ${i < hearts ? 'text-red-500 fill-red-500 drop-shadow-sm' : 'text-slate-200 fill-slate-200'}`} 
                
              />
            ))}
          </div>
        </div>
        
        <div className="text-center font-bold font-poppins text-slate-700 flex items-center gap-4">
          {isFrenzy && <span className="text-red-600 animate-pulse text-xs uppercase tracking-widest bg-red-200 px-2 py-1 rounded">FRENZY!</span>}
          <span>{language === 'id' ? "Skor:" : "Score:"} <span className="text-amber-500 text-xl">{score}</span></span>
          <button 
            onClick={() => { playClick(); setShowSettings(true); }}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0 ml-2"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        isGameMode={true}
        onExitGame={() => setGameOver(true)}
      />

      {/* Timer Bar */}
      <div className="w-full bg-slate-200 h-2">
        <div 
          className={`h-full transition-all duration-100 ease-linear ${timeLeft <= timeLimit * 0.3 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : isFrenzy ? 'bg-amber-500' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}
          style={{ width: `${(Math.max(0, timeLeft) / timeLimit) * 100}%` }}
        ></div>
      </div>

      <main className={`flex-grow flex flex-col items-center justify-center p-6 relative overflow-hidden ${screenShake ? 'animate-shake' : ''}`}>
        {/* Decorative Kitchen Background Objects */}
        <div className="absolute top-10 left-10 opacity-5">
           <Utensils className="w-32 h-32" />
        </div>

        <AnimatePresence>
          {particle && (
            <motion.div
              key={particle.id}
              initial={{ opacity: 1, y: 0, scale: 0.5 }}
              animate={{ opacity: 0, y: -100, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className={`absolute top-1/4 z-50 text-2xl font-black font-poppins drop-shadow-lg ${particle.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}
            >
              {particle.text}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Order Card */}
        <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${isFrenzy ? 'text-red-400' : 'text-slate-400'}`}>
          {language === 'id' ? "Pesanan Masuk" : "Incoming Order"}
        </p>
        
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentOrderIndex}
            initial={{ scale: 0.8, opacity: 0, y: 50, rotate: -2 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50, rotate: 2 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className={`bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-xl border-2 ${currentOrder?.type === 'TRAP' ? 'border-red-400 shadow-red-200/50' : 'border-emerald-100'} text-center mb-12 relative z-10`}
          >
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm text-xl">
              {currentOrder?.type === 'TRAP' ? '💀' : '🧾'}
            </div>
            <h2 className={`text-2xl font-bold font-poppins leading-snug ${currentOrder?.type === 'TRAP' ? 'text-red-600' : 'text-slate-800'}`}>
              "{language === 'id' ? currentOrder?.text : currentOrder?.text_en}"
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Pots (Buttons) */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-md pb-4">
          {OVEN_POTS.map((pot) => (
            <motion.button
              whileTap={{ scale: 0.9 }}
              key={pot.id}
              onClick={() => handleCategorySelect(pot.id)}
              className={`${pot.color} ${activePot === pot.id ? 'animate-bounce' : ''} focus:outline-none focus:ring-4 ${pot.ring} text-white rounded-3xl p-4 shadow-[0_8px_0_rgba(0,0,0,0.15)] flex flex-col items-center justify-center transition-transform active:translate-y-2 active:shadow-[0_0_0_rgba(0,0,0,0.15)] relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <span className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform block">{pot.icon}</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-tight">
                {language === 'id' ? pot.name : pot.name_en}
              </span>
            </motion.button>
          ))}
        </div>

        {/* special button for trap */}
        <div className="w-full max-w-md pt-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategorySelect('TRAP')}
              className="w-full bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-200 text-white rounded-2xl p-4 shadow-[0_8px_0_rgba(0,0,0,0.15)] font-bold text-center uppercase tracking-widest transition-transform active:translate-y-2 active:shadow-[0_0_0_rgba(0,0,0,0.15)]"
            >
              {language === 'id' ? "BUANG SCAM! 🗑️" : "DISCARD SCAM! 🗑️"}
            </motion.button>
        </div>

        {/* Mid-Game Emergency Event Modal */}
        <AnimatePresence>
          {showEmergencyModal && (
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
                className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden relative text-center"
              >
                {emergencyStatus === 'SAVED' ? (
                  <>
                    <div className="absolute top-0 left-0 bg-emerald-500 h-2 w-full"></div>
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                      <span className="text-3xl">🩺</span>
                    </div>
                    <h3 className="text-xl font-poppins font-black text-slate-800 mb-2">
                      {language === 'id' ? currentScenario?.id_title || "Keadaan Darurat! 🚑" : currentScenario?.en_title || "Emergency Event! 🚑"}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
                      {language === 'id' 
                        ? currentScenario?.id_desc_safe || "Untungnya, kamu disiplin mengalokasikan dana ke Panci Tabungan." 
                        : currentScenario?.en_desc_safe || "Fortunately, you disciplined yourself by allocating money to the Savings Pot."}
                    </p>
                    <div className="bg-emerald-50 rounded-2xl p-4 mb-6 border border-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2">
                      <span>✅ {language === 'id' ? (currentScenario?.id_safe || "Aman - Memiliki Dana Darurat") : (currentScenario?.en_safe || "Secure - Emergency Fund Maintained")}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute top-0 left-0 bg-red-500 h-2 w-full"></div>
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-pulse">
                      <span className="text-3xl">⚠️</span>
                    </div>
                    <h3 className="text-xl font-poppins font-black text-rose-600 mb-2">
                      {language === 'id' ? currentScenario?.id_title || "Bencana Darurat! 💸" : currentScenario?.en_title || "Emergency Crisis! 💸"}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
                      {language === 'id' 
                        ? currentScenario?.id_desc_danger || "Karena kamu TIDAK mengalokasikan uang ke Panci Tabungan, kamu terkena masalah finansial."
                        : currentScenario?.en_desc_danger || "Since you did NOT allocate money to the Savings Pot, you face a major financial crisis."}
                    </p>
                    <div className="bg-red-50 rounded-2xl p-4 mb-6 border border-red-100 text-red-800 font-extrabold text-xs flex flex-col justify-center gap-1.5 shadow-inner">
                      <span>🚨 {language === 'id' ? (currentScenario?.id_danger ? currentScenario.id_danger + " (-40 & \u2764\uFE0F-1)" : "Pinalti: Skor -40 & Nyawa -1") : (currentScenario?.en_danger ? currentScenario.en_danger + " (-40 & \u2764\uFE0F-1)" : "Penalty: Score -40 & Life -1")}</span>
                    </div>
                  </>
                )}

                <button 
                  onClick={handleCloseEmergencyModal}
                  disabled={emergencyCountdown > 0}
                  className={`w-full py-4 text-white font-extrabold text-base rounded-2xl shadow-lg transition-all active:translate-y-[2px] border-b-[3px] ${
                    emergencyCountdown > 0 
                      ? 'bg-slate-400 border-slate-500 cursor-not-allowed opacity-80 text-slate-100'
                      : emergencyStatus === 'SAVED' 
                        ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-700 cursor-pointer' 
                        : 'bg-red-500 hover:bg-red-600 border-red-700 cursor-pointer'
                  }`}
                >
                  {emergencyCountdown > 0 ? (
                    language === 'id' 
                      ? `Tolong Baca Dahulu (${emergencyCountdown}s)` 
                      : `Please Read Carefully (${emergencyCountdown}s)`
                  ) : (
                    language === 'id' ? "Pahami Pelajaran" : "Understand Lesson"
                  )}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
