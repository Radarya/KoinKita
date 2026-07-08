import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Update LandingPage signature
content = content.replace(
    "function LandingPage({ onStart }: { onStart: () => void }) {",
    "function LandingPage({ onStart, hasPendingFriend }: { onStart: () => void, hasPendingFriend?: boolean }) {"
)

banner_html = """
      {hasPendingFriend && (
        <div className="bg-emerald-500 text-white py-3 px-4 text-center font-bold sticky top-0 z-50 flex items-center justify-center gap-2 shadow-md">
          <span className="text-xl">👋</span> {language === 'id' ? 'Kamu diundang untuk bermain bersama teman! Daftar atau Masuk untuk terhubung.' : 'You have been invited to play with a friend! Register or Login to connect.'}
        </div>
      )}
"""

# Find return (
#       <div
# inside LandingPage
content = re.sub(
    r'(return \(\s*<div.*?className="min-h-screen.*?>)',
    r'\1\n' + banner_html,
    content,
    count=1,
    flags=re.DOTALL
)

# Pass hasPendingFriend to LandingPage
content = content.replace(
    "<LandingPage onStart={() => setCurrentScreen(currentUser ? 'app' : 'auth')} />",
    "<LandingPage onStart={() => setCurrentScreen(currentUser ? 'app' : 'auth')} hasPendingFriend={!!localStorage.getItem('pendingFriendRequest')} />"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Landing banner added")
