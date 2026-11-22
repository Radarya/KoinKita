import React from 'react';
import { CheckCircle2, AlertCircle, BookOpen, ShieldCheck, ExternalLink, Info } from 'lucide-react';
import type { ExplanationCardSpec, StatementType } from '../../curriculum/types';

interface ExplanationCardProps {
  spec: ExplanationCardSpec;
  isCorrect: boolean;
  onContinue?: () => void;
  continueLabel?: string;
  hideContinue?: boolean;
}

const STATEMENT_LABELS: Record<StatementType, { label: string; bg: string; text: string }> = {
  fixed_fact: {
    label: 'Fakta & Rumus Baku',
    bg: 'bg-[#E6F4EA]',
    text: 'text-[#0D652D]',
  },
  dynamic_fact: {
    label: 'Ketentuan Regulasi Terkini',
    bg: 'bg-[#FEF7E0]',
    text: 'text-[#8C6D00]',
  },
  simulation_assumption: {
    label: 'Asumsi Simulasi Edukatif',
    bg: 'bg-[#E8F0FE]',
    text: 'text-[#1967D2]',
  },
};

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  spec,
  isCorrect,
  onContinue,
  continueLabel = 'Lanjut',
  hideContinue = false,
}) => {
  const stMeta = STATEMENT_LABELS[spec.statementType] || STATEMENT_LABELS.fixed_fact;

  return (
    <div
      className={`rounded-3xl p-5 sm:p-6 transition-colors ${
        isCorrect ? 'bg-[#EEFBF4]' : 'bg-[#FFF5F5]'
      }`}
    >
      {/* 1. Status Jawaban */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
            isCorrect ? 'bg-[#059669] text-white' : 'bg-[#DC2626] text-white'
          }`}
        >
          {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-sm font-extrabold ${
                isCorrect ? 'text-[#059669]' : 'text-[#DC2626]'
              }`}
            >
              {isCorrect ? 'Tepat!' : 'Kurang Tepat'}
            </span>
            {spec.statementType === 'dynamic_fact' && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${stMeta.bg} ${stMeta.text}`}
              >
                <Info className="w-3 h-3" />
                {stMeta.label}
              </span>
            )}
          </div>
          {((isCorrect && spec.statusCorrectId) || (!isCorrect && spec.statusWrongId)) && (
            <p className="text-sm font-bold text-[#0D1117] leading-snug mt-1">
              {isCorrect ? spec.statusCorrectId : spec.statusWrongId}
            </p>
          )}
        </div>
      </div>

      {/* 2. Mekanisme & Alasan Inti */}
      <div className="bg-white/90 rounded-2xl p-4 space-y-3 mb-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Alasan Inti
          </p>
          <p className="text-sm text-[#0D1117] leading-relaxed font-medium">
            {spec.coreMechanismId}
          </p>
        </div>

        {/* 3. Hitungan / Bukti Terobservasi */}
        {spec.calculationOrEvidenceId && (
          <div className="bg-[#F4F5F7] rounded-xl p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Hitungan / Bukti
            </p>
            <p className="text-xs sm:text-sm font-mono tabular-nums text-[#0D1117] leading-relaxed">
              {spec.calculationOrEvidenceId}
            </p>
          </div>
        )}

        {/* 4. Catatan Asumsi (Hanya tampil jika ada asumsi khusus yang bermakna) */}
        {spec.assumptionsAndConditionsId &&
          !spec.assumptionsAndConditionsId.includes('Konteks simulasi edukasi Indonesia') && (
            <div className="bg-[#F8FAFC] rounded-xl p-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Catatan Asumsi
              </p>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {spec.assumptionsAndConditionsId}
              </p>
            </div>
          )}

        {/* 5. Implikasi Keputusan Sehat */}
        <div className="bg-[#ECFDF5] rounded-xl p-3 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#059669] mb-0.5">
              Langkah & Keputusan Sehat
            </p>
            <p className="text-xs sm:text-sm font-semibold text-[#064E3B] leading-relaxed">
              {spec.healthyDecisionImplicationId}
            </p>
          </div>
        </div>
      </div>

      {/* 6. Referensi Sumber Resmi Indonesia */}
      {spec.regulationMeta && (
        <div className="bg-white/70 rounded-2xl px-3.5 py-2.5 mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-start gap-2 min-w-0">
            <BookOpen className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <div className="leading-snug">
              <span className="font-bold text-[#0D1117]">{spec.regulationMeta.source}: </span>
              <span>{spec.regulationMeta.regulationRef}</span>
              {spec.regulationMeta.relevantArticle && (
                <span className="text-slate-500"> ({spec.regulationMeta.relevantArticle})</span>
              )}
              <span className="ml-1.5 text-[11px] text-slate-400">
                • Terverifikasi {spec.regulationMeta.verifiedDate}
              </span>
            </div>
          </div>
          {spec.regulationMeta.sourceUrl && (
            <a
              href={spec.regulationMeta.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#059669] hover:underline shrink-0"
            >
              Sumber
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {!hideContinue && onContinue && (
        <button
          type="button"
          onClick={onContinue}
          className={`w-full py-3.5 rounded-full font-bold text-sm text-white transition-colors cursor-pointer ${
            isCorrect
              ? 'bg-[#059669] hover:bg-emerald-700'
              : 'bg-[#0D1117] hover:bg-slate-800'
          }`}
        >
          {continueLabel}
        </button>
      )}
    </div>
  );
};
