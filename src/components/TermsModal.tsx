import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, X, Shield, BookOpen, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'rules' | 'privacy';
}

export default function TermsModal({ isOpen, onClose, initialTab = 'rules' }: TermsModalProps) {
  const { language, t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'rules' | 'privacy'>(initialTab);

  // Sync activeTab when modal is opened up or initialTab prop changes
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 "
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 shrink-0 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3 text-slate-800">
                <div className="p-2.5 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-poppins font-black text-lg text-slate-800 leading-none">
                    {language === 'id' ? 'Legalitas & Informasi' : 'Legal & Information'}
                  </h2>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                    {language === 'id' ? 'KoinKita Edugame' : 'KoinKita Edugame'}
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Swapper */}
            <div className="px-6 pt-4 shrink-0 bg-slate-50/50 flex border-b border-slate-100">
              <button
                onClick={() => setActiveTab('rules')}
                className={`flex-1 pb-3 text-sm font-black flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'rules'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                {language === 'id' ? 'Aturan Main' : 'Rules of Play'}
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex-1 pb-3 text-sm font-black flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'privacy'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Shield className="w-4 h-4" />
                {language === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy'}
              </button>
            </div>

            {/* Body Scroll Area */}
            <div className="p-6 overflow-y-auto text-sm text-slate-600 space-y-6 custom-scrollbar leading-relaxed bg-white">
              <AnimatePresence mode="wait">
                {activeTab === 'rules' ? (
                  <motion.div
                    key="rules"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <p className="text-xs text-slate-450 font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      {t.tosIntro}
                    </p>
                    
                    <div>
                      <h3 className="font-poppins font-black text-slate-800 text-sm mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 
                        {t.tosRegisterTitle}
                      </h3>
                      <p className="pl-3.5 border-l-2 border-emerald-100 ml-0.5 text-xs text-slate-500 font-medium">
                        {t.tosRegisterDesc}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-poppins font-black text-slate-800 text-sm mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 
                        {t.tosCoinsTitle}
                      </h3>
                      <p className="pl-3.5 border-l-2 border-emerald-100 ml-0.5 text-xs text-slate-500 font-medium">
                        {t.tosCoinsDesc}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-poppins font-black text-slate-800 text-sm mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 
                        {t.tosFairPlayTitle}
                      </h3>
                      <p className="pl-3.5 border-l-2 border-emerald-100 ml-0.5 text-xs text-slate-500 font-medium">
                        {t.tosFairPlayDesc}
                      </p>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 relative overflow-hidden">
                      <h3 className="font-poppins font-black text-amber-900 text-xs mb-2 flex items-center gap-2 relative z-10">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" /> 
                        {t.tosDisclaimerTitle}
                      </h3>
                      <p className="text-amber-700 font-medium relative z-10 text-[11px] leading-relaxed">
                        {t.tosDisclaimerDesc}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-poppins font-black text-slate-800 text-sm mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 
                        {t.tosDevTitle}
                      </h3>
                      <p className="pl-3.5 border-l-2 border-emerald-100 ml-0.5 text-xs text-slate-500 font-medium">
                        {t.tosDevDesc}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="privacy"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-3">
                      <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>
                        {language === 'id' 
                          ? "Keamanan data pribadi Anda adalah prioritas utama. KoinKita tidak mengumpulkan atau menyebar data sensitif Anda."
                          : "Your personal data security is our ultimate priority. KoinKita does not collect or distribute your sensitive data."}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-poppins font-black text-slate-800 text-sm mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {language === 'id' ? '1. Komitmen Keamanan Data' : '1. Data Security Commitment'}
                      </h3>
                      <p className="pl-3.5 border-l-2 border-emerald-100 ml-0.5 text-xs text-slate-500 font-medium">
                        {language === 'id'
                          ? 'Perlindungan privasi Anda diutamakan. Kami tidak mengumpulkan data pribadi di luar yang diperlukan untuk fungsionalitas Firebase Auth (seperti alamat email dan nama profil). Semua data dienkripsi dengan standar industri.'
                          : 'Your privacy protection comes first. We do not collect personal data beyond what is needed for Firebase Auth functionality (like email address and profile name). All data is encrypted with industry standards.'}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-poppins font-black text-slate-800 text-sm mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {language === 'id' ? '2. Penyimpanan dan Log Aktivitas' : '2. Storage and Activity Logs'}
                      </h3>
                      <p className="pl-3.5 border-l-2 border-emerald-100 ml-0.5 text-xs text-slate-500 font-medium">
                        {language === 'id'
                          ? 'Kami log progres game Anda, koin, skor leaderboard, dan pengaturan bahasa/BGM, semua dikaitkan dengan ID profil unik Anda melalui Cloud Firestore. Tidak ada pelacakan pihak ketiga untuk iklan.'
                          : 'We log your game progress, coins, leaderboard scores, and language/BGM settings, all tied to your unique profile ID via Cloud Firestore. There is no third-party tracking for ads.'}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-poppins font-black text-slate-800 text-sm mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {language === 'id' ? '3. Hak Pengguna Sepenuhnya' : '3. Full User Rights'}
                      </h3>
                      <p className="pl-3.5 border-l-2 border-emerald-100 ml-0.5 text-xs text-slate-500 font-medium">
                        {language === 'id'
                          ? 'Anda Anda berhak menghapus akun beserta datanya dari server kami kapan saja melalui pengaturan profil di dashboard dan tidak bisa dipulihkan kembali lagi.'
                          : 'You have the right to delete your account and its data from our servers at any time via the profile settings on the dashboard, and it cannot be recovered again.'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 shrink-0 border-t border-slate-100 flex justify-end bg-slate-50 rounded-b-[2.5rem]">
              <button 
                onClick={onClose} 
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 border-b-[3px] border-emerald-700 text-white font-extrabold text-xs rounded-2xl transition-all active:translate-y-[1px] w-full shadow-md"
              >
                {t.tosUnderstand}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
