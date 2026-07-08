import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# After fetchUserData in Dashboard.tsx
referral_logic = """
            // Process Referral
            const refTag = localStorage.getItem('referralTag');
            if (refTag && refTag !== data.tag) {
               localStorage.removeItem('referralTag');
               const processReferral = async () => {
                 try {
                   const usersRef = collection(db, 'users');
                   const q = query(usersRef, where('tag', '==', refTag));
                   const snap = await getDocs(q);
                   if (!snap.empty) {
                     const friendDoc = snap.docs[0];
                     const friendId = friendDoc.id;
                     
                     // Check if already friends
                     const friendsList = data.friends || [];
                     if (!friendsList.includes(friendId)) {
                        // Add Friend directly or send request
                        // Let's just add them as friends mutually
                        await updateDoc(docRef, { friends: arrayUnion(friendId) });
                        await updateDoc(doc(db, 'users', friendId), { friends: arrayUnion(user.uid) });
                        
                        // Give both 50 coins as affiliate reward if it's a new user
                        // We can check if calculated level == 0 or totalCoins < 100 to guess if they are new.
                        // Let's just give it unconditionally as a referral bonus once per connection.
                        // Wait, it could be farmed. Better to just give 50 coins if the current user has < 50 coins.
                        if (coins <= 50) {
                            await updateDoc(docRef, { 
                               totalCoins: coins + 100, 
                               coins: coins + 100 
                            });
                            const friendData = friendDoc.data();
                            const fCoins = friendData.totalCoins || friendData.coins || 0;
                            await updateDoc(doc(db, 'users', friendId), {
                               totalCoins: fCoins + 100,
                               coins: fCoins + 100
                            });
                            if (triggerToast) triggerToast(language === 'id' ? 'Bonus afiliasi! +100 Koin' : 'Affiliate bonus! +100 Coins', 'success');
                        } else {
                            if (triggerToast) triggerToast(language === 'id' ? 'Teman ditambahkan dari link!' : 'Friend added from link!', 'success');
                        }
                     }
                   }
                 } catch (e) {
                   console.error("Referral processing error", e);
                 }
               };
               processReferral();
            }
"""

content = content.replace("            if (calculated > dbLevel && dbLevel !== undefined) {", referral_logic + "\n            if (calculated > dbLevel && dbLevel !== undefined) {")

# Add arrayUnion import and getDocs, collection, query, where in Dashboard.tsx
if "getDocs" not in content:
    content = content.replace("import { doc, onSnapshot, updateDoc, arrayUnion }", "import { doc, onSnapshot, updateDoc, arrayUnion, collection, query, where, getDocs }")

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Referral logic added to Dashboard.tsx")
