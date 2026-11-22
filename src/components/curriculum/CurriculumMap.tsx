import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Lock,
  RotateCcw,
  Sparkles,
  Target,
} from 'lucide-react';
import {
  CURRICULUM_SEMESTERS,
  PATH_MAP,
  UNIT_MAP,
  getUtsGateAfterUnitId,
} from '../../curriculum';
import {
  getNextRecommendedPath,
  getRemedialStatus,
  isSemesterExamUnlocked,
} from '../../curriculum/progression';
import type {
  LessonConfig,
  SemesterSpec,
  UnitSpec,
  UserCurriculumProgress,
} from '../../curriculum/types';
import { playClick } from '../../lib/audio';
import { AreaHeroBanner } from './expedition/AreaHeroBanner';
import { ExamGate } from './expedition/ExamGate';
import { AREA_THEMES } from './expedition/expeditionConfig';
import { StagePostCard } from './expedition/StagePostCard';

interface CurriculumMapProps {
  progress: UserCurriculumProgress;
  onProgressUpdated?: (next: UserCurriculumProgress) => void;
  onStartLesson: (lesson: LessonConfig, reviewItemIds?: string[]) => void;
  onStartSemesterExam: (examId: string) => void;
  onStartSkipExam: (skipExamId: string) => void;
  onStartPlacementTest: () => void;
  onOpenGuidebook: (unitId: string) => void;
  onOpenArcade?: () => void;
  onBack?: () => void;
  initialUnitFocusId?: string | null;
  embedded?: boolean;
}

export const CurriculumMap: React.FC<CurriculumMapProps> = ({
  progress,
  onStartLesson,
  onStartSemesterExam,
  onStartSkipExam,
  onStartPlacementTest,
  onOpenGuidebook,
  onOpenArcade,
  onBack,
  initialUnitFocusId,
  embedded = false,
}) => {
  const defaultSemId = (() => {
    if (initialUnitFocusId && UNIT_MAP[initialUnitFocusId]) {
      return UNIT_MAP[initialUnitFocusId].semesterId;
    }
    const unlocked = progress.unlockedSemesterIds;
    return unlocked[unlocked.length - 1] || 'S1';
  })();

  const [activeSemId, setActiveSemId] = useState<string>(defaultSemId);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);

  useEffect(() => {
    if (initialUnitFocusId && UNIT_MAP[initialUnitFocusId]) {
      setActiveSemId(UNIT_MAP[initialUnitFocusId].semesterId);
    }
  }, [initialUnitFocusId]);

  const activeSemester: SemesterSpec =
    CURRICULUM_SEMESTERS.find((s) => s.id === activeSemId) || CURRICULUM_SEMESTERS[0];

  const activeArea = AREA_THEMES[activeSemester.id] || AREA_THEMES.S1;
  const nextRecommended = getNextRecommendedPath(progress);
  const totalPathsCompleted = progress.completedPathIds.length;

  const totalPathsInArea = activeSemester.units.reduce(
    (acc, u) => acc + u.stages.reduce((sAcc, s) => sAcc + s.paths.length, 0),
    0
  );
  const completedPathsInArea = activeSemester.units.reduce(
    (acc, u) =>
      acc +
      u.stages.reduce(
        (sAcc, s) =>
          sAcc +
          s.paths.filter((p) => progress.completedPathIds.includes(p.pathId)).length,
        0
      ),
    0
  );

  const utsAfterUnitId = getUtsGateAfterUnitId(activeSemester);
  const utsSplitIdx = activeSemester.units.findIndex((u) => u.id === utsAfterUnitId);
  const preUtsUnits =
    utsSplitIdx >= 0 ? activeSemester.units.slice(0, utsSplitIdx + 1) : activeSemester.units;
  const postUtsUnits =
    utsSplitIdx >= 0 ? activeSemester.units.slice(utsSplitIdx + 1) : [];

  const mistakePathGroups = (() => {
    const map: Record<string, string[]> = {};
    for (const m of progress.mistakeBank) {
      if (!map[m.pathId]) map[m.pathId] = [];
      if (!map[m.pathId].includes(m.itemId)) map[m.pathId].push(m.itemId);
    }
    return Object.entries(map);
  })();

  const renderUnitExpeditionBlock = (unit: UnitSpec) => {
    const unitUnlocked =
      progress.unlockedUnitIds.includes(unit.id) &&
      unit.stages.some((st) => progress.unlockedStageIds.includes(st.id));
    const unitDone = progress.completedUnitIds.includes(unit.id);

    return (
      <section key={unit.id} className="space-y-3">
        {/* Clean Unit Bar + Buku Saku Strictly Locked if Unit/Stages Locked */}
        <div
          className={`rounded-2xl px-4 py-3 flex items-center justify-between gap-3 ${
            unitDone
              ? 'bg-[#EEFBF4] text-[#064E3B]'
              : unitUnlocked
              ? 'bg-[#F4F5F7] text-[#0D1117]'
              : 'bg-[#ECEEF2] text-slate-500'
          }`}
        >
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="block text-[11px] font-extrabold uppercase tracking-wider opacity-75">
              Unit {unit.unitNumber}
            </p>
            <h3 className="block text-sm sm:text-base font-extrabold font-[Poppins] leading-snug line-clamp-1">
              {unit.titleId}
            </h3>
          </div>

          <button
            type="button"
            disabled={!unitUnlocked}
            onClick={() => {
              if (!unitUnlocked) return;
              playClick();
              onOpenGuidebook(unit.id);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 shrink-0 transition-colors ${
              unitUnlocked
                ? 'bg-white hover:bg-emerald-50 text-[#059669] cursor-pointer'
                : 'bg-slate-300/60 text-slate-400 cursor-not-allowed'
            }`}
            title={
              unitUnlocked
                ? 'Buka Buku Saku Unit'
                : 'Buku Saku terkunci sebelum Stage terbuka'
            }
          >
            {unitUnlocked ? (
              <BookOpen className="w-3.5 h-3.5" />
            ) : (
              <Lock className="w-3.5 h-3.5" />
            )}
            <span>Buku Saku</span>
          </button>
        </div>

        {/* Expedition Pos Clusters for Stages */}
        <div className="space-y-3">
          {unit.stages.map((stage, sIdx) => (
            <StagePostCard
              key={stage.id}
              unit={unit}
              stage={stage}
              stageIndexInUnit={sIdx}
              progress={progress}
              frontierPathId={nextRecommended?.pathId}
              selectedPathId={selectedPathId}
              onSelectPath={setSelectedPathId}
              onStartLesson={(lesson) => onStartLesson(lesson)}
              onStartSkipExam={onStartSkipExam}
            />
          ))}
        </div>
      </section>
    );
  };

  const mainContent = (
    <div className={embedded ? 'w-full space-y-5 pb-20' : 'max-w-2xl mx-auto px-4 space-y-5 pb-24'}>
      {/* Area Expedition Tabs (Area 01..06, fits without clipping on desktop & 3x2 grid on mobile) */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 py-0.5">
        {CURRICULUM_SEMESTERS.map((sem) => {
          const area = AREA_THEMES[sem.id];
          const unlocked = progress.unlockedSemesterIds.includes(sem.id);
          const active = sem.id === activeSemester.id;
          const passedUas = progress.passedExamIds.includes(sem.uas.examId);
          return (
            <button
              key={sem.id}
              type="button"
              onClick={() => {
                playClick();
                setSelectedPathId(null);
                setActiveSemId(sem.id);
              }}
              className={`px-2 py-2 rounded-2xl text-[11px] font-extrabold inline-flex items-center justify-center gap-1 transition-all cursor-pointer ${
                active
                  ? 'bg-[#0D1117] text-white'
                  : unlocked
                  ? 'bg-white hover:bg-[#F4F5F7] text-[#0D1117]'
                  : 'bg-[#ECEEF2] text-slate-400 hover:bg-slate-200/70'
              }`}
            >
              <span>Area {area?.areaNumber || sem.semesterNumber}</span>
              {passedUas ? (
                <CheckCircle2 className="w-3 h-3 text-[#059669] shrink-0" />
              ) : !unlocked ? (
                <Lock className="w-3 h-3 shrink-0" />
              ) : null}
            </button>
          );
        })}
      </div>

      {progress.certificateEarned && (
        <div className="flex justify-center">
          <span className="px-3.5 py-1.5 rounded-full bg-[#FEF7E0] text-[#8C6D00] text-xs font-extrabold inline-flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            Lulusan Master Ekspedisi Cuan Nusantara
          </span>
        </div>
      )}

      {/* Level 1: Ekspedisi Cuan Nusantara Area Hero Banner */}
      <AreaHeroBanner
        area={activeArea}
        completedPathsInArea={completedPathsInArea}
        totalPathsInArea={totalPathsInArea}
      />

      {/* Mobile Compact Quick Pills (< xl) */}
      {!progress.placementTest.consumedBySubmit && (
        <div className="flex xl:hidden flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              playClick();
              onStartPlacementTest();
            }}
            className="px-3.5 py-2 rounded-2xl bg-[#FEF7E0] hover:bg-amber-100 text-[#8C6D00] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Target className="w-3.5 h-3.5" />
            Tes Penempatan Bersama
          </button>
        </div>
      )}

      {/* Bank Kesalahan Alert Bar */}
      {mistakePathGroups.length > 0 && (
        <div className="bg-[#FFF5F5] rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#B91C1C]">
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span>{progress.mistakeBank.length} Butir perlu diperkuat</span>
          </div>
          {mistakePathGroups[0] && PATH_MAP[mistakePathGroups[0][0]] && (
            <button
              type="button"
              onClick={() => {
                const [pId, itemIds] = mistakePathGroups[0];
                playClick();
                onStartLesson(PATH_MAP[pId], itemIds);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#B91C1C] text-white text-xs font-bold shrink-0 cursor-pointer"
            >
              Latih Ulang
            </button>
          )}
        </div>
      )}

      {/* Expedition Route: Pre-UTS Units -> Candi Bentar UTS -> Post-UTS Units -> CIKO Seal UAS */}
      <div className="space-y-6">
        {preUtsUnits.map(renderUnitExpeditionBlock)}

        <ExamGate
          exam={activeSemester.uts}
          unlocked={isSemesterExamUnlocked(progress, activeSemester.uts.examId)}
          passed={progress.passedExamIds.includes(activeSemester.uts.examId)}
          prevScorePercent={progress.examScores[activeSemester.uts.examId]?.combinedPercent}
          remedial={getRemedialStatus(progress, activeSemester.uts.examId)}
          onStart={() => onStartSemesterExam(activeSemester.uts.examId)}
        />

        {postUtsUnits.map(renderUnitExpeditionBlock)}

        <ExamGate
          exam={activeSemester.uas}
          unlocked={isSemesterExamUnlocked(progress, activeSemester.uas.examId)}
          passed={progress.passedExamIds.includes(activeSemester.uas.examId)}
          prevScorePercent={progress.examScores[activeSemester.uas.examId]?.combinedPercent}
          remedial={getRemedialStatus(progress, activeSemester.uas.examId)}
          onStart={() => onStartSemesterExam(activeSemester.uas.examId)}
        />
      </div>
    </div>
  );

  if (embedded) {
    return mainContent;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0D1117]">
      <header className="sticky top-0 z-30 bg-[#FAFAFA] px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          {onBack && (
            <button
              type="button"
              onClick={() => {
                playClick();
                onBack();
              }}
              className="w-10 h-10 rounded-full bg-[#F4F5F7] hover:bg-slate-200 flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-lg font-extrabold text-[#0D1117] font-[Poppins] truncate flex-1">
            Ekspedisi Cuan Nusantara
          </h1>
          <span className="px-3 py-1 rounded-full bg-[#EEFBF4] text-[#059669] text-xs font-extrabold tabular-nums">
            {totalPathsCompleted}/175
          </span>
        </div>
      </header>
      <main>{mainContent}</main>
    </div>
  );
};

export default CurriculumMap;
