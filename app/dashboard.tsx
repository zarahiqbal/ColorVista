import { router, Stack } from "expo-router";
import Dashboard from "../screens/Dashboard";

export default function DashboardScreen() {
  return (
    <>
      {/* 2. Add Stack.Screen with headerShown: false */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* 3. Your existing Dashboard component */}
      <Dashboard
        onGoToWelcome={() => router.push("/welcome")}
        onGoToLive={() => router.push("/live")}
        onGoToMedia={() => router.push("/mediaupload")}
        
        // Generic navigation for quiz / difficulty etc.
        navigate={(screen: string) => router.push(("/" + screen.toLowerCase()) as any)}

        // 👉 Add Live Detection Navigation
      />
    </>
  );
}

