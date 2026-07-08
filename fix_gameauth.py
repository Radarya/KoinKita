import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Remove the rogue modal from GameAuth
game_auth_pattern = r'\{hasPendingFriend && \(\n\s*<div className="fixed inset-0 z-\[100\].*?</div>\n\s*\)\}'
content = re.sub(game_auth_pattern, '', content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Cleaned up rogue modals")
