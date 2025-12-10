

// app/quiz.tsx
import { useLocalSearchParams } from "expo-router";
// Ensure this path matches where you put the screen file
import Quiz1 from "../screens/Quiz1";

export default function QuizRoute() {
  // 1. Get the parameter safely
  const { difficulty } = useLocalSearchParams<{ difficulty: string }>();

  // 2. Sanitize: Default to 'easy' if param is missing or weird
  const mode = difficulty === 'hard' ? 'hard' : 'easy';

  // 3. Pass it down as a clean prop
  return <Quiz1 difficulty={mode} />;
}
