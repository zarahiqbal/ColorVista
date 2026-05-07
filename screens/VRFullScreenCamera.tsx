import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserData } from "../Context/useUserData";

type CVDType = "none" | "deuteranopia" | "protanopia" | "tritanopia";

const normalizeCvdType = (rawType?: string | null): CVDType => {
  if (!rawType) return "none";

  const normalized = rawType.toLowerCase().trim();
  if (normalized.includes("protan") && normalized.includes("deuter"))
    return "deuteranopia";
  if (normalized.includes("protan")) return "protanopia";
  if (normalized.includes("deuter")) return "deuteranopia";
  if (normalized.includes("tritan")) return "tritanopia";
  if (
    normalized.includes("normal") ||
    normalized.includes("none") ||
    normalized.includes("no cvd")
  )
    return "none";

  return "deuteranopia";
};

import { useRoute } from '@react-navigation/native';

export default function VRFullScreenCamera() {
  const route = useRoute();
  const [permission, requestPermission] = useCameraPermissions();
  const { userData } = useUserData();

  const [facing, setFacing] = useState<"front" | "back">("back");
  const [torch, setTorch] = useState(false);
  const streamingEnabled = true;
  // Cloud processing path intentionally disabled for VR mode.
  // Previous API path (for reference):
  // POST /process-live-frame with per-frame camera captures.

  const effectiveCvdType = useMemo(() => {
    // First prefer explicit simulation passed via navigation param
    const navSim = (route as any)?.params?.simulation as string | undefined;
    if (navSim) {
      // map incoming names to normalized internal types
      return normalizeCvdType(navSim);
    }
    return normalizeCvdType(userData?.cvdType);
  }, [userData?.cvdType, (route as any)?.params?.simulation]);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission?.granted, requestPermission]);

  const toggleTorch = () => {
    if (facing === "front") return; // torch doesn't work on front camera
    setTorch((prev) => !prev);
  };

  const getInstantOverlayStyle = () => {
    switch (effectiveCvdType) {
      case "deuteranopia":
        return {
          backgroundColor: "rgba(120, 20, 170, 0.16)",
          borderColor: "rgba(130, 230, 255, 0.22)",
        };
      case "protanopia":
        return {
          backgroundColor: "rgba(40, 120, 210, 0.16)",
          borderColor: "rgba(120, 255, 170, 0.22)",
        };
      case "tritanopia":
        return {
          backgroundColor: "rgba(255, 190, 40, 0.14)",
          borderColor: "rgba(255, 120, 80, 0.20)",
        };
      default:
        return {
          backgroundColor: "rgba(0,0,0,0)",
          borderColor: "rgba(0,0,0,0)",
        };
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff", marginBottom: 10 }}>
          Camera permission required
        </Text>

        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={{ color: "#000" }}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />

      {/* CAMERA */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        enableTorch={torch}
        animateShutter={false}
      />

      {streamingEnabled && effectiveCvdType !== "none" && (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            styles.instantOverlay,
            getInstantOverlayStyle(),
          ]}
        />
      )}

      {/* TOP CONTROLS */}
      <View style={styles.topControls}>
        <View style={styles.statusRow} />

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.controlBtnCompact}
            onPress={toggleTorch}
            accessibilityLabel={torch ? "Turn torch off" : "Turn torch on"}
          >
            <Ionicons
              name={torch ? "flash" : "flash-outline"}
              size={18}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  center: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  btn: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
  },

  topControls: {
    position: "absolute",
    top: 44,
    width: "100%",
    paddingHorizontal: 12,
    gap: 8,
  },

  statusRow: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  actionsRow: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-start",
  },

  controlBtnCompact: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },

  statusPill: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    flex: 1,
    minWidth: 0,
  },

  instantOverlay: {
    borderWidth: 3,
  },

  text: {
    color: "#fff",
    fontSize: 13,
  },
});
