import re

with open('src/components/UserProfile.tsx', 'r') as f:
    content = f.read()

# Remove state
content = re.sub(r"\s*const \[age, setAge\] = useState\(''\);", "", content)

# Remove setAge from fetch
content = re.sub(r"\s*setAge\(userData\.age \? String\(userData\.age\) : ''\);", "", content)

# Remove from updates
content = re.sub(r"\s*if \(age\) updates\.age = parseInt\(age\);", "", content)

# Remove UI
ui_pattern = r"<div>\s*<label className=\"block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1\.5\">\s*\{language === 'id' \? \"Umur\" : \"Age\"\}\s*</label>\s*<input\s*type=\"number\" value=\{age\} onChange=\{\(e\) => setAge\(e\.target\.value\)\}\s*className=\"w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium text-slate-700\"\s*/>\s*</div>"
content = re.sub(ui_pattern, "", content)

with open('src/components/UserProfile.tsx', 'w') as f:
    f.write(content)

print("Age removed from UserProfile")
