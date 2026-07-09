import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Camera, Loader2, Save, User as UserIcon, Store, Lock, Check, Coins } from 'lucide-react';
import { db } from '../firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { uploadToImgBB } from '../lib/imgbb';
import { useTranslation } from '../lib/LanguageContext';
import { DEFAULT_AVATARS } from '../lib/avatars';
import { playClick, playCorrect, playWrong } from '../lib/audio';

interface UserProfileProps {
  user: any;
  userData: any;
  onBack: () => void;
}

export default function UserProfile({ user, userData, onBack }: UserProfileProps) {
  const { language } = useTranslation();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'shop'>('profile');
  
  // Profile States
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const userTag = userData?.tag || '0000';
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Shop States
  const ownedAvatars = userData?.ownedAvatars || ['bear', 'cat', 'owl'];
  const userCoins = userData?.totalCoins || userData?.coins || 0;

  useEffect(() => {
    if (userData) {
      setName(userData.fullName || userData.name || user?.displayName || '');
      setUsername(userData.username || userData.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || '');
      
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
      return;
    }

    if (!file.type.startsWith('image/')) {
      showMessage(
        language === 'id' ? 'Tolong pilih file gambar yang valid.' : 'Please select a valid image file.',
        'error'
      );
      return;
    }

    setIsUploading(true);
    try {
      const downloadURL = await uploadToImgBB(file);
      setProfilePic(downloadURL);
      
      await updateDoc(doc(db, 'users', user.uid), {
        profilePictureUrl: downloadURL,
        updatedAt: new Date().toISOString()
      });
      showMessage(language === 'id' ? 'Foto profil berhasil diperbarui!' : 'Profile photo updated successfully!', 'success');
    } catch (error: any) {
      console.warn("Error uploading file:", error);
      showMessage(language === 'id' ? 'Gagal mengunggah foto.' : 'Failed to upload photo.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    setIsUploading(true);
    try {
      setProfilePic('');
      await updateDoc(doc(db, 'users', user.uid), {
        profilePictureUrl: '',
        profilePicUrl: '', // remove fallback as well
        updatedAt: new Date().toISOString()
      });
      showMessage(language === 'id' ? 'Foto profil telah dihapus.' : 'Profile photo removed.', 'success');
    } catch (error) {
      console.warn("Error removing photo:", error);
      showMessage(language === 'id' ? 'Gagal menghapus foto.' : 'Failed to remove photo.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    playClick();
    if (!name.trim() || !username.trim()) {
      showMessage(language === 'id' ? 'Nama dan username tidak boleh kosong!' : 'Name and username cannot be empty!', 'error');
      return;
    }
    setIsSaving(true);
    try {
      const updates: any = {
        fullName: name,
        username: username,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(doc(db, 'users', user.uid), updates);
      showMessage(language === 'id' ? 'Profil berhasil disimpan!' : 'Profile saved successfully!', 'success');
    } catch (error) {
      console.warn("Error updating profile:", error);
      showMessage(language === 'id' ? 'Gagal menyimpan profil.' : 'Failed to save profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBuyOrEquipAvatar = async (avatar: typeof DEFAULT_AVATARS[0]) => {
    const isOwned = ownedAvatars.includes(avatar.id);
    
    if (isOwned) {
      playClick();
      setProfilePic(avatar.url);
      await updateDoc(doc(db, 'users', user.uid), {
        profilePictureUrl: avatar.url,
        updatedAt: new Date().toISOString()
      });
      showMessage(language === 'id' ? 'Avatar terpasang!' : 'Avatar equipped!', 'success');
    } else {
      if (userCoins >= avatar.price) {
        playCorrect();
        await updateDoc(doc(db, 'users', user.uid), {
          totalCoins: increment(-avatar.price),
          ownedAvatars: [...ownedAvatars, avatar.id],
          profilePictureUrl: avatar.url,
          updatedAt: new Date().toISOString()
        });
        setProfilePic(avatar.url);
        showMessage(language === 'id' ? 'Pembelian berhasil! Avatar terpasang.' : 'Purchase successful! Avatar equipped.', 'success');
      } else {
        playWrong();
        showMessage(language === 'id' ? 'Koin tidak cukup!' : 'Not enough coins!', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-md rounded-[2rem] shadow-xl overflow-hidden relative"
      >
        <div className="flex items-center p-6 border-b border-slate-100">
          <button 
            onClick={() => { playClick(); onBack(); }}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <h2 className="text-xl font-poppins font-black text-slate-800 ml-4">
            {language === 'id' ? "Profil & Koleksi" : "Profile & Collection"}
          </h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 pt-4 border-b border-slate-100 gap-6">
          <button 
            onClick={() => { playClick(); setActiveTab('profile'); }}
            className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'profile' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {language === 'id' ? 'Data Diri' : 'Personal Info'}
            {activeTab === 'profile' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => { playClick(); setActiveTab('shop'); }}
            className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'shop' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className="flex items-center gap-1.5">
              <Store className="w-4 h-4" />
              {language === 'id' ? 'Toko Avatar' : 'Avatar Shop'}
            </div>
            {activeTab === 'shop' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-t-full"></div>}
          </button>
        </div>

        {message.text && (
          <div className="px-6 pt-4">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-xl text-sm font-bold text-center ${
                message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {message.text}
            </motion.div>
          </div>
        )}

        <div className="p-6 h-[500px] overflow-y-auto">
          {activeTab === 'profile' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-3">
                  <div className="w-28 h-28 rounded-[2rem] overflow-hidden border-4 border-emerald-50 bg-slate-50 flex items-center justify-center shadow-sm">
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                    ) : profilePic ? (
                      <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-12 h-12 text-slate-300" />
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform">
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={isUploading} />
                  </label>
                </div>
                {profilePic && (
                  <button onClick={handleRemovePhoto} disabled={isUploading} className="text-xs font-bold text-red-500 hover:text-red-600 mt-2">
                    {language === 'id' ? 'Hapus Foto' : 'Remove Photo'}
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    {language === 'id' ? "Nama Lengkap" : "Full Name"}
                  </label>
                  <input 
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    {language === 'id' ? "Username" : "Username"}
                  </label>
                  <input 
                    type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium text-slate-700"
                  />
                </div>
                
              </div>

              
              <div className="bg-emerald-50 p-4 rounded-2xl flex items-center justify-between border border-emerald-100">
                <div>
                  <h3 className="text-sm font-bold text-emerald-800">{language === 'id' ? 'QR Teman' : 'Friend QR'}</h3>
                  <p className="text-[10px] text-emerald-600 mb-2">{language === 'id' ? 'Scan untuk tambah teman' : 'Scan to add friend'}</p>
                  <div className="text-xs font-black text-slate-800 bg-white px-2 py-1 rounded inline-block shadow-sm">
                    {user?.displayName || name}#{userTag}
                  </div>
                </div>
                <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-sm p-1">
                  <QRCodeSVG value={`https://www.koinkita.xyz/add/${user.uid}`} size={70} />
                </div>
              </div>
              <button 
                onClick={handleSaveProfile} disabled={isSaving}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl shadow-md transition-all flex justify-center items-center gap-2 active:scale-95"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{language === 'id' ? "Simpan Perubahan" : "Save Changes"}</>}
              </button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between bg-amber-50 p-4 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-2">
                  <Coins className="w-6 h-6 text-amber-500" />
                  <div>
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none">
                      {language === 'id' ? 'Koin Kamu' : 'Your Coins'}
                    </p>
                    <p className="text-xl font-poppins font-black text-amber-600 mt-0.5">
                      {userCoins.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {DEFAULT_AVATARS.map((avatar) => {
                  const isOwned = ownedAvatars.includes(avatar.id);
                  const isEquipped = profilePic === avatar.url;
                  
                  return (
                    <div 
                      key={avatar.id}
                      className={`relative bg-slate-50 rounded-2xl p-4 border-2 transition-all flex flex-col items-center text-center ${
                        isEquipped ? 'border-emerald-500 shadow-md' : 'border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-white mb-3 shadow-sm border border-slate-100">
                        <img src={avatar.url} alt={avatar.id} className="w-full h-full object-cover" />
                      </div>
                      
                      <h3 className="text-xs font-bold text-slate-700 mb-1 leading-tight h-8">
                        {language === 'id' ? avatar.nameID : avatar.nameEN}
                      </h3>
                      
                      {isOwned ? (
                        <button
                          onClick={() => handleBuyOrEquipAvatar(avatar)}
                          className={`mt-auto w-full py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors ${
                            isEquipped 
                              ? 'bg-emerald-100 text-emerald-700 cursor-default' 
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {isEquipped ? (language === 'id' ? 'Dipakai' : 'Equipped') : (language === 'id' ? 'Pakai' : 'Equip')}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuyOrEquipAvatar(avatar)}
                          className="mt-auto w-full py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-white transition-colors flex justify-center items-center gap-1 shadow-sm"
                        >
                          <Lock className="w-3 h-3" /> {avatar.price}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
