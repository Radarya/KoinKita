import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add showSocial state
content = content.replace(
    "const [showLeaderboard, setShowLeaderboard] = useState(false);",
    "const [showLeaderboard, setShowLeaderboard] = useState(false);\n  const [showSocial, setShowSocial] = useState(false);"
)

# Render Social Arena
content = content.replace(
    "{showLeaderboard && <Arena onBack={() => setShowLeaderboard(false)} currentUserUid={user.uid} userData={userData} />}",
    "{showLeaderboard && <Arena onBack={() => setShowLeaderboard(false)} currentUserUid={user.uid} userData={userData} mode=\"arena\" initialTab=\"leaderboard\" />}\n        {showSocial && <Arena onBack={() => setShowSocial(false)} currentUserUid={user.uid} userData={userData} mode=\"social\" initialTab=\"friends\" triggerToast={triggerToast} />}"
)

# Update Big Buttons
# Arena button
content = re.sub(
    r'<span className="font-bold text-slate-700 text-sm sm:text-base">\{language === \'id\' \? \'Arena & Sosial\' : \'Arena & Social\'\}</span>',
    '<span className="font-bold text-slate-700 text-sm sm:text-base">{language === \'id\' ? \'Arena\' : \'Arena\'}</span>',
    content
)

# Social button (replacing Pencapaian)
content = re.sub(
    r'onClick=\{\(\) => \{\n\s*playClick\(\);\n\s*setShowAchievements\(true\);\n\s*\}\}',
    'onClick={() => {\n                  playClick();\n                  setShowSocial(true);\n                }}',
    content,
    count=1 # only the first one, which is the big button
)

content = re.sub(
    r'<div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 text-indigo-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">\n\s*<Medal className="w-6 h-6 sm:w-7 sm:h-7" />\n\s*</div>\n\s*<span className="font-bold text-slate-700 text-sm sm:text-base">\{language === \'id\' \? \'Pencapaian\' : \'Achievements\'\}</span>',
    '<div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">\n                  <Users className="w-6 h-6 sm:w-7 sm:h-7" />\n                </div>\n                <span className="font-bold text-slate-700 text-sm sm:text-base">{language === \'id\' ? \'Sosial\' : \'Social\'}</span>',
    content
)

# Update small utilities container to fit 3 items... wait, how is it styled?
# className="sm:col-span-2 grid grid-cols-2 grid-rows-2 gap-3"
# The first button (Settings) takes col-span-2, row-span-1.
# The second button (Rules) takes col-span-2, row-span-1. Let's make it col-span-1.
# We can make grid-cols-2, row-span-1 for settings, and col-span-1 for Rules and Achievements.

content = re.sub(
    r'className="col-span-2 row-span-1 bg-white border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-300 rounded-2xl flex items-center justify-center gap-2 text-center shadow-sm hover:shadow transition-all group p-3 active:scale-95"',
    'className="col-span-1 row-span-1 bg-white border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-300 rounded-2xl flex items-center justify-center gap-2 text-center shadow-sm hover:shadow transition-all group p-3 active:scale-95"',
    content
)

new_achievement_button = """
                <button 
                  onClick={() => {
                    playClick();
                    setShowAchievements(true);
                  }}
                  className="col-span-2 sm:col-span-2 row-span-1 bg-white border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-300 rounded-2xl flex items-center justify-center gap-2 text-center shadow-sm hover:shadow transition-all group p-3 active:scale-95"
                >
                  <Medal className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-[11px] text-slate-600">{language === 'id' ? 'Pencapaian' : 'Achievements'}</span>
                </button>
"""

# Let's see how the Rules button was written.
# Wait, let's just replace the Rules button and insert the Achievements button after it.
rules_btn = """<button 
                  onClick={() => {
                    playClick();
                    setShowTermsModal(true);
                  }}
                  className="col-span-1 row-span-1 bg-white border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-300 rounded-2xl flex items-center justify-center gap-2 text-center shadow-sm hover:shadow transition-all group p-3 active:scale-95"
                >
                  <FileText className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-[11px] text-slate-600">{language === 'id' ? 'Aturan' : 'Rules'}</span>
                </button>"""

# Replace the exact Rules button to append the Achievement button.
# Let's just use Python string replace for the whole small utilities container
container_match = re.search(r'\{/\* Small utilities container \*/\}.*?</button>\s*</div>', content, re.DOTALL)
if container_match:
    old_container = container_match.group(0)
    new_container = """{/* Small utilities container */}
              <div className="sm:col-span-2 grid grid-cols-2 grid-rows-2 gap-3">
                
                <button 
                  onClick={() => {
                    playClick();
                    setShowSettings(true);
                  }}
                  className="col-span-1 row-span-1 bg-white border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-300 rounded-2xl flex items-center justify-center gap-2 text-center shadow-sm hover:shadow transition-all group p-3 active:scale-95"
                >
                  <Settings className="w-5 h-5 text-slate-500 group-hover:rotate-45 transition-transform" />
                  <span className="font-bold text-[11px] text-slate-600">{language === 'id' ? 'Pengaturan' : 'Settings'}</span>
                </button>
                
                <button 
                  onClick={() => {
                    playClick();
                    setShowTermsModal(true);
                  }}
                  className="col-span-1 row-span-1 bg-white border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-300 rounded-2xl flex items-center justify-center gap-2 text-center shadow-sm hover:shadow transition-all group p-3 active:scale-95"
                >
                  <FileText className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-[11px] text-slate-600">{language === 'id' ? 'Aturan' : 'Rules'}</span>
                </button>

                <button 
                  onClick={() => {
                    playClick();
                    setShowAchievements(true);
                  }}
                  className="col-span-2 row-span-1 bg-white border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-300 rounded-2xl flex items-center justify-center gap-2 text-center shadow-sm hover:shadow transition-all group p-3 active:scale-95"
                >
                  <Medal className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-[11px] text-slate-600">{language === 'id' ? 'Pencapaian' : 'Achievements'}</span>
                </button>
              </div>"""
    content = content.replace(old_container, new_container)


with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Dashboard layout updated")
