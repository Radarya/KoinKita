import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Loader2, 
  Check, 
  Copy, 
  Download, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles,
  Calculator,
  Compass,
  TrendingUp,
  Search,
  BookOpen,
  PieChart,
  Trophy,
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

export default function LandingPage({
  onLinkGoogle,
  onContinueGuest,
  onGoToAuth,
  isLoading,
  hasPendingFriend
}: LandingPageProps) {
  const { language, toggleLanguage } = useTranslation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top watcher
  useEffect(() => {
    import('../lib/audio').then(m => m.setGameViewTrack('landing')).catch(() => {});
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==========================================
  // "THE ONE LIVE THING"
  // Interactive 50/30/20 Budget Partitioner & Financial Instinct Simulator
  // ==========================================
  const [monthlyIncome, setMonthlyIncome] = useState<number>(5000000);
  const incomePresets = [
    { label: language === 'id' ? 'Rp 3 Juta (UMR Pemula)' : 'Rp 3M (Entry Level)', value: 3000000 },
    { label: language === 'id' ? 'Rp 5 Juta (Gaji Pertama)' : 'Rp 5M (First Salary)', value: 5000000 },
    { label: language === 'id' ? 'Rp 10 Juta (Karier Muda)' : 'Rp 10M (Pro Career)', value: 10000000 },
    { label: language === 'id' ? 'Rp 20 Juta (Senior)' : 'Rp 20M (Senior Lead)', value: 20000000 }
  ];

  const needsAmount = Math.round(monthlyIncome * 0.5);
  const wantsAmount = Math.round(monthlyIncome * 0.3);
  const savingsAmount = Math.round(monthlyIncome * 0.2);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // ==========================================
  // FAQ STATE
  // ==========================================
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ==========================================
  // FEEDBACK FORM STATE
  // ==========================================
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackHoverRating, setFeedbackHoverRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;
    setFeedbackSubmitting(true);
    playClick();

    try {
      // 1. Save to Firestore feedbacks collection
      await addDoc(collection(db, 'feedbacks'), {
        name: feedbackName || 'Anonim',
        email: feedbackEmail || 'anonim@koinkita.xyz',
        rating: feedbackRating,
        comment: feedbackComment,
        createdAt: Date.now()
      });

      // 2. Submit via FormSubmit AJAX to developer email
      await fetch("https://formsubmit.co/ajax/aydinaryasatyaradithya@gmail.com", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          Nama: feedbackName || 'Anonim',
          Email: feedbackEmail || 'Anonim',
          Rating: `${feedbackRating} Bintang`,
          Saran: feedbackComment
        })
      });

      setFeedbackSubmitted(true);
      setFeedbackName('');
      setFeedbackEmail('');
      setFeedbackRating(5);
      setFeedbackComment('');
    } catch (err) {
      console.warn("Feedback submission error:", err);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // Motion variants with reduced motion respect
  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#090D16] font-sans selection:bg-emerald-200/60 selection:text-emerald-950">
      
      {/* Pending Friend Request Modal */}
      <AnimatePresence>
        {hasPendingFriend && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#090D16]/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="w-full max-w-md bg-white p-8 rounded-none border border-slate-200"
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

      {/* ==========================================
          1. NAVIGATION BAR
          Clean, grounded, no glassmorphism or floating pill
      ========================================== */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 sm:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <img 
              src="/icon.png" 
              alt="KoinKita Logo" 
              className="w-8 h-8 rounded-none object-cover" 
            />
            <span className="font-poppins font-black text-xl tracking-tight text-slate-950 uppercase">
              KOINKITA
            </span>
          </a>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => { playClick(); toggleLanguage(); }}
              className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-950 px-3 py-1.5 transition-colors cursor-pointer"
              aria-label="Toggle Language"
            >
              {language === 'id' ? 'ID / EN' : 'EN / ID'}
            </button>
            <button 
              onClick={onGoToAuth}
              className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors cursor-pointer"
            >
              {language === 'id' ? 'Masuk / Akun' : 'Sign In / Account'}
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================
          2. HERO SECTION
          Strict headline rule: <= 2 lines across all screens.
          First screen answers what it is & what it does in large type.
      ========================================== */}
      <section className="pt-20 pb-20 sm:pt-28 sm:pb-28 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <motion.h1 
            {...fadeInUp}
            className="text-4xl sm:text-6xl md:text-7xl font-poppins font-black tracking-tight text-slate-950 leading-[0.98] mb-8"
          >
            {language === 'id' 
              ? 'Kuasai Uangmu Lewat Game Nyata.' 
              : 'Master Your Money Through Real Games.'}
          </motion.h1>

          <motion.p 
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="text-xl sm:text-2xl text-slate-800 font-medium leading-relaxed max-w-3xl mb-12"
          >
            {language === 'id'
              ? 'Empat simulasi interaktif untuk melatih insting mengelola anggaran bulanan, membongkar modus penipuan digital, dan menumbuhkan aset nyata tanpa teori membosankan.'
              : 'Four interactive simulations designed to sharpen your budgeting instincts, uncover digital fraud schemes, and cultivate real wealth without tedious theory.'}
          </motion.p>

          {/* Action Row */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
          >
            {/* Google Fast Action */}
            <button
              onClick={onLinkGoogle}
              disabled={isLoading}
              className="py-4 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide rounded-full transition-colors flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{language === 'id' ? 'Menghubungkan...' : 'Connecting...'}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.709 0 3.277.604 4.5 1.625l2.437-2.437C17.312 1.696 14.933 1 12.24 1 6.58 1 2 5.58 2 11.24s4.58 10.24 10.24 10.24c5.795 0 10.24-4.11 10.24-10.24 0-.685-.08-1.355-.24-1.955H12.24z"/>
                  </svg>
                  <span>{language === 'id' ? 'Masuk dengan Google' : 'Sign in with Google'}</span>
                </>
              )}
            </button>

            {/* Email Action */}
            <button
              onClick={onGoToAuth}
              disabled={isLoading}
              className="py-4 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wide rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{language === 'id' ? 'Masuk dengan Email' : 'Sign in with Email'}</span>
            </button>

            {/* Guest Action */}
            <button
              onClick={onContinueGuest}
              disabled={isLoading}
              className="py-4 px-8 bg-[#F1F3F5] hover:bg-[#E5E7EB] text-slate-800 font-bold text-sm tracking-wide rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{language === 'id' ? 'Coba sebagai Tamu' : 'Play as Guest'}</span>
            </button>
          </motion.div>
        </div>

        {/* Hero Dominant Media Showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 sm:mt-24 bg-[#F1F3F5] p-4 sm:p-8 rounded-none border border-slate-200"
          data-ui
        >
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                {language === 'id' ? 'Arena & Liga Mingguan' : 'Weekly Financial Arena'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-poppins font-black text-slate-900 leading-tight">
                {language === 'id' ? 'Bersaing di Liga Finansial Nyata.' : 'Compete in 30-Player Weekly Brackets.'}
              </h2>
              <p className="text-slate-700 text-base leading-relaxed">
                {language === 'id'
                  ? 'Kumpulkan XP dari setiap keputusan finansial yang tepat. Raih posisi 5 besar mingguan untuk promosi ke Liga Sadar Finansial, Bijak Belanja, hingga Master Kekayaan.'
                  : 'Earn XP for every sound financial decision. Finish in the top 5 to earn promotions from Beginner to Wealth Master.'}
              </p>
            </div>
            <div className="w-full lg:w-1/2 overflow-hidden bg-white border border-slate-300">
              <img 
                src="/gameplay/liga-arena.png" 
                alt="Antarmuka Liga KoinKita"
                className="w-full h-auto object-cover rounded-none"
                loading="eager"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          3. "THE ONE LIVE THING"
          Interactive 50/30/20 Budget Partitioner & Financial Instinct Calculator
      ========================================== */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-poppins font-black tracking-tight text-slate-950 mb-4">
              {language === 'id' ? 'Uji Alokasi Anggaranmu Sekarang.' : 'Test Your Budget Allocation Live.'}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              {language === 'id'
                ? 'Gunakan prinsip Koki Anggaran KoinKita (Metode 50/30/20). Geser nominal penghasilan bulananmu untuk melihat batas aman pengeluaran agar keuangan tidak defisit.'
                : 'Experience KoinKita’s Budget Chef formulation (50/30/20 rule). Adjust your monthly income to uncover safe spending thresholds.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Control Column */}
            <div className="lg:col-span-5 bg-[#F8F9FA] p-6 sm:p-8 border border-slate-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                {language === 'id' ? 'Pilih Preset Penghasilan Bulanan' : 'Select Monthly Income Preset'}
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {incomePresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => { playClick(); setMonthlyIncome(preset.value); }}
                    className={`py-3 px-4 text-xs font-bold rounded-full text-left transition-colors cursor-pointer ${
                      monthlyIncome === preset.value
                        ? 'bg-slate-950 text-white'
                        : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Slider Input */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-600">{language === 'id' ? 'Nominal Kustom:' : 'Custom Income:'}</span>
                  <span className="text-lg font-black text-slate-950 font-poppins">{formatRupiah(monthlyIncome)}</span>
                </div>
                <input 
                  type="range"
                  min={1000000}
                  max={30000000}
                  step={500000}
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 accent-emerald-600 cursor-pointer"
                  aria-label="Monthly income slider"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                  <span>Rp 1.000.000</span>
                  <span>Rp 30.000.000</span>
                </div>
              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1: Needs 50% */}
              <div className="bg-[#F8F9FA] p-6 border-t-4 border-slate-900 border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  50% {language === 'id' ? 'Kebutuhan Pokok' : 'Core Needs'}
                </span>
                <div className="text-2xl font-black font-poppins text-slate-950 mb-3">
                  {formatRupiah(needsAmount)}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'id'
                    ? 'Beras, sewa tempat tinggal, listrik, air, transportasi kerja, dan cicilan pokok.'
                    : 'Groceries, housing rent, utilities, transit, and essential commitments.'}
                </p>
              </div>

              {/* Card 2: Wants 30% */}
              <div className="bg-[#F8F9FA] p-6 border-t-4 border-amber-600 border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
                  30% {language === 'id' ? 'Keinginan & Gaya Hidup' : 'Lifestyle & Wants'}
                </span>
                <div className="text-2xl font-black font-poppins text-slate-950 mb-3">
                  {formatRupiah(wantsAmount)}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'id'
                    ? 'Kopi nongkrong, langganan streaming, belanja hobi, dan liburan akhir pekan.'
                    : 'Cafes, dining out, streaming subs, hobbies, and weekend leisure.'}
                </p>
              </div>

              {/* Card 3: Savings 20% */}
              <div className="bg-[#F8F9FA] p-6 border-t-4 border-emerald-600 border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                  20% {language === 'id' ? 'Tabungan & Investasi' : 'Savings & Investment'}
                </span>
                <div className="text-2xl font-black font-poppins text-slate-950 mb-3">
                  {formatRupiah(savingsAmount)}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'id'
                    ? 'Dana darurat tunai, SBN negara, emas batangan, dan reksa dana pasar uang.'
                    : 'Emergency buffer, government bonds, gold reserves, and mutual funds.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. ASYMMETRIC 4 MINI-GAMES SHOWCASE
          Replacing the banned repeating icon-topped card grid
          Floor fulfilled: Real screenshots of Detektif Cuan, Koki Anggaran, Pohon Aset, FinWordle
      ========================================== */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 max-w-7xl mx-auto space-y-24">
        
        {/* Intro */}
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-poppins font-black tracking-tight text-slate-950 mb-4">
            {language === 'id' ? 'Empat Game, Satu Misi Finansial.' : 'Four Games, One Financial Mission.'}
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed">
            {language === 'id'
              ? 'Tiap mini-game dirancang dari masalah finansial nyata yang dihadapi masyarakat: jebakan pinjaman daring, gaya hidup FOMO, dan penipuan investasi.'
              : 'Every game addresses real financial hazards: predatory loan sharks, consumerist traps, and deceptive investment scams.'}
          </p>
        </div>

        {/* Game 1: Detektif Cuan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F1F3F5] p-6 sm:p-12 border border-slate-200" data-ui>
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {language === 'id' ? 'Simulasi 01 / Modus Penipuan' : 'Simulation 01 / Scam Defense'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-poppins font-black text-slate-950">
              Detektif Cuan
            </h3>
            <p className="text-slate-700 leading-relaxed text-base">
              {language === 'id'
                ? 'Latih ketajaman matamu memeriksa pesan mencurigakan, penawaran bunga tak masuk akal, dan surat izin palsu. Bedakan mana instrumen legal berizin OJK dan mana jebakan Ponzi sebelum uangmu lenyap.'
                : 'Scrutinize suspicious SMS alerts, unrealistic yield guarantees, and spoofed regulatory credentials. Separate legitimate offerings from Ponzi traps.'}
            </p>
          </div>
          <div className="lg:col-span-6 bg-white border border-slate-300 overflow-hidden">
            <img 
              src="/gameplay/detektif-cuan.png" 
              alt="Detektif Cuan Interface" 
              className="w-full h-auto object-cover rounded-none"
              loading="lazy"
            />
          </div>
        </div>

        {/* Game 2: Koki Anggaran */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F8F9FA] p-6 sm:p-12 border border-slate-200" data-ui>
          <div className="lg:col-span-6 order-2 lg:order-1 bg-white border border-slate-300 overflow-hidden">
            <img 
              src="/gameplay/koki-anggaran.png" 
              alt="Koki Anggaran Interface" 
              className="w-full h-auto object-cover rounded-none"
              loading="lazy"
            />
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {language === 'id' ? 'Simulasi 02 / Alokasi Anggaran' : 'Simulation 02 / Budget Balancing'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-poppins font-black text-slate-950">
              Koki Anggaran
            </h3>
            <p className="text-slate-700 leading-relaxed text-base">
              {language === 'id'
                ? 'Jadilah koki yang meracik pengeluaran bulanan. Seimbangkan pos belanja agar anggaran tidak defisit dan dapur finansialmu tidak terbakar di pertengahan bulan.'
                : 'Act as the executive chef balancing household expenses. Keep essential portions balanced so your monthly cash flow stays resilient.'}
            </p>
          </div>
        </div>

        {/* Game 3: Pohon Aset */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F1F3F5] p-6 sm:p-12 border border-slate-200" data-ui>
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {language === 'id' ? 'Simulasi 03 / Pertumbuhan Investasi' : 'Simulation 03 / Asset Growth'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-poppins font-black text-slate-950">
              Pohon Aset
            </h3>
            <p className="text-slate-700 leading-relaxed text-base">
              {language === 'id'
                ? 'Simulasikan diversifikasi portofolio jangka panjang. Tanam aset pada cabang Aman (Emas, Deposito, SBN) dan cabang Tumbuh (Saham, Indeks) di tengah fluktuasi cuaca ekonomi global.'
                : 'Simulate long-term capital compounding. Allocate across Stable branches (Gold, Term Deposits, SBN) and Growth branches through changing economic weather.'}
            </p>
          </div>
          <div className="lg:col-span-6 bg-white border border-slate-300 overflow-hidden">
            <img 
              src="/gameplay/pohon-aset.png" 
              alt="Pohon Aset Interface" 
              className="w-full h-auto object-cover rounded-none"
              loading="lazy"
            />
          </div>
        </div>

        {/* Game 4: FinWordle */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F8F9FA] p-6 sm:p-12 border border-slate-200" data-ui>
          <div className="lg:col-span-6 order-2 lg:order-1 bg-white border border-slate-300 overflow-hidden">
            <img 
              src="/gameplay/fin-wordle.png" 
              alt="FinWordle Interface" 
              className="w-full h-auto object-cover rounded-none"
              loading="lazy"
            />
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {language === 'id' ? 'Simulasi 04 / Kosakata Finansial' : 'Simulation 04 / Financial Vocabulary'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-poppins font-black text-slate-950">
              Fin-Wordle
            </h3>
            <p className="text-slate-700 leading-relaxed text-base">
              {language === 'id'
                ? 'Asah pemahaman istilah perbankan, pasar modal, dan ekonomi harian lewat tebak kata adaptif berpetunjuk. Jangan biarkan istilah asing membingungkan keputusanmu.'
                : 'Expand your literacy across banking terminology, capital markets, and fiscal terms with adaptive contextual word puzzles.'}
            </p>
          </div>
        </div>

      </section>

      {/* ==========================================
          5. PLAYER LITERACY PROGRESSION (RANKS)
          Clean typographic table replacing emoji badges
      ========================================== */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-poppins font-black tracking-tight text-slate-950 mb-4">
              {language === 'id' ? 'Tingkatan Literasi Finansial.' : 'Financial Literacy Progression.'}
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              {language === 'id'
                ? 'Setiap kuis, puzzle, dan simulasi yang kamu selesaikan menambah XP akumulatif untuk membuka tingkatan liga yang lebih tinggi.'
                : 'Every simulation and quiz you complete earns cumulative XP, unlocking higher tier leagues and club treasury perks.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { level: '01', title: language === 'id' ? 'Pemula' : 'Beginner', xp: '0 – 999 XP', desc: language === 'id' ? 'Langkah awal memahami nilai dasar mata uang dan mencatat pengeluaran pokok.' : 'First fundamentals in understanding base cash flow and tracking expenses.' },
              { level: '02', title: language === 'id' ? 'Sadar Finansial' : 'Financially Aware', xp: '1.000 – 4.999 XP', desc: language === 'id' ? 'Cerdas memisahkan kebutuhan primer dari godaan konsumtif sesaat.' : 'Discerning between essential necessities and fleeting impulse buys.' },
              { level: '03', title: language === 'id' ? 'Bijak Belanja' : 'Wise Spender', xp: '5.000 – 14.999 XP', desc: language === 'id' ? 'Menguasai alokasi anggaran bulanan tanpa pernah terjebak defisit.' : 'Disciplined budget balancing to ensure zero deficit each month.' },
              { level: '04', title: language === 'id' ? 'Investor Cerdas' : 'Smart Investor', xp: '15.000 – 29.999 XP', desc: language === 'id' ? 'Memahami instrumen SBN dan emas untuk melindungi nilai dari inflasi.' : 'Utilizing bonds and reserves to safeguard purchasing power against inflation.' },
              { level: '05', title: language === 'id' ? 'Ahli Anggaran' : 'Budget Expert', xp: '30.000 – 49.999 XP', desc: language === 'id' ? 'Tangguh menghadapi guncangan pasar dan mengoptimalkan aset produktif.' : 'Resilient portfolio management through macro-economic turbulence.' },
              { level: '06', title: language === 'id' ? 'Master Kekayaan' : 'Wealth Master', xp: '50.000+ XP', desc: language === 'id' ? 'Mencapai kemandirian finansial sejati di mana aset bekerja untukmu.' : 'True financial independence with compound yields working in harmony.' }
            ].map((rank) => (
              <div key={rank.level} className="bg-[#F8F9FA] p-6 border border-slate-200">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="font-poppins font-black text-xl text-slate-900">{rank.title}</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{rank.xp}</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {rank.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. FULL-BLEED ANDROID MOBILE APP SECTION
          Section inversion to deep ink ground
      ========================================== */}
      <section className="bg-[#090D16] text-white py-20 sm:py-28 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
          <div className="max-w-2xl space-y-6">
            <h2 className="text-3xl sm:text-5xl font-poppins font-black tracking-tight leading-tight">
              {language === 'id' 
                ? 'Bawa Petualangan Finansialmu di Saku.' 
                : 'Carry Your Wealth Adventure in Your Pocket.'}
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed font-normal">
              {language === 'id'
                ? 'Dapatkan aplikasi Android KoinKita untuk gameplay offline yang lebih responsif, dukungan deep link teman instan, dan haptic feedback saat bermain.'
                : 'Install KoinKita for Android for responsive offline play, instant deep link friend invitations, and tactile feedback.'}
            </p>
            <div className="pt-2 text-xs text-slate-400 font-medium">
              <span>{language === 'id' ? 'Versi Stabil: v1.4.0 APK (Android 8.0+)' : 'Stable Release: v1.4.0 APK (Android 8.0+)'}</span>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <a 
              href="https://github.com/Radarya/KoinKita/releases/latest/download/KoinKita-v1.4.0.apk"
              download="KoinKita-v1.4.0.apk"
              onClick={() => playClick()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 py-5 px-10 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base rounded-full transition-colors cursor-pointer"
            >
              <Download className="w-5 h-5 shrink-0" />
              <span>{language === 'id' ? 'Unduh Berkas APK Android' : 'Download Android APK'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ==========================================
          7. FAQ ACCORDION
      ========================================== */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-poppins font-black tracking-tight text-slate-950 mb-3">
            {language === 'id' ? 'Pertanyaan yang Sering Diajukan.' : 'Frequently Asked Questions.'}
          </h2>
          <p className="text-slate-700 text-base">
            {language === 'id' ? 'Transparansi penuh tentang platform dan data permainan.' : 'Clear information regarding the platform and simulation rules.'}
          </p>
        </div>

        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {[
            {
              q: language === 'id' ? 'Apakah KoinKita sepenuhnya gratis?' : 'Is KoinKita completely free?',
              a: language === 'id' ? 'Ya. KoinKita 100% gratis tanpa biaya langganan tersembunyi, bertujuan murni meningkatkan literasi keuangan masyarakat Indonesia.' : 'Yes. KoinKita is 100% free with no subscription barriers, dedicated to advancing public financial literacy.'
            },
            {
              q: language === 'id' ? 'Apakah simulasi investasi di aplikasi ini adalah saran keuangan resmi?' : 'Are investment simulations considered financial advice?',
              a: language === 'id' ? 'Bukan. Seluruh simulasi KoinKita dibuat untuk tujuan edukatif melatih pola pikir dan kebiasaan finansial, bukan penasihat keuangan bersertifikasi.' : 'No. All simulations are designed for pedagogical purposes to develop habits, not certified financial consulting.'
            },
            {
              q: language === 'id' ? 'Bagaimana sistem promosi Liga Finansial bekerja?' : 'How does the Weekly Financial League work?',
              a: language === 'id' ? 'Pemain ditempatkan dalam kelompok 30 orang. Kumpulkan XP dari mini-game; posisi 5 teratas otomatis naik kasta liga setiap akhir pekan.' : 'Players compete in 30-person brackets. Top 5 players with highest XP advance to the next tier at weekly reset.'
            },
            {
              q: language === 'id' ? 'Apakah data akun tamu saya bisa hilang?' : 'Can my guest account data be lost?',
              a: language === 'id' ? 'Akun tamu disimpan secara lokal di perangkat. Untuk menjamin data tersimpan permanen di cloud, kamu dapat menautkan akun ke Google kapan saja.' : 'Guest progress is saved on your device. Link with Google at any time to preserve progress safely in cloud storage.'
            }
          ].map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-5">
                <button
                  onClick={() => { playClick(); setOpenFaq(isOpen ? null : index); }}
                  className="w-full flex items-center justify-between text-left cursor-pointer group"
                >
                  <span className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">
                    {item.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <p className="mt-4 text-slate-700 text-base leading-relaxed pr-8">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ==========================================
          8. FEEDBACK & SUGGESTIONS
          Clean container without blurred shadows
      ========================================== */}
      <section className="py-20 px-6 sm:px-12 bg-[#F8F9FA] border-t border-slate-200">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-poppins font-black text-slate-950 mb-2">
              {language === 'id' ? 'Kritik & Masukan Pengguna' : 'User Feedback & Inquiries'}
            </h2>
            <p className="text-slate-700 text-sm">
              {language === 'id' 
                ? 'Masukanmu membantu kami menyempurnakan kurikulum edugame KoinKita.' 
                : 'Your feedback directly refines our edugame curriculum.'}
            </p>
          </div>

          {feedbackSubmitted ? (
            <div className="p-8 bg-white border border-slate-200 text-center space-y-4">
              <h3 className="text-xl font-black text-slate-900">
                {language === 'id' ? 'Terima kasih atas masukanmu.' : 'Thank you for your feedback.'}
              </h3>
              <p className="text-sm text-slate-600">
                {language === 'id' ? 'Pesanmu telah berhasil dicatat oleh tim pengembang.' : 'Your thoughts have been logged for development review.'}
              </p>
              <button
                onClick={() => setFeedbackSubmitted(false)}
                className="py-2.5 px-6 bg-slate-950 text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer hover:bg-slate-800 transition-colors"
              >
                {language === 'id' ? 'Kirim Masukan Baru' : 'Submit Another'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-6 bg-white p-8 border border-slate-200">
              {/* Star Rating */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {language === 'id' ? 'Rating Pengalaman' : 'Experience Rating'}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => { playClick(); setFeedbackRating(star); }}
                      onMouseEnter={() => setFeedbackHoverRating(star)}
                      onMouseLeave={() => setFeedbackHoverRating(0)}
                      className="text-2xl cursor-pointer p-1 transition-transform hover:scale-110"
                      aria-label={`Rating ${star}`}
                    >
                      <span className={star <= (feedbackHoverRating || feedbackRating) ? 'text-amber-500' : 'text-slate-300'}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    {language === 'id' ? 'Nama (Opsional)' : 'Name (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    placeholder={language === 'id' ? 'Budi Santoso' : 'Alex Rivers'}
                    className="w-full px-4 py-3 bg-[#F8F9FA] border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-slate-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    {language === 'id' ? 'Email (Opsional)' : 'Email (Optional)'}
                  </label>
                  <input
                    type="email"
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-3 bg-[#F8F9FA] border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-slate-950"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {language === 'id' ? 'Pesan Masukan' : 'Feedback Message'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder={language === 'id' ? 'Tuliskan masukan atau laporan kendala Anda di sini...' : 'Write your feedback or bug report here...'}
                  className="w-full px-4 py-3 bg-[#F8F9FA] border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-slate-950 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={feedbackSubmitting}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider rounded-full transition-colors cursor-pointer"
              >
                {feedbackSubmitting ? (
                  language === 'id' ? 'Mengirim...' : 'Sending...'
                ) : (
                  language === 'id' ? 'Kirim Masukan' : 'Submit Feedback'
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ==========================================
          9. DESIGNED CLOSING FOOTER
          Large wordmark, clean copyright & legal statement
      ========================================== */}
      <footer className="bg-white border-t border-slate-200 py-16 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <div className="font-poppins font-black text-3xl sm:text-5xl tracking-tighter text-slate-950 mb-3">
              KOINKITA
            </div>
            <p className="text-slate-600 text-sm max-w-md">
              {language === 'id' 
                ? 'Platform edugame literasi finansial interaktif. Membangun kecakapan anggaran, investasi, dan pertahanan penipuan digital.'
                : 'Interactive financial literacy game platform. Building skills in budgeting, investment, and fraud resilience.'}
            </p>
          </div>

          <div className="text-left md:text-right text-xs text-slate-500 space-y-2">
            <div>
              &copy; {new Date().getFullYear()} KoinKita.xyz. All rights reserved.
            </div>
            <div>
              <a 
                href="https://github.com/Radarya/KoinKita" 
                target="_blank" 
                rel="noreferrer"
                className="underline hover:text-slate-950 transition-colors"
              >
                GitHub Repository
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-slate-950 hover:bg-slate-800 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Scroll to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
