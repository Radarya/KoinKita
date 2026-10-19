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
      case 5: return lang === 'id' ? 'Master Kekayaan' : 'Wealth Master';
      case 4: return lang === 'id' ? 'Ahli Anggaran' : 'Budget Expert';
      case 3: return lang === 'id' ? 'Investor Cerdas' : 'Smart Investor';
      case 2: return lang === 'id' ? 'Bijak Belanja' : 'Wise Spender';
      case 1: return lang === 'id' ? 'Sadar Finansial' : 'Financially Aware';
      default: return lang === 'id' ? 'Pemula' : 'Beginner';
    }
  };

  const topics = [
    {
      id: "detektif-cuan",
      title: t.detektifCuanTitle,
      description: t.detektifCuanDesc,
      icon: <ShieldAlert className="w-8 h-8 text-blue-600" />,
      color: "bg-white border-slate-200 text-slate-800 hover:border-blue-400",
      unlockLevel: 0,
      topicName: language === 'id' ? "Keamanan Digital" : "Digital Security"
    },
    {
      id: "fin-wordle",
      title: t.tebakKataTitle,
      description: t.tebakKataDesc,
      icon: <MessageSquareText className="w-8 h-8 text-amber-600" />,
      color: "bg-white border-slate-200 text-slate-800 hover:border-amber-400",
      unlockLevel: 0,
      topicName: language === 'id' ? "Istilah Finansial" : "Financial Terms"
    },
    {
      id: "koki-anggaran",
      title: t.kokiAnggaranTitle,
      description: t.kokiAnggaranDesc,
      icon: <ChefHat className="w-8 h-8 text-emerald-600" />,
      color: "bg-white border-slate-200 text-slate-800 hover:border-emerald-400",
      unlockLevel: 2,
      topicName: language === 'id' ? "Manajemen Anggaran" : "Budget Management"
    },
    {
      id: "pohon-aset",
      title: t.pohonAsetTitle,
      description: t.pohonAsetDesc,
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      color: "bg-white border-slate-200 text-slate-800 hover:border-green-400",
      unlockLevel: 3,
      topicName: language === 'id' ? "Investasi Dasar" : "Basic Investing"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => {
            playClick();
            onBack();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-slate-900 font-bold mb-8 transition-colors cursor-pointer text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          {language === 'id' ? 'Kembali ke Lobi' : 'Back to Lobby'}
        </button>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">
            {language === 'id' ? 'Pilih Topik Pembelajaran' : 'Choose a Learning Topic'}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {language === 'id' ? 'Pilih simulasi kuis untuk mengasah insting dan literasi keuanganmu.' : 'Select a quiz simulation to sharpen your financial instinct and literacy.'}
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {topics.map((topic, index) => {
            const isLocked = userLevel < topic.unlockLevel;
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  if (!isLocked) {
                    playClick();
                    onSelect(topic.id);
                  }
                }}
                className={`rounded-2xl border transition-colors p-5 sm:p-6 flex items-center gap-4 sm:gap-6 ${
                  isLocked 
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                    : `${topic.color} cursor-pointer group`
                }`}
              >
                <div className={`p-3.5 rounded-2xl shrink-0 ${isLocked ? 'bg-slate-200' : 'bg-slate-100'}`}>
                  {isLocked ? <Lock className="w-7 h-7 text-slate-400" /> : topic.icon}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {topic.topicName}
                    </span>
                    {isLocked && (
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                        {language === 'id' ? 'Buka di Liga' : 'Unlocks at League'} {topic.unlockLevel}
                      </span>
                    )}
                  </div>
                  <h3 className={`font-black text-lg text-slate-900 mb-1 ${isLocked ? 'text-slate-500' : ''}`}>
                    {topic.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isLocked ? 'text-slate-400' : 'text-slate-600'}`}>
                    {topic.description}
                  </p>
                </div>

                {!isLocked && (
                  <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0">
                    <Play className="w-4 h-4 ml-0.5" />
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
