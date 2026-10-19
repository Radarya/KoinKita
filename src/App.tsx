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
import { doc, setDoc, getDoc, getDocFromCache, collection, addDoc, updateDoc } from 'firebase/firestore';
import Dashboard from './components/Dashboard';
import TermsModal from './components/TermsModal';
import OnboardingModal from './components/OnboardingModal';
import LandingPage from './components/LandingPage';
import CikoMascot from './components/CikoMascot';
import { useTranslation } from './lib/LanguageContext';
import { bypassAutoplay, playClick, setAppActive } from './lib/audio';
import { App as CapacitorApp } from '@capacitor/app';
import { Dialog } from '@capacitor/dialog';
import { 
  setupNotificationChannels, 
  schedulePanicNotifications, 
  cancelAllScheduledNotifications 
} from './lib/notifications';

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
  const hasShownWelcomeRef = useRef(false);
  const toastTimeoutRef = useRef<any>(null);

  useEffect(() => { currentScreenRef.current = currentScreen; }, [currentScreen]);
  useEffect(() => { languageRef.current = language; }, [language]);


  // Toast Notification State with race-condition prevention
  type ToastType = 'success' | 'warning' | 'error' | 'info';
  const [toast, setToast] = useState<{ show: boolean, message: string, type: ToastType }>({ show: false, message: '', type: 'info' });
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const triggerToast = useCallback((message: string, type: ToastType = 'info') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ show: true, message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  }, []);

  
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

  // Initial setup for Notifications & Permissions
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      setupNotificationChannels();
    }
  }, []);

  // Hardware Back Button Interceptor
  useEffect(() => {
    let backListener: any = null;
    if (Capacitor.isNativePlatform() && CapacitorApp && typeof CapacitorApp.addListener === 'function') {
      backListener = CapacitorApp.addListener('backButton', async ({ canGoBack }) => {
        // Dispatch a custom cancelable event
        const event = new Event('hardwareBackButton', { cancelable: true });
        window.dispatchEvent(event);
        
        // If a component (like Dashboard) intercepted it (e.g. to close a modal), defaultPrevented will be true.
        // Also if we are showing Onboarding or Auth screens, we might want to prevent exit or handle it differently.
        if (!event.defaultPrevented && currentScreenRef.current === 'app') {
          const { value } = await Dialog.confirm({
            title: languageRef.current === 'id' ? 'Keluar Aplikasi' : 'Exit App',
            message: languageRef.current === 'id' 
              ? 'Apakah Anda yakin ingin keluar dari KoinKita?' 
              : 'Are you sure you want to exit KoinKita?',
            okButtonTitle: languageRef.current === 'id' ? 'Ya' : 'Yes',
            cancelButtonTitle: languageRef.current === 'id' ? 'Tidak' : 'No'
          });
          
          if (value) {
            CapacitorApp.exitApp();
          }
        } else if (!event.defaultPrevented && currentScreenRef.current === 'landing') {
           CapacitorApp.exitApp();
        } else if (!event.defaultPrevented && currentScreenRef.current === 'auth') {
           setCurrentScreen('landing');
        }
      });
    }
    
    return () => {
      if (backListener && typeof backListener.remove === 'function') {
        backListener.remove();
      }
    };
  }, []);

  // Listen to Capacitor App State Changes (foreground/background) to manage audio/music
  useEffect(() => {
    let listener: any = null;

    try {
      if (Capacitor.isNativePlatform() && CapacitorApp && typeof CapacitorApp.addListener === 'function') {
        listener = CapacitorApp.addListener('appStateChange', (state) => {
          if (state && typeof state.isActive === 'boolean') {
            setAppActive(state.isActive);
            
            // Notification Scheduler Logic
            if (!state.isActive) {
              // App went to background -> Schedule Panic Baiting!
              schedulePanicNotifications(languageRef.current, auth.currentUser?.uid || 'guest');
            } else {
              // App came to foreground -> Cancel scheduled panics
              cancelAllScheduledNotifications();
            }
          }
        });
      }
    } catch (err) {
      console.warn("Capacitor App plugin not available or error adding appStateChange listener:", err);
    }

    // Web Fallback for Anti-Cheat PauseOverlay
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      setAppActive(isVisible);
    };

    if (!Capacitor.isNativePlatform()) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      if (listener && typeof listener.remove === 'function') {
        listener.remove();
      }
      if (!Capacitor.isNativePlatform()) {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
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
              let userSnap;
              if (!navigator.onLine) {
                userSnap = await getDocFromCache(userDocRef).catch(() => null);
              }
              if (!userSnap) {
                userSnap = await Promise.race([
                  getDoc(userDocRef),
                  new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
                ]).catch(() => null) as any;
              }

              if (userSnap && userSnap.exists()) {
                const data = userSnap.data();
                if (data.fullName) displayName = data.fullName;
                if (!data.hasCompletedOnboarding) {
                  onboardingNotCompleted = true;
                }
              } else if (userSnap && !userSnap.exists()) {
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


          const activeScreen = currentScreenRef.current;
          // Auto-navigate to app for verified/non-anonymous users only.
          // Exception: anonymous user coming from loading screen on first launch should also enter app.
          const shouldAutoNav = (activeScreen === 'loading' && user.isAnonymous) ||
            (!user.isAnonymous && (activeScreen === 'loading' || activeScreen === 'auth' || activeScreen === 'landing'));

          if (shouldAutoNav) {
             // Only show welcome back toast once for registered accounts logging in from auth screen
             if (!user.isAnonymous && activeScreen === 'auth' && !hasShownWelcomeRef.current) {
               hasShownWelcomeRef.current = true;
               triggerToast(languageRef.current === 'id' ? `Selamat datang kembali, ${displayName}!` : `Welcome back, ${displayName}!`, 'info');
             }
             startTransition(() => {
               setCurrentScreen('app');
             });
          }
        } else {
          // If no user is logged in (e.g. after a real Google/Email sign out)
          hasShownWelcomeRef.current = false;
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
            const activeScreen = currentScreenRef.current;
            if (activeScreen === 'app' || activeScreen === 'loading') {
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
              hasShownWelcomeRef.current = false;
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
          onBack={currentUser?.isAnonymous ? () => setCurrentScreen('app') : () => setCurrentScreen('landing')} 
          triggerToast={triggerToast}
          isLinkingRef={isLinkingRef}
        />
      )}
    </>
  );
}

const authTranslations = {
  id: {
    tagline: "Kuasai Keuanganmu Bareng Ciko",
    signIn: "Masuk",
    signUp: "Daftar",
    emailLabel: "Email",
    emailPlaceholder: "nama@email.com",
    passwordLabel: "Kata Sandi",
    passwordPlaceholder: "••••••••",
    repeatPasswordLabel: "Ulangi Kata Sandi",
    heroNameLabel: "Nama Lengkap",
    heroNamePlaceholder: "Cth: Budi Santoso",
    usernameLabel: "Nama Pengguna",
    usernamePlaceholder: "Cth: budi_santoso",
    birthdayLabel: "Tanggal Lahir",
    birthdayTooltip: "Umur membantumu mendapatkan simulasi materi yang sesuai.",
    submitLogin: "Masuk",
    submitRegister: "Daftar Akun",
    orPlayWith: "ATAU MASUK DENGAN",
    googlePlay: "Lanjutkan dengan Google",
    tosAgreement: "Dengan membuat akun, kamu setuju dengan Aturan Main dan Kebijakan Privasi petualangan ini.",
    tosLink: "Aturan Main",
    privacyLink: "Kebijakan Privasi",
    playTitle: "CIKO",
    emailRequired: "Email wajib diisi.",
    passwordRequired: "Kata sandi wajib diisi.",
    successLogin: "Login berhasil! Menyiapkan petualanganmu...",
    successRegister: "Pendaftaran berhasil! Selamat bergabung!",
    // Terms modal
    tosTitle: "Aturan Main (TOS)",
    tosIntro: "Selamat datang di CIKO! Aturan Main ini mengatur penggunaan layanan, fitur, dan platform edukasi CIKO. Dengan mendaftar dan bermain, Anda menyetujui seluruh ketentuan di bawah ini.",
    tosSec1Title: "Registrasi & Akun",
    tosSec1Desc: "Pengguna wajib memberikan informasi yang akurat (seperti umur) agar sistem dapat menghitung tingkat kesulitan dan simulasi yang pas. Keamanan dan kerahasiaan akun (email dan sandi) sepenuhnya menjadi tanggung jawab pengguna.",
    tosSec2Title: "Koin, Klub, & Liga Mingguan",
    tosSec2Desc: "Koin, poin kas klub, XP Liga, dan semua aset virtual di dalam CIKO murni untuk tujuan simulasi edukasi. Aset ini tidak memiliki nilai finansial di dunia nyata dan tidak dapat diuangkan. Untuk menjaga permainan tetap kompetitif, promosi/degradasi Liga dan misi pengumpulan poin kas klub (crowdfunding) dapat diperbarui atau di-reset secara berkala setiap minggunya.",
    tosSec3Title: "Integritas & Fair Play",
    tosSec3Desc: "Setiap pemain wajib menjaga sportivitas. Segala bentuk eksploitasi celah (bug), penggunaan bot, modifikasi skrip ilegal (termasuk memanipulasi LocalStorage/Inspect Element), atau upaya memanipulasi data papan peringkat akan dikenakan sanksi berupa penghapusan skor atau pemblokiran akun tanpa pemberitahuan.",
    tosSec4Title: "DISCLAIMER PENASIHAT KEUANGAN",
    tosSec4Desc: "Semua simulasi perhitungan inflasi, investasi, penghematan, dan alokasi anggaran dalam CIKO dibuat sesederhana mungkin untuk keperluan edugame (edukasi gim). CIKO tidak bertindak sebagai Penasihat Keuangan (Financial Advisor) profesional. Keputusan pengelolaan finansial secara nyata sepenuhnya menjadi tanggung jawab pribadi Anda.",
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
    tagline: "Master Your Finances With Ciko",
    signIn: "Sign In",
    signUp: "Sign Up",
    emailLabel: "Email Address",
    emailPlaceholder: "name@email.com",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    repeatPasswordLabel: "Confirm Password",
    heroNameLabel: "Full Name",
    heroNamePlaceholder: "e.g., John Doe",
    usernameLabel: "Username",
    usernamePlaceholder: "e.g., john_doe",
    birthdayLabel: "Date of Birth",
    birthdayTooltip: "Age helps us tailor the appropriate simulations for you.",
    submitLogin: "Sign In",
    submitRegister: "Create Account",
    orPlayWith: "OR CONTINUE WITH",
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

function GameAuth({ onBack, triggerToast, isLinkingRef }: { onBack?: () => void, triggerToast?: (msg: string, type: 'success'|'warning'|'error'|'info') => void, isLinkingRef: React.MutableRefObject<boolean> }) {
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 text-slate-800 relative selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar Navigation */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between z-20 mb-4">
        {onBack ? (
          <button 
            onClick={() => { playClick(); onBack(); }}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            title={language === 'id' ? 'Kembali' : 'Back'}
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>{language === 'id' ? 'Beranda' : 'Home'}</span>
          </button>
        ) : <div />}

        {/* Language Switcher */}
        <button 
          onClick={() => { playClick(); toggleLanguage(); }}
          className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
          title="Toggle Language"
        >
          {language === 'id' ? 'ID / EN' : 'EN / ID'}
        </button>
      </div>

      {/* Main Authentication Card */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md mx-auto my-auto relative z-10"
      >
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
          
          {/* Ciko Mascot & Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <CikoMascot size={84} animated={true} />
            <h1 className="font-poppins font-black text-2xl sm:text-3xl text-[#0D1117] tracking-tight mt-3 mb-1">
              {isLoginView
                ? (language === 'id' ? 'Masuk ke CIKO' : 'Sign in to CIKO')
                : (language === 'id' ? 'Daftar Akun Baru' : 'Create an Account')}
            </h1>
            <p className="text-sm text-slate-600 max-w-xs leading-relaxed">
              {isLoginView
                ? (language === 'id' ? 'Lanjutkan progres latihan dan koleksi koinmu.' : 'Continue your financial sprint and track your progress.')
                : (language === 'id' ? 'Mulai petualangan finansial interaktifmu bersama Ciko.' : 'Start your interactive financial adventure with Ciko.')}
            </p>
          </div>

          {/* Segmented View Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-full mb-6">
            <button
              type="button"
              onClick={() => { if (!isLoginView) { playClick(); toggleView(); } }}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                isLoginView
                  ? 'bg-[#0D1117] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tAuth.signIn}
            </button>
            <button
              type="button"
              onClick={() => { if (isLoginView) { playClick(); toggleView(); } }}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                !isLoginView
                  ? 'bg-[#0D1117] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tAuth.signUp}
            </button>
          </div>

          {/* 1-Tap Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm rounded-full transition-colors cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{language === 'id' ? 'Lanjutkan dengan Google' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {language === 'id' ? 'atau dengan email' : 'or with email'}
            </span>
          </div>

          {/* Status Notifications */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-center leading-relaxed"
              >
                {errorMsg}
              </motion.div>
            )}
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className="text-center">{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isLoginView ? (
              /* ================= LOGIN VIEW ================= */
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{tAuth.emailLabel}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none text-sm font-medium text-[#0D1117] placeholder:text-slate-400 transition-colors"
                      placeholder={tAuth.emailPlaceholder}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{tAuth.passwordLabel}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 bg-white border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none text-sm font-medium text-[#0D1117] placeholder:text-slate-400 transition-colors"
                      placeholder={tAuth.passwordPlaceholder}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>{language === 'id' ? 'Memproses...' : 'Processing...'}</span></>
                  ) : (
                    <><span>{tAuth.submitLogin}</span><ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </motion.form>
            ) : (
              /* ================= REGISTER VIEW ================= */
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleRegister}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{tAuth.heroNameLabel}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      spellCheck="false"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none text-sm font-medium text-[#0D1117] placeholder:text-slate-400 transition-colors"
                      placeholder={tAuth.heroNamePlaceholder}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{tAuth.usernameLabel}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold select-none text-sm">
                      @
                    </div>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      spellCheck="false"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                      className="w-full pl-8 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none text-sm font-medium text-[#0D1117] placeholder:text-slate-400 transition-colors"
                      placeholder={tAuth.usernamePlaceholder}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-[2]">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{tAuth.emailLabel}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="w-4 h-4 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none text-sm font-medium text-[#0D1117] placeholder:text-slate-400 transition-colors"
                        placeholder={tAuth.emailPlaceholder}
                      />
                    </div>
                  </div>
                  <div className="flex-[1.2]">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {tAuth.birthdayLabel}
                      <div className="relative group flex items-center cursor-pointer">
                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#0D1117] text-white text-[10px] leading-tight rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none text-center">
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
                        className="w-full pl-9 pr-3 py-3 bg-white border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none text-sm font-medium text-[#0D1117] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{tAuth.passwordLabel}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 bg-white border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none text-sm font-medium text-[#0D1117] placeholder:text-slate-400 transition-colors"
                      placeholder={tAuth.passwordPlaceholder}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{tAuth.repeatPasswordLabel}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <ShieldCheck className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 bg-white border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none text-sm font-medium text-[#0D1117] placeholder:text-slate-400 transition-colors"
                      placeholder={tAuth.passwordPlaceholder}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>{language === 'id' ? 'Mendaftarkan...' : 'Registering...'}</span></>
                  ) : (
                    <><span>{tAuth.submitRegister}</span><ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Switch Prompt */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            {isLoginView ? (
              <p className="text-xs text-slate-600">
                {language === 'id' ? 'Belum punya akun?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => { playClick(); toggleView(); }}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  {language === 'id' ? 'Daftar sekarang' : 'Sign up now'}
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-600">
                {language === 'id' ? 'Sudah punya akun?' : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => { playClick(); toggleView(); }}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  {language === 'id' ? 'Masuk sekarang' : 'Log in now'}
                </button>
              </p>
            )}

            <p className="mt-4 text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
              {language === 'id' ? (
                <>Dengan melanjutkan, kamu setuju dengan <button type="button" onClick={() => setShowTerms(true)} className="text-slate-700 font-bold underline cursor-pointer hover:text-emerald-700">Aturan Main</button> dan <button type="button" onClick={() => setShowPrivacy(true)} className="text-slate-700 font-bold underline cursor-pointer hover:text-emerald-700">Kebijakan Privasi</button>.</>
              ) : (
                <>By continuing, you agree to the <button type="button" onClick={() => setShowTerms(true)} className="text-slate-700 font-bold underline cursor-pointer hover:text-emerald-700">Rules of Play</button> and <button type="button" onClick={() => setShowPrivacy(true)} className="text-slate-700 font-bold underline cursor-pointer hover:text-emerald-700">Privacy Policy</button>.</>
              )}
            </p>
          </div>

        </div>
      </motion.div>

      {/* Subtle Bottom Brand Footer */}
      <footer className="w-full text-center py-4 z-20">
        <p className="text-xs text-slate-400 font-medium">
          CIKO · {language === 'id' ? 'Platform Edukasi Finansial Interaktif' : 'Interactive Financial Learning Platform'}
        </p>
      </footer>

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