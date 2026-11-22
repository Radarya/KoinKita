import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  CreditCard,
  PiggyBank,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import type {
  PerformanceAssessmentSpec,
  PerformanceRubricLevel,
  StorySimChoice,
  StorySimCurriculumData,
} from '../../../curriculum/types';
import { seededShuffleArray } from '../../../curriculum/shuffleUtils';
import type { EngineCompleteResult } from './CuanQuizEngine';
import { ExplanationCard } from '../ExplanationCard';
import { playClick, playCorrect, playWrong } from '../../../lib/audio';
import { vibrateError, vibrateSuccess } from '../../../lib/haptics';

export interface StorySimPerformanceResult {
  overallScore: number;
  level: PerformanceRubricLevel;
  cashflowInsolvency: boolean;
  dimScores: {
    cashflowStability: number;
    riskLiquidity: number;
    debtScamImmunity: number;
    goalPreservation: number;
  };
  weakestDimKey:
    | 'cashflowStability'
    | 'riskLiquidity'
    | 'debtScamImmunity'
    | 'goalPreservation';
}

export interface StorySimCompleteResult extends EngineCompleteResult {
  performanceResult?: StorySimPerformanceResult;
}

interface StorySimEngineProps {
  data: StorySimCurriculumData;
  performanceSpec?: PerformanceAssessmentSpec;
  onMistake?: (itemId: string) => void;
  onComplete: (result: StorySimCompleteResult) => void;
}

function clampScore(val: number): number {
  return Math.max(0, Math.min(100, Math.round(val)));
}

function getRubricLabel(level: PerformanceRubricLevel): {
  title: string;
  cls: string;
  desc: string;
} {
  switch (level) {
    case 'optimal':
      return {
        title: 'Level Optimal · Lulus Unggul',
        cls: 'bg-[#059669] text-white',
        desc: 'Seluruh dimensi stabilitas kas, likuiditas, imunitas utang/penipuan, dan target tercapai tangguh tanpa kebangkrutan kas.',
      };
    case 'baik':
      return {
        title: 'Level Baik · Lulus Kompeten',
        cls: 'bg-[#0D652D] text-white',
        desc: 'Keputusan strategis sehat dan arus kas tetap solven melewati kejutan periode simulasi.',
      };
    case 'dasar':
      return {
        title: 'Level Dasar · Belum Memenuhi Ambang 75',
        cls: 'bg-[#D97706] text-white',
        desc: 'Masih perlu memperbaiki ketahanan cadangan atau strategi alokasi agar mampu menahan guncangan mendadak.',
      };
    default:
      return {
        title: 'Gagal Kritis · Defisit Kas atau Jebakan Risiko',
        cls: 'bg-[#DC2626] text-white',
        desc: 'Terjadi kegagalan bayar kas negatif atau masuk jebakan utang ilegal / penipuan fatal.',
      };
  }
}

export const StorySimEngine: React.FC<StorySimEngineProps> = ({
  data,
  performanceSpec,
  onMistake,
  onComplete,
}) => {
  const [chIdx, setChIdx] = useState(0);
  const [cash, setCash] = useState(data.initialState.cash);
  const [emergencyFund, setEmergencyFund] = useState(data.initialState.emergencyFund);
  const [sinkingFund, setSinkingFund] = useState(data.initialState.sinkingFund);
  const [debt, setDebt] = useState(data.initialState.debt);
  const [netWorth, setNetWorth] = useState(data.initialState.netWorth);

  // 4-dimension rubric baseline = 75 when healthy baseline maintained
  const [scoreCashflow, setScoreCashflow] = useState(72);
  const [scoreRisk, setScoreRisk] = useState(72);
  const [scoreSecurity, setScoreSecurity] = useState(75);
  const [scoreGoal, setScoreGoal] = useState(72);

  const [sessionSeed] = useState(() => Math.floor(Math.random() * 1_000_000) + 1);
  const [insolvencyTriggered, setInsolvencyTriggered] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<StorySimChoice | null>(null);
  const [recommendedHits, setRecommendedHits] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const chapter = data.chapters[chIdx];
  const shuffledChoices = useMemo(() => {
    if (!chapter) return [];
    return seededShuffleArray(chapter.choices, `${sessionSeed}:${chapter.id}:${chIdx}`);
  }, [chapter, chIdx, sessionSeed]);

  if (!chapter && !finished) return null;

  const handleChoose = (choice: StorySimChoice) => {
    if (selectedChoice || !chapter) return;
    setSelectedChoice(choice);

    const d = choice.deltas;
    const nextCash = cash + (d.cash || 0);
    setCash(nextCash);
    setEmergencyFund((v) => Math.max(0, v + (d.emergencyFund || 0)));
    setSinkingFund((v) => Math.max(0, v + (d.sinkingFund || 0)));
    setDebt((v) => Math.max(0, v + (d.debt || 0)));
    setNetWorth((v) => v + (d.netWorth || 0));

    setScoreCashflow((s) => clampScore(s + (d.scoreCashflow || 0)));
    setScoreRisk((s) => clampScore(s + (d.scoreRisk || 0)));
    setScoreSecurity((s) => clampScore(s + (d.scoreSecurity || 0)));
    setScoreGoal((s) => clampScore(s + (d.scoreGoal || 0)));

    if (nextCash < 0 || choice.illegalDebtFlag) {
      setInsolvencyTriggered(true);
    }

    if (choice.isRecommended) {
      playCorrect();
      vibrateSuccess();
      setRecommendedHits((h) => h + 1);
    } else {
      playWrong();
      vibrateError();
      setWrongIds((prev) => [...prev, `${chapter.id}:${choice.id}`]);
      onMistake?.(choice.id);
    }
  };

  const handleNext = () => {
    playClick();
    if (chIdx + 1 < data.chapters.length) {
      setChIdx((i) => i + 1);
      setSelectedChoice(null);
    } else {
      setFinished(true);
    }
  };

  const evaluatePerformance = (): StorySimPerformanceResult => {
    const dimScores = {
      cashflowStability: scoreCashflow,
      riskLiquidity: scoreRisk,
      debtScamImmunity: scoreSecurity,
      goalPreservation: scoreGoal,
    };

    const weighted = Math.round(
      scoreCashflow * 0.3 +
        scoreRisk * 0.3 +
        scoreSecurity * 0.2 +
        scoreGoal * 0.2
    );

    const cashflowInsolvency = insolvencyTriggered || cash < 0;
    const netWorthRequirementFailed =
      Boolean(performanceSpec?.requirePositiveNetWorthAtEnd) && netWorth < 0;

    let level: PerformanceRubricLevel;
    let finalScore = weighted;

    if (cashflowInsolvency || netWorthRequirementFailed || weighted < 55) {
      level = 'gagal_kritis';
      if (cashflowInsolvency) finalScore = Math.min(finalScore, 49);
    } else if (weighted < (performanceSpec?.passMinScore ?? 75)) {
      level = 'dasar';
    } else if (
      weighted >= 88 &&
      scoreCashflow >= 70 &&
      scoreRisk >= 70 &&
      scoreSecurity >= 70 &&
      scoreGoal >= 70
    ) {
      level = 'optimal';
    } else {
      level = 'baik';
    }

    const entries = Object.entries(dimScores) as [
      StorySimPerformanceResult['weakestDimKey'],
      number
    ][];
    entries.sort((a, b) => a[1] - b[1]);

    return {
      overallScore: finalScore,
      level,
      cashflowInsolvency,
      dimScores,
      weakestDimKey: entries[0][0],
    };
  };

  const perfEval = finished ? evaluatePerformance() : null;
  const rubricMeta = perfEval ? getRubricLabel(perfEval.level) : null;

  const handleFinish = () => {
    playClick();
    const res = evaluatePerformance();
    const total = Math.max(1, data.chapters.length);
    const isPass =
      !res.cashflowInsolvency && res.overallScore >= (performanceSpec?.passMinScore ?? 75);

    onComplete({
      score:
        data.isPerformanceProject || performanceSpec
          ? res.overallScore
          : Math.round((recommendedHits / total) * 100),
      correctCount: recommendedHits,
      totalCount: total,
      wrongItemIds: wrongIds,
      performanceResult: res,
    });
    if (isPass) playCorrect();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span>
          {data.isCapstone
            ? 'PROYEK CAPSTONE FINAL • RUBRIK KETAHANAN 4-LEVEL'
            : data.isPerformanceProject
            ? 'PROYEK KINERJA SIMULASI • TANPA TIMER'
            : 'SIMULASI SKENARIO • TANPA TIMER'}
        </span>
        <span className="tabular-nums text-[#0D1117]">
          {finished ? 'Evaluasi Akhir' : `Babak ${chIdx + 1} / ${data.chapters.length}`}
        </span>
      </div>

      {/* Financial Snapshot HUD */}
      <div className="bg-[#0D1117] text-white rounded-3xl p-5 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
              {data.durationLabelId}
            </p>
            <h3 className="text-base sm:text-lg font-extrabold">{data.titleId}</h3>
            <p className="text-xs text-slate-300 mt-0.5">{data.subtitleId}</p>
          </div>
          {insolvencyTriggered && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-extrabold">
              <AlertTriangle className="w-3.5 h-3.5" />
              Insolvensi Kas
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 tabular-nums">
          <div className="bg-white/10 rounded-2xl p-3">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300 uppercase">
              <Wallet className="w-3 h-3 text-emerald-400" />
              Kas Lancar
            </div>
            <p className={`text-xs sm:text-sm font-extrabold mt-1 ${cash < 0 ? 'text-rose-400' : 'text-white'}`}>
              Rp{cash.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300 uppercase">
              <ShieldCheck className="w-3 h-3 text-sky-400" />
              Dana Darurat
            </div>
            <p className="text-xs sm:text-sm font-extrabold mt-1 text-white">
              Rp{emergencyFund.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300 uppercase">
              <PiggyBank className="w-3 h-3 text-amber-300" />
              Sinking Fund
            </div>
            <p className="text-xs sm:text-sm font-extrabold mt-1 text-white">
              Rp{sinkingFund.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300 uppercase">
              <CreditCard className="w-3 h-3 text-rose-400" />
              Pokok Utang
            </div>
            <p className="text-xs sm:text-sm font-extrabold mt-1 text-rose-200">
              Rp{debt.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300 uppercase">
              <Award className="w-3 h-3 text-[#D4AF37]" />
              Kekayaan Neto
            </div>
            <p className="text-xs sm:text-sm font-extrabold mt-1 text-[#D4AF37]">
              Rp{netWorth.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>

      {!finished && chapter ? (
        <div className="bg-white rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full bg-[#F4F5F7] text-xs font-extrabold text-[#0D1117]">
              {chapter.periodLabelId}
            </span>
            {chapter.assumptionNoteId && (
              <span className="text-[11px] font-medium text-slate-500">
                Asumsi: {chapter.assumptionNoteId}
              </span>
            )}
          </div>

          <p className="text-base font-bold text-[#0D1117] leading-relaxed">
            {chapter.narrativeId}
          </p>

          <div className="space-y-2.5">
            {shuffledChoices.map((ch) => {
              const isPicked = selectedChoice?.id === ch.id;
              const isRec = Boolean(ch.isRecommended);
              let cls = 'bg-[#F4F5F7] hover:bg-[#EAECEF] text-[#0D1117]';
              if (selectedChoice) {
                if (isRec) cls = 'bg-[#ECFDF5] text-[#065F46] ring-2 ring-[#059669]';
                else if (isPicked) cls = 'bg-[#FEF2F2] text-[#7F1D1D] ring-2 ring-[#DC2626]';
                else cls = 'bg-[#F4F5F7] text-slate-400 opacity-65';
              }
              return (
                <button
                  key={ch.id}
                  type="button"
                  disabled={Boolean(selectedChoice)}
                  onClick={() => handleChoose(ch)}
                  className={`w-full text-left p-4 rounded-2xl transition-all flex items-start justify-between gap-3 cursor-pointer disabled:cursor-default ${cls}`}
                >
                  <span className="text-sm font-semibold leading-relaxed">{ch.labelId}</span>
                  {selectedChoice && isRec && (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#059669] mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedChoice && (
            <div
              className={`rounded-2xl p-4 space-y-3 ${
                selectedChoice.isRecommended ? 'bg-[#EEFBF4]' : 'bg-[#FFF5F5]'
              }`}
            >
              <p className="text-sm font-semibold text-[#0D1117] leading-relaxed">
                {selectedChoice.feedbackId}
              </p>
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3 rounded-full bg-[#0D1117] hover:bg-slate-800 text-white text-sm font-bold cursor-pointer"
              >
                {chIdx + 1 < data.chapters.length ? 'Lanjut ke Babak Berikutnya' : 'Hitung Evaluasi Kinerja'}
              </button>
            </div>
          )}
        </div>
      ) : (
        perfEval &&
        rubricMeta && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-extrabold ${rubricMeta.cls}`}>
                    {rubricMeta.title}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {rubricMeta.desc}
                  </p>
                </div>
                <div className="text-right tabular-nums">
                  <p className="text-[11px] font-bold uppercase text-slate-400">Skor Kinerja</p>
                  <p className="text-3xl font-extrabold text-[#0D1117]">{perfEval.overallScore}</p>
                </div>
              </div>

              {/* 4 Rubric Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  { label: 'Stabilitas Arus Kas · 30%', val: perfEval.dimScores.cashflowStability },
                  { label: 'Ketahanan Risiko & Likuiditas · 30%', val: perfEval.dimScores.riskLiquidity },
                  { label: 'Imunitas Utang & Keamanan · 20%', val: perfEval.dimScores.debtScamImmunity },
                  { label: 'Pencapaian Tujuan Finansial · 20%', val: perfEval.dimScores.goalPreservation },
                ].map((d) => (
                  <div key={d.label} className="bg-[#F4F5F7] rounded-2xl p-3">
                    <div className="flex justify-between text-xs font-bold text-[#0D1117] mb-1.5">
                      <span>{d.label}</span>
                      <span className="tabular-nums">{d.val}</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          d.val >= 75 ? 'bg-[#059669]' : d.val >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${d.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ExplanationCard
              spec={data.explanationCard}
              isCorrect={!perfEval.cashflowInsolvency && perfEval.overallScore >= (performanceSpec?.passMinScore ?? 75)}
              onContinue={handleFinish}
              continueLabel={
                performanceSpec ? 'Submit Proyek Kinerja UAS' : 'Selesaikan Simulasi'
              }
            />
          </div>
        )
      )}
    </div>
  );
};
