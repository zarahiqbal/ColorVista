import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { useNotifications } from "@/Context/NotificationContext";
import type { UserNotification } from "@/Context/notificationFirestore";

interface NotificationPanelProps {
  visible: boolean;
  onClose: () => void;
  darkMode: boolean;
  scale?: number;
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function iconName(raw?: string): keyof typeof Ionicons.glyphMap {
  const allowed = new Set([
    "heart",
    "cube",
    "megaphone-outline",
    "sparkles",
    "gift",
    "information-circle",
    "notifications",
  ]);
  if (raw && allowed.has(raw)) {
    return raw as keyof typeof Ionicons.glyphMap;
  }
  return "notifications-outline";
}

function NotificationCard({
  item,
  darkMode,
  scale,
  onMarkRead,
  onRemove,
}: {
  item: UserNotification;
  darkMode: boolean;
  scale: number;
  onMarkRead: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const accent = item.color ?? "#4A90E2";
  const cardBg = darkMode ? "#2C2C2E" : "#FFFFFF";
  const textColor = darkMode ? "#F5F5F5" : "#2D241E";
  const subColor = darkMode ? "#A1A1AA" : "#8E8E93";
  const unreadBg = darkMode ? "rgba(74,144,226,0.12)" : "rgba(74,144,226,0.08)";

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: item.read ? cardBg : unreadBg,
          borderColor: darkMode ? "#3A3A3C" : "#ECE7E1",
        },
      ]}
    >
      <View style={styles.cardRow}>
        <View style={[styles.iconWrap, { backgroundColor: `${accent}22` }]}>
          <Ionicons name={iconName(item.icon)} size={20} color={accent} />
        </View>

        <View style={styles.cardBody}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.cardTitle,
                {
                  color: textColor,
                  fontSize: 15 * scale,
                  fontWeight: item.read ? "600" : "700",
                },
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          <Text
            style={[styles.cardMessage, { color: subColor, fontSize: 13 * scale }]}
          >
            {item.message}
          </Text>
          <Text style={[styles.cardTime, { color: subColor, fontSize: 11 * scale }]}>
            {formatRelativeTime(item.createdAt)}
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        {!item.read && (
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: accent }]}
            onPress={() => onMarkRead(item.id)}
          >
            <Ionicons name="checkmark-done-outline" size={14} color={accent} />
            <Text style={[styles.actionText, { color: accent }]}>Mark read</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.actionBtn,
            styles.removeBtn,
            { borderColor: darkMode ? "#555" : "#E0D8D0" },
          ]}
          onPress={() => onRemove(item.id)}
        >
          <Ionicons
            name="trash-outline"
            size={14}
            color={darkMode ? "#FF8A80" : "#C0392B"}
          />
          <Text
            style={[
              styles.actionText,
              { color: darkMode ? "#FF8A80" : "#C0392B" },
            ]}
          >
            Remove
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function NotificationPanel({
  visible,
  onClose,
  darkMode,
  scale = 1,
}: NotificationPanelProps) {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications();

  const panelBg = darkMode ? "#1C1C1E" : "#FDFCFB";
  const textColor = darkMode ? "#F5F5F5" : "#2D241E";
  const subColor = darkMode ? "#A1A1AA" : "#8E8E93";

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={[styles.sheet, { backgroundColor: panelBg }]}>
          <LinearGradient
            colors={darkMode ? ["#3A3A3C", "#1C1C1E"] : ["#FFB88C", "#A78BFA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View>
                <Text style={[styles.headerTitle, { fontSize: 20 * scale }]}>
                  Notifications
                </Text>
                <Text style={styles.headerSubtitle}>
                  {unreadCount > 0
                    ? `${unreadCount} unread`
                    : "You're all caught up"}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {unreadCount > 0 && (
            <View style={styles.toolsRow}>
              <TouchableOpacity
                style={[
                  styles.markAllBtn,
                  { backgroundColor: darkMode ? "#2C2C2E" : "#FFFFFF" },
                ]}
                onPress={() => markAllAsRead()}
              >
                <Ionicons
                  name="checkmark-done"
                  size={16}
                  color={darkMode ? "#A78BFA" : "#4A90E2"}
                />
                <Text
                  style={[
                    styles.markAllText,
                    { color: darkMode ? "#A78BFA" : "#4A90E2" },
                  ]}
                >
                  Mark all as read
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {isLoading && notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color="#A78BFA" />
            </View>
          ) : notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <View
                style={[
                  styles.emptyIcon,
                  { backgroundColor: darkMode ? "#2C2C2E" : "#F0EBE4" },
                ]}
              >
                <Ionicons
                  name="notifications-off-outline"
                  size={36}
                  color={subColor}
                />
              </View>
              <Text style={[styles.emptyTitle, { color: textColor }]}>
                No notifications yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: subColor }]}>
                Announcements from Color Vista will appear here.
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            >
              {notifications.map((item) => (
                <NotificationCard
                  key={item.id}
                  item={item}
                  darkMode={darkMode}
                  scale={scale}
                  onMarkRead={markAsRead}
                  onRemove={removeNotification}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center", // Centered vertically
    alignItems: "center",     // Centered horizontally
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)", // Slightly darkened for better focus on the center modal
  },
  sheet: {
    width: "90%",             // Constrains width for center placement
    maxHeight: "75%",         // Prevents modal from touching top/bottom edges
    borderRadius: 24,         // Uniform radius on all corners
    overflow: "hidden",       // Clips the header gradient
    paddingBottom: 16,
    // Add shadow to make the centered modal float beautifully
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  headerGradient: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 18,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
    fontSize: 13,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  toolsRow: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
  },
  markAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center text within the button
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignSelf: "flex-start",
  },
  markAllText: {
    fontWeight: "600",
    fontSize: 13,
  },
  list: {
    marginTop: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12, // Slightly increased gap for better readability
  },
  card: {
    borderRadius: 16, // Smoothed card corners to match outer modal
    borderWidth: 1,
    padding: 14,
  },
  cardRow: {
    flexDirection: "row",
    gap: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardTitle: {
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF5252",
  },
  cardMessage: {
    marginTop: 4,
    lineHeight: 19,
  },
  cardTime: {
    marginTop: 6,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(128,128,128,0.25)",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  removeBtn: {
    marginLeft: "auto",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60, // Increased padding to look better centered
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});