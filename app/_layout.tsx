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
// import { AuthProvider } from '@/Context/AuthContext';
// import { ThemeProvider } from '@/Context/ThemeContext';
// import { Stack } from 'expo-router';

// export default function RootLayout() {
//   return (
//     <ThemeProvider>
//       <AuthProvider>
//         <Stack 
//           screenOptions={{ 
//             headerShown: false,
//             // Default animation for most screens (Standard Slide)
//             animation: 'slide_from_right', 
//           }}
//         >
          
//           {/* 1. Entry & Auth Screens */}
//           <Stack.Screen name="index" />
//           <Stack.Screen name="auth/login/index" />
//           <Stack.Screen name="auth/signup/index" />
//           <Stack.Screen name="splashscreen" />

//           {/* 2. The Main App Group (Dashboard, Profile, Settings) 
//              IMPORTANT: We set animation: 'none' here. 
//              This ensures that when you switch between tabs, the Bottom Bar 
//              doesn't slide or flash. It feels like a native Tab Navigator.
//           */}
//           <Stack.Screen 
//             name="(main)" 
//             options={{ 
//               animation: 'none' 
//             }} 
//           />

//           {/* 3. Feature Screens (These will slide in over the dashboard) */}
//           <Stack.Screen name="live" />
//           <Stack.Screen name="mediaupload" />
//           <Stack.Screen name="welcome" />

//           {/* 4. Utility Screens (Modals) */}
//           <Stack.Screen 
//             name="comingsoon" 
//             options={{ 
//               // This makes it slide up from the bottom like a card
//               presentation: 'modal', 
//               animation: 'slide_from_bottom' 
//             }} 
//           />

//         </Stack>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }


import { AuthProvider } from '@/Context/AuthContext';
import { ThemeProvider, useTheme } from '@/Context/ThemeContext'; // Import useTheme
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar'; // Optional: Good for controlling status bar color

// 1. Create an inner component that holds the Stack
// We do this so we can use the 'useTheme()' hook, which requires being INSIDE the Provider.
function RootNavigator() {
  const { darkMode } = useTheme();

  // The background color for the 'canvas' behind the screens.
  // This matches the background color used in your LiveScreen (#140a0aff)
  const backgroundColor = darkMode ? '#140a0aff' : '#F9FAFB';

  return (
    <>
      {/* Optional: Ensure status bar matches theme */}
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          // THIS IS THE FIX:
          // We set the underlying container color to match your dark theme.
          // Now, when you swipe, the background revealed underneath is dark, not white.
          contentStyle: { backgroundColor: backgroundColor }, 
        }}
      >
        {/* 1. Entry & Auth Screens */}
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login/index" />
        <Stack.Screen name="auth/signup/index" />
        <Stack.Screen name="splashscreen" />

        {/* 2. The Main App Group */}
        <Stack.Screen
          name="(main)"
          options={{
            animation: 'none',
          }}
        />

        {/* 3. Feature Screens */}
        <Stack.Screen name="live" />
        <Stack.Screen name="mediaupload" />
        <Stack.Screen name="welcome" />

        {/* 4. Utility Screens */}
        <Stack.Screen
          name="comingsoon"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </>
  );
}

// 2. The Main Layout Export
// This just wraps the navigator with the providers.
export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}