import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDxNaq6naY0fF9YT9boXMQ1mZc1TedcY2Q",
  authDomain: "koinkita-3f734.firebaseapp.com",
  projectId: "koinkita-3f734",
  storageBucket: "koinkita-3f734.firebasestorage.app",
  messagingSenderId: "402832198545",
  appId: "1:402832198545:web:ca05392d7cdd338862a830",
  measurementId: "G-GKQW9G66GK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
