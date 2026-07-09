import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, ArrowLeft, Loader2, Coins, TrendingUp, TrendingDown, ShieldCheck, AlertTriangle, Settings } from 'lucide-react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { playCoin, playWrong, playWin, playLose, playClick, subscribeToPause, setGameViewTrack } from '../lib/audio';
import { useTranslation } from '../lib/LanguageContext';

import { SettingsModal } from './SettingsModal';

// Define base target and duration
const BASE_TARGET = 30_000_000;
const GAME_DURATION = 60;

type AssetType = 'AMAN' | 'CEPAT';
interface AssetItem {
  id: string;
  name: string;
  name_en?: string;
  type: AssetType;
  baseYield: number; // per second
  icon: string;
}

const ASSET_TYPES: Omit<AssetItem, 'id'>[] = [
  { name: 'Emas Batangan', name_en: 'Gold Bullion', type: 'AMAN', baseYield: 40000, icon: '💎' },
  { name: 'Deposito', name_en: 'Time Deposit', type: 'AMAN', baseYield: 30000, icon: '🏦' },
  { name: 'SBN Ritel', name_en: 'Retail Govt Bond', type: 'AMAN', baseYield: 45000, icon: '📜' },
  { name: 'Properti', name_en: 'Property', type: 'AMAN', baseYield: 50000, icon: '🏢' },
  { name: 'Pasar Uang', name_en: 'Money Market', type: 'AMAN', baseYield: 35000, icon: '💰' },
  { name: 'Saham Bluechip', name_en: 'Bluechip Stocks', type: 'CEPAT', baseYield: 100000, icon: '📈' },
  { name: 'Kripto', name_en: 'Crypto Assets', type: 'CEPAT', baseYield: 180000, icon: '🪙' },
  { name: 'Reksadana Saham', name_en: 'Equity Fund', type: 'CEPAT', baseYield: 90000, icon: '📊' },
  { name: 'P2P Lending', name_en: 'P2P Lending', type: 'CEPAT', baseYield: 120000, icon: '🤝' },
  { name: 'Saham Berisiko', name_en: 'Penny Stocks', type: 'CEPAT', baseYield: 240000, icon: '🔥' },
];

const EVENTS = [
  { title: "Pasar Saham Crash!", title_en: "Stock Market Crash!", effect: 'CRASH', desc: "Krisis ekonomi! Mengurangi total aset.", desc_en: "Market Crash! Deducted total assets." },
  { title: "Badai Inflasi Naik!", title_en: "Hyperinflation Surge!", effect: 'INFLATION', desc: "Inflasi! Nilai aset menurun.", desc_en: "Inflation! Assets value dropped." },
  { title: "Tech Boom!", title_en: "Tech Boom!", effect: 'BOOM', desc: "Tech Boom! Aset meroket tajam!", desc_en: "Tech Boom! Assets surge greatly!" },
  { title: "Harga Emas Melonjak!", title_en: "Gold Price Surge!", effect: 'GOLD_RUSH', desc: "Harga Emas Naik! Aset aman meningkat pesat.", desc_en: "Gold up! Safe assets increase greatly." }
];

export default function PohonAset({ user, userData, onBack }: any) {
  const { language } = useTranslation();
  
  // Real global coins from snapshot
  const displayCoins = userData?.totalCoins || userData?.coins || 0;
  const userLevel = userData?.league !== undefined ? userData?.league : 0;

  // Scaling Factor
  const targetAset = BASE_TARGET * Math.pow(1.5, userLevel);
  const volatilityMultiplier = 1 + (userLevel * 0.3); // High levels = larger market swings

  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [totalAset, setTotalAset] = useState(0);
  const [placedAssets, setPlacedAssets] = useState<AssetItem[]>([]);
  
  const [queue, setQueue] = useState<AssetItem[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null);
  
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [floatText, setFloatText] = useState<{ id: number, val: number, desc?: string } | null>(null);
  const [floatId, setFloatId] = useState(0);

  const [showSettings, setShowSettings] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // --- NEW STATES ---
  const [boosterTime, setBoosterTime] = useState(0);
  const boosterRef = React.useRef(0);
  
  type WeatherType = 'NORMAL' | 'RESESI' | 'BOOM';
  const [weather, setWeather] = useState<WeatherType>('NORMAL');
  const weatherRef = React.useRef<WeatherType>('NORMAL');
  
  type PestType = { id: string, x: number, y: number };
  const [pests, setPests] = useState<PestType[]>([]);
  const pestsRef = React.useRef<PestType[]>([]);

  useEffect(() => { boosterRef.current = boosterTime; }, [boosterTime]);
  useEffect(() => { weatherRef.current = weather; }, [weather]);
  useEffect(() => { pestsRef.current = pests; }, [pests]);

  useEffect(() => {
    setGameViewTrack('pohon-aset');
    const unsub = subscribeToPause((paused) => setIsPaused(paused));
    return () => unsub();
  }, []);

  const totalAsetRef = React.useRef(totalAset);
  useEffect(() => {
    totalAsetRef.current = totalAset;
  }, [totalAset]);

  // Computed Portfolio Balance
  const amanCount = placedAssets.filter(a => a.type === 'AMAN').length;
  const cepatCount = placedAssets.filter(a => a.type === 'CEPAT').length;
  const totalPlaced = amanCount + cepatCount;
  let multiplier = 1.0;
  let amanRatioPercent = 50; 
  if (totalPlaced > 0) {
    const ratio = amanCount / totalPlaced;
    amanRatioPercent = ratio * 100;
    if (ratio >= 0.4 && ratio <= 0.6) multiplier = 2.0;
    else if (ratio >= 0.25 && ratio <= 0.75) multiplier = 1.5;
  }

  // Spawn new assets to queue
  useEffect(() => {
    if (!isPlaying || gameOver || isPaused) return;
    const interval = setInterval(() => {
      setQueue(prev => {
        if (prev.length < 4) {
          const randomType = ASSET_TYPES[Math.floor(Math.random() * ASSET_TYPES.length)];
          return [...prev, { ...randomType, id: Math.random().toString() }];
        }
        return prev;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, isPaused]);

  // Game end evaluation
  useEffect(() => {
    if (isPlaying && timeLeft <= 0 && !gameOver) {
      const isWin = totalAset >= targetAset;
      if (isWin) playWin(); else playLose();
      
      setGameOver(true);
      setIsPlaying(false);
      
      const coinsWon = isWin ? 50 : 10;
      
      if (user?.uid) {
        setIsSaving(true);
        const submitScore = async () => {
          try {
            const docRef = doc(db, 'users', user.uid);
            await import("../lib/rewardUtils").then(m => m.rewardUser(user.uid, userData?.leagueGroupId, coinsWon));
          } catch (err) {
            console.warn("Gagal update score:", err);
          } finally {
            setIsSaving(false);
          }
        };
        submitScore();
      }
    }
  }, [timeLeft, isPlaying, gameOver, totalAset, targetAset, user]);

  // Main game loop: Yield generation & Event Timer
  useEffect(() => {
    if (!isPlaying || gameOver || isPaused) return;

    const gameTick = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) return 0;
        
        // Weather Change
        if (prev % 15 === 0 && prev !== GAME_DURATION) {
           const r = Math.random();
           if (r < 0.3) setWeather('RESESI');
           else if (r < 0.6) setWeather('BOOM');
           else setWeather('NORMAL');
        }
        // Event trigger
        if (prev % 20 === 0 && prev !== GAME_DURATION && prev > 0) {
          triggerRandomEvent();
        }
        return prev - 1;
      });

      // Spawn Pests
      if (weatherRef.current !== 'BOOM') {
         if (Math.random() < 0.15 + (userLevel * 0.05)) {
            setPests(curr => {
               if (curr.length < 3) {
                   return [...curr, { id: Math.random().toString(), x: 20 + Math.random()*60, y: 15 + Math.random()*60 }];
               }
               return curr;
            });
         }
      }

      setBoosterTime(b => Math.max(0, b - 1));

      // Pest Damage
      if (pestsRef.current.length > 0) {
         const pestDamage = pestsRef.current.length * 150000 * Math.pow(1.5, userLevel);
         setTotalAset(a => Math.max(1000000, a - pestDamage));
         setFloatText({ id: Date.now(), val: -pestDamage, desc: "HAMA!" });
      }

      // Calculate Yield
      setPlacedAssets(currPlaced => {
         let amanYield = currPlaced.filter(a => a.type === 'AMAN').reduce((acc, curr) => acc + curr.baseYield, 0);
         let cepatYield = currPlaced.filter(a => a.type === 'CEPAT').reduce((acc, curr) => acc + curr.baseYield, 0);
         
         const w = weatherRef.current;
         if (w === 'RESESI') {
             amanYield *= 1.2;
             cepatYield = 0;
         } else if (w === 'BOOM') {
             cepatYield *= 3.0;
         }
         let baseYield = amanYield + cepatYield;
         let m = 1.0;
         if (currPlaced.length > 0) {
            const amanCount = currPlaced.filter(a => a.type === 'AMAN').length;
            const cepatCount = currPlaced.filter(a => a.type === 'CEPAT').length;
            const total = amanCount + cepatCount;
            const amanRatio = amanCount / total;
            if (amanRatio >= 0.4 && amanRatio <= 0.6) m = 2.0;
            else if (amanRatio >= 0.25 && amanRatio <= 0.75) m = 1.5;
         }
         
         let finalYield = Math.round(baseYield * m);
         if (boosterRef.current > 0) finalYield *= 2;

         if (finalYield > 0) {
           setTotalAset(a => a + finalYield);
           setFloatText({ id: Date.now() + 1, val: finalYield });
         }
         return currPlaced;
      });
    }, 1000);

    return () => clearInterval(gameTick);
  }, [isPlaying, gameOver, isPaused]);

  const triggerRandomEvent = () => {
    const e = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    setCurrentEvent(e);
    
    let loss = 0;
    let gain = 0;
    if (e.effect === 'CRASH') {
      const crashFactor = (0.15 + Math.random() * 0.10) * Math.min(1.5, volatilityMultiplier); 
      loss = Math.round(totalAsetRef.current * crashFactor);
      
      // Only remove max 1 CEPAT asset instead of all
      setPlacedAssets(curr => {
        const cepatIdx = curr.findIndex(a => a.type === 'CEPAT');
        if (cepatIdx > -1) {
          const next = [...curr];
          next.splice(cepatIdx, 1);
          return next;
        }
        return curr;
      });
    } else if (e.effect === 'INFLATION') {
      const inflFactor = 0.08 * Math.min(1.5, volatilityMultiplier);
      loss = Math.round(totalAsetRef.current * inflFactor); 
    } else if (e.effect === 'BOOM') {
      const boomFactor = 0.20 * Math.min(2.5, volatilityMultiplier);
      gain = Math.round(totalAsetRef.current * boomFactor); 
    } else if (e.effect === 'GOLD_RUSH') {
      const rushFactor = 0.25 * Math.min(2.5, volatilityMultiplier);
      gain = Math.round(totalAsetRef.current * rushFactor); 
    }
    
    setTotalAset(a => Math.max(1000000, a - loss + gain));
    if (loss > 0) showFloatText(-loss, e.effect);
    if (gain > 0) showFloatText(gain, e.effect);

    setTimeout(() => setCurrentEvent(null), 3500);
  };

  const showFloatText = (val: number, desc: string) => {
    setFloatText({ id: Date.now() + Math.random(), val, desc });
  };

  const handlePlaceAsset = (branchType: AssetType) => {
    if (!selectedAsset) return;
    
    if (selectedAsset.type === branchType) {
      playCoin();
      // standard profit of 5% - 15% per action
      const pct = 0.05 + Math.random() * 0.10;
      const profit = Math.round(totalAset * pct);
      
      setTotalAset(prev => prev + profit);
      showFloatText(profit, language === 'id' ? "DITANAM!" : "PLANTED!");
      
      setPlacedAssets(prev => [...prev, selectedAsset]);
      setQueue(prev => prev.filter(a => a.id !== selectedAsset.id));
      setSelectedAsset(null);
    } else {
      // Wrong branch
      playWrong();
      const penalty = Math.round(totalAset * 0.10); // 10% penalty
      showFloatText(-penalty, language === 'id' ? "SALAH CABANG!" : "WRONG BRANCH!");
      setTotalAset(prev => Math.max(1000000, prev - penalty));
      setSelectedAsset(null);
      setQueue(prev => prev.filter(a => a.id !== selectedAsset.id));
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setTimeLeft(GAME_DURATION);
    setTotalAset(5000000 * Math.pow(1.5, userLevel)); // start capital scales
    setPlacedAssets([]);
    setQueue([]);
    setSelectedAsset(null);
    setBoosterTime(0);
    setWeather('NORMAL');
    setPests([]);
  };



  if (gameOver) {
    const isWin = totalAset >= targetAset;
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6 font-sans">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border-2 border-emerald-100">
          <h2 className="text-3xl font-poppins font-black text-slate-800 mb-2">
            {isWin 
              ? (language === 'id' ? 'Pohon Berbuah Lebat!' : 'Tree Fruitful & Abundant!') 
              : (language === 'id' ? 'Aset Layu...' : 'Assets Withered...')}
          </h2>
          <p className="text-slate-500 font-medium mb-6">
            {language === 'id' ? 'Total Aset Akhirmu:' : 'Your Total Final Assets:'}
          </p>
          
          <div className="bg-emerald-50 rounded-2xl p-6 mb-6">
            <p className="text-2xl font-black text-emerald-600 font-poppins">Rp {totalAset.toLocaleString('id-ID')}</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-2">
              {isWin 
                ? (language === 'id' ? `Target Rp ${Intl.NumberFormat('id-ID', {notation: "compact"}).format(targetAset)} TERCAPAI` : `Target of IDR ${Intl.NumberFormat('en-US', {notation: "compact"}).format(targetAset)} ACHIEVED`) 
                : (language === 'id' ? `Gagal capai Rp ${Intl.NumberFormat('id-ID', {notation: "compact"}).format(targetAset)}` : `Failed to reach IDR ${Intl.NumberFormat('en-US', {notation: "compact"}).format(targetAset)}`)}
            </p>
          </div>
          
          <div className="space-y-3">
             <button onClick={startGame} disabled={isSaving} className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-colors flex justify-center items-center gap-2">
               {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (language === 'id' ? 'Tanam Lagi' : 'Plant Again')}
             </button>
             <button onClick={onBack} disabled={isSaving} className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors">
               {language === 'id' ? 'Kembali ke Dashboard' : 'Back to Dashboard'}
             </button>
           </div>
         </motion.div>
       </div>
     );
  }

  if (!isPlaying && !gameOver) {
    const formattedTarget = Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', { notation: "compact", compactDisplay: "short", maximumFractionDigits: 1 }).format(targetAset);
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border border-emerald-100">
          <button onClick={onBack} className="p-2 -ml-2 mb-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors inline-block">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-emerald-100 rounded-2xl">
              <Leaf className="w-12 h-12 text-emerald-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-poppins font-bold text-center text-slate-800 mb-2">
            {language === 'id' ? 'Pohon Aset' : 'Asset Tree'}
          </h1>
          <p className="text-center text-slate-500 mb-6 font-medium">
            {language === 'id' 
              ? `Bantu Pohon Asetmu mencapai Rp ${formattedTarget} dalam ${GAME_DURATION} detik. Pilih investasi dan masukkan ke cabang yang TEPAT! (Liga ${userLevel})` 
              : `Help your Asset Tree reach IDR ${formattedTarget} in ${GAME_DURATION} seconds. Choose an investment and sort it into the RIGHT branch! (League ${userLevel})`}
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              <p className="text-sm text-slate-600">
                <strong className="text-emerald-700">{language === 'id' ? 'Aman/Stabil:' : 'Safe/Stable:'}</strong>{' '}
                {language === 'id' ? 'Emas, Deposito, SBN. Stabil saat krisis.' : 'Gold, Fixed Deposits, Government Bonds. Highly stable during economic crises.'}
              </p>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-slate-600">
                <strong className="text-amber-700">{language === 'id' ? 'Tumbuh Cepat:' : 'Fast Growth:'}</strong>{' '}
                {language === 'id' ? 'Saham, Kripto. Cepat naik, tapi hancur saat crash!' : 'Stocks, Crypto Assets. Extremely high yields but volatile collapses!'}
              </p>
            </div>
          </div>

          <button onClick={startGame} className="w-full py-4 bg-gradient-to-b from-emerald-400 to-emerald-600 text-white font-black text-lg rounded-xl shadow-[0_8px_16px_-6px_rgba(16,185,129,0.5)] active:scale-[0.98] transition-all border-b-[3px] border-emerald-700 hover:border-emerald-700/50 active:border-b-0 active:translate-y-[3px]">
            {language === 'id' ? 'Tanam Pohon!' : 'Plant Tree!'}
          </button>
        </motion.div>
      </div>
    );
  }

  const treeScale = Math.min(1.5, Math.max(0.7, 0.8 + (totalAset / targetAset) * 0.7));
  const isCrashing = currentEvent?.effect === 'CRASH' || currentEvent?.effect === 'INFLATION';

  const progressRatio = totalAset / targetAset;
  const showSmallFruits = progressRatio >= 0.5;
  const showMedFruits = progressRatio >= 0.8;
  const showBigFruits = progressRatio >= 1.0;

  const buyBoosterCost = 1000000 * Math.pow(1.5, userLevel);
  const handleBuyBooster = () => {
    if (totalAset >= buyBoosterCost) {
      playCoin();
      setTotalAset(a => Math.max(0, a - buyBoosterCost));
      setBoosterTime(5);
      showFloatText(-buyBoosterCost, language === 'id' ? "PUPUK AKTIF!" : "BOOSTER ACTIVE!");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans relative overflow-hidden">
      {/* HUD Bar */}
      <header className="bg-white p-4 shadow-sm flex items-center justify-between border-b border-emerald-100 z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="font-poppins font-bold text-xl text-slate-700">
            {language === 'id' ? "Waktu" : "Time"}: <span className={timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-500'}>{timeLeft}s</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right flex flex-col items-end">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {language === 'id' ? 'Liga' : 'League'} {userLevel}
              </span>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">
                {language === 'id' ? "Total Aset" : "Total Assets"}
              </p>
            </div>
            <div className="font-bold font-poppins text-lg sm:text-2xl text-emerald-600 leading-none mt-1">
              Rp {totalAset.toLocaleString('id-ID')}
            </div>
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

      {/* Target Progress component */}
      <div className="bg-emerald-50 h-1.5 w-full">
         <div className="h-full bg-emerald-400 transition-all duration-500 ease-out" style={{ width: `${Math.min(100, (totalAset / targetAset) * 100)}%` }}></div>
      </div>

      <main className="flex-grow relative flex flex-col items-center justify-between p-4 overflow-hidden">
        
        {/* Weather & Booster UI */}
        <div className="w-full max-w-sm flex justify-between items-center mb-2 z-10 font-poppins">
           <div className="px-3 py-1.5 bg-white rounded-full shadow-sm border border-slate-100 flex items-center gap-1">
              <span className="text-xl">
                 {weather === 'NORMAL' ? '☀️' : weather === 'RESESI' ? '🌧️' : '🔥'}
              </span>
              <span className={`text-xs font-bold ${weather === 'RESESI' ? 'text-blue-500' : weather === 'BOOM' ? 'text-red-500' : 'text-slate-600'}`}>
                 {weather === 'NORMAL' ? (language === 'id' ? 'Cerah' : 'Clear') : weather === 'RESESI' ? (language === 'id' ? 'Resesi' : 'Recession') : 'Booming'}
              </span>
           </div>

           <div className="flex flex-col items-end">
              <button onClick={handleBuyBooster} disabled={totalAset < buyBoosterCost} className="px-3 py-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold text-xs rounded-full shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2">
                 🧪 2x
                 <span className="bg-black/20 px-1 py-0.5 rounded text-[9px]">
                    -{(1 * Math.pow(1.5, userLevel)).toFixed(1)}M
                 </span>
              </button>
              {boosterTime > 0 && (
                 <span className="text-[10px] font-bold text-violet-600 animate-pulse mt-1">
                    {boosterTime}s left!
                 </span>
              )}
           </div>
        </div>

        {/* Diversification Bar */}
        <div className="w-full max-w-sm mb-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center z-10 space-y-1.5">
           <div className="flex justify-between w-full text-[10px] font-bold text-slate-500">
              <span className="text-emerald-600">{language === 'id'? 'AMAN' : 'SAFE'}</span>
              <span className="font-poppins text-slate-700">{language === 'id' ? 'Keseimbangan' : 'Balance'}</span>
              <span className="text-amber-500">{language === 'id'? 'CEPAT' : 'FAST'}</span>
           </div>
           <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${amanRatioPercent}%` }}></div>
              <div className="h-full bg-amber-400 transition-all duration-300 flex-grow"></div>
              {/* Sweet spot indicators */}
              <div className="absolute left-[25%] right-[25%] top-0 bottom-0 border-x-2 border-dashed border-black/10"></div>
              <div className="absolute left-[40%] right-[40%] top-0 bottom-0 bg-white/20"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-800/20 transform -translate-x-1/2"></div>
           </div>
           
           <div className="w-full flex justify-between items-center px-1">
             <div className="text-xs font-bold font-poppins flex gap-1 items-center">
                <span className="text-slate-500">{language === 'id' ? 'Bonus Diversifikasi:' : 'Diversification Bonus:'}</span>
                <span className={`px-2 py-0.5 rounded-md text-white shadow-sm transition-colors ${multiplier === 1.5 ? 'bg-violet-500 animate-pulse' : multiplier === 1.25 ? 'bg-blue-400' : 'bg-slate-300'}`}>
                  x{multiplier}
                </span>
             </div>
             {multiplier > 1 && totalPlaced > 0 && (
               <span className="text-[10px] font-bold text-violet-600 animate-bounce">
                 {multiplier === 1.5 ? (language === 'id' ? 'SEIMBANG!' : 'BALANCED!') : (language === 'id' ? 'LUMAYAN' : 'GOOD')}
               </span>
             )}
           </div>
        </div>

        {/* Event Overlay */}
        <AnimatePresence>
          {currentEvent && (
            <motion.div initial={{ opacity: 0, scale: 0.8, y: -50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute top-10 left-4 right-4 z-50 bg-red-500/90  text-white p-6 rounded-3xl shadow-2xl border-l-[8px] border-red-700">
               <div className="flex items-center gap-3 mb-2">
                 <AlertTriangle className="w-8 h-8" />
                 <h3 className="font-black font-poppins text-xl">
                   {language === 'id' ? currentEvent.title : (currentEvent.title_en || currentEvent.title)}
                 </h3>
               </div>
               <p className="font-medium opacity-90">
                 {language === 'id' ? currentEvent.desc : (currentEvent.desc_en || currentEvent.desc)}
               </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tree Render! */}
        <div className="relative flex-grow w-full max-w-sm flex flex-col items-center justify-center mt-8">
           
           {/* Float Text container */}
           <AnimatePresence>
              {floatText && (
                <motion.div key={floatText.id} initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -80 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className={`absolute top-1/4 z-40 text-xl md:text-2xl font-black font-poppins drop-shadow-md px-4 py-2 rounded-full ${floatText.val > 0 ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                  {floatText.val > 0 ? '+' : ''}Rp {Math.abs(floatText.val).toLocaleString('id-ID')} {floatText.desc}
                </motion.div>
              )}
           </AnimatePresence>

           <motion.div 
              className="relative w-full h-80 flex justify-center items-end pb-10 origin-bottom"
              animate={{ 
                scale: treeScale,
                x: isCrashing ? [-10, 10, -10, 10, -5, 5, 0] : 0
              }}
              transition={{
                scale: { type: 'spring', bounce: 0.5 },
                x: { duration: 0.5 }
              }}
           >
              {/* Simple stylized SVG Tree */}
              <div className="w-4 h-32 bg-amber-800 rounded-t-sm absolute bottom-0 z-0"></div>
              {/* Aman Branch */}
              <button 
                 onClick={() => handlePlaceAsset('AMAN')}
                 className={`absolute bottom-20 left-10 w-28 h-28 bg-emerald-500 rounded-tr-[50%] rounded-tl-[50%] rounded-bl-[50%] opacity-80 z-10 transition-transform active:scale-95 flex items-center justify-center shadow-lg border-4 ${selectedAsset ? 'border-amber-300 animate-pulse' : 'border-transparent'}`}
                 style={{ transform: 'rotate(-20deg)' }}
              >
                 <span className="font-black text-white text-xs text-center drop-shadow-md transform rotate-20">
                   {language === 'id' ? <React.Fragment>AMAN/<br/>STABIL</React.Fragment> : <React.Fragment>SAFE/<br/>STABLE</React.Fragment>}
                 </span>
                 <div className="absolute top-2 w-full flex justify-center text-xs text-white/90">
                   {placedAssets.filter(a => a.type === 'AMAN').length}x
                 </div>
              </button>
              {/* Cepat Branch */}
              <button 
                 onClick={() => handlePlaceAsset('CEPAT')}
                 className={`absolute bottom-24 right-10 w-32 h-32 bg-amber-500 rounded-tr-[50%] rounded-tl-[50%] rounded-br-[50%] opacity-90 z-10 transition-transform active:scale-95 flex items-center justify-center shadow-lg border-4 ${selectedAsset ? 'border-amber-300 animate-pulse' : 'border-transparent'}`}
                 style={{ transform: 'rotate(15deg)' }}
              >
                 <span className="font-black text-white text-xs text-center drop-shadow-md transform -rotate-15">
                   {language === 'id' ? <React.Fragment>TUMBUH/<br/>CEPAT</React.Fragment> : <React.Fragment>FAST/<br/>GROWTH</React.Fragment>}
                 </span>
                 <div className="absolute top-2 w-full flex justify-center text-xs text-white/90">
                   {placedAssets.filter(a => a.type === 'CEPAT').length}x
                 </div>
              </button>
              {/* Top main canopy */}
              <div className="absolute bottom-40 w-32 h-32 bg-emerald-600 rounded-full opacity-90 z-0 border-b-8 border-black/10 flex items-center justify-center">
                 {showSmallFruits && <span className="absolute top-4 left-4 text-xl animate-pulse">🪙</span>}
                 {showSmallFruits && <span className="absolute bottom-4 right-4 text-xl animate-pulse">🪙</span>}
                 {showMedFruits && <span className="absolute top-10 right-2 text-2xl animate-pulse">💰</span>}
                 {showMedFruits && <span className="absolute bottom-10 left-2 text-2xl animate-pulse">💰</span>}
                 {showBigFruits && <span className="absolute -top-6 text-4xl animate-bounce">👑</span>}
              </div>

              {/* Pests */}
              {pests.map(p => (
                <button 
                  key={p.id} 
                  onClick={(e) => {
                    e.stopPropagation();
                    playClick();
                    setPests(curr => curr.filter(pest => pest.id !== p.id));
                    showFloatText(50000, "BASMI!");
                    setTotalAset(a => a + 50000);
                  }}
                  className="absolute z-50 text-2xl animate-pulse hover:scale-125 transition-transform"
                  style={{ left: `${p.x}%`, bottom: `${20 + p.y}%` }}
                >
                  🐛
                </button>
              ))}
           </motion.div>
        </div>

        {/* Instruments Queue */}
        <div className="w-full bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] p-4 flex flex-col items-center">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
             {language === 'id' ? "Antrean Aset (Pilih & Masukkan ke Cabang)" : "Asset Queue (Select & Sort to Branch)"}
           </p>
           
           <div className="flex gap-3 justify-center min-h-[90px] w-full">
              <AnimatePresence>
                {queue.map(asset => (
                  <motion.button 
                     key={asset.id}
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0, opacity: 0 }}
                     onClick={() => setSelectedAsset(selectedAsset?.id === asset.id ? null : asset)}
                     className={`w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 flex flex-col items-center justify-center rounded-2xl border-2 transition-all shadow-sm ${selectedAsset?.id === asset.id ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-100 translate-y-[-10px]' : 'border-slate-200 hover:border-emerald-300'}`}
                  >
                     <span className="text-2xl mb-1">{asset.icon}</span>
                     <span className="text-[8px] sm:text-[10px] font-bold uppercase text-slate-600 text-center leading-tight truncate px-1 w-full">
                       {language === 'id' ? asset.name : (asset.name_en || asset.name)}
                     </span>
                  </motion.button>
                ))}
                {queue.length === 0 && (
                  <div className="h-20 flex items-center justify-center text-slate-300 text-sm font-medium italic">
                    {language === 'id' ? "Menunggu aset baru turun..." : "Waiting for new assets to descend..."}
                  </div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </main>
    </div>
  );
}
