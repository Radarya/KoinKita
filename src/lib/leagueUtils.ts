export const getCurrentWeekId = (): string => {
  const d = new Date();
  const d_adjusted = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = d_adjusted.getUTCDay() || 7;
  d_adjusted.setUTCDate(d_adjusted.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d_adjusted.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d_adjusted.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d_adjusted.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
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
