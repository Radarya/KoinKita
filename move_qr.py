import re

# Remove QR from Arena
with open('src/components/Arena.tsx', 'r') as f:
    arena_content = f.read()

qr_import_regex = r"import \{ QRCodeSVG \} from 'qrcode\.react';\n"
arena_content = re.sub(qr_import_regex, "", arena_content)

qr_element_regex = r"<div className=\"w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 p-1 shrink-0\">\s*<QRCodeSVG value=\{\`\$\{window\.location\.origin\}/add/\$\{userData\?\.tag\}\`\} size=\{70\} />\s*</div>"
arena_content = re.sub(qr_element_regex, """<div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <UserPlus className="w-8 h-8 text-slate-400" />
                  </div>""", arena_content)

with open('src/components/Arena.tsx', 'w') as f:
    f.write(arena_content)


# Add QR to UserProfile
with open('src/components/UserProfile.tsx', 'r') as f:
    profile_content = f.read()

if "QRCodeSVG" not in profile_content:
    profile_content = profile_content.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\nimport { QRCodeSVG } from 'qrcode.react';")

# Find a place to put the QR code in Data Diri. We can put it next to the Avatar or just as a new block.
# Let's add it right before the "Simpan Perubahan" button.
qr_injection = """
              <div className="bg-emerald-50 p-4 rounded-2xl flex items-center justify-between border border-emerald-100">
                <div>
                  <h3 className="text-sm font-bold text-emerald-800">{language === 'id' ? 'QR Teman' : 'Friend QR'}</h3>
                  <p className="text-[10px] text-emerald-600 mb-2">{language === 'id' ? 'Scan untuk tambah teman' : 'Scan to add friend'}</p>
                  <div className="text-xs font-black text-slate-800 bg-white px-2 py-1 rounded inline-block shadow-sm">
                    {user?.displayName || name}#{userTag}
                  </div>
                </div>
                <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-sm p-1">
                  <QRCodeSVG value={`${window.location.origin}/add/${userTag}`} size={70} />
                </div>
              </div>
              <button 
"""
profile_content = profile_content.replace("<button \n                onClick={handleSaveProfile}", qr_injection + "<button \n                onClick={handleSaveProfile}")

# We need to pass userTag into UserProfile or fetch it from user data
# Wait, let's see what props UserProfile has.
with open('src/components/UserProfile.tsx', 'w') as f:
    f.write(profile_content)

print("QR code moved.")
