import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Replace main grid and footer
pattern = re.compile(r"<main className=\"flex-grow flex flex-col items-center justify-center space-y-12\">.*?</main>\s*\{/\* ================= FOOTER / CONTROLS ================= \*/\}\s*<footer className=\"mt-16 pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0\">.*?</footer>", re.DOTALL)

replacement = """<main className="flex-grow flex flex-col items-center justify-center w-full px-4 sm:px-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center text-center mt-4 sm:mt-8 w-full"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10 border-2 border-emerald-50 mb-6 sm:mb-8">
              <Gamepad2 className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-500" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-poppins font-black text-slate-800 mb-3 tracking-tight">
              {language === 'id' ? 'Selamat Datang di KoinKita' : 'Welcome to KoinKita'}
            </h2>
            <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 text-sm sm:text-base leading-relaxed px-4">
              {language === 'id' 
                ? 'Petualangan finansialmu dimulai di sini. Tingkatkan literasi dan jadilah master pengelola keuangan.' 
                : 'Your financial adventure starts here. Improve your literacy and become a money management master.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 w-full max-w-4xl mx-auto px-2">
              
              {/* Main Action - Quick Play */}
              <button 
                onClick={() => {
                  playClick();
                  setShowTopicSelection(true);
                }}
                className="sm:col-span-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[2rem] p-6 sm:p-8 flex items-center justify-between shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden text-left"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <div className="flex items-center gap-4 sm:gap-5 relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/20">
                    <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">{language === 'id' ? 'MULAI MAIN' : 'QUICK PLAY'}</h3>
                    <p className="text-emerald-50 font-medium text-xs sm:text-sm mt-1 opacity-90">{language === 'id' ? 'Lanjutkan petualangan finansialmu' : 'Continue your financial adventure'}</p>
                  </div>
                </div>
                <ChevronRight className="w-8 h-8 relative z-10 opacity-70 group-hover:opacity-100 group-hover:translate-x-2 transition-all hidden sm:block" />
              </button>

              {/* Misi Harian */}
              <button 
                onClick={() => {
                  playClick();
                  setShowDailyQuests(true);
                }}
                className="sm:col-span-2 bg-white border-2 border-slate-100 hover:border-orange-200 hover:bg-orange-50 rounded-[2rem] p-5 sm:p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all active:scale-95 group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Gift className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="font-bold text-slate-700 text-sm sm:text-base">{language === 'id' ? 'Misi Harian' : 'Daily Quests'}</span>
              </button>

              {/* Arena */}
              <button 
                onClick={() => {
                  playClick();
                  setShowLeaderboard(true);
                }}
                className="sm:col-span-2 bg-white border-2 border-slate-100 hover:border-amber-200 hover:bg-amber-50 rounded-[2rem] p-5 sm:p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all active:scale-95 group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="font-bold text-slate-700 text-sm sm:text-base">{language === 'id' ? 'Arena & Sosial' : 'Arena & Social'}</span>
              </button>

              {/* Pencapaian */}
              <button 
                onClick={() => {
                  playClick();
                  setShowAchievements(true);
                }}
                className="sm:col-span-2 bg-white border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 rounded-[2rem] p-5 sm:p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all active:scale-95 group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 text-indigo-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Medal className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="font-bold text-slate-700 text-sm sm:text-base">{language === 'id' ? 'Pencapaian' : 'Achievements'}</span>
              </button>

              {/* Small utilities container */}
              <div className="sm:col-span-2 grid grid-cols-2 grid-rows-2 gap-3">
                <button 
                  onClick={handleShare}
                  className="col-span-1 row-span-1 bg-white border-2 border-slate-100 hover:bg-emerald-50 hover:border-emerald-200 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow transition-all group p-3 active:scale-95"
                >
                  <Share2 className="w-5 h-5 text-emerald-500 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-[11px] text-slate-600">{language === 'id' ? 'Bagikan' : 'Share'}</span>
                </button>
                <button 
                  onClick={() => {
                    playClick();
                    setShowSettings(true);
                  }}
                  className="col-span-1 row-span-1 bg-white border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-300 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow transition-all group p-3 active:scale-95"
                >
                  <Settings className="w-5 h-5 text-slate-500 mb-1 group-hover:rotate-45 transition-transform" />
                  <span className="font-bold text-[11px] text-slate-600">{language === 'id' ? 'Pengaturan' : 'Settings'}</span>
                </button>
                <button 
                  onClick={() => {
                    playClick();
                    setShowTermsModal(true);
                  }}
                  className="col-span-2 row-span-1 bg-white border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-300 rounded-2xl flex items-center justify-center gap-2 text-center shadow-sm hover:shadow transition-all group p-3 active:scale-95"
                >
                  <FileText className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-xs text-slate-600 group-hover:text-slate-800">{language === 'id' ? 'Aturan & Kebijakan' : 'Rules & Policy'}</span>
                </button>
              </div>

            </div>
          </motion.div>
        </main>
        
        {/* ================= FOOTER / CONTROLS ================= */}
        <footer className="mt-12 pt-6 flex flex-row items-center justify-center shrink-0 w-full">
          <button 
            onClick={() => {
              playClick();
              handleLogout();
            }}
            className="flex items-center gap-2 px-5 py-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 font-bold rounded-xl transition-all cursor-pointer text-sm active:scale-95"
          >
            <LogOut className="w-4 h-4" /> {t.logout}
          </button>
        </footer>"""

if pattern.search(content):
    content = pattern.sub(replacement, content)
    with open('src/components/Dashboard.tsx', 'w') as f:
        f.write(content)
    print("Patched Dashboard layout successfully!")
else:
    print("Pattern not found! Check regex.")

