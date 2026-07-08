import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

pattern = re.compile(r"\{/\* Elegant Coins Badge \*/\}\s*<div className=\"flex items-center gap-3 bg-white p-1\.5 pl-3\.5 pr-4 rounded-2xl border border-slate-200 shadow-sm\">[\s\S]*?</div>\s*</div>\s*</div>")

replacement = """{/* Elegant Coins Badge */}
            <div className="flex items-center gap-3 bg-white p-1.5 pl-3.5 pr-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="p-1.5 bg-slate-50 rounded-full shrink-0 flex items-center justify-center">
                <Coins className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">{t.totalCoins}</p>
                <div className="font-poppins font-black text-lg text-slate-800 tracking-tight mt-0.5">
                  {isDataLoading ? (
                     <span className="w-14 h-4 bg-slate-200 animate-pulse rounded block"></span>
                  ) : (
                     displayCoins.toLocaleString('id-ID')
                  )}
                </div>
              </div>
            </div>

            {/* Lives Badge */}
            <div className="flex items-center gap-3 bg-white p-1.5 pl-3.5 pr-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="p-1.5 bg-rose-50 rounded-full shrink-0 flex items-center justify-center">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">{language === 'id' ? 'Nyawa' : 'Energy'}</p>
                <div className="font-poppins font-black text-lg text-slate-800 tracking-tight mt-0.5">
                  {isDataLoading ? (
                     <span className="w-8 h-4 bg-slate-200 animate-pulse rounded block"></span>
                  ) : (
                     <>{userData?.lives !== undefined ? userData.lives : 5}<span className="text-sm text-slate-400">/5</span></>
                  )}
                </div>
              </div>
            </div>

            {/* Inbox Button */}
            <button 
              onClick={() => {
                playClick();
                setShowInbox(true);
              }}
              className="p-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95 relative"
            >
              <Bell className="w-6 h-6 text-slate-600" />
              {/* Optional: Add unread badge here if you implement unread count later */}
            </button>
          </div>"""

if pattern.search(content):
    content = pattern.sub(replacement, content)
    with open('src/components/Dashboard.tsx', 'w') as f:
        f.write(content)
    print("Dashboard header patched with Lives and Inbox.")
else:
    print("Pattern not found for header patch.")
