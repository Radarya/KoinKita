import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Globe, Music, VolumeX, Check, Volume2, FastForward, User } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import { auth, db } from '../firebase';
import { deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { 
  getBgmVolume, 
  setBgmVolume, 
  playClick,
  getAudioMode,
  setAudioMode,
  setGamePaused
} from '../lib/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowProfile?: () => void;
  isGameMode?: boolean;
  onExitGame?: () => void;
}

/**
 * @description Settings modal to adjust BGM state, sound volume, track selection, and system language.
 */
export function SettingsModal({ isOpen, onClose, onShowProfile, isGameMode = false, onExitGame }: SettingsModalProps) {
  const { t, language, toggleLanguage } = useTranslation();
  const [audioMode, setAudioModeState] = useState<number>(1);
  const [volume, setVolume] = useState<number>(0.5);


  // Deletion and compliance state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteFinal, setShowDeleteFinal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    playClick();
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error(language === 'id' ? 'Pengguna tidak ditemukan.' : 'User not found.');
      }

      // 1. Delete user from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await deleteDoc(userDocRef);

      // 2. Delete credentials from Firebase Authentication
      await deleteUser(user);
      
      // Close settings modal completely
      setShowDeleteFinal(false);
      onClose();
    } catch (err: any) {
      console.warn("Account deletion failed:", err);
      if (err.code === 'auth/requires-recent-login' || err.message?.includes('recent login')) {
        setDeleteError(language === 'id' 
          ? 'Demi keamanan, hapus akun memerlukan login terbaru. Silakan keluar (logout), lalu klik masuk lagi sebelum mencoba kembali.' 
          : 'For safety, deleting your account requires a recent login. Please logout, sign in again, and retry.');
      } else {
        setDeleteError(err.message || String(err));
      }
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    setAudioModeState(getAudioMode());
    setVolume(getBgmVolume());
  }, [isOpen]);

  useEffect(() => {
    if (isGameMode && isOpen) {
      setGamePaused(true);
    } else if (isGameMode && !isOpen) {
      setGamePaused(false);
    }
  }, [isGameMode, isOpen]);

  /**
   * @description Handles Audio Mode toggle explicitly
   */
  const handleToggleAudioMode = () => {
    playClick();
    const nextMode = audioMode >= 3 ? 1 : audioMode + 1;
    setAudioMode(nextMode);
    setAudioModeState(nextMode);
  };

  /**
   * @description Changes language state with visual feedback audio click.
   */
  const handleToggleLanguage = () => {
    playClick();
    toggleLanguage();
  };

  /**
   * @description Updates volume setting in real-time
   */
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setBgmVolume(newVol);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 "
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-emerald-50 px-6 py-5 flex items-center justify-between border-b border-emerald-100/50 shrink-0">
              <h2 className="font-poppins font-bold text-lg text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-emerald-500 rounded-full inline-block"></span>
                {t.settingsTitle}
              </h2>
              <button
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List options */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
              {/* Language Settings */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  {t.languageLabel || (language === 'id' ? 'Bahasa Utama' : 'System Language')}
                </span>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  <button
                    onClick={() => language !== 'id' && handleToggleLanguage()}
                    className={`py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      language === 'id'
                        ? 'bg-white shadow-md text-emerald-600 border border-slate-200/50'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span className="text-base font-black">ID</span>
                    <span>Indonesia</span>
                    {language === 'id' && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                  <button
                    onClick={() => language !== 'en' && handleToggleLanguage()}
                    className={`py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      language === 'en'
                        ? 'bg-white shadow-md text-emerald-600 border border-slate-200/50'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span className="text-base font-black">EN</span>
                    <span>English</span>
                    {language === 'en' && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                </div>
              </div>

              {/* Profile Account Section */}
              {!isGameMode && onShowProfile && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                    {language === 'id' ? 'Profil Akun' : 'Account Profile'}
                  </span>
                  <button
                    onClick={() => {
                      playClick();
                      onClose();
                      onShowProfile();
                    }}
                    className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    <User className="w-4 h-4" />
                    <span>{language === 'id' ? ' Lihat & Edit Profil' : ' View & Edit Profile'}</span>
                  </button>
                </div>
              )}

              {/* Unified 3-Mode Audio Toggle Wrapper */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  {t.bgmLabel || (language === 'id' ? 'Pengaturan Audio' : 'Audio Settings')}
                </span>
                
                <button
                  onClick={handleToggleAudioMode}
                  className={`w-full p-4 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                    audioMode === 1
                      ? 'bg-emerald-50/40 border-emerald-100 text-emerald-800'
                      : audioMode === 2 
                        ? 'bg-amber-50/40 border-amber-100 text-amber-800'
                        : 'bg-slate-50/50 border-slate-200/50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl transition-all ${
                      audioMode === 1 ? 'bg-emerald-100 text-emerald-600' : audioMode === 2 ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {audioMode === 1 ? <Music className="w-5 h-5 text-emerald-600" /> : audioMode === 2 ? <Volume2 className="w-5 h-5 text-amber-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">
                        {audioMode === 1 ? (language === 'id' ? 'Musik & Sound' : 'Music & Sound') : audioMode === 2 ? (language === 'id' ? 'Sound Saja' : 'SFX Only') : (language === 'id' ? 'Senyap' : 'Muted')}
                      </h4>
                      <p className={`text-xs mt-0.5 max-w-[160px] leading-tight ${audioMode === 3 ? 'text-slate-400' : 'text-slate-500'}`}>
                        {audioMode === 1 ? (language === 'id' ? 'Musik + Efek dimainkan' : 'BGM & SFX active') : audioMode === 2 ? (language === 'id' ? 'Hanya efek yang dimainkan' : 'Only SFX active') : (language === 'id' ? 'Audio dinonaktifkan' : 'All audio muted')}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Real-time Volume Adjustment slider */}
                {audioMode !== 3 && (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-550 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4 text-slate-400" />
                        {language === 'id' ? 'Volume Suara' : 'Audio Volume'}
                      </span>
                      <span className="font-mono">{Math.round(volume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 outline-none"
                    />
                  </div>
                )}


                {/* Account Deletion Feature (Danger Zone) */}
                {!isGameMode && (
                  <div className="space-y-2 pt-6 border-t border-slate-100 mt-6 select-none">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest block">
                      {language === 'id' ? 'Kepatuhan & Privasi' : 'Compliance & Privacy'}
                    </span>
                    <button
                      id="btn-delete-account-init"
                      onClick={() => {
                        playClick();
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl flex items-center justify-center gap-2 border border-red-200 cursor-pointer transition-all hover:scale-[1.01] text-xs"
                    >
                      <span>🗑️ {language === 'id' ? 'Hapus Akun / Delete Account' : 'Hapus Akun / Delete Account'}</span>
                    </button>
                  </div>
                )}
                
                {/* Exit Game Button */}
                {isGameMode && onExitGame && (
                   <div className="space-y-2 pt-6 border-t border-slate-100 mt-6 select-none">
                     <button
                       onClick={() => {
                         playClick();
                         onExitGame();
                         onClose();
                       }}
                       className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl flex items-center justify-center gap-2 border border-slate-300 cursor-pointer transition-all hover:scale-[1.01] text-xs"
                     >
                       <span>Keluar Game / Exit Game</span>
                     </button>
                   </div>
                )}

              </div>
            </div>

            {/* First Confirmation Popup */}
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 "
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 15 }}
                    className="bg-white rounded-[2rem] w-full max-w-sm p-6 shadow-2xl border border-red-100 overflow-hidden relative"
                  >
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl bg-red-50 text-red-600 border border-red-200">
                        ⚠️
                      </div>
                      <h3 className="font-poppins font-black text-lg text-slate-800 leading-tight">
                        {language === 'id' ? 'Apakah Kamu Yakin?' : 'Are You Sure?'}
                      </h3>
                      <p className="text-slate-500 text-xs font-bold leading-relaxed px-1">
                        {language === 'id' 
                          ? 'Apakah kamu yakin ingin menghapus akun dan semua data koin secara permanen? Tindakan ini tidak dapat dibatalkan.' 
                          : 'Are you sure you want to permanently delete your account and all coin data? This action cannot be undone.'}
                      </p>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => {
                            playClick();
                            setShowDeleteConfirm(false);
                          }}
                          className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-all cursor-pointer border border-slate-200"
                        >
                          {language === 'id' ? 'Batal' : 'Cancel'}
                        </button>
                        <button
                          onClick={() => {
                            playClick();
                            setShowDeleteConfirm(false);
                            setShowDeleteFinal(true);
                          }}
                          className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-red-500/15 cursor-pointer"
                        >
                          {language === 'id' ? 'Ya, Lanjutkan' : 'Yes, Continue'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
 
            {/* Second Confirmation Popup */}
            <AnimatePresence>
              {showDeleteFinal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 "
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 15 }}
                    className="bg-white rounded-[2rem] w-full max-w-sm p-6 shadow-2xl border border-red-200 overflow-hidden relative"
                  >
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-xl text-red-600 border border-red-300">
                        🚨
                      </div>
                      <h3 className="font-poppins font-black text-lg text-red-600 leading-tight">
                        {language === 'id' ? 'KONFIRMASI TERAKHIR' : 'FINAL CONFIRMATION'}
                      </h3>
                      <p className="text-slate-600 text-xs font-extrabold leading-relaxed px-1">
                        {language === 'id' 
                          ? 'Perhatian: Semua data koin, pencapaian level, dan riwayat kamu pada KoinKita akan dihapus permanen selamanya dari server.' 
                          : 'Caution: All total coins, level progress, and historic records on KoinKita will be permanently erased forever from our server.'}
                      </p>

                      {deleteError && (
                        <div className="p-3 bg-red-50 text-red-700 text-[11px] font-bold rounded-xl border border-red-200 text-left leading-normal">
                          {deleteError}
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-2 pt-2">
                        <button
                          disabled={isDeleting}
                          onClick={handleDeleteAccount}
                          className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-black rounded-xl text-xs transition-all shadow-lg shadow-red-650/20 cursor-pointer flex items-center justify-center gap-2"
                        >
                          {isDeleting ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              <span>{language === 'id' ? 'Menghapus...' : 'Deleting...'}</span>
                            </>
                          ) : (
                            <span>{language === 'id' ? 'YA, HAPUS AKUN SAYA SEKARANG' : 'YES, DELETE MY REPOSITORY'}</span>
                          )}
                        </button>
                        <button
                          disabled={isDeleting}
                          onClick={() => {
                            playClick();
                            setShowDeleteFinal(false);
                            setDeleteError(null);
                          }}
                          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-605 font-bold rounded-xl text-xs transition-all cursor-pointer border border-slate-200"
                        >
                          {language === 'id' ? 'Batal & Kembali' : 'Abort & Keep Account'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-100 shrink-0">
              <button
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md cursor-pointer transition-colors text-sm w-full sm:w-auto text-center"
              >
                {t.close || (language === 'id' ? 'Tutup' : 'Close')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
