import { useRouter } from "expo-router";
import { DifficultySelection } from "../screens/DifficultyLevel";

export default function DifficultyScreen() {
  const router = useRouter();

  const handleSelect = (difficulty: "basic" | "advanced") => {
    if (difficulty === "advanced") {
      // Advanced: Ishihara plates → HueTest → Result
      router.push("/advanced-entry");
      return;
    }

    // Basic: Quiz → Result
    router.push("/quiz");
  };

  return <DifficultySelection onSelectDifficulty={handleSelect} />;
}
