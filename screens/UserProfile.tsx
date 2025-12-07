// import { Ionicons } from '@expo/vector-icons';
// import { Stack, useRouter } from 'expo-router';
// import * as React from 'react';
// import {
//   Alert,
//   Modal,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';

// // 1. IMPORT THEME HOOK
// import { useTheme } from '../Context/ThemeContext';

// const ProfileScreen: React.FC = () => {
//   const router = useRouter();

//   // 2. CONSUME THEME CONTEXT
//   const { darkMode, getFontSizeMultiplier } = useTheme();
//   const scale = getFontSizeMultiplier();

//   // 3. DEFINE DYNAMIC COLORS
//   const theme = {
//     bg: darkMode ? '#000000' : '#F9FAFB',
//     card: darkMode ? '#1C1C1E' : '#FFFFFF',
//     text: darkMode ? '#FFFFFF' : '#000000',
//     subText: darkMode ? '#A1A1AA' : '#6B7280',
//     border: darkMode ? '#2C2C2E' : '#E5E7EB',
//     inputBorder: '#14B8A6', // Teal stays consistent
//     primary: '#14B8A6',
//     iconBg: darkMode ? '#2C3535' : '#E0F7F5', // Darker teal tint for dark mode
//     placeholder: darkMode ? '#555' : '#9CA3AF',
//     modalOverlay: 'rgba(0, 0, 0, 0.7)',
//   };

//   // State for editable fields
//   const [username, setUsername] = React.useState('Alex Doe');
//   const [email, setEmail] = React.useState('alex.doe@email.com');
//   const [colorblindnessType, setColorblindnessType] = React.useState('Protanopia');
  
//   // State for edit mode
//   const [isEditingUsername, setIsEditingUsername] = React.useState(false);
//   const [isEditingEmail, setIsEditingEmail] = React.useState(false);
//   const [showColorblindnessModal, setShowColorblindnessModal] = React.useState(false);

//   // Temporary state for editing
//   const [tempUsername, setTempUsername] = React.useState(username);
//   const [tempEmail, setTempEmail] = React.useState(email);

//   const colorblindnessTypes = [
//     'Protanopia',
//     'Deuteranopia',
//     'Tritanopia',
//     'Normal Vision'
//   ];

//   // --- Handlers (Kept same as original) ---
//   const handleUsernameEdit = (): void => {
//     setTempUsername(username);
//     setIsEditingUsername(true);
//   };

//   const handleUsernameSave = (): void => {
//     if (tempUsername.trim()) {
//       setUsername(tempUsername);
//       setIsEditingUsername(false);
//       Alert.alert('Success', 'Username updated successfully!');
//     } else {
//       Alert.alert('Error', 'Username cannot be empty');
//     }
//   };

//   const handleUsernameCancel = (): void => {
//     setTempUsername(username);
//     setIsEditingUsername(false);
//   };

//   const handleEmailEdit = (): void => {
//     setTempEmail(email);
//     setIsEditingEmail(true);
//   };

//   const handleEmailSave = (): void => {
//     if (tempEmail.trim() && tempEmail.includes('@')) {
//       setEmail(tempEmail);
//       setIsEditingEmail(false);
//       Alert.alert('Success', 'Email updated successfully!');
//     } else {
//       Alert.alert('Error', 'Please enter a valid email address');
//     }
//   };

//   const handleEmailCancel = (): void => {
//     setTempEmail(email);
//     setIsEditingEmail(false);
//   };

//   const handleChangeColorblindness = (): void => {
//     setShowColorblindnessModal(true);
//   };

//   const selectColorblindnessType = (type: string): void => {
//     setColorblindnessType(type);
//     setShowColorblindnessModal(false);
//     Alert.alert('Success', `Colorblindness type changed to ${type}`);
//   };

//   const handleViewQuizDetails = (): void => console.log('View quiz details');
//   const handleViewAllScores = (): void => console.log('View all scores');
//   const handleChangeProfilePicture = (): void => console.log('Change profile picture');
  
//   const handleLogout = (): void => {
//     Alert.alert('Log Out', 'Are you sure you want to log out?', [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Log Out', onPress: () => router.replace('/auth/login'), style: 'destructive' }
//     ]);
//   };

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
//       <Stack.Screen options={{ headerShown: false }} />
//       <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

//       {/* Header */}
//       <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={24 * scale} color={theme.text} />
//         </TouchableOpacity>
//         <Text style={[styles.headerTitle, { color: theme.text, fontSize: 20 * scale }]}>Manage Profile</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
//         {/* Profile Picture Section */}
//         <View style={styles.profileSection}>
//           <View style={styles.profileImageContainer}>
//             <View style={[styles.profileImage, { borderColor: theme.border }]}>
//               {/* Note: Kept specific colors for avatar art as they are illustrative */}
//               <View style={styles.profileIconDark} />
//               <View style={styles.profileIconLight} />
//             </View>
//           </View>
//           <TouchableOpacity onPress={handleChangeProfilePicture}>
//             <Text style={[styles.changeProfileText, { fontSize: 16 * scale }]}>Change Profile Picture</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Username Section */}
//         <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
//           <View style={styles.cardLeft}>
//             <Text style={[styles.label, { fontSize: 14 * scale }]}>Username</Text>
//             {isEditingUsername ? (
//               <TextInput
//                 style={[styles.input, { color: theme.text, fontSize: 16 * scale, borderBottomColor: theme.inputBorder }]}
//                 value={tempUsername}
//                 onChangeText={setTempUsername}
//                 autoFocus
//                 placeholder="Enter username"
//                 placeholderTextColor={theme.placeholder}
//               />
//             ) : (
//               <Text style={[styles.value, { color: theme.text, fontSize: 16 * scale }]}>{username}</Text>
//             )}
//           </View>
//           {isEditingUsername ? (
//             <View style={styles.actionButtons}>
//               <TouchableOpacity style={styles.cancelButton} onPress={handleUsernameCancel}>
//                 <Ionicons name="close-circle-outline" size={22 * scale} color={theme.subText} />
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.saveButton} onPress={handleUsernameSave}>
//                 <Ionicons name="checkmark-circle" size={22 * scale} color={theme.primary} />
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <TouchableOpacity style={styles.updateButton} onPress={handleUsernameEdit}>
//               <Text style={[styles.updateText, { fontSize: 16 * scale }]}>Update</Text>
//               <Ionicons name="create-outline" size={20 * scale} color={theme.primary} />
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Email Section */}
//         <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
//           <View style={styles.cardLeft}>
//             <Text style={[styles.label, { fontSize: 14 * scale }]}>E-mail</Text>
//             {isEditingEmail ? (
//               <TextInput
//                 style={[styles.input, { color: theme.text, fontSize: 16 * scale, borderBottomColor: theme.inputBorder }]}
//                 value={tempEmail}
//                 onChangeText={setTempEmail}
//                 autoFocus
//                 placeholder="Enter email"
//                 placeholderTextColor={theme.placeholder}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />
//             ) : (
//               <Text style={[styles.value, { color: theme.text, fontSize: 16 * scale }]}>{email}</Text>
//             )}
//           </View>
//           {isEditingEmail ? (
//             <View style={styles.actionButtons}>
//               <TouchableOpacity style={styles.cancelButton} onPress={handleEmailCancel}>
//                 <Ionicons name="close-circle-outline" size={22 * scale} color={theme.subText} />
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.saveButton} onPress={handleEmailSave}>
//                 <Ionicons name="checkmark-circle" size={22 * scale} color={theme.primary} />
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <TouchableOpacity style={styles.updateButton} onPress={handleEmailEdit}>
//               <Text style={[styles.updateText, { fontSize: 16 * scale }]}>Update</Text>
//               <Ionicons name="create-outline" size={20 * scale} color={theme.primary} />
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Colorblindness Type Section */}
//         <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
//           <View style={styles.cardLeft}>
//             <Text style={[styles.label, { fontSize: 14 * scale }]}>Colorblindness Type</Text>
//             <View style={styles.colorblindnessRow}>
//               <Ionicons name="eye-outline" size={20 * scale} color={theme.subText} />
//               <Text style={[styles.value, { color: theme.text, fontSize: 16 * scale }]}>{colorblindnessType}</Text>
//             </View>
//           </View>
//           <TouchableOpacity style={styles.updateButton} onPress={handleChangeColorblindness}>
//             <Text style={[styles.changeText, { fontSize: 16 * scale }]}>Change</Text>
//             <Ionicons name="chevron-forward" size={20 * scale} color={theme.primary} />
//           </TouchableOpacity>
//         </View>

//         {/* Progress & Scores Header */}
//         <Text style={[styles.sectionTitle, { color: theme.text, fontSize: 20 * scale }]}>Progress & Scores</Text>

//         {/* Quiz Results Card */}
//         <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
//           <View style={styles.cardContent}>
//             <View style={styles.iconTitleRow}>
//               <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
//                 <Ionicons name="help-circle-outline" size={24 * scale} color={theme.primary} />
//               </View>
//               <Text style={[styles.cardTitle, { color: theme.text, fontSize: 18 * scale }]}>Quiz Results</Text>
//             </View>
//             <Text style={[styles.subtitle, { color: theme.subText, fontSize: 14 * scale }]}>Last completed: Ishihara Test</Text>
//             <Text style={[styles.score, { color: theme.text, fontSize: 32 * scale }]}>
//               85% <Text style={[styles.scoreLabel, { color: theme.subText, fontSize: 16 * scale }]}>Accuracy</Text>
//             </Text>
//             <TouchableOpacity onPress={handleViewQuizDetails}>
//               <Text style={[styles.linkText, { fontSize: 16 * scale }]}>View Details</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Game Scores Card */}
//         <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
//           <View style={styles.cardContent}>
//             <View style={styles.iconTitleRow}>
//               <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
//                 <Ionicons name="game-controller-outline" size={24 * scale} color={theme.primary} />
//               </View>
//               <Text style={[styles.cardTitle, { color: theme.text, fontSize: 18 * scale }]}>Game Scores</Text>
//             </View>
//             <Text style={[styles.subtitle, { color: theme.subText, fontSize: 14 * scale }]}>Highest score: Spectrum Runner</Text>
//             <Text style={[styles.score, { color: theme.text, fontSize: 32 * scale }]}>
//               12,500 <Text style={[styles.scoreLabel, { color: theme.subText, fontSize: 16 * scale }]}>Points</Text>
//             </Text>
//             <TouchableOpacity onPress={handleViewAllScores}>
//               <Text style={[styles.linkText, { fontSize: 16 * scale }]}>View All Scores</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Log Out Button */}
//         <TouchableOpacity 
//             style={[styles.logoutButton, { backgroundColor: theme.card, borderColor: theme.border }]} 
//             onPress={handleLogout}
//         >
//           <Ionicons name="log-out-outline" size={24 * scale} color={theme.subText} />
//           <Text style={[styles.logoutText, { color: theme.subText, fontSize: 16 * scale }]}>Log Out</Text>
//         </TouchableOpacity>

//         <View style={{ height: 40 }} />
//       </ScrollView>

//       {/* Colorblindness Type Modal */}
//       <Modal
//         visible={showColorblindnessModal}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowColorblindnessModal(false)}
//       >
//         <TouchableOpacity 
//           style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}
//           activeOpacity={1}
//           onPress={() => setShowColorblindnessModal(false)}
//         >
//           <TouchableOpacity 
//             activeOpacity={1} 
//             style={[styles.modalContent, { backgroundColor: theme.card }]}
//           >
//             <Text style={[styles.modalTitle, { color: theme.text, fontSize: 20 * scale }]}>Select Colorblindness Type</Text>
//             <ScrollView style={{ maxHeight: 400 }}>
//               {colorblindnessTypes.map((type) => (
//                 <TouchableOpacity
//                   key={type}
//                   style={[styles.modalOption, { borderBottomColor: theme.border }]}
//                   onPress={() => selectColorblindnessType(type)}
//                 >
//                   <Text style={[styles.modalOptionText, { color: theme.text, fontSize: 16 * scale }]}>{type}</Text>
//                   {colorblindnessType === type && (
//                     <Ionicons name="checkmark" size={24 * scale} color={theme.primary} />
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//             <TouchableOpacity
//               style={[styles.modalCancel, { backgroundColor: darkMode ? '#333' : '#F3F4F6' }]}
//               onPress={() => setShowColorblindnessModal(false)}
//             >
//               <Text style={[styles.modalCancelText, { fontSize: 16 * scale }]}>Cancel</Text>
//             </TouchableOpacity>
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// // Static Structural Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 20,
//     borderBottomWidth: 1,
//   },
//   headerTitle: {
//     fontWeight: '700',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   profileSection: {
//     alignItems: 'center',
//     paddingVertical: 30,
//   },
//   profileImageContainer: {
//     marginBottom: 20,
//   },
//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#F3E8DC',
//     borderWidth: 4,
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   profileIconDark: {
//     position: 'absolute',
//     left: 30,
//     bottom: 25,
//     width: 35,
//     height: 40,
//     backgroundColor: '#4A5568',
//     borderRadius: 8,
//     transform: [{ rotate: '-15deg' }],
//   },
//   profileIconLight: {
//     position: 'absolute',
//     right: 25,
//     bottom: 25,
//     width: 30,
//     height: 40,
//     backgroundColor: '#CD9B7A',
//     borderRadius: 8,
//     transform: [{ rotate: '15deg' }],
//   },
//   changeProfileText: {
//     color: '#14B8A6',
//     fontWeight: '600',
//   },
//   card: {
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 15,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderWidth: 1,
//   },
//   cardLeft: {
//     flex: 1,
//     marginRight: 12,
//   },
//   label: {
//     color: '#6B7280',
//     marginBottom: 4,
//   },
//   value: {
//     fontWeight: '600',
//   },
//   input: {
//     fontWeight: '600',
//     borderBottomWidth: 2,
//     paddingVertical: 4,
//     paddingHorizontal: 0,
//   },
//   colorblindnessRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   updateButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   updateText: {
//     color: '#14B8A6',
//     fontWeight: '600',
//   },
//   saveButton: {
//     padding: 4,
//   },
//   changeText: {
//     color: '#14B8A6',
//     fontWeight: '600',
//   },
//   cancelButton: {
//     padding: 4,
//   },
//   sectionTitle: {
//     fontWeight: '700',
//     marginTop: 20,
//     marginBottom: 15,
//   },
//   cardContent: {
//     flex: 1,
//   },
//   iconTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//     gap: 10,
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cardTitle: {
//     fontWeight: '600',
//   },
//   subtitle: {
//     marginBottom: 8,
//   },
//   score: {
//     fontWeight: '700',
//     marginBottom: 10,
//   },
//   scoreLabel: {
//     fontWeight: '400',
//   },
//   linkText: {
//     color: '#14B8A6',
//     fontWeight: '600',
//   },
//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 12,
//     padding: 18,
//     marginTop: 10,
//     gap: 10,
//     borderWidth: 1,
//   },
//   logoutText: {
//     fontWeight: '600',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   modalContent: {
//     borderRadius: 16,
//     padding: 20,
//     width: '100%',
//     maxWidth: 400,
//   },
//   modalTitle: {
//     fontWeight: '700',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   modalOption: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 12,
//     borderBottomWidth: 1,
//   },
//   modalOptionText: {
//     // handled dynamically
//   },
//   modalCancel: {
//     marginTop: 16,
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   modalCancelText: {
//     fontWeight: '600',
//     color: '#6B7280',
//   },
// });

// export default ProfileScreen;
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

import { useTheme } from '../Context/ThemeContext';
// 1. IMPORT AUTH
import { useAuth } from '@/Context/AuthContext';

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  
  // 2. CONSUME AUTH CONTEXT
  const { user, logout } = useAuth();
  
  // 3. DERIVE GUEST STATUS
  const isGuest = user?.isGuest === true;
  
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const scale = getFontSizeMultiplier();

  const theme = {
    bg: darkMode ? '#000000' : '#F9FAFB',
    card: darkMode ? '#1C1C1E' : '#FFFFFF',
    text: darkMode ? '#FFFFFF' : '#000000',
    subText: darkMode ? '#A1A1AA' : '#6B7280',
    border: darkMode ? '#2C2C2E' : '#E5E7EB',
    inputBorder: '#14B8A6', 
    primary: '#14B8A6',
    iconBg: darkMode ? '#2C3535' : '#E0F7F5', 
    placeholder: darkMode ? '#555' : '#9CA3AF',
    modalOverlay: 'rgba(0, 0, 0, 0.7)',
    warningBg: darkMode ? '#3A2E1E' : '#FFF7ED',
    warningText: '#C05621',
  };

  // 4. INITIALIZE DATA 
  const [username, setUsername] = React.useState(
      isGuest ? 'Guest Explorer' : `${user?.firstName || 'Alex'} ${user?.lastName || 'Doe'}`
  );
  const [email, setEmail] = React.useState(
      isGuest ? 'Not Linked' : user?.email || 'alex.doe@email.com'
  );
  const [colorblindnessType, setColorblindnessType] = React.useState('Protanopia');
  
  const [isEditingUsername, setIsEditingUsername] = React.useState(false);
  const [isEditingEmail, setIsEditingEmail] = React.useState(false);
  const [showColorblindnessModal, setShowColorblindnessModal] = React.useState(false);

  const [tempUsername, setTempUsername] = React.useState(username);
  const [tempEmail, setTempEmail] = React.useState(email);

  const colorblindnessTypes = [
    'Protanopia', 'Deuteranopia', 'Tritanopia', 'Normal Vision'
  ];

  // 5. HANDLERS
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

      {/* Header */}
      {/* <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24 * scale} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text, fontSize: 20 * scale }]}>
            {isGuest ? 'Guest Profile' : ''}
        </Text>
        <View style={{ width: 24 }} />
      </View> */}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Guest Warning Banner */}
        {isGuest && (
             <View style={[styles.guestBanner, { backgroundColor: theme.warningBg, borderColor: theme.warningText }]}>
                 <Ionicons name="information-circle" size={24} color={theme.warningText} />
                 <View style={{flex: 1}}>
                    <Text style={[styles.guestBannerTitle, { color: theme.warningText }]}>Unsaved Profile</Text>
                    <Text style={{ color: theme.text, fontSize: 12 * scale }}>
                        Your progress will be lost if you clear app data. Sign up to save it.
                    </Text>
                 </View>
             </View>
        )}

        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={[styles.profileImage, { borderColor: theme.border, opacity: isGuest ? 0.6 : 1 }]}>
              <View style={styles.profileIconDark} />
              <View style={styles.profileIconLight} />
            </View>
          </View>
          <TouchableOpacity onPress={() => isGuest ? handleGuestAction('upload photo') : console.log('Change')}>
            <Text style={[styles.changeProfileText, { fontSize: 16 * scale, color: isGuest ? theme.subText : theme.primary }]}>
                {isGuest ? 'Sign in to add photo' : 'Change Profile Picture'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Username Section */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardLeft}>
            <Text style={[styles.label, { fontSize: 14 * scale }]}>Username</Text>
            {isEditingUsername ? (
              <TextInput
                style={[styles.input, { color: theme.text, fontSize: 16 * scale, borderBottomColor: theme.inputBorder }]}
                value={tempUsername}
                onChangeText={setTempUsername}
                autoFocus
                placeholder="Enter username"
                placeholderTextColor={theme.placeholder}
              />
            ) : (
              <Text style={[styles.value, { color: theme.text, fontSize: 16 * scale }]}>{username}</Text>
            )}
          </View>
          
          {isEditingUsername ? (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleUsernameCancel}>
                <Ionicons name="close-circle-outline" size={22 * scale} color={theme.subText} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleUsernameSave}>
                <Ionicons name="checkmark-circle" size={22 * scale} color={theme.primary} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.updateButton} onPress={handleUsernameEdit}>
              {isGuest ? (
                   <Ionicons name="lock-closed-outline" size={20 * scale} color={theme.subText} />
              ) : (
                <>
                   <Text style={[styles.updateText, { fontSize: 16 * scale }]}>Update</Text>
                   <Ionicons name="create-outline" size={20 * scale} color={theme.primary} />
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Email Section */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardLeft}>
            <Text style={[styles.label, { fontSize: 14 * scale }]}>E-mail</Text>
            {isEditingEmail ? (
              <TextInput
                style={[styles.input, { color: theme.text, fontSize: 16 * scale, borderBottomColor: theme.inputBorder }]}
                value={tempEmail}
                onChangeText={setTempEmail}
                autoFocus
                placeholder="Enter email"
                placeholderTextColor={theme.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={[styles.value, { color: theme.text, fontSize: 16 * scale }]}>{email}</Text>
            )}
          </View>
          
          {isEditingEmail ? (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleEmailCancel}>
                <Ionicons name="close-circle-outline" size={22 * scale} color={theme.subText} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleEmailSave}>
                <Ionicons name="checkmark-circle" size={22 * scale} color={theme.primary} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.updateButton} onPress={handleEmailEdit}>
              {isGuest ? (
                   <Ionicons name="lock-closed-outline" size={20 * scale} color={theme.subText} />
              ) : (
                  <>
                    <Text style={[styles.updateText, { fontSize: 16 * scale }]}>Update</Text>
                    <Ionicons name="create-outline" size={20 * scale} color={theme.primary} />
                  </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* ========================================================== */}
        {/* RESTRICTED CONTENT: CVD Type & Scores (Hidden for Guests) */}
        {/* ========================================================== */}
        {!isGuest && (
          <>
            {/* Colorblindness Type Section */}
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.cardLeft}>
                <Text style={[styles.label, { fontSize: 14 * scale }]}>Colorblindness Type</Text>
                <View style={styles.colorblindnessRow}>
                  <Ionicons name="eye-outline" size={20 * scale} color={theme.subText} />
                  <Text style={[styles.value, { color: theme.text, fontSize: 16 * scale }]}>{colorblindnessType}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.updateButton} onPress={handleChangeColorblindness}>
                <Text style={[styles.changeText, { fontSize: 16 * scale }]}>Change</Text>
                <Ionicons name="chevron-forward" size={20 * scale} color={theme.primary} />
              </TouchableOpacity>
            </View>

            {/* Progress & Scores Header */}
            <Text style={[styles.sectionTitle, { color: theme.text, fontSize: 20 * scale }]}>
               Progress & Scores
            </Text>

            {/* Quiz Results Card */}
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.cardContent}>
                <View style={styles.iconTitleRow}>
                  <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
                    <Ionicons name="help-circle-outline" size={24 * scale} color={theme.primary} />
                  </View>
                  <Text style={[styles.cardTitle, { color: theme.text, fontSize: 18 * scale }]}>Quiz Results</Text>
                </View>
                <Text style={[styles.subtitle, { color: theme.subText, fontSize: 14 * scale }]}>
                    Last completed: Ishihara Test
                </Text>
                <Text style={[styles.score, { color: theme.text, fontSize: 32 * scale }]}>
                  85% <Text style={[styles.scoreLabel, { color: theme.subText, fontSize: 16 * scale }]}>Accuracy</Text>
                </Text>
                <TouchableOpacity onPress={handleViewQuizDetails}>
                  <Text style={[styles.linkText, { fontSize: 16 * scale }]}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Game Scores Card */}
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.cardContent}>
                <View style={styles.iconTitleRow}>
                  <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
                    <Ionicons name="game-controller-outline" size={24 * scale} color={theme.primary} />
                  </View>
                  <Text style={[styles.cardTitle, { color: theme.text, fontSize: 18 * scale }]}>Game Scores</Text>
                </View>
                <Text style={[styles.subtitle, { color: theme.subText, fontSize: 14 * scale }]}>
                    Highest score: Spectrum Runner
                </Text>
                <Text style={[styles.score, { color: theme.text, fontSize: 32 * scale }]}>
                  12,500 <Text style={[styles.scoreLabel, { color: theme.subText, fontSize: 16 * scale }]}>Points</Text>
                </Text>
                <TouchableOpacity onPress={handleViewAllScores}>
                  <Text style={[styles.linkText, { fontSize: 16 * scale }]}>View All Scores</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}


        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Colorblindness Type Modal (Only needed for registered users) */}
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
              <Text style={[styles.modalTitle, { color: theme.text, fontSize: 20 * scale }]}>Select Colorblindness Type</Text>
              <ScrollView style={{ maxHeight: 400 }}>
                {colorblindnessTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.modalOption, { borderBottomColor: theme.border }]}
                    onPress={() => selectColorblindnessType(type)}
                  >
                    <Text style={[styles.modalOptionText, { color: theme.text, fontSize: 16 * scale }]}>{type}</Text>
                    {colorblindnessType === type && (
                      <Ionicons name="checkmark" size={24 * scale} color={theme.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[styles.modalCancel, { backgroundColor: darkMode ? '#333' : '#F3F4F6' }]}
                onPress={() => setShowColorblindnessModal(false)}
              >
                <Text style={[styles.modalCancelText, { fontSize: 16 * scale }]}>Cancel</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20, borderBottomWidth: 1 },
  headerTitle: { fontWeight: '700' },
  content: { flex: 1, paddingHorizontal: 20 },
  
  guestBanner: { flexDirection: 'row', padding: 12, marginBottom: 20, borderRadius: 8, borderWidth: 1, gap: 10, alignItems: 'center', marginTop: 20 },
  guestBannerTitle: { fontWeight: 'bold', marginBottom: 2 },
  
  profileSection: { alignItems: 'center', paddingVertical: 30 },
  profileImageContainer: { marginBottom: 20 },
  profileImage: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#F3E8DC', borderWidth: 4, alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  profileIconDark: { position: 'absolute', left: 30, bottom: 25, width: 35, height: 40, backgroundColor: '#4A5568', borderRadius: 8, transform: [{ rotate: '-15deg' }] },
  profileIconLight: { position: 'absolute', right: 25, bottom: 25, width: 30, height: 40, backgroundColor: '#CD9B7A', borderRadius: 8, transform: [{ rotate: '15deg' }] },
  changeProfileText: { color: '#14B8A6', fontWeight: '600' },
  
  card: { borderRadius: 12, padding: 20, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1 },
  cardLeft: { flex: 1, marginRight: 12 },
  label: { color: '#6B7280', marginBottom: 4 },
  value: { fontWeight: '600' },
  input: { fontWeight: '600', borderBottomWidth: 2, paddingVertical: 4, paddingHorizontal: 0 },
  colorblindnessRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
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