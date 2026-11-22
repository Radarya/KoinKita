import React from 'react';
import { BookOpen, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { UNIT_MAP } from '../../curriculum';
import { playClick } from '../../lib/audio';

interface GuidebookModalProps {
  unitId: string | null;
  onClose: () => void;
}

export const GuidebookModal: React.FC<GuidebookModalProps> = ({ unitId, onClose }) => {
  if (!unitId) return null;
  const unit = UNIT_MAP[unitId];
  if (!unit) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Buku Saku Unit ${unit.unitNumber}`}
    >
      <div className="bg-[#FAFAFA] rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-8 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#059669] text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#059669]">
                Buku Saku • Unit {unit.unitNumber}
              </p>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0D1117] leading-snug">
                {unit.titleId}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-[#F4F5F7] hover:bg-slate-200 flex items-center justify-center text-[#0D1117] shrink-0 cursor-pointer"
            aria-label="Tutup Buku Saku"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 space-y-3">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Ringkasan Konsep Inti
          </p>
          <p className="text-sm text-[#0D1117] leading-relaxed font-medium">
            {unit.guidebook.summaryId}
          </p>
        </div>

        <div className="bg-[#EEFBF4] rounded-2xl p-5 space-y-2.5">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#059669]">
            Aturan Kunci & Rumus Praktis
          </p>
          <ul className="space-y-2">
            {unit.guidebook.keyRulesId.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-[#064E3B] font-medium">
                <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#F4F5F7] rounded-2xl p-4 space-y-2">
          <p className="text-xs font-bold text-[#0D1117]">{unit.guidebook.disclaimerId}</p>
          {unit.regulationMeta && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
              <span>
                <strong>{unit.regulationMeta.source}:</strong> {unit.regulationMeta.regulationRef} (
                Terverifikasi {unit.regulationMeta.verifiedDate})
              </span>
              {unit.regulationMeta.sourceUrl && (
                <a
                  href={unit.regulationMeta.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-[#059669] hover:underline"
                >
                  Rujukan Resmi <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            playClick();
            onClose();
          }}
          className="w-full py-3.5 rounded-full bg-[#0D1117] hover:bg-slate-800 text-white text-sm font-bold cursor-pointer"
        >
          Tutup Buku Saku
        </button>
      </div>
    </div>
  );
};

export default GuidebookModal;
