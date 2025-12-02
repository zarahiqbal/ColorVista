import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
       <Stack.Screen
        name="dashboard"
        options={{
          headerShown: false, // This removes the "dashboard" text and white space
        }}
      />
      <Stack.Screen
        name="welcome"
        options={{
          title: "Welcome",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="difficulty"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="mediaupload"
        options={{
          headerShown: false, // This removes the "dashboard" text and white space
        }}
      />
      <Stack.Screen
        name="live"
        options={{
          headerShown: false, // This removes the "dashboard" text and white space
        }}
      />
      <Stack.Screen
        name="quiz"
        options={{
          headerShown: false, // This removes the "dashboard" text and white space
        }}
      />
    </Stack>
  );
}
