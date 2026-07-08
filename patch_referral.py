import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add referral check in useEffect on mount
referral_injection = """
  // Check for referral link
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/add/')) {
      const tag = path.split('/')[2];
      if (tag) {
        localStorage.setItem('referralTag', tag);
        // Clear URL without refreshing
        window.history.replaceState({}, document.title, '/');
      }
    }
  }, []);
"""

content = content.replace("useEffect(() => {", referral_injection + "\n  useEffect(() => {", 1)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Referral route added to App.tsx")
