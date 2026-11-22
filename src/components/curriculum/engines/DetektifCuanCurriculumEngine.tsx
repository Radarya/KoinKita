import React, { useMemo, useState } from 'react';
import {
  FileText,
  Mail,
  MessageCircle,
  QrCode,
  Receipt,
  Search,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import type { DetektifCase, DetektifEvidenceLevel, DetektifVerdict } from '../../../curriculum/types';
import { seededShuffleArray } from '../../../curriculum/shuffleUtils';
import type { EngineCompleteResult } from './CuanQuizEngine';
import { ExplanationCard } from '../ExplanationCard';
import { playClick, playCorrect, playWrong } from '../../../lib/audio';
import { vibrateError, vibrateSuccess } from '../../../lib/haptics';

interface DetektifCuanCurriculumEngineProps {
  cases: DetektifCase[];
  filterItemIds?: string[];
  onMistake?: (itemId: string) => void;
  onComplete: (result: EngineCompleteResult) => void;
}

const VERDICT_STYLES: Record<DetektifVerdict, { bg: string; text: string; badge: string }> = {
  AMAN: { bg: 'bg-[#ECFDF5]', text: 'text-[#065F46]', badge: 'bg-[#059669] text-white' },
  WASPADA: { bg: 'bg-[#FEF7E0]', text: 'text-[#8C6D00]', badge: 'bg-[#D97706] text-white' },
  BAHAYA: { bg: 'bg-[#FEF2F2]', text: 'text-[#991B1B]', badge: 'bg-[#DC2626] text-white' },
};

const EVIDENCE_BADGES: Record<DetektifEvidenceLevel, { label: string; cls: string }> = {
  fakta_terobservasi: {
    label: 'Bukti Audit: Fakta Terobservasi',
    cls: 'bg-[#E6F4EA] text-[#0D652D]',
  },
  red_flag: {
    label: 'Bukti Audit: Red Flag / Manipulasi',
    cls: 'bg-[#FCE8E6] text-[#A50E0E]',
  },
  perlu_verifikasi: {
    label: 'Bukti Audit: Perlu Verifikasi Resmi',
    cls: 'bg-[#FEF7E0] text-[#8C6D00]',
  },
};

function getChannelIcon(channel: DetektifCase['channel']) {
  switch (channel) {
    case 'WhatsApp':
    case 'SMS':
      return <MessageCircle className="w-4 h-4" />;
    case 'Email':
      return <Mail className="w-4 h-4" />;
    case 'Struk':
      return <Receipt className="w-4 h-4" />;
    case 'QRIS':
      return <QrCode className="w-4 h-4" />;
    case 'Tawaran':
      return <Sparkles className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
}

export const DetektifCuanCurriculumEngine: React.FC<DetektifCuanCurriculumEngineProps> = ({
  cases,
  filterItemIds,
  onMistake,
  onComplete,
}) => {
  const [sessionSeed] = useState(() => Math.floor(Math.random() * 1_000_000) + 1);

  const activeCases = useMemo(() => {
    const base =
      !filterItemIds || filterItemIds.length === 0
        ? cases
        : (() => {
            const filtered = cases.filter((c) => filterItemIds.includes(c.id));
            return filtered.length > 0 ? filtered : cases;
          })();
    return base.map((c, idx) => ({
      ...c,
      optionsId: seededShuffleArray(c.optionsId, `${sessionSeed}:${c.id}:${idx}`),
    }));
  }, [cases, filterItemIds, sessionSeed]);

  const [caseIdx, setCaseIdx] = useState(0);
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);

  const item = activeCases[caseIdx];
  const hasAnswered = selectedOptId !== null;
  const isCorrect = selectedOptId === item?.correctOptionId;

  if (!item) return null;

  const handleChoose = (optId: string) => {
    if (hasAnswered) return;
    setSelectedOptId(optId);
    if (optId === item.correctOptionId) {
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
    if (caseIdx + 1 < activeCases.length) {
      setCaseIdx((i) => i + 1);
      setSelectedOptId(null);
    } else {
      const total = activeCases.length;
      onComplete({
        score: total > 0 ? Math.round((correctCount / total) * 100) : 100,
        correctCount,
        totalCount: total,
        wrongItemIds: wrongIds,
      });
    }
  };

  const evBadge = EVIDENCE_BADGES[item.evidenceLevel];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span>DETEKTIF CUAN • AUDIT DOKUMEN TANPA TIMER</span>
        <span className="tabular-nums text-[#0D1117]">
          Berkas {caseIdx + 1} / {activeCases.length}
        </span>
      </div>

      {/* Document Viewer Card */}
      <div className="bg-white rounded-3xl overflow-hidden">
        <div className="bg-[#0D1117] text-white px-5 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#D4AF37]">
              {getChannelIcon(item.channel)}
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Saluran Bukti • {item.channel}
              </p>
              <p className="text-sm font-bold truncate">{item.senderTitle}</p>
            </div>
          </div>
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Mock document content */}
          <div
            className={`rounded-2xl p-4 sm:p-5 space-y-1.5 ${
              item.channel === 'Struk' || item.channel === 'SlipGaji'
                ? 'bg-[#F8FAFC] font-mono text-xs sm:text-sm tabular-nums'
                : item.channel === 'WhatsApp' || item.channel === 'SMS'
                ? 'bg-[#EEFBF4] text-sm text-[#0D1117]'
                : 'bg-[#F4F5F7] text-sm text-[#0D1117]'
            }`}
          >
            {item.documentLines.map((line, i) => (
              <p key={i} className="leading-relaxed break-words">
                {line}
              </p>
            ))}
          </div>

          {/* Evidence Tier revealed post-answer */}
          {hasAnswered && (
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${evBadge.cls}`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                {evBadge.label}
              </span>
            </div>
          )}

          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0D1117] leading-snug mb-3.5">
              {item.questionId}
            </h3>

            <div className="space-y-2.5">
              {item.optionsId.map((opt) => {
                const isPicked = selectedOptId === opt.id;
                const isTarget = opt.id === item.correctOptionId;
                const vStyle = VERDICT_STYLES[opt.verdict];
                let btnCls = 'bg-[#F4F5F7] hover:bg-[#EAECEF] text-[#0D1117]';

                if (hasAnswered) {
                  if (isTarget) {
                    btnCls = `${vStyle.bg} ${vStyle.text} ring-2 ring-[#059669]`;
                  } else if (isPicked) {
                    btnCls = 'bg-[#FEF2F2] text-[#7F1D1D] ring-2 ring-[#DC2626]';
                  } else {
                    btnCls = 'bg-[#F4F5F7] text-slate-400 opacity-70';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => handleChoose(opt.id)}
                    className={`w-full text-left p-4 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center gap-2.5 cursor-pointer disabled:cursor-default ${btnCls}`}
                  >
                    <span
                      className={`inline-block self-start px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wider shrink-0 ${vStyle.badge}`}
                    >
                      {opt.verdict}
                    </span>
                    <span className="text-sm font-semibold leading-relaxed">
                      {opt.labelId}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {hasAnswered && (
        <ExplanationCard
          spec={item.explanationCard}
          isCorrect={isCorrect}
          onContinue={handleNext}
          continueLabel={caseIdx + 1 < activeCases.length ? 'Berkas Berikutnya' : 'Selesaikan Audit'}
        />
      )}
    </div>
  );
};
