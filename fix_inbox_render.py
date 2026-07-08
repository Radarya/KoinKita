import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

if "import InboxModal" not in content:
    content = content.replace("import { SettingsModal } from './SettingsModal';", "import { SettingsModal } from './SettingsModal';\nimport InboxModal from './InboxModal';")

if "showInbox &&" not in content:
    content = content.replace("<SettingsModal", "{showInbox && <InboxModal onClose={() => setShowInbox(false)} user={user} userData={userData} triggerToast={triggerToast} />}\n      <SettingsModal")

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

print("InboxModal rendered.")
