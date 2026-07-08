import sys

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

old_code = """          const q = query(groupsRef, where('weekId', '==', currentWeekId), where('league', '==', newLeague), where('playerCount', '<', 30), limit(1));
          const snap = await getDocs(q);
          
          let newGroupId = '';
          const playerEntry = { xp: 0, displayName: userData.displayName || userData.name || 'Pemain', photoUrl: userData.profilePictureUrl || userData.profilePicUrl || '' };
          
          if (!snap.empty) {
            const groupDoc = snap.docs[0];"""

new_code = """          const q = query(groupsRef, where('weekId', '==', currentWeekId), where('league', '==', newLeague));
          const snap = await getDocs(q);
          
          let newGroupId = '';
          const playerEntry = { xp: 0, displayName: userData.displayName || userData.name || 'Pemain', photoUrl: userData.profilePictureUrl || userData.profilePicUrl || '' };
          
          const groupDoc = snap.docs.find(d => d.data().playerCount < 30);
          if (groupDoc) {"""

if old_code in content:
    content = content.replace(old_code, new_code)
    with open('src/components/Dashboard.tsx', 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Old code not found")
