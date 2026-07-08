import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Inside onSnapshot
# if (docSnap.exists()) {
#   const data = docSnap.data();
#   ...
#   setUserData(data);

injection = """
            if (!data.tag) {
               const newTag = Math.floor(1000 + Math.random() * 9000).toString();
               updateDoc(docRef, { tag: newTag }).catch(console.error);
               data.tag = newTag;
            }
            setUserData(data);
"""

content = content.replace("setUserData(data);", injection.strip(), 1)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Dashboard tag auto-fill updated")
