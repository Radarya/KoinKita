import re

with open('index.html', 'r') as f:
    content = f.read()

og_tags = """
    <!-- Open Graph / WhatsApp Preview Meta Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="KoinKita - Bermain & Belajar Keuangan" />
    <meta property="og:description" content="Ayo main KoinKita! Game edukasi finansial yang seru. Tambahkan aku sebagai teman dan mari bermain bersama!" />
    <meta property="og:image" content="https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1200&auto=format&fit=crop" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="theme-color" content="#10b981" />
"""

content = content.replace('<title>KoinKita</title>', '<title>KoinKita</title>\n' + og_tags)

with open('index.html', 'w') as f:
    f.write(content)

print("Added OG tags to index.html")
