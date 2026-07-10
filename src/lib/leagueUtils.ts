export const getCurrentWeekId = (): string => {
  const d = new Date();
  const d_adjusted = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = d_adjusted.getUTCDay() || 7;
  d_adjusted.setUTCDate(d_adjusted.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d_adjusted.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d_adjusted.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d_adjusted.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
};

export const getNextWeekReset = (): Date => {
  const d = new Date();
  // Get current day of week in UTC (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayNum = d.getUTCDay() || 7; // Convert to 1-7 (Monday = 1)
  
  // Calculate days until next Monday
  const daysUntilNextMonday = 8 - dayNum;
  
  const nextReset = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + daysUntilNextMonday));
  return nextReset;
};

export const formatTimeRemaining = (targetDate: Date, language: string): string => {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  
  if (diff <= 0) return language === 'id' ? 'Segera Berakhir' : 'Ending Soon';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  
  if (days > 0) {
    return language === 'id' ? `${days}h ${hours}j` : `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return language === 'id' ? `${hours}j ${minutes}m` : `${hours}h ${minutes}m`;
  }
  return language === 'id' ? `${minutes}m` : `${minutes}m`;
};

export const LEAGUES = [
  { id: 0, nameId: 'Pemula', nameEn: 'Beginner', emoji: '🥉', color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' },
  { id: 1, nameId: 'Sadar Finansial', nameEn: 'Financially Aware', emoji: '🥈', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' },
  { id: 2, nameId: 'Bijak Belanja', nameEn: 'Wise Spender', emoji: '🥇', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' },
  { id: 3, nameId: 'Investor Cerdas', nameEn: 'Smart Investor', emoji: '🏅', color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
  { id: 4, nameId: 'Ahli Anggaran', nameEn: 'Budget Expert', emoji: '💎', color: 'text-cyan-600', bg: 'bg-cyan-100', border: 'border-cyan-200' },
  { id: 5, nameId: 'Master Kekayaan', nameEn: 'Wealth Master', emoji: '👑', color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' }
];

export const getLeagueInfo = (leagueId: number) => {
  return LEAGUES.find(l => l.id === leagueId) || LEAGUES[0];
};

export const calculateInitialLeague = (xp: number): number => {
  if (xp >= 50000) return 5;
  if (xp >= 30000) return 4;
  if (xp >= 15000) return 3;
  if (xp >= 5000) return 2;
  if (xp >= 1000) return 1;
  return 0;
};

export const getDemotionRank = (leagueId: number): number => {
  switch (leagueId) {
    case 0: return 16; // No demotion in Beginner
    case 1: return 13; // Rank 13-15 (3 players)
    case 2: return 12; // Rank 12-15 (4 players)
    case 3: return 11; // Rank 11-15 (5 players)
    case 4: return 10; // Rank 10-15 (6 players)
    case 5: return 9;  // Rank 9-15 (7 players)
    default: return 13;
  }
};
