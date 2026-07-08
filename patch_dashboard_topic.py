import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# 1. Add import for TopicSelection
import_pattern = r"import \{ DailyQuestsModal \} from '\./DailyQuestsModal';"
import_replacement = r"import { DailyQuestsModal } from './DailyQuestsModal';\nimport { TopicSelection } from './TopicSelection';"
content = re.sub(import_pattern, import_replacement, content)

# 2. Add state for showTopicSelection
state_pattern = r"const \[showDailyQuests, setShowDailyQuests\] = useState\(false\);"
state_replacement = r"const [showDailyQuests, setShowDailyQuests] = useState(false);\n  const [showTopicSelection, setShowTopicSelection] = useState(false);"
content = re.sub(state_pattern, state_replacement, content)

# 3. Add view for TopicSelection
view_pattern = r"if \(showProfile\) \{\n    return <UserProfile.*?>;\n  \}"
view_replacement = r"if (showProfile) {\n    return <UserProfile user={user} userData={userData} onBack={() => setShowProfile(false)} />;\n  }\n\n  if (showTopicSelection) {\n    return <TopicSelection onSelect={(gameId) => { setShowTopicSelection(false); setActiveGame(gameId); }} onBack={() => setShowTopicSelection(false)} userLevel={userLevel} />;\n  }"
content = re.sub(view_pattern, view_replacement, content)

# 4. Modify button to open TopicSelection instead of koki-anggaran directly
btn_pattern = r"setTutorialGameId\('koki-anggaran'\);"
btn_replacement = r"setShowTopicSelection(true);"
content = re.sub(btn_pattern, btn_replacement, content)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Patch TopicSelection applied.")
