import { Stack } from 'expo-router';
// Make sure this path points to where you moved the file
import { AuthProvider } from '@/Context/AuthContext';
import { ThemeProvider } from '@/Context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/login/index" />
          <Stack.Screen name="auth/signup/index" />
          <Stack.Screen
            name="splashscreen"
            options={{
              title: "Splash",
              headerShown: false,
            }}
          />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
