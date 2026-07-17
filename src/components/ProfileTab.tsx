import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Settings, Medal, ShieldAlert, Check, Loader2, X, User } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import { AchievementsModal } from './AchievementsModal';
import { playClick } from '../lib/audio';
import UserProfile from './UserProfile';
import { QRCodeSVG } from 'qrcode.react';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

interface ProfileTabProps {
  user: any;
  userData: any;
  onShowSettings: () => void;
  triggerToast?: (msg: string, type: 'success' | 'warning' | 'error' | 'info') => void;
}

export function ProfileTab({ user, userData, onShowSettings, triggerToast }: ProfileTabProps) {
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
      ? `👋 Hai! Ayo mabar KoinKita bareng aku! 🚀\n\nIni game seru banget buat belajar ngatur uang biar kita makin cerdas finansial.\n\nKlik link ini buat tambah aku jadi teman di game ya: \n${shareUrl}`
      : `👋 Hi! Let's play KoinKita together! 🚀\n\nIt's a fun game to learn financial skills and get smarter with our money.\n\nClick this link to add me as a friend: \n${shareUrl}`;
    
    if (Capacitor.isNativePlatform()) {
      try {
        await Share.share({
          title: 'KoinKita',
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
        await navigator.share({ title: 'KoinKita', text: text });
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

  const userLevel = userData?.league !== undefined ? userData?.league : 0;
  const coins = userData?.totalCoins || userData?.coins || 0;

  return (
    <div className="w-full flex flex-col pt-8 pb-32 px-4 sm:px-6 relative min-h-screen">
      {/* Top Bar (Share & Settings) */}
      <div className="flex justify-end items-center gap-3 mb-6 relative z-10 w-full max-w-lg mx-auto">
        <button 
          onClick={() => { playClick(); setShowShareCard(true); }}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm text-slate-600 active:scale-95 transition-all"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <button 
          onClick={() => {
            playClick();
            onShowSettings();
          }}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm text-slate-600 active:scale-95 transition-all"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full max-w-lg mx-auto space-y-6">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="absolute top-0 w-full h-24 bg-emerald-100/50"></div>
          
          <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-md bg-white z-10 mb-4 flex items-center justify-center">
            {displayPic ? (
              <img src={displayPic} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-3xl">👤</span>
            )}
          </div>
          
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">{displayName}</h1>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
            #{userData?.tag || '0000'}
          </p>

          <button 
            onClick={() => {
              playClick();
              setShowEditProfile(true);
            }}
            className="mt-6 w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold rounded-xl transition-all active:scale-95"
          >
            {language === 'id' ? 'Edit Profil & Avatar' : 'Edit Profile & Avatar'}
          </button>
        </motion.div>

        {/* Stats Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          {/* Total EXP Box */}
          <div className="bg-amber-50 p-4 rounded-2xl flex items-center justify-between border border-amber-100">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{language === 'id' ? 'Total EXP' : 'Total EXP'}</span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {(userData?.totalXp ?? userData?.totalCoins ?? 0).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <span className="text-3xl mb-2">🏆</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{language === 'id' ? 'Level Liga' : 'League Level'}</span>
            <span className="text-xl font-black text-indigo-500 mt-1">Level {userLevel}</span>
          </div>
        </motion.div>

        {/* Achievements Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button 
            onClick={() => {
              playClick();
              setShowAchievements(true);
            }}
            className="w-full bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all group hover:border-indigo-200"
          >
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Medal className="w-6 h-6 text-indigo-500" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-slate-800 text-lg">{language === 'id' ? 'Pencapaian' : 'Achievements'}</h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                {language === 'id' ? 'Lihat daftar prestasimu' : 'View your milestone records'}
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
            userLevel={userLevel} 
          />
        )}
        {showEditProfile && (
          <div className="fixed inset-0 z-50 overflow-hidden">
             <UserProfile 
               user={user} 
               userData={userData} 
               onBack={() => setShowEditProfile(false)} 
             />
          </div>
        )}
        {showShareCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10"></div>
              
              <button 
                onClick={() => setShowShareCard(false)}
                className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col items-center mt-2 text-center">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-white mb-4 flex items-center justify-center">
                  {displayPic ? (
                    <img src={displayPic} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-10 h-10 text-slate-300" />
                  )}
                </div>
                
                <h2 className="text-xl font-black text-slate-800">{displayName}</h2>
                <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block mt-1">
                  #{userData?.tag || '0000'}
                </div>
                
                <p className="text-sm text-slate-500 mt-4 mb-6 px-2">
                  {language === 'id' ? 'Scan QR atau bagikan link untuk main bareng' : 'Scan QR or share link to play together'}
                </p>
                
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center justify-center w-40 h-40">
                  <QRCodeSVG value={`https://www.koinkita.xyz/add/${user.uid}`} size={140} />
                </div>
                
                <button 
                  onClick={handleShare}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl shadow-md transition-all flex justify-center items-center gap-2 active:scale-95"
                >
                  <Share2 className="w-5 h-5" />
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
