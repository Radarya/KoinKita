import React from 'react';
import { motion } from 'motion/react';

interface CikoMascotProps {
  size?: number | string;
  className?: string;
  pose?: 'hero' | 'icon' | 'detective' | 'chef';
  animated?: boolean;
}

export default function CikoMascot({
  size = 120,
  className = '',
  pose = 'hero',
  animated = true
}: CikoMascotProps) {
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
        className="w-full h-full"
        aria-label="Ciko Mascot"
      >
        <defs>
          {/* Subtle Coin Gradient */}
          <linearGradient id="cikoCoinShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
          {/* Eye Gradient: Deep warm navy to lively sky blue */}
          <linearGradient id="cikoEyeIris" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="70%" stopColor="#0369A1" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        {/* 1. JENGGER (Soft organic 3-lobe red crest) */}
        <g id="ciko-crest">
          <path
            d="M84 48 C80 34 92 24 100 24 C108 24 120 34 116 48 Z"
            fill="#EF4444"
          />
          <path
            d="M74 52 C70 40 80 32 88 34 C94 36 96 46 92 54 Z"
            fill="#DC2626"
          />
          <path
            d="M108 54 C104 46 106 36 112 34 C120 32 130 40 126 52 Z"
            fill="#DC2626"
          />
        </g>

        {/* 2. CHUBBY HEAD & BODY */}
        <g id="ciko-body">
          {/* Outer silhouette */}
          <path
            d="M44 114 C40 148 64 168 100 168 C136 168 160 148 156 114 C154 82 138 52 100 52 C62 52 46 82 44 114 Z"
            fill="#F59E0B"
          />
          {/* Inner face tone */}
          <path
            d="M48 112 C44 142 66 162 100 162 C134 162 156 142 152 112 C150 84 136 58 100 58 C64 58 50 84 48 112 Z"
            fill="#FBBF24"
          />

          {/* Soft blushing cheeks */}
          <ellipse cx="62" cy="118" rx="10" ry="6" fill="#F97316" opacity="0.35" />
          <ellipse cx="138" cy="118" rx="10" ry="6" fill="#F97316" opacity="0.35" />
        </g>

        {/* 3. WARM FRIENDLY EYES (With soft eyelids, not creepy staring) */}
        <g id="ciko-eyes">
          {/* Cute soft eyebrows */}
          <path
            d="M58 74 Q70 68 82 72"
            stroke="#D97706"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M118 72 Q130 68 142 74"
            stroke="#D97706"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* LEFT EYE */}
          <g transform="translate(72, 95)">
            {/* White base */}
            <ellipse cx="0" cy="0" rx="19" ry="21" fill="#FFFFFF" />
            {/* Iris */}
            <ellipse cx="1" cy="0" rx="16" ry="18" fill="url(#cikoEyeIris)" />
            {/* Pupil core */}
            <ellipse cx="1" cy="2" rx="11" ry="12" fill="#090D16" />
            {/* Large friendly highlight at top-left */}
            <circle cx="-4" cy="-5" r="6" fill="#FFFFFF" />
            {/* Secondary warm glint at bottom-right */}
            <circle cx="5" cy="5" r="2.8" fill="#FFFFFF" />
            {/* Upper eyelid contour (softens gaze into a warm smile) */}
            <path
              d="M-19 -4 Q0 -22 19 -4"
              stroke="#F59E0B"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* RIGHT EYE */}
          <g transform="translate(128, 95)">
            {/* White base */}
            <ellipse cx="0" cy="0" rx="19" ry="21" fill="#FFFFFF" />
            {/* Iris */}
            <ellipse cx="-1" cy="0" rx="16" ry="18" fill="url(#cikoEyeIris)" />
            {/* Pupil core */}
            <ellipse cx="-1" cy="2" rx="11" ry="12" fill="#090D16" />
            {/* Large friendly highlight at top-left */}
            <circle cx="-6" cy="-5" r="6" fill="#FFFFFF" />
            {/* Secondary warm glint at bottom-right */}
            <circle cx="3" cy="5" r="2.8" fill="#FFFFFF" />
            {/* Upper eyelid contour */}
            <path
              d="M-19 -4 Q0 -22 19 -4"
              stroke="#F59E0B"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>

        {/* 4. BEAK & SMILING MOUTH (Curved and smiling, no nostrils) */}
        <g id="ciko-beak">
          {/* Upper beak */}
          <path
            d="M86 106 Q100 102 114 106 Q100 122 86 106 Z"
            fill="#F97316"
          />
          {/* Beak highlight */}
          <path
            d="M89 106 Q100 103 111 106 Q100 115 89 106 Z"
            fill="#FB923C"
          />
          {/* Cute happy lower beak / smile */}
          <path
            d="M91 114 Q100 126 109 114"
            stroke="#EA580C"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* 5. COZY GREEN HOODIE */}
        <g id="ciko-hoodie">
          {/* Back fold of hoodie */}
          <path
            d="M44 146 Q100 132 156 146 Q164 174 150 190 Q100 198 50 190 Q36 174 44 146 Z"
            fill="#059669"
          />
          {/* Front hoodie body */}
          <path
            d="M48 150 Q100 136 152 150 Q158 174 146 190 Q100 198 54 190 Q42 174 48 150 Z"
            fill="#10B981"
          />
          {/* Pouch / Kangaroo pocket */}
          <path
            d="M66 170 Q100 166 134 170 Q130 186 100 188 Q70 186 66 170 Z"
            fill="#059669"
            opacity="0.5"
          />
          {/* Hoodie collar fold framing chin */}
          <path
            d="M56 144 Q100 156 144 144 Q148 158 134 166 Q100 174 66 166 Q52 158 56 144 Z"
            fill="#34D399"
          />
          <path
            d="M60 146 Q100 154 140 146 Q136 156 128 162 Q100 170 72 162 Q64 156 60 146 Z"
            fill="#10B981"
          />

          {/* Drawstrings */}
          <path d="M86 160 Q84 174 82 184" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M114 160 Q116 174 118 184" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* 6. DNA FINANSIAL: Gold coin medallion charms */}
          <g transform="translate(82, 185)">
            <circle cx="0" cy="0" r="6.5" fill="#CA8A04" />
            <circle cx="0" cy="0" r="5.5" fill="url(#cikoCoinShine)" />
            {/* Tiny sprout */}
            <path d="M-1 1.5 Q-0.5 -1 1.5 -1.5 Q0.8 0.8 -1 1.5 Z" fill="#059669" />
          </g>

          <g transform="translate(118, 185)">
            <circle cx="0" cy="0" r="6.5" fill="#CA8A04" />
            <circle cx="0" cy="0" r="5.5" fill="url(#cikoCoinShine)" />
            {/* Tiny sprout */}
            <path d="M-1 1.5 Q-0.5 -1 1.5 -1.5 Q0.8 0.8 -1 1.5 Z" fill="#059669" />
          </g>
        </g>

        {/* 7. DETECTIVE POSE ACCESSORY (IF NEEDED) */}
        {pose === 'detective' && (
          <g id="detective-hat">
            <ellipse cx="100" cy="46" rx="44" ry="9" fill="#4B5563" />
            <path d="M72 46 C72 26 128 26 128 46 Z" fill="#374151" />
            <rect x="76" y="41" width="48" height="5" fill="#F59E0B" />
          </g>
        )}

        {/* 8. CHEF POSE ACCESSORY (IF NEEDED) */}
        {pose === 'chef' && (
          <g id="chef-hat">
            <ellipse cx="100" cy="40" rx="34" ry="9" fill="#E5E7EB" />
            <path d="M74 40 Q62 22 80 16 Q100 10 120 16 Q138 22 126 40 Z" fill="#FFFFFF" />
            <rect x="76" y="35" width="48" height="5" fill="#D1D5DB" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}
