import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Plus, Shield, Coins, TrendingUp, Search, ChevronRight, Edit3, Trash2, UserMinus } from 'lucide-react';
import { collection, query, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, addDoc, onSnapshot, increment, deleteDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { uploadToImgBB } from '../lib/imgbb';
import { useTranslation } from '../lib/LanguageContext';
import { playClick, playWin } from '../lib/audio';
import { getCurrentWeekId } from '../lib/leagueUtils';

interface ClubsTabProps {
  currentUserUid: string;
  userData: any;
  triggerToast?: (msg: string, type: 'success' | 'warning' | 'error' | 'info') => void;
}

export default function ClubsTab({ currentUserUid, userData, triggerToast }: ClubsTabProps) {
  const { language } = useTranslation();
  const [clubs, setClubs] = useState<any[]>([]);
  const [myClub, setMyClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [showCreate, setShowCreate] = useState(false);
  const [newClubName, setNewClubName] = useState('');
  
  const [donateAmount, setDonateAmount] = useState('');
  
  // New features state
  const [memberDetails, setMemberDetails] = useState<any[]>([]);
  const [showEditPhoto, setShowEditPhoto] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const clubsRef = collection(db, 'clubs');
    const unsubscribe = onSnapshot(clubsRef, (snap) => {
      const allClubs = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      setClubs(allClubs);
      
      if (userData?.clubId) {
        const found = allClubs.find(c => c.id === userData.clubId);
        if (found) {
          const currentWeekId = getCurrentWeekId();
          if (found.weekId !== currentWeekId) {
             // Reset club weekly mission
             updateDoc(doc(db, 'clubs', found.id), {
                weekId: currentWeekId,
                treasury: 0,
                contributions: {}
             }).catch(console.warn);
             // We don't set myClub yet, it will re-trigger snapshot
             return;
          }
          setMyClub(found);
        } else {
          setMyClub(null);
        }
      } else {
        setMyClub(null);
      }
      setLoading(false);
    }, (error) => {
      console.warn('Clubs snapshot error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData?.clubId]);

  useEffect(() => {
    if (!myClub || !myClub.members || myClub.members.length === 0) return;
    const fetchMembers = async () => {
      try {
        const q = query(collection(db, 'users'), where('__name__', 'in', myClub.members.slice(0, 30)));
        const snap = await getDocs(q);
        const mData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // sort by contribution (descending)
        mData.sort((a, b) => {
          const cA = myClub.contributions?.[a.id] || 0;
          const cB = myClub.contributions?.[b.id] || 0;
          return cB - cA;
        });
        setMemberDetails(mData);
      } catch (e) {
        console.warn('Error fetching members:', e);
      }
    };
    fetchMembers();
  }, [myClub]);

  const handleCreateClub = async () => {
    playClick();
    if (!newClubName.trim()) return;
    if (userData.totalCoins < 100) {
      if (triggerToast) triggerToast(language === 'id' ? 'Butuh 100 Koin untuk membuat klub!' : 'Need 100 Coins to create a club!', 'error');
      return;
    }

    try {
      const clubRef = await addDoc(collection(db, 'clubs'), {
        name: newClubName,
        ownerId: currentUserUid,
        members: [currentUserUid],
        capacity: 5,
        treasury: 0,
        level: 1,
        targetTreasury: 50000,
        contributions: {
          [currentUserUid]: 0
        },
        profileUrl: '',
        weekId: getCurrentWeekId()
      });
      
      const userRef = doc(db, 'users', currentUserUid);
      await updateDoc(userRef, { 
        clubId: clubRef.id,
        totalCoins: increment(-100),
        coins: increment(-100)
      });
      
      setShowCreate(false);
      setNewClubName('');
      if (triggerToast) triggerToast(language === 'id' ? 'Klub berhasil dibuat!' : 'Club created successfully!', 'success');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleJoinClub = async (clubId: string, memberCount: number, capacity: number) => {
    playClick();
    if (memberCount >= capacity) {
      if (triggerToast) triggerToast(language === 'id' ? 'Klub sudah penuh!' : 'Club is full!', 'error');
      return;
    }
    
    try {
      const clubRef = doc(db, 'clubs', clubId);
      await updateDoc(clubRef, {
        members: arrayUnion(currentUserUid)
      });
      const userRef = doc(db, 'users', currentUserUid);
      await updateDoc(userRef, { clubId: clubId });
      if (triggerToast) triggerToast(language === 'id' ? 'Berhasil bergabung!' : 'Joined successfully!', 'success');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDonate = async () => {
    playClick();
    const amount = parseInt(donateAmount);
    if (isNaN(amount) || amount <= 0) return;
    if (userData.totalCoins < amount) {
      if (triggerToast) triggerToast(language === 'id' ? 'Koin tidak cukup!' : 'Not enough coins!', 'error');
      return;
    }

    try {
      const userRef = doc(db, 'users', currentUserUid);
      await updateDoc(userRef, {
        totalCoins: increment(-amount),
        coins: increment(-amount)
      });
      
      const currentWeekId = getCurrentWeekId();
      let currentTreasury = myClub.treasury || 0;
      if (myClub.weekId !== currentWeekId) {
         currentTreasury = 0;
      }
      
      const pointsToAdd = amount * 10;
      let newTreasury = currentTreasury + pointsToAdd;
      let newLevel = myClub.level || 1;
      let newCapacity = myClub.capacity || 5;
      let target = myClub.targetTreasury || 50000;
      let leveledUp = false;

      while (newTreasury >= target) {
        newTreasury -= target;
        newLevel++;
        newCapacity += 5;
        target = Math.floor(target * 1.5);
        leveledUp = true;
      }

      const clubRef = doc(db, 'clubs', myClub.id);
      const updates: any = {
        treasury: newTreasury,
        level: newLevel,
        capacity: newCapacity,
        targetTreasury: target,
        weekId: currentWeekId
      };
      if (myClub.weekId !== currentWeekId) {
         updates.contributions = { [currentUserUid]: pointsToAdd };
      } else {
         updates[`contributions.${currentUserUid}`] = increment(pointsToAdd);
      }
      await updateDoc(clubRef, updates);

      setDonateAmount('');
      if (leveledUp) {
        playWin();
        if (triggerToast) triggerToast(language === 'id' ? 'Klub Naik Level! Kapasitas Bertambah!' : 'Club Leveled Up! Capacity Expanded!', 'success');
      } else {
        if (triggerToast) triggerToast(language === 'id' ? 'Donasi berhasil!' : 'Donation successful!', 'success');
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleUpdatePhoto = async () => {
    if (!selectedFile || !myClub) return;
    setIsUploading(true);
    try {
      const downloadURL = await uploadToImgBB(selectedFile);
      await updateDoc(doc(db, 'clubs', myClub.id), { profileUrl: downloadURL });
      setShowEditPhoto(false);
      setSelectedFile(null);
      if (triggerToast) triggerToast(language === 'id' ? 'Foto klub diperbarui!' : 'Club photo updated!', 'success');
    } catch (e: any) {
      console.warn(e);
      if (triggerToast) triggerToast(language === 'id' ? 'Gagal mengunggah foto. Pastikan VITE_IMGBB_API_KEY diset.' : 'Failed to upload photo. Ensure VITE_IMGBB_API_KEY is set.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!myClub) return;
    try {
      await updateDoc(doc(db, 'clubs', myClub.id), { profileUrl: '' });
      if (triggerToast) triggerToast(language === 'id' ? 'Foto klub dihapus!' : 'Club photo removed!', 'success');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleKickMember = async (memberId: string) => {
    playClick();
    if (!window.confirm(language === 'id' ? 'Keluarkan anggota ini?' : 'Kick this member?')) return;
    try {
      await updateDoc(doc(db, 'clubs', myClub.id), {
        members: arrayRemove(memberId)
      });
      await updateDoc(doc(db, 'users', memberId), {
        clubId: null
      });
      if (triggerToast) triggerToast(language === 'id' ? 'Anggota dikeluarkan!' : 'Member kicked!', 'success');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDisbandClub = async () => {
    playClick();
    if (!window.confirm(language === 'id' ? 'Yakin ingin MEMBUBARKAN klub ini? Semua data klub akan hilang permanen!' : 'Are you sure you want to DISBAND this club? All data will be lost!')) return;
    try {
      const members = myClub.members || [];
      for (const mId of members) {
        await updateDoc(doc(db, 'users', mId), { clubId: null });
      }
      await deleteDoc(doc(db, 'clubs', myClub.id));
      if (triggerToast) triggerToast(language === 'id' ? 'Klub dibubarkan!' : 'Club disbanded!', 'success');
    } catch (e) {
      console.warn(e);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  const isLeader = myClub?.ownerId === currentUserUid;

  return (
    <div className="flex flex-col h-full space-y-6 overflow-y-auto pb-20">
      {myClub ? (
        <div className="flex flex-col space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative">
            {isLeader && (
              <button 
                onClick={() => setShowEditPhoto(true)}
                className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-500"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden border-2 border-emerald-50">
                {myClub.profileUrl ? (
                  <img src={myClub.profileUrl} alt="Club" className="w-full h-full object-cover" />
                ) : (
                  <Shield className="w-8 h-8 text-emerald-600" />
                )}
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md tracking-wider">Level {myClub.level || 1}</span>
                  <span className="text-sm font-bold text-slate-500">{myClub.members?.length || 0} / {myClub.capacity || 5} {language === 'id' ? 'Anggota' : 'Members'}</span>
                </div>
                <h2 className="text-2xl font-black text-slate-800 font-poppins pr-8">{myClub.name}</h2>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6">
              <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" /> 
                {language === 'id' ? 'Poin Kas & Crowdfunding' : 'Club Points & Crowdfunding'}
              </h3>
              <p className="text-sm text-slate-500 mb-4">{language === 'id' ? 'Sumbang Koin (1 Koin = 10 Poin) atau kerjakan Misi Klub untuk menaikkan level!' : 'Donate Coins (1 Coin = 10 Pts) or complete Club Quests to level up!'}</p>
              
              <div className="w-full bg-slate-200 rounded-full h-4 mb-2 overflow-hidden relative">
                <div 
                  className="bg-amber-400 h-4 transition-all duration-1000" 
                  style={{ width: `${Math.min(100, ((myClub.treasury || 0) / (myClub.targetTreasury || 50000)) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-6">
                <span>{(myClub.treasury || 0).toLocaleString()} Poin</span>
                <span>Target: {(myClub.targetTreasury || 50000).toLocaleString()} Poin</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="number" 
                    value={donateAmount}
                    onChange={(e) => setDonateAmount(e.target.value)}
                    placeholder={language === 'id' ? "Jumlah Koin didonasikan..." : "Coins to donate..."}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
                <button 
                  onClick={handleDonate}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shrink-0 active:scale-95"
                >
                  {language === 'id' ? 'Donasi' : 'Donate'}
                </button>
              </div>
            </div>
            
            {/* Member List */}
            <h3 className="font-bold text-slate-800 mb-4">{language === 'id' ? 'Daftar Anggota' : 'Members List'}</h3>
            <div className="space-y-3">
              {memberDetails.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                    {member.profilePictureUrl || member.profilePicUrl ? (
                      <img src={member.profilePictureUrl || member.profilePicUrl} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400"><Users className="w-5 h-5" /></div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800 truncate text-sm">
                        {member.displayName || member.name || member.fullName || 'Pemain'}
                      </h4>
                      {member.id === myClub.ownerId && (
                        <span className="bg-amber-100 text-amber-700 text-[9px] px-1.5 py-0.5 rounded font-black uppercase">Ketua</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{myClub.contributions?.[member.id] || 0} {language === 'id' ? 'Poin Kontribusi' : 'Contribution Pts'}</p>
                  </div>
                  {isLeader && member.id !== currentUserUid && (
                    <button 
                      onClick={() => handleKickMember(member.id)}
                      className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-xl transition-colors shrink-0"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Disband Club Button */}
            {isLeader && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <button 
                  onClick={handleDisbandClub}
                  className="w-full py-4 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" /> {language === 'id' ? 'Bubar Klub (Hapus)' : 'Disband Club'}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-emerald-50 rounded-3xl p-6 border border-emerald-100 shrink-0">
            <div>
              <h3 className="text-lg font-black text-emerald-800">{language === 'id' ? 'Belum Punya Klub?' : 'No Club Yet?'}</h3>
              <p className="text-sm text-emerald-600">{language === 'id' ? 'Buat klub dengan 100 Koin atau bergabung dengan klub yang ada.' : 'Create a club with 100 Coins or join an existing one.'}</p>
            </div>
            <button 
              onClick={() => setShowCreate(true)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-5 h-5" /> {language === 'id' ? 'Buat Klub' : 'Create Club'}
            </button>
          </div>

          <div className="bg-white rounded-3xl p-4 border border-slate-100 flex-grow shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 px-2">{language === 'id' ? 'Klub Terbuka' : 'Open Clubs'}</h3>
            <div className="space-y-2">
              {clubs.map(club => (
                <div key={club.id} className="flex items-center p-4 hover:bg-slate-50 rounded-2xl border-2 border-transparent transition-colors">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 mr-4 overflow-hidden">
                    {club.profileUrl ? (
                      <img src={club.profileUrl} alt="Club" className="w-full h-full object-cover" />
                    ) : (
                      <Shield className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-800 text-base">{club.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black uppercase bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md tracking-wider">Level {club.level || 1}</span>
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Users className="w-3 h-3" /> {club.members?.length || 0}/{club.capacity || 5}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleJoinClub(club.id, club.members?.length || 0, club.capacity || 5)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all text-sm active:scale-95"
                  >
                    {language === 'id' ? 'Gabung' : 'Join'}
                  </button>
                </div>
              ))}
              {clubs.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  {language === 'id' ? 'Belum ada klub.' : 'No clubs yet.'}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Create Club Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 ">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-xl font-black text-slate-800 mb-4">{language === 'id' ? 'Buat Klub Baru' : 'Create New Club'}</h3>
              <p className="text-sm text-slate-500 mb-6">{language === 'id' ? 'Biaya pembuatan: 100 Koin' : 'Creation cost: 100 Coins'}</p>
              
              <input 
                type="text" 
                value={newClubName}
                onChange={(e) => setNewClubName(e.target.value)}
                placeholder={language === 'id' ? "Nama Klub" : "Club Name"}
                maxLength={20}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium mb-6"
              />
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button 
                  onClick={handleCreateClub}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  Buat
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Photo Modal */}
        {showEditPhoto && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 ">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-xl font-black text-slate-800 mb-4">{language === 'id' ? 'Edit Profil Klub' : 'Edit Club Profile'}</h3>
              <p className="text-sm text-slate-500 mb-4">{language === 'id' ? 'Pilih gambar untuk profil klub.' : 'Choose an image for club profile.'}</p>
              
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 mb-6"
              />
              
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowEditPhoto(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleUpdatePhoto}
                    disabled={isUploading || !selectedFile}
                    className={`flex-1 py-3 font-bold rounded-xl shadow-lg transition-colors ${
                      isUploading || !selectedFile 
                        ? 'bg-emerald-300 text-white cursor-not-allowed shadow-none' 
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                    }`}
                  >
                    {isUploading ? (language === 'id' ? 'Mengunggah...' : 'Uploading...') : 'Simpan'}
                  </button>
                </div>
                {myClub?.profileUrl && (
                  <button 
                    onClick={handleRemovePhoto}
                    className="w-full py-3 bg-rose-50 text-rose-500 font-bold rounded-xl hover:bg-rose-100"
                  >
                    Hapus Foto
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
