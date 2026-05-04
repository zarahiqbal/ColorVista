
// import { useRouter } from "expo-router";
// import Welcome from "../screens/Welcome";

// export default function WelcomeScreen() {
//   const router = useRouter();
//   return <Welcome onStart={() => router.push("/difficulty")} />;
// }
import { useRouter } from "expo-router";
import Welcome from "../screens/Welcome";

export default function WelcomeScreen() {
  const router = useRouter();
  
  // Using replace prevents the user from navigating "back" into the welcome screen once the test starts
  return <Welcome onStart={() => router.replace("/difficulty")} />;
}