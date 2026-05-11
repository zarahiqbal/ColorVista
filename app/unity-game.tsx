import { useTheme } from "@/Context/ThemeContext";
import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const UNITY_APK_URL =
  "https://pub-003ba14b4c2e4e9088e5b88d4b3aed6f.r2.dev/Spectrum%20Shifter.apk";
const APK_FILE_NAME = "SpectrumShifter.apk";

export default function UnityGameScreen() {
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const multiplier = getFontSizeMultiplier();

  const [downloadedUri, setDownloadedUri] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLaunchingInstaller, setIsLaunchingInstaller] = useState(false);

  const apkUri = `${FileSystem.documentDirectory}${APK_FILE_NAME}`;

  useEffect(() => {
    const checkExistingDownload = async () => {
      try {
        const info = await FileSystem.getInfoAsync(apkUri);
        if (info.exists) {
          setDownloadedUri(apkUri);
        }
      } catch {
        // No-op: this check is best-effort.
      }
    };

    checkExistingDownload();
  }, [apkUri]);

  const styles = useMemo(() => createStyles(darkMode, multiplier), [darkMode, multiplier]);

  const themeColors = useMemo(
    () => ({
      screenGradient: darkMode
        ? (["#0D0D0D", "#161616", "#1C1C1C"] as const)
        : (["#F9F6F2", "#EDE3D9", "#E0D0C0"] as const),
      heading: darkMode ? "#FFFFFF" : "#1E1E1E",
      subHeading: darkMode ? "#A0A0A0" : "#7A7A7A",
      glassBg: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.72)",
      glassBorder: darkMode ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.95)",
      accentGlow: darkMode ? "rgba(141,179,153,0.18)" : "rgba(106,144,113,0.10)",
      chipBg: darkMode ? "rgba(141,163,153,0.18)" : "rgba(106,144,113,0.14)",
      chipText: darkMode ? "#C8DFCD" : "#2E5038",
      cardTitle: darkMode ? "#F0F0F0" : "#252525",
      bodyText: darkMode ? "#C0C0C0" : "#5A5A5A",
      stepTitle: darkMode ? "#EFEFEF" : "#2E2E2E",
      stepDesc: darkMode ? "#ABABAB" : "#6A6A6A",
      link: darkMode ? "#A8CAFF" : "#3558C0",
      statusDotReady: "#4FBF72",
      statusDotPending: "#C99644",
      primaryBtn: darkMode
        ? (["#5D8A68", "#6F9E7A"] as const)
        : (["#587A60", "#6A9071"] as const),
      secondaryBtn: darkMode
        ? (["#3E4F69", "#506180"] as const)
        : (["#3C4D66", "#4F5F7B"] as const),
    }),
    [darkMode],
  );

  const handleDownload = async () => {
    if (Platform.OS !== "android") {
      Alert.alert(
        "Android only",
        "The Unity APK can only be downloaded and installed on Android devices.",
      );
      return;
    }

    try {
      setIsDownloading(true);
      const result = await FileSystem.downloadAsync(UNITY_APK_URL, apkUri);
      if (result.status !== 200) throw new Error(`Download failed with status ${result.status}`);
      setDownloadedUri(result.uri);
      Alert.alert("Download complete", "Spectrum Shifter is ready. Tap 'Install / Play' to install and open it.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not download the APK. Please try again.";
      Alert.alert("Download failed", message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleInstallAndPlay = async () => {
    if (Platform.OS !== "android") return;
    if (!downloadedUri) { Alert.alert("Not downloaded", "Download the game first."); return; }

    try {
      setIsLaunchingInstaller(true);
      const contentUri = await FileSystem.getContentUriAsync(downloadedUri);
      await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: contentUri,
        type: "application/vnd.android.package-archive",
        flags: 1,
      });
      Alert.alert("Installer opened", "After installation completes, tap Open to play Spectrum Shifter.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not open the Android installer.";
      Alert.alert("Install failed", message);
    } finally {
      setIsLaunchingInstaller(false);
    }
  };

  const isReady = downloadedUri && Platform.OS === "android";

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={themeColors.screenGradient} style={StyleSheet.absoluteFill} />

      {/* Soft ambient glow behind hero */}
      <View style={[styles.ambientGlow, { backgroundColor: themeColors.accentGlow }]} />

      <View style={styles.container}>

        {/* ── HERO CARD ── */}
  <View style={[styles.heroCard, { backgroundColor: themeColors.glassBg }]}> 
          <View style={styles.heroTopRow}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>‹</Text>
            </Pressable>
            <View style={[styles.platformChip, { backgroundColor: themeColors.chipBg }]}>
              <View style={[styles.chipDot, { backgroundColor: themeColors.chipText }]} />
              <Text style={[styles.platformChipText, { color: themeColors.chipText }]}>Android APK</Text>
            </View>
          </View>

          <Text style={[styles.title, { color: themeColors.heading }]}>Spectrum{"\n"}Shifter</Text>
          <Text style={[styles.subtitle, { color: themeColors.subHeading }]}>Easy Mode · Unity Experience</Text>

          <View style={styles.divider} />

          <View style={styles.statusRow}>
            <View style={[styles.statusDot, {
              backgroundColor: isReady ? themeColors.statusDotReady : themeColors.statusDotPending,
              shadowColor: isReady ? themeColors.statusDotReady : themeColors.statusDotPending,
            }]} />
            <Text style={[styles.statusText, { color: themeColors.subHeading }]}>
              {Platform.OS !== "android"
                ? "Android device required"
                : downloadedUri
                  ? "Ready to install"
                  : "Not downloaded yet"}
            </Text>
          </View>
        </View>

        {/* ── HOW IT WORKS CARD ── */}
  <View style={[styles.card, { backgroundColor: themeColors.glassBg }]}> 
          <Text style={[styles.cardTitle, { color: themeColors.cardTitle }]}>How it works</Text>
          <Text style={[styles.cardText, { color: themeColors.bodyText }]}>
            {Platform.OS === "android"
              ? "Download the Unity APK, open installer, and launch the game once installation completes."
              : "This game build is Android-only. Use an Android phone to download and play."}
          </Text>

          <View style={styles.stepsContainer}>
            {/* Step 1 */}
            <View style={styles.stepRow}>
              <View style={styles.stepLeft}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>1</Text>
                </View>
                <View style={styles.stepConnector} />
              </View>
              <View style={styles.stepBody}>
                <Text style={[styles.stepTitle, { color: themeColors.stepTitle }]}>Download APK</Text>
                <Text style={[styles.stepDesc, { color: themeColors.stepDesc }]}>Fetches and stores the game on your device.</Text>
              </View>
            </View>

            {/* Step 2 */}
            <View style={[styles.stepRow, styles.stepRowLast]}>
              <View style={styles.stepLeft}>
                <View style={[styles.stepBadge, styles.stepBadgeSecondary]}>
                  <Text style={styles.stepBadgeText}>2</Text>
                </View>
              </View>
              <View style={styles.stepBody}>
                <Text style={[styles.stepTitle, { color: themeColors.stepTitle }]}>Install / Play</Text>
                <Text style={[styles.stepDesc, { color: themeColors.stepDesc }]}>Opens Android installer so you can install and launch.</Text>
              </View>
            </View>
          </View>

          {/* ── BUTTONS ── */}
          <Pressable
            style={({ pressed }) => [styles.buttonWrapper, pressed && styles.buttonPressed]}
            disabled={isDownloading || Platform.OS !== "android"}
            onPress={handleDownload}
          >
            <LinearGradient
              colors={themeColors.primaryBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.button, (isDownloading || Platform.OS !== "android") && styles.buttonDisabled]}
            >
              {isDownloading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.buttonIcon}>⬇</Text>
                  <Text style={styles.buttonText}>{downloadedUri ? "Re-download APK" : "Download APK"}</Text>
                </>
              )}
            </LinearGradient>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.buttonWrapper, pressed && styles.buttonPressed]}
            disabled={!downloadedUri || isLaunchingInstaller || Platform.OS !== "android"}
            onPress={handleInstallAndPlay}
          >
            <LinearGradient
              colors={themeColors.secondaryBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.button, (!downloadedUri || isLaunchingInstaller || Platform.OS !== "android") && styles.buttonDisabled]}
            >
              {isLaunchingInstaller ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.buttonIcon}>▶</Text>
                  <Text style={styles.buttonText}>Install / Play</Text>
                </>
              )}
            </LinearGradient>
          </Pressable>
        </View>

        <Pressable onPress={() => router.back()} style={styles.linkButton}>
          <Text style={[styles.linkText, { color: themeColors.link }]}>← Back to game modes</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function createStyles(darkMode: boolean, multiplier: number) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: darkMode ? "#0D0D0D" : "#F2EDE6",
    },
    ambientGlow: {
      position: "absolute",
      top: -60,
      left: "10%",
      width: "80%",
      height: 260,
      borderRadius: 999,
      opacity: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 12,
      gap: 14,
    },

    // ── HERO CARD ──
    heroCard: {
      borderRadius: 28,
      padding: 20,
      shadowColor: "#000",
      shadowOpacity: darkMode ? 0.5 : 0.12,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 6 },
      elevation: 10,
    },
    heroTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 18,
    },
    backButton: {
      width: 38,
      height: 38,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: darkMode ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)",
    },
    backButtonText: {
      color: darkMode ? "#FFFFFF" : "#333333",
      fontSize: 24,
      lineHeight: 26,
      fontWeight: "700",
      marginLeft: -1,
    },
    platformChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 11,
      paddingVertical: 6,
      borderRadius: 999,
    },
    chipDot: {
      width: 5,
      height: 5,
      borderRadius: 99,
      opacity: 0.7,
    },
    platformChipText: {
      fontSize: 11.5 * multiplier,
      fontWeight: "700",
      letterSpacing: 0.4,
      textTransform: "uppercase",
    },
    title: {
      fontSize: 36 * multiplier,
      fontWeight: "900",
      letterSpacing: -0.5,
      lineHeight: 40 * multiplier,
    },
    subtitle: {
      fontSize: 13.5 * multiplier,
      marginTop: 6,
      marginBottom: 14,
      letterSpacing: 0.1,
    },
    divider: {
      height: 0,
      marginBottom: 12,
      borderRadius: 1,
    },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 99,
      shadowOpacity: 0.8,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 0 },
      elevation: 2,
    },
    statusText: {
      fontSize: 12.5 * multiplier,
      fontWeight: "600",
      letterSpacing: 0.1,
    },

    // ── CONTENT CARD ──
    card: {
      borderRadius: 26,
      padding: 20,
      gap: 14,
      shadowColor: "#000",
      shadowOpacity: darkMode ? 0.4 : 0.09,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },
    cardTitle: {
      fontSize: 17 * multiplier,
      fontWeight: "800",
      letterSpacing: 0.1,
    },
    cardText: {
      fontSize: 13.5 * multiplier,
      lineHeight: 20,
    },

    // ── STEPS ──
    stepsContainer: {
      borderRadius: 16,
      overflow: "hidden",
      paddingHorizontal: 14,
      paddingTop: 14,
      paddingBottom: 6,
    },
    stepRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
      paddingBottom: 14,
    },
    stepRowLast: {
      paddingBottom: 8,
    },
    stepLeft: {
      alignItems: "center",
      width: 26,
    },
    stepConnector: {
      width: 1.5,
      flex: 1,
      marginTop: 4,
      minHeight: 16,
      backgroundColor: darkMode ? "rgba(141,163,153,0.25)" : "rgba(106,144,113,0.2)",
      borderRadius: 1,
    },
    stepBadge: {
      width: 26,
      height: 26,
      borderRadius: 999,
      backgroundColor: darkMode ? "#6F9E7A" : "#5D8A68",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: darkMode ? "#6F9E7A" : "#5D8A68",
      shadowOpacity: 0.45,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    stepBadgeSecondary: {
      backgroundColor: darkMode ? "#506180" : "#4F5F7B",
      shadowColor: darkMode ? "#506180" : "#4F5F7B",
    },
    stepBadgeText: {
      color: "#FFFFFF",
      fontWeight: "800",
      fontSize: 11.5 * multiplier,
    },
    stepBody: {
      flex: 1,
      gap: 2,
      paddingRight: 4,
    },
    stepTitle: {
      fontSize: 13.5 * multiplier,
      fontWeight: "700",
    },
    stepDesc: {
      fontSize: 12.5 * multiplier,
      lineHeight: 18,
    },

    // ── BUTTONS ──
    buttonWrapper: {
      borderRadius: 18,
      overflow: "hidden",
    },
    buttonPressed: {
      opacity: 0.88,
      transform: [{ scale: 0.985 }],
    },
    button: {
      minHeight: 54,
      borderRadius: 18,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 20,
    },
    buttonIcon: {
      color: "rgba(255,255,255,0.75)",
      fontSize: 14 * multiplier,
    },
    buttonText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 15 * multiplier,
      letterSpacing: 0.15,
    },
    buttonDisabled: {
      opacity: 0.38,
    },

    // ── LINK ──
    linkButton: {
      marginTop: 2,
      alignSelf: "center",
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    linkText: {
      fontWeight: "600",
      fontSize: 13.5 * multiplier,
      letterSpacing: 0.1,
    },
  });
}