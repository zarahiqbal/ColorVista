import { useRouter } from "expo-router";
import Welcome from "../screens/Welcome";

export default function WelcomeScreen() {
  const router = useRouter();
  return <Welcome onStart={() => router.push("/difficulty")} />;
}
