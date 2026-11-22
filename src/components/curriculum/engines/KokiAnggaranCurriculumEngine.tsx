import React, { useMemo, useState } from 'react';
import { Utensils, Tag, Check } from 'lucide-react';
import type { KokiAnggaranCurriculumData } from '../../../curriculum/types';
import { seededShuffleArray } from '../../../curriculum/shuffleUtils';
import type { EngineCompleteResult } from './CuanQuizEngine';
import { ExplanationCard } from '../ExplanationCard';
import { playClick, playCorrect, playWrong } from '../../../lib/audio';
import { vibrateError, vibrateSuccess } from '../../../lib/haptics';

interface KokiAnggaranCurriculumEngineProps {
  data: KokiAnggaranCurriculumData;
  filterItemIds?: string[];
  onMistake?: (itemId: string) => void;
  onComplete: (result: EngineCompleteResult) => void;
}

export const KokiAnggaranCurriculumEngine: React.FC<KokiAnggaranCurriculumEngineProps> = ({
  data,
  filterItemIds,
  onMistake,
  onComplete,
}) => {
  const [sessionSeed] = useState(() => Math.floor(Math.random() * 1_000_000) + 1);

  const items = useMemo(() => {
    if (!filterItemIds || filterItemIds.length === 0) {
      return seededShuffleArray(data.items, `${sessionSeed}:${data.instructionId}`);
    }
    const filtered = data.items.filter((i) => filterItemIds.includes(i.id));
    return filtered.length > 0 ? filtered : data.items;
  }, [data.items, data.instructionId, filterItemIds, sessionSeed]);

  const [itemIdx, setItemIdx] = useState(0);
  const [selectedBucketId, setSelectedBucketId] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);

  const item = items[itemIdx];
  const hasAnswered = selectedBucketId !== null;
  const isCorrect = selectedBucketId === item?.correctBucketId;

  if (!item) return null;

  const handleSort = (bucketId: string) => {
    if (hasAnswered) return;
    setSelectedBucketId(bucketId);
    if (bucketId === item.correctBucketId) {
      playCorrect();
      vibrateSuccess();
      setCorrectCount((c) => c + 1);
    } else {
      playWrong();
      vibrateError();
      setWrongIds((prev) => [...prev, item.id]);
      onMistake?.(item.id);
    }
  };

  const handleNext = () => {
    playClick();
    if (itemIdx + 1 < items.length) {
      setItemIdx((i) => i + 1);
      setSelectedBucketId(null);
    } else {
      const total = items.length;
      onComplete({
        score: total > 0 ? Math.round((correctCount / total) * 100) : 100,
        correctCount,
        totalCount: total,
        wrongItemIds: wrongIds,
      });
    }
  };

  const gridColsClass =
    data.buckets.length === 4
      ? 'grid-cols-1 sm:grid-cols-2'
      : data.buckets.length === 3
      ? 'grid-cols-1 sm:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span>KOKI ANGGARAN • MODE TELITI TANPA TIMER</span>
        <span className="tabular-nums text-[#0D1117]">
          Kartu {itemIdx + 1} / {items.length}
        </span>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5">
        {items.map((it, i) => (
          <div
            key={it.id}
            className={`h-2 flex-1 rounded-full transition-colors ${
              i < itemIdx
                ? wrongIds.includes(it.id)
                  ? 'bg-amber-400'
                  : 'bg-[#059669]'
                : i === itemIdx
                ? 'bg-[#0D1117]'
                : 'bg-[#E5E7EB]'
            }`}
          />
        ))}
      </div>

      {/* Instruction + Active Item Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7">
        <div className="flex items-center gap-2 text-xs font-bold text-[#059669] mb-3">
          <Utensils className="w-4 h-4" />
          <span>{data.instructionId}</span>
        </div>

        <div className="bg-[#F4F5F7] rounded-2xl p-5 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[11px] font-bold text-slate-600 mb-2">
            <Tag className="w-3 h-3 text-[#D4AF37]" />
            <span>{item.contextTagId}</span>
          </div>
          <h3 className="text-base sm:text-xl font-extrabold text-[#0D1117] leading-snug">
            {item.labelId}
          </h3>
        </div>

        {/* 2..4 Dynamic Buckets */}
        <div className={`grid ${gridColsClass} gap-3`}>
          {data.buckets.map((bucket) => {
            const isPicked = selectedBucketId === bucket.id;
            const isTarget = bucket.id === item.correctBucketId;
            let cls =
              'bg-[#F4F5F7] hover:bg-[#E7ECE9] text-[#0D1117]';

            if (hasAnswered) {
              if (isTarget) {
                cls = 'bg-[#ECFDF5] text-[#065F46] ring-2 ring-[#059669]';
              } else if (isPicked) {
                cls = 'bg-[#FEF2F2] text-[#991B1B] ring-2 ring-[#DC2626]';
              } else {
                cls = 'bg-[#F4F5F7] text-slate-400 opacity-65';
              }
            }

            return (
              <button
                key={bucket.id}
                type="button"
                disabled={hasAnswered}
                onClick={() => handleSort(bucket.id)}
                className={`p-4 rounded-2xl text-left font-bold text-sm transition-all flex items-center justify-between gap-2 cursor-pointer disabled:cursor-default ${cls}`}
              >
                <span className="leading-snug">{bucket.labelId}</span>
                {hasAnswered && isTarget && (
                  <Check className="w-4 h-4 shrink-0 text-[#059669]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {hasAnswered && (
        <ExplanationCard
          spec={item.explanationCard}
          isCorrect={isCorrect}
          onContinue={handleNext}
          continueLabel={itemIdx + 1 < items.length ? 'Kartu Berikutnya' : 'Selesaikan Materi'}
        />
      )}
    </div>
  );
};
