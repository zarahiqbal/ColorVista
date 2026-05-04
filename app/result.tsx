// import { useNavigation } from '@react-navigation/native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import { BackHandler, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { useAuth } from '../Context/AuthContext';
// import { updateUserCVDType } from '../Context/cvdService';
// import { useTheme } from '../Context/ThemeContext';

// export default function ResultScreen() {
//   const router = useRouter();
//   const { darkMode, getFontSizeMultiplier } = useTheme();
//   const fontScale = getFontSizeMultiplier();
//   const { user } = useAuth();
//   const { results } = useLocalSearchParams();
//   const [isSaving, setIsSaving] = useState(false);

//   let scores = { redGreen: { correct: 0, total: 0 }, blueYellow: { correct: 0, total: 0 } };

//   try {
//     scores = JSON.parse(results as string);
//   } catch (e) {
//     console.error('Failed to parse results:', e);
//   }

//   // --- PALETTE EXTRACTED FROM IMAGE ---
//   const palette = {
//     cream: '#F9F8F4',
//     white: '#FFFFFF',
//     sageGreen: '#8FA395',
//     earthTan: '#B09B81',
//     terracotta: '#C77D63',
//     softBlack: '#2D2D2D',
//     grey: '#8E8E93',
//     lightBorder: '#EFEFEF'
//   };

//   const themeColors = {
//     background: darkMode ? '#121212' : palette.cream,
//     text: darkMode ? '#FFFFFF' : palette.softBlack,
//     cardBg: darkMode ? '#1E1E1E' : palette.white,
//     subText: darkMode ? '#AAAAAA' : palette.grey,
//     border: darkMode ? '#333333' : palette.lightBorder,
//   };

//   const getPercent = (category: string) => {
//     const s = scores[category as keyof typeof scores];
//     if (s.total === 0) return 100;
//     return (s.correct / s.total) * 100;
//   };

//   const rgPercent = getPercent('redGreen');
//   const byPercent = getPercent('blueYellow');

//   // --- UPDATED LOGIC FOR SPECIFIC CVD TYPES ---
//   const getDiagnosis = () => {
//     // 1. Check for Protanopia / Deuteranopia (Red-Green issues)
//     if (rgPercent <= 60 && byPercent > 80) {
//       return {
//         type: "Protanopia / Deuteranopia", // Explicitly naming the types
//         title: "Red-Green Deficiency",
//         subtitle: "Vision Analysis",
//         desc: "The test detected a strong difficulty distinguishing red and green hues. This is consistent with Protanopia (Red-Blind) or Deuteranopia (Green-Blind).",
//         color: palette.earthTan
//       };
//     }

//     // 2. Check for Tritanopia (Blue-Yellow issues)
//     if (byPercent <= 60 && rgPercent > 80) {
//       return {
//         type: "Tritanopia", // Explicitly naming the type
//         title: "Blue-Yellow Deficiency",
//         subtitle: "Vision Analysis",
//         desc: "The test detected difficulty distinguishing blue and yellow hues. This is consistent with Tritanopia (Blue-Blind).",
//         color: palette.earthTan
//       };
//     }

//     // 3. Check for Total/Severe issues
//     if (byPercent <= 60 && rgPercent <= 60) {
//       return {
//         type: "Severe CVD", // Broad category for complex cases
//         title: "Significant Deficiency",
//         subtitle: "Vision Analysis",
//         desc: "Your results indicate difficulties across the entire color spectrum.",
//         color: palette.terracotta
//       };
//     }

//     // 4. Default to Normal
//     return {
//       type: "Normal Vision", // Explicitly naming the type
//       title: "No Deficiency",
//       subtitle: "Vision Analysis",
//       desc: "You correctly identified the patterns across all color spectrums.",
//       color: palette.sageGreen
//     };
//   };

//   // Save CVD type to Firebase when user is authenticated
//   useEffect(() => {
//     const saveCVDType = async () => {
//       console.log('Attempting to save CVD type. User:', user?.uid, 'isGuest:', user?.isGuest);

//       if (!user || user.isGuest || !user.uid) {
//         console.log('Skipping save: No authenticated user');
//         return; // Don't save for guest users
//       }

//       try {
//         setIsSaving(true);
//         const diagnosis = getDiagnosis();
//         console.log('Diagnosis determined:', diagnosis.type);
//         console.log('Saving CVD type for user:', user.uid);

//         await updateUserCVDType(user.uid, diagnosis.type);
//         console.log('✅ CVD type saved to Firebase:', diagnosis.type);
//       } catch (error) {
//         console.error('❌ Failed to save CVD type:', error);
//       } finally {
//         setIsSaving(false);
//       }
//     };

//     // Only save if we have valid user data and results
//     if (results) {
//       saveCVDType();
//     }
//   }, [user, results]);

//   // Intercept hardware back (Android) and header/back navigation to go to Welcome
//   useEffect(() => {
//     const goToWelcome = () => {
//       try {
//         router.replace('/welcome');
//       } catch (e) {
//         // fallback to push
//         router.push('/welcome');
//       }
//       return true; // prevent default
//     };

//     // Android hardware back
//     if (Platform.OS === 'android') {
//       const sub = BackHandler.addEventListener('hardwareBackPress', goToWelcome);
//       return () => sub.remove();
//     }

//     return undefined;
//   }, [router]);

//   // Also listen for navigation 'beforeRemove' so header back presses also redirect
//   const navigation = useNavigation();
//   useEffect(() => {
//     const beforeRemove = (e: any) => {
//       e.preventDefault();
//       try {
//         router.replace('/welcome');
//       } catch (err) {
//         router.push('/welcome');
//       }
//     };

//     const unsubscribe = navigation.addListener('beforeRemove', beforeRemove as any);
//     return unsubscribe;
//   }, [navigation, router]);

//   const diagnosis = getDiagnosis();

//   return (
//     <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColors.background }]}>

//       {/* Header Card */}
//       <View style={[styles.headerCard, { backgroundColor: diagnosis.color }]}>
//         <View style={styles.iconPlaceholder}>
//            <Text style={{fontSize: 30}}>👁</Text>
//         </View>
//         <Text style={[styles.headerTitle, { fontSize: 24 * fontScale }]}>{diagnosis.title}</Text>
//         <Text style={[styles.headerSubtitle, { fontSize: 14 * fontScale }]}>{diagnosis.subtitle}</Text>
//       </View>

//       <View style={styles.content}>

//         {/* SPECIFIC TYPE DETECTION CARD */}
//         <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
//             <Text style={[styles.cardLabel, { color: themeColors.subText }]}>DETECTED TYPE</Text>

//             <View style={styles.resultRow}>
//                 <Text style={[styles.resultText, { color: themeColors.text, fontSize: 20 * fontScale }]}>
//                     {diagnosis.type}
//                 </Text>
//                 {/* Visual Status Dot */}
//                 <View style={[styles.statusDot, { backgroundColor: diagnosis.color }]} />
//             </View>

//             <Text style={[styles.desc, { color: themeColors.text, marginTop: 10, fontSize: 16 * fontScale }]}>
//                 {diagnosis.desc}
//             </Text>
//         </View>

//         {/* Breakdown Card */}
//         <View style={[styles.card, { backgroundColor: themeColors.cardBg }]}>
//           <Text style={[styles.cardLabel, { color: themeColors.subText, marginBottom: 15 }]}>ACCURACY BREAKDOWN</Text>

//           <View style={styles.statRow}>
//             <View>
//                 <Text style={[styles.statLabel, { color: themeColors.text, fontSize: 16 * fontScale }]}>Red-Green</Text>
//                 <Text style={[styles.statSubLabel, { color: themeColors.subText }]}>Protan / Deutan</Text>
//             </View>
//             <Text style={[styles.statValue, { color: rgPercent < 60 ? palette.terracotta : palette.sageGreen, fontSize: 20 * fontScale }]}>
//               {Math.round(rgPercent)}%
//             </Text>
//           </View>

//           <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

//           <View style={styles.statRow}>
//              <View>
//                 <Text style={[styles.statLabel, { color: themeColors.text, fontSize: 16 * fontScale }]}>Blue-Yellow</Text>
//                 <Text style={[styles.statSubLabel, { color: themeColors.subText }]}>Tritan</Text>
//             </View>
//             <Text style={[styles.statValue, { color: byPercent < 60 ? palette.terracotta : palette.sageGreen, fontSize: 20 * fontScale }]}>
//               {Math.round(byPercent)}%
//             </Text>
//           </View>
//         </View>

//         <Text style={[styles.disclaimer, { color: themeColors.subText, fontSize: 12 * fontScale }]}>
//           * This is a screening tool, not a medical diagnosis.
//         </Text>

//         {/* DUAL BUTTONS */}
//         <View style={styles.buttonContainer}>
//             {/* Try Again Button (Secondary) */}
//             <TouchableOpacity
//               style={[styles.button, styles.secondaryButton, { borderColor: themeColors.border }]}
//               onPress={() => router.push('/difficulty')}
//             >
//               <Text style={[styles.buttonText, { color: themeColors.text, fontSize: 16 * fontScale }]}>Try Again</Text>
//             </TouchableOpacity>

//             {/* Home Button (Primary) */}
//             <TouchableOpacity
//               style={[styles.button, styles.primaryButton, { backgroundColor: palette.softBlack }]}
//               onPress={() => router.replace('/dashboard')}
//             >
//               <Text style={[styles.buttonText, { color: 'white', fontSize: 16 * fontScale }]}>Return Home</Text>
//             </TouchableOpacity>
//         </View>

//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     paddingTop: 20,
//     paddingBottom: 40
//   },
//   headerCard: {
//     marginHorizontal: 20,
//     marginTop: 20,
//     paddingVertical: 40,
//     paddingHorizontal: 20,
//     borderRadius: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   iconPlaceholder: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 15
//   },
//   headerTitle: {
//     fontWeight: '800',
//     marginBottom: 5,
//     textAlign: 'center',
//     color: '#FFFFFF'
//   },
//   headerSubtitle: {
//     color: 'rgba(255,255,255,0.9)',
//     fontWeight: '600',
//     textTransform: 'uppercase',
//     letterSpacing: 1,
//     fontSize: 12
//   },
//   content: {
//     padding: 20
//   },
//   card: {
//     borderRadius: 24,
//     padding: 24,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.03,
//     shadowRadius: 8,
//     elevation: 1,
//   },
//   cardLabel: {
//     fontSize: 12,
//     fontWeight: '700',
//     letterSpacing: 1,
//     marginBottom: 10,
//     textTransform: 'uppercase'
//   },
//   resultRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 5
//   },
//   resultText: {
//     fontWeight: '800',
//     flex: 1,
//     marginRight: 10
//   },
//   statusDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//   },
//   desc: {
//     fontSize: 16,
//     lineHeight: 24,
//     fontWeight: '400'
//   },
//   statRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10
//   },
//   statLabel: {
//     fontWeight: '600'
//   },
//   statSubLabel: {
//     fontSize: 12,
//     marginTop: 2
//   },
//   statValue: {
//     fontWeight: '800'
//   },
//   divider: {
//     height: 1,
//     marginVertical: 10
//   },
//   disclaimer: {
//     textAlign: 'center',
//     marginBottom: 30,
//     fontStyle: 'italic',
//     paddingHorizontal: 20
//   },
//   buttonContainer: {
//     gap: 12,
//   },
//   button: {
//     paddingVertical: 18,
//     borderRadius: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   primaryButton: {
//       // Background set inline
//   },
//   secondaryButton: {
//       backgroundColor: 'transparent',
//       borderWidth: 1,
//       elevation: 0,
//       shadowOpacity: 0
//   },
//   buttonText: {
//     fontWeight: '700'
//   }
// });
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
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
  const [isSaving, setIsSaving] = useState(false);
  const isMounted = useRef(true);

  // Parse Scores Safely
  let scores = {
    redGreen: { correct: 0, total: 0 },
    blueYellow: { correct: 0, total: 0 },
  };
  try {
    if (results) {
      scores = JSON.parse(results as string);
    }
  } catch (e) {
    console.error("Failed to parse results:", e);
  }

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

  const getPercent = (category: "redGreen" | "blueYellow") => {
    const s = scores[category];
    if (!s || s.total === 0) return 100;
    return (s.correct / s.total) * 100;
  };

  const rgPercent = getPercent("redGreen");
  const byPercent = getPercent("blueYellow");

  const getDiagnosis = useCallback(() => {
    if (rgPercent <= 60 && byPercent > 80) {
      return {
        type: "Protanopia / Deuteranopia",
        title: "Red-Green Deficiency",
        subtitle: "Vision Analysis",
        desc: "The test detected a strong difficulty distinguishing red and green hues. This is consistent with Protanopia or Deuteranopia.",
        color: palette.earthTan,
      };
    }
    if (byPercent <= 60 && rgPercent > 80) {
      return {
        type: "Tritanopia",
        title: "Blue-Yellow Deficiency",
        subtitle: "Vision Analysis",
        desc: "The test detected difficulty distinguishing blue and yellow hues. This is consistent with Tritanopia (Blue-Blind).",
        color: palette.earthTan,
      };
    }
    if (byPercent <= 60 && rgPercent <= 60) {
      return {
        type: "Severe CVD",
        title: "Significant Deficiency",
        subtitle: "Vision Analysis",
        desc: "Your results indicate difficulties across the entire color spectrum.",
        color: palette.terracotta,
      };
    }
    return {
      type: "Normal Vision",
      title: "No Deficiency",
      subtitle: "Vision Analysis",
      desc: "You correctly identified the patterns across all color spectrums.",
      color: palette.sageGreen,
    };
  }, [rgPercent, byPercent]);

  const diagnosis = getDiagnosis();

  // Save to Firebase
  useEffect(() => {
    isMounted.current = true;
    const saveCVDType = async () => {
      if (!user || user.isGuest || !user.uid || !results) return;

      try {
        setIsSaving(true);
        await updateUserCVDType(user.uid, diagnosis.type);
        console.log("✅ CVD type saved");
      } catch (error) {
        console.error("❌ Failed to save CVD type:", error);
      } finally {
        if (isMounted.current) setIsSaving(false);
      }
    };

    saveCVDType();
    return () => {
      isMounted.current = false;
    };
  }, [user, results, diagnosis.type]);

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
            ACCURACY BREAKDOWN
          </Text>
          <View style={styles.statRow}>
            <View>
              <Text
                style={[
                  styles.statLabel,
                  { color: themeColors.text, fontSize: 16 * fontScale },
                ]}
              >
                Red-Green
              </Text>
              <Text
                style={[styles.statSubLabel, { color: themeColors.subText }]}
              >
                Protan / Deutan
              </Text>
            </View>
            <Text
              style={[
                styles.statValue,
                {
                  color:
                    rgPercent < 60 ? palette.terracotta : palette.sageGreen,
                  fontSize: 20 * fontScale,
                },
              ]}
            >
              {Math.round(rgPercent)}%
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
                Blue-Yellow
              </Text>
              <Text
                style={[styles.statSubLabel, { color: themeColors.subText }]}
              >
                Tritan
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
        </View>

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
            onPress={() => router.push("/difficulty")}
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
            onPress={() => router.replace("/dashboard")}
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
