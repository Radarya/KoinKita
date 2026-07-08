import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# 1. Remove the inline {showLeaderboard && ...} block completely
inline_pattern = r"\{showLeaderboard && \([\s\S]*?<Arena onBack=\{\(\) => setShowLeaderboard\(false\)\} currentUserUid=\{user\.uid\} userData=\{userData\} />\s*\)\}"
content = re.sub(inline_pattern, "", content)

# 2. Add it to the top level returns like showProfile
view_pattern = r"if \(showTopicSelection\) \{\n    return <TopicSelection .*? />;\n  \}"
view_replacement = r"if (showTopicSelection) {\n    return <TopicSelection onSelect={(gameId) => { setShowTopicSelection(false); setActiveGame(gameId); }} onBack={() => setShowTopicSelection(false)} userLevel={userLevel} />;\n  }\n\n  if (showLeaderboard) {\n    return <Arena onBack={() => setShowLeaderboard(false)} currentUserUid={user.uid} userData={userData} />;\n  }"
content = re.sub(view_pattern, view_replacement, content)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Patched Dashboard to render Arena as full page")
