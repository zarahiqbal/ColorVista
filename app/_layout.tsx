import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Welcome",
          headerShown: false,
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
        name="dashboard"
        options={{
          title: "Dashboard",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="userprofile"
        options={{
          title: "User Profile",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="difficulty"
        options={{ title: "Select Difficulty" }}
      />
      <Stack.Screen
        name="quiz"
        options={{ title: "Quiz" }}
      />
      <Stack.Screen
        name="live"
        options={{ title: "Live Detection" }}
      />
    </Stack>
  );
}
