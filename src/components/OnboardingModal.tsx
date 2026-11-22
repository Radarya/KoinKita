import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  ChevronLeft,
  Loader2,
  Lock
} from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import { playClick } from '../lib/audio';
import CikoMascot from './CikoMascot';

interface OnboardingModalProps {
  onLinkGoogle: () => void;
  onContinueGuest: () => void;
  onGoToAuth?: () => void;
  isLoading: boolean;
}

export default function OnboardingModal({ onLinkGoogle, onContinueGuest, onGoToAuth, isLoading }: OnboardingModalProps) {
  const { language } = useTranslation();
  const [step, setStep] = useState(0);
  const [agreed, setAgreed] = useState(false);

  const totalSteps = 4;

  const nextStep = () => {
    playClick();
    if (step < totalSteps - 1) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    playClick();
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const mascotPose = step === 0 ? 'hero' : step === 1 ? 'chef' : step === 2 ? 'scholar' : 'wealth';

  const miniGames = [
    {
      pose: 'hero' as const,
      title: language === 'id' ? 'Ekspedisi 6 Semester' : '6-Semester Expedition',
      desc: language === 'id' ? '175 Keping Materi bertahap lengkap dengan Buku Saku rujukan OJK dan BI.' : '175 progressive Lessons paired with OJK & BI reference Guidebooks.',
      tone: 'bg-[#ECFDF5]'
    },
    {
      pose: 'detective' as const,
      title: language === 'id' ? 'Sistem 5 Nyawa' : '5-Heart Challenge',
      desc: language === 'id' ? 'Setiap salah di Ekspedisi mengurangi 1 nyawa dan masuk Bank Kesalahan.' : 'Each mistake on an Expedition costs 1 Heart and logs into Mistake Bank.',
      tone: 'bg-[#FFF1F2]'
    },
    {
      pose: 'scholar' as const,
      title: language === 'id' ? 'Latihan & Flashcard' : 'Practice & Flashcards',
      desc: language === 'id' ? 'Tebus +1 nyawa gratis hingga 2× sehari lewat Bank Kesalahan atau Flashcard.' : 'Recover +1 Heart free up to 2× daily via Mistake Review or Flashcards.',
      tone: 'bg-[#EEF2FF]'
    },
    {
      pose: 'wealth' as const,
      title: language === 'id' ? 'Tes Penempatan & Liga' : 'Joint Placement & Leagues',
      desc: language === 'id' ? 'Uji kemampuan awal hingga Semester 4 dan bersaing sehat di Liga Mingguan.' : 'Place up to Semester 4 and compete fairly in Weekly Leagues.',
      tone: 'bg-[#FFFBEB]'
    }
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0D1117]/80 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Solid Ink Header */}
        <div className="bg-[#0D1117] text-white p-6 sm:p-7 flex flex-col items-center justify-center text-center shrink-0">
          <div className="mb-3">
            <CikoMascot size={76} pose={mascotPose} animated={true} />
          </div>
          <h3 className="text-xl sm:text-2xl font-poppins font-black tracking-tight">
            {language === 'id' ? 'Memulai CIKO' : 'Getting Started with CIKO'}
          </h3>
          <p className="text-xs text-slate-400 font-semibold mt-1 tabular-nums">
            {language === 'id' ? `Langkah ${step + 1} dari ${totalSteps}` : `Step ${step + 1} of ${totalSteps}`}
          </p>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 flex-grow overflow-y-auto min-h-[280px] bg-white flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* STEP 1: WELCOME & CONCEPT */}
              {step === 0 && (
                <div className="text-center space-y-4 max-w-md mx-auto">
                  <h4 className="text-2xl font-black text-[#0D1117] font-poppins tracking-tight">
                    {language === 'id' ? 'Selamat Datang di CIKO' : 'Welcome to CIKO'}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                    {language === 'id'
                      ? 'CIKO adalah edugame literasi finansial untuk melatih kebiasaan keuangan cerdas: mengelola anggaran belanja, memahami investasi, dan mengenali bahaya penipuan digital.'
                      : 'CIKO is a financial literacy game designed to train smart money habits: managing budgets, understanding investments, and spotting digital financial fraud.'}
                  </p>
                </div>
              )}

              {/* STEP 2: CORE SYSTEM SHOWCASE */}
              {step === 1 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-black text-[#0D1117] text-center font-poppins">
                    {language === 'id' ? 'Cara Belajar & Aturan Main CIKO' : 'How Learning & Rules Work in CIKO'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {miniGames.map((game) => (
                      <div key={game.title} className={`flex items-center gap-3.5 p-4 rounded-2xl ${game.tone}`}>
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0">
                          <CikoMascot size={40} pose={game.pose} animated={false} />
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-bold text-sm text-[#0D1117]">{game.title}</h5>
                          <p className="text-xs text-slate-700 mt-0.5 leading-snug">{game.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: AGREEMENT POLICY */}
              {step === 2 && (
                <div className="space-y-4 max-w-md mx-auto">
                  <h4 className="text-lg font-black text-[#0D1117] text-center font-poppins">
                    {language === 'id' ? 'Aturan Main & Kebijakan Privasi' : 'Rules & Privacy Policy'}
                  </h4>
                  <div className="p-4 bg-[#F4F5F7] rounded-2xl max-h-[160px] overflow-y-auto text-xs text-slate-700 leading-relaxed font-medium space-y-2">
                    <p className="font-bold text-[#0D1117]">{language === 'id' ? '1. Perlindungan Data & Akun Tamu' : '1. Data Protection & Guest Accounts'}</p>
                    <p>{language === 'id' ? 'Progres akun Tamu tersimpan di perangkat selama aplikasi terpasang dan terhapus otomatis jika tidak aktif 30 hari. Tautkan ke Google atau Email kapan saja agar data permanen di cloud.' : 'Guest progress stays on your device while installed and expires after 30 days of inactivity. Link Google or Email anytime to save permanently in the cloud.'}</p>
                    <p className="font-bold text-[#0D1117]">{language === 'id' ? '2. Penggunaan Edukasi' : '2. Educational Use'}</p>
                    <p>{language === 'id' ? 'Seluruh simulasi investasi di CIKO hanya ditujukan untuk tujuan edukasi finansial dan bukan saran keuangan resmi.' : 'All investment simulations in CIKO are for financial educational purposes only and are not certified financial advice.'}</p>
                  </div>

                  <label className="flex items-start gap-3 p-4 bg-[#F4F5F7] rounded-2xl cursor-pointer hover:bg-slate-200/70 transition-colors">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 mt-0.5 accent-emerald-600"
                    />
                    <span className="text-xs text-[#0D1117] font-bold leading-normal">
                      {language === 'id'
                        ? 'Saya menyetujui Kebijakan Privasi, Ketentuan Penggunaan, dan Aturan Main CIKO.'
                        : 'I agree to the Privacy Policy, Terms of Use, and Game Rules of CIKO.'}
                    </span>
                  </label>
                </div>
              )}

              {/* STEP 4: ACCOUNT CHOICE */}
              {step === 3 && (
                <div className="text-center space-y-5 max-w-sm mx-auto">
                  <div className="w-12 h-12 bg-[#F4F5F7] rounded-2xl flex items-center justify-center mx-auto">
                    <Lock className="w-5 h-5 text-[#0D1117]" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-black text-[#0D1117] font-poppins">
                      {language === 'id' ? 'Pilih Akses Masuk' : 'Choose Login Method'}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {language === 'id'
                        ? 'Tautkan dengan Google sekarang agar progres bermainmu tersimpan selamanya di cloud, atau mulai cepat sebagai Tamu.'
                        : 'Link with Google now to preserve your progress safely in the cloud, or play immediately as a Guest.'}
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    <button
                      onClick={onLinkGoogle}
                      disabled={isLoading}
                      className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full cursor-pointer transition-colors flex items-center justify-center gap-2.5 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{language === 'id' ? 'Menghubungkan...' : 'Linking...'}</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.709 0 3.277.604 4.5 1.625l2.437-2.437C17.312 1.696 14.933 1 12.24 1 6.58 1 2 5.58 2 11.24s4.58 10.24 10.24 10.24c5.795 0 10.24-4.11 10.24-10.24 0-.685-.08-1.355-.24-1.955H12.24z" />
                          </svg>
                          <span>{language === 'id' ? 'Tautkan Akun Google' : 'Link Google Account'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={onContinueGuest}
                      disabled={isLoading}
                      className="w-full py-4 px-6 bg-[#F4F5F7] hover:bg-slate-200 text-[#0D1117] font-bold text-sm rounded-full cursor-pointer transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {language === 'id' ? 'Lanjutkan sebagai Tamu' : 'Continue as Guest'}
                    </button>

                    {onGoToAuth && (
                      <button
                        onClick={onGoToAuth}
                        disabled={isLoading}
                        className="w-full py-2.5 text-emerald-700 hover:text-emerald-800 font-bold text-xs hover:underline flex items-center justify-center gap-1 cursor-pointer"
                      >
                        {language === 'id' ? 'Atau Daftar / Masuk dengan Email' : 'Or Register / Log In with Email'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Footer */}
        <div className="p-5 sm:p-6 flex justify-between items-center bg-[#F4F5F7] shrink-0">
          <button
            onClick={prevStep}
            disabled={step === 0 || isLoading}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-white hover:bg-slate-100 disabled:opacity-40 text-[#0D1117] text-sm font-bold rounded-full transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> {language === 'id' ? 'Kembali' : 'Back'}
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-emerald-600' : 'w-2.5 bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            disabled={step === totalSteps - 1 || (step === 2 && !agreed) || isLoading}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-[#0D1117] hover:bg-slate-800 disabled:opacity-40 text-white text-sm font-bold rounded-full transition-colors cursor-pointer"
          >
            {language === 'id' ? 'Lanjut' : 'Next'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
