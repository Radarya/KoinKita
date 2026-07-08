import re

with open('src/components/UserProfile.tsx', 'r') as f:
    content = f.read()

content = content.replace("              <button \n<button \n                onClick={handleSaveProfile} disabled={isSaving}", "              <button \n                onClick={handleSaveProfile} disabled={isSaving}")

with open('src/components/UserProfile.tsx', 'w') as f:
    f.write(content)

print("Syntax fixed again")
