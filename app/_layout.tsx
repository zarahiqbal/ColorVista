// import { Stack } from 'expo-router';
// // Make sure this path points to where you moved the file
// import { AuthProvider } from '@/Context/AuthContext';
// import { ThemeProvider } from '@/Context/ThemeContext';

// export default function RootLayout() {
//   return (
//     <ThemeProvider>
//       <AuthProvider>
//         <Stack screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="index" />
//           <Stack.Screen name="auth/login/index" />
//           <Stack.Screen name="auth/signup/index" />
//           <Stack.Screen
//             name="splashscreen"
//             options={{
//               title: "Splash",
//               headerShown: false,
//             }}
//           />
//         </Stack>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }
import { AuthProvider } from '@/Context/AuthContext';
import { ThemeProvider } from '@/Context/ThemeContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack 
          screenOptions={{ 
            headerShown: false,
            // Default animation for most screens (Standard Slide)
            animation: 'slide_from_right', 
          }}
        >
          
          {/* 1. Entry & Auth Screens */}
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/login/index" />
          <Stack.Screen name="auth/signup/index" />
          <Stack.Screen name="splashscreen" />

          {/* 2. The Main App Group (Dashboard, Profile, Settings) 
             IMPORTANT: We set animation: 'none' here. 
             This ensures that when you switch between tabs, the Bottom Bar 
             doesn't slide or flash. It feels like a native Tab Navigator.
          */}
          <Stack.Screen 
            name="(main)" 
            options={{ 
              animation: 'none' 
            }} 
          />

          {/* 3. Feature Screens (These will slide in over the dashboard) */}
          <Stack.Screen name="live" />
          <Stack.Screen name="mediaupload" />
          <Stack.Screen name="welcome" />

          {/* 4. Utility Screens (Modals) */}
          <Stack.Screen 
            name="comingsoon" 
            options={{ 
              // This makes it slide up from the bottom like a card
              presentation: 'modal', 
              animation: 'slide_from_bottom' 
            }} 
          />

        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}