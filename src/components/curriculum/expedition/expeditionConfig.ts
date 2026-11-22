export type AreaLandmarkKind =
  | 'celengan_ayam'
  | 'qris_meja'
  | 'kentongan_ronda'
  | 'lumbung_padi'
  | 'emas_tunas'
  | 'rumah_umkm';

export type StageLandmarkKind =
  | AreaLandmarkKind
  | 'timbangan_pasar'
  | 'buku_catatan'
  | 'dompet_kartu'
  | 'kontrak_segel'
  | 'payung_keluarga'
  | 'kubah_syariah';

export type BossMotifKind = 'trade' | 'scale' | 'shield' | 'home_tree';

export interface AreaThemeSpec {
  semesterId: string;
  areaNumber: string;
  nameId: string;
  subtitleId: string;
  accentBg: string;
  softSurface: string;
  inkDark: string;
  landmark: AreaLandmarkKind;
}

export const AREA_THEMES: Record<string, AreaThemeSpec> = {
  S1: {
    semesterId: 'S1',
    areaNumber: '01',
    nameId: 'Kampung Transaksi',
    subtitleId: 'Uang, keaslian Rupiah & belanja cerdas',
    accentBg: '#059669',
    softSurface: '#EEFBF4',
    inkDark: '#064E3B',
    landmark: 'celengan_ayam',
  },
  S2: {
    semesterId: 'S2',
    areaNumber: '02',
    nameId: 'Kota Perdagangan',
    subtitleId: 'Bank, QRIS, karier & anggaran harian',
    accentBg: '#0D9488',
    softSurface: '#F0FDFA',
    inkDark: '#134E4A',
    landmark: 'qris_meja',
  },
  S3: {
    semesterId: 'S3',
    areaNumber: '03',
    nameId: 'Benteng Keamanan Finansial',
    subtitleId: 'Utang sehat, SLIK OJK & antipenipuan',
    accentBg: '#1D4ED8',
    softSurface: '#EFF6FF',
    inkDark: '#1E3A8A',
    landmark: 'kentongan_ronda',
  },
  S4: {
    semesterId: 'S4',
    areaNumber: '04',
    nameId: 'Lumbung Ketahanan',
    subtitleId: 'Dana darurat, BPJS, asuransi & inflasi',
    accentBg: '#B45309',
    softSurface: '#FEF7E0',
    inkDark: '#78350F',
    landmark: 'lumbung_padi',
  },
  S5: {
    semesterId: 'S5',
    areaNumber: '05',
    nameId: 'Pusat Investasi Nusantara',
    subtitleId: 'LPS 3T, Emas, SBN Ritel, Reksadana & Syariah',
    accentBg: '#047857',
    softSurface: '#ECFDF5',
    inkDark: '#064E3B',
    landmark: 'emas_tunas',
  },
  S6: {
    semesterId: 'S6',
    areaNumber: '06',
    nameId: 'Kota Kemandirian Ekonomi',
    subtitleId: 'BI-Rate, Pajak UMKM PP 20/2026 & KPR',
    accentBg: '#0F766E',
    softSurface: '#F0FDFA',
    inkDark: '#115E59',
    landmark: 'rumah_umkm',
  },
};

export function getStageLandmarkKind(unitNumber: number, stageIdx: number): StageLandmarkKind {
  if (unitNumber === 1) return stageIdx === 0 ? 'timbangan_pasar' : 'celengan_ayam';
  if (unitNumber === 2) return 'celengan_ayam';
  if (unitNumber <= 5) return stageIdx % 2 === 0 ? 'timbangan_pasar' : 'buku_catatan';
  if (unitNumber === 6 || unitNumber === 8) return 'qris_meja';
  if (unitNumber <= 11) return stageIdx % 2 === 0 ? 'dompet_kartu' : 'buku_catatan';
  if (unitNumber <= 16) return stageIdx % 2 === 0 ? 'kentongan_ronda' : 'kontrak_segel';
  if (unitNumber <= 20) return stageIdx % 2 === 0 ? 'lumbung_padi' : 'payung_keluarga';
  if (unitNumber === 26) return 'kubah_syariah';
  if (unitNumber <= 26) return 'emas_tunas';
  if (unitNumber === 31) return 'rumah_umkm';
  return stageIdx % 2 === 0 ? 'rumah_umkm' : 'buku_catatan';
}

export function getBossMotifForUnit(unitNumber: number): BossMotifKind {
  if (unitNumber <= 2 || (unitNumber >= 6 && unitNumber <= 10)) return 'trade';
  if (unitNumber >= 12 && unitNumber <= 16) return 'shield';
  if (unitNumber <= 5 || (unitNumber >= 17 && unitNumber <= 20)) return 'scale';
  return 'home_tree';
}
