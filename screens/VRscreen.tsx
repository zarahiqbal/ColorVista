import { RootStackParamList } from "@/app/vrrouter";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
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
      "In this view, reds appear darker and are shifted toward black/dark brown. Red-green discrimination is severely impaired.",
    spectrum: "Red wavelengths are absent or greatly reduced.",
  },
  Deuteranopia: {
    description:
      "In this view, greens are shifted to yellows/browns, and red-green discrimination is impaired.",
    spectrum: "See which specific wavelengths are affected below.",
  },
  Tritanopia: {
    description:
      "In this view, blues appear greenish, and yellows appear pinkish. Blue-yellow discrimination is impaired.",
    spectrum: "Short-wavelength (blue) cones are absent or non-functional.",
  },
};

// Spectrum bar color stops per type
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

export default function VRScreen(_props: Props) {
  const [activeTab, setActiveTab] = useState<SimulationType>("Deuteranopia");
  const [showCVDCard, setShowCVDCard] = useState(true);
  const [activeNav, setActiveNav] = useState<
    "Customization" | "History Tracking" | "Privacy Focus"
  >("Customization");

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleTabPress = (tab: SimulationType) => {
    setActiveTab(tab);
    setShowCVDCard(true);
  };

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
    ]).start();
  };

  const cvd = CVD_DETAILS[activeTab];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5ede3" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn}>
          <View style={styles.menuLine} />
          <View style={[styles.menuLine, { width: 20 }]} />
          <View style={styles.menuLine} />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>👁️</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.profileBtn}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileIcon}>👤</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.screenTitle}>VR Simulation</Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Select Simulation</Text>

          {/* Tabs */}
          <View style={styles.tabRow}>
            {(
              ["Protanopia", "Deuteranopia", "Tritanopia"] as SimulationType[]
            ).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => handleTabPress(tab)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.tabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Viewport */}
          <View style={styles.viewportWrapper}>
            {/* Simulated image placeholder */}
            <View style={styles.viewportImageBg}>
              {/* Room scene drawn with shapes */}
              <View style={styles.roomScene}>
                {/* Floor */}
                <View style={styles.floor} />
                {/* Window / Background */}
                <View style={styles.windowBg} />
                {/* Tree blobs */}
                <View
                  style={[
                    styles.treeBall,
                    {
                      left: 30,
                      top: 20,
                      backgroundColor:
                        activeTab === "Tritanopia" ? "#6a8a4a" : "#7a9a5a",
                      width: 50,
                      height: 50,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.treeBall,
                    {
                      left: 80,
                      top: 10,
                      backgroundColor:
                        activeTab === "Protanopia" ? "#5a7a4a" : "#8aaa6a",
                      width: 65,
                      height: 65,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.treeBall,
                    {
                      right: 20,
                      top: 15,
                      backgroundColor: "#6a8a5a",
                      width: 55,
                      height: 55,
                    },
                  ]}
                />
                {/* Sofa */}
                <View
                  style={[
                    styles.sofa,
                    {
                      backgroundColor:
                        activeTab === "Deuteranopia"
                          ? "#7a9a6a"
                          : activeTab === "Protanopia"
                            ? "#5a7a6a"
                            : "#6a8a9a",
                    },
                  ]}
                >
                  <View style={styles.sofaBack} />
                  <View style={styles.sofaCushion1} />
                  <View style={styles.sofaCushion2} />
                </View>
                {/* Armchair */}
                <View
                  style={[
                    styles.armchair,
                    {
                      backgroundColor:
                        activeTab === "Deuteranopia" ? "#c89060" : "#e07050",
                    },
                  ]}
                />
                {/* Coffee table */}
                <View style={styles.coffeeTable} />
                {/* Lamp */}
                <View style={styles.lamp}>
                  <View style={styles.lampShade} />
                  <View style={styles.lampPole} />
                </View>
              </View>

              {/* LIVE label */}
              <View style={styles.liveLabel}>
                <Text style={styles.liveLabelText}>LIVE VR Viewport</Text>
              </View>

              {/* Overlay text */}
              <View style={styles.viewportOverlay}>
                <Text style={styles.viewportOverlayText}>
                  Camera feed simulation{"\n"}filtered for {activeTab}.
                </Text>
              </View>

              {/* CVD Details Card */}
              {showCVDCard && (
                <View style={styles.cvdCard}>
                  <View style={styles.cvdCardHeader}>
                    <Text style={styles.cvdCardTitle}>CVD Details:</Text>
                    <TouchableOpacity onPress={() => setShowCVDCard(false)}>
                      <Text style={styles.cvdInfoIcon}>ℹ</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.cvdCardBody}>{cvd.description}</Text>
                  <Text style={styles.cvdCardSub}>{cvd.spectrum}</Text>

                  {/* Spectrum bars */}
                  <View style={styles.spectrumRow}>
                    <View style={styles.spectrumGroup}>
                      <View style={styles.spectrumBar}>
                        {SPECTRUM_COLORS[activeTab].map((color, i) => (
                          <View
                            key={i}
                            style={[
                              styles.spectrumSlice,
                              { backgroundColor: color },
                            ]}
                          />
                        ))}
                      </View>
                      <View style={styles.spectrumLabels}>
                        <Text style={styles.spectrumLabel}>low</Text>
                        <Text style={styles.spectrumLabel}>High</Text>
                      </View>
                    </View>
                    <View style={styles.spectrumGroupLabel}>
                      <Text style={styles.spectrumTypeLabel}>CVD</Text>
                      <View style={styles.spectrumBar}>
                        {[
                          "#888888",
                          "#aaaaaa",
                          "#ccbb88",
                          "#bbaa55",
                          "#999944",
                          "#777733",
                          "#555522",
                        ].map((color, i) => (
                          <View
                            key={i}
                            style={[
                              styles.spectrumSlice,
                              { backgroundColor: color },
                            ]}
                          />
                        ))}
                      </View>
                      <View style={styles.spectrumLabels}>
                        <Text style={styles.spectrumLabel}>Low</Text>
                        <Text style={styles.spectrumLabel}>high</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>

          <Text style={styles.viewportLabel}>LIVE VR Viewport</Text>

          {/* Enter Full-Screen VR */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleEnterVR}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryBtnText}>Enter Full-Screen VR</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Settings & Presets */}
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.8}>
            <Text style={styles.secondaryBtnText}>Settings &amp; Presets</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {(
          [
            { label: "Customization", icon: "🔧" },
            { label: "History Tracking", icon: "🕐" },
            { label: "Privacy Focus", icon: "🔒" },
          ] as const
        ).map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.navItem}
            onPress={() => setActiveNav(item.label)}
            activeOpacity={0.7}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text
              style={[
                styles.navLabel,
                activeNav === item.label && styles.navLabelActive,
              ]}
            >
              {item.label}
            </Text>
            {activeNav === item.label && <View style={styles.navIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f5ede3",
  },

  /* Top Bar */
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 12 : 4,
    paddingBottom: 4,
  },
  menuBtn: { padding: 8, gap: 4 },
  menuLine: {
    width: 24,
    height: 2.5,
    backgroundColor: "#222",
    borderRadius: 2,
    marginVertical: 2,
  },
  logoContainer: { alignItems: "center" },
  logoCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#e8ddd0",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  logoEmoji: { fontSize: 24 },
  profileBtn: { padding: 4 },
  profileCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  profileIcon: { fontSize: 18 },

  /* Title */
  screenTitle: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: -0.5,
    marginBottom: 14,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  /* Card */
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 14,
  },

  /* Tabs */
  tabRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#ece5dc",
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#e8e0d5",
    borderWidth: 1.5,
    borderColor: "#ccc",
  },
  tabText: {
    fontSize: 12.5,
    fontWeight: "500",
    color: "#555",
  },
  tabTextActive: {
    fontWeight: "700",
    color: "#111",
  },

  /* Viewport */
  viewportWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#c8d8b0",
    height: 260,
  },
  viewportImageBg: {
    flex: 1,
    position: "relative",
  },

  /* Room scene */
  roomScene: { flex: 1, position: "relative", overflow: "hidden" },
  floor: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: "#c8a870",
  },
  windowBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: "#b8c8a0",
  },
  treeBall: {
    position: "absolute",
    borderRadius: 999,
  },
  sofa: {
    position: "absolute",
    bottom: 40,
    left: 60,
    width: 160,
    height: 60,
    borderRadius: 10,
  },
  sofaBack: {
    position: "absolute",
    top: -18,
    left: 0,
    right: 0,
    height: 22,
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 8,
  },
  sofaCushion1: {
    position: "absolute",
    bottom: 8,
    left: 10,
    width: 65,
    height: 30,
    backgroundColor: "#e8d880",
    borderRadius: 6,
  },
  sofaCushion2: {
    position: "absolute",
    bottom: 8,
    right: 10,
    width: 65,
    height: 30,
    backgroundColor: "#e0c8d0",
    borderRadius: 6,
  },
  armchair: {
    position: "absolute",
    bottom: 38,
    left: 10,
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  coffeeTable: {
    position: "absolute",
    bottom: 20,
    left: 90,
    width: 100,
    height: 28,
    backgroundColor: "#a08050",
    borderRadius: 6,
  },
  lamp: {
    position: "absolute",
    bottom: 50,
    right: 30,
    alignItems: "center",
  },
  lampShade: {
    width: 28,
    height: 20,
    backgroundColor: "#e8a070",
    borderRadius: 4,
  },
  lampPole: {
    width: 4,
    height: 60,
    backgroundColor: "#888",
  },

  liveLabel: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.88)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  liveLabelText: { fontSize: 11, fontWeight: "600", color: "#333" },

  viewportOverlay: {
    position: "absolute",
    top: 16,
    left: 14,
  },
  viewportOverlayText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  /* CVD Card */
  cvdCard: {
    position: "absolute",
    bottom: 10,
    right: 8,
    width: width * 0.42,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  cvdCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  cvdCardTitle: { fontSize: 12, fontWeight: "700", color: "#111" },
  cvdInfoIcon: { fontSize: 14, color: "#555" },
  cvdCardBody: { fontSize: 10, color: "#333", lineHeight: 14, marginBottom: 4 },
  cvdCardSub: { fontSize: 9.5, color: "#555", lineHeight: 13, marginBottom: 6 },

  /* Spectrum */
  spectrumRow: { flexDirection: "row", gap: 6 },
  spectrumGroup: { flex: 1 },
  spectrumGroupLabel: { flex: 1 },
  spectrumTypeLabel: {
    fontSize: 8,
    fontWeight: "600",
    color: "#777",
    textAlign: "right",
    marginBottom: 2,
  },
  spectrumBar: {
    flexDirection: "row",
    height: 12,
    borderRadius: 3,
    overflow: "hidden",
  },
  spectrumSlice: { flex: 1 },
  spectrumLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  spectrumLabel: { fontSize: 7.5, color: "#888" },

  viewportLabel: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    marginBottom: 14,
  },

  /* Buttons */
  primaryBtn: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  secondaryBtnText: {
    color: "#1a1a1a",
    fontSize: 16,
    fontWeight: "600",
  },

  /* Bottom Nav */
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 24 : 10,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    position: "relative",
    paddingVertical: 4,
  },
  navIcon: { fontSize: 20, marginBottom: 3 },
  navLabel: {
    fontSize: 11,
    color: "#aaa",
    fontWeight: "500",
  },
  navLabelActive: {
    color: "#1a1a1a",
    fontWeight: "700",
  },
  navIndicator: {
    position: "absolute",
    bottom: -4,
    width: 36,
    height: 3,
    backgroundColor: "#1a1a1a",
    borderRadius: 2,
  },
});
