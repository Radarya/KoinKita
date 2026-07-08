import re

with open('src/components/Arena.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "{player.displayName || player.name || 'Anonymous'}",
    "{player.displayName || player.name || player.fullName || 'Pemain'}"
)

with open('src/components/Arena.tsx', 'w') as f:
    f.write(content)

print("Fixed Anonymous issue")
