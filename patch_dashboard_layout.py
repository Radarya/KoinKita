import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Replace the buttons block starting from <button ... QUICK PLAY to the end of <div flex ... > Share button </div>

pattern = re.compile(r"<button\s+onClick=\{\(\) => \{\s*playClick\(\);\s*setShowTopicSelection\(true\);\s*\}\}\s+className=\"group relative[^\"]+\"\s*>\s*<div className=\"absolute inset-0[^\"]+\"></div>\s*<span className=\"relative z-10\">\{language === 'id' \? 'MULAI CEPAT' : 'QUICK PLAY'\}</span>\s*<ChevronRight[^\>]+/>\s*</button>\s*<div className=\"flex items-center gap-4 mt-8 flex-wrap justify-center\">\s*<button[^\>]+>\s*<Trophy[^\>]+/>\s*\{language === 'id' \? 'Arena & Sosial' : 'Arena & Social'\}\s*</button>\s*<button[^\>]+>\s*<Medal[^\>]+/>\s*\{language === 'id' \? 'Pencapaian' : 'Achievements'\}\s*</button>\s*<button[^\>]+>\s*<Share2[^\>]+/>\s*\{language === 'id' \? 'Bagikan' : 'Share'\}\s*</button>\s*</div>", re.DOTALL)

replacement = """<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full max-w-3xl mx-auto">
              <button 
                onClick={() => {
                  playClick();
                  setShowTopicSelection(true);
                }}
                className="sm:col-span-3 group relative p-6 sm:p-8 bg-slate-800 hover:bg-slate-900 text-white rounded-[2rem] shadow-xl overflow-hidden flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">{language === 'id' ? 'MULAI CEPAT' : 'QUICK PLAY'}</h3>
                    <p className="text-slate-300 font-medium text-xs sm:text-sm">{language === 'id' ? 'Lanjutkan petualanganmu' : 'Continue your adventure'}</p>
                  </div>
                </div>
                <ChevronRight className="w-8 h-8 relative z-10 group-hover:translate-x-2 transition-transform" />
              </button>
              
              <button 
                onClick={() => {
                  playClick();
                  setShowLeaderboard(true);
                }}
                className="p-5 bg-white border border-slate-200 hover:border-amber-300 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all group flex flex-col items-center text-center gap-3 active:scale-95"
              >
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6 text-amber-500" />
                </div>
                <span className="font-bold text-slate-700 text-sm">{language === 'id' ? 'Arena & Sosial' : 'Arena & Social'}</span>
              </button>

              <button 
                onClick={() => {
                  playClick();
                  setShowAchievements(true);
                }}
                className="p-5 bg-white border border-slate-200 hover:border-indigo-300 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all group flex flex-col items-center text-center gap-3 active:scale-95"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Medal className="w-6 h-6 text-indigo-500" />
                </div>
                <span className="font-bold text-slate-700 text-sm">{language === 'id' ? 'Pencapaian' : 'Achievements'}</span>
              </button>

              <button 
                onClick={handleShare}
                className="p-5 bg-white border border-slate-200 hover:border-purple-300 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all group flex flex-col items-center text-center gap-3 active:scale-95"
              >
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Share2 className="w-6 h-6 text-purple-500" />
                </div>
                <span className="font-bold text-slate-700 text-sm">{language === 'id' ? 'Bagikan' : 'Share'}</span>
              </button>
            </div>"""

if pattern.search(content):
    content = pattern.sub(replacement, content)
    with open('src/components/Dashboard.tsx', 'w') as f:
        f.write(content)
    print("Patched Dashboard layout successfully!")
else:
    print("Pattern not found! Check regex.")
