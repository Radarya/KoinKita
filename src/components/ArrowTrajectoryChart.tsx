import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  ArrowRight, 
  TrendingUp, 
  Activity, 
  Calendar, 
  MessageSquare, 
  Flame, 
  Compass, 
  Quote 
} from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';

type Transaction = {
  id: string;
  date: string;
  amount: number;
  grams: number;
  note: string;
  habit?: string;
  reflection?: string;
};

interface ArrowTrajectoryChartProps {
  transactions: Transaction[];
  currentPrice: number;
  isDark: boolean;
  t: {
    textMain: string;
    textMuted: string;
    textFaint: string;
    textVeryFaint: string;
    border: string;
    borderLight: string;
    cardBg: string;
    inputBg: string;
  };
}

export default function ArrowTrajectoryChart({ 
  transactions, 
  currentPrice, 
  isDark, 
  t 
}: ArrowTrajectoryChartProps) {
  const { language } = useTranslation();
  const [chartMode, setChartMode] = useState<'cumulative' | 'individual'>('cumulative');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!transactions || transactions.length === 0) {
    return (
      <div className={`p-6 rounded-xl border ${t.border} ${t.cardBg} flex flex-col items-center justify-center text-center py-10 transition-colors duration-500`}>
        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-3">
          <Activity className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <h4 className={`text-sm font-medium ${t.textMain}`}>
          {language === 'id' ? "Visualisasi Trajektori Emas" : "Gold Trajectory Visualization"}
        </h4>
        <p className={`text-xs ${t.textMuted} mt-1 max-w-sm leading-relaxed`}>
          {language === 'id' 
            ? "Setor akumulasi emas pertamamu di terminal untuk melihat perkembangan grafik panah interaktif." 
            : "Deposit your first accumulated gold in the terminal to view the interactive trajectory arrow chart."}
        </p>
      </div>
    );
  }

  // Reverse transactions to get chronological order (oldest to newest)
  const chronological = [...transactions].reverse();

  // Compute cumulative values
  let cumulativeSum = 0;
  const points = chronological.map((tx, idx) => {
    cumulativeSum += tx.grams;
    return {
      ...tx,
      cumulative: cumulativeSum,
      index: idx
    };
  });

  // Automatically select the latest point if none selected
  const activeIndex = selectedIndex !== null ? selectedIndex : points.length - 1;
  const activePoint = points[activeIndex] || points[points.length - 1];

  // SVG parameters
  const paddingX = 40;
  const paddingY = 40;
  const svgWidth = 600;
  const svgHeight = 220;
  const graphWidth = svgWidth - 2 * paddingX;
  const graphHeight = svgHeight - 2 * paddingY;

  // Find mins and maxes for proper coordinate scaling
  const maxVal = chartMode === 'cumulative' 
    ? Math.max(...points.map(p => p.cumulative), 0.1) 
    : Math.max(...points.map(p => p.grams), 0.01);

  const minVal = chartMode === 'cumulative'
    ? Math.min(...points.map(p => p.cumulative), 0)
    : 0;

  const valueRange = maxVal - minVal || 1;

  // Map points to SVG coordinates
  const coords = points.map((p, idx) => {
    const x = points.length > 1 
      ? paddingX + (idx / (points.length - 1)) * graphWidth 
      : paddingX + graphWidth / 2;

    const val = chartMode === 'cumulative' ? p.cumulative : p.grams;
    // Invert Y coordinate for SVG (0 is top, svgHeight is bottom)
    const y = paddingY + graphHeight - ((val - minVal) / valueRange) * graphHeight;

    return { x, y, ...p };
  });

  // Calculate some helpful statistics
  const totalInvestedGrams = points.reduce((acc, p) => acc + p.grams, 0);
  const totalInvestedIdr = points.reduce((acc, p) => acc + p.amount, 0);
  const averageGrams = totalInvestedGrams / points.length;

  return (
    <div className={`flex flex-col border ${t.border} rounded-xl p-5 ${t.cardBg} transition-all duration-500 gap-4 relative overflow-hidden`}>
      {/* BACKGROUND GRAPH GRID EFFECT */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#D4AF37]/[0.01] pointer-events-none" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 border-b border-dashed border-gray-500/10 pb-4 relative z-10">
        <div>
          <h3 className={`text-xs font-semibold tracking-[0.2em] uppercase text-[#D4AF37]`}>
            {language === 'id' ? "TRAJEKTORI MILIKMU (GRAFIK PANAH INTERAKTIF)" : "YOUR TRAJECTORY (INTERACTIVE ARROW CHART)"}
          </h3>
          <p className={`text-[10px] uppercase font-mono tracking-widest ${t.textFaint} mt-0.5`}>
            {language === 'id' 
              ? "Langkah demi Langkah Menghindari Konsumsi untuk Masa Depan" 
              : "Step-by-Step of Avoiding Consumption for the Future"}
          </p>
        </div>

        {/* MODE TOGGLER */}
        <div className={`p-1 flex items-center rounded-lg ${t.inputBg} border ${t.border} transition-colors`}>
          <button
            onClick={() => { setChartMode('cumulative'); setSelectedIndex(null); }}
            className={`px-3 py-1 rounded-md text-[9px] uppercase tracking-wider font-semibold transition-all flex items-center gap-1 ${chartMode === 'cumulative' ? 'bg-[#D4AF37] text-black shadow-sm' : `${t.textMuted} hover:text-white`}`}
          >
            <TrendingUp className="w-3 h-3" />
            <span>{language === 'id' ? "Akumulasi Emas" : "Cumulative Gold"}</span>
          </button>
          <button
            onClick={() => { setChartMode('individual'); setSelectedIndex(null); }}
            className={`px-3 py-1 rounded-md text-[9px] uppercase tracking-wider font-semibold transition-all flex items-center gap-1 ${chartMode === 'individual' ? 'bg-[#D4AF37] text-black shadow-sm' : `${t.textMuted} hover:text-white`}`}
          >
            <Compass className="w-3 h-3" />
            <span>{language === 'id' ? "Besar Hemat" : "Amount Saved"}</span>
          </button>
        </div>
      </div>

      {/* SVG GRAPH FRAME */}
      <div className="relative w-full overflow-x-auto select-none no-scrollbar py-2">
        <div className="min-w-[500px] w-full">
          <svg 
            width="100%" 
            height={svgHeight} 
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="overflow-visible"
          >
            <defs>
              {/* Shimmering gold gradient for line */}
              <linearGradient id="goldCurveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FFF0BC" stopOpacity="0.4" />
              </linearGradient>

              {/* Underlying glow fill */}
              <linearGradient id="goldAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
              </linearGradient>

              {/* Node highlights */}
              <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Grid horizontal lines */}
            {Array.from({ length: 4 }).map((_, i) => {
              const y = paddingY + (i / 3) * graphHeight;
              const val = chartMode === 'cumulative' 
                ? minVal + (1 - i / 3) * valueRange 
                : (1 - i / 3) * maxVal;
              return (
                <g key={i} className="opacity-30">
                  <line 
                    x1={paddingX} 
                    y1={y} 
                    x2={svgWidth - paddingX} 
                    y2={y} 
                    stroke="currentColor" 
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                    className={isDark ? 'text-gray-700' : 'text-slate-300'}
                  />
                  <text 
                    x={paddingX - 10} 
                    y={y + 3} 
                    textAnchor="end" 
                    className="text-[8px] font-mono fill-current font-semibold"
                    style={{ fill: isDark ? '#666' : '#94A3B8' }}
                  >
                    {val.toFixed(chartMode === 'cumulative' ? 2 : 3)}g
                  </text>
                </g>
              );
            })}

            {/* Area under curve (For cumulative only) */}
            {chartMode === 'cumulative' && coords.length > 1 && (
              <path
                d={`
                  M ${coords[0].x} ${paddingY + graphHeight} 
                  ${coords.map(c => `L ${c.x} ${c.y}`).join(' ')} 
                  L ${coords[coords.length - 1].x} ${paddingY + graphHeight} 
                  Z
                `}
                fill="url(#goldAreaGradient)"
              />
            )}

            {/* Connecting curve path */}
            {coords.length > 1 && (
              <path
                d={coords.reduce((acc, c, i) => {
                  return i === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`;
                }, '')}
                fill="none"
                stroke="url(#goldCurveGradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}

            {/* interactive hover columns for easy touch and cursor clicks */}
            {coords.map((c, idx) => {
              const rectWidth = coords.length > 1 ? graphWidth / (coords.length - 1) : graphWidth;
              const hoverX = coords.length > 1 
                ? c.x - rectWidth / 2 
                : paddingX;
              return (
                <rect
                  key={`hover-${c.id}`}
                  x={hoverX}
                  y={paddingY}
                  width={rectWidth}
                  height={graphHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => setSelectedIndex(idx)}
                />
              );
            })}

            {/* Draw nodes with CUSTOM DIRECTIONAL ARROWS! */}
            {coords.map((c, idx) => {
              const isSelected = activeIndex === idx;
              const val = chartMode === 'cumulative' ? c.cumulative : c.grams;
              
              // Arrow indicator calculation: 
              // If cumulative, it consistently marches up. Let's draw an ascending diagonal arrow ↗.
              // If individual setoran, the size fluctuates. Let's compare vs average or previous.
              // Green gold upward arrow represents steps taken towards financial integrity.
              return (
                <g 
                  key={`node-${c.id}`} 
                  onClick={() => setSelectedIndex(idx)}
                  className="cursor-pointer group"
                >
                  {/* Outer Pulsing Aura (on Hover/Selected) */}
                  {(isSelected || activeIndex === idx) && (
                    <circle 
                      cx={c.x} 
                      cy={c.y} 
                      r="16" 
                      fill="url(#ringGlow)"
                      className="animate-pulse"
                    />
                  )}

                  {/* Node Connector Line to base */}
                  <line
                    x1={c.x}
                    y1={c.y}
                    x2={c.x}
                    y2={paddingY + graphHeight}
                    stroke="currentColor"
                    strokeWidth={isSelected ? "1" : "0.5"}
                    strokeDasharray="2 3"
                    className={`${isSelected ? 'text-[#D4AF37]/50' : 'text-gray-500/10'} group-hover:text-[#D4AF37]/30 transition-colors duration-300`}
                  />

                  {/* Core Circle */}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={isSelected ? "6" : "4.5"}
                    fill={isSelected ? "#FFF" : "#D4AF37"}
                    stroke="#D4AF37"
                    strokeWidth={isSelected ? "3" : "1"}
                    className="transition-all duration-300 shadow-md group-hover:scale-125"
                  />

                  {/* Floating Nominal Value (Gold grams and IDR equivalent) directly above the node */}
                  <g className="pointer-events-none select-none">
                    {/* Shimmering backdrop plate for the active node */}
                    {isSelected && (
                      <rect
                        x={c.x - 32}
                        y={c.y - 39}
                        width="64"
                        height="18"
                        rx="4"
                        fill={isDark ? "rgba(10, 10, 10, 0.95)" : "rgba(255, 255, 255, 0.95)"}
                        stroke="#D4AF37"
                        strokeWidth="1.2"
                        className="shadow-xl"
                      />
                    )}
                    
                    {/* Grams Label */}
                    <text
                      x={c.x}
                      y={isSelected ? c.y - 29 : c.y - 12}
                      textAnchor="middle"
                      className={`font-mono font-bold tracking-tight text-[8.5px] transition-all duration-300`}
                      style={{ 
                        fill: isSelected ? '#D4AF37' : (isDark ? '#E5E5E5' : '#1A1A1A') 
                      }}
                    >
                      {val.toFixed(4)}g
                    </text>

                    {/* IDR value shown for selected / active node directly below the grams */}
                    {isSelected && (
                      <text
                        x={c.x}
                        y={c.y - 23}
                        textAnchor="middle"
                        className="font-mono text-[6.5px] font-medium text-emerald-500 fill-current opacity-95 transition-all"
                      >
                        Rp{Math.round(val * currentPrice).toLocaleString('id-ID')}
                      </text>
                    )}
                  </g>

                  {/* Directional Arrow Overlay directly on top of nodes */}
                  <g transform={`translate(${c.x - 7.5}, ${isSelected ? c.y - 51 : c.y - 24})`} className="transition-all duration-300">
                    <path 
                      d="M2.5 12.5 L12.5 2.5 M4.5 2.5 L12.5 2.5 L12.5 10.5" 
                      stroke="#D4AF37" 
                      strokeWidth={isSelected ? "1.8" : "1"} 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      fill="none" 
                      className="transition-transform group-hover:-translate-y-0.5 duration-300"
                    />
                  </g>
                </g>
              );
            })}

            {/* X-Axis labels */}
            {coords.length > 0 && [coords[0], coords[Math.floor(coords.length / 2)], coords[coords.length - 1]].map((c, i) => {
              if (!c) return null;
              // Prevent duplicates if length is very small
              if (i === 1 && (coords.length <= 2)) return null;
              return (
                <text 
                  key={i} 
                  x={c.x} 
                  y={paddingY + graphHeight + 18} 
                  textAnchor="middle" 
                  className="text-[8px] font-mono fill-current font-medium"
                  style={{ fill: isDark ? '#555' : '#718096' }}
                >
                  {c.date}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* COCKPIT DETAILED TELEMETRY (Interactive Panel) */}
      <div className={`p-4 rounded-xl border ${t.border} ${isDark ? 'bg-[#0F0F0F]' : 'bg-slate-50'} flex flex-col gap-3 relative overflow-hidden transition-colors duration-500`}>
        <div className="absolute top-2 right-3 flex items-center gap-1 opacity-20">
          <Calendar className="w-3 h-3 text-[#D4AF37]" />
          <span className="text-[8px] font-mono tracking-widest">{activePoint.date}</span>
        </div>

        {/* TOP ROW: Quick Stats for Selected Transaction */}
        <div className="flex flex-wrap items-center gap-4 border-b border-dashed border-gray-500/10 pb-3">
          <div>
            <div className={`text-[8px] uppercase tracking-widest ${t.textFaint} mb-0.5 font-mono`}>
              {language === 'id' ? "Langkah Hemat" : "Savings Step"}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[#D4AF37] font-mono text-sm font-bold">+{activePoint.grams.toFixed(4)}g</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
            </div>
          </div>
          
          <div className="w-px h-6 bg-gray-500/10" />

          <div>
            <div className={`text-[8px] uppercase tracking-widest ${t.textFaint} mb-0.5 font-mono`}>
              {language === 'id' ? "Dana Terselamatkan" : "Capital Saved"}
            </div>
            <div className={`text-xs font-semibold ${t.textMain} font-mono`}>
              Rp {activePoint.amount.toLocaleString('id-ID')}
            </div>
          </div>

          <div className="w-px h-6 bg-gray-500/10" />

          {activePoint.habit && activePoint.habit !== 'Tanpa spesifikasi' && (
            <div>
              <div className={`text-[8px] uppercase tracking-widest ${t.textFaint} mb-0.5 font-mono`}>
                {language === 'id' ? "Kebiasaan Dikalahkan" : "Defeated Habit"}
              </div>
              <span className="inline-block px-2 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[8px] font-bold rounded uppercase tracking-wider text-[#D4AF37]">
                {activePoint.habit}
              </span>
            </div>
          )}
        </div>

        {/* DIALOG RESISTED DETAIL (NOTE) */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <MessageSquare className="w-2.5 h-2.5 text-[#D4AF37]" />
            <span className={`text-[8px] font-mono uppercase tracking-wider ${t.textMuted}`}>
              {language === 'id' ? "Catatan Jurnal Kamu" : "Your Journal Note"}
            </span>
          </div>
          <p className={`text-xs tracking-wide leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            "{activePoint.note}"
          </p>
        </div>

        {/* AI REFLECTION BUBBLE */}
        {activePoint.reflection && (
          <div className={`p-3 rounded-lg border flex gap-2.5 ${isDark ? 'bg-black/30 border-white/5' : 'bg-white border-slate-200'} transition-all`}>
            <Quote className="w-3 h-3 text-[#D4AF37] shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">
                {language === 'id' ? "Refleksi Makna (AI Wise Advice)" : "Wise Meaning Reflection (AI Advice)"}
              </span>
              <p className={`text-[11px] italic font-light leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {activePoint.reflection}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER MINI STATS BAR */}
      <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-dashed border-gray-500/10 relative z-10">
        <div>
          <span className={`block text-[7px] uppercase tracking-widest ${t.textVeryFaint}`}>
            {language === 'id' ? "Rata-rata Setor" : "Average Deposit"}
          </span>
          <span className={`text-xs font-mono font-medium ${t.textMain}`}>{averageGrams.toFixed(3)} gr</span>
        </div>
        <div>
          <span className={`block text-[7px] uppercase tracking-widest ${t.textVeryFaint}`}>
            {language === 'id' ? "Total Setor (IDR)" : "Total Deposited (IDR)"}
          </span>
          <span className={`text-xs font-mono font-medium text-emerald-500`}>Rp {totalInvestedIdr.toLocaleString('id-ID')}</span>
        </div>
        <div>
          <span className={`block text-[7px] uppercase tracking-widest ${t.textVeryFaint}`}>
            {language === 'id' ? "Kumulatif Logam" : "Cumulative Metal"}
          </span>
          <span className={`text-xs font-mono font-semibold text-[#D4AF37]`}>{totalInvestedGrams.toFixed(4)} gr</span>
        </div>
      </div>
    </div>
  );
}
