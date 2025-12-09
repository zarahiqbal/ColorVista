import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from './firebase';

/**
 * Hook to listen to user data in real-time from Firebase Realtime Database
 * Automatically syncs when user logs in/out
 */
export const useUserData = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.isGuest || !user.uid) {
      console.log('useUserData: No authenticated user, skipping listener');
      setUserData(null);
      return;
    }

    console.log('useUserData: Setting up real-time listener for user:', user.uid);
    setLoading(true);
    const userRef = ref(db, `users/${user.uid}`);

    // Real-time listener
    const unsubscribe = onValue(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          console.log('📡 useUserData received update:', snapshot.val());
          setUserData(snapshot.val());
        } else {
          console.log('⚠️ useUserData: No user data found');
        }
        setLoading(false);
      },
      (error) => {
        console.error('❌ useUserData: Error fetching user data:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('useUserData: Cleaning up listener');
      unsubscribe();
    };
  }, [user]);

  return { userData, loading };
};
