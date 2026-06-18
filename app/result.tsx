import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
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

  // 2. Modified savedString to store pure string outputs instead of stringified objects
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
        await updateUserCVDType(user.uid, combinedSummary.savedString);
        console.log("✅ CVD structured metadata saved.");
      } catch (error) {
        console.error("❌ Failed to save CVD type:", error);
      }
    };

    saveCVDType();
    return () => {
      isMounted.current = false;
    };
  }, [user, results, combinedSummary.savedString]);

  useEffect(() => {
    const handleBackAction = () => {
      router.replace("/welcome");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackAction,
    );
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
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
// import { useNavigation } from "@react-navigation/native";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useCallback, useEffect, useRef } from "react";
// import {
//   BackHandler,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useAuth } from "../Context/AuthContext";
// import { updateUserCVDType } from "../Context/cvdService";
// import { useTheme } from "../Context/ThemeContext";

// export default function ResultScreen() {
//   const router = useRouter();
//   const navigation = useNavigation();
//   const { darkMode, getFontSizeMultiplier } = useTheme();
//   const fontScale = getFontSizeMultiplier();
//   const { user } = useAuth();
//   const { results, data } = useLocalSearchParams();
//   const isMounted = useRef(true);

//   // Parse TestResult / raw basic quiz answers
//   let rawAnswers: any[] = [];
//   let testResult: any = {
//     totalScore: 0,
//     rowScores: [0, 0, 0, 0],
//     tritanWeightedScore: 0,
//     ishiharaTritanScore: 0,
//     rowResults: [],
//     redGreen: undefined,
//     blueYellow: undefined,
//     plateAnswers: undefined,
//   };

//   try {
//     if (results) {
//       testResult = JSON.parse(results as string);
//     }
//     if (data) {
//       rawAnswers = JSON.parse(data as string);
//       if (
//         Array.isArray(rawAnswers) &&
//         !Array.isArray(testResult.plateAnswers)
//       ) {
//         testResult.plateAnswers = rawAnswers;
//       }
//     }
//   } catch (e) {
//     console.error("Failed to parse results or data:", e);
//   }

//   const normalizedTritanScore =
//     testResult.tritanWeightedScore ?? testResult.ishiharaTritanScore ?? 0;
//   const maxPossibleScore = 120;
//   const tritanAccuracy = Math.max(
//     0,
//     100 - (normalizedTritanScore / maxPossibleScore) * 100,
//   );
//   const byPercent = Math.min(100, Math.round(tritanAccuracy));

//   const palette = {
//     cream: "#F9F8F4",
//     white: "#FFFFFF",
//     sageGreen: "#8FA395",
//     earthTan: "#B09B81",
//     terracotta: "#C77D63",
//     softBlack: "#2D2D2D",
//     grey: "#8E8E93",
//     lightBorder: "#EFEFEF",
//   };

//   const themeColors = {
//     background: darkMode ? "#121212" : palette.cream,
//     text: darkMode ? "#FFFFFF" : palette.softBlack,
//     cardBg: darkMode ? "#1E1E1E" : palette.white,
//     subText: darkMode ? "#AAAAAA" : palette.grey,
//     border: darkMode ? "#333333" : palette.lightBorder,
//   };

//   // ─── 1. BLUE-YELLOW DIAGNOSIS LOGIC ───────────────────────────────────────
//   const getTritanDiagnosis = useCallback(() => {
//     const score =
//       testResult.tritanWeightedScore ?? testResult.ishiharaTritanScore ?? 0;

//     if (score <= 8) {
//       return {
//         key: "tritan_normal",
//         isNormal: true,
//         type: "Normal Blue-Yellow Vision",
//         title: "No Blue-Yellow Deficiency",
//         desc: "Hue arrangement shows good discrimination along the blue-yellow axis.",
//         color: palette.sageGreen,
//       };
//     }
//     if (score <= 24) {
//       return {
//         key: "tritan_mild",
//         isNormal: false,
//         type: "Mild Tritan",
//         title: "Minor Blue-Yellow Difficulty",
//         desc: "Minor difficulty distinguishing blue and yellow hues; may indicate mild Tritan-axis sensitivity.",
//         color: palette.earthTan,
//       };
//     }
//     if (score <= 52) {
//       return {
//         key: "tritan_moderate",
//         isNormal: false,
//         type: "Moderate Tritan",
//         title: "Moderate Blue-Yellow Deficiency",
//         desc: "Moderate difficulty in the blue-yellow spectrum; consistent with Tritan-axis deficiency.",
//         color: palette.earthTan,
//       };
//     }
//     return {
//       key: "tritan_strong",
//       isNormal: false,
//       type: "Strong Tritan Deficiency",
//       title: "Significant Blue-Yellow Difficulty",
//       desc: "Strong difficulties in the blue-yellow spectrum; consistent with Tritanopia.",
//       color: palette.terracotta,
//     };
//   }, [testResult.tritanWeightedScore, testResult.ishiharaTritanScore]);

//   // ─── 2. RED-GREEN DIAGNOSIS LOGIC ─────────────────────────────────────────
//   const getRedGreenDiagnosis = useCallback(() => {
//     const basicCounts = (testResult as any).redGreen;
//     const plateAnswers =
//       (testResult as any).plateAnswers ||
//       (testResult as any).ishiharaResult?.plateAnswers ||
//       (testResult as any).ishiharaResult;

//     if (basicCounts && typeof basicCounts.correct === "number") {
//       const totalCount =
//         basicCounts.total ??
//         rawAnswers.filter((a: any) => a.category === "red-green").length;
//       const correctCount = basicCounts.correct;

//       if (totalCount === 0) return null;

//       const isShortTest = totalCount <= 12;
//       if (isShortTest) {
//         if (correctCount === totalCount) {
//           return {
//             key: "rg_normal",
//             isNormal: true,
//             type: "No Red-Green Deficiency",
//             title: "Red-Green Normal",
//             desc: `You answered ${correctCount}/${totalCount} red-green plates correctly. Normal color vision demonstrated.`,
//             color: palette.sageGreen,
//           };
//         }
//         if (correctCount <= Math.floor(totalCount * 0.6)) {
//           return {
//             key: "rg_deficient",
//             isNormal: false,
//             type: "Likely Red-Green Deficiency",
//             title: "Red-Green Deficiency",
//             desc: `You answered only ${correctCount}/${totalCount} red-green plates correctly. Results strongly suggest red-green color vision deficiency.`,
//             color: palette.terracotta,
//           };
//         }

//         return {
//           key: "rg_suspect",
//           isNormal: false,
//           type: "Borderline Red-Green Vision",
//           title: "Suspected Red-Green Issue",
//           desc: `You answered ${correctCount}/${totalCount} red-green plates correctly. Discrepancies found; a full screening test is recommended.`,
//           color: palette.earthTan,
//         };
//       }

//       if (correctCount >= 13) {
//         return {
//           key: "rg_normal",
//           isNormal: true,
//           type: "No Red-Green Deficiency",
//           title: "Red-Green Normal",
//           desc: `You answered ${correctCount}/${totalCount} red-green plates normally. Your red-green color vision is regarded as normal.`,
//           color: palette.sageGreen,
//         };
//       }
//       if (correctCount <= 9) {
//         return {
//           key: "rg_deficient",
//           isNormal: false,
//           type: "Likely Red-Green Deficiency",
//           title: "Red-Green Deficiency",
//           desc: `You answered only ${correctCount}/${totalCount} red-green plates normally. The results strongly suggest red-green color vision deficiency.`,
//           color: palette.terracotta,
//         };
//       }

//       return {
//         key: "rg_suspect",
//         isNormal: false,
//         type: "Borderline Red-Green Vision",
//         title: "Suspected Red-Green Issue",
//         desc: `You answered ${correctCount}/${totalCount} red-green plates normally. This is a borderline assessment result, clinical confirmation is recommended.`,
//         color: palette.earthTan,
//       };
//     }

//     if (!plateAnswers || !Array.isArray(plateAnswers)) {
//       return null;
//     }

//     const redGreenPlates = plateAnswers.filter((p: any) => {
//       return (
//         p.category === "red-green" ||
//         p.type === "ishihara" ||
//         p.plateType === "ishihara"
//       );
//     });

//     if (redGreenPlates.length === 0) return null;

//     const correctCount = redGreenPlates.filter((p: any) => p.isCorrect).length;
//     const totalCount = redGreenPlates.length;

//     if (totalCount <= 8) {
//       if (correctCount === totalCount) {
//         return {
//           key: "rg_normal",
//           isNormal: true,
//           type: "No Red-Green Deficiency",
//           title: "Red-Green Normal",
//           desc: `You answered ${correctCount}/${totalCount} plates correctly. Normal color vision demonstrated.`,
//           color: palette.sageGreen,
//         };
//       } else if (correctCount <= Math.floor(totalCount * 0.6)) {
//         return {
//           key: "rg_deficient",
//           isNormal: false,
//           type: "Likely Red-Green Deficiency",
//           title: "Red-Green Deficiency",
//           desc: `You answered only ${correctCount}/${totalCount} plates correctly. Results strongly suggest red-green color vision deficiency.`,
//           color: palette.terracotta,
//         };
//       } else {
//         return {
//           key: "rg_suspect",
//           isNormal: false,
//           type: "Borderline Red-Green Vision",
//           title: "Suspected Red-Green Issue",
//           desc: `You answered ${correctCount}/${totalCount} plates correctly. Discrepancies found; a full screening test is recommended.`,
//           color: palette.earthTan,
//         };
//       }
//     }

//     if (correctCount >= 13) {
//       return {
//         key: "rg_normal",
//         isNormal: true,
//         type: "No Red-Green Deficiency",
//         title: "Red-Green Normal",
//         desc: `You answered ${correctCount}/${totalCount} plates normally. Your red-green color vision is regarded as normal.`,
//         color: palette.sageGreen,
//       };
//     }
//     if (correctCount <= 9) {
//       return {
//         key: "rg_deficient",
//         isNormal: false,
//         type: "Likely Red-Green Deficiency",
//         title: "Red-Green Deficiency",
//         desc: `You answered only ${correctCount}/${totalCount} plates normally. The results strongly suggest red-green color vision deficiency.`,
//         color: palette.terracotta,
//       };
//     }

//     return {
//       key: "rg_suspect",
//       isNormal: false,
//       type: "Borderline Red-Green Vision",
//       title: "Suspected Red-Green Issue",
//       desc: `You answered ${correctCount}/${totalCount} plates normally. This is a borderline assessment result; clinical confirmation is recommended.`,
//       color: palette.earthTan,
//     };
//   }, [testResult, rawAnswers]);

//   const tritanDiag = getTritanDiagnosis();
//   const rgDiag = getRedGreenDiagnosis();

//   // ─── 3. COMBINED ANALYSIS AND DESIGNATION ───────────────────────────────
//   const combinedSummary = (() => {
//     const hasRGDefect = rgDiag && !rgDiag.isNormal;
//     const hasTritanDefect = tritanDiag && !tritanDiag.isNormal;

//     // Both vision channels show anomalies
//     if (hasRGDefect && hasTritanDefect) {
//       return {
//         title: "Dual Axis Color Deficiency",
//         subtitle: "Red-Green & Blue-Yellow Assessment",
//         type: `${rgDiag!.type} + ${tritanDiag!.type}`,
//         desc: "Anomalies were flagged across both testing methodologies. Consideration for a professional clinical check is recommended.",
//         color: palette.terracotta,
//         // Save structured object properties as stringified state data
//         savedString: JSON.stringify({
//           display: `${rgDiag!.type} + ${tritanDiag!.type}`,
//           hasRedGreen: true,
//           hasTritan: true,
//         }),
//       };
//     }

//     // Only Red-Green defect found
//     if (hasRGDefect) {
//       return {
//         title: rgDiag!.title,
//         subtitle: "Red-Green Axis Issue",
//         type: rgDiag!.type,
//         desc: rgDiag!.desc,
//         color: rgDiag!.color,
//         savedString: JSON.stringify({
//           display: rgDiag!.type,
//           hasRedGreen: true,
//           hasTritan: false,
//         }),
//       };
//     }

//     // Only Blue-Yellow defect found
//     if (hasTritanDefect) {
//       return {
//         title: tritanDiag!.title,
//         subtitle: "Blue-Yellow Axis Issue",
//         type: tritanDiag!.type,
//         desc: tritanDiag!.desc,
//         color: tritanDiag!.color,
//         savedString: JSON.stringify({
//           display: tritanDiag!.type,
//           hasRedGreen: false,
//           hasTritan: true,
//         }),
//       };
//     }

//     // Completely normal results across the board
//     return {
//       title: "Normal Color Vision",
//       subtitle: "Combined Deficiency Scan",
//       type: "No Deficiencies Detected",
//       desc: "Excellent performance! Both red-green discrimination and blue-yellow parameters fall within normal variations.",
//       color: palette.sageGreen,
//       savedString: JSON.stringify({
//         display: "Normal Color Vision",
//         hasRedGreen: false,
//         hasTritan: false,
//       }),
//     };
//   })();

//   // Save to Firebase Database
//   useEffect(() => {
//     isMounted.current = true;
//     const saveCVDType = async () => {
//       if (!user || user.isGuest || !user.uid || !results) return;

//       try {
//         await updateUserCVDType(user.uid, combinedSummary.savedString);
//         console.log("✅ CVD structured metadata metadata saved.");
//       } catch (error) {
//         console.error("❌ Failed to save CVD type:", error);
//       }
//     };

//     saveCVDType();
//     return () => {
//       isMounted.current = false;
//     };
//   }, [user, results, combinedSummary.savedString]);

//   // Handle Navigation and Hardware Back Button interceptors
//   useEffect(() => {
//     const handleBackAction = () => {
//       router.replace("/welcome");
//       return true;
//     };

//     const backHandler = BackHandler.addEventListener(
//       "hardwareBackPress",
//       handleBackAction,
//     );

//     const unsubscribe = navigation.addListener("beforeRemove", (e) => {
//       if (e.data.action.type === "GO_BACK") {
//         e.preventDefault();
//         handleBackAction();
//       }
//     });

//     return () => {
//       backHandler.remove();
//       unsubscribe();
//     };
//   }, [navigation, router]);

//   return (
//     <ScrollView
//       contentContainerStyle={[
//         styles.container,
//         { backgroundColor: themeColors.background },
//       ]}
//     >
//       {/* Dynamic Summary Header Card */}
//       <View
//         style={[styles.headerCard, { backgroundColor: combinedSummary.color }]}
//       >
//         <View style={styles.iconPlaceholder}>
//           <Text style={{ fontSize: 30 }}>👁</Text>
//         </View>
//         <Text style={[styles.headerTitle, { fontSize: 24 * fontScale }]}>
//           {combinedSummary.title}
//         </Text>
//         <Text style={[styles.headerSubtitle, { fontSize: 14 * fontScale }]}>
//           {combinedSummary.subtitle}
//         </Text>
//       </View>

//       <View style={styles.content}>
//         {/* Core Detection Profile Card */}
//         <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
//           <Text style={[styles.cardLabel, { color: themeColors.subText }]}>
//             OVERALL STATUS
//           </Text>
//           <View style={styles.resultRow}>
//             <Text
//               style={[
//                 styles.resultText,
//                 { color: themeColors.text, fontSize: 18 * fontScale },
//               ]}
//             >
//               {combinedSummary.type}
//             </Text>
//             <View
//               style={[
//                 styles.statusDot,
//                 { backgroundColor: combinedSummary.color },
//               ]}
//             />
//           </View>
//           <Text
//             style={[
//               styles.desc,
//               {
//                 color: themeColors.text,
//                 marginTop: 10,
//                 fontSize: 15 * fontScale,
//               },
//             ]}
//           >
//             {combinedSummary.desc}
//           </Text>
//         </View>

//         {/* ─── AXIS A: BLUE-YELLOW BLOCK ─── */}
//         <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
//           <Text
//             style={[
//               styles.cardLabel,
//               { color: themeColors.subText, marginBottom: 12 },
//             ]}
//           >
//             BLUE-YELLOW (TRITAN) ACCURACY
//           </Text>
//           <View style={styles.statRow}>
//             <View style={{ flex: 1, paddingRight: 8 }}>
//               <Text
//                 style={[
//                   styles.statLabel,
//                   { color: themeColors.text, fontSize: 16 * fontScale },
//                 ]}
//               >
//                 {tritanDiag.title}
//               </Text>
//               <Text
//                 style={[
//                   styles.desc,
//                   {
//                     color: themeColors.subText,
//                     fontSize: 13 * fontScale,
//                     marginTop: 4,
//                   },
//                 ]}
//               >
//                 {tritanDiag.desc}
//               </Text>
//             </View>
//             <Text
//               style={[
//                 styles.statValue,
//                 {
//                   color:
//                     byPercent < 60 ? palette.terracotta : palette.sageGreen,
//                   fontSize: 22 * fontScale,
//                 },
//               ]}
//             >
//               {Math.round(byPercent)}%
//             </Text>
//           </View>

//           <View
//             style={[styles.divider, { backgroundColor: themeColors.border }]}
//           />

//           <View style={styles.statRow}>
//             <View>
//               <Text
//                 style={[
//                   styles.statLabel,
//                   { color: themeColors.text, fontSize: 14 * fontScale },
//                 ]}
//               >
//                 Tritan Error Metrics
//               </Text>
//               <Text
//                 style={[styles.statSubLabel, { color: themeColors.subText }]}
//               >
//                 Lower numerical weights signify superior alignment
//               </Text>
//             </View>
//             <Text
//               style={[
//                 styles.statValue,
//                 { color: themeColors.text, fontSize: 18 * fontScale },
//               ]}
//             >
//               {Math.round(testResult.tritanWeightedScore)}
//             </Text>
//           </View>
//         </View>

//         {/* ─── AXIS B: RED-GREEN BLOCK ─── */}
//         {rgDiag && (
//           <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
//             <Text
//               style={[
//                 styles.cardLabel,
//                 { color: themeColors.subText, marginBottom: 12 },
//               ]}
//             >
//               RED-GREEN CHECK
//             </Text>
//             <View style={styles.resultRow}>
//               <Text
//                 style={[
//                   styles.statLabel,
//                   { color: themeColors.text, fontSize: 16 * fontScale },
//                 ]}
//               >
//                 {rgDiag.title}
//               </Text>
//               <View
//                 style={[styles.statusDot, { backgroundColor: rgDiag.color }]}
//               />
//             </View>
//             <Text
//               style={[
//                 styles.desc,
//                 {
//                   color: themeColors.text,
//                   marginTop: 8,
//                   fontSize: 14 * fontScale,
//                 },
//               ]}
//             >
//               {rgDiag.desc}
//             </Text>
//           </View>
//         )}

//         <Text
//           style={[
//             styles.disclaimer,
//             { color: themeColors.subText, fontSize: 12 * fontScale },
//           ]}
//         >
//           * This is a screening tool, not a medical diagnosis.
//         </Text>

//         {/* Action Controls */}
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             style={[
//               styles.button,
//               styles.secondaryButton,
//               { borderColor: themeColors.border },
//             ]}
//             onPress={() => router.push("./difficulty")}
//           >
//             <Text
//               style={[
//                 styles.buttonText,
//                 { color: themeColors.text, fontSize: 16 * fontScale },
//               ]}
//             >
//               Try Again
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.button,
//               styles.primaryButton,
//               { backgroundColor: palette.softBlack },
//             ]}
//             onPress={() => router.replace("./dashboard")}
//           >
//             <Text
//               style={[
//                 styles.buttonText,
//                 { color: "white", fontSize: 16 * fontScale },
//               ]}
//             >
//               Return Home
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, paddingTop: 20, paddingBottom: 40 },
//   headerCard: {
//     marginHorizontal: 20,
//     marginTop: 20,
//     paddingVertical: 35,
//     paddingHorizontal: 20,
//     borderRadius: 30,
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 3,
//   },
//   iconPlaceholder: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "rgba(255,255,255,0.2)",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 15,
//   },
//   headerTitle: {
//     fontWeight: "800",
//     marginBottom: 5,
//     textAlign: "center",
//     color: "#FFFFFF",
//   },
//   headerSubtitle: {
//     color: "rgba(255,255,255,0.9)",
//     fontWeight: "600",
//     textTransform: "uppercase",
//     letterSpacing: 1,
//   },
//   content: { padding: 20 },
//   card: { borderRadius: 24, padding: 24, marginBottom: 20, elevation: 1 },
//   cardLabel: {
//     fontSize: 11,
//     fontWeight: "700",
//     letterSpacing: 1,
//     textTransform: "uppercase",
//   },
//   resultRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: 6,
//   },
//   resultText: { fontWeight: "800", flex: 1, marginRight: 10 },
//   statusDot: { width: 12, height: 12, borderRadius: 6 },
//   desc: { fontSize: 15, lineHeight: 22, fontWeight: "400" },
//   statRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 6,
//   },
//   statLabel: { fontWeight: "700" },
//   statSubLabel: { fontSize: 12, marginTop: 2, maxWidth: "80%" },
//   statValue: { fontWeight: "800" },
//   divider: { height: 1, marginVertical: 14 },
//   disclaimer: { textAlign: "center", marginBottom: 30, fontStyle: "italic" },
//   buttonContainer: { gap: 12 },
//   button: {
//     paddingVertical: 18,
//     borderRadius: 30,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   secondaryButton: { backgroundColor: "transparent", borderWidth: 1 },
//   primaryButton: {},
//   buttonText: { fontWeight: "700" },
// });
// // import { useNavigation } from "@react-navigation/native";
// // import { useLocalSearchParams, useRouter } from "expo-router";
// // import { useEffect, useRef } from "react";
// // import {
// //   BackHandler,
// //   ScrollView,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   View
// // } from "react-native";
// // import { useAuth } from "../Context/AuthContext";
// // import { updateUserCVDType } from "../Context/cvdService";
// // import { useTheme } from "../Context/ThemeContext";

// // export default function ResultScreen() {
// //   const router = useRouter();
// //   const navigation = useNavigation();
// //   const { darkMode, getFontSizeMultiplier } = useTheme();
// //   const fontScale = getFontSizeMultiplier();
// //   const { user } = useAuth();
// //   const { results, data } = useLocalSearchParams();
// //   const isMounted = useRef(true);

// //   // ─── Parse incoming params ────────────────────────────────────────────────
// //   let rawAnswers: any[] = [];
// //   let testResult: any = {
// //     tritanWeightedScore: 0,
// //     ishiharaTritanScore: 0,
// //     redGreen: undefined,
// //     plateAnswers: undefined,
// //   };
// //   try {
// //     if (results) testResult = JSON.parse(results as string);
// //     if (data) {
// //       rawAnswers = JSON.parse(data as string);
// //       if (
// //         Array.isArray(rawAnswers) &&
// //         !Array.isArray(testResult.plateAnswers)
// //       ) {
// //         testResult.plateAnswers = rawAnswers;
// //       }
// //     }
// //   } catch (e) {
// //     console.error("Failed to parse results or data:", e);
// //   }

// //   const palette = {
// //     cream: "#F9F8F4",
// //     white: "#FFFFFF",
// //     sageGreen: "#8FA395",
// //     terracotta: "#C77D63",
// //     softBlack: "#2D2D2D",
// //     grey: "#8E8E93",
// //     lightBorder: "#EFEFEF",
// //     mutedBlue: "#6A8FAF",
// //   };

// //   const themeColors = {
// //     background: darkMode ? "#121212" : palette.cream,
// //     text: darkMode ? "#FFFFFF" : palette.softBlack,
// //     cardBg: darkMode ? "#1E1E1E" : palette.white,
// //     subText: darkMode ? "#AAAAAA" : palette.grey,
// //     border: darkMode ? "#333333" : palette.lightBorder,
// //   };

// //   // ─── COMBINED DIAGNOSIS LOGIC ─────────────────────────────────────────────
// //   const getDiagnosis = () => {
// //     // 1. Red-Green Evaluation
// //     let rgCorrect = 0;
// //     let rgTotal = 0;

// //     const basicCounts = testResult.redGreen;
// //     if (basicCounts && typeof basicCounts.correct === "number") {
// //       rgCorrect = basicCounts.correct;
// //       rgTotal =
// //         basicCounts.total ??
// //         rawAnswers.filter((a: any) => a.category === "red-green").length;
// //     } else {
// //       const plateAnswers =
// //         testResult.plateAnswers ||
// //         testResult.ishiharaResult?.plateAnswers ||
// //         testResult.ishiharaResult;
// //       if (Array.isArray(plateAnswers)) {
// //         const rgPlates = plateAnswers.filter(
// //           (p: any) =>
// //             p.category === "red-green" ||
// //             p.type === "ishihara" ||
// //             p.plateType === "ishihara",
// //         );
// //         rgTotal = rgPlates.length;
// //         rgCorrect = rgPlates.filter((p: any) => p.isCorrect).length;
// //       }
// //     }

// //     // Ratio of incorrect red-green answers
// //     const rgErrorRatio = rgTotal > 0 ? 1 - rgCorrect / rgTotal : 0;
// //     const isRgDeficient = rgErrorRatio > 0.4;

// //     // 2. Blue-Yellow Evaluation
// //     const tritanScore =
// //       testResult.tritanWeightedScore ?? testResult.ishiharaTritanScore ?? 0;
// //     // Normalize tritan error score out of max possible (120)
// //     const byErrorRatio = Math.min(tritanScore / 120, 1);
// //     const isByDeficient = tritanScore > 8;

// //     // 3. Determine the direct vision type outcome
// //     if (!isRgDeficient && !isByDeficient) {
// //       return {
// //         cvdType: "Normal Color Vision",
// //         title: "Normal Color Vision",
// //         subtitle: "No deficiency detected",
// //         desc: "Your responses across both test categories fall within the standard baseline range.",
// //         color: palette.sageGreen,
// //         icon: "✅",
// //       };
// //     }

// //     // Tie-breaker if both flags trigger: pick the one with the higher error ratio
// //     if (isRgDeficient && isByDeficient) {
// //       if (rgErrorRatio >= byErrorRatio) {
// //         return {
// //           cvdType: "Protanopia / Deuteranopia",
// //           title: "Protanopia / Deuteranopia",
// //           subtitle: "Red-Green Color Deficiency",
// //           desc: "Your response profile is consistent with a red-green color vision variant.",
// //           color: palette.terracotta,
// //           icon: "👁",
// //         };
// //       } else {
// //         return {
// //           cvdType: "Tritanopia",
// //           title: "Tritanopia",
// //           subtitle: "Blue-Yellow Color Deficiency",
// //           desc: "Your response profile is consistent with Tritanopia (a blue-yellow color vision variant).",
// //           color: palette.mutedBlue,
// //           icon: "👁",
// //         };
// //       }
// //     }

// //     if (isRgDeficient) {
// //       return {
// //         cvdType: "Protanopia / Deuteranopia",
// //         title: "Protanopia / Deuteranopia",
// //         subtitle: "Red-Green Color Deficiency",
// //         desc: "Your response profile is consistent with a red-green color vision variant.",
// //         color: palette.terracotta,
// //         icon: "👁",
// //       };
// //     }

// //     // Default fallback to Tritanopia if only isByDeficient is true
// //     return {
// //       cvdType: "Tritanopia",
// //       title: "Tritanopia",
// //       subtitle: "Blue-Yellow Color Deficiency",
// //       desc: "Your response profile is consistent with Tritanopia (a blue-yellow color vision variant).",
// //       color: palette.mutedBlue,
// //       icon: "👁",
// //     };
// //   };

// //   const diagnosis = getDiagnosis();

// //   // ─── Save to Firebase ─────────────────────────────────────────────────────
// //   useEffect(() => {
// //     isMounted.current = true;
// //     const saveCVDType = async () => {
// //       if (!user || user.isGuest || !user.uid || !results) return;
// //       try {
// //         await updateUserCVDType(user.uid, diagnosis.cvdType);
// //         console.log("✅ CVD type saved:", diagnosis.cvdType);
// //       } catch (error) {
// //         console.error("❌ Failed to save CVD type:", error);
// //       } finally {
// //         if (isMounted.current) setIsSaving(false);
// //       }
// //     };
// //     saveCVDType();
// //     return () => {
// //       isMounted.current = false;
// //     };
// //   }, [user, results, diagnosis.cvdType]);

// //   // ─── Back / navigation guards ─────────────────────────────────────────────
// //   useEffect(() => {
// //     const handleBack = () => {
// //       router.replace("/welcome");
// //       return true;
// //     };
// //     const backHandler = BackHandler.addEventListener(
// //       "hardwareBackPress",
// //       handleBack,
// //     );
// //     const unsubscribe = navigation.addListener("beforeRemove", (e) => {
// //       if (e.data.action.type === "GO_BACK") {
// //         e.preventDefault();
// //         handleBack();
// //       }
// //     });
// //     return () => {
// //       backHandler.remove();
// //       unsubscribe();
// //     };
// //   }, [navigation, router]);

// //   // ─── Render ───────────────────────────────────────────────────────────────
// //   return (
// //     <ScrollView
// //       contentContainerStyle={[
// //         styles.container,
// //         { backgroundColor: themeColors.background },
// //       ]}
// //     >
// //       {/* Header card */}
// //       <View style={[styles.headerCard, { backgroundColor: diagnosis.color }]}>
// //         <View style={styles.iconPlaceholder}>
// //           <Text style={{ fontSize: 30 }}>{diagnosis.icon}</Text>
// //         </View>
// //         <Text style={[styles.headerTitle, { fontSize: 26 * fontScale }]}>
// //           {diagnosis.title}
// //         </Text>
// //         <Text style={[styles.headerSubtitle, { fontSize: 13 * fontScale }]}>
// //           {diagnosis.subtitle}
// //         </Text>
// //       </View>

// //       <View style={styles.content}>
// //         {/* Result card */}
// //         <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
// //           <Text style={[styles.cardLabel, { color: themeColors.subText }]}>
// //             DIAGNOSIS
// //           </Text>
// //           <View style={styles.resultRow}>
// //             <Text
// //               style={[
// //                 styles.resultText,
// //                 { color: themeColors.text, fontSize: 20 * fontScale },
// //               ]}
// //             >
// //               {diagnosis.cvdType}
// //             </Text>
// //             <View
// //               style={[styles.statusDot, { backgroundColor: diagnosis.color }]}
// //             />
// //           </View>
// //           <Text
// //             style={[
// //               styles.desc,
// //               {
// //                 color: themeColors.text,
// //                 marginTop: 12,
// //                 fontSize: 15 * fontScale,
// //               },
// //             ]}
// //           >
// //             {diagnosis.desc}
// //           </Text>
// //         </View>

// //         <Text
// //           style={[
// //             styles.disclaimer,
// //             { color: themeColors.subText, fontSize: 12 * fontScale },
// //           ]}
// //         >
// //           * This is a screening tool, not a medical diagnosis. Consult an
// //           eye-care professional for a definitive assessment.
// //         </Text>

// //         {/* Buttons */}
// //         <View style={styles.buttonContainer}>
// //           <TouchableOpacity
// //             style={[
// //               styles.button,
// //               styles.secondaryButton,
// //               { borderColor: themeColors.border },
// //             ]}
// //             onPress={() => router.push("/difficulty")}
// //           >
// //             <Text
// //               style={[
// //                 styles.buttonText,
// //                 { color: themeColors.text, fontSize: 16 * fontScale },
// //               ]}
// //             >
// //               Try Again
// //             </Text>
// //           </TouchableOpacity>

// //           <TouchableOpacity
// //             style={[
// //               styles.button,
// //               styles.primaryButton,
// //               { backgroundColor: palette.softBlack },
// //             ]}
// //             onPress={() => router.replace("/dashboard")}
// //           >
// //             <Text
// //               style={[
// //                 styles.buttonText,
// //                 { color: "white", fontSize: 16 * fontScale },
// //               ]}
// //             >
// //               Return Home
// //             </Text>
// //           </TouchableOpacity>
// //         </View>
// //       </View>
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flexGrow: 1, paddingTop: 20, paddingBottom: 40 },
// //   headerCard: {
// //     marginHorizontal: 20,
// //     marginTop: 20,
// //     paddingVertical: 35,
// //     paddingHorizontal: 20,
// //     borderRadius: 30,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     elevation: 3,
// //   },
// //   iconPlaceholder: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     backgroundColor: "rgba(255,255,255,0.2)",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginBottom: 15,
// //   },
// //   headerTitle: {
// //     fontWeight: "800",
// //     marginBottom: 5,
// //     textAlign: "center",
// //     color: "#FFFFFF",
// //   },
// //   headerSubtitle: {
// //     color: "rgba(255,255,255,0.9)",
// //     fontWeight: "600",
// //     textTransform: "uppercase",
// //     letterSpacing: 1,
// //   },
// //   content: { padding: 20 },
// //   card: { borderRadius: 24, padding: 24, marginBottom: 20, elevation: 1 },
// //   cardLabel: {
// //     fontSize: 11,
// //     fontWeight: "700",
// //     letterSpacing: 1,
// //     textTransform: "uppercase",
// //     marginBottom: 6,
// //   },
// //   resultRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     marginTop: 4,
// //   },
// //   resultText: { fontWeight: "800", flex: 1, marginRight: 10 },
// //   statusDot: { width: 14, height: 14, borderRadius: 7 },
// //   desc: { fontSize: 15, lineHeight: 23, fontWeight: "400" },
// //   disclaimer: {
// //     textAlign: "center",
// //     marginBottom: 30,
// //     fontStyle: "italic",
// //     lineHeight: 18,
// //   },
// //   buttonContainer: { gap: 12 },
// //   button: {
// //     paddingVertical: 18,
// //     borderRadius: 30,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   secondaryButton: { backgroundColor: "transparent", borderWidth: 1 },
// //   primaryButton: {},
// //   buttonText: { fontWeight: "700" },
// // });
// import { useNavigation } from "@react-navigation/native";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useCallback, useEffect, useRef, useState } from "react";
// import {
//   BackHandler,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useAuth } from "../Context/AuthContext";
// import { updateUserCVDType } from "../Context/cvdService";
// import { useTheme } from "../Context/ThemeContext";

// export default function ResultScreen() {
//   const router = useRouter();
//   const navigation = useNavigation();
//   const { darkMode, getFontSizeMultiplier } = useTheme();
//   const fontScale = getFontSizeMultiplier();
//   const { user } = useAuth();
//   const { results, data } = useLocalSearchParams();
//   const isMounted = useRef(true);

//   // Modal visibility state for Dual Axis choice
//   const [showChoiceModal, setShowChoiceModal] = useState(false);

//   let rawAnswers: any[] = [];
//   let testResult: any = {
//     totalScore: 0,
//     rowScores: [0, 0, 0, 0],
//     tritanWeightedScore: 0,
//     ishiharaTritanScore: 0,
//     rowResults: [],
//     redGreen: undefined,
//     blueYellow: undefined,
//     plateAnswers: undefined,
//   };

//   try {
//     if (results) {
//       testResult = JSON.parse(results as string);
//     }
//     if (data) {
//       rawAnswers = JSON.parse(data as string);
//       if (
//         Array.isArray(rawAnswers) &&
//         !Array.isArray(testResult.plateAnswers)
//       ) {
//         testResult.plateAnswers = rawAnswers;
//       }
//     }
//   } catch (e) {
//     console.error("Failed to parse results or data:", e);
//   }

//   const normalizedTritanScore =
//     testResult.tritanWeightedScore ?? testResult.ishiharaTritanScore ?? 0;
//   const maxPossibleScore = 120;
//   const tritanAccuracy = Math.max(
//     0,
//     100 - (normalizedTritanScore / maxPossibleScore) * 100,
//   );
//   const byPercent = Math.min(100, Math.round(tritanAccuracy));

//   const palette = {
//     cream: "#F9F8F4",
//     white: "#FFFFFF",
//     sageGreen: "#8FA395",
//     earthTan: "#B09B81",
//     terracotta: "#C77D63",
//     softBlack: "#2D2D2D",
//     grey: "#8E8E93",
//     lightBorder: "#EFEFEF",
//   };

//   const themeColors = {
//     background: darkMode ? "#121212" : palette.cream,
//     text: darkMode ? "#FFFFFF" : palette.softBlack,
//     cardBg: darkMode ? "#1E1E1E" : palette.white,
//     subText: darkMode ? "#AAAAAA" : palette.grey,
//     border: darkMode ? "#333333" : palette.lightBorder,
//   };

//   const getTritanDiagnosis = useCallback(() => {
//     const score =
//       testResult.tritanWeightedScore ?? testResult.ishiharaTritanScore ?? 0;

//     if (score <= 8) {
//       return {
//         key: "tritan_normal",
//         isNormal: true,
//         type: "Normal Blue-Yellow Vision",
//         title: "No Blue-Yellow Deficiency",
//         desc: "Hue arrangement shows good discrimination along the blue-yellow axis.",
//         color: palette.sageGreen,
//       };
//     }
//     if (score <= 24) {
//       return {
//         key: "tritan_mild",
//         isNormal: false,
//         type: "Mild Tritan",
//         title: "Minor Blue-Yellow Difficulty",
//         desc: "Minor difficulty distinguishing blue and yellow hues; may indicate mild Tritan-axis sensitivity.",
//         color: palette.earthTan,
//       };
//     }
//     if (score <= 52) {
//       return {
//         key: "tritan_moderate",
//         isNormal: false,
//         type: "Moderate Tritan",
//         title: "Moderate Blue-Yellow Deficiency",
//         desc: "Moderate difficulty in the blue-yellow spectrum; consistent with Tritan-axis deficiency.",
//         color: palette.earthTan,
//       };
//     }
//     return {
//       key: "tritan_strong",
//       isNormal: false,
//       type: "Strong Tritan Deficiency",
//       title: "Significant Blue-Yellow Difficulty",
//       desc: "Strong difficulties in the blue-yellow spectrum; consistent with Tritanopia.",
//       color: palette.terracotta,
//     };
//   }, [testResult.tritanWeightedScore]);

//   const getRedGreenDiagnosis = useCallback(() => {
//     const basicCounts = (testResult as any).redGreen;
//     const plateAnswers =
//       (testResult as any).plateAnswers ||
//       (testResult as any).ishiharaResult?.plateAnswers ||
//       (testResult as any).ishiharaResult;

//     if (basicCounts && typeof basicCounts.correct === "number") {
//       const totalCount =
//         basicCounts.total ??
//         rawAnswers.filter((a: any) => a.category === "red-green").length;
//       const correctCount = basicCounts.correct;

//       if (totalCount === 0) return null;

//       const isShortTest = totalCount <= 12;
//       if (isShortTest) {
//         if (correctCount === totalCount) {
//           return {
//             key: "rg_normal",
//             isNormal: true,
//             type: "No Red-Green Deficiency",
//             title: "Red-Green Normal",
//             desc: `You answered ${correctCount}/${totalCount} red-green plates correctly. Normal color vision demonstrated.`,
//             color: palette.sageGreen,
//           };
//         }
//         if (correctCount <= Math.floor(totalCount * 0.6)) {
//           return {
//             key: "rg_deficient",
//             isNormal: false,
//             type: "Likely Red-Green Deficiency",
//             title: "Red-Green Deficiency",
//             desc: `You answered only ${correctCount}/${totalCount} red-green plates correctly. Results strongly suggest red-green color vision deficiency.`,
//             color: palette.terracotta,
//           };
//         }
//         return {
//           key: "rg_suspect",
//           isNormal: false,
//           type: "Borderline Red-Green Vision",
//           title: "Suspected Red-Green Issue",
//           desc: `You answered ${correctCount}/${totalCount} red-green plates correctly. Discrepancies found; a full screening test is recommended.`,
//           color: palette.earthTan,
//         };
//       }

//       if (correctCount >= 13) {
//         return {
//           key: "rg_normal",
//           isNormal: true,
//           type: "No Red-Green Deficiency",
//           title: "Red-Green Normal",
//           desc: `You answered ${correctCount}/${totalCount} red-green plates normally. Your red-green color vision is regarded as normal.`,
//           color: palette.sageGreen,
//         };
//       }
//       if (correctCount <= 9) {
//         return {
//           key: "rg_deficient",
//           isNormal: false,
//           type: "Likely Red-Green Deficiency",
//           title: "Red-Green Deficiency",
//           desc: `You answered only ${correctCount}/${totalCount} red-green plates normally. The results strongly suggest red-green color vision deficiency.`,
//           color: palette.terracotta,
//         };
//       }
//       return {
//         key: "rg_suspect",
//         isNormal: false,
//         type: "Borderline Red-Green Vision",
//         title: "Suspected Red-Green Issue",
//         desc: `You answered ${correctCount}/${totalCount} red-green plates normally. This is a borderline assessment result, clinical confirmation is recommended.`,
//         color: palette.earthTan,
//       };
//     }

//     if (!plateAnswers || !Array.isArray(plateAnswers)) {
//       return null;
//     }

//     const redGreenPlates = plateAnswers.filter((p: any) => {
//       return (
//         p.category === "red-green" ||
//         p.type === "ishihara" ||
//         p.plateType === "ishihara"
//       );
//     });

//     if (redGreenPlates.length === 0) return null;

//     const correctCount = redGreenPlates.filter((p: any) => p.isCorrect).length;
//     const totalCount = redGreenPlates.length;

//     if (totalCount <= 8) {
//       if (correctCount === totalCount) {
//         return {
//           key: "rg_normal",
//           isNormal: true,
//           type: "No Red-Green Deficiency",
//           title: "Red-Green Normal",
//           desc: `You answered ${correctCount}/${totalCount} plates correctly. Normal color vision demonstrated.`,
//           color: palette.sageGreen,
//         };
//       } else if (correctCount <= Math.floor(totalCount * 0.6)) {
//         return {
//           key: "rg_deficient",
//           isNormal: false,
//           type: "Likely Red-Green Deficiency",
//           title: "Red-Green Deficiency",
//           desc: `You answered only ${correctCount}/${totalCount} plates correctly. Results strongly suggest red-green color vision deficiency.`,
//           color: palette.terracotta,
//         };
//       } else {
//         return {
//           key: "rg_suspect",
//           isNormal: false,
//           type: "Borderline Red-Green Vision",
//           title: "Suspected Red-Green Issue",
//           desc: `You answered ${correctCount}/${totalCount} plates correctly. Discrepancies found; a full screening test is recommended.`,
//           color: palette.earthTan,
//         };
//       }
//     }

//     if (correctCount >= 13) {
//       return {
//         key: "rg_normal",
//         isNormal: true,
//         type: "No Red-Green Deficiency",
//         title: "Red-Green Normal",
//         desc: `You answered ${correctCount}/${totalCount} plates normally. Your red-green color vision is regarded as normal.`,
//         color: palette.sageGreen,
//       };
//     }
//     if (correctCount <= 9) {
//       return {
//         key: "rg_deficient",
//         isNormal: false,
//         type: "Likely Red-Green Deficiency",
//         title: "Red-Green Deficiency",
//         desc: `You answered only ${correctCount}/${totalCount} plates normally. The results strongly suggest red-green color vision deficiency.`,
//         color: palette.terracotta,
//       };
//     }
//     return {
//       key: "rg_suspect",
//       isNormal: false,
//       type: "Borderline Red-Green Vision",
//       title: "Suspected Red-Green Issue",
//       desc: `You answered ${correctCount}/${totalCount} plates normally. This is a borderline assessment result; clinical confirmation is recommended.`,
//       color: palette.earthTan,
//     };
//   }, [testResult]);

//   const tritanDiag = getTritanDiagnosis();
//   const rgDiag = getRedGreenDiagnosis();

//   // ─── 3. COMBINED ANALYSIS AND DESIGNATION ───────────────────────────────
//   const combinedSummary = (() => {
//     const hasRGDefect = rgDiag && !rgDiag.isNormal;
//     const hasTritanDefect = tritanDiag && !tritanDiag.isNormal;

//     if (hasRGDefect && hasTritanDefect) {
//       return {
//         title: "Dual Axis Color Deficiency",
//         subtitle: "Red-Green & Blue-Yellow Assessment",
//         type: `${rgDiag!.type} + ${tritanDiag!.type}`,
//         desc: "Anomalies were flagged across both testing methodologies. You can choose which filter configuration to view in your VR lens environment.",
//         color: palette.terracotta,
//         isDualAxis: true,
//         savedString: "Dual Axis Color Deficiency",
//       };
//     }

//     if (hasRGDefect) {
//       return {
//         title: rgDiag!.title,
//         subtitle: "Red-Green Axis Issue",
//         type: rgDiag!.type,
//         desc: rgDiag!.desc,
//         color: rgDiag!.color,
//         isDualAxis: false,
//         savedString: rgDiag!.type,
//       };
//     }

//     if (hasTritanDefect) {
//       return {
//         title: tritanDiag!.title,
//         subtitle: "Blue-Yellow Axis Issue",
//         type: tritanDiag!.type,
//         desc: tritanDiag!.desc,
//         color: tritanDiag!.color,
//         isDualAxis: false,
//         savedString: tritanDiag!.type,
//       };
//     }

//     return {
//       title: "Normal Color Vision",
//       subtitle: "Combined Deficiency Scan",
//       type: "No Deficiencies Detected",
//       desc: "Excellent performance! Both red-green discrimination and blue-yellow parameters fall within normal variations.",
//       color: palette.sageGreen,
//       isDualAxis: false,
//       savedString: "Normal Color Vision",
//     };
//   })();

//   // Handle Home navigation or prompt selection choice if dual-axis present
//   const handleReturnHome = () => {
//     if (combinedSummary.isDualAxis) {
//       setShowChoiceModal(true);
//     } else {
//       router.replace("./dashboard");
//     }
//   };

//   // Directly update specific profile types based on user choice
//   const handleSelectSimOverride = async (selectedType: string) => {
//     setShowChoiceModal(false);
//     if (user && !user.isGuest && user.uid) {
//       try {
//         await updateUserCVDType(user.uid, selectedType);
//       } catch (err) {
//         console.error("Failed to update user profile selection: ", err);
//       }
//     }
//     router.replace("./dashboard");
//   };

//   useEffect(() => {
//     isMounted.current = true;
//     const saveCVDType = async () => {
//       if (!user || user.isGuest || !user.uid || !results) return;
//       try {
//         await updateUserCVDType(user.uid, combinedSummary.savedString);
//         console.log("✅ CVD type saved", combinedSummary.savedString);
//       } catch (error) {
//         console.error("❌ Failed to save CVD type:", error);
//       }
//     };
//     saveCVDType();
//     return () => {
//       isMounted.current = false;
//     };
//   }, [user, results, combinedSummary.savedString]);

//   useEffect(() => {
//     const handleBackAction = () => {
//       router.replace("/welcome");
//       return true;
//     };

//     const backHandler = BackHandler.addEventListener(
//       "hardwareBackPress",
//       handleBackAction,
//     );

//     const unsubscribe = navigation.addListener("beforeRemove", (e) => {
//       if (e.data.action.type === "GO_BACK") {
//         e.preventDefault();
//         handleBackAction();
//       }
//     });

//     return () => {
//       backHandler.remove();
//       unsubscribe();
//     };
//   }, [navigation, router]);

//   return (
//     <View style={{ flex: 1 }}>
//       <ScrollView
//         contentContainerStyle={[
//           styles.container,
//           { backgroundColor: themeColors.background },
//         ]}
//       >
//         <View
//           style={[
//             styles.headerCard,
//             { backgroundColor: combinedSummary.color },
//           ]}
//         >
//           <View style={styles.iconPlaceholder}>
//             <Text style={{ fontSize: 30 }}>👁</Text>
//           </View>
//           <Text style={[styles.headerTitle, { fontSize: 24 * fontScale }]}>
//             {combinedSummary.title}
//           </Text>
//           <Text style={[styles.headerSubtitle, { fontSize: 14 * fontScale }]}>
//             {combinedSummary.subtitle}
//           </Text>
//         </View>

//         <View style={styles.content}>
//           <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
//             <Text style={[styles.cardLabel, { color: themeColors.subText }]}>
//               OVERALL STATUS
//             </Text>
//             <View style={styles.resultRow}>
//               <Text
//                 style={[
//                   styles.resultText,
//                   { color: themeColors.text, fontSize: 18 * fontScale },
//                 ]}
//               >
//                 {combinedSummary.type}
//               </Text>
//               <View
//                 style={[
//                   styles.statusDot,
//                   { backgroundColor: combinedSummary.color },
//                 ]}
//               />
//             </View>
//             <Text
//               style={[
//                 styles.desc,
//                 {
//                   color: themeColors.text,
//                   marginTop: 10,
//                   fontSize: 15 * fontScale,
//                 },
//               ]}
//             >
//               {combinedSummary.desc}
//             </Text>
//           </View>

//           {/* AXIS A: BLUE-YELLOW BLOCK */}
//           <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
//             <Text
//               style={[
//                 styles.cardLabel,
//                 { color: themeColors.subText, marginBottom: 12 },
//               ]}
//             >
//               BLUE-YELLOW (TRITAN) ACCURACY
//             </Text>
//             <View style={styles.statRow}>
//               <View style={{ flex: 1, paddingRight: 8 }}>
//                 <Text
//                   style={[
//                     styles.statLabel,
//                     { color: themeColors.text, fontSize: 16 * fontScale },
//                   ]}
//                 >
//                   {tritanDiag.title}
//                 </Text>
//                 <Text
//                   style={[
//                     styles.desc,
//                     {
//                       color: themeColors.subText,
//                       fontSize: 13 * fontScale,
//                       marginTop: 4,
//                     },
//                   ]}
//                 >
//                   {tritanDiag.desc}
//                 </Text>
//               </View>
//               <Text
//                 style={[
//                   styles.statValue,
//                   {
//                     color:
//                       byPercent < 60 ? palette.terracotta : palette.sageGreen,
//                     fontSize: 22 * fontScale,
//                   },
//                 ]}
//               >
//                 {Math.round(byPercent)}%
//               </Text>
//             </View>
//             <View
//               style={[styles.divider, { backgroundColor: themeColors.border }]}
//             />
//             <View style={styles.statRow}>
//               <View>
//                 <Text
//                   style={[
//                     styles.statLabel,
//                     { color: themeColors.text, fontSize: 14 * fontScale },
//                   ]}
//                 >
//                   Tritan Error Metrics
//                 </Text>
//                 <Text
//                   style={[styles.statSubLabel, { color: themeColors.subText }]}
//                 >
//                   Lower numerical weights signify superior alignment
//                 </Text>
//               </View>
//               <Text
//                 style={[
//                   styles.statValue,
//                   { color: themeColors.text, fontSize: 18 * fontScale },
//                 ]}
//               >
//                 {Math.round(testResult.tritanWeightedScore)}
//               </Text>
//             </View>
//           </View>

//           {/* AXIS B: RED-GREEN BLOCK */}
//           {rgDiag && (
//             <View
//               style={[styles.card, { backgroundColor: themeColors.cardBg }]}
//             >
//               <Text
//                 style={[
//                   styles.cardLabel,
//                   { color: themeColors.subText, marginBottom: 12 },
//                 ]}
//               >
//                 RED-GREEN CHECK
//               </Text>
//               <View style={styles.resultRow}>
//                 <Text
//                   style={[
//                     styles.statLabel,
//                     { color: themeColors.text, fontSize: 16 * fontScale },
//                   ]}
//                 >
//                   {rgDiag.title}
//                 </Text>
//                 <View
//                   style={[styles.statusDot, { backgroundColor: rgDiag.color }]}
//                 />
//               </View>
//               <Text
//                 style={[
//                   styles.desc,
//                   {
//                     color: themeColors.text,
//                     marginTop: 8,
//                     fontSize: 14 * fontScale,
//                   },
//                 ]}
//               >
//                 {rgDiag.desc}
//               </Text>
//             </View>
//           )}

//           <Text
//             style={[
//               styles.disclaimer,
//               { color: themeColors.subText, fontSize: 12 * fontScale },
//             ]}
//           >
//             * This is a screening tool, not a medical diagnosis.
//           </Text>

//           <View style={styles.buttonContainer}>
//             <TouchableOpacity
//               style={[
//                 styles.button,
//                 styles.secondaryButton,
//                 { borderColor: themeColors.border },
//               ]}
//               onPress={() => router.push("./difficulty")}
//             >
//               <Text
//                 style={[
//                   styles.buttonText,
//                   { color: themeColors.text, fontSize: 16 * fontScale },
//                 ]}
//               >
//                 Try Again
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.button,
//                 styles.primaryButton,
//                 { backgroundColor: palette.softBlack },
//               ]}
//               onPress={handleReturnHome}
//             >
//               <Text
//                 style={[
//                   styles.buttonText,
//                   { color: "white", fontSize: 16 * fontScale },
//                 ]}
//               >
//                 Return Home
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>

//       {/* DUAL AXIS VISION OVERRIDE MODAL */}
//       <Modal
//         visible={showChoiceModal}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setShowChoiceModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View
//             style={[
//               styles.modalContent,
//               { backgroundColor: themeColors.cardBg },
//             ]}
//           >
//             <Text
//               style={[
//                 styles.modalTitle,
//                 { color: themeColors.text, fontSize: 20 * fontScale },
//               ]}
//             >
//               Choose Your VR Lens Simulation
//             </Text>
//             <Text
//               style={[
//                 styles.modalDesc,
//                 { color: themeColors.subText, fontSize: 14 * fontScale },
//               ]}
//             >
//               Our systems detected anomalies on both visual color axes. Select
//               which filter you want active by default in the simulator. You can
//               alter this anytime inside parameters.
//             </Text>

//             <TouchableOpacity
//               style={[
//                 styles.choiceButton,
//                 { backgroundColor: palette.terracotta },
//               ]}
//               onPress={() =>
//                 handleSelectSimOverride(
//                   rgDiag?.type || "Likely Red-Green Deficiency",
//                 )
//               }
//             >
//               <Text style={styles.choiceButtonText}>
//                 Simulate Red-Green Deficiency
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.choiceButton,
//                 { backgroundColor: palette.earthTan },
//               ]}
//               onPress={() => handleSelectSimOverride(tritanDiag.type)}
//             >
//               <Text style={styles.choiceButtonText}>
//                 Simulate Blue-Yellow (Tritan)
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.cancelButton, { borderColor: themeColors.border }]}
//               onPress={() =>
//                 handleSelectSimOverride("Dual Axis Color Deficiency")
//               }
//             >
//               <Text
//                 style={[styles.cancelButtonText, { color: themeColors.text }]}
//               >
//                 Keep Both (Unfiltered View)
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, paddingTop: 20, paddingBottom: 40 },
//   headerCard: {
//     marginHorizontal: 20,
//     marginTop: 20,
//     paddingVertical: 35,
//     paddingHorizontal: 20,
//     borderRadius: 30,
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 3,
//   },
//   iconPlaceholder: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "rgba(255,255,255,0.2)",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 15,
//   },
//   headerTitle: {
//     fontWeight: "800",
//     marginBottom: 5,
//     textAlign: "center",
//     color: "#FFFFFF",
//   },
//   headerSubtitle: {
//     color: "rgba(255,255,255,0.9)",
//     fontWeight: "600",
//     textTransform: "uppercase",
//     letterSpacing: 1,
//   },
//   content: { padding: 20 },
//   card: { borderRadius: 24, padding: 24, marginBottom: 20, elevation: 1 },
//   cardLabel: {
//     fontSize: 11,
//     fontWeight: "700",
//     letterSpacing: 1,
//     textTransform: "uppercase",
//   },
//   resultRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: 6,
//   },
//   resultText: { fontWeight: "800", flex: 1, marginRight: 10 },
//   statusDot: { width: 12, height: 12, borderRadius: 6 },
//   desc: { fontSize: 15, lineHeight: 22, fontWeight: "400" },
//   statRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 6,
//   },
//   statLabel: { fontWeight: "700" },
//   statSubLabel: { fontSize: 12, marginTop: 2, maxWidth: "80%" },
//   statValue: { fontWeight: "800" },
//   divider: { height: 1, marginVertical: 14 },
//   disclaimer: { textAlign: "center", marginBottom: 30, fontStyle: "italic" },
//   buttonContainer: { gap: 12 },
//   button: {
//     paddingVertical: 18,
//     borderRadius: 30,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   secondaryButton: { backgroundColor: "transparent", borderWidth: 1 },
//   primaryButton: {},
//   buttonText: { fontWeight: "700" },

//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 24,
//   },
//   modalContent: {
//     width: "100%",
//     borderRadius: 24,
//     padding: 24,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontWeight: "800",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   modalDesc: {
//     textAlign: "center",
//     lineHeight: 20,
//     marginBottom: 24,
//   },
//   choiceButton: {
//     paddingVertical: 16,
//     borderRadius: 20,
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   choiceButtonText: {
//     color: "#FFFFFF",
//     fontWeight: "700",
//     fontSize: 15,
//   },
//   cancelButton: {
//     paddingVertical: 16,
//     borderRadius: 20,
//     alignItems: "center",
//     borderWidth: 1,
//     marginTop: 4,
//   },
//   cancelButtonText: {
//     fontWeight: "600",
//     fontSize: 15,
//   },
// });
