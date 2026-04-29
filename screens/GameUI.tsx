import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Import the theme hook
import { useTheme } from "../Context/ThemeContext";

const { width } = Dimensions.get("window");

interface GameUIProps {
  onSelect: (difficulty: "easy" | "hard") => void;
}

export default function GameTypeUI({ onSelect }: GameUIProps) {
  // 1. Consume Theme Context
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const multiplier = getFontSizeMultiplier();

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
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  // 2. Define Dynamic Styles
  const themeStyles = {
    backgroundColors: darkMode
      ? (["#1A1A1A", "#2D2D2D"] as const)
      : (["#FDFCFB", "#E2D1C3"] as const),
    textColor: darkMode ? "#FFFFFF" : "#333331",
    backBtnBg: darkMode
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(255, 255, 255, 0.5)",
    backBtnIcon: darkMode ? "#FFF" : "#333",
    heroCircleBg: darkMode
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(255, 255, 255, 0.4)",
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={themeStyles.backgroundColors}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.content}>
        <View style={styles.topNav}>
          <TouchableOpacity
            style={[
              styles.backButton,
              { backgroundColor: themeStyles.backBtnBg },
            ]}
            onPress={() => router.replace("/dashboard")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={themeStyles.backBtnIcon}
            />
          </TouchableOpacity>
        </View>

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
              { fontSize: 24 * multiplier, color: themeStyles.textColor },
            ]}
          >
            CHOOSE CHALLENGE
          </Text>
        </Animated.View>

        <View style={styles.cardContainer}>
          {/* EASY CARD */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onSelect("easy")}
            style={styles.cardTouch}
          >
            <LinearGradient colors={["#A8C4A2", "#7FA87A"]} style={styles.card}>
              <Animated.Image
                source={require("../assets/images/easy.png")}
                style={[styles.cardImage, { transform: [{ translateY }] }]}
                resizeMode="contain"
              />
              <View style={styles.textColumn}>
                <Text style={[styles.cardLabel, { fontSize: 24 * multiplier }]}>
                  EASY
                </Text>
                <Text style={[styles.cardDesc, { fontSize: 14 * multiplier }]}>
                  Download and play Spectrum Shifter (Unity) on Android.
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* HARD CARD */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onSelect("hard")}
            style={styles.cardTouch}
          >
            <LinearGradient colors={["#4A5C3A", "#36452A"]} style={styles.card}>
              <Animated.Image
                source={require("../assets/images/hard.png")}
                style={[styles.cardImage, { transform: [{ translateY }] }]}
                resizeMode="contain"
              />
              <View style={styles.textColumn}>
                <Text style={[styles.cardLabel, { fontSize: 24 * multiplier }]}>
                  HARD
                </Text>
                <Text style={[styles.cardDesc, { fontSize: 14 * multiplier }]}>
                  Complex, low-contrast designs for the ultimate test.
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 25 },
  topNav: {
    width: "100%",
    paddingVertical: 10,
    marginBottom: 10,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  header: { alignItems: "center", marginBottom: 50 },
  heroCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  logoImage: { width: 120, height: 120 },
  title: {
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 25,
    textAlign: "center",
  },
  cardContainer: { width: "100%", gap: 20 },
  cardTouch: { width: "100%" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 30,
    minHeight: 140,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  cardImage: { width: 80, height: 80, marginRight: 15 },
  textColumn: { flex: 1 },
  cardLabel: {
    fontWeight: "900",
    color: "#FFF",
    marginBottom: 5,
  },
  cardDesc: { color: "rgba(255,255,255,0.9)", lineHeight: 20 },
});