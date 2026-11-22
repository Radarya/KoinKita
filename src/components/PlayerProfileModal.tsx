import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, Check } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useTranslation } from '../lib/LanguageContext';
import { playClick } from '../lib/audio';
import CikoMascot from './CikoMascot';

interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: any;
  currentUserUid: string;
  currentUserName?: string;
  currentUserFriends?: string[];
  triggerToast?: (msg: string, type: 'success' | 'error') => void;
}

export default function PlayerProfileModal({ isOpen, onClose, player, currentUserUid, currentUserName, currentUserFriends = [], triggerToast }: PlayerProfileModalProps) {
  const { language } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    setRequestSent(false);
  }, [player?.id, isOpen]);

  const isSelf = !!player?.id && player.id === currentUserUid;
  const isAlreadyFriend = !!player?.id && currentUserFriends.includes(player.id);

  const handleAddFriend = async () => {
    if (!player?.id || !currentUserUid || isSelf || isAlreadyFriend || requestSent) return;
    playClick();
    setIsAdding(true);
    
    try {
      await addDoc(collection(db, 'inbox'), {
        userId: player.id,
        type: 'friend_request',
        fromUserId: currentUserUid,
        fromUserName: currentUserName || 'Pemain',
        status: 'unread',
        createdAt: Date.now()
      });
      setRequestSent(true);
      if (triggerToast) {
        triggerToast(language === 'id' ? 'Permintaan pertemanan terkirim!' : 'Friend request sent!', 'success');
      }
    } catch (e) {
      console.warn('Gagal mengirim permintaan teman:', e);
      if (triggerToast) {
        triggerToast(language === 'id' ? 'Gagal mengirim permintaan teman.' : 'Failed to send friend request.', 'error');
      }
    } finally {
      setIsAdding(false);
    }
  };

  if (!isOpen || !player) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D1117]/80">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-sm overflow-hidden relative"
        >
          {/* Close Button */}
          <button 
            onClick={() => { playClick(); onClose(); }}
            className="absolute top-4 right-4 z-10 p-2 bg-white/15 hover:bg-white/25 text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Banner */}
          <div className="h-28 bg-[#0D1117] relative" />

          {/* Profile Content */}
          <div className="px-6 pb-6 pt-0 relative flex flex-col items-center">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white rounded-full p-1.5 -mt-12 relative z-10 mb-3">
              <div className="w-full h-full bg-[#F4F5F7] rounded-full overflow-hidden flex items-center justify-center">
                {player.profilePictureUrl || player.profilePicUrl ? (
                  <img src={player.profilePictureUrl || player.profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <CikoMascot size={64} pose="hero" animated={false} />
                )}
              </div>
            </div>

            <h2 className="text-xl font-poppins font-black text-[#0D1117] text-center mb-1">
              {player.username ? `@${player.username}` : (player.displayName || player.name || player.fullName || 'Pemain')}
            </h2>
            <p className="text-xs font-bold text-slate-500 mb-6 tabular-nums">
              #{player.tag || '0000'}
            </p>

            {/* Stats Row */}
            <div className="flex w-full gap-3 mb-6">
              <div className="flex-1 bg-[#F4F5F7] rounded-2xl p-3.5 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-slate-500 mb-1">Level</span>
                <span className="text-lg font-poppins font-black text-emerald-600 tabular-nums">{player.level || 1}</span>
              </div>
              <div className="flex-1 bg-[#F4F5F7] rounded-2xl p-3.5 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-slate-500 mb-1">Streak</span>
                <span className="text-lg font-poppins font-black text-[#0D1117] tabular-nums">{player.streakCount || 0}</span>
              </div>
            </div>

            {/* Add Friend Button */}
            {!isSelf && (
              <button 
                onClick={handleAddFriend}
                disabled={isAdding || isAlreadyFriend || requestSent}
                className={`w-full py-3.5 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                  isAlreadyFriend || requestSent
                    ? 'bg-emerald-50 text-emerald-700 cursor-default'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                }`}
              >
                {isAlreadyFriend ? (
                  <>
                    <Check className="w-4 h-4" />
                    {language === 'id' ? 'Sudah Berteman' : 'Friends'}
                  </>
                ) : requestSent ? (
                  <>
                    <Check className="w-4 h-4" />
                    {language === 'id' ? 'Permintaan Terkirim' : 'Request Sent'}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    {language === 'id' ? 'Tambah Teman' : 'Add Friend'}
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
