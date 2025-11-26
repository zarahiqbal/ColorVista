// import { DifficultySelection } from '../screens/DifficultyLevel';

// export default function DifficultyScreen() {
//   return (
//     <DifficultySelection
//       onSelectDifficulty={(difficulty) => {
//         console.log('Selected difficulty:', difficulty);
//         // later you can route to test screen:
//         // router.push(`/test?level=${difficulty}`);
//       }}
//     />
//   );
// }

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

//upp one right
// import DifficultyLevel from "../screens/DifficultyLevel";

// export default function DifficultyScreen() {
//   return (
//     <DifficultyLevel
//       onSelectDifficulty={(level) => {
//         console.log("Selected:", level);
//         // router.push(`/quiz?mode=${level}`)
//       }}
//     />
//   );
// }
