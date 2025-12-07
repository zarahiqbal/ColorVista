// import { Stack, useRouter } from 'expo-router';
// import { useState } from 'react';
// import {
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

// // ---------------- ENHANCED THEME COLORS ----------------
// const COLORS = {
//   background: '#FAFAFA',
//   white: '#FFFFFF',
//   darkText: '#1A1A1A',
//   lightText: '#9E9E9E',
//   borderColor: '#F0F0F0',
//   primary: '#4A90E2', // Added primary color
//   // Refined Card Colors - more sophisticated palette
//   cardGold: '#F5E6D3',
//   blue: '#4A90E2',
//   peach: '#FFB88C',
//   purple: '#A78BFA',
//   teal: '#06B6D4',
//   lime: '#84CC16',
//   orange: '#FB923C',
//   iconDark: '#2D3748',
// };

// // ---------------- TOOLS DATA ----------------
// const toolsData = [
//   {
//     title: 'Live Detection',
//     screen: 'live',
//     color: COLORS.blue,
//     icon: <Ionicons name="water" size={36} color="#FFFFFF" />,
//   },
//   {
//     title: 'Media Upload',
//     screen: 'mediaupload',
//     color: COLORS.peach,
//     icon: <Feather name="upload-cloud" size={36} color="#FFFFFF" />,
//   },
//   {
//     title: 'VR Simulation',
//     screen: 'vrscreen',
//     color: COLORS.purple,
//     icon: <MaterialCommunityIcons name="cube-scan" size={36} color="#FFFFFF" />,
//   },
//   {
//     title: 'Games',
//     screen: 'gamesscreen',
//     color: COLORS.teal,
//     icon: <Ionicons name="game-controller" size={36} color="#FFFFFF" />,
//   },
//   {
//     title: 'Quiz',
//     screen: 'welcome',
//     icon: (
//       <MaterialCommunityIcons
//         name="comment-question-outline"
//         size={28}
//         color={COLORS.primary}
//       />
//     ),
//   },
//   {
//     title: 'Enhancer',
//     screen: 'enhancerscreen',
//     color: COLORS.orange,
//     icon: <MaterialCommunityIcons name="star-four-points" size={36} color="#FFFFFF" />,
//   },
// ];

// // ---------------- PLACEHOLDER COMPONENTS ----------------
// // Added missing GameProgress component

// // MAIN DASHBOARD SCREEN
// export default function DashboardScreen() {
//   const router = useRouter();
//   const [showProfileModal, setShowProfileModal] = useState(false);

//   // Consolidated Navigation Logic
//   const navigate = (screen: string) => {
//     // Normalize screen name
//     const target = screen.toLowerCase();
    
//     // Map of logical names to routes
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
//         // Fallback
//         router.push(("/" + target) as any);
//     }
//   };

//   const onGoToWelcome = () => router.push("/welcome");

//   return (
//     <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
//       <Stack.Screen options={{ headerShown: false }} />
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

//       {/* Top Header (Profile, App Name & Notification) */}
//       <View style={styles.headerContainer}>
//         <TouchableOpacity style={styles.profileIcon} onPress={() => setShowProfileModal(true)}>
//            <FontAwesome name="user" size={18} color={COLORS.darkText} />
//         </TouchableOpacity>
        
//         <Text style={styles.appName}>Color Vista</Text>
        
//         <TouchableOpacity style={styles.notificationButton}>
//           <Ionicons name="notifications-outline" size={24} color={COLORS.darkText} />
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <AppHeader 
//           onGoToWelcome={onGoToWelcome} 
//           onShowProfile={() => setShowProfileModal(true)} 
//         />
//         <HeroCard onGoToWelcome={onGoToWelcome} />
//         <ToolsSection navigate={navigate} />
//       </ScrollView>

//       <BottomNavBar />

//       {/* Profile Modal */}
//       <ProfileModal 
//         visible={showProfileModal} 
//         onClose={() => setShowProfileModal(false)} 
//       />
//     </SafeAreaView>
//   );
// }

// // ---------------- HEADER ----------------
// interface AppHeaderProps {
//   onGoToWelcome?: () => void;
//   onShowProfile: () => void;
// }

// const AppHeader = ({ onGoToWelcome, onShowProfile }: AppHeaderProps) => (
//   <View style={styles.header}>
//     <TouchableOpacity onPress={onGoToWelcome}>
      
//     </TouchableOpacity>
//   </View>
// );

// // ---------------- PROFILE MODAL ----------------
// interface ProfileModalProps {
//   visible: boolean;
//   onClose: () => void;
// }

// const ProfileModal = ({ visible, onClose }: ProfileModalProps) => {
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
//         <Pressable style={styles.profileModalContent} onPress={(e) => e.stopPropagation()}>
//           {/* Profile Image */}
//           <View style={styles.modalProfileImageContainer}>
//             <View style={styles.modalProfileImage}>
//               <View style={styles.modalProfileIconDark} />
//               <View style={styles.modalProfileIconLight} />
//             </View>
//           </View>

//           {/* User Info */}
//           <View style={styles.modalUserInfo}>
//             <Text style={styles.modalUserName}>Sara Johnson</Text>
//             <Text style={styles.modalUserEmail}>sara.johnson@email.com</Text>
//           </View>

//           {/* Divider */}
//           <View style={styles.modalDivider} />

//           {/* Action Buttons */}
//           <TouchableOpacity 
//             style={styles.modalButton}
//             onPress={handleViewProfile}
//           >
//             <Feather name="user" size={20} color={COLORS.primary} />
//             <Text style={styles.modalButtonText}>View Full Profile</Text>
//             <Feather name="chevron-right" size={20} color={COLORS.lightText} />
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.modalButton}
//             onPress={() => {
//               onClose();
//               // Add settings navigation here
//             }}
//           >
//             <Feather name="settings" size={20} color={COLORS.primary} />
//             <Text style={styles.modalButtonText}>Settings</Text>
//             <Feather name="chevron-right" size={20} color={COLORS.lightText} />
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.modalButton, styles.modalButtonLast]}
//             onPress={() => {
//               onClose();
//               // Add logout logic here
//             }}
//           >
//             <Feather name="log-out" size={20} color="#EF4444" />
//             <Text style={[styles.modalButtonText, { color: '#EF4444' }]}>Log Out</Text>
//           </TouchableOpacity>
//         </Pressable>
//       </Pressable>
//     </Modal>
//   );
// };

// // ---------------- SEARCH BAR ----------------

// // ---------------- HERO CARD (GOLD) ----------------
// const HeroCard = ({ onGoToWelcome }: any) => (
//   <View style={styles.heroCard}>
//     <View style={styles.heroContent}>
//       <Text style={styles.heroTitle}>
//         Hello, <Text style={styles.heroTitleSerif}>SARA</Text>
//       </Text>
//       <Text style={styles.heroQuote}>
//         "Your vision is a special perspective to see the world"
//       </Text>
      
//       <TouchableOpacity onPress={onGoToWelcome} style={styles.inspireButton}>
//         <Text style={styles.inspireButtonText}>Get Inspired</Text>
//         <Feather name="arrow-right" size={14} color="#6B5A47" style={{ marginLeft: 6 }} />
//       </TouchableOpacity>
//     </View>
//   </View>
// );

// // ---------------- TOOLS SECTION ----------------
// interface ToolsSectionProps {
//   navigate: (screen: string) => void;
// }

// const ToolsSection = ({ navigate }: ToolsSectionProps) => (
//   <View style={styles.section}>
//     <Text style={styles.sectionTitle}>Choose a tool to get started</Text>

//     <View style={styles.toolsGrid}>
//       {toolsData.map((tool) => (
//         <TouchableOpacity
//           key={tool.title}
//           style={styles.toolCard}
//           onPress={() => navigate(tool.screen)}
//         >
//            <View style={[styles.iconContainer, { backgroundColor: tool.color || COLORS.white }]}>
//              {tool.icon}
//            </View>
//           <Text style={styles.toolLabel}>{tool.title}</Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   </View>
// );

// // ---------------- BOTTOM NAV ----------------
// const BottomNavBar = () => {
//   const router = useRouter();

//   return (
//     <View style={styles.bottomNav}>
//       <TouchableOpacity style={styles.navItem}>
//         <Feather name="home" size={24} color={COLORS.primary} />
//         <Text style={[styles.navLabel, { color: COLORS.primary }]}>Home</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.navItem}>
//         <Feather name="settings" size={24} color={COLORS.lightText} />
//         <Text style={styles.navLabel}>Tools</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.navItem}
//         onPress={() => router.push('/userprofile')}
//       >
//         <Feather name="user" size={24} color={COLORS.lightText} />
//         <Text style={styles.navLabel}>Profile</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// // ---------------- ENHANCED STYLES ----------------
// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingTop: 10,
//     paddingBottom: 10,
//     backgroundColor: COLORS.background,
//   },
//   header: {
//     marginBottom: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   profileIcon: {
//     width: 40,
//     height: 40,
//     backgroundColor: COLORS.white,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.borderColor,
//   },
//   appName: {
//     fontSize: 22,
//     fontWeight: '600',
//     color: COLORS.darkText,
//     letterSpacing: 0.6,
//     fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
//     fontStyle: 'italic',
//     textAlign: 'center',
//   },
//   greetingText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: COLORS.darkText,
//   },
//   greetingSubText: {
//     fontSize: 14,
//     color: COLORS.lightText,
//     marginTop: 4,
//   },
//   notificationButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: COLORS.borderColor,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingHorizontal: 24,
//     paddingBottom: 100,
//     paddingTop: 10,
//   },
  
  

//   // Hero Card
//   heroCard: {
//     backgroundColor: COLORS.cardGold,
//     borderRadius: 24,
//     padding: 24,
//     marginBottom: 32,
//     minHeight: 140,
//     justifyContent: 'center',
//     shadowColor: '#C9A875',
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
//     fontSize: 26,
//     color: '#6B5A47',
//     fontWeight: '600',
//     marginBottom: 6,
//     letterSpacing: 0.3,
//   },
//   heroTitleSerif: {
//     fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
//     fontWeight: '700',
//     color: '#5A4A3A',
//   },
//   heroQuote: {
//     color: '#8B7355',
//     fontSize: 13,
//     fontStyle: 'italic',
//     marginBottom: 18,
//     lineHeight: 20,
//     fontWeight: '400',
//   },
//   inspireButton: {
//     backgroundColor: 'rgba(107, 90, 71, 0.12)',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//     alignSelf: 'flex-start',
//     borderWidth: 1,
//     borderColor: 'rgba(107, 90, 71, 0.2)',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   inspireButtonText: {
//     color: '#6B5A47',
//     fontWeight: '600',
//     fontSize: 14,
//     letterSpacing: 0.2,
//   },

//   // Tools Section
//   section: {
//     marginTop: 10,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: COLORS.darkText,
//     marginBottom: 20,
//     letterSpacing: 0.3,

//   },
//   toolsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   toolCard: {
//     width: '30%',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   iconContainer: {
//     width: 64,
//     height: 64,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   toolLabel: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: COLORS.darkText,
//     textAlign: 'center',
//     letterSpacing: 0.2,
//   },

//   // Bottom Nav
//   bottomNav: {
//     flexDirection: 'row',
//     backgroundColor: COLORS.white,
//     paddingVertical: 10,
//     paddingBottom: Platform.OS === 'ios' ? 24 : 10,
//     paddingHorizontal: 32,
//     justifyContent: 'space-around',
//     borderTopWidth: 1,
//     borderTopColor: COLORS.borderColor,
//     elevation: 8,
//   },
//   navItem: {
//     alignItems: 'center',
//     paddingVertical: 8,
//     position: 'relative',
//   },
//   navLabel: {
//     fontSize: 11,
//     marginTop: 4,
//     color: COLORS.lightText,
//     fontWeight: '500',
//     letterSpacing: 0.3,
//   },

//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-start',
//     alignItems: 'flex-end',
//     paddingTop: 70,
//     paddingRight: 20,
//   },
//   profileModalContent: {
//     backgroundColor: COLORS.white,
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
//     borderColor: COLORS.primary,
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
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: COLORS.darkText,
//     marginBottom: 4,
//   },
//   modalUserEmail: {
//     fontSize: 14,
//     color: COLORS.lightText,
//   },
//   modalDivider: {
//     height: 1,
//     backgroundColor: COLORS.borderColor,
//     marginBottom: 12,
//   },
//   modalButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     marginBottom: 8,
//     backgroundColor: COLORS.background,
//   },
//   modalButtonLast: {
//     marginBottom: 0,
//     backgroundColor: '#FEF2F2',
//   },
//   modalButtonText: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: '500',
//     color: COLORS.darkText,
//     marginLeft: 12,
//   },
// });


// import { Stack, useRouter } from 'expo-router';
// import { useState } from 'react';
// import {
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

// // 1. IMPORT THEME HOOK
// import { useTheme } from '@/Context/ThemeContext';

// // ---------------- TOOLS DATA ----------------
// // We keep colors static as they serve as "Brand Colors" for the tools
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

//   // 2. CONSUME THEME CONTEXT
//   const { darkMode, getFontSizeMultiplier } = useTheme();
//   const scale = getFontSizeMultiplier();

//   // 3. DEFINE DYNAMIC COLORS
//   const theme = {
//     bg: darkMode ? '#121212' : '#FAFAFA',
//     text: darkMode ? '#FFFFFF' : '#1A1A1A',
//     subText: darkMode ? '#A1A1AA' : '#9E9E9E',
//     cardBg: darkMode ? '#1C1C1E' : '#FFFFFF',
//     borderColor: darkMode ? '#2C2C2E' : '#F0F0F0',
//     iconBg: darkMode ? '#2C2C2E' : '#FFFFFF',
//     heroBg: darkMode ? '#3E3020' : '#F5E6D3', // Dark Gold vs Light Gold
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
//         <TouchableOpacity 
//           style={[styles.profileIcon, { backgroundColor: theme.iconBg, borderColor: theme.borderColor }]} 
//           onPress={() => setShowProfileModal(true)}
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
//         <HeroCard onGoToWelcome={onGoToWelcome} theme={theme} scale={scale} />
//         <ToolsGrid navigate={navigate} theme={theme} scale={scale} />
//       </ScrollView>

//       <BottomNavBar 
//         onProfilePress={() => setShowProfileModal(true)} 
//         theme={theme} 
//         scale={scale} 
//       />

//       <ProfileModal 
//         visible={showProfileModal} 
//         onClose={() => setShowProfileModal(false)} 
//         theme={theme}
//         scale={scale}
//       />
//     </SafeAreaView>
//   );
// }


// // ---------------- HERO CARD ----------------
// const HeroCard = ({ onGoToWelcome, theme, scale }: any) => (
//   <View style={[styles.heroCard, { backgroundColor: theme.heroBg }]}>
//     <View style={styles.heroContent}>
//       <Text style={[styles.heroTitle, { color: theme.heroText, fontSize: 26 * scale }]}>
//         Hello, <Text style={[styles.heroTitleSerif, { color: theme.heroText }]}>SARA</Text>
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
// const ToolsGrid = ({ navigate, theme, scale }: any) => (
//   <View style={styles.gridContainer}>
//     <View style={styles.gridWrapper}>
//       {toolsData.map((tool, index) => (
//         <View key={index} style={styles.gridItemWrapper}>
//           <TouchableOpacity
//             style={[styles.toolCard, { backgroundColor: tool.color }]}
//             onPress={() => navigate(tool.screen)}
//             activeOpacity={0.8}
//           >
//             {tool.icon}
//           </TouchableOpacity>
//           <Text style={[styles.toolLabel, { color: theme.text, fontSize: 12 * scale }]}>
//             {tool.title}
//           </Text>
//         </View>
//       ))}
//     </View>
//   </View>
// );

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
// }

// const ProfileModal = ({ visible, onClose, theme, scale }: ProfileModalProps) => {
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
//                 Sara Johnson
//             </Text>
//             <Text style={[styles.modalUserEmail, { color: theme.subText, fontSize: 14 * scale }]}>
//                 sara.johnson@email.com
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
//             style={[styles.modalButton, styles.modalButtonLast, { backgroundColor: theme.bg }]} // Kept plain bg, removed red tint for cleaner dark mode look, or use rgba
//             onPress={() => {
//               onClose();
//               // Add logout logic here
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

import { useRouter } from 'expo-router';
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
    borderColor: darkMode ? '#2C2C2E' : '#F0F0F0',
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

      {/* NOTE: BottomNavBar removed from here because it's in the Layout now! */}

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
        onPress={onGoToWelcome} 
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
            style={[styles.profileModalContent, { backgroundColor: theme.cardBg }]} 
            onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalProfileImageContainer}>
            <View style={styles.modalProfileImage}>
              <View style={styles.modalProfileIconDark} />
              <View style={styles.modalProfileIconLight} />
            </View>
          </View>

          <View style={styles.modalUserInfo}>
            <Text style={[styles.modalUserName, { color: theme.text, fontSize: 18 * scale }]}>
                {user?.firstName} {user?.lastName}
            </Text>
            <Text style={[styles.modalUserEmail, { color: theme.subText, fontSize: 14 * scale }]}>
                {user?.email}
            </Text>
          </View>

          <View style={[styles.modalDivider, { backgroundColor: theme.borderColor }]} />

          <TouchableOpacity style={[styles.modalButton, { backgroundColor: theme.bg }]} onPress={handleViewProfile}>
            <Feather name="user" size={20 * scale} color={TOOLS_COLORS.blue} />
            <Text style={[styles.modalButtonText, { color: theme.text, fontSize: 16 * scale }]}>View Full Profile</Text>
            <Feather name="chevron-right" size={20 * scale} color={theme.subText} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.modalButton, { backgroundColor: theme.bg }]}
            onPress={() => { onClose(); router.push('/settings'); }}
          >
            <Feather name="settings" size={20 * scale} color={TOOLS_COLORS.blue} />
            <Text style={[styles.modalButtonText, { color: theme.text, fontSize: 16 * scale }]}>Settings</Text>
            <Feather name="chevron-right" size={20 * scale} color={theme.subText} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.modalButton, styles.modalButtonLast, { backgroundColor: theme.bg }]} 
            onPress={() => { onClose(); logout(); router.replace('/auth/login'); }}
          >
            <Feather name="log-out" size={20 * scale} color="#EF4444" />
            <Text style={[styles.modalButtonText, { color: '#EF4444', fontSize: 16 * scale }]}>Log Out</Text>
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
    paddingBottom: 120 // Increased padding for Bottom Bar
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

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 70, paddingRight: 20, paddingLeft: 20 },
  profileModalContent: { borderRadius: 16, padding: 20, width: 300, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  modalProfileImageContainer: { alignItems: 'center', marginBottom: 16 },
  modalProfileImage: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F3E8DC', borderWidth: 3, borderColor: TOOLS_COLORS.blue, alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  modalProfileIconDark: { position: 'absolute', left: 20, bottom: 15, width: 25, height: 30, backgroundColor: '#4A5568', borderRadius: 6, transform: [{ rotate: '-15deg' }] },
  modalProfileIconLight: { position: 'absolute', right: 18, bottom: 15, width: 22, height: 30, backgroundColor: '#CD9B7A', borderRadius: 6, transform: [{ rotate: '15deg' }] },
  modalUserInfo: { alignItems: 'center', marginBottom: 16 },
  modalUserName: { fontWeight: 'bold', marginBottom: 4 },
  modalUserEmail: { fontSize: 14 },
  modalDivider: { height: 1, marginBottom: 12 },
  modalButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 8, marginBottom: 8 },
  modalButtonLast: { marginBottom: 0 },
  modalButtonText: { flex: 1, fontWeight: '500', marginLeft: 12 },
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