import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../Context/AuthContext";
import { updateUserCVDType } from "../Context/cvdService";
import { useTheme } from "../Context/ThemeContext";
import { useGoHomeOnBack } from "../hooks/useBackNavigation";
import { goHome } from "../utils/navigation";

export default function ResultScreen() {
  const router = useRouter();
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const fontScale = getFontSizeMultiplier();
  const { user } = useAuth();
  const { results, data } = useLocalSearchParams();
  const isMounted = useRef(true);

  // 1. Memoize parsing to prevent repetitive JSON execution on renders
  const { testResult, rawAnswers } = useMemo(() => {
    let localRawAnswers: any[] = [];
    let localTestResult: any = {
      totalScore: 0,
      rowScores: [0, 0, 0, 0],
      tritanWeightedScore: 0,
      ishiharaTritanScore: 0,
      rowResults: [],
      redGreen: undefined,
      blueYellow: undefined,
      plateAnswers: undefined,
    };

    try {
      if (results) {
        localTestResult = JSON.parse(results as string);
      }
      if (data) {
        localRawAnswers = JSON.parse(data as string);
        if (
          Array.isArray(localRawAnswers) &&
          !Array.isArray(localTestResult.plateAnswers)
        ) {
          localTestResult.plateAnswers = localRawAnswers;
        }
      }
    } catch (e) {
      console.error("Failed to parse results or data:", e);
    }
    return { testResult: localTestResult, rawAnswers: localRawAnswers };
  }, [results, data]);

  const normalizedTritanScore =
    testResult.tritanWeightedScore ?? testResult.ishiharaTritanScore ?? 0;
  const maxPossibleScore = 120;
  const tritanAccuracy = Math.max(
    0,
    100 - (normalizedTritanScore / maxPossibleScore) * 100,
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
    if (normalizedTritanScore <= 8) {
      return {
        key: "tritan_normal",
        isNormal: true,
        type: "Normal Blue-Yellow Vision",
        title: "No Blue-Yellow Deficiency",
        desc: "Hue arrangement shows good discrimination along the blue-yellow axis.",
        color: palette.sageGreen,
      };
    }
    if (normalizedTritanScore <= 24) {
      return {
        key: "tritan_mild",
        isNormal: false,
        type: "Mild Tritan",
        title: "Minor Blue-Yellow Difficulty",
        desc: "Minor difficulty distinguishing blue and yellow hues; may indicate mild Tritan-axis sensitivity.",
        color: palette.earthTan,
      };
    }
    if (normalizedTritanScore <= 52) {
      return {
        key: "tritan_moderate",
        isNormal: false,
        type: "Moderate Tritan",
        title: "Moderate Blue-Yellow Deficiency",
        desc: "Moderate difficulty in the blue-yellow spectrum; consistent with Tritan-axis deficiency.",
        color: palette.earthTan,
      };
    }
    return {
      key: "tritan_strong",
      isNormal: false,
      type: "Strong Tritan Deficiency",
      title: "Significant Blue-Yellow Difficulty",
      desc: "Strong difficulties in the blue-yellow spectrum; consistent with Tritanopia.",
      color: palette.terracotta,
    };
  }, [normalizedTritanScore]);

  const getRedGreenDiagnosis = useCallback(() => {
    const basicCounts = testResult.redGreen;
    const plateAnswers =
      testResult.plateAnswers ||
      testResult.ishiharaResult?.plateAnswers ||
      testResult.ishiharaResult;

    if (basicCounts && typeof basicCounts.correct === "number") {
      const totalCount =
        basicCounts.total ??
        rawAnswers.filter((a: any) => a.category === "red-green").length;
      const correctCount = basicCounts.correct;

      if (totalCount === 0) return null;

      const isShortTest = totalCount <= 12;
      if (isShortTest) {
        if (correctCount === totalCount) {
          return {
            key: "rg_normal",
            isNormal: true,
            type: "No Red-Green Deficiency",
            title: "Red-Green Normal",
            desc: `You answered ${correctCount}/${totalCount} red-green plates correctly. Normal color vision demonstrated.`,
            color: palette.sageGreen,
          };
        }
        if (correctCount <= Math.floor(totalCount * 0.6)) {
          return {
            key: "rg_deficient",
            isNormal: false,
            type: "Likely Red-Green Deficiency",
            title: "Red-Green Deficiency",
            desc: `You answered only ${correctCount}/${totalCount} red-green plates correctly. Results strongly suggest red-green color vision deficiency.`,
            color: palette.terracotta,
          };
        }
        return {
          key: "rg_suspect",
          isNormal: false,
          type: "Borderline Red-Green Vision",
          title: "Suspected Red-Green Issue",
          desc: `You answered ${correctCount}/${totalCount} red-green plates correctly. Discrepancies found; a full screening test is recommended.`,
          color: palette.earthTan,
        };
      }

      if (correctCount >= 13) {
        return {
          key: "rg_normal",
          isNormal: true,
          type: "No Red-Green Deficiency",
          title: "Red-Green Normal",
          desc: `You answered ${correctCount}/${totalCount} red-green plates normally. Your red-green color vision is regarded as normal.`,
          color: palette.sageGreen,
        };
      }
      if (correctCount <= 9) {
        return {
          key: "rg_deficient",
          isNormal: false,
          type: "Likely Red-Green Deficiency",
          title: "Red-Green Deficiency",
          desc: `You answered only ${correctCount}/${totalCount} red-green plates normally. The results strongly suggest red-green color vision deficiency.`,
          color: palette.terracotta,
        };
      }
      return {
        key: "rg_suspect",
        isNormal: false,
        type: "Borderline Red-Green Vision",
        title: "Suspected Red-Green Issue",
        desc: `You answered ${correctCount}/${totalCount} red-green plates normally. This is a borderline assessment result, clinical confirmation is recommended.`,
        color: palette.earthTan,
      };
    }

    if (!plateAnswers || !Array.isArray(plateAnswers)) return null;

    const redGreenPlates = plateAnswers.filter(
      (p: any) =>
        p.category === "red-green" ||
        p.type === "ishihara" ||
        p.plateType === "ishihara",
    );

    const totalCount = redGreenPlates.length;
    if (totalCount === 0) return null;

    const correctCount = redGreenPlates.filter((p: any) => p.isCorrect).length;

    if (totalCount <= 8) {
      if (correctCount === totalCount) {
        return {
          key: "rg_normal",
          isNormal: true,
          type: "No Red-Green Deficiency",
          title: "Red-Green Normal",
          desc: `You answered ${correctCount}/${totalCount} plates correctly. Normal color vision demonstrated.`,
          color: palette.sageGreen,
        };
      } else if (correctCount <= Math.floor(totalCount * 0.6)) {
        return {
          key: "rg_deficient",
          isNormal: false,
          type: "Likely Red-Green Deficiency",
          title: "Red-Green Deficiency",
          desc: `You answered only ${correctCount}/${totalCount} plates correctly. Results strongly suggest red-green color vision deficiency.`,
          color: palette.terracotta,
        };
      } else {
        return {
          key: "rg_suspect",
          isNormal: false,
          type: "Borderline Red-Green Vision",
          title: "Suspected Red-Green Issue",
          desc: `You answered ${correctCount}/${totalCount} plates correctly. Discrepancies found; a full screening test is recommended.`,
          color: palette.earthTan,
        };
      }
    }

    if (correctCount >= 13) {
      return {
        key: "rg_normal",
        isNormal: true,
        type: "No Red-Green Deficiency",
        title: "Red-Green Normal",
        desc: `You answered ${correctCount}/${totalCount} plates normally. Your red-green color vision is regarded as normal.`,
        color: palette.sageGreen,
      };
    }
    if (correctCount <= 9) {
      return {
        key: "rg_deficient",
        isNormal: false,
        type: "Likely Red-Green Deficiency",
        title: "Red-Green Deficiency",
        desc: `You answered only ${correctCount}/${totalCount} plates normally. The results strongly suggest red-green color vision deficiency.`,
        color: palette.terracotta,
      };
    }

    return {
      key: "rg_suspect",
      isNormal: false,
      type: "Borderline Red-Green Vision",
      title: "Suspected Red-Green Issue",
      desc: `You answered ${correctCount}/${totalCount} plates normally. This is a borderline assessment result; clinical confirmation is recommended.`,
      color: palette.earthTan,
    };
  }, [testResult, rawAnswers]);

  const tritanDiag = getTritanDiagnosis();
  const rgDiag = getRedGreenDiagnosis();

  // 2. Store the human-readable label (`savedString`). It displays cleanly on
  //    the profile card AND is understood by VRScreen / EnhancerScreen, because
  //    both have substring fallbacks that detect the axis keywords this label
  //    always contains ("Red-Green", "Tritan", "Blue-Yellow", "Normal").
  //    NOTE: the label MUST keep those keywords — if the wording ever drops
  //    them, the parsers stop recognizing the deficiency.
  const combinedSummary = useMemo(() => {
    const hasRGDefect = rgDiag && !rgDiag.isNormal;
    const hasTritanDefect = tritanDiag && !tritanDiag.isNormal;

    if (hasRGDefect && hasTritanDefect) {
      return {
        title: "Dual Axis Color Deficiency",
        subtitle: "Red-Green & Blue-Yellow Assessment",
        type: `${rgDiag!.type} + ${tritanDiag!.type}`,
        desc: "Anomalies were flagged across both testing methodologies. Consideration for a professional clinical check is recommended.",
        color: palette.terracotta,
        savedString: `${rgDiag!.type} + ${tritanDiag!.type}`,
      };
    }

    if (hasRGDefect) {
      return {
        title: rgDiag!.title,
        subtitle: "Red-Green Axis Issue",
        type: rgDiag!.type,
        desc: rgDiag!.desc,
        color: rgDiag!.color,
        savedString: rgDiag!.type,
      };
    }

    if (hasTritanDefect) {
      return {
        title: tritanDiag!.title,
        subtitle: "Blue-Yellow Axis Issue",
        type: tritanDiag!.type,
        desc: tritanDiag!.desc,
        color: tritanDiag!.color,
        savedString: tritanDiag!.type,
      };
    }

    return {
      title: "Normal Color Vision",
      subtitle: "Combined Deficiency Scan",
      type: "No Deficiencies Detected",
      desc: "Excellent performance! Both red-green discrimination and blue-yellow parameters fall within normal variations.",
      color: palette.sageGreen,
      savedString: "Normal Color Vision",
    };
  }, [rgDiag, tritanDiag]);

  useEffect(() => {
    isMounted.current = true;
    const saveCVDType = async () => {
      if (!user || user.isGuest || !user.uid || !results) return;
      try {
        // Save the human-readable label. It displays cleanly on the profile
        // card and is recognized by VRScreen / EnhancerScreen via their
        // keyword fallbacks.
        await updateUserCVDType(user.uid, combinedSummary.savedString);
        console.log("✅ CVD type saved.");
      } catch (error) {
        console.error("❌ Failed to save CVD type:", error);
      }
    };

    saveCVDType();
    return () => {
      isMounted.current = false;
    };
  }, [user, results, combinedSummary.savedString]);

  useGoHomeOnBack();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <View
        style={[styles.headerCard, { backgroundColor: combinedSummary.color }]}
      >
        <View style={styles.iconPlaceholder}>
          <Text style={{ fontSize: 30 }}>👁</Text>
        </View>
        <Text style={[styles.headerTitle, { fontSize: 24 * fontScale }]}>
          {combinedSummary.title}
        </Text>
        <Text style={[styles.headerSubtitle, { fontSize: 14 * fontScale }]}>
          {combinedSummary.subtitle}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
          <Text style={[styles.cardLabel, { color: themeColors.subText }]}>
            OVERALL STATUS
          </Text>
          <View style={styles.resultRow}>
            <Text
              style={[
                styles.resultText,
                { color: themeColors.text, fontSize: 18 * fontScale },
              ]}
            >
              {combinedSummary.type}
            </Text>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: combinedSummary.color },
              ]}
            />
          </View>
          <Text
            style={[
              styles.desc,
              {
                color: themeColors.text,
                marginTop: 10,
                fontSize: 15 * fontScale,
              },
            ]}
          >
            {combinedSummary.desc}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
          <Text
            style={[
              styles.cardLabel,
              { color: themeColors.subText, marginBottom: 12 },
            ]}
          >
            BLUE-YELLOW (TRITAN) ACCURACY
          </Text>
          <View style={styles.statRow}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text
                style={[
                  styles.statLabel,
                  { color: themeColors.text, fontSize: 16 * fontScale },
                ]}
              >
                {tritanDiag.title}
              </Text>
              <Text
                style={[
                  styles.desc,
                  {
                    color: themeColors.subText,
                    fontSize: 13 * fontScale,
                    marginTop: 4,
                  },
                ]}
              >
                {tritanDiag.desc}
              </Text>
            </View>
            <Text
              style={[
                styles.statValue,
                {
                  color:
                    byPercent < 60 ? palette.terracotta : palette.sageGreen,
                  fontSize: 22 * fontScale,
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
                  { color: themeColors.text, fontSize: 14 * fontScale },
                ]}
              >
                Tritan Error Metrics
              </Text>
              <Text
                style={[styles.statSubLabel, { color: themeColors.subText }]}
              >
                Lower numerical weights signify superior alignment
              </Text>
            </View>
            <Text
              style={[
                styles.statValue,
                { color: themeColors.text, fontSize: 18 * fontScale },
              ]}
            >
              {Math.round(normalizedTritanScore)}
            </Text>
          </View>
        </View>

        {rgDiag && (
          <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
            <Text
              style={[
                styles.cardLabel,
                { color: themeColors.subText, marginBottom: 12 },
              ]}
            >
              RED-GREEN CHECK
            </Text>
            <View style={styles.resultRow}>
              <Text
                style={[
                  styles.statLabel,
                  { color: themeColors.text, fontSize: 16 * fontScale },
                ]}
              >
                {rgDiag.title}
              </Text>
              <View
                style={[styles.statusDot, { backgroundColor: rgDiag.color }]}
              />
            </View>
            <Text
              style={[
                styles.desc,
                {
                  color: themeColors.text,
                  marginTop: 8,
                  fontSize: 14 * fontScale,
                },
              ]}
            >
              {rgDiag.desc}
            </Text>
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
            onPress={() => goHome()}
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
    paddingVertical: 35,
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
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  resultText: { fontWeight: "800", flex: 1, marginRight: 10 },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  desc: { fontSize: 15, lineHeight: 22, fontWeight: "400" },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  statLabel: { fontWeight: "700" },
  statSubLabel: { fontSize: 12, marginTop: 2, maxWidth: "80%" },
  statValue: { fontWeight: "800" },
  divider: { height: 1, marginVertical: 14 },
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
