import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Plus, Shield, Coins, TrendingUp, Search, ChevronRight, Edit3, Trash2, UserMinus } from 'lucide-react';
import { collection, query, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, addDoc, onSnapshot, increment, deleteDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { uploadToImgBB } from '../lib/imgbb';
import { useTranslation } from '../lib/LanguageContext';
import { playClick, playWin } from '../lib/audio';
import { getCurrentWeekId } from '../lib/leagueUtils';
import PlayerProfileModal from './PlayerProfileModal';
import CikoMascot from './CikoMascot';

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
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);

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
      if (triggerToast) triggerToast(language === 'id' ? 'Gagal mengunggah foto.' : 'Failed to upload photo.', 'error');
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
          <div className="bg-white rounded-3xl p-6 relative">
            {isLeader && (
              <button 
                onClick={() => setShowEditPhoto(true)}
                className="absolute top-5 right-5 p-2.5 bg-[#F4F5F7] hover:bg-slate-200 rounded-full transition-colors text-[#0D1117] cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#F4F5F7] rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                {myClub.profileUrl ? (
                  <img src={myClub.profileUrl} alt="Club" className="w-full h-full object-cover" />
                ) : (
                  <CikoMascot size={48} pose="wealth" animated={false} />
                )}
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full tabular-nums">Level {myClub.level || 1}</span>
                  <span className="text-xs font-bold text-slate-500 tabular-nums">{myClub.members?.length || 0} / {myClub.capacity || 5} {language === 'id' ? 'Anggota' : 'Members'}</span>
                </div>
                <h2 className="text-2xl font-black text-[#0D1117] font-poppins pr-10">{myClub.name}</h2>
              </div>
            </div>

            <div className="bg-[#F4F5F7] rounded-2xl p-5 sm:p-6 mb-6">
              <h3 className="font-bold text-[#0D1117] mb-1.5 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" /> 
                {language === 'id' ? 'Poin Kas & Crowdfunding' : 'Club Points & Crowdfunding'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 mb-4">{language === 'id' ? 'Sumbang Koin di mana 1 Koin bernilai 10 Poin, atau kerjakan Misi Klub untuk menaikkan level.' : 'Donate Coins where 1 Coin equals 10 Pts, or complete Club Quests to level up.'}</p>
              
              <div className="w-full bg-white rounded-full h-3.5 mb-2 overflow-hidden relative">
                <div 
                  className="bg-emerald-600 h-3.5 transition-all duration-1000 rounded-full" 
                  style={{ width: `${Math.min(100, ((myClub.treasury || 0) / (myClub.targetTreasury || 50000)) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-5 tabular-nums">
                <span>{(myClub.treasury || 0).toLocaleString('id-ID')} Poin</span>
                <span>Target: {(myClub.targetTreasury || 50000).toLocaleString('id-ID')} Poin</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-grow">
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="number" 
                    value={donateAmount}
                    onChange={(e) => setDonateAmount(e.target.value)}
                    placeholder={language === 'id' ? "Jumlah Koin didonasikan..." : "Coins to donate..."}
                    className="w-full pl-11 pr-4 py-3 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-sm text-[#0D1117]"
                  />
                </div>
                <button 
                  onClick={handleDonate}
                  className="px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full transition-colors shrink-0 cursor-pointer"
                >
                  {language === 'id' ? 'Donasi' : 'Donate'}
                </button>
              </div>
            </div>
            
            {/* Member List */}
            <h3 className="font-poppins font-black text-[#0D1117] mb-3">{language === 'id' ? 'Daftar Anggota' : 'Members List'}</h3>
            <div className="space-y-2.5">
              {memberDetails.map((member) => (
                <div 
                  key={member.id} 
                  onClick={() => {
                    playClick();
                    setSelectedPlayer(member);
                  }}
                  className="flex items-center gap-3 p-3.5 bg-[#F4F5F7] hover:bg-slate-200/70 rounded-2xl cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white shrink-0">
                    {member.profilePictureUrl || member.profilePicUrl ? (
                      <img src={member.profilePictureUrl || member.profilePicUrl} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400"><Users className="w-5 h-5" /></div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#0D1117] truncate text-sm">
                        {member.username ? `@${member.username}` : (member.displayName || member.name || member.fullName || 'Pemain')}
                      </h4>
                      {member.id === myClub.ownerId && (
                        <span className="bg-[#0D1117] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Ketua</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-medium tabular-nums">{myClub.contributions?.[member.id] || 0} {language === 'id' ? 'Poin Kontribusi' : 'Contribution Pts'}</p>
                  </div>
                  {isLeader && member.id !== currentUserUid && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleKickMember(member.id); }}
                      className="p-2 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-full transition-colors shrink-0 cursor-pointer"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Disband Club Button */}
            {isLeader && (
              <div className="mt-8 pt-6">
                <button 
                  onClick={handleDisbandClub}
                  className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> {language === 'id' ? 'Bubarkan Klub' : 'Disband Club'}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#0D1117] text-white rounded-3xl p-6 shrink-0">
            <div>
              <h3 className="text-lg font-poppins font-black text-white">{language === 'id' ? 'Belum Punya Klub?' : 'No Club Yet?'}</h3>
              <p className="text-sm text-slate-300 mt-1">{language === 'id' ? 'Buat klub dengan 100 Koin atau bergabung dengan klub yang ada.' : 'Create a club with 100 Coins or join an existing one.'}</p>
            </div>
            <button 
              onClick={() => setShowCreate(true)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> {language === 'id' ? 'Buat Klub' : 'Create Club'}
            </button>
          </div>

          <div className="bg-white rounded-3xl p-5 flex-grow">
            <h3 className="font-poppins font-black text-[#0D1117] mb-4 px-1">{language === 'id' ? 'Klub Terbuka' : 'Open Clubs'}</h3>
            <div className="space-y-2.5">
              {clubs.map(club => (
                <div key={club.id} className="flex items-center p-4 bg-[#F4F5F7] rounded-2xl transition-colors">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 mr-4 overflow-hidden">
                    {club.profileUrl ? (
                      <img src={club.profileUrl} alt="Club" className="w-full h-full object-cover" />
                    ) : (
                      <Shield className="w-6 h-6 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-[#0D1117] text-base truncate">{club.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-bold bg-white text-[#0D1117] px-2.5 py-0.5 rounded-full tabular-nums">Level {club.level || 1}</span>
                      <span className="text-xs font-bold text-slate-600 flex items-center gap-1 tabular-nums"><Users className="w-3.5 h-3.5" /> {club.members?.length || 0}/{club.capacity || 5}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleJoinClub(club.id, club.members?.length || 0, club.capacity || 5)}
                    className="px-6 py-2.5 bg-[#0D1117] hover:bg-slate-800 text-white font-bold rounded-full transition-colors text-xs cursor-pointer shrink-0 ml-2"
                  >
                    {language === 'id' ? 'Gabung' : 'Join'}
                  </button>
                </div>
              ))}
              {clubs.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm">
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
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0D1117]/80">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm"
            >
              <h3 className="text-xl font-poppins font-black text-[#0D1117] mb-2">{language === 'id' ? 'Buat Klub Baru' : 'Create New Club'}</h3>
              <p className="text-sm text-slate-600 mb-6 tabular-nums">{language === 'id' ? 'Biaya pembuatan: 100 Koin' : 'Creation cost: 100 Coins'}</p>
              
              <input 
                type="text" 
                value={newClubName}
                onChange={(e) => setNewClubName(e.target.value)}
                placeholder={language === 'id' ? "Nama Klub" : "Club Name"}
                maxLength={20}
                className="w-full px-4 py-3.5 bg-[#F4F5F7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-sm text-[#0D1117] mb-6"
              />
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-3 bg-[#F4F5F7] hover:bg-slate-200 text-[#0D1117] font-bold text-sm rounded-full transition-colors cursor-pointer"
                >
                  {language === 'id' ? 'Batal' : 'Cancel'}
                </button>
                <button 
                  onClick={handleCreateClub}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full transition-colors cursor-pointer"
                >
                  {language === 'id' ? 'Buat' : 'Create'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Photo Modal */}
        {showEditPhoto && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0D1117]/80">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm"
            >
              <h3 className="text-xl font-poppins font-black text-[#0D1117] mb-2">{language === 'id' ? 'Edit Profil Klub' : 'Edit Club Profile'}</h3>
              <p className="text-sm text-slate-600 mb-5">{language === 'id' ? 'Pilih gambar untuk profil klub.' : 'Choose an image for club profile.'}</p>
              
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
                className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#F4F5F7] file:text-[#0D1117] hover:file:bg-slate-200 mb-6 cursor-pointer"
              />
              
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowEditPhoto(false)}
                    className="flex-1 py-3 bg-[#F4F5F7] hover:bg-slate-200 text-[#0D1117] font-bold text-sm rounded-full transition-colors cursor-pointer"
                  >
                    {language === 'id' ? 'Batal' : 'Cancel'}
                  </button>
                  <button 
                    onClick={handleUpdatePhoto}
                    disabled={isUploading || !selectedFile}
                    className={`flex-1 py-3 font-bold text-sm rounded-full transition-colors ${
                      isUploading || !selectedFile 
                        ? 'bg-emerald-300 text-white cursor-not-allowed' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                    }`}
                  >
                    {isUploading ? (language === 'id' ? 'Mengunggah...' : 'Uploading...') : (language === 'id' ? 'Simpan' : 'Save')}
                  </button>
                </div>
                {myClub?.profileUrl && (
                  <button 
                    onClick={handleRemovePhoto}
                    className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm rounded-full transition-colors cursor-pointer"
                  >
                    {language === 'id' ? 'Hapus Foto' : 'Remove Photo'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <PlayerProfileModal 
        isOpen={!!selectedPlayer} 
        onClose={() => setSelectedPlayer(null)} 
        player={selectedPlayer} 
        currentUserUid={currentUserUid}
        currentUserName={userData?.fullName || userData?.name || userData?.displayName || 'Pemain'}
        currentUserFriends={userData?.friends || []}
        triggerToast={triggerToast} 
      />
    </div>
  );
}
