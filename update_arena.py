import re

with open('src/components/Arena.tsx', 'r') as f:
    content = f.read()

# Add initialTab prop
content = content.replace("interface ArenaProps {", "interface ArenaProps {\n  initialTab?: 'leaderboard' | 'friends' | 'clubs';\n  mode?: 'arena' | 'social';")

content = content.replace("export default function Arena({ onBack, currentUserUid, userData, triggerToast }: ArenaProps) {", "export default function Arena({ onBack, currentUserUid, userData, triggerToast, initialTab = 'leaderboard', mode = 'arena' }: ArenaProps) {")

content = content.replace("const [activeTab, setActiveTab] = useState<'leaderboard' | 'friends' | 'clubs'>('leaderboard');", "const [activeTab, setActiveTab] = useState<'leaderboard' | 'friends' | 'clubs'>(initialTab);")

# Update tabs rendering conditionally based on mode
tabs_section = """
          <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 mb-6 shrink-0 overflow-x-auto">
            {mode === 'arena' && (
              <button 
                onClick={() => { playClick(); setActiveTab('leaderboard'); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'leaderboard' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Trophy className={`w-4 h-4 ${activeTab === 'leaderboard' ? 'text-amber-500' : ''}`} /> 
                {language === 'id' ? 'Peringkat' : 'Rankings'}
              </button>
            )}
            {mode === 'social' && (
              <>
                <button 
                  onClick={() => { playClick(); setActiveTab('friends'); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'friends' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Users className={`w-4 h-4 ${activeTab === 'friends' ? 'text-blue-500' : ''}`} /> 
                  {language === 'id' ? 'Teman' : 'Friends'}
                </button>
                <button 
                  onClick={() => { playClick(); setActiveTab('clubs'); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'clubs' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Swords className={`w-4 h-4 ${activeTab === 'clubs' ? 'text-emerald-500' : ''}`} /> 
                  {language === 'id' ? 'Klub' : 'Clubs'}
                </button>
              </>
            )}
          </div>
"""

# We need to replace the old tab section
content = re.sub(
    r'<div className="bg-slate-100 p-1\.5 rounded-2xl flex gap-1 mb-6 shrink-0 overflow-x-auto">.*?</div>',
    tabs_section.strip(),
    content,
    flags=re.DOTALL
)

# Header Title change
content = re.sub(
    r'<h2 className="text-xl font-black text-slate-800 font-poppins">.*?</h2>',
    '<h2 className="text-xl font-black text-slate-800 font-poppins">{mode === \'arena\' ? (language === \'id\' ? \'Arena\' : \'Arena\') : (language === \'id\' ? \'Sosial\' : \'Social\')}</h2>',
    content
)

with open('src/components/Arena.tsx', 'w') as f:
    f.write(content)

print("Arena updated with mode prop")
