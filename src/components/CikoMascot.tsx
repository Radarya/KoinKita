import React from 'react';
import { motion } from 'motion/react';

interface CikoMascotProps {
  size?: number | string;
  className?: string;
  pose?: 'hero' | 'icon' | 'detective' | 'chef' | 'investor';
  animated?: boolean;
}

export default function CikoMascot({
  size = 120,
  className = '',
  pose = 'hero',
  animated = true
}: CikoMascotProps) {
  // If size is a number, format it as px for style, otherwise pass through string
  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: dimension, height: dimension }}
      animate={animated ? {
        y: [0, -6, 0],
      } : undefined}
      transition={animated ? {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      } : undefined}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
        aria-label="Ciko Mascot"
      >
        {/* Definition of Gradients & Filters */}
        <defs>
          {/* Subtle Coin Shine */}
          <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
          {/* Eye Gradient */}
          <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="40%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        {/* ── 1. JENGGER (RED CREST) ─────────────────────────────────── */}
        <g id="crest">
          {/* Back/Right crest puff */}
          <circle cx="120" cy="38" r="14" fill="#DC2626" />
          {/* Front/Center crest puff (taller) */}
          <circle cx="102" cy="30" r="18" fill="#EF4444" />
          {/* Left crest puff */}
          <circle cx="86" cy="40" r="13" fill="#DC2626" />
        </g>

        {/* ── 2. HEAD & BODY (ROUND CHUBBY CHICK) ─────────────────────── */}
        <g id="body">
          {/* Main head/body shape */}
          <ellipse cx="100" cy="104" rx="66" ry="62" fill="#FBBF24" />
          {/* Warm base tone */}
          <path
            d="M38 120 C38 152 66 166 100 166 C134 166 162 152 162 120 C162 100 156 80 148 70 C136 56 118 50 100 50 C82 50 64 56 52 70 C44 80 38 100 38 120 Z"
            fill="#F59E0B"
          />
          {/* Face highlight (bright sunny yellow) */}
          <ellipse cx="100" cy="98" rx="58" ry="48" fill="#FBBF24" />
          {/* Cheeks (subtle blush) */}
          <ellipse cx="58" cy="116" rx="10" ry="6" fill="#F59E0B" opacity="0.6" />
          <ellipse cx="142" cy="116" rx="10" ry="6" fill="#F59E0B" opacity="0.6" />
        </g>

        {/* ── 3. EYES (BIG SPARKLING ANIME/CARTOON GLINTS) ─────────────── */}
        <g id="eyes">
          {/* LEFT EYE */}
          <g transform="translate(68, 92)">
            {/* White outer contour */}
            <circle cx="0" cy="0" r="23" fill="#FFFFFF" />
            {/* Iris */}
            <circle cx="0" cy="0" r="20" fill="url(#eyeGrad)" />
            {/* Pupil core */}
            <circle cx="0" cy="2" r="14" fill="#0A0F1D" />
            {/* Big diamond/star shine */}
            <circle cx="-5" cy="-5" r="7.5" fill="#FFFFFF" />
            {/* Secondary small glint */}
            <circle cx="6" cy="6" r="3.5" fill="#FFFFFF" />
            {/* Tiny accent spark */}
            <circle cx="-6" cy="7" r="1.8" fill="#BAE6FD" />
          </g>

          {/* RIGHT EYE */}
          <g transform="translate(132, 92)">
            {/* White outer contour */}
            <circle cx="0" cy="0" r="23" fill="#FFFFFF" />
            {/* Iris */}
            <circle cx="0" cy="0" r="20" fill="url(#eyeGrad)" />
            {/* Pupil core */}
            <circle cx="0" cy="2" r="14" fill="#0A0F1D" />
            {/* Big diamond/star shine */}
            <circle cx="-5" cy="-5" r="7.5" fill="#FFFFFF" />
            {/* Secondary small glint */}
            <circle cx="6" cy="6" r="3.5" fill="#FFFFFF" />
            {/* Tiny accent spark */}
            <circle cx="-6" cy="7" r="1.8" fill="#BAE6FD" />
          </g>
        </g>

        {/* ── 4. BEAK (CUTE ORANGE TRIANGLE) ─────────────────────────── */}
        <g id="beak">
          {/* Base shadow */}
          <polygon points="84,106 116,106 100,126" fill="#EA580C" />
          {/* Upper beak */}
          <path
            d="M84 106 Q100 101 116 106 Q100 123 84 106 Z"
            fill="#F97316"
          />
          {/* Lower beak curve */}
          <path
            d="M87 107 Q100 126 113 107 Q100 115 87 107 Z"
            fill="#FB923C"
          />
          {/* Tiny nostrils */}
          <circle cx="96" cy="104" r="1" fill="#C2410C" />
          <circle cx="104" cy="104" r="1" fill="#C2410C" />
        </g>

        {/* ── 5. HOODIE (STREETWEAR EMERALD GREEN) ────────────────────── */}
        <g id="hoodie">
          {/* Hood collar fold behind neck */}
          <path
            d="M40 148 Q100 134 160 148 Q166 172 152 188 Q100 196 48 188 Q34 172 40 148 Z"
            fill="#059669"
          />
          {/* Main hoodie body */}
          <path
            d="M45 152 Q100 138 155 152 Q160 176 148 190 Q100 198 52 190 Q40 176 45 152 Z"
            fill="#10B981"
          />
          {/* Hood cowl rim wrapping under chin */}
          <path
            d="M52 144 Q100 156 148 144 Q152 158 136 166 Q100 174 64 166 Q48 158 52 144 Z"
            fill="#34D399"
          />
          <path
            d="M56 146 Q100 154 144 146 Q140 156 130 162 Q100 170 70 162 Q60 156 56 146 Z"
            fill="#10B981"
          />

          {/* Hoodie drawstrings */}
          <path d="M86 162 Q84 174 82 184" stroke="#047857" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M114 162 Q116 174 118 184" stroke="#047857" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* ── 6. DNA FINANSIAL: GOLD COIN MEDALLION ON DRAWSTRING ────── */}
          {/* Left coin medallion */}
          <g id="coin-medallion-left" transform="translate(82, 185)">
            <circle cx="0" cy="0" r="7" fill="#CA8A04" />
            <circle cx="0" cy="0" r="6" fill="url(#coinGrad)" />
            {/* Sprout leaf inside coin */}
            <path
              d="M-1.5 2 Q-1 -1 2 -2 Q1 1 -1.5 2 Z"
              fill="#059669"
            />
            <path
              d="M-0.5 0.5 Q-3 -1 -2 -3 Q0.5 -1.5 -0.5 0.5 Z"
              fill="#34D399"
            />
          </g>

          {/* Right coin medallion */}
          <g id="coin-medallion-right" transform="translate(118, 185)">
            <circle cx="0" cy="0" r="7" fill="#CA8A04" />
            <circle cx="0" cy="0" r="6" fill="url(#coinGrad)" />
            {/* Sprout leaf inside coin */}
            <path
              d="M-1.5 2 Q-1 -1 2 -2 Q1 1 -1.5 2 Z"
              fill="#059669"
            />
            <path
              d="M-0.5 0.5 Q-3 -1 -2 -3 Q0.5 -1.5 -0.5 0.5 Z"
              fill="#34D399"
            />
          </g>
        </g>

        {/* ── 7. POSE ACCESSORIES (IF NEEDED) ─────────────────────────── */}
        {pose === 'detective' && (
          <g id="detective-hat">
            <ellipse cx="100" cy="46" rx="46" ry="10" fill="#4B5563" />
            <path d="M70 46 C70 24 130 24 130 46 Z" fill="#374151" />
            <rect x="74" y="40" width="52" height="6" fill="#F59E0B" />
          </g>
        )}

        {pose === 'chef' && (
          <g id="chef-hat">
            <ellipse cx="100" cy="40" rx="36" ry="10" fill="#E5E7EB" />
            <path d="M72 40 Q60 20 80 14 Q100 8 120 14 Q140 20 128 40 Z" fill="#FFFFFF" />
            <rect x="74" y="34" width="52" height="6" fill="#D1D5DB" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}
