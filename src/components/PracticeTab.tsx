import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Coins,
  Dumbbell,
  Heart,
  Layers,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Users,
} from 'lucide-react';
import { CURRICULUM_SEMESTERS, PATH_MAP, UNIT_MAP } from '../curriculum';
import type { LessonConfig, UserCurriculumProgress } from '../curriculum/types';
import { useTranslation } from '../lib/LanguageContext';
import { playClick, playCorrect, playWin } from '../lib/audio';
import { vibrateLight, vibrateSuccess } from '../lib/haptics';
import {
  LIFE_SHOP_COST_COINS,
  MAX_LIVES,
  getDailyHeartRecoveryStatus,
} from '../lib/rewardUtils';
import CikoMascot from './CikoMascot';

interface FlashcardItem {
  id: string;
  category: string;
  front: string;
  back: string;
}

interface PracticeTabProps {
  user: any;
  userData: any;
  progress: UserCurriculumProgress;
  onStartReviewLesson: (lesson: LessonConfig, reviewItemIds: string[]) => void;
  onFlashcardCompleted: () => Promise<void>;
  onBuyLifeWithCoins: () => Promise<void>;
  onOpenSocial: () => void;
}

function buildFlashcardDeck(
  progress: UserCurriculumProgress,
  lang: string
): FlashcardItem[] {
  const pool: FlashcardItem[] = [];
  const seenFronts = new Set<string>();

  const pushUnique = (item: FlashcardItem) => {
    const key = item.front.trim().toUpperCase();
    if (!key || !item.back.trim() || seenFronts.has(key)) return;
    seenFronts.add(key);
    pool.push(item);
  };

  const allUnits = CURRICULUM_SEMESTERS.flatMap((s) => s.units);
  const unlockedUnits = allUnits.filter((u) => progress.unlockedUnitIds.includes(u.id));
  // Ensure fresh learners still have a rich formal pool across Semester 1 fundamentals
  const sourceUnits =
    unlockedUnits.length >= 2
      ? unlockedUnits
      : [...unlockedUnits, ...(CURRICULUM_SEMESTERS[0]?.units || [])];

  for (const unit of sourceUnits) {
    // 1. Formal KBBI/BI/OJK terms from curriculum FinWordle paths
    for (const stage of unit.stages) {
      for (const path of stage.paths) {
        if (path.activity.mechanic === 'FinWordle') {
          path.activity.words.forEach((w, idx) => {
            pushUnique({
              id: `term-${path.pathId}-${idx}`,
              category:
                lang === 'id'
                  ? `Istilah Resmi • Unit ${unit.unitNumber}`
                  : `Key Term • Unit ${unit.unitNumber}`,
              front: w.word,
              back:
                lang === 'id'
                  ? w.definitionId || w.clueId
                  : w.definitionEn || w.clueEn || w.definitionId || w.clueId,
            });
          });
        }
      }
    }

    // 2. Key practical rules from unlocked unit Guidebook
    if (progress.unlockedUnitIds.includes(unit.id)) {
      unit.guidebook.keyRulesId.forEach((rule, i) => {
        const colonIdx = rule.indexOf(':');
        if (colonIdx > 3 && colonIdx < 55) {
          pushUnique({
            id: `rule-${unit.id}-${i}`,
            category: `Buku Saku • Unit ${unit.unitNumber}`,
            front: rule.slice(0, colonIdx).trim(),
            back: rule.slice(colonIdx + 1).trim(),
          });
        } else {
          pushUnique({
            id: `rule-${unit.id}-${i}`,
            category: `Buku Saku • Unit ${unit.unitNumber}`,
            front: unit.titleId,
            back: rule,
          });
        }
      });
    }
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 6);
}

export function PracticeTab({
  user,
  userData,
  progress,
  onStartReviewLesson,
  onFlashcardCompleted,
  onBuyLifeWithCoins,
  onOpenSocial,
}: PracticeTabProps) {
  const { language } = useTranslation();
  const [buyingLife, setBuyingLife] = useState(false);

  // Flashcard session state
  const [flashcardDeck, setFlashcardDeck] = useState<FlashcardItem[] | null>(null);
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [flashcardDone, setFlashcardDone] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [flashcardDeck, flashcardDone]);

  const lives = userData?.lives !== undefined ? userData.lives : MAX_LIVES;
  const coins = userData?.totalCoins ?? userData?.coins ?? 0;
  const recoveryStatus = getDailyHeartRecoveryStatus(userData, user?.uid);

  const mistakeGroups = useMemo(() => {
    const map: Record<string, { pathId: string; unitId: string; itemIds: string[] }> = {};
    for (const m of progress.mistakeBank) {
      if (!map[m.pathId]) {
        map[m.pathId] = { pathId: m.pathId, unitId: m.unitId, itemIds: [] };
      }
      if (!map[m.pathId].itemIds.includes(m.itemId)) {
        map[m.pathId].itemIds.push(m.itemId);
      }
    }
    return Object.values(map).filter((g) => Boolean(PATH_MAP[g.pathId]));
  }, [progress.mistakeBank]);

  const startFlashcards = () => {
    playClick();
    const deck = buildFlashcardDeck(progress, language);
    setFlashcardDeck(deck);
    setCardIdx(0);
    setIsFlipped(false);
    setMasteredCount(0);
    setFlashcardDone(false);
  };

  const handleCardAnswer = async (understood: boolean) => {
    if (!flashcardDeck) return;
    if (understood) {
      playCorrect();
      vibrateLight();
      const nextMastered = masteredCount + 1;
      setMasteredCount(nextMastered);

      if (cardIdx + 1 < flashcardDeck.length) {
        setCardIdx((prev) => prev + 1);
        setIsFlipped(false);
      } else {
        playWin();
        vibrateSuccess();
        setFlashcardDone(true);
        await onFlashcardCompleted();
      }
    } else {
      playClick();
      const currentCard = flashcardDeck[cardIdx];
      // Re-queue forgotten card once at the end if deck still under 10 cards
      const updatedDeck =
        flashcardDeck.length < 10 ? [...flashcardDeck, currentCard] : flashcardDeck;
      setFlashcardDeck(updatedDeck);
      if (cardIdx + 1 < updatedDeck.length) {
        setCardIdx((prev) => prev + 1);
        setIsFlipped(false);
      } else {
        setFlashcardDone(true);
        await onFlashcardCompleted();
      }
    }
  };

  const handleBuyLife = async () => {
    if (buyingLife) return;
    playClick();
    setBuyingLife(true);
    try {
      await onBuyLifeWithCoins();
    } finally {
      setBuyingLife(false);
    }
  };

  // Active Flashcard Drill View
  if (flashcardDeck) {
    const activeCard = flashcardDeck[cardIdx];
    return (
      <div className="w-full pt-6 pb-28 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              playClick();
              setFlashcardDeck(null);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4F5F7] hover:bg-slate-200 text-xs font-bold text-[#0D1117] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'id' ? 'Kembali' : 'Back'}</span>
          </button>

          <span className="text-xs font-extrabold uppercase tracking-wider text-[#059669]">
            Flashcard Kilat
          </span>

          <span className="text-xs font-black text-[#0D1117] tabular-nums bg-white px-3 py-1.5 rounded-full">
            {Math.min(cardIdx + 1, flashcardDeck.length)} / {flashcardDeck.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#059669] transition-all duration-300"
            style={{
              width: `${
                flashcardDone
                  ? 100
                  : Math.round(((cardIdx + (isFlipped ? 0.5 : 0)) / flashcardDeck.length) * 100)
              }%`,
            }}
          />
        </div>

        {!flashcardDone && activeCard ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => {
                playClick();
                setIsFlipped((prev) => !prev);
              }}
              className={`w-full min-h-[260px] rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left transition-colors cursor-pointer ${
                isFlipped ? 'bg-[#EEFBF4]' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2 w-full">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#059669]">
                  {isFlipped
                    ? language === 'id'
                      ? 'Penjelasan & Konsep'
                      : 'Concept & Meaning'
                    : activeCard.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                  <RefreshCw className="w-3.5 h-3.5" />
                  {language === 'id' ? 'Ketuk untuk balik' : 'Tap to flip'}
                </span>
              </div>

              <div className="my-6">
                {!isFlipped ? (
                  <h2 className="text-2xl sm:text-3xl font-poppins font-black text-[#0D1117] leading-snug">
                    {activeCard.front}
                  </h2>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      {activeCard.front}
                    </p>
                    <p className="text-base sm:text-lg font-bold text-[#064E3B] leading-relaxed">
                      {activeCard.back}
                    </p>
                  </div>
                )}
              </div>

              <p className="text-xs font-medium text-slate-500">
                {!isFlipped
                  ? language === 'id'
                    ? 'Coba ingat artinya sebelum membuka kartu.'
                    : 'Recall the meaning before flipping.'
                  : language === 'id'
                    ? 'Pilih kejujuran pemahamanmu di bawah.'
                    : 'Mark whether you knew this card below.'}
              </p>
            </button>

            {isFlipped ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleCardAnswer(false)}
                  className="py-3.5 px-4 rounded-full bg-[#FFF1F2] hover:bg-rose-100 text-rose-700 font-bold text-sm cursor-pointer transition-colors"
                >
                  {language === 'id' ? 'Masih Lupa' : 'Review Again'}
                </button>
                <button
                  type="button"
                  onClick={() => handleCardAnswer(true)}
                  className="py-3.5 px-4 rounded-full bg-[#059669] hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer transition-colors"
                >
                  {language === 'id' ? 'Sudah Paham' : 'Got It'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setIsFlipped(true);
                }}
                className="w-full py-3.5 px-5 rounded-full bg-[#0D1117] hover:bg-slate-800 text-white font-bold text-sm cursor-pointer transition-colors"
              >
                {language === 'id' ? 'Lihat Jawaban' : 'Reveal Answer'}
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 text-center space-y-5">
            <div className="flex justify-center">
              <CikoMascot size={104} pose="scholar" animated />
            </div>
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] text-xs font-extrabold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'id' ? 'Sesi Flashcard Tuntas!' : 'Flashcard Complete!'}</span>
              </span>
              <h2 className="text-2xl font-poppins font-black text-[#0D1117]">
                {masteredCount} {language === 'id' ? 'Kartu Dikuasai' : 'Cards Mastered'}
              </h2>
              <p className="text-sm text-slate-600 font-medium">
                {language === 'id'
                  ? 'Ingatan konsep dan istilah keuanganmu makin tajam. Hadiah +5 Koin dan +5 XP ditambahkan.'
                  : 'Your financial memory is sharper. +5 Coins and +5 XP added.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={startFlashcards}
                className="flex-1 py-3.5 px-5 rounded-full bg-[#F4F5F7] hover:bg-slate-200 text-sm font-bold text-[#0D1117] cursor-pointer"
              >
                {language === 'id' ? 'Acak 6 Kartu Lagi' : 'Another 6 Cards'}
              </button>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setFlashcardDeck(null);
                }}
                className="flex-1 py-3.5 px-5 rounded-full bg-[#059669] hover:bg-emerald-700 text-white text-sm font-bold cursor-pointer"
              >
                {language === 'id' ? 'Selesai' : 'Done'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full pt-6 pb-28 space-y-8">
      {/* Header Banner */}
      <section className="bg-white rounded-3xl p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#059669]">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Pusat Latihan' : 'Practice Hub'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-poppins font-black text-[#0D1117] tracking-tight leading-tight">
              {language === 'id' ? 'Latihan & Tebus Nyawa' : 'Practice & Heart Recovery'}
            </h1>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              {lives < MAX_LIVES
                ? language === 'id'
                  ? 'Semua latihan di sini tanpa potongan nyawa. Selesaikan Bank Kesalahan atau Flashcard untuk menebus +1 Nyawa Ekspedisi.'
                  : 'Every drill here is life-free. Complete Mistake Review or Flashcards to recover +1 Expedition Heart.'
                : language === 'id'
                  ? 'Nyawamu sedang penuh. Gunakan arena ini untuk menyegarkan ingatan konsep atau membersihkan Bank Kesalahan.'
                  : 'Your hearts are full. Use this space to refresh concepts or clear your Mistake Bank.'}
            </p>
          </div>
          <div className="shrink-0 hidden sm:block">
            <CikoMascot size={68} pose="hero" animated={false} />
          </div>
        </div>

        {/* Heart Status & Anti-Spam Quota Strip */}
        <div className="bg-[#F4F5F7] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: MAX_LIVES }).map((_, idx) => (
                <Heart
                  key={idx}
                  className={`w-5 h-5 ${
                    idx < lives
                      ? 'text-rose-500 fill-rose-500'
                      : 'text-slate-300 fill-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-black text-[#0D1117] tabular-nums ml-1">
              {lives}/{MAX_LIVES}
            </span>
          </div>

          <div className="text-xs font-bold text-slate-600 tabular-nums">
            {recoveryStatus.remaining > 0 ? (
              <span>
                {language === 'id'
                  ? `Kuota tebus gratis hari ini: tersisa ${recoveryStatus.remaining} dari ${recoveryStatus.limit}`
                  : `Daily free recovery left: ${recoveryStatus.remaining} of ${recoveryStatus.limit}`}
              </span>
            ) : (
              <span className="text-amber-700">
                {language === 'id'
                  ? `Kuota tebus gratis hari ini sudah terpakai ${recoveryStatus.limit}/${recoveryStatus.limit}`
                  : `Daily free recovery limit reached ${recoveryStatus.limit}/${recoveryStatus.limit}`}
              </span>
            )}
          </div>
        </div>

        {/* Extra Heart Refill Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            disabled={buyingLife || lives >= MAX_LIVES || coins < LIFE_SHOP_COST_COINS}
            onClick={handleBuyLife}
            className={`rounded-2xl p-4 text-left flex items-center justify-between gap-3 transition-colors ${
              lives >= MAX_LIVES || coins < LIFE_SHOP_COST_COINS
                ? 'bg-[#F4F5F7] text-slate-400 cursor-not-allowed'
                : 'bg-[#FEF7E0] hover:bg-amber-100 text-[#8C6D00] cursor-pointer'
            }`}
          >
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-wider">
                {language === 'id' ? 'Tukar Koin Saku' : 'Coin Refill'}
              </p>
              <p className="text-sm font-black mt-0.5">
                {lives >= MAX_LIVES
                  ? language === 'id'
                    ? 'Nyawa Sudah Penuh'
                    : 'Hearts Full'
                  : language === 'id'
                    ? `Tambah +1 Nyawa · ${LIFE_SHOP_COST_COINS} Koin`
                    : `Get +1 Heart · ${LIFE_SHOP_COST_COINS} Coins`}
              </p>
            </div>
            <Coins className="w-5 h-5 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => {
              playClick();
              onOpenSocial();
            }}
            className="rounded-2xl p-4 text-left bg-[#F4F5F7] hover:bg-slate-200 text-[#0D1117] flex items-center justify-between gap-3 transition-colors cursor-pointer"
          >
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                {language === 'id' ? 'Dukungan Komunitas' : 'Friend Support'}
              </p>
              <p className="text-sm font-black mt-0.5">
                {language === 'id' ? 'Minta atau Kirim Nyawa' : 'Ask or Send Hearts'}
              </p>
            </div>
            <Users className="w-5 h-5 text-[#059669] shrink-0" />
          </button>
        </div>
      </section>

      {/* Section 1: Tebus Kesalahan Ekspedisi */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg font-poppins font-black text-[#0D1117]">
              {language === 'id' ? 'Tebus Kesalahan Ekspedisi' : 'Expedition Mistake Review'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'id'
                ? 'Perbaiki soal yang pernah salah di jalur kurikulum.'
                : 'Fix previously missed questions from your learning path.'}
            </p>
          </div>
          {progress.mistakeBank.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-[#FFF5F5] text-[#B91C1C] text-xs font-extrabold tabular-nums">
              {progress.mistakeBank.length} butir
            </span>
          )}
        </div>

        {mistakeGroups.length > 0 ? (
          <div className="space-y-2.5">
            {mistakeGroups.map((group) => {
              const path = PATH_MAP[group.pathId];
              const unit = UNIT_MAP[group.unitId];
              return (
                <div
                  key={group.pathId}
                  className="bg-white rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-[#FFF5F5] text-[#B91C1C] flex items-center justify-center shrink-0">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 truncate">
                        Unit {unit?.unitNumber || '?'} · {group.itemIds.length} butir salah
                      </p>
                      <h3 className="text-sm sm:text-base font-black text-[#0D1117] truncate">
                        {path.titleId}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      onStartReviewLesson(path, group.itemIds);
                    }}
                    className="px-4 py-2.5 rounded-full bg-[#059669] hover:bg-emerald-700 text-white text-xs font-bold shrink-0 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>{language === 'id' ? 'Latih & Tebus' : 'Review'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[#EEFBF4] text-[#059669] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-[#0D1117]">
                {language === 'id' ? 'Bank Kesalahan Bersih!' : 'Mistake Bank Clear!'}
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {language === 'id'
                  ? 'Belum ada soal salah dari Ekspedisi. Gunakan Flashcard Kilat di bawah untuk pemanasan atau menebus nyawa.'
                  : 'No missed questions yet. Use Quick Flashcards below to warm up or recover hearts.'}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Section 2: Flashcard Konsep & Istilah (Pengganti 4 Minigame Lama) */}
      <section className="space-y-3">
        <div className="px-1">
          <h2 className="text-lg font-poppins font-black text-[#0D1117]">
            {language === 'id' ? 'Flashcard Konsep & Istilah' : 'Concept Flashcards'}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {language === 'id'
              ? 'Ulas cepat istilah keuangan dan aturan Buku Saku dalam 6 kartu bolak-balik.'
              : 'Quickly review financial terms and Guidebook rules in 6 flip cards.'}
          </p>
        </div>

        <button
          type="button"
          onClick={startFlashcards}
          className="w-full rounded-3xl p-5 sm:p-6 bg-[#EEFBF4] hover:bg-emerald-100/70 flex items-center gap-4 text-left transition-colors cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-2xl bg-white text-[#059669] flex items-center justify-center shrink-0">
            <Layers className="w-7 h-7" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#059669]">
                {language === 'id' ? '6 Kartu Kilat' : '6 Quick Cards'}
              </span>
              {lives < MAX_LIVES && recoveryStatus.remaining > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#059669]">
                  <Sparkles className="w-3 h-3" /> +1 Nyawa
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-poppins font-black text-[#0D1117] truncate">
              {language === 'id' ? 'Mulai Flashcard Istilah & Rumus' : 'Start Financial Flashcards'}
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              {language === 'id'
                ? 'Materi diambil langsung dari Buku Saku unit aktif dan bank istilah keuangan.'
                : 'Pulled directly from your unlocked unit guidebooks and financial glossary.'}
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 text-[#0D1117] group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </section>
    </div>
  );
}

export default PracticeTab;
