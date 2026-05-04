// import { useRouter } from "expo-router";
// import { DifficultySelection } from "../screens/DifficultyLevel";

// export default function DifficultyScreen() {
//   const router = useRouter();

//   const handleSelect = (difficulty: "easy" | "hard") => {
//     router.push({
//       pathname: "/quiz",
//       params: { difficulty },
//     });
//   };

//   return <DifficultySelection onSelectDifficulty={handleSelect} />;
// }
// app/difficulty.tsx
import React from 'react';
import { useRouter } from "expo-router";
// Make sure this path matches where you saved the UI file
import { DifficultySelection } from "../screens/DifficultyLevel"; 

export default function DifficultyScreen() {
  const router = useRouter();

  const handleSelect = (difficulty: "easy" | "hard") => {
    // Navigate to the quiz route passing the difficulty param
    router.push({
      pathname: "/quiz",
      params: { difficulty },
    });
  };

  return <DifficultySelection onSelectDifficulty={handleSelect} />;
}