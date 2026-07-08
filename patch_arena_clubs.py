import re

with open('src/components/Arena.tsx', 'r') as f:
    content = f.read()

import_statement = "import ClubsTab from './ClubsTab';\n"
if import_statement not in content:
    content = content.replace("import { playClick } from '../lib/audio';", "import { playClick } from '../lib/audio';\n" + import_statement)

pattern = re.compile(r"\{/\* CLUBS TAB \*/\}\s*\{activeTab === 'clubs' && \([\s\S]*?</motion\.div>\s*\)\}")

replacement = """{/* CLUBS TAB */}
          {activeTab === 'clubs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full overflow-hidden">
              <ClubsTab currentUserUid={currentUserUid} userData={userData} triggerToast={triggerToast} />
            </motion.div>
          )}"""

if pattern.search(content):
    content = pattern.sub(replacement, content)
    with open('src/components/Arena.tsx', 'w') as f:
        f.write(content)
    print("Arena.tsx patched with ClubsTab.")
else:
    print("Pattern not found for ClubsTab injection.")
