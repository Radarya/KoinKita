import re

with open('src/components/Arena.tsx', 'r') as f:
    content = f.read()

import_statement = "import { QRCodeSVG } from 'qrcode.react';\n"
if "QRCodeSVG" not in content:
    content = content.replace("import { playClick } from '../lib/audio';", "import { playClick } from '../lib/audio';\n" + import_statement)

qr_pattern = re.compile(r"<div className=\"bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between shrink-0\">\s*<div className=\"flex items-center gap-4\">\s*<div className=\"w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center\">\s*<UserPlus className=\"w-8 h-8 text-slate-400\" />\s*</div>")

qr_replacement = """<div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 p-1 shrink-0">
                    <QRCodeSVG value={`${window.location.origin}/add/${userData?.tag}`} size={70} />
                  </div>"""

if qr_pattern.search(content):
    content = qr_pattern.sub(qr_replacement, content)
    with open('src/components/Arena.tsx', 'w') as f:
        f.write(content)
    print("QR Code added to Arena.")
else:
    print("Pattern not found for QR code injection.")
