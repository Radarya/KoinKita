import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Plus, Shield, Coins, TrendingUp, Search, ChevronRight } from 'lucide-react';
import { collection, query, getDocs, doc, getDoc, updateDoc, arrayUnion, addDoc, onSnapshot, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from '../lib/LanguageContext';
import { playClick, playWin } from '../lib/audio';

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

  useEffect(() => {
    const clubsRef = collection(db, 'clubs');
    const unsubscribe = onSnapshot(clubsRef, (snap) => {
      const allClubs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setClubs(allClubs);
      
      if (userData?.clubId) {
        const found = allClubs.find(c => c.id === userData.clubId);
        setMyClub(found || null);
      }
      setLoading(false);
    }, (error) => {
      console.error('Clubs snapshot error:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userData?.clubId]);

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
        targetTreasury: 5000
      });
      
      const userRef = doc(db, 'users', currentUserUid);
      await updateDoc(userRef, { 
        clubId: clubRef.id,
        totalCoins: increment(-100),
        coins: increment(-100)
      });
      
      setShowCreate(false);
      if (triggerToast) triggerToast(language === 'id' ? 'Klub berhasil dibuat!' : 'Club created successfully!', 'success');
    } catch (e) {
      console.error(e);
    }
  };

  const handleJoinClub = async (clubId: string, currentMembers: number, capacity: number) => {
    playClick();
    if (currentMembers >= capacity) {
      if (triggerToast) triggerToast(language === 'id' ? 'Klub sudah penuh!' : 'Club is full!', 'error');
      return;
    }
    try {
      await updateDoc(doc(db, 'clubs', clubId), {
        members: arrayUnion(currentUserUid)
      });
      await updateDoc(doc(db, 'users', currentUserUid), {
        clubId: clubId
      });
      if (triggerToast) triggerToast(language === 'id' ? 'Berhasil bergabung!' : 'Joined successfully!', 'success');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDonate = async () => {
    playClick();
    const amount = parseInt(donateAmount);
    if (!amount || amount <= 0) return;
    
    const userCoins = userData?.totalCoins || 0;
    if (userCoins < amount) {
      if (triggerToast) triggerToast(language === 'id' ? 'Koin tidak cukup!' : 'Not enough coins!', 'error');
      return;
    }

    try {
      const newTreasury = (myClub.treasury || 0) + amount;
      let newCapacity = myClub.capacity;
      let newLevel = myClub.level;
      let newTarget = myClub.targetTreasury || 5000;
      let leveledUp = false;

      if (newTreasury >= newTarget) {
        newCapacity += 5;
        newLevel += 1;
        newTarget = newTarget * 2; // Progressive target
        leveledUp = true;
      }

      await updateDoc(doc(db, 'clubs', myClub.id), {
        treasury: newTreasury,
        capacity: newCapacity,
        level: newLevel,
        targetTreasury: newTarget
      });

      await updateDoc(doc(db, 'users', currentUserUid), {
        totalCoins: increment(-amount),
        coins: increment(-amount)
      });

      setDonateAmount('');
      if (leveledUp) {
        playWin();
        if (triggerToast) triggerToast(language === 'id' ? 'Klub Naik Level! Kapasitas Bertambah!' : 'Club Leveled Up! Capacity Expanded!', 'success');
      } else {
        if (triggerToast) triggerToast(language === 'id' ? 'Donasi berhasil!' : 'Donation successful!', 'success');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="flex flex-col h-full space-y-6 overflow-y-auto">
      {myClub ? (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md tracking-wider">Level {myClub.level}</span>
                <span className="text-sm font-bold text-slate-500">{myClub.members?.length || 0} / {myClub.capacity} {language === 'id' ? 'Anggota' : 'Members'}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-800 font-poppins">{myClub.name}</h2>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-amber-500" /> {language === 'id' ? 'Kas Klub & Crowdfunding' : 'Club Treasury & Crowdfunding'}</h3>
            <p className="text-sm text-slate-500 mb-4">{language === 'id' ? 'Patungan bersama untuk menaikkan level klub dan menambah kapasitas anggota!' : 'Crowdfund together to level up the club and expand capacity!'}</p>
            
            <div className="w-full bg-slate-200 rounded-full h-4 mb-2 overflow-hidden relative">
              <div 
                className="bg-amber-400 h-4 transition-all duration-1000" 
                style={{ width: `${Math.min(100, ((myClub.treasury || 0) / (myClub.targetTreasury || 5000)) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-6">
              <span>{myClub.treasury || 0} Koin</span>
              <span>Target: {myClub.targetTreasury || 5000} Koin</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="number" 
                  value={donateAmount}
                  onChange={(e) => setDonateAmount(e.target.value)}
                  placeholder={language === 'id' ? "Jumlah donasi..." : "Donation amount..."}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>
              <button 
                onClick={handleDonate}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shrink-0"
              >
                {language === 'id' ? 'Donasi' : 'Donate'}
              </button>
            </div>
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
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 mr-4">
                    <Shield className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-800 text-base">{club.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black uppercase bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md tracking-wider">Level {club.level || 1}</span>
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Users className="w-3 h-3" /> {club.members?.length || 0}/{club.capacity}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleJoinClub(club.id, club.members?.length || 0, club.capacity)}
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
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
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
      </AnimatePresence>
    </div>
  );
}
