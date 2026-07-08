import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

modal_html = """
      <AnimatePresence>
        {hasPendingFriend && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col"
            >
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-8 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 overflow-hidden border-4 border-emerald-100">
                  <div className="text-5xl">👋</div>
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                  {language === 'id' ? 'Undangan Berteman!' : 'Friend Request!'}
                </h3>
              </div>
              <div className="p-6 text-center bg-slate-50">
                <p className="text-slate-600 font-medium mb-6">
                  {language === 'id' 
                    ? 'Seseorang mengundangmu untuk bermain KoinKita bersama. Daftar atau masuk sekarang untuk menerima permintaan berteman!' 
                    : 'Someone invited you to play KoinKita. Register or log in now to accept the friend request!'}
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => { localStorage.removeItem('pendingFriendRequest'); window.location.reload(); }}
                    className="flex-1 py-3 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-colors"
                  >
                    {language === 'id' ? 'Nanti' : 'Later'}
                  </button>
                  <button 
                    onClick={onStart}
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex justify-center items-center gap-2"
                  >
                    {language === 'id' ? 'Masuk / Daftar' : 'Log In / Sign Up'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
"""

# Find LandingPage render
landing_idx = content.find("function LandingPage")
if landing_idx != -1:
    before = content[:landing_idx]
    after = content[landing_idx:]
    after = re.sub(
        r'(return \(\s*<div.*?className="min-h-screen.*?bg-slate-50.*?>)',
        r'\1\n' + modal_html,
        after,
        count=1,
        flags=re.DOTALL
    )
    content = before + after

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Restored modal to LandingPage")
