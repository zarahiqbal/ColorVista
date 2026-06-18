import 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '@/Context/AuthContext';
import SplashScreen from './splashscreen';

export default function Index() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/auth/login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isLoading, user, router]);

  return <SplashScreen />;
}
