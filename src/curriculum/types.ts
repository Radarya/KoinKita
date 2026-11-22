export type MechanicType =
  | 'FinWordle'
  | 'KokiAnggaran'
  | 'DetektifCuan'
  | 'PohonAset'
  | 'CuanQuiz'
  | 'PairMatch'
  | 'StorySim';

export type ExamSubtestId = 'LF' | 'PK' | 'PF' | 'PD';
export type LearnerProfileTag = 'pelajar' | 'pekerja' | 'keluarga' | 'umkm';
export type StatementType = 'fixed_fact' | 'dynamic_fact' | 'simulation_assumption';
export type PerformanceRubricLevel = 'gagal_kritis' | 'dasar' | 'baik' | 'optimal';

export interface RegulationMeta {
  source: string;
  regulationRef: string;
  relevantArticle?: string;
  sourceUrl?: string;
  verifiedDate: string; // 'YYYY-MM'
  effectiveFrom?: string; // 'YYYY-MM-DD'
  effectiveUntil?: string;
  isDynamicRule: boolean;
  reviewRequiredBeforeRelease: boolean;
}

export interface ExplanationCardSpec {
  statusCorrectId?: string;
  statusWrongId?: string;
  coreMechanismId: string;
  calculationOrEvidenceId?: string;
  assumptionsAndConditionsId?: string;
  healthyDecisionImplicationId: string;
  statementType: StatementType;
  regulationMeta?: RegulationMeta;
}

// ---------- Activity Payloads for the 7 Mechanics ----------

export interface CuanQuizQuestion {
  id: string;
  promptId: string;
  promptEn: string;
  optionsId: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationCard: ExplanationCardSpec;
  parametricNoteId?: string;
}

export interface FinWordleWordItem {
  word: string; // 3..9 uppercase A-Z
  clueId: string;
  clueEn: string;
  definitionId: string;
  definitionEn: string;
  exampleId: string;
  exampleEn: string;
  statementType?: StatementType;
  regulationMeta?: RegulationMeta;
}

export interface PairMatchPair {
  id: string;
  leftId: string;
  leftEn: string;
  rightId: string;
  rightEn: string;
}

export interface PairMatchData {
  mode: 'pairs' | 'sequence';
  instructionId: string;
  instructionEn: string;
  pairs?: PairMatchPair[];
  sequenceSteps?: {
    id: string;
    labelId: string;
    labelEn: string;
    order: number; // 1-based canonical order
  }[];
  explanationCard: ExplanationCardSpec;
}

export interface KokiBucket {
  id: string;
  labelId: string;
  labelEn: string;
  icon?: string;
  colorClass?: string;
}

export interface KokiItem {
  id: string;
  labelId: string;
  labelEn: string;
  contextTagId: string;
  correctBucketId: string;
  explanationCard: ExplanationCardSpec;
}

export interface KokiAnggaranCurriculumData {
  instructionId: string;
  instructionEn: string;
  buckets: KokiBucket[];
  items: KokiItem[];
}

export type DetektifEvidenceLevel = 'fakta_terobservasi' | 'red_flag' | 'perlu_verifikasi';
export type DetektifVerdict = 'AMAN' | 'WASPADA' | 'BAHAYA';

export interface DetektifCase {
  id: string;
  channel: 'WhatsApp' | 'SMS' | 'Email' | 'Struk' | 'Polis' | 'SlipGaji' | 'QRIS' | 'Tawaran';
  senderTitle: string;
  documentLines: string[];
  questionId: string;
  optionsId: {
    id: string;
    labelId: string;
    verdict: DetektifVerdict;
  }[];
  correctOptionId: string;
  evidenceLevel: DetektifEvidenceLevel;
  explanationCard: ExplanationCardSpec;
}

export interface PohonAsetDecisionOption {
  id: string;
  labelId: string;
  descId: string;
  cashDelta: number;       // Immediate liquid cash impact (Rp)
  investedDelta: number;   // Locked/invested productive capital change (Rp)
  riskExposureScore: number; // +high volatility or -safe
  inflationProtectionScore: number; // +protects against long-term inflation
  liquidityScore: number;  // +keeps emergency liquidity healthy
  feedbackId: string;
  isOptimal?: boolean;
}

export interface PohonAsetQuarter {
  quarterLabelId: string;
  eventTitleId: string;
  eventDescId: string;
  macroWeather: 'NORMAL' | 'INFLASI' | 'KRISIS' | 'BOOM';
  options: PohonAsetDecisionOption[];
}

export interface PohonAsetCurriculumData {
  mode: 'ketahanan' | 'inflasi' | 'diagnosa' | 'volatilitas' | 'siklus';
  scenarioTitleId: string;
  scenarioIntroId: string;
  horizonLabelId: string;
  initialCash: number;
  initialInvested: number;
  targetGoalAmount: number;
  quarters: PohonAsetQuarter[];
  explanationCard: ExplanationCardSpec;
}

export interface StorySimChoice {
  id: string;
  labelId: string;
  feedbackId: string;
  deltas: {
    cash?: number;          // Liquid cash (Rp)
    emergencyFund?: number; // Emergency reserve (Rp)
    sinkingFund?: number;   // Sinking fund (Rp)
    debt?: number;          // Total debt principal (Rp)
    netWorth?: number;      // Direct asset/liability shift (Rp)
    scoreCashflow?: number; // Dimension deltas (-25 .. +25)
    scoreRisk?: number;
    scoreSecurity?: number;
    scoreGoal?: number;
  };
  illegalDebtFlag?: boolean; // Instantly triggers Cashflow Insolvency / ethical fail in UAS/Capstone
  isRecommended?: boolean;
}

export interface StorySimChapter {
  id: string;
  periodLabelId: string; // e.g., "Babak 1" or "Bulan 1–2"
  narrativeId: string;
  assumptionNoteId?: string;
  choices: StorySimChoice[];
}

export interface StorySimCurriculumData {
  isPerformanceProject?: boolean;
  isCapstone?: boolean;
  titleId: string;
  subtitleId: string;
  durationLabelId: string;
  initialState: {
    cash: number;
    emergencyFund: number;
    sinkingFund: number;
    debt: number;
    netWorth: number;
  };
  chapters: StorySimChapter[];
  explanationCard: ExplanationCardSpec;
}

export type CurriculumActivityPayload =
  | { mechanic: 'CuanQuiz'; questions: CuanQuizQuestion[] }
  | { mechanic: 'FinWordle'; words: FinWordleWordItem[] }
  | { mechanic: 'PairMatch'; data: PairMatchData }
  | { mechanic: 'KokiAnggaran'; data: KokiAnggaranCurriculumData }
  | { mechanic: 'DetektifCuan'; cases: DetektifCase[] }
  | { mechanic: 'PohonAset'; data: PohonAsetCurriculumData }
  | { mechanic: 'StorySim'; data: StorySimCurriculumData };

// ---------- Curriculum Topology & Progression Types ----------

export interface LessonConfig {
  pathId: string;
  stageId: string;
  unitId: string;
  semesterId: string;
  mechanic: MechanicType;
  titleId: string;
  titleEn: string;
  objectiveId: string;
  objectiveEn: string;
  untimed: boolean;
  isBoss?: boolean;
  minWordLength?: number;
  maxWordLength?: number;
  simMonths?: number;
  statementType: StatementType;
  regulationMeta?: RegulationMeta;
  xpReward: number;
  coinReward: number;
  activity: CurriculumActivityPayload;
}

export interface StageSpec {
  id: string;
  stageNumber: string; // e.g. '1.1'
  titleId: string;
  titleEn: string;
  paths: LessonConfig[];
  skipExamId: string;
}

export interface UnitSpec {
  id: string;
  unitNumber: number;
  semesterId: string;
  titleId: string;
  titleEn: string;
  guidebook: {
    summaryId: string;
    summaryEn: string;
    keyRulesId: string[];
    keyRulesEn: string[];
    disclaimerId: string;
    disclaimerEn: string;
  };
  regulationMeta?: RegulationMeta;
  stages: StageSpec[];
}

export interface ExamSubtestSpec {
  subtestId: ExamSubtestId;
  titleId: string;
  titleEn: string;
  durationSec: number;
  questionCount: number;
  minSubtestPercent: number; // 60 for >=3 items, 50 for 2 dichotomous items
  minVariantPoolPerSlot: number;
  mechanics: MechanicType[];
  sourceUnitIds: string[];
}

export interface PerformanceRubricDimension {
  key: 'cashflowStability' | 'riskLiquidity' | 'debtScamImmunity' | 'goalPreservation';
  labelId: string;
  weight: number;
  minScoreToAvoidRemedialFocus: number;
}

export interface PerformanceAssessmentSpec {
  simId: string;
  titleId: string;
  durationMonths: number;
  passMinScore: number; // 75
  failOnCashflowInsolvency: boolean;
  requirePositiveNetWorthAtEnd?: boolean; // false on S6 Capstone
  dimensions: PerformanceRubricDimension[];
  storySimData: StorySimCurriculumData;
}

export interface SemesterExamSpec {
  examId: string; // 'S1.UTS' | 'S1.UAS' etc.
  semesterId: string;
  type: 'UTS' | 'UAS';
  titleId: string;
  coversUnitRange: string;
  passTotalPercent: number; // 80
  passPart1MinPercent?: number; // 75 for UAS
  calibrationStatus: 'baseline_v1' | 'empirically_calibrated';
  remedialCooldownMs: number; // 86_400_000 (24h)
  requiredRemedialPaths: number; // 3
  subtests: [ExamSubtestSpec, ExamSubtestSpec, ExamSubtestSpec, ExamSubtestSpec];
  performancePart?: PerformanceAssessmentSpec;
}

export interface SemesterSpec {
  id: string; // 'S1'..'S6'
  semesterNumber: number;
  titleId: string;
  titleEn: string;
  subtitleId: string;
  units: UnitSpec[];
  uts: SemesterExamSpec;
  uas: SemesterExamSpec;
}

export interface PlacementBlockMapping {
  blockNumber: 1 | 2 | 3;
  titleId: string;
  sourceSemesters: string[];
  sourceUnitIds: string[];
  passAccuracy: number; // 0.80
  targetOnPass: { semesterId: string; unitId: string };
  targetOnFail: { semesterId: string; unitId: string };
}

export interface MistakeBankEntry {
  mechanic: MechanicType;
  itemId: string;
  pathId: string;
  unitId: string;
  wrongCount: number;
  lastWrongAt: number;
}

export interface ExamScoreRecord {
  passed: boolean;
  knowledgePercent: number;
  performanceScore?: number;
  performanceLevel?: PerformanceRubricLevel;
  cashflowInsolvency?: boolean;
  combinedPercent: number;
  subtestScores: Record<ExamSubtestId, number>;
  weakestUnitId?: string;
  takenAt: number;
}

export interface RemedialLockRecord {
  lockedUntil: number;
  requiredRemedialPaths: number;
  remedialCompletedPathIds: string[];
  targetUnitIds: string[];
}

export interface UserCurriculumProgress {
  regionId: 'id-ID';
  learnerFocus?: LearnerProfileTag;
  placementTest: {
    status: 'available' | 'in_progress' | 'completed';
    consumedBySubmit: boolean;
    placedUnitId?: string;
    highestPassedBlock?: number;
    takenAt?: number;
  };
  unlockedSemesterIds: string[];
  unlockedUnitIds: string[];
  unlockedStageIds: string[];
  completedPathIds: string[];
  completedStageIds: string[];
  completedUnitIds: string[];
  skippedStageIds: string[];
  passedExamIds: string[];
  examScores: Record<string, ExamScoreRecord>;
  remedialLocks: Record<string, RemedialLockRecord>;
  mistakeBank: MistakeBankEntry[];
  mistakeBankUpdatedAt?: number;
  certificateEarned?: boolean;
}
