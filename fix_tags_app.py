import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add a function to generate tag
tag_gen = """
  // Generate random 4-digit tag
  const generateTag = () => Math.floor(1000 + Math.random() * 9000).toString();
"""

# Insert inside the login/register logic. Wait, let's just do it directly.
# Where userDoc is created:
content = content.replace(
    "email: email.trim(),\n          totalCoins: 0,",
    "email: email.trim(),\n          tag: Math.floor(1000 + Math.random() * 9000).toString(),\n          totalCoins: 0,"
)

content = content.replace(
    "email: res.user.email,\n          totalCoins: 0,",
    "email: res.user.email,\n          tag: Math.floor(1000 + Math.random() * 9000).toString(),\n          totalCoins: 0,"
)

# And for existing users logging in:
# Where merge: true is called
content = content.replace(
    "lastLogin: new Date().toISOString(),\n          ...( !data.createdAt && { createdAt: res.user.metadata.creationTime || new Date().toISOString() } )\n        }, { merge: true });",
    "lastLogin: new Date().toISOString(),\n          ...( !data.createdAt && { createdAt: res.user.metadata.creationTime || new Date().toISOString() } ),\n          ...( !data.tag && { tag: Math.floor(1000 + Math.random() * 9000).toString() } )\n        }, { merge: true });"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("App tag generation updated")
