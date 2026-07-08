import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add states
states_insertion = """
  const [pendingFriendData, setPendingFriendData] = useState<any | null>(null);

  useEffect(() => {
    const checkPendingFriend = async () => {
      const pendingUid = localStorage.getItem('pendingFriendRequest');
      if (pendingUid && user) {
        if (pendingUid === user.uid) {
           localStorage.removeItem('pendingFriendRequest');
           return;
        }
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const docRef = doc(db, 'users', pendingUid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPendingFriendData({ id: docSnap.id, ...docSnap.data() });
          } else {
             localStorage.removeItem('pendingFriendRequest');
          }
        } catch(e) {
          console.error(e);
        }
      }
    };
    checkPendingFriend();
  }, [user]);

  const handleSendPendingRequest = async () => {
    if (!pendingFriendData) return;
    try {
      const { collection, addDoc } = await import('firebase/firestore');
      await addDoc(collection(db, 'inbox'), {
        userId: pendingFriendData.id,
        type: 'friend_request',
        fromUserId: user.uid,
        fromUserName: userData?.displayName || userData?.name || 'Player',
        status: 'unread',
        createdAt: Date.now()
      });
      if (triggerToast) triggerToast(language === 'id' ? 'Permintaan pertemanan dikirim!' : 'Friend request sent!', 'success');
      setPendingFriendData(null);
      localStorage.removeItem('pendingFriendRequest');
    } catch(e) {
      if (triggerToast) triggerToast(language === 'id' ? 'Gagal mengirim permintaan' : 'Failed to send request', 'error');
    }
  };
"""

content = content.replace("const [showLeaderboard, setShowLeaderboard] = useState(false);", "const [showLeaderboard, setShowLeaderboard] = useState(false);\n" + states_insertion)

# Add Modal rendering
modal_insertion = """
      {/* Pending Friend Request Modal */}
      <AnimatePresence>
        {pendingFriendData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => { setPendingFriendData(null); localStorage.removeItem('pendingFriendRequest'); }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col"
            >
              <div className="bg-emerald-500 p-6 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner mb-4 overflow-hidden border-4 border-emerald-300">
                  {pendingFriendData.profilePictureUrl || pendingFriendData.profilePicUrl ? (
                    <img src={pendingFriendData.profilePictureUrl || pendingFriendData.profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-emerald-300" />
                  )}
                </div>
                <h3 className="text-xl font-black text-white">{pendingFriendData.displayName || pendingFriendData.name}</h3>
                <p className="text-emerald-100 font-medium text-sm">#{pendingFriendData.tag || '0000'}</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-slate-600 font-medium mb-6">
                  {language === 'id' 
                    ? 'Apakah kamu ingin menambahkan pemain ini sebagai teman?' 
                    : 'Do you want to add this player as a friend?'}
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => { setPendingFriendData(null); localStorage.removeItem('pendingFriendRequest'); }}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
                  >
                    {language === 'id' ? 'Batal' : 'Cancel'}
                  </button>
                  <button 
                    onClick={handleSendPendingRequest}
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex justify-center items-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" /> {language === 'id' ? 'Tambah' : 'Add'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
"""

content = content.replace("{/* Pre-Game Tutorial Modal */}", modal_insertion + "\n      {/* Pre-Game Tutorial Modal */}")

# Make sure we imported UserPlus and getDoc
if "UserPlus" not in content[:1000]:
    content = content.replace("  User,", "  User,\n  UserPlus,")
if "getDoc" not in content[:1000]:
    content = content.replace("  getDocs,", "  getDocs,\n  getDoc,")

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Pending friend modal added to Dashboard")
