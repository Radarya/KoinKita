import re

with open('src/components/Arena.tsx', 'r') as f:
    content = f.read()

# Fix header title
content = content.replace(
    "<h2 className=\"text-2xl font-black text-slate-800 tracking-tight\">\n                {language === 'id' ? 'Arena & Sosial' : 'Arena & Social'}\n              </h2>",
    "<h2 className=\"text-2xl font-black text-slate-800 tracking-tight\">\n                {mode === 'arena' ? 'Arena' : (language === 'id' ? 'Sosial' : 'Social')}\n              </h2>"
)

# Fix player ID card inline
# Replace:
# <p className="text-lg md:text-2xl font-black text-slate-800 font-poppins truncate">{userData?.displayName || userData?.name}<span className="text-slate-400">#{userData?.tag || '0000'}</span></p>
# with separate lines
content = content.replace(
    "<p className=\"text-lg md:text-2xl font-black text-slate-800 font-poppins truncate\">{userData?.displayName || userData?.name}<span className=\"text-slate-400\">#{userData?.tag || '0000'}</span></p>",
    "<div className=\"flex flex-col\">\n                      <span className=\"text-lg md:text-2xl font-black text-slate-800 font-poppins break-words leading-tight\">{userData?.displayName || userData?.name}</span>\n                      <span className=\"text-sm md:text-base font-bold text-slate-400\">#{userData?.tag || '0000'}</span>\n                    </div>"
)

with open('src/components/Arena.tsx', 'w') as f:
    f.write(content)

print("Title and Player ID fixed")
