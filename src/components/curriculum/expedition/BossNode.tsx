import React from 'react';
import { Check, Home, Lock, Scale, ShieldCheck, Store } from 'lucide-react';
import type { LessonConfig } from '../../../curriculum/types';
import type { BossMotifKind } from './expeditionConfig';
import type { NodeVisualState } from './PathNode';

interface BossNodeProps {
  lesson: LessonConfig;
  motif: BossMotifKind;
  state: NodeVisualState;
  isSelected: boolean;
  onSelect: () => void;
}

function getBossEmblemIcon(motif: BossMotifKind) {
  switch (motif) {
    case 'trade':
      return Store;
    case 'shield':
      return ShieldCheck;
    case 'scale':
      return Scale;
    case 'home_tree':
    default:
      return Home;
  }
}

/**
 * 3-Layer Geometric Wayang Gunungan Token for Boss Challenges:
 * 1) Gunungan silhouette with solid extruded base
 * 2) Nusantara geometric motif inside
 * 3) Thematic unit symbol (trade, scale, shield, home/wealth)
 */
export const BossNode: React.FC<BossNodeProps> = ({
  lesson,
  motif,
  state,
  isSelected,
  onSelect,
}) => {
  const Icon = getBossEmblemIcon(motif);
  const isLocked = state === 'locked';

  const colors = (() => {
    switch (state) {
      case 'done':
        return { top: '#EAB308', edge: '#A16207', motif: '#FEF08A', ink: '#422006' };
      case 'frontier':
        return { top: '#059669', edge: '#065F46', motif: '#6EE7B7', ink: '#FFFFFF' };
      case 'accessible':
        return { top: '#0D1117', edge: '#020617', motif: '#D4AF37', ink: '#FFFFFF' };
      default:
        return { top: '#E5E7EB', edge: '#94A3B8', motif: '#F8FAFC', ink: '#64748B' };
    }
  })();

  return (
    <div className="relative flex flex-col items-center">
      {state === 'frontier' && !isSelected && (
        <span className="mb-1 bg-[#D4AF37] text-[#0D1117] px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold tracking-wide animate-bounce whitespace-nowrap">
          TANTANGAN UNIT
        </span>
      )}

      <button
        type="button"
        disabled={isLocked}
        onClick={onSelect}
        aria-label={lesson.titleId}
        className={`relative w-[84px] h-[86px] flex items-center justify-center transition-transform ${
          isLocked
            ? 'cursor-not-allowed'
            : 'cursor-pointer hover:scale-[1.05] active:translate-y-0.5'
        } ${isSelected ? 'scale-[1.06]' : ''}`}
      >
        {state === 'frontier' && (
          <span className="absolute inset-1 rounded-3xl bg-emerald-400/30 animate-ping pointer-events-none" />
        )}

        <svg viewBox="0 0 88 90" className="w-full h-full overflow-visible" aria-hidden="true">
          <ellipse cx="44" cy="83" rx="28" ry="5.5" fill="#0D1117" opacity="0.12" />
          {/* Layer 1: Outer Gunungan Silhouette + thickness base */}
          <path
            d="M44 8 C56 22, 74 42, 74 62 C74 74, 61 79, 44 79 C27 79, 14 74, 14 62 C14 42, 32 22, 44 8 Z"
            transform="translate(0, 5)"
            fill={colors.edge}
          />
          <path
            d="M44 8 C56 22, 74 42, 74 62 C74 74, 61 79, 44 79 C27 79, 14 74, 14 62 C14 42, 32 22, 44 8 Z"
            fill={colors.top}
          />
          {/* Layer 2: Inner Geometric Nusantara Diamond Lattice */}
          <path
            d="M44 17 L64 49 L44 71 L24 49 Z"
            fill="none"
            stroke={colors.motif}
            strokeWidth="2.2"
            opacity="0.8"
          />
        </svg>

        {/* Layer 3: Center Unit Symbol */}
        <div
          className="absolute inset-0 flex items-center justify-center pt-3.5"
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
