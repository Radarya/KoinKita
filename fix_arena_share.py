import re

with open('src/components/Arena.tsx', 'r') as f:
    content = f.read()

# Replace navigator.share call
old_share = "await navigator.share({ title: 'KoinKita', text, url: shareUrl });"
new_share = "await navigator.share({ title: 'KoinKita', text: text });" # Omit url property so text is fully passed to WhatsApp

content = content.replace(old_share, new_share)

with open('src/components/Arena.tsx', 'w') as f:
    f.write(content)

print("Fixed Arena share logic")
