import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import {
  Alert,
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
import { auth, db } from '@/Context/firebase';
import { useUserData } from '@/Context/useUserData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateProfile } from 'firebase/auth';
import { ref, update as updateDb } from 'firebase/database';
import { useTheme } from '../Context/ThemeContext';

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user, logout, setUser } = useAuth();
  const { userData, loading: userDataLoading } = useUserData();
  const isGuest = user?.isGuest === true;
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const scale = getFontSizeMultiplier();

  const palette = {
    beigeBg: '#F6F3EE',
    charcoal: '#2F2F2F',
    sage: '#8DA399',
    taupe: '#AA957B',
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
  };

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
  

  const [tempUsername, setTempUsername] = React.useState(username);
  const [tempEmail, setTempEmail] = React.useState(email);

  React.useEffect(() => {
    if (userData?.cvdType) {
      setColorblindnessType(userData.cvdType);
    }
  }, [userData?.cvdType]);



  // CVD types are auto-detected via quizzes; manual selection removed

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

  const handleUsernameSave = async (): Promise<void> => {
    if (!tempUsername.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    const fullName = tempUsername.trim();
    const parts = fullName.split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';

    // Optimistically update UI
    setUsername(fullName);
    setIsEditingUsername(false);
    Alert.alert('Success', 'Username updated successfully!');

    // If not a guest, persist to Firebase Realtime DB and update auth displayName
    if (!isGuest && user?.uid) {
      try {
        const updates: Record<string, unknown> = {
          firstName,
          lastName,
          updatedAt: new Date().toISOString(),
        };

        // Update Realtime Database
        const userRef = ref(db, `users/${user.uid}`);
        await updateDb(userRef, updates);

        // Update Firebase Auth displayName
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName: `${firstName} ${lastName}`.trim() });
        }

        // Update local context and persist to AsyncStorage
        const newProfile = { ...(user as any), firstName, lastName, updatedAt: updates.updatedAt };
        try {
          // setUser is provided by AuthContext
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setUser(newProfile);
          await AsyncStorage.setItem('@user', JSON.stringify(newProfile));
        } catch (e) {
          // ignore persistence errors
        }
      } catch (err) {
        console.error('Failed to update username in Firebase:', err);
      }
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

  // Manual change removed: CVD updated only from quiz results

  const handleViewQuizDetails = (): void => console.log('View quiz details');
  const handleViewAllScores = (): void => console.log('View all scores');
  
  const handleLogoutOrSignup = (): void => {
    if (isGuest) {
      router.push('/auth/login');
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
          <View style={[styles.guestBanner, { backgroundColor: palette.taupe }]}>
            <Ionicons name="information-circle" size={24 * scale} color="#FFF" />
            <View style={styles.guestBannerContent}>
              <Text style={[styles.guestBannerTitle, { fontSize: 16 * scale }]}>Unsaved Profile</Text>
              <Text style={[styles.guestBannerText, { fontSize: 13 * scale }]}>
                Sign up to save your progress permanently.
              </Text>
            </View>
          </View>
        )}

        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={[styles.profileImage, { borderColor: palette.charcoal, backgroundColor: palette.white }]}>
              <Ionicons name="person" size={50 * scale} color={palette.taupe} />
              <View style={[styles.decoDot, { backgroundColor: palette.sage, top: 20, right: 20 }]} />
              <View style={[styles.decoDot, { backgroundColor: palette.charcoal, bottom: 20, left: 20 }]} />
            </View>
            
            <TouchableOpacity 
              style={[styles.editIconBadge, { backgroundColor: palette.charcoal, borderColor: theme.bg }]}
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

        {/* ACCOUNT DETAILS SECTION */}
        <Text style={[styles.sectionHeader, { color: theme.subText, fontSize: 13 * scale }]}>
          ACCOUNT DETAILS
        </Text>

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
              <TouchableOpacity onPress={handleUsernameCancel}>
                <Ionicons name="close-circle" size={28 * scale} color={theme.subText} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUsernameSave}>
                <Ionicons name="checkmark-circle" size={28 * scale} color={palette.sage} />
              </TouchableOpacity>
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
            <Text style={[styles.value, { color: theme.text, fontSize: 16 * scale }]}>{email}</Text>
          </View>
        </View>

        {/* Phone Number Card - NOW CONSISTENT */}
        {!isGuest && (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardIcon}>
              <Ionicons name="call-outline" size={20 * scale} color={theme.subText} />
            </View>
            <View style={styles.cardLeft}>
              <Text style={[styles.label, { fontSize: 12 * scale, color: theme.subText }]}>PHONE</Text>
              <Text style={[styles.value, { color: theme.text, fontSize: 16 * scale }]}>{phone}</Text>
            </View>
          </View>
        )}

        {/* VISION SETTINGS SECTION */}
        {!isGuest && (
          <>
            <Text style={[styles.sectionHeader, { color: theme.subText, fontSize: 13 * scale }]}>
              VISION SETTINGS
            </Text>
            
            <View 
              style={[styles.card, { backgroundColor: theme.card }]} 
            >
              <View style={styles.cardIcon}>
                <Ionicons name="eye-outline" size={20 * scale} color={theme.subText} />
              </View>
              <View style={styles.cardLeft}>
                <Text style={[styles.label, { fontSize: 12 * scale, color: theme.subText }]}>COLORBLIND TYPE</Text>
                <Text style={[styles.value, { color: theme.text, fontSize: 16 * scale }]}>{colorblindnessType}</Text>
              </View>
            </View>

            {/* STATISTICS SECTION */}
            <Text style={[styles.sectionHeader, { color: theme.subText, fontSize: 13 * scale }]}>
              YOUR STATISTICS
            </Text>

            <View style={styles.statsContainer}>
              {/* Sage Card */}
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
                  <Text style={[styles.statLabel, { color: palette.charcoal, fontSize: 14 * scale }]}>
                    Quiz Accuracy
                  </Text>
                  <Text style={[styles.statValue, { color: palette.charcoal, fontSize: 32 * scale }]}>
                    85%
                  </Text>
                  <Text style={[styles.statSub, { color: 'rgba(47,47,47,0.7)', fontSize: 12 * scale }]}>
                    Ishihara Test
                  </Text>
                </View>
              </View>

              {/* Taupe Card */}
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
                  <Text style={[styles.statLabel, { color: "#FFF", fontSize: 14 * scale }]}>
                    High Score
                  </Text>
                  <Text style={[styles.statValue, { color: "#FFF", fontSize: 32 * scale }]}>
                    12.5k
                  </Text>
                  <Text style={[styles.statSub, { color: 'rgba(255,255,255,0.8)', fontSize: 12 * scale }]}>
                    Spectrum Runner
                  </Text>
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

      {/* Modal removed — CVD type is updated only via quiz results */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 24 
  },
  
  // Guest Banner - Consistent spacing and layout
  guestBanner: { 
    flexDirection: 'row', 
    padding: 16, 
    marginTop: 20,
    marginBottom: 24, 
    borderRadius: 16, 
    gap: 12, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  guestBannerContent: {
    flex: 1,
  },
  guestBannerTitle: { 
    fontWeight: '700', 
    marginBottom: 2,
    color: '#FFF',
  },
  guestBannerText: {
    color: 'rgba(255,255,255,0.9)',
  },
  
  // Profile Header - Consistent spacing
  profileSection: { 
    alignItems: 'center', 
    paddingTop: 40, 
    paddingBottom: 32 
  },
  profileImageContainer: { 
    marginBottom: 16, 
    position: 'relative' 
  },
  profileImage: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    borderWidth: 4,
    alignItems: 'center', 
    justifyContent: 'center', 
    overflow: 'hidden',
    position: 'relative',
  },
  decoDot: { 
    position: 'absolute', 
    width: 10, 
    height: 10, 
    borderRadius: 5 
  },
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
  },
  profileName: { 
    fontWeight: '800', 
    marginBottom: 4 
  },
  profileEmail: { 
    fontWeight: '400' 
  },

  // Section Headers - Consistent across all sections
  sectionHeader: { 
    fontWeight: '700', 
    letterSpacing: 1, 
    marginBottom: 12,
    marginTop: 24,
  },

  // Cards - Unified style for all info cards
  card: { 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 5, 
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardIcon: { 
    marginRight: 16, 
    width: 24, 
    alignItems: 'center' 
  },
  cardLeft: { 
    flex: 1 
  },
  label: { 
    fontWeight: '700', 
    marginBottom: 4, 
    letterSpacing: 0.5 
  },
  value: { 
    fontWeight: '600' 
  },
  input: { 
    fontWeight: '600', 
    borderBottomWidth: 2, 
    paddingVertical: 4, 
    paddingHorizontal: 0 
  },
  editText: { 
    fontWeight: '600' 
  },
  actionButtons: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  
  // Stats Cards - Consistent with other cards
  statsContainer: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 24 
  },
  statCard: { 
    flex: 1, 
    borderRadius: 16, 
    padding: 16, 
    justifyContent: 'space-between', 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    shadowOffset: { width: 0, height: 4 }, 
    elevation: 3,
    minHeight: 150,
  },
  statHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 12 
  },
  statIconCircle: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  statLabel: { 
    fontWeight: '600', 
    marginBottom: 4 
  },
  statValue: { 
    fontWeight: '800', 
    marginBottom: 4 
  },
  statSub: { 
    fontWeight: '500' 
  },
  
  // Logout Button - Consistent with other interactive elements
  logoutButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 16, 
    padding: 18, 
    marginTop: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  logoutText: { 
    fontWeight: '600',
    color: '#FFF',
  },
  
  // Modal - Consistent styling
  modalOverlay: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  modalContent: { 
    borderRadius: 16, 
    padding: 20, 
    width: '100%', 
    maxWidth: 400 
  },
  modalTitle: { 
    fontWeight: '700', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  modalOption: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 16, 
    paddingHorizontal: 12, 
    borderBottomWidth: 1 
  },
  modalOptionText: { 
    fontWeight: '500' 
  },
  modalCancel: { 
    marginTop: 16, 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  modalCancelText: { 
    fontWeight: '600', 
    color: '#FFF' 
  },
});

export default ProfileScreen;