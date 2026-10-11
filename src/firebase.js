// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Reads from Vite .env.local with safe fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCDlpp0nHTWPxSvgpNviVv-c8V8UB2g1pM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "finoraaaa.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "finoraaaa",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "finoraaaa.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "868435767628",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:868435767628:web:6e06eefc4a2d368f5b1fe9",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-SMF89P2NVC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication & Database
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Initialize Analytics safely
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export default app;
