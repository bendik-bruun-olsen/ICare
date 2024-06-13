import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0qA0-pTTliTIUwU-7_M42qOqg27S7V5c",
  authDomain: "icare-29d1e.firebaseapp.com",
  projectId: "icare-29d1e",
  storageBucket: "icare-29d1e.appspot.com",
  messagingSenderId: "299019941969",
  appId: "1:299019941969:web:c50c63af7856c94f602070",
  measurementId: "G-6444RZGVFG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
export { db };
