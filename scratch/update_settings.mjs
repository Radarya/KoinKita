import fs from 'fs';
import path from 'path';

const content = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Globe, Music, VolumeX, Check, Volume2, User, LogOut, FileText, Trash2, AlertTriangle, ChevronRight, Settings } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import { auth, db } from '../firebase';
import { deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { updateBgmStateFromMode, setBgmVolume, getBgmVolume } from '../lib/audio';
import { vibrateLight } from '../lib/haptics';
import { 
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
  /** Called when the user wants to switch to a different Google account */
  onSwitchGoogle?: () => void;
  onShowTerms?: () => void;
  onLogout?: () => void;
}

/**
 * @description Settings full page view to adjust BGM state, sound volume, language, and account.
 */
export function SettingsModal({ isOpen, onClose, onShowProfile, isGameMode = false, onExitGame, onSwitchGoogle, onShowTerms, onLogout }: SettingsModalProps) {
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
      
      // Close settings completely
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

  const handleToggleAudioMode = () => {
    playClick();
    vibrateLight();
    const nextMode = audioMode >= 3 ? 1 : audioMode + 1;
    setAudioMode(nextMode);
    setAudioModeState(nextMode);
  };

  const handleToggleLanguage = () => {
    playClick();
    toggleLanguage();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setBgmVolume(newVol);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0.5 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 bg-slate-50 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-white px-5 pt-8 pb-4 flex items-center gap-4 shadow-sm border-b border-slate-100 relative z-10 shrink-0">
             <button
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded-full transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="font-poppins font-bold text-xl text-slate-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-500" />
                {t.settingsTitle || (language === 'id' ? 'Pengaturan' : 'Settings')}
              </h2>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 pb-12">
            
            {/* Account Settings */}
            {!isGameMode && (onShowProfile || onLogout) && (
              <section className="space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">
                  {language === 'id' ? 'Akun Saya' : 'My Account'}
                </h3>
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  
                  {onShowProfile && (
                    <button
                      onClick={() => {
                        playClick();
                        onClose();
                        onShowProfile();
                      }}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{language === 'id' ? 'Profil Akun' : 'Account Profile'}</p>
                          <p className="text-xs text-slate-500">{language === 'id' ? 'Lihat dan edit informasi' : 'View and edit information'}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </button>
                  )}

                  {onSwitchGoogle && auth.currentUser && !auth.currentUser.isAnonymous && auth.currentUser.providerData.some(p => p.providerId === 'google.com') && (
                    <button
                      onClick={() => {
                        playClick();
                        onClose();
                        onSwitchGoogle();
                      }}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.709 0 3.277.604 4.5 1.625l2.437-2.437C17.312 1.696 14.933 1 12.24 1 6.58 1 2 5.58 2 11.24s4.58 10.24 10.24 10.24c5.795 0 10.24-4.11 10.24-10.24 0-.685-.08-1.355-.24-1.955H12.24z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{language === 'id' ? 'Ganti Akun Google' : 'Switch Google Account'}</p>
                          <p className="text-xs text-slate-500">{language === 'id' ? 'Masuk dengan Google lain' : 'Sign in with another Google'}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </button>
                  )}

                  {onLogout && (
                    <button
                      onClick={() => {
                        playClick();
                        onClose();
                        onLogout();
                      }}
                      className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-500 group-hover:bg-red-100 group-hover:text-red-600 flex items-center justify-center transition-colors">
                          <LogOut className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 group-hover:text-red-600 transition-colors">{language === 'id' ? 'Keluar' : 'Log Out'}</p>
                          <p className="text-xs text-slate-500 group-hover:text-red-400 transition-colors">{language === 'id' ? 'Akhiri sesi saat ini' : 'End current session'}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-red-300 transition-colors" />
                    </button>
                  )}

                </div>
              </section>
            )}

            {/* Language Settings */}
            <section className="space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">
                {language === 'id' ? 'Bahasa & Lokalisasi' : 'Language & Localization'}
              </h3>
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => language !== 'id' && handleToggleLanguage()}
                    className={\`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer \${
                      language === 'id'
                        ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-700 shadow-sm'
                        : 'bg-slate-50 border-2 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                    }\`}
                  >
                    <span className="text-xl font-black">ID</span>
                    <span className="text-sm font-bold">Indonesia</span>
                    {language === 'id' && <Check className="w-5 h-5 text-emerald-600 absolute top-3 right-3" />}
                  </button>
                  <button
                    onClick={() => language !== 'en' && handleToggleLanguage()}
                    className={\`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer relative \${
                      language === 'en'
                        ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-700 shadow-sm'
                        : 'bg-slate-50 border-2 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                    }\`}
                  >
                    <span className="text-xl font-black">EN</span>
                    <span className="text-sm font-bold">English</span>
                    {language === 'en' && <Check className="w-5 h-5 text-emerald-600 absolute top-3 right-3" />}
                  </button>
                </div>
              </div>
            </section>

            {/* Audio Settings */}
            <section className="space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">
                {language === 'id' ? 'Pengaturan Audio' : 'Audio Settings'}
              </h3>
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                  onClick={handleToggleAudioMode}
                  className={\`w-full p-5 flex items-center justify-between text-left transition-all cursor-pointer border-b border-slate-50 \${
                    audioMode === 1
                      ? 'bg-emerald-50/50 hover:bg-emerald-50'
                      : audioMode === 2 
                        ? 'bg-amber-50/50 hover:bg-amber-50'
                        : 'bg-slate-50/50 hover:bg-slate-50'
                  }\`}
                >
                  <div className="flex items-center gap-4">
                    <div className={\`w-12 h-12 rounded-2xl flex items-center justify-center transition-all \${
                      audioMode === 1 ? 'bg-emerald-100 text-emerald-600 shadow-inner' : audioMode === 2 ? 'bg-amber-100 text-amber-600 shadow-inner' : 'bg-slate-200 text-slate-500 shadow-inner'
                    }\`}>
                      {audioMode === 1 ? <Music className="w-6 h-6" /> : audioMode === 2 ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className={\`font-bold text-base \${audioMode === 1 ? 'text-emerald-700' : audioMode === 2 ? 'text-amber-700' : 'text-slate-600'}\`}>
                        {audioMode === 1 ? (language === 'id' ? 'Musik & Getar' : 'Music & Haptics') : audioMode === 2 ? (language === 'id' ? 'Sound & Getar' : 'SFX & Haptics') : (language === 'id' ? 'Hening' : 'Muted')}
                      </h4>
                      <p className={\`text-xs mt-1 leading-tight \${audioMode === 3 ? 'text-slate-400' : 'text-slate-500'}\`}>
                        {audioMode === 1 ? (language === 'id' ? 'Semua audio & efek nyala' : 'All BGM, SFX & Haptics on') : audioMode === 2 ? (language === 'id' ? 'Musik dimatikan, efek nyala' : 'Only SFX & Haptics active') : (language === 'id' ? 'Audio & getaran mati total' : 'Audio & haptics muted completely')}
                      </p>
                    </div>
                  </div>
                </button>

                {audioMode !== 3 && (
                  <div className="p-5 space-y-4 bg-white">
                    <div className="flex items-center justify-between text-sm font-bold text-slate-700">
                      <span className="flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-slate-400" />
                        {language === 'id' ? 'Volume Suara' : 'Volume Level'}
                      </span>
                      <span className="font-mono text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">{Math.round(volume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 outline-none hover:accent-emerald-400 transition-all"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Others / Legal */}
            {!isGameMode && onShowTerms && (
              <section className="space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">
                  {language === 'id' ? 'Lainnya' : 'Others'}
                </h3>
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <button
                    onClick={() => {
                      playClick();
                      onClose();
                      onShowTerms();
                    }}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{language === 'id' ? 'Aturan & Panduan' : 'Rules & Guidelines'}</p>
                        <p className="text-xs text-slate-500">{language === 'id' ? 'Kebijakan privasi & info' : 'Privacy policy & info'}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </button>
                </div>
              </section>
            )}

            {/* Danger Zone */}
            {!isGameMode && (
              <section className="space-y-3 pt-4">
                <button
                  id="btn-delete-account-init"
                  onClick={() => {
                    playClick();
                    vibrateLight();
                    setShowDeleteConfirm(true);
                  }}
                  className="w-full py-4 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl flex items-center justify-center gap-2 border border-red-200 border-dashed cursor-pointer transition-all hover:scale-[1.01] text-sm group shadow-sm"
                >
                  <Trash2 className="w-5 h-5 group-hover:animate-pulse" />
                  <span>{language === 'id' ? 'Hapus Akun Permanen' : 'Permanently Delete Account'}</span>
                </button>
              </section>
            )}

            {/* Exit Game Mode */}
            {isGameMode && onExitGame && (
              <section className="space-y-3 pt-4">
                <button
                  onClick={() => {
                    playClick();
                    vibrateLight();
                    onExitGame();
                    onClose();
                  }}
                  className="w-full py-4 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl flex items-center justify-center gap-2 border border-red-200 cursor-pointer transition-all hover:scale-[1.01] text-sm shadow-sm"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{language === 'id' ? 'Keluar Game' : 'Exit Game'}</span>
                </button>
              </section>
            )}

          </div>

          {/* First Confirmation Popup */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 15 }}
                  className="bg-white rounded-[2rem] w-full max-w-sm p-6 shadow-2xl border border-red-100 overflow-hidden relative"
                >
                  <div className="text-center space-y-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto text-2xl bg-red-50 text-red-600 border border-red-200">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                    <h3 className="font-poppins font-black text-lg text-slate-800 leading-tight">
                      {language === 'id' ? 'Apakah Kamu Yakin?' : 'Are You Sure?'}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed px-1">
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
                        className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all cursor-pointer border border-slate-200"
                      >
                        {language === 'id' ? 'Batal' : 'Cancel'}
                      </button>
                      <button
                        onClick={() => {
                          playClick();
                          setShowDeleteConfirm(false);
                          setShowDeleteFinal(true);
                        }}
                        className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-xl transition-all shadow-md shadow-red-500/20 cursor-pointer"
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
                className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 15 }}
                  className="bg-white rounded-[2rem] w-full max-w-sm p-6 shadow-2xl border border-red-200 overflow-hidden relative"
                >
                  <div className="text-center space-y-4">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 border border-red-300">
                      <ShieldAlert className="w-7 h-7" />
                    </div>
                    <h3 className="font-poppins font-black text-lg text-red-600 leading-tight">
                      {language === 'id' ? 'KONFIRMASI TERAKHIR' : 'FINAL CONFIRMATION'}
                    </h3>
                    <p className="text-slate-600 text-sm font-bold leading-relaxed px-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {language === 'id' 
                        ? 'Perhatian: Semua data koin, pencapaian level, dan riwayat kamu pada KoinKita akan dihapus permanen selamanya dari server.' 
                        : 'Caution: All total coins, level progress, and historic records on KoinKita will be permanently erased forever from our server.'}
                    </p>

                    {deleteError && (
                      <div className="p-3 bg-red-50 text-red-700 text-[11px] font-bold rounded-xl border border-red-200 text-left leading-normal">
                        {deleteError}
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-3 pt-2">
                      <button
                        disabled={isDeleting}
                        onClick={handleDeleteAccount}
                        className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-black rounded-xl transition-all shadow-lg shadow-red-600/30 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isDeleting ? (
                          <>
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>{language === 'id' ? 'Menghapus...' : 'Deleting...'}</span>
                          </>
                        ) : (
                          <span>{language === 'id' ? 'HAPUS AKUN SAYA SEKARANG' : 'DELETE MY ACCOUNT'}</span>
                        )}
                      </button>
                      <button
                        disabled={isDeleting}
                        onClick={() => {
                          playClick();
                          setShowDeleteFinal(false);
                          setDeleteError(null);
                        }}
                        className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all cursor-pointer border border-slate-200"
                      >
                        {language === 'id' ? 'Batal & Kembali' : 'Abort & Keep Account'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
`;

fs.writeFileSync(path.join(process.cwd(), 'src', 'components', 'SettingsModal.tsx'), content);
console.log('SettingsModal.tsx updated to full page.');
