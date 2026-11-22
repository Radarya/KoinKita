import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
      
      const explicitlyRemoved = userData.profilePictureUrl === '' && userData.profilePicUrl === '';
      const fallbackRemoved = userData.profilePicUrl === '' && !userData.profilePictureUrl;
      
      let pic = '';
      if (userData.profilePictureUrl) {
        pic = userData.profilePictureUrl;
      } else if (userData.profilePicUrl) {
        pic = userData.profilePicUrl;
      } else if (explicitlyRemoved || fallbackRemoved) {
        pic = '';
      } else {
        pic = user?.photoURL || '';
      }
      setProfilePic(pic);
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

      // Update league_groups if user is in one
      if (userData?.leagueGroupId) {
        try {
          await updateDoc(doc(db, 'league_groups', userData.leagueGroupId), {
            [`players.${user.uid}.photoUrl`]: downloadURL
          });
        } catch(e) {}
      }

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

      // Update league_groups if user is in one
      if (userData?.leagueGroupId) {
        try {
          await updateDoc(doc(db, 'league_groups', userData.leagueGroupId), {
            [`players.${user.uid}.photoUrl`]: ''
          });
        } catch(e) {}
      }

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
    
    if (name.trim().length < 3) {
      showMessage(language === 'id' ? 'Nama lengkap minimal 3 karakter!' : 'Full name must be at least 3 characters!', 'error');
      return;
    }
    if (username.trim().length < 3) {
      showMessage(language === 'id' ? 'Username minimal 3 karakter!' : 'Username must be at least 3 characters!', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const updates: any = {
        fullName: name.trim(),
        name: name.trim(),
        username: username.trim(),
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(doc(db, 'users', user.uid), updates);
      
      // Update league_groups if user is in one
      if (userData?.leagueGroupId) {
        try {
          await updateDoc(doc(db, 'league_groups', userData.leagueGroupId), {
            [`players.${user.uid}.displayName`]: username.trim(),
            [`players.${user.uid}.username`]: username.trim()
          });
        } catch(e) {}
      }

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

      // Update league_groups if user is in one
      if (userData?.leagueGroupId) {
        try {
          await updateDoc(doc(db, 'league_groups', userData.leagueGroupId), {
            [`players.${user.uid}.photoUrl`]: avatar.url
          });
        } catch(e) {}
      }

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

        // Update league_groups if user is in one
        if (userData?.leagueGroupId) {
          try {
            await updateDoc(doc(db, 'league_groups', userData.leagueGroupId), {
              [`players.${user.uid}.photoUrl`]: avatar.url
            });
          } catch(e) {}
        }
        setProfilePic(avatar.url);
        showMessage(language === 'id' ? 'Pembelian berhasil! Avatar terpasang.' : 'Purchase successful! Avatar equipped.', 'success');
      } else {
        playWrong();
        showMessage(language === 'id' ? 'Koin tidak cukup!' : 'Not enough coins!', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 text-[#0D1117]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden relative"
      >
        <div className="flex items-center p-6">
          <button 
            onClick={() => { playClick(); onBack(); }}
            className="w-10 h-10 rounded-full bg-[#F4F5F7] flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-[#0D1117]" />
          </button>
          <h2 className="text-xl font-poppins font-black text-[#0D1117] ml-4">
            {language === 'id' ? "Edit Profil & Avatar" : "Edit Profile & Avatar"}
          </h2>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pb-4">
          <div className="flex p-1 bg-[#F4F5F7] rounded-full">
            <button 
              onClick={() => { playClick(); setActiveTab('profile'); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-colors cursor-pointer ${activeTab === 'profile' ? 'bg-[#0D1117] text-white' : 'text-slate-600 hover:text-[#0D1117]'}`}
            >
              {language === 'id' ? 'Data Diri' : 'Personal Info'}
            </button>
            <button 
              onClick={() => { playClick(); setActiveTab('shop'); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'shop' ? 'bg-[#0D1117] text-white' : 'text-slate-600 hover:text-[#0D1117]'}`}
            >
              <Store className="w-3.5 h-3.5" />
              {language === 'id' ? 'Toko Avatar' : 'Avatar Shop'}
            </button>
          </div>
        </div>

        {message.text && (
          <div className="px-6 pb-2">
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-2xl text-xs font-bold text-center ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
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
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-[#F4F5F7] flex items-center justify-center">
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                    ) : profilePic ? (
                      <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-12 h-12 text-slate-400" />
                    )}
                  </div>
                  <label className="absolute -bottom-1 -right-1 w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors">
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-4 h-4" />}
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={isUploading} />
                  </label>
                </div>
                {profilePic && (
                  <button onClick={handleRemovePhoto} disabled={isUploading} className="text-xs font-bold text-rose-600 hover:text-rose-700 mt-1 cursor-pointer">
                    {language === 'id' ? 'Hapus Foto' : 'Remove Photo'}
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    {language === 'id' ? "Nama Lengkap" : "Full Name"}
                  </label>
                  <input 
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F4F5F7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-sm text-[#0D1117]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    {language === 'id' ? "Username" : "Username"}
                  </label>
                  <input 
                    type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F4F5F7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-sm text-[#0D1117]"
                  />
                </div>
              </div>

              <button 
                onClick={handleSaveProfile} disabled={isSaving}
                className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full transition-colors flex justify-center items-center gap-2 cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{language === 'id' ? "Simpan Perubahan" : "Save Changes"}</>}
              </button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <div className="flex items-center justify-between bg-[#F4F5F7] p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Coins className="w-6 h-6 text-amber-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-500 leading-none">
                      {language === 'id' ? 'Koin Kamu' : 'Your Coins'}
                    </p>
                    <p className="text-xl font-poppins font-black text-[#0D1117] mt-1 tabular-nums">
                      {userCoins.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {DEFAULT_AVATARS.map((avatar) => {
                  const isOwned = ownedAvatars.includes(avatar.id);
                  const isEquipped = profilePic === avatar.url;
                  
                  return (
                    <div 
                      key={avatar.id}
                      className={`relative rounded-2xl p-4 transition-colors flex flex-col items-center text-center ${
                        isEquipped ? 'bg-emerald-50 ring-2 ring-emerald-600' : 'bg-[#F4F5F7]'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-white mb-3">
                        <img src={avatar.url} alt={avatar.id} className="w-full h-full object-cover" />
                      </div>
                      
                      <h3 className="text-xs font-bold text-[#0D1117] mb-2 leading-tight min-h-[2rem] flex items-center">
                        {language === 'id' ? avatar.nameID : avatar.nameEN}
                      </h3>
                      
                      {isOwned ? (
                        <button
                          onClick={() => handleBuyOrEquipAvatar(avatar)}
                          className={`mt-auto w-full py-2 rounded-full text-xs font-bold transition-colors ${
                            isEquipped 
                              ? 'bg-emerald-600 text-white cursor-default' 
                              : 'bg-white hover:bg-slate-200 text-[#0D1117] cursor-pointer'
                          }`}
                        >
                          {isEquipped ? (language === 'id' ? 'Dipakai' : 'Equipped') : (language === 'id' ? 'Pakai' : 'Equip')}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuyOrEquipAvatar(avatar)}
                          className="mt-auto w-full py-2 rounded-full text-xs font-bold bg-[#0D1117] hover:bg-slate-800 text-white transition-colors flex justify-center items-center gap-1.5 cursor-pointer tabular-nums"
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
