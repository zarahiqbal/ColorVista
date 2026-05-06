import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../components/BackButton";
import {
  createDetectiveRound,
  DetectiveObject,
} from "../constants/colorDetective";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import { useUserData } from "../Context/useUserData";

const skiaModule = (() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require("@shopify/react-native-skia");
  } catch (error) {
    return null;
  }
})();

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const CVD_MATRICES: Record<string, number[]> = {
  normal: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  protanopia: [
    0.567, 0.433, 0, 0, 0, 0.558, 0.442, 0, 0, 0, 0, 0.242, 0.758, 0, 0, 0, 0,
    0, 1, 0,
  ],
  deuteranopia: [
    0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0,
  ],
  tritanopia: [
    0.95, 0.05, 0, 0, 0, 0, 0.433, 0.567, 0, 0, 0, 0.475, 0.525, 0, 0, 0, 0, 0,
    1, 0,
  ],
};

const normalizeCvdType = (value?: string | null) => {
  if (!value) return "normal";
  const lowered = value.toLowerCase();
  if (lowered.includes("protan")) return "protanopia";
  if (lowered.includes("deuter")) return "deuteranopia";
  if (lowered.includes("tritan")) return "tritanopia";
  return "normal";
};

interface DetectiveLayout extends DetectiveObject {
  x: number;
  y: number;
  size: number;
}

export default function ColorDetective() {
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const { user } = useAuth();
  const { userData } = useUserData();
  const cvdType = normalizeCvdType(userData?.cvdType || user?.cvdType);
  const accessibilityMode = cvdType === "normal" ? "normal" : "colorblind";
  const [round, setRound] = useState(() =>
    createDetectiveRound(1, { accessibilityMode }),
  );
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [timeLeft, setTimeLeft] = useState(round.timeLimit);
  const [feedback, setFeedback] = useState("Find the different object");
  const [isGameOver, setIsGameOver] = useState(false);

  const scale = getFontSizeMultiplier();

  const matrix = CVD_MATRICES[cvdType] || CVD_MATRICES.normal;

  if (!skiaModule) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: darkMode ? "#121212" : "#F7F2EB" },
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          <BackButton />
          <Text
            style={[styles.title, { color: darkMode ? "#F8FAFC" : "#1F2937" }]}
          >
            Color Detective
          </Text>
          <View style={styles.gameOverCard}>
            <Text style={styles.gameOverTitle}>Skia unavailable</Text>
            <Text style={styles.gameOverText}>
              This mini game needs the Skia native module. Use a development
              build (not Expo Go) to play Color Detective.
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const { Canvas, Group, Line, Path, Rect, Skia } =
    skiaModule as typeof import("@shopify/react-native-skia");

  const colorFilter = useMemo(
    () => Skia.ColorFilter.MakeMatrix(matrix),
    [matrix, Skia],
  );
  const filterPaint = useMemo(() => {
    const paint = Skia.Paint();
    paint.setColorFilter(colorFilter);
    return paint;
  }, [Skia, colorFilter]);

  const canvasWidth = SCREEN_WIDTH - 32;
  const canvasHeight = Math.min(420, SCREEN_HEIGHT * 0.45);

  const layoutObjects = useMemo<DetectiveLayout[]>(() => {
    const columns = round.objects.length <= 4 ? round.objects.length : 4;
    const rows = Math.ceil(round.objects.length / columns);
    const padding = 16;
    const cellWidth = (canvasWidth - padding * 2) / columns;
    const cellHeight = (canvasHeight - padding * 2) / rows;
    const size = Math.min(cellWidth, cellHeight) * 0.7;

    return round.objects.map((object, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      const x = padding + col * cellWidth + (cellWidth - size) / 2;
      const y = padding + row * cellHeight + (cellHeight - size) / 2;

      return {
        ...object,
        x,
        y,
        size,
      };
    });
  }, [round, canvasWidth, canvasHeight]);

  useEffect(() => {
    setTimeLeft(round.timeLimit);
  }, [round]);

  useEffect(() => {
    setRound(createDetectiveRound(level, { accessibilityMode }));
  }, [accessibilityMode]);

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = Math.max(0, prev - 0.1);
        if (next <= 0) {
          setIsGameOver(true);
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isGameOver]);

  useEffect(() => {
    if (!isGameOver) return;
    AsyncStorage.setItem(
      "@colorDetectiveLastScore",
      JSON.stringify({
        score,
        level,
        at: new Date().toISOString(),
        cvdType,
      }),
    ).catch(() => undefined);
  }, [isGameOver, score, level, cvdType]);

  const nextRound = useCallback(() => {
    setLevel((prev) => {
      const nextLevel = prev + 1;
      setRound(createDetectiveRound(nextLevel, { accessibilityMode }));
      return nextLevel;
    });
  }, [accessibilityMode]);

  const handleSelection = useCallback(
    (object: DetectiveLayout) => {
      if (isGameOver) return;

      const isCorrect = object.id === round.oddId;
      if (isCorrect) {
        setFeedback("Great eye! Keep going.");
        setScore((prev) => prev + 90 * multiplier);
        setStreak((prev) => {
          const nextStreak = prev + 1;
          setMultiplier((current) =>
            nextStreak % 3 === 0 ? Math.min(current + 1, 4) : current,
          );
          return nextStreak;
        });
        nextRound();
      } else {
        setFeedback("Not quite. Look for subtle differences.");
        setStreak(0);
        setMultiplier(1);
        setTimeLeft((prev) => Math.max(0, prev - 2));
      }
    },
    [isGameOver, multiplier, nextRound, round.oddId],
  );

  const handleCanvasPress = useCallback(
    (event: GestureResponderEvent) => {
      const { locationX, locationY } = event.nativeEvent;
      const hit = layoutObjects.find(
        (object) =>
          locationX >= object.x &&
          locationX <= object.x + object.size &&
          locationY >= object.y &&
          locationY <= object.y + object.size,
      );

      if (hit) {
        handleSelection(hit);
      }
    },
    [layoutObjects, handleSelection],
  );

  const restartGame = () => {
    setLevel(1);
    setScore(0);
    setStreak(0);
    setMultiplier(1);
    setIsGameOver(false);
    setFeedback("Find the different object");
    setRound(createDetectiveRound(1, { accessibilityMode }));
  };

  const buildShapePath = (object: DetectiveLayout) => {
    const path = Skia.Path.Make();
    const { x, y, size } = object;
    const centerX = x + size / 2;
    const centerY = y + size / 2;

    switch (object.shape) {
      case "circle":
        path.addCircle(centerX, centerY, size / 2);
        break;
      case "square":
        path.addRect({ x, y, width: size, height: size });
        break;
      case "triangle":
        path.moveTo(centerX, y);
        path.lineTo(x + size, y + size);
        path.lineTo(x, y + size);
        path.close();
        break;
      case "hex":
      default: {
        const radius = size / 2;
        for (let i = 0; i < 6; i += 1) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const px = centerX + radius * Math.cos(angle);
          const py = centerY + radius * Math.sin(angle);
          if (i === 0) path.moveTo(px, py);
          else path.lineTo(px, py);
        }
        path.close();
        break;
      }
    }

    if (object.rotation !== 0) {
      const matrix = Skia.Matrix();
      matrix.translate(centerX, centerY);
      matrix.rotate(object.rotation);
      matrix.translate(-centerX, -centerY);
      path.transform(matrix);
    }

    return path;
  };

  const renderPattern = (object: DetectiveLayout, path: any) => {
    const { x, y, size, pattern, stripeGap, dotRadius } = object;
    const patternColor = themeColors.pattern;

    if (pattern === "solid") {
      return null;
    }

    if (pattern === "stripes") {
      const lines = [];
      for (let offset = 0; offset <= size; offset += stripeGap) {
        lines.push(
          <Line
            key={`stripe-${object.id}-${offset}`}
            p1={{ x, y: y + offset }}
            p2={{ x: x + size, y: y + offset }}
            color={patternColor}
            strokeWidth={2}
          />,
        );
      }

      return <Group clip={path}>{lines}</Group>;
    }

    const dots = [];
    for (let dx = dotRadius * 2; dx < size; dx += dotRadius * 3) {
      for (let dy = dotRadius * 2; dy < size; dy += dotRadius * 3) {
        dots.push(
          <Rect
            key={`dot-${object.id}-${dx}-${dy}`}
            x={x + dx}
            y={y + dy}
            width={dotRadius}
            height={dotRadius}
            color={patternColor}
          />,
        );
      }
    }

    return <Group clip={path}>{dots}</Group>;
  };

  const renderObject = (object: DetectiveLayout) => {
    const path = buildShapePath(object);
    const baseColor = object.color.hex;
    const strokeColor = darkMode ? "rgba(248, 250, 252, 0.85)" : "#0F172A";

    return (
      <Group key={object.id}>
        <Path path={path} color={baseColor} />
        <Path
          path={path}
          color={strokeColor}
          style="stroke"
          strokeWidth={object.borderWidth}
        />
        {renderPattern(object, path)}
      </Group>
    );
  };

  const themeColors = {
    background: darkMode ? "#140A0A" : "#F6F3EE",
    surface: darkMode ? "#1C1C1E" : "#FFFFFF",
    text: darkMode ? "#F6F3EE" : "#2F2F2F",
    subtext: darkMode ? "#D1C7BC" : "#6B6A66",
    bar: darkMode ? "#C4A67A" : "#8B7B6B",
    accent: darkMode ? "#8DA399" : "#7B9A86",
    pattern: darkMode ? "rgba(248, 250, 252, 0.75)" : "rgba(15, 23, 42, 0.7)",
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <SafeAreaView style={styles.safeArea}>
        <BackButton />
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.title,
              { color: themeColors.text, fontSize: 24 * scale },
            ]}
          >
            Color Detective
          </Text>
          <View
            style={[styles.timerPill, { backgroundColor: themeColors.surface }]}
          >
            <Text style={[styles.timerLabel, { color: themeColors.subtext }]}>
              TIME
            </Text>
            <Text style={[styles.timerValue, { color: themeColors.text }]}>
              {timeLeft.toFixed(1)}s
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View
            style={[styles.statMini, { backgroundColor: themeColors.surface }]}
          >
            <Text style={[styles.statLabel, { color: themeColors.subtext }]}>
              Score
            </Text>
            <Text style={[styles.statValue, { color: themeColors.text }]}>
              {score}
            </Text>
          </View>
          <View
            style={[styles.statMini, { backgroundColor: themeColors.surface }]}
          >
            <Text style={[styles.statLabel, { color: themeColors.subtext }]}>
              Level
            </Text>
            <Text style={[styles.statValue, { color: themeColors.text }]}>
              {level}
            </Text>
          </View>
          <View
            style={[styles.statMini, { backgroundColor: themeColors.surface }]}
          >
            <Text style={[styles.statLabel, { color: themeColors.subtext }]}>
              Multi
            </Text>
            <Text style={[styles.statValue, { color: themeColors.text }]}>
              x{multiplier}
            </Text>
          </View>
          <View
            style={[styles.statMini, { backgroundColor: themeColors.surface }]}
          >
            <Text style={[styles.statLabel, { color: themeColors.subtext }]}>
              Streak
            </Text>
            <Text style={[styles.statValue, { color: themeColors.text }]}>
              {streak}
            </Text>
          </View>
        </View>

        <View
          style={[styles.targetCard, { backgroundColor: themeColors.surface }]}
        >
          <Text style={[styles.targetLabel, { color: themeColors.subtext }]}>
            Tap the odd one out
          </Text>
          <Text style={[styles.feedback, { color: themeColors.subtext }]}>
            {feedback}
          </Text>
          <Text style={[styles.hintText, { color: themeColors.subtext }]}>
            {accessibilityMode === "colorblind"
              ? "High-contrast patterns enabled for colorblind play."
              : "Watch for subtle color and pattern changes as you level up."}
          </Text>
        </View>

        <View style={styles.timerWrap}>
          <View
            style={[styles.timerTrack, { backgroundColor: "rgba(0,0,0,0.08)" }]}
          >
            <View
              style={[
                styles.timerFill,
                {
                  backgroundColor: themeColors.bar,
                  width: `${(timeLeft / round.timeLimit) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        <View
          style={[styles.canvasWrap, { backgroundColor: themeColors.surface }]}
        >
          <View
            style={{ width: canvasWidth, height: canvasHeight }}
            onStartShouldSetResponder={() => true}
            onResponderRelease={handleCanvasPress}
          >
            <Canvas style={{ width: canvasWidth, height: canvasHeight }}>
              <Group layer={filterPaint}>
                {layoutObjects.map((object) => renderObject(object))}
              </Group>
            </Canvas>
          </View>
        </View>

        {isGameOver && (
          <View style={styles.gameOverOverlay}>
            <View
              style={[
                styles.gameOverCard,
                { backgroundColor: themeColors.surface },
              ]}
            >
              <Text style={[styles.gameOverTitle, { color: themeColors.text }]}>
                Time's up!
              </Text>
              <Text
                style={[styles.gameOverText, { color: themeColors.subtext }]}
              >
                Final Score: {score}
              </Text>
              <TouchableOpacity
                style={[
                  styles.restartButton,
                  { backgroundColor: themeColors.accent },
                ]}
                onPress={restartGame}
              >
                <Text style={[styles.restartText, { color: themeColors.text }]}>
                  Play Again
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingLeft: 56,
    paddingRight: 8,
  },
  title: {
    fontWeight: "800",
    textAlign: "left",
    letterSpacing: 1.5,
  },
  timerPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: "flex-end",
    minWidth: 90,
  },
  timerLabel: {
    fontSize: 10,
    letterSpacing: 1.4,
    fontWeight: "700",
  },
  timerValue: {
    fontSize: 14,
    fontWeight: "800",
  },
  statsRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
  },
  statMini: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  statLabel: {
    textTransform: "uppercase",
    fontSize: 10,
    letterSpacing: 1.1,
    fontWeight: "700",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4,
  },
  targetCard: {
    marginTop: 16,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  targetLabel: {
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 1.2,
    fontWeight: "700",
  },
  feedback: {
    marginTop: 6,
  },
  hintText: {
    marginTop: 8,
    fontSize: 12,
  },
  timerWrap: {
    marginTop: 10,
  },
  timerTrack: {
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
  },
  timerFill: {
    height: "100%",
    borderRadius: 999,
  },
  canvasWrap: {
    marginTop: 16,
    borderRadius: 22,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  gameOverOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.35)",
  },
  gameOverCard: {
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  gameOverTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  gameOverText: {
    marginTop: 8,
    textAlign: "center",
  },
  restartButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  restartText: {
    fontWeight: "700",
  },
});
