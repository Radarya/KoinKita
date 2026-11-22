import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, X, CheckCircle2, Coins, Sparkles, Loader2, Clock, Shield } from 'lucide-react';
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { getCurrentWeekId } from '../lib/leagueUtils';
import { getLocalTodayStr, rewardUser } from '../lib/rewardUtils';
import { isLocalGuestUser, loadLocalGuestSnapshot, saveLocalGuestSnapshot } from '../lib/guestLifecycle';
import { db } from '../firebase';
import { useTranslation } from '../lib/LanguageContext';
import { playClick, playWin } from '../lib/audio';
import CikoMascot from './CikoMascot';

interface QuestsTabProps {
  user: any;
  userData: any;
  triggerToast: (msg: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export function QuestsTab({ user, userData, triggerToast }: QuestsTabProps) {
  const { language } = useTranslation();
  const [claiming, setClaiming] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [clubTimeLeft, setClubTimeLeft] = useState('');
  const [activeTab, setActiveTab] = useState<'personal' | 'club'>('personal');
  
  const today = getLocalTodayStr();
  const currentWeekId = getCurrentWeekId();

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      
      // Daily Personal Timer
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diffDaily = tomorrow.getTime() - now.getTime();
      const hD = Math.floor((diffDaily / (1000 * 60 * 60)) % 24);
      const mD = Math.floor((diffDaily / 1000 / 60) % 60);
      setTimeLeft(language === 'id' ? `${hD}j ${mD}m` : `${hD}h ${mD}m`);

      // Weekly Club Timer (Reset Monday 00:00)
      const nextMonday = new Date(now);
      nextMonday.setDate(nextMonday.getDate() + ((7 - nextMonday.getDay() + 1) % 7 || 7));
      nextMonday.setHours(0, 0, 0, 0);
      const diffWeekly = nextMonday.getTime() - now.getTime();
      const dW = Math.floor(diffWeekly / (1000 * 60 * 60 * 24));
      const hW = Math.floor((diffWeekly / (1000 * 60 * 60)) % 24);
      setClubTimeLeft(language === 'id' ? `${dW}h ${hW}j` : `${dW}d ${hW}h`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [language]);
  
  const personalQuests = [
    {
      id: 'login',
      title: language === 'id' ? 'Login Harian' : 'Daily Login',
      desc: language === 'id' ? 'Masuk ke CIKO hari ini.' : 'Log in to CIKO today.',
      reward: 15,
      rewardType: 'coins',
      progress: 1,
      max: 1,
      completed: userData?.claimedQuests?.[today]?.includes('login')
    },
    {
      id: 'play_any',
      title: language === 'id' ? 'Langkah Pertama Ekspedisi' : 'First Expedition Step',
      desc: language === 'id' ? 'Selesaikan 1 Keping Materi atau sesi Latihan hari ini.' : 'Complete 1 Expedition Lesson or Practice session today.',
      reward: 30,
      rewardType: 'coins',
      progress: Math.min(userData?.dailyStats?.[today]?.gamesPlayed || 0, 1),
      max: 1,
      completed: userData?.claimedQuests?.[today]?.includes('play_any')
    },
    {
      id: 'play_three',
      title: language === 'id' ? 'Penjelajah Nusantara' : 'Nusantara Explorer',
      desc: language === 'id' ? 'Tuntaskan 3 Keping Materi atau sesi Latihan hari ini.' : 'Finish 3 Expedition Lessons or Practice sessions today.',
      reward: 50,
      rewardType: 'coins',
      progress: Math.min(userData?.dailyStats?.[today]?.gamesPlayed || 0, 3),
      max: 3,
      completed: userData?.claimedQuests?.[today]?.includes('play_three')
    }
  ];

  const weekNum = parseInt(currentWeekId.split('-W')[1] || '0', 10);
  const clubQuestSetIndex = weekNum % 3;
  const todayGames = userData?.dailyStats?.[today]?.gamesPlayed || 0;
  const weeklyGames = Math.max(userData?.weeklyStats?.[currentWeekId]?.gamesPlayed || 0, todayGames);

  const clubQuestsSets = [
    // Set 0
    [
      {
        id: 'club_play_three',
        title: language === 'id' ? 'Kontribusi Klub' : 'Club Contribution',
        desc: language === 'id' ? 'Selesaikan 3 Keping Materi atau sesi Latihan minggu ini.' : 'Finish 3 Lessons or Practice sessions this week.',
        reward: 30,
        rewardType: 'pts',
        progress: Math.min(weeklyGames, 3),
        max: 3,
        completed: userData?.claimedQuests?.[currentWeekId]?.includes('club_play_three')
      },
      {
        id: 'club_play_seven',
        title: language === 'id' ? 'Pejuang Klub' : 'Club Warrior',
        desc: language === 'id' ? 'Selesaikan 7 Keping Materi atau sesi Latihan minggu ini.' : 'Finish 7 Lessons or Practice sessions this week.',
        reward: 70,
        rewardType: 'pts',
        progress: Math.min(weeklyGames, 7),
        max: 7,
        completed: userData?.claimedQuests?.[currentWeekId]?.includes('club_play_seven')
      }
    ],
    // Set 1
    [
      {
        id: 'club_play_two',
        title: language === 'id' ? 'Aktivitas Klub' : 'Club Activity',
        desc: language === 'id' ? 'Selesaikan 2 Keping Materi atau sesi Latihan minggu ini.' : 'Finish 2 Lessons or Practice sessions this week.',
        reward: 20,
        rewardType: 'pts',
        progress: Math.min(weeklyGames, 2),
        max: 2,
        completed: userData?.claimedQuests?.[currentWeekId]?.includes('club_play_two')
      },
      {
        id: 'club_play_five',
        title: language === 'id' ? 'Bintang Klub' : 'Club Star',
        desc: language === 'id' ? 'Selesaikan 5 Keping Materi atau sesi Latihan minggu ini.' : 'Finish 5 Lessons or Practice sessions this week.',
        reward: 50,
        rewardType: 'pts',
        progress: Math.min(weeklyGames, 5),
        max: 5,
        completed: userData?.claimedQuests?.[currentWeekId]?.includes('club_play_five')
      }
    ],
    // Set 2
    [
      {
        id: 'club_play_four',
        title: language === 'id' ? 'Semangat Klub' : 'Club Spirit',
        desc: language === 'id' ? 'Selesaikan 4 Keping Materi atau sesi Latihan minggu ini.' : 'Finish 4 Lessons or Practice sessions this week.',
        reward: 40,
        rewardType: 'pts',
        progress: Math.min(weeklyGames, 4),
        max: 4,
        completed: userData?.claimedQuests?.[currentWeekId]?.includes('club_play_four')
      },
      {
        id: 'club_play_ten',
        title: language === 'id' ? 'Legenda Klub' : 'Club Legend',
        desc: language === 'id' ? 'Selesaikan 10 Keping Materi atau sesi Latihan minggu ini.' : 'Finish 10 Lessons or Practice sessions this week.',
        reward: 100,
        rewardType: 'pts',
        progress: Math.min(weeklyGames, 10),
        max: 10,
        completed: userData?.claimedQuests?.[currentWeekId]?.includes('club_play_ten')
      }
    ]
  ];
  
  const clubQuests = clubQuestsSets[clubQuestSetIndex];

  const questsToDisplay = activeTab === 'personal' ? personalQuests : clubQuests;

  const handleClaim = async (quest: any) => {
    if (!user?.uid || claiming) return;
    try {
      playClick();
      setClaiming(quest.id);

      if (isLocalGuestUser(user)) {
        if (quest.rewardType === 'coins') {
          await rewardUser(user.uid, null, quest.reward);
          const snap = loadLocalGuestSnapshot();
          const curClaimed = snap?.claimedQuests?.[today] || [];
          saveLocalGuestSnapshot({
            claimedQuests: {
              ...(snap?.claimedQuests || {}),
              [today]: Array.from(new Set([...curClaimed, quest.id])),
            },
          });
          if (triggerToast) triggerToast(language === 'id' ? `Berhasil klaim +${quest.reward} Koin!` : `Successfully claimed +${quest.reward} Coins!`, 'success');
          playWin();
        } else if (triggerToast) {
          triggerToast(language === 'id' ? 'Tautkan akun untuk ikut misi Klub mingguan.' : 'Link an account to join weekly Club quests.', 'info');
        }
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      
      if (quest.rewardType === 'coins') {
        await rewardUser(user.uid, userData?.leagueGroupId, quest.reward);
        if (triggerToast) triggerToast(language === 'id' ? `Berhasil klaim +${quest.reward} Koin!` : `Successfully claimed +${quest.reward} Coins!`, 'success');
      } else if (quest.rewardType === 'pts') {
        if (!userData?.clubId) throw new Error('No club ID');
        
        const pointsToAdd = quest.reward;
        
        // Let's get the club data first to check for level up logic
        const clubRef = doc(db, 'clubs', userData.clubId);
        const clubSnap = await getDoc(clubRef);
        
        if (clubSnap.exists()) {
          const clubData = clubSnap.data();
          const currentWeekId = getCurrentWeekId();
          
          let currentTreasury = clubData.treasury || 0;
          if (clubData.weekId !== currentWeekId) {
             currentTreasury = 0; // Reset if it's a new week
          }
          
          let newTreasury = currentTreasury + pointsToAdd;
          let newLevel = clubData.level || 1;
          let newCapacity = clubData.capacity || 5;
          let target = clubData.targetTreasury || 50000;
          let leveledUp = false;

          while (newTreasury >= target) {
            newTreasury -= target;
            newLevel++;
            newCapacity += 5;
            target = Math.floor(target * 1.5);
            leveledUp = true;
          }

          const updates: any = {
            treasury: newTreasury,
            level: newLevel,
            capacity: newCapacity,
            targetTreasury: target,
            weekId: currentWeekId
          };
          if (clubData.weekId !== currentWeekId) {
             updates.contributions = { [user.uid]: pointsToAdd };
          } else {
             updates[`contributions.${user.uid}`] = increment(pointsToAdd);
          }
          await updateDoc(clubRef, updates);
          
          if (leveledUp) {
            if (triggerToast) triggerToast(language === 'id' ? `Klub Naik Level! Kapasitas Bertambah!` : `Club Leveled Up! Capacity Expanded!`, 'success');
          } else {
            if (triggerToast) triggerToast(language === 'id' ? `Berhasil klaim +${quest.reward} Poin Kontribusi!` : `Successfully claimed +${quest.reward} Contribution Pts!`, 'success');
          }
        }
      }
      
      const trackKey = activeTab === 'club' ? currentWeekId : today;
      await updateDoc(userRef, {
        [`claimedQuests.${trackKey}`]: arrayUnion(quest.id)
      });
      
      playWin();
    } catch (e) {
      console.warn(e);
      if (triggerToast) triggerToast(language === 'id' ? `Gagal mengklaim misi.` : `Failed to claim quest.`, 'error');
    } finally {
      setClaiming(null);
    }
  };

  return (
    <div className="w-full flex flex-col pt-6 pb-32 px-4 sm:px-6 relative min-h-screen font-poppins text-[#0D1117] bg-[#FAFAFA] max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="bg-white rounded-3xl w-full overflow-hidden flex flex-col"
      >
        <div className="p-6 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3.5">
            <CikoMascot size={48} pose="scholar" animated={false} />
            <div>
              <h2 className="text-xl font-black text-[#0D1117] tracking-tight leading-tight">
                {activeTab === 'personal' 
                  ? (language === 'id' ? 'Misi Harian' : 'Daily Quests')
                  : (language === 'id' ? 'Misi Klub' : 'Club Quests')}
              </h2>
              <div className="inline-flex items-center gap-1.5 mt-1.5 text-xs font-bold text-[#0D1117] bg-[#F4F5F7] px-3 py-1 rounded-full tabular-nums">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'id' ? 'Reset:' : 'Resets:'} {activeTab === 'personal' ? timeLeft : clubTimeLeft}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 pb-4">
          <div className="flex p-1 bg-[#F4F5F7] rounded-full">
            <button 
              onClick={() => { playClick(); setActiveTab('personal'); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-colors cursor-pointer ${activeTab === 'personal' ? 'bg-[#0D1117] text-white' : 'text-slate-600 hover:text-[#0D1117]'}`}
            >
              {language === 'id' ? 'Personal' : 'Personal'}
            </button>
            <button 
              onClick={() => { playClick(); setActiveTab('club'); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'club' ? 'bg-[#0D1117] text-white' : 'text-slate-600 hover:text-[#0D1117]'}`}
            >
              <Shield className="w-3.5 h-3.5" /> {language === 'id' ? 'Klub' : 'Club'}
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 overflow-y-auto space-y-3">
          {activeTab === 'club' && !userData?.clubId && (
            <div className="text-center py-8 bg-[#F4F5F7] rounded-2xl px-4">
              <Shield className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="font-bold text-[#0D1117] mb-1.5">{language === 'id' ? 'Belum Punya Klub' : 'No Club Yet'}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{language === 'id' ? 'Bergabunglah dengan klub untuk membuka misi klub dan menyumbang poin kontribusi.' : 'Join a club to unlock club quests and contribute points.'}</p>
            </div>
          )}
          
          {(activeTab === 'personal' || (activeTab === 'club' && userData?.clubId)) && questsToDisplay.map((q) => {
            const isFinished = q.progress >= q.max;
            
            return (
              <div key={q.id} className={`rounded-2xl p-5 transition-colors ${q.completed ? 'bg-emerald-50' : 'bg-[#F4F5F7]'}`}>
                <div className="flex gap-4 items-center">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#0D1117] text-sm sm:text-base leading-tight mb-1 truncate">
                      {q.title}
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed mb-3 font-sans">
                      {q.desc}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="relative h-2 bg-white rounded-full overflow-hidden w-full max-w-[200px] mb-1.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(q.progress / q.max) * 100}%` }}
                        className={`absolute top-0 left-0 h-full ${q.completed ? 'bg-emerald-600' : 'bg-[#0D1117]'} rounded-full`}
                      />
                    </div>
                    <p className="text-xs font-bold text-slate-500 tabular-nums">
                      {q.progress} / {q.max}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center shrink-0 w-24">
                    <div className={`flex items-center gap-1 mb-2 font-bold px-2.5 py-1 rounded-full text-xs tabular-nums ${q.rewardType === 'coins' ? 'text-amber-700 bg-amber-100' : 'text-emerald-700 bg-emerald-100'}`}>
                      <span>+{q.reward} {q.rewardType === 'coins' ? 'Koin' : 'Pts'}</span>
                    </div>
                    
                    {q.completed ? (
                      <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        {language === 'id' ? 'Diklaim' : 'Claimed'}
                      </div>
                    ) : isFinished ? (
                      <button 
                        onClick={() => handleClaim(q)}
                        disabled={claiming === q.id}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-full transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        {claiming === q.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                        {language === 'id' ? 'Klaim' : 'Claim'}
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="w-full bg-white text-slate-400 text-xs font-bold py-2.5 px-3 rounded-full cursor-not-allowed"
                      >
                        {language === 'id' ? 'Proses' : 'Pending'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
