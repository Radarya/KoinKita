import os

files = ['src/components/Dashboard.tsx', 'src/components/InboxModal.tsx', 'src/components/ClubsTab.tsx']

for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    # Replace onSnapshot(ref, (snap) => { ... });
    # with onSnapshot(ref, (snap) => { ... }, (err) => { console.error(err); });
    
    # Since regex is tricky here, let's just do targeted string replacements
    if 'InboxModal.tsx' in file:
        content = content.replace("    const unsubscribe = onSnapshot(q, (snapshot) => {", "    const unsubscribe = onSnapshot(q, (snapshot) => {")
        content = content.replace("      setLoading(false);\n    });", "      setLoading(false);\n    }, (error) => {\n      console.error('Inbox snapshot error:', error);\n      setLoading(false);\n    });")
        
    if 'ClubsTab.tsx' in file:
        content = content.replace("    const unsubscribe = onSnapshot(clubsRef, (snap) => {", "    const unsubscribe = onSnapshot(clubsRef, (snap) => {")
        content = content.replace("      setLoading(false);\n    });", "      setLoading(false);\n    }, (error) => {\n      console.error('Clubs snapshot error:', error);\n      setLoading(false);\n    });")

    if 'Dashboard.tsx' in file:
        content = content.replace("          setIsDataLoading(false);\n        });", "          setIsDataLoading(false);\n        }, (error) => {\n          console.error('Dashboard snapshot error:', error);\n          setIsDataLoading(false);\n        });")

    with open(file, 'w') as f:
        f.write(content)

print("Snapshots fixed.")
