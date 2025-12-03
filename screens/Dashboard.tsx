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
    color: COLORS.orange,
    icon: <MaterialCommunityIcons name="star-four-points" size={36} color="#FFFFFF" />,
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
        </View>
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
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
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
    marginBottom: 15,
    elevation: 2,
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
    paddingVertical: 10,
    paddingBottom: 20,
    justifyContent: 'space-around',
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