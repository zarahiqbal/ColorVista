// import { useTheme } from "@/Context/ThemeContext";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { StyleSheet, TouchableOpacity } from "react-native";

// interface BackButtonProps {
//   onPress?: () => void;
// }

// export default function BackButton({ onPress }: BackButtonProps) {
//   const router = useRouter();
//   const { darkMode, getFontSizeMultiplier } = useTheme();
//   const scale = getFontSizeMultiplier();

//   const palette = {
//     beigeBg: "#F6F3EE",
//     charcoal: "#2F2F2F",
//     sage: "#8DA399",
//     taupe: "#AA957B",
//     white: "#FFFFFF",
//     textLight: "#6B6661",
//   };

//   const theme = {
//     bg: darkMode ? "#1C1C1E" : palette.beigeBg,
//     iconBg: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
//     icon: darkMode ? "#F6F3EE" : palette.charcoal,
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
//       style={[styles.backButton, { backgroundColor: theme.iconBg }]}
//       onPress={handlePress}
//       activeOpacity={0.7}
//     >
//       <Ionicons name="chevron-back" size={24 * scale} color={theme.icon} />
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     alignItems: "left" ,
//     justifyContent: "center",
//     marginLeft: 16,
//     marginTop: 8,
//   },
// });
import { useTheme } from "@/Context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

interface BackButtonProps {
  onPress?: () => void;
}

export default function BackButton({ onPress }: BackButtonProps) {
  const router = useRouter();
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const scale = getFontSizeMultiplier();

  const theme = {
    // Semi-transparent backgrounds to mimic the UI in your image
    iconBg: darkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.3)",
    icon: "#FFFFFF", // The image shows a white icon regardless of background
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.backButton, { backgroundColor: theme.iconBg }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Ionicons name="chevron-back" size={20 * scale} color={theme.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20, // Perfect circle (width / 2)
    alignItems: "center", // Centered horizontally
    justifyContent: "center", // Centered vertically
    marginLeft: 16,
    marginTop: 16,
  },
});
