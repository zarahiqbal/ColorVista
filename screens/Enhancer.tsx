import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../Context/ThemeContext"; // ← import your hook

// Props
interface EnhancerScreenProps {
  onSaveImage: (imageUri?: string) => void;
  onSavePreferences: () => void;
  onApplySystem: () => void;
}

export default function EnhancerScreen({
  onSaveImage,
  onSavePreferences,
  onApplySystem,
}: EnhancerScreenProps) {
  // ── Theme ──
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const scale = getFontSizeMultiplier();

  // Dynamic theme colors based on darkMode
  const theme = {
    bg: darkMode ? "#1C1C1A" : "#EDEAE3",
    card: darkMode ? "#2A2A27" : "#E4E0D8",
    accent: "#7A9E8E",
    textPrimary: darkMode ? "#F0EDE6" : "#2B2B2B",
    textSecondary: darkMode ? "#9A9690" : "#7A7670",
    buttonDark: darkMode ? "#3A3A37" : "#2B2B2B",
    compareBg: darkMode ? "rgba(28,28,26,0.82)" : "rgba(237,234,227,0.82)",
    white: "#FFFFFF",
  };

  // Image state
  const [imageUri, setImageUri] = useState(
    "https://picsum.photos/id/28/600/400",
  );
  const [aspectRatio, setAspectRatio] = useState(600 / 400);
  const [showOriginal, setShowOriginal] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need gallery permissions to continue!",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      if (asset.width && asset.height) {
        setAspectRatio(asset.width / asset.height);
      }
    }
  };

  const handleAction = (action: string) => {
    switch (action) {
      case "save":
        onSaveImage?.(imageUri);
        break;
      case "prefs":
        onSavePreferences();
        break;
      case "apply":
        onApplySystem();
        break;
      default:
        console.warn("Unknown action:", action);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar style={darkMode ? "light" : "dark"} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text
            style={[
              styles.headerTitle,
              {
                color: theme.textPrimary,
                fontSize: 28 * scale, // ← scaled
              },
            ]}
          >
            Image Enhancer
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              {
                color: theme.textSecondary,
                fontSize: 14 * scale, // ← scaled
              },
            ]}
          >
            Select a photo to enhance and save
          </Text>
        </View>

        {/* Image Card */}
        <View style={[styles.imageCard, { backgroundColor: theme.card }]}>
          <View style={[styles.imageWrapper, { aspectRatio }]}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="cover"
            />

            {/* Compare Badge */}
            <TouchableOpacity
              style={[
                styles.compareButton,
                { backgroundColor: theme.compareBg },
              ]}
              onPressIn={() => setShowOriginal(true)}
              onPressOut={() => setShowOriginal(false)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={showOriginal ? "eye" : "eye-outline"}
                size={13 * scale}
                color={theme.textPrimary}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.compareButtonText,
                  {
                    color: theme.textPrimary,
                    fontSize: 11 * scale, // ← scaled
                  },
                ]}
              >
                {showOriginal ? "Original" : "Hold to compare"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Status Row */}
          <View style={styles.statusRow}>
            <View
              style={[styles.statusDot, { backgroundColor: theme.accent }]}
            />
            <Text
              style={[
                styles.statusText,
                {
                  color: theme.textSecondary,
                  fontSize: 13 * scale, // ← scaled
                },
              ]}
            >
              Ready to enhance
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.accent }]}
            onPress={pickImage}
            activeOpacity={0.85}
          >
            <Ionicons
              name="image-outline"
              size={18 * scale}
              color={theme.white}
              style={styles.buttonIcon}
            />
            <Text style={[styles.actionButtonText, { fontSize: 15 * scale }]}>
              Select from Gallery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.buttonDark }]}
            onPress={() => handleAction("save")}
            activeOpacity={0.85}
          >
            <Ionicons
              name="download-outline"
              size={18 * scale}
              color={theme.white}
              style={styles.buttonIcon}
            />
            <Text style={[styles.actionButtonText, { fontSize: 15 * scale }]}>
              Save Enhanced Image
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Static styles (no colors or font sizes — those are applied inline via theme)
const styles = StyleSheet.create({
  container: { flex: 1 },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    alignItems: "center",
  },

  headerContainer: {
    alignItems: "center",
    paddingTop: 12,
    marginBottom: 28,
  },

  headerTitle: {
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 6,
  },

  headerSubtitle: {
    letterSpacing: 0.1,
  },

  imageCard: {
    borderRadius: 28,
    padding: 14,
    marginBottom: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  imageWrapper: {
    borderRadius: 18,
    overflow: "hidden",
    width: "100%",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  compareButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  compareButtonText: {
    fontWeight: "600",
    letterSpacing: 0.1,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 4,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 7,
  },

  statusText: {
    letterSpacing: 0.1,
  },

  actionsContainer: {
    width: "100%",
    gap: 12,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  buttonIcon: {
    marginRight: 10,
  },

  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    letterSpacing: 0.2,
    flex: 1,
    textAlign: "center",
    marginRight: 28,
  },
});
