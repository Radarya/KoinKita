import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

if "Users" not in content[:500]:
    content = content.replace("  Trophy,", "  Trophy,\n  Users,")

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Users imported")
