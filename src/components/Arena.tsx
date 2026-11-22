import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Users, Swords, ChevronLeft, Search, Medal, UserPlus, Flame, Loader2, User, Heart, Share2, UserMinus, X, Info } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs, doc, getDoc, updateDoc, arrayUnion, addDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from '../lib/LanguageContext';
import { playClick } from '../lib/audio';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { getLeagueInfo, getNextWeekReset, formatTimeRemaining, getDemotionRank } from '../lib/leagueUtils';

import ClubsTab from './ClubsTab';
import CikoMascot from './CikoMascot';


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
  const [selectedFriend, setSelectedFriend] = useState<any | null>(null);

  // Clubs State
  const [clubs, setClubs] = useState<any[]>([]);

  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    const nextReset = getNextWeekReset();
    const updateTime = () => {
      setTimeRemaining(formatTimeRemaining(nextReset, language));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000); // update every minute
    return () => clearInterval(interval);
  }, [language]);
  
  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        if (userData?.leagueGroupId) {
          const groupRef = doc(db, 'league_groups', userData.leagueGroupId);
          const groupSnap = await getDoc(groupRef);
          
          if (groupSnap.exists()) {
            const data = groupSnap.data();
            const playersObj = data.players || {};
            const playersArr = Object.entries(playersObj).map(([uid, pData]: [string, any]) => {
              if (uid === currentUserUid) {
                return {
                  id: uid,
                  xp: pData.xp || 0,
                  displayName: userData?.username || userData?.displayName || userData?.name || pData.displayName || 'Pemain',
                  profilePictureUrl: userData?.profilePictureUrl || userData?.profilePicUrl || pData.photoUrl || '',
                  username: userData?.username || pData.username || ''
                };
              }
              return {
                id: uid,
                xp: pData.xp || 0,
                displayName: pData.displayName || 'Pemain',
                profilePictureUrl: pData.photoUrl || '',
                username: pData.username || ''
              };
            });
            
            playersArr.sort((a, b) => b.xp - a.xp);
            setGlobalLeaders(playersArr);
          }
        }
      } catch (error) {
        console.warn("Error fetching leaders:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaders();
  }, [userData?.leagueGroupId]);

  useEffect(() => {
    if (activeTab === 'friends' && userData?.friends) {
      const fetchFriends = async () => {
        const friendsData = [];
        const validFriends = [];
        let hasInvalid = false;
        for (const fUid of userData.friends) {
          const docSnap = await getDoc(doc(db, 'users', fUid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.friends && data.friends.includes(currentUserUid)) {
              friendsData.push({ id: docSnap.id, ...data });
              validFriends.push(fUid);
            } else {
              hasInvalid = true; // They unfriended us
            }
          } else {
             hasInvalid = true; // Account deleted
          }
        }
        setFriendsList(friendsData);
        if (hasInvalid) {
          // Clean up our own friends list silently
          try {
            await updateDoc(doc(db, 'users', currentUserUid), { friends: validFriends });
          } catch (e) {
            console.warn("Failed to clean up friends list", e);
          }
        }
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
        fromUserName: userData?.fullName || userData?.name || 'Player',
        status: 'unread',
        createdAt: Date.now()
      });
      
      setFriendTagInput('');
      if (triggerToast) triggerToast(language === 'id' ? 'Permintaan teman dikirim!' : 'Friend request sent!', 'success');
    } catch (e) {
      console.warn(e);
      if (triggerToast) triggerToast('Error', 'error');
    }
  };

  const handleSendLife = async (friendId: string, friendName: string) => {
    playClick();
    const lastSent = userData?.lastSentLife?.[friendId] || 0;
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    if (now - lastSent < twentyFourHours) {
      if (triggerToast) triggerToast(language === 'id' ? `Tunggu besok untuk mengirim nyawa lagi!` : `Wait until tomorrow to send life again!`, 'error');
      return;
    }

    try {
      await addDoc(collection(db, 'inbox'), {
        userId: friendId,
        type: 'life_gift',
        fromUserId: currentUserUid,
        fromUserName: userData?.fullName || userData?.name || 'Player',
        status: 'unread',
        createdAt: Date.now()
      });
      
      const userRef = doc(db, 'users', currentUserUid);
      await updateDoc(userRef, {
        [`lastSentLife.${friendId}`]: Date.now()
      });

      if (triggerToast) triggerToast(language === 'id' ? `Nyawa dikirim ke ${friendName}!` : `Life sent to ${friendName}!`, 'success');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleUnfriend = async (friendId: string) => {
    playClick();
    if (!window.confirm(language === 'id' ? 'Yakin ingin menghapus teman ini?' : 'Are you sure you want to unfriend?')) return;
    try {
      const userRef = doc(db, 'users', currentUserUid);
      const friendRef = doc(db, 'users', friendId);
      
      const newFriends = (userData?.friends || []).filter((id: string) => id !== friendId);
      await updateDoc(userRef, { friends: newFriends });
      
      const friendSnap = await getDoc(friendRef);
      if (friendSnap.exists()) {
         const theirFriends = friendSnap.data().friends || [];
         const newTheirFriends = theirFriends.filter((id: string) => id !== currentUserUid);
         await updateDoc(friendRef, { friends: newTheirFriends });
      }
      
      setFriendsList(prev => prev.filter(f => f.id !== friendId));
      if (triggerToast) triggerToast(language === 'id' ? 'Teman dihapus.' : 'Unfriended.', 'info');
      setSelectedFriend(null);
    } catch (e) {
      console.warn(e);
      if (triggerToast) triggerToast('Error', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0D1117] font-sans w-full pb-20 sm:pb-24 flex flex-col relative overflow-hidden">
      <div 
        className="w-full max-w-5xl mx-auto flex flex-col flex-grow relative"
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-white flex items-center justify-between shrink-0 relative z-10 sticky top-0">
          <div className="flex items-center gap-3 w-full min-w-0">
            <CikoMascot size={34} pose={mode === 'arena' ? 'wealth' : 'hero'} animated={false} />
            <div>
              <h2 className="text-2xl font-poppins font-black text-[#0D1117] tracking-tight">
                {mode === 'arena' ? 'Arena' : (language === 'id' ? 'Sosial' : 'Social')}
              </h2>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-4 sm:p-6 pb-2 shrink-0 bg-[#FAFAFA] z-10">
          <div className="flex bg-[#F4F5F7] p-1.5 rounded-full overflow-x-auto">
            {mode === 'arena' && (
              <button 
                onClick={() => { playClick(); setActiveTab('leaderboard'); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm transition-colors whitespace-nowrap cursor-pointer ${activeTab === 'leaderboard' ? 'bg-[#0D1117] text-white' : 'text-slate-600 hover:text-[#0D1117]'}`}
              >
                <Trophy className="w-4 h-4" /> {language === 'id' ? 'Peringkat' : 'Rankings'}
              </button>
            )}
            {mode === 'social' && (
              <>
                <button 
                  onClick={() => { playClick(); setActiveTab('friends'); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm transition-colors whitespace-nowrap cursor-pointer ${activeTab === 'friends' ? 'bg-[#0D1117] text-white' : 'text-slate-600 hover:text-[#0D1117]'}`}
                >
                  <Users className="w-4 h-4" /> {language === 'id' ? 'Teman' : 'Friends'}
                </button>
                <button 
                  onClick={() => { playClick(); setActiveTab('clubs'); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm transition-colors whitespace-nowrap cursor-pointer ${activeTab === 'clubs' ? 'bg-[#0D1117] text-white' : 'text-slate-600 hover:text-[#0D1117]'}`}
                >
                  <Swords className="w-4 h-4" /> {language === 'id' ? 'Klub Finansial' : 'Finance Clubs'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto modal-content-scroller flex flex-col p-4 sm:p-6">
          
          {/* LEADERBOARD TAB */}
          {activeTab === 'leaderboard' && (() => {
            const leagueInfo = getLeagueInfo(userData?.league || 0);
            return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
              
              <div className="bg-[#0D1117] text-white p-5 sm:p-6 rounded-3xl mb-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                    <CikoMascot size={46} pose="wealth" animated={false} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-400 text-xs">{language === 'id' ? 'Liga Saat Ini' : 'Current League'}</h3>
                    <p className="font-poppins font-black text-lg sm:text-xl text-white">{language === 'id' ? leagueInfo.nameId : leagueInfo.nameEn}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400">{language === 'id' ? 'Sisa Waktu' : 'Ends In'}</p>
                  <p className="font-poppins font-black text-emerald-400 text-sm sm:text-base tabular-nums">{timeRemaining}</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-3 sm:p-4 flex-grow">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-40">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-4" />
                    <p className="text-slate-500 font-bold text-sm">Loading...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {globalLeaders.map((player, index) => {
                      const isCurrent = player.id === currentUserUid;
                      const isPromotionZone = index < 3;
                      const isDemotionZone = index >= (getDemotionRank(userData?.league || 0) - 1);

                      return (
                        <div 
                          key={player.id} 
                          className={`flex items-center p-3 sm:p-4 rounded-2xl transition-colors relative overflow-hidden ${
                            isCurrent ? 'bg-[#F4F5F7]' : 'bg-white hover:bg-[#F4F5F7]'
                          }`}
                        >
                          {isPromotionZone && <div className="absolute top-0 bottom-0 left-0 w-1 bg-emerald-600"></div>}
                          {isDemotionZone && <div className="absolute top-0 bottom-0 left-0 w-1 bg-rose-600"></div>}
                          
                          <div className="w-8 font-black font-poppins text-base text-slate-500 text-center shrink-0 mr-2 sm:mr-4 ml-1 tabular-nums">
                            {index === 0 ? <Medal className="w-6 h-6 text-amber-500 mx-auto" /> : 
                             index === 1 ? <Medal className="w-6 h-6 text-slate-400 mx-auto" /> : 
                             index === 2 ? <Medal className="w-6 h-6 text-amber-700 mx-auto" /> : 
                             `#${index + 1}`}
                          </div>
                          
                          <div className="w-11 h-11 rounded-full overflow-hidden bg-[#F4F5F7] shrink-0 mr-3 sm:mr-4 flex items-center justify-center">
                            {player.profilePictureUrl || player.profilePicUrl ? (
                              <img src={player.profilePictureUrl || player.profilePicUrl} alt={player.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          
                          <div className="flex-grow min-w-0">
                            <h3 className="font-bold text-[#0D1117] text-sm sm:text-base truncate flex items-center gap-2">
                              {player.username ? `@${player.username}` : (player.displayName || player.name || player.fullName || 'Pemain')}
                              {isCurrent && (
                                <span className="bg-[#0D1117] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{language === 'id' ? 'Anda' : 'You'}</span>
                              )}
                            </h3>
                          </div>
                          
                          <div className="text-right shrink-0">
                            <div className="font-black font-poppins text-emerald-600 text-base sm:text-lg tabular-nums">
                              {(player.xp || 0).toLocaleString('id-ID')}
                            </div>
                            <div className="text-[11px] font-bold text-slate-500">XP</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
            );
          })()}

          {/* FRIENDS TAB */}
          {activeTab === 'friends' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col space-y-5">
              <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
                <input 
                  type="text" 
                  value={friendTagInput}
                  onChange={(e) => setFriendTagInput(e.target.value)}
                  placeholder={language === 'id' ? "Tambah teman, misal Budi#1234" : "Add friend, e.g. Budi#1234"}
                  className="flex-grow px-5 py-3.5 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-sm text-[#0D1117] placeholder:text-slate-400"
                />
                <button 
                  onClick={handleAddFriend}
                  className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-sm transition-colors shrink-0 cursor-pointer"
                >
                  {language === 'id' ? 'Tambah' : 'Add'}
                </button>
              </div>

              <div className="bg-white rounded-3xl p-5 shrink-0 mb-6">
                <h3 className="font-poppins font-black text-[#0D1117] mb-4 px-1 tabular-nums">{language === 'id' ? 'Daftar Teman' : 'Friends List'} ({friendsList.length})</h3>
                {friendsList.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">
                    <Users className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                    <p className="text-sm font-medium">{language === 'id' ? 'Belum ada teman.' : 'No friends yet.'}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {friendsList.map(friend => (
                      <div 
                        key={friend.id} 
                        onClick={() => { playClick(); setSelectedFriend(friend); }}
                        className="flex items-center p-3.5 bg-[#F4F5F7] hover:bg-slate-200/70 rounded-2xl transition-colors cursor-pointer"
                      >
                        <div className="w-11 h-11 rounded-full overflow-hidden bg-white shrink-0 mr-4 flex items-center justify-center">
                          {friend.profilePictureUrl || friend.profilePicUrl ? (
                            <img src={friend.profilePictureUrl || friend.profilePicUrl} alt={friend.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <h3 className="font-bold text-[#0D1117] text-sm sm:text-base truncate">
                            {friend.fullName || friend.name || friend.displayName} <span className="text-slate-500 font-normal tabular-nums">#{friend.tag}</span>
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* CLUBS TAB */}
          {activeTab === 'clubs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col shrink-0 mb-6">
              <ClubsTab currentUserUid={currentUserUid} userData={userData} triggerToast={triggerToast} />
            </motion.div>
          )}

        </div>
      </div>

      {/* Selected Friend Modal */}
      <AnimatePresence>
        {selectedFriend && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0D1117]/80" onClick={() => setSelectedFriend(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden relative"
            >
              <button 
                onClick={() => setSelectedFriend(null)}
                className="absolute top-4 right-4 p-2 bg-[#F4F5F7] hover:bg-slate-200 rounded-full transition-colors z-10 cursor-pointer"
              >
                <X className="w-5 h-5 text-[#0D1117]" />
              </button>
              
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#F4F5F7] mb-4 flex items-center justify-center">
                  {selectedFriend.profilePictureUrl || selectedFriend.profilePicUrl ? (
                    <img src={selectedFriend.profilePictureUrl || selectedFriend.profilePicUrl} alt={selectedFriend.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-slate-400" />
                  )}
                </div>
                
                <h3 className="font-poppins font-black text-2xl text-[#0D1117] mb-1">
                  {selectedFriend.fullName || selectedFriend.name || selectedFriend.displayName || 'Pemain'}
                </h3>
                
                {selectedFriend.username && (
                  <p className="text-slate-600 font-medium text-sm mb-1">@{selectedFriend.username}</p>
                )}
                <p className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full text-xs mt-1 mb-6 tabular-nums">#{selectedFriend.tag}</p>

                <div className="w-full space-y-3">
                  {(() => {
                    const lastSent = userData?.lastSentLife?.[selectedFriend.id] || 0;
                    const canSend = Date.now() - lastSent >= 24 * 60 * 60 * 1000;
                    return (
                      <button 
                        onClick={() => { if(canSend) { handleSendLife(selectedFriend.id, selectedFriend.displayName || selectedFriend.name); setSelectedFriend(null); } }} 
                        disabled={!canSend}
                        className={`w-full py-3.5 ${canSend ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer' : 'bg-[#F4F5F7] text-slate-400 cursor-not-allowed'} font-bold text-sm rounded-full flex items-center justify-center gap-2 transition-colors`}
                      >
                        <Heart className={`w-4 h-4 ${canSend ? 'fill-white text-white' : 'fill-slate-300 text-slate-300'}`} /> {canSend ? (language === 'id' ? 'Beri Nyawa' : 'Send Life') : (language === 'id' ? 'Tunggu Besok' : 'Wait Tomorrow')}
                      </button>
                    );
                  })()}
                  <button 
                    onClick={() => { handleUnfriend(selectedFriend.id); }} 
                    className="w-full py-3.5 bg-[#F4F5F7] hover:bg-slate-200 text-[#0D1117] font-bold text-sm rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <UserMinus className="w-4 h-4" /> {language === 'id' ? 'Hapus Pertemanan' : 'Unfriend'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
