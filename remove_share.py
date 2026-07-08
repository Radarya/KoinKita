import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Remove handleShare function
handle_share_regex = r"const handleShare = async \(\) => \{[\s\S]*?\};\n"
content = re.sub(handle_share_regex, "", content)

# Remove the Bagikan button and adjust Pengaturan
share_btn_regex = r"<button\s+onClick=\{handleShare\}[\s\S]*?Bagikan' : 'Share'\}</span>\s*</button>"
content = re.sub(share_btn_regex, "", content)

# Adjust Pengaturan col-span to 2
content = content.replace('className="col-span-1 row-span-1 bg-white border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-300 rounded-2xl flex flex-col items-center justify-center', 'className="col-span-2 row-span-1 bg-white border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-300 rounded-2xl flex items-center justify-center gap-2 text-center')

# In Pengaturan, adjust the icon margin
content = content.replace('<Settings className="w-5 h-5 text-slate-500 mb-1 group-hover:rotate-45 transition-transform" />', '<Settings className="w-5 h-5 text-slate-500 group-hover:rotate-45 transition-transform" />')

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
print("Share button removed.")
