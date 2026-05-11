import { useRouter } from "expo-router";
import { DifficultySelection } from "../screens/DifficultyLevel";

export default function DifficultyScreen() {
  const router = useRouter();

  const handleSelect = (difficulty: "basic" | "advanced") => {
    if (difficulty === "advanced") {
      router.push("/huetestscreen");
      return;
    }

    router.push({
      pathname: "/quiz",
      params: { difficulty: "easy" },
    });
  };

  return <DifficultySelection onSelectDifficulty={handleSelect} />;
}
