import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShieldCheck, AlertTriangle, ArrowLeft, Loader2, Coins, Clock, Smartphone, Mail, MessageCircle, Info, CheckCircle2 } from 'lucide-react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { playCorrect, playWrong, playLose, playWin, playClick, setGameViewTrack, subscribeToPause } from '../lib/audio';
import { vibrateLight, vibrateMedium, vibrateHeavy, vibrateSuccess, vibrateError } from '../lib/haptics';
import { useTranslation } from '../lib/LanguageContext';

import { SettingsModal } from './SettingsModal';
import PauseOverlay from './PauseOverlay';
import { LEVEL_SCENARIOS } from './DetektifCuanData';
import { Settings } from 'lucide-react';

interface Scenario {
  id: number;
  type: 'AMAN' | 'BAHAYA';
  platform: 'SMS' | 'WhatsApp' | 'Email';
  sender: string;
  sender_en?: string;
  message: string;
  message_en?: string;
  link?: string;
  explanation: string;
  explanation_en?: string;
  verified?: boolean;
}

const LITERACY_TIPS = [
  "Jangan pernah bagi kode OTP (One Time Password) ke siapapun, termasuk ke orang yang ngaku pegawai bank!",
  "Cek selalu alamat web (URL) sebelum login. Bank resmi tidak menggunakan domain gratisan.",
  "Dapat SMS undian berhadiah dari nomor HP biasa? 99.9% itu penipuan.",
  "Sia-sia punya password yang susah ditebak kalau kamu gampang ditipu lewat chat (Social Engineering).",
  "Hati-hati dengan file APK yang dikirim via WhatsApp! Itu bisa meretas/mengintip SMS kamu untuk mencuri OTP."
];

const LITERACY_TIPS_EN = [
  "Never share your OTP (One Time Password) with anyone, not even bank employees!",
  "Always check the web address (URL) before logging in. Official banks never use free dynamic domains.",
  "Received a grand prize promo text from an ordinary personal mobile number? 99.9% it is scam.",
  "A hard password is useless if you are easily manipulated by chat messages (Social Engineering).",
  "Beware of APK file payloads delivered through WhatsApp! They can steal your SMS credentials to compromise banking ports."
];

interface DetektifCuanProps {
  user: any;
  userData?: any;
  onBack: () => void;
}

export default function DetektifCuan({ user, userData, onBack }: DetektifCuanProps) {
  const { language } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [combo, setCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [screenShake, setScreenShake] = useState(false);
  const hasMistake = React.useRef(false);
  
  const [shuffledScenarios, setShuffledScenarios] = useState<Scenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentScenario = shuffledScenarios[currentIndex];

  const displayCoins = userData?.totalCoins || userData?.coins || 0;
  const playerLevel = userData?.league !== undefined ? userData?.league : 0;
  const baseTime = Math.max(4, 7 - playerLevel * 0.5); // Starts tighter at higher levels eg 4.5 sec at lvl 5
  const TIME_LIMIT = Math.max(2.5, baseTime - (correctCount * 0.5));
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  // Ref flag to signal timeout without side-effects inside the setState updater
  const timeoutFiredRef = React.useRef(false);

  
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
  
  const [showSettings, setShowSettings] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setGameViewTrack('detektif-cuan');
    const unsub = subscribeToPause((paused) => setIsPaused(paused));
    return () => unsub();
  }, []);

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

  const getLevelBasedTime = () => {
    // Timer shrinks based on player level (Lvl 0 = 8s, Lvl 5 = 3s)
    return Math.max(3.0, 8.0 - (playerLevel) * 1.0);
  };

  const startGame = () => {
    setScore(0);
    setHearts(3);
    setIsPlaying(true);
    setGameOver(false);
    setGameWon(false);
    setIsAnswered(false);
    setFeedback(null);
    setCombo(0);
    setCorrectCount(0);
    
    // Shuffle and pick exactly 5 questions per session based on the player's level
    const userLvl = Math.min(5, Math.max(0, playerLevel));
    const pool = LEVEL_SCENARIOS[userLvl] || LEVEL_SCENARIOS[0];
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 5);
    setShuffledScenarios(shuffled);
    setCurrentIndex(0);
    setTimeLeft(getLevelBasedTime());
  };

  useEffect(() => {
    if (!isPlaying || gameOver || gameWon || isAnswered || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          // Signal timeout — pure updater, no side-effects
          timeoutFiredRef.current = true;
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isPlaying, gameOver, gameWon, isAnswered, isPaused]);

  // Consume timeout flag — fires once after render, not inside updater
  useEffect(() => {
    if (timeoutFiredRef.current) {
      timeoutFiredRef.current = false;
      handleTimeout();
    }
  });

  const triggerShake = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);
  };

  const handleTimeout = () => {
    setIsAnswered(true);
    setFeedback('WRONG');
    triggerShake();
    setCombo(0);
    
    // Falling for phishing via timeout: Heavy penalty of -25 score/coins
    if (shuffledScenarios[currentIndex]?.type === 'BAHAYA') {
      setScore(prev => Math.max(0, prev - 25));
    } else {
      setScore(prev => Math.max(0, prev - 10));
    }
    
    handleLifeLoss();
  };

  const handleLifeLoss = () => {
    hasMistake.current = true;
    setTimeout(() => {
      setHearts(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
      if (hearts > 1) {
        nextScenario();
      }
    }, 2500);
  };

  const handleAnswer = (choice: 'AMAN' | 'BAHAYA') => {
    if (isAnswered || !currentScenario) return;
    
    setIsAnswered(true);
    if (choice === currentScenario.type) {
      playCorrect();
      if (combo + 1 >= 3) vibrateHeavy();
      else vibrateMedium();
      setFeedback('CORRECT');
      setCombo(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
      
      let multiplier = 1;
      if (combo + 1 >= 6) multiplier = 3;
      else if (combo + 1 >= 3) multiplier = 2;
      
      const maxTimeLimit = getLevelBasedTime();
      const pointGained = (timeLeft >= maxTimeLimit / 2 ? 10 : 5) * multiplier;
      setScore(prev => prev + pointGained);
      setTimeout(() => {
        nextScenario();
      }, 2500);
    } else {
      playWrong();
      vibrateError();
      setFeedback('WRONG');
      setCombo(0);
      triggerShake();
      
      // Introduce a heavy coin penalty if the user clicks a scam/phishing option (choice is AMAN on a BAHAYA scenario)
      if (currentScenario.type === 'BAHAYA' && choice === 'AMAN') {
        setScore(prev => Math.max(0, prev - 25)); // Heavy penalty
      } else {
        setScore(prev => Math.max(0, prev - 10)); // Standard penalty
      }
      
      handleLifeLoss();
    }
  };

  const nextScenario = () => {
    // Check game won logic (Completed 5 questions per game session)
    if (currentIndex + 1 >= shuffledScenarios.length) {
      handleVictory();
    } else {
      setCurrentIndex(prev => prev + 1);
      setIsAnswered(false);
      setFeedback(null);
      setTimeLeft(getLevelBasedTime());
    }
  };

  const handleVictory = async () => {
    playWin();
    vibrateSuccess();
    setGameWon(true);
    setIsPlaying(false);
    
    if (user?.uid) {
      if (hasMistake.current) {
        await import("../lib/rewardUtils").then(m => m.changeUserLives(user.uid, -1));
      }
      if (score > 0) {
        setIsSaving(true);
        try {
          const docRef = doc(db, 'users', user.uid);
          await import("../lib/rewardUtils").then(m => m.rewardUser(user.uid, userData?.leagueGroupId, score));
        } catch (err) {
          console.warn("Gagal update score on victory:", err);
        } finally {
          setIsSaving(false);
        }
      }
    }
  };

  const endGame = async () => {
    playLose();
    vibrateHeavy();
    setGameOver(true);
    setIsPlaying(false);
    
    if (user?.uid) {
      if (hasMistake.current) {
        await import("../lib/rewardUtils").then(m => m.changeUserLives(user.uid, -1));
      }
      if (score > 0) {
        setIsSaving(true);
        try {
          const docRef = doc(db, 'users', user.uid);
          await import("../lib/rewardUtils").then(m => m.rewardUser(user.uid, userData?.leagueGroupId, score));
        } catch (err) {
          console.warn("Gagal update score:", err);
        } finally {
          setIsSaving(false);
        }
      }
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'WhatsApp': return <MessageCircle className="w-5 h-5 text-emerald-500" />;
      case 'Email': return <Mail className="w-5 h-5 text-blue-500" />;
      default: return <MessageCircle className="w-5 h-5 text-slate-500" />;
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
              <span className="text-4xl">🏆</span>
            </div>

            <h2 className="text-3xl font-poppins font-black text-amber-600 mb-2">
              {language === 'id' ? "Kasus Dipecahkan!" : "Case Solved!"}
            </h2>
            <p className="text-slate-500 font-semibold text-sm mb-6 max-w-[250px] leading-relaxed mx-auto">
              {language === 'id' 
                ? "Selamat! Kamu berhasil memecahkan semua 5 teka-teki phishing dengan presisi!" 
                : "Great work! You successfully solved all 5 security scenarios with perfect precision!"}
            </p>
            
            <div className="bg-emerald-50 rounded-2xl p-6 mb-6 border border-emerald-100 flex flex-col items-center w-full">
              <div className="flex justify-between w-full mb-3 pb-3 border-b border-emerald-200/50">
                <div className="text-left">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    {language === 'id' ? "Pangkat Detektif" : "Detective Rank"}
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
                  {language === 'id' ? `+ ${score} Koin berhasil ditambahkan!` : `+ ${score} Coins added successfully!`}
                </span>
              </div>
            </div>

            <div className="space-y-3 w-full">
              <button 
                onClick={startGame}
                disabled={isSaving}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-2xl shadow-lg transition-transform active:scale-95 flex justify-center items-center gap-2 cursor-pointer border-b-[3px] border-emerald-700 hover:border-emerald-700/50 active:border-b-0 active:translate-y-[3px]"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (language === 'id' ? 'Mulai Investigasi Baru' : 'Start New Investigation')}
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
    const tipsArray = language === 'id' ? LITERACY_TIPS : LITERACY_TIPS_EN;
    const randomTip = tipsArray[Math.floor(Math.random() * tipsArray.length)];
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border overflow-hidden relative"
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-200 via-transparent to-transparent"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-poppins font-black text-slate-800 mb-2">
              {language === 'id' ? "Kasus Ditutup!" : "Case Closed!"}
            </h2>
            <p className="text-slate-500 font-medium mb-6">
              {language === 'id' ? "Kamu telah menginvestigasi banyak kasus." : "You have investigated many cases."}
            </p>
            
            <div className="bg-emerald-50 rounded-2xl p-6 mb-6 border border-emerald-100 flex flex-col items-center">
              <div className="flex justify-between w-full mb-3 pb-3 border-b border-emerald-200/50">
                <div className="text-left">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    {language === 'id' ? "Liga Intelijen" : "Intelligence League"}
                  </p>
                  <p className="text-lg font-bold text-slate-700 font-poppins">{language === 'id' ? 'Liga' : 'League'} {playerLevel}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    {language === 'id' ? "Skor Detektif" : "Detective Score"}
                  </p>
                  <p className="text-lg font-bold text-emerald-600 font-poppins">{score}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-1 text-emerald-700 font-medium bg-emerald-100/50 rounded-full px-3 py-1 text-xs">
                <Coins className="w-4 h-4" />
                <span>
                  {language === 'id' ? `+ ${score} Koin berhasil didapatkan!` : `+ ${score} Coins successfully earned!`}
                </span>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 mb-8 text-left relative">
              <div className="absolute -top-3 -left-3 bg-white p-1 rounded-full shadow-sm">
                <Info className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-1 ml-2">
                {language === 'id' ? "Tips Literasi Digital" : "Digital Literacy Tips"}
              </p>
              <p className="text-sm font-medium text-amber-700 italic ml-2">"{randomTip}"</p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={startGame}
                disabled={isSaving}
                className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-md transition-colors flex justify-center items-center gap-2"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (language === 'id' ? 'Mulai Investigasi Baru' : 'Start New Investigation')}
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

  if (!isPlaying && !gameOver) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border border-blue-100"
        >
          <button onClick={onBack} className="p-2 -ml-2 mb-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors inline-block">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 rounded-2xl relative">
              <ShieldCheck className="w-12 h-12 text-blue-600 relative z-10" />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl font-poppins font-bold text-center text-slate-800 mb-2">
            {language === 'id' ? "Detektif Cuan" : "Coin Detective"}
          </h1>
          <p className="text-center text-slate-500 mb-8 font-medium">
            {language === 'id' 
              ? "Bantu warga membedakan pesan ASLI atau PENIPUAN (Phishing). Waktu kamu terbatas, analisa dengan cepat!" 
              : "Help citizens distinguish between GENUINE or SCAM messages (Phishing). Your time is limited, analyze quickly!"}
          </p>
          
          <button 
            onClick={() => {
              playClick();
              vibrateLight();
              setShowTutorial(true);
            }}
            className="w-full py-4 bg-gradient-to-b from-blue-400 to-blue-600 text-white font-black text-lg rounded-xl shadow-[0_8px_16px_-6px_rgba(59,130,246,0.5)] active:scale-[0.98] transition-all border-b-[3px] border-blue-700 hover:border-blue-700/50 active:border-b-0 active:translate-y-[3px]"
          >
            {language === 'id' ? "Mulai Misi!" : "Start Mission!"}
          </button>
        </motion.div>

        {/* Tutorial Overlay Modal */}
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
                className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-blue-100 overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 bg-blue-500 h-2 w-full"></div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                    <ShieldCheck className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-poppins font-black text-slate-800 mb-1">
                    {language === 'id' ? "Intelijen Detektif Cuan" : "Profit Detective Intel"}
                  </h3>
                  <p className="text-slate-400 text-xs font-semibold mb-6">
                    {language === 'id' ? "Belajar mengidentifikasi modus penipuan online!" : "Learn to identify online scam operations!"}
                  </p>

                  {/* Steps list */}
                  <div className="space-y-4 text-left w-full mb-8">
                    <div className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {language === 'id' 
                          ? "Periksa teliti detail pesan: platform, pengirim, kata-kata mendesak, hingga link yang dilampirkan." 
                          : "Strictly research message elements: sender title, urgency keywords, custom attachments or web URLs."}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {language === 'id' 
                          ? "Pilih AMAN jika bersumber dari domain resmi sah (misal .go.id atau bca.co.id) tanpa ancaman berlebihan." 
                          : "Choose SAFE if originating from certified domains (as .go.id or bca.co.id) with no immediate threats."}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {language === 'id' 
                          ? "Pilih BAHAYA jika mendeteksi virus (.apk), link mencurigakan (.blogspot, .com palsu), atau social engineering." 
                          : "Choose DANGER if spotting executable malware (.apk), suspicious web forms, or social peer pressure scams."}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      playClick();
                      setShowTutorial(false);
                      startGame();
                    }}
                    className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:translate-y-[2px] transition-all cursor-pointer border-b-[3px] border-blue-700 hover:scale-[1.01]"
                  >
                    {language === 'id' ? "Saya Paham, Mulai!" : "I understand, Start!"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${combo >= 3 ? 'bg-amber-100' : 'bg-slate-100'} flex flex-col font-sans transition-colors duration-500 relative`}>
      <PauseOverlay isPaused={isPaused} />
      
      {/* Visual glowing effect on combo */}
      {combo >= 3 && <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(245,158,11,0.5)] z-0"></div>}
      
      {/* Top HUD */}
      <header className={`${combo >= 3 ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'} p-4 shadow-sm flex items-center justify-between border-b sticky top-0 z-20 transition-colors duration-500`}>
        <div className="flex items-center gap-4">
          <div className="flex gap-1 relative z-10">
            {[...Array(3)].map((_, i) => (
              <Heart 
                key={i} 
                className={`w-5 h-5 ${i < hearts ? 'text-red-500 fill-red-500 drop-shadow-sm' : 'text-slate-200 fill-slate-200'}`} 
              />
            ))}
          </div>
        </div>
        
        <div className="text-right flex items-center gap-4 relative z-10">
          {combo >= 3 && (
            <div className="animate-pulse bg-amber-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-sm">
              COMBO x{combo >= 6 ? '3' : '2'}
            </div>
          )}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{language === 'id' ? 'Liga' : 'League'} {playerLevel}</div>
            <div className="font-bold font-poppins text-slate-700">{language === 'id' ? "Skor:" : "Score:"} <span className="text-blue-500">{score}</span></div>
          </div>
          <button 
            onClick={() => { playClick(); setShowSettings(true); }}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0"
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
      <div className="w-full bg-slate-200 h-2 relative z-20">
        <div 
          className={`h-full transition-all duration-100 ease-linear ${timeLeft <= TIME_LIMIT * 0.3 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : combo >= 3 ? 'bg-amber-500' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`}
          style={{ width: `${(Math.max(0, timeLeft) / TIME_LIMIT) * 100}%` }}
        ></div>
      </div>

      <main className={`flex-grow flex flex-col items-center justify-center p-6 relative overflow-hidden ${screenShake ? 'animate-shake' : ''}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full max-w-sm aspect-[9/16] pointer-events-none opacity-5 z-0">
           <Smartphone className="w-full h-full" />
        </div>

        <AnimatePresence mode="popLayout">
          {feedback && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`absolute top-20 z-30 w-full max-w-sm rounded-2xl p-4 shadow-xl text-center border-l-8  bg-white/95 ${feedback === 'CORRECT' ? 'border-emerald-500 text-emerald-800' : 'border-red-500 text-red-800'}`}
            >
              <h3 className={`font-poppins font-black text-xl mb-1 ${feedback === 'CORRECT' && combo >= 3 ? 'text-amber-500' : ''}`}>
                {feedback === 'CORRECT' 
                  ? (combo >= 3 ? `COMBO x${combo >= 6 ? '3' : '2'}!` : (language === 'id' ? 'BENAR! Tepat Sekali!' : 'CORRECT! Well done!')) 
                  : (language === 'id' ? 'SALAH! Hati-Hati!' : 'WRONG! Be careful!')}
              </h3>
              <p className="text-sm font-medium leading-relaxed opacity-90">
                {language === 'id' ? currentScenario.explanation : (currentScenario.explanation_en || currentScenario.explanation)}
              </p>
            </motion.div>
          )}

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0, scale: feedback ? 0.95 : 1, filter: feedback ? 'blur(2px)' : 'blur(0px)' }}
            exit={{ opacity: 0, x: -50 }}
            className={`bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden border ${combo >= 3 ? 'border-amber-300 shadow-amber-200' : 'border-slate-200'} relative z-10`}
          >
            {/* Mock Phone Header */}
            <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center shrink-0">
                 {getPlatformIcon(currentScenario.platform)}
               </div>
               <div>
                 <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                   {language === 'id' ? "Pesan via" : "Message via"} {currentScenario.platform}
                 </p>
                 <p className="font-poppins font-bold text-slate-700 flex items-center gap-1.5 truncate w-48">
                   <span className="truncate">{language === 'id' ? currentScenario.sender : (currentScenario.sender_en || currentScenario.sender)}</span>
                   {currentScenario.verified && (
                     <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-white shrink-0" />
                   )}
                 </p>
               </div>
            </div>

            {/* Message Body */}
            <div className={`p-6 ${combo >= 3 ? 'bg-amber-50' : 'bg-[#E5DDD5]'} min-h-[200px] flex flex-col justify-end transition-colors`}>
              <div className="bg-white p-4 rounded-b-2xl rounded-tr-2xl shadow-sm self-start inline-block relative max-w-[85%] text-slate-800 mb-2">
                <p className="text-sm font-medium leading-relaxed">
                  {language === 'id' ? currentScenario.message : (currentScenario.message_en || currentScenario.message)}
                </p>
                {currentScenario.link && (
                  <p className="text-sm font-bold text-blue-500 underline mt-2 break-all decoration-blue-200 underline-offset-2">
                    {currentScenario.link}
                  </p>
                )}
                <div className="absolute top-0 -left-2 w-0 h-0 border-t-[10px] border-t-white border-l-[10px] border-l-transparent"></div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-8 relative z-20">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer('AMAN')}
            disabled={isAnswered}
            className={`py-4 px-2 rounded-2xl flex flex-col items-center justify-center shadow-[0_6px_0_rgba(16,185,129,0.2)] bg-white border-2 border-emerald-500 text-emerald-600 transition-all ${isAnswered ? 'opacity-50 cursor-not-allowed' : 'active:translate-y-[6px] active:shadow-none hover:bg-emerald-50'}`}
          >
            <ShieldCheck className="w-8 h-8 mb-1" />
            <span className="font-black font-poppins text-lg tracking-wide">
              {language === 'id' ? "AMAN" : "SAFE"}
            </span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer('BAHAYA')}
            disabled={isAnswered}
            className={`py-4 px-2 rounded-2xl flex flex-col items-center justify-center shadow-[0_6px_0_rgba(239,68,68,0.2)] bg-white border-2 border-red-500 text-red-600 transition-all ${isAnswered ? 'opacity-50 cursor-not-allowed' : 'active:translate-y-[6px] active:shadow-none hover:bg-red-50'}`}
          >
            <AlertTriangle className="w-8 h-8 mb-1" />
            <span className="font-black font-poppins text-lg tracking-wide">
              {language === 'id' ? "BAHAYA" : "DANGER"}
            </span>
          </motion.button>
        </div>
      </main>
    </div>
  );
}
