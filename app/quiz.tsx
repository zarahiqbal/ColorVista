// app/quiz.tsx
import { useRouter } from "expo-router";
import Quiz1, { QuizResults } from "../screens/Quiz1";

export default function QuizRoute() {
  const router = useRouter();

  // Basic mode: quiz -> result
  const handleQuizComplete = (results: QuizResults, rawAnswers: any[]) => {
    router.push({
      pathname: "/result",
      params: {
        results: JSON.stringify(results),
        data: JSON.stringify(rawAnswers),
      },
    });
  };

  return <Quiz1 difficulty="basic" onComplete={handleQuizComplete} />;
}
