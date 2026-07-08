import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add hasPendingFriend to App
if "const hasPendingFriend =" not in content:
    content = content.replace(
        "function App() {",
        "function App() {\n  const hasPendingFriend = !!localStorage.getItem('pendingFriendRequest');\n  const handleStartLogin = () => setCurrentScreen('auth');"
    )

# Fix onStart in the rogue modal
content = content.replace("onClick={onStart}", "onClick={handleStartLogin}")

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Patched App.tsx")
