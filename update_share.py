import re

with open('src/components/Arena.tsx', 'r') as f:
    content = f.read()

old_id = "Ayo main KoinKita bareng! Tambahkan aku: ${shareUrl}"
old_en = "Let's play KoinKita! Add me: ${shareUrl}"

new_id = "👋 Hai! Ayo mabar KoinKita bareng aku! 🚀\\n\\nIni game seru banget buat belajar ngatur uang sambil nambah aset virtual kita.\\n\\nKlik link ini buat tambah aku jadi teman di game ya: \\n${shareUrl}"
new_en = "👋 Hi! Let's play KoinKita together! 🚀\\n\\nIt's a fun game to learn financial skills while growing our virtual assets.\\n\\nClick this link to add me as a friend: \\n${shareUrl}"

content = content.replace(old_id, new_id)
content = content.replace(old_en, new_en)

with open('src/components/Arena.tsx', 'w') as f:
    f.write(content)

print("Updated share text")
