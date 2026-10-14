import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAe_v7r5KUZix6zvYZaNjYNPlPa2bS9fPc",
  authDomain: "gen-lang-client-0253969739.firebaseapp.com",
  projectId: "gen-lang-client-0253969739",
  storageBucket: "gen-lang-client-0253969739.firebasestorage.app",
  messagingSenderId: "689600945527",
  appId: "1:689600945527:web:aa7ea9d21c88921db2d572"
};

// Singleton initialization for Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Safe Auth initialization to prevent Metro Fast Refresh crash
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (error) {
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);