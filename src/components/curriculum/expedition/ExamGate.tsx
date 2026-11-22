import React from 'react';
import { Award, Check, Lock, Play, ShieldAlert } from 'lucide-react';
import type { SemesterExamSpec } from '../../../curriculum/types';
import { formatRemainingCooldown } from '../../../curriculum/progression';
import { playClick } from '../../../lib/audio';

interface ExamGateProps {
  exam: SemesterExamSpec;
  unlocked: boolean;
  passed: boolean;
  prevScorePercent?: number;
  remedial: {
    isLocked: boolean;
    remainingMs: number;
    completedPathsCount: number;
    requiredPathsCount: number;
  };
  onStart: () => void;
}

/**
 * Distinct Nusantara Gate Architecture:
 * - UTS: Stylized Candi Bentar split gate (evaluates middle milestone)
 * - UAS: Original CIKO Shield & Sprouting Golden Leaf Seal Emblem (NO Garuda coat of arms)
 */
const CandiBentarSvg: React.FC<{ passed: boolean; unlocked: boolean; lockedByRemedial: boolean }> = ({
  passed,
  unlocked,
  lockedByRemedial,
}) => {
  const stone = passed
    ? '#059669'
    : lockedByRemedial
    ? '#DC2626'
    : unlocked
    ? '#D4AF37'
    : '#CBD5E1';
  const side = passed
    ? '#065F46'
    : lockedByRemedial
    ? '#991B1B'
    : unlocked
    ? '#A16207'
    : '#94A3B8';
  const accent = passed ? '#6EE7B7' : unlocked ? '#FEF08A' : '#F8FAFC';

  return (
    <svg width="86" height="68" viewBox="0 0 92 72" fill="none" aria-hidden="true">
      <ellipse cx="46" cy="65" rx="34" ry="5" fill="#0D1117" opacity="0.1" />
      {/* Left Bentar Gate Tower */}
      <path d="M10 62 L18 14 L34 22 L36 62 Z" transform="translate(0,3)" fill={side} />
      <path d="M10 62 L18 14 L34 22 L36 62 Z" fill={stone} />
      <rect x="16" y="28" width="12" height="4" rx="1.5" fill={accent} opacity="0.7" />
      <rect x="14" y="42" width="16" height="4" rx="1.5" fill={accent} opacity="0.7" />
      {/* Right Bentar Gate Tower */}
      <path d="M82 62 L74 14 L58 22 L56 62 Z" transform="translate(0,3)" fill={side} />
      <path d="M82 62 L74 14 L58 22 L56 62 Z" fill={stone} />
      <rect x="64" y="28" width="12" height="4" rx="1.5" fill={accent} opacity="0.7" />
      <rect x="62" y="42" width="16" height="4" rx="1.5" fill={accent} opacity="0.7" />
      {/* Center Milestone Medallion */}
      <circle cx="46" cy="40" r="13" transform="translate(0,3)" fill={side} />
      <circle cx="46" cy="40" r="13" fill={stone} />
      <circle cx="46" cy="40" r="8" fill="none" stroke={accent} strokeWidth="2" />
    </svg>
  );
};

const CikoSealEmblemSvg: React.FC<{ passed: boolean; unlocked: boolean; lockedByRemedial: boolean }> = ({
  passed,
  unlocked,
  lockedByRemedial,
}) => {
  const shield = passed
    ? '#059669'
    : lockedByRemedial
    ? '#DC2626'
    : unlocked
    ? '#0D1117'
    : '#CBD5E1';
  const rim = passed || unlocked ? '#D4AF37' : '#94A3B8';
  const leaf = passed ? '#FEF08A' : unlocked ? '#10B981' : '#F8FAFC';

  return (
    <svg width="86" height="72" viewBox="0 0 92 76" fill="none" aria-hidden="true">
      <ellipse cx="46" cy="69" rx="30" ry="5" fill="#0D1117" opacity="0.1" />
      {/* Ribbon tails */}
      <polygon points="28,48 20,70 32,64 36,71 42,50" fill={rim} />
      <polygon points="64,48 72,70 60,64 56,71 50,50" fill={rim} />
      {/* Shield crest */}
      <path
        d="M24 14 H68 V38 C68 54, 46 65, 46 65 C46 65, 24 54, 24 38 Z"
        transform="translate(0,3)"
        fill="#020617"
        opacity="0.25"
      />
      <path d="M24 14 H68 V38 C68 54, 46 65, 46 65 C46 65, 24 54, 24 38 Z" fill={shield} />
      <path
        d="M29 19 H63 V37 C63 49, 46 58, 46 58 C46 58, 29 49, 29 37 Z"
        fill="none"
        stroke={rim}
        strokeWidth="2.8"
      />
      {/* Sprouting Nusantara leaf inside seal */}
      <path d="M46 25 C38 30, 38 41, 46 47 C54 41, 54 30, 46 25 Z" fill={leaf} />
      <rect x="45" y="34" width="2" height="15" rx="1" fill={shield} />
    </svg>
  );
};

export const ExamGate: React.FC<ExamGateProps> = ({
  exam,
  unlocked,
  passed,
  prevScorePercent,
  remedial,
  onStart,
}) => {
  const isUas = exam.type === 'UAS';
  const surfaceClass = passed
    ? 'bg-[#EEFBF4] text-[#064E3B]'
    : !unlocked
    ? 'bg-[#ECEEF2] text-slate-500'
    : remedial.isLocked
    ? 'bg-[#FFF5F5] text-[#7F1D1D]'
    : 'bg-[#0D1117] text-white';

  return (
    <div className={`rounded-3xl p-5 transition-colors ${surfaceClass}`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="shrink-0 flex justify-center">
          {isUas ? (
            <CikoSealEmblemSvg
              passed={passed}
              unlocked={unlocked}
              lockedByRemedial={remedial.isLocked}
            />
          ) : (
            <CandiBentarSvg
              passed={passed}
              unlocked={unlocked}
              lockedByRemedial={remedial.isLocked}
            />
          )}
        </div>

        <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-extrabold">
            <span
              className={
                passed
                  ? 'text-[#059669]'
                  : remedial.isLocked
                  ? 'text-[#DC2626]'
                  : unlocked
                  ? 'text-[#D4AF37]'
                  : 'text-slate-400'
              }
            >
              {isUas ? 'Piagam Kelulusan Area · UAS' : 'Gerbang Candi Bentar · UTS'}
            </span>
            {prevScorePercent !== undefined && (
              <span className="tabular-nums opacity-85">• Nilai {prevScorePercent}%</span>
            )}
          </div>

          <h3 className="text-base font-extrabold font-[Poppins] leading-snug">
            {exam.titleId}
          </h3>

          <p className="text-xs opacity-80">
            {exam.coversUnitRange} • Syarat lulus ≥ {exam.passTotalPercent}%
          </p>

          {remedial.isLocked && (
            <div className="pt-1 flex items-center justify-center sm:justify-start gap-1.5 text-xs font-extrabold text-[#B91C1C]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>
                Tunggu {formatRemainingCooldown(remedial.remainingMs)} atau tuntaskan{' '}
                {remedial.requiredPathsCount - remedial.completedPathsCount} Keping Materi lagi
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={!unlocked}
          onClick={() => {
            playClick();
            onStart();
          }}
          className={`px-5 py-3 rounded-2xl border-b-4 text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 shrink-0 transition-transform active:translate-y-0.5 cursor-pointer disabled:cursor-not-allowed ${
            !unlocked
              ? 'bg-slate-300 border-slate-400 text-slate-500'
              : remedial.isLocked
              ? 'bg-[#DC2626] border-[#991B1B] text-white'
              : passed
              ? 'bg-white border-emerald-200 text-[#059669]'
              : 'bg-[#059669] border-[#047857] hover:bg-emerald-500 text-white'
          }`}
        >
          {!unlocked ? (
            <>
              <Lock className="w-4 h-4" />
              Terkunci
            </>
          ) : remedial.isLocked ? (
            'Lihat Remedial'
          ) : passed ? (
            <>
              <Check className="w-4 h-4" />
              Lulus (Uji Ulang)
            </>
          ) : isUas ? (
            <>
              <Award className="w-4 h-4" />
              Mulai UAS
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Mulai UTS
            </>
          )}
        </button>
      </div>
    </div>
  );
};
