import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Loader2,
  Download,
  ChevronDown,
  ArrowUp
} from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import { playClick } from '../lib/audio';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

interface LandingPageProps {
  onLinkGoogle: () => void;
  onContinueGuest: () => void;
  onGoToAuth: () => void;
  isLoading: boolean;
  hasPendingFriend?: boolean;
}

// ─── Motion variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const }
  })
};

// ─── Inline SVG illustrations (subject-drawn, no external images) ────────────

/** Koki Anggaran — a pot balancing two stacks of coins */
function IllustKoki() {
  return (
    <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full">
      {/* Pot body */}
      <ellipse cx="120" cy="148" rx="70" ry="14" fill="#D1D5DB" />
      <rect x="60" y="80" width="120" height="70" rx="16" fill="#374151" />
      <rect x="50" y="76" width="140" height="18" rx="9" fill="#4B5563" />
      {/* Steam */}
      <path d="M95 72 Q90 60 95 50" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M120 72 Q115 58 120 46" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M145 72 Q140 60 145 50" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Coin stack left */}
      <ellipse cx="88" cy="112" rx="18" ry="5" fill="#D97706" />
      <rect x="70" y="100" width="36" height="12" rx="2" fill="#F59E0B" />
      <ellipse cx="88" cy="100" rx="18" ry="5" fill="#FCD34D" />
      {/* Coin stack right */}
      <ellipse cx="152" cy="112" rx="18" ry="5" fill="#059669" />
      <rect x="134" y="100" width="36" height="12" rx="2" fill="#10B981" />
      <ellipse cx="152" cy="100" rx="18" ry="5" fill="#34D399" />
      {/* Balance line */}
      <line x1="88" y1="95" x2="152" y2="95" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="4 3" />
    </svg>
  );
}

/** Detektif Cuan — magnifying glass over a suspicious document */
function IllustDetektif() {
  return (
    <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full">
      {/* Document */}
      <rect x="50" y="30" width="110" height="140" rx="6" fill="#F3F4F6" />
      <rect x="50" y="30" width="110" height="140" rx="6" stroke="#E5E7EB" strokeWidth="2" />
      {/* Suspicious lines */}
      <rect x="66" y="50" width="78" height="8" rx="2" fill="#E5E7EB" />
      <rect x="66" y="65" width="54" height="8" rx="2" fill="#E5E7EB" />
      {/* RED alert line */}
      <rect x="66" y="82" width="78" height="10" rx="2" fill="#FEE2E2" />
      <rect x="66" y="82" width="78" height="10" rx="2" stroke="#EF4444" strokeWidth="1.5" />
      <rect x="66" y="100" width="44" height="8" rx="2" fill="#E5E7EB" />
      <rect x="66" y="115" width="66" height="8" rx="2" fill="#E5E7EB" />
      {/* OJK stamp — green circle */}
      <circle cx="135" cy="138" r="18" fill="#D1FAE5" stroke="#059669" strokeWidth="2" />
      <text x="135" y="143" textAnchor="middle" fill="#059669" fontSize="9" fontWeight="800">OJK</text>
      {/* Magnifying glass */}
      <circle cx="165" cy="68" r="32" fill="white" fillOpacity="0.9" stroke="#374151" strokeWidth="4" />
      <circle cx="165" cy="68" r="22" fill="none" stroke="#6B7280" strokeWidth="2" strokeDasharray="2 2" />
      <line x1="188" y1="91" x2="205" y2="110" stroke="#374151" strokeWidth="5" strokeLinecap="round" />
      {/* X through suspicious line seen in lens */}
      <line x1="153" y1="58" x2="177" y2="78" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="177" y1="58" x2="153" y2="78" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/** Pohon Aset — a growing money tree with coin leaves */
function IllustPohon() {
  return (
    <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full">
      {/* Trunk */}
      <rect x="112" y="100" width="16" height="70" rx="4" fill="#92400E" />
      {/* Root spread */}
      <path d="M112 165 Q90 175 70 168" stroke="#92400E" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M128 165 Q150 175 170 168" stroke="#92400E" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Canopy layers */}
      <ellipse cx="120" cy="98" rx="55" ry="38" fill="#059669" />
      <ellipse cx="120" cy="75" rx="42" ry="30" fill="#10B981" />
      <ellipse cx="120" cy="55" rx="28" ry="22" fill="#34D399" />
      {/* Coin leaves */}
      <circle cx="85" cy="88" r="10" fill="#FCD34D" stroke="#D97706" strokeWidth="2" />
      <text x="85" y="93" textAnchor="middle" fill="#92400E" fontSize="9" fontWeight="800">$</text>
      <circle cx="155" cy="85" r="10" fill="#FCD34D" stroke="#D97706" strokeWidth="2" />
      <text x="155" y="90" textAnchor="middle" fill="#92400E" fontSize="9" fontWeight="800">$</text>
      <circle cx="100" cy="62" r="10" fill="#FCD34D" stroke="#D97706" strokeWidth="2" />
      <text x="100" y="67" textAnchor="middle" fill="#92400E" fontSize="9" fontWeight="800">$</text>
      <circle cx="142" cy="65" r="10" fill="#FCD34D" stroke="#D97706" strokeWidth="2" />
      <text x="142" y="70" textAnchor="middle" fill="#92400E" fontSize="9" fontWeight="800">$</text>
      <circle cx="120" cy="45" r="10" fill="#FCD34D" stroke="#D97706" strokeWidth="2" />
      <text x="120" y="50" textAnchor="middle" fill="#92400E" fontSize="9" fontWeight="800">$</text>
    </svg>
  );
}

/** Fin-Wordle — letter tiles spelling a finance term */
function IllustWordle() {
  const tiles = [
    { letter: 'S', color: '#059669', text: 'white' },
    { letter: 'A', color: '#059669', text: 'white' },
    { letter: 'H', color: '#F59E0B', text: 'white' },
    { letter: 'A', color: '#E5E7EB', text: '#374151' },
    { letter: 'M', color: '#E5E7EB', text: '#374151' },
  ];
  const row2 = [
    { letter: 'D', color: '#E5E7EB', text: '#374151' },
    { letter: 'E', color: '#059669', text: 'white' },
    { letter: 'P', color: '#E5E7EB', text: '#374151' },
    { letter: 'O', color: '#F59E0B', text: 'white' },
    { letter: '?', color: '#374151', text: 'white' },
  ];
  return (
    <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full">
      {/* Row 1 */}
      {tiles.map((t, i) => (
        <g key={i} transform={`translate(${22 + i * 40}, 40)`}>
          <rect width="34" height="34" rx="4" fill={t.color} />
          <text x="17" y="24" textAnchor="middle" fill={t.text} fontSize="16" fontWeight="800" fontFamily="sans-serif">{t.letter}</text>
        </g>
      ))}
      {/* Row 2 */}
      {row2.map((t, i) => (
        <g key={i} transform={`translate(${22 + i * 40}, 84)`}>
          <rect width="34" height="34" rx="4" fill={t.color} />
          <text x="17" y="24" textAnchor="middle" fill={t.text} fontSize="16" fontWeight="800" fontFamily="sans-serif">{t.letter}</text>
        </g>
      ))}
      {/* Hint arrow */}
      <path d="M118 128 L118 145 L155 145" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="158" y="150" fill="#059669" fontSize="10" fontWeight="700" fontFamily="sans-serif">Deposito!</text>
    </svg>
  );
}

export default function LandingPage({
  onLinkGoogle,
  onContinueGuest,
  onGoToAuth,
  isLoading,
  hasPendingFriend
}: LandingPageProps) {
  const { language, toggleLanguage } = useTranslation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    import('../lib/audio').then(m => m.setGameViewTrack('landing')).catch(() => {});
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── THE ONE LIVE THING: 50/30/20 Budget Game ────────────────────────────
  const [monthlyIncome, setMonthlyIncome] = useState<number>(5000000);
  const incomePresets = [
    { label: language === 'id' ? 'Rp 3 Juta' : 'Rp 3M', value: 3000000 },
    { label: language === 'id' ? 'Rp 5 Juta' : 'Rp 5M', value: 5000000 },
    { label: language === 'id' ? 'Rp 10 Juta' : 'Rp 10M', value: 10000000 },
    { label: language === 'id' ? 'Rp 20 Juta' : 'Rp 20M', value: 20000000 },
  ];
  const needsAmount  = Math.round(monthlyIncome * 0.5);
  const wantsAmount  = Math.round(monthlyIncome * 0.3);
  const savingsAmount = Math.round(monthlyIncome * 0.2);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  // ── FAQ ──────────────────────────────────────────────────────────────────
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ── Feedback form ────────────────────────────────────────────────────────
  const [feedbackName, setFeedbackName]     = useState('');
  const [feedbackEmail, setFeedbackEmail]   = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackHoverRating, setFeedbackHoverRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted]   = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;
    setFeedbackSubmitting(true);
    playClick();
    try {
      await addDoc(collection(db, 'feedbacks'), {
        name: feedbackName || 'Anonim',
        email: feedbackEmail || 'anonim@koinkita.xyz',
        rating: feedbackRating,
        comment: feedbackComment,
        createdAt: Date.now()
      });
      await fetch('https://formsubmit.co/ajax/aydinaryasatyaradithya@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          Nama: feedbackName || 'Anonim',
          Email: feedbackEmail || 'Anonim',
          Rating: `${feedbackRating} Bintang`,
          Saran: feedbackComment
        })
      });
      setFeedbackSubmitted(true);
      setFeedbackName(''); setFeedbackEmail('');
      setFeedbackRating(5); setFeedbackComment('');
    } catch (err) {
      console.warn('Feedback submission error:', err);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // ── Games data ───────────────────────────────────────────────────────────
  const games = [
    {
      key: 'koki',
      name: 'Koki Anggaran',
      tagline: language === 'id' ? 'Alokasi Anggaran' : 'Budget Balancing',
      desc: language === 'id'
        ? 'Jadilah koki yang meracik pengeluaran bulanan. Seimbangkan pos belanja agar dapurmu tidak terbakar di pertengahan bulan.'
        : 'Act as the executive chef balancing household expenses. Keep your monthly cash flow from going up in flames.',
      Illust: IllustKoki,
      accent: '#F59E0B',
      ground: '#FFFBEB',
    },
    {
      key: 'detektif',
      name: 'Detektif Cuan',
      tagline: language === 'id' ? 'Modus Penipuan' : 'Scam Defense',
      desc: language === 'id'
        ? 'Periksa pesan mencurigakan dan surat izin palsu. Bedakan instrumen legal berizin OJK dari jebakan Ponzi sebelum uangmu lenyap.'
        : 'Scrutinize suspicious SMS alerts and spoofed credentials. Separate legitimate offerings from Ponzi traps.',
      Illust: IllustDetektif,
      accent: '#EF4444',
      ground: '#FFF1F2',
    },
    {
      key: 'pohon',
      name: 'Pohon Aset',
      tagline: language === 'id' ? 'Pertumbuhan Investasi' : 'Asset Growth',
      desc: language === 'id'
        ? 'Simulasikan diversifikasi portofolio jangka panjang. Tanam aset pada cabang Aman dan cabang Tumbuh di tengah cuaca ekonomi global.'
        : 'Simulate long-term capital compounding across Stable and Growth branches through changing economic weather.',
      Illust: IllustPohon,
      accent: '#059669',
      ground: '#ECFDF5',
    },
    {
      key: 'wordle',
      name: 'Fin-Wordle',
      tagline: language === 'id' ? 'Kosakata Finansial' : 'Financial Vocabulary',
      desc: language === 'id'
        ? 'Asah pemahaman istilah perbankan dan pasar modal lewat tebak kata adaptif berpetunjuk. Jangan biarkan istilah asing membingungkanmu.'
        : 'Expand your literacy across banking terminology and capital markets with adaptive word puzzles.',
      Illust: IllustWordle,
      accent: '#6366F1',
      ground: '#EEF2FF',
    },
  ];

  const ranks = [
    { title: language === 'id' ? 'Pemula' : 'Beginner',              xp: '0 – 999 XP',         desc: language === 'id' ? 'Langkah awal memahami nilai dasar mata uang.' : 'First steps in understanding base cash flow.' },
    { title: language === 'id' ? 'Sadar Finansial' : 'Aware',         xp: '1.000 – 4.999 XP',   desc: language === 'id' ? 'Memisahkan kebutuhan dari godaan konsumtif.' : 'Distinguishing needs from impulse purchases.' },
    { title: language === 'id' ? 'Bijak Belanja' : 'Wise Spender',    xp: '5.000 – 14.999 XP',  desc: language === 'id' ? 'Menguasai alokasi anggaran tanpa defisit.' : 'Zero-deficit budget mastery every month.' },
    { title: language === 'id' ? 'Investor Cerdas' : 'Smart Investor', xp: '15.000 – 29.999 XP', desc: language === 'id' ? 'Memahami SBN dan emas untuk mengalahkan inflasi.' : 'Bonds and gold to safeguard against inflation.' },
    { title: language === 'id' ? 'Ahli Anggaran' : 'Budget Expert',   xp: '30.000 – 49.999 XP', desc: language === 'id' ? 'Tangguh menghadapi guncangan pasar global.' : 'Portfolio resilience through macro turbulence.' },
    { title: language === 'id' ? 'Master Kekayaan' : 'Wealth Master', xp: '50.000+ XP',          desc: language === 'id' ? 'Kemandirian finansial sejati, aset bekerja untukmu.' : 'True independence with compound yields working for you.' },
  ];

  const faqs = [
    {
      q: language === 'id' ? 'Apakah KoinKita sepenuhnya gratis?' : 'Is KoinKita completely free?',
      a: language === 'id' ? 'Ya. KoinKita 100% gratis tanpa biaya langganan tersembunyi, bertujuan murni meningkatkan literasi keuangan masyarakat Indonesia.' : 'Yes. KoinKita is 100% free with no subscription barriers, dedicated to advancing public financial literacy.'
    },
    {
      q: language === 'id' ? 'Apakah simulasi ini adalah saran keuangan resmi?' : 'Are simulations considered financial advice?',
      a: language === 'id' ? 'Bukan. Seluruh simulasi KoinKita dibuat untuk tujuan edukatif melatih pola pikir finansial, bukan penasihat keuangan bersertifikasi.' : 'No. All simulations are designed for pedagogical purposes to develop habits, not certified financial consulting.'
    },
    {
      q: language === 'id' ? 'Bagaimana sistem promosi Liga Finansial bekerja?' : 'How does the Weekly Financial League work?',
      a: language === 'id' ? 'Pemain ditempatkan dalam kelompok 30 orang. Kumpulkan XP dari mini-game; posisi 5 teratas otomatis naik kasta setiap akhir pekan.' : 'Players compete in 30-person brackets. Top 5 highest-XP players advance to the next tier at weekly reset.'
    },
    {
      q: language === 'id' ? 'Apakah data akun tamu saya bisa hilang?' : 'Can my guest account data be lost?',
      a: language === 'id' ? 'Akun tamu disimpan secara lokal. Untuk data permanen di cloud, tautkan akun ke Google kapan saja.' : 'Guest progress is saved on your device. Link with Google at any time to preserve progress safely in the cloud.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0D1117] font-sans selection:bg-emerald-200/60 selection:text-emerald-950">

      {/* ── Pending Friend Request Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {hasPendingFriend && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D1117]/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white p-8"
            >
              <h3 className="text-2xl font-black tracking-tight text-slate-900 mb-2">
                {language === 'id' ? 'Undangan Berteman' : 'Friend Invitation'}
              </h3>
              <p className="text-slate-700 leading-relaxed text-sm mb-6">
                {language === 'id'
                  ? 'Seseorang mengundangmu untuk bermain KoinKita bersama. Masuk atau lanjutkan untuk langsung berteman.'
                  : 'Someone invited you to play KoinKita together. Log in or continue to connect.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { localStorage.removeItem('pendingFriendRequest'); window.location.reload(); }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-full transition-colors cursor-pointer text-sm"
                >
                  {language === 'id' ? 'Abaikan' : 'Dismiss'}
                </button>
                <button
                  onClick={onGoToAuth}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transition-colors cursor-pointer text-sm"
                >
                  {language === 'id' ? 'Masuk Sekarang' : 'Log In Now'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 1. NAVIGATION ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-5 sm:px-10 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group">
            <img src="/icon.png" alt="KoinKita" className="w-7 h-7 object-cover" />
            <span className="font-poppins font-black text-lg tracking-tight text-slate-950 uppercase">
              KOINKITA
            </span>
          </a>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { playClick(); toggleLanguage(); }}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 px-3 py-1.5 transition-colors cursor-pointer"
              aria-label="Toggle Language"
            >
              {language === 'id' ? 'ID / EN' : 'EN / ID'}
            </button>
            <button
              onClick={onGoToAuth}
              className="bg-[#0D1117] hover:bg-slate-700 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors cursor-pointer"
            >
              {language === 'id' ? 'Masuk' : 'Sign In'}
            </button>
          </div>
        </div>
      </header>

      {/* ── 2. HERO ──────────────────────────────────────────────────────────── */}
      {/*
        Asymmetric two-column: left = headline + actions, right = Banner.jpg
        Mobile: stacked, image first at top.
        Banner.jpg = authentic asset from the project.
      */}
      <section className="overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 pt-14 pb-10 lg:pt-20 lg:pb-16">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

            {/* Left: copy + CTA */}
            <div className="flex-1 min-w-0 order-2 lg:order-1">
              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0}
                className="font-poppins font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.0] tracking-tight text-[#0D1117] mb-5"
              >
                {language === 'id' ? 'Belajar Uang\nLewat Game.' : 'Learn Money\nThrough Play.'}
              </motion.h1>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.1}
                className="text-lg sm:text-xl text-slate-700 leading-relaxed max-w-lg mb-8"
              >
                {language === 'id'
                  ? 'Empat mini-game seru untuk melatih cara ngatur gaji, hindari penipuan, tumbuhkan aset, dan kuasai istilah keuangan — tanpa teori membosankan.'
                  : 'Four playful games to master budgeting, dodge scams, grow assets, and unlock financial vocabulary — no boring theory required.'}
              </motion.p>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.2}
                className="flex flex-col sm:flex-row flex-wrap gap-3"
              >
                {/* Primary: Google */}
                <button
                  onClick={onLinkGoogle}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2.5 py-4 px-7 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>{language === 'id' ? 'Menghubungkan...' : 'Connecting...'}</span></>
                  ) : (
                    <>
                      <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.709 0 3.277.604 4.5 1.625l2.437-2.437C17.312 1.696 14.933 1 12.24 1 6.58 1 2 5.58 2 11.24s4.58 10.24 10.24 10.24c5.795 0 10.24-4.11 10.24-10.24 0-.685-.08-1.355-.24-1.955H12.24z" />
                      </svg>
                      <span>{language === 'id' ? 'Masuk dengan Google' : 'Sign in with Google'}</span>
                    </>
                  )}
                </button>

                {/* Secondary: Email */}
                <button
                  onClick={onGoToAuth}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2.5 py-4 px-7 bg-[#0D1117] hover:bg-slate-700 text-white font-bold text-sm rounded-full transition-colors cursor-pointer disabled:opacity-50"
                >
                  {language === 'id' ? 'Masuk dengan Email' : 'Sign in with Email'}
                </button>

                {/* Tertiary: Guest */}
                <button
                  onClick={onContinueGuest}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 py-4 px-7 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-full transition-colors cursor-pointer disabled:opacity-50"
                >
                  {language === 'id' ? 'Coba sebagai Tamu' : 'Play as Guest'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Social signal — plain text, no pill badge */}
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.3}
                className="mt-5 text-sm text-slate-500 font-medium"
              >
                {language === 'id'
                  ? 'Gratis selamanya · Tanpa iklan · 4 mini-game aktif'
                  : 'Free forever · No ads · 4 active mini-games'}
              </motion.p>
            </div>

            {/* Right: Banner.jpg — the authentic KoinKita banner */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
              className="w-full lg:w-[48%] xl:w-[44%] shrink-0 order-1 lg:order-2"
            >
              <img
                src="/Banner.jpg"
                alt="KoinKita — platform edugame finansial"
                className="w-full h-auto object-cover"
                loading="eager"
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 3. THE ONE LIVE THING: Budget Game ──────────────────────────────── */}
      {/*
        Game-styled income selector + live 50/30/20 output.
        Full-width bg swap (white) for section contrast.
      */}
      <section className="bg-white py-16 sm:py-24 px-5 sm:px-10 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="max-w-2xl mb-10">
            <h2 className="font-poppins font-black text-3xl sm:text-4xl tracking-tight text-[#0D1117] leading-tight mb-3">
              {language === 'id' ? 'Hitung Anggaranmu Sekarang.' : 'Calculate Your Budget Live.'}
            </h2>
            <p className="text-slate-700 text-lg leading-relaxed">
              {language === 'id'
                ? 'Pilih nominal penghasilan bulananmu dan lihat batas aman 50/30/20 ala Koki Anggaran.'
                : 'Pick your monthly income and see the safe 50/30/20 Budget Chef limits instantly.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">

            {/* Income selector column */}
            <div className="lg:col-span-5 bg-[#F4F5F7] p-6 sm:p-8" data-ui>
              <p className="text-sm font-bold text-slate-600 mb-4">
                {language === 'id' ? 'Pilih penghasilan bulanan:' : 'Select monthly income:'}
              </p>

              {/* Preset tabs */}
              <div className="flex flex-wrap gap-2 mb-7">
                {incomePresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => { playClick(); setMonthlyIncome(preset.value); }}
                    className={`py-2.5 px-5 text-sm font-bold rounded-full transition-colors cursor-pointer ${
                      monthlyIncome === preset.value
                        ? 'bg-[#0D1117] text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 font-medium">{language === 'id' ? 'Atau geser:' : 'Or slide:'}</span>
                  <span className="text-xl font-black text-[#0D1117] font-poppins tabular-nums">{formatRupiah(monthlyIncome)}</span>
                </div>
                <input
                  type="range"
                  min={1000000}
                  max={30000000}
                  step={500000}
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full h-2 bg-slate-300 accent-emerald-600 cursor-pointer rounded-none"
                  aria-label="Monthly income slider"
                />
                <div className="flex justify-between text-xs text-slate-400 font-semibold tabular-nums">
                  <span>Rp 1 Jt</span>
                  <span>Rp 30 Jt</span>
                </div>
              </div>
            </div>

            {/* Results column */}
            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  pct: '50%',
                  label: language === 'id' ? 'Kebutuhan Pokok' : 'Core Needs',
                  amount: needsAmount,
                  desc: language === 'id' ? 'Sewa, listrik, air, bahan makanan, transportasi kerja.' : 'Rent, utilities, groceries, commute.',
                  bar: 50,
                  color: '#0D1117',
                },
                {
                  pct: '30%',
                  label: language === 'id' ? 'Gaya Hidup & Keinginan' : 'Lifestyle & Wants',
                  amount: wantsAmount,
                  desc: language === 'id' ? 'Kopi, streaming, hobi, dan liburan akhir pekan.' : 'Cafes, streaming, hobbies, weekend trips.',
                  bar: 30,
                  color: '#D97706',
                },
                {
                  pct: '20%',
                  label: language === 'id' ? 'Tabungan & Investasi' : 'Savings & Investment',
                  amount: savingsAmount,
                  desc: language === 'id' ? 'Dana darurat, emas, SBN, dan reksa dana.' : 'Emergency fund, gold, bonds, mutual funds.',
                  bar: 20,
                  color: '#059669',
                },
              ].map((row) => (
                <div key={row.pct} className="bg-white flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5 sm:p-6">
                  {/* Bar */}
                  <div className="w-full sm:w-28 shrink-0">
                    <div className="h-2 bg-slate-100 w-full">
                      <motion.div
                        className="h-2"
                        style={{ backgroundColor: row.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${row.bar}%` }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-500 mt-1 block tabular-nums">{row.pct}</span>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#0D1117] text-sm leading-snug">{row.label}</p>
                    <p className="text-xs text-slate-500 leading-snug mt-0.5">{row.desc}</p>
                  </div>
                  {/* Amount */}
                  <div className="shrink-0">
                    <motion.span
                      key={row.amount}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="font-poppins font-black text-xl text-[#0D1117] tabular-nums block"
                    >
                      {formatRupiah(row.amount)}
                    </motion.span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. FOUR GAMES — Asymmetric, illustrated ──────────────────────────── */}
      {/*
        Each game card: full-width colored ground + illustration + prose.
        Alternating layout per asymmetric-neighbors rule.
        No gameplay screenshots — subject-drawn SVG illustrations.
      */}
      <section className="py-16 sm:py-24 px-5 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <h2 className="font-poppins font-black text-3xl sm:text-4xl tracking-tight text-[#0D1117] leading-tight mb-3">
              {language === 'id' ? 'Empat Game, Satu Misi.' : 'Four Games, One Mission.'}
            </h2>
            <p className="text-slate-700 text-lg leading-relaxed">
              {language === 'id'
                ? 'Tiap game lahir dari masalah finansial nyata: jebakan pinjol, gaya hidup FOMO, dan penipuan investasi.'
                : 'Every game tackles a real financial hazard: loan sharks, FOMO spending, and investment scams.'}
            </p>
          </div>

          <div className="space-y-6">
            {games.map((game, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={game.key}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                  className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
                  style={{ backgroundColor: game.ground }}
                >
                  {/* Illustration panel */}
                  <div
                    className={`flex items-center justify-center p-10 sm:p-14 min-h-[220px] sm:min-h-[280px] ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                    style={{ backgroundColor: game.accent + '18' }}
                  >
                    <div className="w-full max-w-[220px] sm:max-w-[260px] aspect-[4/3]">
                      <game.Illust />
                    </div>
                  </div>

                  {/* Text panel */}
                  <div
                    className={`p-8 sm:p-12 flex flex-col justify-center ${
                      isEven ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <span
                      className="block text-xs font-black uppercase mb-3 tracking-wide"
                      style={{ color: game.accent }}
                    >
                      {game.tagline}
                    </span>
                    <h3 className="font-poppins font-black text-2xl sm:text-3xl text-[#0D1117] mb-4 leading-tight">
                      {game.name}
                    </h3>
                    <p className="text-slate-700 text-base leading-relaxed max-w-md">
                      {game.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. LIGA & RANKS — Full-width flat bg, typographic list ──────────── */}
      {/*
        Section inversion from light to slightly-tinted ground.
        No card grid — a descriptive two-column run with rank names at large scale.
      */}
      <section className="bg-[#0D1117] py-16 sm:py-24 px-5 sm:px-10">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            {/* Left: intro */}
            <div className="lg:w-2/5 shrink-0">
              <h2 className="font-poppins font-black text-3xl sm:text-4xl text-white leading-tight mb-4">
                {language === 'id' ? 'Naikin Rankmu\ndi Liga Finansial.' : 'Climb the\nFinancial League.'}
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                {language === 'id'
                  ? 'Tiap keputusan finansial yang tepat menghasilkan XP. Finish top 5 dari 30 pemain setiap minggu untuk promosi ke kasta berikutnya.'
                  : 'Every smart financial decision earns XP. Finish top 5 out of 30 players every week to advance to the next tier.'}
              </p>
            </div>

            {/* Right: rank list */}
            <div className="flex-1 divide-y divide-slate-800">
              {ranks.map((rank, i) => (
                <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                  <span className="font-poppins font-black text-lg text-white sm:w-40 shrink-0">
                    {rank.title}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 sm:w-36 shrink-0 tabular-nums">
                    {rank.xp}
                  </span>
                  <span className="text-sm text-slate-400 leading-snug">
                    {rank.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── 6. ANDROID APK — Accent-ground section ───────────────────────────── */}
      <section className="bg-emerald-600 py-14 sm:py-20 px-5 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
          <div className="max-w-xl">
            <h2 className="font-poppins font-black text-3xl sm:text-4xl text-white leading-tight mb-3">
              {language === 'id' ? 'Bawa KoinKita\ndi Sakumu.' : 'Carry KoinKita\nin Your Pocket.'}
            </h2>
            <p className="text-emerald-100 text-base sm:text-lg leading-relaxed">
              {language === 'id'
                ? 'Gameplay offline lebih responsif, notifikasi quest harian, dan deep link teman instan.'
                : 'Faster offline gameplay, daily quest notifications, and instant friend deep links.'}
            </p>
            <p className="text-emerald-200 text-sm mt-3 font-medium">
              {language === 'id' ? 'Stabil: v1.4.0 (Android 8.0+)' : 'Stable: v1.4.0 (Android 8.0+)'}
            </p>
          </div>
          <div className="shrink-0">
            <a
              href="https://github.com/Radarya/KoinKita/releases/latest/download/KoinKita-v1.4.0.apk"
              download="KoinKita-v1.4.0.apk"
              onClick={() => playClick()}
              className="inline-flex items-center gap-3 py-4 px-8 bg-white hover:bg-slate-50 text-[#0D1117] font-bold text-sm rounded-full transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 shrink-0" />
              {language === 'id' ? 'Unduh APK Android' : 'Download Android APK'}
            </a>
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ────────────────────────────────────────────────────────────── */}
      <section className="bg-[#FAFAFA] py-16 sm:py-24 px-5 sm:px-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-poppins font-black text-3xl sm:text-4xl text-[#0D1117] tracking-tight mb-3">
            {language === 'id' ? 'Pertanyaan Umum.' : 'Common Questions.'}
          </h2>
          <p className="text-slate-600 text-base mb-10">
            {language === 'id' ? 'Transparansi penuh tentang platform dan data.' : 'Full transparency about the platform and your data.'}
          </p>

          <div className="divide-y divide-slate-200">
            {faqs.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="py-5">
                  <button
                    onClick={() => { playClick(); setOpenFaq(isOpen ? null : index); }}
                    className="w-full flex items-center justify-between text-left cursor-pointer group"
                  >
                    <span className="font-bold text-[#0D1117] text-base sm:text-lg group-hover:text-emerald-700 transition-colors pr-4">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-4 text-slate-700 text-sm sm:text-base leading-relaxed overflow-hidden"
                      >
                        {item.a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 8. FEEDBACK FORM ──────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-slate-200 py-16 sm:py-24 px-5 sm:px-10">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-poppins font-black text-2xl sm:text-3xl text-[#0D1117] mb-2">
            {language === 'id' ? 'Kirim Masukan' : 'Share Feedback'}
          </h2>
          <p className="text-slate-600 text-sm mb-8">
            {language === 'id'
              ? 'Masukanmu langsung membantu penyempurnaan kurikulum KoinKita.'
              : 'Your input directly shapes the KoinKita curriculum.'}
          </p>

          {feedbackSubmitted ? (
            <div className="p-8 bg-emerald-50 text-center space-y-4">
              <p className="font-black text-xl text-[#0D1117]">
                {language === 'id' ? 'Terima kasih!' : 'Thank you!'}
              </p>
              <p className="text-sm text-slate-600">
                {language === 'id' ? 'Pesanmu sudah dicatat tim developer.' : 'Your thoughts have been logged for review.'}
              </p>
              <button
                onClick={() => setFeedbackSubmitted(false)}
                className="py-2.5 px-6 bg-[#0D1117] text-white text-sm font-bold rounded-full cursor-pointer hover:bg-slate-700 transition-colors"
              >
                {language === 'id' ? 'Kirim Lagi' : 'Submit Another'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-5">
              {/* Star Rating */}
              <div>
                <p className="text-sm font-bold text-slate-700 mb-2">
                  {language === 'id' ? 'Rating pengalamanmu:' : 'Rate your experience:'}
                </p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => { playClick(); setFeedbackRating(star); }}
                      onMouseEnter={() => setFeedbackHoverRating(star)}
                      onMouseLeave={() => setFeedbackHoverRating(0)}
                      className="text-2xl cursor-pointer p-0.5 transition-transform hover:scale-110"
                      aria-label={`Rating ${star}`}
                    >
                      <span className={star <= (feedbackHoverRating || feedbackRating) ? 'text-amber-400' : 'text-slate-200'}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    {language === 'id' ? 'Nama (Opsional)' : 'Name (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    placeholder={language === 'id' ? 'Budi Santoso' : 'Alex Rivers'}
                    className="w-full px-4 py-3 bg-[#F4F5F7] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    {language === 'id' ? 'Email (Opsional)' : 'Email (Optional)'}
                  </label>
                  <input
                    type="email"
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-3 bg-[#F4F5F7] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  {language === 'id' ? 'Pesan Masukan*' : 'Feedback Message*'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder={language === 'id' ? 'Tuliskan masukan atau laporan bug di sini...' : 'Write your feedback or bug report here...'}
                  className="w-full px-4 py-3 bg-[#F4F5F7] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={feedbackSubmitting}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-full transition-colors cursor-pointer"
              >
                {feedbackSubmitting
                  ? (language === 'id' ? 'Mengirim...' : 'Sending...')
                  : (language === 'id' ? 'Kirim Masukan' : 'Submit Feedback')}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── 9. FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0D1117] py-12 sm:py-16 px-5 sm:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Large wordmark — closing statement */}
          <div className="font-poppins font-black text-5xl sm:text-7xl lg:text-8xl tracking-tighter text-white mb-8 leading-none">
            KOINKITA
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-t border-slate-800 pt-6">
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              {language === 'id'
                ? 'Platform edugame literasi finansial. Gratis, tanpa iklan, untuk semua.'
                : 'Financial literacy game platform. Free, ad-free, for everyone.'}
            </p>
            <div className="text-right text-xs text-slate-600 space-y-1">
              <div>&copy; {new Date().getFullYear()} KoinKita.xyz</div>
              <div>
                <a
                  href="https://github.com/Radarya/KoinKita"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-slate-300 transition-colors"
                >
                  GitHub Repository
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Scroll to Top ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-[#0D1117] hover:bg-slate-700 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
