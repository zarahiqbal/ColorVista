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
// Dark mode removed for quiz screens — use fixed light theme
import {
  getShuffledOptions,
  PLATE_DATA,
  PlateQuestion,
} from "../constants/questions";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Quiz1Props {
  // Which plates to show. Defaults to PLATE_DATA (basic 22 plates).
  plates?: PlateQuestion[];

  // Called when the last plate is answered.
  // Receives the calculated results object.
  // Basic mode:    router.push('/result', { results })
  // Advanced mode: navigation.navigate('HueTest', { ishiharaResult: results })
  onComplete?: (results: QuizResults, rawAnswers: AnswerData[]) => void;

  difficulty?: "basic" | "advanced";
}

interface AnswerData {
  plateId: number;
  type: PlateQuestion["type"];
  category: PlateQuestion["category"] | null;
  selectedAnswer: string;
  isCorrect: boolean;
  isConfusion: boolean;
}

export interface QuizResults {
  redGreen: { correct: number; total: number };
  blueYellow: { correct: number; total: number };
  // Advanced mode adds these:
  tritanConfusionCount?: number;
  ishiharaTritanScore?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Quiz1({
  plates = PLATE_DATA,
  onComplete,
  difficulty = "basic",
}: Quiz1Props) {
  // Dark mode removed; use fixed light theme colors below

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerData[]>([]);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);

  const progressAnim = useRef(new Animated.Value(0)).current;

  const currentPlate: PlateQuestion | undefined = plates[currentIndex];

  useEffect(() => {
    if (!currentPlate) return;

    const options = getShuffledOptions(currentPlate).filter(
      (option): option is string => typeof option === "string",
    );
    setCurrentOptions(options);

    Animated.spring(progressAnim, {
      toValue: (currentIndex + 1) / plates.length,
      useNativeDriver: false,
    }).start();
  }, [currentIndex, currentPlate, plates.length, progressAnim]);

  // ── Answer handler ──────────────────────────────────────────────────────────

  const handleSelection = (val: string) => {
    if (!currentPlate) return;

    const confusionAnswers = currentPlate.confusionAnswers ?? [];
    const isCorrect = val === currentPlate.correctAnswer;
    const isConfusion =
      (confusionAnswers.includes(val) ||
        val === currentPlate.tritanopiaLikelyAnswer) &&
      val !== currentPlate.correctAnswer;

    const answerData: AnswerData = {
      plateId: currentPlate.id,
      type: currentPlate.type,
      category: currentPlate.category ?? null,
      selectedAnswer: val,
      isCorrect,
      isConfusion,
    };

    const updatedAnswers = [...userAnswers, answerData];
    setUserAnswers(updatedAnswers);

    if (currentIndex < plates.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Last plate — calculate and hand off
      const results = calculateResults(updatedAnswers);
      onComplete?.(results, updatedAnswers);
    }
  };

  // ── Score calculator ────────────────────────────────────────────────────────

  const calculateResults = (answers: AnswerData[]): QuizResults => {
    const redGreenAnswers = answers.filter((a) => a.category === "red-green");
    const blueYellowAnswers = answers.filter((a) =>
      ["screening", "tritan", "severity"].includes(a.type),
    );

    // Tritan confusion count — how many times user gave the tritanopiaLikelyAnswer
    const tritanConfusionCount = answers.filter((a) => a.isConfusion).length;

    // Weighted Tritan error score for advanced mode handoff to HueTest
    const ishiharaTritanScore = answers.reduce((sum, a) => {
      if (!a.isCorrect) {
        // Tritan-type plates contribute more heavily
        const weight =
          a.type === "tritan"
            ? 2.0
            : a.type === "severity"
              ? 1.8
              : a.type === "screening"
                ? 1.5
                : 1.0;
        return sum + weight;
      }
      return sum;
    }, 0);

    return {
      redGreen: {
        correct: redGreenAnswers.filter((a) => a.isCorrect).length,
        total: redGreenAnswers.length,
      },
      blueYellow: {
        correct: blueYellowAnswers.filter((a) => a.isCorrect).length,
        total: blueYellowAnswers.length,
      },
      tritanConfusionCount,
      ishiharaTritanScore,
    };
  };

  // ── Theme ───────────────────────────────────────────────────────────────────

  const theme = {
    bg: "#F8FAFC",
    card: "#FFFFFF",
    text: "#1A1A1A",
    border: "#E2E8F0",
  };

  if (!currentPlate) return null;

  const isHRR =
    currentPlate.type === "demo" ||
    currentPlate.type === "screening" ||
    currentPlate.type === "tritan" ||
    currentPlate.type === "severity";

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <View style={[styles.main, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        {/* Phase tag — only shown in advanced mode */}
        {difficulty === "advanced" && (
          <View style={styles.phaseTag}>
            <Text style={styles.phaseTagText}>PHASE 1 OF 2 — PLATE TEST</Text>
          </View>
        )}

        <Text style={[styles.stepText, { color: theme.text }]}>
          Plate {currentIndex + 1} of {plates.length}
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
        {/* Plate card */}
        <View
          style={[
            styles.plateCard,
            { backgroundColor: theme.card, borderColor: theme.border },
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

        {/* Options grid */}
        <View style={styles.grid}>
          {currentOptions.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.btn,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
              onPress={() => handleSelection(opt)}
            >
              <Text style={[styles.btnText, { color: theme.text }]}>{opt}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.nothingBtn, { backgroundColor: "#FFF5F5" }]}
            onPress={() => handleSelection("Nothing")}
          >
            <Text style={styles.nothingText}>I see nothing</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
// Identical to original — no visual changes.

const styles = StyleSheet.create({
  main: { flex: 1 },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  phaseTag: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F0FE",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 8,
  },
  phaseTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#4B6BFB",
    letterSpacing: 1.0,
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
