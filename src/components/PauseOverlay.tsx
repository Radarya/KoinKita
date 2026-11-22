import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play } from 'lucide-react';
import { setGamePaused } from '../lib/audio';
import { useTranslation } from '../lib/LanguageContext';
import CikoMascot from './CikoMascot';

interface PauseOverlayProps {
  isPaused: boolean;
}

const PauseOverlay: React.FC<PauseOverlayProps> = ({ isPaused }) => {
  const { language } = useTranslation();

  return (
    <AnimatePresence>
      {isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0D1117]/80 p-6"
        >
          <motion.div
            initial={{ scale: 0.95, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 16 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center"
          >
            <div className="flex justify-center mb-5">
              <CikoMascot size={72} pose="hero" animated={false} />
            </div>

            <h2 className="text-2xl font-poppins font-black text-[#0D1117] mb-3">
              {language === 'id' ? "Permainan Dijeda" : "Game Paused"}
            </h2>

            <p className="text-slate-600 text-sm font-medium mb-8 leading-relaxed">
              {language === 'id'
                ? "Waktu permainan dihentikan sementara karena aplikasi diminimalkan."
                : "Game time is paused because the app was minimized."}
            </p>

            <button
              onClick={() => setGamePaused(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 px-6 rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              {language === 'id' ? "Lanjutkan" : "Resume"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PauseOverlay;
