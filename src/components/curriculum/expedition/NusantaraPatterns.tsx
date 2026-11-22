import React from 'react';
import type { StageLandmarkKind } from './expeditionConfig';

/**
 * Subtle Flat-Vector Batik Kawung motif overlay (restricted to Area Banners & Landmark backdrops).
 */
export const KawungMotifLayer: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 0.08,
}) => (
  <svg
    className={`pointer-events-none select-none ${className}`}
    width="100%"
    height="100%"
    aria-hidden="true"
  >
    <defs>
      <pattern id="ciko-nusantara-kawung" width="44" height="44" patternUnits="userSpaceOnUse">
        <ellipse cx="22" cy="10" rx="5" ry="8.5" fill="currentColor" opacity={opacity} />
        <ellipse cx="22" cy="34" rx="5" ry="8.5" fill="currentColor" opacity={opacity} />
        <ellipse cx="10" cy="22" rx="8.5" ry="5" fill="currentColor" opacity={opacity} />
        <ellipse cx="34" cy="22" rx="8.5" ry="5" fill="currentColor" opacity={opacity} />
        <circle cx="22" cy="22" r="2.2" fill="currentColor" opacity={opacity * 1.4} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ciko-nusantara-kawung)" />
  </svg>
);

interface LandmarkSvgProps {
  kind: StageLandmarkKind;
  size?: number;
  className?: string;
}

/**
 * 100% Flat-Vector Geometric Indonesian Cultural, Educational & Economic Landmarks.
 * Zero gradients, zero blurry shadows, crisp at every DPI.
 */
export const LandmarkSvg: React.FC<LandmarkSvgProps> = ({
  kind,
  size = 80,
  className = '',
}) => {
  switch (kind) {
    case 'celengan_ayam':
      return (
        <svg width={size} height={size} viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
          <ellipse cx="48" cy="84" rx="30" ry="6" fill="#0D1117" opacity="0.1" />
          {/* Tail feathers */}
          <path d="M18 52 C10 38, 16 26, 28 32 C26 40, 26 48, 28 56 Z" fill="#059669" />
          <path d="M22 48 C18 36, 24 28, 32 36 Z" fill="#10B981" />
          {/* Rooster body */}
          <ellipse cx="48" cy="56" rx="26" ry="22" fill="#D97706" />
          <path d="M26 58 C34 46, 56 46, 68 58 C64 70, 52 76, 42 75 C32 74, 24 68, 26 58 Z" fill="#B45309" />
          {/* Wing decorative Nusantara petal */}
          <path d="M36 52 C46 46, 56 50, 56 60 C52 68, 40 68, 36 52 Z" fill="#059669" />
          <path d="M40 55 C46 51, 52 54, 51 60 C48 63, 42 63, 40 55 Z" fill="#FDE68A" />
          {/* Head & comb */}
          <circle cx="67" cy="37" r="12" fill="#F59E0B" />
          <circle cx="64" cy="22" r="5" fill="#DC2626" />
          <circle cx="70" cy="23" r="4.5" fill="#EF4444" />
          <circle cx="75" cy="26" r="4" fill="#DC2626" />
          {/* Eye & beak */}
          <circle cx="71" cy="35" r="2.6" fill="#0D1117" />
          <circle cx="72" cy="34.2" r="0.9" fill="#FFFFFF" />
          <polygon points="78,36 88,39 78,43" fill="#F97316" />
          {/* Coin slot + gold coin */}
          <rect x="42" y="34" width="14" height="4" rx="2" fill="#0D1117" />
          <circle cx="49" cy="25" r="9" fill="#EAB308" />
          <circle cx="49" cy="25" r="6" fill="#FEF08A" />
          {/* Feet */}
          <rect x="38" y="75" width="6" height="8" rx="2" fill="#B45309" />
          <rect x="52" y="75" width="6" height="8" rx="2" fill="#B45309" />
        </svg>
      );

    case 'timbangan_pasar':
      return (
        <svg width={size} height={size} viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
          <ellipse cx="48" cy="84" rx="32" ry="6" fill="#0D1117" opacity="0.1" />
          {/* Base pedestal */}
          <rect x="30" y="74" width="36" height="8" rx="4" fill="#B45309" />
          <rect x="45" y="24" width="6" height="52" rx="3" fill="#D4AF37" />
          <circle cx="48" cy="22" r="5" fill="#EAB308" />
          {/* Crossbar */}
          <rect x="18" y="26" width="60" height="5" rx="2.5" fill="#B45309" />
          {/* Left pan (coins/weights) */}
          <path d="M22 31 L14 54 L30 54 Z" stroke="#92400E" strokeWidth="2" fill="none" />
          <path d="M12 54 C12 63, 32 63, 32 54 Z" fill="#D4AF37" />
          <circle cx="22" cy="51" r="5" fill="#EAB308" />
          {/* Right pan (bakul produce) */}
          <path d="M74 31 L66 54 L82 54 Z" stroke="#92400E" strokeWidth="2" fill="none" />
          <path d="M64 54 C64 63, 84 63, 84 54 Z" fill="#059669" />
          <circle cx="71" cy="51" r="4" fill="#EF4444" />
          <circle cx="77" cy="51" r="4" fill="#10B981" />
        </svg>
      );

    case 'qris_meja':
      return (
        <svg width={size} height={size} viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
          <ellipse cx="48" cy="84" rx="30" ry="6" fill="#0D1117" opacity="0.1" />
          {/* Stand base */}
          <rect x="26" y="72" width="44" height="10" rx="4" fill="#065F46" />
          {/* Green QR standee */}
          <rect x="24" y="16" width="48" height="58" rx="10" fill="#059669" />
          <rect x="31" y="23" width="34" height="34" rx="6" fill="#FFFFFF" />
          {/* Crisp flat geometric QR blocks */}
          <rect x="35" y="27" width="10" height="10" rx="2" fill="#0D1117" />
          <rect x="38" y="30" width="4" height="4" fill="#FFFFFF" />
          <rect x="51" y="27" width="10" height="10" rx="2" fill="#0D1117" />
          <rect x="54" y="30" width="4" height="4" fill="#FFFFFF" />
          <rect x="35" y="43" width="10" height="10" rx="2" fill="#0D1117" />
          <rect x="38" y="46" width="4" height="4" fill="#FFFFFF" />
          <rect x="51" y="43" width="5" height="5" rx="1" fill="#0D1117" />
          <rect x="57" y="48" width="4" height="5" rx="1" fill="#059669" />
          {/* Gold accent card leaning front-right */}
          <rect x="52" y="54" width="30" height="20" rx="4" fill="#D4AF37" />
          <rect x="56" y="60" width="7" height="5" rx="1.5" fill="#FEF08A" />
        </svg>
      );

    case 'dompet_kartu':
    case 'buku_catatan':
      return (
        <svg width={size} height={size} viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
          <ellipse cx="48" cy="84" rx="28" ry="5.5" fill="#0D1117" opacity="0.1" />
          {/* Book / Ledger cover */}
          <rect x="22" y="16" width="48" height="64" rx="8" fill="#1D4ED8" />
          <rect x="22" y="16" width="12" height="64" rx="5" fill="#1E3A8A" />
          {/* White page tabs */}
          <rect x="40" y="26" width="22" height="10" rx="3" fill="#FFFFFF" />
          <rect x="40" y="44" width="22" height="4" rx="2" fill="#93C5FD" />
          <rect x="40" y="52" width="16" height="4" rx="2" fill="#93C5FD" />
          {/* Gold bookmark */}
          <polygon points="56,16 64,16 64,34 60,30 56,34" fill="#EAB308" />
          {/* Emerald coin badge */}
          <circle cx="68" cy="68" r="13" fill="#059669" />
          <path d="M62 68 L66 72 L74 63" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'kentongan_ronda':
      return (
        <svg width={size} height={size} viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
          <ellipse cx="48" cy="84" rx="30" ry="5.5" fill="#0D1117" opacity="0.1" />
          {/* Carved bamboo Kentongan body */}
          <rect x="24" y="22" width="24" height="58" rx="9" fill="#B45309" />
          <rect x="24" y="29" width="24" height="5" fill="#92400E" />
          <rect x="24" y="68" width="24" height="5" fill="#92400E" />
          {/* Vertical sound slit */}
          <rect x="33" y="38" width="6" height="24" rx="3" fill="#451A03" />
          {/* Hanging loop */}
          <circle cx="36" cy="17" r="5" stroke="#92400E" strokeWidth="3.5" fill="none" />
          {/* Security shield beside Kentongan */}
          <path d="M52 38 L78 44 L78 60 C78 72, 65 80, 65 80 C65 80, 52 72, 52 60 Z" fill="#059669" />
          <rect x="60" y="55" width="10" height="9" rx="2" fill="#EAB308" />
          <path d="M62 55 V51 C62 49, 68 49, 68 51 V55" stroke="#FEF08A" strokeWidth="2.5" fill="none" />
        </svg>
      );

    case 'kontrak_segel':
      return (
        <svg width={size} height={size} viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
          <ellipse cx="48" cy="84" rx="28" ry="5.5" fill="#0D1117" opacity="0.1" />
          <rect x="22" y="16" width="48" height="62" rx="8" fill="#FFFFFF" />
          <rect x="22" y="16" width="48" height="14" rx="8" fill="#1D4ED8" />
          <rect x="30" y="38" width="32" height="5" rx="2.5" fill="#CBD5E1" />
          <rect x="30" y="48" width="24" height="5" rx="2.5" fill="#CBD5E1" />
          <rect x="30" y="58" width="18" height="5" rx="2.5" fill="#CBD5E1" />
          {/* Official OJK / Seal Badge */}
          <circle cx="64" cy="66" r="14" fill="#D4AF37" />
          <circle cx="64" cy="66" r="9" fill="#FEF08A" />
          <path d="M60 66 L63 69 L69 63" stroke="#92400E" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'lumbung_padi':
    case 'payung_keluarga':
      return (
        <svg width={size} height={size} viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
          <ellipse cx="48" cy="84" rx="30" ry="5.5" fill="#0D1117" opacity="0.1" />
          {/* Stilts */}
          <rect x="28" y="64" width="6" height="18" rx="2" fill="#78350F" />
          <rect x="62" y="64" width="6" height="18" rx="2" fill="#78350F" />
          <rect x="24" y="62" width="48" height="6" rx="3" fill="#92400E" />
          {/* Woven bamboo wall */}
          <rect x="28" y="38" width="40" height="26" rx="4" fill="#FDE68A" />
          {/* Golden rice bundles inside window */}
          <rect x="40" y="44" width="16" height="14" rx="3" fill="#78350F" />
          <circle cx="48" cy="51" r="5" fill="#EAB308" />
          {/* Steep Nusantara thatched curved roof */}
          <path d="M16 42 L48 14 L80 42 C72 44, 62 43, 48 41 C34 43, 24 44, 16 42 Z" fill="#B45309" />
          <path d="M24 38 L48 18 L72 38 Z" fill="#D97706" />
          {/* Protective green umbrella emblem right */}
          <path d="M58 58 C58 46, 82 46, 82 58 Z" fill="#059669" />
          <rect x="69" y="58" width="2.5" height="16" fill="#064E3B" />
        </svg>
      );

    case 'emas_tunas':
    case 'kubah_syariah':
      return (
        <svg width={size} height={size} viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
          <ellipse cx="48" cy="84" rx="32" ry="6" fill="#0D1117" opacity="0.1" />
          {/* Gold bullion bars (flat geometric stacked) */}
          <polygon points="18,74 36,74 44,60 24,60" fill="#B45309" />
          <polygon points="18,74 36,74 32,64 20,64" fill="#EAB308" />
          <polygon points="34,74 54,74 60,60 40,60" fill="#D97706" />
          <polygon points="28,60 48,60 52,48 34,48" fill="#EAB308" />
          {/* Ceramic pot + sprouting wealth leaf */}
          <polygon points="56,56 78,56 74,78 60,78" fill="#E5E7EB" />
          <rect x="54" y="52" width="26" height="6" rx="3" fill="#CBD5E1" />
          <rect x="65.5" y="28" width="3.5" height="24" rx="1.5" fill="#059669" />
          <path d="M67 42 C56 42, 54 32, 66 32 Z" fill="#10B981" />
          <path d="M67 36 C78 36, 80 26, 68 26 Z" fill="#059669" />
          <circle cx="67" cy="22" r="7" fill="#EAB308" />
          <circle cx="67" cy="22" r="4" fill="#FEF08A" />
        </svg>
      );

    case 'rumah_umkm':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
          <ellipse cx="48" cy="84" rx="32" ry="6" fill="#0D1117" opacity="0.1" />
          {/* UMKM Storefront base */}
          <rect x="18" y="42" width="46" height="36" rx="5" fill="#FFFFFF" />
          <rect x="24" y="54" width="16" height="24" rx="3" fill="#D97706" />
          <rect x="44" y="54" width="14" height="14" rx="3" fill="#BAE6FD" />
          {/* Striped emerald awning */}
          <path d="M14 42 L20 26 L62 26 L68 42 Z" fill="#059669" />
          <rect x="24" y="26" width="8" height="16" fill="#FFFFFF" />
          <rect x="40" y="26" width="8" height="16" fill="#FFFFFF" />
          <rect x="56" y="26" width="6" height="16" fill="#FFFFFF" />
          {/* Gold House Key */}
          <circle cx="72" cy="58" r="10" fill="#EAB308" />
          <circle cx="72" cy="58" r="4" fill="#FFFFFF" />
          <rect x="69.5" y="66" width="5" height="16" rx="2" fill="#D97706" />
          <rect x="74" y="74" width="6" height="4" rx="1" fill="#D97706" />
        </svg>
      );
  }
};
