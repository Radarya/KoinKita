import re
with open('src/components/UserProfile.tsx', 'r') as f:
    content = f.read()

content = content.replace("const [isUploading, setIsUploading] = useState(false);", "const [isUploading, setIsUploading] = useState(false);\n  const userTag = userData?.tag || '0000';")

with open('src/components/UserProfile.tsx', 'w') as f:
    f.write(content)
print("userTag fixed")
