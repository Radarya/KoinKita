import React from 'react';
import type { AreaThemeSpec } from './expeditionConfig';
import { KawungMotifLayer, LandmarkSvg } from './NusantaraPatterns';

interface AreaHeroBannerProps {
  area: AreaThemeSpec;
  completedPathsInArea: number;
  totalPathsInArea: number;
}

/**
 * Level 1 Area Banner: introduces the current Indonesian economic region
 * with subtle Batik Kawung background + flat-vector regional landmark.
 */
export const AreaHeroBanner: React.FC<AreaHeroBannerProps> = ({
  area,
  completedPathsInArea,
  totalPathsInArea,
}) => {
  const pct =
    totalPathsInArea > 0 ? Math.round((completedPathsInArea / totalPathsInArea) * 100) : 0;

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-5 text-white"
      style={{ backgroundColor: area.accentBg }}
    >
      {/* Motif Kawung limited strictly to banner backdrop */}
      <div className="absolute inset-0 text-white">
        <KawungMotifLayer opacity={0.14} />
      </div>

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0 flex-1">
          <p className="block text-[11px] font-extrabold uppercase tracking-wider text-white/85">
            Area {area.areaNumber} · Semester {Number(area.areaNumber)}
          </p>
          <h2 className="block text-lg sm:text-xl font-extrabold font-[Poppins] leading-snug">
            {area.nameId}
          </h2>
          <p className="block text-xs text-white/90 font-medium">{area.subtitleId}</p>

          <div className="pt-1.5 flex items-center gap-2.5 max-w-[220px]">
            <div className="h-2 flex-1 rounded-full bg-black/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#FEF08A] transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[11px] font-extrabold tabular-nums text-white/95">
              {completedPathsInArea}/{totalPathsInArea}
            </span>
          </div>
        </div>

        {/* Level 1 Area Landmark in soft framing disc */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/15 flex items-center justify-center shrink-0 p-1.5">
          <LandmarkSvg kind={area.landmark} size={84} />
        </div>
      </div>
    </div>
  );
};
