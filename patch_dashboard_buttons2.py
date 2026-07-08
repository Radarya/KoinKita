import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl font-bold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95',
    'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-bold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95'
)
content = content.replace(
    'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl font-bold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95',
    'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-bold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95'
)
content = content.replace(
    'bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-bold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95',
    'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-bold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95'
)

# Header bg
content = content.replace(
    'bg-white p-6 rounded-[2rem] border border-slate-150/60 shadow-sm gap-6 relative overflow-hidden',
    'bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-200 shadow-sm gap-6 relative overflow-hidden'
)

# Main Hero Icon
content = content.replace(
    'w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] mb-8',
    'w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 mb-8'
)

# User avatar bg
content = content.replace(
    'border-[3px] border-emerald-500/10 group-hover:border-emerald-500 bg-emerald-50',
    'border-[3px] border-slate-200 group-hover:border-slate-400 bg-white'
)
content = content.replace(
    'text-emerald-500 fill-emerald-500',
    'text-amber-500 fill-amber-500'
)

# Elegant Coins Badge
content = content.replace(
    'bg-[#eefcf7] p-1.5 pl-3.5 pr-4 rounded-2xl border border-[#cef4e6]',
    'bg-white p-1.5 pl-3.5 pr-4 rounded-2xl border border-slate-200'
)
content = content.replace(
    'bg-[#d8f8ed]',
    'bg-slate-50'
)
content = content.replace(
    'text-[9px] font-bold text-emerald-700',
    'text-[9px] font-bold text-slate-500'
)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Cleaned up Dashboard UI buttons and header")
