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
  createSignalRound,
  getSignalPalette,
  SignalCategory,
  SignalDefinition,
} from "../constants/signalRush";
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
  normal: [
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, 1, 0,
  ],
  protanopia: [
    0.567, 0.433, 0, 0, 0,
    0.558, 0.442, 0, 0, 0,
    0, 0.242, 0.758, 0, 0,
    0, 0, 0, 1, 0,
  ],
  deuteranopia: [
    0.625, 0.375, 0, 0, 0,
    0.7, 0.3, 0, 0, 0,
    0, 0.3, 0.7, 0, 0,
    0, 0, 0, 1, 0,
  ],
  tritanopia: [
    0.95, 0.05, 0, 0, 0,
    0, 0.433, 0.567, 0, 0,
    0, 0.475, 0.525, 0, 0,
    0, 0, 0, 1, 0,
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

interface SignalLayout extends SignalDefinition {
  x: number;
  y: number;
  size: number;
  labelX: number;
  labelY: number;
}

const CATEGORY_LABELS: Record<SignalCategory, string> = {
  safe: "SAFE",
  caution: "CAUTION",
  danger: "DANGER",
};

export default function SignalRush() {
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const { user } = useAuth();
  const { userData } = useUserData();
  const cvdType = normalizeCvdType(userData?.cvdType || user?.cvdType);
  const [round, setRound] = useState(() => createSignalRound(1, { cvdType }));
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [timeLeft, setTimeLeft] = useState(round.timeLimit);
  const [feedback, setFeedback] = useState("Tap the matching signal");
  const [isGameOver, setIsGameOver] = useState(false);

  const scale = getFontSizeMultiplier();

  const matrix = CVD_MATRICES[cvdType] || CVD_MATRICES.normal;

  if (!skiaModule) {
    return (
      <View style={[styles.container, { backgroundColor: darkMode ? "#121212" : "#F7F2EB" }]}>
        <SafeAreaView style={styles.safeArea}>
          <BackButton />
          <Text style={[styles.title, { color: darkMode ? "#F8FAFC" : "#1F2937" }]}
          >
            Signal Rush
          </Text>
          <View style={styles.gameOverCard}>
            <Text style={styles.gameOverTitle}>Skia unavailable</Text>
            <Text style={styles.gameOverText}>
              This mini game needs the Skia native module. Use a development build
              (not Expo Go) to play Signal Rush.
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const { Canvas, Circle, Group, Line, Path, Rect, Skia } = skiaModule as typeof import("@shopify/react-native-skia");

  const colorFilter = useMemo(() => Skia.ColorFilter.MakeMatrix(matrix), [matrix, Skia]);
  const filterPaint = useMemo(() => {
    const paint = Skia.Paint();
    paint.setColorFilter(colorFilter);
    return paint;
  }, [Skia, colorFilter]);

  const canvasWidth = SCREEN_WIDTH - 32;
  const canvasHeight = Math.min(420, SCREEN_HEIGHT * 0.45);
  const labelBadgeHeight = 18;

  const layoutSignals = useMemo<SignalLayout[]>(() => {
    const columns = round.signals.length <= 3 ? round.signals.length : 3;
    const rows = Math.ceil(round.signals.length / columns);
    const padding = 16;
    const cellWidth = (canvasWidth - padding * 2) / columns;
    const cellHeight = (canvasHeight - padding * 2) / rows;
    const size = Math.min(cellWidth, cellHeight) * 0.65;

    return round.signals.map((signal, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      const x = padding + col * cellWidth + (cellWidth - size) / 2;
      const y = padding + row * cellHeight + (cellHeight - size) / 2;

      const labelY = Math.min(
        y + size + 6,
        canvasHeight - labelBadgeHeight - 4,
      );

      return {
        ...signal,
        x,
        y,
        size,
        labelX: x,
        labelY,
      };
    });
  }, [round, canvasWidth, canvasHeight]);

  const resetTimer = useCallback((duration: number) => {
    setTimeLeft(duration);
  }, []);

  useEffect(() => {
    resetTimer(round.timeLimit);
  }, [round, resetTimer]);

  useEffect(() => {
    setRound(createSignalRound(level, { cvdType }));
  }, [cvdType]);

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
      "@signalRushLastScore",
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
      setRound(createSignalRound(nextLevel, { cvdType }));
      return nextLevel;
    });
  }, [cvdType]);

  const handleSelection = useCallback(
    (signal: SignalLayout) => {
      if (isGameOver) return;

      const isCorrect = signal.category === round.target;
      if (isCorrect) {
        setFeedback("Correct! Keep the streak alive.");
        setScore((prev) => prev + 100 * multiplier);
        setStreak((prev) => {
          const nextStreak = prev + 1;
          setMultiplier((current) =>
            nextStreak % 3 === 0 ? Math.min(current + 1, 4) : current,
          );
          return nextStreak;
        });
        nextRound();
      } else {
        setFeedback("Incorrect! Time penalty applied.");
        setStreak(0);
        setMultiplier(1);
        setTimeLeft((prev) => Math.max(0, prev - 2));
      }
    },
    [isGameOver, round.target, multiplier, nextRound],
  );

  const handleCanvasPress = useCallback(
    (event: GestureResponderEvent) => {
      const { locationX, locationY } = event.nativeEvent;
      const hit = layoutSignals.find(
        (signal) =>
          locationX >= signal.x &&
          locationX <= signal.x + signal.size &&
          locationY >= signal.y &&
          locationY <= signal.y + signal.size,
      );

      if (hit) {
        handleSelection(hit);
      }
    },
    [layoutSignals, handleSelection],
  );

  const restartGame = () => {
    setLevel(1);
    setScore(0);
    setStreak(0);
    setMultiplier(1);
    setIsGameOver(false);
    setFeedback("Tap the matching signal");
    setRound(createSignalRound(1, { cvdType }));
  };

  const renderSignalShape = (signal: SignalLayout) => {
    const { fill } = getSignalPalette(signal.category, cvdType);
    const { x, y, size } = signal;
    const centerX = x + size / 2;
    const centerY = y + size / 2;
    switch (signal.shape) {
      case "circle":
        return (
          <Circle
            cx={centerX}
            cy={centerY}
            r={size / 2}
            color={fill}
            style="fill"
          />
        );
      case "square":
        return (
          <Rect x={x} y={y} width={size} height={size} color={fill} />
        );
      case "diamond": {
        const path = Skia.Path.Make();
        path.moveTo(centerX, y);
        path.lineTo(x + size, centerY);
        path.lineTo(centerX, y + size);
        path.lineTo(x, centerY);
        path.close();
        return <Path path={path} color={fill} />;
      }
      case "hex": {
        const path = Skia.Path.Make();
        const radius = size / 2;
        for (let i = 0; i < 6; i += 1) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const px = centerX + radius * Math.cos(angle);
          const py = centerY + radius * Math.sin(angle);
          if (i === 0) path.moveTo(px, py);
          else path.lineTo(px, py);
        }
        path.close();
        return <Path path={path} color={fill} />;
      }
      case "triangle":
      default: {
        const path = Skia.Path.Make();
        path.moveTo(centerX, y);
        path.lineTo(x + size, y + size);
        path.lineTo(x, y + size);
        path.close();
        return <Path path={path} color={fill} />;
      }
    }
  };

  const renderSignalStroke = (signal: SignalLayout) => {
    const { stroke } = getSignalPalette(signal.category, cvdType);
    const { x, y, size } = signal;
    const centerX = x + size / 2;
    const centerY = y + size / 2;
    const strokeWidth = 4;

    switch (signal.shape) {
      case "circle":
        return (
          <Circle
            cx={centerX}
            cy={centerY}
            r={size / 2}
            color={stroke}
            style="stroke"
            strokeWidth={strokeWidth}
          />
        );
      case "square":
        return (
          <Rect
            x={x}
            y={y}
            width={size}
            height={size}
            color={stroke}
            style="stroke"
            strokeWidth={strokeWidth}
          />
        );
      case "diamond": {
        const path = Skia.Path.Make();
        path.moveTo(centerX, y);
        path.lineTo(x + size, centerY);
        path.lineTo(centerX, y + size);
        path.lineTo(x, centerY);
        path.close();
        return (
          <Path
            path={path}
            color={stroke}
            style="stroke"
            strokeWidth={strokeWidth}
          />
        );
      }
      case "hex": {
        const path = Skia.Path.Make();
        const radius = size / 2;
        for (let i = 0; i < 6; i += 1) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const px = centerX + radius * Math.cos(angle);
          const py = centerY + radius * Math.sin(angle);
          if (i === 0) path.moveTo(px, py);
          else path.lineTo(px, py);
        }
        path.close();
        return (
          <Path
            path={path}
            color={stroke}
            style="stroke"
            strokeWidth={strokeWidth}
          />
        );
      }
      case "triangle":
      default: {
        const path = Skia.Path.Make();
        path.moveTo(centerX, y);
        path.lineTo(x + size, y + size);
        path.lineTo(x, y + size);
        path.close();
        return (
          <Path
            path={path}
            color={stroke}
            style="stroke"
            strokeWidth={strokeWidth}
          />
        );
      }
    }
  };

  const renderSignalIcon = (signal: SignalLayout) => {
    const iconColor = darkMode ? "#F8FAFC" : "#111827";
    const { x, y, size } = signal;
    const centerX = x + size / 2;
    const centerY = y + size / 2;

    switch (signal.icon) {
      case "check": {
        const path = Skia.Path.Make();
        path.moveTo(x + size * 0.25, centerY);
        path.lineTo(x + size * 0.45, y + size * 0.7);
        path.lineTo(x + size * 0.75, y + size * 0.3);
        return (
          <Path
            path={path}
            color={iconColor}
            style="stroke"
            strokeWidth={5}
            strokeCap="round"
            strokeJoin="round"
          />
        );
      }
      case "exclamation": {
        return (
          <>
            <Rect
              x={centerX - size * 0.06}
              y={y + size * 0.25}
              width={size * 0.12}
              height={size * 0.35}
              color={iconColor}
            />
            <Circle
              cx={centerX}
              cy={y + size * 0.72}
              r={size * 0.06}
              color={iconColor}
            />
          </>
        );
      }
      case "arrow": {
        const path = Skia.Path.Make();
        path.moveTo(x + size * 0.3, centerY);
        path.lineTo(x + size * 0.7, centerY);
        path.lineTo(x + size * 0.6, centerY - size * 0.12);
        path.moveTo(x + size * 0.7, centerY);
        path.lineTo(x + size * 0.6, centerY + size * 0.12);
        return (
          <Path
            path={path}
            color={iconColor}
            style="stroke"
            strokeWidth={5}
            strokeCap="round"
            strokeJoin="round"
          />
        );
      }
      case "cross":
      default:
        return (
          <>
            <Line
              p1={{ x: x + size * 0.3, y: y + size * 0.3 }}
              p2={{ x: x + size * 0.7, y: y + size * 0.7 }}
              color={iconColor}
              strokeWidth={5}
            />
            <Line
              p1={{ x: x + size * 0.7, y: y + size * 0.3 }}
              p2={{ x: x + size * 0.3, y: y + size * 0.7 }}
              color={iconColor}
              strokeWidth={5}
            />
          </>
        );
    }
  };

  const themeColors = {
    background: darkMode ? "#121212" : "#F7F2EB",
    surface: darkMode ? "#1F1F1F" : "#FFFFFF",
    text: darkMode ? "#F8FAFC" : "#1F2937",
    subtext: darkMode ? "#CBD5F5" : "#6B7280",
    bar: darkMode ? "#F59E0B" : "#4B5563",
    accent: darkMode ? "#F59E0B" : "#F97316",
    overlay: darkMode ? "rgba(15, 23, 42, 0.55)" : "rgba(15, 23, 42, 0.35)",
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <SafeAreaView style={styles.safeArea}>
        <BackButton />
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: themeColors.text, fontSize: 22 * scale }]}
          >
            Signal Rush
          </Text>
          <View style={[styles.timerPill, { backgroundColor: themeColors.surface }]}
          >
            <Text style={[styles.timerLabel, { color: themeColors.subtext }]}>TIME</Text>
            <Text style={[styles.timerValue, { color: themeColors.text }]}
            >
              {timeLeft.toFixed(1)}s
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statMini, { backgroundColor: themeColors.surface }]}
          >
            <Text style={[styles.statLabel, { color: themeColors.subtext }]}>Score</Text>
            <Text style={[styles.statValue, { color: themeColors.text }]}
            >
              {score}
            </Text>
          </View>
          <View style={[styles.statMini, { backgroundColor: themeColors.surface }]}
          >
            <Text style={[styles.statLabel, { color: themeColors.subtext }]}>Level</Text>
            <Text style={[styles.statValue, { color: themeColors.text }]}
            >
              {level}
            </Text>
          </View>
          <View style={[styles.statMini, { backgroundColor: themeColors.surface }]}
          >
            <Text style={[styles.statLabel, { color: themeColors.subtext }]}>Multi</Text>
            <Text style={[styles.statValue, { color: themeColors.text }]}
            >
              x{multiplier}
            </Text>
          </View>
          <View style={[styles.statMini, { backgroundColor: themeColors.surface }]}
          >
            <Text style={[styles.statLabel, { color: themeColors.subtext }]}>Streak</Text>
            <Text style={[styles.statValue, { color: themeColors.text }]}
            >
              {streak}
            </Text>
          </View>
        </View>

        <View style={[styles.targetCard, { backgroundColor: themeColors.surface }]}>
          <Text style={[styles.targetLabel, { color: themeColors.subtext }]}>
            Target Signal
          </Text>
          <Text style={[styles.targetValue, { color: themeColors.text }]}>
            {CATEGORY_LABELS[round.target]}
          </Text>
          <Text style={[styles.questionText, { color: themeColors.text }]}>
            {round.question}
          </Text>
          <Text style={[styles.feedback, { color: themeColors.subtext }]}>
            {feedback}
          </Text>
          <Text style={[styles.hintText, { color: themeColors.subtext }]}>
            {cvdType === "normal"
              ? "Use color, shape, and icon cues to decide quickly."
              : "Colorblind mode: extra labels and contrast enabled."}
          </Text>
        </View>

        <View style={styles.timerWrap}>
          <View style={[styles.timerTrack, { backgroundColor: themeColors.surface }]}
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

        <View style={[styles.canvasWrap, { backgroundColor: themeColors.surface }]}
        >
          <View
            style={{ width: canvasWidth, height: canvasHeight }}
            onStartShouldSetResponder={() => true}
            onResponderRelease={handleCanvasPress}
          >
            <Canvas style={{ width: canvasWidth, height: canvasHeight }}>
              <Group layer={filterPaint}>
                {layoutSignals.map((signal) => (
                  <Group key={signal.id}>
                    {renderSignalShape(signal)}
                    {renderSignalStroke(signal)}
                    {renderSignalIcon(signal)}
                  </Group>
                ))}
              </Group>
            </Canvas>

            {round.showLabels && (
              <View style={styles.labelOverlay} pointerEvents="none">
                {layoutSignals.map((signal) => (
                  <View
                    key={`${signal.id}-label`}
                    style={[
                      styles.labelBadge,
                      {
                        left: signal.labelX,
                        top: signal.labelY,
                        width: signal.size,
                        backgroundColor: themeColors.surface,
                        borderColor: themeColors.bar,
                      },
                    ]}
                  >
                    <Text style={[styles.labelText, { color: themeColors.text }]}>
                      {signal.label}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {isGameOver && (
          <View style={[styles.gameOverOverlay, { backgroundColor: themeColors.overlay }]}>
            <View style={[styles.gameOverCard, { backgroundColor: themeColors.surface }]}>
              <Text style={[styles.gameOverTitle, { color: themeColors.text }]}>
                Time's up!
              </Text>
              <Text style={[styles.gameOverText, { color: themeColors.subtext }]}>
                Final Score: {score}
              </Text>
              <TouchableOpacity
                style={[styles.restartButton, { backgroundColor: themeColors.accent }]}
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
  },
  targetValue: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 4,
  },
  feedback: {
    marginTop: 6,
  },
  questionText: {
    marginTop: 6,
    fontWeight: "700",
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
  },
  labelOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  labelBadge: {
    position: "absolute",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  labelText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#111827",
  },
  gameOverOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
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
