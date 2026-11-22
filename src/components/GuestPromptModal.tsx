import React from 'react';
import { motion } from 'motion/react';
import { Loader2, Mail, ShieldCheck, X } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import { playClick } from '../lib/audio';
import CikoMascot from './CikoMascot';

interface GuestPromptModalProps {
  onLinkGoogle: () => void;
  onOpenAuth: () => void;
  onContinueGuest: () => void;
  isLoading: boolean;
}

export function GuestPromptModal({
  onLinkGoogle,
  onOpenAuth,
  onContinueGuest,
  isLoading,
}: GuestPromptModalProps) {
  const { language } = useTranslation();

  return (
    <div className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center p-4 bg-[#0D1117]/70">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 space-y-5 relative"
      >
        <button
          type="button"
          onClick={() => {
            playClick();
            onContinueGuest();
          }}
          disabled={isLoading}
          aria-label={language === 'id' ? 'Tutup' : 'Close'}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F4F5F7] hover:bg-slate-200 flex items-center justify-center text-[#0D1117] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4 pr-8">
          <div className="shrink-0">
            <CikoMascot size={64} pose="hero" animated={false} />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#059669]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Akun Tamu Aktif' : 'Guest Mode Active'}</span>
            </div>
            <h2 className="font-poppins font-black text-xl text-[#0D1117] leading-snug">
              {language === 'id' ? 'Simpan Progres Belajarmu?' : 'Save Your Learning Progress?'}
            </h2>
          </div>
        </div>

        <p className="text-sm text-slate-600 font-medium leading-relaxed bg-[#F4F5F7] p-4 rounded-2xl">
          {language === 'id'
            ? 'Saat ini kamu langsung masuk jalur Ekspedisi sebagai Tamu. Data Tamu hanya bertahan selama aplikasi terpasang dan terhapus otomatis jika tidak aktif 30 hari. Buat atau tautkan akun supaya progresmu aman selamanya.'
            : 'You are starting straight in the learning path as a Guest. Guest data is kept only while the app stays installed and expires after 30 days of inactivity. Link an account to keep your progress permanently.'}
        </p>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => {
              playClick();
              onLinkGoogle();
            }}
            disabled={isLoading}
            className="w-full py-3.5 px-5 bg-[#059669] hover:bg-emerald-700 text-white font-bold text-sm rounded-full transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{language === 'id' ? 'Menghubungkan...' : 'Linking...'}</span>
              </>
            ) : (
              <span>{language === 'id' ? 'Tautkan Akun Google' : 'Link Google Account'}</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              playClick();
              onOpenAuth();
            }}
            disabled={isLoading}
            className="w-full py-3.5 px-5 bg-[#0D1117] hover:bg-slate-800 text-white font-bold text-sm rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Mail className="w-4 h-4" />
            <span>{language === 'id' ? 'Buat atau Masuk dengan Email' : 'Sign Up or Log In with Email'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClick();
              onContinueGuest();
            }}
            disabled={isLoading}
            className="w-full py-3.5 px-5 bg-[#F4F5F7] hover:bg-slate-200 text-[#0D1117] font-bold text-sm rounded-full transition-colors cursor-pointer disabled:opacity-50"
          >
            {language === 'id' ? 'Nanti Saja, Lanjut sebagai Tamu' : 'Later, Continue as Guest'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default GuestPromptModal;
