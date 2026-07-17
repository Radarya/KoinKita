import React from 'react';
import { Home, Gift, Trophy, Users, User } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import { playClick } from '../lib/audio';

interface BottomNavBarProps {
  activeTab: 'home' | 'quests' | 'arena' | 'social' | 'profile';
  onChangeTab: (tab: 'home' | 'quests' | 'arena' | 'social' | 'profile') => void;
}

export function BottomNavBar({ activeTab, onChangeTab }: BottomNavBarProps) {
  const { language } = useTranslation();

  const handleTabClick = (tab: 'home' | 'quests' | 'arena' | 'social' | 'profile') => {
    if (activeTab !== tab) {
      playClick();
      onChangeTab(tab);
    }
  };

  const tabs = [
    { id: 'home', icon: Home, label: language === 'id' ? 'Beranda' : 'Home', color: 'text-emerald-500', bg: 'bg-emerald-100/50' },
    { id: 'quests', icon: Gift, label: language === 'id' ? 'Misi' : 'Quests', color: 'text-orange-500', bg: 'bg-orange-100/50' },
    { id: 'arena', icon: Trophy, label: language === 'id' ? 'Arena' : 'Arena', color: 'text-amber-500', bg: 'bg-amber-100/50' },
    { id: 'social', icon: Users, label: language === 'id' ? 'Sosial' : 'Social', color: 'text-blue-500', bg: 'bg-blue-100/50' },
    { id: 'profile', icon: User, label: language === 'id' ? 'Profil' : 'Profile', color: 'text-indigo-500', bg: 'bg-indigo-100/50' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[80] bg-white border-t border-slate-200 pb-2 sm:pb-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] w-full max-w-md mx-auto">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id as any)}
              className="relative flex flex-col items-center justify-center w-full h-full"
            >
              <div className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-300 ${isActive ? tab.bg : 'bg-transparent'}`}>
                <Icon className={`w-6 h-6 mb-0.5 transition-all duration-300 ${isActive ? tab.color : 'text-slate-400'}`} />
                <span className={`text-[10px] font-bold transition-all duration-300 ${isActive ? tab.color : 'text-slate-400'}`}>
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
