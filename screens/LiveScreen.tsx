import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function LiveScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [active, setActive] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Detection</Text>

      <View style={styles.cameraBox}>
        {active ? (
          <CameraView style={StyleSheet.absoluteFill} facing="back" />
        ) : (
          <Text style={styles.placeholder}>Camera is Off</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, active ? styles.stopBtn : styles.startBtn]}
        onPress={() => setActive(!active)}
      >
        <Text style={styles.buttonText}>
          {active ? "Stop Detection" : "Start Live Detection"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 20 },
  cameraBox: {
    width: "100%",
    height: 350,
    backgroundColor: "#ddd",
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: { fontSize: 18, color: "#555" },
  button: { padding: 15, borderRadius: 12, alignItems: "center", marginTop: 20 },
  startBtn: { backgroundColor: "#2ECC71" },
  stopBtn: { backgroundColor: "#E74C3C" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
