import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Settings, Medal, X, ShieldCheck, Mail } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import { AchievementsModal } from './AchievementsModal';
import { playClick } from '../lib/audio';
const UserProfile = lazy(() => import('./UserProfile'));
import { QRCodeSVG } from 'qrcode.react';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import CikoMascot from './CikoMascot';
import { getLeagueInfo } from '../lib/leagueUtils';

interface ProfileTabProps {
  user: any;
  userData: any;
  onShowSettings: () => void;
  onLinkGoogle?: () => void;
  onOpenAuth?: () => void;
  triggerToast?: (msg: string, type: 'success' | 'warning' | 'error' | 'info') => void;
}

export function ProfileTab({ user, userData, onShowSettings, onLinkGoogle, onOpenAuth, triggerToast }: ProfileTabProps) {
  const { language } = useTranslation();
  const [showAchievements, setShowAchievements] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  useEffect(() => {
    const handleBack = (e: Event) => {
      if (showAchievements || showEditProfile || showShareCard) {
        e.preventDefault();
        setShowAchievements(false);
        setShowEditProfile(false);
        setShowShareCard(false);
      }
    };
    window.addEventListener('hardwareBackButton', handleBack);
    return () => window.removeEventListener('hardwareBackButton', handleBack);
  }, [showAchievements, showEditProfile, showShareCard]);

  const handleShare = async () => {
    playClick();
    const shareUrl = `https://www.koinkita.xyz/add/${user.uid}`;
    const text = language === 'id'
      ? `Hai! Ayo main CIKO bareng aku.\n\nIni edugame seru buat belajar mengatur uang agar makin cerdas finansial.\n\nKlik tautan ini untuk menambah aku jadi teman:\n${shareUrl}`
      : `Hi! Let's play CIKO together.\n\nIt's a fun game to learn financial skills and get smarter with our money.\n\nClick this link to add me as a friend:\n${shareUrl}`;

    if (Capacitor.isNativePlatform()) {
      try {
        await Share.share({
          title: 'CIKO',
          text: text,
          dialogTitle: language === 'id' ? 'Bagikan tautan pertemanan' : 'Share friend link'
        });
      } catch (shareErr) {
        console.warn("Capacitor Share failed, falling back to clipboard:", shareErr);
        navigator.clipboard.writeText(text);
        if (triggerToast) triggerToast(language === 'id' ? 'Tautan disalin ke papan klip!' : 'Link copied to clipboard!', 'success');
      }
    } else if (navigator.share) {
      try {
        await navigator.share({ title: 'CIKO', text: text });
      } catch (e) { console.warn(e); }
    } else {
      navigator.clipboard.writeText(text);
      if (triggerToast) triggerToast(language === 'id' ? 'Tautan disalin ke papan klip!' : 'Link copied to clipboard!', 'success');
    }
  };

  const displayName = userData?.fullName || userData?.name || user?.displayName || 'Pemain';
  const explicitlyRemoved = userData?.profilePictureUrl === '' && userData?.profilePicUrl === '';
  const fallbackRemoved = userData?.profilePicUrl === '' && !userData?.profilePictureUrl;

  let displayPic = '';
  if (userData?.profilePictureUrl) {
    displayPic = userData.profilePictureUrl;
  } else if (userData?.profilePicUrl) {
    displayPic = userData.profilePicUrl;
  } else if (explicitlyRemoved || fallbackRemoved) {
    displayPic = '';
  } else {
    displayPic = user?.photoURL || '';
  }

  const permanentXp = Math.max(userData?.totalXp || 0, userData?.totalCoins || userData?.coins || 0);
  const calculatedAccountLevel =
    permanentXp >= 50000 ? 5 :
    permanentXp >= 30000 ? 4 :
    permanentXp >= 15000 ? 3 :
    permanentXp >= 5000 ? 2 :
    permanentXp >= 1000 ? 1 : 0;
  const accountLevel = Math.max(userData?.level || 0, calculatedAccountLevel);
  const leagueTier = userData?.league !== undefined ? userData.league : 0;
  const leagueInfo = getLeagueInfo(leagueTier);

  return (
    <div className="w-full flex flex-col pt-6 pb-32 px-4 sm:px-6 relative min-h-screen bg-[#FAFAFA] text-[#0D1117]">
      {/* Top Bar (Share & Settings) */}
      <div className="flex justify-end items-center gap-2.5 mb-5 relative z-10 w-full max-w-lg mx-auto">
        <button
          onClick={() => { playClick(); setShowShareCard(true); }}
          aria-label={language === 'id' ? 'Bagikan Profil' : 'Share Profile'}
          className="p-3 bg-white hover:bg-[#F4F5F7] rounded-full text-[#0D1117] transition-colors cursor-pointer"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            playClick();
            onShowSettings();
          }}
          aria-label={language === 'id' ? 'Pengaturan' : 'Settings'}
          className="p-3 bg-white hover:bg-[#F4F5F7] rounded-full text-[#0D1117] transition-colors cursor-pointer"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full max-w-lg mx-auto space-y-4">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-7 flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="w-24 h-24 rounded-full overflow-hidden bg-[#F4F5F7] mb-4 flex items-center justify-center">
            {displayPic ? (
              <img src={displayPic} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <CikoMascot size={72} pose="hero" animated={false} />
            )}
          </div>

          <h1 className="text-2xl font-poppins font-black text-[#0D1117] tracking-tight">{displayName}</h1>
          <p className="text-xs font-bold text-slate-600 mt-1.5 bg-[#F4F5F7] px-3.5 py-1 rounded-full tabular-nums">
            #{userData?.tag || '0000'}
          </p>

          <button
            onClick={() => {
              playClick();
              setShowEditProfile(true);
            }}
            className="mt-6 w-full py-3.5 px-6 bg-[#0D1117] hover:bg-slate-800 text-white font-bold text-sm rounded-full transition-colors cursor-pointer"
          >
            {language === 'id' ? 'Edit Profil & Avatar' : 'Edit Profile & Avatar'}
          </button>
        </motion.div>

        {/* Guest Account Upgrade Prompt Card */}
        {user?.isAnonymous && (onLinkGoogle || onOpenAuth) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className="bg-[#EEFBF4] rounded-3xl p-6 space-y-4"
          >
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#059669]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{language === 'id' ? 'Akun Tamu di Perangkat' : 'Device Guest Account'}</span>
              </div>
              <h2 className="font-poppins font-black text-lg text-[#0D1117]">
                {language === 'id' ? 'Tautkan Akun agar Progres Aman' : 'Link Account to Keep Progress'}
              </h2>
              <p className="text-xs text-[#064E3B] font-medium leading-relaxed">
                {language === 'id'
                  ? 'Data Tamu akan terhapus jika aplikasi dicopot atau tidak aktif 30 hari. Hubungkan ke Google atau Email kapan saja tanpa kehilangan koin maupun progres Keping Materi.'
                  : 'Guest data is removed if the app is uninstalled or inactive for 30 days. Link Google or Email anytime without losing coins or progress.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5">
              {onLinkGoogle && (
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onLinkGoogle();
                  }}
                  className="flex-1 py-3 px-4 rounded-full bg-[#059669] hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  {language === 'id' ? 'Tautkan Google' : 'Link Google'}
                </button>
              )}
              {onOpenAuth && (
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onOpenAuth();
                  }}
                  className="flex-1 py-3 px-4 rounded-full bg-white hover:bg-slate-100 text-[#0D1117] text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{language === 'id' ? 'Buat / Masuk Email' : 'Email Sign Up / In'}</span>
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-white p-6 rounded-3xl flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-500">{language === 'id' ? 'Total EXP' : 'Total EXP'}</span>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-poppins font-black text-[#0D1117] tabular-nums">
                {permanentXp.toLocaleString('id-ID')}
              </div>
              <p className="text-xs font-bold text-slate-500 mt-1 tabular-nums">
                {language === 'id' ? `Level Akun ${accountLevel}` : `Account Level ${accountLevel}`}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-500">{language === 'id' ? 'Kasta Liga' : 'League Tier'}</span>
            <div className="flex items-center justify-between mt-2 gap-2">
              <div className="min-w-0">
                <div className="text-lg sm:text-xl font-poppins font-black text-emerald-600 truncate">
                  {language === 'id' ? leagueInfo.nameId : leagueInfo.nameEn}
                </div>
                <p className="text-xs font-bold text-slate-500 mt-0.5 tabular-nums">
                  {language === 'id' ? `Liga ${leagueTier}` : `League ${leagueTier}`}
                </p>
              </div>
              <CikoMascot size={36} pose="wealth" animated={false} />
            </div>
          </div>
        </motion.div>

        {/* Achievements Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
        >
          <button
            onClick={() => {
              playClick();
              setShowAchievements(true);
            }}
            className="w-full bg-white hover:bg-[#F4F5F7] rounded-3xl p-5 flex items-center gap-4 transition-colors group cursor-pointer"
          >
            <div className="w-12 h-12 bg-[#F4F5F7] group-hover:bg-white rounded-2xl flex items-center justify-center transition-colors shrink-0">
              <Medal className="w-6 h-6 text-[#0D1117]" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-poppins font-black text-[#0D1117] text-base">{language === 'id' ? 'Pencapaian' : 'Achievements'}</h3>
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                {language === 'id' ? 'Lihat daftar prestasimu bersama Ciko' : 'View your milestone records with Ciko'}
              </p>
            </div>
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showAchievements && (
          <AchievementsModal
            onClose={() => setShowAchievements(false)}
            userData={userData}
            userLevel={Math.max(accountLevel, leagueTier)}
          />
        )}
        {showEditProfile && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <Suspense fallback={null}>
              <UserProfile
                user={user}
                userData={userData}
                onBack={() => setShowEditProfile(false)}
              />
            </Suspense>
          </div>
        )}
        {showShareCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1117]/80">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl w-full max-w-sm p-6 relative overflow-hidden"
            >
              <button
                onClick={() => setShowShareCard(false)}
                className="absolute top-4 right-4 p-2 bg-[#F4F5F7] hover:bg-slate-200 rounded-full transition-colors z-10 text-[#0D1117] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center mt-2 text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-[#F4F5F7] mb-3 flex items-center justify-center">
                  {displayPic ? (
                    <img src={displayPic} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <CikoMascot size={60} pose="hero" animated={false} />
                  )}
                </div>

                <h2 className="text-xl font-poppins font-black text-[#0D1117]">{displayName}</h2>
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mt-1.5 tabular-nums">
                  #{userData?.tag || '0000'}
                </div>

                <p className="text-sm text-slate-600 mt-4 mb-6 px-2">
                  {language === 'id' ? 'Pindai QR atau bagikan tautan untuk main bareng' : 'Scan QR or share link to play together'}
                </p>

                <div className="bg-[#F4F5F7] p-4 rounded-2xl mb-6 flex items-center justify-center w-44 h-44">
                  <QRCodeSVG value={`https://www.koinkita.xyz/add/${user.uid}`} size={144} />
                </div>

                <button
                  onClick={handleShare}
                  className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full transition-colors flex justify-center items-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  {language === 'id' ? 'Bagikan Profil' : 'Share Profile'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
