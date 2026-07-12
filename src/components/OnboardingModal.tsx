import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  CircleDollarSign, 
  Coins, 
  TrendingUp, 
  BookOpen, 
  Loader2, 
  Lock
} from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import { playClick } from '../lib/audio';

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

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100"
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-tr from-emerald-400 to-teal-500 p-6 flex flex-col items-center justify-center text-center text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full pointer-events-none -mr-8 -mt-8"></div>
          
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
            <Coins className="w-8 h-8 text-white animate-bounce" />
          </div>
          <h3 className="text-xl sm:text-2xl font-poppins font-black tracking-tight">
            {language === 'id' ? 'Memulai KoinKita' : 'Getting Started with KoinKita'}
          </h3>
          <p className="text-xs text-white/80 font-bold uppercase tracking-wider mt-1">
            {language === 'id' ? `Langkah ${step + 1} dari ${totalSteps}` : `Step ${step + 1} of ${totalSteps}`}
          </p>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 flex-grow overflow-y-auto min-h-[300px] bg-slate-50/50 flex flex-col justify-center">
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
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto shadow-sm shadow-amber-200">
                    <CircleDollarSign className="w-10 h-10 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <h4 className="text-lg font-black text-slate-800 font-poppins">
                    {language === 'id' ? 'Selamat Datang di KoinKita! 🎉' : 'Welcome to KoinKita! 🎉'}
                  </h4>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-sm mx-auto">
                    {language === 'id' 
                      ? 'KoinKita adalah game edukasi finansial untuk membantumu melatih kebiasaan keuangan yang cerdas. Kamu akan belajar mengelola anggaran belanja, memahami investasi, dan mengenali bahaya fraud.' 
                      : 'KoinKita is a financial educational game to help you practice smart money habits. You will learn to manage budgets, understand investments, and spot financial fraud.'}
                  </p>
                </div>
              )}

              {/* STEP 2: MINI GAMES SHOWCASE */}
              {step === 1 && (
                <div className="space-y-4">
                  <h4 className="text-base font-black text-slate-800 text-center font-poppins">
                    {language === 'id' ? 'Jelajahi Mini-Game Finansial 🎮' : 'Explore Financial Mini-Games 🎮'}
                  </h4>
                  <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
                    <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                        <Coins className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-slate-800">{language === 'id' ? 'Koki Anggaran' : 'Budget Chef'}</h5>
                        <p className="text-xs text-slate-600 mt-0.5">{language === 'id' ? 'Susun resep belanjaan dan kelola anggaran tanpa defisit!' : 'Prepare shopping recipes and manage budgets without deficit!'}</p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-slate-800">{language === 'id' ? 'Pohon Aset' : 'Asset Tree'}</h5>
                        <p className="text-xs text-slate-600 mt-0.5">{language === 'id' ? 'Simulasikan investasi dan rasakan pertumbuhan bunga majemuk.' : 'Simulate investments and witness compound interest growth.'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: AGREEMENT POLICY */}
              {step === 2 && (
                <div className="space-y-4 max-w-md mx-auto">
                  <h4 className="text-base font-black text-slate-800 text-center font-poppins">
                    {language === 'id' ? 'Aturan Main & Kebijakan Privasi 📜' : 'Rules & Privacy Policy 📜'}
                  </h4>
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm max-h-[160px] overflow-y-auto text-xs text-slate-600 leading-relaxed font-medium space-y-2">
                    <p className="font-bold text-slate-700">{language === 'id' ? '1. Perlindungan Data' : '1. Data Protection'}</p>
                    <p>{language === 'id' ? 'Kami menghormati privasimu. Data progres akun tamumu akan disimpan secara lokal di perangkat Anda.' : 'We respect your privacy. Your guest account progression data will be stored locally on your device.'}</p>
                    <p className="font-bold text-slate-700">{language === 'id' ? '2. Penggunaan Edukasi' : '2. Educational Use'}</p>
                    <p>{language === 'id' ? 'Seluruh simulasi investasi di game ini hanya ditujukan untuk tujuan edukasi finansial dan bukan saran keuangan resmi.' : 'All investment simulations in this game are for financial educational purposes only and are not financial advice.'}</p>
                  </div>
                  
                  <label className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-5 h-5 rounded-lg border-slate-300 text-emerald-500 focus:ring-emerald-400 mt-0.5"
                    />
                    <span className="text-xs text-slate-700 font-bold leading-normal">
                      {language === 'id' 
                        ? 'Saya menyetujui Kebijakan Privasi, Ketentuan Penggunaan, dan Aturan Main KoinKita.' 
                        : 'I agree to the Privacy Policy, Terms of Use, and Game Rules of KoinKita.'}
                    </span>
                  </label>
                </div>
              )}

              {/* STEP 4: ACCOUNT CHOICE */}
              {step === 3 && (
                <div className="text-center space-y-5 max-w-sm mx-auto">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100">
                    <Lock className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-black text-slate-800 font-poppins">
                      {language === 'id' ? 'Pilih Akses Masuk 🔐' : 'Choose Login Method 🔐'}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {language === 'id' 
                        ? 'Tautkan dengan Google sekarang agar progres bermainmu tersimpan selamanya di cloud, atau bermain cepat dengan akun Tamu (Guest).' 
                        : 'Link with Google now to save your progression forever in the cloud, or play quickly using a Guest account.'}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      onClick={onLinkGoogle}
                      disabled={isLoading}
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm rounded-2xl cursor-pointer shadow-md transition-all active:scale-[0.98] border-b-4 border-emerald-700 hover:border-emerald-600 flex items-center justify-center gap-2 hover:scale-[1.01]"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{language === 'id' ? 'Menghubungkan...' : 'Linking...'}</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.709 0 3.277.604 4.5 1.625l2.437-2.437C17.312 1.696 14.933 1 12.24 1 6.58 1 2 5.58 2 11.24s4.58 10.24 10.24 10.24c5.795 0 10.24-4.11 10.24-10.24 0-.685-.08-1.355-.24-1.955H12.24z"/>
                          </svg>
                          <span>{language === 'id' ? 'Tautkan Akun Google' : 'Link Google Account'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={onContinueGuest}
                      disabled={isLoading}
                      className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm rounded-2xl cursor-pointer transition-all active:scale-[0.98] border-b-4 border-slate-300 hover:border-slate-400 flex items-center justify-center gap-2"
                    >
                      {language === 'id' ? 'Lanjutkan sebagai Tamu' : 'Continue as Guest'}
                    </button>

                    {onGoToAuth && (
                      <button
                        onClick={onGoToAuth}
                        disabled={isLoading}
                        className="w-full py-3 text-emerald-600 hover:text-emerald-700 font-bold text-xs hover:underline flex items-center justify-center gap-1 mt-1 cursor-pointer"
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
        <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50">
          <button
            onClick={prevStep}
            disabled={step === 0 || isLoading}
            className="flex items-center gap-1.5 px-4 py-2 text-slate-500 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-transparent text-sm font-bold rounded-xl transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> {language === 'id' ? 'Kembali' : 'Back'}
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div 
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-emerald-500' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            disabled={step === totalSteps - 1 || (step === 2 && !agreed) || isLoading}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 disabled:hover:bg-emerald-50 text-sm font-extrabold rounded-xl transition-all cursor-pointer border border-emerald-200/50"
          >
            {language === 'id' ? 'Lanjut' : 'Next'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
