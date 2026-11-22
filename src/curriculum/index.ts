import { SEMESTER_1 } from './semesters/semester1';
import { SEMESTER_2 } from './semesters/semester2';
import { SEMESTER_3 } from './semesters/semester3';
import { SEMESTER_4 } from './semesters/semester4';
import { SEMESTER_5 } from './semesters/semester5';
import { SEMESTER_6 } from './semesters/semester6';
import type {
  LessonConfig,
  PlacementBlockMapping,
  SemesterExamSpec,
  SemesterSpec,
  StageSpec,
  UnitSpec,
} from './types';

export * from './types';

export const CURRICULUM_SEMESTERS: SemesterSpec[] = [
  SEMESTER_1,
  SEMESTER_2,
  SEMESTER_3,
  SEMESTER_4,
  SEMESTER_5,
  SEMESTER_6,
];

export const PLACEMENT_BLOCKS: PlacementBlockMapping[] = [
  {
    blockNumber: 1,
    titleId: 'Blok 1 TPB: Fondasi Uang, Pajak & Konsumsi · Semester 1',
    sourceSemesters: ['S1'],
    sourceUnitIds: ['S1.U1', 'S1.U2', 'S1.U3', 'S1.U4', 'S1.U5'],
    passAccuracy: 0.8,
    targetOnPass: { semesterId: 'S2', unitId: 'S2.U6' },
    targetOnFail: { semesterId: 'S1', unitId: 'S1.U1' },
  },
  {
    blockNumber: 2,
    titleId: 'Blok 2 TPB: Perbankan, QRIS, Karier & Cashflow · Semester 2',
    sourceSemesters: ['S2'],
    sourceUnitIds: ['S2.U6', 'S2.U7', 'S2.U8', 'S2.U9', 'S2.U10', 'S2.U11'],
    passAccuracy: 0.8,
    targetOnPass: { semesterId: 'S3', unitId: 'S3.U12' },
    targetOnFail: { semesterId: 'S2', unitId: 'S2.U6' },
  },
  {
    blockNumber: 3,
    titleId: 'Blok 3 TPB: Manajemen Utang, SLIK & Keamanan Siber · Semester 3',
    sourceSemesters: ['S3'],
    sourceUnitIds: ['S3.U12', 'S3.U13', 'S3.U14', 'S3.U15', 'S3.U16'],
    passAccuracy: 0.8,
    targetOnPass: { semesterId: 'S4', unitId: 'S4.U17' },
    targetOnFail: { semesterId: 'S3', unitId: 'S3.U12' },
  },
];

export const ALL_UNITS: UnitSpec[] = [];
export const ALL_STAGES: StageSpec[] = [];
export const ALL_PATHS: LessonConfig[] = [];

export const SEMESTER_MAP: Record<string, SemesterSpec> = {};
export const UNIT_MAP: Record<string, UnitSpec> = {};
export const STAGE_MAP: Record<string, StageSpec> = {};
export const STAGE_PARENT_UNIT_MAP: Record<string, UnitSpec> = {};
export const PATH_MAP: Record<string, LessonConfig> = {};
export const PATH_PARENT_STAGE_MAP: Record<string, StageSpec> = {};
export const EXAM_MAP: Record<string, SemesterExamSpec> = {};
export const SKIP_EXAM_MAP: Record<string, { stage: StageSpec; unit: UnitSpec; semester: SemesterSpec }> = {};

for (const sem of CURRICULUM_SEMESTERS) {
  SEMESTER_MAP[sem.id] = sem;
  EXAM_MAP[sem.uts.examId] = sem.uts;
  EXAM_MAP[sem.uas.examId] = sem.uas;

  for (const unit of sem.units) {
    ALL_UNITS.push(unit);
    UNIT_MAP[unit.id] = unit;

    for (const stage of unit.stages) {
      ALL_STAGES.push(stage);
      STAGE_MAP[stage.id] = stage;
      STAGE_PARENT_UNIT_MAP[stage.id] = unit;
      SKIP_EXAM_MAP[stage.skipExamId] = { stage, unit, semester: sem };

      for (const path of stage.paths) {
        ALL_PATHS.push(path);
        PATH_MAP[path.pathId] = path;
        PATH_PARENT_STAGE_MAP[path.pathId] = stage;
      }
    }
  }
}

export function getUtsGateAfterUnitId(semester: SemesterSpec): string {
  const sourceUnits = semester.uts.subtests[0]?.sourceUnitIds ?? [];
  if (sourceUnits.length > 0) {
    return sourceUnits[sourceUnits.length - 1];
  }
  const midIdx = Math.max(0, Math.floor(semester.units.length / 2) - 1);
  return semester.units[midIdx]?.id ?? semester.units[0].id;
}

export function getNextStageInfo(
  currentStageId: string
): { stage: StageSpec; unit: UnitSpec; semester: SemesterSpec } | undefined {
  const idx = ALL_STAGES.findIndex((s) => s.id === currentStageId);
  if (idx < 0 || idx + 1 >= ALL_STAGES.length) return undefined;
  const nextStage = ALL_STAGES[idx + 1];
  const unit = STAGE_PARENT_UNIT_MAP[nextStage.id];
  const semester = SEMESTER_MAP[unit.semesterId];
  return { stage: nextStage, unit, semester };
}

export function getNextUnitInfo(unitId: string): UnitSpec | undefined {
  const idx = ALL_UNITS.findIndex((u) => u.id === unitId);
  if (idx < 0 || idx + 1 >= ALL_UNITS.length) return undefined;
  return ALL_UNITS[idx + 1];
}

export function getCurriculumIntegrityStats() {
  const seenUnits = new Set<string>();
  const duplicateUnitIds: string[] = [];
  for (const u of ALL_UNITS) {
    if (seenUnits.has(u.id)) duplicateUnitIds.push(u.id);
    seenUnits.add(u.id);
  }

  const seenStages = new Set<string>();
  const duplicateStageIds: string[] = [];
  for (const s of ALL_STAGES) {
    if (seenStages.has(s.id)) duplicateStageIds.push(s.id);
    seenStages.add(s.id);
  }

  const seenPaths = new Set<string>();
  const duplicatePathIds: string[] = [];
  for (const p of ALL_PATHS) {
    if (seenPaths.has(p.pathId)) duplicatePathIds.push(p.pathId);
    seenPaths.add(p.pathId);
  }

  return {
    semesters: CURRICULUM_SEMESTERS.length,
    units: ALL_UNITS.length,
    stages: ALL_STAGES.length,
    paths: ALL_PATHS.length,
    utsCount: CURRICULUM_SEMESTERS.length,
    uasCount: CURRICULUM_SEMESTERS.length,
    skipExamCount: Object.keys(SKIP_EXAM_MAP).length,
    duplicateUnitIds,
    duplicateStageIds,
    duplicatePathIds,
  };
}
