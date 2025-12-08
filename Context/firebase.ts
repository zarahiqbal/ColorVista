import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Firebase project config - Replace with your actual credentials from Firebase Console
const firebaseConfig = {
  apiKey: 'AIzaSyD4I2f-P2cR_SALkLtX9-BfOiTOtwGwba8',
  authDomain: 'colorvista-8d249.firebaseapp.com',
  projectId: 'colorvista-8d249',
  storageBucket: 'colorvista-8d249.firebasestorage.app',
  messagingSenderId: '533535960388',
  appId: '1:533535960388:android:e633f04e7610f76514fb11',
  databaseURL: 'https://colorvista-8d249-default-rtdb.firebaseio.com'
};

const app = initializeApp(firebaseConfig);

// Expose Auth and Realtime Database instances
export const auth = getAuth(app);
export const db = getDatabase(app);

export default app;
