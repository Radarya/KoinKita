import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from 'motion/react';
import {
  ArrowRight,
  ArrowUp,
  BookOpen,
  Check,
  ChevronDown,
  Download,
  Heart,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Star,
  Trophy,
} from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import { playClick, setGameViewTrack } from '../lib/audio';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import CikoMascot from './CikoMascot';
import { AREA_THEMES } from './curriculum/expedition/expeditionConfig';
import { LandmarkSvg } from './curriculum/expedition/NusantaraPatterns';

interface LandingPageProps {
  onLinkGoogle: () => void;
  onContinueGuest: () => void;
  onGoToAuth: () => void;
  isLoading: boolean;
  hasPendingFriend?: boolean;
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

interface UnitHighlight {
  code: string;
  titleId: string;
  titleEn: string;
  focusId: string;
  focusEn: string;
}

interface SemesterShowcaseSpec {
  id: 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6';
  labelId: string;
  labelEn: string;
  pathsCount: number;
  regulationId: string;
  regulationEn: string;
  summaryId: string;
  summaryEn: string;
  units: UnitHighlight[];
}

const SEMESTER_SHOWCASE: SemesterShowcaseSpec[] = [
  {
    id: 'S1',
    labelId: 'Semester 1',
    labelEn: 'Semester 1',
    pathsCount: 28,
    regulationId: 'Bank Indonesia · Uang Rupiah 3D & BPKN',
    regulationEn: 'Bank Indonesia · Rupiah 3D Security & Consumer Law',
    summaryId:
      'Fondasi nilai tukar dari barter ke uang fiat, membedakan kebutuhan dan keinginan, keaslian Rupiah 3D, hingga membaca pajak struk belanja.',
    summaryEn:
      'Foundations of money from barter to fiat, separating needs from wants, verifying authentic banknotes, and reading receipt taxes.',
    units: [
      {
        code: 'Unit 1',
        titleId: 'Sejarah Uang & Evolusi Nilai',
        titleEn: 'History of Money & Value Evolution',
        focusId: 'Memahami alat tukar, satuan hitung, dan penyimpan nilai.',
        focusEn: 'Medium of exchange, unit of account, and store of value mechanics.',
      },
      {
        code: 'Unit 2',
        titleId: 'Keaslian Rupiah, BI & Peruri',
        titleEn: 'Rupiah Authenticity, BI & Peruri',
        focusId: 'Praktik langsung prinsip 3D (Dilihat, Diraba, Diterawang) serta perlakuan uang layak edar.',
        focusEn: 'Detecting authentic banknotes and proper currency handling rules.',
      },
      {
        code: 'Unit 3',
        titleId: 'Kebutuhan, Keinginan & Biaya Peluang',
        titleEn: 'Needs, Wants & Opportunity Cost',
        focusId: 'Menimbang biaya peluang tersembunyi sebelum mengambil keputusan belanja konsumtif.',
        focusEn: 'Weighing hidden opportunity costs before discretionary purchases.',
      },
      {
        code: 'Unit 4',
        titleId: 'Cermat Belanja & Membaca Struk',
        titleEn: 'Smart Shopping & Reading Receipts',
        focusId: 'Membandingkan harga satuan per gram/mililiter serta memeriksa PPN dan PBJT pada struk.',
        focusEn: 'Comparing unit prices per weight/volume and checking PPN/PBJT tax lines.',
      },
      {
        code: 'Unit 5',
        titleId: 'Hak Konsumen & Nilai Guna Barang',
        titleEn: 'Consumer Rights & Product Utility',
        focusId: 'Menguji klaim promo, garansi resmi, serta hak perlindungan konsumen.',
        focusEn: 'Auditing promotional claims, official warranties, and consumer rights.',
      },
    ],
  },
  {
    id: 'S2',
    labelId: 'Semester 2',
    labelEn: 'Semester 2',
    pathsCount: 33,
    regulationId: 'SimPel OJK · BI-FAST · QRIS MPM & CPM',
    regulationEn: 'OJK SimPel · BI-FAST · QRIS Standards',
    summaryId:
      'Mengelola tabungan tanpa tergerus biaya admin, memahami mutasi CR/DB, keamanan QRIS dinamis, arus kas harian, hingga menyusun Sinking Fund.',
    summaryEn:
      'Managing bank accounts without fee erosion, reading CR/DB statements, safe QRIS payments, career income capacity, and Sinking Funds.',
    units: [
      {
        code: 'Unit 6',
        titleId: 'Dunia Perbankan & Rekening Dasar',
        titleEn: 'Banking Basics & Account Statements',
        focusId: 'Memilih tabungan SimPel/reguler dan membaca kode kredit (CR) serta debet (DB).',
        focusEn: 'Choosing low-fee student accounts and reading CR/DB transaction ledgers.',
      },
      {
        code: 'Unit 7',
        titleId: 'Kartu Debit, Transfer & Virtual Account',
        titleEn: 'Debit Cards, Transfers & Virtual Accounts',
        focusId: 'Membandingkan kanal BI-FAST, SKNBI, RTGS, dan pemeriksaan penerima transfer.',
        focusEn: 'Comparing BI-FAST vs RTGS transfer rails and verifying destination accounts.',
      },
      {
        code: 'Unit 8',
        titleId: 'Dompet Digital & QRIS Masa Kini',
        titleEn: 'E-Wallets & Modern QRIS Payments',
        focusId: 'Menguji merchant QRIS asli vs tempelan palsu (MPM/CPM) dan mengamankan PIN.',
        focusEn: 'Checking legitimate QRIS merchant identity and protecting wallet PINs.',
      },
      {
        code: 'Unit 9',
        titleId: 'Anatomi Pemasukan & Arus Kas',
        titleEn: 'Income Anatomy & Cashflow Ledger',
        focusId: 'Melacak bocor halus pengeluaran kecil berulang dalam arus kas bulanan.',
        focusEn: 'Spotting recurring small leaks inside monthly cashflow summaries.',
      },
      {
        code: 'Unit 10',
        titleId: 'Pendapatan & Kapasitas Penghasilan',
        titleEn: 'Income Growth & Career Capacity',
        focusId: 'Membedakan pendapatan aktif, gaji bersih setelah potongan, dan nilai tambah keterampilan.',
        focusEn: 'Separating active income, take-home pay, and skill leverage.',
      },
      {
        code: 'Unit 11',
        titleId: 'Menyusun Anggaran & Sinking Fund',
        titleEn: 'Practical Budgeting & Sinking Funds',
        focusId: 'Menyiapkan dana tujuan spesifik terjadwal tanpa mengorbankan pos kebutuhan pokok.',
        focusEn: 'Building dedicated sinking funds for planned bills without cutting essentials.',
      },
    ],
  },
  {
    id: 'S3',
    labelId: 'Semester 3',
    labelEn: 'Semester 3',
    pathsCount: 30,
    regulationId: 'SLIK OJK · POJK 40/2024 · IASC OJK',
    regulationEn: 'SLIK OJK · LPBBTI Regulations · IASC Reporting',
    summaryId:
      'Membedakan utang produktif dan konsumtif, menghitung bunga flat vs efektif, membaca skor SLIK, hingga prosedur pemulihan pasca-insiden APK.',
    summaryEn:
      'Productive vs consumptive debt, flat vs effective interest math, SLIK credit records, OTP defense, and step-by-step APK incident recovery.',
    units: [
      {
        code: 'Unit 12',
        titleId: 'Utang Sehat vs Konsumtif & PayLater',
        titleEn: 'Healthy Debt vs Consumptive PayLater',
        focusId: 'Menghitung total arus kas keluar (pokok, bunga, layanan, denda) di balik promo 0%.',
        focusEn: 'Calculating cumulative PayLater costs behind 0% marketing headlines.',
      },
      {
        code: 'Unit 13',
        titleId: 'Matematika Bunga, SLIK OJK & Pelunasan',
        titleEn: 'Interest Math, SLIK OJK & Debt Payoff',
        focusId: 'Mengenal efek keterlambatan cicilan pada kolektibilitas SLIK dan strategi avalanche.',
        focusEn: 'Protecting SLIK collectibility scores and ranking debts efficiently.',
      },
      {
        code: 'Unit 14',
        titleId: 'Benteng Data Rahasia & Domain Resmi',
        titleEn: 'Secret Data Fortress & Official Domains',
        focusId: 'Menjaga kerahasiaan OTP/PIN/CVV dan memeriksa domain resmi `.go.id` serta kontak 157.',
        focusEn: 'Guarding OTP/PIN/CVV and verifying official financial domain names.',
      },
      {
        code: 'Unit 15',
        titleId: 'Modus Penipuan Modern & Recovery APK',
        titleEn: 'Modern Scams & .APK Incident Recovery',
        focusId: 'Mengamankan bukti forensik dan mengganti sandi dari perangkat bersih sebelum reset.',
        focusEn: 'Preserving evidence and resetting passwords safely from a clean device.',
      },
      {
        code: 'Unit 16',
        titleId: 'Pinjaman Daring Resmi OJK vs Ilegal',
        titleEn: 'Licensed OJK Lenders vs Illegal Apps',
        focusId: 'Memverifikasi batas izin akses CAMILAN dan menolak penawaran pinjaman via chat pribadi.',
        focusEn: 'Checking licensed CAMILAN permission limits and rejecting spam lenders.',
      },
    ],
  },
  {
    id: 'S4',
    labelId: 'Semester 4',
    labelEn: 'Semester 4',
    pathsCount: 24,
    regulationId: 'BPJS Kesehatan & Ketenagakerjaan · Fisher Real Yield',
    regulationEn: 'National Social Insurance & Time Value of Money',
    summaryId:
      'Membangun dana darurat berbasis pengeluaran wajib, membaca pengecualian polis asuransi murni, serta memahami erosi inflasi dan bunga majemuk.',
    summaryEn:
      'Sizing emergency reserves from mandatory spending, reading pure insurance policy exclusions, inflation erosion, and compounding.',
    units: [
      {
        code: 'Unit 17',
        titleId: 'Membangun & Menyimpan Dana Darurat',
        titleEn: 'Building & Storing Emergency Funds',
        focusId: 'Target 3-6x (lajang) hingga 6-12x pengeluaran wajib di instrumen likuid terpisah.',
        focusEn: 'Sizing 3-6x vs 6-12x expense reserves across accessible liquid accounts.',
      },
      {
        code: 'Unit 18',
        titleId: 'BPJS, Asuransi Murni & Klaim Polis',
        titleEn: 'BPJS, Term Insurance & Policy Claims',
        focusId: 'Memahami masa tunggu (waiting period), pengecualian polis, dan prioritas proteksi.',
        focusEn: 'Inspecting waiting periods, exclusions, and protection-first priorities.',
      },
      {
        code: 'Unit 19',
        titleId: 'Inflasi, Daya Beli & Nilai Waktu Uang',
        titleEn: 'Inflation, Purchasing Power & TVM',
        focusId: 'Membandingkan imbal hasil nominal vs riil agar nilai tabungan tidak tergerus harga.',
        focusEn: 'Comparing nominal returns against real inflation-adjusted purchasing power.',
      },
      {
        code: 'Unit 20',
        titleId: 'Kekuatan Waktu & Bunga Majemuk',
        titleEn: 'Time Horizon & Compound Growth',
        focusId: 'Melihat dampak memulai lebih dini pada akumulasi jangka panjang tanpa menebak pasar.',
        focusEn: 'Quantifying why early consistent contributions amplify compounding.',
      },
    ],
  },
  {
    id: 'S5',
    labelId: 'Semester 5',
    labelEn: 'Semester 5',
    pathsCount: 33,
    regulationId: 'LPS 3T · DJPPR Kemenkeu · BEI · POJK 8/2025 Syariah',
    regulationEn: 'LPS 3T Rules · Retail SBN · IDX Stocks · POJK Syariah',
    summaryId:
      'Memahami penjaminan simpanan 3T LPS + dampak cashback, SBN Ritel, perbandingan biaya Expense Ratio bersih, dasar saham BEI, dan akad syariah.',
    summaryEn:
      'Navigating LPS 3T deposit insurance, gold & term deposits, Retail SBN, net expense ratio drag, IDX equities, and Sharia principles.',
    units: [
      {
        code: 'Unit 21',
        titleId: 'Segitiga Risiko, 3T LPS & Biaya Investasi',
        titleEn: 'Risk Triangle, LPS 3T & Fee Drag',
        focusId: 'Cek syarat 3T LPS (tercatat, bunga ≤ TBP, tanpa fraud) serta dampak Expense Ratio bruto.',
        focusEn: 'Auditing LPS 3T eligibility and gross vs net fee impact over decades.',
      },
      {
        code: 'Unit 22',
        titleId: 'Deposito Berjangka & Investasi Emas',
        titleEn: 'Time Deposits & Gold Spread Mechanics',
        focusId: 'Menghitung selisih harga beli-jual (spread) emas dan pajak final bunga deposito.',
        focusEn: 'Evaluating physical gold buyback spreads and deposit tax withholding.',
      },
      {
        code: 'Unit 23',
        titleId: 'Surat Berharga Negara Ritel ORI/SBR/SR/ST',
        titleEn: 'Indonesian Retail Sovereign Bonds',
        focusId: 'Membedakan kupon tetap vs mengambang (floating with floor) dan status tradable.',
        focusEn: 'Comparing fixed vs floating-with-floor coupons and tradability rules.',
      },
      {
        code: 'Unit 24',
        titleId: 'Reksadana, Biaya & Pelaporan Pajak',
        titleEn: 'Mutual Funds, Costs & Tax Reporting',
        focusId: 'Membedakan RDPU, pendapatan tetap, campuran, saham, dan pelaporan SPT tahunan.',
        focusEn: 'Understanding money-market, bond, equity mutual funds and annual tax reporting.',
      },
      {
        code: 'Unit 25',
        titleId: 'Pasar Modal & Saham Dasar BEI',
        titleEn: 'Capital Markets & Basic IDX Equities',
        focusId: 'Memahami kepemilikan lot, dividen, fluktuasi harga, serta peran KSEI dan BEI.',
        focusEn: 'Learning lot ownership, dividends, volatility, and KSEI custody safeguards.',
      },
      {
        code: 'Unit 26',
        titleId: 'Prinsip Keuangan Syariah Indonesia',
        titleEn: 'Indonesian Sharia Finance Principles',
        focusId: 'Mengenali instrumen bebas riba, akad mudharabah/wakalah, dan SBSN ritel.',
        focusEn: 'Exploring Sharia contracts, screening standards, and sovereign Sukuk.',
      },
    ],
  },
  {
    id: 'S6',
    labelId: 'Semester 6',
    labelEn: 'Semester 6',
    pathsCount: 30,
    regulationId: 'BI-Rate · PP 20/2026 UMKM · Stres Uji KPR Keluarga',
    regulationEn: 'BI-Rate Cycles · PP 20/2026 MSME Tax · Family Stress Test',
    summaryId:
      'Korelasi kelas aset & limitasi jujur DCA, dampak suku bunga acuan pada cicilan KPR mengambang, pajak PP 20/2026, pembukuan UMKM, dan capstone keluarga.',
    summaryEn:
      'Asset correlations, honest DCA mechanics, BI-Rate impacts on floating mortgages, PP 20/2026 MSME taxes, and family stress testing.',
    units: [
      {
        code: 'Unit 27',
        titleId: 'Diversifikasi, Korelasi & Batasan DCA',
        titleEn: 'Diversification, Correlation & DCA Limits',
        focusId: 'Memadukan kelas aset berkorelasi rendah dan mengenali ciri skema Ponzi.',
        focusEn: 'Pairing low-correlation asset classes and exposing Ponzi structures.',
      },
      {
        code: 'Unit 28',
        titleId: 'Ekonomi Makro, BI-Rate & Siklus Pasar',
        titleEn: 'Macroeconomics, BI-Rate & Market Cycles',
        focusId: 'Melihat transmisi BI-Rate ke bunga kredit, imbal hasil obligasi, dan likuiditas.',
        focusEn: 'Tracing policy rate shifts onto credit rates and bond pricing.',
      },
      {
        code: 'Unit 29',
        titleId: 'Pajak Pribadi & UMKM PP 20/2026',
        titleEn: 'Personal Income Tax & PP 20/2026 MSME',
        focusId: 'Memahami pemisahan kas pribadi-usaha dan kepatuhan kewajiban pajak usaha.',
        focusEn: 'Separating household from business ledgers under MSME tax regulations.',
      },
      {
        code: 'Unit 30',
        titleId: 'Keuangan Usaha Mikro & Sampingan',
        titleEn: 'Micro-Business Bookkeeping & Margins',
        focusId: 'Menghitung HPP, titik impas (BEP), dan menahan modal kerja usaha tetap sehat.',
        focusEn: 'Computing unit COGS, break-even volumes, and healthy working capital.',
      },
      {
        code: 'Unit 31',
        titleId: 'KPR, Pensiun & Stress Test Keluarga',
        titleEn: 'Mortgages, Retirement & Family Stress Test',
        focusId: 'Capstone menguji ketahanan kas keluarga menghadapi kenaikan cicilan KPR mengambang.',
        focusEn: 'Capstone stress test simulating household resilience against floating mortgage hikes.',
      },
    ],
  },
];

const FLASHCARD_DEMOS = [
  {
    term: 'INFLASI',
    categoryId: 'Semester 4 · Unit 19',
    categoryEn: 'Semester 4 · Unit 19',
    defId:
      'Kemerosotan nilai uang (kertas) karena banyaknya dan cepatnya uang beredar sehingga menyebabkan naiknya harga barang-barang (KBBI / Bank Indonesia).',
    defEn:
      'Sustained rise in general prices over time that erodes the purchasing power of money.',
    noteId: 'Rujukan Buku Saku: KBBI & Bank Indonesia',
    noteEn: 'Guidebook Ref: KBBI & Bank Indonesia',
  },
  {
    term: 'SYARAT 3T LPS',
    categoryId: 'Semester 5 · Unit 21',
    categoryEn: 'Semester 5 · Unit 21',
    defId:
      'Syarat simpanan dijamin LPS hingga Rp2 miliar/nasabah/bank: Tercatat pembukuan, Tingkat bunga (termasuk cashback) ≤ TBP LPS, dan Tidak merugikan bank.',
    defEn:
      'Deposit insurance criteria up to Rp2B: Recorded in bank ledgers, effective yield ≤ LPS cap, and no unlawful acts.',
    noteId: 'Rujukan Buku Saku: LPS Indonesia',
    noteEn: 'Guidebook Ref: Indonesia Deposit Insurance Corp (LPS)',
  },
  {
    term: 'SLIK OJK',
    categoryId: 'Semester 3 · Unit 13',
    categoryEn: 'Semester 3 · Unit 13',
    defId:
      'Sistem Layanan Informasi Keuangan yang mencatat riwayat kelancaran kredit debitur (Kolektibilitas 1–5) sebagai acuan pengajuan KPR maupun kredit resmi.',
    defEn:
      'OJK financial credit reporting ledger tracking borrower repayment standing across Collectibility Tiers 1–5.',
    noteId: 'Rujukan Buku Saku: Otoritas Jasa Keuangan',
    noteEn: 'Guidebook Ref: Financial Services Authority (OJK)',
  },
];

const HERO_ROLES: Array<{
  id: 'hero' | 'scholar' | 'chef' | 'detective' | 'wealth';
  labelId: string;
  labelEn: string;
  areaId: string;
  areaEn: string;
  insightId: string;
  insightEn: string;
}> = [
  {
    id: 'hero',
    labelId: 'Pemandu',
    labelEn: 'Guide',
    areaId: 'Ekspedisi 6 Semester · 175 Keping Materi',
    areaEn: '6-Semester Expedition · 175 Modules',
    insightId: 'Pilih jalurmu: mulai dari nol di Semester 1 atau uji kemampuan lewat TPB hingga Semester 4.',
    insightEn: 'Start from Semester 1 basics or pass the Joint Placement Test straight up to Semester 4.',
  },
  {
    id: 'scholar',
    labelId: 'Buku Saku',
    labelEn: 'Handbook',
    areaId: 'Rujukan Regulasi OJK & BI',
    areaEn: 'Official OJK & BI References',
    insightId: 'Setiap unit membuka Buku Saku berisi ringkasan hukum, hitung nyata, dan definisi baku KBBI.',
    insightEn: 'Every unit unlocks a Handbook grounded in official OJK, Bank Indonesia, and LPS rules.',
  },
  {
    id: 'chef',
    labelId: 'Anggaran',
    labelEn: 'Budgeting',
    areaId: 'Semester 1–2 · Arus Kas',
    areaEn: 'Semesters 1–2 · Cashflow',
    insightId: 'Pisahkan pos kebutuhan pokok, Sinking Fund terencana, dan lacak bocor halus sebelum investasi.',
    insightEn: 'Separate essentials, build dedicated Sinking Funds, and plug silent budget leaks first.',
  },
  {
    id: 'detective',
    labelId: 'Keamanan',
    labelEn: 'Security',
    areaId: 'Semester 3 · Benteng Digital',
    areaEn: 'Semester 3 · Fraud Defense',
    insightId: 'Audit jebakan .APK berbahaya, cek legalitas pinjaman OJK, dan latih langkah pemulihan IASC.',
    insightEn: 'Spotting malicious .APK traps, checking OJK lenders, and recovering from fraud.',
  },
  {
    id: 'wealth',
    labelId: 'Investasi',
    labelEn: 'Investing',
    areaId: 'Semester 4–6 · Kemandirian',
    areaEn: 'Semesters 4–6 · Independence',
    insightId: 'Bandingkan syarat 3T LPS, SBN Ritel, Expense Ratio bersih, PP 20/2026, serta stres uji KPR.',
    insightEn: 'Master LPS 3T deposit limits, retail SBN, net expense drag, taxes, and mortgage stress tests.',
  },
];

export default function LandingPage({
  onLinkGoogle,
  onContinueGuest,
  onGoToAuth,
  isLoading,
  hasPendingFriend,
}: LandingPageProps) {
  const { language, toggleLanguage } = useTranslation();
  const isId = language === 'id';

  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const stageParallaxY = useTransform(heroScrollProgress, [0, 1], [0, -34]);
  const badgeParallaxY = useTransform(heroScrollProgress, [0, 1], [0, -18]);

  const [showScrollTop, setShowScrollTop] = useState(false);

  // Interactive Hero Ciko role showcase
  const [heroRoleIdx, setHeroRoleIdx] = useState(0);
  const currentHeroRole = HERO_ROLES[heroRoleIdx];

  // Interactive 6-Semester Nusantara Atlas state
  const [activeSemesterId, setActiveSemesterId] = useState<SemesterShowcaseSpec['id']>('S1');
  const [activeUnitIdx, setActiveUnitIdx] = useState(0);
  const activeSemester =
    SEMESTER_SHOWCASE.find((s) => s.id === activeSemesterId) || SEMESTER_SHOWCASE[0];
  const activeArea = AREA_THEMES[activeSemester.id] || AREA_THEMES.S1;
  const activeUnit = activeSemester.units[activeUnitIdx] || activeSemester.units[0];

  // Interactive Mechanics Demo states (Hearts, 3D Flashcard, TPB Simulation)
  const [demoLives, setDemoLives] = useState(5);
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [tpbSimulatedBlocks, setTpbSimulatedBlocks] = useState(3);

  // Interactive Liga Rank highlight
  const [selectedRankIdx, setSelectedRankIdx] = useState(0);

  // THE ONE LIVE THING: 50/30/20 Budget Calculator
  const [monthlyIncome, setMonthlyIncome] = useState<number>(5000000);
  const incomePresets = [
    { label: isId ? 'Rp 3 Juta' : 'Rp 3M', value: 3000000 },
    { label: isId ? 'Rp 5 Juta' : 'Rp 5M', value: 5000000 },
    { label: isId ? 'Rp 10 Juta' : 'Rp 10M', value: 10000000 },
    { label: isId ? 'Rp 20 Juta' : 'Rp 20M', value: 20000000 },
  ];
  const needsAmount = Math.round(monthlyIncome * 0.5);
  const wantsAmount = Math.round(monthlyIncome * 0.3);
  const savingsAmount = Math.round(monthlyIncome * 0.2);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Feedback form state
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackHoverRating, setFeedbackHoverRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    setGameViewTrack('landing');
    const handleScroll = () => setShowScrollTop(window.scrollY > 450);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectSemester = (semId: SemesterShowcaseSpec['id']) => {
    playClick();
    setActiveSemesterId(semId);
    setActiveUnitIdx(0);
  };

  const handleCycleCikoHero = () => {
    playClick();
    setHeroRoleIdx((prev) => (prev + 1) % HERO_ROLES.length);
  };

  const scrollToTop = () => {
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;
    setFeedbackSubmitting(true);
    playClick();

    const payload = {
      name: feedbackName.trim() || 'Anonim',
      email: feedbackEmail.trim() || 'anonim@koinkita.xyz',
      rating: feedbackRating,
      comment: feedbackComment.trim(),
      createdAt: Date.now(),
    };

    try {
      await addDoc(collection(db, 'feedbacks'), payload);
    } catch (fsErr) {
      console.warn('Firestore feedbacks write:', fsErr);
    }

    try {
      await fetch('https://formsubmit.co/ajax/aydinaryasatyaradithya@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: 'Masukan Pengguna CIKO (Landing Page)',
          _captcha: 'false',
          Nama: payload.name,
          Email: payload.email,
          Rating: `${payload.rating} Bintang`,
          Saran: payload.comment,
        }),
      });
    } catch (mailErr) {
      console.warn('FormSubmit notification error:', mailErr);
    }

    setFeedbackSubmitted(true);
    setFeedbackName('');
    setFeedbackEmail('');
    setFeedbackRating(5);
    setFeedbackComment('');
    setFeedbackSubmitting(false);
  };

  const ranks = [
    {
      title: isId ? 'Pemula' : 'Beginner',
      xp: '0 - 999 XP',
      milestoneId: 'Kampung Transaksi · Fondasi Rupiah & Belanja',
      milestoneEn: 'Transaction Village · Currency & Smart Spending',
    },
    {
      title: isId ? 'Sadar Finansial' : 'Financially Aware',
      xp: '1.000 - 4.999 XP',
      milestoneId: 'Kota Perdagangan · Rekening, QRIS & Arus Kas',
      milestoneEn: 'Trade City · Banking, QRIS & Cashflow Ledgers',
    },
    {
      title: isId ? 'Bijak Belanja' : 'Wise Spender',
      xp: '5.000 - 14.999 XP',
      milestoneId: 'Benteng Keamanan · SLIK OJK & Antipenipuan APK',
      milestoneEn: 'Security Fort · SLIK Credit & Scam Defense',
    },
    {
      title: isId ? 'Investor Cerdas' : 'Smart Investor',
      xp: '15.000 - 29.999 XP',
      milestoneId: 'Lumbung Ketahanan · Dana Darurat, Polis & Inflasi',
      milestoneEn: 'Resilience Granary · Emergency Funds & Insurance',
    },
    {
      title: isId ? 'Ahli Anggaran' : 'Budget Strategist',
      xp: '30.000 - 49.999 XP',
      milestoneId: 'Pusat Investasi · 3T LPS, SBN Ritel, Reksadana & Syariah',
      milestoneEn: 'Investment Hub · LPS 3T, Bonds, Funds & Sharia',
    },
    {
      title: isId ? 'Master Kekayaan' : 'Wealth Master',
      xp: '50.000+ XP',
      milestoneId: 'Kota Kemandirian · BI-Rate, Pajak PP 20/2026 & KPR',
      milestoneEn: 'Independence City · Macro Cycles, Taxes & Mortgages',
    },
  ];

  const faqs = [
    {
      q: isId ? 'Apakah seluruh kurikulum CIKO benar-benar gratis?' : 'Is the full CIKO curriculum free?',
      a: isId
        ? 'Ya. Seluruh 6 Semester, 31 Unit, 175 Keping Materi Ekspedisi, Buku Saku, hingga Arena Liga dapat dimainkan gratis tanpa paywall atau iklan pengganggu.'
        : 'Yes. All 6 Semesters, 31 Units, 175 Expedition Modules, Handbooks, and Weekly Leagues are free without ads or paywalls.',
    },
    {
      q: isId ? 'Bisakah lompat materi jika sudah paham dasar keuangan?' : 'Can experienced learners skip introductory units?',
      a: isId
        ? 'Bisa. Gunakan Tes Penempatan Bersama (TPB) pada blok pembuka. Lulus ≥80% pada Blok 1 sampai Blok 3 membuka akses langsung hingga Semester 4. Setiap Semester juga memiliki gerbang UTS dan UAS.'
        : 'Yes. Take the Joint Placement Test (TPB). Scoring ≥80% across Blocks 1 to 3 unlocks immediate access up to Semester 4, complemented by semester UTS & UAS exams.',
    },
    {
      q: isId ? 'Bagaimana sistem 5 Nyawa dan menu Latihan bekerja?' : 'How do the 5 Lives and Practice Hub work?',
      a: isId
        ? 'Kesalahan pada jalur Ekspedisi utama mengurangi 1 dari 5 Nyawa dan otomatis mencatat soal tersebut ke Bank Kesalahan. Kamu bisa menebus +1 Nyawa gratis lewat Tebus Kesalahan atau Flashcard Konsep di menu Latihan (maksimal 2× per hari), memakai 50 Koin Saku, atau dukungan teman di menu Sosial.'
        : 'Mistakes on main Expedition Paths deduct 1 of 5 Lives and log the question to your Mistake Bank. Recover +1 Life via Practice Review or Concept Flashcards (up to 2 free recoveries/day), spend 50 Coins, or get support from Social friends.',
    },
    {
      q: isId ? 'Apakah progres Akun Tamu aman jika aplikasi dihapus?' : 'Is Guest account progress preserved if I switch devices?',
      a: isId
        ? 'Progres Akun Tamu disimpan lokal di perangkat (dan disinkronkan sementara maksimal 30 hari tidak aktif). Apabila aplikasi dicopot atau cache perangkat dibersihkan, data tamu lokal akan terhapus. Tautkan ke akun Google atau Email kapan saja agar koin, rank, dan progres Keping Materi tersimpan permanen di cloud.'
        : 'Guest data lives locally on your device with a 30-day inactivity window. Uninstalling the app clears local device progress. Link with Google or Email anytime to store coins, ranks, and module progress permanently.',
    },
    {
      q: isId ? 'Apakah materi CIKO merupakan saran investasi pribadi?' : 'Does CIKO provide certified investment advice?',
      a: isId
        ? 'Bukan. Semua studi kasus dan Buku Saku disusun murni untuk edukasi literasi finansial merujuk regulasi Bank Indonesia, OJK, LPS, dan perundang-undangan resmi, bukan rekomendasi beli/jual produk keuangan spesifik.'
        : 'No. Case studies and Handbooks are strictly educational, referencing official Bank Indonesia, OJK, and LPS frameworks rather than personal investment recommendations.',
    },
  ];

  const currentFlashcard = FLASHCARD_DEMOS[flashcardIdx];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0D1117] font-sans selection:bg-emerald-200 selection:text-[#064E3B] overflow-x-clip">
      {/* ── Pending Friend Request Modal (Dialog: allowed clean solid scrim) ── */}
      <AnimatePresence>
        {hasPendingFriend && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D1117]/80">
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
              className="w-full max-w-md bg-white p-8"
            >
              <h3 className="font-poppins font-black text-2xl text-[#0D1117] leading-tight mb-3">
                {isId ? 'Undangan Berteman' : 'Friend Invitation'}
              </h3>
              <p className="text-[#0D1117]/85 leading-relaxed text-base mb-6">
                {isId
                  ? 'Temanmu mengajak belajar keuangan bareng di CIKO. Masuk sekarang untuk langsung terhubung di menu Sosial.'
                  : 'Someone invited you to learn finance together on CIKO. Sign in now to connect in Social.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    playClick();
                    localStorage.removeItem('pendingFriendRequest');
                    window.location.reload();
                  }}
                  className="flex-1 py-3.5 bg-[#F4F5F7] hover:bg-[#E5E7EB] text-[#0D1117] font-bold rounded-full transition-colors cursor-pointer text-sm active:scale-[0.98]"
                >
                  {isId ? 'Abaikan' : 'Dismiss'}
                </button>
                <button
                  onClick={() => {
                    playClick();
                    onGoToAuth();
                  }}
                  className="flex-1 py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-full transition-colors cursor-pointer text-sm active:scale-[0.98]"
                >
                  {isId ? 'Masuk Sekarang' : 'Sign In Now'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 1. NAVIGATION: Clean flat bar separated via tone step + GPU Scroll Line ── */}
      <header className="sticky top-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-2.5 shrink-0">
            <CikoMascot size={32} animated={false} />
            <span className="font-poppins font-black text-xl tracking-tight text-[#0D1117]">
              CIKO
            </span>
          </a>

          <nav
            aria-label="Navigasi Utama"
            className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#0D1117]/80"
          >
            <a href="#ekspedisi" className="hover:text-[#059669] transition-colors">
              {isId ? 'Kurikulum' : 'Curriculum'}
            </a>
            <a href="#mekanisme" className="hover:text-[#059669] transition-colors">
              {isId ? 'Cara Belajar' : 'Mechanics'}
            </a>
            <a href="#kalkulator" className="hover:text-[#059669] transition-colors">
              {isId ? 'Simulasi 50/30/20' : '50/30/20 Tool'}
            </a>
            <a href="#liga" className="hover:text-[#059669] transition-colors">
              {isId ? 'Liga' : 'Leagues'}
            </a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                playClick();
                toggleLanguage();
              }}
              className="text-sm font-bold text-[#0D1117]/75 hover:text-[#0D1117] px-3 py-2 rounded-full transition-colors cursor-pointer active:scale-[0.97]"
              aria-label="Toggle Language"
            >
              {isId ? 'ID / EN' : 'EN / ID'}
            </button>
            <button
              onClick={() => {
                playClick();
                onGoToAuth();
              }}
              className="bg-[#0D1117] hover:bg-[#1E293B] text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all cursor-pointer active:scale-[0.97]"
            >
              {isId ? 'Masuk' : 'Sign In'}
            </button>
          </div>
        </div>
        {/* Scroll progress scale bar (GPU transform only) */}
        <motion.div
          style={{ scaleX: smoothProgress, transformOrigin: '0% 50%' }}
          className="h-[3px] w-full bg-[#059669]"
        />
      </header>

      {/* ── 2. HERO: Full-bleed tone step (#F4F5F7), Kinetic Typography & Live Interactive Atlas Stage ── */}
      <section ref={heroRef} className="bg-[#F4F5F7] py-10 sm:py-16 lg:py-24 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left ~54%: Strict <=2 line headline, full ink statement, direct CTA buttons (leads first on mobile & desktop) */}
          <div className="lg:col-span-7 order-1">
            <div className="overflow-hidden mb-5">
              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.52, ease: EASE_OUT_EXPO }}
                className="font-poppins font-black text-[1.95rem] sm:text-5xl lg:text-6xl leading-[0.98] tracking-[-0.03em] text-[#0D1117] whitespace-pre-line"
              >
                {isId ? 'Kuasai Keuangan.\nSatu Keping Sehari.' : 'Master Money.\nOne Step Each Day.'}
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: EASE_OUT_EXPO }}
              className="text-base sm:text-[1.35rem] text-[#0D1117]/90 leading-[1.45] max-w-[44ch] mb-7 sm:mb-8 font-normal"
            >
              {isId
                ? 'Enam semester literasi finansial gratis. Rujuk regulasi OJK dan Bank Indonesia dengan sistem nyawa interaktif tanpa iklan.'
                : 'Six semesters of free Indonesian financial literacy grounded in OJK & Bank Indonesia regulations with active life mechanics.'}
            </motion.p>

            {/* Primary Actions (Pill buttons, single solid flat fills) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.14, ease: EASE_OUT_EXPO }}
              className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 mb-7 sm:mb-8"
            >
              <button
                onClick={() => {
                  playClick();
                  onLinkGoogle();
                }}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2.5 py-4 px-7 bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm rounded-full transition-transform transition-colors cursor-pointer disabled:opacity-50 active:scale-[0.97]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isId ? 'Menghubungkan...' : 'Connecting...'}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.709 0 3.277.604 4.5 1.625l2.437-2.437C17.312 1.696 14.933 1 12.24 1 6.58 1 2 5.58 2 11.24s4.58 10.24 10.24 10.24c5.795 0 10.24-4.11 10.24-10.24 0-.685-.08-1.355-.24-1.955H12.24z" />
                    </svg>
                    <span>{isId ? 'Masuk dengan Google' : 'Sign in with Google'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  playClick();
                  onGoToAuth();
                }}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 py-4 px-7 bg-[#0D1117] hover:bg-[#1E293B] text-white font-bold text-sm rounded-full transition-transform transition-colors cursor-pointer disabled:opacity-50 active:scale-[0.97]"
              >
                <span>{isId ? 'Masuk dengan Email' : 'Sign in with Email'}</span>
              </button>

              <button
                onClick={() => {
                  playClick();
                  onContinueGuest();
                }}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 py-4 px-7 bg-white hover:bg-[#ECEEF2] text-[#0D1117] font-bold text-sm rounded-full transition-transform transition-colors cursor-pointer disabled:opacity-50 active:scale-[0.97]"
              >
                <span>{isId ? 'Lanjut sebagai Tamu' : 'Play as Guest'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Tabular architectural specs (clean tone step block, no border hairlines) */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25, ease: EASE_OUT_EXPO }}
              className="grid grid-cols-3 gap-2 sm:gap-4 max-w-xl"
            >
              <div className="bg-white p-4">
                <p className="font-poppins font-black text-2xl sm:text-3xl text-[#0D1117] tabular-nums">
                  6
                </p>
                <p className="text-sm text-[#0D1117]/80 font-medium mt-0.5">
                  {isId ? 'Semester & UTS/UAS' : 'Semesters & Exams'}
                </p>
              </div>
              <div className="bg-white p-4">
                <p className="font-poppins font-black text-2xl sm:text-3xl text-[#0D1117] tabular-nums">
                  175
                </p>
                <p className="text-sm text-[#0D1117]/80 font-medium mt-0.5">
                  {isId ? 'Keping · 31 Unit' : 'Modules · 31 Units'}
                </p>
              </div>
              <div className="bg-white p-4">
                <p className="font-poppins font-black text-2xl sm:text-3xl text-[#059669] tabular-nums">
                  Rp 0
                </p>
                <p className="text-sm text-[#0D1117]/80 font-medium mt-0.5">
                  {isId ? 'Gratis & Tanpa Iklan' : 'Free & Ad-Free'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right ~46%: Real [data-ui] Interactive Desktop Stage with Scroll Parallax & Ciko Pose Switcher */}
          <motion.div
            style={{ y: stageParallaxY }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE_OUT_EXPO }}
            className="lg:col-span-5 order-2"
          >
            <div data-ui className="bg-white p-5 sm:p-7">
              {/* Interactive role switcher pills inside app preview */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {HERO_ROLES.map((role, idx) => {
                  const isActive = heroRoleIdx === idx;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        playClick();
                        setHeroRoleIdx(idx);
                      }}
                      className={`relative px-3.5 py-2 text-xs font-bold rounded-full cursor-pointer transition-colors ${
                        isActive ? 'text-white' : 'text-[#0D1117]/75 hover:text-[#0D1117] bg-[#F4F5F7]'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="heroRoleActiveBg"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                          className="absolute inset-0 bg-[#0D1117] rounded-full"
                        />
                      )}
                      <span className="relative z-10">{isId ? role.labelId : role.labelEn}</span>
                    </button>
                  );
                })}
              </div>

              {/* Mascot Showcase Stage (Clean tone ground, NO comic speech bubble attached) */}
              <div
                onClick={handleCycleCikoHero}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleCycleCikoHero();
                }}
                role="button"
                tabIndex={0}
                aria-label={isId ? 'Klik Ciko untuk mengganti peran' : 'Click Ciko to switch character pose'}
                className="relative bg-[#EEFBF4] py-8 px-6 flex flex-col items-center justify-center cursor-pointer group select-none"
              >
                <motion.div
                  style={{ y: badgeParallaxY }}
                  className="flex items-center justify-between w-full mb-3 text-sm font-bold text-[#064E3B]"
                >
                  <span>{isId ? currentHeroRole.areaId : currentHeroRole.areaEn}</span>
                  <span className="tabular-nums text-[#059669]">5/5</span>
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentHeroRole.id}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -10 }}
                    transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
                    className="transition-transform duration-200 group-hover:scale-105"
                  >
                    <CikoMascot size={210} pose={currentHeroRole.id} animated={true} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Docked contextual CIKO telemetry panel inside [data-ui] */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHeroRole.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="bg-[#0D1117] text-white p-5 mt-3"
                >
                  <p className="text-sm font-bold text-[#34D399] mb-1">
                    {isId ? `Mode ${currentHeroRole.labelId}` : `${currentHeroRole.labelEn} Mode`}
                  </p>
                  <p className="text-sm sm:text-base text-white/95 leading-relaxed">
                    {isId ? currentHeroRole.insightId : currentHeroRole.insightEn}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. ENAM WILAYAH EKSPEDISI ATLAS (White field + Shared layoutId Region Switcher + Real 31 Units) ── */}
      <section id="ekspedisi" className="bg-white py-20 sm:py-32 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.38, ease: EASE_OUT_EXPO }}
            className="max-w-2xl mb-12"
          >
            <h2 className="font-poppins font-black text-[1.75rem] sm:text-4xl lg:text-[2.75rem] leading-[1.04] tracking-[-0.025em] text-[#0D1117] whitespace-pre-line mb-4">
              {isId ? 'Enam Wilayah.\n175 Keping Materi.' : 'Six Regions.\n175 Study Modules.'}
            </h2>
            <p className="text-base sm:text-lg text-[#0D1117]/85 leading-relaxed max-w-[58ch]">
              {isId
                ? 'Kurikulum disusun bertahap layaknya perjalanan antarwilayah Nusantara, mulai dari mengenal uang Rupiah hingga stres uji KPR keluarga.'
                : 'Progression spans six regional Nusantara milestones, from basic Rupiah literacy to household mortgage stress testing.'}
            </p>
          </motion.div>

          {/* Desktop Interactive Atlas Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Selector Rail: 6 Semesters */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {SEMESTER_SHOWCASE.map((sem) => {
                const area = AREA_THEMES[sem.id];
                const isSelected = activeSemesterId === sem.id;
                return (
                  <button
                    key={sem.id}
                    type="button"
                    onClick={() => handleSelectSemester(sem.id)}
                    className={`relative text-left p-5 cursor-pointer transition-colors overflow-hidden active:scale-[0.99] ${
                      isSelected ? 'text-white' : 'bg-[#F4F5F7] hover:bg-[#ECEEF2] text-[#0D1117]'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="semesterAtlasActive"
                        transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                        className="absolute inset-0 bg-[#0D1117]"
                      />
                    )}
                    <div className="relative z-10 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p
                          className={`font-poppins font-black text-base sm:text-lg leading-snug ${
                            isSelected ? 'text-white' : 'text-[#0D1117]'
                          }`}
                        >
                          {area.nameId}
                        </p>
                        <p
                          className={`text-sm mt-1 truncate ${
                            isSelected ? 'text-white/80' : 'text-[#0D1117]/75'
                          }`}
                        >
                          {isId ? sem.labelId : sem.labelEn} · {sem.units.length} Unit · {sem.pathsCount} {isId ? 'Keping' : 'Modules'}
                        </p>
                      </div>
                      <ArrowRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isSelected ? 'translate-x-1 text-[#34D399]' : 'text-[#0D1117]/50'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Expanded Interactive Canvas */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSemester.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
                  className="p-6 sm:p-10 transition-colors"
                  style={{ backgroundColor: activeArea.softSurface }}
                >
                  {/* Top visual row: Landmark Vector + Region Summary */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                    <div className="space-y-2 flex-1 min-w-0">
                      <p className="text-sm font-bold" style={{ color: activeArea.inkDark }}>
                        {isId ? activeSemester.regulationId : activeSemester.regulationEn}
                      </p>
                      <h3 className="font-poppins font-black text-2xl sm:text-3xl leading-[1.05] text-[#0D1117]">
                        {activeArea.nameId}
                      </h3>
                      <p className="text-base text-[#0D1117]/85 leading-relaxed max-w-[54ch]">
                        {isId ? activeSemester.summaryId : activeSemester.summaryEn}
                      </p>
                    </div>

                    <motion.div
                      initial={{ scale: 0.85, rotate: -4 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                      className="shrink-0 bg-white p-4"
                    >
                      <LandmarkSvg kind={activeArea.landmark} size={112} />
                    </motion.div>
                  </div>

                  {/* Interactive Unit Selector Grid */}
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-[#0D1117]">
                      {isId
                        ? `Pilih Unit di ${activeSemester.labelId} untuk melihat materi:`
                        : `Pick a Unit in ${activeSemester.labelEn} to inspect focus:`}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {activeSemester.units.map((unit, idx) => {
                        const unitActive = activeUnitIdx === idx;
                        return (
                          <button
                            key={unit.code}
                            type="button"
                            onClick={() => {
                              playClick();
                              setActiveUnitIdx(idx);
                            }}
                            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-full cursor-pointer transition-colors active:scale-[0.97] ${
                              unitActive
                                ? 'text-white'
                                : 'bg-white text-[#0D1117] hover:bg-[#E5E7EB]'
                            }`}
                            style={unitActive ? { backgroundColor: activeArea.accentBg } : undefined}
                          >
                            {unit.code}: {isId ? unit.titleId : unit.titleEn}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Unit Detail Panel */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeUnit.code}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22 }}
                        className="bg-white p-5 sm:p-6"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-poppins font-black text-lg text-[#0D1117] mb-1">
                              {activeUnit.code}: {isId ? activeUnit.titleId : activeUnit.titleEn}
                            </p>
                            <p className="text-sm sm:text-base text-[#0D1117]/85 leading-relaxed">
                              {isId ? activeUnit.focusId : activeUnit.focusEn}
                            </p>
                          </div>
                          <BookOpen
                            className="w-5 h-5 shrink-0 mt-1"
                            style={{ color: activeArea.accentBg }}
                          />
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. MEKANISME & LAB INTERAKTIF: Full-bleed Dark Field (#0D1117), Sticky Narrative Left + Interactive Labs Right ── */}
      <section id="mekanisme" className="bg-[#0D1117] text-white py-20 sm:py-32 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Sticky Column on Desktop */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.38, ease: EASE_OUT_EXPO }}
            >
              <h2 className="font-poppins font-black text-[1.75rem] sm:text-4xl lg:text-[2.75rem] leading-[1.04] tracking-[-0.025em] text-white whitespace-pre-line mb-5">
                {isId ? 'Belajar Aktif.\nBukan Hafalan Pasif.' : 'Active Practice.\nNever Passive Reading.'}
              </h2>
              <p className="text-base sm:text-lg text-white/85 leading-relaxed mb-8 max-w-[44ch]">
                {isId
                  ? 'Mulai dari sistem 5 nyawa yang merekam kesalahan, Kartu Flashcard KBBI 3D, hingga Tes Penempatan Bersama, semuanya dirancang agar konsep melekat lewat praktik.'
                  : 'With 5-life mistake tracking, 3D Concept Flashcards, and the Joint Placement Test, every rule sticks through active recall.'}
              </p>

              <div className="space-y-3 bg-[#161B22] p-6">
                <p className="font-bold text-white text-sm">
                  {isId ? 'Prinsip Anti-Klik Asal' : 'Zero Passive Guessing'}
                </p>
                <p className="text-sm text-white/80 leading-relaxed">
                  {isId
                    ? 'Penebusan nyawa gratis di menu Latihan dibatasi 2× per hari untuk menjaga ritme fokus serta mencegah spamming soal tanpa memahami.'
                    : 'Free life recovery is capped at 2× daily to encourage mindful mistake review over blind trial-and-error.'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Scrolling Interactive Lab Bands (4 Distinct [data-ui] previews) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Band 1: Interactive 5 Lives & Error Bank Demo */}
            <motion.div
              data-ui
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.38, ease: EASE_OUT_EXPO }}
              className="bg-[#161B22] p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <h3 className="font-poppins font-black text-xl sm:text-2xl text-white">
                    {isId ? 'Sistem 5 Nyawa & Bank Kesalahan' : '5-Life Rule & Mistake Bank'}
                  </h3>
                  <p className="text-sm text-white/80 mt-1">
                    {isId
                      ? 'Coba simulasi kehilangan lalu menebus nyawa lewat menu Latihan.'
                      : 'Simulate losing and recovering a heart via Practice Review.'}
                  </p>
                </div>
                <span className="font-poppins font-black text-lg text-[#F87171] tabular-nums shrink-0">
                  {demoLives}/5 {isId ? 'Nyawa' : 'Lives'}
                </span>
              </div>

              {/* Animated Heart Rack */}
              <div className="flex items-center gap-3 bg-[#0D1117] p-4 mb-5">
                {[1, 2, 3, 4, 5].map((idx) => {
                  const active = idx <= demoLives;
                  return (
                    <motion.div
                      key={idx}
                      animate={{
                        scale: active ? 1 : 0.78,
                        opacity: active ? 1 : 0.25,
                      }}
                      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                    >
                      <Heart
                        className={`w-7 h-7 ${
                          active ? 'fill-[#F43F5E] text-[#F43F5E]' : 'text-white/40'
                        }`}
                      />
                    </motion.div>
                  );
                })}
                <span className="ml-auto text-xs font-semibold text-white/75">
                  {demoLives < 5
                    ? isId
                      ? `${5 - demoLives} soal masuk Bank Kesalahan`
                      : `${5 - demoLives} item logged to Mistake Bank`
                    : isId
                      ? 'Penuh · Siap Ekspedisi'
                      : 'Full · Ready to Explore'}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setDemoLives((prev) => Math.max(0, prev - 1));
                  }}
                  disabled={demoLives === 0}
                  className="py-2.5 px-5 bg-[#262C36] hover:bg-[#323A46] disabled:opacity-40 text-white text-xs sm:text-sm font-bold rounded-full transition-colors cursor-pointer active:scale-[0.97]"
                >
                  {isId ? 'Simulasi Salah (-1)' : 'Simulate Mistake (-1)'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setDemoLives((prev) => Math.min(5, prev + 1));
                  }}
                  disabled={demoLives === 5}
                  className="py-2.5 px-5 bg-[#059669] hover:bg-[#047857] disabled:opacity-40 text-white text-xs sm:text-sm font-bold rounded-full transition-colors cursor-pointer active:scale-[0.97]"
                >
                  {isId ? 'Tebus via Latihan (+1)' : 'Recover via Practice (+1)'}
                </button>
              </div>
            </motion.div>

            {/* Band 2: Real 3D Flip Concept Flashcard Preview */}
            <motion.div
              data-ui
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.38, delay: 0.04, ease: EASE_OUT_EXPO }}
              className="bg-[#161B22] p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h3 className="font-poppins font-black text-xl sm:text-2xl text-white">
                    {isId ? 'Flashcard Konsep Baku KBBI' : 'Standardized Concept Flashcards'}
                  </h3>
                  <p className="text-sm text-white/80 mt-1">
                    {isId
                      ? 'Ketuk kartu di bawah untuk membalik definisi resminya secara 3D.'
                      : 'Click the card below to flip between the term and its exact definition.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setFlashcardFlipped(false);
                    setFlashcardIdx((prev) => (prev + 1) % FLASHCARD_DEMOS.length);
                  }}
                  className="inline-flex items-center gap-2 py-2.5 px-4 bg-[#262C36] hover:bg-[#323A46] text-white text-xs font-bold rounded-full cursor-pointer transition-colors shrink-0 active:scale-[0.97]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isId ? 'Ganti Istilah' : 'Next Term'}</span>
                </button>
              </div>

              {/* 3D Flip Container */}
              <div style={{ perspective: '1000px' }}>
                <motion.div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    playClick();
                    setFlashcardFlipped((f) => !f);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setFlashcardFlipped((f) => !f);
                    }
                  }}
                  animate={{ rotateY: flashcardFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="relative min-h-[190px] cursor-pointer select-none"
                >
                  {/* Front */}
                  <div
                    style={{ backfaceVisibility: 'hidden' }}
                    className="absolute inset-0 bg-[#0D1117] p-6 sm:p-8 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[#34D399]">
                      <span>{isId ? currentFlashcard.categoryId : currentFlashcard.categoryEn}</span>
                      <span>{isId ? 'Ketuk untuk membalik' : 'Click to flip'}</span>
                    </div>
                    <p className="font-poppins font-black text-2xl sm:text-3xl text-white">
                      {currentFlashcard.term}
                    </p>
                    <p className="text-xs text-white/70">
                      {isId ? currentFlashcard.noteId : currentFlashcard.noteEn}
                    </p>
                  </div>

                  {/* Back */}
                  <div
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                    className="absolute inset-0 bg-[#059669] p-6 sm:p-8 flex flex-col justify-between text-white"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-white/85">
                      <span>{currentFlashcard.term}</span>
                      <span>{isId ? 'Ketuk lagi untuk kembali' : 'Click to flip back'}</span>
                    </div>
                    <p className="text-base sm:text-lg font-medium leading-relaxed text-white">
                      {isId ? currentFlashcard.defId : currentFlashcard.defEn}
                    </p>
                    <p className="text-xs font-bold text-white/85">
                      {isId ? currentFlashcard.noteId : currentFlashcard.noteEn}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Band 3: Tes Penempatan Bersama (TPB) Interactive Progression */}
            <motion.div
              data-ui
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.38, delay: 0.08, ease: EASE_OUT_EXPO }}
              className="bg-[#161B22] p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <h3 className="font-poppins font-black text-xl sm:text-2xl text-white">
                    {isId ? 'Tes Penempatan Bersama (TPB)' : 'Joint Placement Test (TPB)'}
                  </h3>
                  <p className="text-sm text-white/80 mt-1">
                    {isId
                      ? 'Lulus ≥80% berurutan untuk langsung membuka Semester 2, 3, hingga Semester 4.'
                      : 'Score ≥80% consecutively across blocks to jump straight to Semester 4.'}
                  </p>
                </div>
                <span className="font-poppins font-black text-base text-[#34D399] tabular-nums shrink-0">
                  {isId ? `Mulai: Semester ${tpbSimulatedBlocks + 1}` : `Start: Semester ${tpbSimulatedBlocks + 1}`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
                {[1, 2, 3].map((blk) => {
                  const passed = blk <= tpbSimulatedBlocks;
                  return (
                    <button
                      key={blk}
                      type="button"
                      onClick={() => {
                        playClick();
                        setTpbSimulatedBlocks(blk === tpbSimulatedBlocks ? blk - 1 : blk);
                      }}
                      className={`text-left p-4 cursor-pointer transition-colors ${
                        passed ? 'bg-[#059669] text-white' : 'bg-[#0D1117] text-white/70 hover:bg-[#1E2530]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">
                          {isId ? `Blok ${blk} TPB` : `TPB Block ${blk}`}
                        </span>
                        {passed && <Check className="w-4 h-4" />}
                      </div>
                      <p className="font-bold text-sm">
                        {blk === 1
                          ? isId
                            ? 'Lompat ke Semester 2'
                            : 'Unlock Semester 2'
                          : blk === 2
                            ? isId
                              ? 'Lompat ke Semester 3'
                              : 'Unlock Semester 3'
                            : isId
                              ? 'Lompat ke Semester 4'
                              : 'Unlock Semester 4'}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="h-2 bg-[#0D1117] w-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#34D399]"
                  animate={{ scaleX: Math.max(0.08, tpbSimulatedBlocks / 3) }}
                  style={{ transformOrigin: '0% 50%' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 5. THE ONE LIVE THING: Kalkulator Anggaran 50/30/20 (#kalkulator, bg-[#F4F5F7]) ── */}
      <section id="kalkulator" className="bg-[#F4F5F7] py-20 sm:py-32 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.36, ease: EASE_OUT_EXPO }}
            className="max-w-2xl mb-12"
          >
            <h2 className="font-poppins font-black text-[1.75rem] sm:text-4xl lg:text-[2.75rem] leading-[1.04] tracking-[-0.025em] text-[#0D1117] whitespace-pre-line mb-4">
              {isId ? 'Simulasi Anggaran\n50/30/20 Langsung.' : 'Live 50/30/20\nBudget Calculator.'}
            </h2>
            <p className="text-base sm:text-lg text-[#0D1117]/85 leading-relaxed max-w-[54ch]">
              {isId
                ? 'Uji pembagian penghasilan bulanan antara kebutuhan pokok, gaya hidup, dan dana masa depan seperti pada Unit 11.'
                : 'Test dividing monthly take-home income across core needs, wants, and long-term reserves right away.'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Income Controls */}
            <div data-ui className="lg:col-span-5 bg-white p-6 sm:p-8">
              <p className="text-sm font-bold text-[#0D1117] mb-4">
                {isId ? 'Pilih penghasilan bulanan:' : 'Select monthly income:'}
              </p>

              <div className="flex flex-wrap gap-2 mb-7">
                {incomePresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      playClick();
                      setMonthlyIncome(preset.value);
                    }}
                    className={`py-2.5 px-5 text-sm font-bold rounded-full transition-colors duration-100 cursor-pointer active:scale-[0.97] ${
                      monthlyIncome === preset.value
                        ? 'bg-[#0D1117] text-white'
                        : 'bg-[#F4F5F7] text-[#0D1117] hover:bg-[#E5E7EB]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#0D1117]/80 font-medium">
                    {isId ? 'Atau geser nominal:' : 'Or drag slider:'}
                  </span>
                  <span className="font-poppins font-black text-xl sm:text-2xl text-[#0D1117] tabular-nums">
                    {formatRupiah(monthlyIncome)}
                  </span>
                </div>
                <input
                  type="range"
                  min={1000000}
                  max={30000000}
                  step={500000}
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full h-2.5 bg-[#E5E7EB] accent-[#059669] cursor-pointer"
                  aria-label="Monthly income slider"
                />
                <div className="flex justify-between text-xs text-[#0D1117]/65 font-semibold tabular-nums">
                  <span>Rp 1 Juta</span>
                  <span>Rp 30 Juta</span>
                </div>
              </div>
            </div>

            {/* Proportional Output Rows */}
            <div className="lg:col-span-7 space-y-3">
              {/* Visual stacked proportion indicator */}
              <div className="bg-white p-5 mb-2">
                <div className="flex justify-between text-xs font-bold text-[#0D1117]/80 mb-2 tabular-nums">
                  <span>50% {isId ? 'Kebutuhan' : 'Needs'}</span>
                  <span>30% {isId ? 'Keinginan' : 'Wants'}</span>
                  <span>20% {isId ? 'Tabungan' : 'Savings'}</span>
                </div>
                <div className="flex h-4 w-full overflow-hidden bg-[#F4F5F7]">
                  <motion.div
                    className="h-full bg-[#0D1117]"
                    style={{ width: '50%' }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                  />
                  <motion.div
                    className="h-full bg-[#D97706]"
                    style={{ width: '30%' }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.08, ease: EASE_OUT_EXPO }}
                  />
                  <motion.div
                    className="h-full bg-[#059669]"
                    style={{ width: '20%' }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.16, ease: EASE_OUT_EXPO }}
                  />
                </div>
              </div>

              {[
                {
                  pct: '50%',
                  label: isId ? 'Kebutuhan Pokok' : 'Core Needs',
                  amount: needsAmount,
                  desc: isId
                    ? 'Tempat tinggal, listrik, air, makan harian, dan transportasi rutin.'
                    : 'Housing, utilities, daily groceries, and routine commuting.',
                  color: '#0D1117',
                },
                {
                  pct: '30%',
                  label: isId ? 'Keinginan & Sinking Fund Gaya Hidup' : 'Wants & Discretionary',
                  amount: wantsAmount,
                  desc: isId
                    ? 'Hobi, langganan hiburan, jajan, dan dana liburan terukur.'
                    : 'Hobbies, streaming subscriptions, treats, and leisure.',
                  color: '#D97706',
                },
                {
                  pct: '20%',
                  label: isId ? 'Dana Darurat & Investasi Jangka Panjang' : 'Savings & Long-Term Investing',
                  amount: savingsAmount,
                  desc: isId
                    ? 'Dana darurat likuid, deposito/emas, SBN Ritel, hingga reksadana.'
                    : 'Liquid emergency reserve, gold, retail bonds, and index funds.',
                  color: '#059669',
                },
              ].map((row) => (
                <div
                  key={row.pct}
                  className="bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span
                      className="font-poppins font-black text-lg sm:text-xl text-white px-4 py-2 shrink-0 tabular-nums"
                      style={{ backgroundColor: row.color }}
                    >
                      {row.pct}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-[#0D1117] text-base leading-snug">{row.label}</p>
                      <p className="text-sm text-[#0D1117]/75 leading-snug mt-0.5">{row.desc}</p>
                    </div>
                  </div>
                  <motion.span
                    key={row.amount}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className="font-poppins font-black text-xl sm:text-2xl text-[#0D1117] tabular-nums shrink-0"
                  >
                    {formatRupiah(row.amount)}
                  </motion.span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. LIGA MINGGUAN & 6 KASTA (#liga, bg-white, alternating tone rows without hairlines) ── */}
      <section id="liga" className="bg-white py-20 sm:py-32 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: League intro + Ciko Crown spotlight */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.36, ease: EASE_OUT_EXPO }}
            className="lg:col-span-5"
          >
            <h2 className="font-poppins font-black text-[1.75rem] sm:text-4xl lg:text-[2.75rem] leading-[1.04] tracking-[-0.025em] text-[#0D1117] whitespace-pre-line mb-4">
              {isId ? 'Enam Kasta\nLiga Mingguan.' : 'Six Tiers of\nWeekly Leagues.'}
            </h2>
            <p className="text-base sm:text-lg text-[#0D1117]/85 leading-relaxed mb-8">
              {isId
                ? 'Setiap Keping Materi dan tantangan Arena menyumbang XP mingguan. Lima besar dari grup berisi 30 pemain promosi otomatis setiap akhir pekan.'
                : 'Completed modules and Arena runs award weekly XP. Finish top 5 out of 30 players each week to promote up a tier.'}
            </p>

            {/* Interactive spotlight card reflecting hovered/clicked rank */}
            <div className="bg-[#F4F5F7] p-6 flex items-center gap-5">
              <CikoMascot
                size={84}
                pose={selectedRankIdx >= 4 ? 'wealth' : selectedRankIdx >= 2 ? 'scholar' : 'hero'}
                animated={true}
              />
              <div>
                <p className="font-poppins font-black text-xl text-[#0D1117]">
                  {ranks[selectedRankIdx].title}
                </p>
                <p className="text-sm font-bold text-[#059669] tabular-nums mt-0.5">
                  {ranks[selectedRankIdx].xp}
                </p>
                <p className="text-sm text-[#0D1117]/80 mt-1">
                  {isId ? ranks[selectedRankIdx].milestoneId : ranks[selectedRankIdx].milestoneEn}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Clean tone-stepped interactive rank ladder */}
          <div className="lg:col-span-7 space-y-2">
            {ranks.map((rank, i) => {
              const isSelected = selectedRankIdx === i;
              return (
                <motion.button
                  key={rank.title}
                  type="button"
                  onClick={() => {
                    playClick();
                    setSelectedRankIdx(i);
                  }}
                  initial={{ opacity: 0, x: 14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ duration: 0.32, delay: i * 0.03, ease: EASE_OUT_EXPO }}
                  className={`w-full text-left px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#0D1117] text-white'
                      : i % 2 === 0
                        ? 'bg-[#F4F5F7] hover:bg-[#ECEEF2] text-[#0D1117]'
                        : 'bg-[#FAFAFA] hover:bg-[#ECEEF2] text-[#0D1117]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Trophy
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-[#FBBF24]' : 'text-[#059669]'
                      }`}
                    />
                    <span className="font-poppins font-black text-base sm:text-lg truncate">
                      {rank.title}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold tabular-nums shrink-0 ${
                      isSelected ? 'text-[#34D399]' : 'text-[#059669]'
                    }`}
                  >
                    {rank.xp}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 7. MULTIPLATFORM ACCESS: Full-bleed Emerald Field Inversion + Interactive Phone Preview ── */}
      <section className="bg-[#059669] text-white py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.36, ease: EASE_OUT_EXPO }}
            className="lg:col-span-7"
          >
            <h2 className="font-poppins font-black text-[1.75rem] sm:text-4xl lg:text-[2.75rem] leading-[1.04] tracking-[-0.025em] text-white whitespace-pre-line mb-4">
              {isId ? 'Bawa Ekspedisi\ndi Saku Kamu.' : 'Carry Ciko\nin Your Pocket.'}
            </h2>
            <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-[48ch] mb-6">
              {isId
                ? 'Main langsung lewat peramban web atau pasang rilis Android untuk latihan lebih cepat di mana saja. Progres Tamu bisa disinkronkan ke Google kapan saja.'
                : 'Play immediately in your browser or install the Android build for faster practice anywhere, and sync Guest progress to Google whenever you are ready.'}
            </p>
            <p className="text-sm font-bold text-[#FEF08A] mb-8 tabular-nums">
              {isId ? 'Rilis Android v1.2.1 · Minimum Android 7.0+' : 'Android Release v1.2.1 · Android 7.0+'}
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/Radarya/KoinKita/releases/latest"
                target="_blank"
                rel="noreferrer"
                onClick={() => playClick()}
                className="inline-flex items-center gap-3 py-4 px-8 bg-white hover:bg-[#F4F5F7] text-[#0D1117] font-bold text-sm rounded-full transition-colors cursor-pointer active:scale-[0.97]"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>{isId ? 'Unduh Rilis Android' : 'Get Android Build'}</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  playClick();
                  onContinueGuest();
                }}
                disabled={isLoading}
                className="inline-flex items-center gap-2 py-4 px-8 bg-[#0D1117] hover:bg-[#1E293B] text-white font-bold text-sm rounded-full transition-colors cursor-pointer disabled:opacity-50 active:scale-[0.97]"
              >
                <span>{isId ? 'Main Sekarang di Web' : 'Play Now on Web'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Right: Live Embedded App Snapshot Preview ([data-ui]) */}
          <motion.div
            data-ui
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.36, ease: EASE_OUT_EXPO }}
            className="lg:col-span-5 bg-[#064E3B] p-6 sm:p-8"
          >
            <div className="bg-white text-[#0D1117] p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <CikoMascot size={36} animated={false} />
                  <div>
                    <p className="font-poppins font-black text-sm text-[#0D1117]">
                      {isId ? 'Akun Tamu Siap Pakai' : 'Instant Guest Entry'}
                    </p>
                    <p className="text-xs text-[#0D1117]/70">
                      {isId ? 'Langsung ke Peta Semester 1' : 'Straight to Semester 1 Map'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#059669] tabular-nums">5/5 Nyawa</span>
              </div>

              <div className="space-y-2.5">
                <div className="bg-[#EEFBF4] p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-[#064E3B]">
                      {isId ? 'Keping 1 · Sejarah Barter & Uang' : 'Module 1 · Barter & Fiat Money'}
                    </p>
                    <p className="text-xs text-[#064E3B]/80 mt-0.5">
                      {isId ? 'Kampung Transaksi · Terbuka' : 'Transaction Village · Unlocked'}
                    </p>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-[#059669]" />
                </div>

                <div className="bg-[#F4F5F7] p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-[#0D1117]">
                      {isId ? 'TPB · Lompat ke Semester 4' : 'TPB · Skip up to Semester 4'}
                    </p>
                    <p className="text-xs text-[#0D1117]/75 mt-0.5">
                      {isId ? 'Uji kesiapan Blok 1–3 (≥80%)' : 'Test Blocks 1–3 readiness (≥80%)'}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#0D1117]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 8. PERTANYAAN UMUM (#faq, bg-[#F4F5F7], clean white slabs with gap instead of hairlines) ── */}
      <section className="bg-[#F4F5F7] py-20 sm:py-32 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.36, ease: EASE_OUT_EXPO }}
            className="mb-12"
          >
            <h2 className="font-poppins font-black text-[1.75rem] sm:text-4xl leading-[1.04] tracking-[-0.025em] text-[#0D1117] whitespace-pre-line mb-3">
              {isId ? 'Pertanyaan\nUmum Pengguna.' : 'Frequently\nAsked Questions.'}
            </h2>
            <p className="text-base text-[#0D1117]/80">
              {isId
                ? 'Informasi terbuka mengenai kurikulum, data akun tamu, dan transparansi edukasi.'
                : 'Open clarity on curriculum depth, guest persistence, and educational boundaries.'}
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={item.q} className="bg-white">
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setOpenFaq(isOpen ? null : index);
                    }}
                    className="w-full p-6 sm:p-7 flex items-center justify-between text-left cursor-pointer group"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-[#0D1117] text-base sm:text-lg group-hover:text-[#059669] transition-colors pr-4">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-[#0D1117]/60 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#059669]' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 sm:px-7 pb-6 sm:pb-7 text-[#0D1117]/85 text-sm sm:text-base leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 9. KIRIM MASUKAN (bg-white, two-column asymmetry) ── */}
      <section className="bg-white py-20 sm:py-32 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.36, ease: EASE_OUT_EXPO }}
            className="lg:col-span-5"
          >
            <h2 className="font-poppins font-black text-[1.75rem] sm:text-4xl leading-[1.04] tracking-[-0.025em] text-[#0D1117] whitespace-pre-line mb-4">
              {isId ? 'Kirim Masukan\nUntuk Kurikulum.' : 'Send Curriculum\nFeedback.'}
            </h2>
            <p className="text-base text-[#0D1117]/85 leading-relaxed max-w-[42ch]">
              {isId
                ? 'Menemukan soal yang kurang presisi, kesalahan ketik KBBI, atau ide unit baru? Masukanmu langsung terbaca oleh tim pengembang.'
                : 'Found an ambiguous question, typo, or suggestion for a new topic unit? Your feedback reaches the developers directly.'}
            </p>
          </motion.div>

          <div className="lg:col-span-7">
            {feedbackSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 sm:p-10 bg-[#EEFBF4] space-y-4"
              >
                <p className="font-poppins font-black text-2xl text-[#064E3B]">
                  {isId ? 'Terima kasih atas masukanmu.' : 'Thank you for your feedback.'}
                </p>
                <p className="text-base text-[#064E3B]/85">
                  {isId
                    ? 'Catatan kamu sudah berhasil tersimpan untuk peninjauan kurikulum berikutnya.'
                    : 'Your message has been logged for our next curriculum update.'}
                </p>
                <button
                  type="button"
                  onClick={() => setFeedbackSubmitted(false)}
                  className="py-3 px-7 bg-[#0D1117] text-white text-sm font-bold rounded-full cursor-pointer hover:bg-[#1E293B] transition-colors active:scale-[0.97]"
                >
                  {isId ? 'Kirim Masukan Lain' : 'Submit Another'}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="bg-[#F4F5F7] p-6 sm:p-8 space-y-5">
                <div>
                  <p className="text-sm font-bold text-[#0D1117] mb-2">
                    {isId ? 'Penilaian pengalamanmu:' : 'Rate your experience:'}
                  </p>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = star <= (feedbackHoverRating || feedbackRating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            playClick();
                            setFeedbackRating(star);
                          }}
                          onMouseEnter={() => setFeedbackHoverRating(star)}
                          onMouseLeave={() => setFeedbackHoverRating(0)}
                          className="p-1.5 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                          aria-label={`Rating ${star}`}
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              active ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#0D1117]/25'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="feedback-name"
                      className="block text-sm font-bold text-[#0D1117] mb-1.5"
                    >
                      {isId ? 'Nama (Opsional)' : 'Name (Optional)'}
                    </label>
                    <input
                      id="feedback-name"
                      type="text"
                      value={feedbackName}
                      onChange={(e) => setFeedbackName(e.target.value)}
                      placeholder={isId ? 'Nama kamu' : 'Your name'}
                      className="w-full px-4 py-3.5 bg-white text-sm text-[#0D1117] placeholder:text-[#0D1117]/45 focus:outline-none focus:ring-2 focus:ring-[#059669]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="feedback-email"
                      className="block text-sm font-bold text-[#0D1117] mb-1.5"
                    >
                      {isId ? 'Email (Opsional)' : 'Email (Optional)'}
                    </label>
                    <input
                      id="feedback-email"
                      type="email"
                      value={feedbackEmail}
                      onChange={(e) => setFeedbackEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full px-4 py-3.5 bg-white text-sm text-[#0D1117] placeholder:text-[#0D1117]/45 focus:outline-none focus:ring-2 focus:ring-[#059669]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="feedback-comment"
                    className="block text-sm font-bold text-[#0D1117] mb-1.5"
                  >
                    {isId ? 'Pesan Masukan' : 'Feedback Message'}
                  </label>
                  <textarea
                    id="feedback-comment"
                    required
                    rows={4}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder={
                      isId
                        ? 'Tuliskan saran soal, laporan bug, atau masukan materi...'
                        : 'Write your curriculum feedback or bug report...'
                    }
                    className="w-full px-4 py-3.5 bg-white text-sm text-[#0D1117] placeholder:text-[#0D1117]/45 focus:outline-none focus:ring-2 focus:ring-[#059669] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={feedbackSubmitting}
                  className="py-4 px-8 bg-[#059669] hover:bg-[#047857] disabled:opacity-50 text-white font-bold text-sm rounded-full transition-colors cursor-pointer active:scale-[0.98]"
                >
                  {feedbackSubmitting
                    ? isId
                      ? 'Mengirim...'
                      : 'Sending...'
                    : isId
                      ? 'Kirim Masukan Sekarang'
                      : 'Send Feedback Now'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── 10. ARCHITECTURAL FOOTER (Full-bleed Dark Closing Statement, ZERO hairline dividers) ── */}
      <footer className="bg-[#0D1117] text-white py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.38, ease: EASE_OUT_EXPO }}
            className="font-poppins font-black text-6xl sm:text-8xl lg:text-[9rem] tracking-[-0.04em] text-white leading-[0.88] mb-12 select-none"
          >
            CIKO
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end pt-4">
            <div className="md:col-span-6 space-y-2">
              <p className="text-base text-white/90 max-w-md leading-relaxed">
                {isId
                  ? 'Platform edugame literasi keuangan bareng Ciko (KoinKita). Gratis, bebas iklan, merujuk regulasi Bank Indonesia, OJK, dan LPS.'
                  : 'Financial literacy platform with Ciko (KoinKita). Free, ad-free, grounded in Bank Indonesia, OJK, and LPS guidelines.'}
              </p>
            </div>

            <div className="md:col-span-6 flex flex-wrap md:justify-end gap-6 text-sm font-semibold text-white/80">
              <a href="#ekspedisi" className="hover:text-white transition-colors">
                {isId ? 'Kurikulum' : 'Curriculum'}
              </a>
              <a href="#mekanisme" className="hover:text-white transition-colors">
                {isId ? 'Latihan & TPB' : 'Practice & TPB'}
              </a>
              <a href="#kalkulator" className="hover:text-white transition-colors">
                50/30/20
              </a>
              <a
                href="https://github.com/Radarya/KoinKita"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#34D399] transition-colors"
              >
                GitHub
              </a>
              <span className="text-white/65">&copy; {new Date().getFullYear()} Radithya Aydin Aryasatya · CIKO</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Floating Scroll to Top ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 12 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#0D1117] hover:bg-[#1E293B] text-white rounded-full flex items-center justify-center transition-colors cursor-pointer active:scale-95"
            aria-label="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
