import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function VRFullScreenCamera({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();

  const [facing, setFacing] = useState<"front" | "back">("back");
  const [torch, setTorch] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const toggleCamera = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
    setTorch(false); // turn off torch when switching
  };

  const toggleTorch = () => {
    if (facing === "front") return; // torch doesn't work on front camera
    setTorch((prev) => !prev);
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
      />

      {/* TOP CONTROLS */}
      <View style={styles.topControls}>
        <TouchableOpacity style={styles.controlBtn} onPress={toggleTorch}>
          <Text style={styles.text}>{torch ? "Torch On" : "Torch Off"}</Text>
        </TouchableOpacity>
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
    top: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
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

  text: {
    color: "#fff",
    fontSize: 14,
  },
});
