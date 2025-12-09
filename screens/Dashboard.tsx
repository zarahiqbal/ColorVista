import { router, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Icon Imports
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Theme & Auth
import { useAuth } from '@/Context/AuthContext';
import { useTheme } from '@/Context/ThemeContext';

// ---------------- EARTH TONE PALETTE ----------------
const palette = {
  beigeBg: '#F6F3EE',
  charcoal: '#2F2F2F',
  sage: '#8DA399',
  taupe: '#AA957B',
  white: '#FFFFFF',
  textLight: '#6B6661',
  // Tool colors
  blue: '#4A90E2',
  peach: '#FFB88C',
  purple: '#A78BFA',
  teal: '#06B6D4',
  lime: '#84CC16',
  orange: '#FB923C',
};

const toolsData = [
  {
    title: 'Live Detection',
    screen: 'live',
    color: palette.blue,
    icon: <Ionicons name="water" size={32} color="#FFFFFF" />,
  },
  {
    title: 'Media Upload',
    screen: 'mediaupload',
    color: palette.peach,
    icon: <Feather name="upload-cloud" size={32} color="#FFFFFF" />,
  },
  {
    title: 'VR Simulation',
    screen: 'vrscreen',
    color: palette.purple,
    icon: <MaterialCommunityIcons name="cube-scan" size={32} color="#FFFFFF" />,
  },
  {
    title: 'Games',
    screen: 'gamesscreen',
    color: palette.teal,
    icon: <Ionicons name="game-controller" size={32} color="#FFFFFF" />,
  },
  {
    title: 'Quiz',
    screen: 'welcome',
    color: palette.lime,
    icon: <MaterialCommunityIcons name="help-box" size={32} color="#FFFFFF" />,
  },
  {
    title: 'Enhancer',
    screen: 'enhancerscreen',
    color: palette.orange,
    icon: <MaterialCommunityIcons name="star-four-points" size={32} color="#FFFFFF" />,
  },
];

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Welcome!', message: 'Thanks for joining Color Vista.', time: 'Just now', icon: 'heart', color: '#FF6B6B' },
  { id: '2', title: 'New Feature', message: 'Try the VR Simulation tool now!', time: '2h ago', icon: 'cube', color: '#4A90E2' },
  { id: '3', title: 'Daily Tip', message: 'Lighting affects color perception.', time: '1d ago', icon: 'bulb', color: '#FFD93D' },
];

// Helper to get a soft pastel background based on the icon color
const getSoftColor = (hex: string) => {
    if (hex.includes('#FF6B6B')) return 'rgba(255, 107, 107, 0.15)'; // Red
    if (hex.includes('#4A90E2')) return 'rgba(74, 144, 226, 0.15)'; // Blue
    if (hex.includes('#FFD93D')) return 'rgba(255, 217, 61, 0.15)'; // Yellow
    return 'rgba(128, 128, 128, 0.1)'; // Default gray
};

// ---------------- MAIN DASHBOARD SCREEN ----------------
export default function DashboardScreen() {
  const router = useRouter();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // 1. STATE LIFTED UP: Manage notifications here so the Red Dot knows about it
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const { darkMode, getFontSizeMultiplier } = useTheme();
  const { user } = useAuth(); 
  
  const isGuest = user?.isGuest === true;
  const scale = getFontSizeMultiplier();

  const theme = {
    bg: darkMode ? '#1C1C1E' : palette.beigeBg,
    card: darkMode ? '#2C2C2E' : palette.white,
    text: darkMode ? '#F6F3EE' : palette.charcoal,
    subText: darkMode ? '#A1A1AA' : palette.textLight,
    border: darkMode ? '#333' : '#E5E5E5',
    iconBg: darkMode ? '#2C2C2E' : palette.white,
    heroBg: darkMode ? '#3E3020' : '#F5E6D3',
    heroText: darkMode ? '#E5D0B1' : '#6B5A47',
    notificationBg: darkMode ? '#2C2C2E' : '#F3F4F6',
  };

  // Navigation Logic
  const navigate = (screen: string) => {
    const target = screen.toLowerCase();
    const COMING_SOON_FEATURES = ['vrscreen', 'gamesscreen', 'enhancerscreen'];

    if (COMING_SOON_FEATURES.includes(target)) {
      const toolTitle = toolsData.find(t => t.screen === screen)?.title || "New Feature";
      router.push({
        pathname: "/comingsoon",
        params: { featureName: toolTitle }
      });
      return; 
    }

    const routeMap: Record<string, any> = {
      "live": "/live",
      "mediaupload": "/mediaupload",
      "welcome": "/welcome", 
    };
    
    const route = routeMap[target];
    if (route) {
      router.push(route);
    } else {
      router.push(("/" + target) as any);
    }
  };

  const handleProfilePress = () => {
    if (isGuest) {
      Alert.alert(
        "Guest Account",
        "Sign up to access your full profile and save settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign Up", onPress: () => router.push('/auth/signup') }
        ]
      );
    } else {
      setShowProfileModal(true);
    }
  };

  const handleLockedFeature = (featureName: string) => {
    Alert.alert(
      "Feature Locked",
      `Sign up to access ${featureName} and save your progress!`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Up", onPress: () => router.push('/auth/signup') }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]} edges={['top', 'left', 'right']}>
      <StatusBar 
        barStyle={darkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.bg} 
      />

      {/* Top Header */}
      <View style={[styles.headerContainer, { backgroundColor: theme.bg }]}>
        <TouchableOpacity 
          style={[styles.profileIcon, { backgroundColor: theme.iconBg, borderColor: theme.border }]} 
          onPress={handleProfilePress}
        >
          <FontAwesome name="user" size={18 * scale} color={theme.text} />
        </TouchableOpacity>
        
        <Text style={[styles.appName, { color: theme.text, fontSize: 30 * scale }]}>
          Color Vista
        </Text>
        
        {isGuest ? (
            <View style={{ width: 40 }} /> 
        ) : (
            <TouchableOpacity 
                style={[styles.notificationButton, { backgroundColor: theme.iconBg, borderColor: theme.border }]}
                onPress={() => setShowNotificationsModal(true)}
            >
                <Ionicons name="notifications-outline" size={24 * scale} color={theme.text} />
                {/* 2. CONDITIONAL RED DOT: Only show if array has items */}
                {notifications.length > 0 && <View style={styles.notificationBadge} />}
            </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HeroCard 
            onGoToWelcome={() => router.push("/welcome")} 
            theme={theme} 
            scale={scale} 
            userName={isGuest ? 'Guest' : (user?.firstName || '')} 
        />
        
        <ToolsGrid 
          navigate={navigate} 
          theme={theme} 
          scale={scale} 
          isGuest={isGuest} 
          onLockedPress={handleLockedFeature}
        />
      </ScrollView>

      {/* Profile Modal */}
      {!isGuest && (
          <ProfileModal 
            visible={showProfileModal} 
            onClose={() => setShowProfileModal(false)} 
            theme={theme}
            scale={scale}
            user={user}
          />
      )}

      {/* Notification Modal */}
      {!isGuest && (
          <NotificationModal 
             visible={showNotificationsModal}
             onClose={() => setShowNotificationsModal(false)}
             theme={theme}
             scale={scale}
             notifications={notifications}        // Pass Data
             onClear={() => setNotifications([])} // Pass Handler
          />
      )}
    </SafeAreaView>
  );
}

// ---------------- HERO CARD ----------------
const HeroCard = ({ theme, scale, userName }: any) => (
  <View style={[styles.heroCard, { backgroundColor: theme.heroBg }]}>
    <View style={styles.heroContent}>
      <Text style={[styles.heroTitle, { color: theme.heroText, fontSize: 26 * scale }]}>
        Hello, <Text style={[styles.heroTitleSerif, { color: theme.heroText }]}>{userName}</Text>
      </Text>
      <Text style={[styles.heroQuote, { color: theme.heroText, fontSize: 13 * scale }]}>
        "Your vision is a special perspective to see the world"
      </Text>
      
      <TouchableOpacity 
        onPress={() => router.push('/getinspired')}
        style={[styles.inspireButton, { borderColor: theme.heroText }]}
      >
        <Text style={[styles.inspireButtonText, { color: theme.heroText, fontSize: 14 * scale }]}>
            Get Inspired
        </Text>
        <Feather name="arrow-right" size={14 * scale} color={theme.heroText} style={{ marginLeft: 6 }} />
      </TouchableOpacity>
    </View>
  </View>
);

// ---------------- TOOLS GRID ----------------
const ToolsGrid = ({ navigate, theme, scale, isGuest, onLockedPress }: any) => {
  const GUEST_ALLOWED_TOOLS = ['live', 'mediaupload'];

  return (
    <View style={styles.gridContainer}>
      <View style={styles.gridWrapper}>
        {toolsData.map((tool, index) => {
          const isLocked = isGuest && !GUEST_ALLOWED_TOOLS.includes(tool.screen);

          return (
            <View key={index} style={styles.gridItemWrapper}>
              <TouchableOpacity
                style={[
                  styles.toolCard, 
                  { backgroundColor: tool.color },
                  isLocked && styles.toolCardLocked
                ]}
                onPress={() => isLocked ? onLockedPress(tool.title) : navigate(tool.screen)}
                activeOpacity={0.8}
              >
                {tool.icon}
                {isLocked && (
                  <View style={styles.lockOverlay}>
                    <Feather name="lock" size={24} color="#FFF" />
                  </View>
                )}
              </TouchableOpacity>
              <Text style={[
                styles.toolLabel, 
                { color: theme.text, fontSize: 12 * scale },
                isLocked && { color: theme.subText }
              ]}>
                {tool.title}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// ---------------- NEW NOTIFICATION MODAL ----------------
// 3. UPDATED MODAL: Receives props instead of managing local state
const NotificationModal = ({ visible, onClose, theme, scale, notifications, onClear }: any) => {
    
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.notificationOverlay} onPress={onClose}>
                <Pressable 
                    style={[styles.notificationContent, { backgroundColor: theme.card, shadowColor: theme.text }]} 
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* --- Header --- */}
                    <View style={[styles.notifHeader, { borderBottomColor: theme.border }]}>
                        <View>
                            <Text style={[styles.notifTitle, { color: theme.text, fontSize: 18 * scale }]}>
                                Notifications
                            </Text>
                            {notifications.length > 0 && (
                                <Text style={{ color: theme.subText, fontSize: 12 * scale, marginTop: 2 }}>
                                    You have {notifications.length} unread
                                </Text>
                            )}
                        </View>
                        
                        {notifications.length > 0 && (
                            <TouchableOpacity 
                                onPress={onClear}
                                style={{ padding: 4 }}
                            >
                                <Text style={{ color: palette.sage, fontSize: 13 * scale, fontWeight: '600' }}>
                                    Clear all
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    
                    {/* --- List --- */}
                    <View style={{ maxHeight: 400 }}>
                        <FlatList 
                            data={notifications}
                            keyExtractor={(item: any) => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ padding: 16 }}
                            renderItem={({ item }: {item: any}) => (
                                <View style={[styles.notifCard, { borderBottomColor: theme.border }]}>
                                    {/* Icon with soft background */}
                                    <View style={[styles.notifIconBubble, { backgroundColor: getSoftColor(item.color) }]}>
                                        <Ionicons name={item.icon as any} size={20} color={item.color} />
                                    </View>
                                    
                                    {/* Text Content */}
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={[styles.notifItemTitle, { color: theme.text, fontSize: 14 * scale }]}>
                                                {item.title}
                                            </Text>
                                            <Text style={{ color: theme.subText, fontSize: 11 * scale }}>
                                                {item.time}
                                            </Text>
                                        </View>
                                        
                                        <Text 
                                            style={{ color: theme.subText, fontSize: 13 * scale, marginTop: 4, lineHeight: 18 }} 
                                            numberOfLines={2}
                                        >
                                            {item.message}
                                        </Text>
                                    </View>
                                    
                                    {/* Unread Dot Indicator */}
                                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: palette.orange, marginLeft: 8, marginTop: 6 }} />
                                </View>
                            )}
                            ListEmptyComponent={
                                <View style={styles.emptyStateContainer}>
                                    <View style={[styles.emptyIconCircle, { backgroundColor: theme.iconBg }]}>
                                        <Feather name="bell-off" size={28} color={theme.subText} />
                                    </View>
                                    <Text style={[styles.emptyStateText, { color: theme.text, fontSize: 15 * scale }]}>
                                        No notifications yet
                                    </Text>
                                    <Text style={{ color: theme.subText, fontSize: 12 * scale, textAlign: 'center', marginTop: 4 }}>
                                        We'll let you know when updates arrive.
                                    </Text>
                                </View>
                            }
                        />
                    </View>

                    {/* --- Footer (Optional) --- */}
                    {notifications.length > 0 && (
                        <TouchableOpacity 
                            style={[styles.notifFooter, { borderTopColor: theme.border }]}
                            onPress={onClose}
                        >
                            <Text style={{ color: theme.text, fontSize: 14 * scale, fontWeight: '500' }}>
                                Close
                            </Text>
                        </TouchableOpacity>
                    )}
                </Pressable>
            </Pressable>
        </Modal>
    );
};


// ---------------- PROFILE MODAL ----------------
const ProfileModal = ({ visible, onClose, theme, scale, user }: any) => {
  const router = useRouter();
  const { logout } = useAuth(); 

  const handleViewProfile = () => {
    onClose();
    router.push('/userprofile');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable 
          style={[styles.profileModalContent, { backgroundColor: theme.card, borderColor: theme.border }]} 
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text, fontSize: 18 * scale }]}>
              My Account
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Feather name="x" size={22 * scale} color={theme.subText} />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />

          {/* Menu Items */}
          <View style={styles.modalBody}>
            <TouchableOpacity style={styles.menuItem} onPress={handleViewProfile}>
              <View style={styles.iconContainer}>
                <Feather name="user" size={20 * scale} color={theme.text} />
              </View>
              <Text style={[styles.menuItemText, { color: theme.text, fontSize: 16 * scale }]}>
                Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => { onClose(); router.push('/settings'); }}
            >
              <View style={styles.iconContainer}>
                <Feather name="settings" size={20 * scale} color={theme.text} />
              </View>
              <Text style={[styles.menuItemText, { color: theme.text, fontSize: 16 * scale }]}>
                Settings
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />

          {/* Log Out */}
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => { onClose(); logout(); router.replace('/auth/login'); }}
          >
            <View style={styles.iconContainer}>
              <Feather name="log-out" size={20 * scale} color="#EF4444" />
            </View>
            <Text style={[styles.menuItemText, { color: '#EF4444', fontSize: 16 * scale }]}>
              Log Out
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 2, paddingBottom: 20 },
  profileIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  appName: { fontWeight: '600', letterSpacing: 0.6, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', fontStyle: 'italic', textAlign: 'center', paddingBottom: 20 },
  notificationButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, borderWidth: 1 },
  notificationBadge: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', position: 'absolute', top: 8, right: 10, borderWidth: 1, borderColor: '#FFF' },
  scrollView: { flex: 1 },
  scrollContent: { 
    paddingHorizontal: 24, 
    paddingBottom: 120 
  },
  
  // Hero Card
  heroCard: { 
    borderRadius: 16, 
    padding: 24, 
    marginTop: 8,
    marginBottom: 32, 
    minHeight: 140, 
    justifyContent: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 5, 
    elevation: 2, 
    overflow: 'hidden' 
  },
  heroContent: { 
    zIndex: 1 
  },
  heroTitle: { 
    fontWeight: '600', 
    marginBottom: 6, 
    letterSpacing: 0.3 
  },
  heroTitleSerif: { 
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', 
    fontWeight: '700' 
  },
  heroQuote: { 
    fontStyle: 'italic', 
    marginBottom: 18, 
    lineHeight: 20, 
    fontWeight: '400',
    opacity: 0.8,
  },
  inspireButton: { 
    backgroundColor: 'rgba(0,0,0, 0.05)', 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 12, 
    alignSelf: 'flex-start', 
    borderWidth: 1, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  inspireButtonText: { 
    fontWeight: '600', 
    letterSpacing: 0.2 
  },

  // Tools Grid
  gridContainer: { 
    marginBottom: 20 
  },
  gridWrapper: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  gridItemWrapper: { 
    width: '30%', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  toolCard: { 
    width: '100%', 
    aspectRatio: 1, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    shadowOffset: { width: 0, height: 4 }, 
    elevation: 3 
  },
  toolCardLocked: { 
    opacity: 0.5 
  },
  lockOverlay: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.2)', 
    borderRadius: 20 
  },
  toolLabel: { 
    fontWeight: '600', 
    textAlign: 'center', 
    letterSpacing: 0.2 
  },

  // Profile Modal
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    justifyContent: 'flex-start', 
    alignItems: 'flex-start', 
    paddingTop: 65, 
    paddingLeft: 24, 
  },
  profileModalContent: { 
    borderRadius: 20, 
    paddingVertical: 20, 
    paddingHorizontal: 20,
    width: 280, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 5 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 10,
    elevation: 10,
    borderWidth: Platform.OS === 'android' ? 0.2 : 0, 
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  modalDivider: {
    height: 1,
    width: '100%',
    opacity: 0.5,
    marginBottom: 8,
    marginTop: 0,
  },
  modalBody: {
    marginBottom: 8,
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 24,
    marginRight: 16,
    alignItems: 'center'
  },
  menuItemText: {
    fontWeight: '500',
    letterSpacing: 0.2,
  },

  // ---------------- NOTIFICATION STYLES (NEW) ----------------
  notificationOverlay: {
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Slightly lighter overlay
    justifyContent: 'flex-start', 
    alignItems: 'flex-end', // Aligns to right
    paddingTop: Platform.OS === 'ios' ? 60 : 50, 
    paddingRight: 20, 
  },
  notificationContent: {
    borderRadius: 24, 
    width: 320, // Slightly wider
    elevation: 8, // Android Shadow
    shadowOffset: { width: 0, height: 4 }, // iOS Shadow
    shadowOpacity: 0.15,
    shadowRadius: 12,
    overflow: 'hidden', // Ensures content stays inside rounded corners
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.02)', // Subtle highlight
  },
  notifTitle: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  notifIconBubble: {
    width: 40,
    height: 40,
    borderRadius: 14, // Soft square look
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifItemTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  // Empty State Styles
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateText: {
    fontWeight: '600',
    marginBottom: 4,
  },
  notifFooter: {
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
  },
});
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