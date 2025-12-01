//     import React from 'react';
// import {
//     SafeAreaView,
//     ScrollView,
//     StatusBar,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from 'react-native';

// // Note: If using Expo, you might prefer '@expo/vector-icons'
// import Feather from 'react-native-vector-icons/Feather';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// const COLORS = {
//   primary: '#6C63FF',
//   lightPurple: '#EDEFFF',
//   white: '#FFFFFF',
//   darkText: '#333333',
//   lightText: '#888888',
//   background: '#F7F8FA',
//   borderColor: '#EEEEEE',
// };

// // Dummy progress data
// const progressData = [
//   { title: 'Memory Challenge', progress: 75 },
//   { title: 'Logic Puzzles', progress: 40 },
// ];

// // Tools + navigation screen names
// const toolsData = [
//   {
//     title: 'Live Detection',
//     // ✅ FIX: Changed 'LiveScreen' to 'live' to match app/live.tsx
//     screen: 'live', 
//     icon: <Feather name="camera" size={28} color={COLORS.primary} />,
//   },
//   {
//     title: 'Media Upload',
//     screen: 'MediaUpload',
//     icon: <Feather name="upload-cloud" size={28} color={COLORS.primary} />,
//   },
//   {
//     title: 'VR Simulation',
//     screen: 'VRScreen',
//     icon: (
//       <MaterialCommunityIcons
//         name="virtual-reality"
//         size={28}
//         color={COLORS.primary}
//       />
//     ),
//   },
//   {
//     title: 'Games',
//     screen: 'GamesScreen',
//     icon: <FontAwesome5 name="gamepad" size={28} color={COLORS.primary} />,
//   },
//   {
//     title: 'Quiz',
//     screen: 'Welcome',   // Goes to /welcome
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
//     screen: 'EnhancerScreen',
//     icon: <Feather name="star" size={28} color={COLORS.primary} />,
//   },
// ];

// // MAIN DASHBOARD
// export default function Dashboard({ onGoToWelcome, navigate }: any) {
//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.container}
//         showsVerticalScrollIndicator={false}
//       >
//         <AppHeader onGoToWelcome={onGoToWelcome} />
//         <SearchBar />
//         <GameProgress />
//         <ToolsSection navigate={navigate} />
//       </ScrollView>

//       <BottomNavBar />
//     </SafeAreaView>
//   );
// }

// // ---------------- HEADER ----------------
// const AppHeader = ({ onGoToWelcome }: any) => (
//   <View style={styles.header}>
//     <TouchableOpacity style={styles.headerIcon}>
//       <Feather name="menu" size={24} color={COLORS.darkText} />
//     </TouchableOpacity>

//     <TouchableOpacity onPress={onGoToWelcome}>
//       <View>
//         <Text style={styles.greetingText}>Hello, Sara! 👋</Text>
//         <Text style={styles.greetingSubText}>Let's play and learn</Text>
//       </View>
//     </TouchableOpacity>

//     <TouchableOpacity style={styles.headerIcon}>
//       <FontAwesome name="user-circle-o" size={24} color={COLORS.darkText} />
//     </TouchableOpacity>
//   </View>
// );

// // ---------------- SEARCH BAR ----------------
// const SearchBar = () => (
//   <View style={styles.searchBar}>
//     <Feather
//       name="search"
//       size={20}
//       color={COLORS.lightText}
//       style={{ marginRight: 10 }}
//     />
//     <TextInput
//       placeholder="Search for tools or assessments"
//       placeholderTextColor={COLORS.lightText}
//       style={styles.searchInput}
//     />
//   </View>
// );

// // ---------------- PROGRESS BAR ----------------
// const ProgressBar = ({ progress }: { progress: number }) => (
//   <View style={styles.progressBarBackground}>
//     <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
//   </View>
// );

// // ---------------- GAME PROGRESS ----------------
// const GameProgress = () => (
//   <View style={styles.section}>
//     <Text style={styles.sectionTitle}>Your Game Progress</Text>

//     <View style={styles.card}>
//       {progressData.map((item, index) => (
//         <View
//           key={item.title}
//           style={index < progressData.length - 1 && styles.progressItemMargin}
//         >
//           <View style={styles.progressLabelRow}>
//             <Text style={styles.progressLabel}>{item.title}</Text>
//             <Text style={styles.progressPercent}>{item.progress}%</Text>
//           </View>

//           <ProgressBar progress={item.progress} />
//         </View>
//       ))}
//     </View>
//   </View>
// );

// // ---------------- TOOLS SECTION ----------------
// const ToolsSection = ({ navigate }: any) => (
//   <View style={styles.section}>
//     <Text style={styles.sectionTitle}>Choose a tool to get started</Text>

//     <View style={styles.toolsGrid}>
//       {toolsData.map((tool) => (
//         <TouchableOpacity
//           key={tool.title}
//           style={styles.toolCard}
//           onPress={() => navigate(tool.screen)} // Calls router.push('/' + tool.screen)
//         >
//           {tool.icon}
//           <Text style={styles.toolLabel}>{tool.title}</Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   </View>
// );

// // ---------------- BOTTOM NAV ----------------
// const BottomNavBar = () => (
//   <View style={styles.bottomNav}>
//     <TouchableOpacity style={styles.navItem}>
//       <Feather name="home" size={24} color={COLORS.primary} />
//       <Text style={[styles.navLabel, { color: COLORS.primary }]}>Home</Text>
//     </TouchableOpacity>

//     <TouchableOpacity style={styles.navItem}>
//       <Feather name="settings" size={24} color={COLORS.lightText} />
//       <Text style={styles.navLabel}>Tools</Text>
//     </TouchableOpacity>

//     <TouchableOpacity style={styles.navItem}>
//       <Feather name="user" size={24} color={COLORS.lightText} />
//       <Text style={styles.navLabel}>Profile</Text>
//     </TouchableOpacity>
//   </View>
// );

// // ---------------- STYLES ----------------
// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   container: {
//     padding: 20,
//     paddingBottom: 100,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   headerIcon: {
//     padding: 5,
//   },
//   greetingText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: COLORS.darkText,
//   },
//   greetingSubText: {
//     fontSize: 14,
//     color: COLORS.lightText,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     paddingHorizontal: 15,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: COLORS.borderColor,
//     elevation: 2,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: COLORS.darkText,
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: COLORS.darkText,
//     marginBottom: 15,
//   },
//   card: {
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 20,
//     elevation: 2,
//   },
//   progressItemMargin: {
//     marginBottom: 15,
//   },
//   progressLabelRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   progressLabel: {
//     fontSize: 15,
//     fontWeight: '500',
//     color: COLORS.darkText,
//   },
//   progressPercent: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     color: COLORS.primary,
//   },
//   progressBarBackground: {
//     height: 8,
//     backgroundColor: COLORS.lightPurple,
//     borderRadius: 4,
//   },
//   progressBarFill: {
//     height: '100%',
//     backgroundColor: COLORS.primary,
//   },
//   toolsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   toolCard: {
//     width: '48%',
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 20,
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   toolLabel: {
//     marginTop: 10,
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.primary,
//   },
//   bottomNav: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     backgroundColor: COLORS.white,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.borderColor,
//     paddingVertical: 10,
//     paddingBottom: 20,
//     justifyContent: 'space-around',
//   },
//   navItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   navLabel: {
//     fontSize: 12,
//     color: COLORS.lightText,
//     marginTop: 4,
//   },
// });


import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Icon Imports
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// ---------------- ENHANCED THEME COLORS ----------------
const COLORS = {
  background: '#FAFAFA',
  white: '#FFFFFF',
  darkText: '#1A1A1A',
  lightText: '#9E9E9E',
  borderColor: '#F0F0F0',
  // Refined Card Colors - more sophisticated palette
  cardGold: '#F5E6D3',
  blue: '#4A90E2',
  peach: '#FFB88C',
  purple: '#A78BFA',
  teal: '#06B6D4',
  lime: '#84CC16',
  orange: '#FB923C',
  iconDark: '#2D3748',
};

// ---------------- TOOLS DATA ----------------
const toolsData = [
  {
    title: 'Live Detection',
    screen: 'live',
    color: COLORS.blue,
    icon: <Ionicons name="water" size={36} color="#FFFFFF" />,
  },
  {
    title: 'Media Upload',
    screen: 'mediaupload',
    color: COLORS.peach,
    icon: <Feather name="upload-cloud" size={36} color="#FFFFFF" />,
  },
  {
    title: 'VR Simulation',
    screen: 'VRScreen',
    color: COLORS.purple,
    icon: <MaterialCommunityIcons name="cube-scan" size={36} color="#FFFFFF" />,
  },
  {
    title: 'Games',
    screen: 'GamesScreen',
    color: COLORS.teal,
    icon: <Ionicons name="game-controller" size={36} color="#FFFFFF" />,
  },
  {
    title: 'Quiz',
    screen: 'Welcome',
    color: COLORS.lime,
    icon: <MaterialCommunityIcons name="help-box" size={36} color="#FFFFFF" />,
  },
  {
    title: 'Enhancer',
    screen: 'EnhancerScreen',
    color: COLORS.orange,
    icon: <MaterialCommunityIcons name="star-four-points" size={36} color="#FFFFFF" />,
  },
];

// ---------------- MAIN DASHBOARD ----------------
export default function Dashboard({ onGoToWelcome, navigate }: any) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Top Header (Profile, App Name & Notification) */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.profileIcon}>
           <FontAwesome name="user" size={18} color={COLORS.darkText} />
        </TouchableOpacity>
        
        <Text style={styles.appName}>Color Vista</Text>
        
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.darkText} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* <SearchBar /> */}
        <HeroCard onGoToWelcome={onGoToWelcome} />
        <ToolsGrid navigate={navigate} />
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

// ---------------- SEARCH BAR ----------------
const SearchBar = () => (
  <View style={styles.searchContainer}>
    <Feather name="search" size={18} color={COLORS.lightText} style={styles.searchIcon} />
    <TextInput
      placeholder="Search tools, features..."
      placeholderTextColor={COLORS.lightText}
      style={styles.searchInput}
    />
  </View>
);

// ---------------- HERO CARD (GOLD) ----------------
const HeroCard = ({ onGoToWelcome }: any) => (
  <View style={styles.heroCard}>
    <View style={styles.heroContent}>
      <Text style={styles.heroTitle}>
        Hello, <Text style={styles.heroTitleSerif}>SARA</Text>
      </Text>
      <Text style={styles.heroQuote}>
        "Your vision is a special perspective to see the world"
      </Text>
      
      <TouchableOpacity onPress={onGoToWelcome} style={styles.inspireButton}>
        <Text style={styles.inspireButtonText}>Get Inspired</Text>
        <Feather name="arrow-right" size={14} color="#6B5A47" style={{ marginLeft: 6 }} />
      </TouchableOpacity>
    </View>
  </View>
);

// ---------------- TOOLS GRID section ----------------
const ToolsGrid = ({ navigate }: any) => (
  <View style={styles.gridContainer}>
    {/* <Text style={styles.sectionTitle}>Quick Tools</Text> */}
    <View style={styles.gridWrapper}>
      {toolsData.map((tool, index) => (
        <View key={index} style={styles.gridItemWrapper}>
          <TouchableOpacity
            style={[styles.toolCard, { backgroundColor: tool.color }]}
            onPress={() => navigate(tool.screen)}
            activeOpacity={0.8}
          >
            {tool.icon}
          </TouchableOpacity>
          <Text style={styles.toolLabel}>{tool.title}</Text>
        </View>
      ))}
    </View>
  </View>
);

// ---------------- BOTTOM NAV ----------------
const BottomNavBar = () => (
  <View style={styles.bottomNav}>
    <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
      <FontAwesome name="user" size={22} color={COLORS.lightText} />
      <Text style={styles.navLabel}>Profile</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
      <View style={styles.activeNavDot} />
      <Feather name="home" size={22} color={COLORS.blue} />
      <Text style={[styles.navLabel, styles.activeNavLabel]}>Home</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
      <Feather name="settings" size={22} color={COLORS.lightText} />
      <Text style={styles.navLabel}>Settings</Text>
    </TouchableOpacity>
  </View>
);

// ---------------- ENHANCED STYLES ----------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 2,
    paddingBottom: 20,
    backgroundColor: COLORS.background,
  },
  profileIcon: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
appName: {
  fontSize: 30,
  fontWeight: '600',
  color: COLORS.darkText,
  letterSpacing: 0.6,
  fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  fontStyle: 'italic',
  textAlign: 'center',
  paddingBottom: 20,
},

  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.darkText,
    fontWeight: '400',
  },

  // Hero Card
  heroCard: {
    backgroundColor: COLORS.cardGold,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    minHeight: 140,
    justifyContent: 'center',
    shadowColor: '#C9A875',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  heroContent: {
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 26,
    color: '#6B5A47',
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  heroTitleSerif: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: '700',
    color: '#5A4A3A',
  },
  heroQuote: {
    color: '#8B7355',
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 18,
    lineHeight: 20,
    fontWeight: '400',
  },
  inspireButton: {
    backgroundColor: 'rgba(107, 90, 71, 0.12)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(107, 90, 71, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inspireButtonText: {
    color: '#6B5A47',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.2,
  },

  // Tools Grid
  gridContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItemWrapper: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 24,
  },
  toolCard: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  toolLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.darkText,
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingHorizontal: 32,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  activeNavDot: {
    position: 'absolute',
    top: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.blue,
  },
  navLabel: {
    fontSize: 11,
    marginTop: 4,
    color: COLORS.lightText,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  activeNavLabel: {
    color: COLORS.blue,
    fontWeight: '600',
  },
});