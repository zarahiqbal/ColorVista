import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const palette = {
  beigeBg: "#F6F3EE",
  charcoal: "#2F2F2F",
  sage: "#8DA399",
  taupe: "#AA957B",
  white: "#FFFFFF",
  textLight: "#6B6661",
  error: "#C25B5B",
};

export type NoticeVariant = "success" | "info" | "error";

export type ThemedNoticeModalProps = {
  visible: boolean;
  title: string;
  message: string;
  primaryLabel?: string;
  onPrimary: () => void;
  darkMode: boolean;
  variant?: NoticeVariant;
};

export function ThemedNoticeModal({
  visible,
  title,
  message,
  primaryLabel = "OK",
  onPrimary,
  darkMode,
  variant = "info",
}: ThemedNoticeModalProps) {
  const card = darkMode ? "#2C2C2E" : palette.white;
  const text = darkMode ? palette.beigeBg : palette.charcoal;
  const sub = darkMode ? "#A1A1AA" : palette.textLight;
  const border = darkMode ? "#3A3A3C" : "#E5E5E5";

  const accent =
    variant === "success"
      ? palette.sage
      : variant === "error"
        ? palette.error
        : palette.taupe;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onPrimary}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <View style={[styles.accentBar, { backgroundColor: accent }]} />
          <View style={styles.iconWrap}>
            {variant === "success" ? (
              <Ionicons name="checkmark-circle" size={40} color={accent} />
            ) : variant === "error" ? (
              <Ionicons name="alert-circle" size={40} color={accent} />
            ) : (
              <Ionicons name="mail-outline" size={40} color={accent} />
            )}
          </View>
          <Text style={[styles.title, { color: text }]}>{title}</Text>
          <Text style={[styles.message, { color: sub }]}>{message}</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: palette.charcoal }]}
            onPress={onPrimary}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>{primaryLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  card: {
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 22,
    borderWidth: 1,
    overflow: "hidden",
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  iconWrap: {
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 22,
  },
  button: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
