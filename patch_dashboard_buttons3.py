import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'text-emerald-500 truncate max-w-[120px] sm:max-w-[200px] md:max-w-[280px] block',
    'text-slate-800 truncate max-w-[120px] sm:max-w-[200px] md:max-w-[280px] block'
)

content = content.replace(
    'text-[11px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md tracking-wider',
    'text-[11px] font-black uppercase bg-slate-800 text-white px-2 py-0.5 rounded-md tracking-wider'
)

content = content.replace(
    'w-7 h-7 text-emerald-500',
    'w-7 h-7 text-slate-400'
)

# And for the QUICK PLAY button
content = content.replace(
    'group relative px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[2rem] shadow-xl shadow-emerald-500/30 font-black text-lg sm:text-xl cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-4 overflow-hidden',
    'group relative px-10 py-5 bg-slate-800 hover:bg-slate-900 text-white rounded-[2rem] shadow-xl shadow-slate-900/20 font-black text-lg sm:text-xl cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-4 overflow-hidden'
)

# The icon color inside gamepad
content = content.replace(
    '<Gamepad2 className="w-16 h-16 text-emerald-500" />',
    '<Gamepad2 className="w-16 h-16 text-slate-800" />'
)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Cleaned up Dashboard UI texts and icons")
