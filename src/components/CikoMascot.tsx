import React from 'react';
import { motion } from 'motion/react';

interface CikoMascotProps {
  size?: number | string;
  className?: string;
  pose?: 'hero' | 'icon' | 'detective' | 'chef';
  animated?: boolean;
}

export function CikoMascot({
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
        {/* 1. JENGGER (Red 3-puff crest on head) */}
        <g id="crest">
          <circle cx="118" cy="38" r="14" fill="#DC2626" />
          <circle cx="100" cy="30" r="17" fill="#EF4444" />
          <circle cx="84" cy="39" r="13" fill="#DC2626" />
        </g>

        {/* 2. CHUBBY ROUND HEAD (Wider, cute chibi proportions like reference) */}
        <g id="body">
          {/* Shadow/base tone */}
          <ellipse cx="100" cy="102" rx="68" ry="60" fill="#F59E0B" />
          {/* Bright sunny face */}
          <ellipse cx="100" cy="100" rx="66" ry="58" fill="#FBBF24" />

          {/* Soft, blushing pink-orange cheeks */}
          <circle cx="56" cy="115" r="9" fill="#FB923C" opacity="0.45" />
          <circle cx="144" cy="115" r="9" fill="#FB923C" opacity="0.45" />
        </g>

        {/* 3. BIG SPARKLING ANIME EYES (Directly from user's reference image) */}
        <g id="eyes">
          {/* LEFT EYE */}
          <g transform="translate(70, 92)">
            {/* White outer sclera */}
            <circle cx="0" cy="0" r="23" fill="#FFFFFF" />
            {/* Vibrant blue iris (pure flat color) */}
            <circle cx="1" cy="0" r="20" fill="#0284C7" />
            {/* Pupil core (slightly focused inward toward center) */}
            <circle cx="2" cy="1" r="14" fill="#0A0F1D" />
            {/* Big starry diamond highlight (top-left) */}
            <circle cx="-4" cy="-4" r="7" fill="#FFFFFF" />
            {/* Diamond twinkle (sparkle star at bottom-right) */}
            <g transform="translate(6, 6)">
              <polygon points="0,-4 1.2,-1.2 4,0 1.2,1.2 0,4 -1.2,1.2 -4,0 -1.2,-1.2" fill="#FFFFFF" />
            </g>
            {/* Tiny accent spark */}
            <circle cx="-5.5" cy="7" r="1.8" fill="#BAE6FD" />
          </g>

          {/* RIGHT EYE */}
          <g transform="translate(130, 92)">
            {/* White outer sclera */}
            <circle cx="0" cy="0" r="23" fill="#FFFFFF" />
            {/* Vibrant blue iris (pure flat color) */}
            <circle cx="-1" cy="0" r="20" fill="#0284C7" />
            {/* Pupil core (slightly focused inward toward center) */}
            <circle cx="-2" cy="1" r="14" fill="#0A0F1D" />
            {/* Big starry diamond highlight (top-left) */}
            <circle cx="-4" cy="-4" r="7" fill="#FFFFFF" />
            {/* Diamond twinkle (sparkle star at bottom-right) */}
            <g transform="translate(6, 6)">
              <polygon points="0,-4 1.2,-1.2 4,0 1.2,1.2 0,4 -1.2,1.2 -4,0 -1.2,-1.2" fill="#FFFFFF" />
            </g>
            {/* Tiny accent spark */}
            <circle cx="-5.5" cy="7" r="1.8" fill="#BAE6FD" />
          </g>
        </g>

        {/* 4. CUTE ROUNDED BEAK (Tucked snugly between lower inner eyes) */}
        <g id="beak">
          {/* Soft rounded diamond beak */}
          <path
            d="M86 102 Q100 96 114 102 Q100 123 86 102 Z"
            fill="#F97316"
          />
          {/* Subtle highlight on upper beak */}
          <path
            d="M89 102 Q100 98 111 102 Q100 114 89 102 Z"
            fill="#FB923C"
          />
        </g>

        {/* 5. COZY GREEN HOODIE (Thick round collar wrapping snugly under chin) */}
        <g id="hoodie">
          {/* Base hoodie fold */}
          <path
            d="M40 144 Q100 130 160 144 Q166 172 152 188 Q100 196 48 188 Q34 172 40 144 Z"
            fill="#059669"
          />
          {/* Main hoodie body */}
          <path
            d="M45 148 Q100 134 155 148 Q160 176 148 190 Q100 198 52 190 Q40 176 45 148 Z"
            fill="#10B981"
          />
          {/* Fluffy collar rim hugging the chin */}
          <path
            d="M52 140 Q100 152 148 140 Q152 154 136 162 Q100 170 64 162 Q48 154 52 140 Z"
            fill="#34D399"
          />
          <path
            d="M56 142 Q100 150 144 142 Q140 152 130 158 Q100 166 70 158 Q60 152 56 142 Z"
            fill="#10B981"
          />

          {/* Hoodie drawstrings */}
          <path d="M85 158 Q83 172 81 183" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M115 158 Q117 172 119 183" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* 6. DNA FINANSIAL: Gold coin medallion charms */}
          <g transform="translate(81, 184)">
            <circle cx="0" cy="0" r="6.5" fill="#CA8A04" />
            <circle cx="0" cy="0" r="5.5" fill="#EAB308" />
            <path d="M-1 1.5 Q-0.5 -1 1.5 -1.5 Q0.8 0.8 -1 1.5 Z" fill="#059669" />
          </g>

          <g transform="translate(119, 184)">
            <circle cx="0" cy="0" r="6.5" fill="#CA8A04" />
            <circle cx="0" cy="0" r="5.5" fill="#EAB308" />
            <path d="M-1 1.5 Q-0.5 -1 1.5 -1.5 Q0.8 0.8 -1 1.5 Z" fill="#059669" />
          </g>
        </g>

        {/* 7. DETECTIVE POSE ACCESSORY (IF NEEDED) */}
        {pose === 'detective' && (
          <g id="detective-hat">
            <ellipse cx="100" cy="44" rx="44" ry="9" fill="#4B5563" />
            <path d="M72 44 C72 24 128 24 128 44 Z" fill="#374151" />
            <rect x="76" y="39" width="48" height="5" fill="#F59E0B" />
          </g>
        )}

        {/* 8. CHEF POSE ACCESSORY (IF NEEDED) */}
        {pose === 'chef' && (
          <g id="chef-hat">
            <ellipse cx="100" cy="38" rx="34" ry="9" fill="#E5E7EB" />
            <path d="M74 38 Q62 20 80 14 Q100 8 120 14 Q138 20 126 38 Z" fill="#FFFFFF" />
            <rect x="76" y="33" width="48" height="5" fill="#D1D5DB" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}

export default CikoMascot;
