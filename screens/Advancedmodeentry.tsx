// screens/AdvancedModeEntry.tsx
// Entry point for advanced mode — wires Quiz1 → HueTestScreen → Result.
// This is the ONLY new file needed for advanced mode routing.
// Basic mode continues to use Quiz1 exactly as before.

import { useRouter } from "expo-router";
import { ADVANCED_PLATES } from "../constants/questions";
import Quiz1, { QuizResults } from "./Quiz1";

// Minimal IshiharaResult shape used for routing between Quiz -> HueTest
export interface IshiharaResult {
  totalPlates: number;
  correctCount: number;
  tritanResponseCount: number;
  ishiharaTritanScore: number;
  plateAnswers: Array<{
    plateId: string;
    userAnswer: string;
    normalAnswer: string;
    tritanAnswer: string;
    isCorrect: boolean;
    isTritanResponse: boolean;
    plateType?: string;
    tritanWeight?: number;
  }>;
}

export default function AdvancedModeEntry() {
  const router = useRouter();

  const handleIshiharaComplete = (results: QuizResults, rawAnswers: any[]) => {
    // Build the IshiharaResult shape expected by HueTestScreen + scoringUtils
    const ishiharaResult: IshiharaResult = {
      totalPlates: rawAnswers.length,
      correctCount: rawAnswers.filter((a) => a.isCorrect).length,
      tritanResponseCount: rawAnswers.filter((a) => a.isConfusion).length,
      ishiharaTritanScore: results.ishiharaTritanScore ?? 0,
      plateAnswers: rawAnswers.map((a) => ({
        plateId: a.plateId,
        userAnswer: a.selectedAnswer,
        normalAnswer: a.correctAnswer ?? "",
        tritanAnswer: a.tritanopiaLikelyAnswer ?? "",
        isCorrect: a.isCorrect,
        isTritanResponse: a.isConfusion,
        plateType: a.type,
        tritanWeight:
          a.type === "tritan"
            ? 2.0
            : a.type === "severity"
              ? 1.8
              : a.type === "screening"
                ? 1.5
                : 1.0,
      })),
    };

    // Navigate to Phase 2 (app route is `huetestscreen`)
    router.push({
      pathname: "/huetestscreen",
      params: {
        ishiharaResult: JSON.stringify(ishiharaResult),
      },
    });
  };

  return (
    <Quiz1
      plates={ADVANCED_PLATES}
      difficulty="advanced"
      onComplete={handleIshiharaComplete}
    />
  );
}
