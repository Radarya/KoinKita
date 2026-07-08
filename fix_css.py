with open('src/index.css', 'r') as f:
    content = f.read()
content = content.replace("body {\n  background-color: #000000;\n  color: #FAFAFA;\n}", "")
with open('src/index.css', 'w') as f:
    f.write(content)
