/**
 * VRFullScreenCamera
 * ──────────────────
 * A pure, zero-UI VR colorblind-lens camera screen.
 *
 * Designed to run full-screen inside a VR headset as a passthrough camera feed
 * with a CVD compensation overlay that mimics EnChroma-style spectral notch
 * filtering. No buttons, no labels, no borders — just the corrected view.
 *
 * The overlay layers are stacked absoluteFillObject views with low-opacity RGBA
 * backgrounds. Together they shift hue perception so that colors the user
 * previously confused now appear distinguishable, the same way CVD glasses
 * work by filtering the M/L or S/M cone overlap wavelengths.
 */

import { useRoute } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useUserData } from "../Context/useUserData";
import {
  VR_CVD_DALTON_MATCHED_OVERLAY,
  type CVDType,
} from "../constants/vrCvdDaltonMatchedOverlay";

// ─── CVD type normalizer ───────────────────────────────────────────────────

type RawCVDType = CVDType | "none";

const normalizeCvdType = (raw?: string | null): RawCVDType => {
  if (!raw) return "none";
  const n = raw.toLowerCase().trim();
  if (n.includes("protan") && n.includes("deuter")) return "deuteranopia";
  if (n.includes("protan"))  return "protanopia";
  if (n.includes("deuter"))  return "deuteranopia";
  if (n.includes("tritan"))  return "tritanopia";
  if (n.includes("normal") || n.includes("none") || n.includes("no cvd"))
    return "none";
  return "deuteranopia"; // safe default
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function VRFullScreenCamera() {
  const route  = useRoute();
  const [permission, requestPermission] = useCameraPermissions();
  const { userData } = useUserData();

  // Auto-request permission silently — no UI shown for the request itself
  // because in VR context the permission should be pre-granted at app launch.
  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission?.granted, requestPermission]);

  // Resolve CVD type: navigation param takes priority over user profile
  const effectiveCvdType = useMemo<RawCVDType>(() => {
    const navSim = (route as any)?.params?.simulation as string | undefined;
    if (navSim) return normalizeCvdType(navSim);
    return normalizeCvdType(userData?.cvdType);
  }, [userData?.cvdType, (route as any)?.params?.simulation]);

  // Resolve overlay config — null for "none" (no CVD, no overlay)
  const overlayConfig = useMemo(() => {
    if (effectiveCvdType === "none") return null;
    return VR_CVD_DALTON_MATCHED_OVERLAY[effectiveCvdType];
  }, [effectiveCvdType]);

  // If permission not yet granted, render a blank black screen.
  // In VR context this is intentional — no text, no prompts.
  if (!permission?.granted) {
    return <View style={styles.black} />;
  }

  return (
    <View style={styles.root}>
      {/* ── Passthrough camera feed ── */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={false}
        animateShutter={false}
      />

      {/* ── EnChroma-style spectral notch compensation layers ──
          Each layer is a full-screen semi-transparent color plane.
          Stacked in order (bottom → top) they compose to simulate
          the effect of blocking the M/L or S/M cone overlap wavelength band,
          allowing the brain to perceive cleaner color separation.           */}
      {overlayConfig?.layers.map((layer) => (
        <View
          key={layer.key}
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: layer.backgroundColor },
          ]}
          accessible={false}
          importantForAccessibility="no"
        />
      ))}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Full-bleed root — fills the entire VR viewport, no safe area insets
  root: {
    flex: 1,
    backgroundColor: "#000",
  },

  // Shown only while camera permission is pending
  black: {
    flex: 1,
    backgroundColor: "#000",
  },
});