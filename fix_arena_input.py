import re

with open('src/components/Arena.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<button \n                  onClick={handleAddFriend}\n                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all"\n                >',
    '<button \n                  onClick={handleAddFriend}\n                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shrink-0"\n                >'
)

with open('src/components/Arena.tsx', 'w') as f:
    f.write(content)

print("Add button shrink fixed")
