import React from 'react';
import CikoMascot from '../../CikoMascot';

export type CompanionPropContext = 'map' | 'detective' | 'book' | 'flag';

interface MascotCompanionProps {
  context: CompanionPropContext;
  size?: number;
  className?: string;
}

/**
 * Contextual CIKO companion shown ONLY on the active Pos / active challenge.
 * Attaches lightweight flat-vector props (map, magnifier, guidebook, or gold pennant)
 * so CIKO feels integrated with the activity rather than statically pasted repeatedly.
 */
export const MascotCompanion: React.FC<MascotCompanionProps> = ({
  context,
  size = 66,
  className = '',
}) => {
  const mascotPose =
    context === 'detective'
      ? 'detective'
      : context === 'flag'
      ? 'wealth'
      : context === 'book'
      ? 'scholar'
      : 'hero';

  return (
    <div className={`relative inline-flex items-end select-none ${className}`}>
      <CikoMascot size={size} pose={mascotPose} animated />

      {/* Contextual flat-vector hand prop */}
      <div className="-ml-3 mb-1 pointer-events-none shrink-0" aria-hidden="true">
        {context === 'map' && (
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <polygon points="3,7 11,4 21,8 29,5 29,25 21,28 11,24 3,27" fill="#FEF7E0" />
            <polygon points="11,4 21,8 21,28 11,24" fill="#FDE68A" />
            <path d="M7 18 C12 13, 18 20, 24 12" stroke="#059669" strokeWidth="2.5" strokeDasharray="3 2" strokeLinecap="round" />
            <circle cx="24" cy="12" r="2.5" fill="#DC2626" />
          </svg>
        )}

        {context === 'detective' && (
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <circle cx="13" cy="13" r="8" fill="#E0F2FE" stroke="#0D1117" strokeWidth="3" />
            <circle cx="11" cy="11" r="2.2" fill="#FFFFFF" />
            <line x1="19" y1="19" x2="27" y2="27" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" />
          </svg>
        )}

        {context === 'book' && (
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <rect x="6" y="5" width="20" height="22" rx="4" fill="#059669" />
            <rect x="6" y="5" width="5" height="22" rx="2" fill="#065F46" />
            <rect x="14" y="10" width="8" height="4" rx="1.5" fill="#FFFFFF" />
            <rect x="14" y="17" width="8" height="2.5" rx="1" fill="#A7F3D0" />
          </svg>
        )}

        {context === 'flag' && (
          <svg width="28" height="30" viewBox="0 0 32 34" fill="none">
            <rect x="7" y="4" width="3" height="26" rx="1.5" fill="#0D1117" />
            <polygon points="10,5 28,11 10,18" fill="#EAB308" />
            <circle cx="15" cy="11.5" r="2.2" fill="#FFFFFF" />
          </svg>
        )}
      </div>
    </div>
  );
};
