import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  ALL_PATHS,
  ALL_STAGES,
  ALL_UNITS,
  CURRICULUM_SEMESTERS,
  EXAM_MAP,
  PATH_MAP,
  PATH_PARENT_STAGE_MAP,
  PLACEMENT_BLOCKS,
  SEMESTER_MAP,
  SKIP_EXAM_MAP,
  STAGE_MAP,
  STAGE_PARENT_UNIT_MAP,
  UNIT_MAP,
  getUtsGateAfterUnitId,
} from './index';
import type {
  ExamScoreRecord,
  LearnerProfileTag,
  LessonConfig,
  MechanicType,
  RemedialLockRecord,
  UserCurriculumProgress,
} from './types';

const STORAGE_PREFIX = 'koinkita_curriculum_progress_v1_';

export const SKIP_STAGE_COOLDOWN_MS = 12 * 60 * 60 * 1000; // 12h
export const SKIP_STAGE_REQUIRED_REMEDIAL_PATHS = 2;

export function createInitialCurriculumProgress(): UserCurriculumProgress {
  return {
    regionId: 'id-ID',
    placementTest: {
      status: 'available',
      consumedBySubmit: false,
    },
    unlockedSemesterIds: ['S1'],
    unlockedUnitIds: ['S1.U1'],
    unlockedStageIds: ['S1.U1.ST1'],
    completedPathIds: [],
    completedStageIds: [],
    completedUnitIds: [],
    skippedStageIds: [],
    passedExamIds: [],
    examScores: {},
    remedialLocks: {},
    mistakeBank: [],
    certificateEarned: false,
  };
}

function uniquePush(arr: string[], ...items: string[]): string[] {
  const set = new Set(arr);
  for (const item of items) {
    if (item) set.add(item);
  }
  return Array.from(set);
}

function sanitizeForFirestore<T>(val: T): T {
  if (val === null || val === undefined) return val;
  if (Array.isArray(val)) {
    return val.map((v) => sanitizeForFirestore(v)).filter((v) => v !== undefined) as unknown as T;
  }
  if (typeof val === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      if (v !== undefined) {
        out[k] = sanitizeForFirestore(v);
      }
    }
    return out as T;
  }
  return val;
}

export function normalizeCurriculumProgress(
  raw?: Partial<UserCurriculumProgress> | null
): UserCurriculumProgress {
  const base = createInitialCurriculumProgress();
  if (!raw) return base;
  return {
    regionId: 'id-ID',
    learnerFocus: raw.learnerFocus,
    placementTest: {
      status: raw.placementTest?.consumedBySubmit
        ? 'completed'
        : raw.placementTest?.status || 'available',
      consumedBySubmit: Boolean(raw.placementTest?.consumedBySubmit),
      placedUnitId: raw.placementTest?.placedUnitId,
      highestPassedBlock: raw.placementTest?.highestPassedBlock,
      takenAt: raw.placementTest?.takenAt,
    },
    unlockedSemesterIds: uniquePush(base.unlockedSemesterIds, ...(raw.unlockedSemesterIds || [])),
    unlockedUnitIds: uniquePush(base.unlockedUnitIds, ...(raw.unlockedUnitIds || [])),
    unlockedStageIds: uniquePush(base.unlockedStageIds, ...(raw.unlockedStageIds || [])),
    completedPathIds: uniquePush([], ...(raw.completedPathIds || [])),
    completedStageIds: uniquePush([], ...(raw.completedStageIds || [])),
    completedUnitIds: uniquePush([], ...(raw.completedUnitIds || [])),
    skippedStageIds: uniquePush([], ...(raw.skippedStageIds || [])),
    passedExamIds: uniquePush([], ...(raw.passedExamIds || [])),
    examScores: { ...(raw.examScores || {}) },
    remedialLocks: { ...(raw.remedialLocks || {}) },
    mistakeBank: Array.isArray(raw.mistakeBank) ? raw.mistakeBank.slice(0, 100) : [],
    mistakeBankUpdatedAt: typeof raw.mistakeBankUpdatedAt === 'number' ? raw.mistakeBankUpdatedAt : undefined,
    certificateEarned: Boolean(raw.certificateEarned),
  };
}

export function mergeCurriculumProgress(
  a?: Partial<UserCurriculumProgress> | null,
  b?: Partial<UserCurriculumProgress> | null
): UserCurriculumProgress {
  const pA = normalizeCurriculumProgress(a);
  const pB = normalizeCurriculumProgress(b);

  const consumed = pA.placementTest.consumedBySubmit || pB.placementTest.consumedBySubmit;
  const placementWinner =
    pB.placementTest.consumedBySubmit && !pA.placementTest.consumedBySubmit
      ? pB.placementTest
      : pA.placementTest.consumedBySubmit
      ? pA.placementTest
      : pB.placementTest;

  const mergedScores: Record<string, ExamScoreRecord> = { ...pA.examScores };
  for (const [k, scoreB] of Object.entries(pB.examScores)) {
    const scoreA = mergedScores[k];
    if (!scoreA || scoreB.takenAt >= scoreA.takenAt) {
      mergedScores[k] = scoreB;
    }
  }

  const mergedLocks: Record<string, RemedialLockRecord> = { ...pA.remedialLocks };
  for (const [k, lockB] of Object.entries(pB.remedialLocks)) {
    const lockA = mergedLocks[k];
    if (!lockA || lockB.lockedUntil > lockA.lockedUntil) {
      mergedLocks[k] = lockB;
    }
  }

  const tsA = pA.mistakeBankUpdatedAt ?? Math.max(0, ...pA.mistakeBank.map((m) => m.lastWrongAt));
  const tsB = pB.mistakeBankUpdatedAt ?? Math.max(0, ...pB.mistakeBank.map((m) => m.lastWrongAt));
  const useBMistakes = tsB !== tsA ? tsB > tsA : pB.mistakeBank.length >= pA.mistakeBank.length;

  return {
    regionId: 'id-ID',
    learnerFocus: pB.learnerFocus || pA.learnerFocus,
    placementTest: {
      ...placementWinner,
      status: consumed ? 'completed' : placementWinner.status,
      consumedBySubmit: consumed,
    },
    unlockedSemesterIds: uniquePush(pA.unlockedSemesterIds, ...pB.unlockedSemesterIds),
    unlockedUnitIds: uniquePush(pA.unlockedUnitIds, ...pB.unlockedUnitIds),
    unlockedStageIds: uniquePush(pA.unlockedStageIds, ...pB.unlockedStageIds),
    completedPathIds: uniquePush(pA.completedPathIds, ...pB.completedPathIds),
    completedStageIds: uniquePush(pA.completedStageIds, ...pB.completedStageIds),
    completedUnitIds: uniquePush(pA.completedUnitIds, ...pB.completedUnitIds),
    skippedStageIds: uniquePush(pA.skippedStageIds, ...pB.skippedStageIds),
    passedExamIds: uniquePush(pA.passedExamIds, ...pB.passedExamIds),
    examScores: mergedScores,
    remedialLocks: mergedLocks,
    mistakeBank: useBMistakes ? pB.mistakeBank : pA.mistakeBank,
    mistakeBankUpdatedAt: Math.max(tsA, tsB) || undefined,
    certificateEarned: pA.certificateEarned || pB.certificateEarned,
  };
}

export function loadLocalCurriculumProgress(uid?: string | null): UserCurriculumProgress {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${uid || 'guest'}`);
    if (!raw) return createInitialCurriculumProgress();
    return normalizeCurriculumProgress(JSON.parse(raw));
  } catch {
    return createInitialCurriculumProgress();
  }
}

export async function loadCurriculumProgress(uid?: string | null): Promise<UserCurriculumProgress> {
  const local = loadLocalCurriculumProgress(uid);
  if (!uid) return local;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    const remote = snap.exists() ? (snap.data()?.curriculumProgress as Partial<UserCurriculumProgress> | undefined) : undefined;
    if (!remote) return local;
    const merged = mergeCurriculumProgress(local, remote);
    localStorage.setItem(`${STORAGE_PREFIX}${uid}`, JSON.stringify(merged));
    return merged;
  } catch {
    return local;
  }
}

export async function saveCurriculumProgress(
  uid: string | null | undefined,
  progress: UserCurriculumProgress
): Promise<void> {
  const normalized = normalizeCurriculumProgress(progress);
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${uid || 'guest'}`, JSON.stringify(normalized));
  } catch {
    // ignore storage quota errors
  }
  if (!uid) return;
  try {
    await setDoc(
      doc(db, 'users', uid),
      { curriculumProgress: sanitizeForFirestore(normalized) },
      { merge: true }
    );
  } catch (err) {
    console.warn('[Curriculum] Failed to sync progress to Firestore:', err);
  }
}

export function setLearnerFocus(
  progress: UserCurriculumProgress,
  focus: LearnerProfileTag
): UserCurriculumProgress {
  return { ...progress, learnerFocus: focus };
}

export function getRemedialStatus(
  progress: UserCurriculumProgress,
  examId: string,
  now = Date.now()
): {
  isLocked: boolean;
  remainingMs: number;
  completedPathsCount: number;
  requiredPathsCount: number;
  targetUnitIds: string[];
} {
  const lock = progress.remedialLocks[examId];
  if (!lock) {
    return {
      isLocked: false,
      remainingMs: 0,
      completedPathsCount: 0,
      requiredPathsCount: 0,
      targetUnitIds: [],
    };
  }
  const doneCount = lock.remedialCompletedPathIds.length;
  const timeDone = now >= lock.lockedUntil;
  const pathDone = doneCount >= lock.requiredRemedialPaths;
  return {
    isLocked: !(timeDone || pathDone),
    remainingMs: Math.max(0, lock.lockedUntil - now),
    completedPathsCount: doneCount,
    requiredPathsCount: lock.requiredRemedialPaths,
    targetUnitIds: lock.targetUnitIds,
  };
}

export function formatRemainingCooldown(ms: number): string {
  if (ms <= 0) return '0m';
  const totalSec = Math.ceil(ms / 1000);
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.ceil((totalSec % 3600) / 60);
  if (hrs > 0) return `${hrs}j ${mins}m`;
  return `${mins}m`;
}

export function isStageCleared(progress: UserCurriculumProgress, stageId: string): boolean {
  return (
    progress.completedStageIds.includes(stageId) ||
    progress.skippedStageIds.includes(stageId)
  );
}

export function isPathAccessible(progress: UserCurriculumProgress, pathId: string): boolean {
  const path = PATH_MAP[pathId];
  if (!path) return false;
  if (progress.completedPathIds.includes(pathId)) return true;

  const stage = PATH_PARENT_STAGE_MAP[pathId];
  if (!stage) return false;
  if (!progress.unlockedStageIds.includes(stage.id)) return false;

  if (isStageCleared(progress, stage.id)) return true;

  const idx = stage.paths.findIndex((p) => p.pathId === pathId);
  if (idx <= 0) return true;
  return stage.paths.slice(0, idx).every((p) => progress.completedPathIds.includes(p.pathId));
}

export function canTakeStageSkipExam(progress: UserCurriculumProgress, stageId: string): boolean {
  const stage = STAGE_MAP[stageId];
  if (!stage) return false;
  if (!progress.unlockedStageIds.includes(stage.id)) return false;
  if (isStageCleared(progress, stage.id)) return false;

  const unit = STAGE_PARENT_UNIT_MAP[stage.id];
  if (!unit || !progress.unlockedUnitIds.includes(unit.id)) return false;

  // Enforce 1-Stage-forward rule: no later stage inside this unit may already be unlocked/cleared
  const stageIdx = unit.stages.findIndex((s) => s.id === stage.id);
  const laterStageUnlocked = unit.stages
    .slice(stageIdx + 1)
    .some((s) => progress.unlockedStageIds.includes(s.id));

  return !laterStageUnlocked;
}

export function isSemesterExamUnlocked(progress: UserCurriculumProgress, examId: string): boolean {
  const exam = EXAM_MAP[examId];
  if (!exam) return false;
  return progress.unlockedSemesterIds.includes(exam.semesterId);
}

function advanceUnlockAfterStageCleared(
  next: UserCurriculumProgress,
  clearedStageId: string
): void {
  const unit = STAGE_PARENT_UNIT_MAP[clearedStageId];
  if (!unit) return;
  const semester = SEMESTER_MAP[unit.semesterId];
  if (!semester) return;

  const stageIdx = unit.stages.findIndex((s) => s.id === clearedStageId);
  if (stageIdx >= 0 && stageIdx + 1 < unit.stages.length) {
    const nextStage = unit.stages[stageIdx + 1];
    next.unlockedStageIds = uniquePush(next.unlockedStageIds, nextStage.id);
    return;
  }

  // Last stage of unit is cleared -> unit completed
  next.completedUnitIds = uniquePush(next.completedUnitIds, unit.id);

  const unitIdx = semester.units.findIndex((u) => u.id === unit.id);
  const utsAfterUnitId = getUtsGateAfterUnitId(semester);

  if (unitIdx >= 0 && unitIdx + 1 < semester.units.length) {
    const nextUnit = semester.units[unitIdx + 1];
    // Gate check: if this unit is the mid-semester UTS checkpoint unit, UTS must be passed to unlock next unit!
    if (unit.id === utsAfterUnitId && !next.passedExamIds.includes(semester.uts.examId)) {
      return;
    }
    next.unlockedUnitIds = uniquePush(next.unlockedUnitIds, nextUnit.id);
    if (nextUnit.stages[0]) {
      next.unlockedStageIds = uniquePush(next.unlockedStageIds, nextUnit.stages[0].id);
    }
    return;
  }

  // Last unit of semester completed -> check UAS gate
  if (next.passedExamIds.includes(semester.uas.examId)) {
    unlockNextSemesterAfterUAS(next, semester.id);
  }
}

function unlockNextSemesterAfterUAS(next: UserCurriculumProgress, semesterId: string): void {
  const semIdx = CURRICULUM_SEMESTERS.findIndex((s) => s.id === semesterId);
  if (semIdx === CURRICULUM_SEMESTERS.length - 1) {
    next.certificateEarned = true;
    return;
  }
  const nextSem = CURRICULUM_SEMESTERS[semIdx + 1];
  if (!nextSem) return;
  next.unlockedSemesterIds = uniquePush(next.unlockedSemesterIds, nextSem.id);
  const firstUnit = nextSem.units[0];
  if (firstUnit) {
    next.unlockedUnitIds = uniquePush(next.unlockedUnitIds, firstUnit.id);
    if (firstUnit.stages[0]) {
      next.unlockedStageIds = uniquePush(next.unlockedStageIds, firstUnit.stages[0].id);
    }
  }
}

export function applyPathCompletion(
  progress: UserCurriculumProgress,
  pathId: string
): UserCurriculumProgress {
  const path = PATH_MAP[pathId];
  const stage = PATH_PARENT_STAGE_MAP[pathId];
  if (!path || !stage) return progress;

  const next: UserCurriculumProgress = normalizeCurriculumProgress(progress);
  next.completedPathIds = uniquePush(next.completedPathIds, pathId);

  // Advance any active remedial locks where this path belongs to the remedial unit pool (or unlocked units)
  const updatedLocks: Record<string, RemedialLockRecord> = {};
  for (const [examId, lock] of Object.entries(next.remedialLocks)) {
    const belongs =
      lock.targetUnitIds.length === 0 ||
      lock.targetUnitIds.includes(path.unitId) ||
      next.unlockedUnitIds.includes(path.unitId);
    if (belongs) {
      const done = uniquePush(lock.remedialCompletedPathIds, pathId);
      if (done.length < lock.requiredRemedialPaths && Date.now() < lock.lockedUntil) {
        updatedLocks[examId] = { ...lock, remedialCompletedPathIds: done };
      }
      // Once threshold met, drop the lock automatically!
    } else {
      updatedLocks[examId] = lock;
    }
  }
  next.remedialLocks = updatedLocks;

  // Check if entire stage is now completed
  const allPathsDone = stage.paths.every((p) => next.completedPathIds.includes(p.pathId));
  if (allPathsDone) {
    next.completedStageIds = uniquePush(next.completedStageIds, stage.id);
    advanceUnlockAfterStageCleared(next, stage.id);
  }

  return next;
}

export function applySkipStageResult(
  progress: UserCurriculumProgress,
  skipExamId: string,
  score: ExamScoreRecord,
  now = Date.now()
): UserCurriculumProgress {
  const entry = SKIP_EXAM_MAP[skipExamId];
  if (!entry) return progress;

  const next = normalizeCurriculumProgress(progress);
  next.examScores[skipExamId] = score;

  if (score.passed) {
    next.passedExamIds = uniquePush(next.passedExamIds, skipExamId);
    next.skippedStageIds = uniquePush(next.skippedStageIds, entry.stage.id);
    delete next.remedialLocks[skipExamId];
    advanceUnlockAfterStageCleared(next, entry.stage.id);
  } else {
    next.remedialLocks[skipExamId] = {
      lockedUntil: now + SKIP_STAGE_COOLDOWN_MS,
      requiredRemedialPaths: SKIP_STAGE_REQUIRED_REMEDIAL_PATHS,
      remedialCompletedPathIds: [],
      targetUnitIds: [entry.unit.id],
    };
  }

  return next;
}

export function applySemesterExamResult(
  progress: UserCurriculumProgress,
  examId: string,
  score: ExamScoreRecord,
  now = Date.now()
): UserCurriculumProgress {
  const exam = EXAM_MAP[examId];
  if (!exam) return progress;
  const semester = SEMESTER_MAP[exam.semesterId];
  if (!semester) return progress;

  const next = normalizeCurriculumProgress(progress);
  next.examScores[examId] = score;

  if (score.passed) {
    next.passedExamIds = uniquePush(next.passedExamIds, examId);
    delete next.remedialLocks[examId];

    if (exam.type === 'UTS') {
      const utsAfterUnitId = getUtsGateAfterUnitId(semester);
      const utsUnitIdx = semester.units.findIndex((u) => u.id === utsAfterUnitId);
      if (utsUnitIdx >= 0) {
        // Ensure all units up to UTS gate remain accessible for review, and unlock post-UTS unit
        for (let i = 0; i <= utsUnitIdx; i++) {
          const u = semester.units[i];
          next.unlockedUnitIds = uniquePush(next.unlockedUnitIds, u.id);
          if (u.stages[0]) next.unlockedStageIds = uniquePush(next.unlockedStageIds, u.stages[0].id);
        }
        const postUtsUnit = semester.units[utsUnitIdx + 1];
        if (postUtsUnit) {
          next.unlockedUnitIds = uniquePush(next.unlockedUnitIds, postUtsUnit.id);
          if (postUtsUnit.stages[0]) {
            next.unlockedStageIds = uniquePush(next.unlockedStageIds, postUtsUnit.stages[0].id);
          }
        }
      }
    } else {
      // UAS passed: keep current semester units reviewable & unlock next Semester (or earn final S6 Certificate)
      for (const u of semester.units) {
        next.unlockedUnitIds = uniquePush(next.unlockedUnitIds, u.id);
        for (const st of u.stages) {
          next.unlockedStageIds = uniquePush(next.unlockedStageIds, st.id);
        }
      }
      unlockNextSemesterAfterUAS(next, semester.id);
    }
  } else {
    const targetUnits = exam.subtests[0]?.sourceUnitIds || semester.units.map((u) => u.id);
    const focusUnits = score.weakestUnitId ? [score.weakestUnitId, ...targetUnits] : targetUnits;
    next.remedialLocks[examId] = {
      lockedUntil: now + exam.remedialCooldownMs,
      requiredRemedialPaths: exam.requiredRemedialPaths,
      remedialCompletedPathIds: [],
      targetUnitIds: uniquePush([], ...focusUnits),
    };
  }

  return next;
}

export function markPlacementInProgress(progress: UserCurriculumProgress): UserCurriculumProgress {
  if (progress.placementTest.consumedBySubmit) return progress;
  return {
    ...progress,
    placementTest: {
      ...progress.placementTest,
      status: 'in_progress',
      consumedBySubmit: false,
    },
  };
}

export function applyPlacementResult(
  progress: UserCurriculumProgress,
  highestPassedBlock: 0 | 1 | 2 | 3,
  now = Date.now()
): UserCurriculumProgress {
  if (progress.placementTest.consumedBySubmit) return progress;
  const next = normalizeCurriculumProgress(progress);

  let placedUnitId = 'S1.U1';
  const blocksToClear = PLACEMENT_BLOCKS.slice(0, highestPassedBlock);

  for (const blk of blocksToClear) {
    for (const semId of blk.sourceSemesters) {
      const sem = SEMESTER_MAP[semId];
      if (!sem) continue;
      next.unlockedSemesterIds = uniquePush(next.unlockedSemesterIds, semId);
      next.passedExamIds = uniquePush(next.passedExamIds, sem.uts.examId, sem.uas.examId);
      for (const unit of sem.units) {
        next.unlockedUnitIds = uniquePush(next.unlockedUnitIds, unit.id);
        next.completedUnitIds = uniquePush(next.completedUnitIds, unit.id);
        for (const st of unit.stages) {
          next.unlockedStageIds = uniquePush(next.unlockedStageIds, st.id);
          next.skippedStageIds = uniquePush(next.skippedStageIds, st.id);
        }
      }
    }
    placedUnitId = blk.targetOnPass.unitId;
    next.unlockedSemesterIds = uniquePush(next.unlockedSemesterIds, blk.targetOnPass.semesterId);
    next.unlockedUnitIds = uniquePush(next.unlockedUnitIds, blk.targetOnPass.unitId);
    const placedUnit = UNIT_MAP[blk.targetOnPass.unitId];
    if (placedUnit?.stages[0]) {
      next.unlockedStageIds = uniquePush(next.unlockedStageIds, placedUnit.stages[0].id);
    }
  }

  next.placementTest = {
    status: 'completed',
    consumedBySubmit: true,
    placedUnitId,
    highestPassedBlock,
    takenAt: now,
  };

  return next;
}

export function recordMistake(
  progress: UserCurriculumProgress,
  payload: { mechanic: MechanicType; itemId: string; pathId: string; unitId: string },
  now = Date.now()
): UserCurriculumProgress {
  const next = normalizeCurriculumProgress(progress);
  const existingIdx = next.mistakeBank.findIndex(
    (m) => m.itemId === payload.itemId && m.pathId === payload.pathId
  );
  if (existingIdx >= 0) {
    const updated = {
      ...next.mistakeBank[existingIdx],
      wrongCount: next.mistakeBank[existingIdx].wrongCount + 1,
      lastWrongAt: now,
    };
    next.mistakeBank = [
      updated,
      ...next.mistakeBank.filter((_, idx) => idx !== existingIdx),
    ].slice(0, 80);
  } else {
    next.mistakeBank = [
      { ...payload, wrongCount: 1, lastWrongAt: now },
      ...next.mistakeBank,
    ].slice(0, 80);
  }
  next.mistakeBankUpdatedAt = now;
  return next;
}

export function resolveMistake(
  progress: UserCurriculumProgress,
  itemId: string,
  pathId: string,
  now = Date.now()
): UserCurriculumProgress {
  const next = normalizeCurriculumProgress(progress);
  next.mistakeBank = next.mistakeBank.filter(
    (m) => !(m.itemId === itemId && m.pathId === pathId)
  );
  next.mistakeBankUpdatedAt = now;
  return next;
}

export function getNextRecommendedPath(
  progress: UserCurriculumProgress
): LessonConfig | undefined {
  // Prioritize the frontier uncompleted stage/path in the highest unlocked unit
  for (let i = ALL_UNITS.length - 1; i >= 0; i--) {
    const unit = ALL_UNITS[i];
    if (!progress.unlockedUnitIds.includes(unit.id)) continue;
    if (progress.completedUnitIds.includes(unit.id)) continue;
    for (const stage of unit.stages) {
      if (!progress.unlockedStageIds.includes(stage.id)) continue;
      if (isStageCleared(progress, stage.id)) continue;
      for (const path of stage.paths) {
        if (!progress.completedPathIds.includes(path.pathId)) {
          return path;
        }
      }
    }
  }
  // Fallback: first incomplete path in any unlocked unit
  for (const path of ALL_PATHS) {
    if (isPathAccessible(progress, path.pathId) && !progress.completedPathIds.includes(path.pathId)) {
      return path;
    }
  }
  return undefined;
}
