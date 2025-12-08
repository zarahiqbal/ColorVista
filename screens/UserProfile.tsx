import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { useAuth } from '@/Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';
// 1. IMPORT AUTH AND USER DATA HOOKS
import { useUserData } from '@/Context/useUserData';

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  // 2B. FETCH REAL-TIME USER DATA FROM FIREBASE
  const { userData, loading: userDataLoading } = useUserData();
  
  // 3. DERIVE GUEST STATUS
  const isGuest = user?.isGuest === true;
  
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const scale = getFontSizeMultiplier();

  // --- 1. DEFINED EARTH TONE PALETTE ---
  const palette = {
    beigeBg: '#F6F3EE',       // Main Background
    charcoal: '#2F2F2F',      // Primary Text & Buttons
    sage: '#8DA399',          // Accent 1 (Quiz Card)
    taupe: '#AA957B',         // Accent 2 (Game Card)
    white: '#FFFFFF',
    textLight: '#6B6661',
    error: '#C25B5B',
  };

  const theme = {
    bg: darkMode ? '#1C1C1E' : palette.beigeBg,
    card: darkMode ? '#2C2C2E' : palette.white,
    text: darkMode ? '#F6F3EE' : palette.charcoal,
    subText: darkMode ? '#A1A1AA' : palette.textLight,
    border: darkMode ? '#333' : '#E5E5E5',
    primary: palette.charcoal,
    accent: palette.taupe,
    modalOverlay: 'rgba(0, 0, 0, 0.7)',
    warningBg: palette.taupe, 
    warningText: palette.white,
  };

  // 4. INITIALIZE DATA - use Firebase data if available
  const [username, setUsername] = React.useState(
      isGuest ? 'Guest Explorer' : userData ? `${userData.firstName || 'User'} ${userData.lastName || 'Profile'}` : `${user?.firstName || 'Alex'} ${user?.lastName || 'Doe'}`
  );
  const [email, setEmail] = React.useState(
      isGuest ? 'Not Linked' : userData?.email || user?.email || 'alex.doe@email.com'
  );
  const [phone, setPhone] = React.useState(
      isGuest ? 'Not Linked' : userData?.phone || user?.phone || 'Not provided'
  );
  const [colorblindnessType, setColorblindnessType] = React.useState(
      userData?.cvdType || 'Normal Vision'
  );
  
  const [isEditingUsername, setIsEditingUsername] = React.useState(false);
  const [isEditingEmail, setIsEditingEmail] = React.useState(false);
  const [showColorblindnessModal, setShowColorblindnessModal] = React.useState(false);

  const [tempUsername, setTempUsername] = React.useState(username);
  const [tempEmail, setTempEmail] = React.useState(email);

  const colorblindnessTypes = [
    'Protanopia', 'Deuteranopia', 'Tritanopia', 'Normal Vision'
  ];

  // --- HANDLERS ---
  const handleGuestAction = (actionName: string) => {
    Alert.alert(
      `Sign up to ${actionName}`,
      "You need a permanent account to customize your profile and save your progress.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Up", onPress: () => router.push('/auth/signup') } 
      ]
    );
  };

  const handleUsernameEdit = (): void => {
    if (isGuest) return handleGuestAction('change username');
    setTempUsername(username);
    setIsEditingUsername(true);
  };

  const handleUsernameSave = (): void => {
    if (tempUsername.trim()) {
      setUsername(tempUsername);
      setIsEditingUsername(false);
      Alert.alert('Success', 'Username updated successfully!');
    } else {
      Alert.alert('Error', 'Username cannot be empty');
    }
  };

  const handleUsernameCancel = (): void => {
    setTempUsername(username);
    setIsEditingUsername(false);
  };

  const handleEmailEdit = (): void => {
    if (isGuest) return handleGuestAction('change email');
    setTempEmail(email);
    setIsEditingEmail(true);
  };

  const handleEmailSave = (): void => {
    if (tempEmail.trim() && tempEmail.includes('@')) {
      setEmail(tempEmail);
      setIsEditingEmail(false);
      Alert.alert('Success', 'Email updated successfully!');
    } else {
      Alert.alert('Error', 'Please enter a valid email address');
    }
  };

  const handleEmailCancel = (): void => {
    setTempEmail(email);
    setIsEditingEmail(false);
  };

  const handleChangeColorblindness = (): void => {
    setShowColorblindnessModal(true);
  };

  const selectColorblindnessType = (type: string): void => {
    setColorblindnessType(type);
    setShowColorblindnessModal(false);
  };

  const handleViewQuizDetails = (): void => console.log('View quiz details');
  const handleViewAllScores = (): void => console.log('View all scores');
  
  const handleLogoutOrSignup = (): void => {
    if (isGuest) {
        router.push('/auth/signup');
    } else {
        Alert.alert('Log Out', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log Out', onPress: () => { logout(); router.replace('/auth/login'); }, style: 'destructive' }
        ]);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Guest Banner */}
        {isGuest && (
             <View style={[styles.guestBanner, { backgroundColor: palette.taupe, borderColor: palette.taupe }]}>
                 <Ionicons name="information-circle" size={24} color="#FFF" />
                 <View style={{flex: 1}}>
                    <Text style={[styles.guestBannerTitle, { color: "#FFF" }]}>Unsaved Profile</Text>
                    <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 13 * scale }}>
                        Sign up to save your progress permanently.
                    </Text>
                 </View>
             </View>
        )}

        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {/* Thick Charcoal Border applied here */}
            <View style={[styles.profileImage, { borderColor: palette.charcoal, backgroundColor: palette.white }]}>
              <Ionicons name="person" size={50 * scale} color={palette.taupe} />
              
              {/* Decorative dots to match theme */}
              <View style={[styles.decoDot, { backgroundColor: palette.sage, top: 20, right: 20 }]} />
              <View style={[styles.decoDot, { backgroundColor: palette.charcoal, bottom: 20, left: 20 }]} />
            </View>
            
            {/* Camera Icon Badge */}
            <TouchableOpacity 
                style={[styles.editIconBadge, { backgroundColor: palette.charcoal }]}
                onPress={() => isGuest ? handleGuestAction('upload photo') : console.log('Change')}
            >
                <Ionicons name="camera" size={16 * scale} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.profileName, { color: theme.text, fontSize: 22 * scale }]}>
            {username}
          </Text>
          <Text style={[styles.profileEmail, { color: theme.subText, fontSize: 14 * scale }]}>
            {email}
          </Text>
        </View>

        {/* ================= EDITABLE FIELDS ================= */}
        
        <Text style={[styles.sectionHeader, { color: theme.subText, fontSize: 13 * scale }]}>ACCOUNT DETAILS</Text>

        {/* Username Card */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.cardIcon}>
             <Ionicons name="person-outline" size={20 * scale} color={theme.subText} />
          </View>
          <View style={styles.cardLeft}>
            <Text style={[styles.label, { fontSize: 12 * scale, color: theme.subText }]}>USERNAME</Text>
            {isEditingUsername ? (
              <TextInput
                style={[styles.input, { color: theme.text, fontSize: 16 * scale, borderBottomColor: palette.taupe }]}
                value={tempUsername}
                onChangeText={setTempUsername}
                autoFocus
              />
            ) : (
              <Text style={[styles.value, { color: theme.text, fontSize: 16 * scale }]}>{username}</Text>
            )}
          </View>
          
          {isEditingUsername ? (
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={handleUsernameCancel}><Ionicons name="close-circle" size={28 * scale} color={theme.subText} /></TouchableOpacity>
              <TouchableOpacity onPress={handleUsernameSave}><Ionicons name="checkmark-circle" size={28 * scale} color={palette.sage} /></TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={handleUsernameEdit}>
              <Text style={[styles.editText, { color: palette.taupe, fontSize: 14 * scale }]}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Email Card */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.cardIcon}>
             <Ionicons name="mail-outline" size={20 * scale} color={theme.subText} />
          </View>
          <View style={styles.cardLeft}>
            <Text style={[styles.label, { fontSize: 12 * scale, color: theme.subText }]}>EMAIL</Text>
            {isEditingEmail ? (
              <TextInput
                style={[styles.input, { color: theme.text, fontSize: 16 * scale, borderBottomColor: palette.taupe }]}
                value={tempEmail}
                onChangeText={setTempEmail}
                autoFocus
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={[styles.value, { color: theme.text, fontSize: 16 * scale }]}>{email}</Text>
            )}
          </View>
          
          {isEditingEmail ? (
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={handleEmailCancel}><Ionicons name="close-circle" size={28 * scale} color={theme.subText} /></TouchableOpacity>
              <TouchableOpacity onPress={handleEmailSave}><Ionicons name="checkmark-circle" size={28 * scale} color={palette.sage} /></TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={handleEmailEdit}>
              <Text style={[styles.editText, { color: palette.taupe, fontSize: 14 * scale }]}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Phone Number Section */}
        {!isGuest && (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.cardLeft}>
              <Text style={[styles.label, { fontSize: 14 * scale }]}>Phone Number</Text>
              <View style={styles.phoneRow}>
                <Ionicons name="call-outline" size={20 * scale} color={theme.subText} />
                <Text style={[styles.value, { color: theme.text, fontSize: 16 * scale }]}>{phone}</Text>
              </View>
            </View>
          </View>
        )}

        {/* ========================================================== */}
        {/* RESTRICTED CONTENT: CVD Type & Scores (Hidden for Guests) */}
        {/* ========================================================== */}
        {!isGuest && (
          <>
            <Text style={[styles.sectionHeader, { color: theme.subText, fontSize: 13 * scale, marginTop: 24 }]}>VISION SETTINGS</Text>
            
            <TouchableOpacity 
                style={[styles.card, { backgroundColor: theme.card }]} 
                onPress={handleChangeColorblindness}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="eye-outline" size={20 * scale} color={theme.subText} />
              </View>
              <View style={styles.cardLeft}>
                <Text style={[styles.label, { fontSize: 12 * scale, color: theme.subText }]}>COLORBLIND TYPE</Text>
                <Text style={[styles.value, { color: theme.text, fontSize: 16 * scale }]}>{colorblindnessType}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20 * scale} color={theme.subText} />
            </TouchableOpacity>

            {/* ================= STATS (COLORED CARDS) ================= */}
            <Text style={[styles.sectionTitle, { color: theme.text, fontSize: 20 * scale, marginTop: 30 }]}>
               Your Statistics
            </Text>

            <View style={styles.statsContainer}>
                {/* 1. SAGE CARD (Matches Easy Mode) */}
                <View style={[styles.statCard, { backgroundColor: palette.sage }]}>
                    <View style={styles.statHeader}>
                        <View style={[styles.statIconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <Ionicons name="school" size={20 * scale} color={palette.charcoal} />
                        </View>
                        <TouchableOpacity onPress={handleViewQuizDetails}>
                            <Ionicons name="arrow-forward" size={20 * scale} color={palette.charcoal} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={[styles.statLabel, { color: palette.charcoal, fontSize: 14 * scale }]}>Quiz Accuracy</Text>
                        <Text style={[styles.statValue, { color: palette.charcoal, fontSize: 32 * scale }]}>85%</Text>
                        <Text style={[styles.statSub, { color: 'rgba(47,47,47,0.7)', fontSize: 12 * scale }]}>Ishihara Test</Text>
                    </View>
                </View>

                {/* 2. TAUPE CARD (Matches Hard Mode) */}
                <View style={[styles.statCard, { backgroundColor: palette.taupe }]}>
                    <View style={styles.statHeader}>
                        <View style={[styles.statIconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <Ionicons name="trophy" size={20 * scale} color="#FFF" />
                        </View>
                        <TouchableOpacity onPress={handleViewAllScores}>
                            <Ionicons name="arrow-forward" size={20 * scale} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={[styles.statLabel, { color: "#FFF", fontSize: 14 * scale }]}>High Score</Text>
                        <Text style={[styles.statValue, { color: "#FFF", fontSize: 32 * scale }]}>12.5k</Text>
                        <Text style={[styles.statSub, { color: 'rgba(255,255,255,0.8)', fontSize: 12 * scale }]}>Spectrum Runner</Text>
                    </View>
                </View>
            </View>
          </>
        )}

        {/* Logout Button */}
        <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: palette.charcoal }]} 
            onPress={handleLogoutOrSignup}
        >
            <Ionicons name={isGuest ? "log-in-outline" : "log-out-outline"} size={22 * scale} color="#FFF" />
            <Text style={[styles.logoutText, { fontSize: 16 * scale }]}>
                {isGuest ? "Sign Up / Log In" : "Log Out"}
            </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal - Kept same logic, updated colors */}
      {!isGuest && (
        <Modal
          visible={showColorblindnessModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowColorblindnessModal(false)}
        >
          <TouchableOpacity 
            style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}
            activeOpacity={1}
            onPress={() => setShowColorblindnessModal(false)}
          >
            <TouchableOpacity 
              activeOpacity={1} 
              style={[styles.modalContent, { backgroundColor: theme.card }]}
            >
              <Text style={[styles.modalTitle, { color: theme.text, fontSize: 20 * scale }]}>Select Vision Type</Text>
              <ScrollView style={{ maxHeight: 400 }}>
                {colorblindnessTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.modalOption, { borderBottomColor: theme.border }]}
                    onPress={() => selectColorblindnessType(type)}
                  >
                    <Text style={[styles.modalOptionText, { color: theme.text, fontSize: 16 * scale }]}>{type}</Text>
                    {colorblindnessType === type && (
                      <Ionicons name="checkmark-circle" size={24 * scale} color={palette.sage} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[styles.modalCancel, { backgroundColor: palette.charcoal }]}
                onPress={() => setShowColorblindnessModal(false)}
              >
                <Text style={[styles.modalCancelText, { fontSize: 16 * scale, color: '#FFF' }]}>Close</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24 },
  
  // Banner
  guestBanner: { flexDirection: 'row', padding: 16, marginBottom: 20, borderRadius: 16, borderWidth: 1, gap: 12, alignItems: 'center', marginTop: 20 },
  guestBannerTitle: { fontWeight: 'bold', marginBottom: 2, fontSize: 16 },
  
  // Profile Header
  profileSection: { alignItems: 'center', paddingTop: 40, paddingBottom: 30 },
  profileImageContainer: { marginBottom: 16, position: 'relative' },
  profileImage: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    borderWidth: 4, // Thicker border
    alignItems: 'center', 
    justifyContent: 'center', 
    overflow: 'hidden' 
  },
  decoDot: { position: 'absolute', width: 10, height: 10, borderRadius: 5 },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#F6F3EE', // Matches bg to look like cutout
  },
  profileName: { fontWeight: '800', marginBottom: 4 },
  profileEmail: { },

  // Sections
  sectionHeader: { fontWeight: '700', letterSpacing: 1, marginBottom: 12 },
  sectionTitle: { fontWeight: '800', marginBottom: 16 },

  // Standard Cards (User/Email)
  card: { 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 5, 
    shadowOffset: {width:0, height: 2},
    elevation: 2
  },
  cardIcon: { marginRight: 16, width: 24, alignItems: 'center' },
  cardLeft: { flex: 1 },
  label: { fontWeight: '700', marginBottom: 2, letterSpacing: 0.5 },
  value: { fontWeight: '600' },
  input: { fontWeight: '600', borderBottomWidth: 2, paddingVertical: 4, paddingHorizontal: 0 },
  colorblindnessRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionButtons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  updateButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  updateText: { color: '#14B8A6', fontWeight: '600' },
  changeText: { color: '#14B8A6', fontWeight: '600' },
  saveButton: { padding: 4 },
  cancelButton: { padding: 4 },
  
  sectionTitle: { fontWeight: '700', marginTop: 20, marginBottom: 15 },
  cardContent: { flex: 1 },
  iconTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
  iconContainer: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontWeight: '600' },
  subtitle: { marginBottom: 8 },
  score: { fontWeight: '700', marginBottom: 10 },
  scoreLabel: { fontWeight: '400' },
  linkText: { color: '#14B8A6', fontWeight: '600' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, padding: 18, marginTop: 10, gap: 10, borderWidth: 1 },
  logoutText: { fontWeight: '600' },
  
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { borderRadius: 16, padding: 20, width: '100%', maxWidth: 400 },
  modalTitle: { fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 12, borderBottomWidth: 1 },
  modalOptionText: { },
  modalCancel: { marginTop: 16, padding: 16, borderRadius: 12, alignItems: 'center' },
  modalCancelText: { fontWeight: '600', color: '#6B7280' },
});

export default ProfileScreen;