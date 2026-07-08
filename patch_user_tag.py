import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add a check inside the fetchUserData useEffect
pattern = r"if \(calculated > dbLevel && dbLevel !== undefined\) \{"
replacement = """if (!data.tag) {
              const newTag = Math.floor(1000 + Math.random() * 9000).toString();
              try {
                await updateDoc(docRef, { tag: newTag });
                data.tag = newTag;
              } catch (e) {
                console.error("Failed to update user tag:", e);
              }
            }
            if (calculated > dbLevel && dbLevel !== undefined) {"""

if "if (!data.tag)" not in content:
    content = content.replace(pattern, replacement)
    with open('src/components/Dashboard.tsx', 'w') as f:
        f.write(content)
    print("User tag generation added.")
