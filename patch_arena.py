import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Replace Leaderboard import with Arena
content = re.sub(
    r"import Leaderboard from '\./Leaderboard';",
    r"import Arena from './Arena';",
    content
)

# Replace showLeaderboard boolean name in usage?
# The state is still `showLeaderboard`, which is fine, but we change what it returns:
content = re.sub(
    r"<Leaderboard\s+onClose=\{\(\) => setShowLeaderboard\(false\)\}\s+currentUserUid=\{user\.uid\}\s*/>",
    r"<Arena onBack={() => setShowLeaderboard(false)} currentUserUid={user.uid} userData={userData} />",
    content
)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Patched Dashboard to use Arena")
