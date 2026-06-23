import { RootStackParamList } from "@/app/vrrouter";
import { CvdSimulation } from "@/constants/cvdUtils";
import { useAuth } from "@/Context/AuthContext";
import { useTheme } from "@/Context/ThemeContext";
import { useUserData } from "@/Context/useUserData";
import { useGoBackOrHomeOnBack } from "@/hooks/useBackNavigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  useGoBackOrHomeOnBack();
  const { user } = useAuth();
  const { userData } = useUserData();
  const router = useRouter();
  const cvdType = userData?.cvdType || user?.cvdType;

  const parsedCvdData = useMemo(() => {
    if (!cvdType) return { isNormal: true, types: [] };
    try {
      const parsed = JSON.parse(cvdType);
      const activeTypes: SimulationType[] = [];
      if (parsed.hasRedGreen) activeTypes.push("Protanopia", "Deuteranopia");
      if (parsed.hasTritan) activeTypes.push("Tritanopia");
      return { isNormal: activeTypes.length === 0, types: activeTypes };
    } catch {
      const legacyStr = cvdType.toLowerCase();
      const activeTypes: SimulationType[] = [];
      const hasRG =
        legacyStr.includes("red-green") ||
        legacyStr.includes("protan") ||
        legacyStr.includes("deutan");
      const hasTritan =
        legacyStr.includes("tritan") || legacyStr.includes("blue-yellow");

      if (hasRG) activeTypes.push("Protanopia", "Deuteranopia");
      if (hasTritan) activeTypes.push("Tritanopia");
      return {
        isNormal: legacyStr.includes("normal") || activeTypes.length === 0,
        types: activeTypes,
      };
    }
  }, [cvdType]);

  const isNormal = parsedCvdData.isNormal;
  const availableTabs = useMemo<SimulationType[]>(
    () => parsedCvdData.types,
    [parsedCvdData.types],
  );

  const initialTab: SimulationType = (availableTabs[0] ??
    "Deuteranopia") as SimulationType;
  const [activeTab, setActiveTab] = useState<SimulationType>(initialTab);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fontScale = getFontSizeMultiplier() || 1;

  useEffect(() => {
    if (isNormal || availableTabs.length === 0) return;
    setActiveTab((prev) =>
      availableTabs.includes(prev) ? prev : availableTabs[0],
    );
  }, [availableTabs, isNormal]);

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
    background: darkMode ? "#121212" : "#F5F4F0",
    card: darkMode ? "#1E1E1E" : "#E6E5E0",
    innerCard: darkMode ? "#2A2A2A" : "#FFFFFF",
    text: darkMode ? "#FFFFFF" : "#1A1A1A",
    subText: darkMode ? "#AAAAAA" : "#666666",
    accent: darkMode ? "#333333" : "#262626",
    border: darkMode ? "#333333" : "#A6B5A4",

    // Accessibility overrides for the tab buttons
    tabActiveBg: darkMode ? "#FFFFFF" : "#1A1A1A", // Inverts for absolute luminance contrast
    tabActiveText: darkMode ? "#121212" : "#FFFFFF", // Crisp readable text regardless of color blindness
  };

  const cvd = CVD_DETAILS[activeTab] || CVD_DETAILS.Deuteranopia;

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: themeColors.background }]}
      edges={["top", "left", "right", "bottom"]}
    >
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.textHeaderContainer}>
          <Text
            style={[
              styles.screenTitle,
              { color: themeColors.text, fontSize: 26 * fontScale },
            ]}
          >
            VR Simulation
          </Text>
          <Text
            style={[
              styles.screenSubtitle,
              { color: themeColors.subText, fontSize: 13 * fontScale },
            ]}
          >
            Select a matrix configuration to calibrate environment filters
          </Text>
        </View>

        {isNormal ? (
          <View
            style={[
              styles.mainCard,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            <View style={styles.centerStandbyContent}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: themeColors.border },
                ]}
              >
                <Text
                  style={{
                    color: themeColors.innerCard,
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  🔒
                </Text>
              </View>
              <Text
                style={[
                  styles.cardStateTitle,
                  { color: themeColors.text, fontSize: 18 * fontScale },
                ]}
              >
                Simulation Locked
              </Text>
              <Text
                style={[
                  styles.cardStateSubtitle,
                  { color: themeColors.subText, fontSize: 13 * fontScale },
                ]}
              >
                Take the evaluation quiz to diagnose your custom CVD profile
                parameters.
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.mainCard,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            <View style={styles.viewportWrapper}>
              <View style={styles.roomScene}>
                <View style={styles.floor} />
                <View style={styles.windowBg} />
                <View style={styles.sofa} />

                <View style={styles.liveBadge}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.liveText}>
                    READY: {activeTab.toUpperCase()}
                  </Text>
                </View>

                <View
                  style={[
                    styles.hudCard,
                    { backgroundColor: themeColors.innerCard },
                  ]}
                >
                  <Text
                    style={[
                      styles.hudTitle,
                      { color: themeColors.text, fontSize: 18 * fontScale },
                    ]}
                  >
                    {activeTab}
                  </Text>
                  <Text
                    style={[
                      styles.hudBody,
                      { color: themeColors.subText, fontSize: 12 * fontScale },
                    ]}
                  >
                    {cvd.description}
                  </Text>
                  <View style={styles.spectrumBar}>
                    {(
                      SPECTRUM_COLORS[activeTab] || SPECTRUM_COLORS.Deuteranopia
                    ).map((c, i) => (
                      <View
                        key={i}
                        style={[styles.spectrumSlice, { backgroundColor: c }]}
                      />
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* ACCESSIBLE SELECTION TABS */}
            <View style={styles.controlsSection}>
              <Text
                style={[
                  styles.label,
                  { color: themeColors.text, fontSize: 13 * fontScale },
                ]}
              >
                Available Profiles:
              </Text>
              <View style={styles.tabRow}>
                {availableTabs.map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <TouchableOpacity
                      key={tab}
                      style={[
                        styles.tabButton,
                        {
                          borderColor: themeColors.border,
                          backgroundColor: themeColors.innerCard,
                        },
                        isActive && {
                          backgroundColor: themeColors.tabActiveBg,
                          borderColor: themeColors.tabActiveBg,
                        },
                      ]}
                      onPress={() => setActiveTab(tab)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.tabLabel,
                          {
                            color: isActive
                              ? themeColors.tabActiveText
                              : themeColors.text,
                            fontSize: 12 * fontScale,
                          },
                        ]}
                      >
                        {tab}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        <View style={styles.bottomActionContainer}>
          <Animated.View
            style={{ transform: [{ scale: scaleAnim }], width: "100%" }}
          >
            <TouchableOpacity
              style={[
                styles.primaryBtn,
                { backgroundColor: themeColors.accent },
              ]}
              onPress={isNormal ? () => router.push("/welcome") : handleEnterVR}
              activeOpacity={0.9}
            >
              <Text
                style={[styles.primaryBtnText, { fontSize: 15 * fontScale }]}
              >
                {isNormal ? "Begin Test Quiz" : "Start Live Simulation"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          <Text
            style={[
              styles.statusText,
              { color: themeColors.subText, fontSize: 11 * fontScale },
            ]}
          >
            {isNormal ? "Awaiting calibration" : "System ready to project"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  textHeaderContainer: {
    alignItems: "center",
    marginBottom: 32,
    width: "100%",
  },
  screenTitle: {
    fontWeight: "900",
    letterSpacing: -0.5,
    textAlign: "center",
    marginBottom: 6,
  },
  screenSubtitle: {
    textAlign: "center",
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  mainCard: {
    width: "100%",
    aspectRatio: 0.88,
    borderRadius: 36,
    borderWidth: 1.5,
    padding: 16,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  centerStandbyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  cardStateTitle: {
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  cardStateSubtitle: {
    textAlign: "center",
    lineHeight: 18,
  },
  viewportWrapper: {
    flex: 1.1,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 14,
  },
  roomScene: {
    flex: 1,
    backgroundColor: "#b8c8a0",
    justifyContent: "flex-end",
    padding: 14,
  },
  liveBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "rgba(0,0,0,0.75)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#52c41a",
    marginRight: 6,
  },
  liveText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  hudCard: {
    borderRadius: 16,
    padding: 14,
    width: "100%",
  },
  hudTitle: {
    fontWeight: "800",
  },
  hudBody: {
    marginTop: 4,
    marginBottom: 8,
    lineHeight: 16,
  },
  spectrumBar: {
    flexDirection: "row",
    height: 3,
    borderRadius: 1.5,
    overflow: "hidden",
  },
  spectrumSlice: {
    flex: 1,
  },
  controlsSection: {
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  label: {
    fontWeight: "700",
    marginBottom: 8,
  },
  tabRow: {
    flexDirection: "row",
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
  },
  tabLabel: {
    fontWeight: "800",
  },
  bottomActionContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 32,
  },
  primaryBtn: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  statusText: {
    marginTop: 10,
    fontWeight: "600",
  },
  floor: {
    position: "absolute",
    bottom: 0,
    height: 80,
    width: "150%",
    backgroundColor: "#c8a870",
  },
  windowBg: {
    position: "absolute",
    top: 0,
    height: 180,
    width: "150%",
    backgroundColor: "#a8c090",
  },
  sofa: {
    position: "absolute",
    bottom: 50,
    left: 24,
    width: 80,
    height: 30,
    backgroundColor: "#7a9a6a",
    borderRadius: 4,
  },
});
