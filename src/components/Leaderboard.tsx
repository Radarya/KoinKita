import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Medal, X, ChevronRight, User, Loader2 } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from '../lib/LanguageContext';

interface LeaderboardProps {
  onClose: () => void;
  currentUserUid: string;
}

export default function Leaderboard({ onClose, currentUserUid }: LeaderboardProps) {
  const { language } = useTranslation();
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);

  const getPlayerLevel = (player: any) => {
    const coins = player.totalCoins || player.coins || 0;
    if (coins >= 6001) return 5;
    if (coins >= 4001) return 4;
    if (coins >= 2001) return 3;
    if (coins >= 601) return 2;
    if (coins >= 100) return 1;
    return 0;
  };

  const getPlayerUsername = (player: any) => {
    if (player.username) return `@${player.username}`;
    const nameStr = player.fullName || player.name || player.email?.split('@')[0] || 'anonim';
    return `@${nameStr.toLowerCase().trim().replace(/[^a-z0-9_]/g, '_').replace(/\s+/g, '_')}`;
  };

  const getPlayerBadge = (lvl: number) => {
    switch (lvl) {
      case 5:
        return language === 'id' ? 'Sultan Cuan 💎' : 'Wealth Master 💎';
      case 4:
        return language === 'id' ? 'Ahli Anggaran 👑' : 'Budget Expert 👑';
      case 3:
        return language === 'id' ? 'Investor Cerdas 📈' : 'Smart Investor 📈';
      case 2:
        return language === 'id' ? 'Bijak Belanja 🛒' : 'Wise Spender 🛒';
      case 1:
        return language === 'id' ? 'Sadar Finansial 📘' : 'Financially Aware 📘';
      default:
        return language === 'id' ? 'Pemula 🌱' : 'Beginner 🌱';
    }
  };

  const formatCreatedDate = (createdAt: any) => {
    if (!createdAt) return language === 'id' ? 'Baru Bergabung' : 'Recently Joined';
    try {
      let dateObj: Date;
      if (typeof createdAt.toDate === 'function') {
        dateObj = createdAt.toDate();
      } else if (createdAt && typeof createdAt === 'object' && 'seconds' in createdAt) {
        dateObj = new Date(createdAt.seconds * 1000);
      } else {
        dateObj = new Date(createdAt);
      }
      
      if (isNaN(dateObj.getTime())) {
        return language === 'id' ? 'Baru Bergabung' : 'Recently Joined';
      }

      return dateObj.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return language === 'id' ? 'Baru Bergabung' : 'Recently Joined';
    }
  };

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('totalCoins', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLeaders(data);
      } catch (err) {
        console.error("Gagal mengambil data leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-amber-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-6 shrink-0 flex items-center justify-between shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="flex items-center gap-3 text-amber-950 relative z-10">
              <div className="p-2.5 bg-amber-100/50 rounded-xl backdrop-blur-sm border border-amber-200/50">
                <Trophy className="w-6 h-6 text-amber-900 fill-amber-700/20" />
              </div>
              <div>
                <h2 className="font-extrabold text-xl font-poppins">
                  {language === 'id' ? "Papan Peringkat" : "Leaderboard"}
                </h2>
                <p className="text-amber-900/80 text-xs font-medium tracking-wide">
                  {language === 'id' ? "Pemain Paling Sultan" : "Wealthiest Players"}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-amber-900 hover:bg-amber-300/50 rounded-full transition-colors relative z-10">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="p-2 overflow-y-auto bg-slate-50 flex-grow">
            {loading ? (
              <div className="space-y-3 p-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm animate-pulse">
                    <div className="w-10 h-10 bg-slate-200 rounded-lg mr-3"></div>
                    <div className="w-10 h-10 bg-slate-200 rounded-full mr-4"></div>
                    <div className="flex-grow space-y-2">
                       <div className="w-32 h-4 bg-slate-200 rounded"></div>
                       <div className="w-20 h-3 bg-slate-200 rounded"></div>
                    </div>
                    <div className="w-14 h-5 bg-slate-200 rounded ml-3"></div>
                  </div>
                ))}
              </div>
            ) : leaders.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p>
                  {language === 'id' ? "Belum ada pemain di papan peringkat." : "No players on leaderboard yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-2 p-2">
                {leaders.map((player, index) => {
                  const isCurrent = player.id === currentUserUid;
                  const isExpanded = expandedPlayerId === player.id;
                  return (
                    <motion.div
                      key={player.id}
                      layout="position"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setExpandedPlayerId(curr => curr === player.id ? null : player.id);
                      }}
                      className={`flex flex-col p-4 rounded-2xl border cursor-pointer select-none transition-all duration-300 relative overflow-hidden ${
                        isCurrent 
                           ? 'bg-amber-50/90 border-amber-300 shadow-md scale-[1.01]' 
                           : isExpanded
                             ? 'bg-amber-50/40 border-amber-200 shadow-md'
                             : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center w-full">
                        {isCurrent && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>}
                        
                        {/* Rank Number */}
                        <div className="flex-shrink-0 w-10 flex justify-center items-center mr-3 relative">
                          {index === 0 ? (
                            <Medal className="w-8 h-8 text-yellow-500 fill-yellow-400/20 drop-shadow-sm" />
                          ) : index === 1 ? (
                            <Medal className="w-8 h-8 text-slate-400 fill-slate-300/20 drop-shadow-sm" />
                          ) : index === 2 ? (
                            <Medal className="w-8 h-8 text-amber-600 fill-amber-700/20 drop-shadow-sm" />
                          ) : (
                            <span className="font-bold text-slate-400 font-poppins text-lg">#{index + 1}</span>
                          )}
                        </div>

                        {/* Avatar / Icon */}
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex flex-shrink-0 items-center justify-center mr-4 text-slate-400 overflow-hidden">
                          {player.profilePictureUrl || player.profilePicUrl ? (
                            <img src={player.profilePictureUrl || player.profilePicUrl} alt={player.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5" />
                          )}
                        </div>

                        {/* Name & Title */}
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-1 max-w-full flex-wrap">
                            <span className={`font-bold font-poppins text-sm leading-tight transition-all text-left ${isExpanded ? 'break-words text-slate-900 font-extrabold whitespace-normal' : 'truncate'} ${isCurrent ? 'text-amber-900' : 'text-slate-800'}`}>
                              {getPlayerUsername(player)}
                            </span>
                            {isCurrent && (
                              <span className="shrink-0 text-[10px] font-black bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">
                                {language === 'id' ? "Kamu" : "You"}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium tracking-wide mt-0.5 text-left">
                            Level {getPlayerLevel(player)}
                          </p>
                        </div>

                        {/* Score */}
                        <div className="flex-shrink-0 text-right ml-3">
                          <p className={`font-black font-poppins ${isCurrent ? 'text-amber-600' : 'text-emerald-500'}`}>
                            {(player.totalCoins || player.coins || 0).toLocaleString('id-ID')}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            {language === 'id' ? "Koin" : "Coins"}
                          </p>
                        </div>
                      </div>

                      {/* Expanded Section with full info - no age info (umur) to respect user settings and constraints */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full mt-3 pt-3 border-t border-slate-150/60 text-xs text-slate-600 space-y-2.5 overflow-hidden"
                          >
                            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex flex-col gap-2">
                              {/* Display unobstructed Full Name cleanly */}
                              <div className="flex flex-col gap-1 text-left">
                                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                                  {language === 'id' ? 'Nama Lengkap' : 'Full Name'}
                                </span>
                                <span className="text-sm font-black font-poppins text-slate-800 break-words leading-snug">
                                  {player.fullName || player.name || player.email?.split('@')[0] || 'Anonim'}
                                </span>
                              </div>

                              {/* Display Clean Username handle */}
                              <div className="flex flex-col gap-1 text-left pt-2 border-t border-slate-100">
                                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                                  {language === 'id' ? 'Nama Pengguna' : 'Username'}
                                </span>
                                <span className="text-xs font-bold font-mono text-emerald-600 break-words leading-none">
                                  @{player.username || player.name?.toLowerCase().replace(/\s+/g, '_') || player.fullName?.toLowerCase().replace(/\s+/g, '_') || 'anonim'}
                                </span>
                              </div>

                              {/* Display Leaderboard Rank */}
                              <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs text-left">
                                <span className="text-[10px] uppercase font-bold text-slate-400">
                                  {language === 'id' ? 'Posisi Peringkat' : 'Leaderboard Rank'}
                                </span>
                                <span className="font-extrabold text-[12px] text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-100 font-poppins">
                                  #{index + 1}
                                </span>
                              </div>

                              {/* Display Badge Status */}
                              <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs text-left">
                                <span className="text-[10px] uppercase font-bold text-slate-400">
                                  {language === 'id' ? 'Status Gelar' : 'Rank Honor Status'}
                                </span>
                                <span className="font-extrabold text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-teal-100">
                                  {getPlayerBadge(getPlayerLevel(player))}
                                </span>
                              </div>

                              {/* Display Account Creation Date instead of Email */}
                              <div className="flex justify-between items-center text-xs text-left pt-2 border-t border-slate-100">
                                <span className="text-[10px] uppercase font-bold text-slate-400">
                                  {language === 'id' ? 'Bergabung Sejak' : 'Joined Since'}
                                </span>
                                <span className="font-extrabold text-[10px] text-slate-600 font-poppins">
                                  {formatCreatedDate(player.createdAt || player.lastLogin)}
                                </span>
                              </div>

                              {/* STRICTLY NO AGE INFO (UMUR) SHOWING AND KEPT SECURED */}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
          
          <div className="p-4 shrink-0 border-t border-slate-200 flex justify-center bg-white rounded-b-3xl">
            <button onClick={onClose} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors w-full">
              {language === 'id' ? "Tutup Papan Peringkat" : "Close Leaderboard"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
