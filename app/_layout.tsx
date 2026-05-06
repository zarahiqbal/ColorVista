import { AuthProvider } from "@/Context/AuthContext";
import { ThemeProvider, useTheme } from "@/Context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// ----------------------------------------------------------
// 1. Root Navigator (inside Providers so we can use useTheme)
// ----------------------------------------------------------
// function RootNavigator() {
//   const { darkMode } = useTheme();

//   const backgroundColor = darkMode ? "#140a0aff" : "#F9FAFB";

//   return (
//     <>
//       <StatusBar style={darkMode ? "light" : "dark"} />

//       <Stack
//         // screenOptions={{
//         //   headerShown: false,
//         //   animation: "fade", // <-- FIX: No white flash on Android
//         //   contentStyle: {
//         //     backgroundColor: backgroundColor, // <-- Screen background
//         //   },
//         screenOptions={{
//           headerShown: true, // Turn it back on
//           headerTransparent: true, // Make it float over your content
//           headerTitle: "", // Hide the default text title
//           headerLeft: () => <BackButton />, // Use your component globally
//           animation: "fade",
//           contentStyle: { backgroundColor: backgroundColor },
//         }}
//       >
//         {/* Auth Screens */}
//         <Stack.Screen name="index" />
//         <Stack.Screen name="auth/login/index" />
//         <Stack.Screen name="auth/signup/index" />
//         <Stack.Screen name="splashscreen" />

//         {/* Main App Group */}
//         <Stack.Screen
//           name="(main)"
//           options={{
//             animation: "none",
//           }}
//         />

//         {/* Feature Screens */}

//         <Stack.Screen name="live" />
//         <Stack.Screen name="mediaupload" />
//         <Stack.Screen name="welcome" />

//         {/* Modals */}
//         <Stack.Screen
//           name="comingsoon"
//           options={{
//             presentation: "modal",
//             animation: "slide_from_bottom",
//           }}
//         />
//       </Stack>
//     </>
//   );
// }
function RootNavigator() {
  const { darkMode } = useTheme();
  const backgroundColor = darkMode ? "#140a0aff" : "#F9FAFB";

  return (
    <>
      <StatusBar style={darkMode ? "light" : "dark"} />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor },
        }}
      >
        {/* --- SCREENS WITHOUT BACK BUTTON (headerShown: false) --- */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="splashscreen" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/login/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="auth/signup/index"
          options={{ headerShown: false }}
        />

        {/* If your Dashboard/Profile/Settings are inside (main) tabs */}
        <Stack.Screen
          name="(main)"
          options={{ headerShown: false, animation: "none" }}
        />

        {/* --- SCREENS THAT WILL HAVE THE BACK BUTTON --- */}
        <Stack.Screen name="live" />
        <Stack.Screen name="mediaupload" />
        <Stack.Screen name="welcome" />

        <Stack.Screen
          name="comingsoon"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </>
  );
}
// ----------------------------------------------------------
// 2. Root Layout (Providers + BASE BACKGROUND FIX)
// ----------------------------------------------------------
export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SafeAreaProvider>
          {/* IMPORTANT FIX: Base layer background must match theme */}
          <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
            <RootNavigator />
          </View>
        </SafeAreaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// import React from 'react';
// import { View, Platform, StatusBar as RNStatusBar } from 'react-native';
// import { Stack } from 'expo-router'; // or 'react-navigation'
// import { StatusBar } from 'expo-status-bar';
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import { ThemeProvider, useTheme } from '../Context/ThemeContext'; // Adjust paths
// import { AuthProvider } from '../Context/AuthContext';

// // ----------------------------------------------------------
// // 1. Root Navigator
// // ----------------------------------------------------------
// function RootNavigator() {
//   const { darkMode } = useTheme();

//   // Match background exactly to prevent flickering
//   const backgroundColor = darkMode ? '#140a0aff' : '#F9FAFB';

//   return (
//     <>
//       {/* This handles the icons (time, battery) color.
//       */}
//       <StatusBar style={darkMode ? 'light' : 'dark'} />

//       {/* Android Specific: Makes the status bar area take the color
//         of the background rather than a solid system block.
//       */}
//       {Platform.OS === 'android' && (
//         <RNStatusBar
//           translucent
//           backgroundColor="transparent"
//           barStyle={darkMode ? 'light-content' : 'dark-content'}
//         />
//       )}

//       <Stack
//         screenOptions={{
//           headerShown: false,
//           animation: 'fade',
//           contentStyle: {
//             backgroundColor: backgroundColor,
//           },
//         }}
//       >
//         {/* Auth Screens */}
//         <Stack.Screen name="index" />
//         <Stack.Screen name="auth/login/index" />
//         <Stack.Screen name="auth/signup/index" />
//         <Stack.Screen name="splashscreen" />

//         {/* Main App Group */}
//         <Stack.Screen
//           name="(main)"
//           options={{
//             animation: 'none',
//           }}
//         />

//         {/* Feature Screens */}
//         <Stack.Screen name="live" />
//         <Stack.Screen name="mediaupload" />
//         <Stack.Screen name="welcome" />

//         {/* Modals */}
//         <Stack.Screen
//           name="comingsoon"
//           options={{
//             presentation: 'modal',
//             animation: 'slide_from_bottom',
//           }}
//         />
//       </Stack>
//     </>
//   );
// }

// // ----------------------------------------------------------
// // 2. Root Layout (Global Safety Fix)
// // ----------------------------------------------------------
// export default function RootLayout() {
//   // We apply the theme logic here as well so the SafeAreaView
//   // background matches the app background.
//   return (
//     <SafeAreaProvider>
//       <ThemeProvider>
//         <AuthProvider>
//           <ThemeConsumer />
//         </AuthProvider>
//       </ThemeProvider>
//     </SafeAreaProvider>
//   );
// }

// // Wrapper to access Theme inside the Provider
// function ThemeConsumer() {
//   const { darkMode } = useTheme();
//   const bg = darkMode ? '#140a0aff' : '#F9FAFB';

//   return (
//     /* The SafeAreaView here is the "Global Shield".
//       It adds padding at the top for the Dynamic Island
//       and padding at the bottom for Android system buttons.
//     */
//     <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
//       <RootNavigator />
//     </SafeAreaView>
//   );
// }
