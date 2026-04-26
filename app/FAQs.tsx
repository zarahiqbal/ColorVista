import { Stack } from 'expo-router';
// Import the actual UI component from your screens folder
import HelpFAQsScreen from '../screens/HelpFAQs';

export default function FAQsRoute() {
  return (
    <>
      {/* Configure the header options here or hide them if the screen handles it */}
      <Stack.Screen options={{ headerShown: false }} />
      <HelpFAQsScreen />
    </>
  );
}