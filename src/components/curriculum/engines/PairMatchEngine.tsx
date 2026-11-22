import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Check, Link2, Sparkles } from 'lucide-react';
import type { PairMatchData } from '../../../curriculum/types';
import type { EngineCompleteResult } from './CuanQuizEngine';
import { ExplanationCard } from '../ExplanationCard';
import { playClick, playCorrect, playWrong } from '../../../lib/audio';
import { vibrateError, vibrateSuccess } from '../../../lib/haptics';

interface PairMatchEngineProps {
  data: PairMatchData;
  onMistake?: (itemId: string) => void;
  onComplete: (result: EngineCompleteResult) => void;
}

function deterministicShuffle<T>(arr: T[], seedOffset = 17): T[] {
  const copy = [...arr];
  let seed = copy.length * 9301 + seedOffset * 49297;
  for (let i = copy.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

export const PairMatchEngine: React.FC<PairMatchEngineProps> = ({
  data,
  onMistake,
  onComplete,
}) => {
  const isSequence = data.mode === 'sequence';

  // ---- PAIRS STATE ----
  const pairs = data.pairs || [];
  const shuffledRights = useMemo(
    () => deterministicShuffle(pairs.map((p) => ({ id: p.id, text: p.rightId })), 31),
    [pairs]
  );
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [shakePairId, setShakePairId] = useState<string | null>(null);

  // ---- SEQUENCE STATE ----
  const canonicalSteps = useMemo(
    () => [...(data.sequenceSteps || [])].sort((a, b) => a.order - b.order),
    [data.sequenceSteps]
  );
  const [orderedIds, setOrderedIds] = useState<string[]>(() => {
    const sh = deterministicShuffle(canonicalSteps.map((s) => s.id), 53);
    // Avoid spawning already sorted
    if (
      sh.length > 1 &&
      sh.every((id, idx) => id === canonicalSteps[idx]?.id)
    ) {
      const first = sh.shift()!;
      sh.push(first);
    }
    return sh;
  });
  const [seqSubmitted, setSeqSubmitted] = useState(false);
  const [seqExactCorrect, setSeqExactCorrect] = useState(false);

  const pairsDone = !isSequence && matchedIds.length === pairs.length && pairs.length > 0;
  const isComplete = isSequence ? seqSubmitted : pairsDone;

  const handleSelectLeft = (id: string) => {
    if (matchedIds.includes(id) || isComplete) return;
    playClick();
    setSelectedLeftId((prev) => (prev === id ? null : id));
  };

  const handleSelectRight = (rightId: string) => {
    if (!selectedLeftId || matchedIds.includes(rightId) || isComplete) return;
    if (selectedLeftId === rightId) {
      playCorrect();
      vibrateSuccess();
      setMatchedIds((prev) => [...prev, rightId]);
      setSelectedLeftId(null);
    } else {
      playWrong();
      vibrateError();
      setWrongAttempts((w) => w + 1);
      setShakePairId(rightId);
      onMistake?.(selectedLeftId);
      setTimeout(() => setShakePairId(null), 500);
      setSelectedLeftId(null);
    }
  };

  const moveStep = (idx: number, dir: -1 | 1) => {
    if (seqSubmitted) return;
    const target = idx + dir;
    if (target < 0 || target >= orderedIds.length) return;
    playClick();
    const copy = [...orderedIds];
    const tmp = copy[idx];
    copy[idx] = copy[target];
    copy[target] = tmp;
    setOrderedIds(copy);
  };

  const handleCheckSequence = () => {
    if (seqSubmitted) return;
    const isExact = orderedIds.every((id, i) => canonicalSteps[i]?.id === id);
    setSeqSubmitted(true);
    setSeqExactCorrect(isExact);
    if (isExact) {
      playCorrect();
      vibrateSuccess();
    } else {
      playWrong();
      vibrateError();
      onMistake?.(canonicalSteps[0]?.id || 'seq');
      // Snap display to canonical order inside explanation review? We keep comparison clear below.
    }
  };

  const handleFinish = () => {
    playClick();
    if (isSequence) {
      const rightPositions = orderedIds.filter(
        (id, i) => canonicalSteps[i]?.id === id
      ).length;
      const total = Math.max(1, canonicalSteps.length);
      const score = Math.round((rightPositions / total) * 100);
      onComplete({
        score,
        correctCount: rightPositions,
        totalCount: total,
        wrongItemIds: seqExactCorrect ? [] : ['sequence'],
      });
    } else {
      const total = Math.max(1, pairs.length);
      const penalty = Math.min(total, wrongAttempts);
      const score = Math.max(40, Math.round(((total - penalty * 0.5) / total) * 100));
      onComplete({
        score,
        correctCount: Math.max(0, total - Math.min(total, wrongAttempts)),
        totalCount: total,
        wrongItemIds: wrongAttempts > 0 ? ['pairs'] : [],
      });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span>
          {isSequence ? 'URUTAN LOGIS • TANPA TIMER' : 'PASANGKAN KONSEP • TANPA TIMER'}
        </span>
        {!isSequence && (
          <span className="tabular-nums text-[#0D1117]">
            Cocok {matchedIds.length} / {pairs.length}
          </span>
        )}
      </div>

      <div className="bg-white rounded-3xl p-5 sm:p-6">
        <p className="text-sm sm:text-base font-bold text-[#0D1117] leading-relaxed mb-5">
          {data.instructionId}
        </p>

        {!isSequence ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                1. Pilih Situasi / Istilah
              </p>
              {pairs.map((p) => {
                const isMatched = matchedIds.includes(p.id);
                const isSelected = selectedLeftId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={isMatched}
                    onClick={() => handleSelectLeft(p.id)}
                    className={`w-full text-left p-3.5 rounded-2xl text-sm font-semibold transition-all flex items-center justify-between gap-2 cursor-pointer disabled:cursor-default ${
                      isMatched
                        ? 'bg-[#ECFDF5] text-[#065F46]'
                        : isSelected
                        ? 'bg-[#0D1117] text-white'
                        : 'bg-[#F4F5F7] hover:bg-[#EAECEF] text-[#0D1117]'
                    }`}
                  >
                    <span>{p.leftId}</span>
                    {isMatched && <Check className="w-4 h-4 shrink-0 text-[#059669]" />}
                    {isSelected && <Link2 className="w-4 h-4 shrink-0 text-[#D4AF37]" />}
                  </button>
                );
              })}
            </div>

            {/* Right column */}
            <div className="space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                2. Pasangkan dengan Prinsip Tepat
              </p>
              {shuffledRights.map((r) => {
                const isMatched = matchedIds.includes(r.id);
                const isShaking = shakePairId === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    disabled={isMatched || !selectedLeftId}
                    onClick={() => handleSelectRight(r.id)}
                    className={`w-full text-left p-3.5 rounded-2xl text-sm font-medium transition-all flex items-center justify-between gap-2 cursor-pointer disabled:cursor-default ${
                      isMatched
                        ? 'bg-[#ECFDF5] text-[#065F46]'
                        : isShaking
                        ? 'bg-[#FEE2E2] text-[#991B1B] animate-pulse'
                        : selectedLeftId
                        ? 'bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#0D1117] ring-1 ring-emerald-200'
                        : 'bg-[#F4F5F7] text-slate-600'
                    }`}
                  >
                    <span>{r.text}</span>
                    {isMatched && <Check className="w-4 h-4 shrink-0 text-[#059669]" />}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Susun dari #1 (Paling Awal / Terendah) ke #{canonicalSteps.length}
            </p>
            {orderedIds.map((stepId, idx) => {
              const step = canonicalSteps.find((s) => s.id === stepId);
              if (!step) return null;
              const isPosCorrect = seqSubmitted && canonicalSteps[idx]?.id === stepId;
              return (
                <div
                  key={stepId}
                  className={`rounded-2xl p-3.5 flex items-center gap-3 transition-colors ${
                    seqSubmitted
                      ? isPosCorrect
                        ? 'bg-[#ECFDF5] text-[#065F46]'
                        : 'bg-[#FEF2F2] text-[#991B1B]'
                      : 'bg-[#F4F5F7] text-[#0D1117]'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-xl text-xs font-extrabold flex items-center justify-center shrink-0 tabular-nums ${
                      seqSubmitted
                        ? isPosCorrect
                          ? 'bg-[#059669] text-white'
                          : 'bg-[#DC2626] text-white'
                        : 'bg-white text-[#0D1117]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1 text-sm font-semibold leading-snug">
                    {step.labelId}
                    {seqSubmitted && !isPosCorrect && (
                      <p className="text-[11px] font-bold text-[#059669] mt-0.5">
                        Posisi benar: Urutan #{step.order}
                      </p>
                    )}
                  </div>
                  {!seqSubmitted && (
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveStep(idx, -1)}
                        className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                        aria-label="Naikkan urutan"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === orderedIds.length - 1}
                        onClick={() => moveStep(idx, 1)}
                        className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                        aria-label="Turunkan urutan"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {!seqSubmitted && (
              <button
                type="button"
                onClick={handleCheckSequence}
                className="w-full mt-2 py-3.5 rounded-full bg-[#0D1117] hover:bg-slate-800 text-white font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                Periksa Urutan
              </button>
            )}
          </div>
        )}
      </div>

      {isComplete && (
        <ExplanationCard
          spec={data.explanationCard}
          isCorrect={isSequence ? seqExactCorrect : wrongAttempts === 0}
          onContinue={handleFinish}
          continueLabel="Selesaikan Materi"
        />
      )}
    </div>
  );
};
