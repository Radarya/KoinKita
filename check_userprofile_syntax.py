with open('src/components/UserProfile.tsx', 'r') as f:
    content = f.read()

lines = content.split('\n')
for i, line in enumerate(lines[275:285]):
    print(f"{i + 276}: {line}")
