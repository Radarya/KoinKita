import re

with open('server.ts', 'r') as f:
    content = f.read()

if "/api/health" not in content:
    health_route = """
  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
"""
    content = content.replace("app.use(express.json());", "app.use(express.json());\n" + health_route)
    with open('server.ts', 'w') as f:
        f.write(content)
    print("Added /api/health to server.ts")
else:
    print("/api/health already exists")
