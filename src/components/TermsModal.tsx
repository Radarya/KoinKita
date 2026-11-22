import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, BookOpen, AlertTriangle, HelpCircle } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import CikoMascot from './CikoMascot';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'guide' | 'rules' | 'privacy';
}

export default function TermsModal({ isOpen, onClose, initialTab = 'guide' }: TermsModalProps) {
  const { language, t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'guide' | 'rules' | 'privacy'>(initialTab);

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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D1117]/80"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="bg-white p-6 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3.5 text-[#0D1117]">
                <CikoMascot size={40} pose="scholar" animated={false} />
                <div>
                  <h2 className="font-poppins font-black text-lg text-[#0D1117] leading-none">
                    {t.tosTitle}
                  </h2>
                  <span className="text-xs font-bold text-slate-500 mt-1 block">
                    CIKO Edugame
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 bg-[#F4F5F7] text-[#0D1117] hover:bg-slate-200 rounded-full transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Swapper */}
            <div className="px-6 pb-4 shrink-0 bg-white">
              <div className="flex p-1 bg-[#F4F5F7] rounded-full gap-1">
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 rounded-full transition-colors cursor-pointer ${
                    activeTab === 'guide'
                      ? 'bg-[#0D1117] text-white'
                      : 'text-slate-600 hover:text-[#0D1117]'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{language === 'id' ? 'Cara Bermain' : 'Guide'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('rules')}
                  className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 rounded-full transition-colors cursor-pointer ${
                    activeTab === 'rules'
                      ? 'bg-[#0D1117] text-white'
                      : 'text-slate-600 hover:text-[#0D1117]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  <span>{language === 'id' ? 'Aturan Main' : 'Rules'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 rounded-full transition-colors cursor-pointer ${
                    activeTab === 'privacy'
                      ? 'bg-[#0D1117] text-white'
                      : 'text-slate-600 hover:text-[#0D1117]'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 shrink-0" />
                  <span>{language === 'id' ? 'Privasi' : 'Privacy'}</span>
                </button>
              </div>
            </div>

            {/* Body Scroll Area */}
            <div className="px-6 pb-6 overflow-y-auto text-sm text-slate-700 space-y-5 custom-scrollbar leading-relaxed bg-white">
              <AnimatePresence mode="wait">
                {activeTab === 'guide' ? (
                  <motion.div
                    key="guide"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <p className="text-xs text-slate-700 font-semibold bg-[#EEFBF4] text-[#064E3B] p-4 rounded-2xl">
                      {t.guideTitle}
                    </p>
                    {t.guideSteps.map((step, i) => (
                      <div key={i} className="bg-[#F4F5F7] rounded-2xl p-4 space-y-1">
                        <h3 className="font-poppins font-black text-[#0D1117] text-sm">
                          {step.title}
                        </h3>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                ) : activeTab === 'rules' ? (
                  <motion.div
                    key="rules"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-5"
                  >
                    <p className="text-xs text-slate-700 font-medium bg-[#F4F5F7] p-4 rounded-2xl">
                      {t.tosIntro}
                    </p>

                    <div className="space-y-1.5">
                      <h3 className="font-poppins font-black text-[#0D1117] text-sm">
                        {t.tosRegisterTitle}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {t.tosRegisterDesc}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-poppins font-black text-[#0D1117] text-sm">
                        {t.tosCoinsTitle}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {t.tosCoinsDesc}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-poppins font-black text-[#0D1117] text-sm">
                        {t.tosFairPlayTitle}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {t.tosFairPlayDesc}
                      </p>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-4">
                      <h3 className="font-poppins font-black text-amber-900 text-xs mb-1.5 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        {t.tosDisclaimerTitle}
                      </h3>
                      <p className="text-amber-800 font-medium text-xs leading-relaxed">
                        {t.tosDisclaimerDesc}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-poppins font-black text-[#0D1117] text-sm">
                        {t.tosDevTitle}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
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
                    className="space-y-5"
                  >
                    <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center gap-3">
                      <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{t.privacyBanner}</span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-poppins font-black text-[#0D1117] text-sm">
                        {t.privacySec1Title}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {t.privacySec1Desc}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-poppins font-black text-[#0D1117] text-sm">
                        {t.privacySec2Title}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {t.privacySec2Desc}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-poppins font-black text-[#0D1117] text-sm">
                        {t.privacySec3Title}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {t.privacySec3Desc}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 shrink-0 flex justify-end bg-[#F4F5F7]">
              <button
                onClick={onClose}
                className="px-6 py-3.5 bg-[#0D1117] hover:bg-slate-800 text-white font-bold text-sm rounded-full transition-colors w-full cursor-pointer"
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
