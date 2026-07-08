import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Replace the root div of Dashboard to match LandingPage style
pattern = r"<div className=\"min-h-screen text-slate-800 font-sans relative overflow-hidden transition-colors selection:bg-emerald-500 selection:text-white pb-12\" style=\{\{ backgroundColor: '#f8fafc', backgroundImage: 'radial-gradient\(#cbd5e1 1\.5px, transparent 1\.5px\)', backgroundSize: '18px 18px' \}\}>"

replacement = r"""<div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-200/50 overflow-x-hidden relative pb-12">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Glow Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-3xl"></div>
        
        {/* Cyber Grid Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] opacity-40"></div>
      </div>"""

content = re.sub(pattern, replacement, content)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Dashboard background patched.")
