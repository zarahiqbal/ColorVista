import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, type Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4I2f-P2cR_SALkLtX9-BfOiTOtwGwba8",
  authDomain: "colorvista-8d249.firebaseapp.com",
  projectId: "colorvista-8d249",
  storageBucket: "colorvista-8d249.firebasestorage.app",
  messagingSenderId: "533535960388",
  appId: "1:533535960388:android:e633f04e7610f76514fb11",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

type AuthModule = typeof import("firebase/auth") & {
  getReactNativePersistence: (
    storage: typeof AsyncStorage,
  ) => import("firebase/auth").Persistence;
};

function createAuth(): Auth {
  const authModule = require("firebase/auth") as AuthModule;

  try {
    return initializeAuth(app, {
      persistence: authModule.getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
}

export const auth = createAuth();
export const firestore = getFirestore(app);
export default app;
