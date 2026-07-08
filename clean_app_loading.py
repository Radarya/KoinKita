import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Remove the whole hasPendingFriend block from the loading screen
loading_modal_pattern = r'\{hasPendingFriend && \(\n\s*<div className="fixed inset-0.*?</div>\n\s*\)\}'
content = re.sub(loading_modal_pattern, '', content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Cleaned up loading screen modal")
