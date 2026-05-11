import { useRouter } from 'expo-router';
import { useEffect } from 'react';
// Import the splash screen component you already have in your file list
import SplashScreen from './splashscreen';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Wait for 3 seconds (3000 milliseconds)
    const timer = setTimeout(() => {
      // Navigate to your login screen
      // We use .replace() so the user can't go "back" to the splash screen
      router.replace('/auth/login'); 
    }, 3000);

    // Cleanup the timer if the user leaves the screen early
    return () => clearTimeout(timer);
  }, []);

  // While waiting, show the Splash Screen design
  return <SplashScreen />;
}