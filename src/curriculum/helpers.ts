import {
  CuanQuizQuestion,
  DetektifCase,
  ExamSubtestSpec,
  ExplanationCardSpec,
  FinWordleWordItem,
  KokiAnggaranCurriculumData,
  LessonConfig,
  PairMatchData,
  PerformanceAssessmentSpec,
  PohonAsetCurriculumData,
  RegulationMeta,
  SemesterExamSpec,
  StatementType,
  StorySimCurriculumData,
} from './types';

export const REG_SOURCES: Record<string, RegulationMeta> = {
  UU_MATA_UANG: {
    source: 'Bank Indonesia / UU Mata Uang',
    regulationRef: 'UU No. 7 Tahun 2011 tentang Mata Uang & PBI Pengelolaan Uang Rupiah',
    relevantArticle: 'Pasal 11–14; syarat penukaran uang rusak > 2/3 ukuran asli BI',
    sourceUrl: 'https://www.bi.go.id',
    verifiedDate: '2026-11',
    isDynamicRule: true,
    reviewRequiredBeforeRelease: true,
  },
  PPN_PBJT: {
    source: 'DJP / Kemenkeu & Pemda',
    regulationRef: 'UU HPP jo. PMK 131/2024 jo. PMK 11/2025 (PPN); UU HKPD 1/2022 (PBJT)',
    relevantArticle: 'Tarif 12% dengan DPP 11/12 (efektif 11% umum); Pasal 53–58 UU 1/2022',
    sourceUrl: 'https://jdih.kemenkeu.go.id',
    verifiedDate: '2026-11',
    isDynamicRule: true,
    reviewRequiredBeforeRelease: true,
  },
  BPOM_SNI: {
    source: 'BPOM, BSN & Kemendag',
    regulationRef: 'UU No. 8 Tahun 1999; Izin Edar BPOM & Daftar SNI Wajib Kemenperin/BSN',
    sourceUrl: 'https://cekbpom.pom.go.id',
    verifiedDate: '2026-11',
    isDynamicRule: true,
    reviewRequiredBeforeRelease: true,
  },
  PERBANKAN_SIMPEL: {
    source: 'OJK & Perbankan Indonesia',
    regulationRef: 'Program SimPel OJK / Ketentuan Produk Tabungan Bank Umum',
    sourceUrl: 'https://www.ojk.go.id',
    verifiedDate: '2026-11',
    isDynamicRule: true,
    reviewRequiredBeforeRelease: true,
  },
  TRANSFER_BI: {
    source: 'Bank Indonesia',
    regulationRef: 'Ketentuan BI-FAST (maks Rp250jt/tx sesuai limit bank), SKNBI (Rp1M), BI-RTGS (>Rp100jt)',
    sourceUrl: 'https://www.bi.go.id',
    verifiedDate: '2026-11',
    isDynamicRule: true,
    reviewRequiredBeforeRelease: true,
  },
  QRIS_LPS: {
    source: 'Bank Indonesia & LPS',
    regulationRef: 'Standar Nasional QRIS (MPM & CPM) BI; UU LPS (Penjaminan hanya simpanan bank)',
    sourceUrl: 'https://www.bi.go.id',
    verifiedDate: '2026-11',
    isDynamicRule: true,
    reviewRequiredBeforeRelease: true,
  },
  BPJS_TK: {
    source: 'Kemnaker & BPJS Ketenagakerjaan',
    regulationRef: 'Program JKK, JKM, JHT, JP & JKP BPJS Ketenagakerjaan',
    sourceUrl: 'https://www.bpjsketenagakerjaan.go.id',
    verifiedDate: '2026-11',
    isDynamicRule: true,
    reviewRequiredBeforeRelease: true,
  },
  SLIK_OJK: {
    source: 'OJK',
    regulationRef: 'POJK tentang Pelaporan dan Permintaan Informasi Debitur melalui SLIK OJK',
    sourceUrl: 'https://www.ojk.go.id',
    verifiedDate: '2026-11',
    isDynamicRule: true,
    reviewRequiredBeforeRelease: true,
  },
  IASC_OJK: {
    source: 'OJK / IASC & Satgas PASTI',
    regulationRef: 'Portal Indonesia Anti-Scam Centre (iasc.ojk.go.id) & Kontak OJK 157',
    sourceUrl: 'https://iasc.ojk.go.id',
    verifiedDate: '2026-11',
    isDynamicRule: true,
    reviewRequiredBeforeRelease: true,
  },
  LPBBTI_OJK: {
    source: 'OJK / Satgas PASTI',
    regulationRef: 'POJK No. 40 Tahun 2024 jo. SEOJK No. 19/SEOJK.06/2025 (LPBBTI)',
    relevantArticle: 'Izin CAMILAN, Kontak Darurat non-penagihan, batas manfaat ekonomi & rasio utang',
    sourceUrl: 'https://sipasti.ojk.go.id',
    verifiedDate: '2026-11',
    isDynamicRule: true,
    reviewRequiredBeforeRelease: true,
  },
  ASURANSI_BPJS: {
    source: 'BPJS & OJK Perasuransian',
    regulationRef: 'Program JKN BPJS Kesehatan, BPJS TK, & Ketentuan Polis/Unit Link OJK',
    sourceUrl: 'https://www.ojk.go.id',
    verifiedDate: '2026-11',
    isDynamicRule: true,
    reviewRequiredBeforeRelease: true,
  },
  LPS_3T: {
    source: 'Lembaga Penjamin Simpanan (LPS) & OJK',
    regulationRef: 'UU No. 24 Tahun 2004 jo. UU No. 4 Tahun 2023 (P2SK): Penjaminan Maks Rp2 Miliar (3T)',
    relevantArticle: 'Perhitungan cashback bernilai uang ke TBP; aturan imbalan tersendiri untuk bank syariah',
    sourceUrl: 'https://www.lps.go.id',
    verifiedDate: '2026-11',
    isDynamicRule: true,
    reviewRequiredBeforeRelease: true,
  },
  DEPOSITO_EMAS: {
    source: 'OJK / DJP Kemenkeu / Bappebti',
    regulationRef: 'PP No. 131 Tahun 2000 jo. PP 123/2015 (PPh Final 20% & batas Rp7,5jt); Perdagangan Emas Berizin',
    sourceUrl: 'https://www.pajak.go.id',
    verifiedDate: '2026-11',
    isDynamicRule: true,
    reviewRequiredBeforeRelease: true,
  },
  SBN_RITEL: {
    source: 'DJPPR Kementerian Keuangan & DJP',
    regulationRef: 'PP No. 91 Tahun 2021 (PPh Final Kupon SBN 10%); Seri ORI, SBR, SR, ST',
    sourceUrl: 'https://www.kemenkeu.go.id/sbn',
    verifiedDate: '2026-11',
    isDynamicRule: true,
    reviewRequiredBeforeRelease: true,
  },
  REKSADANA_PAJAK: {
    source: 'OJK & DJP',
    regulationRef: 'UU Pasar Modal; UU PPh Ps 4(3)(i): Pencairan Reksadana Bukan Objek Pajak, Wajib Lapor SPT',
    sourceUrl: 'https://www.pajak.go.id',
    verifiedDate: '2026-11',
    isDynamicRule: true,
    reviewRequiredBeforeRelease: true,
  },
  SAHAM_BEI: {
    source: 'OJK / BEI / KSEI',
    regulationRef: 'Satuan Perdagangan BEI (1 Lot = 100 Lembar) & PPh Final Penjualan Saham Bursa 0,1%',
    sourceUrl: 'https://www.idx.co.id',
    verifiedDate: '2026-11',
    isDynamicRule: true,
    reviewRequiredBeforeRelease: true,
  },
  SYARIAH_OJK: {
    source: 'OJK & DSN-MUI',
    regulationRef: 'POJK No. 8 Tahun 2025 (Daftar Efek Syariah, menggantikan POJK 35/2017) & Fatwa DSN-MUI',
    relevantArticle: 'Transisi bertahap 10 tahun utang berbunga <=45% ke <=33%; non-halal <=5%',
    sourceUrl: 'https://www.ojk.go.id',
    verifiedDate: '2026-11',
    isDynamicRule: true,
    reviewRequiredBeforeRelease: true,
  },
  BI_RATE: {
    source: 'Bank Indonesia',
    regulationRef: 'Suku Bunga Kebijakan BI-Rate (penamaan standar sejak 21 Des 2023), Inflasi & Kurs',
    sourceUrl: 'https://www.bi.go.id',
    verifiedDate: '2026-11',
    isDynamicRule: true,
    reviewRequiredBeforeRelease: true,
  },
  PAJAK_UMKM: {
    source: 'DJP / Kementerian Keuangan RI',
    regulationRef: 'UU HPP; PP 58/2023 jo. PMK 168/2023 (PPh 21 TER); PP 55/2022 jo. PP 20/2026 (PPh Final 0,5%)',
    relevantArticle: 'WPOP & Perseroan Perorangan bebas batas tahun; Koperasi maks 4 Tahun Pajak; CV/PT biasa baru & pekerjaan bebas keluar',
    sourceUrl: 'https://www.pajak.go.id',
    verifiedDate: '2026-11',
    effectiveFrom: '2026-04-22',
    isDynamicRule: true,
    reviewRequiredBeforeRelease: true,
  },
};

export function card(params: {
  ok?: string;
  bad?: string;
  why: string;
  calc?: string;
  assume?: string;
  next: string;
  type?: StatementType;
  reg?: RegulationMeta;
}): ExplanationCardSpec {
  return {
    statusCorrectId: params.ok,
    statusWrongId: params.bad,
    coreMechanismId: params.why,
    calculationOrEvidenceId: params.calc,
    assumptionsAndConditionsId: params.assume,
    healthyDecisionImplicationId: params.next,
    statementType: params.type || 'fixed_fact',
    regulationMeta: params.reg,
  };
}

export function mkQuizLesson(
  pathId: string,
  titleId: string,
  titleEn: string,
  objectiveId: string,
  questions: CuanQuizQuestion[],
  opts?: { st?: StatementType; reg?: RegulationMeta; xp?: number; coin?: number; isBoss?: boolean }
): LessonConfig {
  const [semesterId, u, st] = pathId.split('.');
  return {
    pathId,
    stageId: `${semesterId}.${u}.${st}`,
    unitId: `${semesterId}.${u}`,
    semesterId,
    mechanic: 'CuanQuiz',
    titleId,
    titleEn,
    objectiveId,
    objectiveEn: titleEn,
    untimed: true,
    isBoss: opts?.isBoss,
    statementType: opts?.st || 'fixed_fact',
    regulationMeta: opts?.reg,
    xpReward: opts?.xp || (opts?.isBoss ? 50 : 30),
    coinReward: opts?.coin || (opts?.isBoss ? 35 : 20),
    activity: { mechanic: 'CuanQuiz', questions },
  };
}

export function mkWordleLesson(
  pathId: string,
  titleId: string,
  titleEn: string,
  objectiveId: string,
  words: FinWordleWordItem[],
  opts?: { st?: StatementType; reg?: RegulationMeta }
): LessonConfig {
  const [semesterId, u, st] = pathId.split('.');
  return {
    pathId,
    stageId: `${semesterId}.${u}.${st}`,
    unitId: `${semesterId}.${u}`,
    semesterId,
    mechanic: 'FinWordle',
    titleId,
    titleEn,
    objectiveId,
    objectiveEn: titleEn,
    untimed: true,
    minWordLength: 3,
    maxWordLength: 9,
    statementType: opts?.st || 'fixed_fact',
    regulationMeta: opts?.reg,
    xpReward: 25,
    coinReward: 20,
    activity: { mechanic: 'FinWordle', words },
  };
}

export function mkPairLesson(
  pathId: string,
  titleId: string,
  titleEn: string,
  objectiveId: string,
  data: PairMatchData,
  opts?: { st?: StatementType; reg?: RegulationMeta; isBoss?: boolean }
): LessonConfig {
  const [semesterId, u, st] = pathId.split('.');
  return {
    pathId,
    stageId: `${semesterId}.${u}.${st}`,
    unitId: `${semesterId}.${u}`,
    semesterId,
    mechanic: 'PairMatch',
    titleId,
    titleEn,
    objectiveId,
    objectiveEn: titleEn,
    untimed: true,
    isBoss: opts?.isBoss,
    statementType: opts?.st || 'fixed_fact',
    regulationMeta: opts?.reg,
    xpReward: opts?.isBoss ? 50 : 30,
    coinReward: opts?.isBoss ? 35 : 20,
    activity: { mechanic: 'PairMatch', data },
  };
}

export function mkKokiLesson(
  pathId: string,
  titleId: string,
  titleEn: string,
  objectiveId: string,
  data: KokiAnggaranCurriculumData,
  opts?: { st?: StatementType; reg?: RegulationMeta; isBoss?: boolean }
): LessonConfig {
  const [semesterId, u, st] = pathId.split('.');
  return {
    pathId,
    stageId: `${semesterId}.${u}.${st}`,
    unitId: `${semesterId}.${u}`,
    semesterId,
    mechanic: 'KokiAnggaran',
    titleId,
    titleEn,
    objectiveId,
    objectiveEn: titleEn,
    untimed: true,
    isBoss: opts?.isBoss,
    statementType: opts?.st || 'simulation_assumption',
    regulationMeta: opts?.reg,
    xpReward: opts?.isBoss ? 50 : 30,
    coinReward: opts?.isBoss ? 35 : 20,
    activity: { mechanic: 'KokiAnggaran', data },
  };
}

export function mkDetektifLesson(
  pathId: string,
  titleId: string,
  titleEn: string,
  objectiveId: string,
  cases: DetektifCase[],
  opts?: { st?: StatementType; reg?: RegulationMeta; isBoss?: boolean }
): LessonConfig {
  const [semesterId, u, st] = pathId.split('.');
  return {
    pathId,
    stageId: `${semesterId}.${u}.${st}`,
    unitId: `${semesterId}.${u}`,
    semesterId,
    mechanic: 'DetektifCuan',
    titleId,
    titleEn,
    objectiveId,
    objectiveEn: titleEn,
    untimed: true,
    isBoss: opts?.isBoss,
    statementType: opts?.st || 'dynamic_fact',
    regulationMeta: opts?.reg,
    xpReward: opts?.isBoss ? 50 : 35,
    coinReward: opts?.isBoss ? 35 : 25,
    activity: { mechanic: 'DetektifCuan', cases },
  };
}

export function mkPohonLesson(
  pathId: string,
  titleId: string,
  titleEn: string,
  objectiveId: string,
  data: PohonAsetCurriculumData,
  opts?: { st?: StatementType; reg?: RegulationMeta }
): LessonConfig {
  const [semesterId, u, st] = pathId.split('.');
  return {
    pathId,
    stageId: `${semesterId}.${u}.${st}`,
    unitId: `${semesterId}.${u}`,
    semesterId,
    mechanic: 'PohonAset',
    titleId,
    titleEn,
    objectiveId,
    objectiveEn: titleEn,
    untimed: true,
    isBoss: true,
    simMonths: 12,
    statementType: opts?.st || 'simulation_assumption',
    regulationMeta: opts?.reg,
    xpReward: 50,
    coinReward: 35,
    activity: { mechanic: 'PohonAset', data },
  };
}

export function mkStoryLesson(
  pathId: string,
  titleId: string,
  titleEn: string,
  objectiveId: string,
  data: StorySimCurriculumData,
  opts?: { st?: StatementType; reg?: RegulationMeta; simMonths?: number }
): LessonConfig {
  const [semesterId, u, st] = pathId.split('.');
  return {
    pathId,
    stageId: `${semesterId}.${u}.${st}`,
    unitId: `${semesterId}.${u}`,
    semesterId,
    mechanic: 'StorySim',
    titleId,
    titleEn,
    objectiveId,
    objectiveEn: titleEn,
    untimed: true,
    isBoss: true,
    simMonths: opts?.simMonths || data.chapters.length,
    statementType: opts?.st || 'simulation_assumption',
    regulationMeta: opts?.reg,
    xpReward: 55,
    coinReward: 40,
    activity: { mechanic: 'StorySim', data },
  };
}

export function buildUTS(
  semesterId: string,
  titleId: string,
  coversUnitRange: string,
  sourceUnitIds: string[]
): SemesterExamSpec {
  const subtests: [ExamSubtestSpec, ExamSubtestSpec, ExamSubtestSpec, ExamSubtestSpec] = [
    {
      subtestId: 'LF',
      titleId: 'Literasi Finansial',
      titleEn: 'Financial Literacy',
      durationSec: 60,
      questionCount: 3,
      minSubtestPercent: 60,
      minVariantPoolPerSlot: 3,
      mechanics: ['CuanQuiz', 'FinWordle'],
      sourceUnitIds,
    },
    {
      subtestId: 'PK',
      titleId: 'Pengetahuan Kuantitatif / Hitung Cuan',
      titleEn: 'Quantitative Finance',
      durationSec: 90,
      questionCount: 3,
      minSubtestPercent: 60,
      minVariantPoolPerSlot: 3,
      mechanics: ['CuanQuiz'],
      sourceUnitIds,
    },
    {
      subtestId: 'PF',
      titleId: 'Penalaran & Strategi Finansial',
      titleEn: 'Financial Reasoning',
      durationSec: 90,
      questionCount: 2,
      minSubtestPercent: 50, // P0.2: 50% for 2 dichotomous items
      minVariantPoolPerSlot: 3,
      mechanics: ['PairMatch', 'KokiAnggaran', 'CuanQuiz'],
      sourceUnitIds,
    },
    {
      subtestId: 'PD',
      titleId: 'Pengamatan & Deteksi Risiko',
      titleEn: 'Risk Detection',
      durationSec: 60,
      questionCount: 2,
      minSubtestPercent: 50, // P0.2: 50% for 2 dichotomous items
      minVariantPoolPerSlot: 3,
      mechanics: ['DetektifCuan', 'CuanQuiz'],
      sourceUnitIds,
    },
  ];
  return {
    examId: `${semesterId}.UTS`,
    semesterId,
    type: 'UTS',
    titleId,
    coversUnitRange,
    passTotalPercent: 80,
    calibrationStatus: 'baseline_v1',
    remedialCooldownMs: 86_400_000,
    requiredRemedialPaths: 3,
    subtests,
  };
}

export function buildUAS(
  semesterId: string,
  titleId: string,
  coversUnitRange: string,
  sourceUnitIds: string[],
  projectTitle: string,
  durationMonths: number,
  storySimData: StorySimCurriculumData,
  requirePositiveNetWorthAtEnd = false
): SemesterExamSpec {
  const subtests: [ExamSubtestSpec, ExamSubtestSpec, ExamSubtestSpec, ExamSubtestSpec] = [
    {
      subtestId: 'LF',
      titleId: 'Literasi Finansial',
      titleEn: 'Financial Literacy',
      durationSec: 60,
      questionCount: 3,
      minSubtestPercent: 60,
      minVariantPoolPerSlot: 3,
      mechanics: ['CuanQuiz', 'FinWordle'],
      sourceUnitIds,
    },
    {
      subtestId: 'PK',
      titleId: 'Pengetahuan Kuantitatif / Hitung Cuan',
      titleEn: 'Quantitative Finance',
      durationSec: 90,
      questionCount: 3,
      minSubtestPercent: 60,
      minVariantPoolPerSlot: 3,
      mechanics: ['CuanQuiz'],
      sourceUnitIds,
    },
    {
      subtestId: 'PF',
      titleId: 'Penalaran & Strategi Finansial',
      titleEn: 'Financial Reasoning',
      durationSec: 90,
      questionCount: 3,
      minSubtestPercent: 60,
      minVariantPoolPerSlot: 3,
      mechanics: ['CuanQuiz', 'PairMatch'],
      sourceUnitIds,
    },
    {
      subtestId: 'PD',
      titleId: 'Pengamatan & Deteksi Risiko',
      titleEn: 'Risk Detection',
      durationSec: 60,
      questionCount: 3,
      minSubtestPercent: 60,
      minVariantPoolPerSlot: 3,
      mechanics: ['DetektifCuan', 'CuanQuiz'],
      sourceUnitIds,
    },
  ];
  const performancePart: PerformanceAssessmentSpec = {
    simId: `${semesterId}.UAS.SIM`,
    titleId: projectTitle,
    durationMonths,
    passMinScore: 75,
    failOnCashflowInsolvency: true,
    requirePositiveNetWorthAtEnd,
    dimensions: [
      { key: 'cashflowStability', labelId: 'Stabilitas Arus Kas & Tabungan', weight: 0.3, minScoreToAvoidRemedialFocus: 70 },
      { key: 'riskLiquidity', labelId: 'Ketahanan Risiko & Likuiditas', weight: 0.3, minScoreToAvoidRemedialFocus: 70 },
      { key: 'debtScamImmunity', labelId: 'Keamanan Digital & Pengelolaan Utang', weight: 0.2, minScoreToAvoidRemedialFocus: 70 },
      { key: 'goalPreservation', labelId: 'Kesesuaian Tujuan Finansial', weight: 0.2, minScoreToAvoidRemedialFocus: 70 },
    ],
    storySimData,
  };
  return {
    examId: `${semesterId}.UAS`,
    semesterId,
    type: 'UAS',
    titleId,
    coversUnitRange,
    passTotalPercent: 80,
    passPart1MinPercent: 75,
    calibrationStatus: 'baseline_v1',
    remedialCooldownMs: 86_400_000,
    requiredRemedialPaths: 3,
    subtests,
    performancePart,
  };
}
