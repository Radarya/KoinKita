import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Loader2, Coins, HelpCircle, Lightbulb } from 'lucide-react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { playClick, playCorrect, playWrong, playWin, playLose, setGameViewTrack, subscribeToPause } from '../lib/audio';
import { useTranslation } from '../lib/LanguageContext';

import { LEVEL_WORDS } from './FinWordleData';
import { SettingsModal } from './SettingsModal';
import { Settings } from 'lucide-react';

const MAX_GUESSES = 6;

type LetterState = 'correct' | 'present' | 'absent' | 'empty';

interface FinWordleProps {
  user: any;
  userData?: any;
  onBack: () => void;
}

export default function FinWordle({ user, userData, onBack }: FinWordleProps) {
  const { language } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // 1) Define state for 5-word game session
  const [sessionTargetWords, setSessionTargetWords] = useState<typeof LEVEL_WORDS[0]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [sessionCoins, setSessionCoins] = useState(0);
  const [showVictory, setShowVictory] = useState(false);

  // Real global coins from snapshot
  const displayCoins = userData?.totalCoins || userData?.coins || 0;
  const userLevel = userData?.league !== undefined ? userData?.league : 0;
  
  const currentLevelBank = LEVEL_WORDS[userLevel] || LEVEL_WORDS[0];
  const [targetWordObj, setTargetWordObj] = useState(currentLevelBank[0]);
  
  const localizedWord = targetWordObj.word[language as 'id' | 'en']?.toUpperCase() || "";
  const localizedClue = targetWordObj.clue[language as 'id' | 'en'];
  const WORD_LENGTH = localizedWord.length;

  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [shakeRow, setShakeRow] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [sessionEarned, setSessionEarned] = useState(0); // Optional: track how much we earned in this particular session
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const [showSettings, setShowSettings] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setGameViewTrack('tebak-kata');
    const unsub = subscribeToPause((paused) => setIsPaused(paused));
    return () => unsub();
  }, []);

  // Synchronize game if language changes before it starts, or reset round if lengths don't match
  useEffect(() => {
    if (!isPlaying) {
      setTargetWordObj(currentLevelBank[0]);
    } else {
      // If language changed mid-game, safely reset the round to avoid length mismatch crashes
      startNewRound();
    }
  }, [language, isPlaying, userLevel]);

  // Stats
  const getNextWord = () => {
    if (currentWordIndex + 1 < sessionTargetWords.length) {
      setCurrentWordIndex(prev => prev + 1);
      setTargetWordObj(sessionTargetWords[currentWordIndex + 1]);
      setGuesses([]);
      setCurrentGuess("");
      setGameOver(false);
      setMessage(null);
      setIsTransitioning(false);
    } else {
      setShowVictory(true);
    }
  };

  const startNewRound = () => {
    const list = LEVEL_WORDS[userLevel] || LEVEL_WORDS[0];
    const shuffled = [...list].sort(() => Math.random() - 0.5).slice(0, 5);
    setSessionTargetWords(shuffled);
    setCurrentWordIndex(0);
    setTargetWordObj(shuffled[0]);
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setMessage(null);
    setShowVictory(false);
    setIsTransitioning(false);
  };

  const startGame = () => {
    setSessionEarned(0);
    setIsPlaying(true);
    startNewRound();
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  };

  const handleEarnCoins = useCallback(async (amount: number) => {
    if (user?.uid) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await import("../lib/rewardUtils").then(m => m.rewardUser(user.uid, userData?.leagueGroupId, amount));
        setSessionEarned(prev => prev + amount);
      } catch (err) {
        console.warn("Gagal tambah coin:", err);
      }
    }
  }, [user]);

  const onKeyPress = useCallback((key: string) => {
    if (gameOver || !isPlaying || isTransitioning || isPaused) return;

    if (key === 'Enter') {
      if (currentGuess.length !== WORD_LENGTH) {
        setShakeRow(true);
        playWrong();
        showMessage(language === 'id' ? "Tidak cukup huruf!" : "Not enough letters!");
        setTimeout(() => setShakeRow(false), 500);
        return;
      }
      
      // submit guess
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      
      if (currentGuess === localizedWord) {
        // win round
        setCurrentGuess("");
        setIsTransitioning(true);
        playCorrect();
        handleEarnCoins(50);
        setMessage(language === 'id' ? "Luar biasa! +50 Koin" : "Magnificent! +50 Coins");
        setTimeout(() => {
          getNextWord();
        }, 2000);
      } else if (newGuesses.length >= MAX_GUESSES) {
        // lose round
        setCurrentGuess("");
        setIsTransitioning(true);
        playLose();
        setMessage((language === 'id' ? "Jawaban: " : "Answer: ") + localizedWord);
        setTimeout(() => {
          getNextWord();
        }, 2500);
      } else {
        playClick(); // normal submission
        setCurrentGuess("");
      }
    } else if (key === 'Backspace') {
      playClick();
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
      playClick();
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, gameOver, isPlaying, isTransitioning, guesses, localizedWord, WORD_LENGTH, handleEarnCoins, language]);

  // Read physical keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;
      let key = e.key.toUpperCase();
      if (e.key === 'Enter') key = 'Enter';
      if (e.key === 'Backspace') key = 'Backspace';
      if (key === 'ENTER') key = 'Enter';
      if (key === 'BACKSPACE') key = 'Backspace';
      onKeyPress(key);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);

  // Compute colors for a specific row
  const getGuessStatuses = (guess: string): LetterState[] => {
    const statuses: LetterState[] = Array(WORD_LENGTH).fill('absent');
    const targetChars = localizedWord.split('');
    const guessChars = guess.split('');
    
    // First pass: mark correct
    guessChars.forEach((char, i) => {
      if (char === targetChars[i]) {
        statuses[i] = 'correct';
        targetChars[i] = '#'; // consume
      }
    });

    // Second pass: mark present
    guessChars.forEach((char, i) => {
      if (statuses[i] !== 'correct' && targetChars.includes(char)) {
        statuses[i] = 'present';
        targetChars[targetChars.indexOf(char)] = '#'; // consume
      }
    });
    
    return statuses;
  };

  const Keyboard = () => {
    const rows = [
      ['Q','W','E','R','T','Y','U','I','O','P'],
      ['A','S','D','F','G','H','J','K','L'],
      ['Enter','Z','X','C','V','B','N','M','Backspace']
    ];

    // Compute key colors
    const keyColors: Record<string, string> = {};
    guesses.forEach(guess => {
      const statuses = getGuessStatuses(guess);
      guess.split('').forEach((char, i) => {
        const currentStatus = keyColors[char];
        const newStatus = statuses[i];
        if (currentStatus === 'correct') return;
        if (currentStatus === 'present' && newStatus === 'absent') return;
        keyColors[char] = newStatus;
      });
    });

    return (
      <div className="w-full max-w-sm mt-8 space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex justify-center gap-1.5 px-2">
            {row.map(key => {
              const color = keyColors[key];
              let bgColor = "bg-slate-200 text-slate-700";
              if (color === 'correct') bgColor = "bg-emerald-500 text-white";
              if (color === 'present') bgColor = "bg-amber-400 text-white";
              if (color === 'absent') bgColor = "bg-slate-500 text-white";
              
              const isAction = key === 'Enter' || key === 'Backspace';
              
              return (
                <button
                  key={key}
                  onClick={() => onKeyPress(key)}
                  className={`h-12 sm:h-14 rounded-lg font-bold flex items-center justify-center transition-colors shadow-sm active:scale-95 text-xs sm:text-sm ${bgColor} ${isAction ? 'px-3 sm:px-4 text-[10px]' : 'flex-1'}`}
                >
                  {key === 'Backspace' ? '⌫' : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const buyClue = async () => {
    if (displayCoins < 20) {
      showMessage(language === 'id' ? "Koin tidak cukup!" : "Not enough coins!");
      return;
    }
    
    // find a letter that hasn't been found
    const targetArr = localizedWord.split('');
    let foundLetters = new Set<string>();
    guesses.forEach(g => {
      const statuses = getGuessStatuses(g);
      g.split('').forEach((c, i) => {
        if (statuses[i] === 'correct') foundLetters.add(targetArr[i]);
      });
    });
    
    const unrevealedIdxs = targetArr.map((c, i) => i).filter(i => !foundLetters.has(targetArr[i]));
    
    if (unrevealedIdxs.length === 0) {
      showMessage(language === 'id' ? "Semua huruf sudah terbuka!" : "All letters already uncovered!");
      return;
    }
    
    const randomIdx = unrevealedIdxs[Math.floor(Math.random() * unrevealedIdxs.length)];
    const revealedLetter = targetArr[randomIdx];
    
    // Deduct 20 coins
    if (user?.uid) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await import("../lib/rewardUtils").then(m => m.rewardUser(user.uid, userData?.leagueGroupId, -20, 0));
      } catch (err) {
        console.warn("Gagal mengurangi coin:", err);
      }
    }
    
    showMessage(language === 'id' 
      ? `Klu: Ada huruf '${revealedLetter}' di posisi ke-${randomIdx + 1}`
      : `Clue: There is a letter '${revealedLetter}' at position ${randomIdx + 1}`
    );
  };

  const endGame = async () => {
    setIsPlaying(false);
    onBack();
  };

  if (!isPlaying && !gameOver) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 font-sans">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border border-blue-100">
          <button onClick={onBack} className="p-2 -ml-2 mb-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors inline-block">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex justify-center mb-6">
            <div className="flex gap-1 justify-center">
               <div className="w-10 h-10 bg-emerald-500 rounded text-white flex items-center justify-center font-bold text-xl">W</div>
               <div className="w-10 h-10 bg-amber-400 rounded text-white flex items-center justify-center font-bold text-xl">O</div>
               <div className="w-10 h-10 bg-slate-500 rounded text-white flex items-center justify-center font-bold text-xl">R</div>
            </div>
          </div>
          
          <h1 className="text-2xl font-poppins font-bold text-center text-slate-800 mb-2">Fin-Wordle</h1>
          <p className="text-center text-slate-500 mb-6 font-medium">
            {language === 'id' 
              ? "Tebak istilah keuangan dalam 6 kesempatan. Semakin logis tebakanmu, semakin besar cuanmu!"
              : "Guess the financial term in 6 tries. The more logical your guess, the bigger your profit!"}
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
               <div className="w-6 h-6 shrink-0 bg-emerald-500 rounded flex items-center justify-center text-white font-bold text-xs">A</div>
               <p className="text-xs text-slate-600">
                 {language === 'id' ? "Huruf Benar & Posisi Benar." : "Correct Letter & Correct Position."}
               </p>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
               <div className="w-6 h-6 shrink-0 bg-amber-400 rounded flex items-center justify-center text-white font-bold text-xs">B</div>
               <p className="text-xs text-slate-600">
                 {language === 'id' ? "Huruf Benar & Posisi Salah." : "Correct Letter & Wrong Position."}
               </p>
            </div>
          </div>

          <button onClick={startGame} className="w-full py-4 bg-gradient-to-b from-blue-400 to-blue-600 text-white font-black text-lg rounded-xl shadow-[0_8px_16px_-6px_rgba(59,130,246,0.5)] active:scale-[0.98] transition-all border-b-[3px] border-blue-700 hover:border-blue-700/50 active:border-b-0 active:translate-y-[3px]">
            {language === 'id' ? "Tebak Kata!" : "Guess Word!"}
          </button>
        </motion.div>
      </div>
    );
  }

  if (showVictory) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border overflow-hidden">
          <h2 className="text-3xl font-poppins font-black text-slate-800 mb-2">
            {language === 'id' ? "Sesi Selesai" : "Session End"}
          </h2>
          <p className="text-slate-500 font-medium mb-6">
            {language === 'id' ? "Kamu telah menyelesaikan 5 teka-teki!" : "You completed 5 word rounds!"}
          </p>
          
          <div className="bg-blue-50 rounded-2xl p-6 mb-6">
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">
              {language === 'id' ? "Total Poin Didapat Sesi Ini" : "Total Coins Earned This Session"}
            </p>
            <p className="text-4xl font-black text-blue-600 font-poppins">{sessionEarned}</p>
          </div>
          
          <div className="space-y-3">
             <button onClick={startGame} disabled={isSaving} className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-md transition-colors flex justify-center items-center gap-2 mb-2">
               {language === 'id' ? "Main Lagi" : "Play Again"}
             </button>
             <button onClick={onBack} disabled={isSaving} className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors">
               {language === 'id' ? "Kembali ke Dashboard" : "Back to Dashboard"}
             </button>
           </div>
        </motion.div>
      </div>
    );
  }

  // Generate grid rows
  const emptyRows = Math.max(0, MAX_GUESSES - guesses.length - 1);
  
  return (
    <div className="min-h-screen bg-[#Fdfdfd] flex flex-col font-sans">
      <header className="bg-white p-4 shadow-sm flex items-center justify-between border-b border-slate-200">
        <div className="flex flex-col items-center">
          <h1 className="font-poppins font-bold text-xl text-slate-700 tracking-wider leading-tight">FIN-WORDLE</h1>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
            {language === 'id' ? 'Liga' : 'League'} {userLevel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 text-amber-600 font-bold flex-shrink-0">
            <Coins className="w-4 h-4" />
            <span>{displayCoins}</span>
          </div>
          <button 
            onClick={() => { playClick(); setShowSettings(true); }}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <SettingsModal 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)} 
          isGameMode={true}
          onExitGame={endGame}
        />
        {/* Clue UI */}
        <div className="w-full max-w-sm mb-6 bg-blue-50 border border-blue-100 p-4 rounded-2xl shadow-sm text-center relative">
           <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
             {language === 'id' ? "Teka-teki" : "Riddle Clue"}
           </p>
           <p className="text-sm font-medium text-blue-800 leading-snug">
             "{localizedClue}"
           </p>
           
           <button 
             onClick={buyClue}
             className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1 hover:scale-105 transition-transform"
           >
             <Lightbulb className="w-3 h-3" />
             {language === 'id' ? "Beli Klu (20 Koin)" : "Buy Clue (20 Coins)"}
           </button>
        </div>

        {/* Message Popover */}
        <div className="h-8 mb-2 flex items-center justify-center w-full">
           <AnimatePresence>
             {message && (
               <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-slate-800 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-md">
                 {message}
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Grid */}
        <div className="flex flex-col gap-1.5 w-full max-w-md px-2">
          {guesses.map((guess, i) => {
            const statuses = getGuessStatuses(guess);
            return (
              <div key={i} className="flex gap-1.5 justify-center">
                {guess.split('').map((char, j) => {
                  const status = statuses[j];
                  let bgColor = "bg-slate-500 text-white border-slate-500";
                  if (status === 'correct') bgColor = "bg-emerald-500 text-white border-emerald-500";
                  if (status === 'present') bgColor = "bg-amber-400 text-white border-amber-400";
                  
                  return (
                    <motion.div 
                      key={j}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1, transition: { delay: j * 0.1 } }}
                      className={`flex items-center justify-center font-bold rounded-lg border-2 shadow-sm ${bgColor}`}
                      style={{ 
                        width: WORD_LENGTH > 8 ? '28px' : WORD_LENGTH > 6 ? '34px' : '48px',
                        height: WORD_LENGTH > 8 ? '32px' : WORD_LENGTH > 6 ? '38px' : '48px',
                        fontSize: WORD_LENGTH > 6 ? '1.1rem' : '1.25rem'
                      }}
                    >
                      {char}
                    </motion.div>
                  )
                })}
              </div>
            );
          })}
          
          {/* Current Guess Row */}
          {guesses.length < MAX_GUESSES && (
            <div className={`flex gap-1 sm:gap-1.5 justify-center ${shakeRow ? 'animate-shake' : ''}`}>
              {Array(WORD_LENGTH).fill('').map((_, j) => {
                const char = currentGuess[j] || '';
                const isActive = char !== '';
                return (
                  <div 
                    key={j}
                    className={`flex items-center justify-center font-bold rounded-lg border-2 ${isActive ? 'border-slate-400 text-slate-800 scale-[1.02]' : 'border-slate-200 bg-slate-50'} transition-all`}
                    style={{ 
                      width: WORD_LENGTH > 8 ? '28px' : WORD_LENGTH > 6 ? '34px' : '48px',
                      height: WORD_LENGTH > 8 ? '32px' : WORD_LENGTH > 6 ? '38px' : '48px',
                      fontSize: WORD_LENGTH > 6 ? '1.1rem' : '1.25rem'
                    }}
                  >
                    {char}
                  </div>
                )
              })}
            </div>
          )}
          
          {/* Empty Rows */}
          {Array(emptyRows).fill('').map((_, i) => (
            <div key={`empty-${i}`} className="flex gap-1 sm:gap-1.5 justify-center">
              {Array(WORD_LENGTH).fill('').map((_, j) => (
                <div 
                  key={`empty-${i}-${j}`} 
                  className="rounded-lg border-2 border-slate-100 bg-slate-50/50" 
                  style={{ 
                    width: WORD_LENGTH > 8 ? '28px' : WORD_LENGTH > 6 ? '34px' : '48px',
                    height: WORD_LENGTH > 8 ? '32px' : WORD_LENGTH > 6 ? '38px' : '48px'
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        <Keyboard />

      </main>
    </div>
  );
}
