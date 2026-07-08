import re

with open('src/components/Arena.tsx', 'r') as f:
    content = f.read()

old_id = "Ini game seru banget buat belajar ngatur uang sambil nambah aset virtual kita."
old_en = "It's a fun game to learn financial skills while growing our virtual assets."

new_id = "Ini game seru banget buat belajar ngatur uang biar kita makin cerdas finansial."
new_en = "It's a fun game to learn financial skills and get smarter with our money."

content = content.replace(old_id, new_id)
content = content.replace(old_en, new_en)

with open('src/components/Arena.tsx', 'w') as f:
    f.write(content)

print("Updated share text to remove virtual assets mention")
