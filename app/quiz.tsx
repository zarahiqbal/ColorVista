


import { useLocalSearchParams } from "expo-router";
import Quiz1 from "../screens/Quiz1";

export default function QuizScreen() {
  const { difficulty } = useLocalSearchParams();

  return <Quiz1 difficulty={difficulty as string} />;
}

