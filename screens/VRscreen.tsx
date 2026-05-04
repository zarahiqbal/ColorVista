// import { RootStackParamList } from "@/app/vrrouter";
// import { useTheme } from "@/Context/ThemeContext";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { useEffect, useRef, useState } from "react";
// import {
//   Animated,
//   Dimensions,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// type Props = NativeStackScreenProps<RootStackParamList, "VRSimulation">;

// type SimulationType = "Protanopia" | "Deuteranopia" | "Tritanopia";

// const { width } = Dimensions.get("window");

// const CVD_DETAILS: Record<
//   SimulationType,
//   { description: string; spectrum: string }
// > = {
//   Protanopia: {
//     description:
//       "Reds appear darker and shifted toward black/dark brown. Red-green discrimination is severely impaired.",
//     spectrum: "Red wavelengths are missing or reduced.",
//   },
//   Deuteranopia: {
//     description:
//       "Greens are shifted to yellows/browns. Red-green discrimination is impaired.",
//     spectrum: "Green-sensitive cones are affected.",
//   },
//   Tritanopia: {
//     description:
//       "Blues appear greenish and yellows pinkish. Blue-yellow discrimination is impaired.",
//     spectrum: "Short wavelength cones are absent.",
//   },
// };

// const SPECTRUM_COLORS: Record<SimulationType, string[]> = {
//   Protanopia: [
//     "#6600cc",
//     "#0000ff",
//     "#00ccff",
//     "#00ff00",
//     "#cccc00",
//     "#996600",
//     "#333300",
//   ],
//   Deuteranopia: [
//     "#6600cc",
//     "#0000ff",
//     "#00ccff",
//     "#888800",
//     "#aa6600",
//     "#cc4400",
//     "#880000",
//   ],
//   Tritanopia: [
//     "#336600",
//     "#669900",
//     "#cccc00",
//     "#ff9900",
//     "#ff6600",
//     "#ff3300",
//     "#990000",
//   ],
// };

// export default function VRScreen(_props: Props) {
//   const { darkMode, getFontSizeMultiplier, colorBlindMode, setColorBlindMode } =
//     useTheme();

//   const [activeTab, setActiveTab] = useState<SimulationType>(
//     colorBlindMode === "None" ? "Deuteranopia" : colorBlindMode,
//   );

//   const [showCVDCard, setShowCVDCard] = useState(true);

//   const [activeNav, setActiveNav] = useState<
//     "Customization" | "History Tracking" | "Privacy Focus"
//   >("Customization");

//   const scaleAnim = useRef(new Animated.Value(1)).current;

//   const scale = getFontSizeMultiplier();

//   // Sync global theme -> screen
//   useEffect(() => {
//     if (colorBlindMode !== "None") {
//       setActiveTab(colorBlindMode);
//     }
//   }, [colorBlindMode]);

//   const handleTabPress = (tab: SimulationType) => {
//     setActiveTab(tab);
//     setColorBlindMode(tab);
//     setShowCVDCard(true);
//   };

//   const handleEnterVR = () => {
//     Animated.sequence([
//       Animated.timing(scaleAnim, {
//         toValue: 0.96,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//       Animated.timing(scaleAnim, {
//         toValue: 1,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   const themeColors = {
//     background: darkMode ? "#121212" : "#f5ede3",
//     card: darkMode ? "#1e1e1e" : "#ffffff",
//     text: darkMode ? "#ffffff" : "#1a1a1a",
//     subText: darkMode ? "#cccccc" : "#555",
//     border: darkMode ? "#333" : "#ccc",
//   };

//   const cvd = CVD_DETAILS[activeTab];

//   return (
//     <SafeAreaView
//       style={[styles.safe, { backgroundColor: themeColors.background }]}
//     >
//       <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

//       {/* Top Bar */}
//       <View style={styles.topBar}>
//         <Text style={[styles.screenTitle, { color: themeColors.text }]}>
//           VR Simulation
//         </Text>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* Card */}
//         <View style={[styles.card, { backgroundColor: themeColors.card }]}>
//           <Text
//             style={[
//               styles.cardTitle,
//               { color: themeColors.text, fontSize: 20 * scale },
//             ]}
//           >
//             Select Simulation
//           </Text>

//           {/* Tabs */}
//           <View style={styles.tabRow}>
//             {(
//               ["Protanopia", "Deuteranopia", "Tritanopia"] as SimulationType[]
//             ).map((tab) => (
//               <TouchableOpacity
//                 key={tab}
//                 style={[
//                   styles.tab,
//                   activeTab === tab && styles.tabActive,
//                   { borderColor: themeColors.border },
//                 ]}
//                 onPress={() => handleTabPress(tab)}
//               >
//                 <Text
//                   style={[
//                     styles.tabText,
//                     { color: themeColors.subText },
//                     activeTab === tab && { color: themeColors.text },
//                   ]}
//                 >
//                   {tab}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Viewport */}
//           <View style={styles.viewportWrapper}>
//             <View style={styles.roomScene}>
//               <View style={styles.floor} />
//               <View style={styles.windowBg} />

//               {/* Sofa */}
//               <View style={styles.sofa} />

//               {/* LIVE Label */}
//               <View style={styles.liveLabel}>
//                 <Text style={styles.liveLabelText}>LIVE VR Viewport</Text>
//               </View>

//               {/* Overlay */}
//               <View style={styles.viewportOverlay}>
//                 <Text style={styles.viewportOverlayText}>
//                   Camera feed filtered for {activeTab}
//                 </Text>
//               </View>

//               {/* CVD Card */}
//               {showCVDCard && (
//                 <View style={styles.cvdCard}>
//                   <Text style={styles.cvdCardTitle}>CVD Details</Text>
//                   <Text style={styles.cvdCardBody}>{cvd.description}</Text>

//                   {/* Spectrum */}
//                   <View style={styles.spectrumBar}>
//                     {SPECTRUM_COLORS[activeTab].map((c, i) => (
//                       <View
//                         key={i}
//                         style={[styles.spectrumSlice, { backgroundColor: c }]}
//                       />
//                     ))}
//                   </View>
//                 </View>
//               )}
//             </View>
//           </View>

//           {/* Button */}
//           <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
//             <TouchableOpacity style={styles.primaryBtn} onPress={handleEnterVR}>
//               <Text style={styles.primaryBtnText}>Enter Full-Screen VR</Text>
//             </TouchableOpacity>
//           </Animated.View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   safe: { flex: 1 },

//   topBar: {
//     padding: 16,
//     alignItems: "center",
//   },

//   screenTitle: {
//     fontSize: 24,
//     fontWeight: "800",
//   },

//   scrollContent: {
//     padding: 16,
//   },

//   card: {
//     borderRadius: 20,
//     padding: 16,
//   },

//   cardTitle: {
//     fontWeight: "700",
//     marginBottom: 12,
//   },

//   tabRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginBottom: 12,
//   },

//   tab: {
//     flex: 1,
//     padding: 10,
//     borderRadius: 20,
//     borderWidth: 1,
//     alignItems: "center",
//   },

//   tabActive: {
//     backgroundColor: "#ddd",
//   },

//   tabText: {
//     fontSize: 12,
//     fontWeight: "600",
//   },

//   viewportWrapper: {
//     height: 260,
//     borderRadius: 16,
//     overflow: "hidden",
//     marginBottom: 12,
//   },

//   roomScene: {
//     flex: 1,
//     backgroundColor: "#b8c8a0",
//   },

//   floor: {
//     position: "absolute",
//     bottom: 0,
//     height: 80,
//     width: "100%",
//     backgroundColor: "#c8a870",
//   },

//   windowBg: {
//     position: "absolute",
//     top: 0,
//     height: 150,
//     width: "100%",
//     backgroundColor: "#a8c090",
//   },

//   sofa: {
//     position: "absolute",
//     bottom: 40,
//     left: 60,
//     width: 120,
//     height: 50,
//     backgroundColor: "#7a9a6a",
//     borderRadius: 10,
//   },

//   liveLabel: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     backgroundColor: "#fff",
//     padding: 4,
//     borderRadius: 8,
//   },

//   liveLabelText: {
//     fontSize: 10,
//     fontWeight: "600",
//   },

//   viewportOverlay: {
//     position: "absolute",
//     top: 20,
//     left: 10,
//   },

//   viewportOverlayText: {
//     color: "#fff",
//     fontWeight: "600",
//   },

//   cvdCard: {
//     position: "absolute",
//     bottom: 10,
//     right: 10,
//     width: width * 0.45,
//     backgroundColor: "#fff",
//     padding: 8,
//     borderRadius: 10,
//   },

//   cvdCardTitle: {
//     fontWeight: "700",
//     fontSize: 12,
//   },

//   cvdCardBody: {
//     fontSize: 10,
//     marginVertical: 4,
//   },

//   spectrumBar: {
//     flexDirection: "row",
//     height: 10,
//     borderRadius: 5,
//     overflow: "hidden",
//   },

//   spectrumSlice: {
//     flex: 1,
//   },

//   primaryBtn: {
//     backgroundColor: "#000",
//     padding: 14,
//     borderRadius: 14,
//     alignItems: "center",
//   },

//   primaryBtnText: {
//     color: "#fff",
//     fontWeight: "700",
//   },
// });
import { RootStackParamList } from "@/app/vrrouter";
import BackButton from "@/components/BackButton";
import { useTheme } from "@/Context/ThemeContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRef, useState } from "react";
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "VRSimulation">;
type SimulationType = "Protanopia" | "Deuteranopia" | "Tritanopia";

const CVD_DETAILS: Record<
  SimulationType,
  { description: string; spectrum: string }
> = {
  Protanopia: {
    description:
      "Reds appear darker and shifted toward black/dark brown. Red-green discrimination is severely impaired.",
    spectrum: "Red wavelengths are missing or reduced.",
  },
  Deuteranopia: {
    description:
      "Greens are shifted to yellows/browns. Red-green discrimination is impaired.",
    spectrum: "Green-sensitive cones are affected.",
  },
  Tritanopia: {
    description:
      "Blues appear greenish and yellows pinkish. Blue-yellow discrimination is impaired.",
    spectrum: "Short wavelength cones are absent.",
  },
};

const SPECTRUM_COLORS: Record<SimulationType, string[]> = {
  Protanopia: [
    "#6600cc",
    "#0000ff",
    "#00ccff",
    "#00ff00",
    "#cccc00",
    "#996600",
    "#333300",
  ],
  Deuteranopia: [
    "#6600cc",
    "#0000ff",
    "#00ccff",
    "#888800",
    "#aa6600",
    "#cc4400",
    "#880000",
  ],
  Tritanopia: [
    "#336600",
    "#669900",
    "#cccc00",
    "#ff9900",
    "#ff6600",
    "#ff3300",
    "#990000",
  ],
};

export default function VRScreen({ navigation }: Props) {
  const { darkMode, getFontSizeMultiplier, colorBlindMode } = useTheme();

  // ONLY allow the stored mode. If None, default to Deuteranopia but keep it locked.
  const initialMode =
    colorBlindMode === "None"
      ? "Deuteranopia"
      : (colorBlindMode as SimulationType);
  const [activeTab] = useState<SimulationType>(initialMode);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fontScale = getFontSizeMultiplier() || 1;

  const handleEnterVR = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate("VRFullScreenCamera");
    });
  };

  const themeColors = {
    background: darkMode ? "#000000" : "#F2F2F2",
    card: darkMode ? "#111111" : "#FFFFFF",
    text: darkMode ? "#FFFFFF" : "#000000",
    subText: darkMode ? "#888888" : "#666666",
    accent: darkMode ? "#3a3a3c" : "#3a3a3c", // High contrast Black/White
    border: darkMode ? "#222222" : "#E5E5E5",
  };

  const cvd = CVD_DETAILS[activeTab];

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: themeColors.background }]}
    >
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      <View style={styles.header}>
        <BackButton />
        <Text style={[styles.screenTitle, { color: themeColors.text }]}>
          VR Simulation
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* VIEWPORT SECTION */}
        <View
          style={[
            styles.viewportWrapper,
            { borderColor: themeColors.border, borderWidth: 1 },
          ]}
        >
          <View style={styles.roomScene}>
            <View style={styles.floor} />
            <View style={styles.windowBg} />
            <View style={styles.sofa} />

            <View style={styles.liveBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.liveText}>
                ACTIVE FILTER: {activeTab.toUpperCase()}
              </Text>
            </View>

            <View
              style={[
                styles.hudCard,
                {
                  backgroundColor: darkMode
                    ? "rgba(0,0,0,0.85)"
                    : "rgba(255,255,255,0.95)",
                },
              ]}
            >
              <Text style={[styles.hudTitle, { color: themeColors.text }]}>
                {activeTab}
              </Text>
              <Text style={[styles.hudBody, { color: themeColors.subText }]}>
                {cvd.description}
              </Text>
              <View style={styles.spectrumBar}>
                {SPECTRUM_COLORS[activeTab].map((c, i) => (
                  <View
                    key={i}
                    style={[styles.spectrumSlice, { backgroundColor: c }]}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* LOCKED SELECTION VIEW */}
        <View
          style={[styles.controlCard, { backgroundColor: themeColors.card }]}
        >
          <View style={styles.tabRow}>
            {(
              ["Protanopia", "Deuteranopia", "Tritanopia"] as SimulationType[]
            ).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <View
                  key={tab}
                  style={[
                    styles.tabButton,
                    { borderColor: themeColors.border },
                    isActive && {
                      backgroundColor: themeColors.accent,
                      borderColor: themeColors.accent,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabLabel,
                      {
                        color: isActive
                          ? darkMode
                            ? "#FFF"
                            : "#FFF"
                          : themeColors.subText,
                        opacity: isActive ? 1 : 0.4,
                      },
                    ]}
                  >
                    {tab}
                  </Text>
                </View>
              );
            })}
          </View>

          <Animated.View
            style={{ transform: [{ scale: scaleAnim }], marginTop: 20 }}
          >
            <TouchableOpacity
              style={[
                styles.primaryBtn,
                { backgroundColor: themeColors.accent },
              ]}
              onPress={handleEnterVR}
            >
              <Text
                style={[
                  styles.primaryBtnText,
                  { color: darkMode ? "#FFF" : "#FFF" },
                ]}
              >
                Start Fullscreen VR
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 20,
  },
  scrollContent: {
    padding: 20,
  },
  viewportWrapper: {
    height: 380,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 20,
  },
  roomScene: {
    flex: 1,
    backgroundColor: "#b8c8a0",
    justifyContent: "flex-end",
    padding: 20,
  },
  liveBadge: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF0000",
    marginRight: 8,
  },
  liveText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },
  hudCard: {
    borderRadius: 16,
    padding: 20,
    width: "100%",
  },
  hudTitle: {
    fontSize: 22,
    fontWeight: "900",
  },
  hudBody: {
    fontSize: 13,
    marginVertical: 10,
    lineHeight: 18,
    fontWeight: "500",
  },
  spectrumBar: {
    flexDirection: "row",
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 8,
  },
  spectrumSlice: { flex: 1 },
  controlCard: {
    borderRadius: 24,
    padding: 24,
  },
  label: {
    fontWeight: "800",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "800",
    // textTransform: "uppercase",
  },
  infoNote: {
    marginTop: 15,
    padding: 12,
    borderRadius: 12,
  },
  noteText: {
    fontSize: 11,
    textAlign: "center",
    fontStyle: "italic",
  },
  primaryBtn: {
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryBtnText: {
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 2,
    alignContent: "center",
    alignItems: "center",
  },
  floor: {
    position: "absolute",
    bottom: 0,
    height: 120,
    width: "150%",
    backgroundColor: "#c8a870",
  },
  windowBg: {
    position: "absolute",
    top: 0,
    height: 250,
    width: "150%",
    backgroundColor: "#a8c090",
  },
  sofa: {
    position: "absolute",
    bottom: 80,
    left: 40,
    width: 120,
    height: 45,
    backgroundColor: "#7a9a6a",
    borderRadius: 4,
  },
});
// import { RootStackParamList } from "@/app/vrrouter";
// import BackButton from "@/components/BackButton";
// import { useTheme } from "@/Context/ThemeContext";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { useEffect, useRef, useState } from "react";
// import {
//   Animated,
//   Dimensions,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// type Props = NativeStackScreenProps<RootStackParamList, "VRSimulation">;

// type SimulationType = "Protanopia" | "Deuteranopia" | "Tritanopia";

// const { width } = Dimensions.get("window");

// const CVD_DETAILS: Record<
//   SimulationType,
//   { description: string; spectrum: string }
// > = {
//   Protanopia: {
//     description:
//       "Reds appear darker and shifted toward black/dark brown. Red-green discrimination is severely impaired.",
//     spectrum: "Red wavelengths are missing or reduced.",
//   },
//   Deuteranopia: {
//     description:
//       "Greens are shifted to yellows/browns. Red-green discrimination is impaired.",
//     spectrum: "Green-sensitive cones are affected.",
//   },
//   Tritanopia: {
//     description:
//       "Blues appear greenish and yellows pinkish. Blue-yellow discrimination is impaired.",
//     spectrum: "Short wavelength cones are absent.",
//   },
// };

// const SPECTRUM_COLORS: Record<SimulationType, string[]> = {
//   Protanopia: [
//     "#6600cc",
//     "#0000ff",
//     "#00ccff",
//     "#00ff00",
//     "#cccc00",
//     "#996600",
//     "#333300",
//   ],
//   Deuteranopia: [
//     "#6600cc",
//     "#0000ff",
//     "#00ccff",
//     "#888800",
//     "#aa6600",
//     "#cc4400",
//     "#880000",
//   ],
//   Tritanopia: [
//     "#336600",
//     "#669900",
//     "#cccc00",
//     "#ff9900",
//     "#ff6600",
//     "#ff3300",
//     "#990000",
//   ],
// };

// export default function VRScreen({ navigation }: Props) {
//   const { darkMode, getFontSizeMultiplier, colorBlindMode, setColorBlindMode } =
//     useTheme();

//   const [activeTab, setActiveTab] = useState<SimulationType>(
//     colorBlindMode === "None" ? "Deuteranopia" : colorBlindMode,
//   );

//   const [showCVDCard, setShowCVDCard] = useState(true);

//   const scaleAnim = useRef(new Animated.Value(1)).current;

//   const scale = getFontSizeMultiplier();

//   useEffect(() => {
//     if (colorBlindMode !== "None") {
//       setActiveTab(colorBlindMode);
//     }
//   }, [colorBlindMode]);

//   const handleTabPress = (tab: SimulationType) => {
//     setActiveTab(tab);
//     setColorBlindMode(tab);
//     setShowCVDCard(true);
//   };

//   // ✅ UPDATED FUNCTION (Animation + Navigation)
//   const handleEnterVR = () => {
//     Animated.sequence([
//       Animated.timing(scaleAnim, {
//         toValue: 0.96,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//       Animated.timing(scaleAnim, {
//         toValue: 1,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//     ]).start(() => {
//       navigation.navigate("VRFullScreenCamera");
//     });
//   };

//   const themeColors = {
//     background: darkMode ? "#121212" : "#f5ede3",
//     card: darkMode ? "#1e1e1e" : "#ffffff",
//     text: darkMode ? "#ffffff" : "#1a1a1a",
//     subText: darkMode ? "#cccccc" : "#555",
//     border: darkMode ? "#333" : "#ccc",
//   };

//   const cvd = CVD_DETAILS[activeTab];

//   return (
//     <SafeAreaView
//       style={[styles.safe, { backgroundColor: themeColors.background }]}
//     >
//       <View>
//         <BackButton />
//         <View style={styles.topBar}>
//           <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

//           <Text style={[styles.screenTitle, { color: themeColors.text }]}>
//             VR Simulation
//           </Text>
//         </View>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={[styles.card, { backgroundColor: themeColors.card }]}>
//           <Text
//             style={[
//               styles.cardTitle,
//               { color: themeColors.text, fontSize: 20 * scale },
//             ]}
//           >
//             Selected Simulation
//           </Text>

//           <View style={styles.tabRow}>
//             {(
//               ["Protanopia", "Deuteranopia", "Tritanopia"] as SimulationType[]
//             ).map((tab) => (
//               <TouchableOpacity
//                 key={tab}
//                 style={[
//                   styles.tab,
//                   activeTab === tab && styles.tabActive,
//                   { borderColor: themeColors.border },
//                 ]}
//                 onPress={() => handleTabPress(tab)}
//               >
//                 <Text
//                   style={[
//                     styles.tabText,
//                     { color: themeColors.subText },
//                     activeTab === tab && { color: themeColors.text },
//                   ]}
//                 >
//                   {tab}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           <View style={styles.viewportWrapper}>
//             <View style={styles.roomScene}>
//               <View style={styles.floor} />
//               <View style={styles.windowBg} />
//               <View style={styles.sofa} />

//               <View style={styles.liveLabel}>
//                 <Text style={styles.liveLabelText}>LIVE VR Viewport</Text>
//               </View>

//               <View style={styles.viewportOverlay}>
//                 <Text style={styles.viewportOverlayText}>
//                   Camera feed filtered for {activeTab}
//                 </Text>
//               </View>

//               {showCVDCard && (
//                 <View style={styles.cvdCard}>
//                   <Text style={styles.cvdCardTitle}>CVD Details</Text>
//                   <Text style={styles.cvdCardBody}>{cvd.description}</Text>

//                   <View style={styles.spectrumBar}>
//                     {SPECTRUM_COLORS[activeTab].map((c, i) => (
//                       <View
//                         key={i}
//                         style={[styles.spectrumSlice, { backgroundColor: c }]}
//                       />
//                     ))}
//                   </View>
//                 </View>
//               )}
//             </View>
//           </View>

//           {/* ✅ BUTTON (UNCHANGED JSX, NOW NAVIGATES) */}
//           <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
//             <TouchableOpacity style={styles.primaryBtn} onPress={handleEnterVR}>
//               <Text style={styles.primaryBtnText}>Enter Full-Screen VR</Text>
//             </TouchableOpacity>
//           </Animated.View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   safe: { flex: 1 },

//   topBar: {
//     padding: 16,
//     alignItems: "center",
//     alignContent: "center",
//     flexDirection: "row",
//     gap: 12,
//   },

//   // backButton: {
//   //   width: 45,
//   //   height: 45,
//   //   borderRadius: 15,
//   //   justifyContent: "center",
//   //   alignItems: "center",
//   //   borderWidth: 1,
//   //   borderColor: "rgba(255, 255, 255, 0.2)",
//   // },

//   screenTitle: {
//     fontSize: 24,
//     fontWeight: "800",
//   },

//   scrollContent: {
//     padding: 16,
//   },

//   card: {
//     borderRadius: 20,
//     padding: 16,
//   },

//   cardTitle: {
//     fontWeight: "700",
//     marginBottom: 12,
//   },

//   tabRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginBottom: 12,
//   },

//   tab: {
//     flex: 1,
//     padding: 10,
//     borderRadius: 20,
//     borderWidth: 1,
//     alignItems: "center",
//   },

//   tabActive: {
//     backgroundColor: "#ddd",
//   },

//   tabText: {
//     fontSize: 12,
//     fontWeight: "600",
//   },

//   viewportWrapper: {
//     height: 260,
//     borderRadius: 16,
//     overflow: "hidden",
//     marginBottom: 12,
//   },

//   roomScene: {
//     flex: 1,
//     backgroundColor: "#b8c8a0",
//   },

//   floor: {
//     position: "absolute",
//     bottom: 0,
//     height: 80,
//     width: "100%",
//     backgroundColor: "#c8a870",
//   },

//   windowBg: {
//     position: "absolute",
//     top: 0,
//     height: 150,
//     width: "100%",
//     backgroundColor: "#a8c090",
//   },

//   sofa: {
//     position: "absolute",
//     bottom: 40,
//     left: 60,
//     width: 120,
//     height: 50,
//     backgroundColor: "#7a9a6a",
//     borderRadius: 10,
//   },

//   liveLabel: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     backgroundColor: "#fff",
//     padding: 4,
//     borderRadius: 8,
//   },

//   liveLabelText: {
//     fontSize: 10,
//     fontWeight: "600",
//   },

//   viewportOverlay: {
//     position: "absolute",
//     top: 20,
//     left: 10,
//   },

//   viewportOverlayText: {
//     color: "#fff",
//     fontWeight: "600",
//   },

//   cvdCard: {
//     position: "absolute",
//     bottom: 10,
//     right: 10,
//     width: width * 0.45,
//     backgroundColor: "#fff",
//     padding: 8,
//     borderRadius: 10,
//   },

//   cvdCardTitle: {
//     fontWeight: "700",
//     fontSize: 12,
//   },

//   cvdCardBody: {
//     fontSize: 10,
//     marginVertical: 4,
//   },

//   spectrumBar: {
//     flexDirection: "row",
//     height: 10,
//     borderRadius: 5,
//     overflow: "hidden",
//   },

//   spectrumSlice: {
//     flex: 1,
//   },

//   primaryBtn: {
//     backgroundColor: "#000",
//     padding: 14,
//     borderRadius: 14,
//     alignItems: "center",
//   },

//   primaryBtnText: {
//     color: "#fff",
//     fontWeight: "700",
//   },
// });
