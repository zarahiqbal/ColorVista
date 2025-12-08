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
      setUserData(null);
      return;
    }

    setLoading(true);
    const userRef = ref(db, `users/${user.uid}`);

    // Real-time listener
    const unsubscribe = onValue(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { userData, loading };
};
