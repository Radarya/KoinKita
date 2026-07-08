import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

route_check = """
  // Check for friend request route
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/add/')) {
      const tag = path.split('/add/')[1];
      if (tag) {
        localStorage.setItem('pendingFriendRequest', tag);
        window.history.replaceState({}, '', '/');
      }
    }
  }, []);
"""

# Find a good place to insert this inside App component
if "function App() {" in content:
    content = content.replace(
        "function App() {",
        "function App() {\n" + route_check
    )

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("App route check added")
