import React, { useMemo, useState } from 'react';
import {
  TrendingUp,
  Droplets,
  Flame,
  Shield,
  Sun,
  CloudRain,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import type {
  PohonAsetCurriculumData,
  PohonAsetDecisionOption,
} from '../../../curriculum/types';
import { seededShuffleArray } from '../../../curriculum/shuffleUtils';
import type { EngineCompleteResult } from './CuanQuizEngine';
import { ExplanationCard } from '../ExplanationCard';
import { playClick, playCorrect, playWrong } from '../../../lib/audio';
import { vibrateError, vibrateSuccess } from '../../../lib/haptics';

interface PohonAsetCurriculumEngineProps {
  data: PohonAsetCurriculumData;
  onMistake?: (itemId: string) => void;
  onComplete: (result: EngineCompleteResult) => void;
}

const WEATHER_UI = {
  NORMAL: { label: 'Iklim Normal', cls: 'bg-[#E6F4EA] text-[#0D652D]', icon: Sun },
  INFLASI: { label: 'Tekanan Inflasi', cls: 'bg-[#FEF7E0] text-[#8C6D00]', icon: Flame },
  KRISIS: { label: 'Guncangan Krisis', cls: 'bg-[#FCE8E6] text-[#A50E0E]', icon: CloudRain },
  BOOM: { label: 'Ekspansi / Bonus', cls: 'bg-[#E8F0FE] text-[#1967D2]', icon: Zap },
};

function clampScore(v: number) {
  return Math.max(0, Math.min(100, Math.round(v)));
}

export const PohonAsetCurriculumEngine: React.FC<PohonAsetCurriculumEngineProps> = ({
  data,
  onMistake,
  onComplete,
}) => {
  const [sessionSeed] = useState(() => Math.floor(Math.random() * 1_000_000) + 1);
  const [qIdx, setQIdx] = useState(0);
  const [cash, setCash] = useState(data.initialCash);
  const [invested, setInvested] = useState(data.initialInvested);
  const [riskExposure, setRiskExposure] = useState(20);
  const [inflationProt, setInflationProt] = useState(40);
  const [liquidityScore, setLiquidityScore] = useState(75);
  const [selectedOpt, setSelectedOpt] = useState<PohonAsetDecisionOption | null>(null);
  const [optimalHits, setOptimalHits] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const quarter = data.quarters[qIdx];
  const shuffledOptions = useMemo(() => {
    if (!quarter) return [];
    return seededShuffleArray(
      quarter.options,
      `${sessionSeed}:${quarter.quarterLabelId}:${qIdx}`
    );
  }, [quarter, qIdx, sessionSeed]);

  if (!quarter && !finished) return null;

  const totalAssets = cash + invested;
  const targetRatio =
    data.targetGoalAmount > 0 ? Math.min(100, Math.round((totalAssets / data.targetGoalAmount) * 100)) : 100;

  const handleChoose = (opt: PohonAsetDecisionOption) => {
    if (selectedOpt || !quarter) return;
    setSelectedOpt(opt);
    setCash((c) => c + opt.cashDelta);
    setInvested((inv) => Math.max(0, inv + opt.investedDelta));
    setRiskExposure((r) => clampScore(r + opt.riskExposureScore));
    setInflationProt((inf) => clampScore(inf + opt.inflationProtectionScore));
    setLiquidityScore((liq) => clampScore(liq + opt.liquidityScore));

    if (opt.isOptimal) {
      playCorrect();
      vibrateSuccess();
      setOptimalHits((h) => h + 1);
    } else {
      playWrong();
      vibrateError();
      setWrongIds((prev) => [...prev, `${quarter.quarterLabelId}:${opt.id}`]);
      onMistake?.(opt.id);
    }
  };

  const handleAdvanceQuarter = () => {
    playClick();
    if (qIdx + 1 < data.quarters.length) {
      setQIdx((i) => i + 1);
      setSelectedOpt(null);
    } else {
      setFinished(true);
    }
  };

  const handleCompleteSim = () => {
    playClick();
    const total = Math.max(1, data.quarters.length);
    const ratioScore = Math.round((optimalHits / total) * 100);
    const solvencyPenalty = cash < 0 ? 25 : 0;
    const score = Math.max(30, ratioScore - solvencyPenalty);
    onComplete({
      score,
      correctCount: optimalHits,
      totalCount: total,
      wrongItemIds: wrongIds,
    });
  };

  const weatherMeta = quarter ? WEATHER_UI[quarter.macroWeather] : WEATHER_UI.NORMAL;
  const WeatherIcon = weatherMeta.icon;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span>POHON ASET • SIMULASI TRADE-OFF MULTI-VARIABEL</span>
        <span className="tabular-nums text-[#0D1117]">
          {finished
            ? 'Laporan Akhir'
            : `Periode ${qIdx + 1} / ${data.quarters.length}`}
        </span>
      </div>

      {/* Live Multi-Variable HUD */}
      <div className="bg-[#0D1117] text-white rounded-3xl p-5 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {data.horizonLabelId}
            </p>
            <h3 className="text-base sm:text-lg font-extrabold">{data.scenarioTitleId}</h3>
          </div>
          <div className="text-right tabular-nums">
            <p className="text-[11px] text-slate-400">Target Tujuan ({targetRatio}%)</p>
            <p className="text-sm font-bold text-[#D4AF37]">
              Rp{data.targetGoalAmount.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 tabular-nums">
          <div className="bg-white/10 rounded-2xl p-3">
            <p className="text-[10px] font-bold uppercase text-slate-300">Kas Likuid</p>
            <p className={`text-sm sm:text-base font-extrabold ${cash < 0 ? 'text-rose-400' : 'text-emerald-300'}`}>
              Rp{cash.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3">
            <p className="text-[10px] font-bold uppercase text-slate-300">Modal Dikelola</p>
            <p className="text-sm sm:text-base font-extrabold text-white">
              Rp{invested.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 col-span-2 sm:col-span-1">
            <p className="text-[10px] font-bold uppercase text-slate-300">Total Aset Simulasi</p>
            <p className="text-sm sm:text-base font-extrabold text-[#D4AF37]">
              Rp{totalAssets.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* 3 Trade-off Meters */}
        <div className="grid grid-cols-3 gap-3 pt-1">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
              <span className="inline-flex items-center gap-1"><Droplets className="w-3 h-3 text-sky-400" /> Likuiditas</span>
              <span className="tabular-nums font-bold">{liquidityScore}</span>
            </div>
            <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
              <div className="h-full bg-sky-400 rounded-full transition-all" style={{ width: `${liquidityScore}%` }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
              <span className="inline-flex items-center gap-1"><TrendingUp className="w-3 h-3 text-emerald-400" /> Tahan Inflasi</span>
              <span className="tabular-nums font-bold">{inflationProt}</span>
            </div>
            <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${inflationProt}%` }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
              <span className="inline-flex items-center gap-1"><Shield className="w-3 h-3 text-amber-400" /> Eksposur Risiko</span>
              <span className="tabular-nums font-bold">{riskExposure}</span>
            </div>
            <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${riskExposure}%` }} />
            </div>
          </div>
        </div>
      </div>

      {!finished && quarter ? (
        <div className="bg-white rounded-3xl p-5 sm:p-6 space-y-4">
          {qIdx === 0 && (
            <p className="text-xs text-slate-600 bg-[#F4F5F7] rounded-2xl p-3 leading-relaxed">
              {data.scenarioIntroId}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              {quarter.quarterLabelId}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${weatherMeta.cls}`}
            >
              <WeatherIcon className="w-3.5 h-3.5" />
              {weatherMeta.label}
            </span>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-extrabold text-[#0D1117] mb-1.5">
              {quarter.eventTitleId}
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">{quarter.eventDescId}</p>
          </div>

          <div className="space-y-2.5 pt-1">
            {shuffledOptions.map((opt) => {
              const isPicked = selectedOpt?.id === opt.id;
              const isBest = Boolean(opt.isOptimal);
              let cls = 'bg-[#F4F5F7] hover:bg-[#EAECEF] text-[#0D1117]';
              if (selectedOpt) {
                if (isBest) cls = 'bg-[#ECFDF5] text-[#065F46] ring-2 ring-[#059669]';
                else if (isPicked) cls = 'bg-[#FEF2F2] text-[#7F1D1D] ring-2 ring-[#DC2626]';
                else cls = 'bg-[#F4F5F7] text-slate-400 opacity-65';
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={Boolean(selectedOpt)}
                  onClick={() => handleChoose(opt)}
                  className={`w-full text-left p-4 rounded-2xl transition-all cursor-pointer disabled:cursor-default ${cls}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-bold">{opt.labelId}</span>
                    {selectedOpt && isBest && (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-[#059669]" />
                    )}
                  </div>
                  <p className="text-xs opacity-85 mt-1 leading-relaxed">{opt.descId}</p>
                </button>
              );
            })}
          </div>

          {selectedOpt && (
            <div
              className={`rounded-2xl p-4 space-y-3 ${
                selectedOpt.isOptimal ? 'bg-[#EEFBF4]' : 'bg-[#FFF5F5]'
              }`}
            >
              <p className="text-sm font-semibold text-[#0D1117] leading-relaxed">
                {selectedOpt.feedbackId}
              </p>
              <button
                type="button"
                onClick={handleAdvanceQuarter}
                className="w-full py-3 rounded-full bg-[#0D1117] hover:bg-slate-800 text-white text-sm font-bold cursor-pointer"
              >
                {qIdx + 1 < data.quarters.length
                  ? 'Lanjut ke Periode Berikutnya'
                  : 'Lihat Kesimpulan Trade-Off'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <ExplanationCard
          spec={data.explanationCard}
          isCorrect={optimalHits >= Math.ceil(data.quarters.length * 0.6) && cash >= 0}
          onContinue={handleCompleteSim}
          continueLabel="Selesaikan Simulasi Pohon Aset"
        />
      )}
    </div>
  );
};
