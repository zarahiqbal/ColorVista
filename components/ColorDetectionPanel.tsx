import {
    DetectedColor,
    getContrastingTextColor,
} from "@/constants/colorPickerUtils";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

interface ColorDetectionPanelProps {
  color: DetectedColor | null;
  visible: boolean;
  onClose?: () => void;
  onSave?: (color: DetectedColor) => void;
  darkMode?: boolean;
}

export default function ColorDetectionPanel({
  color,
  visible,
  onClose,
  onSave,
  darkMode = false,
}: ColorDetectionPanelProps) {
  const slideAnim = useRef(new Animated.Value(500)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && color) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 500,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, color]);

  if (!color) return null;

  const textColor = getContrastingTextColor(color.brightness);
  const backgroundColor =
    color.brightness === "light"
      ? "rgba(0, 0, 0, 0.9)"
      : "rgba(255, 255, 255, 0.95)";
  const contentTextColor = color.brightness === "light" ? "#FFFFFF" : "#000000";

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      {/* Glassmorphism background */}
      <View
        style={[
          styles.glassPanel,
          {
            backgroundColor,
            borderColor:
              color.brightness === "light"
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.1)",
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons
              name="color-palette-outline"
              size={24}
              color={contentTextColor}
            />
            <Text style={[styles.title, { color: contentTextColor }]}>
              Color Detected
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={contentTextColor} />
          </TouchableOpacity>
        </View>

        {/* Color preview */}
        <View
          style={[
            styles.colorPreview,
            {
              backgroundColor: color.hex,
              borderColor:
                color.brightness === "light"
                  ? "rgba(0, 0, 0, 0.15)"
                  : "rgba(0, 0, 0, 0.1)",
            },
          ]}
        >
          <Text
            style={[
              styles.previewLabel,
              { color: getContrastingTextColor(color.brightness) },
            ]}
          >
            Preview
          </Text>
        </View>

        {/* Color information */}
        <View style={styles.infoContainer}>
          {/* Color Name */}
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Ionicons
                name="brush-outline"
                size={18}
                color={contentTextColor}
              />
              <Text
                style={[
                  styles.labelText,
                  { color: contentTextColor, opacity: 0.7 },
                ]}
              >
                Color Name
              </Text>
            </View>
            <Text style={[styles.valueText, { color: contentTextColor }]}>
              {color.name}
            </Text>
          </View>

          {/* Hex Code */}
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Ionicons
                name="code-outline"
                size={18}
                color={contentTextColor}
              />
              <Text
                style={[
                  styles.labelText,
                  { color: contentTextColor, opacity: 0.7 },
                ]}
              >
                Hex
              </Text>
            </View>
            <Text
              style={[styles.valueText, { color: contentTextColor }]}
              selectable
            >
              {color.hex}
            </Text>
          </View>

          {/* RGB Values */}
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Ionicons
                name="settings-outline"
                size={18}
                color={contentTextColor}
              />
              <Text
                style={[
                  styles.labelText,
                  { color: contentTextColor, opacity: 0.7 },
                ]}
              >
                RGB
              </Text>
            </View>
            <Text
              style={[styles.valueText, { color: contentTextColor }]}
              selectable
            >
              ({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
            </Text>
          </View>

          {/* Brightness indicator */}
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Ionicons
                name={
                  color.brightness === "light"
                    ? "sunny-outline"
                    : "moon-outline"
                }
                size={18}
                color={contentTextColor}
              />
              <Text
                style={[
                  styles.labelText,
                  { color: contentTextColor, opacity: 0.7 },
                ]}
              >
                Tone
              </Text>
            </View>
            <Text
              style={[
                styles.valueText,
                {
                  color: contentTextColor,
                  textTransform: "capitalize",
                },
              ]}
            >
              {color.brightness === "light" ? "Light" : "Dark"}
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  color.brightness === "light"
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(0, 0, 0, 0.1)",
                borderColor:
                  color.brightness === "light"
                    ? "rgba(255, 255, 255, 0.3)"
                    : "rgba(0, 0, 0, 0.2)",
              },
            ]}
            onPress={onClose}
          >
            <Text style={[styles.buttonText, { color: contentTextColor }]}>
              Close
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  color.brightness === "light"
                    ? "rgba(255, 255, 255, 0.3)"
                    : "rgba(0, 0, 0, 0.2)",
              },
            ]}
            onPress={() => onSave?.(color)}
          >
            <Ionicons
              name="bookmark-outline"
              size={18}
              color={contentTextColor}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.buttonText, { color: contentTextColor }]}>
              Save Color
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  glassPanel: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    paddingTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    overflow: "hidden",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  closeButton: {
    padding: 8,
  },

  colorPreview: {
    width: "100%",
    height: 100,
    borderRadius: 16,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  previewLabel: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.7,
  },

  infoContainer: {
    gap: 12,
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },

  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  labelText: {
    fontSize: 12,
    fontWeight: "600",
  },

  valueText: {
    fontSize: 14,
    fontWeight: "700",
    maxWidth: "50%",
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },

  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
