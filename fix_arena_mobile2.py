import re

with open('src/components/Arena.tsx', 'r') as f:
    content = f.read()

# Make the share button shrink on mobile, maybe icon only on very small screens?
content = content.replace(
    '<button \n                  onClick={handleShareProfile}\n                  className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-all flex items-center gap-2 w-full md:w-auto justify-center"\n                >',
    '<button \n                  onClick={handleShareProfile}\n                  className="px-4 py-3 sm:px-6 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-all flex items-center gap-2 w-full md:w-auto justify-center shrink-0"\n                >'
)

with open('src/components/Arena.tsx', 'w') as f:
    f.write(content)

print("Arena mobile share button fixed")
