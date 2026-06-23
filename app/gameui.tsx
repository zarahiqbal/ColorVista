import { router } from "expo-router";
import { useGoBackOrHomeOnBack } from "../hooks/useBackNavigation";
import GameTypeUI from "../screens/GameUI";

export default function GameRouter() {
  useGoBackOrHomeOnBack();
  const handleSelect = (difficulty: "easy" | "hard") => {
    if (difficulty === "easy") {
      router.push("/color-detective" as never);
      return;
    }

    router.push("/signal-rush" as never);
  };

  return <GameTypeUI onSelect={handleSelect} />;
}