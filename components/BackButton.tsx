import { useTheme } from "@/Context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { Platform, Pressable, StyleSheet } from "react-native";

export default function BackButton() {
  const router = useRouter();
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const scale = getFontSizeMultiplier();
  const size = 40 * scale;

  // Don't show if there's no history (Home screen)
  if (!router.canGoBack()) return null;

  return (
    <Pressable
      onPress={() => router.back()}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: darkMode
            ? "rgba(255, 255, 255, 0.15)"
            : "rgba(0, 0, 0, 0.3)",
          opacity: pressed ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
      ]}
    >
      {Platform.OS === "ios" && (
        <BlurView
          intensity={20}
          tint={darkMode ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      )}
      <Ionicons name="chevron-back" size={22 * scale} color="#FFFFFF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginLeft: 8, // Gives it that WhatsApp spacing from the edge
  },
});
