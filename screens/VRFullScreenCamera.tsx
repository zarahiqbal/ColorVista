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

export default function VRFullScreenCamera({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const { userData } = useUserData();

  const [facing, setFacing] = useState<"front" | "back">("back");
  const [torch, setTorch] = useState(false);
  const [streamingEnabled, setStreamingEnabled] = useState(true);
  const [fps, setFps] = useState(0);
  // Cloud processing path intentionally disabled for VR mode.
  // Previous API path (for reference):
  // POST /process-live-frame with per-frame camera captures.

  const effectiveCvdType = useMemo(
    () => normalizeCvdType(userData?.cvdType),
    [userData?.cvdType],
  );

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission?.granted, requestPermission]);

  useEffect(() => {
    if (!permission?.granted) {
      setFps(0);
      return;
    }

    // Instant mode aims to stay at camera frame rate.
    setFps(streamingEnabled ? 60 : 0);
  }, [permission?.granted, streamingEnabled]);

  const toggleCamera = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
    setTorch(false); // turn off torch when switching
  };

  const toggleTorch = () => {
    if (facing === "front") return; // torch doesn't work on front camera
    setTorch((prev) => !prev);
  };

  const toggleStreaming = () => {
    setStreamingEnabled((prev) => !prev);
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
        <View style={styles.statusRow}>
          <View style={styles.statusPill}>
            <Text style={styles.text}>
              CVD: {effectiveCvdType.toUpperCase()}
            </Text>
          </View>

          <View style={styles.statusPill}>
            <Text style={styles.text} numberOfLines={1}>
              {fps} FPS · Instant mode active
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.controlBtnCompact}
            onPress={toggleStreaming}
          >
            <Text style={styles.text}>
              {streamingEnabled ? "Enhance On" : "Enhance Off"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlBtnCompact}
            onPress={toggleTorch}
          >
            <Text style={styles.text}>{torch ? "Torch On" : "Torch Off"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BOTTOM CONTROLS */}
      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.controlBtn} onPress={toggleCamera}>
          <Text style={styles.text}>Flip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.text}>Back</Text>
        </TouchableOpacity>
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

  bottomControls: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },

  controlBtn: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
    borderRadius: 10,
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
