import React from 'react';
import { Home, Dumbbell, Gift, Trophy, Users, User } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import { playClick } from '../lib/audio';

export type NavTabId = 'home' | 'practice' | 'quests' | 'arena' | 'social' | 'profile';

interface BottomNavBarProps {
  activeTab: NavTabId;
  onChangeTab: (tab: NavTabId) => void;
}

export function BottomNavBar({ activeTab, onChangeTab }: BottomNavBarProps) {
  const { language } = useTranslation();

  const handleTabClick = (tab: NavTabId) => {
    if (activeTab !== tab) {
      playClick();
      onChangeTab(tab);
    }
  };

  const tabs: { id: NavTabId; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { id: 'home', icon: Home, label: language === 'id' ? 'Beranda' : 'Home' },
    { id: 'practice', icon: Dumbbell, label: language === 'id' ? 'Latihan' : 'Practice' },
    { id: 'quests', icon: Gift, label: language === 'id' ? 'Misi' : 'Quests' },
    { id: 'arena', icon: Trophy, label: language === 'id' ? 'Arena' : 'Arena' },
    { id: 'social', icon: Users, label: language === 'id' ? 'Sosial' : 'Social' },
    { id: 'profile', icon: User, label: language === 'id' ? 'Profil' : 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[80] bg-white border-t border-slate-200 pb-2 sm:pb-3 w-full max-w-md mx-auto">
      <div className="flex justify-around items-center h-16 px-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="relative flex flex-col items-center justify-center w-full h-full cursor-pointer min-w-0"
            >
              <div
                className={`flex flex-col items-center justify-center px-2.5 sm:px-3 py-1.5 rounded-full transition-colors ${
                  isActive
                    ? 'bg-[#0D1117] text-white'
                    : 'bg-transparent text-slate-500 hover:text-[#0D1117]'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5 shrink-0" />
                <span className="text-[10px] font-bold leading-none truncate">
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
