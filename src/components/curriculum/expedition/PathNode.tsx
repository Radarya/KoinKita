import React from 'react';
import {
  BookOpen,
  Calculator,
  Check,
  Link2,
  Lock,
  Search,
  SpellCheck,
  TrendingUp,
  Utensils,
} from 'lucide-react';
import type { LessonConfig } from '../../../curriculum/types';

export type NodeVisualState = 'done' | 'frontier' | 'accessible' | 'locked';

interface PathNodeProps {
  lesson: LessonConfig;
  stepNumber: number;
  state: NodeVisualState;
  isSelected: boolean;
  onSelect: () => void;
}

function getPathActivityIcon(lesson: LessonConfig) {
  switch (lesson.mechanic) {
    case 'FinWordle':
      return SpellCheck;
    case 'KokiAnggaran':
      return Utensils;
    case 'DetektifCuan':
      return Search;
    case 'PairMatch':
      return Link2;
    case 'PohonAset':
      return TrendingUp;
    default: {
      const lower = lesson.titleId.toLowerCase();
      if (/hitung|ppn|bunga|flat|rasio|spread|pajak|kpr|dana/.test(lower)) {
        return Calculator;
      }
      return BookOpen;
    }
  }
}

/**
 * Chamfered Octagon Geometric Coin Token ("Keping Nusantara").
 * No Rupiah numerals or portraits — strictly geometric 2-ring educational token.
 */
export const PathNode: React.FC<PathNodeProps> = ({
  lesson,
  stepNumber,
  state,
  isSelected,
  onSelect,
}) => {
  const Icon = getPathActivityIcon(lesson);
  const isLocked = state === 'locked';

  const colors = (() => {
    switch (state) {
      case 'done':
        return {
          top: '#EAB308',
          rim: '#FEF08A',
          edge: '#A16207',
          ink: '#422006',
        };
      case 'frontier':
        return {
          top: '#059669',
          rim: '#6EE7B7',
          edge: '#065F46',
          ink: '#FFFFFF',
        };
      case 'accessible':
        return {
          top: '#FFFFFF',
          rim: '#10B981',
          edge: '#059669',
          ink: '#059669',
        };
      default:
        return {
          top: '#E5E7EB',
          rim: '#F8FAFC',
          edge: '#94A3B8',
          ink: '#64748B',
        };
    }
  })();

  const sizeClass =
    state === 'frontier' ? 'w-[78px] h-[76px]' : 'w-[68px] h-[66px]';

  return (
    <div className="relative flex flex-col items-center">
      {state === 'frontier' && !isSelected && (
        <span className="mb-1.5 bg-[#0D1117] text-white px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold tracking-wide animate-bounce whitespace-nowrap">
          MULAI
        </span>
      )}

      <button
        type="button"
        disabled={isLocked}
        onClick={onSelect}
        aria-label={`Keping Materi ${stepNumber}: ${lesson.titleId}`}
        className={`relative ${sizeClass} flex items-center justify-center transition-transform ${
          isLocked
            ? 'cursor-not-allowed'
            : 'cursor-pointer hover:scale-[1.05] active:translate-y-0.5'
        } ${isSelected ? 'scale-[1.06]' : ''}`}
      >
        {state === 'frontier' && (
          <span className="absolute inset-0.5 rounded-2xl bg-emerald-400/30 animate-ping pointer-events-none" />
        )}

        <svg viewBox="0 0 84 82" className="w-full h-full overflow-visible" aria-hidden="true">
          <ellipse cx="42" cy="75" rx="26" ry="5" fill="#0D1117" opacity="0.1" />
          {/* Rounded-corner octagonal coin thickness base */}
          <path
            d="M28 10 H56 Q62 10 66 14 L72 20 Q76 24 76 30 V52 Q76 58 72 62 L66 68 Q62 72 56 72 H28 Q22 72 18 68 L12 62 Q8 58 8 52 V30 Q8 24 12 20 L18 14 Q22 10 28 10 Z"
            transform="translate(0, 5)"
            fill={colors.edge}
          />
          {/* Top face */}
          <path
            d="M28 10 H56 Q62 10 66 14 L72 20 Q76 24 76 30 V52 Q76 58 72 62 L66 68 Q62 72 56 72 H28 Q22 72 18 68 L12 62 Q8 58 8 52 V30 Q8 24 12 20 L18 14 Q22 10 28 10 Z"
            fill={colors.top}
          />
          {/* Inner sculpted ring */}
          <path
            d="M30 16 H54 Q58 16 61 19 L66 24 Q69 27 69 31 V51 Q69 55 66 58 L61 63 Q58 66 54 66 H30 Q26 66 23 63 L18 58 Q15 55 15 51 V31 Q15 27 18 24 L23 19 Q26 16 30 16 Z"
            fill="none"
            stroke={colors.rim}
            strokeWidth="2.5"
            opacity="0.85"
          />
        </svg>

        <div
          className="absolute inset-0 flex items-center justify-center pb-1"
          style={{ color: colors.ink }}
        >
          {state === 'done' ? (
            <Check className="w-6 h-6 stroke-[3]" />
          ) : state === 'locked' ? (
            <Lock className="w-5 h-5" />
          ) : (
            <Icon className="w-6 h-6" />
          )}
        </div>
      </button>
    </div>
  );
};
