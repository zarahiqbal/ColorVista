// import { useRouter } from "expo-router";
// import { useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Animated,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useTheme } from "../Context/ThemeContext";
// import IshiharaPlate from "../components/IshiharaPlate";
// import { generateQuiz, QuizQuestion } from "../constants/questions";

// interface Quiz1Props {
//   difficulty: "easy" | "hard";
// }

// export default function Quiz1({ difficulty }: Quiz1Props) {
//   const router = useRouter();
//   const { darkMode } = useTheme();

//   const themeColors = {
//     background: darkMode ? "#121212" : "#F5F9FF",
//     text: darkMode ? "#FFFFFF" : "#1A1A1A",
//     cardBg: darkMode ? "#1E1E1E" : "#FFFFFF",
//     subText: darkMode ? "#AAAAAA" : "#666666",
//     primary: "#2D5BFF",
//   };

//   const [questions, setQuestions] = useState<QuizQuestion[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [score, setScore] = useState(0);
//   const [answers, setAnswers] = useState<
//     { questionId: number; correct: boolean; type: string }[]
//   >([]);

//   // Keep only progress animation
//   const progressAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const q = generateQuiz(difficulty);
//     setQuestions(q);
//   }, [difficulty]);

//   useEffect(() => {
//     if (questions.length === 0) return;
//     const progress = (currentIndex + 1) / questions.length;

//     Animated.timing(progressAnim, {
//       toValue: progress,
//       duration: 400,
//       useNativeDriver: false,
//     }).start();
//   }, [currentIndex, questions]);

//   const handleAnswer = (selectedNumber: string) => {
//     const isCorrect = selectedNumber === questions[currentIndex].numberShown;
//     if (isCorrect) setScore((prev) => prev + 1);

//     const newAnswers = [
//       ...answers,
//       {
//         questionId: questions[currentIndex].id,
//         correct: isCorrect,
//         type: questions[currentIndex].type,
//       },
//     ];
//     setAnswers(newAnswers);

//     if (currentIndex < questions.length - 1) {
//       // Instant switch
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       const results = calculateResults(newAnswers);
//       router.push({
//         pathname: "/result",
//         params: { results: JSON.stringify(results) },
//       });
//     }
//   };

//   const calculateResults = (
//     ans: { questionId: number; correct: boolean; type: string }[],
//   ) => {
//     const redGreenAnswers = ans.filter((a) => a.type === "red-green");
//     const blueYellowAnswers = ans.filter((a) => a.type === "blue-yellow");

//     return {
//       redGreen: {
//         correct: redGreenAnswers.filter((a) => a.correct).length,
//         total: redGreenAnswers.length,
//       },
//       blueYellow: {
//         correct: blueYellowAnswers.filter((a) => a.correct).length,
//         total: blueYellowAnswers.length,
//       },
//     };
//   };

//   if (questions.length === 0) {
//     return (
//       <View style={styles.loading}>
//         <ActivityIndicator size="large" color={themeColors.primary} />
//         <Text style={{ marginTop: 20, color: themeColors.text }}>
//           Generating Plates...
//         </Text>
//       </View>
//     );
//   }

//   const currentQ = questions[currentIndex];

//   return (
//     <View style={{ flex: 1, backgroundColor: themeColors.background }}>
//       <View style={styles.topBar}>
//         <Text style={[styles.progressText, { color: themeColors.text }]}>
//           {currentIndex + 1}/{questions.length}
//         </Text>
//       </View>

//       <View style={styles.progressContainer}>
//         <Animated.View
//           style={[
//             styles.progressFill,
//             {
//               width: progressAnim.interpolate({
//                 inputRange: [0, 1],
//                 outputRange: ["0%", "100%"],
//               }),
//             },
//           ]}
//         />
//       </View>

//       <ScrollView contentContainerStyle={styles.container}>
//         <View style={{ width: "100%", alignItems: "center" }}>
//           <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
//             <IshiharaPlate
//               number={currentQ.numberShown}
//               fgColor={currentQ.correctColor}
//               bgColor={currentQ.bgColor}
//               size={280}
//               difficulty={difficulty}
//             />

//             <Text style={[styles.question, { color: themeColors.text }]}>
//               {currentQ.description}
//             </Text>

//             <Text style={[styles.helperText, { color: themeColors.subText }]}>
//               (Select 'Nothing' if you can't see a number)
//             </Text>
//           </View>

//           <View style={styles.optionsGrid}>
//             {currentQ.options.map((opt, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={styles.optionBtn}
//                 onPress={() => handleAnswer(opt)}
//               >
//                 <Text style={styles.optionText}>{opt}</Text>
//               </TouchableOpacity>
//             ))}

//             <TouchableOpacity
//               style={[styles.optionBtn, styles.nothingBtn]}
//               onPress={() => handleAnswer("nothing")}
//             >
//               <Text style={styles.optionText}>Nothing</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   loading: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   container: {
//     flexGrow: 1,
//     alignItems: "center",
//     padding: 20,
//   },
//   topBar: {
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingTop: 50,
//     marginBottom: 10,
//   },
//   progressText: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   progressContainer: {
//     height: 6,
//     width: "100%",
//     backgroundColor: "#E5E7EB",
//   },
//   progressFill: {
//     height: "100%",
//     backgroundColor: "#2D5BFF",
//     borderRadius: 10,
//   },
//   card: {
//     width: "100%",
//     borderRadius: 20,
//     padding: 20,
//     alignItems: "center",
//     marginVertical: 20,
//     elevation: 3,
//   },
//   question: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginTop: 15,
//     textAlign: "center",
//   },
//   helperText: {
//     fontSize: 14,
//     marginTop: 5,
//     fontStyle: "italic",
//   },
//   optionsGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "center",
//     gap: 12,
//   },
//   optionBtn: {
//     width: "42%",
//     backgroundColor: "#F9FAFB",
//     paddingVertical: 18,
//     borderRadius: 14,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   nothingBtn: {
//     width: "85%",
//     backgroundColor: "#FFF0F0",
//     borderColor: "#FFCDD2",
//   },
//   optionText: {
//     fontSize: 18,
//     fontWeight: "600",
//   },
// });
// // import { useRouter } from "expo-router";
// // import { useEffect, useRef, useState } from "react";
// // import {
// //   ActivityIndicator,
// //   Animated,
// //   Easing,
// //   ScrollView,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   View,
// // } from "react-native";
// // import { useTheme } from "../Context/ThemeContext";
// // import BackButton from "../components/BackButton";
// // import IshiharaPlate from "../components/IshiharaPlate";
// // import { generateQuiz, QuizQuestion } from "../constants/questions";

// // interface Quiz1Props {
// //   difficulty: "easy" | "hard";
// // }

// // export default function Quiz1({ difficulty }: Quiz1Props) {
// //   const router = useRouter();
// //   const { darkMode, getFontSizeMultiplier } = useTheme();
// //   const fontScale = getFontSizeMultiplier();

// //   const themeColors = {
// //     background: darkMode ? "#121212" : "#F5F9FF",
// //     text: darkMode ? "#FFFFFF" : "#1A1A1A",
// //     cardBg: darkMode ? "#1E1E1E" : "#FFFFFF",
// //     subText: darkMode ? "#AAAAAA" : "#666666",
// //     border: darkMode ? "#333333" : "#E0E0E0",
// //     primary: "#2D5BFF",
// //     danger: "#ff4444",
// //   };

// //   const [questions, setQuestions] = useState<QuizQuestion[]>([]);
// //   const [currentIndex, setCurrentIndex] = useState(0);
// //   const [score, setScore] = useState(0);
// //   const [answers, setAnswers] = useState<
// //     { questionId: number; correct: boolean; type: string }[]
// //   >([]);

// //   // Animations
// //   const progressAnim = useRef(new Animated.Value(0)).current;
// //   const fadeAnim = useRef(new Animated.Value(1)).current;
// //   const translateY = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     const q = generateQuiz(difficulty);
// //     setQuestions(q);
// //   }, [difficulty]);

// //   // Progress animation
// //   useEffect(() => {
// //     if (questions.length === 0) return;

// //     const progress = (currentIndex + 1) / questions.length;

// //     Animated.timing(progressAnim, {
// //       toValue: progress,
// //       duration: 400,
// //       useNativeDriver: false,
// //     }).start();
// //   }, [currentIndex, questions]);

// //   const animateNext = (callback: () => void) => {
// //     Animated.parallel([
// //       Animated.timing(fadeAnim, {
// //         toValue: 0,
// //         duration: 200,
// //         useNativeDriver: true,
// //       }),
// //       Animated.timing(translateY, {
// //         toValue: -20,
// //         duration: 200,
// //         useNativeDriver: true,
// //       }),
// //     ]).start(() => {
// //       callback();

// //       fadeAnim.setValue(0);
// //       translateY.setValue(20);

// //       Animated.parallel([
// //         Animated.timing(fadeAnim, {
// //           toValue: 1,
// //           duration: 250,
// //           easing: Easing.out(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(translateY, {
// //           toValue: 0,
// //           duration: 250,
// //           useNativeDriver: true,
// //         }),
// //       ]).start();
// //     });
// //   };

// //   if (questions.length === 0) {
// //     return (
// //       <View style={styles.loading}>
// //         <ActivityIndicator size="large" color={themeColors.primary} />
// //         <Text style={{ marginTop: 20, color: themeColors.text }}>
// //           Generating Plates...
// //         </Text>
// //       </View>
// //     );
// //   }

// //   const currentQ = questions[currentIndex];
// //   const totalQuestions = questions.length;

// //   const handleAnswer = (selectedNumber: string) => {
// //     const isCorrect = selectedNumber === currentQ.numberShown;
// //     if (isCorrect) setScore((prev) => prev + 1);

// //     const newAnswers = [
// //       ...answers,
// //       {
// //         questionId: currentQ.id,
// //         correct: isCorrect,
// //         type: currentQ.type,
// //       },
// //     ];
// //     setAnswers(newAnswers);

// //     if (currentIndex < questions.length - 1) {
// //       animateNext(() => setCurrentIndex(currentIndex + 1));
// //     } else {
// //       const results = calculateResults(newAnswers);
// //       router.push({
// //         pathname: "/result",
// //         params: { results: JSON.stringify(results) },
// //       });
// //     }
// //   };

// //   const calculateResults = (
// //     answers: { questionId: number; correct: boolean; type: string }[],
// //   ) => {
// //     const redGreenAnswers = answers.filter((a) => a.type === "red-green");
// //     const blueYellowAnswers = answers.filter((a) => a.type === "blue-yellow");

// //     return {
// //       redGreen: {
// //         correct: redGreenAnswers.filter((a) => a.correct).length,
// //         total: redGreenAnswers.length,
// //       },
// //       blueYellow: {
// //         correct: blueYellowAnswers.filter((a) => a.correct).length,
// //         total: blueYellowAnswers.length,
// //       },
// //     };
// //   };

// //   return (
// //     <View style={{ flex: 1, backgroundColor: themeColors.background }}>
// //       {/* 🔝 Top Bar */}
// //       <View style={styles.topBar}>
// //         <BackButton />
// //         <Text style={[styles.progressText, { color: themeColors.text }]}>
// //           {currentIndex + 1}/{totalQuestions}
// //         </Text>
// //       </View>

// //       {/* 📊 Progress Bar */}
// //       <View style={styles.progressContainer}>
// //         <Animated.View
// //           style={[
// //             styles.progressFill,
// //             {
// //               width: progressAnim.interpolate({
// //                 inputRange: [0, 1],
// //                 outputRange: ["0%", "100%"],
// //               }),
// //             },
// //           ]}
// //         />
// //       </View>

// //       <ScrollView contentContainerStyle={styles.container}>
// //         {/* ✨ Animated Content */}
// //         <Animated.View
// //           style={{
// //             opacity: fadeAnim,
// //             transform: [{ translateY }],
// //             width: "100%",
// //             alignItems: "center",
// //           }}
// //         >
// //           {/* 🎴 Card */}
// //           <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
// //             <IshiharaPlate
// //               number={currentQ.numberShown}
// //               fgColor={currentQ.correctColor}
// //               bgColor={currentQ.bgColor}
// //               size={280}
// //               difficulty={difficulty}
// //             />

// //             <Text style={[styles.question, { color: themeColors.text }]}>
// //               {currentQ.description}
// //             </Text>

// //             <Text style={[styles.helperText, { color: themeColors.subText }]}>
// //               (Select 'Nothing' if you can't see a number)
// //             </Text>
// //           </View>

// //           {/* 🔘 Options */}
// //           <View style={styles.optionsGrid}>
// //             {currentQ.options.map((opt: string, index: number) => (
// //               <TouchableOpacity
// //                 key={index}
// //                 style={styles.optionBtn}
// //                 onPress={() => handleAnswer(opt)}
// //               >
// //                 <Text style={styles.optionText}>{opt}</Text>
// //               </TouchableOpacity>
// //             ))}

// //             <TouchableOpacity
// //               style={[styles.optionBtn, styles.nothingBtn]}
// //               onPress={() => handleAnswer("nothing")}
// //             >
// //               <Text style={styles.optionText}>Nothing</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </Animated.View>
// //       </ScrollView>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   loading: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },

// //   container: {
// //     flexGrow: 1,
// //     alignItems: "center",
// //     padding: 20,
// //   },

// //   topBar: {
// //     width: "100%",
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     paddingHorizontal: 20,
// //     paddingTop: 50,
// //     marginBottom: 10,
// //   },

// //   progressText: {
// //     fontSize: 16,
// //     fontWeight: "600",
// //   },

// //   progressContainer: {
// //     height: 6,
// //     width: "100%",
// //     backgroundColor: "#E5E7EB",
// //   },

// //   progressFill: {
// //     height: "100%",
// //     backgroundColor: "#2D5BFF",
// //     borderRadius: 10,
// //   },

// //   card: {
// //     width: "100%",
// //     borderRadius: 20,
// //     padding: 20,
// //     alignItems: "center",
// //     marginVertical: 20,
// //     elevation: 3,
// //   },

// //   question: {
// //     fontSize: 20,
// //     fontWeight: "bold",
// //     marginTop: 15,
// //     textAlign: "center",
// //   },

// //   helperText: {
// //     fontSize: 14,
// //     marginTop: 5,
// //     fontStyle: "italic",
// //   },

// //   optionsGrid: {
// //     flexDirection: "row",
// //     flexWrap: "wrap",
// //     justifyContent: "center",
// //     gap: 12,
// //   },

// //   optionBtn: {
// //     width: "42%",
// //     backgroundColor: "#F9FAFB",
// //     paddingVertical: 18,
// //     borderRadius: 14,
// //     alignItems: "center",
// //     borderWidth: 1,
// //     borderColor: "#E5E7EB",
// //   },

// //   nothingBtn: {
// //     width: "85%",
// //     backgroundColor: "#FFF0F0",
// //     borderColor: "#FFCDD2",
// //   },

// //   optionText: {
// //     fontSize: 18,
// //     fontWeight: "600",
// //   },
// // });
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../Context/ThemeContext";
import {
  getShuffledOptions,
  PLATE_DATA,
  PlateQuestion,
} from "../constants/questions";

interface Quiz1Props {
  difficulty?: "easy" | "hard";
}

export default function Quiz1({ difficulty: _difficulty = "easy" }: Quiz1Props) {
  const router = useRouter();
  const { darkMode } = useTheme();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);

  const progressAnim = useRef(new Animated.Value(0)).current;

  const currentPlate: PlateQuestion | undefined = PLATE_DATA[currentIndex];

  useEffect(() => {
    if (!currentPlate) return;

    const options = getShuffledOptions(currentPlate).filter(
      (option): option is string => typeof option === "string",
    );
    setCurrentOptions(options);

    Animated.spring(progressAnim, {
      toValue: (currentIndex + 1) / PLATE_DATA.length,
      useNativeDriver: false,
    }).start();
  }, [currentIndex, currentPlate, progressAnim]);

  const handleSelection = (val: string) => {
    if (!currentPlate) return;

    const confusionAnswers = currentPlate.confusionAnswers ?? [];

    const isCorrect = val === currentPlate.correctAnswer;
    const isConfusion =
      (confusionAnswers.includes(val) ||
        val === currentPlate.tritanopiaLikelyAnswer) &&
      val !== currentPlate.correctAnswer;

    const answerData = {
      plateId: currentPlate.id,
      type: currentPlate.type,
      category: currentPlate.category ?? null,
      selectedAnswer: val,
      isCorrect,
      isConfusion,
    };

    const updatedAnswers = [...userAnswers, answerData];
    setUserAnswers(updatedAnswers);

    if (currentIndex < PLATE_DATA.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const results = calculateResults(updatedAnswers);

      router.push({
        pathname: "/result",
        params: {
          results: JSON.stringify(results),
          data: JSON.stringify(updatedAnswers),
        },
      });
    }
  };

  const calculateResults = (
    answers: {
      type: PlateQuestion["type"];
      category: PlateQuestion["category"] | null;
      isCorrect: boolean;
    }[],
  ) => {
    const redGreenAnswers = answers.filter(
      (answer) => answer.category === "red-green",
    );
    const blueYellowAnswers = answers.filter((answer) =>
      ["screening", "tritan", "severity"].includes(answer.type),
    );

    return {
      redGreen: {
        correct: redGreenAnswers.filter((answer) => answer.isCorrect).length,
        total: redGreenAnswers.length,
      },
      blueYellow: {
        correct: blueYellowAnswers.filter((answer) => answer.isCorrect).length,
        total: blueYellowAnswers.length,
      },
    };
  };

  const theme = {
    bg: darkMode ? "#121212" : "#F8FAFC",
    card: darkMode ? "#1E1E1E" : "#FFFFFF",
    text: darkMode ? "#FFFFFF" : "#1A1A1A",
    border: darkMode ? "#333" : "#E2E8F0",
  };

  if (!currentPlate) return null;

  const isHRR =
    currentPlate.type === "demo" ||
    currentPlate.type === "screening" ||
    currentPlate.type === "tritan" ||
    currentPlate.type === "severity";

  return (
    <View style={[styles.main, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.stepText, { color: theme.text }]}>
          Plate {currentIndex + 1} of {PLATE_DATA.length}
        </Text>

        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Plate */}
        <View
          style={[
            styles.plateCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Image
            source={currentPlate.image}
            style={styles.plateImage}
            resizeMode="contain"
          />

          <Text style={[styles.instruction, { color: theme.text }]}>
            {isHRR ? "Identify the hidden symbol" : "What number do you see?"}
          </Text>
        </View>

        {/* Options */}
        <View style={styles.grid}>
          {currentOptions.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.btn,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => handleSelection(opt)}
            >
              <Text style={[styles.btnText, { color: theme.text }]}>{opt}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[
              styles.nothingBtn,
              {
                backgroundColor: darkMode ? "#311" : "#FFF5F5",
              },
            ]}
            onPress={() => handleSelection("Nothing")}
          >
            <Text style={styles.nothingText}>I see nothing</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1 },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  stepText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },

  progressTrack: {
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    backgroundColor: "#2D5BFF",
  },

  scrollContent: {
    padding: 20,
    alignItems: "center",
  },

  plateCard: {
    width: "100%",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  plateImage: {
    width: 260,
    height: 260,
    marginBottom: 20,
  },

  instruction: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },

  btn: {
    width: "48%",
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 15,
  },

  btnText: {
    fontSize: 22,
    fontWeight: "bold",
  },

  nothingBtn: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FEB2B2",
    alignItems: "center",
  },

  nothingText: {
    color: "#C53030",
    fontWeight: "700",
    fontSize: 16,
  },
});
// import React, { useState, useEffect, useRef } from "react";
// import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, ScrollView } from "react-native";
// import { useRouter } from "expo-router";
// import { useTheme } from "../Context/ThemeContext";
// import { PLATE_DATA, getShuffledOptions, PlateQuestion } from "../constants/questions";

// export default function StandardColorTest() {
//   const router = useRouter();
//   const { darkMode } = useTheme();

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [userAnswers, setUserAnswers] = useState<any[]>([]);
//   const [currentOptions, setCurrentOptions] = useState<string[]>([]);

//   const progressAnim = useRef(new Animated.Value(0)).current;

//   const currentPlate = PLATE_DATA[currentIndex];

//   useEffect(() => {
//     if (currentPlate) {
//       setCurrentOptions(getShuffledOptions(currentPlate));

//       // Update progress bar
//       Animated.spring(progressAnim, {
//         toValue: (currentIndex + 1) / PLATE_DATA.length,
//         useNativeDriver: false,
//       }).start();
//     }
//   }, [currentIndex]);

//   const handleSelection = (val: string) => {
//     const answerData = {
//       plateId: currentPlate.id,
//       type: currentPlate.type,
//       category: currentPlate.category,
//       isCorrect: val === currentPlate.correctAnswer,
//       isConfusion: currentPlate.confusionAnswers.includes(val) && val !== currentPlate.correctAnswer
//     };

//     const updatedAnswers = [...userAnswers, answerData];
//     setUserAnswers(updatedAnswers);

//     if (currentIndex < PLATE_DATA.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       // Navigate to results and pass stringified data
//       router.push({
//         pathname: "/result",
//         params: { data: JSON.stringify(updatedAnswers) }
//       });
//     }
//   };

//   const theme = {
//     bg: darkMode ? "#121212" : "#F8FAFC",
//     card: darkMode ? "#1E1E1E" : "#FFFFFF",
//     text: darkMode ? "#FFFFFF" : "#1A1A1A",
//     border: darkMode ? "#333" : "#E2E8F0"
//   };

//   return (
//     <View style={[styles.main, { backgroundColor: theme.bg }]}>
//       {/* Header & Progress */}
//       <View style={styles.header}>
//         <Text style={[styles.stepText, { color: theme.text }]}>
//           Plate {currentIndex + 1} of {PLATE_DATA.length}
//         </Text>
//         <View style={styles.progressTrack}>
//           <Animated.View style={[styles.progressBar, {
//             width: progressAnim.interpolate({
//               inputRange: [0, 1],
//               outputRange: ['0%', '100%']
//             })
//           }]} />
//         </View>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* Plate Display */}
//         <View style={[styles.plateCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
//           <Image
//             source={currentPlate.image}
//             style={styles.plateImage}
//             resizeMode="contain"
//           />
//           <Text style={[styles.instruction, { color: theme.text }]}>
//             {currentPlate.type === 'hrr' ? "Identify the symbol or number" : "What number do you see?"}
//           </Text>
//         </View>

//         {/* Options Grid */}
//         <View style={styles.grid}>
//           {currentOptions.map((opt) => (
//             <TouchableOpacity
//               key={opt}
//               style={[styles.btn, { backgroundColor: theme.card, borderColor: theme.border }]}
//               onPress={() => handleSelection(opt)}
//             >
//               <Text style={[styles.btnText, { color: theme.text }]}>{opt}</Text>
//             </TouchableOpacity>
//           ))}

//           <TouchableOpacity
//             style={[styles.nothingBtn, { backgroundColor: darkMode ? "#311" : "#FFF5F5" }]}
//             onPress={() => handleSelection("nothing")}
//           >
//             <Text style={styles.nothingText}>I see nothing</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   main: { flex: 1 },
//   header: { paddingTop: 60, paddingHorizontal: 20 },
//   stepText: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
//   progressTrack: { height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, overflow: 'hidden' },
//   progressBar: { height: '100%', backgroundColor: '#2D5BFF' },
//   scrollContent: { padding: 20, alignItems: 'center' },
//   plateCard: {
//     width: '100%',
//     padding: 20,
//     borderRadius: 24,
//     borderWidth: 1,
//     alignItems: 'center',
//     marginBottom: 30,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8
//   },
//   plateImage: { width: 260, height: 260, marginBottom: 20 },
//   instruction: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
//   grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
//   btn: {
//     width: '48%',
//     paddingVertical: 20,
//     borderRadius: 16,
//     borderWidth: 1,
//     alignItems: 'center',
//     marginBottom: 15
//   },
//   btnText: { fontSize: 22, fontWeight: 'bold' },
//   nothingBtn: {
//     width: '100%',
//     paddingVertical: 18,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#FEB2B2',
//     alignItems: 'center'
//   },
//   nothingText: { color: '#C53030', fontWeight: '700', fontSize: 16 }
// });
