// import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
// import { Stack, useRouter } from 'expo-router';
// import { useState } from 'react';
// import {
//   Alert,
//   Modal,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Switch,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';

// // 1. IMPORT HOOKS
// import { useAuth } from '@/Context/AuthContext';
// import { useTheme } from '@/Context/ThemeContext';

// export default function SettingsPage() {
//   const router = useRouter();

//   // 2. USE GLOBAL STATE
//   const { 
//     fontSize, 
//     setFontSize, 
//     darkMode, 
//     setDarkMode, 
//     colorBlindMode, 
//     setColorBlindMode,
//     getFontSizeMultiplier
//   } = useTheme();

//   const { user, logout } = useAuth(); 
//   const isGuest = user?.isGuest === true; 

//   const [notifications, setNotifications] = useState(true);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);

//   // 3. CALCULATE DYNAMIC STYLES & PALETTE
//   const scale = getFontSizeMultiplier();

//   // --- DEFINED EARTH TONE PALETTE (MATCHING USER PROFILE) ---
//   const palette = {
//     beigeBg: '#F6F3EE',       // Main Background
//     charcoal: '#2F2F2F',      // Primary Text & Buttons
//     sage: '#8DA399',          // Accent (Switches, Active States)
//     taupe: '#AA957B',         // Secondary Accent
//     white: '#FFFFFF',
//     textLight: '#6B6661',
//     surfaceDark: '#1C1C1E',
//   };

//   const theme = {
//     bg: darkMode ? palette.surfaceDark : palette.beigeBg,
//     card: darkMode ? '#2C2C2E' : palette.white,
//     text: darkMode ? '#F6F3EE' : palette.charcoal,
//     subText: darkMode ? '#A1A1AA' : palette.textLight,
//     border: darkMode ? '#333' : '#E5E5E5', 
//     iconBg: darkMode ? '#3A3A3C' : '#F0EFE9', // Subtle circle bg for icons
//     primary: palette.charcoal,
//     accent: palette.sage,
//   };

//   const dText = (size: number) => ({
//     fontSize: size * scale,
//     color: theme.text
//   });

//   const colorBlindOptions: any[] = ['None', 'Protanopia', 'Deuteranopia', 'Tritanopia'];

//   const handleAuthAction = () => {
//     if (isGuest) {
//       router.push('/auth/signup');
//     } else {
//       Alert.alert("Logged Out", "You have been logged out successfully.", [
//         { text: "OK", onPress: () => { logout(); router.replace('/auth/login'); } }
//       ]);
//     }
//   };

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
//       {/* Dynamic Header */}
//       <Stack.Screen options={{ 
//         title: 'Settings', 
//         headerShadowVisible: false,
//         headerStyle: { backgroundColor: theme.bg },
//         headerTintColor: theme.text,
//         headerTitleStyle: { fontWeight: '800', fontSize: 24 * scale }
//       }} />

//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
//         {/* --- SECTION 1: APP SETTINGS --- */}
//         <Text style={[styles.sectionHeader, { fontSize: 13 * scale, color: theme.subText }]}>APP SETTINGS</Text>
//         <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          
//           {/* Notifications Toggle */}
//           <View style={styles.row}>
//             <View style={styles.rowLabel}>
//               <View style={[styles.iconBox, { backgroundColor: theme.iconBg }]}>
//                  <Ionicons name="notifications-outline" size={20} color={theme.text} />
//               </View>
//               <Text style={[styles.rowText, dText(16)]}>Notifications</Text>
//             </View>
//             <Switch 
//               value={notifications} 
//               onValueChange={setNotifications} 
//               trackColor={{ false: '#D1D5DB', true: palette.sage }}
//               thumbColor={palette.white}
//               ios_backgroundColor="#D1D5DB"
//             />
//           </View>
          
//           <View style={[styles.separator, { backgroundColor: theme.border }]} />

//           {/* Dark Mode Toggle */}
//           <View style={styles.row}>
//             <View style={styles.rowLabel}>
//               <View style={[styles.iconBox, { backgroundColor: theme.iconBg }]}>
//                 <Ionicons name="moon-outline" size={20} color={theme.text} />
//               </View>
//               <Text style={[styles.rowText, dText(16)]}>Dark Mode</Text>
//             </View>
//             <Switch 
//               value={darkMode} 
//               onValueChange={setDarkMode} 
//               trackColor={{ false: '#D1D5DB', true: palette.sage }}
//               thumbColor={palette.white}
//               ios_backgroundColor="#D1D5DB"
//             />
//           </View>

//           {/* Color Blind Mode Dropdown */}
//           {!isGuest && (
//             <>
//               <View style={[styles.separator, { backgroundColor: theme.border }]} />
//               <View style={styles.dropdownContainer}>
//                 <TouchableOpacity 
//                   style={styles.row} 
//                   onPress={() => setIsDropdownOpen(!isDropdownOpen)}
//                 >
//                   <View style={styles.rowLabel}>
//                     <View style={[styles.iconBox, { backgroundColor: theme.iconBg }]}>
//                         <Ionicons name="eye-outline" size={20} color={theme.text} />
//                     </View>
//                     <Text style={[styles.rowText, dText(16)]}>Color Blind Mode</Text>
//                   </View>
//                   <View style={styles.dropdownValue}>
//                     <Text style={[styles.valueText, { fontSize: 15 * scale, color: theme.subText }]}>{colorBlindMode}</Text>
//                     <Feather name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={20} color={theme.subText} />
//                   </View>
//                 </TouchableOpacity>

//                 {isDropdownOpen && (
//                   <View style={[styles.dropdownList, { borderTopColor: theme.border }]}>
//                     {colorBlindOptions.map((option) => (
//                       <TouchableOpacity 
//                         key={option} 
//                         style={styles.dropdownItem}
//                         onPress={() => {
//                           setColorBlindMode(option);
//                           setIsDropdownOpen(false);
//                         }}
//                       >
//                         <Text style={[
//                           styles.dropdownItemText, 
//                           { color: theme.text, fontSize: 15 * scale },
//                           colorBlindMode === option && { color: palette.sage, fontWeight: '700' }
//                         ]}>
//                           {option}
//                         </Text>
//                         {colorBlindMode === option && <Feather name="check" size={18} color={palette.sage} />}
//                       </TouchableOpacity>
//                     ))}
//                   </View>
//                 )}
//               </View>
//             </>
//           )}

//           <View style={[styles.separator, { backgroundColor: theme.border }]} />

//           {/* Font Size */}
//           <View style={styles.columnRow}>
//              <View style={styles.rowLabel}>
//                 <View style={[styles.iconBox, { backgroundColor: theme.iconBg }]}>
//                     <MaterialIcons name="format-size" size={20} color={theme.text} />
//                 </View>
//                 <Text style={[styles.rowText, dText(16)]}>Font Size</Text>
//              </View>
//              <View style={styles.radioGroup}>
//                {['Small', 'Medium', 'Large'].map((size) => (
//                  <TouchableOpacity 
//                    key={size} 
//                    style={[
//                      styles.radioButton, 
//                      { borderColor: fontSize === size ? palette.sage : theme.border, backgroundColor: fontSize === size ? palette.sage : 'transparent' }
//                    ]}
//                    onPress={() => setFontSize(size as any)}
//                  >
//                    <Text style={[
//                      styles.radioText, 
//                      { color: fontSize === size ? '#FFF' : theme.text, fontSize: 13 * scale },
//                      fontSize === size && { fontWeight: '700' }
//                    ]}>
//                      {size}
//                    </Text>
//                  </TouchableOpacity>
//                ))}
//              </View>
//           </View>

//           {/* Change Password */}
//           {!isGuest && (
//             <>
//               <View style={[styles.separator, { backgroundColor: theme.border }]} />
//               <TouchableOpacity style={styles.row} onPress={() => setModalVisible(true)}>
//                 <View style={styles.rowLabel}>
//                   <View style={[styles.iconBox, { backgroundColor: theme.iconBg }]}>
//                     <Ionicons name="lock-closed-outline" size={20} color={theme.text} />
//                   </View>
//                   <Text style={[styles.rowText, dText(16)]}>Change Password</Text>
//                 </View>
//                 <Feather name="chevron-right" size={20} color={theme.subText} />
//               </TouchableOpacity>
//             </>
//           )}
//         </View>


//         {/* --- SECTION 2: USER ACTIVITY --- */}
//         {!isGuest && (
//           <>
//             <Text style={[styles.sectionHeader, { fontSize: 13 * scale, color: theme.subText }]}>USER ACTIVITY</Text>
//             <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
//               <View style={styles.activityRow}>
//                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
//                     <View style={styles.rowLabel}>
//                         <View style={[styles.iconBox, { backgroundColor: theme.iconBg }]}>
//                             <Ionicons name="analytics-outline" size={20} color={theme.text} />
//                         </View>
//                         <Text style={[styles.rowText, dText(16)]}>Color Accuracy</Text>
//                     </View>
//                     <Text style={{fontWeight: '800', color: palette.sage, fontSize: 16 * scale}}>78%</Text>
//                  </View>
//                  <View style={styles.progressBarBackground}>
//                    {/* Using Sage Green for Progress Bar */}
//                    <View style={[styles.progressBarFill, { width: '78%', backgroundColor: palette.sage }]} />
//                  </View>
//               </View>
//             </View>
//           </>
//         )}

//         {/* --- SECTION 3: OTHER OPTIONS --- */}
//         <Text style={[styles.sectionHeader, { fontSize: 13 * scale, color: theme.subText }]}>OTHER OPTIONS</Text>
//         <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
//           <TouchableOpacity 
//             style={styles.row} 
//             onPress={() => router.push('/FAQs')} 
//           >
//             <View style={styles.rowLabel}>
//               <View style={[styles.iconBox, { backgroundColor: theme.iconBg }]}>
//                 <Feather name="help-circle" size={20} color={theme.text} />
//               </View>
//               <Text style={[styles.rowText, dText(16)]}>Help & FAQs</Text>
//             </View>
//             <Feather name="chevron-right" size={20} color={theme.subText} />
//           </TouchableOpacity>
          
//           <View style={[styles.separator, { backgroundColor: theme.border }]} />

//           <TouchableOpacity style={styles.row}>
//             <View style={styles.rowLabel}>
//               <View style={[styles.iconBox, { backgroundColor: theme.iconBg }]}>
//                 <Feather name="mail" size={20} color={theme.text} />
//               </View>
//               <Text style={[styles.rowText, dText(16)]}>Contact Support</Text>
//             </View>
//             <Feather name="chevron-right" size={20} color={theme.subText} />
//           </TouchableOpacity>
//         </View>

//         {/* --- LOGOUT BUTTON (Styled like ProfileScreen Pill) --- */}
//         <TouchableOpacity 
//           style={[
//             styles.logoutButton, 
//             { backgroundColor: palette.charcoal } // Pill shape, Charcoal bg
//           ]} 
//           onPress={handleAuthAction}
//         >
//           <Ionicons name={isGuest ? "log-in-outline" : "log-out-outline"} size={22 * scale} color="#FFF" />
//           <Text style={[
//             styles.logoutText, 
//             { fontSize: 16 * scale, color: '#FFFFFF' }
//           ]}>
//             {isGuest ? 'Create Free Account' : 'Log Out'}
//           </Text>
//         </TouchableOpacity>

//       </ScrollView>

//       {/* --- CHANGE PASSWORD MODAL --- */}
//       {!isGuest && (
//         <Modal
//           animationType="fade"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => setModalVisible(false)}
//         >
//           <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
//             <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
//               <Text style={[styles.modalTitle, { color: theme.text }]}>Change Password</Text>
              
//               <TextInput 
//                 placeholder="Current Password" 
//                 placeholderTextColor={theme.subText}
//                 secureTextEntry 
//                 style={[styles.input, { backgroundColor: theme.bg, color: theme.text }]} 
//               />
//               <TextInput 
//                 placeholder="New Password" 
//                 placeholderTextColor={theme.subText}
//                 secureTextEntry 
//                 style={[styles.input, { backgroundColor: theme.bg, color: theme.text }]} 
//               />
//               <TextInput 
//                 placeholder="Confirm New Password" 
//                 placeholderTextColor={theme.subText}
//                 secureTextEntry 
//                 style={[styles.input, { backgroundColor: theme.bg, color: theme.text }]} 
//               />

//               <View style={styles.modalActions}>
//                 <TouchableOpacity 
//                   style={[styles.modalBtn, { backgroundColor: theme.bg }]} 
//                   onPress={() => setModalVisible(false)}
//                 >
//                   <Text style={{color: theme.subText, fontWeight: '600'}}>Cancel</Text>
//                 </TouchableOpacity>
                
//                 <TouchableOpacity 
//                   style={[styles.modalBtn, { backgroundColor: palette.sage }]}
//                   onPress={() => {
//                      setModalVisible(false);
//                      Alert.alert("Success", "Password updated successfully");
//                   }}
//                 >
//                   <Text style={{color: '#fff', fontWeight: 'bold'}}>Update</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       )}

//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 24,
//     paddingBottom: 40,
//   },
//   sectionHeader: {
//     fontWeight: '700',
//     marginBottom: 10,
//     marginTop: 24,
//     marginLeft: 4,
//     letterSpacing: 0.5,
//   },
//   section: {
//     borderRadius: 24, // Matches User Profile Cards
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   separator: {
//     height: 1,
//     marginLeft: 60, 
//     opacity: 0.5,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 18,
//     paddingHorizontal: 20,
//   },
//   iconBox: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   columnRow: {
//     paddingVertical: 18,
//     paddingHorizontal: 20,
//   },
//   rowLabel: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   rowText: {
//     marginLeft: 14,
//     fontWeight: '600',
//   },
//   dropdownContainer: {
//   },
//   dropdownValue: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   valueText: {
//     marginRight: 8,
//     fontWeight: '500',
//   },
//   dropdownList: {
//     borderTopWidth: 1,
//     backgroundColor: 'rgba(0,0,0,0.02)', // Subtle differentiate
//   },
//   dropdownItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     paddingLeft: 70,
//   },
//   dropdownItemText: {
//     fontWeight: '500',
//   },
//   radioGroup: {
//     flexDirection: 'row',
//     marginTop: 16,
//     marginLeft: 50,
//     gap: 10,
//   },
//   radioButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     borderWidth: 1,
//   },
//   radioText: {
//     fontWeight: '600',
//   },
//   activityRow: {
//     padding: 20,
//   },
//   progressBarBackground: {
//     height: 10,
//     backgroundColor: '#E5E5EA',
//     borderRadius: 5,
//     width: '100%',
//     overflow: 'hidden',
//     marginTop: 8,
//   },
//   progressBarFill: {
//     height: '100%',
//     borderRadius: 5,
//   },
//   // Logout Button Styled like "Pill" from ProfileScreen
//   logoutButton: {
//     marginTop: 40,
//     paddingVertical: 18,
//     borderRadius: 32, // Pill shape
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 4,
//   },
//   logoutText: {
//     fontWeight: '700',
//   },
//   // Modal
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 24,
//   },
//   modalContent: {
//     width: '100%',
//     borderRadius: 24,
//     padding: 24,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 10,
//     elevation: 10,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '800',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   modalActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 12,
//     gap: 12,
//   },
//   modalBtn: {
//     flex: 1,
//     padding: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
// });

import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal, // 1. Import this
  Platform // 1. Import this
  ,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// 1. IMPORT HOOKS
import { useAuth } from '@/Context/AuthContext';
import { useTheme } from '@/Context/ThemeContext';

export default function SettingsPage() {
  const router = useRouter();

  // 2. USE GLOBAL STATE
  const { 
    fontSize, 
    setFontSize, 
    darkMode, 
    setDarkMode, 
    colorBlindMode, 
    setColorBlindMode,
    getFontSizeMultiplier
  } = useTheme();

  const { user, logout } = useAuth(); 
  const isGuest = user?.isGuest === true; 

  const [notifications, setNotifications] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Modals state
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false); // New state for custom logout alert

  // 3. CALCULATE DYNAMIC STYLES & PALETTE
  const scale = getFontSizeMultiplier();

  const palette = {
    beigeBg: '#F6F3EE',
    charcoal: '#2F2F2F',
    sage: '#8DA399',
    taupe: '#AA957B',
    white: '#FFFFFF',
    textLight: '#6B6661',
    surfaceDark: '#1C1C1E',
  };

  const theme = {
    bg: darkMode ? palette.surfaceDark : palette.beigeBg,
    card: darkMode ? '#2C2C2E' : palette.white,
    text: darkMode ? '#F6F3EE' : palette.charcoal,
    subText: darkMode ? '#A1A1AA' : palette.textLight,
    border: darkMode ? '#333' : '#E5E5E5', 
    iconBg: darkMode ? '#3A3A3C' : '#F0EFE9', 
    primary: palette.charcoal,
    accent: palette.sage,
  };

  const dText = (size: number) => ({
    fontSize: size * scale,
    color: theme.text
  });

  const colorBlindOptions: any[] = ['None', 'Protanopia', 'Deuteranopia', 'Tritanopia'];

  // REPLACED: Native Alert with Custom Modal Trigger
  const handleAuthAction = () => {
    setLogoutModalVisible(true);
  };

  // ACTUAL LOGIC: Called when confirming inside the Custom Modal
  const confirmAuthAction = () => {
    setLogoutModalVisible(false);
    if (isGuest) {
      router.push('/auth/signup');
    } else {
      logout();
      router.replace('/auth/login');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Dynamic Header */}
      <Stack.Screen options={{ 
        title: 'Settings', 
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.bg },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: '800', fontSize: 24 * scale }
      }} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- SECTION 1: APP SETTINGS --- */}
        <Text style={[styles.sectionHeader, { fontSize: 13 * scale, color: theme.subText }]}>APP SETTINGS</Text>
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          
          {/* Notifications Toggle */}
          <View style={styles.row}>
            <View style={styles.rowLabel}>
              <View style={[styles.iconBox, { backgroundColor: theme.iconBg }]}>
                 <Ionicons name="notifications-outline" size={20} color={theme.text} />
              </View>
              <Text style={[styles.rowText, dText(16)]}>Notifications</Text>
            </View>
            <Switch 
              value={notifications} 
              onValueChange={setNotifications} 
              trackColor={{ false: '#D1D5DB', true: palette.sage }}
              thumbColor={palette.white}
              ios_backgroundColor="#D1D5DB"
            />
          </View>
          
          <View style={[styles.separator, { backgroundColor: theme.border }]} />

          {/* Dark Mode Toggle */}
          <View style={styles.row}>
            <View style={styles.rowLabel}>
              <View style={[styles.iconBox, { backgroundColor: theme.iconBg }]}>
                <Ionicons name="moon-outline" size={20} color={theme.text} />
              </View>
              <Text style={[styles.rowText, dText(16)]}>Dark Mode</Text>
            </View>
            <Switch 
              value={darkMode} 
              onValueChange={setDarkMode} 
              trackColor={{ false: '#D1D5DB', true: palette.sage }}
              thumbColor={palette.white}
              ios_backgroundColor="#D1D5DB"
            />
          </View>

          {/* Color Blind Mode Dropdown */}
          {!isGuest && (
            <>
              <View style={[styles.separator, { backgroundColor: theme.border }]} />
              <View style={styles.dropdownContainer}>
                <TouchableOpacity 
                  style={styles.row} 
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <View style={styles.rowLabel}>
                    <View style={[styles.iconBox, { backgroundColor: theme.iconBg }]}>
                        <Ionicons name="eye-outline" size={20} color={theme.text} />
                    </View>
                    <Text style={[styles.rowText, dText(16)]}>Color Blind Mode</Text>
                  </View>
                  <View style={styles.dropdownValue}>
                    <Text style={[styles.valueText, { fontSize: 15 * scale, color: theme.subText }]}>{colorBlindMode}</Text>
                    <Feather name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={20} color={theme.subText} />
                  </View>
                </TouchableOpacity>

                {isDropdownOpen && (
                  <View style={[styles.dropdownList, { borderTopColor: theme.border }]}>
                    {colorBlindOptions.map((option) => (
                      <TouchableOpacity 
                        key={option} 
                        style={styles.dropdownItem}
                        onPress={() => {
                          setColorBlindMode(option);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText, 
                          { color: theme.text, fontSize: 15 * scale },
                          colorBlindMode === option && { color: palette.sage, fontWeight: '700' }
                        ]}>
                          {option}
                        </Text>
                        {colorBlindMode === option && <Feather name="check" size={18} color={palette.sage} />}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </>
          )}

          <View style={[styles.separator, { backgroundColor: theme.border }]} />

          {/* Font Size */}
          <View style={styles.columnRow}>
              <View style={styles.rowLabel}>
                <View style={[styles.iconBox, { backgroundColor: theme.iconBg }]}>
                    <MaterialIcons name="format-size" size={20} color={theme.text} />
                </View>
                <Text style={[styles.rowText, dText(16)]}>Font Size</Text>
              </View>
              <View style={styles.radioGroup}>
               {['Small', 'Medium', 'Large'].map((size) => (
                 <TouchableOpacity 
                   key={size} 
                   style={[
                     styles.radioButton, 
                     { borderColor: fontSize === size ? palette.sage : theme.border, backgroundColor: fontSize === size ? palette.sage : 'transparent' }
                   ]}
                   onPress={() => setFontSize(size as any)}
                 >
                   <Text style={[
                     styles.radioText, 
                     { color: fontSize === size ? '#FFF' : theme.text, fontSize: 13 * scale },
                     fontSize === size && { fontWeight: '700' }
                   ]}>
                     {size}
                   </Text>
                 </TouchableOpacity>
               ))}
              </View>
          </View>

          {/* Change Password */}
          {!isGuest && (
            <>
              <View style={[styles.separator, { backgroundColor: theme.border }]} />
              <TouchableOpacity style={styles.row} onPress={() => setPasswordModalVisible(true)}>
                <View style={styles.rowLabel}>
                  <View style={[styles.iconBox, { backgroundColor: theme.iconBg }]}>
                    <Ionicons name="lock-closed-outline" size={20} color={theme.text} />
                  </View>
                  <Text style={[styles.rowText, dText(16)]}>Change Password</Text>
                </View>
                <Feather name="chevron-right" size={20} color={theme.subText} />
              </TouchableOpacity>
            </>
          )}
        </View>


        {/* --- SECTION 2: USER ACTIVITY --- */}
        {!isGuest && (
          <>
            <Text style={[styles.sectionHeader, { fontSize: 13 * scale, color: theme.subText }]}>USER ACTIVITY</Text>
            <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.activityRow}>
                 <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                    <View style={styles.rowLabel}>
                        <View style={[styles.iconBox, { backgroundColor: theme.iconBg }]}>
                            <Ionicons name="analytics-outline" size={20} color={theme.text} />
                        </View>
                        <Text style={[styles.rowText, dText(16)]}>Color Accuracy</Text>
                    </View>
                    <Text style={{fontWeight: '800', color: palette.sage, fontSize: 16 * scale}}>78%</Text>
                 </View>
                 <View style={styles.progressBarBackground}>
                   <View style={[styles.progressBarFill, { width: '78%', backgroundColor: palette.sage }]} />
                 </View>
              </View>
            </View>
          </>
        )}

        {/* --- SECTION 3: OTHER OPTIONS --- */}
        <Text style={[styles.sectionHeader, { fontSize: 13 * scale, color: theme.subText }]}>OTHER OPTIONS</Text>
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity 
            style={styles.row} 
            onPress={() => router.push('/FAQs')} 
          >
            <View style={styles.rowLabel}>
              <View style={[styles.iconBox, { backgroundColor: theme.iconBg }]}>
                <Feather name="help-circle" size={20} color={theme.text} />
              </View>
              <Text style={[styles.rowText, dText(16)]}>Help & FAQs</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.subText} />
          </TouchableOpacity>
          
          <View style={[styles.separator, { backgroundColor: theme.border }]} />

          <TouchableOpacity style={styles.row}>
            <View style={styles.rowLabel}>
              <View style={[styles.iconBox, { backgroundColor: theme.iconBg }]}>
                <Feather name="mail" size={20} color={theme.text} />
              </View>
              <Text style={[styles.rowText, dText(16)]}>Contact Support</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.subText} />
          </TouchableOpacity>
        </View>

        {/* --- LOGOUT / SIGNUP BUTTON --- */}
        <TouchableOpacity 
          style={[
            styles.logoutButton, 
            { backgroundColor: palette.charcoal } 
          ]} 
          onPress={handleAuthAction}
        >
          <Ionicons name={isGuest ? "log-in-outline" : "log-out-outline"} size={22 * scale} color="#FFF" />
          <Text style={[
            styles.logoutText, 
            { fontSize: 16 * scale, color: '#FFFFFF' }
          ]}>
            {isGuest ? 'Create Free Account' : 'Log Out'}
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* --- CUSTOM ALERT MODAL (Replaces Native Alert) --- */}
      {/* This fixes the "too up" issue by allowing us to center it perfectly */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
           <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              {/* Header */}
              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                 <View style={[styles.iconBox, { backgroundColor: isGuest ? palette.sage : '#FF3B30', width: 50, height: 50, borderRadius: 25, marginBottom: 12 }]}>
                    <Ionicons name={isGuest ? "person-add-outline" : "log-out-outline"} size={26} color="#FFF" />
                 </View>
                 <Text style={[styles.modalTitle, { color: theme.text, marginBottom: 8 }]}>
                    {isGuest ? "Create Account" : "Log Out"}
                 </Text>
                 <Text style={{ color: theme.subText, textAlign: 'center', fontSize: 14 * scale }}>
                    {isGuest 
                      ? "Sign up to save your progress and access all features." 
                      : "Are you sure you want to log out of your account?"}
                 </Text>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalBtn, { backgroundColor: theme.bg }]} 
                  onPress={() => setLogoutModalVisible(false)}
                >
                  <Text style={{color: theme.text, fontWeight: '600'}}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalBtn, { backgroundColor: isGuest ? palette.sage : '#FF3B30' }]}
                  onPress={confirmAuthAction}
                >
                  <Text style={{color: '#fff', fontWeight: 'bold'}}>{isGuest ? "Sign Up" : "Log Out"}</Text>
                </TouchableOpacity>
              </View>
           </View>
        </View>
      </Modal>

      {/* --- CHANGE PASSWORD MODAL --- */}
      {!isGuest && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={passwordModalVisible}
          onRequestClose={() => setPasswordModalVisible(false)}
        >
          {/* Added KeyboardAvoidingView to prevent modal going 'too up' or hidden by keyboard */}
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
          >
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Change Password</Text>
              
              <TextInput 
                placeholder="Current Password" 
                placeholderTextColor={theme.subText}
                secureTextEntry 
                style={[styles.input, { backgroundColor: theme.bg, color: theme.text }]} 
              />
              <TextInput 
                placeholder="New Password" 
                placeholderTextColor={theme.subText}
                secureTextEntry 
                style={[styles.input, { backgroundColor: theme.bg, color: theme.text }]} 
              />
              <TextInput 
                placeholder="Confirm New Password" 
                placeholderTextColor={theme.subText}
                secureTextEntry 
                style={[styles.input, { backgroundColor: theme.bg, color: theme.text }]} 
              />

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalBtn, { backgroundColor: theme.bg }]} 
                  onPress={() => setPasswordModalVisible(false)}
                >
                  <Text style={{color: theme.subText, fontWeight: '600'}}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalBtn, { backgroundColor: palette.sage }]}
                  onPress={() => {
                      setPasswordModalVisible(false);
                      // Used generic Alert here as it's just a success toast
                      Alert.alert("Success", "Password updated successfully");
                  }}
                >
                  <Text style={{color: '#fff', fontWeight: 'bold'}}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 24,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  section: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  separator: {
    height: 1,
    marginLeft: 60, 
    opacity: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnRow: {
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  rowLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    marginLeft: 14,
    fontWeight: '600',
  },
  dropdownContainer: {
  },
  dropdownValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    marginRight: 8,
    fontWeight: '500',
  },
  dropdownList: {
    borderTopWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    paddingLeft: 70,
  },
  dropdownItemText: {
    fontWeight: '500',
  },
  radioGroup: {
    flexDirection: 'row',
    marginTop: 16,
    marginLeft: 50,
    gap: 10,
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  radioText: {
    fontWeight: '600',
  },
  activityRow: {
    padding: 20,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#E5E5EA',
    borderRadius: 5,
    width: '100%',
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  logoutButton: {
    marginTop: 40,
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  logoutText: {
    fontWeight: '700',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center', // Ensures vertical centering
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
});