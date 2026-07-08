import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'hover:text-emerald-600 transition-colors cursor-pointer text-slate-500 hover:text-emerald-600',
    'hover:text-slate-800 transition-colors cursor-pointer text-slate-500'
)
content = content.replace(
    'hover:text-emerald-600 transition-colors cursor-pointer',
    'hover:text-slate-800 transition-colors cursor-pointer'
)
content = content.replace(
    'text-emerald-500',
    'text-slate-400'
)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Cleaned up Dashboard Footer")
