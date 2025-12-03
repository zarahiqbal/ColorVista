// import { Stack } from "expo-router";

// export default function Layout() {
//   return (
//     <Stack>
//        <Stack.Screen
//         name="dashboard"
//         options={{
//           headerShown: false, // This removes the "dashboard" text and white space
//         }}
//       />
//       <Stack.Screen
//         name="welcome"
//         options={{
//           title: "Welcome",
//           headerShown: false,
//         }}
//       />
//       <Stack.Screen
//         name="difficulty"
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="mediaupload"
//         options={{
//           headerShown: false, // This removes the "dashboard" text and white space
//         }}
//       />
//       <Stack.Screen
//         name="live"
//         options={{
//           headerShown: false, // This removes the "dashboard" text and white space
//         }}
//       />
//       <Stack.Screen
//         name="quiz"
//         options={{
//           headerShown: false, // This removes the "dashboard" text and white space
//         }}
//       />
//     </Stack>
//   );
// }


import { Stack } from 'expo-router';
import React from 'react';
// Make sure this path points to where you moved the file
import { AuthProvider } from '@/Context/AuthContext';

export default function RootLayout() {
  return (
    // 1. The Provider must be the PARENT
    <AuthProvider>
      {/* 2. The Stack (your screens) is the CHILD */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login/index" />
        <Stack.Screen name="auth/signup/index" />
      </Stack>
    </AuthProvider>
  );
}
// import { Stack } from 'expo-router';

// export default function RootLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       {/* Expo Router automatically detects screens based on files.
//         We just configure the stack behavior here.
//       */}
//       <Stack.Screen name="index" />
//       <Stack.Screen name="auth/login/index" />
//       <Stack.Screen name="auth/signup/index" />
//       <Stack.Screen name="dashboard/index" />
//     </Stack>
//   );
// }