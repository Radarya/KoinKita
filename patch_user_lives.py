import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

pattern = r"if \(\!data\.tag\) \{"
replacement = """if (data.lives === undefined) {
              try {
                await updateDoc(docRef, { lives: 5 });
                data.lives = 5;
              } catch (e) {
                console.error("Failed to update user lives:", e);
              }
            }
            if (!data.tag) {"""

if "if (data.lives === undefined)" not in content:
    content = content.replace(pattern, replacement)
    with open('src/components/Dashboard.tsx', 'w') as f:
        f.write(content)
    print("User lives generation added.")
