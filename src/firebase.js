// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAe_v7r5KUZix6zvYZaNjYNPlPa2bS9fPc",
  authDomain: "gen-lang-client-0253969739.firebaseapp.com",
  projectId: "gen-lang-client-0253969739",
  storageBucket: "gen-lang-client-0253969739.firebasestorage.app",
  messagingSenderId: "689600945527",
  appId: "1:689600945527:web:aa7ea9d21c88921db2d572"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);