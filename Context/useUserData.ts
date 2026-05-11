import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { subscribeUserProfile } from './userProfileFirestore';

/**
 * Subscribes to the signed-in user's Firestore profile (`users/{uid}`).
 * Keeps AsyncStorage `@userData` in sync for offline display.
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
      } catch {
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

    const unsubscribe = subscribeUserProfile(
      user.uid,
      (data) => {
        if (data) {
          const merged = { ...data, uid: user.uid };
          setUserData(merged);
          AsyncStorage.setItem('@userData', JSON.stringify(merged)).catch(
            () => undefined,
          );
        } else {
          setUserData({ ...user, uid: user.uid });
        }
        setLoading(false);
      },
      (error) => {
        console.error('❌ useUserData: Error fetching user data:', error);
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  return { userData, loading };
};
