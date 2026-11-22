import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Lock,
  ShieldAlert,
  Sparkles,
  Target,
} from 'lucide-react';
import { EXAM_MAP, PLACEMENT_BLOCKS, SKIP_EXAM_MAP, UNIT_MAP } from '../../curriculum';
import {
  generatePlacementBlockRun,
  generateSemesterExamRun,
  generateStageSkipExamRun,
  type ExamQuestionItem,
} from '../../curriculum/examBank';
import {
  applyPlacementResult,
  applySemesterExamResult,
  applySkipStageResult,
  formatRemainingCooldown,
  getRemedialStatus,
  markPlacementInProgress,
} from '../../curriculum/progression';
import type {
  ExamScoreRecord,
  ExamSubtestId,
  UserCurriculumProgress,
} from '../../curriculum/types';
import { ExplanationCard } from './ExplanationCard';
import { StorySimEngine, type StorySimCompleteResult, type StorySimPerformanceResult } from './engines/StorySimEngine';
import CikoMascot from '../CikoMascot';
import { playClick, playCorrect, playLose, playWin, playWrong } from '../../lib/audio';
import { vibrateError, vibrateSuccess } from '../../lib/haptics';

export type ExamRunnerMode =
  | { kind: 'semester'; examId: string }
  | { kind: 'skip'; skipExamId: string }
  | { kind: 'placement' };

interface ExamRunnerProps {
  mode: ExamRunnerMode;
  progress: UserCurriculumProgress;
  onProgressUpdated: (next: UserCurriculumProgress) => void;
  onStartRemedialUnit?: (unitId: string) => void;
  onBack: () => void;
}

interface AnswerLogEntry {
  question: ExamQuestionItem;
  chosenIndex: number | null;
  isCorrect: boolean;
}

function computeWeakestUnit(logs: AnswerLogEntry[]): string | undefined {
  const tally: Record<string, { wrong: number; total: number }> = {};
  for (const log of logs) {
    const uid = log.question.unitId;
    if (!tally[uid]) tally[uid] = { wrong: 0, total: 0 };
    tally[uid].total += 1;
    if (!log.isCorrect) tally[uid].wrong += 1;
  }
  const ranked = Object.entries(tally)
    .filter(([, v]) => v.wrong > 0)
    .sort((a, b) => b[1].wrong / b[1].total - a[1].wrong / a[1].total);
  return ranked[0]?.[0];
}

export const ExamRunner: React.FC<ExamRunnerProps> = ({
  mode,
  progress,
  onProgressUpdated,
  onStartRemedialUnit,
  onBack,
}) => {
  const attemptSeed = useMemo(() => {
    const historyLen = Object.keys(progress.examScores).length;
    const pathLen = progress.completedPathIds.length;
    return Date.now() ^ ((historyLen + 1) * 7919) ^ (pathLen * 104729);
  }, []);

  // Exam definitions
  const semesterExam = mode.kind === 'semester' ? EXAM_MAP[mode.examId] : undefined;
  const skipEntry = mode.kind === 'skip' ? SKIP_EXAM_MAP[mode.skipExamId] : undefined;

  const semesterRun = useMemo(() => {
    if (mode.kind !== 'semester') return null;
    return generateSemesterExamRun(mode.examId, attemptSeed);
  }, [mode, attemptSeed]);

  const skipRun = useMemo(() => {
    if (mode.kind !== 'skip') return null;
    return generateStageSkipExamRun(mode.skipExamId, attemptSeed);
  }, [mode, attemptSeed]);

  // Remedial gate check for semester & skip
  const remedialGateId =
    mode.kind === 'semester' ? mode.examId : mode.kind === 'skip' ? mode.skipExamId : null;
  const remedialStatus = remedialGateId ? getRemedialStatus(progress, remedialGateId) : null;

  // Runner phases
  type Phase = 'intro' | 'subtest_active' | 'uas_part2' | 'report';
  const [phase, setPhase] = useState<Phase>('intro');

  // For semester mode: subtests 0..3; for skip mode: single 0; for placement: adaptive block 1..3
  const [subtestIdx, setSubtestIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, number>>({});
  const [logs, setLogs] = useState<AnswerLogEntry[]>([]);
  const [subtestScores, setSubtestScores] = useState<Record<ExamSubtestId, number>>({
    LF: 0,
    PK: 0,
    PF: 0,
    PD: 0,
  });

  // Placement adaptive tracking
  const [placementBlockNum, setPlacementBlockNum] = useState<1 | 2 | 3>(1);
  const [hasSubmittedFirstPlacementBlock, setHasSubmittedFirstPlacementBlock] = useState(false);
  const [highestPlacementPassed, setHighestPlacementPassed] = useState<0 | 1 | 2 | 3>(0);

  const placementRun = useMemo(() => {
    if (mode.kind !== 'placement') return null;
    return generatePlacementBlockRun(placementBlockNum, attemptSeed);
  }, [mode.kind, placementBlockNum, attemptSeed]);

  // Timer
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Report state
  const [finalRecord, setFinalRecord] = useState<ExamScoreRecord | null>(null);
  const [perfResult, setPerfResult] = useState<StorySimPerformanceResult | null>(null);
  const [placementTargetUnitId, setPlacementTargetUnitId] = useState<string>('S1.U1');
  const [showReview, setShowReview] = useState(false);

  // Active question list & metadata for the current screen
  const activeBatch = useMemo(() => {
    if (mode.kind === 'semester' && semesterRun) {
      const st = semesterRun.subtests[subtestIdx];
      return st
        ? {
            label: `Subtes ${subtestIdx + 1}/4 • ${st.subtestId}: ${st.titleId}`,
            durationSec: st.durationSec,
            questions: st.questions,
            isNonReturnable: true,
          }
        : null;
    }
    if (mode.kind === 'skip' && skipRun) {
      return {
        label: `Uji Lompat 1 Stage • ${skipRun.stageTitleId}`,
        durationSec: 240,
        questions: skipRun.questions,
        isNonReturnable: false,
      };
    }
    if (mode.kind === 'placement' && placementRun) {
      return {
        label: placementRun.titleId,
        durationSec: placementRun.durationSec,
        questions: placementRun.questions,
        isNonReturnable: true,
      };
    }
    return null;
  }, [mode.kind, semesterRun, subtestIdx, skipRun, placementRun]);

  // Countdown tick during subtest_active
  useEffect(() => {
    if (phase !== 'subtest_active') return;
    if (secondsLeft <= 0) {
      handleSubmitCurrentBatch(true);
      return;
    }
    timerRef.current = window.setTimeout(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, secondsLeft]);

  const startExamSession = () => {
    playClick();
    if (mode.kind === 'placement') {
      const marked = markPlacementInProgress(progress);
      onProgressUpdated(marked);
      setPlacementBlockNum(1);
      setHighestPlacementPassed(0);
      setHasSubmittedFirstPlacementBlock(false);
    }
    setSubtestIdx(0);
    setQIdx(0);
    setCurrentAnswers({});
    setLogs([]);
    const dur =
      mode.kind === 'semester' && semesterRun
        ? semesterRun.subtests[0].durationSec
        : mode.kind === 'skip'
        ? 240
        : 240;
    setSecondsLeft(dur);
    setPhase('subtest_active');
  };

  const handleSelectOption = (questionId: string, optIdx: number) => {
    playClick();
    setCurrentAnswers((prev) => ({ ...prev, [questionId]: optIdx }));
  };

  const handleSubmitCurrentBatch = (autoTimeout = false) => {
    if (!activeBatch || phase !== 'subtest_active') return;
    if (!autoTimeout) playClick();

    const batchLogs: AnswerLogEntry[] = activeBatch.questions.map((q) => {
      const chosen = currentAnswers[q.id] ?? null;
      return {
        question: q,
        chosenIndex: chosen,
        isCorrect: chosen === q.correctIndex,
      };
    });

    const nextLogs = [...logs, ...batchLogs];
    setLogs(nextLogs);

    const correctCount = batchLogs.filter((l) => l.isCorrect).length;
    const pct =
      batchLogs.length > 0 ? Math.round((correctCount / batchLogs.length) * 100) : 0;

    // 1. SEMESTER MODE (4 non-returnable subtests)
    if (mode.kind === 'semester' && semesterRun && semesterExam) {
      const currentSub = semesterRun.subtests[subtestIdx];
      const nextSubScores = {
        ...subtestScores,
        [currentSub.subtestId]: pct,
      };
      setSubtestScores(nextSubScores);

      if (subtestIdx + 1 < semesterRun.subtests.length) {
        const nextIdx = subtestIdx + 1;
        setSubtestIdx(nextIdx);
        setQIdx(0);
        setCurrentAnswers({});
        setSecondsLeft(semesterRun.subtests[nextIdx].durationSec);
        return;
      }

      // Finished all 4 subtests (Part 1 Knowledge)
      const totalQ = nextLogs.length;
      const totalCorrect = nextLogs.filter((l) => l.isCorrect).length;
      const knowledgePercent = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0;

      if (semesterExam.type === 'UAS' && semesterExam.performancePart) {
        setPhase('uas_part2');
        return;
      }

      // UTS Final Grading: >=80% total AND each subtest >= minSubtestPercent
      const allSubtestsMet = semesterExam.subtests.every(
        (st) => (nextSubScores[st.subtestId] ?? 0) >= st.minSubtestPercent
      );
      const passed = knowledgePercent >= semesterExam.passTotalPercent && allSubtestsMet;
      const weakestUnitId = computeWeakestUnit(nextLogs);

      const rec: ExamScoreRecord = {
        passed,
        knowledgePercent,
        combinedPercent: knowledgePercent,
        subtestScores: nextSubScores,
        weakestUnitId,
        takenAt: Date.now(),
      };
      finalizeSemesterExam(rec);
      return;
    }

    // 2. SKIP STAGE MODE
    if (mode.kind === 'skip' && skipRun) {
      const passed = pct >= skipRun.passPercent;
      const weakestUnitId = computeWeakestUnit(nextLogs);
      const rec: ExamScoreRecord = {
        passed,
        knowledgePercent: pct,
        combinedPercent: pct,
        subtestScores: { LF: pct, PK: pct, PF: pct, PD: pct },
        weakestUnitId,
        takenAt: Date.now(),
      };
      if (passed) {
        playWin();
        vibrateSuccess();
      } else {
        playLose();
        vibrateError();
      }
      setFinalRecord(rec);
      const updated = applySkipStageResult(progress, mode.skipExamId, rec);
      onProgressUpdated(updated);
      setPhase('report');
      return;
    }

    // 3. ADAPTIVE PLACEMENT TEST MODE (Submit-Only Protection)
    if (mode.kind === 'placement' && placementRun) {
      setHasSubmittedFirstPlacementBlock(true);
      const blockPassed = pct >= placementRun.passPercent;

      if (blockPassed && placementBlockNum < 3) {
        const passedNow = placementBlockNum as 1 | 2;
        setHighestPlacementPassed(passedNow);
        const nextBlock = (placementBlockNum + 1) as 2 | 3;
        setPlacementBlockNum(nextBlock);
        setQIdx(0);
        setCurrentAnswers({});
        setSecondsLeft(240);
        playCorrect();
        vibrateSuccess();
        return;
      }

      const finalHighest: 0 | 1 | 2 | 3 = blockPassed
        ? (placementBlockNum as 1 | 2 | 3)
        : highestPlacementPassed;
      finalizePlacement(finalHighest, nextLogs, pct);
    }
  };

  const finalizePlacement = (
    highestPassed: 0 | 1 | 2 | 3,
    allLogs: AnswerLogEntry[],
    lastPct: number
  ) => {
    const totalCorrect = allLogs.filter((l) => l.isCorrect).length;
    const totalPct = allLogs.length > 0 ? Math.round((totalCorrect / allLogs.length) * 100) : lastPct;
    const updated = applyPlacementResult(progress, highestPassed);
    setPlacementTargetUnitId(updated.placementTest.placedUnitId || 'S1.U1');
    onProgressUpdated(updated);

    if (highestPassed > 0) {
      playWin();
      vibrateSuccess();
    } else {
      playClick();
    }

    setFinalRecord({
      passed: highestPassed > 0,
      knowledgePercent: totalPct,
      combinedPercent: totalPct,
      subtestScores: { LF: totalPct, PK: totalPct, PF: totalPct, PD: totalPct },
      weakestUnitId: computeWeakestUnit(allLogs),
      takenAt: Date.now(),
    });
    setPhase('report');
  };

  const handleUasPart2Complete = (simResult: StorySimCompleteResult) => {
    if (mode.kind !== 'semester' || !semesterExam || !semesterExam.performancePart) return;
    const perf = simResult.performanceResult;
    const totalQ = logs.length;
    const totalCorrect = logs.filter((l) => l.isCorrect).length;
    const knowledgePercent = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0;

    const perfScore = perf?.overallScore ?? simResult.score;
    const combinedPercent = Math.round(knowledgePercent * 0.5 + perfScore * 0.5);

    const allSubtestsMet = semesterExam.subtests.every(
      (st) => (subtestScores[st.subtestId] ?? 0) >= st.minSubtestPercent
    );
    const part1MinOk = knowledgePercent >= (semesterExam.passPart1MinPercent ?? 75);
    const part2MinOk =
      !perf?.cashflowInsolvency && perfScore >= semesterExam.performancePart.passMinScore;
    const passed =
      part1MinOk &&
      allSubtestsMet &&
      part2MinOk &&
      combinedPercent >= semesterExam.passTotalPercent;

    setPerfResult(perf || null);
    const rec: ExamScoreRecord = {
      passed,
      knowledgePercent,
      performanceScore: perfScore,
      performanceLevel: perf?.level,
      cashflowInsolvency: perf?.cashflowInsolvency,
      combinedPercent,
      subtestScores,
      weakestUnitId: computeWeakestUnit(logs),
      takenAt: Date.now(),
    };
    finalizeSemesterExam(rec);
  };

  const finalizeSemesterExam = (rec: ExamScoreRecord) => {
    if (mode.kind !== 'semester') return;
    if (rec.passed) {
      playWin();
      vibrateSuccess();
    } else {
      playLose();
      vibrateError();
    }
    setFinalRecord(rec);
    const updated = applySemesterExamResult(progress, mode.examId, rec);
    onProgressUpdated(updated);
    setPhase('report');
  };

  const handleSafeBackClick = () => {
    playClick();
    // Submit-Only protection: if placement user submitted Block 1+ and then quits early before finishing Block 3, save highestPassed
    if (
      mode.kind === 'placement' &&
      phase === 'subtest_active' &&
      hasSubmittedFirstPlacementBlock &&
      !progress.placementTest.consumedBySubmit
    ) {
      const updated = applyPlacementResult(progress, highestPlacementPassed);
      onProgressUpdated(updated);
    }
    onBack();
  };

  // Format timer mm:ss
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const activeQuestion = activeBatch?.questions[qIdx];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0D1117] pb-16">
      {/* Top Bar */}
      <header className="sticky top-0 z-20 bg-[#FAFAFA]/95 backdrop-blur-md px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSafeBackClick}
            className="w-10 h-10 rounded-full bg-[#F4F5F7] hover:bg-slate-200 flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Keluar Ujian"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0 text-center">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#059669] truncate">
              {mode.kind === 'semester' && semesterExam
                ? `${semesterExam.type} • ${semesterExam.coversUnitRange}`
                : mode.kind === 'skip' && skipEntry
                ? `Lompat 1 Stage • Unit ${skipEntry.unit.unitNumber}`
                : 'TPB · CIKO'}
            </p>
            <h1 className="text-sm sm:text-base font-extrabold text-[#0D1117] truncate">
              {mode.kind === 'semester' && semesterExam
                ? semesterExam.titleId
                : mode.kind === 'skip' && skipEntry
                ? `Uji Kompetensi Stage ${skipEntry.stage.stageNumber}`
                : 'Tes Penempatan Bersama'}
            </h1>
          </div>

          {phase === 'subtest_active' ? (
            <div
              className={`px-3.5 py-2 rounded-full text-xs font-extrabold tabular-nums inline-flex items-center gap-1.5 shrink-0 ${
                secondsLeft <= 20
                  ? 'bg-[#FCE8E6] text-[#A50E0E]'
                  : 'bg-[#0D1117] text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {mm}:{ss}
            </div>
          ) : (
            <div className="w-10 shrink-0" />
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-2">
        {/* ==================== PHASE: INTRO ==================== */}
        {phase === 'intro' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <CikoMascot size={76} pose="scholar" animated={false} />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#F4F5F7] text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                    {mode.kind === 'semester' && semesterExam?.calibrationStatus === 'baseline_v1'
                      ? 'Kalibrasi: Baseline v1.0'
                      : mode.kind === 'placement'
                      ? 'Maks Semester 4 • 3 Blok Evaluasi'
                      : 'Lompat 1 Stage Maju'}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-[#0D1117] font-[Poppins]">
                  {mode.kind === 'semester' && semesterExam
                    ? semesterExam.titleId
                    : mode.kind === 'skip' && skipEntry
                    ? `Lompati Stage ${skipEntry.stage.stageNumber}: ${skipEntry.stage.titleId}`
                    : 'Tes Penempatan Bersama'}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {mode.kind === 'semester' && semesterExam?.type === 'UTS' && (
                    <>
                      Format 4 Subtes ber-timer yang <strong>tidak bisa kembali</strong> ke subtes sebelumnya.
                      Syarat lulus: Total minimal <strong>80%</strong> serta lolos ambang minimum setiap subtes.
                    </>
                  )}
                  {mode.kind === 'semester' && semesterExam?.type === 'UAS' && (
                    <>
                      Terdiri dari <strong>Bagian 1: 4 Subtes Pengetahuan · bobot 50%</strong> dan{' '}
                      <strong>Bagian 2: Proyek Kinerja Simulasi · bobot 50%</strong>. Wajib memenuhi batas pengetahuan,
                      kompetensi proyek tanpa insolvensi kas, dan total akhir minimal <strong>80%</strong>.
                    </>
                  )}
                  {mode.kind === 'skip' && (
                    <>
                      Uji cepat 6 soal (4 menit, minimal tepat 5/6 = 80%) untuk melompati tepat 1 Pos aktif tanpa mengulang Keping Materi dasar.
                    </>
                  )}
                  {mode.kind === 'placement' && (
                    <>
                      Ujian pemetaan Tes Penempatan Bersama untuk mengukur kesiapan semester dasar sebelum memulai materi. Lulus ≥80% pada Blok 1 sampai Blok 3 menempatkanmu langsung hingga Semester 4. Kesempatan 1× hanya tercatat setelah kamu menekan submit blok.
                    </>
                  )}
                </p>
              </div>
            </div>

            {mode.kind === 'placement' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {PLACEMENT_BLOCKS.map((blk) => (
                  <div key={blk.blockNumber} className="bg-[#F4F5F7] rounded-2xl p-3.5">
                    <div className="flex items-center justify-between text-xs font-extrabold text-[#0D1117]">
                      <span>Blok {blk.blockNumber} TPB</span>
                      <span className="text-[#059669]">Lulus ≥80%</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      Tuntaskan {blk.sourceSemesters.join(', ')} dan lanjut ke {blk.targetOnPass.semesterId}.
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Subtest Breakdown for UTS / UAS */}
            {mode.kind === 'semester' && semesterExam && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {semesterExam.subtests.map((st, idx) => (
                  <div key={st.subtestId} className="bg-[#F4F5F7] rounded-2xl p-3.5">
                    <div className="flex items-center justify-between text-xs font-extrabold text-[#0D1117]">
                      <span>
                        {idx + 1}. {st.subtestId} • {st.titleId}
                      </span>
                      <span className="tabular-nums text-[#059669]">{st.durationSec}d</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 tabular-nums">
                      {st.questionCount} soal • Ambang subtes minimal {st.minSubtestPercent}%
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Remedial Lock Warning if active */}
            {remedialStatus?.isLocked ? (
              <div className="bg-[#FFF5F5] rounded-2xl p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-extrabold text-[#991B1B]">
                      Gerbang Remedial Aktif: Mencegah Spam Ujian
                    </p>
                    <p className="text-xs sm:text-sm text-[#7F1D1D] mt-1 leading-relaxed">
                      Anda dapat mengulang ujian ini setelah menunggu{' '}
                      <strong className="tabular-nums">
                        {formatRemainingCooldown(remedialStatus.remainingMs)}
                      </strong>{' '}
                      ATAU menuntaskan{' '}
                      <strong className="tabular-nums">
                        {remedialStatus.requiredPathsCount - remedialStatus.completedPathsCount} Keping Materi lagi
                      </strong>{' '}
                      ({remedialStatus.completedPathsCount}/{remedialStatus.requiredPathsCount} selesai).
                    </p>
                  </div>
                </div>
                {remedialStatus.targetUnitIds[0] && onStartRemedialUnit && (
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      onStartRemedialUnit(remedialStatus.targetUnitIds[0]);
                    }}
                    className="w-full py-3 rounded-full bg-[#DC2626] hover:bg-red-700 text-white text-sm font-bold cursor-pointer"
                  >
                    Buka Keping Materi di Unit Terkait
                  </button>
                )}
              </div>
            ) : mode.kind === 'placement' && progress.placementTest.consumedBySubmit ? (
              <div className="bg-[#F4F5F7] rounded-2xl p-5 text-center space-y-2">
                <p className="text-sm font-bold text-[#0D1117]">
                  Tes Penempatan Bersama 1× Sudah Pernah Digunakan
                </p>
                <p className="text-xs text-slate-600">
                  Akun Anda ditempatkan mulai{' '}
                  <strong>{progress.placementTest.placedUnitId || 'S1.U1'}</strong>. Gunakan alur normal
                  atau ujian UTS/UAS untuk melompat lebih jauh.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-[#FEF7E0] rounded-2xl px-4 py-3 text-xs font-semibold text-[#8C6D00] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>
                    Lompat jalur via ujian langsung membuka akses materi lanjutan tanpa bonus XP atau Koin besar demi keadilan Arena.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={startExamSession}
                  className="w-full py-4 rounded-full bg-[#059669] hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Mulai Ujian Sekarang
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================== PHASE: TIMED SUBTEST ACTIVE ==================== */}
        {phase === 'subtest_active' && activeBatch && activeQuestion && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-600">
              <span>{activeBatch.label}</span>
              <span className="tabular-nums text-[#0D1117]">
                Soal {qIdx + 1} / {activeBatch.questions.length}
              </span>
            </div>

            {activeBatch.isNonReturnable && (
              <div className="bg-[#F4F5F7] rounded-xl px-3.5 py-2 text-[11px] font-bold text-slate-500">
                Subtes ber-timer: Jawaban dikirim per subtes/blok dan tidak dapat dikembalikan ke subtes lalu.
              </div>
            )}

            {/* Question navigation pills within active subtest */}
            <div className="flex gap-1.5">
              {activeBatch.questions.map((q, idx) => {
                const answered = currentAnswers[q.id] !== undefined;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      playClick();
                      setQIdx(idx);
                    }}
                    className={`h-8 flex-1 rounded-xl text-xs font-extrabold tabular-nums transition-colors cursor-pointer ${
                      idx === qIdx
                        ? 'bg-[#0D1117] text-white'
                        : answered
                        ? 'bg-[#ECFDF5] text-[#059669]'
                        : 'bg-[#F4F5F7] text-slate-500'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Optional Detective Document Snippet */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 space-y-4">
              {activeQuestion.documentHeader && (
                <div className="bg-[#F4F5F7] rounded-2xl p-4 space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Bukti {activeQuestion.documentHeader.channel} • {activeQuestion.documentHeader.senderTitle}
                  </p>
                  {activeQuestion.documentHeader.documentLines.map((line, i) => (
                    <p key={i} className="text-xs sm:text-sm font-mono text-[#0D1117]">
                      {line}
                    </p>
                  ))}
                </div>
              )}

              <h3 className="text-base sm:text-lg font-bold text-[#0D1117] leading-relaxed">
                {activeQuestion.promptId}
              </h3>

              <div className="space-y-2.5">
                {activeQuestion.optionsId.map((opt, idx) => {
                  const picked = currentAnswers[activeQuestion.id] === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(activeQuestion.id, idx)}
                      className={`w-full text-left p-4 rounded-2xl flex items-start gap-3 transition-all cursor-pointer ${
                        picked
                          ? 'bg-[#0D1117] text-white'
                          : 'bg-[#F4F5F7] hover:bg-[#EAECEF] text-[#0D1117]'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 ${
                          picked ? 'bg-[#059669] text-white' : 'bg-white text-slate-700'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm font-medium leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  disabled={qIdx === 0}
                  onClick={() => {
                    playClick();
                    setQIdx((i) => Math.max(0, i - 1));
                  }}
                  className="px-5 py-3 rounded-full bg-[#F4F5F7] hover:bg-slate-200 text-xs font-bold text-[#0D1117] disabled:opacity-40 cursor-pointer"
                >
                  Soal Sebelumnya
                </button>

                {qIdx + 1 < activeBatch.questions.length ? (
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setQIdx((i) => i + 1);
                    }}
                    className="px-6 py-3 rounded-full bg-[#059669] hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    Soal Berikutnya
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSubmitCurrentBatch(false)}
                    className="px-6 py-3 rounded-full bg-[#059669] hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {mode.kind === 'semester' && subtestIdx < 3
                      ? 'Kirim & Lanjut Subtes Berikutnya'
                      : mode.kind === 'placement'
                      ? `Submit Blok ${placementBlockNum}`
                      : 'Submit & Lihat Hasil'}
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== PHASE: UAS PART 2 PERFORMANCE PROJECT ==================== */}
        {phase === 'uas_part2' && semesterExam?.performancePart && (
          <div className="space-y-4">
            <div className="bg-[#EEFBF4] rounded-2xl p-4 flex items-center gap-3">
              <Award className="w-5 h-5 text-[#059669] shrink-0" />
              <div className="text-xs sm:text-sm">
                <p className="font-extrabold text-[#064E3B]">
                  Bagian 1 Pengetahuan Selesai, Lanjut Bagian 2: Proyek Kinerja (Tanpa Timer)
                </p>
                <p className="text-[#065F46]">
                  {semesterExam.performancePart.titleId} (Bobot 50% dari Nilai Akhir UAS)
                </p>
              </div>
            </div>

            <StorySimEngine
              data={semesterExam.performancePart.storySimData}
              performanceSpec={semesterExam.performancePart}
              onComplete={handleUasPart2Complete}
            />
          </div>
        )}

        {/* ==================== PHASE: RAPOR & EXPLANATION REVIEW ==================== */}
        {phase === 'report' && finalRecord && (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-center space-y-5">
              <div className="flex justify-center">
                <CikoMascot
                  size={104}
                  pose={finalRecord.passed ? 'wealth' : 'scholar'}
                  animated={finalRecord.passed}
                />
              </div>

              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2 ${
                    finalRecord.passed
                      ? 'bg-[#ECFDF5] text-[#059669]'
                      : 'bg-[#FCE8E6] text-[#A50E0E]'
                  }`}
                >
                  {finalRecord.passed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {mode.kind === 'placement'
                        ? `Ditempatkan di ${placementTargetUnitId}`
                        : 'Lulus Standar Kompetensi!'}
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {mode.kind === 'placement'
                        ? 'Ditempatkan di Semester 1 Unit 1'
                        : 'Belum Memenuhi Syarat Kelulusan'}
                    </>
                  )}
                </span>

                <h2 className="text-2xl font-extrabold text-[#0D1117] font-[Poppins]">
                  {mode.kind === 'placement'
                    ? `Hasil Penempatan: ${UNIT_MAP[placementTargetUnitId]?.titleId || placementTargetUnitId}`
                    : finalRecord.passed
                    ? 'Selamat! Jalur Berikutnya Terbuka'
                    : 'Perkuat Konsep Lewat Jalur Remedial'}
                </h2>
              </div>

              {/* KPI Score Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left tabular-nums">
                <div className="bg-[#F4F5F7] rounded-2xl p-4">
                  <p className="text-[11px] font-bold uppercase text-slate-500">Nilai Akhir</p>
                  <p className="text-2xl font-extrabold text-[#0D1117] mt-1">
                    {finalRecord.combinedPercent}%
                  </p>
                </div>
                <div className="bg-[#F4F5F7] rounded-2xl p-4">
                  <p className="text-[11px] font-bold uppercase text-slate-500">Pengetahuan</p>
                  <p className="text-2xl font-extrabold text-[#0D1117] mt-1">
                    {finalRecord.knowledgePercent}%
                  </p>
                </div>
                {finalRecord.performanceScore !== undefined && (
                  <div className="bg-[#F4F5F7] rounded-2xl p-4 col-span-2 sm:col-span-1">
                    <p className="text-[11px] font-bold uppercase text-slate-500">
                      Proyek Kinerja ({finalRecord.performanceLevel?.toUpperCase()})
                    </p>
                    <p className="text-2xl font-extrabold text-[#059669] mt-1">
                      {finalRecord.performanceScore}
                    </p>
                  </div>
                )}
              </div>

              {/* Subtest Breakdown for Semester UTS/UAS */}
              {mode.kind === 'semester' && semesterExam && (
                <div className="bg-[#F4F5F7] rounded-2xl p-4 text-left space-y-2.5">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Rincian Skor Per Subtes
                  </p>
                  {semesterExam.subtests.map((st) => {
                    const val = finalRecord.subtestScores[st.subtestId] ?? 0;
                    const ok = val >= st.minSubtestPercent;
                    return (
                      <div key={st.subtestId} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-[#0D1117]">
                            {st.subtestId} • {st.titleId} · Min. {st.minSubtestPercent}%
                          </span>
                          <span className={`tabular-nums ${ok ? 'text-[#059669]' : 'text-[#DC2626]'}`}>
                            {val}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${ok ? 'bg-[#059669]' : 'bg-[#DC2626]'}`}
                            style={{ width: `${val}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Weakest Unit Recommendation */}
              {!finalRecord.passed && finalRecord.weakestUnitId && mode.kind !== 'placement' && (
                <div className="bg-[#FFF5F5] rounded-2xl p-4 text-left space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Target className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-extrabold uppercase text-[#991B1B]">
                        Fokus Remedial Paling Prioritas
                      </p>
                      <p className="text-sm font-bold text-[#0D1117] mt-0.5">
                        Unit {UNIT_MAP[finalRecord.weakestUnitId]?.unitNumber}:{' '}
                        {UNIT_MAP[finalRecord.weakestUnitId]?.titleId || finalRecord.weakestUnitId}
                      </p>
                      <p className="text-xs text-[#7F1D1D] mt-1">
                        Selesaikan Keping Materi di unit ini untuk membuka ulang gerbang ujian lebih cepat!
                      </p>
                    </div>
                  </div>
                  {onStartRemedialUnit && (
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        onStartRemedialUnit(finalRecord.weakestUnitId!);
                      }}
                      className="w-full py-3 rounded-full bg-[#DC2626] hover:bg-red-700 text-white text-sm font-bold cursor-pointer"
                    >
                      Latihan Remedial Unit {UNIT_MAP[finalRecord.weakestUnitId]?.unitNumber} Sekarang
                    </button>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setShowReview((s) => !s);
                  }}
                  className="flex-1 py-3.5 px-5 rounded-full bg-[#F4F5F7] hover:bg-slate-200 text-xs sm:text-sm font-bold text-[#0D1117] inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  Pembahasan Soal ({logs.filter((l) => !l.isCorrect).length} Salah / {logs.length} Soal)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onBack();
                  }}
                  className="flex-1 py-3.5 px-5 rounded-full bg-[#0D1117] hover:bg-slate-800 text-white text-xs sm:text-sm font-bold cursor-pointer"
                >
                  Kembali ke Akademi CIKO
                </button>
              </div>
            </div>

            {/* Expandable Full Explanation Review for Missed/All Items */}
            {showReview && (
              <div className="space-y-4">
                {logs.map((entry, idx) => (
                  <div key={`${entry.question.id}-${idx}`} className="bg-white rounded-3xl p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">
                        Soal #{idx + 1} • {entry.question.unitId} • {entry.question.subtestId}
                      </span>
                      <span className={entry.isCorrect ? 'text-[#059669]' : 'text-[#DC2626]'}>
                        {entry.isCorrect ? 'Tepat' : 'Keliru'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-[#0D1117]">{entry.question.promptId}</p>
                    <p className="text-xs text-slate-600">
                      <strong>Jawaban Benar:</strong> {entry.question.optionsId[entry.question.correctIndex]}
                    </p>
                    <ExplanationCard
                      spec={entry.question.explanationCard}
                      isCorrect={entry.isCorrect}
                      hideContinue
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExamRunner;
