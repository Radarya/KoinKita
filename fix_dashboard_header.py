with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

bad_closing = "          </div>\n          </div>\n        </motion.header>"
good_closing = "          </div>\n        </motion.header>"

content = content.replace(bad_closing, good_closing)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
print("Dashboard.tsx syntax fixed.")
