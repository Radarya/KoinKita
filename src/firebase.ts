import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDxNaq6naY0fF9YT9boXMQ1mZc1TedcY2Q",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "koinkita-3f734.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "koinkita-3f734",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "koinkita-3f734.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "402832198545",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:402832198545:web:ca05392d7cdd338862a830",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-GKQW9G66GK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
