import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Heart, Mail, Check, Inbox as InboxIcon } from 'lucide-react';
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc, arrayUnion, getDoc } from 'firebase/firestore';
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
      const currentLives = userData?.lives !== undefined ? userData.lives : 5;
      const userRef = doc(db, 'users', user.uid);
      
      if (currentLives >= 5) {
        // Option B: Dividen Solidaritas (Konversi ke Koin)
        const currentCoins = userData?.totalCoins || 0;
        await updateDoc(userRef, { totalCoins: currentCoins + 15, coins: currentCoins + 15 });
        triggerToast(language === 'id' ? 'Nyawa penuh! Dikonversi jadi +15 Koin!' : 'Lives full! Converted to +15 Coins!', 'success');
      } else {
        await updateDoc(userRef, { lives: currentLives + 1 });
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
        const friendSnap = await getDoc(friendRef);
        if (friendSnap.exists()) {
          const friendData = friendSnap.data();
          const currentCoins = userData?.totalCoins || userData?.coins || 0;
          const friendCoins = friendData?.totalCoins || friendData?.coins || 0;
          
          // If either user has <= 50 coins, award the +100 bonus to both!
          if (currentCoins <= 50 || friendCoins <= 50) {
            await updateDoc(userRef, {
              totalCoins: currentCoins + 100,
              coins: currentCoins + 100
            });
            await updateDoc(friendRef, {
              totalCoins: friendCoins + 100,
              coins: friendCoins + 100
            });
            triggerToast(language === 'id' ? 'Bonus afiliasi! Masing-masing mendapat +100 Koin!' : 'Affiliate bonus! Each gets +100 Coins!', 'success');
          }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 ">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <InboxIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-black text-slate-800">
              {language === 'id' ? 'Kotak Masuk' : 'Inbox'}
            </h2>
          </div>
          <button 
            onClick={() => { playClick(); onClose(); }}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow bg-slate-50/50">
          {loading ? (
            <div className="text-center py-10 text-slate-400">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center">
              <Mail className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">
                {language === 'id' ? 'Kotak masuk kosong.' : 'Inbox is empty.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                  {msg.type === 'life_gift' && (
                    <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center shrink-0">
                      <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                    </div>
                  )}
                  {msg.type === 'friend_request' && (
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-indigo-500" />
                    </div>
                  )}
                  
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-800">
                      {msg.type === 'life_gift' 
                        ? (language === 'id' ? 'Hadiah Nyawa' : 'Life Gift') 
                        : (language === 'id' ? 'Permintaan Teman' : 'Friend Request')}
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">
                      {msg.type === 'life_gift' 
                        ? `${msg.fromUserName} ${language === 'id' ? 'mengirimimu 1 Nyawa!' : 'sent you 1 Life!'}`
                        : `${msg.fromUserName} ${language === 'id' ? 'ingin menjadi temanmu.' : 'wants to be your friend.'}`}
                    </p>
                    
                    <div className="mt-3 flex gap-2">
                      {msg.type === 'life_gift' && (
                        <button 
                          onClick={() => handleClaimLife(msg)}
                          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-xl transition-all"
                        >
                          {language === 'id' ? 'Klaim' : 'Claim'}
                        </button>
                      )}
                      {msg.type === 'friend_request' && (
                        <>
                          <button 
                            onClick={() => handleAcceptFriend(msg)}
                            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-1"
                          >
                            <Check className="w-4 h-4" /> {language === 'id' ? 'Terima' : 'Accept'}
                          </button>
                          <button 
                            onClick={() => handleDecline(msg.id)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-xl transition-all"
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
