with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("const [showTopicSelection, setShowTopicSelection] = useState(false);", "const [showTopicSelection, setShowTopicSelection] = useState(false);\n  const [showInbox, setShowInbox] = useState(false);")

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
print("Dashboard.tsx state patched.")
