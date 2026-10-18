import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, Users, Check } from 'lucide-react';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useTranslation } from '../lib/LanguageContext';
import { playClick } from '../lib/audio';

interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: any;
  currentUserUid: string;
  triggerToast?: (msg: string, type: 'success' | 'error') => void;
}

export default function PlayerProfileModal({ isOpen, onClose, player, currentUserUid, triggerToast }: PlayerProfileModalProps) {
  const { language } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddFriend = async () => {
    if (!player?.id || !currentUserUid) return;
    playClick();
    setIsAdding(true);
    
    try {
      // Add friend to current user's document
      const userRef = doc(db, 'users', currentUserUid);
      await updateDoc(userRef, {
        friendIds: arrayUnion(player.id)
      });
      setIsAdded(true);
      if (triggerToast) {
        triggerToast(language === 'id' ? `Berhasil menambahkan teman!` : `Friend added successfully!`, 'success');
      }
    } catch (e) {
      console.warn('Gagal menambah teman:', e);
      if (triggerToast) {
        triggerToast(language === 'id' ? 'Gagal menambahkan teman.' : 'Failed to add friend.', 'error');
      }
    } finally {
      setIsAdding(false);
    }
  };

  if (!isOpen || !player) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative"
        >
          {/* Close Button */}
          <button 
            onClick={() => { playClick(); onClose(); }}
            className="absolute top-4 right-4 z-10 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          </div>

          {/* Profile Content */}
          <div className="px-6 pb-6 pt-0 relative flex flex-col items-center">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white rounded-2xl p-1.5 shadow-xl -mt-12 relative z-10 mb-4 rotate-3 hover:rotate-0 transition-transform">
              <div className="w-full h-full bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
                {player.profilePictureUrl || player.profilePicUrl ? (
                  <img src={player.profilePictureUrl || player.profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-10 h-10 text-slate-300" />
                )}
              </div>
            </div>

            <h2 className="text-xl font-poppins font-black text-slate-800 text-center mb-1">
              {player.username ? `@${player.username}` : (player.displayName || player.name || player.fullName || 'Pemain')}
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              #{player.tag || '0000'}
            </p>

            {/* Stats Row */}
            <div className="flex w-full gap-2 mb-6">
              <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Level</span>
                <span className="text-lg font-black text-emerald-500">{player.level || 1}</span>
              </div>
              <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Streak</span>
                <span className="text-lg font-black text-orange-500">{player.streakCount || 0}</span>
              </div>
            </div>

            {/* Add Friend Button */}
            <button 
              onClick={handleAddFriend}
              disabled={isAdding || isAdded}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                isAdded 
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-md hover:shadow-indigo-500/25 active:scale-[0.98]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5" />
                  {language === 'id' ? 'Sudah Berteman' : 'Friends'}
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  {language === 'id' ? 'Tambah Teman' : 'Add Friend'}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
