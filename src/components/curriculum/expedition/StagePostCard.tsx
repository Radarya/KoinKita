import React from 'react';
import { CheckCircle2, FastForward, Lock, Play, X } from 'lucide-react';
import type { LessonConfig, StageSpec, UnitSpec, UserCurriculumProgress } from '../../../curriculum/types';
import {
  canTakeStageSkipExam,
  getRemedialStatus,
  isPathAccessible,
  isStageCleared,
} from '../../../curriculum/progression';
import { playClick } from '../../../lib/audio';
import { BossNode } from './BossNode';
import { getBossMotifForUnit, getStageLandmarkKind } from './expeditionConfig';
import { MascotCompanion, type CompanionPropContext } from './MascotCompanion';
import { LandmarkSvg } from './NusantaraPatterns';
import { PathNode, type NodeVisualState } from './PathNode';

interface StagePostCardProps {
  unit: UnitSpec;
  stage: StageSpec;
  stageIndexInUnit: number;
  progress: UserCurriculumProgress;
  frontierPathId?: string;
  selectedPathId: string | null;
  onSelectPath: (pathId: string | null) => void;
  onStartLesson: (lesson: LessonConfig) => void;
  onStartSkipExam: (skipExamId: string) => void;
}

function getMechanicLabel(mechanic: LessonConfig['mechanic']): string {
  switch (mechanic) {
    case 'FinWordle':
      return 'Kosakata';
    case 'KokiAnggaran':
      return 'Anggaran';
    case 'DetektifCuan':
      return 'Detektif';
    case 'PairMatch':
      return 'Pasangkan';
    case 'PohonAset':
      return 'Simulasi Aset';
    case 'StorySim':
      return 'Simulasi Cerita';
    default:
      return 'Kuis';
  }
}

function getCompanionContextForLesson(lesson?: LessonConfig): CompanionPropContext {
  if (!lesson) return 'map';
  if (lesson.mechanic === 'DetektifCuan') return 'detective';
  if (lesson.mechanic === 'StorySim' || lesson.mechanic === 'PohonAset') return 'flag';
  return 'book';
}

/**
 * Expedition Post ("Pos Perjalanan") combining Opsi 1 (Koin & Gunungan tokens)
 * with Opsi 3 (Stage Clusters):
 * - Locked stages fold into a clean single-row preview.
 * - Active & Completed stages unfold a compact horizontal/switchback expedition trail
 *   paired with a thematic Level 2 Indonesian Landmark SVG and contextual CIKO mascot.
 */
export const StagePostCard: React.FC<StagePostCardProps> = ({
  unit,
  stage,
  stageIndexInUnit,
  progress,
  frontierPathId,
  selectedPathId,
  onSelectPath,
  onStartLesson,
  onStartSkipExam,
}) => {
  const stageUnlocked = progress.unlockedStageIds.includes(stage.id);
  const stageCleared = isStageCleared(progress, stage.id);
  const stageSkipped =
    progress.skippedStageIds.includes(stage.id) &&
    !progress.completedStageIds.includes(stage.id);
  const canSkip = canTakeStageSkipExam(progress, stage.id);
  const skipRemedial = getRemedialStatus(progress, stage.skipExamId);

  const stageHasFrontier = stage.paths.some((p) => p.pathId === frontierPathId);
  const frontierLesson = stage.paths.find((p) => p.pathId === frontierPathId);
  const landmarkKind = getStageLandmarkKind(unit.unitNumber, stageIndexInUnit);
  const bossMotif = getBossMotifForUnit(unit.unitNumber);

  // Compact Folded View when Stage is Locked (zero wasted height, clear visual lock)
  if (!stageUnlocked) {
    return (
      <div className="bg-[#ECEEF2] rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3 text-slate-500">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-slate-300/70 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <p className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Pos {stage.stageNumber}
            </p>
            <p className="block text-xs sm:text-sm font-extrabold text-slate-600 truncate">
              {stage.titleId}
            </p>
            <p className="block text-[11px] text-slate-400 font-semibold">
              {stage.paths.length} Keping Materi
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-300/60 text-slate-500 shrink-0">
          Terkunci
        </span>
      </div>
    );
  }

  // Group stage paths into boustrophedon switchback rows of 2 stops each (fits mobile cleanly)
  const rows: { path: LessonConfig; globalIdx: number }[][] = [];
  for (let i = 0; i < stage.paths.length; i += 2) {
    const slice = stage.paths.slice(i, i + 2).map((path, offset) => ({
      path,
      globalIdx: i + offset,
    }));
    rows.push(slice);
  }

  const rowHeight = 114;
  const svgH = Math.max(114, rows.length * rowHeight);
  const colLeftX = 82;
  const colRightX = 238;
  const colCenterX = 160;

  // Compute waypoint coordinates in a 320px coordinate track
  const waypoints = stage.paths.map((path, idx) => {
    const rIdx = Math.floor(idx / 2);
    const posInRow = idx % 2;
    const isSingleLast = idx === stage.paths.length - 1 && stage.paths.length % 2 === 1;
    const reverseRow = rIdx % 2 === 1;

    let x: number;
    if (isSingleLast) {
      x = colCenterX;
    } else if (!reverseRow) {
      x = posInRow === 0 ? colLeftX : colRightX;
    } else {
      x = posInRow === 0 ? colRightX : colLeftX;
    }
    const y = rIdx * rowHeight + 52;
    return { path, idx, x, y };
  });

  const completedInStage = stage.paths.filter((p) =>
    progress.completedPathIds.includes(p.pathId)
  ).length;

  return (
    <div
      className={`rounded-3xl p-4 sm:p-5 space-y-4 transition-colors ${
        stageHasFrontier
          ? 'bg-white ring-2 ring-[#059669]/20'
          : stageCleared
          ? 'bg-[#EEFBF4]'
          : 'bg-white'
      }`}
    >
      {/* Pos Header + Level 2 Landmark */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                stageCleared
                  ? 'bg-[#059669] text-white'
                  : 'bg-[#FEF7E0] text-[#8C6D00]'
              }`}
            >
              Pos {stage.stageNumber}
            </span>
            {stageCleared && (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#059669]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {stageSkipped ? 'Dilompati' : 'Tuntas'}
              </span>
            )}
            <span className="text-[11px] font-bold text-slate-400 tabular-nums">
              {completedInStage}/{stage.paths.length}
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-extrabold text-[#0D1117] font-[Poppins] leading-snug">
            {stage.titleId}
          </h4>

          {canSkip && (
            <button
              type="button"
              onClick={() => {
                playClick();
                onStartSkipExam(stage.skipExamId);
              }}
              className={`mt-1 px-3 py-1 rounded-full text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                skipRemedial.isLocked
                  ? 'bg-[#FCE8E6] text-[#B91C1C]'
                  : 'bg-[#EEFBF4] hover:bg-emerald-100 text-[#059669]'
              }`}
            >
              <FastForward className="w-3 h-3" />
              {skipRemedial.isLocked
                ? `Remedial · ${skipRemedial.completedPathsCount}/${skipRemedial.requiredPathsCount}`
                : 'Lompat Pos'}
            </button>
          )}
        </div>

        {/* Right: Level 2 Indonesian Landmark + Contextual CIKO ONLY when Pos is Active */}
        <div className="flex items-end gap-1 shrink-0">
          {stageHasFrontier && (
            <MascotCompanion
              context={getCompanionContextForLesson(frontierLesson)}
              size={58}
            />
          )}
          <div className="w-16 h-16 rounded-2xl bg-[#F4F5F7] flex items-center justify-center p-1">
            <LandmarkSvg kind={landmarkKind} size={56} />
          </div>
        </div>
      </div>

      {/* Expedition Mini-Route inside Pos */}
      <div
        className="relative mx-auto w-[320px] max-w-full select-none"
        style={{ height: `${svgH}px` }}
      >
        {/* Expedition Route SVG connecting Waypoints */}
        <svg
          width="320"
          height={svgH}
          viewBox={`0 0 320 ${svgH}`}
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          {waypoints.slice(0, -1).map((curr, i) => {
            const nxt = waypoints[i + 1];
            const currDone = progress.completedPathIds.includes(curr.path.pathId);
            const sameRow = Math.abs(curr.y - nxt.y) < 10;
            let d: string;
            if (sameRow) {
              const midX = (curr.x + nxt.x) / 2;
              d = `M ${curr.x} ${curr.y} Q ${midX} ${curr.y - 16} ${nxt.x} ${nxt.y}`;
            } else {
              // Gentle outward sweep turn between rows
              const ctrlX = curr.x >= colCenterX ? curr.x + 54 : curr.x - 54;
              const midY = (curr.y + nxt.y) / 2;
              d = `M ${curr.x} ${curr.y} Q ${ctrlX} ${midY} ${nxt.x} ${nxt.y}`;
            }

            return (
              <path
                key={`${curr.path.pathId}-seg`}
                d={d}
                fill="none"
                stroke={currDone ? '#10B981' : '#CBD5E1'}
                strokeWidth={currDone ? 5 : 3.5}
                strokeDasharray={currDone ? undefined : '7 7'}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Positioned Path & Boss Tokens */}
        {waypoints.map(({ path, idx, x, y }) => {
          const done = progress.completedPathIds.includes(path.pathId);
          const accessible = isPathAccessible(progress, path.pathId);
          const isFrontier = frontierPathId === path.pathId;
          const isSelected = selectedPathId === path.pathId;
          const isBoss =
            Boolean(path.isBoss) ||
            path.mechanic === 'StorySim' ||
            path.mechanic === 'PohonAset' ||
            path.xpReward >= 50;

          const visualState: NodeVisualState = done
            ? 'done'
            : isFrontier
            ? 'frontier'
            : accessible
            ? 'accessible'
            : 'locked';

          const handleNodeTap = () => {
            playClick();
            onSelectPath(isSelected ? null : path.pathId);
          };

          return (
            <div
              key={path.pathId}
              className={`absolute -translate-x-1/2 -translate-y-1/2 ${
                isSelected ? 'z-20' : 'z-10'
              }`}
              style={{ left: `${x}px`, top: `${y}px` }}
            >
              {isBoss ? (
                <BossNode
                  lesson={path}
                  motif={bossMotif}
                  state={visualState}
                  isSelected={isSelected}
                  onSelect={handleNodeTap}
                />
              ) : (
                <PathNode
                  lesson={path}
                  stepNumber={idx + 1}
                  state={visualState}
                  isSelected={isSelected}
                  onSelect={handleNodeTap}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Path Expedition Brief inside Pos (0px overflow on any viewport) */}
      {(() => {
        const selectedLesson = stage.paths.find((p) => p.pathId === selectedPathId);
        if (!selectedLesson) return null;
        const done = progress.completedPathIds.includes(selectedLesson.pathId);
        return (
          <div
            className="bg-[#0D1117] text-white rounded-2xl p-4 space-y-2.5"
            role="dialog"
            aria-label={selectedLesson.titleId}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-extrabold text-[#D4AF37]">
                  {getMechanicLabel(selectedLesson.mechanic)} •{' '}
                  {done ? 'Selesai' : `+${selectedLesson.xpReward} XP`}
                </p>
                <h5 className="text-sm font-extrabold font-[Poppins] leading-snug mt-0.5">
                  {selectedLesson.titleId}
                </h5>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  onSelectPath(null);
                }}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
              {selectedLesson.objectiveId}
            </p>

            <button
              type="button"
              onClick={() => {
                playClick();
                onSelectPath(null);
                onStartLesson(selectedLesson);
              }}
              className="w-full py-2.5 rounded-xl bg-[#059669] hover:bg-emerald-500 border-b-4 border-[#047857] text-white text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 cursor-pointer transition-transform active:translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-current" />
              {done ? 'Latih Ulang' : `Mulai +${selectedLesson.xpReward} XP`}
            </button>
          </div>
        );
      })()}
    </div>
  );
};
