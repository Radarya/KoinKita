import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

old_modal = r'\{/\* Pending Friend Request Modal \*/\}.*?</AnimatePresence>'

new_modal = """{/* Pending Friend Request Modal */}
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
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                
                <div className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 overflow-hidden border-4 border-white">
                  {pendingFriendData.profilePictureUrl || pendingFriendData.profilePicUrl ? (
                    <img src={pendingFriendData.profilePictureUrl || pendingFriendData.profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-slate-300" />
                  )}
                </div>
                <h3 className="relative z-10 text-2xl font-black text-white tracking-tight">{pendingFriendData.displayName || pendingFriendData.name}</h3>
                <div className="relative z-10 bg-black/10 px-3 py-1 rounded-full mt-2">
                  <p className="text-white font-bold text-sm tracking-widest">#{pendingFriendData.tag || '0000'}</p>
                </div>
              </div>
              <div className="p-6 text-center bg-slate-50">
                <h4 className="text-lg font-black text-slate-800 mb-2">
                  {language === 'id' ? 'Permintaan Berteman' : 'Friend Request'}
                </h4>
                <p className="text-slate-600 font-medium mb-6 text-sm">
                  {language === 'id' 
                    ? 'Pemain ini mengundangmu untuk berteman. Tambahkan mereka untuk bermain bersama!' 
                    : 'This player invited you to be friends. Add them to play together!'}
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => { setPendingFriendData(null); localStorage.removeItem('pendingFriendRequest'); }}
                    className="flex-1 py-3 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-colors active:scale-95"
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
      </AnimatePresence>"""

content = re.sub(old_modal, new_modal, content, flags=re.DOTALL)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Dashboard modal updated")
