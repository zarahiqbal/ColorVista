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
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Note: If using Expo, you might prefer '@expo/vector-icons'
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const COLORS = {
  primary: '#6C63FF',
  lightPurple: '#EDEFFF',
  white: '#FFFFFF',
  darkText: '#333333',
  lightText: '#888888',
  background: '#F7F8FA',
  borderColor: '#EEEEEE',
};

// Dummy progress data
const progressData = [
  { title: 'Memory Challenge', progress: 75 },
  { title: 'Logic Puzzles', progress: 40 },
];

// Tools + navigation screen names
const toolsData = [
  {
    title: 'Live Detection',
    // ✅ FIX: Changed 'LiveScreen' to 'live' to match app/live.tsx
    screen: 'live', 
    icon: <Feather name="camera" size={28} color={COLORS.primary} />,
  },
  {
    title: 'Media Upload',
    screen: 'MediaUpload',
    icon: <Feather name="upload-cloud" size={28} color={COLORS.primary} />,
  },
  {
    title: 'VR Simulation',
    screen: 'VRScreen',
    icon: (
      <MaterialCommunityIcons
        name="virtual-reality"
        size={28}
        color={COLORS.primary}
      />
    ),
  },
  {
    title: 'Games',
    screen: 'GamesScreen',
    icon: <FontAwesome5 name="gamepad" size={28} color={COLORS.primary} />,
  },
  {
    title: 'Quiz',
    screen: 'Welcome',   // Goes to /welcome
    icon: (
      <MaterialCommunityIcons
        name="comment-question-outline"
        size={28}
        color={COLORS.primary}
      />
    ),
  },
  {
    title: 'Enhancer',
    screen: 'EnhancerScreen',
    icon: <Feather name="star" size={28} color={COLORS.primary} />,
  },
];

// MAIN DASHBOARD
export default function Dashboard({ onGoToWelcome, navigate }: any) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader onGoToWelcome={onGoToWelcome} />
        <SearchBar />
        <GameProgress />
        <ToolsSection navigate={navigate} />
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

// ---------------- HEADER ----------------
const AppHeader = ({ onGoToWelcome }: any) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.headerIcon}>
      <Feather name="menu" size={24} color={COLORS.darkText} />
    </TouchableOpacity>

    <TouchableOpacity onPress={onGoToWelcome}>
      <View>
        <Text style={styles.greetingText}>Hello, Sara! 👋</Text>
        <Text style={styles.greetingSubText}>Let's play and learn</Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity style={styles.headerIcon}>
      <FontAwesome name="user-circle-o" size={24} color={COLORS.darkText} />
    </TouchableOpacity>
  </View>
);

// ---------------- SEARCH BAR ----------------
const SearchBar = () => (
  <View style={styles.searchBar}>
    <Feather
      name="search"
      size={20}
      color={COLORS.lightText}
      style={{ marginRight: 10 }}
    />
    <TextInput
      placeholder="Search for tools or assessments"
      placeholderTextColor={COLORS.lightText}
      style={styles.searchInput}
    />
  </View>
);

// ---------------- PROGRESS BAR ----------------
const ProgressBar = ({ progress }: { progress: number }) => (
  <View style={styles.progressBarBackground}>
    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
  </View>
);

// ---------------- GAME PROGRESS ----------------
const GameProgress = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Your Game Progress</Text>

    <View style={styles.card}>
      {progressData.map((item, index) => (
        <View
          key={item.title}
          style={index < progressData.length - 1 && styles.progressItemMargin}
        >
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>{item.title}</Text>
            <Text style={styles.progressPercent}>{item.progress}%</Text>
          </View>

          <ProgressBar progress={item.progress} />
        </View>
      ))}
    </View>
  </View>
);

// ---------------- TOOLS SECTION ----------------
const ToolsSection = ({ navigate }: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Choose a tool to get started</Text>

    <View style={styles.toolsGrid}>
      {toolsData.map((tool) => (
        <TouchableOpacity
          key={tool.title}
          style={styles.toolCard}
          onPress={() => navigate(tool.screen)} // Calls router.push('/' + tool.screen)
        >
          {tool.icon}
          <Text style={styles.toolLabel}>{tool.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// ---------------- BOTTOM NAV ----------------
const BottomNavBar = () => (
  <View style={styles.bottomNav}>
    <TouchableOpacity style={styles.navItem}>
      <Feather name="home" size={24} color={COLORS.primary} />
      <Text style={[styles.navLabel, { color: COLORS.primary }]}>Home</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.navItem}>
      <Feather name="settings" size={24} color={COLORS.lightText} />
      <Text style={styles.navLabel}>Tools</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.navItem}>
      <Feather name="user" size={24} color={COLORS.lightText} />
      <Text style={styles.navLabel}>Profile</Text>
    </TouchableOpacity>
  </View>
);

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    padding: 5,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  greetingSubText: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.darkText,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 15,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  progressItemMargin: {
    marginBottom: 15,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.darkText,
  },
  progressPercent: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: COLORS.lightPurple,
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toolCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  toolLabel: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
    paddingVertical: 10,
    paddingBottom: 20,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 12,
    color: COLORS.lightText,
    marginTop: 4,
  },
});