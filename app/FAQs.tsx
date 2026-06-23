import { Stack } from 'expo-router';
import HelpFAQsScreen from '../screens/HelpFAQs';
import { useGoBackOrHomeOnBack } from '../hooks/useBackNavigation';

export default function FAQsRoute() {
  useGoBackOrHomeOnBack();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HelpFAQsScreen />
    </>
  );
}
