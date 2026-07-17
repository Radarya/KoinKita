import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { setGamePaused } from '../lib/audio';
import { useTranslation } from '../lib/LanguageContext';

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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md p-6"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-emerald-100"
          >
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
              <div className="w-6 h-6 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            <h2 className="text-2xl font-poppins font-black text-slate-800 mb-3">
              {language === 'id' ? "Permainan Dijeda" : "Game Paused"}
            </h2>
            
            <p className="text-slate-500 font-medium mb-8">
              {language === 'id' 
                ? "Waktu permainan dihentikan sementara karena aplikasi diminimalkan." 
                : "Game time is paused because the app was minimized."}
            </p>
            
            <button
              onClick={() => setGamePaused(false)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
            >
              <Play className="w-5 h-5 fill-current" />
              {language === 'id' ? "Lanjutkan" : "Resume"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PauseOverlay;
