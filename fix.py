import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'\s*<button\s*onClick={\(\) => {\s*</motion\.header>', '\n          </div>\n        </motion.header>', content, flags=re.DOTALL)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
