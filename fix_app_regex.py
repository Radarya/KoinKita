import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# First, remove the wrongly placed banner from App component
wrong_banner_pattern = r'\{hasPendingFriend && \(\n\s*<div className="bg-emerald-500 text-white.*?\n\s*</div>\n\s*\)\}'
content = re.sub(wrong_banner_pattern, '', content, flags=re.DOTALL)

# Find LandingPage function and insert it there
landing_start = content.find('function LandingPage')
landing_content = content[landing_start:]
app_content = content[:landing_start]

banner_html = """
      {hasPendingFriend && (
        <div className="bg-emerald-500 text-white py-3 px-4 text-center font-bold sticky top-0 z-50 flex items-center justify-center gap-2 shadow-md">
          <span className="text-xl">👋</span> {language === 'id' ? 'Kamu diundang untuk bermain bersama teman! Daftar atau Masuk untuk terhubung.' : 'You have been invited to play with a friend! Register or Login to connect.'}
        </div>
      )}
"""

landing_content = re.sub(
    r'(return \(\s*<div.*?className="min-h-screen.*?>)',
    r'\1\n' + banner_html,
    landing_content,
    count=1,
    flags=re.DOTALL
)

content = app_content + landing_content

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("App.tsx fixed")
