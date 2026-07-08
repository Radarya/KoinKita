import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Import Heart, Bell
content = content.replace('Medal,', 'Medal,\n  Heart,\n  Bell,')

# Add showInbox state
state_pattern = r"const \[showTopicSelection, setShowTopicSelection\] = useState\(false\);"
state_replacement = "const [showTopicSelection, setShowTopicSelection] = useState(false);\n  const [showInbox, setShowInbox] = useState(false);"
content = content.replace(state_pattern, state_replacement)

# Import InboxModal
import_pattern = r"import \{ AchievementsModal, ACHIEVEMENTS \} from '\./AchievementsModal';"
import_replacement = "import { AchievementsModal, ACHIEVEMENTS } from './AchievementsModal';\nimport InboxModal from './InboxModal';"
content = content.replace(import_pattern, import_replacement)

# Add InboxModal component inside return
modal_pattern = r"\{/\* Achievements Modal Dialog \*/\}"
modal_replacement = """{/* Inbox Modal Dialog */}
      <AnimatePresence>
        {showInbox && (
          <InboxModal onClose={() => setShowInbox(false)} user={user} userData={userData} triggerToast={triggerToast!} />
        )}
      </AnimatePresence>
      
      {/* Achievements Modal Dialog */}"""
content = content.replace(modal_pattern, modal_replacement)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
print("Dashboard imports and Inbox modal added.")
