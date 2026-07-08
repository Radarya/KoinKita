import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# 1. Remove buttons from header (from <button for DailyQuests up to </motion.header>)
header_pattern = r'(<div className="font-poppins font-black text-lg text-slate-800 tracking-tight mt-0\.5">.*?</div>\s*</div>\s*</div>)\s*<button.*?</div>\s*</motion\.header>'
header_replacement = r'\1\n          </div>\n        </motion.header>'
content = re.sub(header_pattern, header_replacement, content, flags=re.DOTALL)

# 2. Replace MAIN SPACIOUS MENU GRID with simple Mulai Cepat button
main_pattern = r'({\s*/\*\s*================= MAIN SPACIOUS MENU GRID =================\s*\*/\s*})(.*?)({\s*/\*\s*================= FOOTER / CONTROLS =================\s*\*/\s*})'
main_replacement = r'''\1
        <main className="flex-grow flex flex-col items-center justify-center space-y-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center text-center mt-8 sm:mt-12"
          >
            <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] mb-8">
              <Gamepad2 className="w-16 h-16 text-emerald-500" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-poppins font-black text-slate-800 mb-4 tracking-tight">
              {language === 'id' ? 'Selamat Datang di KoinKita' : 'Welcome to KoinKita'}
            </h2>
            <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 text-sm sm:text-base leading-relaxed">
              {language === 'id' 
                ? 'Petualangan finansialmu dimulai di sini. Tingkatkan literasi dan jadilah master pengelola keuangan.' 
                : 'Your financial adventure starts here. Improve your literacy and become a money management master.'}
            </p>

            <button
              onClick={() => {
                playClick();
                setTutorialGameId('koki-anggaran');
              }}
              className="group relative px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[2rem] shadow-xl shadow-emerald-500/30 font-black text-lg sm:text-xl cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-4 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative z-10">{language === 'id' ? 'MULAI CEPAT' : 'QUICK PLAY'}</span>
              <ChevronRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </main>
        \3'''
content = re.sub(main_pattern, main_replacement, content, flags=re.DOTALL)

# 3. Add Settings and Daily Quests to Footer
footer_pattern = r'(<footer className="mt-16 pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">.*?<div className="flex items-center gap-6">.*?)(</button>\s*</div>)'
footer_replacement = r'''\1</button>
            <button 
              onClick={() => {
                playClick();
                setShowDailyQuests(true);
              }}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
            >
              <Gift className="w-4 h-4 text-emerald-500" /> {language === 'id' ? "Misi Harian" : "Daily Quests"}
            </button>
            <button 
              onClick={() => {
                playClick();
                setShowSettings(true);
              }}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-emerald-500" /> {language === 'id' ? "Pengaturan" : "Settings"}
            </button>
          </div>'''
content = re.sub(footer_pattern, footer_replacement, content, flags=re.DOTALL)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Patch applied.")
