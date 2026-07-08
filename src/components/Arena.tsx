import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Users, Swords, ChevronLeft, Search, Medal, UserPlus, Flame, Loader2, User, Heart, Share2 } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs, doc, getDoc, updateDoc, arrayUnion, addDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from '../lib/LanguageContext';
import { playClick } from '../lib/audio';

import ClubsTab from './ClubsTab';


interface ArenaProps {
  initialTab?: 'leaderboard' | 'friends' | 'clubs';
  mode?: 'arena' | 'social';
  onBack: () => void;
  currentUserUid: string;
  userData: any;
  triggerToast?: (msg: string, type: 'success' | 'warning' | 'error' | 'info') => void;
}

export default function Arena({ onBack, currentUserUid, userData, triggerToast, initialTab = 'leaderboard', mode = 'arena' }: ArenaProps) {
  const { language } = useTranslation();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'friends' | 'clubs'>(initialTab);
  
  // Leaderboard State
  const [globalLeaders, setGlobalLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Friends State
  const [friendTagInput, setFriendTagInput] = useState('');
  const [friendsList, setFriendsList] = useState<any[]>([]);

  // Clubs State
  const [clubs, setClubs] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('totalCoins', 'desc'), limit(50));
        const snapshot = await getDocs(q);
        
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setGlobalLeaders(data);
      } catch (error) {
        console.error("Error fetching leaders:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaders();
  }, []);

  useEffect(() => {
    if (activeTab === 'friends' && userData?.friends) {
      const fetchFriends = async () => {
        const friendsData = [];
        for (const fUid of userData.friends) {
          const docSnap = await getDoc(doc(db, 'users', fUid));
          if (docSnap.exists()) {
            friendsData.push({ id: docSnap.id, ...docSnap.data() });
          }
        }
        setFriendsList(friendsData);
      };
      fetchFriends();
    }
  }, [activeTab, userData?.friends]);

  const handleAddFriend = async () => {
    playClick();
    if (!friendTagInput.includes('#')) {
      if (triggerToast) triggerToast(language === 'id' ? 'Format harus Nama#1234' : 'Format must be Name#1234', 'error');
      return;
    }
    const [name, tag] = friendTagInput.split('#');
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('tag', '==', tag.trim()));
      const snap = await getDocs(q);
      
      let foundUser = null;
      snap.forEach(d => {
        if (d.data().displayName?.toLowerCase() === name.trim().toLowerCase() || d.data().name?.toLowerCase() === name.trim().toLowerCase()) {
          foundUser = { id: d.id, ...d.data() };
        }
      });

      if (!foundUser) {
        if (triggerToast) triggerToast(language === 'id' ? 'Pemain tidak ditemukan!' : 'Player not found!', 'error');
        return;
      }

      if (foundUser.id === currentUserUid) {
        if (triggerToast) triggerToast(language === 'id' ? 'Tidak bisa menambah diri sendiri' : 'Cannot add yourself', 'error');
        return;
      }

      // Send friend request via inbox
      await addDoc(collection(db, 'inbox'), {
        userId: foundUser.id,
        type: 'friend_request',
        fromUserId: currentUserUid,
        fromUserName: userData?.displayName || userData?.name || 'Player',
        status: 'unread',
        createdAt: Date.now()
      });
      
      setFriendTagInput('');
      if (triggerToast) triggerToast(language === 'id' ? 'Permintaan teman dikirim!' : 'Friend request sent!', 'success');
    } catch (e) {
      console.error(e);
      if (triggerToast) triggerToast('Error', 'error');
    }
  };

  const handleSendLife = async (friendId: string, friendName: string) => {
    playClick();
    try {
      await addDoc(collection(db, 'inbox'), {
        userId: friendId,
        type: 'life_gift',
        fromUserId: currentUserUid,
        fromUserName: userData?.displayName || userData?.name || 'Player',
        status: 'unread',
        createdAt: Date.now()
      });
      if (triggerToast) triggerToast(language === 'id' ? `Nyawa dikirim ke ${friendName}!` : `Life sent to ${friendName}!`, 'success');
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareProfile = async () => {
    playClick();
    const shareUrl = `${window.location.origin}/add/${currentUserUid}`;
    const text = language === 'id' 
      ? `👋 Hai! Ayo mabar KoinKita bareng aku! 🚀\n\nIni game seru banget buat belajar ngatur uang biar kita makin cerdas finansial.\n\nKlik link ini buat tambah aku jadi teman di game ya: \n${shareUrl}`
      : `👋 Hi! Let's play KoinKita together! 🚀\n\nIt's a fun game to learn financial skills and get smarter with our money.\n\nClick this link to add me as a friend: \n${shareUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'KoinKita', text: text });
      } catch (e) { console.error(e); }
    } else {
      navigator.clipboard.writeText(`${text} ${shareUrl}`);
      if (triggerToast) triggerToast(language === 'id' ? 'Disalin ke papan klip!' : 'Copied to clipboard!', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-slate-50 rounded-[2.5rem] w-full max-w-4xl h-[90vh] shadow-2xl flex flex-col overflow-hidden relative"
      >
        {/* Header */}
        <div className="px-6 py-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 relative z-10">
          <div className="flex items-center gap-4 w-full min-w-0">
            <button 
              onClick={() => { playClick(); onBack(); }}
              className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors group cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 text-slate-500 group-hover:text-slate-800" />
            </button>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {mode === 'arena' ? 'Arena' : (language === 'id' ? 'Sosial' : 'Social')}
              </h2>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-6 pb-2 shrink-0 bg-white z-10">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
            {mode === 'arena' && (
              <button 
                onClick={() => { playClick(); setActiveTab('leaderboard'); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'leaderboard' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Trophy className="w-4 h-4" /> {language === 'id' ? 'Peringkat' : 'Rankings'}
              </button>
            )}
            {mode === 'social' && (
              <>
                <button 
                  onClick={() => { playClick(); setActiveTab('friends'); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'friends' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Users className="w-4 h-4" /> {language === 'id' ? 'Teman' : 'Friends'}
                </button>
                <button 
                  onClick={() => { playClick(); setActiveTab('clubs'); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'clubs' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Swords className="w-4 h-4" /> {language === 'id' ? 'Klub Finansial' : 'Finance Clubs'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-hidden flex flex-col p-6">
          
          {/* LEADERBOARD TAB */}
          {activeTab === 'leaderboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
              <div className="bg-white rounded-3xl p-2 sm:p-4 shadow-sm border border-slate-100 flex-grow overflow-y-auto">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-40">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-4" />
                    <p className="text-slate-400 font-bold text-sm">Loading...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {globalLeaders.map((player, index) => {
                      const isCurrent = player.id === currentUserUid;
                      return (
                        <div 
                          key={player.id} 
                          className={`flex items-center p-3 sm:p-4 rounded-2xl transition-colors ${
                            isCurrent ? 'bg-amber-50 border-2 border-amber-200 shadow-sm' : 'hover:bg-slate-50 border-2 border-transparent'
                          }`}
                        >
                          <div className="w-8 font-black font-poppins text-lg text-slate-400 text-center shrink-0 mr-2 sm:mr-4">
                            {index === 0 ? <Medal className="w-8 h-8 text-yellow-500 fill-yellow-400/20 mx-auto" /> : 
                             index === 1 ? <Medal className="w-8 h-8 text-slate-400 fill-slate-300/20 mx-auto" /> : 
                             index === 2 ? <Medal className="w-8 h-8 text-amber-600 fill-amber-700/20 mx-auto" /> : 
                             `#${index + 1}`}
                          </div>
                          
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100 bg-slate-50 shrink-0 mr-3 sm:mr-4 flex items-center justify-center">
                            {player.profilePictureUrl || player.profilePicUrl ? (
                              <img src={player.profilePictureUrl || player.profilePicUrl} alt={player.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-slate-300" />
                            )}
                          </div>
                          
                          <div className="flex-grow min-w-0">
                            <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate flex items-center gap-2">
                              {player.displayName || player.name || player.fullName || 'Pemain'}
                              {isCurrent && (
                                <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-md uppercase tracking-wider">Anda</span>
                              )}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md tracking-wider">
                                Lvl {player.level || 0}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right shrink-0">
                            <div className="font-black font-poppins text-emerald-600 text-lg">
                              {(player.totalCoins || player.coins || 0).toLocaleString('id-ID')}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Koin</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* FRIENDS TAB */}
          {activeTab === 'friends' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between shrink-0">
                <div className="flex items-center gap-4 w-full min-w-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <UserPlus className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <h3 className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">{language === 'id' ? 'ID Pemain Kamu' : 'Your Player ID'}</h3>
                    <div className="flex flex-col">
                      <span className="text-lg md:text-2xl font-black text-slate-800 font-poppins break-words leading-tight">{userData?.displayName || userData?.name}</span>
                      <span className="text-sm md:text-base font-bold text-slate-400">#{userData?.tag || '0000'}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleShareProfile}
                  className="px-4 py-3 sm:px-6 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-all flex items-center gap-2 w-full md:w-auto justify-center shrink-0"
                >
                  <Share2 className="w-5 h-5" /> {language === 'id' ? 'Bagikan ID' : 'Share ID'}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <input 
                  type="text" 
                  value={friendTagInput}
                  onChange={(e) => setFriendTagInput(e.target.value)}
                  placeholder={language === 'id' ? "Tambah teman (contoh: Budi#1234)" : "Add friend (e.g. Budi#1234)"}
                  className="flex-grow px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
                />
                <button 
                  onClick={handleAddFriend}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shrink-0"
                >
                  {language === 'id' ? 'Tambah' : 'Add'}
                </button>
              </div>

              <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex-grow overflow-y-auto">
                <h3 className="font-bold text-slate-800 mb-4 px-2">{language === 'id' ? 'Daftar Teman' : 'Friends List'} ({friendsList.length})</h3>
                {friendsList.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>{language === 'id' ? 'Belum ada teman.' : 'No friends yet.'}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {friendsList.map(friend => (
                      <div key={friend.id} className="flex items-center p-3 hover:bg-slate-50 rounded-2xl transition-colors border-2 border-transparent">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100 bg-slate-50 shrink-0 mr-4 flex items-center justify-center">
                          {friend.profilePictureUrl || friend.profilePicUrl ? (
                            <img src={friend.profilePictureUrl || friend.profilePicUrl} alt={friend.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <h3 className="font-bold text-slate-800 text-base truncate">
                            {friend.displayName || friend.name} <span className="text-slate-400 font-normal">#{friend.tag}</span>
                          </h3>
                        </div>
                        <button 
                          onClick={() => handleSendLife(friend.id, friend.displayName || friend.name)}
                          className="p-2 sm:px-4 sm:py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl flex items-center gap-2 transition-all active:scale-95 shrink-0"
                        >
                          <Heart className="w-4 h-4 sm:w-4 sm:h-4 fill-rose-500" /> <span className="hidden sm:inline">{language === 'id' ? 'Beri Nyawa' : 'Send Life'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* CLUBS TAB */}
          {activeTab === 'clubs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full overflow-hidden">
              <ClubsTab currentUserUid={currentUserUid} userData={userData} triggerToast={triggerToast} />
            </motion.div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
