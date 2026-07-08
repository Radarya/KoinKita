import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Remove the early return for Arena
early_return_arena = r"if \(showLeaderboard\) \{\s*return <Arena onBack=\{\(\) => setShowLeaderboard\(false\)\} currentUserUid=\{user\.uid\} userData=\{userData\} />;\s*\}"
content = re.sub(early_return_arena, "", content)

# Inject <Arena> modal near <SettingsModal>
arena_injection = """      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        onShowProfile={() => {
          setShowSettings(false);
          setShowProfile(true);
        }}
      />
      <AnimatePresence>
        {showLeaderboard && <Arena onBack={() => setShowLeaderboard(false)} currentUserUid={user.uid} userData={userData} />}
      </AnimatePresence>"""

content = content.replace("""      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        onShowProfile={() => {
          setShowSettings(false);
          setShowProfile(true);
        }}
      />""", arena_injection)

# Just to be safe, if the string matching is slightly off
content = content.replace("""      <SettingsModal 
         isOpen={showSettings} 
         onClose={() => setShowSettings(false)} 
         onShowProfile={() => {
          setShowSettings(false);
          setShowProfile(true);
        }}
      />""", arena_injection)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Arena render fixed.")
