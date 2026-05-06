// import { useTheme } from "@/Context/ThemeContext";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// interface BackButtonProps {
//   onPress?: () => void;
//   style?: StyleProp<ViewStyle>;
// }

// export default function BackButton({ onPress, style }: BackButtonProps) {
//   const router = useRouter();
//   const { darkMode, getFontSizeMultiplier } = useTheme();
//   const scale = getFontSizeMultiplier();
//   const insets = useSafeAreaInsets();

//   const theme = {
//     // Semi-transparent backgrounds to mimic the UI in your image
//     iconBg: darkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.3)",
//     icon: "#FFFFFF", // The image shows a white icon regardless of background
//   };

//   const handlePress = () => {
//     if (onPress) {
//       onPress();
//     } else {
//       router.back();
//     }
//   };

//   return (
//     <TouchableOpacity
//       style={[
//         styles.backButton,
//         {
//           backgroundColor: theme.iconBg,
//           top: insets.top + 8,
//         },
//         style,
//       ]}
//       onPress={handlePress}
//       activeOpacity={0.7}
//       accessibilityRole="button"
//       accessibilityLabel="Go back"
//       hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//     >
//       <Ionicons name="chevron-back" size={20 * scale} color={theme.icon} />
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20, // Perfect circle (width / 2)
//     alignItems: "center", // Centered horizontally
//     justifyContent: "center", // Centered vertically
//     position: "absolute",
//     left: 16,
//     zIndex: 20,
//   },
// });
// components/BackButton.tsx
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
// import { useTheme } from "@/Context/ThemeContext";
// import { Ionicons } from "@expo/vector-icons";
// import { BlurView } from "expo-blur"; // Optional: expo install expo-blur
// import { useRouter } from "expo-router";
// import {
//   Platform,
//   Pressable,
//   StyleProp,
//   StyleSheet,
//   View,
//   ViewStyle,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// interface BackButtonProps {
//   onPress?: () => void;
//   style?: StyleProp<ViewStyle>;
//   fallbackRoute?: string;
// }

// export default function BackButton({
//   onPress,
//   style,
//   fallbackRoute = "/",
// }: BackButtonProps) {
//   const router = useRouter();
//   const { darkMode, getFontSizeMultiplier } = useTheme();
//   const scale = getFontSizeMultiplier();
//   const insets = useSafeAreaInsets();

//   // Dynamic sizing based on theme scale
//   const baseSize = 40;
//   const scaledSize = baseSize * scale;

//   const theme = {
//     iconBg: darkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.3)",
//     iconColor: "#FFFFFF",
//   };

//   const handlePress = () => {
//     if (onPress) {
//       onPress();
//     } else if (router.canGoBack()) {
//       router.back();
//     } else {
//       // Prevents being stuck if opened via deep link
//       router.replace(fallbackRoute as any);
//     }
//   };

//   return (
//     <Pressable
//       onPress={handlePress}
//       accessibilityRole="button"
//       accessibilityLabel="Go back"
//       hitSlop={12}
//       style={({ pressed }) => [
//         styles.backButton,
//         {
//           width: scaledSize,
//           height: scaledSize,
//           borderRadius: scaledSize / 2,
//           backgroundColor: theme.iconBg,
//           top: insets.top + 8,
//           opacity: pressed ? 0.7 : 1, // Visual feedback for Pressable
//           transform: [{ scale: pressed ? 0.96 : 1 }],
//         },
//         style,
//       ]}
//     >
//       {/* iOS Glassmorphism Effect */}
//       {Platform.OS === "ios" && (
//         <BlurView
//           intensity={20}
//           tint={darkMode ? "dark" : "light"}
//           style={[StyleSheet.absoluteFill, { borderRadius: scaledSize / 2 }]}
//         />
//       )}

//       <View style={styles.iconContainer}>
//         <Ionicons
//           name="chevron-back"
//           size={Math.max(20, 20 * scale)}
//           color={theme.iconColor}
//         />
//       </View>
//     </Pressable>
//   );
// }

// const styles = StyleSheet.create({
//   backButton: {
//     // position: "absolute",
//     // left: 16,
//     zIndex: 20,
//     overflow: "hidden", // Clips the BlurView to the border radius
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   iconContainer: {
//     // Ensures icon is visually centered regardless of blur layer
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
