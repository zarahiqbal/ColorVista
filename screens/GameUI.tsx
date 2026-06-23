import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { ComponentProps } from "react";
import { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { GameProgressDoc, UserGamesDoc } from "@/Context/userProfileFirestore";
import { useAuth } from "@/Context/AuthContext";
import { useUserData } from "@/Context/useUserData";
import { isNormalVision } from "@/constants/cvdUtils";
import { insightLine, pctAccuracy } from "@/utils/gameProgressInsights";
import { useRouter } from "expo-router";
import { useTheme } from "../Context/ThemeContext";

interface GameUIProps {
  onSelect: (difficulty: "easy" | "hard") => void;
}

function GameStatBlock({
  title,
  icon,
  progress,
  textColor,
  subColor,
  mult,
}: {
  title: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  progress: GameProgressDoc | undefined;
  textColor: string;
  subColor: string;
  mult: number;
}) {
  if (!progress || progress.gamesPlayed === 0) {
    return (
      <View style={styles.statBlock}>
        <View style={styles.statBlockHeader}>
          <Ionicons name={icon} size={18} color={subColor} />
          <Text style={[styles.statBlockTitle, { color: textColor, fontSize: 13 * mult }]}>
            {title}
          </Text>
        </View>
        <Text style={[styles.statEmpty, { color: subColor, fontSize: 12 * mult }]}>
          Play a full round to record your best score, level, and accuracy trends.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.statBlock}>
      <View style={styles.statBlockHeader}>
        <Ionicons name={icon} size={18} color={subColor} />
        <Text style={[styles.statBlockTitle, { color: textColor, fontSize: 13 * mult }]}>
          {title}
        </Text>
      </View>
      <Text style={[styles.statLine, { color: textColor, fontSize: 13 * mult }]}>
        Best {progress.bestScore.toLocaleString()} · Level {progress.highLevel} ·{" "}
        {progress.gamesPlayed} games · Avg {pctAccuracy(progress.avgAccuracy)}
      </Text>
      <Text style={[styles.statSub, { color: subColor, fontSize: 12 * mult }]}>
        Last run {pctAccuracy(progress.lastAccuracy)} accuracy
      </Text>
      <Text style={[styles.statInsight, { color: subColor, fontSize: 11 * mult }]}>
        {insightLine(progress)}
      </Text>
    </View>
  );
}

export default function GameTypeUI({ onSelect }: GameUIProps) {
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const { user } = useAuth();
  const { userData } = useUserData();
  const router = useRouter();
  const cvdType = userData?.cvdType || user?.cvdType;
  const isNormal = isNormalVision(cvdType);
  const multiplier = getFontSizeMultiplier();

  const games = (userData?.games ?? undefined) as UserGamesDoc | undefined;
  const hasAnyStats =
    (games?.colorDetective?.gamesPlayed ?? 0) > 0 ||
    (games?.signalRush?.gamesPlayed ?? 0) > 0;

  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [floatAnim, fadeAnim]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  const themeStyles = {
    backgroundColors: darkMode
      ? (["#1A1A1A", "#2A2A2A"] as const)
      : (["#F6F3EE", "#E8DFD4"] as const),
    textColor: darkMode ? "#F6F3EE" : "#2F2F2F",
    subText: darkMode ? "#A1A1AA" : "#6B6661",
    heroCircleBg: darkMode
      ? "rgba(141, 163, 153, 0.18)"
      : "rgba(255, 255, 255, 0.65)",
    panelBg: darkMode ? "rgba(44, 44, 46, 0.92)" : "rgba(255, 255, 255, 0.88)",
    panelBorder: darkMode ? "#3A3A3C" : "rgba(170, 149, 123, 0.45)",
  };

  if (isNormal) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={themeStyles.backgroundColors}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.content}>
          <View
            style={[
              styles.lockedCard,
              {
                backgroundColor: themeStyles.panelBg,
                borderColor: themeStyles.panelBorder,
              },
            ]}
          >
            <View style={styles.lockedIconWrap}>
              <Ionicons name="lock-closed" size={36} color="#8DA399" />
            </View>
            <Text style={[styles.lockedTitle, { color: themeStyles.textColor }]}>
              Unlock games
            </Text>
            <Text style={[styles.lockedText, { color: themeStyles.subText }]}>
              Take the quiz so we can tailor Color Detective and Signal Rush to your
              vision profile.
            </Text>
            <TouchableOpacity
              style={styles.lockedButton}
              onPress={() => router.push("/welcome")}
              activeOpacity={0.85}
            >
              <Text style={styles.lockedButtonText}>Take quiz</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={themeStyles.backgroundColors}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <View
              style={[
                styles.heroCircle,
                { backgroundColor: themeStyles.heroCircleBg },
              ]}
            >
              <Animated.Image
                source={require("../assets/images/gamelogo.png")}
                style={[styles.logoImage, { transform: [{ translateY }] }]}
                resizeMode="contain"
              />
            </View>
            <Text
              style={[
                styles.title,
                { fontSize: 22 * multiplier, color: themeStyles.textColor },
              ]}
            >
              CHOOSE CHALLENGE
            </Text>
            <Text
              style={[
                styles.subtitle,
                { fontSize: 13 * multiplier, color: themeStyles.subText },
              ]}
            >
              Train color discrimination at your pace
            </Text>
          </Animated.View>

          {!user?.isGuest && (
            <View
              style={[
                styles.progressPanel,
                {
                  backgroundColor: themeStyles.panelBg,
                  borderColor: themeStyles.panelBorder,
                },
              ]}
            >
              <View style={styles.progressPanelTitleRow}>
                <Ionicons name="stats-chart" size={18} color="#8DA399" />
                <Text
                  style={[
                    styles.progressPanelTitle,
                    { color: themeStyles.textColor, fontSize: 13 * multiplier },
                  ]}
                >
                  YOUR PROGRESS
                </Text>
              </View>
              {!hasAnyStats ? (
                <Text
                  style={[
                    styles.statEmpty,
                    { color: themeStyles.subText, fontSize: 12 * multiplier },
                  ]}
                >
                  Finish a timed round — we sync best score, level, and accuracy so you
                  can see improvement over time.
                </Text>
              ) : null}
              <GameStatBlock
                title="Color Detective"
                icon="search"
                progress={games?.colorDetective}
                textColor={themeStyles.textColor}
                subColor={themeStyles.subText}
                mult={multiplier}
              />
              <View style={[styles.statDivider, { backgroundColor: themeStyles.panelBorder }]} />
              <GameStatBlock
                title="Signal Rush"
                icon="flash"
                progress={games?.signalRush}
                textColor={themeStyles.textColor}
                subColor={themeStyles.subText}
                mult={multiplier}
              />
            </View>
          )}

          <View style={styles.cardContainer}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onSelect("easy")}
              style={styles.cardTouch}
            >
              <LinearGradient colors={["#A8C4A2", "#6F9A6A"]} style={styles.card}>
                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>START</Text>
                </View>
                <Animated.Image
                  source={require("../assets/images/easy.png")}
                  style={[styles.cardImage, { transform: [{ translateY }] }]}
                  resizeMode="contain"
                />
                <View style={styles.textColumn}>
                  <Text style={[styles.cardLabel, { fontSize: 22 * multiplier }]}>
                    EASY
                  </Text>
                  <Text style={[styles.cardDesc, { fontSize: 13 * multiplier }]}>
                    Relaxed timing — build confidence in Color Detective.
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onSelect("hard")}
              style={styles.cardTouch}
            >
              <LinearGradient colors={["#4A5C3A", "#2F3D28"]} style={styles.card}>
                <View style={[styles.cardBadge, styles.cardBadgeHard]}>
                  <Text style={styles.cardBadgeText}>START</Text>
                </View>
                <Animated.Image
                  source={require("../assets/images/hard.png")}
                  style={[styles.cardImage, { transform: [{ translateY }] }]}
                  resizeMode="contain"
                />
                <View style={styles.textColumn}>
                  <Text style={[styles.cardLabel, { fontSize: 22 * multiplier }]}>
                    HARD
                  </Text>
                  <Text style={[styles.cardDesc, { fontSize: 13 * multiplier }]}>
                    Tighter timers and tougher contrast for a real challenge.
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 22 },
  scrollContent: {
    paddingBottom: 36,
    flexGrow: 1,
  },
  header: { alignItems: "center", marginBottom: 20 },
  heroCircle: {
    width: 148,
    height: 148,
    borderRadius: 74,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  logoImage: { width: 108, height: 108 },
  title: {
    fontWeight: "900",
    letterSpacing: 1.5,
    marginTop: 18,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 6,
    textAlign: "center",
    paddingHorizontal: 12,
  },
  progressPanel: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  progressPanelTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  progressPanelTitle: {
    fontWeight: "800",
    letterSpacing: 1,
  },
  statBlock: { marginTop: 4 },
  statBlockHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  statBlockTitle: { fontWeight: "700" },
  statLine: { fontWeight: "600", marginBottom: 4 },
  statSub: { marginBottom: 6 },
  statInsight: { lineHeight: 16, fontStyle: "italic" },
  statEmpty: { lineHeight: 18 },
  statDivider: { height: 1, marginVertical: 12 },
  cardContainer: { width: "100%", gap: 18 },
  cardTouch: { width: "100%" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 26,
    minHeight: 132,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 12,
    position: "relative",
    overflow: "hidden",
  },
  cardBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  cardBadgeHard: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  cardBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  cardImage: { width: 76, height: 76, marginRight: 14 },
  textColumn: { flex: 1 },
  cardLabel: {
    fontWeight: "900",
    color: "#FFF",
    marginBottom: 4,
  },
  cardDesc: { color: "rgba(255,255,255,0.92)", lineHeight: 19 },
  lockedCard: {
    marginTop: 48,
    borderRadius: 24,
    padding: 26,
    alignItems: "center",
    borderWidth: 1,
    maxWidth: 360,
    alignSelf: "center",
    width: "100%",
  },
  lockedIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(141, 163, 153, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  lockedTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
  },
  lockedText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 21,
  },
  lockedButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    backgroundColor: "#2F2F2F",
  },
  lockedButtonText: {
    color: "#FFF",
    fontWeight: "700",
    letterSpacing: 0.4,
    fontSize: 15,
  },
});
