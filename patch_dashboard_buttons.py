import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

pattern = r"(<ChevronRight className=\"w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform\" />\s*</button>)"
replacement = r"""\1
            
            <div className="flex items-center gap-4 mt-8 flex-wrap justify-center">
              <button 
                onClick={() => {
                  playClick();
                  setShowLeaderboard(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl font-bold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
              >
                <Trophy className="w-5 h-5 text-amber-500" />
                {language === 'id' ? 'Arena & Sosial' : 'Arena & Social'}
              </button>
              
              <button 
                onClick={() => {
                  playClick();
                  setShowAchievements(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl font-bold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
              >
                <Medal className="w-5 h-5 text-indigo-500" />
                {language === 'id' ? 'Pencapaian' : 'Achievements'}
              </button>

              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-bold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
              >
                <Share2 className="w-5 h-5 text-purple-500" />
                {language === 'id' ? 'Bagikan' : 'Share'}
              </button>
            </div>"""

content = re.sub(pattern, replacement, content)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Added Arena and other buttons to Dashboard")
