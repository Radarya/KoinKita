import re

with open('src/components/Arena.tsx', 'r') as f:
    content = f.read()

tabs_section = """
          <div className="flex bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
            {mode === 'arena' && (
              <button 
                onClick={() => { playClick(); setActiveTab('leaderboard'); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'leaderboard' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Trophy className="w-4 h-4" /> {language === 'id' ? 'Peringkat' : 'Rankings'}
              </button>
            )}
            {mode === 'social' && (
              <>
                <button 
                  onClick={() => { playClick(); setActiveTab('friends'); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'friends' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Users className="w-4 h-4" /> {language === 'id' ? 'Teman' : 'Friends'}
                </button>
                <button 
                  onClick={() => { playClick(); setActiveTab('clubs'); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'clubs' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Swords className="w-4 h-4" /> {language === 'id' ? 'Klub Finansial' : 'Finance Clubs'}
                </button>
              </>
            )}
          </div>
"""

content = re.sub(
    r'<div className="flex bg-slate-100 p-1\.5 rounded-2xl overflow-x-auto">.*?</div>',
    tabs_section.strip(),
    content,
    flags=re.DOTALL
)

with open('src/components/Arena.tsx', 'w') as f:
    f.write(content)

print("Arena tabs replaced")
