import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Firebase project config - Replace with your actual credentials from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyD4I2f-P2cR_SALkLtX9-BfOiTOtwGwba8",
  authDomain: "colorvista-8d249.firebaseapp.com",
  projectId: "colorvista-8d249",
  storageBucket: "colorvista-8d249.firebasestorage.app",
  messagingSenderId: "533535960388",
  appId: "1:533535960388:android:e633f04e7610f76514fb11",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export default app;
