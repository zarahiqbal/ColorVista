import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  Modal,
  Alert,
} from 'react-native';

// Type definitions for styles
interface Styles {
  container: ViewStyle;
  header: ViewStyle;
  headerTitle: TextStyle;
  content: ViewStyle;
  profileSection: ViewStyle;
  profileImageContainer: ViewStyle;
  profileImage: ViewStyle;
  profileIconDark: ViewStyle;
  profileIconLight: ViewStyle;
  changeProfileText: TextStyle;
  card: ViewStyle;
  cardLeft: ViewStyle;
  label: TextStyle;
  value: TextStyle;
  input: TextStyle;
  colorblindnessRow: ViewStyle;
  updateButton: ViewStyle;
  updateText: TextStyle;
  changeText: TextStyle;
  sectionTitle: TextStyle;
  cardContent: ViewStyle;
  iconTitleRow: ViewStyle;
  iconContainer: ViewStyle;
  cardTitle: TextStyle;
  subtitle: TextStyle;
  score: TextStyle;
  scoreLabel: TextStyle;
  linkText: TextStyle;
  logoutButton: ViewStyle;
  logoutText: TextStyle;
  modalOverlay: ViewStyle;
  modalContent: ViewStyle;
  modalTitle: TextStyle;
  modalOption: ViewStyle;
  modalOptionText: TextStyle;
  modalCancel: ViewStyle;
  modalCancelText: TextStyle;
  cancelButton: ViewStyle;
  cancelText: TextStyle;
  actionButtons: ViewStyle;
  saveButton: ViewStyle;
  saveText: TextStyle;
}

const ProfileScreen: React.FC = () => {
  const router = useRouter();

  // State for editable fields
  const [username, setUsername] = React.useState('Alex Doe');
  const [email, setEmail] = React.useState('alex.doe@email.com');
  const [colorblindnessType, setColorblindnessType] = React.useState('Protanopia');
  
  // State for edit mode
  const [isEditingUsername, setIsEditingUsername] = React.useState(false);
  const [isEditingEmail, setIsEditingEmail] = React.useState(false);
  const [showColorblindnessModal, setShowColorblindnessModal] = React.useState(false);

  // Temporary state for editing
  const [tempUsername, setTempUsername] = React.useState(username);
  const [tempEmail, setTempEmail] = React.useState(email);

  const colorblindnessTypes = [
    'Protanopia',
    'Deuteranopia',
    'Tritanopia',
    'Protanomaly',
    'Deuteranomaly',
    'Tritanomaly',
    'Achromatopsia',
    'Normal Vision'
  ];

  const handleUsernameEdit = (): void => {
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
    Alert.alert('Success', `Colorblindness type changed to ${type}`);
  };

  const handleViewQuizDetails = (): void => {
    console.log('View quiz details');
    // Add your navigation logic here
  };

  const handleViewAllScores = (): void => {
    console.log('View all scores');
    // Add your navigation logic here
  };

  const handleChangeProfilePicture = (): void => {
    console.log('Change profile picture');
    // Add your image picker logic here
  };

  const handleLogout = (): void => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Log Out',
          onPress: () => console.log('Logged out'),
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <View style={styles.profileIconDark} />
              <View style={styles.profileIconLight} />
            </View>
          </View>
          <TouchableOpacity onPress={handleChangeProfilePicture}>
            <Text style={styles.changeProfileText}>Change Profile Picture</Text>
          </TouchableOpacity>
        </View>

        {/* Username Section */}
        <View style={styles.card}>
          <View style={styles.cardLeft}>
            <Text style={styles.label}>Username</Text>
            {isEditingUsername ? (
              <TextInput
                style={styles.input}
                value={tempUsername}
                onChangeText={setTempUsername}
                autoFocus
                placeholder="Enter username"
              />
            ) : (
              <Text style={styles.value}>{username}</Text>
            )}
          </View>
          {isEditingUsername ? (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleUsernameCancel}
              >
                <Ionicons name="close-circle-outline" size={22} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleUsernameSave}
              >
                <Ionicons name="checkmark-circle" size={22} color="#14B8A6" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.updateButton}
              onPress={handleUsernameEdit}
            >
              <Text style={styles.updateText}>Update</Text>
              <Ionicons name="create-outline" size={20} color="#14B8A6" />
            </TouchableOpacity>
          )}
        </View>

        {/* Email Section */}
        <View style={styles.card}>
          <View style={styles.cardLeft}>
            <Text style={styles.label}>E-mail</Text>
            {isEditingEmail ? (
              <TextInput
                style={styles.input}
                value={tempEmail}
                onChangeText={setTempEmail}
                autoFocus
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.value}>{email}</Text>
            )}
          </View>
          {isEditingEmail ? (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleEmailCancel}
              >
                <Ionicons name="close-circle-outline" size={22} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleEmailSave}
              >
                <Ionicons name="checkmark-circle" size={22} color="#14B8A6" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.updateButton}
              onPress={handleEmailEdit}
            >
              <Text style={styles.updateText}>Update</Text>
              <Ionicons name="create-outline" size={20} color="#14B8A6" />
            </TouchableOpacity>
          )}
        </View>

        {/* Colorblindness Type Section */}
        <View style={styles.card}>
          <View style={styles.cardLeft}>
            <Text style={styles.label}>Colorblindness Type</Text>
            <View style={styles.colorblindnessRow}>
              <Ionicons name="eye-outline" size={20} color="#9CA3AF" />
              <Text style={styles.value}>{colorblindnessType}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.updateButton}
            onPress={handleChangeColorblindness}
          >
            <Text style={styles.changeText}>Change</Text>
            <Ionicons name="chevron-forward" size={20} color="#14B8A6" />
          </TouchableOpacity>
        </View>

        {/* Progress & Scores Header */}
        <Text style={styles.sectionTitle}>Progress & Scores</Text>

        {/* Quiz Results Card */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.iconTitleRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="help-circle-outline" size={24} color="#14B8A6" />
              </View>
              <Text style={styles.cardTitle}>Quiz Results</Text>
            </View>
            <Text style={styles.subtitle}>Last completed: Ishihara Test</Text>
            <Text style={styles.score}>
              85% <Text style={styles.scoreLabel}>Accuracy</Text>
            </Text>
            <TouchableOpacity onPress={handleViewQuizDetails}>
              <Text style={styles.linkText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Game Scores Card */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.iconTitleRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="game-controller-outline" size={24} color="#14B8A6" />
              </View>
              <Text style={styles.cardTitle}>Game Scores</Text>
            </View>
            <Text style={styles.subtitle}>Highest score: Spectrum Runner</Text>
            <Text style={styles.score}>
              12,500 <Text style={styles.scoreLabel}>Points</Text>
            </Text>
            <TouchableOpacity onPress={handleViewAllScores}>
              <Text style={styles.linkText}>View All Scores</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#6B7280" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Colorblindness Type Modal */}
      <Modal
        visible={showColorblindnessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowColorblindnessModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowColorblindnessModal(false)}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            style={styles.modalContent}
          >
            <Text style={styles.modalTitle}>Select Colorblindness Type</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {colorblindnessTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.modalOption}
                  onPress={() => selectColorblindnessType(type)}
                >
                  <Text style={styles.modalOptionText}>{type}</Text>
                  {colorblindnessType === type && (
                    <Ionicons name="checkmark" size={24} color="#14B8A6" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowColorblindnessModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3E8DC',
    borderWidth: 4,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  profileIconDark: {
    position: 'absolute',
    left: 30,
    bottom: 25,
    width: 35,
    height: 40,
    backgroundColor: '#4A5568',
    borderRadius: 8,
    transform: [{ rotate: '-15deg' }],
  },
  profileIconLight: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    width: 30,
    height: 40,
    backgroundColor: '#CD9B7A',
    borderRadius: 8,
    transform: [{ rotate: '15deg' }],
  },
  changeProfileText: {
    fontSize: 16,
    color: '#14B8A6',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardLeft: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    borderBottomWidth: 2,
    borderBottomColor: '#14B8A6',
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  colorblindnessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  updateText: {
    fontSize: 16,
    color: '#14B8A6',
    fontWeight: '600',
  },
  saveButton: {
    padding: 4,
  },
  saveText: {
    fontSize: 16,
    color: '#14B8A6',
    fontWeight: '600',
  },
  changeText: {
    fontSize: 16,
    color: '#14B8A6',
    fontWeight: '600',
  },
  cancelButton: {
    padding: 4,
  },
  cancelText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginTop: 20,
    marginBottom: 15,
  },
  cardContent: {
    flex: 1,
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E0F7F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  score: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
  },
  linkText: {
    fontSize: 16,
    color: '#14B8A6',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    marginTop: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#000',
  },
  modalCancel: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});

export default ProfileScreen;