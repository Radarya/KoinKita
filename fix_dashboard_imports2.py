import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("  doc,", "  collection, query, where, getDocs, doc,")

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

with open('src/components/UserProfile.tsx', 'r') as f:
    profile_content = f.read()

# Let's see if QRCodeSVG is there
if "import { QRCodeSVG }" not in profile_content:
    profile_content = profile_content.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\nimport { QRCodeSVG } from 'qrcode.react';")
else:
    print("QRCodeSVG already in UserProfile.tsx?")

with open('src/components/UserProfile.tsx', 'w') as f:
    f.write(profile_content)

print("Imports fixed again")
