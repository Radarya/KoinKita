import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Camera, Loader2, Save, User as UserIcon } from 'lucide-react';
import { db, storage } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useTranslation } from '../lib/LanguageContext';
import { DEFAULT_AVATARS } from '../lib/avatars';

interface UserProfileProps {
  user: any;
  userData: any;
  onBack: () => void;
}

export default function UserProfile({ user, userData, onBack }: UserProfileProps) {
  const { language } = useTranslation();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [profilePic, setProfilePic] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (userData) {
      setName(userData.fullName || userData.name || user?.displayName || '');
      setUsername(userData.username || userData.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || '');
      setAge(userData.age ? String(userData.age) : '');
      
      const explicitlyRemoved = userData.profilePictureUrl === null || userData.profilePictureUrl === '' || userData.profilePicUrl === null || userData.profilePicUrl === '';
      setProfilePic(explicitlyRemoved ? '' : (userData.profilePictureUrl || userData.profilePicUrl || user?.photoURL || ''));
    }
  }, [userData, user]);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showMessage(
        language === 'id' ? 'Ukuran foto terlalu besar! Maksimal 10MB.' : 'Photo size is too large! Max size 10MB.',
        'error'
      );
      e.target.value = '';
      return;
    }

    if (!user?.uid) {
      showMessage(
        language === 'id' ? 'Gagal: Pengguna tidak terautentikasi.' : 'Error: User is not authenticated.',
        'error'
      );
      return;
    }

    try {
      setIsUploading(true);
      const storageRef = ref(storage, `profile_pictures/${user.uid}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { profilePictureUrl: downloadURL, profilePicUrl: downloadURL });
      
      setProfilePic(downloadURL);
      showMessage(
        language === 'id' ? 'Foto berhasil diunggah!' : 'Profile picture successfully uploaded!',
        'success'
      );
    } catch (err) {
      console.error(err);
      showMessage(
        language === 'id' ? 'Gagal mengunggah foto.' : 'Failed to upload photo.',
        'error'
      );
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    if (!user?.uid) return;
    try {
      setIsUploading(true);
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { profilePictureUrl: null, profilePicUrl: null });
      setProfilePic('');
      showMessage(
        language === 'id' ? 'Foto profil berhasil dihapus!' : 'Profile photo successfully removed!',
        'success'
      );
    } catch (err) {
      console.error(err);
      showMessage(
        language === 'id' ? 'Gagal menghapus foto profil.' : 'Failed to remove profile photo.',
        'error'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectDefaultAvatar = async (url: string) => {
    if (!user?.uid) return;
    try {
      setIsUploading(true);
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { profilePictureUrl: url, profilePicUrl: url });
      setProfilePic(url);
      showMessage(
        language === 'id' ? 'Avatar berhasil diperbarui!' : 'Avatar successfully updated!',
        'success'
      );
    } catch (err) {
      console.error(err);
      showMessage(
        language === 'id' ? 'Gagal memperbarui avatar.' : 'Failed to update avatar.',
        'error'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    
    try {
      setIsSaving(true);
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        uid: user.uid,
        name: name.trim(),
        fullName: name.trim(),
        username: username.trim().toLowerCase().replace(/\s+/g, '_'),
        age: age ? parseInt(age, 10) : null
      });
      showMessage(
        language === 'id' ? 'Profil berhasil diperbarui!' : 'Profile information successfully updated!',
        'success'
      );
    } catch (err) {
      console.error(err);
      showMessage(
        language === 'id' ? 'Gagal memperbarui profil.' : 'Failed to update profile info.',
        'error'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border border-slate-100"
      >
        <div className="flex items-center mb-6">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-poppins font-black text-slate-800 ml-4">
            {language === 'id' ? "Profilku" : "My Profile"}
          </h2>
        </div>

        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl mb-6 text-sm font-bold text-center ${
              message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        <div className="flex flex-col items-center mb-8 relative">
          <div className="relative mb-3">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-emerald-100 bg-emerald-50 flex items-center justify-center shadow-inner relative">
              <AnimatePresence mode="wait">
                {isUploading ? (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center"
                  >
                    <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                  </motion.div>
                ) : profilePic ? (
                  <motion.img 
                    key="profile-pic"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={profilePic} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <motion.div key="fallback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <UserIcon className="w-12 h-12 text-emerald-300" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <label className={`absolute bottom-0 right-0 w-8 h-8 ${isUploading ? 'bg-slate-400' : 'bg-emerald-500 hover:bg-emerald-600'} text-white rounded-full flex items-center justify-center cursor-pointer shadow-md transition-colors border-2 border-white`}>
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
                disabled={isUploading}
              />
            </label>
          </div>
          <div className="flex gap-4 mt-2">
            <label className={`text-sm font-bold ${isUploading ? 'text-slate-400' : 'text-emerald-500 hover:text-emerald-600 cursor-pointer'} transition-colors flex items-center gap-2`}>
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                language === 'id' ? 'Ganti Foto' : 'Change Photo'
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
                disabled={isUploading}
              />
            </label>
            {profilePic && (
              <button 
                onClick={handleRemovePhoto}
                disabled={isUploading}
                className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors flex items-center justify-center"
              >
                {language === 'id' ? 'Hapus Foto' : 'Remove Photo'}
              </button>
            )}
          </div>
        </div>

        {/* Quick Avatar Selection */}
        <div className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-4 mb-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center mb-3 mt-1">
            {language === 'id' ? "Atau Pilih Avatar Lucu" : "Or Pick a Cute Avatar"}
          </p>
          <div className="flex justify-center gap-3">
            {DEFAULT_AVATARS.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => handleSelectDefaultAvatar(avatar.url)}
                disabled={isUploading || isSaving}
                title={language === 'id' ? avatar.nameID : avatar.nameEN}
                className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 active:scale-95 bg-white ${
                  profilePic === avatar.url ? 'border-emerald-500 shadow-md scale-110' : 'border-transparent hover:border-emerald-200'
                }`}
              >
                <img src={avatar.url} alt={avatar.id} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              {language === 'id' ? "Nama Lengkap" : "Full Name"}
            </label>
            <input 
              type="text" 
              autoComplete="off"
              spellCheck="false"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium text-slate-700"
              placeholder={language === 'id' ? "Masukkan nama lengkap" : "Enter full name"}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              {language === 'id' ? "Nama Pengguna (Username)" : "Username"}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-400 font-extrabold select-none pointer-events-none text-sm">
                @
              </span>
              <input 
                type="text" 
                autoComplete="off"
                spellCheck="false"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium text-slate-700"
                placeholder={language === 'id' ? "nama_pengguna" : "username"}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              {language === 'id' ? "Umur" : "Age"}
            </label>
            <input 
              type="number" 
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium text-slate-700"
              placeholder={language === 'id' ? "Masukkan umur kamu" : "Enter your age"}
            />
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2 active:scale-95"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                {language === 'id' ? "Simpan Perubahan" : "Save Changes"}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
