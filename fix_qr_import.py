with open('src/components/UserProfile.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';\nimport { QRCodeSVG } from 'qrcode.react';")

with open('src/components/UserProfile.tsx', 'w') as f:
    f.write(content)

print("QR import fixed")
