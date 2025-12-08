import { router, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Theme & Auth
import { useAuth } from '@/Context/AuthContext';
import { useTheme } from '@/Context/ThemeContext';

// ---------------- TOOLS DATA ----------------
const TOOLS_COLORS = {
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
    color: TOOLS_COLORS.blue,
    icon: <Ionicons name="water" size={32} color="#FFFFFF" />,
  },
  {
    title: 'Media Upload',
    screen: 'mediaupload',
    color: TOOLS_COLORS.peach,
    icon: <Feather name="upload-cloud" size={32} color="#FFFFFF" />,
  },
  {
    title: 'VR Simulation',
    screen: 'vrscreen',
    color: TOOLS_COLORS.purple,
    icon: <MaterialCommunityIcons name="cube-scan" size={32} color="#FFFFFF" />,
  },
  {
    title: 'Games',
    screen: 'gamesscreen',
    color: TOOLS_COLORS.teal,
    icon: <Ionicons name="game-controller" size={32} color="#FFFFFF" />,
  },
  {
    title: 'Quiz',
    screen: 'welcome',
    color: TOOLS_COLORS.lime,
    icon: <MaterialCommunityIcons name="help-box" size={32} color="#FFFFFF" />,
  },
  {
    title: 'Enhancer',
    screen: 'enhancerscreen',
    color: TOOLS_COLORS.orange,
    icon: <MaterialCommunityIcons name="star-four-points" size={32} color="#FFFFFF" />,
  },
];

// ---------------- MAIN DASHBOARD SCREEN ----------------
export default function DashboardScreen() {
  const router = useRouter();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { darkMode, getFontSizeMultiplier } = useTheme();
  const { user } = useAuth(); 
  
  const isGuest = user?.isGuest === true;
  const scale = getFontSizeMultiplier();

  const theme = {
    bg: darkMode ? '#121212' : '#FAFAFA',
    text: darkMode ? '#FFFFFF' : '#1A1A1A',
    subText: darkMode ? '#A1A1AA' : '#9E9E9E',
    cardBg: darkMode ? '#1C1C1E' : '#FFFFFF',
    borderColor: darkMode ? '#2C2C2E' : '#E5E5E5',
    iconBg: darkMode ? '#2C2C2E' : '#FFFFFF',
    heroBg: darkMode ? '#3E3020' : '#F5E6D3',
    heroText: darkMode ? '#E5D0B1' : '#6B5A47',
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

  // Handlers
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
          style={[styles.profileIcon, { backgroundColor: theme.iconBg, borderColor: theme.borderColor }]} 
          onPress={handleProfilePress}
        >
           <FontAwesome name="user" size={18 * scale} color={theme.text} />
        </TouchableOpacity>
        
        <Text style={[styles.appName, { color: theme.text, fontSize: 30 * scale }]}>Color Vista</Text>
        
        <TouchableOpacity style={[styles.notificationButton, { backgroundColor: theme.iconBg, borderColor: theme.borderColor }]}>
          <Ionicons name="notifications-outline" size={24 * scale} color={theme.text} />
        </TouchableOpacity>
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
            userName={isGuest ? 'Guest' : (user?.firstName || 'Sara')} 
        />
        
        <ToolsGrid 
            navigate={navigate} 
            theme={theme} 
            scale={scale} 
            isGuest={isGuest} 
            onLockedPress={handleLockedFeature}
        />
      </ScrollView>

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

// ---------------- SUB COMPONENTS ----------------

const HeroCard = ({ onGoToWelcome, theme, scale, userName }: any) => (
  <View style={[styles.heroCard, { backgroundColor: theme.heroBg }]}>
    <View style={styles.heroContent}>
      <Text style={[styles.heroTitle, { color: theme.heroText, fontSize: 26 * scale }]}>
        Hello, <Text style={[styles.heroTitleSerif, { color: theme.heroText }]}>{userName.toUpperCase()}</Text>
      </Text>
      <Text style={[styles.heroQuote, { color: theme.heroText, opacity: 0.8, fontSize: 13 * scale }]}>
        "Your vision is a special perspective to see the world"
      </Text>
      
      <TouchableOpacity 
  onPress={() => router.push('/getinspired')} // 3. Updated navigation logic
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

// ---------------- MODAL (UPDATED TO MATCH IMAGE) ----------------
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
            style={[styles.profileModalContent, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]} 
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

          {/* First Divider */}
          <View style={[styles.modalDivider, { backgroundColor: theme.borderColor }]} />

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

          {/* Second Divider */}
          <View style={[styles.modalDivider, { backgroundColor: theme.borderColor }]} />

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
  scrollView: { flex: 1 },
  scrollContent: { 
    paddingHorizontal: 24, 
    paddingBottom: 120 
  },
  
  // Hero Card
  heroCard: { borderRadius: 24, padding: 24, marginBottom: 32, minHeight: 140, justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 4, overflow: 'hidden' },
  heroContent: { zIndex: 1 },
  heroTitle: { fontWeight: '600', marginBottom: 6, letterSpacing: 0.3 },
  heroTitleSerif: { fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', fontWeight: '700' },
  heroQuote: { fontStyle: 'italic', marginBottom: 18, lineHeight: 20, fontWeight: '400' },
  inspireButton: { backgroundColor: 'rgba(0,0,0, 0.05)', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, alignSelf: 'flex-start', borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  inspireButtonText: { fontWeight: '600', letterSpacing: 0.2 },

  // Tools Grid
  gridContainer: { marginBottom: 20 },
  gridWrapper: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItemWrapper: { width: '30%', alignItems: 'center', marginBottom: 24 },
  toolCard: { width: '100%', aspectRatio: 1, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  toolCardLocked: { opacity: 0.5 },
  lockOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20 },
  toolLabel: { fontWeight: '600', textAlign: 'center', letterSpacing: 0.2 },

  // Modal (Updated)
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    justifyContent: 'flex-start', 
    alignItems: 'flex-start', 
    paddingTop: 65, // Adjust this to match your header height
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
});
//below
// import { Stack, useRouter } from 'expo-router';
// import { useState } from 'react';
// import {
//   Alert,
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

// // 1. IMPORT THEME & AUTH HOOKS
// import { useAuth } from '@/Context/AuthContext';
// import { useTheme } from '@/Context/ThemeContext';

// // ---------------- TOOLS DATA ----------------
// const TOOLS_COLORS = {
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
//     color: TOOLS_COLORS.blue,
//     icon: <Ionicons name="water" size={32} color="#FFFFFF" />,
//   },
//   {
//     title: 'Media Upload',
//     screen: 'mediaupload',
//     color: TOOLS_COLORS.peach,
//     icon: <Feather name="upload-cloud" size={32} color="#FFFFFF" />,
//   },
//   {
//     title: 'VR Simulation',
//     screen: 'vrscreen',
//     color: TOOLS_COLORS.purple,
//     icon: <MaterialCommunityIcons name="cube-scan" size={32} color="#FFFFFF" />,
//   },
//   {
//     title: 'Games',
//     screen: 'gamesscreen',
//     color: TOOLS_COLORS.teal,
//     icon: <Ionicons name="game-controller" size={32} color="#FFFFFF" />,
//   },
//   {
//     title: 'Quiz',
//     screen: 'welcome',
//     color: TOOLS_COLORS.lime,
//     icon: <MaterialCommunityIcons name="help-box" size={32} color="#FFFFFF" />,
//   },
//   {
//     title: 'Enhancer',
//     screen: 'enhancerscreen',
//     color: TOOLS_COLORS.orange,
//     icon: <MaterialCommunityIcons name="star-four-points" size={32} color="#FFFFFF" />,
//   },
// ];

// // ---------------- MAIN DASHBOARD SCREEN ----------------
// export default function DashboardScreen() {
//   const router = useRouter();
//   const [showProfileModal, setShowProfileModal] = useState(false);

//   // 2. CONSUME CONTEXTS
//   const { darkMode, getFontSizeMultiplier } = useTheme();
//   const { user } = useAuth(); 
  
//   // 3. CHECK GUEST STATUS
//   const isGuest = user?.isGuest === true;
//   const scale = getFontSizeMultiplier();

//   // 4. DEFINE DYNAMIC COLORS
//   const theme = {
//     bg: darkMode ? '#121212' : '#FAFAFA',
//     text: darkMode ? '#FFFFFF' : '#1A1A1A',
//     subText: darkMode ? '#A1A1AA' : '#9E9E9E',
//     cardBg: darkMode ? '#1C1C1E' : '#FFFFFF',
//     borderColor: darkMode ? '#2C2C2E' : '#F0F0F0',
//     iconBg: darkMode ? '#2C2C2E' : '#FFFFFF',
//     heroBg: darkMode ? '#3E3020' : '#F5E6D3',
//     heroText: darkMode ? '#E5D0B1' : '#6B5A47',
//     navBg: darkMode ? '#1C1C1E' : '#FFFFFF',
//   };

//   // ---------------------------------------------------------
//   // UPDATED NAVIGATION LOGIC
//   // ---------------------------------------------------------
//   const navigate = (screen: string) => {
//     const target = screen.toLowerCase();

//     // 1. Define features that are currently under development
//     const COMING_SOON_FEATURES = ['vrscreen', 'gamesscreen', 'enhancerscreen'];

//     // 2. Check if the target is one of them
//     if (COMING_SOON_FEATURES.includes(target)) {
//         // Find the nice display title
//         const toolTitle = toolsData.find(t => t.screen === screen)?.title || "New Feature";
        
//         // Navigate to Coming Soon screen with params
//         router.push({
//             pathname: "/comingsoon",
//             params: { featureName: toolTitle }
//         });
//         return; 
//     }

//     // 3. Handle Active Features
//     const routeMap: Record<string, any> = {
//         "live": "/live",
//         "mediaupload": "/mediaupload",
//         "welcome": "/welcome", 
//     };
    
//     const route = routeMap[target];
//     if (route) {
//         router.push(route);
//     } else {
//         // Fallback
//         router.push(("/" + target) as any);
//     }
//   };

//   // GUEST PROFILE CLICK HANDLER
//   const handleProfilePress = () => {
//     if (isGuest) {
//         Alert.alert(
//             "Guest Account",
//             "Sign up to access your full profile and save settings.",
//             [
//                 { text: "Cancel", style: "cancel" },
//                 { text: "Sign Up", onPress: () => router.push('/auth/signup') }
//             ]
//         );
//     } else {
//         setShowProfileModal(true);
//     }
//   };

//   // GUEST LOCKED FEATURE HANDLER
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

//   const onGoToWelcome = () => router.push("/welcome");

//   return (
//     <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]} edges={['top', 'left', 'right']}>
//       <Stack.Screen options={{ headerShown: false }} />
//       <StatusBar 
//         barStyle={darkMode ? "light-content" : "dark-content"} 
//         backgroundColor={theme.bg} 
//       />

//       {/* Top Header */}
//       <View style={[styles.headerContainer, { backgroundColor: theme.bg }]}>
        
//         {/* --- PROFILE ICON (Handles both Guest & User) --- */}
//         <TouchableOpacity 
//           style={[styles.profileIcon, { backgroundColor: theme.iconBg, borderColor: theme.borderColor }]} 
//           onPress={handleProfilePress}
//         >
//            <FontAwesome name="user" size={18 * scale} color={theme.text} />
//         </TouchableOpacity>
        
//         <Text style={[styles.appName, { color: theme.text, fontSize: 30 * scale }]}>Color Vista</Text>
        
//         <TouchableOpacity style={[styles.notificationButton, { backgroundColor: theme.iconBg, borderColor: theme.borderColor }]}>
//           <Ionicons name="notifications-outline" size={24 * scale} color={theme.text} />
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <HeroCard 
//             onGoToWelcome={onGoToWelcome} 
//             theme={theme} 
//             scale={scale} 
//             userName={isGuest ? 'Guest' : (user?.firstName || 'Sara')} 
//         />
        
//         <ToolsGrid 
//             navigate={navigate} 
//             theme={theme} 
//             scale={scale} 
//             isGuest={isGuest} 
//             onLockedPress={handleLockedFeature}
//         />
//       </ScrollView>

//       <BottomNavBar 
//         onProfilePress={handleProfilePress} 
//         theme={theme} 
//         scale={scale} 
//       />

//       {/* Only show Profile Modal if NOT guest */}
//       {!isGuest && (
//           <ProfileModal 
//             visible={showProfileModal} 
//             onClose={() => setShowProfileModal(false)} 
//             theme={theme}
//             scale={scale}
//             user={user}
//           />
//       )}
//     </SafeAreaView>
//   );
// }


// // ---------------- HERO CARD ----------------
// const HeroCard = ({ onGoToWelcome, theme, scale, userName }: any) => (
//   <View style={[styles.heroCard, { backgroundColor: theme.heroBg }]}>
//     <View style={styles.heroContent}>
//       <Text style={[styles.heroTitle, { color: theme.heroText, fontSize: 26 * scale }]}>
//         Hello, <Text style={[styles.heroTitleSerif, { color: theme.heroText }]}>{userName.toUpperCase()}</Text>
//       </Text>
//       <Text style={[styles.heroQuote, { color: theme.heroText, opacity: 0.8, fontSize: 13 * scale }]}>
//         "Your vision is a special perspective to see the world"
//       </Text>
      
//       <TouchableOpacity 
//         onPress={onGoToWelcome} 
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
    
//     // Define allowed tools for Guests
//     const GUEST_ALLOWED_TOOLS = ['live', 'mediaupload'];

//     return (
//       <View style={styles.gridContainer}>
//         <View style={styles.gridWrapper}>
//           {toolsData.map((tool, index) => {
            
//             // Check Lock Status
//             const isLocked = isGuest && !GUEST_ALLOWED_TOOLS.includes(tool.screen);

//             return (
//                 <View key={index} style={styles.gridItemWrapper}>
//                   <TouchableOpacity
//                     style={[
//                         styles.toolCard, 
//                         { backgroundColor: tool.color },
//                         isLocked && styles.toolCardLocked // Add opacity if locked
//                     ]}
//                     onPress={() => {
//                         if (isLocked) {
//                             onLockedPress(tool.title);
//                         } else {
//                             navigate(tool.screen);
//                         }
//                     }}
//                     activeOpacity={0.8}
//                   >
//                     {tool.icon}
                    
//                     {/* Lock Overlay Icon */}
//                     {isLocked && (
//                         <View style={styles.lockOverlay}>
//                             <Feather name="lock" size={24} color="#FFF" />
//                         </View>
//                     )}
//                   </TouchableOpacity>
//                   <Text style={[
//                       styles.toolLabel, 
//                       { color: theme.text, fontSize: 12 * scale },
//                       isLocked && { color: theme.subText } // Dim text if locked
//                   ]}>
//                     {tool.title}
//                   </Text>
//                 </View>
//             );
//           })}
//         </View>
//       </View>
//     );
// };

// // ---------------- BOTTOM NAV ----------------
// const BottomNavBar = ({ onProfilePress, theme, scale }: any) => {
//   const router = useRouter();
  
//   return (
//     <View style={[styles.bottomNav, { backgroundColor: theme.navBg, borderTopColor: theme.borderColor }]}>
      
//       <TouchableOpacity
//         style={styles.navItem}
//         onPress={() => router.push('/userprofile')}
//       >
//         <FontAwesome name="user" size={24 * scale} color={theme.subText}  />
//         <Text style={[styles.navLabel, { color: theme.subText, fontSize: 11 * scale }]}>Profile</Text>
//       </TouchableOpacity>

//       {/* --- HOME BUTTON (Active) --- */}
//       <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
//         <View style={styles.activeNavDot} />
//         <FontAwesome name="home" size={22 * scale} color={TOOLS_COLORS.blue} />
//         <Text style={[styles.navLabel, styles.activeNavLabel, { fontSize: 11 * scale }]}>Home</Text>
//       </TouchableOpacity>
      
//       <TouchableOpacity
//         style={styles.navItem}
//         onPress={() => router.push('/settings')}
//       >
//         <Feather name="settings" size={24 * scale} color={theme.subText}  />
//         <Text style={[styles.navLabel, { color: theme.subText, fontSize: 11 * scale }]}>Settings</Text>
//       </TouchableOpacity>
      
//     </View>
//   );
// };

// // ---------------- PROFILE MODAL ----------------
// interface ProfileModalProps {
//   visible: boolean;
//   onClose: () => void;
//   theme: any;
//   scale: number;
//   user: any;
// }

// const ProfileModal = ({ visible, onClose, theme, scale, user }: ProfileModalProps) => {
//   const router = useRouter();
//   const { logout } = useAuth(); // Needed for logout logic inside modal

//   const handleViewProfile = () => {
//     onClose();
//     router.push('/userprofile');
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
//             style={[styles.profileModalContent, { backgroundColor: theme.cardBg }]} 
//             onPress={(e) => e.stopPropagation()}
//         >
//           {/* Profile Image */}
//           <View style={styles.modalProfileImageContainer}>
//             <View style={styles.modalProfileImage}>
//               <View style={styles.modalProfileIconDark} />
//               <View style={styles.modalProfileIconLight} />
//             </View>
//           </View>

//           {/* User Info */}
//           <View style={styles.modalUserInfo}>
//             <Text style={[styles.modalUserName, { color: theme.text, fontSize: 18 * scale }]}>
//                 {user?.firstName} {user?.lastName}
//             </Text>
//             <Text style={[styles.modalUserEmail, { color: theme.subText, fontSize: 14 * scale }]}>
//                 {user?.email}
//             </Text>
//           </View>

//           {/* Divider */}
//           <View style={[styles.modalDivider, { backgroundColor: theme.borderColor }]} />

//           {/* Action Buttons */}
//           <TouchableOpacity 
//             style={[styles.modalButton, { backgroundColor: theme.bg }]}
//             onPress={handleViewProfile}
//           >
//             <Feather name="user" size={20 * scale} color={TOOLS_COLORS.blue} />
//             <Text style={[styles.modalButtonText, { color: theme.text, fontSize: 16 * scale }]}>View Full Profile</Text>
//             <Feather name="chevron-right" size={20 * scale} color={theme.subText} />
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.modalButton, { backgroundColor: theme.bg }]}
//             onPress={() => {
//               onClose();
//               router.push('/settings');
//             }}
//           >
//             <Feather name="settings" size={20 * scale} color={TOOLS_COLORS.blue} />
//             <Text style={[styles.modalButtonText, { color: theme.text, fontSize: 16 * scale }]}>Settings</Text>
//             <Feather name="chevron-right" size={20 * scale} color={theme.subText} />
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.modalButton, styles.modalButtonLast, { backgroundColor: theme.bg }]} 
//             onPress={() => {
//               onClose();
//               logout(); // Call logout logic
//               router.replace('/auth/login');
//             }}
//           >
//             <Feather name="log-out" size={20 * scale} color="#EF4444" />
//             <Text style={[styles.modalButtonText, { color: '#EF4444', fontSize: 16 * scale }]}>Log Out</Text>
//           </TouchableOpacity>
//         </Pressable>
//       </Pressable>
//     </Modal>
//   );
// };

// // ---------------- STYLES ----------------
// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingTop: 2,
//     paddingBottom: 20,
//   },
//   profileIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//   },
//   appName: {
//     fontWeight: '600',
//     letterSpacing: 0.6,
//     fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
//     fontStyle: 'italic',
//     textAlign: 'center',
//     paddingBottom: 20,
//   },
//   notificationButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 20,
//     borderWidth: 1,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingHorizontal: 24,
//     paddingBottom: 100,
//   },
  
//   // Hero Card
//   heroCard: {
//     borderRadius: 24,
//     padding: 24,
//     marginBottom: 32,
//     minHeight: 140,
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.15,
//     shadowRadius: 16,
//     elevation: 4,
//     overflow: 'hidden',
//   },
//   heroContent: {
//     zIndex: 1,
//   },
//   heroTitle: {
//     fontWeight: '600',
//     marginBottom: 6,
//     letterSpacing: 0.3,
//   },
//   heroTitleSerif: {
//     fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
//     fontWeight: '700',
//   },
//   heroQuote: {
//     fontStyle: 'italic',
//     marginBottom: 18,
//     lineHeight: 20,
//     fontWeight: '400',
//   },
//   inspireButton: {
//     backgroundColor: 'rgba(0,0,0, 0.05)',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//     alignSelf: 'flex-start',
//     borderWidth: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   inspireButtonText: {
//     fontWeight: '600',
//     letterSpacing: 0.2,
//   },

//   // Tools Grid
//   gridContainer: {
//     marginBottom: 20,
//   },
//   gridWrapper: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   gridItemWrapper: {
//     width: '30%',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   toolCard: {
//     width: '100%',
//     aspectRatio: 1,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.12,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 3,
//   },
//   // Locked State Styles
//   toolCardLocked: {
//     opacity: 0.5,
//   },
//   lockOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.2)', // Slight dark tint
//     borderRadius: 20,
//   },
//   toolLabel: {
//     fontWeight: '600',
//     textAlign: 'center',
//     letterSpacing: 0.2,
//   },

//   // Bottom Nav
//   bottomNav: {
//     flexDirection: 'row',
//     paddingVertical: 8,
//     paddingBottom: Platform.OS === 'ios' ? 20 : 8,
//     paddingHorizontal: 32,
//     justifyContent: 'space-around',
//     borderTopWidth: 1,
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.06,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   navItem: {
//     alignItems: 'center',
//     paddingVertical: 8,
//     position: 'relative',
//   },
//   activeNavDot: {
//     position: 'absolute',
//     top: 0,
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: TOOLS_COLORS.blue,
//   },
//   navLabel: {
//     marginTop: 4,
//     fontWeight: '500',
//     letterSpacing: 0.3,
//   },
//   activeNavLabel: {
//     color: TOOLS_COLORS.blue,
//     fontWeight: '600',
//   },

//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-start',
//     alignItems: 'flex-start',
//     paddingTop: 70,
//     paddingRight: 20,
//     paddingLeft: 20,
//   },
//   profileModalContent: {
//     borderRadius: 16,
//     padding: 20,
//     width: 300,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   modalProfileImageContainer: {
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   modalProfileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#F3E8DC',
//     borderWidth: 3,
//     borderColor: TOOLS_COLORS.blue,
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   modalProfileIconDark: {
//     position: 'absolute',
//     left: 20,
//     bottom: 15,
//     width: 25,
//     height: 30,
//     backgroundColor: '#4A5568',
//     borderRadius: 6,
//     transform: [{ rotate: '-15deg' }],
//   },
//   modalProfileIconLight: {
//     position: 'absolute',
//     right: 18,
//     bottom: 15,
//     width: 22,
//     height: 30,
//     backgroundColor: '#CD9B7A',
//     borderRadius: 6,
//     transform: [{ rotate: '15deg' }],
//   },
//   modalUserInfo: {
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   modalUserName: {
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   modalUserEmail: {
//     fontSize: 14,
//   },
//   modalDivider: {
//     height: 1,
//     marginBottom: 12,
//   },
//   modalButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   modalButtonLast: {
//     marginBottom: 0,
//   },
//   modalButtonText: {
//     flex: 1,
//     fontWeight: '500',
//     marginLeft: 12,
//   },
// });
// import { Stack, useRouter } from 'expo-router';
// import { useState } from 'react';
// import {
//   Alert,
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

// // 1. IMPORT THEME & AUTH HOOKS
// import { useAuth } from '@/Context/AuthContext';
// import { useTheme } from '@/Context/ThemeContext';

// // ---------------- TOOLS DATA ----------------
// const TOOLS_COLORS = {
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
//     color: TOOLS_COLORS.blue,
//     icon: <Ionicons name="water" size={32} color="#FFFFFF" />,
//   },
//   {
//     title: 'Media Upload',
//     screen: 'mediaupload',
//     color: TOOLS_COLORS.peach,
//     icon: <Feather name="upload-cloud" size={32} color="#FFFFFF" />,
//   },
//   {
//     title: 'VR Simulation',
//     screen: 'vrscreen',
//     color: TOOLS_COLORS.purple,
//     icon: <MaterialCommunityIcons name="cube-scan" size={32} color="#FFFFFF" />,
//   },
//   {
//     title: 'Games',
//     screen: 'gamesscreen',
//     color: TOOLS_COLORS.teal,
//     icon: <Ionicons name="game-controller" size={32} color="#FFFFFF" />,
//   },
//   {
//     title: 'Quiz',
//     screen: 'welcome',
//     color: TOOLS_COLORS.lime,
//     icon: <MaterialCommunityIcons name="help-box" size={32} color="#FFFFFF" />,
//   },
//   {
//     title: 'Enhancer',
//     screen: 'enhancerscreen',
//     color: TOOLS_COLORS.orange,
//     icon: <MaterialCommunityIcons name="star-four-points" size={32} color="#FFFFFF" />,
//   },
// ];

// // ---------------- MAIN DASHBOARD SCREEN ----------------
// export default function DashboardScreen() {
//   const router = useRouter();
//   const [showProfileModal, setShowProfileModal] = useState(false);

//   // 2. CONSUME CONTEXTS
//   const { darkMode, getFontSizeMultiplier } = useTheme();
//   const { user } = useAuth(); 
  
//   // 3. CHECK GUEST STATUS
//   const isGuest = user?.isGuest === true;
//   const scale = getFontSizeMultiplier();

//   // 4. DEFINE DYNAMIC COLORS
//   const theme = {
//     bg: darkMode ? '#121212' : '#FAFAFA',
//     text: darkMode ? '#FFFFFF' : '#1A1A1A',
//     subText: darkMode ? '#A1A1AA' : '#9E9E9E',
//     cardBg: darkMode ? '#1C1C1E' : '#FFFFFF',
//     borderColor: darkMode ? '#2C2C2E' : '#F0F0F0',
//     iconBg: darkMode ? '#2C2C2E' : '#FFFFFF',
//     heroBg: darkMode ? '#3E3020' : '#F5E6D3',
//     heroText: darkMode ? '#E5D0B1' : '#6B5A47',
//     navBg: darkMode ? '#1C1C1E' : '#FFFFFF',
//   };

//   // Consolidated Navigation Logic
//   const navigate = (screen: string) => {
//     const target = screen.toLowerCase();
//     const routeMap: Record<string, any> = {
//         "live": "/live",
//         "mediaupload": "/mediaupload",
//         "vrscreen": "/vrscreen",
//         "gamesscreen": "/gamesscreen",
//         "welcome": "/welcome",
//         "enhancerscreen": "/enhancerscreen",
//     };
//     const route = routeMap[target];
//     if (route) {
//         router.push(route);
//     } else {
//         router.push(("/" + target) as any);
//     }
//   };

//   // GUEST PROFILE CLICK HANDLER
//   const handleProfilePress = () => {
//     if (isGuest) {
//         Alert.alert(
//             "Guest Account",
//             "Sign up to access your full profile and save settings.",
//             [
//                 { text: "Cancel", style: "cancel" },
//                 { text: "Sign Up", onPress: () => router.push('/auth/signup') }
//             ]
//         );
//     } else {
//         setShowProfileModal(true);
//     }
//   };

//   // GUEST LOCKED FEATURE HANDLER
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

//   const onGoToWelcome = () => router.push("/welcome");

//   return (
//     <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]} edges={['top', 'left', 'right']}>
//       <Stack.Screen options={{ headerShown: false }} />
//       <StatusBar 
//         barStyle={darkMode ? "light-content" : "dark-content"} 
//         backgroundColor={theme.bg} 
//       />

//       {/* Top Header */}
//       <View style={[styles.headerContainer, { backgroundColor: theme.bg }]}>
        
//         {/* --- PROFILE ICON (Handles both Guest & User) --- */}
//         <TouchableOpacity 
//           style={[styles.profileIcon, { backgroundColor: theme.iconBg, borderColor: theme.borderColor }]} 
//           onPress={handleProfilePress}
//         >
//            <FontAwesome name="user" size={18 * scale} color={theme.text} />
//         </TouchableOpacity>
        
//         <Text style={[styles.appName, { color: theme.text, fontSize: 30 * scale }]}>Color Vista</Text>
        
//         <TouchableOpacity style={[styles.notificationButton, { backgroundColor: theme.iconBg, borderColor: theme.borderColor }]}>
//           <Ionicons name="notifications-outline" size={24 * scale} color={theme.text} />
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <HeroCard 
//             onGoToWelcome={onGoToWelcome} 
//             theme={theme} 
//             scale={scale} 
//             userName={isGuest ? 'Guest' : (user?.firstName || 'Sara')} 
//         />
        
//         <ToolsGrid 
//             navigate={navigate} 
//             theme={theme} 
//             scale={scale} 
//             isGuest={isGuest} 
//             onLockedPress={handleLockedFeature}
//         />
//       </ScrollView>

//       <BottomNavBar 
//         onProfilePress={handleProfilePress} 
//         theme={theme} 
//         scale={scale} 
//       />

//       {/* Only show Profile Modal if NOT guest */}
//       {!isGuest && (
//           <ProfileModal 
//             visible={showProfileModal} 
//             onClose={() => setShowProfileModal(false)} 
//             theme={theme}
//             scale={scale}
//             user={user}
//           />
//       )}
//     </SafeAreaView>
//   );
// }


// // ---------------- HERO CARD ----------------
// const HeroCard = ({ onGoToWelcome, theme, scale, userName }: any) => (
//   <View style={[styles.heroCard, { backgroundColor: theme.heroBg }]}>
//     <View style={styles.heroContent}>
//       <Text style={[styles.heroTitle, { color: theme.heroText, fontSize: 26 * scale }]}>
//         Hello, <Text style={[styles.heroTitleSerif, { color: theme.heroText }]}>{userName.toUpperCase()}</Text>
//       </Text>
//       <Text style={[styles.heroQuote, { color: theme.heroText, opacity: 0.8, fontSize: 13 * scale }]}>
//         "Your vision is a special perspective to see the world"
//       </Text>
      
//       <TouchableOpacity 
//         onPress={onGoToWelcome} 
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
    
//     // Define allowed tools for Guests
//     const GUEST_ALLOWED_TOOLS = ['live', 'mediaupload'];

//     return (
//       <View style={styles.gridContainer}>
//         <View style={styles.gridWrapper}>
//           {toolsData.map((tool, index) => {
            
//             // Check Lock Status
//             const isLocked = isGuest && !GUEST_ALLOWED_TOOLS.includes(tool.screen);

//             return (
//                 <View key={index} style={styles.gridItemWrapper}>
//                   <TouchableOpacity
//                     style={[
//                         styles.toolCard, 
//                         { backgroundColor: tool.color },
//                         isLocked && styles.toolCardLocked // Add opacity if locked
//                     ]}
//                     onPress={() => {
//                         if (isLocked) {
//                             onLockedPress(tool.title);
//                         } else {
//                             navigate(tool.screen);
//                         }
//                     }}
//                     activeOpacity={0.8}
//                   >
//                     {tool.icon}
                    
//                     {/* Lock Overlay Icon */}
//                     {isLocked && (
//                         <View style={styles.lockOverlay}>
//                             <Feather name="lock" size={24} color="#FFF" />
//                         </View>
//                     )}
//                   </TouchableOpacity>
//                   <Text style={[
//                       styles.toolLabel, 
//                       { color: theme.text, fontSize: 12 * scale },
//                       isLocked && { color: theme.subText } // Dim text if locked
//                   ]}>
//                     {tool.title}
//                   </Text>
//                 </View>
//             );
//           })}
//         </View>
//       </View>
//     );
// };

// // ---------------- BOTTOM NAV ----------------
// const BottomNavBar = ({ onProfilePress, theme, scale }: any) => {
//   const router = useRouter();
  
//   return (
//     <View style={[styles.bottomNav, { backgroundColor: theme.navBg, borderTopColor: theme.borderColor }]}>
      
//       <TouchableOpacity
//         style={styles.navItem}
//         onPress={() => router.push('/userprofile')}
//       >
//         <FontAwesome name="user" size={24 * scale} color={theme.subText}  />
//         <Text style={[styles.navLabel, { color: theme.subText, fontSize: 11 * scale }]}>Profile</Text>
//       </TouchableOpacity>

//       {/* --- HOME BUTTON (Active) --- */}
//       <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
//         <View style={styles.activeNavDot} />
//         <FontAwesome name="home" size={22 * scale} color={TOOLS_COLORS.blue} />
//         <Text style={[styles.navLabel, styles.activeNavLabel, { fontSize: 11 * scale }]}>Home</Text>
//       </TouchableOpacity>
      
//       <TouchableOpacity
//         style={styles.navItem}
//         onPress={() => router.push('/settings')}
//       >
//         <Feather name="settings" size={24 * scale} color={theme.subText}  />
//         <Text style={[styles.navLabel, { color: theme.subText, fontSize: 11 * scale }]}>Settings</Text>
//       </TouchableOpacity>
      
//     </View>
//   );
// };

// // ---------------- PROFILE MODAL ----------------
// interface ProfileModalProps {
//   visible: boolean;
//   onClose: () => void;
//   theme: any;
//   scale: number;
//   user: any;
// }

// const ProfileModal = ({ visible, onClose, theme, scale, user }: ProfileModalProps) => {
//   const router = useRouter();

//   const handleViewProfile = () => {
//     onClose();
//     router.push('/userprofile');
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
//             style={[styles.profileModalContent, { backgroundColor: theme.cardBg }]} 
//             onPress={(e) => e.stopPropagation()}
//         >
//           {/* Profile Image */}
//           <View style={styles.modalProfileImageContainer}>
//             <View style={styles.modalProfileImage}>
//               <View style={styles.modalProfileIconDark} />
//               <View style={styles.modalProfileIconLight} />
//             </View>
//           </View>

//           {/* User Info */}
//           <View style={styles.modalUserInfo}>
//             <Text style={[styles.modalUserName, { color: theme.text, fontSize: 18 * scale }]}>
//                 {user?.firstName} {user?.lastName}
//             </Text>
//             <Text style={[styles.modalUserEmail, { color: theme.subText, fontSize: 14 * scale }]}>
//                 {user?.email}
//             </Text>
//           </View>

//           {/* Divider */}
//           <View style={[styles.modalDivider, { backgroundColor: theme.borderColor }]} />

//           {/* Action Buttons */}
//           <TouchableOpacity 
//             style={[styles.modalButton, { backgroundColor: theme.bg }]}
//             onPress={handleViewProfile}
//           >
//             <Feather name="user" size={20 * scale} color={TOOLS_COLORS.blue} />
//             <Text style={[styles.modalButtonText, { color: theme.text, fontSize: 16 * scale }]}>View Full Profile</Text>
//             <Feather name="chevron-right" size={20 * scale} color={theme.subText} />
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.modalButton, { backgroundColor: theme.bg }]}
//             onPress={() => {
//               onClose();
//               router.push('/settings');
//             }}
//           >
//             <Feather name="settings" size={20 * scale} color={TOOLS_COLORS.blue} />
//             <Text style={[styles.modalButtonText, { color: theme.text, fontSize: 16 * scale }]}>Settings</Text>
//             <Feather name="chevron-right" size={20 * scale} color={theme.subText} />
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.modalButton, styles.modalButtonLast, { backgroundColor: theme.bg }]} 
//             onPress={() => {
//               onClose();
//               // Add logout logic here via AuthContext usually
//             }}
//           >
//             <Feather name="log-out" size={20 * scale} color="#EF4444" />
//             <Text style={[styles.modalButtonText, { color: '#EF4444', fontSize: 16 * scale }]}>Log Out</Text>
//           </TouchableOpacity>
//         </Pressable>
//       </Pressable>
//     </Modal>
//   );
// };

// // ---------------- STYLES ----------------
// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingTop: 2,
//     paddingBottom: 20,
//   },
//   profileIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//   },
//   appName: {
//     fontWeight: '600',
//     letterSpacing: 0.6,
//     fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
//     fontStyle: 'italic',
//     textAlign: 'center',
//     paddingBottom: 20,
//   },
//   notificationButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 20,
//     borderWidth: 1,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingHorizontal: 24,
//     paddingBottom: 100,
//   },
  
//   // Hero Card
//   heroCard: {
//     borderRadius: 24,
//     padding: 24,
//     marginBottom: 32,
//     minHeight: 140,
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.15,
//     shadowRadius: 16,
//     elevation: 4,
//     overflow: 'hidden',
//   },
//   heroContent: {
//     zIndex: 1,
//   },
//   heroTitle: {
//     fontWeight: '600',
//     marginBottom: 6,
//     letterSpacing: 0.3,
//   },
//   heroTitleSerif: {
//     fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
//     fontWeight: '700',
//   },
//   heroQuote: {
//     fontStyle: 'italic',
//     marginBottom: 18,
//     lineHeight: 20,
//     fontWeight: '400',
//   },
//   inspireButton: {
//     backgroundColor: 'rgba(0,0,0, 0.05)',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//     alignSelf: 'flex-start',
//     borderWidth: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   inspireButtonText: {
//     fontWeight: '600',
//     letterSpacing: 0.2,
//   },

//   // Tools Grid
//   gridContainer: {
//     marginBottom: 20,
//   },
//   gridWrapper: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   gridItemWrapper: {
//     width: '30%',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   toolCard: {
//     width: '100%',
//     aspectRatio: 1,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.12,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 3,
//   },
//   // Locked State Styles
//   toolCardLocked: {
//     opacity: 0.5,
//   },
//   lockOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.2)', // Slight dark tint
//     borderRadius: 20,
//   },
//   toolLabel: {
//     fontWeight: '600',
//     textAlign: 'center',
//     letterSpacing: 0.2,
//   },

//   // Bottom Nav
//   bottomNav: {
//     flexDirection: 'row',
//     paddingVertical: 8,
//     paddingBottom: Platform.OS === 'ios' ? 20 : 8,
//     paddingHorizontal: 32,
//     justifyContent: 'space-around',
//     borderTopWidth: 1,
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.06,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   navItem: {
//     alignItems: 'center',
//     paddingVertical: 8,
//     position: 'relative',
//   },
//   activeNavDot: {
//     position: 'absolute',
//     top: 0,
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: TOOLS_COLORS.blue,
//   },
//   navLabel: {
//     marginTop: 4,
//     fontWeight: '500',
//     letterSpacing: 0.3,
//   },
//   activeNavLabel: {
//     color: TOOLS_COLORS.blue,
//     fontWeight: '600',
//   },

//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-start',
//     alignItems: 'flex-start',
//     paddingTop: 70,
//     paddingRight: 20,
//     paddingLeft: 20,
//   },
//   profileModalContent: {
//     borderRadius: 16,
//     padding: 20,
//     width: 300,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   modalProfileImageContainer: {
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   modalProfileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#F3E8DC',
//     borderWidth: 3,
//     borderColor: TOOLS_COLORS.blue,
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   modalProfileIconDark: {
//     position: 'absolute',
//     left: 20,
//     bottom: 15,
//     width: 25,
//     height: 30,
//     backgroundColor: '#4A5568',
//     borderRadius: 6,
//     transform: [{ rotate: '-15deg' }],
//   },
//   modalProfileIconLight: {
//     position: 'absolute',
//     right: 18,
//     bottom: 15,
//     width: 22,
//     height: 30,
//     backgroundColor: '#CD9B7A',
//     borderRadius: 6,
//     transform: [{ rotate: '15deg' }],
//   },
//   modalUserInfo: {
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   modalUserName: {
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   modalUserEmail: {
//     fontSize: 14,
//   },
//   modalDivider: {
//     height: 1,
//     marginBottom: 12,
//   },
//   modalButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   modalButtonLast: {
//     marginBottom: 0,
//   },
//   modalButtonText: {
//     flex: 1,
//     fontWeight: '500',
//     marginLeft: 12,
//   },
// });