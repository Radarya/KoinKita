import React, { useEffect, useMemo, useState } from 'react';
import { Delete, CornerDownLeft, HelpCircle } from 'lucide-react';
import type { FinWordleWordItem } from '../../../curriculum/types';
import type { EngineCompleteResult } from './CuanQuizEngine';
import { ExplanationCard } from '../ExplanationCard';
import { card } from '../../../curriculum/helpers';
import { playClick, playCorrect, playWrong } from '../../../lib/audio';
import { vibrateError, vibrateSuccess } from '../../../lib/haptics';

interface FinWordleCurriculumEngineProps {
  words: FinWordleWordItem[];
  onMistake?: (itemId: string) => void;
  onComplete: (result: EngineCompleteResult) => void;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
];

const MAX_ATTEMPTS = 6;
type TileStatus = 'correct' | 'present' | 'absent' | 'empty';

function evaluateGuess(guess: string, target: string): TileStatus[] {
  const result: TileStatus[] = Array(target.length).fill('absent');
  const remaining: Record<string, number> = {};
  for (let i = 0; i < target.length; i++) {
    if (guess[i] === target[i]) {
      result[i] = 'correct';
    } else {
      remaining[target[i]] = (remaining[target[i]] || 0) + 1;
    }
  }
  for (let i = 0; i < target.length; i++) {
    if (result[i] !== 'correct') {
      const ch = guess[i];
      if (remaining[ch] && remaining[ch] > 0) {
        result[i] = 'present';
        remaining[ch] -= 1;
      }
    }
  }
  return result;
}

export const FinWordleCurriculumEngine: React.FC<FinWordleCurriculumEngineProps> = ({
  words,
  onMistake,
  onComplete,
}) => {
  const [wordIdx, setWordIdx] = useState(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [solved, setSolved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [revealHint, setRevealHint] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);

  const item = words[wordIdx];
  const target = useMemo(
    () => (item?.word || '').toUpperCase().replace(/[^A-Z]/g, ''),
    [item]
  );
  const wordLen = target.length;
  const isFinishedWord = solved || failed;

  const keyStatuses = useMemo(() => {
    const map: Record<string, TileStatus> = {};
    for (const g of guesses) {
      const evals = evaluateGuess(g, target);
      for (let i = 0; i < target.length; i++) {
        const ch = g[i];
        const st = evals[i];
        const prev = map[ch];
        if (st === 'correct') map[ch] = 'correct';
        else if (st === 'present' && prev !== 'correct') map[ch] = 'present';
        else if (!prev) map[ch] = 'absent';
      }
    }
    return map;
  }, [guesses, target]);

  const submitGuess = () => {
    if (isFinishedWord || currentGuess.length !== wordLen) return;
    const g = currentGuess.toUpperCase();
    const nextGuesses = [...guesses, g];
    setGuesses(nextGuesses);
    setCurrentGuess('');

    if (g === target) {
      playCorrect();
      vibrateSuccess();
      setSolved(true);
      setCorrectCount((c) => c + 1);
    } else if (nextGuesses.length >= MAX_ATTEMPTS) {
      playWrong();
      vibrateError();
      setFailed(true);
      setWrongIds((prev) => [...prev, target]);
      onMistake?.(target);
    } else {
      playClick();
    }
  };

  const handleKey = (key: string) => {
    if (isFinishedWord) return;
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACK' || key === 'BACKSPACE') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < wordLen) {
      playClick();
      setCurrentGuess((prev) => prev + key);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.toUpperCase();
      if (k === 'ENTER') {
        e.preventDefault();
        submitGuess();
      } else if (k === 'BACKSPACE') {
        e.preventDefault();
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(k) && !isFinishedWord) {
        setCurrentGuess((prev) => (prev.length < wordLen ? prev + k : prev));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const handleUseFreeLetterHint = () => {
    if (isFinishedWord || revealHint) return;
    playClick();
    setRevealHint(true);
  };

  const handleNextWord = () => {
    playClick();
    if (wordIdx + 1 < words.length) {
      setWordIdx((i) => i + 1);
      setGuesses([]);
      setCurrentGuess('');
      setSolved(false);
      setFailed(false);
      setRevealHint(false);
    } else {
      const total = words.length;
      onComplete({
        score: total > 0 ? Math.round((correctCount / total) * 100) : 100,
        correctCount,
        totalCount: total,
        wrongItemIds: wrongIds,
      });
    }
  };

  if (!item) return null;

  const explanationSpec = card({
    why: item.definitionId,
    calc: `Contoh Nyata Indonesia: ${item.exampleId}`,
    type: item.statementType || 'fixed_fact',
    reg: item.regulationMeta,
    next: `Ingat arti kata "${target}" setiap kali menjumpai kontrak, aplikasi, atau pemberitaan ekonomi.`,
    ok: `Hebat! Kata ${wordLen} huruf "${target}" berhasil dipecahkan.`,
    bad: `Kata targetnya adalah "${target}" yang terdiri dari ${wordLen} huruf. Pelajari maknanya di bawah sebelum lanjut!`,
  });

  // Adaptive tile sizing for 3..9 letters
  const tileSizeClass =
    wordLen >= 8
      ? 'w-8 h-9 sm:w-10 sm:h-11 text-sm sm:text-base'
      : wordLen >= 6
      ? 'w-9 h-10 sm:w-11 sm:h-12 text-base sm:text-lg'
      : 'w-11 h-12 sm:w-12 sm:h-14 text-lg sm:text-xl';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span>KOSAKATA EKONOMI • {wordLen} HURUF (3–9)</span>
        <span className="tabular-nums text-[#0D1117]">
          Kata {wordIdx + 1} / {words.length}
        </span>
      </div>

      {/* Clue card */}
      <div className="bg-white rounded-3xl p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#059669] mb-1">
              Petunjuk Definisi ({wordLen} Huruf)
            </p>
            <p className="text-sm sm:text-base font-bold text-[#0D1117] leading-relaxed">
              {item.clueId}
            </p>
          </div>
          {!isFinishedWord && (
            <button
              type="button"
              onClick={handleUseFreeLetterHint}
              disabled={revealHint}
              className="shrink-0 px-3 py-1.5 rounded-full bg-[#F4F5F7] hover:bg-[#EAECEF] text-xs font-bold text-[#0D1117] inline-flex items-center gap-1 disabled:opacity-60 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#059669]" />
              {revealHint ? `Awal: ${target[0]}...${target[wordLen - 1]}` : 'Huruf Awal'}
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 flex flex-col items-center gap-1.5">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIdx) => {
          const pastGuess = guesses[rowIdx];
          const isCurrentRow = rowIdx === guesses.length && !isFinishedWord;
          const rowText = pastGuess || (isCurrentRow ? currentGuess : '');
          const evals = pastGuess ? evaluateGuess(pastGuess, target) : null;

          return (
            <div key={rowIdx} className="flex gap-1 sm:gap-1.5">
              {Array.from({ length: wordLen }).map((__, colIdx) => {
                const letter = rowText[colIdx] || '';
                const st = evals ? evals[colIdx] : 'empty';
                let tileCls = 'bg-[#F4F5F7] text-[#0D1117]';
                if (st === 'correct') tileCls = 'bg-[#059669] text-white';
                else if (st === 'present') tileCls = 'bg-[#D4AF37] text-white';
                else if (st === 'absent') tileCls = 'bg-slate-600 text-white';
                else if (letter) tileCls = 'bg-slate-200 text-[#0D1117] ring-2 ring-[#0D1117]';

                return (
                  <div
                    key={colIdx}
                    className={`${tileSizeClass} rounded-xl flex items-center justify-center font-extrabold select-none transition-colors ${tileCls}`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* On-screen Keyboard when active */}
      {!isFinishedWord && (
        <div className="bg-[#F4F5F7] rounded-3xl p-2.5 sm:p-3 space-y-1.5">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
              {row.map((key) => {
                const st = keyStatuses[key];
                const isWide = key === 'ENTER' || key === 'BACK';
                let kCls = 'bg-white text-[#0D1117] hover:bg-slate-100';
                if (key === 'ENTER') kCls = 'bg-[#059669] text-white hover:bg-emerald-700';
                else if (st === 'correct') kCls = 'bg-[#059669] text-white';
                else if (st === 'present') kCls = 'bg-[#D4AF37] text-white';
                else if (st === 'absent') kCls = 'bg-slate-400 text-white';

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleKey(key)}
                    className={`${
                      isWide ? 'px-2.5 sm:px-3.5 text-xs' : 'flex-1 max-w-[38px] text-xs sm:text-sm'
                    } h-11 rounded-xl font-bold flex items-center justify-center transition-colors cursor-pointer select-none ${kCls}`}
                  >
                    {key === 'BACK' ? (
                      <Delete className="w-4 h-4" />
                    ) : key === 'ENTER' ? (
                      <CornerDownLeft className="w-4 h-4" />
                    ) : (
                      key
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Mandatory Post-Solve Definition & Indonesia Example Card */}
      {isFinishedWord && (
        <ExplanationCard
          spec={explanationSpec}
          isCorrect={solved}
          onContinue={handleNextWord}
          continueLabel={wordIdx + 1 < words.length ? 'Kata Berikutnya' : 'Selesaikan Materi'}
        />
      )}
    </div>
  );
};
