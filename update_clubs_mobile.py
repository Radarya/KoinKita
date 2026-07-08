import re

with open('src/components/ClubsTab.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="flex gap-2">',
    '<div className="flex flex-col sm:flex-row gap-2">'
)
content = content.replace(
    '<button \n                onClick={handleDonate}\n                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all"\n              >',
    '<button \n                onClick={handleDonate}\n                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shrink-0"\n              >'
)

with open('src/components/ClubsTab.tsx', 'w') as f:
    f.write(content)

print("ClubsTab updated for mobile")
