// // import Quiz from "../screens/Quiz1";

// // export default Quiz;
// import { useLocalSearchParams } from "expo-router";
// import { Text, View } from "react-native";

// export default function QuizScreen() {
//   const { difficulty } = useLocalSearchParams();

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text style={{ fontSize: 24, fontWeight: "bold" }}>
//         Difficulty: {difficulty}
//       </Text>

//       {/* Later: generate AI questions based on difficulty */}
//     </View>
//   );
// }
// import { useLocalSearchParams } from "expo-router";
// import { StyleSheet, Text, View } from "react-native";

// export default function QuizScreen() {
//   const { difficulty } = useLocalSearchParams();

//   const isEasy = difficulty === "easy";
//   const totalQuestions = isEasy ? 6 : 12;
//   const description = isEasy
//     ? "Easy Mode: Beginner-friendly test with clear color differences."
//     : "Hard Mode: Advanced test with subtle color variations.";

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Color Vision Test</Text>

//       {/* Difficulty Label */}
//       <View style={[styles.badge, isEasy ? styles.easyBadge : styles.hardBadge]}>
//         <Text style={styles.badgeText}>
//           {isEasy ? "Easy Mode" : "Hard Mode"}
//         </Text>
//       </View>

//       {/* Description */}
//       <Text style={styles.description}>{description}</Text>

//       {/* Future: Render AI Generated Questions */}
//       <Text style={styles.info}>
//         Total Questions: {totalQuestions}
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#F8FAFC",
//   },
//   heading: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#1E293B",
//   },
//   badge: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     marginBottom: 12,
//   },
//   easyBadge: {
//     backgroundColor: "#DCFCE7",
//   },
//   hardBadge: {
//     backgroundColor: "#FEF3C7",
//   },
//   badgeText: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#1E293B",
//   },
//   description: {
//     fontSize: 16,
//     textAlign: "center",
//     color: "#475569",
//     marginBottom: 20,
//   },
//   info: {
//     fontSize: 18,
//     marginTop: 10,
//     fontWeight: "600",
//     color: "#334155",
//   },
// });


import { useLocalSearchParams } from "expo-router";
import Quiz1 from "../screens/Quiz1";

export default function QuizScreen() {
  const { difficulty } = useLocalSearchParams();

  return <Quiz1 difficulty={difficulty as string} />;
}

// import { useLocalSearchParams } from "expo-router";
// import { View } from "react-native";
// import Quiz from "../screens/Quiz1";

// export default function QuizScreen() {
//   const { difficulty } = useLocalSearchParams();
//   const QuizComponent: any = Quiz;

//   return (
//     <View style={{ flex: 1 }}>
//       <QuizComponent difficulty={difficulty} />
//     </View>
//   );
// }
