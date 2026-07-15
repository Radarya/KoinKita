import React, { useState, useEffect, useCallback, startTransition, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';
import { signInWithCredential, GoogleAuthProvider, signInAnonymously, linkWithCredential, linkWithPopup } from 'firebase/auth';
import { 
  Mail, 
  Lock, 
  User, 
  Calendar, 
  ShieldCheck, 
  Coins, 
  ArrowRight, 
  Loader2, 
  LogIn, 
  UserPlus,
  X,
  FileText,
  Shield,
  Eye,
  EyeOff,
  Info,
  Globe,
  Copy,
  Check,
  ShieldAlert,
  Search,
  Utensils,
  Leaf,
  Headphones,
  TrendingUp,
  ChevronDown,
  CircleDollarSign,
  Users,
  CheckCircle2,
  Gift,
  ArrowUp,
  Download,
  BookOpen,
  Trophy,
  WifiOff,
  Star,
  MessageSquare
} from 'lucide-react';
import { auth, googleProvider, db } from './firebase'; 
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc, updateDoc } from 'firebase/firestore';
import Dashboard from './components/Dashboard';
import TermsModal from './components/TermsModal';
import OnboardingModal from './components/OnboardingModal';
import { useTranslation } from './lib/LanguageContext';
import { bypassAutoplay, playClick, setAppActive } from './lib/audio';
import { App as CapacitorApp } from '@capacitor/app';

// ==========================================
export default function App() {
  const [hasPendingFriend, setHasPendingFriend] = useState(!!localStorage.getItem('pendingFriendRequest'));
  const handleStartLogin = () => setCurrentScreen('auth');



  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'loading' | 'landing' | 'auth' | 'app'>('loading');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { language } = useTranslation();
  const hasAttemptedAnon = useRef(false);
  const isLinkingRef = useRef(false); // Guard: prevents onAuthStateChanged from re-showing onboarding during active link/sign-in
  const [isLinking, setIsLinking] = useState(false);
  // Refs to avoid stale closures in auth listener without causing re-subscription on every screen change
  const currentScreenRef = useRef<'loading' | 'landing' | 'auth' | 'app'>('loading');
  const languageRef = useRef(language);
  useEffect(() => { currentScreenRef.current = currentScreen; }, [currentScreen]);
  useEffect(() => { languageRef.current = language; }, [language]);


  // Premium Toast Notification State
  type ToastType = 'success' | 'warning' | 'error' | 'info';
  const [toast, setToast] = useState<{ show: boolean, message: string, type: ToastType }>({ show: false, message: '', type: 'info' });
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const triggerToast = (message: string, type: ToastType = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  
  // Helper to process /add/ path segments and write to localStorage
  const processAddPath = useCallback((path: string) => {
    if (path.startsWith('/add/')) {
      const tag = path.split('/add/')[1];
      if (tag) {
        localStorage.setItem('pendingFriendRequest', tag);
        localStorage.setItem('referralTag', tag);
        setHasPendingFriend(true);
        // Dispatch custom event for components (like Dashboard) if already mounted
        window.dispatchEvent(new Event('pendingFriendRequestUpdated'));
        return true;
      }
    }
    return false;
  }, []);

  // Web deep link check (runs on mount)
  useEffect(() => {
    const path = window.location.pathname;
    if (processAddPath(path)) {
      window.history.replaceState({}, document.title, '/');
    }
  }, [processAddPath]);

  // Capacitor Native deep link check (listens to app open event)
  useEffect(() => {
    let listener: any = null;

    try {
      if (Capacitor.isNativePlatform() && CapacitorApp && typeof CapacitorApp.addListener === 'function') {
        listener = CapacitorApp.addListener('appUrlOpen', (event: { url: string }) => {
          try {
            const urlObj = new URL(event.url);
            const path = urlObj.pathname;
            if (processAddPath(path)) {
              triggerToast(
                language === 'id' 
                  ? 'Tautan pertemanan berhasil terdeteksi!' 
                  : 'Friend link successfully detected!', 
                'success'
              );
            }
          } catch (urlErr) {
            console.error("Error parsing deep link URL:", urlErr);
          }
        });
      }
    } catch (err) {
      console.warn("Capacitor App plugin not available or error adding listener:", err);
    }

    return () => {
      if (listener && typeof listener.remove === 'function') {
        listener.remove();
      }
    };
  }, [processAddPath, language]);

  // Listen to Capacitor App State Changes (foreground/background) to manage audio/music
  useEffect(() => {
    let listener: any = null;

    try {
      if (Capacitor.isNativePlatform() && CapacitorApp && typeof CapacitorApp.addListener === 'function') {
        listener = CapacitorApp.addListener('appStateChange', (state) => {
          if (state && typeof state.isActive === 'boolean') {
            setAppActive(state.isActive);
          }
        });
      }
    } catch (err) {
      console.warn("Capacitor App plugin not available or error adding appStateChange listener:", err);
    }

    return () => {
      if (listener && typeof listener.remove === 'function') {
        listener.remove();
      }
    };
  }, []);

  useEffect(() => {
    // 3. F12 ANTI-CHEAT SECURITY - CONSOLE & SHORTCUT BLOCKER
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      // Only block the context menu, but don't show the toast on touch devices to avoid triggering on every long press
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
      ) {
        e.preventDefault();
        triggerToast(language === 'id' ? 'Protokol Keamanan Aktif: Akses Konsol Dibatasi!' : 'Security Protocol Active: Console Access Restricted!', 'warning');
      }
    };

    // 3. F12 ANTI-CHEAT SECURITY - OBFUSCATED STORAGE CHECKER
    const checkObfuscatedStorage = () => {
      const savedData = localStorage.getItem('koinKita_SaveData');
      if (savedData) {
        try {
          const decoded = atob(savedData);
          JSON.parse(decoded);
        } catch (e) {
          localStorage.removeItem('koinKita_SaveData');
          triggerToast(language === 'id' ? 'Tampering terdeteksi di F12 Application Tab! Memulai ulang data penyimpanan lokal...' : 'Tampering detected in F12 Application Tab! Initiating local storage reset...', 'warning');
        }
      }
    };

    checkObfuscatedStorage();
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [language]);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      triggerToast(language === 'id' ? 'Koneksi internet terputus. Bekerja secara offline...' : 'Internet connection lost. Working offline...', 'warning');
    };

    const handleOnline = () => {
      setIsOffline(false);
      triggerToast(language === 'id' ? 'Koneksi internet kembali! Menyinkronkan data...' : 'Internet connection restored! Syncing data...', 'success');
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [language]);

  useEffect(() => {
    // 1. AUTO-LOGIN MECHANIC (SESSION PERSISTENCE & GUEST AUTO-LOGIN)
    // CRITICAL: wrap in authStateReady() so Firebase FULLY loads the persisted
    // session before we subscribe. Without this, Firebase fires user=null first
    // (intermediate state), we redirect to landing, user taps "Continue as Guest"
    // before Firebase fires the REAL restored anon user → new account created every time.
    let unsubscribe: (() => void) | null = null;

    auth.authStateReady().then(() => {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        // Read current values from refs to avoid stale closures and prevent re-subscription on screen changes
        const currentScreen = currentScreenRef.current;
        const language = languageRef.current;

        // Check for unverified email accounts (allow unverified google accounts as they don't strictly need one)
        // Only auto-kick if they are not in the auth modal, so we don't interrupt the registration flow
        if (user && !user.emailVerified && user.providerData.some(p => p.providerId === 'password') && currentScreen !== 'auth') {
          setCurrentUser(null);
          await signOut(auth);
          if (currentScreen === 'app' || currentScreen === 'loading') {
            // Guest "logout" should return to landing without showing onboarding again
            setShowOnboarding(false);
            startTransition(() => {
              setCurrentScreen('landing');
            });
          }
          return;
        }

        setCurrentUser(user);
        if (user) {
          // Prevent redirecting to the app if they just registered and are unverified
          if (user.providerData.some(p => p.providerId === 'password') && !user.emailVerified) {
               return; // Halt navigation, allow handleRegister to finish and call signOut
          }
          
          let displayName = user.displayName || (user.isAnonymous ? (language === 'id' ? 'Tamu' : 'Guest') : 'Pemain');
          let onboardingNotCompleted = false;

          try {
            const userDocRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
              const data = userSnap.data();
              if (data.fullName) displayName = data.fullName;
              if (!data.hasCompletedOnboarding) {
                onboardingNotCompleted = true;
              }
            } else {
              // Auto-create document for new anonymous guest
              onboardingNotCompleted = true;
              const randomTag = Math.floor(1000 + Math.random() * 9000).toString();
              await setDoc(userDocRef, {
                uid: user.uid,
                name: displayName,
                fullName: displayName,
                email: user.email || 'guest@koinkita.xyz',
                tag: randomTag,
                totalCoins: 0,
                coins: 0,
                lives: 5,
                level: 0,
                friends: [],
                claimedQuests: {},
                dailyStats: {},
                lastSentLife: {},
                profilePicUrl: '',
                createdAt: new Date().toISOString(),
                isAnonymous: user.isAnonymous,
                hasCompletedOnboarding: false
              });
            }
          } catch (e) {
            console.warn("Error fetching/setting user profile inside auth state change", e);
          }

          const hasSeen = localStorage.getItem('hasSeenOnboarding') === 'true';
          // Skip re-showing onboarding if a link/sign-in operation is currently in flight
          if (onboardingNotCompleted && !hasSeen && !isLinkingRef.current) {
            setShowOnboarding(true);
          }


          // Auto-navigate to app for verified/non-anonymous users only.
          // Exception: anonymous user coming from loading screen on first launch should also enter app.
          const shouldAutoNav = (currentScreen === 'loading' && user.isAnonymous) ||
            (!user.isAnonymous && (currentScreen === 'loading' || currentScreen === 'auth' || currentScreen === 'landing'));

          if (shouldAutoNav) {
             if (currentScreen !== 'loading' && !user.isAnonymous) {
               triggerToast(language === 'id' ? `Selamat datang kembali, ${displayName}!` : `Welcome back, ${displayName}!`, 'info');
             }
             startTransition(() => {
               setCurrentScreen('app');
             });
          }
        } else {
          // If no user is logged in (e.g. after a real Google/Email sign out)
          setShowOnboarding(false);
          const isFirstLaunch = localStorage.getItem('hasSeenOnboarding') !== 'true';

          if (Capacitor.isNativePlatform() && isFirstLaunch && !hasAttemptedAnon.current) {
            // Native App first launch: auto sign-in anonymously so user lands on dashboard directly
            hasAttemptedAnon.current = true;
            try {
              await signInAnonymously(auth);
            } catch (anonErr) {
              console.error("Auto anonymous sign-in failed:", anonErr);
              startTransition(() => {
                setCurrentScreen('landing');
              });
            }
          } else {
            // After a real logout OR web: go to landing page so user actively picks login method
            if (currentScreen === 'app' || currentScreen === 'loading') {
              startTransition(() => {
                setCurrentScreen('landing');
              });
            }
          }
        }
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  // Only re-subscribe when language changes. currentScreen is read via ref to avoid stale closures.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (currentScreen === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative font-poppins selection:bg-emerald-500 selection:text-white">

      <AnimatePresence>
        
      </AnimatePresence>


      <AnimatePresence>
        
      </AnimatePresence>


      


      

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center"
        >
          {/* Animated Coin / Spinner */}
          <motion.div
            animate={{ 
              y: [0, -15, 0],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            style={{ willChange: "transform" }}
            className="w-20 h-20 bg-gradient-to-tr from-amber-300 to-yellow-400 rounded-full shadow-lg shadow-amber-400/30 border-4 border-white flex items-center justify-center mb-6 relative"
          >
             <div className="absolute inset-2 border-2 border-amber-500/30 rounded-full border-dashed animate-spin" style={{ animationDuration: '3s' }}></div>
             <CircleDollarSign className="w-10 h-10 text-amber-600 shrink-0 animate-spin" style={{ animationDuration: '3s' }} />
          </motion.div>
          
          <h1 className="text-3xl font-black text-emerald-600 tracking-tight mb-2">
            KoinKita
          </h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center max-w-xs animate-pulse">
            {language === 'id' ? 'Menyiapkan ruang finansialmu...' : 'Preparing your financial space...'}
          </p>
        </motion.div>
      </div>
    );
  }

  const handleLinkGoogle = async () => {
    bypassAutoplay();
    isLinkingRef.current = true; // Block onboarding loop guard
    setIsLinking(true);

    try {
      if (!auth.currentUser) {
        let credential;
        let res;
        if (Capacitor.isNativePlatform()) {
          const result = await FirebaseAuthentication.signInWithGoogle({ useCredentialManager: false });
          if (result.credential?.idToken) {
            credential = GoogleAuthProvider.credential(result.credential.idToken);
            res = await signInWithCredential(auth, credential);
          } else {
            throw new Error("Gagal mendapatkan credential dari Google Sign-In");
          }
        } else {
          res = await signInWithPopup(auth, googleProvider);
        }

        const userDocRef = doc(db, 'users', res.user.uid);
        const userSnap = await getDoc(userDocRef);
        const currentData = userSnap.exists() ? userSnap.data() : {};

        const full = res.user.displayName || "Pemain Google";
        await setDoc(userDocRef, {
          ...currentData,
          uid: res.user.uid,
          name: full,
          fullName: full,
          email: res.user.email || 'guest@koinkita.xyz',
          // Only set Google photo if user hasn't set a custom profile picture
          ...(!currentData.profilePictureUrl && !currentData.profilePicUrl && { profilePictureUrl: res.user.photoURL || '' }),
          isAnonymous: false,
          hasCompletedOnboarding: true
        }, { merge: true });


        localStorage.setItem('hasSeenOnboarding', 'true');
        setShowOnboarding(false);
        triggerToast(language === 'id' ? 'Berhasil masuk dengan Google!' : 'Successfully signed in with Google!', 'success');
        return;
      }

      let credential;
      let res;
      if (Capacitor.isNativePlatform()) {
        const result = await FirebaseAuthentication.signInWithGoogle({ useCredentialManager: false });
        if (result.credential?.idToken) {
          credential = GoogleAuthProvider.credential(result.credential.idToken);
          res = await linkWithCredential(auth.currentUser, credential);
        } else {
          throw new Error("Gagal mendapatkan credential dari Google Sign-In");
        }
      } else {
        res = await linkWithPopup(auth.currentUser, googleProvider);
      }

      // Update Firestore user document
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userDocRef);
      const currentData = userSnap.exists() ? userSnap.data() : {};
      
      const full = res.user.displayName || "Pemain Google";
      await setDoc(userDocRef, {
        ...currentData,
        uid: res.user.uid,
        name: full,
        fullName: full,
        email: res.user.email || 'guest@koinkita.xyz',
        // Preserve custom photo — only use Google photo as fallback if none exists
        ...(!currentData.profilePictureUrl && !currentData.profilePicUrl && { profilePictureUrl: res.user.photoURL || '' }),
        isAnonymous: false,
        hasCompletedOnboarding: true
      }, { merge: true });


      localStorage.setItem('hasSeenOnboarding', 'true');
      triggerToast(language === 'id' ? 'Akun berhasil ditautkan ke Google!' : 'Account successfully linked to Google!', 'success');
      setShowOnboarding(false);
    } catch (e: any) {
      console.warn("Failed to link/sign in Google account:", e);
      if (e.code === 'auth/credential-already-in-use') {
        // Fallback: sign in directly since it's already registered
        triggerToast(
          language === 'id' 
            ? 'Akun Google ini sudah terdaftar. Masuk ke akun tersebut...' 
            : 'This Google account is already registered. Logging in to it...', 
          'info'
        );
        try {
          if (Capacitor.isNativePlatform()) {
            const result = await FirebaseAuthentication.signInWithGoogle({ useCredentialManager: false });
            if (result.credential?.idToken) {
              const credential = GoogleAuthProvider.credential(result.credential.idToken);
              await signInWithCredential(auth, credential);
            }
          } else {
            await signInWithPopup(auth, googleProvider);
          }
          localStorage.setItem('hasSeenOnboarding', 'true');
          setShowOnboarding(false);
        } catch (signInErr) {
          console.error("Sign-in fallback failed:", signInErr);
          triggerToast(language === 'id' ? 'Gagal masuk ke akun Google.' : 'Failed to log in to Google account.', 'error');
        }
      } else {
        triggerToast(language === 'id' ? 'Gagal menautkan akun.' : 'Failed to link account.', 'error');
      }
    } finally {
      isLinkingRef.current = false;
      setIsLinking(false);
    }
  };


  const handleContinueGuest = async () => {
    playClick();
    setIsLinking(true);
    try {
      let currentUid = auth.currentUser?.uid;
      if (!auth.currentUser) {
        const res = await signInAnonymously(auth);
        currentUid = res.user.uid;
      }
      if (currentUid) {
        const userDocRef = doc(db, 'users', currentUid);
        await setDoc(userDocRef, {
          hasCompletedOnboarding: true
        }, { merge: true });
        localStorage.setItem('hasSeenOnboarding', 'true');
        setShowOnboarding(false);
        startTransition(() => {
          setCurrentScreen('app');
        });
        triggerToast(language === 'id' ? 'Masuk sebagai Tamu' : 'Entered as Guest', 'success');
      }
    } catch (e) {
      console.warn("Failed to update onboarding status in Firestore:", e);
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <>
      {/* Offline Banner */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-rose-500 text-white text-xs font-bold text-center py-1.5 px-4 shadow-md flex items-center justify-center gap-2 sticky top-0 z-[100]"
          >
            <WifiOff className="w-3.5 h-3.5" />
            {language === 'id' ? 'Anda sedang offline. Beberapa fitur mungkin tidak disimpan.' : 'You are offline. Some features might not save.'}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`fixed top-6 right-6 lg:right-10 z-[9999] bg-white/95  text-slate-800 px-6 py-4 rounded-xl shadow-xl shadow-slate-200/50 border-l-4 flex items-center gap-4 min-w-[300px] border border-y-slate-100 border-r-slate-100 ${
              toast.type === 'success' ? 'border-l-emerald-500' :
              toast.type === 'warning' || toast.type === 'error' ? 'border-l-rose-500' :
              'border-l-indigo-500'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />}
            {(toast.type === 'warning' || toast.type === 'error') && <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0" />}
            {toast.type === 'info' && <Info className="w-6 h-6 text-indigo-500 shrink-0" />}
            <span className="font-poppins font-medium text-sm sm:text-base leading-snug">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {currentScreen === 'landing' ? (
        <LandingPage 
          onLinkGoogle={handleLinkGoogle} 
          onContinueGuest={handleContinueGuest} 
          onGoToAuth={() => {
            startTransition(() => {
              setCurrentScreen('auth');
            });
          }}
          isLoading={isLinking}
          hasPendingFriend={!!localStorage.getItem('pendingFriendRequest')} 
        />
      ) : currentScreen === 'app' && currentUser ? (
        <>
          <Dashboard 
            user={currentUser} 
            onShowTerms={() => {}} 
            triggerToast={triggerToast} 
            onGuestLogout={() => {
              // Guest "logout": don't sign out — just show login choice overlay
              // Preserve anonymous session and avoid onboarding loop
              setShowOnboarding(false);
              startTransition(() => {
                setCurrentScreen('landing');
              });
            }}
            onSwitchGoogle={handleLinkGoogle}
          />
          {showOnboarding && (
            <OnboardingModal 
              onLinkGoogle={handleLinkGoogle} 
              onContinueGuest={handleContinueGuest} 
              onGoToAuth={() => {
                startTransition(() => {
                  setShowOnboarding(false);
                  setCurrentScreen('auth');
                });
              }}
              isLoading={isLinking} 
            />
          )}
        </>
      ) : (
        <GameAuth 
          onBack={() => startTransition(() => setCurrentScreen('landing'))} 
          triggerToast={triggerToast} 
        />
      )}
    </>
  );
}

const authTranslations = {
  id: {
    tagline: "Main, Belajar, dan Jadi Ahli Keuangan!",
    signIn: "Masuk",
    signUp: "Daftar",
    emailLabel: "Kunci Email",
    emailPlaceholder: "pemain@email.com",
    passwordLabel: "Password Rahasia",
    passwordPlaceholder: "••••••••",
    repeatPasswordLabel: "Ulangi Password",
    heroNameLabel: "Nama Lengkap",
    heroNamePlaceholder: "Cth: Budi Santoso",
    usernameLabel: "Nama Pengguna (Username)",
    usernamePlaceholder: "Cth: budi_santoso",
    birthdayLabel: "Tanggal Lahir",
    birthdayTooltip: "Kami membutuhkan umurmu untuk menyesuaikan tingkat kesulitan permainan secara otomatis.",
    submitLogin: "Mulai Petualangan",
    submitRegister: "Buat Akun Sekarang!",
    orPlayWith: "ATAU MAINKAN DENGAN",
    googlePlay: "Lanjutkan dengan Google",
    tosAgreement: "Dengan membuat akun, kamu setuju dengan Aturan Main dan Kebijakan Privasi petualangan ini.",
    tosLink: "Aturan Main",
    privacyLink: "Kebijakan Privasi",
    playTitle: "KoinKita",
    emailRequired: "Email pendaftaran wajib diisi.",
    passwordRequired: "Password wajib diisi.",
    successLogin: "Login Berhasil! Bersiap memulai petualangan...",
    successRegister: "Pendaftaran Berhasil! Selamat datang kawan!",
    // Terms modal
    tosTitle: "Aturan Main (TOS)",
    tosIntro: "Selamat datang di KoinKita! Aturan Main ini mengatur penggunaan layanan, fitur, dan platform edukasi KoinKita. Dengan mendaftar dan bermain, Anda menyetujui seluruh ketentuan di bawah ini.",
    tosSec1Title: "Registrasi & Akun",
    tosSec1Desc: "Pengguna wajib memberikan informasi yang akurat (seperti umur) agar sistem dapat menghitung tingkat kesulitan dan simulasi yang pas. Keamanan dan kerahasiaan akun (email dan sandi) sepenuhnya menjadi tanggung jawab pengguna.",
    tosSec2Title: "Koin, Klub, & Liga Mingguan",
    tosSec2Desc: "Koin, poin kas klub, XP Liga, dan semua aset virtual di dalam KoinKita murni untuk tujuan simulasi edukasi. Aset ini tidak memiliki nilai finansial di dunia nyata dan tidak dapat diuangkan. Untuk menjaga permainan tetap kompetitif, promosi/degradasi Liga dan misi pengumpulan poin kas klub (crowdfunding) dapat diperbarui atau di-reset secara berkala setiap minggunya.",
    tosSec3Title: "Integritas & Fair Play",
    tosSec3Desc: "Setiap pemain wajib menjaga sportivitas. Segala bentuk eksploitasi celah (bug), penggunaan bot, modifikasi skrip ilegal (termasuk memanipulasi LocalStorage/Inspect Element), atau upaya memanipulasi data papan peringkat akan dikenakan sanksi berupa penghapusan skor atau pemblokiran akun tanpa pemberitahuan.",
    tosSec4Title: "DISCLAIMER PENASIHAT KEUANGAN",
    tosSec4Desc: "Semua simulasi perhitungan inflasi, investasi, penghematan, dan alokasi anggaran dalam KoinKita dibuat sesederhana mungkin untuk keperluan edugame (edukasi gim). KoinKita tidak bertindak sebagai Penasihat Keuangan (Financial Advisor) profesional. Keputusan pengelolaan finansial secara nyata sepenuhnya menjadi tanggung jawab pribadi Anda.",
    tosSec5Title: "Hak Pengembang (Developer Rights)",
    tosSec5Desc: "Pengembang dapat sewaktu-waktu memperbarui mekanik permainan, menyesuaikan skor, mengatur ulang sistem level, atau membatasi perolehan koin/aset untuk menjaga ekosistem game tanpa kewajiban memberi kompensasi atas skor sebelumnya.",
    tosUnderstand: "Saya Mengerti",
    // Privacy modal
    privacyTitle: "Kebijakan Privasi",
    privacyIntro: "Bagian ini fokus pada transparansi mengenai data apa yang kami kumpulkan, untuk apa data tersebut digunakan, dan di mana disimpannya.",
    privacySec1Title: "Data yang Kami Kumpulkan",
    privacySec1Desc: "Kami mengumpulkan informasi berupa Nama Lengkap, Username, Alamat Email, Tanggal Lahir, dan Kata Sandi saat kamu mendaftar.",
    privacySec2Title: "Tujuan Pengumpulan Data",
    privacySec2Name: "Nama & Username: Untuk personalisasi tampilan (menyapa kamu di dashboard) dan membedakan profilmu di daftar teman maupun klub.",
    privacySec2Email: "Email: Untuk keamanan akun (login) dan proses verifikasi kredensial.",
    privacySec2Age: "Tanggal Lahir: Untuk menghitung umur guna menentukan tingkat kesulitan game yang cocok untukmu.",
    privacySec3Title: "Keamanan Data Firebase",
    privacySec3Desc: "Kami sangat menjaga keamanan datamu. Semua data disimpan secara aman menggunakan infrastruktur Google Firebase dengan standar keamanan enkripsi industri. Kami tidak akan pernah menjual atau membagikan data pribadimu ke pihak ketiga tanpa izin eksplisit.",
    privacySec4Title: "Persetujuan Pengguna",
    privacySec4Desc: "Dengan membuat akun dan memainkan game ini, kamu dinyatakan setuju bahwa data yang kamu masukkan akan diproses sesuai dengan kebijakan privasi ini.",
    agreeButton: "Saya Setuju",
    domainHelperTitle: "Domain Belum Diizinkan (Unauthorized Domain)",
    domainHelperDesc: "Firebase mendeteksi bahwa domain tempat game ini berjalan belum didaftarkan di daftar 'Authorized Domains' di Firebase Project Anda.",
    domainHelperStepsTitle: "Langkah-Langkah Mudah Mengatasinya:",
    domainHelperStep1: "Kunjungi dan masuk ke Firebase Console Anda.",
    domainHelperStep2: "Pilih proyek Firebase Anda (misal: koinkita-3f734).",
    domainHelperStep3: "Buka menu 'Authentication' di panel navigasi sebelah kiri.",
    domainHelperStep4: "Pilih tab 'Settings' di bagian atas, lalu klik 'Authorized Domains' di sub-menu sebelah kiri.",
    domainHelperStep5: "Klik tombol 'Add domain' dan masukkan/tempel nama domain berikut ini:",
    domainHelperStep6: "Selesai! Klik 'Add', lalu segarkan (refresh) halaman game ini dan silakan coba masuk kembali!",
    copyButton: "Salin Domain",
    copied: "Berhasil Disalin!",
    closeModal: "Tutup"
  },
  en: {
    tagline: "Play, Learn, and Master Your Finances!",
    signIn: "Sign In",
    signUp: "Sign Up",
    emailLabel: "Email Key",
    emailPlaceholder: "player@email.com",
    passwordLabel: "Secret Password",
    passwordPlaceholder: "••••••••",
    repeatPasswordLabel: "Repeat Password",
    heroNameLabel: "Full Name",
    heroNamePlaceholder: "e.g., John Doe",
    usernameLabel: "Username (Handle)",
    usernamePlaceholder: "e.g., john_doe",
    birthdayLabel: "Date of Birth",
    birthdayTooltip: "We need your age to automatically adjust the game's difficulty.",
    submitLogin: "Start Adventure",
    submitRegister: "Create Account Now!",
    orPlayWith: "OR PLAY WITH",
    googlePlay: "Continue with Google",
    tosAgreement: "By creating an account, you agree to the Rules of Play and Privacy Policy of this adventure.",
    tosLink: "Rules of Play",
    privacyLink: "Privacy Policy",
    playTitle: "KoinKita",
    emailRequired: "Registration email is required.",
    passwordRequired: "Password is required.",
    successLogin: "Login Successful! Preparing your adventure...",
    successRegister: "Registration Successful! Welcome friend!",
    // Terms modal
    tosTitle: "Rules of Play (TOS)",
    tosIntro: "Welcome to KoinKita! These Rules of Play govern your use of the KoinKita services, features, and educational platform. By registering and playing, you agree to all the terms below.",
    tosSec1Title: "Registration & Account",
    tosSec1Desc: "Users are advised to provide accurate information (such as age) so that the system can calculate appropriate difficulty levels and simulations. The security and confidentiality of accounts (email and password) are entirely the responsibility of the user.",
    tosSec2Title: "Coins, Clubs, & Weekly Leagues",
    tosSec2Desc: "Coins, club treasury points, League XP, and all virtual assets within the KoinKita ecosystem are purely for educational simulation purposes. They have no real-world financial value and cannot be cashed out. To maintain competitive gameplay, League promotions/demotions and club crowdfunding missions may be periodically updated or reset every week.",
    tosSec3Title: "Integrity & Fair Play",
    tosSec3Desc: "Every player is required to maintain sportsmanship. Any form of bug exploitation, bot usage, illegal script modification (including manipulating LocalStorage or Inspect Element), or attempts to manipulate leaderboard data will result in sanctions, such as score deletion or account suspension without prior notice.",
    tosSec4Title: "FINANCIAL ADVISOR DISCLAIMER",
    tosSec4Desc: "All inflation, investment, savings, and budget allocation simulations in KoinKita are kept as simple as possible for educational game purposes. KoinKita does not act as a professional Financial Advisor. Real-world financial decisions are entirely your personal responsibility.",
    tosSec5Title: "Developer Rights",
    tosSec5Desc: "Developers may update game mechanics, adjust scores, rework the leveling system, or limit coin/asset acquisition at any time to maintain the game's ecosystem, without any obligation to compensate for prior scores.",
    tosUnderstand: "I Understand",
    // Privacy modal
    privacyTitle: "Privacy Policy",
    privacyIntro: "This section focuses on transparency regarding what data we collect, what it is used for, and where it is stored.",
    privacySec1Title: "Data Collected",
    privacySec1Desc: "We collect information such as your Full Name, Username, Email Address, Date of Birth, and Secret Password when you register.",
    privacySec2Title: "Purpose of Data Collection",
    privacySec2Name: "Name & Username: For display personalization (greeting you on the dashboard) and to identify your profile among friends and club members.",
    privacySec2Email: "Email: For account security (login) and credential verification processes.",
    privacySec2Age: "Date of Birth: To calculate your age in order to determine the appropriate game difficulty or content suitable for you.",
    privacySec3Title: "Firebase Data Security",
    privacySec3Desc: "We take the security of your data seriously. All data is securely stored using Google Firebase infrastructure with industry-standard encryption. We will never sell or share your personal data with third parties without your explicit permission.",
    privacySec4Title: "User Consent",
    privacySec4Desc: "By creating an account and playing this game, you consent that your input data will be processed in accordance with this privacy policy.",
    agreeButton: "I Agree",
    domainHelperTitle: "Unauthorized Domain",
    domainHelperDesc: "Firebase has detected that the domain this game is running on is not added to the 'Authorized Domains' list in your Firebase Project configuration.",
    domainHelperStepsTitle: "Easy Steps to Resolve This:",
    domainHelperStep1: "Visit and log in to your Firebase Console.",
    domainHelperStep2: "Select your active Firebase Project (e.g., koinkita-3f734).",
    domainHelperStep3: "Navigate to the 'Authentication' menu on the left side panel.",
    domainHelperStep4: "Select the 'Settings' tab on the top menu, then click 'Authorized Domains' in the sub-menu.",
    domainHelperStep5: "Click the 'Add domain' button and enter/paste the following domain name:",
    domainHelperStep6: "Click 'Add' to save, refresh this game webpage in your browser, and play with Google Sign-In!",
    copyButton: "Copy Domain",
    copied: "Copied Successfully!",
    closeModal: "Close"
  }
};

const PROFANITY_BLACKLIST = [
  "anjing", "babi", "bangsat", "toxic", "admin", "hacker", "fck", "shit",
  "kontol", "memek", "jembut", "goblok", "tolol", "ngentot", "fuck", "bitch",
  "asshole", "dick", "pussy", "cunt", "bastard"
];

const validateNameInput = (input: string, minLimit: number, maxLimit: number): boolean => {
  const trimmed = input.trim();
  if (trimmed.length < minLimit || trimmed.length > maxLimit) return false;
  
  if (!/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/.test(trimmed)) return false;
  
  const lowerInput = trimmed.toLowerCase();
  for (const word of PROFANITY_BLACKLIST) {
    if (lowerInput.includes(word)) return false;
  }
  
  return true;
};

function GameAuth({ onBack, triggerToast }: { onBack?: () => void, triggerToast?: (msg: string, type: 'success'|'warning'|'error'|'info') => void }) {
  const { language, toggleLanguage } = useTranslation();
  const tAuth = authTranslations[language];

  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Form States
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Visibility States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Modal States
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showDomainHelper, setShowDomainHelper] = useState(false);
  const [copied, setCopied] = useState(false);

  const clearForm = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    clearForm();
  };

  const handleDisplayError = (error: any) => {
    // Check if error is a known/expected user input error to avoid triggering console.warn overlays
    const code = error?.code || '';
    const message = error?.message || '';

    if (!code || code === 'auth/network-request-failed') {
      console.warn("Auth System Error:", error);
    } else {
      console.warn("Auth User Event:", code);
    }

    // Check for unauthorized-domain either by code or by pattern in the error message
    if (code === 'auth/unauthorized-domain' || message.includes('unauthorized-domain') || message.includes('auth/unauthorized-domain')) {
      const currentHost = window.location.hostname;
      setErrorMsg(language === 'id'
        ? `Domain "${currentHost}" belum didaftarkan di Firebase Console Anda. Silakan tambahkan domain ini ke daftar 'Authorized Domains'.`
        : `Domain "${currentHost}" is not authorized. Please add this domain to 'Authorized Domains' in your Firebase console.`
      );
      setShowDomainHelper(true);
    } else if (code === 'auth/email-already-in-use') {
      setErrorMsg(language === 'id' 
        ? 'Email pendaftaran sudah digunakan oleh akun lain. Silakan coba email lain atau masuk dengan email tersebut.' 
        : 'This email is already in use by another account. Please try another email or log in.'
      );
    } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      setErrorMsg(language === 'id' 
        ? 'Email atau password tidak sesuai. Pastikan kembali data yang Anda masukkan sudah benar.' 
        : 'Incorrect email or password. Please double check that your input details are correct.'
      );
    } else if (code === 'auth/weak-password') {
      setErrorMsg(language === 'id' 
        ? 'Oh tidak, password kamu terlalu lemah! Cobalah dengan kombinasi minimal 6 huruf dan angka.' 
        : 'Oh no, your password is too weak! Try a combination of at least 6 letters and numbers.'
      );
    } else if (code === 'auth/network-request-failed' || error?.message?.includes('offline') || error?.message?.includes('Quota')) {
      setErrorMsg(language === 'id' 
        ? 'Gagal terhubung ke server. Pastikan koneksi internet aktif, atau periksa apakah database Firestore sudah dibuat di console Firebase.' 
        : 'Failed to connect to the server. Make sure your internet connection is active.'
      );
    } else if (code === 'auth/operation-not-allowed' || code === 'auth/configuration-not-found') {
      setErrorMsg(language === 'id' 
        ? 'Metode login ini belum diaktifkan. Harap aktifkan Email/Password atau Google Sign-in di Firebase Console.' 
        : 'This login method is not enabled. Please enable Email/Password or Google Sign-In in Firebase Console.'
      );
    } else {
      const rawError = error?.message || error?.code || JSON.stringify(error) || 'Unknown error';
      let friendlyError = rawError;
      
      if (rawError.includes('10:') || rawError.includes('DEVELOPER_ERROR')) {
        friendlyError = 'DEVELOPER_ERROR: SHA-1 certificate fingerprint belum ditambahkan di Firebase Console untuk aplikasi Android ini, atau Web Client ID belum dikonfigurasi dengan benar di string.xml.';
      } else if (rawError.includes('Gagal mendapatkan credential')) {
        friendlyError = 'Gagal mendapatkan token dari Google. Pastikan Google Play Services tersedia.';
      }

      setErrorMsg(language === 'id' 
        ? `Gagal masuk dengan Google: ${friendlyError}` 
        : `Google Sign-in failed: ${friendlyError}`
      );
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    bypassAutoplay();
    isLinkingRef.current = true;
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg(language === 'id' 
        ? 'Registrasi gagal: Password dan konfirmasi password tidak sama. Tolong periksa kembali.' 
        : 'Registration failed: Passwords do not match. Please verify.'
      );
      return;
    }

    if (!fullName.trim() || !username.trim() || !birthDate) {
      setErrorMsg(language === 'id' 
        ? 'Registrasi gagal: Nama lengkap, Nama pengguna, dan Tanggal Lahir harus diisi semua!' 
        : 'Registration failed: Full name, username, and date of birth are required.'
      );
      return;
    }

    if (!validateNameInput(fullName, 3, 30)) {
      if (triggerToast) {
        triggerToast(
          language === 'id' 
            ? "Nama harus 3-30 karakter, tanpa simbol, dan bebas dari kata terlarang!" 
            : "Name must be 3-30 characters, no symbols, and free from restricted words!", 
          'warning'
        );
      }
      return;
    }

    if (!validateNameInput(username, 3, 12)) {
      if (triggerToast) {
        triggerToast(
          language === 'id' 
            ? "Nama harus 3-12 karakter, tanpa simbol, dan bebas dari kata terlarang!" 
            : "Name must be 3-12 characters, no symbols, and free from restricted words!", 
          'warning'
        );
      }
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    let ageNum = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      ageNum--;
    }

    if (ageNum < 4 || ageNum > 100) {
      setErrorMsg(language === 'id' 
        ? 'Pendaftaran ditolak: Umur kamu harus antara 4 hingga 100 tahun untuk bisa bermain.' 
        : 'Registration rejected: Your age must be between 4 and 100 years old to play.'
      );
      return;
    }

    setIsLoading(true);
    let createdUser: FirebaseUser | null = null;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      createdUser = userCredential.user;

      await updateProfile(createdUser, { displayName: username.trim() });

      try {
        await setDoc(doc(db, 'users', createdUser.uid), {
          uid: createdUser.uid,
          name: fullName.trim(),
          fullName: fullName.trim(),
          username: username.trim().toLowerCase().replace(/\s+/g, '_'),
          age: Number(ageNum),
          email: email.trim(),
          tag: Math.floor(1000 + Math.random() * 9000).toString(),
          totalCoins: 0,
          profilePictureUrl: createdUser.photoURL || '',
          createdAt: new Date()
        });
      } catch (firestoreErr: any) {
        console.warn("Firestore Rules Error or logic error: ", firestoreErr);
        throw new Error(`firestore-rule-error: ${firestoreErr.message || firestoreErr.code || 'Unknown error'}`);
      }

      await sendEmailVerification(createdUser);
      await signOut(auth);

      setSuccessMsg(language === 'id' ? 'Pendaftaran Berhasil! Harap cek email Anda untuk verifikasi sebelum login.' : 'Registration Successful! Please check your email for verification before logging in.');
    } catch (err: any) {
      if (err.message && err.message.startsWith('firestore-rule-error')) {
        const rawError = err.message.replace('firestore-rule-error: ', '');
        setErrorMsg(language === 'id' 
          ? `Gagal menyimpan profil ke database. Error: ${rawError}` 
          : `Failed to write profile to database. Error: ${rawError}`
        );
      } else {
        handleDisplayError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    bypassAutoplay();
    isLinkingRef.current = true;
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      
      if (!res.user.emailVerified) {
        await signOut(auth);
        setErrorMsg(language === 'id' ? 'Tolong verifikasi email Anda terlebih dahulu sebelum login. Cek inbox/spam Anda.' : 'Please verify your email first before logging in. Check your inbox/spam.');
        setIsLoading(false);
        return;
      }

      const userDocRef = doc(db, 'users', res.user.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        await setDoc(userDocRef, {
          uid: res.user.uid,
          lastLogin: new Date().toISOString(),
          ...( !data.createdAt && { createdAt: res.user.metadata.creationTime || new Date().toISOString() } ),
          ...( !data.tag && { tag: Math.floor(1000 + Math.random() * 9000).toString() } )
        }, { merge: true });
      }

      const displayName = userSnap.exists() && userSnap.data().fullName ? userSnap.data().fullName : "Pemain";
      setSuccessMsg(language === 'id' ? `Login Berhasil! Bersiap memulai petualangan, ${displayName}...` : `Login Successful! Preparing your adventure, ${displayName}...`);
    } catch (err) {
      handleDisplayError(err);
    } finally {
      isLinkingRef.current = false;
      setIsLoading(false);
    }
  };


  const handleGoogleLogin = async () => {
    bypassAutoplay();
    isLinkingRef.current = true;
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      let rest;
      let res;
      if (Capacitor.isNativePlatform()) {
        const result = await FirebaseAuthentication.signInWithGoogle({ useCredentialManager: false });
        if (result.credential?.idToken) {
          const credential = GoogleAuthProvider.credential(result.credential.idToken);
          res = await signInWithCredential(auth, credential);
        } else {
          throw new Error("Gagal mendapatkan credential dari Google Sign-In");
        }
      } else {
        res = await signInWithPopup(auth, googleProvider);
      }
      
      const userDocRef = doc(db, 'users', res.user.uid);
      const userSnap = await getDoc(userDocRef);
      
      if (!userSnap.exists()) {
        const full = res.user.displayName || "Pemain Baru";
        await setDoc(userDocRef, {
          uid: res.user.uid,
          name: full,
          fullName: full,
          username: full.toLowerCase().replace(/\s+/g, '_'),
          email: res.user.email,
          tag: Math.floor(1000 + Math.random() * 9000).toString(),
          totalCoins: 0,
          profilePictureUrl: res.user.photoURL || '',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        });
      } else {
        const data = userSnap.data();
        await setDoc(userDocRef, {
          uid: res.user.uid,
          lastLogin: new Date().toISOString(),
          ...((data.profilePictureUrl === undefined && data.profilePicUrl === undefined) && { profilePictureUrl: res.user.photoURL || '' }),
          ...( !data.createdAt && { createdAt: res.user.metadata.creationTime || new Date().toISOString() } ),
          ...( !data.tag && { tag: Math.floor(1000 + Math.random() * 9000).toString() } )
        }, { merge: true });
      }

      const displayName = userSnap.exists() && userSnap.data().fullName ? userSnap.data().fullName : (res.user.displayName || "Pemain");
        if (triggerToast) {
          triggerToast(language === 'id' ? `Berhasil masuk sebagai ${displayName}` : `Successfully logged in as ${displayName}`, 'success');
        }
    } catch (err) {
      handleDisplayError(err);
    } finally {
      setIsLoading(false);
    }
  };



  /**
   * @description Copies the current browser host origin domain name to clipboard for easy configuration in the Firebase Console setup.
   */
  const handleCopyDomain = async () => {
    try {
      await navigator.clipboard.writeText(window.location.hostname);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (copyErr) {
      console.warn("Failed to copy domain name to clipboard:", copyErr);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800 relative">

      <AnimatePresence>
        
      </AnimatePresence>

      {onBack && (
        <div className="absolute top-4 left-4 z-50">
          <button 
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 bg-white/95  hover:bg-white text-slate-600 rounded-2xl shadow-md border border-slate-200/50 transition-all font-bold active:scale-95 cursor-pointer"
            title="Back"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
        </div>
      )}

      {/* Absolute Language Switcher */}
      <div className="absolute top-4 right-4 z-50">
        <button 
           onClick={toggleLanguage}
           className="flex items-center gap-2 bg-white/95  hover:bg-white text-slate-700 px-4 py-2.5 rounded-2xl shadow-md border border-slate-200/50 transition-all font-bold text-sm tracking-wide active:scale-95 cursor-pointer"
           title="Toggle Language"
        >
           <Globe className="w-4 h-4 text-emerald-500" />
           <span className="uppercase tracking-wide">{language}</span>
        </button>
      </div>

      {/* Background decorations for modern game feel */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-300/20 "></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-300/20 "></div>
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-blue-300/20 "></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-900/10 border border-emerald-100 overflow-hidden">
          
          {/* Header Theme Area */}
          <div className="bg-emerald-500 relative p-8 pb-14 text-center overflow-hidden">
             {/* Decorative abstract pattern */}
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
             
             <motion.div 
               animate={{ y: [0, -6, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               style={{ willChange: "transform" }}
               className="mx-auto w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-xl border border-emerald-400 relative z-10"
             >
                <Coins className="w-9 h-9 text-amber-400 fill-amber-400 stroke-amber-500 stroke-[1.5px]" />
             </motion.div>
             
             <div className="relative z-10 mb-8 pb-4">
               <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2 drop-shadow-sm font-sans">
                  {tAuth.playTitle}
               </h1>
               <p className="text-emerald-50 text-sm font-medium tracking-wide drop-shadow-md pb-2">
                  {tAuth.tagline}
               </p>
             </div>

             {/* Curve separator for seamless transition to form */}
             <div className="absolute bottom-[-2px] left-0 right-0 z-0 text-white">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full fill-current">
                 <path d="M0,256L48,229.3C96,203,192,149,288,144C384,139,480,181,576,197.3C672,213,768,203,864,176C960,149,1056,107,1152,106.7C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
               </svg>
             </div>
          </div>

          <div className="px-8 pb-8 pt-2 relative z-10">
            {/* View Toggle */}
            <div className="flex p-1 bg-slate-100/80 rounded-xl mb-6 shadow-inner relative z-20  border border-slate-200/50">
              <button
                type="button"
                onClick={() => !isLoginView && toggleView()}
                className={`flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${isLoginView ? 'bg-white text-emerald-600 shadow border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <LogIn className="w-4 h-4" /> {tAuth.signIn}
              </button>
              <button
                type="button"
                onClick={() => isLoginView && toggleView()}
                className={`flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${!isLoginView ? 'bg-white text-emerald-600 shadow border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <UserPlus className="w-4 h-4" /> {tAuth.signUp}
              </button>
            </div>

            {/* Notifications */}
            <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, scale: 0.9 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.9 }}
                  className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium text-center shadow-sm flex items-center justify-center"
                >
                  {errorMsg}
                </motion.div>
              )}
              {successMsg && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, scale: 0.9 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.9 }}
                  className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm rounded-xl font-medium flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <span className="text-center">{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {isLoginView ? (
                /* ================= LOGIN VIEW ================= */
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLogin}
                  className="space-y-4 relative"
                >
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">{tAuth.emailLabel}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none text-sm font-medium shadow-sm"
                        placeholder={tAuth.emailPlaceholder}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">{tAuth.passwordLabel}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none text-sm font-medium shadow-sm"
                        placeholder={tAuth.passwordPlaceholder}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-[0_8px_16px_-6px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 mt-6 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 border-b-[3px] border-emerald-700 hover:border-emerald-700/50 active:border-b-0 active:translate-y-[3px]"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : tAuth.submitLogin}
                    {!isLoading && <ArrowRight className="w-5 h-5 drop-shadow-sm" />}
                  </button>
                </motion.form>
              ) : (
                /* ================= REGISTER VIEW ================= */
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleRegister}
                  className="space-y-4 relative"
                >
                  {/* Nama Lengkap */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">{tAuth.heroNameLabel}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        required
                        autoComplete="off"
                        spellCheck="false"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none text-sm font-medium shadow-sm"
                        placeholder={tAuth.heroNamePlaceholder}
                      />
                    </div>
                  </div>

                  {/* Nama Pengguna */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">{tAuth.usernameLabel}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold select-none text-base">
                        @
                      </div>
                      <input
                        type="text"
                        required
                        autoComplete="off"
                        spellCheck="false"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none text-sm font-medium shadow-sm"
                        placeholder={tAuth.usernamePlaceholder}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-[2]">
                       <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">{tAuth.emailLabel}</label>
                       <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                           <Mail className="w-5 h-5 text-slate-400" />
                         </div>
                         <input
                           type="email"
                           required
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none text-sm font-medium shadow-sm"
                           placeholder={tAuth.emailPlaceholder}
                         />
                       </div>
                    </div>
                    <div className="flex-[1.2]">
                       <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                         {tAuth.birthdayLabel}
                         <div className="relative group flex items-center shadow-none cursor-pointer">
                           <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] leading-tight rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none text-center shadow-lg after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-slate-800">
                             {tAuth.birthdayTooltip}
                           </div>
                         </div>
                       </label>
                       <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <Calendar className="w-4 h-4 text-slate-400" />
                         </div>
                         <input
                           type="date"
                           required
                           value={birthDate}
                           onChange={(e) => setBirthDate(e.target.value)}
                           className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none text-sm font-medium shadow-sm text-slate-600"
                         />
                       </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">{tAuth.passwordLabel}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none text-sm font-medium shadow-sm"
                        placeholder={tAuth.passwordPlaceholder}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">{tAuth.repeatPasswordLabel}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <ShieldCheck className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none text-sm font-medium shadow-sm"
                        placeholder={tAuth.passwordPlaceholder}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-600 text-amber-950 font-extrabold py-3.5 rounded-xl transition-all shadow-[0_8px_16px_-6px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 mt-6 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 border-b-[3px] border-amber-600 hover:border-amber-700/50 active:border-b-0 active:translate-y-[3px]"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : tAuth.submitRegister}
                    {!isLoading && <UserPlus className="w-5 h-5" />}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Di Register view: tampilkan link shortcut ke Login */}
            {!isLoginView && (
              <p className="mt-6 text-center text-sm text-slate-500">
                {language === 'id' ? 'Sudah punya akun?' : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={toggleView}
                  className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  {language === 'id' ? 'Masuk sekarang' : 'Log in now'}
                </button>
              </p>
            )}
            {/* Di Login view: shortcut ke Register */}
            {isLoginView && (
              <p className="mt-6 text-center text-sm text-slate-500">
                {language === 'id' ? 'Belum punya akun?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={toggleView}
                  className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  {language === 'id' ? 'Daftar sekarang' : 'Sign up now'}
                </button>
              </p>
            )}
            
            <p className="mt-6 text-center text-[10.5px] text-slate-400 font-medium px-4 leading-relaxed tracking-wide">
              {language === 'id' ? (
                <>Dengan membuat akun, kamu setuju dengan <span onClick={() => setShowTerms(true)} className="text-emerald-500 font-bold underline decoration-emerald-200 underline-offset-2 cursor-pointer hover:text-emerald-600 transition-colors">Aturan Main</span> dan <span onClick={() => setShowPrivacy(true)} className="text-emerald-500 font-bold underline decoration-emerald-200 underline-offset-2 cursor-pointer hover:text-emerald-600 transition-colors">Kebijakan Privasi</span> petualangan ini.</>
              ) : (
                <>By creating an account, you agree to the <span onClick={() => setShowTerms(true)} className="text-emerald-500 font-bold underline decoration-emerald-200 underline-offset-2 cursor-pointer hover:text-emerald-600 transition-colors">Rules of Play</span> and <span onClick={() => setShowPrivacy(true)} className="text-emerald-500 font-bold underline decoration-emerald-200 underline-offset-2 cursor-pointer hover:text-emerald-600 transition-colors">Privacy Policy</span> of this adventure.</>
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Reusable, beautifully synchronized Terms and Privacy Policy Modal */}
      <TermsModal 
        isOpen={showTerms || showPrivacy} 
        onClose={() => {
          setShowTerms(false);
          setShowPrivacy(false);
        }} 
        initialTab={showTerms ? 'rules' : 'privacy'}
      />

      <AnimatePresence>
        {showDomainHelper && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 "
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="bg-amber-50 p-5 shrink-0 flex items-center justify-between border-b border-amber-100">
                <div className="flex items-center gap-3 text-amber-800">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <ShieldAlert className="w-5 h-5 text-amber-600" />
                  </div>
                  <h2 className="font-bold text-lg">{tAuth.domainHelperTitle}</h2>
                </div>
                <button onClick={() => setShowDomainHelper(false)} className="p-2 text-amber-700 hover:bg-amber-100 rounded-full transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto text-sm text-slate-600 space-y-4 custom-scrollbar">
                <p className="leading-relaxed">{tAuth.domainHelperDesc}</p>

                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50 space-y-3">
                  <h3 className="font-bold text-amber-900 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> {tAuth.domainHelperStepsTitle}
                  </h3>
                  <ol className="space-y-2 text-amber-800 text-xs list-decimal pl-4">
                    <li>{tAuth.domainHelperStep1}</li>
                    <li>{tAuth.domainHelperStep2}</li>
                    <li>{tAuth.domainHelperStep3}</li>
                    <li>{tAuth.domainHelperStep4}</li>
                    <li>{tAuth.domainHelperStep5}</li>
                  </ol>
                </div>

                {/* Domain Copy Box */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                  <div className="flex flex-col text-left w-full sm:w-auto">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">DOMAIN NAME</span>
                    <span className="font-mono text-sm text-slate-700 select-all font-semibold break-all">{window.location.hostname}</span>
                  </div>
                  <button 
                    onClick={handleCopyDomain} 
                    className={`shrink-0 w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow duration-250 flex items-center justify-center gap-2 cursor-pointer border ${copied ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600 active:scale-95'}`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>{tAuth.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-500" />
                        <span>{tAuth.copyButton}</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-400 italic text-center">
                  {tAuth.domainHelperStep6}
                </p>
              </div>
              <div className="p-4 shrink-0 border-t border-slate-100 flex justify-end bg-slate-50">
                <button onClick={() => setShowDomainHelper(false)} className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer">
                  {tAuth.closeModal}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const landingContent = {
  id: {
    heroBadge: "EDUGAME FINANSIAL",
    heroTitle: "KoinKita",
    heroSlogan: "Belajar Ngatur Duit Gak Pernah Seseru Ini! Dari Detektif Keuangan sampai Masak Anggaran, Siap Bangun Pohon Asetmu?",
    heroCta: "Mulai Petualangan Cuan ➔",
    loginBtn: "Masuk / Login",
    techTitle: "Fitur Sosial & Kompetitif Unggulan",
    tech1Title: "Liga Finansial Mingguan",
    tech1Desc: "Bersaing dengan 30 pemain lain. Kumpulkan XP dan raih promosi ke liga yang lebih tinggi setiap minggunya!",
    tech2Title: "Klub Finansial & Crowdfunding",
    tech2Desc: "Bentuk klub, kumpulkan anggota, dan patungan koin (crowdfunding) untuk menaikkan level dan kapasitas klubmu.",
    tech3Title: "Misi Harian & Misi Klub",
    tech3Desc: "Selesaikan misi personal untuk mendapat koin, dan misi klub untuk menyumbang poin kontribusi setiap harinya.",
    tech4Title: "Ekosistem Pertemanan & Hadiah",
    tech4Desc: "Tambahkan teman, cek profil dan statistik mereka, serta kirim nyawa setiap hari untuk saling membantu.",
    trapTitle: "Tantangan Finansial Nyata",
    trap1: "Jebakan Pinjol & Gen Z",
    trap2: "Investasi Bodong/Ponzi",
    trap3: "Gaya Hidup Konsumtif (FOMO)",
    gamesTitle: "4 Mini-Games Seru",
    game1Title: "Detektif Cuan",
    game1Desc: "Uji kejelian mendeteksi skema ponzi dan investasi bodong.",
    game2Title: "Koki Anggaran",
    game2Desc: "Bukan manipulasi keuangan! Di sini kamu jadi koki yang meracik porsi tabungan dan belanjaan agar anggaran bulananmu tidak 'gosong'.",
    game3Title: "Fin-Wordle",
    game3Desc: "Tebak kata dinamis penguji wawasan istilah finansial dengan kotak adaptif.",
    game4Title: "Pohon Aset",
    game4Desc: "Simulasi investasi jangka panjang, rawat aset hingga berbuah dividen.",
    faqTitle: "Pertanyaan Populer (FAQ)",
    faq1q: "Apakah game ini gratis?",
    faq1a: "Ya! KoinKita 100% gratis dimainkan dengan tujuan utama meningkatkan literasi finansial masyarakat.",
    faq2q: "Bagaimana cara kerja Liga Finansial Mingguan?",
    faq2a: "Kamu akan ditempatkan dalam grup berisi 30 pemain. Kumpulkan XP sebanyak mungkin dengan bermain. Top 5 akan promosi ke liga berikutnya, sementara 5 terbawah akan degradasi di akhir minggu.",
    faq3q: "Apa keuntungan bergabung dengan Klub Finansial?",
    faq3a: "Klub memungkinkan kamu berkumpul dengan pemain lain. Kamu bisa menyelesaikan Misi Klub khusus dan berdonasi koin untuk menaikkan level serta kapasitas klub bersama-sama.",
    faq4q: "Apakah misi klub atau misi harian akan direset?",
    faq4a: "Misi harian akan direset setiap hari (24 jam), dan untuk menjaga permainan tetap kompetitif progres kontribusi pemain di klub bisa direkam secara berkala. Misi ini sangat membantumu untuk terus aktif.",
    faq5q: "Bagaimana cara menaikkan Liga profil saya?",
    faq5a: "Cukup mainkan mini-game untuk mendapat Koin dan XP. Ligamu akan otomatis naik seiring bertambahnya akumulasi XP milikmu, membuka liga baru dari Pemula hingga Master Kekayaan!",
    ranksTitle: "Tingkatan Literasi Finansialmu",
    ranksDesc: "Kumpulkan XP dengan bermain cerdas untuk berevolusi dari Liga Pemula hingga Liga Master Kekayaan!",
    rank0Title: "Pemula 🥉",
    rank0Desc: "Langkah awal petualangan. Mulailah memahami nilai dasar koinmu.",
    rank0Coins: "0 - 999 XP",
    rank0Perk: "Akses ke semua fitur dasar dan Liga Pemula.",
    rank1Title: "Sadar Finansial 🥈",
    rank1Desc: "Mulai cerdas membedakan kebutuhan dan keinginan.",
    rank1Coins: "1.000 - 4.999 XP",
    rank1Perk: "Promosi ke Liga Sadar Finansial, buka misi harian baru.",
    rank2Title: "Bijak Belanja 🥇",
    rank2Desc: "Jago menyusun prioritas anggaran belanja agar tidak pernah defisit.",
    rank2Coins: "5.000 - 14.999 XP",
    rank2Perk: "Promosi ke Liga Bijak Belanja, buka donasi kas klub.",
    rank3Title: "Investor Cerdas 🏅",
    rank3Desc: "Memahami instrumen investasi untuk melindungi aset dari inflasi.",
    rank3Coins: "15.000 - 29.999 XP",
    rank3Perk: "Promosi ke Liga Investor Cerdas, buka instrumen tinggi di Pohon Aset.",
    rank4Title: "Ahli Anggaran 💎",
    rank4Desc: "Hebat mengelola portofolio aset, tangguh menghadapi guncangan pasar.",
    rank4Coins: "30.000 - 49.999 XP",
    rank4Perk: "Bersaing di Liga Diamond (Ahli Anggaran) tingkat tinggi.",
    rank5Title: "Master Kekayaan 👑",
    rank5Desc: "Mencapai kebebasan finansial sejati di mana aset bekerja untukmu!",
    rank5Coins: "50.000+ XP",
    rank5Perk: "Menempati tahta kehormatan di Liga Master dan Leaderboard Global.",
  },
  en: {
    heroBadge: "FINANCIAL EDUGAME",
    heroTitle: "KoinKita",
    heroSlogan: "Financial Literacy Has Never Been This Fun! From Financial Detective to Budget Chef, Ready to Grow Your Asset Tree?",
    heroCta: "Start Wealth Adventure ➔",
    loginBtn: "Sign In / Login",
    techTitle: "Social & Competitive Features",
    tech1Title: "Weekly Financial Leagues",
    tech1Desc: "Compete with 30 other players. Gather XP to earn a promotion to a higher league every week!",
    tech2Title: "Financial Clubs & Crowdfunding",
    tech2Desc: "Form a club, gather members, and pool coins (crowdfunding) to level up your club and expand its capacity.",
    tech3Title: "Daily & Club Quests",
    tech3Desc: "Complete personal quests for coins, and tackle club quests to contribute points to your club's treasury daily.",
    tech4Title: "Friends & Gifting Ecosystem",
    tech4Desc: "Add friends, view their profiles, compare stats, and send them lives to help each other out.",
    trapTitle: "Real Financial Challenges",
    trap1: "Loan Shark Traps",
    trap2: "Fraudulent Ponzi Schemes",
    trap3: "FOMO & Consumerism Culture",
    gamesTitle: "4 Exciting Mini-Games",
    game1Title: "Cuan Detective",
    game1Desc: "Test your sharpness in detecting ponzi schemes and fake investments.",
    game2Title: "Budget Chef",
    game2Desc: "Manage daily income so expenses never exceed your budget.",
    game3Title: "Fin-Wordle",
    game3Desc: "Dynamic Wordle testing financial terms with adaptive letter boxes.",
    game4Title: "Asset Tree",
    game4Desc: "Long-term investment simulation, nurture assets to reap dividends.",
    faqTitle: "Frequently Asked Questions",
    faq1q: "Is this game free?",
    faq1a: "Yes! KoinKita is 100% free to play, aimed at improving public financial literacy.",
    faq2q: "How does the Weekly Financial League work?",
    faq2a: "You'll be placed in a group with 30 players. Collect as much XP as possible by playing. The top 5 get promoted, while the bottom 5 get demoted at the end of the week.",
    faq3q: "What are the benefits of joining a Financial Club?",
    faq3a: "Clubs let you team up with other players. You can complete exclusive Club Quests and donate coins to level up and expand the club's capacity together.",
    faq4q: "Do club quests or daily quests reset?",
    faq4a: "Daily quests reset every day (24 hours). Club contribution progress helps keep the game competitive and is periodically logged to keep you active and engaged.",
    faq5q: "How do I upgrade my profile League?",
    faq5a: "Simply play mini-games to earn Coins and XP. Your League will automatically advance as your cumulative XP grows, unlocking new leagues from Beginner up to Wealth Master!",
    ranksTitle: "Your Financial Literacy Tiers",
    ranksDesc: "Earn XP by playing smart to advance from the Beginner League up to the Wealth Master League!",
    rank0Title: "Beginner 🥉",
    rank0Desc: "The first step. Start understanding the baseline value of your coins.",
    rank0Coins: "0 - 999 XP",
    rank0Perk: "Access to all base game features and the Beginner League.",
    rank1Title: "Financially Aware 🥈",
    rank1Desc: "Discerning the crucial differences between core needs and modern wants.",
    rank1Coins: "1,000 - 4,999 XP",
    rank1Perk: "Promotion to Financially Aware League, unlock new daily quests.",
    rank2Title: "Wise Spender 🥇",
    rank2Desc: "Mastering spending prioritization so your budget is never in deficit.",
    rank2Coins: "5,000 - 14,999 XP",
    rank2Perk: "Promotion to Wise Spender League, unlock club treasury contributions.",
    rank3Title: "Smart Investor 🏅",
    rank3Desc: "Harnessing financial assets to buffer wealth against global inflation.",
    rank3Coins: "15,000 - 29,999 XP",
    rank3Perk: "Promotion to Smart Investor League, unlock high-yield asset tree instruments.",
    rank4Title: "Budget Expert 💎",
    rank4Desc: "Highly proficient in portfolio resilience through economic shifts.",
    rank4Coins: "30,000 - 49,999 XP",
    rank4Perk: "Compete at the highest level of the elite Budget Expert (Diamond) League.",
    rank5Title: "Wealth Master 👑",
    rank5Desc: "Complete financial freedom achieved. Your capital generates passive yield!",
    rank5Coins: "50,000+ XP",
    rank5Perk: "Reign on the absolute throne of the Wealth Master League and Global Leaderboard.",
  }
};

function FAQItem({ question, answer, icon: Icon }: { question: string, answer: string, icon: React.ElementType }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white border border-slate-100 rounded-2xl mb-4 overflow-hidden transition-all hover:shadow-md hover:border-emerald-100 shadow-sm shadow-slate-100/50">
      <button 
        onClick={() => { playClick(); setIsOpen(!isOpen); }} 
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-indigo-500" />
          <span className="font-poppins font-bold text-slate-800 text-sm sm:text-base">{question}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-emerald-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 pb-5 text-slate-700 text-sm leading-relaxed"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LandingPage({ 
  onLinkGoogle, 
  onContinueGuest, 
  onGoToAuth, 
  isLoading, 
  hasPendingFriend 
}: { 
  onLinkGoogle: () => void, 
  onContinueGuest: () => void, 
  onGoToAuth: () => void, 
  isLoading: boolean, 
  hasPendingFriend?: boolean 
}) {
  const { language, toggleLanguage } = useTranslation();
  const t = landingContent[language as keyof typeof landingContent];
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    import('./lib/audio').then(m => m.setGameViewTrack('landing'));
    
    const handleScroll = () => {
      // Show scroll to top button when scrolled down
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackHoverRating, setFeedbackHoverRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;
    setFeedbackSubmitting(true);
    playClick();

    try {
      // 1. Save to Firestore feedbacks collection
      await addDoc(collection(db, 'feedbacks'), {
        name: feedbackName || 'Anonim',
        email: feedbackEmail || 'anonim@koinkita.xyz',
        rating: feedbackRating,
        comment: feedbackComment,
        createdAt: Date.now()
      });

      // 2. Submit via FormSubmit AJAX to user's email
      await fetch("https://formsubmit.co/ajax/aydinaryasatyaradithya@gmail.com", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          Nama: feedbackName || 'Anonim',
          Email: feedbackEmail || 'Anonim',
          Rating: `${feedbackRating} Bintang`,
          Saran: feedbackComment
        })
      });

      setFeedbackSubmitted(true);
      setFeedbackName('');
      setFeedbackEmail('');
      setFeedbackRating(5);
      setFeedbackComment('');
    } catch (err) {
      console.warn("Feedback submission error:", err);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const handleStart = () => {
    playClick();
    onGoToAuth();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-200/50 overflow-x-hidden relative">

      <AnimatePresence>
        {hasPendingFriend && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/80 "
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
                    onClick={onGoToAuth}
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


      <AnimatePresence>
        
      </AnimatePresence>


      

      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Glow Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200/30 rounded-full "></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-amber-200/30 rounded-full "></div>
        
        {/* Cyber Grid Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] opacity-40"></div>
        
        {/* Floating Vectors */}
        <motion.div
          animate={{ y: [0, -15, 0], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: "transform, opacity" }}
          className="absolute top-[15%] left-[8%]"
        >
          <CircleDollarSign className="w-16 h-16 text-emerald-600" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ willChange: "transform, opacity" }}
          className="absolute top-[30%] right-[15%]"
        >
          <TrendingUp className="w-24 h-24 text-blue-600" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ willChange: "transform, opacity" }}
          className="absolute top-[60%] left-[10%]"
        >
          <Coins className="w-20 h-20 text-amber-500" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 25, 0], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{ willChange: "transform, opacity" }}
          className="absolute top-[75%] right-[8%]"
        >
          <Leaf className="w-28 h-28 text-emerald-500" />
        </motion.div>
      </div>
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-white/95  border-b border-slate-200/50 shadow-sm">
        <div className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-md shadow-amber-200/50 group-hover:scale-105 transition-transform">
            <Coins className="w-5 h-5 text-white" />
          </div>
          <span className="font-poppins font-black text-xl tracking-tight text-slate-800">
            {t.heroTitle}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { playClick(); toggleLanguage(); }}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all text-xs font-bold uppercase tracking-widest border border-slate-200 shadow-sm cursor-pointer active:scale-95"
          >
            <Globe className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">{language === 'id' ? 'ID | EN' : 'EN | ID'}</span>
            <span className="sm:hidden">{language.toUpperCase()}</span>
          </button>
          <button 
            onClick={handleStart}
            className="flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-full transition-all text-sm font-bold border border-emerald-200/50 cursor-pointer shadow-sm shadow-emerald-100/50 active:scale-95"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{t.loginBtn}</span>
            <span className="sm:hidden">Login</span>
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-24 sm:space-y-32 relative z-10">
        
        {/* Section 1: Hero */}
        <section className="text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold mb-8 uppercase tracking-widest shadow-sm shadow-emerald-200/50"
          >
            <ShieldCheck className="w-4 h-4" /> {t.heroBadge}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-poppins font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 mb-6 tracking-tight leading-tight py-2 drop-shadow-sm text-center"
          >
            {t.heroTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-700 leading-relaxed max-w-2xl mx-auto mb-10 text-center"
          >
            {t.heroSlogan}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto justify-center pt-4"
          >
            {/* Google Sign In */}
            <button
              onClick={onLinkGoogle}
              disabled={isLoading}
              className="flex-1 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl cursor-pointer shadow-md shadow-emerald-200/50 transition-all active:scale-[0.98] border-b-4 border-emerald-800 hover:border-emerald-700 flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{language === 'id' ? 'Menghubungkan...' : 'Connecting...'}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.709 0 3.277.604 4.5 1.625l2.437-2.437C17.312 1.696 14.933 1 12.24 1 6.58 1 2 5.58 2 11.24s4.58 10.24 10.24 10.24c5.795 0 10.24-4.11 10.24-10.24 0-.685-.08-1.355-.24-1.955H12.24z"/>
                  </svg>
                  <span>Google Sign In</span>
                </>
              )}
            </button>

            {/* Email Sign In */}
            <button
              onClick={onGoToAuth}
              disabled={isLoading}
              className="flex-1 py-4 px-6 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-sm rounded-2xl cursor-pointer shadow-md transition-all active:scale-[0.98] border-b-4 border-slate-950 flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <span>Email Sign In</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pt-3 w-full text-center"
          >
            <button
              onClick={onContinueGuest}
              disabled={isLoading}
              className="py-2.5 px-6 text-emerald-600 hover:text-emerald-700 font-extrabold text-sm hover:underline cursor-pointer transition-all active:scale-95"
            >
              {language === 'id' ? 'Lanjutkan sebagai Tamu' : 'Continue as Guest'}
            </button>
          </motion.div>
        </section>

        {/* Section 2: 4 Mini-Games Expanded Showcase */}
        <section className="relative z-10 w-full">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-poppins font-black text-slate-800 mb-4">{t.gamesTitle}</h2>
            <div className="w-20 h-1 bg-emerald-400 mx-auto rounded-full shadow-sm shadow-emerald-200"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/50 transition-all flex flex-col group shadow-md shadow-slate-100/50">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5 border border-indigo-100 group-hover:scale-110 transition-transform group-hover:bg-indigo-100">
                <Search className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-poppins font-bold text-slate-800 text-lg mb-3">{t.game1Title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed flex-grow">{t.game1Desc}</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50 transition-all flex flex-col group shadow-md shadow-slate-100/50">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-5 border border-emerald-100 group-hover:scale-110 transition-transform group-hover:bg-emerald-100">
                <Utensils className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-poppins font-bold text-slate-800 text-lg mb-3">{t.game2Title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed flex-grow">{t.game2Desc}</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-100/50 transition-all flex flex-col group shadow-md shadow-slate-100/50">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-5 border border-amber-100 group-hover:scale-110 transition-transform group-hover:bg-amber-100">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-poppins font-bold text-slate-800 text-lg mb-3">{t.game3Title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed flex-grow">{t.game3Desc}</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:border-fuchsia-300 hover:shadow-xl hover:shadow-fuchsia-100/50 transition-all flex flex-col group shadow-md shadow-slate-100/50">
              <div className="w-14 h-14 bg-fuchsia-50 rounded-2xl flex items-center justify-center mb-5 border border-fuchsia-100 group-hover:scale-110 transition-transform group-hover:bg-fuchsia-100">
                <Leaf className="w-6 h-6 text-fuchsia-600" />
              </div>
              <h3 className="font-poppins font-bold text-slate-800 text-lg mb-3">{t.game4Title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed flex-grow">{t.game4Desc}</p>
            </div>
          </div>
        </section>

        {/* Section 3: Tech Features Asymmetric Bento Grid */}
        <section className="relative z-10 w-full">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-poppins font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400 mb-4">{t.techTitle}</h2>
            <div className="w-20 h-1 bg-indigo-400 mx-auto rounded-full shadow-sm shadow-indigo-200"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card A (Large - md:col-span-2) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-2 bg-white rounded-3xl p-8 shadow-md shadow-emerald-50 border border-slate-100 flex flex-col items-start text-left group hover:shadow-xl hover:shadow-emerald-100/50 hover:border-emerald-200 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Trophy className="w-48 h-48 text-emerald-800" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-emerald-100 relative z-10">
                <Trophy className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-poppins font-black text-slate-800 text-2xl mb-3 relative z-10">{t.tech1Title}</h3>
              <p className="text-base text-slate-600 leading-relaxed max-w-lg relative z-10">{t.tech1Desc}</p>
            </motion.div>
            
            {/* Card B (Standard - 1 col) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-1 bg-white rounded-3xl p-8 shadow-md shadow-emerald-50 border border-slate-100 flex flex-col items-start text-left group hover:shadow-xl hover:shadow-emerald-100/50 hover:border-emerald-200 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-indigo-100">
                <Users className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="font-poppins font-bold text-slate-800 text-xl mb-3">{t.tech2Title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.tech2Desc}</p>
            </motion.div>
            
            {/* Card C (Standard - 1 col) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-1 bg-white rounded-3xl p-8 shadow-md shadow-emerald-50 border border-slate-100 flex flex-col items-start text-left group hover:shadow-xl hover:shadow-emerald-100/50 hover:border-emerald-200 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-amber-100">
                <CheckCircle2 className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-poppins font-bold text-slate-800 text-xl mb-3">{t.tech3Title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.tech3Desc}</p>
            </motion.div>
            
            {/* Card D (Standard - 1 col, spanning 2 to fill row 2 if md:grid-cols-3) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="md:col-span-2 bg-white rounded-3xl p-8 shadow-md shadow-emerald-50 border border-slate-100 flex flex-col items-start text-left group hover:shadow-xl hover:shadow-emerald-100/50 hover:border-emerald-200 transition-all relative overflow-hidden"
            >
              <div className="absolute bottom-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Gift className="w-40 h-40 text-fuchsia-800" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-fuchsia-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-fuchsia-100 relative z-10">
                <Gift className="w-7 h-7 text-fuchsia-600" />
              </div>
              <h3 className="font-poppins font-black text-slate-800 text-2xl mb-3 relative z-10">{t.tech4Title}</h3>
              <p className="text-base text-slate-600 leading-relaxed max-w-lg relative z-10">{t.tech4Desc}</p>
            </motion.div>
          </div>
        </section>

        {/* Section 4: Player Progression Levels */}
        <section className="relative z-10 w-full mb-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-poppins font-black text-slate-800 mb-4">{t.ranksTitle}</h2>
            <div className="w-20 h-1 bg-amber-400 mx-auto rounded-full shadow-sm shadow-amber-200 mb-6"></div>
            <p className="text-slate-600 max-w-xl mx-auto">{t.ranksDesc}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { id: 0, title: t.rank0Title, desc: t.rank0Desc, perk: t.rank0Perk, color: "from-slate-100 to-slate-200", icon: "bg-slate-300/50 text-slate-700 border-slate-300" },
              { id: 1, title: t.rank1Title, desc: t.rank1Desc, perk: t.rank1Perk, color: "from-blue-100 to-blue-200", icon: "bg-blue-300/50 text-blue-700 border-blue-300" },
              { id: 2, title: t.rank2Title, desc: t.rank2Desc, perk: t.rank2Perk, color: "from-emerald-100 to-emerald-200", icon: "bg-emerald-300/50 text-emerald-800 border-emerald-300" },
              { id: 3, title: t.rank3Title, desc: t.rank3Desc, perk: t.rank3Perk, color: "from-teal-100 to-teal-200", icon: "bg-teal-300/50 text-teal-800 border-teal-300" },
              { id: 4, title: t.rank4Title, desc: t.rank4Desc, perk: t.rank4Perk, color: "from-indigo-100 to-indigo-200", icon: "bg-indigo-300/50 text-indigo-800 border-indigo-300" },
              { id: 5, title: t.rank5Title, desc: t.rank5Desc, perk: t.rank5Perk, color: "from-amber-100 to-amber-200", icon: "bg-amber-300/50 text-amber-800 border-amber-300" }
            ].map((rank, index) => (
              <motion.div
                key={rank.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-gradient-to-b from-white/90 to-white/40  rounded-3xl p-6 shadow-sm border border-white hover:shadow-lg hover:-translate-y-2 transition-all flex flex-col items-center text-center"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-xl font-black font-poppins shadow-sm border ${rank.icon}`}>
                  {index}
                </div>
                <h3 className="font-poppins font-black text-slate-800 text-sm xl:text-base leading-snug mb-3">
                  {rank.title}
                </h3>
                <p className="text-xs xl:text-sm text-slate-700 leading-relaxed font-medium mb-4 flex-grow">
                  {rank.desc}
                </p>
                <div className="w-full bg-white/40 rounded-xl p-3 border border-white/50 text-left relative mt-auto shadow-sm">
                   <div className="absolute -top-2 -left-2 w-5 h-5 bg-yellow-400 text-white rounded-full flex items-center justify-center shadow-sm">
                     <Gift className="w-3 h-3" />
                   </div>
                   <p className="text-[10px] xl:text-[11px] font-bold text-slate-700 ml-2">
                     {rank.perk}
                   </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 4.5: Download Mobile App */}
        <section className="relative z-10 w-full max-w-4xl mx-auto">
          <div className="bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-[2.5rem] p-8 sm:p-12 shadow-xl shadow-emerald-200/50 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full pointer-events-none -mr-16 -mt-16"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-teal-400/20 rounded-full pointer-events-none"></div>
            
            <div className="flex-1 text-center md:text-left relative z-10">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-widest mb-4">
                {language === 'id' ? 'Tersedia untuk Android' : 'Available for Android'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-poppins font-black mb-4 tracking-tight leading-tight">
                {language === 'id' ? 'Bawa Petualangan Finansialmu di Saku!' : 'Carry Your Financial Adventure Anywhere!'}
              </h2>
              <p className="text-white/80 font-medium text-sm sm:text-base leading-relaxed max-w-md">
                {language === 'id' 
                  ? 'Unduh aplikasi mobile KoinKita sekarang untuk menikmati gameplay yang lebih responsif, dukungan deep link teman, dan animasi yang lebih mulus.' 
                  : 'Download the KoinKita mobile app now for a more responsive gameplay, friend deep link support, and smoother animations.'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 relative z-10 w-full md:w-auto justify-center">
              <a 
                href="https://github.com/Radarya/KoinKita/releases/latest/download/koinkita-v1-fixed.apk"
                download="koinkita-v1-fixed.apk"
                onClick={() => playClick()}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-emerald-700 font-extrabold text-lg rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border-b-4 border-slate-200 hover:border-slate-100 cursor-pointer"
              >
                <Download className="w-6 h-6 text-emerald-600 animate-pulse" />
                <span>{language === 'id' ? 'Unduh APK Android' : 'Download Android APK'}</span>
              </a>
            </div>
          </div>
        </section>

        {/* Section 5: FAQ Accordion */}
        <section className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-poppins font-black text-slate-800 mb-4">{t.faqTitle}</h2>
            <div className="w-20 h-1 bg-blue-400 mx-auto rounded-full shadow-sm shadow-blue-200"></div>
          </div>
          <FAQItem question={t.faq1q} answer={t.faq1a} icon={CircleDollarSign} />
          <FAQItem question={t.faq2q} answer={t.faq2a} icon={Leaf} />
          <FAQItem question={t.faq3q} answer={t.faq3a} icon={ShieldCheck} />
          <FAQItem question={t.faq4q} answer={t.faq4a} icon={BookOpen} />
          <FAQItem question={t.faq5q} answer={t.faq5a} icon={Trophy} />
        </section>

        {/* Section 6: Suggestion & Feedback Box */}
        <section className="max-w-2xl mx-auto bg-white rounded-[2rem] p-8 border border-slate-200 shadow-md shadow-slate-100/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/50 rounded-full pointer-events-none -mr-8 -mt-8"></div>
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2.5 bg-amber-100 rounded-xl">
              <MessageSquare className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-poppins font-black text-slate-800">
              {language === 'id' ? 'Kritik & Saran' : 'Feedback & Suggestions'}
            </h2>
          </div>
          
          <p className="text-sm sm:text-base text-slate-600 mb-6 font-medium leading-relaxed">
            {language === 'id' 
              ? 'Bantu kami meningkatkan kualitas KoinKita! Pendapatmu sangat berarti untuk perkembangan petualangan finansial ini.' 
              : 'Help us improve KoinKita! Your feedback is highly valuable for the growth of this financial adventure.'}
          </p>

          {feedbackSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-800 font-bold"
            >
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-base mb-1">
                {language === 'id' ? 'Terima kasih banyak atas saranmu!' : 'Thank you so much for your feedback!'}
              </p>
              <p className="text-xs text-emerald-600 font-medium">
                {language === 'id' ? 'Saranmu telah dikirimkan ke tim KoinKita.' : 'Your suggestion has been sent to the KoinKita team.'}
              </p>
              <button 
                onClick={() => setFeedbackSubmitted(false)}
                className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {language === 'id' ? 'Kirim Masukan Lagi' : 'Send Another Feedback'}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-5">
              {/* Star Rating System */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">
                  {language === 'id' ? 'Rating Permainan' : 'Game Rating'}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isLit = feedbackHoverRating ? star <= feedbackHoverRating : star <= feedbackRating;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => { playClick(); setFeedbackRating(star); }}
                        onMouseEnter={() => setFeedbackHoverRating(star)}
                        onMouseLeave={() => setFeedbackHoverRating(0)}
                        className="p-1 transition-all duration-150 hover:scale-125 cursor-pointer animate-none"
                        aria-label={`Rating ${star} Bintang`}
                      >
                        <span className="sr-only">Rating {star} Bintang</span>
                        <Star 
                          className={`w-8 h-8 ${
                            isLit 
                              ? 'text-amber-500 fill-amber-500' 
                              : 'text-slate-200'
                          }`} 
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold text-slate-400 ml-2">
                    {feedbackRating === 5 && (language === 'id' ? 'Sempurna! 🤩' : 'Perfect! 🤩')}
                    {feedbackRating === 4 && (language === 'id' ? 'Sangat Bagus! 😊' : 'Very Good! 😊')}
                    {feedbackRating === 3 && (language === 'id' ? 'Cukup Ok 😐' : 'Decent 😐')}
                    {feedbackRating === 2 && (language === 'id' ? 'Butuh Perbaikan 😕' : 'Needs Work 😕')}
                    {feedbackRating === 1 && (language === 'id' ? 'Sangat Kurang 😞' : 'Poor 😞')}
                  </span>
                </div>
              </div>

              {/* Name & Email (Row) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {language === 'id' ? 'Nama Pengirim (Opsional)' : 'Your Name (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    placeholder={language === 'id' ? 'Cth: Budi' : 'e.g., John'}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:bg-white transition-all font-medium"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {language === 'id' ? 'Email (Opsional)' : 'Email (Optional)'}
                  </label>
                  <input
                    type="email"
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    placeholder="budi@email.com"
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Message Box */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {language === 'id' ? 'Pesan Kritik & Saran' : 'Your Message / Feedback'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder={language === 'id' ? 'Ketik kritik, saran, atau laporan bug di sini...' : 'Type criticisms, suggestions, or bug reports here...'}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:bg-white transition-all font-medium resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={feedbackSubmitting}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-amber-950 font-extrabold text-sm rounded-xl cursor-pointer shadow-md transition-all active:scale-[0.98] border-b-4 border-amber-700 hover:border-amber-600 flex items-center justify-center gap-2"
              >
                {feedbackSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === 'id' ? 'Mengirim...' : 'Sending...'}</span>
                  </>
                ) : (
                  <span>{language === 'id' ? 'KIRIM MASUKAN 🚀' : 'SUBMIT FEEDBACK 🚀'}</span>
                )}
              </button>
            </form>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-slate-500 text-sm border-t border-slate-200/50 bg-white/30  relative z-10">
        &copy; {new Date().getFullYear()} KoinKita. Edugame Finansial Terdepan.
      </footer>
      
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={() => { playClick(); scrollToTop(); }}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100] w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 cursor-pointer transition-colors active:scale-90"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
