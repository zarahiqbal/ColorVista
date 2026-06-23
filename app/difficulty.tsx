import { useRouter } from "expo-router";
import { useNavigateToOnBack } from "../hooks/useBackNavigation";
import { DifficultySelection } from "../screens/DifficultyLevel";

export default function DifficultyScreen() {
  const router = useRouter();

  useNavigateToOnBack("/welcome");

  const handleSelect = (difficulty: "basic" | "advanced") => {
    if (difficulty === "advanced") {
      router.push("/advanced-entry");
      return;
    }

    router.push("/quiz");
  };

  return <DifficultySelection onSelectDifficulty={handleSelect} />;
}
