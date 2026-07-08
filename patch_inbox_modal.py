with open('src/components/InboxModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("msgs.sort((a, b) => b.createdAt - a.createdAt);", "msgs.sort((a: any, b: any) => b.createdAt - a.createdAt);")

with open('src/components/InboxModal.tsx', 'w') as f:
    f.write(content)
print("InboxModal.tsx patched.")
