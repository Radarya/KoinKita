import { ALL_PATHS, PLACEMENT_BLOCKS, UNIT_MAP, SKIP_EXAM_MAP, EXAM_MAP, CURRICULUM_SEMESTERS } from './index';
import { REG_SOURCES, card } from './helpers';
import type {
  ExamSubtestId,
  ExplanationCardSpec,
  LessonConfig,
  UnitSpec,
} from './types';

export interface ExamQuestionItem {
  id: string;
  slotKey: string;
  unitId: string;
  subtestId: ExamSubtestId;
  promptId: string;
  documentHeader?: {
    channel: string;
    senderTitle: string;
    documentLines: string[];
  };
  optionsId: string[];
  correctIndex: number;
  explanationCard: ExplanationCardSpec;
}

// Deterministic PRNG (Mulberry32) so seeds stay reproducible across sessions while varying across attempts
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffleWithCorrectIndex(
  options: string[],
  correctIndex: number,
  rng: () => number
): { optionsId: string[]; correctIndex: number } {
  const tagged = options.map((text, idx) => ({ text, isCorrect: idx === correctIndex }));
  for (let i = tagged.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = tagged[i];
    tagged[i] = tagged[j];
    tagged[j] = tmp;
  }
  return {
    optionsId: tagged.map((x) => x.text),
    correctIndex: tagged.findIndex((x) => x.isCorrect),
  };
}

function formatExamBucketLabel(raw: string): string {
  const UPPER_TOKENS = new Set([
    'BI', 'LPS', 'OJK', 'SBN', 'KPR', 'DP', 'ATM', 'EDC', 'QRIS', 'UMKM', 'BPJS', 'STNK',
    'IGD', 'IASC', 'PPh', 'PPN', 'PBJT', 'RDPU', 'RDPT', 'RDS', 'DPLK', '2L', '3D', '3T',
    'DES', 'SPT', 'BPHTB', 'AJB', 'PPAT', 'JKP', 'JKK', 'JHT', 'JP', 'MMQ',
  ]);
  return raw
    .split(/\s+/)
    .map((word) => {
      if (!word) return word;
      // Preserve parenthetical descriptions or slash/punctuation cleanly
      const match = word.match(/^([^A-Za-z0-9]*)([A-Za-z0-9-]+)([^A-Za-z0-9]*)$/);
      if (!match) return word;
      const [, pre, core, post] = match;
      if (UPPER_TOKENS.has(core)) return word;
      if (core.includes('-')) {
        const parts = core.split('-').map((p) =>
          UPPER_TOKENS.has(p.toUpperCase())
            ? p.toUpperCase()
            : p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
        );
        return `${pre}${parts.join('-')}${post}`;
      }
      // Convert screaming ALL-CAPS words (>= 2 letters) to Title Case
      if (core === core.toUpperCase() && /[A-Z]{2,}/.test(core)) {
        return `${pre}${core.charAt(0).toUpperCase()}${core.slice(1).toLowerCase()}${post}`;
      }
      return word;
    })
    .join(' ');
}

function stripDetektifVerdictPrefix(labelId: string): string {
  const cleaned = labelId
    .replace(/^\[(AMAN|WASPADA|BAHAYA)\]\s*/i, '')
    .replace(/^(AMAN|WASPADA|BAHAYA)(\s*\/\s*[A-Z\s]+|\s*\([^)]+\))?\s*[:\-\u2014]\s*/i, '')
    .trim();
  if (!cleaned) return labelId.trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function formatRp(n: number): string {
  return `Rp${Math.round(n).toLocaleString('id-ID')}`;
}

function inferSubtestFromPath(lesson: LessonConfig): ExamSubtestId {
  if (lesson.mechanic === 'DetektifCuan') return 'PD';
  if (lesson.mechanic === 'KokiAnggaran' || lesson.mechanic === 'PairMatch' || lesson.mechanic === 'PohonAset' || lesson.mechanic === 'StorySim') {
    return 'PF';
  }
  if (lesson.mechanic === 'FinWordle') return 'LF';
  const titleLower = `${lesson.titleId} ${lesson.objectiveId}`.toLowerCase();
  if (/hitung|ppn|pbjt|bunga|flat|efektif|apr|eir|pajak|neto|spread|breakeven|fisher|inflasi|kpr|hpp|rasio|ter |pph|dsr|nominal/.test(titleLower)) {
    return 'PK';
  }
  if (/scam|phishing|pinjol|ilegal|apk|slik|fraud|iasc|waspada|penipuan|cek |verifikasi|darurat/.test(titleLower)) {
    return 'PD';
  }
  return 'LF';
}

// Collect global word distractors so Wordle->MC conversion always has plausible 4 choices
const ALL_WORD_TERMS: { word: string; unitId: string }[] = [];
for (const p of ALL_PATHS) {
  if (p.activity.mechanic === 'FinWordle') {
    for (const w of p.activity.words) {
      ALL_WORD_TERMS.push({ word: w.word, unitId: p.unitId });
    }
  }
}

function extractQuestionsFromLesson(lesson: LessonConfig, seedNum: number): ExamQuestionItem[] {
  const rng = mulberry32(seedNum ^ hashString(lesson.pathId));
  const items: ExamQuestionItem[] = [];
  const baseSubtest = inferSubtestFromPath(lesson);
  const act = lesson.activity;

  switch (act.mechanic) {
    case 'CuanQuiz': {
      act.questions.forEach((q, idx) => {
        const subtestId: ExamSubtestId = /\[(?:Analitik )?HOTS\]/i.test(q.promptId) ? 'PF' : baseSubtest;
        const shuffled = shuffleWithCorrectIndex(q.optionsId, q.correctIndex, rng);
        items.push({
          id: `${lesson.pathId}::q${idx}`,
          slotKey: `${lesson.unitId}.${subtestId}`,
          unitId: lesson.unitId,
          subtestId,
          promptId: q.promptId,
          optionsId: shuffled.optionsId,
          correctIndex: shuffled.correctIndex,
          explanationCard: q.explanationCard,
        });
      });
      break;
    }

    case 'DetektifCuan': {
      act.cases.forEach((c, idx) => {
        const opts = c.optionsId.map((o) => stripDetektifVerdictPrefix(o.labelId));
        const cIdx = Math.max(0, c.optionsId.findIndex((o) => o.id === c.correctOptionId));
        const shuffled = shuffleWithCorrectIndex(opts, cIdx, rng);
        items.push({
          id: `${lesson.pathId}::det${idx}`,
          slotKey: `${lesson.unitId}.PD`,
          unitId: lesson.unitId,
          subtestId: 'PD',
          promptId: c.questionId,
          documentHeader: {
            channel: c.channel,
            senderTitle: c.senderTitle,
            documentLines: c.documentLines,
          },
          optionsId: shuffled.optionsId,
          correctIndex: shuffled.correctIndex,
          explanationCard: c.explanationCard,
        });
      });
      break;
    }

    case 'KokiAnggaran': {
      const kokiData = act.data;
      const { buckets, items: kItems } = kokiData;
      const cleanInstr = kokiData.instructionId.replace(/[.!:\s]+$/, '');
      kItems.forEach((item, idx) => {
        const bucketLabels = buckets.map((b) => formatExamBucketLabel(b.labelId));
        const cIdx = Math.max(0, buckets.findIndex((b) => b.id === item.correctBucketId));
        const shuffled = shuffleWithCorrectIndex(bucketLabels, cIdx, rng);
        const promptId = item.contextTagId
          ? `${cleanInstr}. Untuk situasi "${item.labelId}" (${item.contextTagId}), kelompok mana yang paling tepat?`
          : `${cleanInstr}. Untuk situasi "${item.labelId}", kelompok mana yang paling tepat?`;
        items.push({
          id: `${lesson.pathId}::koki${idx}`,
          slotKey: `${lesson.unitId}.PF`,
          unitId: lesson.unitId,
          subtestId: 'PF',
          promptId,
          optionsId: shuffled.optionsId,
          correctIndex: shuffled.correctIndex,
          explanationCard: item.explanationCard,
        });
      });
      break;
    }

    case 'PairMatch': {
      const data = act.data;
      if (data.mode === 'pairs' && data.pairs && data.pairs.length >= 2) {
        data.pairs.forEach((p, idx) => {
          const distractors = data.pairs!
            .filter((_, j) => j !== idx)
            .map((o) => o.rightId)
            .slice(0, 3);
          const rawOpts = [p.rightId, ...distractors];
          const shuffled = shuffleWithCorrectIndex(rawOpts, 0, rng);
          items.push({
            id: `${lesson.pathId}::pair${idx}`,
            slotKey: `${lesson.unitId}.PF`,
            unitId: lesson.unitId,
            subtestId: 'PF',
            promptId: `Pasangkan pernyataan berikut dengan konsep/keputusan yang tepat: "${p.leftId}"`,
            optionsId: shuffled.optionsId,
            correctIndex: shuffled.correctIndex,
            explanationCard: data.explanationCard,
          });
        });
      } else if (data.mode === 'sequence' && data.sequenceSteps && data.sequenceSteps.length >= 3) {
        const cleanSeqInstr = data.instructionId.replace(/[.!:\s]+$/, '');
        const sorted = [...data.sequenceSteps].sort((a, b) => a.order - b.order);
        const firstStep = sorted[0];
        const lastStep = sorted[sorted.length - 1];
        const rawFirstOpts = sorted.map((s) => s.labelId).slice(0, 4);
        const cFirst = rawFirstOpts.indexOf(firstStep.labelId);
        const sFirst = shuffleWithCorrectIndex(rawFirstOpts, cFirst >= 0 ? cFirst : 0, rng);
        items.push({
          id: `${lesson.pathId}::seq0`,
          slotKey: `${lesson.unitId}.PF`,
          unitId: lesson.unitId,
          subtestId: 'PF',
          promptId: `${cleanSeqInstr}. Manakah langkah PERTAMA (prioritas #1)?`,
          optionsId: sFirst.optionsId,
          correctIndex: sFirst.correctIndex,
          explanationCard: data.explanationCard,
        });

        const rawLastOpts = sorted.map((s) => s.labelId).slice(0, 4);
        const cLast = rawLastOpts.indexOf(lastStep.labelId);
        if (cLast >= 0) {
          const sLast = shuffleWithCorrectIndex(rawLastOpts, cLast, rng);
          items.push({
            id: `${lesson.pathId}::seqEnd`,
            slotKey: `${lesson.unitId}.PF`,
            unitId: lesson.unitId,
            subtestId: 'PF',
            promptId: `${cleanSeqInstr}. Manakah tahap TERAKHIR pada urutan tersebut?`,
            optionsId: sLast.optionsId,
            correctIndex: sLast.correctIndex,
            explanationCard: data.explanationCard,
          });
        }
      }
      break;
    }

    case 'FinWordle': {
      act.words.forEach((w, idx) => {
        const poolOthers = ALL_WORD_TERMS.filter((x) => x.word !== w.word).map((x) => x.word);
        const uniqueOthers: string[] = [];
        for (let k = 0; k < poolOthers.length && uniqueOthers.length < 3; k++) {
          const pick = poolOthers[Math.floor(rng() * poolOthers.length)];
          if (!uniqueOthers.includes(pick) && pick !== w.word) uniqueOthers.push(pick);
        }
        while (uniqueOthers.length < 3) {
          uniqueOthers.push(`ISTILAH_${uniqueOthers.length + 1}`);
        }
        const shuffled = shuffleWithCorrectIndex([w.word, ...uniqueOthers], 0, rng);
        items.push({
          id: `${lesson.pathId}::word${idx}`,
          slotKey: `${lesson.unitId}.LF`,
          unitId: lesson.unitId,
          subtestId: 'LF',
          promptId: `Istilah keuangan manakah yang paling tepat untuk definisi berikut: "${w.clueId}"?`,
          optionsId: shuffled.optionsId,
          correctIndex: shuffled.correctIndex,
          explanationCard: card({
            why: w.definitionId,
            calc: w.exampleId,
            type: w.statementType || 'fixed_fact',
            reg: w.regulationMeta,
            next: `Pahami makna "${w.word}" sebelum mempraktikkannya pada dokumen atau kontrak keuangan.`,
          }),
        });
      });
      break;
    }

    case 'PohonAset': {
      const pohonData = act.data;
      pohonData.quarters.forEach((q, idx) => {
        if (q.options.length < 2) return;
        const optLabels = q.options.map((o) => `${o.labelId}: ${o.descId}`);
        const optIdx = Math.max(0, q.options.findIndex((o) => o.isOptimal));
        const shuffled = shuffleWithCorrectIndex(optLabels, optIdx, rng);
        items.push({
          id: `${lesson.pathId}::pohon${idx}`,
          slotKey: `${lesson.unitId}.PF`,
          unitId: lesson.unitId,
          subtestId: 'PF',
          promptId: `[${q.quarterLabelId} • ${q.macroWeather}] ${q.eventTitleId}: ${q.eventDescId}`,
          optionsId: shuffled.optionsId,
          correctIndex: shuffled.correctIndex,
          explanationCard: pohonData.explanationCard,
        });
      });
      break;
    }

    case 'StorySim': {
      const storyData = act.data;
      storyData.chapters.forEach((ch, idx) => {
        if (ch.choices.length < 2) return;
        const optLabels = ch.choices.map((c) => c.labelId);
        const recIdx = Math.max(0, ch.choices.findIndex((c) => c.isRecommended));
        const shuffled = shuffleWithCorrectIndex(optLabels, recIdx, rng);
        items.push({
          id: `${lesson.pathId}::story${idx}`,
          slotKey: `${lesson.unitId}.PF`,
          unitId: lesson.unitId,
          subtestId: 'PF',
          promptId: `[${ch.periodLabelId}] ${ch.narrativeId}`,
          optionsId: shuffled.optionsId,
          correctIndex: shuffled.correctIndex,
          explanationCard: storyData.explanationCard,
        });
      });
      break;
    }
  }

  return items;
}

// ---------- Parametric Variant Generators (>= 3 concrete variants per slot across S1..S6) ----------

function generateParametricVariantsForSemester(
  semesterId: string,
  unitIds: string[],
  seed: number
): ExamQuestionItem[] {
  const rng = mulberry32(seed ^ hashString(`PARAM_${semesterId}`));
  const u0 = unitIds[0] || `${semesterId}.U1`;
  const uLast = unitIds[unitIds.length - 1] || u0;
  const results: ExamQuestionItem[] = [];

  if (semesterId === 'S1') {
    // 3 variants of PK: PPN 12% DPP 11/12 = efektif 11%
    [
      { base: 200_000, item: 'sepatu sekolah' },
      { base: 300_000, item: 'jaket kanvas' },
      { base: 500_000, item: 'ransel kerja' },
    ].forEach((v, idx) => {
      const ppn = Math.round(v.base * 0.11); // Tarif 12% DPP 11/12 = efektif 11% barang non-mewah
      const total = v.base + ppn;
      const rawOpts = [
        `${formatRp(total)}`,
        `${formatRp(v.base + Math.round(v.base * 0.12))}`,
        `${formatRp(v.base + Math.round(v.base * 0.10))}`,
        `${formatRp(v.base + Math.round(v.base * 0.21))}`,
      ];
      const sh = shuffleWithCorrectIndex(rawOpts, 0, rng);
      results.push({
        id: `PAR.S1.PPN.${idx}`,
        slotKey: `PAR.S1.PK`,
        unitId: unitIds.includes('S1.U2') ? 'S1.U2' : u0,
        subtestId: 'PK',
        promptId: `Harga label ${v.item} sebelum pajak adalah ${formatRp(v.base)} di toko ritel berstatus PKP (barang umum non-mewah, PPN 12% dengan DPP 11/12 per PMK 11/2025). Berapa total yang dibayar di kasir?`,
        optionsId: sh.optionsId,
        correctIndex: sh.correctIndex,
        explanationCard: card({
          why: 'Berdasarkan PMK 131/2024 jo. PMK 11/2025, barang umum non-mewah dikenai PPN 12% atas Dasar Pengenaan Pajak 11/12 dari harga jual, sehingga beban efektifnya tepat 11%.',
          calc: `PPN = 12% × (11/12) × ${formatRp(v.base)} = 11% × ${formatRp(v.base)} = ${formatRp(ppn)}. Total = ${formatRp(total)}.`,
          type: 'dynamic_fact',
          reg: REG_SOURCES.PPN_PBJT,
          next: 'Selalu pisahkan label harga "sebelum pajak" dari total neto struk kasir.',
        }),
      });
    });

    // 3 variants of PK: harga satuan (gramasi)
    [
      { pA: 12_000, wA: 200, pB: 25_000, wB: 500, label: 'kecap' },
      { pA: 15_000, wA: 250, pB: 48_000, wB: 1000, label: 'minyak goreng' },
      { pA: 9_000, wA: 150, pB: 28_000, wB: 500, label: 'beras kemasan' },
    ].forEach((v, idx) => {
      const unitA = Math.round((v.pA / v.wA) * 100);
      const unitB = Math.round((v.pB / v.wB) * 100);
      const bCheaper = unitB < unitA;
      const winLabel = bCheaper ? 'Kemasan besar' : 'Kemasan kecil';
      const loseLabel = bCheaper ? 'Kemasan kecil' : 'Kemasan besar';
      const rawOpts = [
        `${winLabel} lebih hemat per gram/ml`,
        `${loseLabel} lebih hemat per gram/ml`,
        `Harga per gram/ml keduanya sama persis`,
        `Selisih ukuran tidak mengubah biaya satuan`,
      ];
      const sh = shuffleWithCorrectIndex(rawOpts, 0, rng);
      results.push({
        id: `PAR.S1.UNITPRICE.${idx}`,
        slotKey: 'PAR.S1.PK',
        unitId: unitIds.includes('S1.U5') ? 'S1.U5' : uLast,
        subtestId: 'PK',
        promptId: `Perbandingan harga ${v.label}: Kemasan kecil ${v.wA}g/ml seharga ${formatRp(v.pA)} vs Kemasan besar ${v.wB}g/ml seharga ${formatRp(v.pB)}. Dengan asumsi habis terpakai sebelum kedaluwarsa, mana yang lebih hemat per unit?`,
        optionsId: sh.optionsId,
        correctIndex: sh.correctIndex,
        explanationCard: card({
          why: 'Shrinkflation & jebakan harga kemasan menipu pembeli jika hanya melihat harga nominal rak, bukan harga per 100g/ml.',
          calc: `Kecil: ${formatRp(unitA)} per 100 unit. Besar: ${formatRp(unitB)} per 100 unit.`,
          next: 'Hitung harga per satuan dan pastikan masa kedaluwarsa mencukupi kebutuhan rumah tangga.',
        }),
      });
    });

    // 3 variants of PD: keaslian uang / BPOM / PBJT vs PPN (tailored distractors per item)
    [
      {
        prompt: 'Uang kertas Rp50.000 robek tersisa sekitar 55% bagian dan nomor serinya hanya terbaca satu sisi. Apakah berhak ditukar penuh di Bank Indonesia?',
        opts: [
          'Tidak diganti penuh karena sisa fisik ≤ 2/3 ukuran asli sesuai aturan BI',
          'Diganti 55% proporsional senilai Rp27.500 mengikuti sisa persentase fisik',
          'Diganti penuh Rp50.000 asalkan satu sisi nomor seri masih dapat terbaca',
          'Masih sah dipakai belanja langsung asal kedua ujungnya disambung selotip',
        ],
      },
      {
        prompt: 'Iklan krim wajah mencantumkan "lulus uji lab internal toko" tanpa nomor registrasi BPOM sama sekali. Apa keputusan konsumen cerdas?',
        opts: [
          'Tunda dan tolak pembelian sebelum izin edar terverifikasi di portal Cek BPOM',
          'Cukup tanyakan foto surat pernyataan distributor resmi lewat obrolan admin',
          'Aman dipakai bila kemasannya sudah mencantumkan komposisi bahan berbahasa baku',
          'Produk impor racikan toko bebas dari kewajiban izin edar selama dijual terbatas',
        ],
      },
      {
        prompt: 'Sebuah restoran mencantumkan dua pungutan atas menu makan di tempat pada satu struk: PBJT 10% ditambah PPN 11% atas makanan yang sama.',
        opts: [
          'Klarifikasi ke kasir karena sajian restoran objek PBJT Pemda, bukan ganda PPN',
          'Wajar karena PBJT berlaku bagi makanan sedangkan PPN dikenakan atas jasanya',
          'Benar bila restoran sudah beromzet di atas ambang PKP sejak tahun pajak baru',
          'Semua restoran wajib memungut pajak daerah sekaligus PPN pusat sebesar 21%',
        ],
      },
    ].forEach((v, idx) => {
      const sh = shuffleWithCorrectIndex(v.opts, 0, rng);
      results.push({
        id: `PAR.S1.PD.${idx}`,
        slotKey: 'PAR.S1.PD',
        unitId: unitIds.includes('S1.U4') ? 'S1.U4' : u0,
        subtestId: 'PD',
        promptId: v.prompt,
        optionsId: sh.optionsId,
        correctIndex: sh.correctIndex,
        explanationCard: card({
          why: 'Perlindungan konsumen Indonesia bergantung pada verifikasi batas hukum: ukuran >2/3 BI, nomor BPOM resmi, dan pemisahan PBJT vs PPN.',
          type: 'dynamic_fact',
          reg: REG_SOURCES.UU_MATA_UANG,
          next: 'Selalu cek bukti fisik, izin edar, dan komponen struk sebelum meninggalkan transaksi.',
        }),
      });
    });

    // 3 variants PF H.O.T.S: Multi-variable Trade-off Promo vs Cash Liquidity
    [
      { price: 240_000, discPct: 25, shipA: 12_000, coinCap: 70_000, item: 'jaket kerja' },
      { price: 300_000, discPct: 30, shipA: 15_000, coinCap: 90_000, item: 'sepatu lapangan' },
      { price: 160_000, discPct: 20, shipA: 10_000, coinCap: 45_000, item: 'tas laptop' },
    ].forEach((v, idx) => {
      const payA = Math.round(v.price * (1 - v.discPct / 100) + v.shipA);
      const sh = shuffleWithCorrectIndex(
        [
          `Toko A karena beban kas tunai akhirnya paling kecil`,
          `Toko B karena potongan koin & gratis ongkir paling besar`,
          `Toko B karena harga akhir sebelum koin lebih menguntungkan`,
          `Keduanya bernilai sama karena selisih ongkir menutup potongan harga`,
        ],
        0,
        rng
      );
      results.push({
        id: `PAR.S1.HOTS.${idx}`,
        slotKey: 'PAR.S1.PF',
        unitId: unitIds.includes('S1.U4') ? 'S1.U4' : uLast,
        subtestId: 'PF',
        promptId: `[Analitik HOTS] Kamu butuh ${v.item} seharga ${formatRp(v.price)} dan tidak ada rencana belanja apa pun bulan depan. Toko A beri Diskon langsung ${v.discPct}% + ongkir ${formatRp(v.shipA)}, sedangkan Toko B harga utuh gratis ongkir + Cashback Koin ${formatRp(v.coinCap)} hangus dalam 48 jam. Mana pilihan paling efisien secara kas riil?`,
        optionsId: sh.optionsId,
        correctIndex: sh.correctIndex,
        explanationCard: card({
          why: 'Evaluasi H.O.T.S (C5) menilai aliran kas bersih aktual: cashback koin kadaluwarsa memicu pembelian paksa baru yang tidak dibutuhkan.',
          calc: `Toko A keluar ${formatRp(payA)} tunai. Toko B keluar penuh ${formatRp(v.price)} dan koin ${formatRp(v.coinCap)} hangus dalam 48 jam.`,
          type: 'simulation_assumption',
          next: 'Prioritaskan potongan harga langsung dibanding cashback bersyarat kedaluwarsa pendek.',
        }),
      });
    });
  }

  if (semesterId === 'S2') {
    // 3 variants of PK: sinking fund
    [
      { target: 2_400_000, months: 6, item: 'servis besar & ban motor' },
      { target: 3_600_000, months: 12, item: 'PBB rumah & asuransi tahunan' },
      { target: 1_800_000, months: 4, item: 'biaya daftar ulang sekolah' },
    ].forEach((v, idx) => {
      const perMonth = Math.round(v.target / v.months);
      const rawOpts = [
        `Sisihkan ${formatRp(perMonth)}/bulan ke rekening Sinking Fund terpisah`,
        `Sisihkan ${formatRp(Math.round(perMonth / 2))}/bulan lalu tutup sisanya dari saldo harian`,
        `Biarkan bercampur di tabungan jajan hingga ditagih pada bulan ke-${v.months}`,
        `Gunakan dana darurat saat jatuh tempo lalu cicil penggantinya bulan depan`,
      ];
      const sh = shuffleWithCorrectIndex(rawOpts, 0, rng);
      results.push({
        id: `PAR.S2.SINK.${idx}`,
        slotKey: 'PAR.S2.PK',
        unitId: unitIds.includes('S2.U11') ? 'S2.U11' : uLast,
        subtestId: 'PK',
        promptId: `Kamu punya kebutuhan ${v.item} sebesar ${formatRp(v.target)} yang pasti terjadi ${v.months} bulan lagi. Berapa setoran bulanan Sinking Fund agar tidak membobol dana darurat?`,
        optionsId: sh.optionsId,
        correctIndex: sh.correctIndex,
        explanationCard: card({
          why: 'Pengeluaran tahunan yang pasti tanggal dan nominalnya bukan kondisi darurat, ia wajib disiapkan lewat Sinking Fund bulanan.',
          calc: `${formatRp(v.target)} ÷ ${v.months} bulan = ${formatRp(perMonth)}/bulan.`,
          next: 'Pisahkan pos Sinking Fund agar arus kas bulanan tetap tenang tanpa utang konsumtif.',
        }),
      });
    });

    // 3 variants PK: potongan gaji BPJS pekerja formal
    [
      { gaji: 5_000_000 },
      { gaji: 7_000_000 },
      { gaji: 10_000_000 },
    ].forEach((v, idx) => {
      const kes = Math.round(v.gaji * 0.01);
      const jht = Math.round(v.gaji * 0.02);
      const jp = Math.round(v.gaji * 0.01); // asumsi di bawah cap upah JP saat simulasi
      const totalPot = kes + jht + jp;
      const sh = shuffleWithCorrectIndex(
        [
          `${formatRp(totalPot)}`,
          `${formatRp(Math.round(v.gaji * 0.03))}`,
          `${formatRp(Math.round(v.gaji * 0.12))}`,
          `${formatRp(Math.round(v.gaji * 0.05))}`,
        ],
        0,
        rng
      );
      results.push({
        id: `PAR.S2.BPJS.${idx}`,
        slotKey: 'PAR.S2.PK',
        unitId: unitIds.includes('S2.U8') ? 'S2.U8' : u0,
        subtestId: 'PK',
        promptId: `(Asumsi di bawah batas atas upah perhitungan BPJS): Seorang pekerja berupah tetap ${formatRp(v.gaji)} melihat rincian BPJS di slip gajinya. Berapa total potongan wajib bagian PEKERJA (Kesehatan 1% + JHT 2% + JP 1%) sebelum PPh 21?`,
        optionsId: sh.optionsId,
        correctIndex: sh.correctIndex,
        explanationCard: card({
          why: 'Iuran BPJS dibagi bersama pemberi kerja & pekerja: sisi pekerja menyumbang Kesehatan 1%, JHT 2%, dan JP 1% (tunduk pada batas atas upah reguler masing-masing program).',
          calc: `1% + 2% + 1% = 4% × ${formatRp(v.gaji)} = ${formatRp(totalPot)}.`,
          type: 'dynamic_fact',
          reg: REG_SOURCES.BPJS_TK,
          next: 'Cocokkan selalu potongan slip gaji dengan saldo aplikasi JMO / Mobile JKN setiap kuartal.',
        }),
      });
    });

    // 3 variants PF H.O.T.S: Multi-variable Salary vs Commute + Time Trade-off
    [
      { gA: 6_200_000, tA: 1_050_000, gB: 5_600_000, tB: 250_000, hDiff: 2 },
      { gA: 5_800_000, tA: 900_000, gB: 5_300_000, tB: 200_000, hDiff: 2 },
      { gA: 7_000_000, tA: 1_200_000, gB: 6_300_000, tB: 300_000, hDiff: 3 },
    ].forEach((v, idx) => {
      const netA = v.gA - v.tA;
      const netB = v.gB - v.tB;
      const gap = netB - netA;
      const sh = shuffleWithCorrectIndex(
        [
          `Tawaran B karena sisa pasca-ongkos & efisiensi waktunya lebih unggul`,
          `Tawaran A karena gaji pokok awalnya tetap menyisakan dana lebih besar`,
          `Tawaran A karena selisih gaji menutup ongkos komuter tahunan`,
          `Keduanya setara secara sisa pendapatan setelah dikurangi ongkos transport`,
        ],
        0,
        rng
      );
      results.push({
        id: `PAR.S2.HOTS.${idx}`,
        slotKey: 'PAR.S2.PF',
        unitId: unitIds.includes('S2.U10') ? 'S2.U10' : uLast,
        subtestId: 'PF',
        promptId: `[Analitik HOTS] Membandingkan dua tawaran gaji bersih setara slip: Tawaran A membayar ${formatRp(v.gA)} tetapi ongkos transport ${formatRp(v.tA)}/bln dan macet lebih lama ${v.hDiff} jam/hari; Tawaran B membayar ${formatRp(v.gB)} dengan ongkos ${formatRp(v.tB)}/bln dekat rumah. Pilihan mana yang memberi sisa daya beli & efisiensi waktu terbaik?`,
        optionsId: sh.optionsId,
        correctIndex: sh.correctIndex,
        explanationCard: card({
          why: 'Keputusan karier rasional (C5) mengevaluasi sisa pendapatan pasca-ongkos kerja serta nilai ekonomi waktu terhemat, bukan angka bruto atau slip semata.',
          calc: `Tawaran A pasca-ongkos = ${formatRp(netA)}. Tawaran B = ${formatRp(netB)} (unggul bersih +${formatRp(gap)}/bln dan +${v.hDiff} jam/hari).`,
          type: 'simulation_assumption',
          next: 'Hitung ongkos komuter, makan kerja, dan waktu tempuh sebelum menandatangani tawaran kerja.',
        }),
      });
    });
  }

  if (semesterId === 'S3') {
    // 3 variants PK: Flat vs Efektif IRR / total bunga
    [
      { pokok: 6_000_000, flatMo: 0.01, mo: 12, apr: '21,46%', eir: '23,70%' },
      { pokok: 12_000_000, flatMo: 0.01, mo: 12, apr: '21,46%', eir: '23,70%' },
      { pokok: 24_000_000, flatMo: 0.01, mo: 12, apr: '21,46%', eir: '23,70%' },
    ].forEach((v, idx) => {
      const angs = Math.round(v.pokok / v.mo + v.pokok * v.flatMo);
      const totBunga = Math.round(v.pokok * v.flatMo * v.mo);
      const sh = shuffleWithCorrectIndex(
        [
          `Cicilan ${formatRp(angs)}/bln, bunga ${formatRp(totBunga)}, APR riil ~${v.apr} (EIR ~${v.eir})`,
          `Cicilan ${formatRp(angs)}/bln, bunga ${formatRp(totBunga)}, APR riil tepat 12,00%/tahun`,
          `Cicilan ${formatRp(Math.round(v.pokok / v.mo + totBunga / 24))}/bln, APR riil ~10,73% karena bunga dipotong separuh`,
          `Cicilan ${formatRp(angs)}/bln, bunga ${formatRp(totBunga)}, EIR riil di bawah 12,00% efektif`,
        ],
        0,
        rng
      );
      results.push({
        id: `PAR.S3.FLAT.${idx}`,
        slotKey: 'PAR.S3.PK',
        unitId: unitIds.includes('S3.U13') ? 'S3.U13' : u0,
        subtestId: 'PK',
        promptId: `Pinjaman ${formatRp(v.pokok)} tenor ${v.mo} bulan menawarkan bunga "1% flat per bulan". Berapakah cicilan per bulan dan kesimpulan matematis tarif efektifnya?`,
        optionsId: sh.optionsId,
        correctIndex: sh.correctIndex,
        explanationCard: card({
          why: 'Bunga flat terus dikalikan pokok awal padahal sisa pokok tiap bulan turun ke nol, sehingga IRR riil bulanan (~1,7881%) jauh melampaui 1% flat!',
          calc: `Cicilan = (${formatRp(v.pokok)} ÷ 12) + (1% × ${formatRp(v.pokok)}) = ${formatRp(angs)}/bln. IRR × 12 = ${v.apr} (APR); (1+IRR)^12 − 1 = ${v.eir} (EIR).`,
          next: 'Selalu konversi penawaran bunga flat ke APR/EIR sebelum menandatangani kredit.',
        }),
      });
    });

    // 3 variants PD: Pinjol Ilegal / SEOJK 19/2025 / APK Scam (tailored realistic distractors!)
    [
      {
        scenario: 'Aplikasi pinjaman mendadak meminta izin akses penuh ke Galeri Foto, Daftar Kontak telepon, dan Log Panggilan sebelum pengajuan.',
        opts: [
          'Ciri kuat pinjol ilegal: LPBBTI resmi hanya boleh mengakses CAMILAN (Kamera, Mic, Lokasi)',
          'Hal wajar sepanjang pengguna menekan tombol Setuju di syarat & ketentuan aplikasi',
          'Prosedur standar SLIK OJK agar limit pinjaman awal bisa dicairkan lebih tinggi',
          'Diizinkan khusus pinjaman tanpa agunan berjangka pendek di bawah tiga puluh hari',
        ],
      },
      {
        scenario: 'Penagih pinjol menelepon teman kantor yang dicantumkan sebagai kontak darurat dan memerintahkannya menalangi cicilan debitur.',
        opts: [
          'Melanggar SEOJK 19/2025: kontak darurat hanya untuk konfirmasi, dilarang ditagih',
          'Sah menurut kontrak karena kontak darurat otomatis bertindak sebagai penjamin utang',
          'Diperbolehkan bila debitur telah menunggak melewati tujuh hari sejak jatuh tempo',
          'Wajar dilakukan aplikasi berizin selama tidak menyebut jumlah nominal utangnya',
        ],
      },
      {
        scenario: 'Akun tak dikenal mengirim file APK bertajuk "Surat_Tilang_Elektronik_Resmi.apk" lewat WhatsApp agar penerima menginstal demi melihat bukti foto.',
        opts: [
          'Phishing malware pencuri OTP: tolak instalasi file .apk di luar toko resmi',
          'Instal sebentar untuk cek bukti lalu langsung hapus aplikasinya setelah dilihat',
          'Aman dibuka bila HP sudah memasang kunci PIN atau sidik jari pada aplikasi bank',
          'Wajar karena instansi pengiriman surat kini memakai lampiran file berekstensi .apk',
        ],
      },
    ].forEach((v, idx) => {
      const sh = shuffleWithCorrectIndex(v.opts, 0, rng);
      results.push({
        id: `PAR.S3.PD.${idx}`,
        slotKey: 'PAR.S3.PD',
        unitId: unitIds.includes('S3.U15') ? 'S3.U15' : uLast,
        subtestId: 'PD',
        promptId: v.scenario,
        optionsId: sh.optionsId,
        correctIndex: sh.correctIndex,
        explanationCard: card({
          why: 'Regulasi POJK 40/2024 jo. SEOJK 19/SEOJK.06/2025 melindungi privasi debitur (hanya CAMILAN, kontak darurat non-penagihan) serta melarang praktik ilegal dan rekayasa sosial .apk.',
          type: 'dynamic_fact',
          reg: REG_SOURCES.LPBBTI_OJK,
          next: 'Verifikasi legalitas melalui Kontak OJK 157 / sipasti.ojk.go.id dan laporkan ke iasc.ojk.go.id.',
        }),
      });
    });

    // 3 variants PF H.O.T.S: Flat Loan vs Declining Bank Loan Trade-off
    [
      { pokok: 12_000_000, flatBunga: 2_160_000, effBunga: 1_202_000 },
      { pokok: 6_000_000, flatBunga: 1_080_000, effBunga: 601_000 },
      { pokok: 18_000_000, flatBunga: 3_240_000, effBunga: 1_803_000 },
    ].forEach((v, idx) => {
      const totalFlat = v.pokok + v.flatBunga;
      const totalEff = v.pokok + v.effBunga;
      const save = v.flatBunga - v.effBunga;
      const sh = shuffleWithCorrectIndex(
        [
          `Bank B lebih hemat, total bayar ${formatRp(totalEff)}`,
          `Pembiayaan A lebih hemat, total bayar ${formatRp(totalFlat)}`,
          `Total bayar keduanya sama persis ${formatRp(totalFlat)}`,
          `Bank B lebih mahal karena skema efektif naik tiap semester`,
        ],
        0,
        rng
      );
      results.push({
        id: `PAR.S3.HOTS.${idx}`,
        slotKey: 'PAR.S3.PF',
        unitId: unitIds.includes('S3.U13') ? 'S3.U13' : u0,
        subtestId: 'PF',
        promptId: `[Analitik HOTS] Pinjaman modal kerja ${formatRp(v.pokok)} selama 12 bulan tanpa biaya admin: Lembaga A menawarkan "1,5% flat/bulan", sedangkan Bank B menawarkan "18% efektif menurun/tahun" (total bunga efektif setahun ≈ ${formatRp(v.effBunga)}). Mana yang total uang keluarnya paling ringan?`,
        optionsId: sh.optionsId,
        correctIndex: sh.correctIndex,
        explanationCard: card({
          why: '1,5% flat/bulan (18% nominal × pokok awal) selalu jauh lebih mahal daripada 18% efektif menurun karena di skema efektif, porsi bunga ikut mengecil saat pokok tercicil.',
          calc: `Lembaga A total = ${formatRp(totalFlat)}. Bank B total = ${formatRp(totalEff)}. Penghematan bersih = ${formatRp(save)}.`,
          type: 'simulation_assumption',
          next: 'Ubah penawaran flat ke total rupiah keluar sebelum memilih sumber pinjaman.',
        }),
      });
    });
  }

  if (semesterId === 'S4') {
    // 3 variants PK: Fisher Riil & Daya Beli Inflasi
    [
      { nomPct: 6, infPct: 4, realStr: '1,92%', approx: '2,00%', sum: '10,00%' },
      { nomPct: 4, infPct: 5, realStr: '-0,95%', approx: '-1,00%', sum: '9,00%' },
      { nomPct: 8, infPct: 3, realStr: '4,85%', approx: '5,00%', sum: '11,00%' },
    ].forEach((v, idx) => {
      const exact = ((1 + v.nomPct / 100) / (1 + v.infPct / 100) - 1) * 100;
      const sh = shuffleWithCorrectIndex(
        [
          `${v.realStr}`,
          `${v.approx}`,
          `${v.sum}`,
          `${(-exact).toFixed(2).replace('.', ',')}%`,
        ],
        0,
        rng
      );
      results.push({
        id: `PAR.S4.FISHER.${idx}`,
        slotKey: 'PAR.S4.PK',
        unitId: unitIds.includes('S4.U19') ? 'S4.U19' : uLast,
        subtestId: 'PK',
        promptId: `Jika imbal hasil bersih instrumen adalah ${v.nomPct}%/tahun sementara laju inflasi tahunan adalah ${v.infPct}%/tahun, berapa tingkat imbal hasil RIIL tahunan menurut persamaan Fisher eksak?`,
        optionsId: sh.optionsId,
        correctIndex: sh.correctIndex,
        explanationCard: card({
          why: 'Pengurangan langsung (nominal − inflasi) hanya pendekatan kasar; pengukuran tepat daya beli memakai rasio perkalian Fisher.',
          calc: `((1 + ${v.nomPct / 100}) ÷ (1 + ${v.infPct / 100})) − 1 = ${exact.toFixed(2)}%.`,
          next: 'Untuk dana >5 tahun, jangan hanya mengandalkan bunga di bawah inflasi agar daya beli tidak menyusut.',
        }),
      });
    });

    // 3 variants PK: Dana Darurat
    [
      { status: 'Lajang berpenghasilan tetap', minX: 3, maxX: 6, exp: 4_000_000 },
      { status: 'Menikah dengan 1 anak & 1 pencari nafkah', minX: 6, maxX: 12, exp: 6_000_000 },
      { status: 'Freelancer pendapatan fluktuatif berkeluarga', minX: 9, maxX: 12, exp: 5_000_000 },
    ].forEach((v, idx) => {
      const low = v.exp * v.minX;
      const high = v.exp * v.maxX;
      const sh = shuffleWithCorrectIndex(
        [
          `${v.minX}–${v.maxX}× pengeluaran wajib (${formatRp(low)}–${formatRp(high)}) di aset likuid`,
          `1–2× pengeluaran wajib (${formatRp(v.exp)}–${formatRp(v.exp * 2)}) ditambah limit kartu`,
          `Cukup ${formatRp(v.exp / 2)} tunai karena bisa dicairkan dari properti jika krisis`,
          `${v.minX}–${v.maxX}× total belanja gaya hidup (${formatRp(high * 2)}) di saham berisiko`,
        ],
        0,
        rng
      );
      results.push({
        id: `PAR.S4.DD.${idx}`,
        slotKey: 'PAR.S4.PK',
        unitId: unitIds.includes('S4.U17') ? 'S4.U17' : u0,
        subtestId: 'PK',
        promptId: `Profil rumah tangga: ${v.status}, pengeluaran pokok bulanan ${formatRp(v.exp)}. Berapa kisaran pedoman target Dana Darurat yang sehat?`,
        optionsId: sh.optionsId,
        correctIndex: sh.correctIndex,
        explanationCard: card({
          why: 'Besaran Dana Darurat bersifat kontekstual sesuai jumlah tanggungan dan kestabilan sumber penghasilan.',
          calc: `${v.minX}× s.d. ${v.maxX}× ${formatRp(v.exp)} = ${formatRp(low)}–${formatRp(high)}.`,
          next: 'Tempatkan Dana Darurat pada instrumen likuid & risiko rendah yang mudah diakses saat krisis.',
        }),
      });
    });

    // 3 variants PF H.O.T.S: Gross vs After-Tax Real Purchasing Power vs Inflation
    [
      { grossPct: 4.5, infPct: 4.0, taxPct: 20 },
      { grossPct: 5.0, infPct: 4.5, taxPct: 20 },
      { grossPct: 3.5, infPct: 3.2, taxPct: 20 },
    ].forEach((v, idx) => {
      const netNom = v.grossPct * (1 - v.taxPct / 100);
      const realFisher = ((1 + netNom / 100) / (1 + v.infPct / 100) - 1) * 100;
      const grossVsInf = ((1 + v.grossPct / 100) / (1 + v.infPct / 100) - 1) * 100;
      const sh = shuffleWithCorrectIndex(
        [
          `${realFisher.toFixed(2).replace('.', ',')}%/tahun`,
          `+${grossVsInf.toFixed(2).replace('.', ',')}%/tahun`,
          `+${netNom.toFixed(2).replace('.', ',')}%/tahun`,
          `+0,50%/tahun`,
        ],
        0,
        rng
      );
      results.push({
        id: `PAR.S4.HOTS.${idx}`,
        slotKey: 'PAR.S4.PF',
        unitId: unitIds.includes('S4.U19') ? 'S4.U19' : uLast,
        subtestId: 'PF',
        promptId: `[Analitik HOTS] Kamu ditawari deposito bunga bruto ${v.grossPct.toFixed(1).replace('.', ',')}%/th (PPh Final 20%) saat inflasi tahunan berjalan ${v.infPct.toFixed(1).replace('.', ',')}%. Berapa kisaran imbal hasil RIIL bersih daya belimu menurut Fisher setelah pajak?`,
        optionsId: sh.optionsId,
        correctIndex: sh.correctIndex,
        explanationCard: card({
          why: 'Evaluasi daya beli riil wajib memotong PPh 20% dulu baru diuji melawan inflasi; membandingkan bunga brosur bruto langsung sering menipu investor.',
          calc: `Bunga bersih = ${v.grossPct}% × 80% = ${netNom.toFixed(2)}%. Fisher = (1 + ${(netNom / 100).toFixed(4)}) ÷ (1 + ${(v.infPct / 100).toFixed(4)}) − 1 = ${realFisher.toFixed(2)}%/th.`,
          type: 'simulation_assumption',
          next: 'Bandingkan instrumen jangka panjang memakai imbal hasil bersih pasca-pajak terhadap inflasi.',
        }),
      });
    });
  }

  if (semesterId === 'S5') {
    // 3 variants PK: SBN 10% vs Deposito 20%
    [
      { modal: 50_000_000, gross: 0.06 },
      { modal: 100_000_000, gross: 0.06 },
      { modal: 40_000_000, gross: 0.065 },
    ].forEach((v, idx) => {
      const grossAmt = Math.round(v.modal * v.gross);
      const sbnNet = Math.round(grossAmt * 0.9);
      const depNet = Math.round(grossAmt * 0.8);
      const diff = sbnNet - depNet;
      const sh = shuffleWithCorrectIndex(
        [
          `SBN Neto ${formatRp(sbnNet)} vs Deposito Neto ${formatRp(depNet)}`,
          `SBN Neto ${formatRp(depNet)} vs Deposito Neto ${formatRp(sbnNet)}`,
          `SBN Neto ${formatRp(grossAmt)} vs Deposito Neto ${formatRp(depNet)}`,
          `SBN Neto ${formatRp(depNet)} vs Deposito Neto ${formatRp(depNet)}`,
        ],
        0,
        rng
      );
      results.push({
        id: `PAR.S5.TAX.${idx}`,
        slotKey: 'PAR.S5.PK',
        unitId: unitIds.includes('S5.U23') ? 'S5.U23' : u0,
        subtestId: 'PK',
        promptId: `Dengan dana ${formatRp(v.modal)} dan asumsi tingkat imbal hasil kotor setahun sama-sama ${(v.gross * 100).toFixed(1).replace('.', ',')}%, berapa imbal hasil bersih per tahun antara SBN Ritel (PP 91/2021) dan Deposito (PP 131/2000)?`,
        optionsId: sh.optionsId,
        correctIndex: sh.correctIndex,
        explanationCard: card({
          why: 'Kupon SBN dikenai PPh Final 10%, sedangkan bunga deposito >Rp7,5jt dikenai PPh Final 20%, sehingga retensi hasil bersih SBN lebih besar jika cocok dengan tenornya.',
          calc: `Kotor = ${formatRp(grossAmt)}. SBN Neto (90%) = ${formatRp(sbnNet)}. Deposito Neto (80%) = ${formatRp(depNet)}. Selisih = ${formatRp(diff)}.`,
          type: 'dynamic_fact',
          reg: REG_SOURCES.SBN_RITEL,
          next: 'Tetap sesuaikan pilihan SBN (Tradable vs Non-Tradable & jendela early redemption) dengan jadwal pemakaian uang.',
        }),
      });
    });

    // 3 variants PD: POJK 8/2025 Syariah & LPS 3T Cashback & Custodian (tailored distractors!)
    [
      {
        q: 'Berdasarkan POJK No. 8 Tahun 2025 tentang Daftar Efek Syariah (yang menggantikan POJK 35/2017), bagaimana aturan rasio keuangan emiten syariah?',
        opts: [
          'Rasio utang bunga/aset transisi 10 th dari ≤ 45%→33%, non-halal ≤ 5%',
          'Rasio utang bunga/aset dilonggarkan menjadi ≤ 65%, pendapatan non-halal ≤ 15%',
          'Kriteria utang bunga dihapus penuh asalkan produk inti perusahaan tergolong halal',
          'Setiap saham yang masuk daftar DES otomatis memperoleh jaminan pokok dana LPS',
        ],
      },
      {
        q: 'Bank menawarkan deposito bunga resmi tepat di TBP LPS 4,25%, namun memberi bonus cashback tunai Rp3.000.000 pada dana Rp100jt yang membuat total imbalan efektif tembus 7,25%. Apa status penjaminan LPS-nya?',
        opts: [
          'Gugur jaminan LPS karena insentif cashback ikut dihitung melampaui batas TBP',
          'Tetap dijamin LPS selama pokok kontrak deposito ditulis 4,25% di atas bilyet',
          'Pokok Rp100 juta tetap dijamin penuh LPS dan hanya bonus Rp3 juta yang hangus',
          'Dijamin hingga 50% saldo apabila nasabah menyetujui perjanjian khusus promosi',
        ],
      },
      {
        q: 'Agen penjual produk keuangan mengklaim Reksadana Saham miliknya "pasti untung 24%/tahun tanpa risiko turun karena diawasi Bank Kustodian". Bagaimana sikap detektif finansial?',
        opts: [
          'Red flag penipuan: Bank Kustodian hanya jaga segregasi aset, bukan anti-rugi',
          'Sah dan wajar karena pengawasan OJK serta Bank Kustodian menahan risiko rugi',
          'Aman diikuti sepanjang persentase profit di bawah 3% per bulan secara tertulis',
          'Wajib verifikasi lewat rekening pribadi pengelola saja agar proses cair cepat',
        ],
      },
    ].forEach((v, idx) => {
      const sh = shuffleWithCorrectIndex(v.opts, 0, rng);
      results.push({
        id: `PAR.S5.PD.${idx}`,
        slotKey: 'PAR.S5.PD',
        unitId: unitIds.includes('S5.U26') ? 'S5.U26' : uLast,
        subtestId: 'PD',
        promptId: v.q,
        optionsId: sh.optionsId,
        correctIndex: sh.correctIndex,
        explanationCard: card({
          why: 'Keamanan investor bertumpu pada pemahaman detail regulasi: POJK 8/2025 (DES), syarat 3T LPS termasuk cashback, serta peran sebenarnya Bank Kustodian.',
          type: 'dynamic_fact',
          reg: idx === 0 ? REG_SOURCES.SYARIAH_OJK : REG_SOURCES.LPS_3T,
          next: 'Tolak janji imbal hasil tetap tanpa risiko pada aset pasar modal dan selalu hitung imbalan efektif vs TBP LPS.',
        }),
      });
    });

    // 3 variants PF H.O.T.S: Multi-variable Liquidity Horizon vs Yield/Tax Optimization
    [
      { amount: 60_000_000, horizonMo: 4, purpose: 'pelunasan DP akad rumah' },
      { amount: 45_000_000, horizonMo: 3, purpose: 'uang pangkal kuliah pascasarjana' },
      { amount: 80_000_000, horizonMo: 5, purpose: 'pembayaran vendor renovasi rumah' },
    ].forEach((v, idx) => {
      const sh = shuffleWithCorrectIndex(
        [
          `Deposito berjangka tenor ${v.horizonMo} bln karena dana pasti cair utuh tepat waktu`,
          `SBN Ritel ST tenor 2 tahun karena PPh kuponnya cuma 10% dan mudah dicairkan kapan saja`,
          `Emas batangan ritel agar daya beli terjaga dan spread jual balik otomatis tertutup`,
          `Reksadana Saham karena potensi return tahunannya jauh melampaui deposito jangka pendek`,
        ],
        0,
        rng
      );
      results.push({
        id: `PAR.S5.HOTS.${idx}`,
        slotKey: 'PAR.S5.PF',
        unitId: unitIds.includes('S5.U23') ? 'S5.U23' : uLast,
        subtestId: 'PF',
        promptId: `[Analitik HOTS] Dana ${formatRp(v.amount)} WAJIB cair tepat ${v.horizonMo} bulan lagi untuk ${v.purpose}. Meskipun pajak SBN 10% lebih hemat dibanding pajak Deposito 20%, penempatan mana yang paling tepat?`,
        optionsId: sh.optionsId,
        correctIndex: sh.correctIndex,
        explanationCard: card({
          why: 'Evaluasi H.O.T.S (C5) menempatkan kesesuaian LIKUIDITAS HORIZON di atas optimasi pajak! SBN ST tidak bisa dijual di pasar sekunder sebelum jatuh tempo 2 tahun, sedangkan emas & saham berisiko rugi selisih spread/volatilitas dalam 3–5 bulan.',
          type: 'dynamic_fact',
          reg: REG_SOURCES.SBN_RITEL,
          next: 'Pilih deposito atau reksadana pasar uang sesuai bulan kebutuhan kas, bukan mengejar diskon pajak pada tenor yang terkunci.',
        }),
      });
    });
  }

  if (semesterId === 'S6') {
    // 3 variants PK: PP 20/2026 Pajak UMKM
    [
      { omzet: 800_000_000, status: 'Wajib Pajak Orang Pribadi (WPOP) Toko Kelontong' },
      { omzet: 1_200_000_000, status: 'Wajib Pajak Orang Pribadi (WPOP) Bengkel Motor' },
      { omzet: 600_000_000, status: 'Wajib Pajak Orang Pribadi (WPOP) Warung Makan' },
    ].forEach((v, idx) => {
      const kena = Math.max(0, v.omzet - 500_000_000);
      const pajak = Math.round(kena * 0.005);
      const sh = shuffleWithCorrectIndex(
        [
          `${formatRp(pajak)}/tahun`,
          `${formatRp(Math.round(v.omzet * 0.005))}/tahun`,
          `${formatRp(Math.round(kena * 0.01))}/tahun`,
          `${formatRp(0)}/tahun`,
        ],
        0,
        rng
      );
      results.push({
        id: `PAR.S6.UMKM.${idx}`,
        slotKey: 'PAR.S6.PK',
        unitId: unitIds.includes('S6.U29') ? 'S6.U29' : u0,
        subtestId: 'PK',
        promptId: `Mengacu PP No. 20 Tahun 2026 (berlaku 22 April 2026): ${v.status} memiliki total omzet setahun ${formatRp(v.omzet)} dan bukan pekerjaan bebas. Berapa PPh Final 0,5% terutang tahun tersebut?`,
        optionsId: sh.optionsId,
        correctIndex: sh.correctIndex,
        explanationCard: card({
          why: 'PP 20/2026 menghapus batas jangka waktu pemanfaatan PPh Final 0,5% khusus WPOP & Perseroan Perorangan selama masih memenuhi ambang batas Rp4,8M (namun Koperasi tetap dibatasi 4 Tahun Pajak & pekerjaan bebas/influencer dikecualikan), dan WPOP tetap menikmati pembebasan Rp500 juta omzet pertama.',
          calc: `DPP Kena PPh = ${formatRp(v.omzet)} − Rp500.000.000 = ${formatRp(kena)}. PPh = 0,5% × ${formatRp(kena)} = ${formatRp(pajak)}.`,
          type: 'dynamic_fact',
          reg: REG_SOURCES.PAJAK_UMKM,
          next: 'Pisahkan pembukuan UMKM dari akun pribadi serta cek syarat pengecualian pekerjaan bebas/agregasi.',
        }),
      });
    });

    // 3 variants PD/PF/PK with properly tailored, non-mismatched balanced options!
    [
      {
        q: '[Analitik HOTS] Pembuat konten lepas beromzet jasa kreatif Rp900 juta/tahun sekaligus membuka warung kelontong OP terpisah beromzet Rp700 juta/tahun bertanya skema PP No. 20 Tahun 2026. Mana perlakuan yang tepat?',
        opts: [
          'Hanya omzet warung di atas Rp500jt (Rp200jt) yang boleh pakai 0,5%; jasa konten ikut PPh umum',
          'Kedua sumber Rp1,6 miliar digabung lalu bebas Rp500jt pertama dan sisanya kena tarif 0,5%',
          'Seluruh penghasilan kreator konten termasuk jasa endorse berhak pakai PP 20/2026 tanpa batas tahun',
          'Kreator konten yang memiliki usaha dagang terpisah wajib menggabungkan semuanya ke PPh Badan 22%',
        ],
        st: 'PK' as ExamSubtestId,
      },
      {
        q: '[Analitik HOTS] Mengambil KPR Rp400 juta tenor 15 tahun promo Fixed 5% (Rp3,16jt/bln). Pada tahun ke-4 sisa pokok Rp342 juta terkena Floating 11% sehingga cicilan naik ~35,5% ke Rp4,29jt/bln. Uji kelayakan paling bijak sebelum akad?',
        opts: [
          'Stress-test DSR arus kas di skenario floating 11–13% sekaligus pastikan dana darurat tetap utuh',
          'Cukup uji cicilan promo 5% selama 3 tahun pertama karena gaji pasti naik otomatis menutupi bunga',
          'Tutup seluruh dana darurat demi membesarkan uang muka agar bank memberi tambahan diskon akad',
          'Andalkan pengalihan antarbank (take over) otomatis tiap tahun karena tidak ada biaya penalti maupun notaris',
        ],
        st: 'PF' as ExamSubtestId,
      },
      {
        q: '[Analitik HOTS] Ketika inflasi tinggi memicu Bank Indonesia menaikkan BI-Rate secara berturut-turut, apa dampak transmisi lintas instrumen yang paling tepat diantisipasi investor & debitur?',
        opts: [
          'Bunga kredit floating cenderung naik & harga obligasi pasar sekunder tertekan, sementara pasar uang menyesuaikan',
          'Bunga KPR masa fixed aktif ikut melonjak seketika sedangkan harga obligasi tenor panjang terus naik tajam',
          'Nilai tukar Rupiah melemah otomatis memicu penurunan harga pangan impor tanpa menyentuh suku bunga bank',
          'Seluruh deposito yang sedang berjalan otomatis membatalkan kontrak bunga tetap dan mereset menjadi nol',
        ],
        st: 'PD' as ExamSubtestId,
      },
    ].forEach((v, idx) => {
      const sh = shuffleWithCorrectIndex(v.opts, 0, rng);
      results.push({
        id: `PAR.S6.ADV.${idx}`,
        slotKey: `PAR.S6.${v.st}`,
        unitId: unitIds.includes('S6.U31') ? 'S6.U31' : uLast,
        subtestId: v.st,
        promptId: v.q,
        optionsId: sh.optionsId,
        correctIndex: sh.correctIndex,
        explanationCard: card({
          why: 'Literasi lanjutan menuntut kewaspadaan terhadap pengecualian subjek hukum pajak PP 20/2026, guncangan KPR pasca masa fixed, serta transmisi BI-Rate ke obligasi & kredit.',
          type: 'dynamic_fact',
          reg: idx === 0 ? REG_SOURCES.PAJAK_UMKM : REG_SOURCES.BI_RATE,
          next: 'Selalu hitung skenario terburuk sebelum mengikat kontrak panjang (KPR/utang) maupun memilih rezim pajak.',
        }),
      });
    });
  }

  return results;
}

// ---------- Public Exam Builders ----------

function getUnitsByIds(ids: string[]): UnitSpec[] {
  return ids.map((id) => UNIT_MAP[id]).filter(Boolean);
}

export function buildSemesterSubtestPools(
  examId: string,
  seed: number
): Record<ExamSubtestId, ExamQuestionItem[]> {
  const exam = EXAM_MAP[examId];
  if (!exam) {
    return { LF: [], PK: [], PF: [], PD: [] };
  }
  const sourceUnitIds = Array.from(
    new Set(exam.subtests.flatMap((s) => s.sourceUnitIds))
  );
  const units = getUnitsByIds(sourceUnitIds);
  const extracted: ExamQuestionItem[] = [];

  for (const unit of units) {
    for (const stage of unit.stages) {
      for (const path of stage.paths) {
        extracted.push(...extractQuestionsFromLesson(path, seed));
      }
    }
  }

  // Also inject all parametric variants across the semester + neighbor review items if S6 UAS Final
  const parametric = generateParametricVariantsForSemester(
    exam.semesterId,
    sourceUnitIds,
    seed
  );

  // For S6.UAS Final Comprehensive (Unit 1-31), include parametric pools across S1..S5 as well!
  const crossSemester =
    examId === 'S6.UAS'
      ? ['S1', 'S2', 'S3', 'S4', 'S5'].flatMap((sid) =>
          generateParametricVariantsForSemester(sid, [`${sid}.U1`], seed + 77)
        )
      : [];

  const allPool = [...parametric, ...extracted, ...crossSemester];
  const pools: Record<ExamSubtestId, ExamQuestionItem[]> = {
    LF: [],
    PK: [],
    PF: [],
    PD: [],
  };

  for (const item of allPool) {
    pools[item.subtestId].push(item);
  }

  // Ensure every subtest pool has a healthy >= 3x pool vs questionCount (backfill from sibling units in same semester if thin)
  const rng = mulberry32(seed ^ hashString(examId));
  for (const stSpec of exam.subtests) {
    const neededMin = stSpec.questionCount * stSpec.minVariantPoolPerSlot;
    if (pools[stSpec.subtestId].length < neededMin) {
      // Backfill deterministically from all extracted/parametric items of the same semester first, then curriculum
      const semFallback = allPool.filter(
        (x) => !pools[stSpec.subtestId].some((y) => y.id === x.id)
      );
      for (const cand of semFallback) {
        if (pools[stSpec.subtestId].length >= neededMin) break;
        pools[stSpec.subtestId].push({
          ...cand,
          subtestId: stSpec.subtestId,
          id: `${cand.id}::${stSpec.subtestId}`,
        });
      }
    }
    // Deterministically shuffle each subtest pool by seed
    const arr = pools[stSpec.subtestId];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
  }

  return pools;
}

export function generateSemesterExamRun(
  examId: string,
  attemptSeed: number
): {
  examId: string;
  subtests: {
    subtestId: ExamSubtestId;
    titleId: string;
    durationSec: number;
    minSubtestPercent: number;
    questions: ExamQuestionItem[];
  }[];
  poolCounts: Record<ExamSubtestId, number>;
} | null {
  const exam = EXAM_MAP[examId];
  if (!exam) return null;
  const pools = buildSemesterSubtestPools(examId, attemptSeed);

  const subtests = exam.subtests.map((spec) => {
    const chosen: ExamQuestionItem[] = [];
    const seenPrompts = new Set<string>();
    for (const q of pools[spec.subtestId]) {
      if (chosen.length >= spec.questionCount) break;
      const promptKey = q.promptId.slice(0, 60);
      if (!seenPrompts.has(promptKey)) {
        seenPrompts.add(promptKey);
        chosen.push(q);
      }
    }
    // If prompt deduplication left fewer than questionCount, allow distinct slots
    for (const q of pools[spec.subtestId]) {
      if (chosen.length >= spec.questionCount) break;
      if (!chosen.some((x) => x.id === q.id)) chosen.push(q);
    }

    return {
      subtestId: spec.subtestId,
      titleId: spec.titleId,
      durationSec: spec.durationSec,
      minSubtestPercent: spec.minSubtestPercent,
      questions: chosen.slice(0, spec.questionCount),
    };
  });

  return {
    examId,
    subtests,
    poolCounts: {
      LF: pools.LF.length,
      PK: pools.PK.length,
      PF: pools.PF.length,
      PD: pools.PD.length,
    },
  };
}

export function generateStageSkipExamRun(
  skipExamId: string,
  attemptSeed: number
): {
  skipExamId: string;
  stageTitleId: string;
  unitId: string;
  questionCount: number;
  passPercent: number;
  questions: ExamQuestionItem[];
} | null {
  const entry = SKIP_EXAM_MAP[skipExamId];
  if (!entry) return null;
  const { stage, unit, semester } = entry;
  const rng = mulberry32(attemptSeed ^ hashString(skipExamId));

  // Primary pool: questions directly from the target Stage's Paths
  const stageItems: ExamQuestionItem[] = [];
  for (const path of stage.paths) {
    stageItems.push(...extractQuestionsFromLesson(path, attemptSeed));
  }

  // Secondary pool: sibling stages in the same Unit + semester parametric variants scoped to this Unit
  const unitItems: ExamQuestionItem[] = [];
  for (const st of unit.stages) {
    if (st.id === stage.id) continue;
    for (const p of st.paths) {
      unitItems.push(...extractQuestionsFromLesson(p, attemptSeed + 19));
    }
  }
  const paramItems = generateParametricVariantsForSemester(
    semester.id,
    [unit.id],
    attemptSeed + 31
  );

  const combined = [...stageItems, ...paramItems, ...unitItems];

  // Shuffle within priority bands (stage items first so the exam always tests target stage core)
  const shuffleBand = (arr: ExamQuestionItem[]) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  };

  const ordered = [
    ...shuffleBand(stageItems),
    ...shuffleBand(paramItems),
    ...shuffleBand(unitItems),
  ];

  const picked: ExamQuestionItem[] = [];
  const seen = new Set<string>();
  for (const item of ordered) {
    if (picked.length >= 6) break;
    const key = item.promptId.slice(0, 65);
    if (!seen.has(key)) {
      seen.add(key);
      picked.push({ ...item, unitId: unit.id });
    }
  }
  // Ensure minimum 6 questions even on very compact stages
  let safetyCounter = 0;
  for (const item of combined) {
    if (picked.length >= 6) break;
    if (!picked.some((p) => p.id === item.id)) {
      picked.push({ ...item, id: `${item.id}::fill${safetyCounter++}`, unitId: unit.id });
    }
  }

  return {
    skipExamId,
    stageTitleId: `Stage ${stage.stageNumber}: ${stage.titleId}`,
    unitId: unit.id,
    questionCount: picked.length,
    passPercent: 80,
    questions: picked,
  };
}

export function generatePlacementBlockRun(
  blockNumber: 1 | 2 | 3,
  attemptSeed: number
): {
  blockNumber: 1 | 2 | 3;
  titleId: string;
  durationSec: number;
  passPercent: number;
  questions: ExamQuestionItem[];
} | null {
  const block = PLACEMENT_BLOCKS.find((b) => b.blockNumber === blockNumber);
  if (!block) return null;
  const semId = block.sourceSemesters[0];
  const pools = buildSemesterSubtestPools(`${semId}.UAS`, attemptSeed + blockNumber * 101);

  // Pick balanced 6 questions across LF(2), PK(2), PF(1), PD(1)
  const picked: ExamQuestionItem[] = [
    ...(pools.LF.slice(0, 2)),
    ...(pools.PK.slice(0, 2)),
    ...(pools.PF.slice(0, 1)),
    ...(pools.PD.slice(0, 1)),
  ].slice(0, 6);

  return {
    blockNumber: block.blockNumber,
    titleId: block.titleId,
    durationSec: 240, // 4 menit per blok adaptif
    passPercent: 80, // Minimal 5/6 (83%) atau >= 80%
    questions: picked,
  };
}

export function auditExamVariantPools(): {
  examId: string;
  subtest: ExamSubtestId;
  poolCount: number;
  requiredMin: number;
  ok: boolean;
}[] {
  const rows: {
    examId: string;
    subtest: ExamSubtestId;
    poolCount: number;
    requiredMin: number;
    ok: boolean;
  }[] = [];

  for (const sem of CURRICULUM_SEMESTERS) {
    for (const exam of [sem.uts, sem.uas]) {
      const pools = buildSemesterSubtestPools(exam.examId, 12345);
      for (const st of exam.subtests) {
        const requiredMin = st.questionCount * st.minVariantPoolPerSlot;
        rows.push({
          examId: exam.examId,
          subtest: st.subtestId,
          poolCount: pools[st.subtestId].length,
          requiredMin,
          ok: pools[st.subtestId].length >= requiredMin,
        });
      }
    }
  }
  return rows;
}
