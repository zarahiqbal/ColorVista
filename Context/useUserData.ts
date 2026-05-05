import AsyncStorage from '@react-native-async-storage/async-storage';
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
    let mounted = true;

    const hydrateFromCache = async () => {
      try {
        const cached = await AsyncStorage.getItem('@userData');
        if (cached && mounted) {
          setUserData(JSON.parse(cached));
        }
      } catch (error) {
        // ignore cache errors
      }
    };

    hydrateFromCache();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user || user.isGuest || !user.uid) {
      setUserData(null);
      AsyncStorage.removeItem('@userData').catch(() => undefined);
      setLoading(false);
      return;
    }

    setLoading(true);
    setUserData((prev: any) => prev ?? user);
    const userRef = ref(db, `users/${user.uid}`);

    // Real-time listener
    const unsubscribe = onValue(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);
          AsyncStorage.setItem('@userData', JSON.stringify(data)).catch(
            () => undefined,
          );
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
      unsubscribe();
    };
  }, [user]);

  return { userData, loading };
};
