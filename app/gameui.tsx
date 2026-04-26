import { router } from "expo-router";
import GameTypeUI from "../screens/GameUI";

export default function GameRouter() {
  const handleSelect = (difficulty: "easy" | "hard") => {
    // Direct navigation on tap
    router.push({
      pathname: "/quiz",
      params: { level: difficulty },
    });
  };

  return <GameTypeUI onSelect={handleSelect} />;
}