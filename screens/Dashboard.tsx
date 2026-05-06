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
    Alert.alert(
      "Feature Locked",
      isNormal
        ? `Complete the quiz to unlock ${featureName}.`
        : `Sign up to access ${featureName}!`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: isNormal ? "Take Quiz" : "Sign Up",
          onPress: () => router.push(isNormal ? "/welcome" : "/auth/signup"),
        },
      ],
    );
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
  const GUEST_ALLOWED = ["live", "mediaupload", "welcome"];

  const renderCard = (tool: (typeof toolsData)[0], customStyle?: any) => {
    const isLocked =
      (isGuest && !GUEST_ALLOWED.includes(tool.screen.toLowerCase())) ||
      (isNormalUser &&
        tool.screen.toLowerCase() !== "welcome" &&
        tool.screen.toLowerCase() !== "live");

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
});
// import { router, Stack, useRouter } from "expo-router";
// import { useState } from "react";
// import {
//   Alert,
//   FlatList,
//   Modal,
//   Platform,
//   Pressable,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// // Icon Imports
// import Feather from "@expo/vector-icons/Feather";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// // Theme & Auth
// import { useAuth } from "@/Context/AuthContext";
// import { useTheme } from "@/Context/ThemeContext";
// import { useUserData } from "@/Context/useUserData";
// import { isNormalVision } from "@/constants/cvdUtils";

// // ---------------- EARTH TONE PALETTE ----------------
// const palette = {
//   beigeBg: "#F6F3EE",
//   charcoal: "#2F2F2F",
//   sage: "#8DA399",
//   taupe: "#AA957B",
//   white: "#FFFFFF",
//   textLight: "#6B6661",
//   // Tool colors
//   blue: "#4A90E2",
//   peach: "#FFB88C",
//   purple: "#A78BFA",
//   teal: "#06B6D4",
//   lime: "#84CC16",
//   orange: "#FB923C",
// };

// const toolsData = [
//   {
//     title: "Live Detection",
//     screen: "live",
//     color: palette.blue,
//     icon: <Ionicons name="water" size={32} color="#FFFFFF" />,
//   },
//   {
//     title: "Media Upload",
//     screen: "mediaupload",
//     color: palette.peach,
//     icon: <Feather name="upload-cloud" size={32} color="#FFFFFF" />,
//   },
//   {
//     title: "VR Simulation",
//     screen: "Vrrouter",
//     color: palette.purple,
//     icon: <MaterialCommunityIcons name="cube-scan" size={32} color="#FFFFFF" />,
//   },
//   {
//     title: "Games",
//     screen: "gamesscreen",
//     color: palette.teal,
//     icon: <Ionicons name="game-controller" size={32} color="#FFFFFF" />,
//   },
//   {
//     title: "Quiz",
//     screen: "welcome",
//     color: palette.lime,
//     icon: <MaterialCommunityIcons name="help-box" size={32} color="#FFFFFF" />,
//   },
//   {
//     title: "Enhancer",
//     screen: "enhancer",
//     color: palette.orange,
//     icon: (
//       <MaterialCommunityIcons
//         name="star-four-points"
//         size={32}
//         color="#FFFFFF"
//       />
//     ),
//   },
// ];

// const MOCK_NOTIFICATIONS = [
//   {
//     id: "1",
//     title: "Welcome!",
//     message: "Thanks for joining Color Vista.",
//     time: "Just now",
//     icon: "heart",
//     color: "#FF6B6B",
//   },
//   {
//     id: "2",
//     title: "New Feature",
//     message: "Try the VR Simulation tool now!",
//     time: "2h ago",
//     icon: "cube",
//     color: "#4A90E2",
//   },
//   {
//     id: "3",
//     title: "Daily Tip",
//     message: "Lighting affects color perception.",
//     time: "1d ago",
//     icon: "bulb",
//     color: "#FFD93D",
//   },
// ];

// // Helper to get a soft pastel background based on the icon color
// const getSoftColor = (hex: string) => {
//   if (hex.includes("#FF6B6B")) return "rgba(255, 107, 107, 0.15)"; // Red
//   if (hex.includes("#4A90E2")) return "rgba(74, 144, 226, 0.15)"; // Blue
//   if (hex.includes("#FFD93D")) return "rgba(255, 217, 61, 0.15)"; // Yellow
//   return "rgba(128, 128, 128, 0.1)"; // Default gray
// };

// // ---------------- MAIN DASHBOARD SCREEN ----------------
// export default function DashboardScreen() {
//   const router = useRouter();
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [showNotificationsModal, setShowNotificationsModal] = useState(false);

//   // 1. STATE LIFTED UP: Manage notifications here so the Red Dot knows about it
//   const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

//   const { darkMode, getFontSizeMultiplier } = useTheme();
//   const { user } = useAuth();
//   const { userData } = useUserData();

//   const isGuest = user?.isGuest === true;
//   const cvdType = userData?.cvdType || user?.cvdType;
//   const isNormalUser = !isGuest && isNormalVision(cvdType);
//   const scale = getFontSizeMultiplier();

//   const theme = {
//     bg: darkMode ? "#1C1C1E" : palette.beigeBg,
//     card: darkMode ? "#2C2C2E" : palette.white,
//     text: darkMode ? "#F6F3EE" : palette.charcoal,
//     subText: darkMode ? "#A1A1AA" : palette.textLight,
//     border: darkMode ? "#333" : "#E5E5E5",
//     iconBg: darkMode ? "#2C2C2E" : palette.white,
//     heroBg: darkMode ? "#3E3020" : "#F5E6D3",
//     heroText: darkMode ? "#E5D0B1" : "#6B5A47",
//     notificationBg: darkMode ? "#2C2C2E" : "#F3F4F6",
//   };

//   // Navigation Logic
//   const navigate = (screen: string) => {
//     const target = screen.toLowerCase();
//     const COMING_SOON_FEATURES: string[] = [];

//     if (COMING_SOON_FEATURES.includes(target)) {
//       const toolTitle =
//         toolsData.find((t) => t.screen === screen)?.title || "New Feature";
//       router.push({
//         pathname: "/comingsoon",
//         params: { featureName: toolTitle },
//       });
//       return;
//     }

//     const routeMap: Record<string, any> = {
//       live: "/live",
//       mediaupload: "/mediaupload",
//       welcome: "/welcome",
//       enhancer: "/enhancer",
//       vrscreen: "/Vrrouter",
//       gamesscreen: "/gameui",
//     };

//     const route = routeMap[target];
//     if (route) {
//       router.push(route);
//     } else {
//       router.push(("/" + target) as any);
//     }
//   };

//   const handleProfilePress = () => {
//     if (isGuest) {
//       Alert.alert(
//         "Guest Account",
//         "Sign up to access your full profile and save settings.",
//         [
//           { text: "Cancel", style: "cancel" },
//           { text: "Sign Up", onPress: () => router.push("/auth/signup") },
//         ],
//       );
//     } else {
//       setShowProfileModal(true);
//     }
//   };

//   const handleLockedFeature = (
//     featureName: string,
//     reason: "guest" | "normal",
//   ) => {
//     if (reason === "normal") {
//       Alert.alert(
//         "Feature Locked",
//         `Complete the quiz to unlock ${featureName} and personalize your CVD tools.`,
//         [
//           { text: "Cancel", style: "cancel" },
//           { text: "Take Quiz", onPress: () => router.push("/welcome") },
//         ],
//       );
//       return;
//     }

//     Alert.alert(
//       "Feature Locked",
//       `Sign up to access ${featureName} and save your progress!`,
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "Sign Up", onPress: () => router.push("/auth/signup") },
//       ],
//     );
//   };

//   return (
//     <SafeAreaView
//       style={[styles.safeArea, { backgroundColor: theme.bg }]}
//       edges={["top", "left", "right"]}
//     >
//       <Stack.Screen options={{ gestureEnabled: false }} />
//       <StatusBar
//         barStyle={darkMode ? "light-content" : "dark-content"}
//         backgroundColor={theme.bg}
//       />

//       {/* Top Header */}
//       <View style={[styles.headerContainer, { backgroundColor: theme.bg }]}>
//         <TouchableOpacity
//           style={[
//             styles.profileIcon,
//             { backgroundColor: theme.iconBg, borderColor: theme.border },
//           ]}
//           onPress={handleProfilePress}
//         >
//           <FontAwesome name="user" size={18 * scale} color={theme.text} />
//         </TouchableOpacity>

//         <Text
//           style={[styles.appName, { color: theme.text, fontSize: 30 * scale }]}
//         >
//           Color Vista
//         </Text>

//         {isGuest ? (
//           <View style={{ width: 40 }} />
//         ) : (
//           <TouchableOpacity
//             style={[
//               styles.notificationButton,
//               { backgroundColor: theme.iconBg, borderColor: theme.border },
//             ]}
//             onPress={() => setShowNotificationsModal(true)}
//           >
//             <Ionicons
//               name="notifications-outline"
//               size={24 * scale}
//               color={theme.text}
//             />
//             {/* 2. CONDITIONAL RED DOT: Only show if array has items */}
//             {notifications.length > 0 && (
//               <View style={styles.notificationBadge} />
//             )}
//           </TouchableOpacity>
//         )}
//       </View>

//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <HeroCard
//           onGoToWelcome={() => router.push("/welcome")}
//           theme={theme}
//           scale={scale}
//           userName={isGuest ? "Guest" : user?.firstName || ""}
//         />

//         <ToolsGrid
//           navigate={navigate}
//           theme={theme}
//           scale={scale}
//           isGuest={isGuest}
//           isNormalUser={isNormalUser}
//           onLockedPress={handleLockedFeature}
//         />
//       </ScrollView>

//       {/* Profile Modal */}
//       {!isGuest && (
//         <ProfileModal
//           visible={showProfileModal}
//           onClose={() => setShowProfileModal(false)}
//           theme={theme}
//           scale={scale}
//           user={user}
//         />
//       )}

//       {/* Notification Modal */}
//       {!isGuest && (
//         <NotificationModal
//           visible={showNotificationsModal}
//           onClose={() => setShowNotificationsModal(false)}
//           theme={theme}
//           scale={scale}
//           notifications={notifications} // Pass Data
//           onClear={() => setNotifications([])} // Pass Handler
//         />
//       )}
//     </SafeAreaView>
//   );
// }

// // ---------------- HERO CARD ----------------
// const HeroCard = ({ theme, scale, userName }: any) => (
//   <View style={[styles.heroCard, { backgroundColor: theme.heroBg }]}>
//     <View style={styles.heroContent}>
//       <Text
//         style={[
//           styles.heroTitle,
//           { color: theme.heroText, fontSize: 26 * scale },
//         ]}
//       >
//         Hello,{" "}
//         <Text style={[styles.heroTitleSerif, { color: theme.heroText }]}>
//           {userName}
//         </Text>
//       </Text>
//       <Text
//         style={[
//           styles.heroQuote,
//           { color: theme.heroText, fontSize: 13 * scale },
//         ]}
//       >
//         "Your vision is a special perspective to see the world"
//       </Text>

//       <TouchableOpacity
//         onPress={() => router.push("/getinspired")}
//         style={[styles.inspireButton, { borderColor: theme.heroText }]}
//       >
//         <Text
//           style={[
//             styles.inspireButtonText,
//             { color: theme.heroText, fontSize: 14 * scale },
//           ]}
//         >
//           Get Inspired
//         </Text>
//         <Feather
//           name="arrow-right"
//           size={14 * scale}
//           color={theme.heroText}
//           style={{ marginLeft: 6 }}
//         />
//       </TouchableOpacity>
//     </View>
//   </View>
// );

// // ---------------- TOOLS GRID ----------------
// const ToolsGrid = ({
//   navigate,
//   theme,
//   scale,
//   isGuest,
//   isNormalUser,
//   onLockedPress,
// }: any) => {
//   const GUEST_ALLOWED_TOOLS = ["live", "mediaupload", "welcome"];
//   const NORMAL_ALLOWED_TOOLS = ["live", "mediaupload", "welcome"];

//   return (
//     <View style={styles.gridContainer}>
//       <View style={styles.gridWrapper}>
//         {toolsData.map((tool, index) => {
//           const toolKey = tool.screen.toLowerCase();
//           const isGuestLocked =
//             isGuest && !GUEST_ALLOWED_TOOLS.includes(toolKey);
//           const isNormalLocked =
//             isNormalUser && !NORMAL_ALLOWED_TOOLS.includes(toolKey);
//           const isLocked = isGuestLocked || isNormalLocked;
//           const lockReason = isGuestLocked ? "guest" : "normal";

//           return (
//             <View key={index} style={styles.gridItemWrapper}>
//               <TouchableOpacity
//                 style={[
//                   styles.toolCard,
//                   { backgroundColor: tool.color },
//                   isLocked && styles.toolCardLocked,
//                 ]}
//                 onPress={() =>
//                   isLocked
//                     ? onLockedPress(tool.title, lockReason)
//                     : navigate(tool.screen)
//                 }
//                 activeOpacity={0.8}
//               >
//                 {tool.icon}
//                 {isLocked && (
//                   <View style={styles.lockOverlay}>
//                     <Feather name="lock" size={24} color="#FFF" />
//                   </View>
//                 )}
//               </TouchableOpacity>
//               <Text
//                 style={[
//                   styles.toolLabel,
//                   { color: theme.text, fontSize: 12 * scale },
//                   isLocked && { color: theme.subText },
//                 ]}
//               >
//                 {tool.title}
//               </Text>
//             </View>
//           );
//         })}
//       </View>
//     </View>
//   );
// };

// // ---------------- NEW NOTIFICATION MODAL ----------------
// // 3. UPDATED MODAL: Receives props instead of managing local state
// const NotificationModal = ({
//   visible,
//   onClose,
//   theme,
//   scale,
//   notifications,
//   onClear,
// }: any) => {
//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <Pressable style={styles.notificationOverlay} onPress={onClose}>
//         <Pressable
//           style={[
//             styles.notificationContent,
//             { backgroundColor: theme.card, shadowColor: theme.text },
//           ]}
//           onPress={(e) => e.stopPropagation()}
//         >
//           {/* --- Header --- */}
//           <View
//             style={[styles.notifHeader, { borderBottomColor: theme.border }]}
//           >
//             <View>
//               <Text
//                 style={[
//                   styles.notifTitle,
//                   { color: theme.text, fontSize: 18 * scale },
//                 ]}
//               >
//                 Notifications
//               </Text>
//               {notifications.length > 0 && (
//                 <Text
//                   style={{
//                     color: theme.subText,
//                     fontSize: 12 * scale,
//                     marginTop: 2,
//                   }}
//                 >
//                   You have {notifications.length} unread
//                 </Text>
//               )}
//             </View>

//             {notifications.length > 0 && (
//               <TouchableOpacity onPress={onClear} style={{ padding: 4 }}>
//                 <Text
//                   style={{
//                     color: palette.sage,
//                     fontSize: 13 * scale,
//                     fontWeight: "600",
//                   }}
//                 >
//                   Clear all
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* --- List --- */}
//           <View style={{ maxHeight: 400 }}>
//             <FlatList
//               data={notifications}
//               keyExtractor={(item: any) => item.id}
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={{ padding: 16 }}
//               renderItem={({ item }: { item: any }) => (
//                 <View
//                   style={[
//                     styles.notifCard,
//                     { borderBottomColor: theme.border },
//                   ]}
//                 >
//                   {/* Icon with soft background */}
//                   <View
//                     style={[
//                       styles.notifIconBubble,
//                       { backgroundColor: getSoftColor(item.color) },
//                     ]}
//                   >
//                     <Ionicons
//                       name={item.icon as any}
//                       size={20}
//                       color={item.color}
//                     />
//                   </View>

//                   {/* Text Content */}
//                   <View style={{ flex: 1, marginLeft: 12 }}>
//                     <View
//                       style={{
//                         flexDirection: "row",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                       }}
//                     >
//                       <Text
//                         style={[
//                           styles.notifItemTitle,
//                           { color: theme.text, fontSize: 14 * scale },
//                         ]}
//                       >
//                         {item.title}
//                       </Text>
//                       <Text
//                         style={{ color: theme.subText, fontSize: 11 * scale }}
//                       >
//                         {item.time}
//                       </Text>
//                     </View>

//                     <Text
//                       style={{
//                         color: theme.subText,
//                         fontSize: 13 * scale,
//                         marginTop: 4,
//                         lineHeight: 18,
//                       }}
//                       numberOfLines={2}
//                     >
//                       {item.message}
//                     </Text>
//                   </View>

//                   {/* Unread Dot Indicator */}
//                   <View
//                     style={{
//                       width: 6,
//                       height: 6,
//                       borderRadius: 3,
//                       backgroundColor: palette.orange,
//                       marginLeft: 8,
//                       marginTop: 6,
//                     }}
//                   />
//                 </View>
//               )}
//               ListEmptyComponent={
//                 <View style={styles.emptyStateContainer}>
//                   <View
//                     style={[
//                       styles.emptyIconCircle,
//                       { backgroundColor: theme.iconBg },
//                     ]}
//                   >
//                     <Feather name="bell-off" size={28} color={theme.subText} />
//                   </View>
//                   <Text
//                     style={[
//                       styles.emptyStateText,
//                       { color: theme.text, fontSize: 15 * scale },
//                     ]}
//                   >
//                     No notifications yet
//                   </Text>
//                   <Text
//                     style={{
//                       color: theme.subText,
//                       fontSize: 12 * scale,
//                       textAlign: "center",
//                       marginTop: 4,
//                     }}
//                   >
//                     We'll let you know when updates arrive.
//                   </Text>
//                 </View>
//               }
//             />
//           </View>

//           {/* --- Footer (Optional) --- */}
//           {notifications.length > 0 && (
//             <TouchableOpacity
//               style={[styles.notifFooter, { borderTopColor: theme.border }]}
//               onPress={onClose}
//             >
//               <Text
//                 style={{
//                   color: theme.text,
//                   fontSize: 14 * scale,
//                   fontWeight: "500",
//                 }}
//               >
//                 Close
//               </Text>
//             </TouchableOpacity>
//           )}
//         </Pressable>
//       </Pressable>
//     </Modal>
//   );
// };

// // ---------------- PROFILE MODAL ----------------
// const ProfileModal = ({ visible, onClose, theme, scale, user }: any) => {
//   const router = useRouter();
//   const { logout } = useAuth();

//   const handleViewProfile = () => {
//     onClose();
//     router.push("/userprofile");
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <Pressable style={styles.modalOverlay} onPress={onClose}>
//         <Pressable
//           style={[
//             styles.profileModalContent,
//             { backgroundColor: theme.card, borderColor: theme.border },
//           ]}
//           onPress={(e) => e.stopPropagation()}
//         >
//           {/* Header */}
//           <View style={styles.modalHeader}>
//             <Text
//               style={[
//                 styles.modalTitle,
//                 { color: theme.text, fontSize: 18 * scale },
//               ]}
//             >
//               My Account
//             </Text>
//             <TouchableOpacity
//               onPress={onClose}
//               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//             >
//               <Feather name="x" size={22 * scale} color={theme.subText} />
//             </TouchableOpacity>
//           </View>

//           {/* Divider */}
//           <View
//             style={[styles.modalDivider, { backgroundColor: theme.border }]}
//           />

//           {/* Menu Items */}
//           <View style={styles.modalBody}>
//             <TouchableOpacity
//               style={styles.menuItem}
//               onPress={handleViewProfile}
//             >
//               <View style={styles.iconContainer}>
//                 <Feather name="user" size={20 * scale} color={theme.text} />
//               </View>
//               <Text
//                 style={[
//                   styles.menuItemText,
//                   { color: theme.text, fontSize: 16 * scale },
//                 ]}
//               >
//                 Profile
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.menuItem}
//               onPress={() => {
//                 onClose();
//                 router.push("/settings");
//               }}
//             >
//               <View style={styles.iconContainer}>
//                 <Feather name="settings" size={20 * scale} color={theme.text} />
//               </View>
//               <Text
//                 style={[
//                   styles.menuItemText,
//                   { color: theme.text, fontSize: 16 * scale },
//                 ]}
//               >
//                 Settings
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Divider */}
//           <View
//             style={[styles.modalDivider, { backgroundColor: theme.border }]}
//           />

//           {/* Log Out */}
//           <TouchableOpacity
//             style={styles.menuItem}
//             onPress={() => {
//               onClose();
//               logout();
//               router.replace("/auth/login");
//             }}
//           >
//             <View style={styles.iconContainer}>
//               <Feather name="log-out" size={20 * scale} color="#EF4444" />
//             </View>
//             <Text
//               style={[
//                 styles.menuItemText,
//                 { color: "#EF4444", fontSize: 16 * scale },
//               ]}
//             >
//               Log Out
//             </Text>
//           </TouchableOpacity>
//         </Pressable>
//       </Pressable>
//     </Modal>
//   );
// };

// // ---------------- STYLES ----------------
// const styles = StyleSheet.create({
//   safeArea: { flex: 1 },
//   headerContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 24,
//     paddingTop: 2,
//     paddingBottom: 20,
//   },
//   profileIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//   },
//   appName: {
//     fontWeight: "600",
//     letterSpacing: 0.6,
//     fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
//     fontStyle: "italic",
//     textAlign: "center",
//     paddingBottom: 20,
//     marginTop: 15,
//   },
//   notificationButton: {
//     width: 40,
//     height: 40,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 20,
//     borderWidth: 1,
//   },
//   notificationBadge: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#EF4444",
//     position: "absolute",
//     top: 8,
//     right: 10,
//     borderWidth: 1,
//     borderColor: "#FFF",
//   },
//   scrollView: { flex: 1 },
//   scrollContent: {
//     paddingHorizontal: 24,
//     paddingBottom: 120,
//   },

//   // Hero Card
//   heroCard: {
//     borderRadius: 16,
//     padding: 24,
//     marginTop: 8,
//     marginBottom: 32,
//     minHeight: 140,
//     justifyContent: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 5,
//     elevation: 2,
//     overflow: "hidden",
//   },
//   heroContent: {
//     zIndex: 1,
//   },
//   heroTitle: {
//     fontWeight: "600",
//     marginBottom: 6,
//     letterSpacing: 0.3,
//   },
//   heroTitleSerif: {
//     fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
//     fontWeight: "700",
//   },
//   heroQuote: {
//     fontStyle: "italic",
//     marginBottom: 18,
//     lineHeight: 20,
//     fontWeight: "400",
//     opacity: 0.8,
//   },
//   inspireButton: {
//     backgroundColor: "rgba(0,0,0, 0.05)",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//     alignSelf: "flex-start",
//     borderWidth: 1,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   inspireButtonText: {
//     fontWeight: "600",
//     letterSpacing: 0.2,
//   },

//   // Tools Grid
//   gridContainer: {
//     marginBottom: 20,
//   },
//   gridWrapper: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },
//   gridItemWrapper: {
//     width: "30%",
//     alignItems: "center",
//     marginBottom: 24,
//   },
//   toolCard: {
//     width: "100%",
//     aspectRatio: 1,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 3,
//   },
//   toolCardLocked: {
//     opacity: 0.5,
//   },
//   lockOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.2)",
//     borderRadius: 20,
//   },
//   toolLabel: {
//     fontWeight: "600",
//     textAlign: "center",
//     letterSpacing: 0.2,
//   },

//   // Profile Modal
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     justifyContent: "flex-start",
//     alignItems: "flex-start",
//     paddingTop: 65,
//     paddingLeft: 24,
//   },
//   profileModalContent: {
//     borderRadius: 20,
//     paddingVertical: 20,
//     paddingHorizontal: 20,
//     width: 280,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     elevation: 10,
//     borderWidth: Platform.OS === "android" ? 0.2 : 0,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   modalTitle: {
//     fontWeight: "700",
//     letterSpacing: 0.3,
//   },
//   modalDivider: {
//     height: 1,
//     width: "100%",
//     opacity: 0.5,
//     marginBottom: 8,
//     marginTop: 0,
//   },
//   modalBody: {
//     marginBottom: 8,
//     marginTop: 8,
//   },
//   menuItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//   },
//   iconContainer: {
//     width: 24,
//     marginRight: 16,
//     alignItems: "center",
//   },
//   menuItemText: {
//     fontWeight: "500",
//     letterSpacing: 0.2,
//   },

//   // ---------------- NOTIFICATION STYLES (NEW) ----------------
//   notificationOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.3)", // Slightly lighter overlay
//     justifyContent: "flex-start",
//     alignItems: "flex-end", // Aligns to right
//     paddingTop: Platform.OS === "ios" ? 60 : 50,
//     paddingRight: 20,
//   },
//   notificationContent: {
//     borderRadius: 24,
//     width: 320, // Slightly wider
//     elevation: 8, // Android Shadow
//     shadowOffset: { width: 0, height: 4 }, // iOS Shadow
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     overflow: "hidden", // Ensures content stays inside rounded corners
//   },
//   notifHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     padding: 20,
//     borderBottomWidth: 1,
//     backgroundColor: "rgba(255,255,255,0.02)", // Subtle highlight
//   },
//   notifTitle: {
//     fontWeight: "700",
//     letterSpacing: 0.3,
//   },
//   notifCard: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     marginBottom: 16,
//     paddingBottom: 16,
//     borderBottomWidth: 0.5,
//     borderBottomColor: "rgba(0,0,0,0.05)",
//   },
//   notifIconBubble: {
//     width: 40,
//     height: 40,
//     borderRadius: 14, // Soft square look
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   notifItemTitle: {
//     fontWeight: "600",
//     marginBottom: 2,
//   },
//   // Empty State Styles
//   emptyStateContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 40,
//     paddingHorizontal: 20,
//   },
//   emptyIconCircle: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   emptyStateText: {
//     fontWeight: "600",
//     marginBottom: 4,
//   },
//   notifFooter: {
//     paddingVertical: 14,
//     alignItems: "center",
//     borderTopWidth: 1,
//   },
// });
// import { router, useRouter } from 'expo-router';
// import { useState } from 'react';
// import {
//   Alert,
//   FlatList,
//   Modal,
//   Platform,
//   Pressable,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// // Icon Imports
// import Feather from 'react-native-vector-icons/Feather';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// // Theme & Auth
// import { useAuth } from '@/Context/AuthContext';
// import { useTheme } from '@/Context/ThemeContext';

// // ---------------- EARTH TONE PALETTE (Matching Profile) ----------------
// const palette = {
//   beigeBg: '#F6F3EE',
//   charcoal: '#2F2F2F',
//   sage: '#8DA399',
//   taupe: '#AA957B',
//   white: '#FFFFFF',
//   textLight: '#6B6661',
//   // Tool colors
//   blue: '#4A90E2',
//   peach: '#FFB88C',
//   purple: '#A78BFA',
//   teal: '#06B6D4',
//   lime: '#84CC16',
//   orange: '#FB923C',
// };

// const toolsData = [
//   {
//     title: 'Live Detection',
//     screen: 'live',
//     color: palette.blue,
//     icon: <Ionicons name="water" size={32} color="#FFFFFF" />,
//   },
//   {
//     title: 'Media Upload',
//     screen: 'mediaupload',
//     color: palette.peach,
//     icon: <Feather name="upload-cloud" size={32} color="#FFFFFF" />,
//   },
//   {
//     title: 'VR Simulation',
//     screen: 'vrscreen',
//     color: palette.purple,
//     icon: <MaterialCommunityIcons name="cube-scan" size={32} color="#FFFFFF" />,
//   },
//   {
//     title: 'Games',
//     screen: 'gamesscreen',
//     color: palette.teal,
//     icon: <Ionicons name="game-controller" size={32} color="#FFFFFF" />,
//   },
//   {
//     title: 'Quiz',
//     screen: 'welcome',
//     color: palette.lime,
//     icon: <MaterialCommunityIcons name="help-box" size={32} color="#FFFFFF" />,
//   },
//   {
//     title: 'Enhancer',
//     screen: 'enhancerscreen',
//     color: palette.orange,
//     icon: <MaterialCommunityIcons name="star-four-points" size={32} color="#FFFFFF" />,
//   },
// ];

// const MOCK_NOTIFICATIONS = [
//   { id: '1', title: 'Welcome!', message: 'Thanks for joining Color Vista.', time: 'Just now', icon: 'heart', color: '#FF6B6B' },
//   { id: '2', title: 'New Feature', message: 'Try the VR Simulation tool now!', time: '2h ago', icon: 'cube', color: '#4A90E2' },
//   { id: '3', title: 'Daily Tip', message: 'Lighting affects color perception.', time: '1d ago', icon: 'bulb', color: '#FFD93D' },
// ];

// // ---------------- MAIN DASHBOARD SCREEN ----------------
// export default function DashboardScreen() {
//   const router = useRouter();
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);

//   const { darkMode, getFontSizeMultiplier } = useTheme();
//   const { user } = useAuth();

//   const isGuest = user?.isGuest === true;
//   const scale = getFontSizeMultiplier();

//   // Consistent theme with Profile screen
//   const theme = {
//     bg: darkMode ? '#1C1C1E' : palette.beigeBg,
//     card: darkMode ? '#2C2C2E' : palette.white,
//     text: darkMode ? '#F6F3EE' : palette.charcoal,
//     subText: darkMode ? '#A1A1AA' : palette.textLight,
//     border: darkMode ? '#333' : '#E5E5E5',
//     iconBg: darkMode ? '#2C2C2E' : palette.white,
//     heroBg: darkMode ? '#3E3020' : '#F5E6D3',
//     heroText: darkMode ? '#E5D0B1' : '#6B5A47',
//     notificationBg: darkMode ? '#2C2C2E' : '#F3F4F6',
//   };

//   // Navigation Logic
//   const navigate = (screen: string) => {
//     const target = screen.toLowerCase();
//     const COMING_SOON_FEATURES = ['vrscreen', 'gamesscreen', 'enhancerscreen'];

//     if (COMING_SOON_FEATURES.includes(target)) {
//       const toolTitle = toolsData.find(t => t.screen === screen)?.title || "New Feature";
//       router.push({
//         pathname: "/comingsoon",
//         params: { featureName: toolTitle }
//       });
//       return;
//     }

//     const routeMap: Record<string, any> = {
//       "live": "/live",
//       "mediaupload": "/mediaupload",
//       "welcome": "/welcome",
//     };

//     const route = routeMap[target];
//     if (route) {
//       router.push(route);
//     } else {
//       router.push(("/" + target) as any);
//     }
//   };

//   // Handlers
//   const handleProfilePress = () => {
//     if (isGuest) {
//       Alert.alert(
//         "Guest Account",
//         "Sign up to access your full profile and save settings.",
//         [
//           { text: "Cancel", style: "cancel" },
//           { text: "Sign Up", onPress: () => router.push('/auth/signup') }
//         ]
//       );
//     } else {
//       setShowProfileModal(true);
//     }
//   };

//   const handleLockedFeature = (featureName: string) => {
//     Alert.alert(
//       "Feature Locked",
//       `Sign up to access ${featureName} and save your progress!`,
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "Sign Up", onPress: () => router.push('/auth/signup') }
//       ]
//     );
//   };

//   return (
//     <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]} edges={['top', 'left', 'right']}>
//       <StatusBar
//         barStyle={darkMode ? "light-content" : "dark-content"}
//         backgroundColor={theme.bg}
//       />

//       {/* Top Header */}
//       <View style={[styles.headerContainer, { backgroundColor: theme.bg }]}>
//         <TouchableOpacity
//           style={[styles.profileIcon, { backgroundColor: theme.iconBg, borderColor: theme.border }]}
//           onPress={handleProfilePress}
//         >
//           <FontAwesome name="user" size={18 * scale} color={theme.text} />
//         </TouchableOpacity>

//         <Text style={[styles.appName, { color: theme.text, fontSize: 30 * scale }]}>
//           Color Vista
//         </Text>

//         {/* Logic: If Guest, show empty View to maintain center alignment. If User, show button */}
//         {isGuest ? (
//             <View style={{ width: 40 }} />
//         ) : (
//             <TouchableOpacity
//                 style={[styles.notificationButton, { backgroundColor: theme.iconBg, borderColor: theme.border }]}
//                 onPress={() => setShowNotifications(true)}
//             >
//                 <Ionicons name="notifications-outline" size={24 * scale} color={theme.text} />
//                 {/* Optional Red Dot */}
//                 <View style={styles.notificationBadge} />
//             </TouchableOpacity>
//         )}
//       </View>

//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <HeroCard
//             onGoToWelcome={() => router.push("/welcome")}
//             theme={theme}
//             scale={scale}
//             userName={isGuest ? 'Guest' : (user?.firstName || '')}
//         />

//         <ToolsGrid
//           navigate={navigate}
//           theme={theme}
//           scale={scale}
//           isGuest={isGuest}
//           onLockedPress={handleLockedFeature}
//         />
//       </ScrollView>

//       {/* Profile Modal */}
//       {!isGuest && (
//           <ProfileModal
//             visible={showProfileModal}
//             onClose={() => setShowProfileModal(false)}
//             theme={theme}
//             scale={scale}
//             user={user}
//           />
//       )}

//       {/* Notification Modal */}
//       {!isGuest && (
//           <NotificationModal
//              visible={showNotifications}
//              onClose={() => setShowNotifications(false)}
//              theme={theme}
//              scale={scale}
//           />
//       )}
//     </SafeAreaView>
//   );
// }

// // ---------------- HERO CARD ----------------
// const HeroCard = ({ theme, scale, userName }: any) => (
//   <View style={[styles.heroCard, { backgroundColor: theme.heroBg }]}>
//     <View style={styles.heroContent}>
//       <Text style={[styles.heroTitle, { color: theme.heroText, fontSize: 26 * scale }]}>
//         Hello, <Text style={[styles.heroTitleSerif, { color: theme.heroText }]}>{userName}</Text>
//       </Text>
//       <Text style={[styles.heroQuote, { color: theme.heroText, fontSize: 13 * scale }]}>
//         "Your vision is a special perspective to see the world"
//       </Text>

//       <TouchableOpacity
//         onPress={() => router.push('/getinspired')}
//         style={[styles.inspireButton, { borderColor: theme.heroText }]}
//       >
//         <Text style={[styles.inspireButtonText, { color: theme.heroText, fontSize: 14 * scale }]}>
//             Get Inspired
//         </Text>
//         <Feather name="arrow-right" size={14 * scale} color={theme.heroText} style={{ marginLeft: 6 }} />
//       </TouchableOpacity>
//     </View>
//   </View>
// );

// // ---------------- TOOLS GRID ----------------
// const ToolsGrid = ({ navigate, theme, scale, isGuest, onLockedPress }: any) => {
//   const GUEST_ALLOWED_TOOLS = ['live', 'mediaupload'];

//   return (
//     <View style={styles.gridContainer}>
//       <View style={styles.gridWrapper}>
//         {toolsData.map((tool, index) => {
//           const isLocked = isGuest && !GUEST_ALLOWED_TOOLS.includes(tool.screen);

//           return (
//             <View key={index} style={styles.gridItemWrapper}>
//               <TouchableOpacity
//                 style={[
//                   styles.toolCard,
//                   { backgroundColor: tool.color },
//                   isLocked && styles.toolCardLocked
//                 ]}
//                 onPress={() => isLocked ? onLockedPress(tool.title) : navigate(tool.screen)}
//                 activeOpacity={0.8}
//               >
//                 {tool.icon}
//                 {isLocked && (
//                   <View style={styles.lockOverlay}>
//                     <Feather name="lock" size={24} color="#FFF" />
//                   </View>
//                 )}
//               </TouchableOpacity>
//               <Text style={[
//                 styles.toolLabel,
//                 { color: theme.text, fontSize: 12 * scale },
//                 isLocked && { color: theme.subText }
//               ]}>
//                 {tool.title}
//               </Text>
//             </View>
//           );
//         })}
//       </View>
//     </View>
//   );
// };

// // ---------------- NOTIFICATION MODAL (NEW) ----------------
// const NotificationModal = ({ visible, onClose, theme, scale }: any) => {
//     return (
//         <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
//             <Pressable style={styles.notificationOverlay} onPress={onClose}>
//                 <Pressable
//                     style={[styles.notificationContent, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}
//                     onPress={(e) => e.stopPropagation()}
//                 >
//                     {/* Header */}
//                     <View style={styles.modalHeader}>
//                         <Text style={[styles.modalTitle, { color: theme.text, fontSize: 18 * scale }]}>
//                             Notifications
//                         </Text>
//                         <TouchableOpacity onPress={onClose} hitSlop={10}>
//                             <Feather name="check-circle" size={20 * scale} color={theme.subText} />
//                         </TouchableOpacity>
//                     </View>

//                     <View style={[styles.modalDivider, { backgroundColor: theme.borderColor }]} />

//                     {/* List */}
//                     <View style={{ maxHeight: 300 }}>
//                         <FlatList
//                             data={MOCK_NOTIFICATIONS}
//                             keyExtractor={item => item.id}
//                             showsVerticalScrollIndicator={false}
//                             renderItem={({ item }) => (
//                                 <View style={[styles.notifItem, { backgroundColor: theme.notificationBg }]}>
//                                     <View style={[styles.notifIcon, { backgroundColor: item.color }]}>
//                                         <Ionicons name={item.icon as any} size={16} color="#FFF" />
//                                     </View>
//                                     <View style={{ flex: 1 }}>
//                                         <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
//                                             <Text style={{ fontWeight: '600', color: theme.text, fontSize: 14 * scale }}>{item.title}</Text>
//                                             <Text style={{ fontSize: 10 * scale, color: theme.subText }}>{item.time}</Text>
//                                         </View>
//                                         <Text style={{ color: theme.subText, fontSize: 12 * scale }} numberOfLines={2}>
//                                             {item.message}
//                                         </Text>
//                                     </View>
//                                 </View>
//                             )}
//                             ListEmptyComponent={
//                                 <Text style={{ textAlign: 'center', color: theme.subText, padding: 20 }}>
//                                     No new notifications
//                                 </Text>
//                             }
//                         />
//                     </View>
//                 </Pressable>
//             </Pressable>
//         </Modal>
//     );
// };

// // ---------------- PROFILE MODAL ----------------
// const ProfileModal = ({ visible, onClose, theme, scale, user }: any) => {
//   const router = useRouter();
//   const { logout } = useAuth();

//   const handleViewProfile = () => {
//     onClose();
//     router.push('/userprofile');
//   };

//   return (
//     <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
//       <Pressable style={styles.modalOverlay} onPress={onClose}>
//         <Pressable
//           style={[styles.profileModalContent, { backgroundColor: theme.card, borderColor: theme.border }]}
//           onPress={(e) => e.stopPropagation()}
//         >
//           {/* Header */}
//           <View style={styles.modalHeader}>
//             <Text style={[styles.modalTitle, { color: theme.text, fontSize: 18 * scale }]}>
//               My Account
//             </Text>
//             <TouchableOpacity onPress={onClose} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
//               <Feather name="x" size={22 * scale} color={theme.subText} />
//             </TouchableOpacity>
//           </View>

//           {/* Divider */}
//           <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />

//           {/* Menu Items */}
//           <View style={styles.modalBody}>
//             <TouchableOpacity style={styles.menuItem} onPress={handleViewProfile}>
//               <View style={styles.iconContainer}>
//                 <Feather name="user" size={20 * scale} color={theme.text} />
//               </View>
//               <Text style={[styles.menuItemText, { color: theme.text, fontSize: 16 * scale }]}>
//                 Profile
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.menuItem}
//               onPress={() => { onClose(); router.push('/settings'); }}
//             >
//               <View style={styles.iconContainer}>
//                 <Feather name="settings" size={20 * scale} color={theme.text} />
//               </View>
//               <Text style={[styles.menuItemText, { color: theme.text, fontSize: 16 * scale }]}>
//                 Settings
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Divider */}
//           <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />

//           {/* Log Out */}
//           <TouchableOpacity
//             style={styles.menuItem}
//             onPress={() => { onClose(); logout(); router.replace('/auth/login'); }}
//           >
//             <View style={styles.iconContainer}>
//               <Feather name="log-out" size={20 * scale} color="#EF4444" />
//             </View>
//             <Text style={[styles.menuItemText, { color: '#EF4444', fontSize: 16 * scale }]}>
//               Log Out
//             </Text>
//           </TouchableOpacity>
//         </Pressable>
//       </Pressable>
//     </Modal>
//   );
// };

// // ---------------- STYLES ----------------
// const styles = StyleSheet.create({
//   safeArea: { flex: 1 },
//   headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 2, paddingBottom: 20 },
//   profileIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
//   appName: { fontWeight: '600', letterSpacing: 0.6, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', fontStyle: 'italic', textAlign: 'center', paddingBottom: 20 },
//   notificationButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, borderWidth: 1 },
//   notificationBadge: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', position: 'absolute', top: 8, right: 10, borderWidth: 1, borderColor: '#FFF' },
//   scrollView: { flex: 1 },
//   scrollContent: {
//     paddingHorizontal: 24,
//     paddingBottom: 120
//   },

//   // Hero Card - Consistent with Profile cards
//   heroCard: {
//     borderRadius: 16,
//     padding: 24,
//     marginTop: 8,
//     marginBottom: 32,
//     minHeight: 140,
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 5,
//     elevation: 2,
//     overflow: 'hidden'
//   },
//   heroContent: {
//     zIndex: 1
//   },
//   heroTitle: {
//     fontWeight: '600',
//     marginBottom: 6,
//     letterSpacing: 0.3
//   },
//   heroTitleSerif: {
//     fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
//     fontWeight: '700'
//   },
//   heroQuote: {
//     fontStyle: 'italic',
//     marginBottom: 18,
//     lineHeight: 20,
//     fontWeight: '400',
//     opacity: 0.8,
//   },
//   inspireButton: {
//     backgroundColor: 'rgba(0,0,0, 0.05)',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//     alignSelf: 'flex-start',
//     borderWidth: 1,
//     flexDirection: 'row',
//     alignItems: 'center'
//   },
//   inspireButtonText: {
//     fontWeight: '600',
//     letterSpacing: 0.2
//   },

//   // Tools Grid - Consistent shadows and spacing
//   gridContainer: {
//     marginBottom: 20
//   },
//   gridWrapper: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between'
//   },
//   gridItemWrapper: {
//     width: '30%',
//     alignItems: 'center',
//     marginBottom: 24
//   },
//   toolCard: {
//     width: '100%',
//     aspectRatio: 1,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 3
//   },
//   toolCardLocked: {
//     opacity: 0.5
//   },
//   lockOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.2)',
//     borderRadius: 20
//   },
//   toolLabel: {
//     fontWeight: '600',
//     textAlign: 'center',
//     letterSpacing: 0.2
//   },

//   // Profile Modal
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     justifyContent: 'flex-start',
//     alignItems: 'flex-start',
//     paddingTop: 65,
//     paddingLeft: 24,
//   },
//   profileModalContent: {
//     borderRadius: 20,
//     paddingVertical: 20,
//     paddingHorizontal: 20,
//     width: 280,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     elevation: 10,
//     borderWidth: Platform.OS === 'android' ? 0.2 : 0,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   modalTitle: {
//     fontWeight: '700',
//     letterSpacing: 0.3,
//   },
//   modalDivider: {
//     height: 1,
//     width: '100%',
//     opacity: 0.5,
//     marginBottom: 8,
//     marginTop: 0,
//   },
//   modalBody: {
//     marginBottom: 8,
//     marginTop: 8,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   iconContainer: {
//     width: 24,
//     marginRight: 16,
//     alignItems: 'center'
//   },
//   menuItemText: {
//     fontWeight: '500',
//     letterSpacing: 0.2,
//   },

//   // Notification Modal Styles (Right Aligned)
//   notificationOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.4)',
//     justifyContent: 'flex-start',
//     alignItems: 'flex-end', // Aligns to right
//     paddingTop: 65,
//     paddingRight: 24,
//   },
//   notificationContent: {
//     borderRadius: 20,
//     paddingVertical: 20,
//     paddingHorizontal: 20,
//     width: 300,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     elevation: 10,
//     borderWidth: Platform.OS === 'android' ? 0.2 : 0,
//   },
//   notifItem: {
//       flexDirection: 'row',
//       padding: 12,
//       borderRadius: 12,
//       marginBottom: 10,
//   },
//   notifIcon: {
//       width: 32,
//       height: 32,
//       borderRadius: 16,
//       justifyContent: 'center',
//       alignItems: 'center',
//       marginRight: 12
//   }
// });
