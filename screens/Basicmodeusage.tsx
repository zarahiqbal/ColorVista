// screens/BasicModeUsage.tsx
// Your existing basic mode screen — NO CHANGES NEEDED.
// Quiz1 defaults to PLATE_DATA and basic mode when no props are passed.
// The only change from original: replace router.push inside Quiz1
// with the onComplete prop, as shown below.

import { useRouter } from "expo-router";
import Quiz1, { QuizResults } from "./Quiz1";

export default function BasicModeScreen() {
  const router = useRouter();

  return (
    <Quiz1
      // plates defaults to PLATE_DATA — no need to pass it
      // difficulty defaults to "basic" — no need to pass it
      onComplete={(results, rawAnswers) => {
        router.push({
          pathname: "/result",
          params: {
            results: JSON.stringify(results),
            data: JSON.stringify(rawAnswers),
          },
        });
      }}
    />
  );
}