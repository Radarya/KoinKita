import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

bad_string = """          setIsDataLoading(false);
        }, (err) => {
          console.error("Failed to fetch user data:", err);
          setIsDataLoading(false);
        }, (error) => {
          console.error('Dashboard snapshot error:', error);
          setIsDataLoading(false);
        });"""

good_string = """          setIsDataLoading(false);
        }, (err) => {
          console.error("Dashboard snapshot error:", err);
          setIsDataLoading(false);
        });"""

content = content.replace(bad_string, good_string)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
print("Fixed.")
