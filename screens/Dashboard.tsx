import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, {
  Defs,
  Stop,
  LinearGradient as SvgLinearGradient,
  Text as SvgText,
} from "react-native-svg";

// Icon Imports
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// Theme & Auth (Assumed paths from your snippet)
import { useAuth } from "@/Context/AuthContext";
import { useTheme } from "@/Context/ThemeContext";
import { useUserData } from "@/Context/useUserData";
import { isNormalVision } from "@/constants/cvdUtils";

// ---------------- PREMIUM EARTH TONE PALETTE ----------------
const palette = {
  beigeBg: "#FDFCFB",
  charcoal: "#2D241E",
  espresso: "#2D241E",
  white: "#FFFFFF",
  textLight: "#8E8E93",
  mutedGold: "#C5A377",
  blue: "#4A90E2",
  peach: "#FFB88C",
  purple: "#A78BFA",
  teal: "#06B6D4",
  lime: "#84CC16",
  orange: "#FB923C",
};

// ---------------- TOOLS DATA ----------------
const toolsData = [
  {
    title: "Live Detection",
    screen: "live",
    color: palette.blue,
    size: "large",
    icon: <Ionicons name="videocam-outline" size={32} color="#FFFFFF" />,
  },
  {
    title: "Media Upload",
    screen: "mediaupload",
    color: palette.peach,
    size: "side",
    icon: <Feather name="image" size={24} color="#FFFFFF" />,
  },
  {
    title: "VR Simulation",
    screen: "vrrouter",
    color: palette.purple,
    size: "wide",
    subtext: "Experience immersive vision",
    icon: <MaterialCommunityIcons name="cube-scan" size={32} color="#FFFFFF" />,
  },
  {
    title: "Games",
    screen: "gamesscreen",
    color: palette.teal,
    size: "medium",
    icon: <Ionicons name="game-controller-outline" size={24} color="#FFFFFF" />,
  },
  {
    title: "Quiz",
    screen: "welcome",
    color: palette.lime,
    size: "side",
    icon: (
      <MaterialCommunityIcons
        name="clipboard-check-outline"
        size={24}
        color="#FFFFFF"
      />
    ),
  },
  {
    title: "Enhancer",
    screen: "enhancer",
    color: palette.orange,
    size: "medium",
    icon: <MaterialCommunityIcons name="auto-fix" size={24} color="#FFFFFF" />,
  },
];

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "Welcome!",
    message: "Thanks for joining Color Vista.",
    time: "Just now",
    icon: "heart" as any,
    color: "#FF6B6B",
  },
  {
    id: "2",
    title: "New Feature",
    message: "Try the VR Simulation tool now!",
    time: "2h ago",
    icon: "cube" as any,
    color: "#4A90E2",
  },
];

// ---------------- MAIN DASHBOARD SCREEN ----------------
export default function DashboardScreen() {
  const router = useRouter();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [lockModal, setLockModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    actionLabel: string;
    actionRoute: string;
  }>({
    visible: false,
    title: "",
    message: "",
    actionLabel: "",
    actionRoute: "",
  });
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const { darkMode, getFontSizeMultiplier } = useTheme();
  const { user } = useAuth();
  const { userData } = useUserData();

  const isGuest = user?.isGuest === true;
  const cvdType = userData?.cvdType || user?.cvdType;
  const isNormalUser = !isGuest && isNormalVision(cvdType);
  const scale = getFontSizeMultiplier();

  const theme = {
    bg: darkMode ? "#1C1C1E" : palette.beigeBg,
    card: darkMode ? "#2C2C2E" : palette.white,
    text: darkMode ? palette.beigeBg : palette.charcoal,
    subText: darkMode ? "#A1A1AA" : palette.textLight,
    border: darkMode ? "#333" : "#E5E5E5",
    iconBg: darkMode ? "#2C2C2E" : palette.white,
    espresso: darkMode ? palette.beigeBg : palette.espresso,
    mutedGold: palette.mutedGold,
    heroQuote: darkMode ? "rgba(255,255,255,0.7)" : "#8E8E93",
    inspireActionBg: darkMode ? palette.white : palette.espresso,
    inspireActionText: darkMode ? palette.espresso : palette.white,
    white: palette.white,
  };

  const navigate = (screen: string) => {
    const routeMap: Record<string, string> = {
      live: "/live",
      mediaupload: "/mediaupload",
      welcome: "/welcome",
      enhancer: "/enhancer",
      vrrouter: "/vrrouter",
      gamesscreen: "/gameui",
    };
    const route = routeMap[screen.toLowerCase()] || `/${screen.toLowerCase()}`;
    router.push(route as any);
  };

  const handleLockedFeature = (
    featureName: string,
    reason: "guest" | "normal",
  ) => {
    const isNormal = reason === "normal";
    setLockModal({
      visible: true,
      title: "Feature Locked",
      message: isNormal
        ? `Complete the quiz to unlock ${featureName}.`
        : `Sign up to access ${featureName}!`,
      actionLabel: isNormal ? "Take Quiz" : "Sign Up",
      actionRoute: isNormal ? "/welcome" : "/auth/signup",
    });
  };

  const handleProfilePress = () => {
    if (isGuest) {
      Alert.alert(
        "Guest Account",
        "Sign up to access your full profile and save settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign Up", onPress: () => router.push("/auth/signup") },
        ],
      );
    } else {
      setShowProfileModal(true);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.bg }]}
      edges={["top"]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={[
            isGuest ? styles.profileIcon : styles.profileIconActive,
            { backgroundColor: theme.iconBg, borderColor: theme.border },
          ]}
          onPress={handleProfilePress}
        >
          <FontAwesome
            name={isGuest ? "user-o" : "user"}
            size={18 * scale}
            color={theme.text}
          />
        </TouchableOpacity>

        <View style={styles.titleWrapper}>
          <Svg width={230 * scale} height={48 * scale}>
            <Defs>
              <SvgLinearGradient
                id="appTitleGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <Stop offset="0%" stopColor="#FFB88C" />
                <Stop offset="100%" stopColor="#A78BFA" />
              </SvgLinearGradient>
            </Defs>
            <SvgText
              x="50%"
              y="50%"
              fill="url(#appTitleGradient)"
              fontSize={34 * scale}
              fontWeight="600"
              fontFamily={Platform.OS === "ios" ? "Georgia" : "serif"}
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              Color Vista
            </SvgText>
          </Svg>
        </View>

        {!isGuest ? (
          <TouchableOpacity
            style={[
              styles.headerIconButton,
              { backgroundColor: theme.iconBg, borderColor: theme.border },
            ]}
            onPress={() => setShowNotificationsModal(true)}
          >
            <Ionicons
              name="notifications-outline"
              size={24 * scale}
              color={theme.text}
            />
            {notifications.length > 0 && (
              <View style={styles.notificationBadge} />
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.headerPlaceholder} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HeroCard
          theme={theme}
          scale={scale}
          userName={isGuest ? "Guest" : user?.firstName || "Friend"}
          onPressInspire={() => router.push("/getinspired")}
        />
        <ToolsGrid
          navigate={navigate}
          theme={theme}
          scale={scale}
          isGuest={isGuest}
          isNormalUser={isNormalUser}
          onLockedPress={handleLockedFeature}
        />
      </ScrollView>

      {/* Simplified Modal logic for functionality */}
      <Modal
        visible={showNotificationsModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Notifications
            </Text>
            {notifications.map((n) => (
              <View key={n.id} style={styles.notifItem}>
                <Text style={{ color: theme.subText }}>{n.title}</Text>
              </View>
            ))}
            <TouchableOpacity
              onPress={() => setShowNotificationsModal(false)}
              style={styles.closeBtn}
            >
              <Text style={{ color: palette.blue }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={lockModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setLockModal((prev) => ({ ...prev, visible: false }))
        }
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setLockModal((prev) => ({ ...prev, visible: false }))}
          activeOpacity={1}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.lockModalContent, { backgroundColor: theme.card }]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}
            >
              {lockModal.title}
            </Text>
            <Text style={[styles.lockModalText, { color: theme.subText }]}
            >
              {lockModal.message}
            </Text>
            <View style={styles.lockModalActions}>
              <TouchableOpacity
                style={[styles.lockSecondaryButton, { borderColor: theme.border }]}
                onPress={() =>
                  setLockModal((prev) => ({ ...prev, visible: false }))
                }
              >
                <Text style={[styles.lockSecondaryText, { color: theme.text }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.lockActionButton, { backgroundColor: theme.espresso }]}
                onPress={() => {
                  setLockModal((prev) => ({ ...prev, visible: false }));
                  router.push(lockModal.actionRoute as any);
                }}
              >
                <Text
                  style={[
                    styles.lockActionText,
                    { color: darkMode ? palette.charcoal : theme.white },
                  ]}
                >
                  {lockModal.actionLabel}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {!isGuest && (
        <ProfileModal
          visible={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          theme={theme}
          scale={scale}
          user={user}
        />
      )}
    </SafeAreaView>
  );
}

const ProfileModal = ({ visible, onClose, theme, scale, user }: any) => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleViewProfile = () => {
    onClose();
    router.push("/userprofile");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.modalContent,
            { backgroundColor: theme.card, width: "85%" },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text
            style={[
              styles.modalTitle,
              { color: theme.text, fontSize: 18 * scale },
            ]}
          >
            My Account
          </Text>
          <Text
            style={{
              color: theme.subText,
              marginTop: 10,
              marginBottom: 16,
              fontSize: 14 * scale,
            }}
          >
            Signed in as {user?.firstName || user?.email || "User"}
          </Text>

          <TouchableOpacity
            onPress={handleViewProfile}
            style={{ marginBottom: 14 }}
          >
            <Text
              style={{
                color: theme.espresso,
                fontSize: 16 * scale,
                fontWeight: "600",
              }}
            >
              View Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              onClose();
              await logout();
              router.replace("/auth/login");
            }}
          >
            <Text
              style={{
                color: "#EF4444",
                fontSize: 16 * scale,
                fontWeight: "600",
              }}
            >
              Log Out
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// ---------------- SUB-COMPONENTS ----------------

const HeroCard = ({ theme, scale, userName, onPressInspire }: any) => (
  <View
    style={[
      styles.heroSection,
      {
        backgroundColor: theme.card,
        shadowColor: theme.text,
        borderColor: theme.border,
      },
    ]}
  >
    <View style={styles.heroCardTop}>
      <Text
        style={[
          styles.heroGreeting,
          { color: theme.espresso, fontSize: 32 * scale },
        ]}
      >
        Hello,{" "}
        <Text style={[styles.heroName, { color: theme.mutedGold }]}>
          {userName}
        </Text>
      </Text>
      <Text
        style={[
          styles.heroQuote,
          { color: theme.heroQuote, fontSize: 16 * scale },
        ]}
      >
        Your vision is a unique lens on the world.
      </Text>
    </View>

    <TouchableOpacity
      onPress={onPressInspire}
      style={[styles.inspireAction, { backgroundColor: theme.inspireActionBg }]}
    >
      <Text
        style={[
          styles.inspireActionText,
          { color: theme.inspireActionText, fontSize: 14 * scale },
        ]}
      >
        Get Inspired
      </Text>
      <Feather
        name="arrow-up-right"
        size={16 * scale}
        color={theme.inspireActionText}
        style={{ marginLeft: 8 }}
      />
    </TouchableOpacity>
  </View>
);

const ToolsGrid = ({
  navigate,
  theme,
  scale,
  isGuest,
  isNormalUser,
  onLockedPress,
}: any) => {
  const GUEST_ALLOWED = ["live", "mediaupload"];
  const NORMAL_ALLOWED = ["live", "mediaupload", "welcome"];

  const renderCard = (tool: (typeof toolsData)[0], customStyle?: any) => {
    const toolKey = tool.screen.toLowerCase();
    const isLocked =
      (isGuest && !GUEST_ALLOWED.includes(toolKey)) ||
      (isNormalUser && !NORMAL_ALLOWED.includes(toolKey));

    return (
      <TouchableOpacity
        key={tool.title}
        style={[
          styles.bentoCard,
          customStyle,
          { backgroundColor: tool.color },
          isLocked && styles.cardLocked,
        ]}
        onPress={() =>
          isLocked
            ? onLockedPress(tool.title, isGuest ? "guest" : "normal")
            : navigate(tool.screen)
        }
      >
        <View style={tool.size === "large" ? styles.largeCardHeader : null}>
          <View
            style={
              tool.size === "wide" ? styles.iconCircleWide : styles.iconCircle
            }
          >
            {tool.icon}
          </View>
          {tool.size === "large" && (
            <Feather name="arrow-right" size={20} color="#FFF" />
          )}
        </View>
        <View style={tool.size === "wide" ? styles.wideCardTextCont : null}>
          <Text
            style={[
              tool.size === "large"
                ? styles.cardLabelLarge
                : styles.cardLabelSmall,
              { fontSize: (tool.size === "large" ? 20 : 14) * scale },
            ]}
          >
            {tool.title}
          </Text>
          {tool.subtext && (
            <Text style={styles.cardSubLabel}>{tool.subtext}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.bentoContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {renderCard(toolsData[0], styles.largeCard)}
        <View style={styles.sideColumn}>
          {renderCard(toolsData[1], styles.squareCard)}
          {renderCard(toolsData[4], styles.squareCard)}
        </View>
      </View>
      {renderCard(toolsData[2], styles.wideCard)}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {renderCard(toolsData[3], styles.mediumCard)}
        {renderCard(toolsData[5], styles.mediumCard)}
      </View>
    </View>
  );
};

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  appName: {
    fontWeight: "600",
    fontStyle: "italic",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    textAlign: "center",
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  appNameGradient: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
  },
  headerIconsRight: { flexDirection: "row", alignItems: "center" },
  headerIconButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    marginLeft: 12,
    borderWidth: 1,
  },
  headerPlaceholder: {
    width: 42,
    height: 42,
  },
  profileIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  profileIconActive: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  notificationBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF5252",
    position: "absolute",
    top: 6,
    right: 8,
    borderWidth: 2,
    borderColor: palette.beigeBg,
  },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
  heroSection: {
    marginBottom: 36,
    marginTop: 10,
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  heroCardTop: {
    marginBottom: 18,
  },
  heroGreeting: {
    fontWeight: "700",
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  heroName: { fontWeight: "800" },
  heroQuote: {
    fontStyle: "italic",
    marginTop: 4,
    lineHeight: 24,
  },
  inspireAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginTop: 12,
    elevation: 4,
  },
  inspireActionText: { fontWeight: "700" },
  bentoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  bentoCard: { borderRadius: 28, padding: 20, marginBottom: 16, elevation: 4 },
  cardLocked: { opacity: 0.4 },
  largeCard: { width: "57%", height: 180, justifyContent: "flex-end" },
  sideColumn: {
    width: "39%",
    justifyContent: "space-between",
    height: 180,
    marginBottom: 16,
  },
  squareCard: {
    width: "100%",
    height: 82,
    alignItems: "center",
    justifyContent: "center",
  },
  wideCard: {
    width: "100%",
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 24,
  },
  mediumCard: {
    width: "48%",
    height: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  largeCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    top: 20,
    left: 20,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircleWide: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  wideCardTextCont: { marginLeft: 18 },
  cardLabelLarge: { color: "#FFF", fontWeight: "700" },
  cardSubLabel: { color: "rgba(255,255,255,0.85)", fontSize: 12 },
  cardLabelSmall: {
    color: "#FFF",
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: { width: "80%", padding: 20, borderRadius: 20 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  notifItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  closeBtn: { marginTop: 20, alignSelf: "center" },
  lockModalContent: {
    width: "85%",
    padding: 24,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  lockModalText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  lockModalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  lockSecondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  lockSecondaryText: {
    fontWeight: "600",
  },
  lockActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  lockActionText: {
    fontWeight: "700",
    color: "white",
  },
});
