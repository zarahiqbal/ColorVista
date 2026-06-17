import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../Context/AuthContext";
import { updateUserCVDType } from "../Context/cvdService";
import { useTheme } from "../Context/ThemeContext";

export default function ResultScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const fontScale = getFontSizeMultiplier();
  const { user } = useAuth();
  const { results } = useLocalSearchParams();
  const isMounted = useRef(true);

  // Parse TestResult from HueTestScreen
  let testResult = {
    totalScore: 0,
    rowScores: [0, 0, 0, 0],
    tritanWeightedScore: 0,
    rowResults: [],
  };

  try {
    if (results) {
      testResult = JSON.parse(results as string);
    }
  } catch (e) {
    console.error("Failed to parse results:", e);
  }

  // Calculate accuracy percentage based on tritanWeightedScore
  // Score range: 0 (perfect) to ~200+ (very poor)
  // We'll invert it: 100% = perfect (score 0), 0% = worst case
  const maxPossibleScore = 120; // Adjusted threshold for clinical interpretation
  const tritanAccuracy = Math.max(
    0,
    100 - (testResult.tritanWeightedScore / maxPossibleScore) * 100,
  );
  const byPercent = Math.min(100, Math.round(tritanAccuracy));

  const palette = {
    cream: "#F9F8F4",
    white: "#FFFFFF",
    sageGreen: "#8FA395",
    earthTan: "#B09B81",
    terracotta: "#C77D63",
    softBlack: "#2D2D2D",
    grey: "#8E8E93",
    lightBorder: "#EFEFEF",
  };

  const themeColors = {
    background: darkMode ? "#121212" : palette.cream,
    text: darkMode ? "#FFFFFF" : palette.softBlack,
    cardBg: darkMode ? "#1E1E1E" : palette.white,
    subText: darkMode ? "#AAAAAA" : palette.grey,
    border: darkMode ? "#333333" : palette.lightBorder,
  };

  const getTritanDiagnosis = useCallback(() => {
    const score = testResult.tritanWeightedScore ?? 0;

    if (score <= 8) {
      return {
        key: "tritan_normal",
        type: "Normal Color Vision",
        title: "No Blue-Yellow Deficiency",
        subtitle: "Tritan Analysis",
        desc: "Hue arrangement shows good discrimination along the blue-yellow axis.",
        color: palette.sageGreen,
      };
    }
    if (score <= 24) {
      return {
        key: "tritan_mild",
        type: "Mild Tritan",
        title: "Minor Blue-Yellow Difficulty",
        subtitle: "Tritan Analysis",
        desc: "Minor difficulty distinguishing blue and yellow hues; may indicate mild Tritan-axis sensitivity.",
        color: palette.earthTan,
      };
    }
    if (score <= 52) {
      return {
        key: "tritan_moderate",
        type: "Moderate Tritan",
        title: "Moderate Blue-Yellow Deficiency",
        subtitle: "Tritan Analysis",
        desc: "Moderate difficulty in the blue-yellow spectrum; consistent with Tritan-axis deficiency.",
        color: palette.earthTan,
      };
    }
    return {
      key: "tritan_strong",
      type: "Strong Tritan Deficiency",
      title: "Significant Blue-Yellow Difficulty",
      subtitle: "Tritan Analysis",
      desc: "Strong difficulties in the blue-yellow spectrum; consistent with Tritanopia.",
      color: palette.terracotta,
    };
  }, [testResult.tritanWeightedScore]);

  const getRedGreenDiagnosis = useCallback(() => {
    const ish = (testResult as any).ishiharaResult;
    if (!ish || !Array.isArray(ish.plateAnswers)) {
      return null;
    }

    const rgPlates = ish.plateAnswers.filter(
      (p: any) =>
        p.plateType === "ishihara" ||
        p.plateType === "hrr" ||
        p.plateType === "red-green",
    );
    if (rgPlates.length === 0) return null;

    const correct = rgPlates.filter((p: any) => p.isCorrect).length;
    const pct = (correct / rgPlates.length) * 100;

    if (pct >= 90) {
      return {
        key: "rg_normal",
        type: "No Red-Green Deficiency",
        title: "Red-Green Normal",
        subtitle: "Red-Green Analysis",
        desc: `You answered ${correct}/${rgPlates.length} red-green plates correctly.`,
        color: palette.sageGreen,
      };
    }
    if (pct >= 60) {
      return {
        key: "rg_suspect",
        type: "Possible Red-Green Difficulty",
        title: "Suspected Red-Green Issue",
        subtitle: "Red-Green Analysis",
        desc: `You answered ${correct}/${rgPlates.length} red-green plates correctly. Consider follow-up testing.`,
        color: palette.earthTan,
      };
    }
    return {
      key: "rg_deficient",
      type: "Likely Red-Green Deficiency",
      title: "Red-Green Deficiency",
      subtitle: "Red-Green Analysis",
      desc: `You answered ${correct}/${rgPlates.length} red-green plates correctly — results suggest red-green color vision deficiency.`,
      color: palette.terracotta,
    };
  }, [testResult]);

  const tritanDiag = getTritanDiagnosis();
  const rgDiag = getRedGreenDiagnosis();

  // Prefer showing a detected Red-Green issue as the primary diagnosis when present,
  // otherwise show the Tritan (blue-yellow) diagnosis.
  const primaryDiag =
    rgDiag && rgDiag.key !== "rg_normal" ? rgDiag : tritanDiag;

  // Combined type to persist: if both axes show issues, store both; otherwise store the detected one
  const combinedCvdType = (() => {
    const tritanKey = tritanDiag?.key ?? "tritan_normal";
    const rgKey = rgDiag?.key ?? "rg_normal";

    if (rgKey !== "rg_normal" && tritanKey !== "tritan_normal") {
      return rgDiag ? `${rgDiag.type} & ${tritanDiag.type}` : tritanDiag.type;
    }
    if (rgKey !== "rg_normal" && rgDiag) return rgDiag.type;
    return tritanDiag.type;
  })();

  const diagnosis = primaryDiag;

  // Save to Firebase
  useEffect(() => {
    isMounted.current = true;
    const saveCVDType = async () => {
      if (!user || user.isGuest || !user.uid || !results) return;

      try {
        await updateUserCVDType(user.uid, combinedCvdType);
        console.log("✅ CVD type saved", combinedCvdType);
      } catch (error) {
        console.error("❌ Failed to save CVD type:", error);
      }
    };

    saveCVDType();
    return () => {
      isMounted.current = false;
    };
  }, [user, results, combinedCvdType]);

  // Handle Navigation and Back Buttons
  useEffect(() => {
    const handleBackAction = () => {
      router.replace("/welcome");
      return true;
    };

    // Android Hardware Back
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackAction,
    );

    // Header Back / Swipe Back (prevents "collapse" by only intercepting POP actions)
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // If we are already navigating to a valid destination via router.replace, don't prevent it
      if (e.data.action.type === "GO_BACK") {
        e.preventDefault();
        handleBackAction();
      }
    });

    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [navigation, router]);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <View style={[styles.headerCard, { backgroundColor: diagnosis.color }]}>
        <View style={styles.iconPlaceholder}>
          <Text style={{ fontSize: 30 }}>👁</Text>
        </View>
        <Text style={[styles.headerTitle, { fontSize: 24 * fontScale }]}>
          {diagnosis.title}
        </Text>
        <Text style={[styles.headerSubtitle, { fontSize: 14 * fontScale }]}>
          {diagnosis.subtitle}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
          <Text style={[styles.cardLabel, { color: themeColors.subText }]}>
            DETECTED TYPE
          </Text>
          <View style={styles.resultRow}>
            <Text
              style={[
                styles.resultText,
                { color: themeColors.text, fontSize: 20 * fontScale },
              ]}
            >
              {diagnosis.type}
            </Text>
            <View
              style={[styles.statusDot, { backgroundColor: diagnosis.color }]}
            />
          </View>
          <Text
            style={[
              styles.desc,
              {
                color: themeColors.text,
                marginTop: 10,
                fontSize: 16 * fontScale,
              },
            ]}
          >
            {diagnosis.desc}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
          <Text
            style={[
              styles.cardLabel,
              { color: themeColors.subText, marginBottom: 15 },
            ]}
          >
            TEST SCORE
          </Text>
          <View style={styles.statRow}>
            <View>
              <Text
                style={[
                  styles.statLabel,
                  { color: themeColors.text, fontSize: 16 * fontScale },
                ]}
              >
                Blue-Yellow Accuracy
              </Text>
              <Text
                style={[styles.statSubLabel, { color: themeColors.subText }]}
              >
                Tritan Test
              </Text>
            </View>
            <Text
              style={[
                styles.statValue,
                {
                  color:
                    byPercent < 60 ? palette.terracotta : palette.sageGreen,
                  fontSize: 20 * fontScale,
                },
              ]}
            >
              {Math.round(byPercent)}%
            </Text>
          </View>
          <View
            style={[styles.divider, { backgroundColor: themeColors.border }]}
          />
          <View style={styles.statRow}>
            <View>
              <Text
                style={[
                  styles.statLabel,
                  { color: themeColors.text, fontSize: 16 * fontScale },
                ]}
              >
                Total Score
              </Text>
              <Text
                style={[styles.statSubLabel, { color: themeColors.subText }]}
              >
                Lower is better
              </Text>
            </View>
            <Text
              style={[
                styles.statValue,
                { color: themeColors.text, fontSize: 20 * fontScale },
              ]}
            >
              {Math.round(testResult.tritanWeightedScore)}
            </Text>
          </View>
        </View>

        {rgDiag && (
          <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
            <Text style={[styles.cardLabel, { color: themeColors.subText }]}>
              RED-GREEN CHECK
            </Text>
            <View style={{ marginTop: 12 }}>
              <Text style={[styles.statLabel, { color: themeColors.text }]}>
                {rgDiag.title}
              </Text>
              <Text
                style={[styles.desc, { color: themeColors.text, marginTop: 8 }]}
              >
                {rgDiag.desc}
              </Text>
            </View>
          </View>
        )}

        <Text
          style={[
            styles.disclaimer,
            { color: themeColors.subText, fontSize: 12 * fontScale },
          ]}
        >
          * This is a screening tool, not a medical diagnosis.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.secondaryButton,
              { borderColor: themeColors.border },
            ]}
            onPress={() => router.push("./difficulty")}
          >
            <Text
              style={[
                styles.buttonText,
                { color: themeColors.text, fontSize: 16 * fontScale },
              ]}
            >
              Try Again
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              { backgroundColor: palette.softBlack },
            ]}
            onPress={() => router.replace("./dashboard")}
          >
            <Text
              style={[
                styles.buttonText,
                { color: "white", fontSize: 16 * fontScale },
              ]}
            >
              Return Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingTop: 20, paddingBottom: 40 },
  headerCard: {
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  iconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontWeight: "800",
    marginBottom: 5,
    textAlign: "center",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  content: { padding: 20 },
  card: { borderRadius: 24, padding: 24, marginBottom: 20, elevation: 1 },
  cardLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resultText: { fontWeight: "800", flex: 1, marginRight: 10 },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  desc: { fontSize: 16, lineHeight: 24, fontWeight: "400" },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  statLabel: { fontWeight: "600" },
  statSubLabel: { fontSize: 12, marginTop: 2 },
  statValue: { fontWeight: "800" },
  divider: { height: 1, marginVertical: 10 },
  disclaimer: { textAlign: "center", marginBottom: 30, fontStyle: "italic" },
  buttonContainer: { gap: 12 },
  button: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: { backgroundColor: "transparent", borderWidth: 1 },
  primaryButton: {},
  buttonText: { fontWeight: "700" },
});
