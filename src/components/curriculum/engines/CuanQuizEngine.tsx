import React, { useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';
import type { CuanQuizQuestion } from '../../../curriculum/types';
import { shuffleOptionsKeepingAnswer } from '../../../curriculum/shuffleUtils';
import { ExplanationCard } from '../ExplanationCard';
import { playClick, playCorrect, playWrong } from '../../../lib/audio';
import { vibrateError, vibrateSuccess } from '../../../lib/haptics';

export interface EngineCompleteResult {
  score: number;
  correctCount: number;
  totalCount: number;
  wrongItemIds: string[];
}

interface CuanQuizEngineProps {
  questions: CuanQuizQuestion[];
  filterItemIds?: string[];
  onMistake?: (itemId: string) => void;
  onComplete: (result: EngineCompleteResult) => void;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export const CuanQuizEngine: React.FC<CuanQuizEngineProps> = ({
  questions,
  filterItemIds,
  onMistake,
  onComplete,
}) => {
  const [sessionSeed] = useState(() => Math.floor(Math.random() * 1_000_000) + 1);

  const activeQuestions = useMemo(() => {
    const base =
      !filterItemIds || filterItemIds.length === 0
        ? questions
        : (() => {
            const filtered = questions.filter((q) => filterItemIds.includes(q.id));
            return filtered.length > 0 ? filtered : questions;
          })();

    return base.map((q, idx) => {
      const sh = shuffleOptionsKeepingAnswer(
        q.optionsId,
        q.correctIndex,
        `${sessionSeed}:${q.id}:${idx}`
      );
      return {
        ...q,
        optionsId: sh.options,
        correctIndex: sh.correctIndex,
      };
    });
  }, [questions, filterItemIds, sessionSeed]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);

  const question = activeQuestions[currentIdx];
  const hasAnswered = selectedIdx !== null;
  const isCorrect = selectedIdx === question?.correctIndex;

  if (!question) {
    return null;
  }

  const handleSelect = (idx: number) => {
    if (hasAnswered) return;
    setSelectedIdx(idx);
    const ok = idx === question.correctIndex;
    if (ok) {
      playCorrect();
      vibrateSuccess();
      setCorrectCount((c) => c + 1);
    } else {
      playWrong();
      vibrateError();
      setWrongIds((prev) => [...prev, question.id]);
      onMistake?.(question.id);
    }
  };

  const handleNext = () => {
    playClick();
    if (currentIdx + 1 < activeQuestions.length) {
      setCurrentIdx((i) => i + 1);
      setSelectedIdx(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const total = activeQuestions.length;
      const score = total > 0 ? Math.round((correctCount / total) * 100) : 100;
      onComplete({
        score,
        correctCount,
        totalCount: total,
        wrongItemIds: wrongIds,
      });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span>MODE TANPA TIMER • PAHAMI KONSEP</span>
        <span className="tabular-nums text-[#0D1117]">
          Soal {currentIdx + 1} / {activeQuestions.length}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {activeQuestions.map((q, i) => (
          <div
            key={q.id}
            className={`h-2 flex-1 rounded-full transition-colors ${
              i < currentIdx
                ? wrongIds.includes(q.id)
                  ? 'bg-amber-400'
                  : 'bg-[#059669]'
                : i === currentIdx
                ? 'bg-[#0D1117]'
                : 'bg-[#E5E7EB]'
            }`}
          />
        ))}
      </div>

      <div className="bg-white rounded-3xl p-5 sm:p-7">
        {question.parametricNoteId && (
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#059669] mb-2">
            {question.parametricNoteId}
          </p>
        )}
        <h3 className="text-base sm:text-lg font-bold text-[#0D1117] leading-relaxed mb-5">
          {question.promptId}
        </h3>

        <div className="space-y-2.5">
          {question.optionsId.map((opt, idx) => {
            const isPicked = selectedIdx === idx;
            const isAnswer = idx === question.correctIndex;
            let containerClass = 'bg-[#F4F5F7] hover:bg-[#EAECEF] text-[#0D1117]';
            let badgeClass = 'bg-white text-slate-700';

            if (hasAnswered) {
              if (isAnswer) {
                containerClass = 'bg-[#ECFDF5] text-[#064E3B] ring-2 ring-[#059669]';
                badgeClass = 'bg-[#059669] text-white';
              } else if (isPicked) {
                containerClass = 'bg-[#FEF2F2] text-[#7F1D1D] ring-2 ring-[#DC2626]';
                badgeClass = 'bg-[#DC2626] text-white';
              } else {
                containerClass = 'bg-[#F4F5F7] text-slate-400 opacity-70';
              }
            }

            return (
              <button
                key={`${question.id}-opt-${idx}`}
                type="button"
                disabled={hasAnswered}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-4 rounded-2xl flex items-start gap-3 transition-all cursor-pointer disabled:cursor-default ${containerClass}`}
              >
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 ${badgeClass}`}
                >
                  {hasAnswered && isAnswer ? (
                    <Check className="w-4 h-4" />
                  ) : hasAnswered && isPicked ? (
                    <X className="w-4 h-4" />
                  ) : (
                    LETTERS[idx] || idx + 1
                  )}
                </span>
                <span className="text-sm font-medium leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {hasAnswered && (
        <ExplanationCard
          spec={question.explanationCard}
          isCorrect={isCorrect}
          onContinue={handleNext}
          continueLabel={
            currentIdx + 1 < activeQuestions.length ? 'Soal Berikutnya' : 'Selesaikan Materi'
          }
        />
      )}
    </div>
  );
};
