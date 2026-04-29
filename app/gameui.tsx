import { router } from "expo-router";
import GameTypeUI from "../screens/GameUI";

export default function GameRouter() {
  const handleSelect = (difficulty: "easy" | "hard") => {
    if (difficulty === "easy") {
      router.push("/unity-game" as never);
      return;
    }

    router.push({
      pathname: "/quiz",
      params: { difficulty: "hard" },
    });
  };

  return <GameTypeUI onSelect={handleSelect} />;
}