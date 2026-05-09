import { useTheme } from "@/Context/ThemeContext";
import { useRouter } from "expo-router";
import { Brain, CheckCircle, Clock, Shield } from "lucide-react-native";
import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Welcome({ onStart }: any) {
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const scale = getFontSizeMultiplier();
  const router = useRouter();

  const styles = useMemo(() => {
    const palette = {
      beigeBg: "#F6F3EE",
      charcoal: "#2F2F2F",
      sage: "#8DA399",
      taupe: "#AA957B",
      white: "#FFFFFF",
      textLight: "#6B6661",
      surfaceDark: "#1C1C1E",
    };

    const colors = {
      background: darkMode ? palette.surfaceDark : "#C9B8A8",
      card: darkMode ? "#2C2C2E" : "#F5F0EB",
      text: darkMode ? "#F6F3EE" : palette.charcoal,
      subText: darkMode ? "#A1A1AA" : palette.textLight,
      iconBg: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      decor1: darkMode ? "#4A4A4A" : "#B8A8A8",
      decor2: darkMode ? "#5A5A5A" : "#C9B8B8",
      decor3: darkMode ? "#3A3A3A" : "#A89898",
      accent1: "#8DA399",
      accent2: "#AA957B",
      accent3: palette.charcoal,
      accent4: "#6B6661",
    };

    return {
      colors,
      s: StyleSheet.create({
        container: { flexGrow: 1, backgroundColor: colors.background },
        card: {
          backgroundColor: colors.card,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          marginTop: 60,
          padding: 28,
          flex: 1,
          minHeight: "100%",
        },
        header: { alignItems: "center", marginBottom: 28 },
        title: {
          fontSize: 28 * scale,
          fontWeight: "800",
          color: colors.text,
          marginTop: 15,
          marginBottom: 24,
          textAlign: "center",
        },
        illustrationContainer: {
          width: "100%",
          height: 180,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          position: "relative",
        },
        illustrationCircle: {
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: darkMode ? "#3A3A3C" : "#E8DDD8",
          alignItems: "center",
          justifyContent: "center",
          elevation: 6,
        },
        illustration: { width: 120, height: 120 },
        decorCircle1: {
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: colors.decor1,
          position: "absolute",
          left: "20%",
          top: 30,
          opacity: 0.6,
        },
        decorCircle2: {
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: colors.decor2,
          position: "absolute",
          right: "15%",
          top: 25,
          opacity: 0.5,
        },
        decorCircle3: {
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: colors.decor3,
          position: "absolute",
          left: "25%",
          bottom: 25,
          opacity: 0.5,
        },
        section: { marginBottom: 32 },
        sectionTitle: {
          fontSize: 18 * scale,
          fontWeight: "700",
          color: colors.text,
          marginBottom: 16,
        },
        stepsContainer: {
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
        },
        stepCard: {
          flex: 1,
          borderRadius: 16,
          padding: 14,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 100,
        },
        stepIconText: { fontSize: 24 },
        stepText: {
          fontSize: 12 * scale,
          color: "#FFFFFF",
          textAlign: "center",
          fontWeight: "600",
        },
        featuresGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
        featureCard: {
          width: "48%",
          borderRadius: 16,
          padding: 18,
          minHeight: 110,
          justifyContent: "center",
        },
        featureTitle: {
          fontSize: 15 * scale,
          fontWeight: "700",
          color: "#FFFFFF",
          marginTop: 10,
        },
        featureSubtitle: {
          fontSize: 12 * scale,
          color: "rgba(255,255,255,0.9)",
          marginTop: 2,
        },
        tipsContainer: { gap: 12 },
        tipItem: { flexDirection: "row", alignItems: "center", gap: 12 },
        tipIconCircle: {
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: colors.iconBg,
          alignItems: "center",
          justifyContent: "center",
        },
        tipIconText: { fontSize: 16, color: palette.taupe },
        tipText: {
          fontSize: 14 * scale,
          color: colors.text,
          flex: 1,
          fontWeight: "500",
        },
        startButton: {
          backgroundColor: colors.accent3,
          borderRadius: 50,
          paddingVertical: 18,
          alignItems: "center",
          marginTop: 10,
          marginBottom: 40,
          elevation: 4,
          flexDirection: "row",
          justifyContent: "center",
          gap: 8,
        },
        startButtonText: {
          color: "#FFFFFF",
          fontSize: 18 * scale,
          fontWeight: "700",
        },
        startButtonArrow: {
          color: "#FFFFFF",
          fontSize: 18 * scale,
          fontWeight: "700",
        },
      }),
    };
  }, [darkMode, scale]);

  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createLoop = (
      anim: Animated.Value,
      toValue: number,
      duration: number,
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue, duration, useNativeDriver: true }),
          Animated.timing(anim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };
    createLoop(floatAnim1, -15, 2000);
    createLoop(floatAnim2, -20, 2500);
    createLoop(floatAnim3, -12, 1800);
  }, []);

  // Updated Hardware Back Handler
  useEffect(() => {
    const backAction = () => {
      router.replace("/dashboard");
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => backHandler.remove();
  }, [router]);

  return (
    <ScrollView
      contentContainerStyle={styles.s.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.s.card}>
        <View style={styles.s.header}>
          <Text style={styles.s.title}>Color Vision Test</Text>
          <View style={styles.s.illustrationContainer}>
            <View style={styles.s.illustrationCircle}>
              <Image
                source={require("../assets/images/CVDTest.png")}
                style={styles.s.illustration}
                resizeMode="contain"
              />
            </View>
            <Animated.View
              style={[
                styles.s.decorCircle1,
                { transform: [{ translateY: floatAnim1 }] },
              ]}
            />
            <Animated.View
              style={[
                styles.s.decorCircle2,
                { transform: [{ translateY: floatAnim2 }] },
              ]}
            />
            <Animated.View
              style={[
                styles.s.decorCircle3,
                { transform: [{ translateY: floatAnim3 }] },
              ]}
            />
          </View>
        </View>

        <View style={styles.s.section}>
          <Text style={styles.s.sectionTitle}>How It Works</Text>
          <View style={styles.s.stepsContainer}>
            <View
              style={[
                styles.s.stepCard,
                { backgroundColor: styles.colors.accent1 },
              ]}
            >
              <Text style={styles.s.stepIconText}>👁</Text>
              <Text style={styles.s.stepText}>See Images</Text>
            </View>
            <View
              style={[
                styles.s.stepCard,
                { backgroundColor: styles.colors.accent2 },
              ]}
            >
              <Text style={styles.s.stepIconText}>□△</Text>
              <Text style={styles.s.stepText}>Identify Patterns</Text>
            </View>
            <View
              style={[
                styles.s.stepCard,
                { backgroundColor: styles.colors.accent3 },
              ]}
            >
              <Text style={styles.s.stepIconText}>⚙</Text>
              <Text style={styles.s.stepText}>AI Analysis</Text>
            </View>
          </View>
        </View>

        <View style={styles.s.section}>
          <Text style={styles.s.sectionTitle}>Features</Text>
          <View style={styles.s.featuresGrid}>
            <View
              style={[
                styles.s.featureCard,
                { backgroundColor: styles.colors.accent1 },
              ]}
            >
              <Clock color="white" size={28} />
              <Text style={styles.s.featureTitle}>Quick Test</Text>
            </View>
            <View
              style={[
                styles.s.featureCard,
                { backgroundColor: styles.colors.accent2 },
              ]}
            >
              <CheckCircle color="white" size={28} />
              <Text style={styles.s.featureTitle}>Accurate</Text>
            </View>
            <View
              style={[
                styles.s.featureCard,
                { backgroundColor: styles.colors.accent3 },
              ]}
            >
              <Shield color="white" size={28} />
              <Text style={styles.s.featureTitle}>Private</Text>
            </View>
            <View
              style={[
                styles.s.featureCard,
                { backgroundColor: styles.colors.accent4 },
              ]}
            >
              <Brain color="white" size={28} />
              <Text style={styles.s.featureTitle}>AI Powered</Text>
            </View>
          </View>
        </View>

        <View style={styles.s.section}>
          <Text style={styles.s.sectionTitle}>Before You Start</Text>
          <View style={styles.s.tipsContainer}>
            {[
              { icon: "☀", text: "Use a well-lit environment" },
              { icon: "ℹ", text: "Adjust screen brightness" },
              { icon: "∞", text: "Remove colored glasses" },
              { icon: "◎", text: "Take your time" },
            ].map((tip, i) => (
              <View key={i} style={styles.s.tipItem}>
                <View style={styles.s.tipIconCircle}>
                  <Text style={styles.s.tipIconText}>{tip.icon}</Text>
                </View>
                <Text style={styles.s.tipText}>{tip.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.s.startButton} onPress={onStart}>
          <Text style={styles.s.startButtonText}>Start Test</Text>
          <Text style={styles.s.startButtonArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
