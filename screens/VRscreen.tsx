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
import { useTheme } from "@/Context/ThemeContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
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

const { width } = Dimensions.get("window");

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
  const { darkMode, getFontSizeMultiplier, colorBlindMode, setColorBlindMode } =
    useTheme();

  const [activeTab, setActiveTab] = useState<SimulationType>(
    colorBlindMode === "None" ? "Deuteranopia" : colorBlindMode,
  );

  const [showCVDCard, setShowCVDCard] = useState(true);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const scale = getFontSizeMultiplier();

  useEffect(() => {
    if (colorBlindMode !== "None") {
      setActiveTab(colorBlindMode);
    }
  }, [colorBlindMode]);

  const handleTabPress = (tab: SimulationType) => {
    setActiveTab(tab);
    setColorBlindMode(tab);
    setShowCVDCard(true);
  };

  // ✅ UPDATED FUNCTION (Animation + Navigation)
  const handleEnterVR = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate("VRFullScreenCamera");
    });
  };

  const themeColors = {
    background: darkMode ? "#121212" : "#f5ede3",
    card: darkMode ? "#1e1e1e" : "#ffffff",
    text: darkMode ? "#ffffff" : "#1a1a1a",
    subText: darkMode ? "#cccccc" : "#555",
    border: darkMode ? "#333" : "#ccc",
  };

  const cvd = CVD_DETAILS[activeTab];

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: themeColors.background }]}
    >
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      <View style={styles.topBar}>
        <Text style={[styles.screenTitle, { color: themeColors.text }]}>
          VR Simulation
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: themeColors.card }]}>
          <Text
            style={[
              styles.cardTitle,
              { color: themeColors.text, fontSize: 20 * scale },
            ]}
          >
            Selected Simulation
          </Text>

          <View style={styles.tabRow}>
            {(
              ["Protanopia", "Deuteranopia", "Tritanopia"] as SimulationType[]
            ).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  activeTab === tab && styles.tabActive,
                  { borderColor: themeColors.border },
                ]}
                onPress={() => handleTabPress(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: themeColors.subText },
                    activeTab === tab && { color: themeColors.text },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.viewportWrapper}>
            <View style={styles.roomScene}>
              <View style={styles.floor} />
              <View style={styles.windowBg} />
              <View style={styles.sofa} />

              <View style={styles.liveLabel}>
                <Text style={styles.liveLabelText}>LIVE VR Viewport</Text>
              </View>

              <View style={styles.viewportOverlay}>
                <Text style={styles.viewportOverlayText}>
                  Camera feed filtered for {activeTab}
                </Text>
              </View>

              {showCVDCard && (
                <View style={styles.cvdCard}>
                  <Text style={styles.cvdCardTitle}>CVD Details</Text>
                  <Text style={styles.cvdCardBody}>{cvd.description}</Text>

                  <View style={styles.spectrumBar}>
                    {SPECTRUM_COLORS[activeTab].map((c, i) => (
                      <View
                        key={i}
                        style={[styles.spectrumSlice, { backgroundColor: c }]}
                      />
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* ✅ BUTTON (UNCHANGED JSX, NOW NAVIGATES) */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleEnterVR}>
              <Text style={styles.primaryBtnText}>Enter Full-Screen VR</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: { flex: 1 },

  topBar: {
    padding: 16,
    alignItems: "center",
  },

  screenTitle: {
    fontSize: 24,
    fontWeight: "800",
  },

  scrollContent: {
    padding: 16,
  },

  card: {
    borderRadius: 20,
    padding: 16,
  },

  cardTitle: {
    fontWeight: "700",
    marginBottom: 12,
  },

  tabRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  tab: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
  },

  tabActive: {
    backgroundColor: "#ddd",
  },

  tabText: {
    fontSize: 12,
    fontWeight: "600",
  },

  viewportWrapper: {
    height: 260,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },

  roomScene: {
    flex: 1,
    backgroundColor: "#b8c8a0",
  },

  floor: {
    position: "absolute",
    bottom: 0,
    height: 80,
    width: "100%",
    backgroundColor: "#c8a870",
  },

  windowBg: {
    position: "absolute",
    top: 0,
    height: 150,
    width: "100%",
    backgroundColor: "#a8c090",
  },

  sofa: {
    position: "absolute",
    bottom: 40,
    left: 60,
    width: 120,
    height: 50,
    backgroundColor: "#7a9a6a",
    borderRadius: 10,
  },

  liveLabel: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    padding: 4,
    borderRadius: 8,
  },

  liveLabelText: {
    fontSize: 10,
    fontWeight: "600",
  },

  viewportOverlay: {
    position: "absolute",
    top: 20,
    left: 10,
  },

  viewportOverlayText: {
    color: "#fff",
    fontWeight: "600",
  },

  cvdCard: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: width * 0.45,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 10,
  },

  cvdCardTitle: {
    fontWeight: "700",
    fontSize: 12,
  },

  cvdCardBody: {
    fontSize: 10,
    marginVertical: 4,
  },

  spectrumBar: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },

  spectrumSlice: {
    flex: 1,
  },

  primaryBtn: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
});
