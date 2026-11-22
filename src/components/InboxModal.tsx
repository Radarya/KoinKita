import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Heart, Mail, Check, Inbox as InboxIcon } from 'lucide-react';
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc, arrayUnion, getDoc, increment } from 'firebase/firestore';

import { db } from '../firebase';
import { useTranslation } from '../lib/LanguageContext';
import { playClick } from '../lib/audio';

interface InboxModalProps {
  onClose: () => void;
  user: any;
  userData: any;
  triggerToast: (msg: string, type: 'success' | 'warning' | 'error' | 'info') => void;
}

export default function InboxModal({ onClose, user, userData, triggerToast }: InboxModalProps) {
  const { language } = useTranslation();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    const inboxRef = collection(db, 'inbox');
    const q = query(inboxRef, where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      msgs.sort((a: any, b: any) => b.createdAt - a.createdAt);
      setMessages(msgs);
      setLoading(false);
    }, (error) => {
      console.warn('Inbox snapshot error:', error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [user]);

  const handleClaimLife = async (msg: any) => {
    playClick();
    try {
      const userRef = doc(db, 'users', user.uid);
      // Read fresh value from Firestore to decide whether to add life or convert to coins
      const freshSnap = await getDoc(userRef);
      const freshLives = freshSnap.exists() ? (freshSnap.data().lives ?? 5) : 5;

      if (freshLives >= 5) {
        // Lives are full — convert to +15 coins (atomic)
        await updateDoc(userRef, { totalCoins: increment(15), coins: increment(15) });
        triggerToast(language === 'id' ? 'Nyawa penuh! Dikonversi jadi +15 Koin!' : 'Lives full! Converted to +15 Coins!', 'success');
      } else {
        // Add 1 life atomically
        await updateDoc(userRef, { lives: increment(1) });
        triggerToast(language === 'id' ? 'Berhasil mengklaim 1 Nyawa!' : 'Successfully claimed 1 Life!', 'success');
      }

      await deleteDoc(doc(db, 'inbox', msg.id));
    } catch (e) {
      console.warn(e);
      triggerToast('Error claiming', 'error');
    }
  };

  const handleAcceptFriend = async (msg: any) => {
    playClick();
    try {
      const userRef = doc(db, 'users', user.uid);
      const friendRef = doc(db, 'users', msg.fromUserId);

      await updateDoc(userRef, { friends: arrayUnion(msg.fromUserId) });
      await updateDoc(friendRef, { friends: arrayUnion(user.uid) });

      // If this request came from a referral link, award the bonus!
      if (msg.isReferral) {
        // Read fresh values to check eligibility
        const [mySnap, friendSnap] = await Promise.all([getDoc(userRef), getDoc(friendRef)]);
        const myCoins = mySnap.exists() ? (mySnap.data().totalCoins || mySnap.data().coins || 0) : 0;
        const friendCoins = friendSnap.exists() ? (friendSnap.data().totalCoins || friendSnap.data().coins || 0) : 0;

        if (myCoins <= 50 || friendCoins <= 50) {
          // Use atomic increment — safe from race conditions
          await updateDoc(userRef, { totalCoins: increment(100), coins: increment(100) });
          await updateDoc(friendRef, { totalCoins: increment(100), coins: increment(100) });
          triggerToast(language === 'id' ? 'Bonus afiliasi! Masing-masing mendapat +100 Koin!' : 'Affiliate bonus! Each gets +100 Coins!', 'success');
        }
      }

      await deleteDoc(doc(db, 'inbox', msg.id));
      triggerToast(language === 'id' ? 'Teman ditambahkan!' : 'Friend added!', 'success');
    } catch (e) {
      console.warn(e);
      triggerToast('Error accepting friend', 'error');
    }
  };

  const handleDecline = async (msgId: string) => {
    playClick();
    try {
      await deleteDoc(doc(db, 'inbox', msgId));
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1117]/80">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-6 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#F4F5F7] rounded-2xl">
              <InboxIcon className="w-5 h-5 text-[#0D1117]" />
            </div>
            <h2 className="text-xl font-poppins font-black text-[#0D1117]">
              {language === 'id' ? 'Kotak Masuk' : 'Inbox'}
            </h2>
          </div>
          <button 
            onClick={() => { playClick(); onClose(); }}
            className="p-2 bg-[#F4F5F7] hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-[#0D1117]" />
          </button>
        </div>

        <div className="px-6 pb-6 overflow-y-auto flex-grow bg-white">
          {loading ? (
            <div className="text-center py-10 text-slate-500 text-sm font-medium">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center bg-[#F4F5F7] rounded-2xl">
              <Mail className="w-10 h-10 text-slate-400 mb-3" />
              <p className="text-slate-600 text-sm font-medium">
                {language === 'id' ? 'Kotak masuk kosong.' : 'Inbox is empty.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className="bg-[#F4F5F7] p-4 rounded-2xl flex items-start gap-4">
                  {msg.type === 'life_gift' && (
                    <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shrink-0">
                      <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                    </div>
                  )}
                  {msg.type === 'friend_request' && (
                    <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[#0D1117]" />
                    </div>
                  )}
                  
                  <div className="flex-grow">
                    <h4 className="font-bold text-[#0D1117] text-sm">
                      {msg.type === 'life_gift' 
                        ? (language === 'id' ? 'Hadiah Nyawa' : 'Life Gift') 
                        : (language === 'id' ? 'Permintaan Teman' : 'Friend Request')}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 mt-1">
                      {msg.type === 'life_gift' 
                        ? `${msg.fromUserName} ${language === 'id' ? 'mengirimimu 1 Nyawa!' : 'sent you 1 Life!'}`
                        : `${msg.fromUserName} ${language === 'id' ? 'ingin menjadi temanmu.' : 'wants to be your friend.'}`}
                    </p>
                    
                    <div className="mt-3 flex gap-2">
                      {msg.type === 'life_gift' && (
                        <button 
                          onClick={() => handleClaimLife(msg)}
                          className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
                        >
                          {language === 'id' ? 'Klaim' : 'Claim'}
                        </button>
                      )}
                      {msg.type === 'friend_request' && (
                        <>
                          <button 
                            onClick={() => handleAcceptFriend(msg)}
                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> {language === 'id' ? 'Terima' : 'Accept'}
                          </button>
                          <button 
                            onClick={() => handleDecline(msg.id)}
                            className="p-2 bg-white hover:bg-slate-200 text-[#0D1117] text-xs font-bold rounded-full transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
