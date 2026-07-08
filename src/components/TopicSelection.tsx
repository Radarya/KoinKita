import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ShieldAlert, ChefHat, Leaf, MessageSquareText, Lock, Play } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import { playClick } from '../lib/audio';

interface TopicSelectionProps {
  onSelect: (gameId: string) => void;
  onBack: () => void;
  userLevel: number;
}

export function TopicSelection({ onSelect, onBack, userLevel }: TopicSelectionProps) {
  const { language, t } = useTranslation();

  const getLevelName = (lvl: number, lang: 'id' | 'en') => {
    switch (lvl) {
      case 5: return lang === 'id' ? 'Master Kekayaan 👑' : 'Wealth Master 👑';
      case 4: return lang === 'id' ? 'Ahli Anggaran 💎' : 'Budget Expert 💎';
      case 3: return lang === 'id' ? 'Investor Cerdas 🏅' : 'Smart Investor 🏅';
      case 2: return lang === 'id' ? 'Bijak Belanja 🥇' : 'Wise Spender 🥇';
      case 1: return lang === 'id' ? 'Sadar Finansial 🥈' : 'Financially Aware 🥈';
      default: return lang === 'id' ? 'Pemula 🥉' : 'Beginner 🥉';
    }
  };

  const topics = [
    {
      id: "detektif-cuan",
      title: t.detektifCuanTitle,
      description: t.detektifCuanDesc,
      icon: <ShieldAlert className="w-8 h-8 text-blue-500" />,
      color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300",
      unlockLevel: 0,
      topicName: language === 'id' ? "Keamanan Digital" : "Digital Security"
    },
    {
      id: "fin-wordle",
      title: t.tebakKataTitle,
      description: t.tebakKataDesc,
      icon: <MessageSquareText className="w-8 h-8 text-amber-500" />,
      color: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300",
      unlockLevel: 0,
      topicName: language === 'id' ? "Istilah Finansial" : "Financial Terms"
    },
    {
      id: "koki-anggaran",
      title: t.kokiAnggaranTitle,
      description: t.kokiAnggaranDesc,
      icon: <ChefHat className="w-8 h-8 text-emerald-500" />,
      color: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300",
      unlockLevel: 2,
      topicName: language === 'id' ? "Manajemen Anggaran" : "Budget Management"
    },
    {
      id: "pohon-aset",
      title: t.pohonAsetTitle,
      description: t.pohonAsetDesc,
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      color: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300",
      unlockLevel: 3,
      topicName: language === 'id' ? "Investasi Dasar" : "Basic Investing"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => {
            playClick();
            onBack();
          }}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-8 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
          {language === 'id' ? 'Kembali ke Lobi' : 'Back to Lobby'}
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-poppins font-black text-slate-800 mb-2">
            {language === 'id' ? 'Pilih Topik' : 'Choose a Topic'}
          </h1>
          <p className="text-slate-500">
            {language === 'id' ? 'Pilih mini-game kuis untuk mengasah insting keuanganmu!' : 'Select a quiz mini-game to sharpen your financial instinct!'}
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {topics.map((topic, index) => {
            const isLocked = userLevel < topic.unlockLevel;
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  if (!isLocked) {
                    playClick();
                    onSelect(topic.id);
                  }
                }}
                className={`relative overflow-hidden rounded-2xl border-2 transition-all p-5 sm:p-6 flex items-center gap-4 sm:gap-6 ${
                  isLocked 
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-80' 
                    : `${topic.color} cursor-pointer group hover:shadow-md hover:-translate-y-1`
                }`}
              >
                <div className={`p-4 rounded-xl shrink-0 ${isLocked ? 'bg-slate-200' : 'bg-white shadow-sm'}`}>
                  {isLocked ? <Lock className="w-8 h-8 text-slate-400" /> : topic.icon}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                      {topic.topicName}
                    </span>
                    {isLocked && (
                      <span className="text-[10px] bg-slate-300 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                        {language === 'id' ? 'Liga' : 'League'} {topic.unlockLevel}
                      </span>
                    )}
                  </div>
                  <h3 className={`font-poppins font-black text-lg sm:text-xl mb-1 ${isLocked ? 'text-slate-500' : ''}`}>
                    {topic.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isLocked ? 'text-slate-400' : 'opacity-80'}`}>
                    {topic.description}
                  </p>
                </div>

                {!isLocked && (
                  <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-5 h-5 ml-1" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TopicSelection;
