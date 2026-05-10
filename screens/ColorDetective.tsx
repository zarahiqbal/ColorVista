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
  createDetectiveRound,
  CvdType,
  DetectiveColor,
  DetectiveRound,
  DetectiveTile,
  describeConfusionPairs,
} from "../constants/colorDetective";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
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

const TILE_GAP = 10;
const MAX_GRID_WIDTH = SCREEN_WIDTH - 40;

const BOOST_USES_PER_GAME = 3;
const BOOST_DURATION_MS = 2500;

interface ColorStat {
  attempts: number;
  correct: number;
}

export default function ColorDetective() {
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const { user } = useAuth();
  const { userData } = useUserData();
  const cvdType = normalizeCvdType(userData?.cvdType || user?.cvdType);
  const scale = getFontSizeMultiplier();

  const [round, setRound] = useState<DetectiveRound>(() =>
    createDetectiveRound(1, { cvdType }),
  );
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [timeLeft, setTimeLeft] = useState(round.timeLimit);
  const [feedback, setFeedback] = useState<{ text: string; tone: "neutral" | "good" | "bad" }>({
    text: "Find every tile that matches the target color.",
    tone: "neutral",
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [boostRemaining, setBoostRemaining] = useState(BOOST_USES_PER_GAME);
  const [boostActive, setBoostActive] = useState(false);
  const [colorStats, setColorStats] = useState<Record<string, ColorStat>>({});
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const cardAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const colors = useMemo(() => themePalette(darkMode), [darkMode]);

  // --- New round side-effects ---
  useEffect(() => {
    setTimeLeft(round.timeLimit);
    setFoundIds([]);
    cardAnim.setValue(0);
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [round, cardAnim]);

  // Re-roll the round whenever CVD type changes so the distractor pool
  // tracks the user's actual confusion families.
  useEffect(() => {
    setRound(createDetectiveRound(level, { cvdType }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvdType]);

  // Pulse the target swatch so the user's eye is drawn to it.
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  // Countdown timer.
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

  // Persist last score for the home screen.
  useEffect(() => {
    if (!isGameOver) return;
    AsyncStorage.setItem(
      "@colorDetectiveLastScore",
      JSON.stringify({
        score,
        level,
        accuracy: totalAttempts ? totalCorrect / totalAttempts : 0,
        at: new Date().toISOString(),
        cvdType,
      }),
    ).catch(() => undefined);
  }, [isGameOver, score, level, totalAttempts, totalCorrect, cvdType]);

  // Auto-time-out the boost.
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
    setTotalAttempts((prev) => prev + 1);
    if (correct) setTotalCorrect((prev) => prev + 1);
  }, []);

  const advanceRound = useCallback(() => {
    setLevel((prev) => {
      const nextLevel = prev + 1;
      setRound(createDetectiveRound(nextLevel, { cvdType }));
      return nextLevel;
    });
  }, [cvdType]);

  const onCorrect = useCallback(
    (delta = 100) => {
      const award = Math.round(delta * multiplier);
      setScore((prev) => prev + award);
      setStreak((prev) => {
        const next = prev + 1;
        setBestStreak((b) => Math.max(b, next));
        setMultiplier((current) =>
          next % 3 === 0 ? Math.min(current + 1, 5) : current,
        );
        return next;
      });
    },
    [multiplier],
  );

  const onMistake = useCallback(() => {
    setStreak(0);
    setMultiplier(1);
    setTimeLeft((prev) => Math.max(0, prev - 1.5));
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -1,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeAnim]);

  // --- MATCH MODE: tap matching tiles ---
  const handleTilePress = useCallback(
    (tile: DetectiveTile) => {
      if (isGameOver || round.mode !== "match") return;
      if (foundIds.includes(tile.id)) return;
      const isMatch = round.matchingTileIds.includes(tile.id);
      recordAttempt(tile.color.id, isMatch);
      if (isMatch) {
        const newFound = [...foundIds, tile.id];
        setFoundIds(newFound);
        onCorrect(60);
        setFeedback({
          text: `Yes! That's ${round.target.name}.`,
          tone: "good",
        });
        if (newFound.length >= round.matchingTileIds.length) {
          setTimeout(() => {
            setFeedback({
              text: `${round.target.name} cleared — ${round.target.name} is often used for ${roleHint(round.target)}.`,
              tone: "good",
            });
            advanceRound();
          }, 350);
        }
      } else {
        onMistake();
        setFeedback({
          text: `That's ${tile.color.name}, not ${round.target.name}. Keep looking.`,
          tone: "bad",
        });
      }
    },
    [
      advanceRound,
      foundIds,
      isGameOver,
      onCorrect,
      onMistake,
      recordAttempt,
      round.matchingTileIds,
      round.mode,
      round.target,
    ],
  );

  // --- NAME MODE: tap the correct color name ---
  const handleNamePress = useCallback(
    (option: DetectiveColor) => {
      if (isGameOver || round.mode !== "name") return;
      const isMatch = option.id === round.target.id;
      recordAttempt(option.id, isMatch);
      if (isMatch) {
        onCorrect(120);
        setFeedback({
          text: `Correct! That's ${round.target.name}.`,
          tone: "good",
        });
        setTimeout(() => advanceRound(), 350);
      } else {
        onMistake();
        setFeedback({
          text: `That swatch is ${round.target.name}, not ${option.name}.`,
          tone: "bad",
        });
      }
    },
    [advanceRound, isGameOver, onCorrect, onMistake, recordAttempt, round.mode, round.target],
  );

  const activateBoost = useCallback(() => {
    if (boostRemaining <= 0 || boostActive || isGameOver) return;
    setBoostRemaining((prev) => prev - 1);
    setBoostActive(true);
    setFeedback({
      text: "Boost on: colors are temporarily enhanced.",
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
    setFoundIds([]);
    setBoostRemaining(BOOST_USES_PER_GAME);
    setBoostActive(false);
    setColorStats({});
    setTotalAttempts(0);
    setTotalCorrect(0);
    setFeedback({
      text: "Find every tile that matches the target color.",
      tone: "neutral",
    });
    setRound(createDetectiveRound(1, { cvdType }));
  };

  // Grid layout for match mode.
  const grid = useMemo(() => {
    const count = round.tiles.length;
    const columns = count <= 6 ? 3 : count <= 9 ? 3 : 4;
    const rows = Math.ceil(count / columns);
    const tileSize = Math.floor((MAX_GRID_WIDTH - TILE_GAP * (columns + 1)) / columns);
    return { columns, rows, tileSize };
  }, [round.tiles.length]);

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
              Color Detective
            </Text>
            <Text style={[styles.subtitle, { color: colors.subtext }]}>
              {cvdType === "normal" ? "Standard" : `${capitalize(cvdType)} mode`}
            </Text>
          </View>
          <View style={[styles.iconBtn, { backgroundColor: colors.glass }]}>
            <Ionicons name="trophy" size={18} color={colors.accent} />
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatChip label="SCORE" value={score.toLocaleString()} colors={colors} />
          <StatChip label="LEVEL" value={String(level)} colors={colors} />
          <StatChip label="STREAK" value={String(streak)} colors={colors} accent={streak >= 3} />
          <StatChip label="MULTI" value={`x${multiplier}`} colors={colors} accent={multiplier > 1} />
        </View>

        {/* Timer */}
        <View style={styles.timerRow}>
          <View style={[styles.timerTrack, { backgroundColor: colors.glassStrong }]}>
            <Animated.View
              style={[
                styles.timerFill,
                {
                  backgroundColor: timerColor,
                  width: `${timerRatio * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.timerText, { color: colors.text }]}>
            {timeLeft.toFixed(1)}s
          </Text>
        </View>

        {/* Mode card */}
        <Animated.View
          style={[
            styles.modeCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: cardOpacity,
              transform: [{ translateY: cardTranslate }, { translateX: shakeTranslate }],
            },
          ]}
        >
          <View style={styles.modePill}>
            <Text style={[styles.modePillText, { color: colors.accent }]}>
              {round.mode === "match" ? "FIND THE MATCH" : "NAME THAT COLOR"}
            </Text>
          </View>

          <View style={styles.targetRow}>
            <Animated.View
              style={[
                styles.targetSwatch,
                {
                  backgroundColor: targetHex,
                  transform: [{ scale: pulseAnim }],
                  shadowColor: targetHex,
                },
              ]}
            />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.targetLabel, { color: colors.subtext }]}>TARGET</Text>
              {round.mode === "match" ? (
                <Text style={[styles.targetName, { color: colors.text }]}>
                  Find every {round.target.name}
                </Text>
              ) : (
                <Text style={[styles.targetName, { color: colors.text }]}>
                  What color is this?
                </Text>
              )}
              <Text style={[styles.feedback, { color: feedbackColor(feedback.tone, colors) }]}>
                {feedback.text}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Play surface */}
        <View style={{ flex: 1, justifyContent: "center" }}>
          {round.mode === "match" ? (
            <View
              style={[
                styles.grid,
                {
                  width: grid.columns * grid.tileSize + (grid.columns + 1) * TILE_GAP,
                  alignSelf: "center",
                },
              ]}
            >
              {round.tiles.map((tile) => {
                const isFound = foundIds.includes(tile.id);
                const displayHex = boostActive ? tile.color.boostHex : tile.color.hex;
                return (
                  <TileButton
                    key={tile.id}
                    tile={tile}
                    displayHex={displayHex}
                    size={grid.tileSize}
                    found={isFound}
                    onPress={() => handleTilePress(tile)}
                    surface={colors.surface}
                  />
                );
              })}
            </View>
          ) : (
            <View style={styles.namingArea}>
              <Animated.View
                style={[
                  styles.bigSwatch,
                  {
                    backgroundColor: targetHex,
                    shadowColor: targetHex,
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              />
              <View style={styles.namingOptions}>
                {round.nameOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    activeOpacity={0.85}
                    style={[
                      styles.nameOption,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => handleNamePress(option)}
                  >
                    <View
                      style={[
                        styles.nameOptionDot,
                        { backgroundColor: boostActive ? option.boostHex : option.hex },
                      ]}
                    />
                    <Text style={[styles.nameOptionText, { color: colors.text }]}>
                      {option.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
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
                {
                  color:
                    boostRemaining <= 0 || boostActive ? colors.subtext : "#FFF",
                },
              ]}
            >
              {boostActive
                ? "Boost active"
                : `Daltonize Boost  ·  ${boostRemaining}/${BOOST_USES_PER_GAME}`}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.boostHint, { color: colors.subtext }]}>
            Boost briefly enhances confusable colors so you can learn the difference.
          </Text>
        </View>

        {/* Game-over modal */}
        <Modal visible={isGameOver} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
              <LinearGradient
                colors={[colors.accent, colors.accentAlt]}
                style={styles.modalHero}
              >
                <Ionicons name="ribbon" size={36} color="#FFF" />
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
                      Your trouble pairs
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
                        Tip: you missed {worstColor(colorStats)?.name} most. Look for
                        its brightness, not just its hue.
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
                  <TouchableOpacity
                    onPress={restartGame}
                    style={styles.primaryBtnWrap}
                  >
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

// ---------- Small presentational helpers ----------

function TileButton({
  tile,
  displayHex,
  size,
  found,
  onPress,
  surface,
}: {
  tile: DetectiveTile;
  displayHex: string;
  size: number;
  found: boolean;
  onPress: () => void;
  surface: string;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handleIn = () =>
    Animated.timing(scaleAnim, {
      toValue: 0.94,
      duration: 90,
      useNativeDriver: true,
    }).start();
  const handleOut = () =>
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();

  const radius = tile.shape === "circle" ? size / 2 : tile.shape === "rounded" ? 18 : 10;

  return (
    <Animated.View
      style={[
        styles.tileWrap,
        {
          width: size,
          height: size,
          margin: TILE_GAP / 2,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handleIn}
        onPressOut={handleOut}
        style={[
          styles.tile,
          {
            backgroundColor: displayHex,
            borderRadius: radius,
            shadowColor: displayHex,
          },
        ]}
      >
        {found && (
          <View style={[styles.tileCheck, { backgroundColor: surface }]}>
            <Ionicons name="checkmark" size={18} color={displayHex} />
          </View>
        )}
      </Pressable>
    </Animated.View>
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

const roleHint = (color: DetectiveColor): string => {
  switch (color.family) {
    case "red":
      return "warnings and stop signals";
    case "orange":
      return "caution and warm light";
    case "yellow":
      return "warnings and bright sunlight";
    case "green":
      return "safety, go signals and nature";
    case "teal":
      return "info and water signs";
    case "blue":
      return "info, mandatory signs and the sky";
    case "purple":
      return "special hazards and royalty";
    case "pink":
      return "construction and temporary markers";
    case "brown":
      return "wood, earth and recreation signs";
    default:
      return "neutral or background tones";
  }
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
      background: "#0B0F1A",
      gradient: ["#0B0F1A", "#161C2C"] as const,
      surface: "rgba(255,255,255,0.06)",
      glass: "rgba(255,255,255,0.08)",
      glassStrong: "rgba(255,255,255,0.14)",
      border: "rgba(255,255,255,0.12)",
      text: "#F8FAFC",
      subtext: "#9CA3AF",
      accent: "#7B9A86",
      accentAlt: "#3A7D6E",
      success: "#22C55E",
      danger: "#F87171",
    };
  }
  return {
    background: "#F6F3EE",
    gradient: ["#FDFCFB", "#E9DDD0"] as const,
    surface: "#FFFFFF",
    glass: "rgba(255,255,255,0.7)",
    glassStrong: "rgba(15,23,42,0.08)",
    border: "rgba(15,23,42,0.08)",
    text: "#1F2937",
    subtext: "#6B6A66",
    accent: "#7B9A86",
    accentAlt: "#3A7D6E",
    success: "#15803D",
    danger: "#B91C1C",
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
  statChipLabel: {
    fontSize: 9,
    letterSpacing: 1.2,
    fontWeight: "700",
  },
  statChipValue: { fontSize: 16, fontWeight: "800", marginTop: 2 },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  timerTrack: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
  },
  timerFill: { height: "100%", borderRadius: 999 },
  timerText: { fontWeight: "800", minWidth: 50, textAlign: "right" },
  modeCard: {
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
    backgroundColor: "rgba(123, 154, 134, 0.15)",
    marginBottom: 10,
  },
  modePillText: { fontWeight: "800", fontSize: 10, letterSpacing: 1.4 },
  targetRow: { flexDirection: "row", alignItems: "center" },
  targetSwatch: {
    width: 56,
    height: 56,
    borderRadius: 16,
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 4,
  },
  targetLabel: {
    fontSize: 10,
    letterSpacing: 1.4,
    fontWeight: "700",
    marginBottom: 2,
  },
  targetName: { fontSize: 17, fontWeight: "800" },
  feedback: { marginTop: 4, fontSize: 12, fontWeight: "600" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  tileWrap: { alignItems: "center", justifyContent: "center" },
  tile: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 3,
  },
  tileCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  namingArea: { alignItems: "center", paddingHorizontal: 8 },
  bigSwatch: {
    width: 180,
    height: 180,
    borderRadius: 28,
    marginBottom: 24,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 8,
  },
  namingOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  nameOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
    minWidth: 130,
  },
  nameOptionDot: { width: 18, height: 18, borderRadius: 9 },
  nameOptionText: { fontWeight: "700", fontSize: 14 },
  boostRow: { marginTop: 12, marginBottom: 4 },
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
    backgroundColor: "rgba(123,154,134,0.12)",
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
