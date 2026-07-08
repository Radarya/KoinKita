import re

with open('src/components/UserProfile.tsx', 'r') as f:
    content = f.read()

content = content.replace("<button <button", "<button")

with open('src/components/UserProfile.tsx', 'w') as f:
    f.write(content)

print("Syntax fixed")
