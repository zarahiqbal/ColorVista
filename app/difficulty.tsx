import { useRouter } from "expo-router";
import { DifficultySelection } from "../screens/DifficultyLevel";

export default function DifficultyScreen() {
  const router = useRouter();

  const handleSelect = (difficulty: "easy" | "hard") => {
    router.push({
      pathname: "/quiz",
      params: { difficulty },
    });
  };

  return <DifficultySelection onSelectDifficulty={handleSelect} />;
}