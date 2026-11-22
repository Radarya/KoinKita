import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, Coins, Dumbbell, Heart, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import {
  PATH_PARENT_STAGE_MAP,
  UNIT_MAP,
} from '../../curriculum';
import {
  applyPathCompletion,
  getNextRecommendedPath,
  recordMistake,
  resolveMistake,
} from '../../curriculum/progression';
import type { LessonConfig, UserCurriculumProgress } from '../../curriculum/types';
import { MAX_LIVES, recordGameSession, rewardUser } from '../../lib/rewardUtils';
import { playClick, playWin } from '../../lib/audio';
import { vibrateSuccess } from '../../lib/haptics';
import CikoMascot from '../CikoMascot';
import { CuanQuizEngine, type EngineCompleteResult } from './engines/CuanQuizEngine';
import { FinWordleCurriculumEngine } from './engines/FinWordleCurriculumEngine';
import { PairMatchEngine } from './engines/PairMatchEngine';
import { KokiAnggaranCurriculumEngine } from './engines/KokiAnggaranCurriculumEngine';
import { DetektifCuanCurriculumEngine } from './engines/DetektifCuanCurriculumEngine';
import { PohonAsetCurriculumEngine } from './engines/PohonAsetCurriculumEngine';
import { StorySimEngine } from './engines/StorySimEngine';

interface LessonRunnerProps {
  lesson: LessonConfig;
  reviewMistakeItemIds?: string[];
  userUid: string | null;
  leagueGroupId?: string;
  progress: UserCurriculumProgress;
  lives?: number;
  onConsumeLife?: () => void;
  onPracticeReviewCompleted?: (result: EngineCompleteResult) => Promise<{ recovered: boolean; reason?: string } | undefined>;
  onOpenPractice?: () => void;
  onProgressUpdated: (next: UserCurriculumProgress) => void;
  onOpenGuidebook: (unitId: string) => void;
  onStartNextPath?: (nextLesson: LessonConfig) => void;
  onBack: () => void;
}

const MECHANIC_POSE: Record<LessonConfig['mechanic'], 'scholar' | 'detective' | 'chef' | 'wealth' | 'hero'> = {
  CuanQuiz: 'scholar',
  FinWordle: 'scholar',
  PairMatch: 'scholar',
  KokiAnggaran: 'chef',
  DetektifCuan: 'detective',
  PohonAset: 'wealth',
  StorySim: 'hero',
};

export const LessonRunner: React.FC<LessonRunnerProps> = ({
  lesson,
  reviewMistakeItemIds,
  userUid,
  leagueGroupId,
  progress,
  lives = MAX_LIVES,
  onConsumeLife,
  onPracticeReviewCompleted,
  onOpenPractice,
  onProgressUpdated,
  onOpenGuidebook,
  onStartNextPath,
  onBack,
}) => {
  const [workingProgress, setWorkingProgress] = useState<UserCurriculumProgress>(progress);
  const [result, setResult] = useState<EngineCompleteResult | null>(null);
  const [earnedReward, setEarnedReward] = useState<{ xp: number; coins: number; isFirstClear: boolean } | null>(null);
  const [heartRecoveredBanner, setHeartRecoveredBanner] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const [localLives, setLocalLives] = useState(lives);
  const [outOfLives, setOutOfLives] = useState(false);

  useEffect(() => {
    setLocalLives(lives);
  }, [lives]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lesson.pathId, sessionKey, result, outOfLives]);

  const unit = UNIT_MAP[lesson.unitId];
  const stage = PATH_PARENT_STAGE_MAP[lesson.pathId];
  const isReviewMode = Boolean(reviewMistakeItemIds && reviewMistakeItemIds.length > 0);

  const handleMistake = (itemId: string) => {
    const nextProgress = recordMistake(workingProgress, {
      mechanic: lesson.mechanic,
      itemId,
      pathId: lesson.pathId,
      unitId: lesson.unitId,
    });
    setWorkingProgress(nextProgress);
    onProgressUpdated(nextProgress);

    if (!isReviewMode) {
      const nextLives = Math.max(0, localLives - 1);
      setLocalLives(nextLives);
      onConsumeLife?.();
      if (nextLives <= 0) {
        setOutOfLives(true);
      }
    }
  };

  const handleComplete = async (res: EngineCompleteResult) => {
    playWin();
    vibrateSuccess();

    const wasAlreadyDone = workingProgress.completedPathIds.includes(lesson.pathId);
    let updated = applyPathCompletion(workingProgress, lesson.pathId);

    // If review mode cleared mistakes, remove fixed item IDs from mistakeBank
    if (reviewMistakeItemIds && reviewMistakeItemIds.length > 0) {
      for (const mId of reviewMistakeItemIds) {
        if (!res.wrongItemIds.includes(mId)) {
          updated = resolveMistake(updated, mId, lesson.pathId);
        }
      }
    }

    const isFirstClear = !wasAlreadyDone;
    const xpAward = isFirstClear ? lesson.xpReward : 5;
    const coinAward = isFirstClear ? lesson.coinReward : 5;

    setWorkingProgress(updated);
    setResult(res);
    setEarnedReward({ xp: xpAward, coins: coinAward, isFirstClear });
    onProgressUpdated(updated);

    if (isReviewMode && onPracticeReviewCompleted) {
      try {
        const rec = await onPracticeReviewCompleted(res);
        if (rec?.recovered) {
          setHeartRecoveredBanner(true);
        }
      } catch (err) {
        console.warn('[LessonRunner] Practice heart recovery error:', err);
      }
    }

    if (userUid) {
      try {
        await recordGameSession(userUid);
        await rewardUser(userUid, leagueGroupId || null, coinAward, xpAward);
      } catch (err) {
        console.warn('[LessonRunner] Reward sync error:', err);
      }
    }
  };

  const handleRetry = () => {
    playClick();
    if (!isReviewMode && localLives <= 0) {
      setOutOfLives(true);
      return;
    }
    setResult(null);
    setEarnedReward(null);
    setHeartRecoveredBanner(false);
    setSessionKey((k) => k + 1);
  };

  const nextRecommended = result ? getNextRecommendedPath(workingProgress) : undefined;
  const pose = MECHANIC_POSE[lesson.mechanic] || 'scholar';
  const act = lesson.activity;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0D1117] pb-16">
      {/* Top sticky header */}
      <header className="sticky top-0 z-20 bg-[#FAFAFA]/95 backdrop-blur-md px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              playClick();
              onBack();
            }}
            className="w-10 h-10 rounded-full bg-[#F4F5F7] hover:bg-slate-200 flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Kembali ke Peta Kurikulum"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0 text-center">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#059669] truncate">
              Unit {unit?.unitNumber} · Pos {stage?.stageNumber}
              {isReviewMode ? ' · Tebus Kesalahan' : ''}
            </p>
            <h1 className="text-sm sm:text-base font-extrabold text-[#0D1117] truncate">
              {lesson.titleId}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isReviewMode ? (
              <div className="px-3 py-2 rounded-full bg-[#EEFBF4] text-[#059669] text-xs font-extrabold inline-flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mode Latihan</span>
              </div>
            ) : (
              <div
                className={`px-3 py-2 rounded-full text-xs font-extrabold inline-flex items-center gap-1.5 tabular-nums ${
                  localLives <= 1
                    ? 'bg-[#FFF1F2] text-rose-600'
                    : 'bg-[#F4F5F7] text-[#0D1117]'
                }`}
                aria-label="Sisa nyawa"
              >
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>
                  {localLives}/{MAX_LIVES}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                playClick();
                onOpenGuidebook(lesson.unitId);
              }}
              className="px-3.5 py-2 rounded-full bg-[#F4F5F7] hover:bg-slate-200 text-xs font-bold text-[#0D1117] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#059669]" />
              <span className="hidden sm:inline">Buku Saku</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-2">
        {outOfLives && !result ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 text-center space-y-6 mt-4">
            <div className="flex justify-center">
              <CikoMascot size={112} pose="scholar" animated />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1F2] text-rose-600 text-xs font-extrabold">
                <Heart className="w-3.5 h-3.5 fill-rose-600" />
                <span>Nyawa Habis</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#0D1117] font-[Poppins]">
                Isi Ulang Nyawa Dulu, Yuk
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Setiap kesalahan di jalur Ekspedisi mengurangi 1 nyawa. Soal yang salah sudah disimpan ke Bank Kesalahan supaya kamu bisa melatih ulang dan menebus nyawa di menu Latihan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto">
              {onOpenPractice && (
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onOpenPractice();
                  }}
                  className="flex-1 py-3.5 px-5 rounded-full bg-[#059669] hover:bg-emerald-700 text-white text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Dumbbell className="w-4 h-4 shrink-0" />
                  <span>Tebus Nyawa di Latihan</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  playClick();
                  onBack();
                }}
                className="flex-1 py-3.5 px-5 rounded-full bg-[#F4F5F7] hover:bg-slate-200 text-[#0D1117] text-sm font-bold cursor-pointer"
              >
                Kembali ke Peta
              </button>
            </div>
          </div>
        ) : !result ? (
          <div className="space-y-4">
            <div key={`${lesson.pathId}-${sessionKey}`}>
              {act.mechanic === 'CuanQuiz' && (
                <CuanQuizEngine
                  questions={act.questions}
                  filterItemIds={reviewMistakeItemIds}
                  onMistake={handleMistake}
                  onComplete={handleComplete}
                />
              )}
              {act.mechanic === 'FinWordle' && (
                <FinWordleCurriculumEngine
                  words={act.words}
                  onMistake={handleMistake}
                  onComplete={handleComplete}
                />
              )}
              {act.mechanic === 'PairMatch' && (
                <PairMatchEngine
                  data={act.data}
                  onMistake={handleMistake}
                  onComplete={handleComplete}
                />
              )}
              {act.mechanic === 'KokiAnggaran' && (
                <KokiAnggaranCurriculumEngine
                  data={act.data}
                  filterItemIds={reviewMistakeItemIds}
                  onMistake={handleMistake}
                  onComplete={handleComplete}
                />
              )}
              {act.mechanic === 'DetektifCuan' && (
                <DetektifCuanCurriculumEngine
                  cases={act.cases}
                  filterItemIds={reviewMistakeItemIds}
                  onMistake={handleMistake}
                  onComplete={handleComplete}
                />
              )}
              {act.mechanic === 'PohonAset' && (
                <PohonAsetCurriculumEngine
                  data={act.data}
                  onMistake={handleMistake}
                  onComplete={handleComplete}
                />
              )}
              {act.mechanic === 'StorySim' && (
                <StorySimEngine
                  data={act.data}
                  onMistake={handleMistake}
                  onComplete={handleComplete}
                />
              )}
            </div>
          </div>
        ) : (
          /* Summary screen */
          <div className="bg-white rounded-3xl p-6 sm:p-8 text-center space-y-6 mt-4">
            <div className="flex justify-center">
              <CikoMascot size={116} pose={pose} animated />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] text-xs font-extrabold uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isReviewMode
                  ? 'Tebus Kesalahan Tuntas!'
                  : earnedReward?.isFirstClear
                    ? 'Keping Materi Tuntas!'
                    : 'Latihan Ulang Selesai!'}
              </span>
              {heartRecoveredBanner && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFF1F2] text-rose-600 text-xs font-extrabold">
                  <Heart className="w-3.5 h-3.5 fill-rose-600" />
                  <span>+1 Nyawa berhasil ditebus</span>
                </div>
              )}
              <h2 className="text-2xl font-extrabold text-[#0D1117] font-[Poppins]">
                {lesson.titleId}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Akurasi Pemahaman: <strong className="tabular-nums text-[#0D1117]">{result.score}%</strong> (
                {result.correctCount} dari {result.totalCount} tepat)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto tabular-nums">
              <div className="bg-[#EEFBF4] rounded-2xl p-4">
                <p className="text-[11px] font-bold uppercase text-[#059669]">XP Diperoleh</p>
                <p className="text-2xl font-extrabold text-[#064E3B] mt-1 inline-flex items-center gap-1">
                  <Sparkles className="w-5 h-5 text-[#059669]" />+{earnedReward?.xp ?? 0}
                </p>
              </div>
              <div className="bg-[#FEF7E0] rounded-2xl p-4">
                <p className="text-[11px] font-bold uppercase text-[#8C6D00]">Koin Saku</p>
                <p className="text-2xl font-extrabold text-[#8C6D00] mt-1 inline-flex items-center gap-1">
                  <Coins className="w-5 h-5 text-[#D4AF37]" />+{earnedReward?.coins ?? 0}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleRetry}
                className="flex-1 py-3.5 px-5 rounded-full bg-[#F4F5F7] hover:bg-slate-200 text-sm font-bold text-[#0D1117] inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Ulangi Keping Materi Ini
              </button>
              {nextRecommended && onStartNextPath && nextRecommended.pathId !== lesson.pathId ? (
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    if (!isReviewMode && localLives <= 0) {
                      if (onOpenPractice) onOpenPractice();
                      else onBack();
                      return;
                    }
                    onStartNextPath(nextRecommended);
                  }}
                  className="flex-1 py-3.5 px-5 rounded-full bg-[#059669] hover:bg-emerald-700 text-white text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer min-w-0"
                >
                  <span className="truncate">
                    {!isReviewMode && localLives <= 0
                      ? 'Tebus Nyawa di Latihan'
                      : `Lanjut: ${nextRecommended.titleId}`}
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onBack();
                  }}
                  className="flex-1 py-3.5 px-5 rounded-full bg-[#0D1117] hover:bg-slate-800 text-white text-sm font-bold cursor-pointer"
                >
                  Kembali ke Peta Akademi
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonRunner;
