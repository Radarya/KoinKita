with open('src/components/Dashboard.tsx', 'r') as f:
    dashboard_content = f.read()

# Fix firebase imports in Dashboard
dashboard_content = dashboard_content.replace("import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';", "import { doc, onSnapshot, updateDoc, arrayUnion, collection, query, where, getDocs } from 'firebase/firestore';")

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(dashboard_content)

with open('src/components/UserProfile.tsx', 'r') as f:
    profile_content = f.read()

if "import { QRCodeSVG }" not in profile_content:
    profile_content = profile_content.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\nimport { QRCodeSVG } from 'qrcode.react';")

with open('src/components/UserProfile.tsx', 'w') as f:
    f.write(profile_content)

print("Imports fixed")
