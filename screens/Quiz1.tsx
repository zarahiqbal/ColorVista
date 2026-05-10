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

export default function Quiz1({
  difficulty: _difficulty = "easy",
}: Quiz1Props) {
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
