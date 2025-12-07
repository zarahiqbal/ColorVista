import { router, Stack } from "expo-router";
import Dashboard from "../screens/Dashboard";

export default function DashboardScreen() {
  const navigate = (screen: string) => {
    // Map screen names to actual route names
    const routeMap: Record<string, any> = {
      "livescreen": "/live",
      "mediaupload": "/mediaupload",
      "vrscreen": "/vrscreen",
      "gamesscreen": "/gamesscreen",
      "welcome": "/welcome",
      "enhancerscreen": "/enhancerscreen",

    };

    const route = routeMap[screen.toLowerCase()];
    
    if (route) {
      router.push(route);
    } else {
      // Fallback: try to push the screen name directly if not in map
      // This handles the generic logic from your second block
      router.push(("/" + screen.toLowerCase()) as any);
    }
  };

  return (
    <>
      {/* Configure the stack header to be hidden */}
      <Stack.Screen options={{ headerShown: false }} />

      <Dashboard
       // onGoToWelcome={() => router.push("/welcome")}
        //navigate={navigate}
      />
    </>
  );
}
