import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace const hasPendingFriend = !!localStorage.getItem('pendingFriendRequest');
old_state = "const hasPendingFriend = !!localStorage.getItem('pendingFriendRequest');"
new_state = "const [hasPendingFriend, setHasPendingFriend] = useState(!!localStorage.getItem('pendingFriendRequest'));"
content = content.replace(old_state, new_state)

# Replace the useEffect
old_effect = """  // Check for friend request route
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/add/')) {
      const tag = path.split('/add/')[1];
      if (tag) {
        localStorage.setItem('pendingFriendRequest', tag);
        window.history.replaceState({}, '', '/');
      }
    }
  }, []);"""

new_effect = """  // Check for friend request route
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/add/')) {
      const tag = path.split('/add/')[1];
      if (tag) {
        localStorage.setItem('pendingFriendRequest', tag);
        setHasPendingFriend(true);
        window.history.replaceState({}, '', '/');
      }
    }
  }, []);"""

content = content.replace(old_effect, new_effect)

# Update the modal close logic in LandingPage to clear the state too?
# Since the modal is in LandingPage, we should also pass a callback or just let page reload handle it.
# The user clicks "Nanti" -> localStorage.removeItem; window.location.reload(); which is fine.

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Fixed hasPendingFriend state in App.tsx")
