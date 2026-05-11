import { RootStackParamList } from "@/app/vrrouter";
import { CvdSimulation, getAllowedSimulations } from "@/constants/cvdUtils";
import { useAuth } from "@/Context/AuthContext";
import { useTheme } from "@/Context/ThemeContext";
import { useUserData } from "@/Context/useUserData";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
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
type SimulationType = CvdSimulation;

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
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const { user } = useAuth();
  const { userData } = useUserData();
  const router = useRouter();
  const cvdType = userData?.cvdType || user?.cvdType;
  const { isNormal, types } = getAllowedSimulations(cvdType);
  const availableTabs = useMemo<SimulationType[]>(
    () => (types as SimulationType[]),
    [types],
  );
  const initialTab: SimulationType =
    (types[0] ?? "Deuteranopia") as SimulationType;
  const [activeTab, setActiveTab] = useState<SimulationType>(initialTab);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fontScale = getFontSizeMultiplier() || 1;

  useEffect(() => {
    if (isNormal) return;
    setActiveTab((prev) =>
      availableTabs.includes(prev)
        ? prev
        : ((types[0] ?? "Deuteranopia") as SimulationType),
    );
  }, [availableTabs, isNormal, types]);

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
      navigation.navigate("VRFullScreenCamera", { simulation: activeTab });
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

  if (isNormal) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: themeColors.background }]}
      >
        <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
        <View style={styles.header}>
          <Text style={[styles.screenTitle, { color: themeColors.text }]}>
            VR Simulation
          </Text>
          <View style={{ width: 40 }} />
        </View>
        <View
          style={[styles.lockedCard, { backgroundColor: themeColors.card }]}
        >
          <Text style={[styles.lockedTitle, { color: themeColors.text }]}>
            Unlock VR Simulation
          </Text>
          <Text style={[styles.lockedText, { color: themeColors.subText }]}>
            Take the quiz to detect your CVD type before using VR filters.
          </Text>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: themeColors.accent }]}
            onPress={() => router.push("/welcome")}
          >
            <Text style={[styles.primaryBtnText, { color: "#FFF" }]}>
              Take Quiz
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: themeColors.background }]}
    >
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      <View style={styles.header}>
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

        {/* SELECTION VIEW */}
        <View
          style={[styles.controlCard, { backgroundColor: themeColors.card }]}
        >
          <Text style={[styles.label, { color: themeColors.text }]}>
            Selected simulation: {activeTab}
          </Text>
          <View style={styles.tabRow}>
            {availableTabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tabButton,
                    { borderColor: themeColors.border },
                    isActive && {
                      backgroundColor: themeColors.accent,
                      borderColor: themeColors.accent,
                    },
                  ]}
                  onPress={() => setActiveTab(tab as SimulationType)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabLabel,
                      {
                        color: isActive ? "#FFF" : themeColors.subText,
                      },
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
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
    // paddingTop: 56,
    // paddingBottom: 10,
    paddingLeft: 56,
    paddingRight: 16,
    alignContent: "center",
    textAlign: "center",

    
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 0,
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
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
  lockedCard: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  lockedTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  lockedText: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 18,
  },
  label: {
    fontWeight: "800",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
  },
  tabButton: {
    flexGrow: 1,
    flexBasis: "45%",
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
  lockedSelection: {
    paddingVertical: 4,
    alignItems: "center",
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
