import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import {
  createSignalRound,
  CvdType,
  SignalColor,
  SignalLight,
  SignalRound,
  describeConfusionPairs,
} from "../constants/signalRush";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import { recordGameSession } from "../Context/userProfileFirestore";
import { useUserData } from "../Context/useUserData";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const normalizeCvdType = (value?: string | null): CvdType => {
  if (!value) return "normal";
  const v = value.toLowerCase();
  if (v.includes("protan")) return "protanopia";
  if (v.includes("deuter")) return "deuteranopia";
  if (v.includes("tritan")) return "tritanopia";
  return "normal";
};

const BOOST_USES_PER_GAME = 3;
const BOOST_DURATION_MS = 2200;
const PLAY_AREA_WIDTH = SCREEN_WIDTH - 32;

interface ColorStat {
  attempts: number;
  correct: number;
}

export default function SignalRush() {
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const { user } = useAuth();
  const { userData } = useUserData();
  const cvdType = normalizeCvdType(userData?.cvdType || user?.cvdType);
  const scale = getFontSizeMultiplier();

  const [round, setRound] = useState<SignalRound>(() =>
    createSignalRound(1, { cvdType }),
  );
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [timeLeft, setTimeLeft] = useState(round.timeLimit);
  const [feedback, setFeedback] = useState<{ text: string; tone: "neutral" | "good" | "bad" }>({
    text: "Pick the matching color as fast as you can.",
    tone: "neutral",
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [boostRemaining, setBoostRemaining] = useState(BOOST_USES_PER_GAME);
  const [boostActive, setBoostActive] = useState(false);
  const [colorStats, setColorStats] = useState<Record<string, ColorStat>>({});
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const cardAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const colors = useMemo(() => themePalette(darkMode), [darkMode]);

  // Reset per-round state.
  useEffect(() => {
    setTimeLeft(round.timeLimit);
    cardAnim.setValue(0);
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [round, cardAnim]);

  // Refresh when CVD type changes.
  useEffect(() => {
    setRound(createSignalRound(level, { cvdType }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvdType]);

  // Pulsing target swatch.
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  // Countdown.
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = Math.max(0, prev - 0.1);
        if (next <= 0) setIsGameOver(true);
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isGameOver]);

  // Persist last score and cloud profile when signed in.
  useEffect(() => {
    if (!isGameOver) return;
    const accuracy = totalAttempts ? totalCorrect / totalAttempts : 0;
    AsyncStorage.setItem(
      "@signalRushLastScore",
      JSON.stringify({
        score,
        level,
        accuracy,
        at: new Date().toISOString(),
        cvdType,
      }),
    ).catch(() => undefined);
    if (user?.uid && !user.isGuest) {
      recordGameSession(user.uid, "signalRush", {
        score,
        level,
        accuracy,
      }).catch(() => undefined);
    }
  }, [
    isGameOver,
    score,
    level,
    totalAttempts,
    totalCorrect,
    cvdType,
    user?.uid,
    user?.isGuest,
  ]);

  useEffect(() => {
    if (!boostActive) return;
    const timer = setTimeout(() => setBoostActive(false), BOOST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [boostActive]);

  const recordAttempt = useCallback((colorId: string, correct: boolean) => {
    setColorStats((prev) => {
      const current = prev[colorId] || { attempts: 0, correct: 0 };
      return {
        ...prev,
        [colorId]: {
          attempts: current.attempts + 1,
          correct: current.correct + (correct ? 1 : 0),
        },
      };
    });
    setTotalAttempts((a) => a + 1);
    if (correct) setTotalCorrect((c) => c + 1);
  }, []);

  const advanceRound = useCallback(() => {
    setLevel((prev) => {
      const nextLevel = prev + 1;
      setRound(createSignalRound(nextLevel, { cvdType }));
      return nextLevel;
    });
  }, [cvdType]);

  const onSelect = useCallback(
    (light: SignalLight) => {
      if (isGameOver) return;
      const isCorrect = light.color.id === round.target.id;
      recordAttempt(light.color.id, isCorrect);

      if (isCorrect) {
        const award = Math.round(120 * multiplier);
        setScore((prev) => prev + award);
        setStreak((prev) => {
          const next = prev + 1;
          setBestStreak((b) => Math.max(b, next));
          setMultiplier((current) =>
            next % 3 === 0 ? Math.min(current + 1, 5) : current,
          );
          return next;
        });
        setFeedback({
          text: `Correct — ${round.target.name} = ${round.target.meaning}.`,
          tone: "good",
        });
        setTimeout(() => advanceRound(), 300);
      } else {
        setStreak(0);
        setMultiplier(1);
        setTimeLeft((prev) => Math.max(0, prev - 1.5));
        setFeedback({
          text: `That's ${light.color.name}. The target is ${round.target.name}.`,
          tone: "bad",
        });
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -1, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start();
      }
    },
    [advanceRound, isGameOver, multiplier, recordAttempt, round.target, shakeAnim],
  );

  const activateBoost = useCallback(() => {
    if (boostRemaining <= 0 || boostActive || isGameOver) return;
    setBoostRemaining((prev) => prev - 1);
    setBoostActive(true);
    setFeedback({
      text: "Boost on: confusable colors are temporarily enhanced.",
      tone: "neutral",
    });
  }, [boostActive, boostRemaining, isGameOver]);

  const restartGame = () => {
    setLevel(1);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setMultiplier(1);
    setIsGameOver(false);
    setBoostRemaining(BOOST_USES_PER_GAME);
    setBoostActive(false);
    setColorStats({});
    setTotalAttempts(0);
    setTotalCorrect(0);
    setFeedback({
      text: "Pick the matching color as fast as you can.",
      tone: "neutral",
    });
    setRound(createSignalRound(1, { cvdType }));
  };

  // ---- Layout ----
  const lightCount = round.lights.length;
  const lightSize = useMemo(() => {
    const maxPerRow = Math.min(lightCount, 3);
    const candidate = Math.floor((PLAY_AREA_WIDTH - 24 - (maxPerRow + 1) * 10) / maxPerRow);
    return Math.max(86, Math.min(116, candidate));
  }, [lightCount]);

  const accuracyPct =
    totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const timerRatio = round.timeLimit > 0 ? Math.min(1, timeLeft / round.timeLimit) : 0;
  const timerColor = timerRatio > 0.6 ? "#2A9D8F" : timerRatio > 0.3 ? "#F4A261" : "#E63946";

  const cardOpacity = cardAnim;
  const cardTranslate = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  });
  const shakeTranslate = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-8, 8],
  });

  const targetHex = boostActive ? round.target.boostHex : round.target.hex;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={colors.gradient}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.iconBtn, { backgroundColor: colors.glass }]}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={[styles.title, { color: colors.text, fontSize: 20 * scale }]}>
              Signal Rush
            </Text>
            <Text style={[styles.subtitle, { color: colors.subtext }]}>
              {cvdType === "normal" ? "Standard" : `${capitalize(cvdType)} mode`}
            </Text>
          </View>
          <View style={[styles.iconBtn, { backgroundColor: colors.glass }]}>
            <Ionicons name="flash" size={18} color={colors.accent} />
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatChip label="SCORE" value={score.toLocaleString()} colors={colors} />
          <StatChip label="LEVEL" value={String(level)} colors={colors} />
          <StatChip label="STREAK" value={String(streak)} colors={colors} accent={streak >= 3} />
          <StatChip
            label="MULTI"
            value={`x${multiplier}`}
            colors={colors}
            accent={multiplier > 1}
          />
        </View>

        {/* Timer */}
        <View style={styles.timerRow}>
          <View style={[styles.timerTrack, { backgroundColor: colors.glassStrong }]}>
            <Animated.View
              style={[
                styles.timerFill,
                { backgroundColor: timerColor, width: `${timerRatio * 100}%` },
              ]}
            />
          </View>
          <Text style={[styles.timerText, { color: colors.text }]}>
            {timeLeft.toFixed(1)}s
          </Text>
        </View>

        {/* Prompt card */}
        <Animated.View
          style={[
            styles.promptCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: cardOpacity,
              transform: [{ translateY: cardTranslate }, { translateX: shakeTranslate }],
            },
          ]}
        >
          <View style={styles.modePill}>
            <Text style={[styles.modePillText, { color: colors.accent }]}>SIGNAL TARGET</Text>
          </View>
          <View style={styles.promptRow}>
            <Animated.View
              style={[
                styles.targetSwatch,
                {
                  backgroundColor: targetHex,
                  transform: [{ scale: pulseAnim }],
                  shadowColor: targetHex,
                },
              ]}
            >
              <View style={styles.targetSwatchInner} />
            </Animated.View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.promptText, { color: colors.text }]}>
                {round.question}
              </Text>
              <Text style={[styles.promptMeaning, { color: colors.subtext }]}>
                {round.target.meaning}
              </Text>
              <Text style={[styles.feedback, { color: feedbackColor(feedback.tone, colors) }]}>
                {feedback.text}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Signal lights area */}
        <View style={styles.signalsArea}>
          <View style={[styles.signalsBoard, { backgroundColor: colors.boardBg }]}>
            <View
              style={[
                styles.signalsGrid,
                { width: lightSize * Math.min(lightCount, 3) + 10 * (Math.min(lightCount, 3) - 1) },
              ]}
            >
              {round.lights.map((light) => (
                <SignalLightButton
                  key={light.id}
                  light={light}
                  size={lightSize}
                  boostActive={boostActive}
                  onPress={() => onSelect(light)}
                  poleColor={colors.poleColor}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Boost button */}
        <View style={styles.boostRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={boostRemaining <= 0 || boostActive}
            onPress={activateBoost}
            style={[
              styles.boostBtn,
              {
                backgroundColor:
                  boostRemaining <= 0 || boostActive
                    ? colors.glassStrong
                    : colors.accent,
                opacity: boostRemaining <= 0 ? 0.55 : 1,
              },
            ]}
          >
            <Ionicons
              name={boostActive ? "flash" : "flash-outline"}
              size={18}
              color={boostRemaining <= 0 || boostActive ? colors.subtext : "#FFF"}
            />
            <Text
              style={[
                styles.boostText,
                { color: boostRemaining <= 0 || boostActive ? colors.subtext : "#FFF" },
              ]}
            >
              {boostActive
                ? "Boost active"
                : `Daltonize Boost  ·  ${boostRemaining}/${BOOST_USES_PER_GAME}`}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.boostHint, { color: colors.subtext }]}>
            Tap Boost to briefly enhance contrast on confusable colors.
          </Text>
        </View>

        {/* Game over modal */}
        <Modal visible={isGameOver} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
              <LinearGradient
                colors={[colors.accent, colors.accentAlt]}
                style={styles.modalHero}
              >
                <Ionicons name="trophy" size={36} color="#FFF" />
                <Text style={styles.modalTitle}>Round Over</Text>
                <Text style={styles.modalScore}>{score.toLocaleString()}</Text>
                <Text style={styles.modalScoreLabel}>FINAL SCORE</Text>
              </LinearGradient>

              <View style={styles.modalBody}>
                <View style={styles.summaryRow}>
                  <SummaryStat label="Level" value={String(level)} />
                  <SummaryStat label="Accuracy" value={`${accuracyPct}%`} />
                  <SummaryStat label="Best streak" value={String(bestStreak)} />
                </View>

                {totalAttempts > 0 && (
                  <View style={styles.insightCard}>
                    <Text style={[styles.insightTitle, { color: colors.text }]}>
                      Confusable pairs to practise
                    </Text>
                    {describeConfusionPairs(cvdType).map((pair) => (
                      <Text
                        key={pair}
                        style={[styles.insightText, { color: colors.subtext }]}
                      >
                        • {pair}
                      </Text>
                    ))}
                    {worstColor(colorStats) && (
                      <Text style={[styles.insightTip, { color: colors.text }]}>
                        Tip: you missed {worstColor(colorStats)?.name} most. Try the
                        Boost on its next appearance to learn its specific brightness.
                      </Text>
                    )}
                  </View>
                )}

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.secondaryBtn, { borderColor: colors.border }]}
                  >
                    <Text style={[styles.secondaryBtnText, { color: colors.text }]}>
                      Exit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={restartGame} style={styles.primaryBtnWrap}>
                    <LinearGradient
                      colors={[colors.accent, colors.accentAlt]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.primaryBtn}
                    >
                      <Ionicons name="refresh" size={18} color="#FFF" />
                      <Text style={styles.primaryBtnText}>Play again</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

// ---------- Subcomponents ----------

function SignalLightButton({
  light,
  size,
  boostActive,
  onPress,
  poleColor,
}: {
  light: SignalLight;
  size: number;
  boostActive: boolean;
  onPress: () => void;
  poleColor: string;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 1100,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [glowAnim]);

  const hex = boostActive ? light.color.boostHex : light.color.hex;

  return (
    <View style={{ width: size, alignItems: "center" }}>
      <Animated.View
        style={[
          signalStyles.bulbWrap,
          {
            width: size,
            height: size,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Pressable
          onPressIn={() =>
            Animated.timing(scaleAnim, {
              toValue: 0.93,
              duration: 80,
              useNativeDriver: true,
            }).start()
          }
          onPressOut={() =>
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 120,
              useNativeDriver: true,
            }).start()
          }
          onPress={onPress}
          style={[
            signalStyles.bulb,
            {
              backgroundColor: hex,
              shadowColor: hex,
              opacity: 1,
            },
          ]}
        >
          <Animated.View
            style={[
              signalStyles.bulbGlow,
              {
                backgroundColor: hex,
                opacity: glowAnim,
              },
            ]}
          />
          <View style={signalStyles.bulbHighlight} />
        </Pressable>
      </Animated.View>
      <View style={[signalStyles.pole, { backgroundColor: poleColor }]} />
      <View style={[signalStyles.poleBase, { backgroundColor: poleColor }]} />
    </View>
  );
}

function StatChip({
  label,
  value,
  colors,
  accent,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof themePalette>;
  accent?: boolean;
}) {
  return (
    <View
      style={[
        styles.statChip,
        {
          backgroundColor: colors.surface,
          borderColor: accent ? colors.accent : colors.border,
        },
      ]}
    >
      <Text style={[styles.statChipLabel, { color: colors.subtext }]}>{label}</Text>
      <Text
        style={[
          styles.statChipValue,
          { color: accent ? colors.accent : colors.text },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryStat}>
      <Text style={styles.summaryStatValue}>{value}</Text>
      <Text style={styles.summaryStatLabel}>{label}</Text>
    </View>
  );
}

// ---------- Helpers ----------

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const feedbackColor = (
  tone: "neutral" | "good" | "bad",
  colors: ReturnType<typeof themePalette>,
) => {
  if (tone === "good") return colors.success;
  if (tone === "bad") return colors.danger;
  return colors.subtext;
};

type WorstColor = { id: string; name: string; rate: number };

const worstColor = (stats: Record<string, ColorStat>): WorstColor | null => {
  let worst: WorstColor | null = null;
  for (const [id, s] of Object.entries(stats)) {
    if (s.attempts < 2) continue;
    const rate = s.correct / s.attempts;
    if (worst === null || rate < worst.rate) {
      worst = { id, name: capitalize(id), rate };
    }
  }
  return worst;
};

const themePalette = (darkMode: boolean) => {
  if (darkMode) {
    return {
      background: "#0A0F1E",
      gradient: ["#0A0F1E", "#1B1F3A"] as const,
      surface: "rgba(255,255,255,0.06)",
      glass: "rgba(255,255,255,0.08)",
      glassStrong: "rgba(255,255,255,0.14)",
      border: "rgba(255,255,255,0.12)",
      text: "#F8FAFC",
      subtext: "#9CA3AF",
      accent: "#F59E0B",
      accentAlt: "#D97706",
      success: "#22C55E",
      danger: "#F87171",
      boardBg: "rgba(0,0,0,0.35)",
      poleColor: "rgba(255,255,255,0.25)",
    };
  }
  return {
    background: "#F1F5F9",
    gradient: ["#F8FAFC", "#DCE3EC"] as const,
    surface: "#FFFFFF",
    glass: "rgba(255,255,255,0.7)",
    glassStrong: "rgba(15,23,42,0.08)",
    border: "rgba(15,23,42,0.08)",
    text: "#1F2937",
    subtext: "#64748B",
    accent: "#F97316",
    accentAlt: "#C2410C",
    success: "#15803D",
    danger: "#B91C1C",
    boardBg: "rgba(15,23,42,0.06)",
    poleColor: "#94A3B8",
  };
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 12,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontWeight: "800", letterSpacing: 0.4 },
  subtitle: { fontSize: 11, marginTop: 2, letterSpacing: 0.8 },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  statChip: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  statChipLabel: { fontSize: 9, letterSpacing: 1.2, fontWeight: "700" },
  statChipValue: { fontSize: 16, fontWeight: "800", marginTop: 2 },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  timerTrack: { flex: 1, height: 10, borderRadius: 999, overflow: "hidden" },
  timerFill: { height: "100%", borderRadius: 999 },
  timerText: { fontWeight: "800", minWidth: 50, textAlign: "right" },
  promptCard: {
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  modePill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(249,115,22,0.15)",
    marginBottom: 10,
  },
  modePillText: { fontWeight: "800", fontSize: 10, letterSpacing: 1.4 },
  promptRow: { flexDirection: "row", alignItems: "center" },
  targetSwatch: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 6,
  },
  targetSwatchInner: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 18,
    height: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  promptText: { fontSize: 17, fontWeight: "800" },
  promptMeaning: { fontSize: 12, marginTop: 2, fontWeight: "600" },
  feedback: { marginTop: 6, fontSize: 12, fontWeight: "600" },
  signalsArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  signalsBoard: {
    borderRadius: 24,
    padding: 16,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  signalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  boostRow: { marginTop: 10, marginBottom: 4 },
  boostBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    gap: 8,
  },
  boostText: { fontWeight: "800", letterSpacing: 0.4 },
  boostHint: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.55)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
  modalHero: {
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  modalTitle: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 1.4,
    marginTop: 8,
  },
  modalScore: {
    color: "#FFF",
    fontSize: 44,
    fontWeight: "900",
    marginTop: 6,
  },
  modalScoreLabel: {
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 1.6,
    fontWeight: "700",
    fontSize: 10,
    marginTop: 2,
  },
  modalBody: { padding: 18 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 14,
  },
  summaryStat: { alignItems: "center", flex: 1 },
  summaryStatValue: { fontSize: 22, fontWeight: "900", color: "#1F2937" },
  summaryStatLabel: {
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: "700",
    color: "#6B7280",
    marginTop: 2,
  },
  insightCard: {
    backgroundColor: "rgba(249,115,22,0.12)",
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
  },
  insightTitle: { fontWeight: "800", marginBottom: 6 },
  insightText: { fontSize: 12, lineHeight: 18 },
  insightTip: { marginTop: 8, fontSize: 12, fontWeight: "600", lineHeight: 18 },
  modalActions: { flexDirection: "row", gap: 10 },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
  },
  secondaryBtnText: { fontWeight: "800" },
  primaryBtnWrap: { flex: 1.4 },
  primaryBtn: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  primaryBtnText: { color: "#FFF", fontWeight: "800", letterSpacing: 0.4 },
});

const signalStyles = StyleSheet.create({
  bulbWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  bulb: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.6,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
    borderWidth: 4,
    borderColor: "rgba(15,23,42,0.25)",
    overflow: "hidden",
  },
  bulbGlow: {
    position: "absolute",
    top: "-25%",
    left: "-25%",
    width: "150%",
    height: "150%",
    borderRadius: 999,
    opacity: 0.55,
  },
  bulbHighlight: {
    position: "absolute",
    top: "12%",
    left: "18%",
    width: "30%",
    height: "20%",
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 999,
  },
  pole: {
    width: 6,
    height: 18,
    marginTop: 2,
    borderRadius: 3,
  },
  poleBase: {
    width: 28,
    height: 6,
    borderRadius: 3,
  },
});
