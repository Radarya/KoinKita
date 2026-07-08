import re

with open('src/components/Arena.tsx', 'r') as f:
    content = f.read()

# Fix player ID header: add min-w-0 to prevent overflow and truncate name if needed, or break word
content = content.replace(
    '<div className="flex items-center gap-4">',
    '<div className="flex items-center gap-4 w-full min-w-0">'
)
content = content.replace(
    '<div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">',
    '<div className="w-12 h-12 md:w-16 md:h-16 shrink-0 bg-slate-100 rounded-2xl flex items-center justify-center">'
)
content = content.replace(
    '<div>\n                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{language === \'id\' ? \'ID Pemain Kamu\' : \'Your Player ID\'}</h3>\n                    <p className="text-2xl font-black text-slate-800 font-poppins">{userData?.displayName || userData?.name}<span className="text-slate-400">#{userData?.tag || \'0000\'}</span></p>\n                  </div>',
    '<div className="min-w-0 flex-grow">\n                    <h3 className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">{language === \'id\' ? \'ID Pemain Kamu\' : \'Your Player ID\'}</h3>\n                    <p className="text-lg md:text-2xl font-black text-slate-800 font-poppins truncate">{userData?.displayName || userData?.name}<span className="text-slate-400">#{userData?.tag || \'0000\'}</span></p>\n                  </div>'
)

# Fix input area wrapping
content = content.replace(
    '<div className="flex gap-2 shrink-0">',
    '<div className="flex flex-col sm:flex-row gap-2 shrink-0">'
)

# Fix friend list send life button on mobile
content = content.replace(
    '<button \n                          onClick={() => handleSendLife(friend.id, friend.displayName || friend.name)}\n                          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl flex items-center gap-2 transition-all active:scale-95"\n                        >\n                          <Heart className="w-4 h-4 fill-rose-500" /> {language === \'id\' ? \'Beri Nyawa\' : \'Send Life\'}\n                        </button>',
    '<button \n                          onClick={() => handleSendLife(friend.id, friend.displayName || friend.name)}\n                          className="p-2 sm:px-4 sm:py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl flex items-center gap-2 transition-all active:scale-95 shrink-0"\n                        >\n                          <Heart className="w-4 h-4 sm:w-4 sm:h-4 fill-rose-500" /> <span className="hidden sm:inline">{language === \'id\' ? \'Beri Nyawa\' : \'Send Life\'}</span>\n                        </button>'
)

with open('src/components/Arena.tsx', 'w') as f:
    f.write(content)

print("Arena mobile layout fixed")
