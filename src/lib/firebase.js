import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBhs7xFjZNohAn0wDLyFolw5vlhQokKIzs",
  authDomain: "pahadse-website.firebaseapp.com",
  projectId: "pahadse-website",
  storageBucket: "pahadse-website.firebasestorage.app",
  messagingSenderId: "338373748114",
  appId: "1:338373748114:web:6d3df4841f55fc92160d4b",
  measurementId: "G-4CC82T9T6R"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}
export default app;
