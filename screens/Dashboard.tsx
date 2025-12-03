import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from 'react-native';

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
    screen: 'LiveScreen',
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
    screen: 'Welcome',
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

// Props interface
interface DashboardProps {
  onGoToWelcome?: () => void;
  navigate: (screen: string) => void;
}

// MAIN DASHBOARD
export default function Dashboard({ onGoToWelcome, navigate }: DashboardProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader 
          onGoToWelcome={onGoToWelcome} 
          onShowProfile={() => setShowProfileModal(true)} 
        />
        <SearchBar />
        <GameProgress />
        <ToolsSection navigate={navigate} />
      </ScrollView>

      <BottomNavBar />

      {/* Profile Modal */}
      <ProfileModal 
        visible={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </SafeAreaView>
  );
}

// ---------------- HEADER ----------------
interface AppHeaderProps {
  onGoToWelcome?: () => void;
  onShowProfile: () => void;
}

const AppHeader = ({ onGoToWelcome, onShowProfile }: AppHeaderProps) => (
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

    {/* Profile icon - shows modal */}
    <TouchableOpacity style={styles.headerIcon} onPress={onShowProfile}>
      <FontAwesome name="user-circle-o" size={24} color={COLORS.darkText} />
    </TouchableOpacity>
  </View>
);

// ---------------- PROFILE MODAL ----------------
interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

const ProfileModal = ({ visible, onClose }: ProfileModalProps) => {
  const router = useRouter();

  const handleViewProfile = () => {
    onClose();
    router.push('/userprofile');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.profileModalContent} onPress={(e) => e.stopPropagation()}>
          {/* Profile Image */}
          <View style={styles.modalProfileImageContainer}>
            <View style={styles.modalProfileImage}>
              <View style={styles.modalProfileIconDark} />
              <View style={styles.modalProfileIconLight} />
            </View>
          </View>

          {/* User Info */}
          <View style={styles.modalUserInfo}>
            <Text style={styles.modalUserName}>Sara Johnson</Text>
            <Text style={styles.modalUserEmail}>sara.johnson@email.com</Text>
          </View>

          {/* Divider */}
          <View style={styles.modalDivider} />

          {/* Action Buttons */}
          <TouchableOpacity 
            style={styles.modalButton}
            onPress={handleViewProfile}
          >
            <Feather name="user" size={20} color={COLORS.primary} />
            <Text style={styles.modalButtonText}>View Full Profile</Text>
            <Feather name="chevron-right" size={20} color={COLORS.lightText} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.modalButton}
            onPress={() => {
              onClose();
              // Add settings navigation here
            }}
          >
            <Feather name="settings" size={20} color={COLORS.primary} />
            <Text style={styles.modalButtonText}>Settings</Text>
            <Feather name="chevron-right" size={20} color={COLORS.lightText} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.modalButton, styles.modalButtonLast]}
            onPress={() => {
              onClose();
              // Add logout logic here
            }}
          >
            <Feather name="log-out" size={20} color="#EF4444" />
            <Text style={[styles.modalButtonText, { color: '#EF4444' }]}>Log Out</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

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
interface ToolsSectionProps {
  navigate: (screen: string) => void;
}

const ToolsSection = ({ navigate }: ToolsSectionProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Choose a tool to get started</Text>

    <View style={styles.toolsGrid}>
      {toolsData.map((tool) => (
        <TouchableOpacity
          key={tool.title}
          style={styles.toolCard}
          onPress={() => navigate(tool.screen)}
        >
          {tool.icon}
          <Text style={styles.toolLabel}>{tool.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// ---------------- BOTTOM NAV ----------------
const BottomNavBar = () => {
  const router = useRouter();

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem}>
        <Feather name="home" size={24} color={COLORS.primary} />
        <Text style={[styles.navLabel, { color: COLORS.primary }]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <Feather name="settings" size={24} color={COLORS.lightText} />
        <Text style={styles.navLabel}>Tools</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push('/userprofile')}
      >
        <Feather name="user" size={24} color={COLORS.lightText} />
        <Text style={styles.navLabel}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    borderRadius: 4,
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
    elevation: 2,
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
    elevation: 8,
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 70,
    paddingRight: 20,
  },
  profileModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    width: 300,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalProfileImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3E8DC',
    borderWidth: 3,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  modalProfileIconDark: {
    position: 'absolute',
    left: 20,
    bottom: 15,
    width: 25,
    height: 30,
    backgroundColor: '#4A5568',
    borderRadius: 6,
    transform: [{ rotate: '-15deg' }],
  },
  modalProfileIconLight: {
    position: 'absolute',
    right: 18,
    bottom: 15,
    width: 22,
    height: 30,
    backgroundColor: '#CD9B7A',
    borderRadius: 6,
    transform: [{ rotate: '15deg' }],
  },
  modalUserInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalUserName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  modalUserEmail: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  modalDivider: {
    height: 1,
    backgroundColor: COLORS.borderColor,
    marginBottom: 12,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: COLORS.background,
  },
  modalButtonLast: {
    marginBottom: 0,
    backgroundColor: '#FEF2F2',
  },
  modalButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.darkText,
    marginLeft: 12,
  },
});