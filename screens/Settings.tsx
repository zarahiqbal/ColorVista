
// import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
// import { Stack, useRouter } from 'expo-router';
// import { useState } from 'react';
// import {
//     Alert,
//     Image,
//     Modal,
//     SafeAreaView,
//     ScrollView,
//     StyleSheet,
//     Switch,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View
// } from 'react-native';
// // 1. IMPORT THE HOOK
// import { useTheme } from '@/Context/ThemeContext';

// export default function SettingsPage() {
//   const router = useRouter();

//   // 2. USE GLOBAL STATE
//   // We pull state and setters from our Context
//   const { 
//     fontSize, 
//     setFontSize, 
//     darkMode, 
//     setDarkMode, 
//     colorBlindMode, 
//     setColorBlindMode,
//     getFontSizeMultiplier
//   } = useTheme();

//   // Local state for UI logic only
//   const [notifications, setNotifications] = useState(true);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);

//   // 3. CALCULATE DYNAMIC STYLES
//   const scale = getFontSizeMultiplier(); // e.g., 0.8, 1.0, or 1.2
//   const textColor = darkMode ? '#FFFFFF' : '#000000';
//   const subTextColor = darkMode ? '#A1A1AA' : '#666666';
//   const sectionBg = darkMode ? '#1C1C1E' : '#FFFFFF';
//   const containerBg = darkMode ? '#000000' : '#F2F2F7';
//   const separatorColor = darkMode ? '#38383A' : '#F0F0F0';

//   // Helper for dynamic text size
//   const dText = (size: number) => ({
//     fontSize: size * scale,
//     color: textColor
//   });

//   const colorBlindOptions: any[] = ['None', 'Protanopia', 'Deuteranopia', 'Tritanopia'];

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: containerBg }]}>
//       {/* Dynamic Header */}
//       <Stack.Screen options={{ 
//         title: 'Settings Page', 
//         headerShadowVisible: false,
//         headerStyle: { backgroundColor: containerBg },
//         headerTintColor: textColor,
//       }} />

//       <ScrollView contentContainerStyle={styles.scrollContent}>
        
//         {/* --- SECTION 1: USER INFO --- */}
//         <View style={[styles.section, { backgroundColor: sectionBg, borderColor: separatorColor }]}>
//           <View style={styles.userCard}>
//             <Image 
//               source={{ uri: 'https://i.pravatar.cc/150?img=12' }} 
//               style={styles.avatar} 
//             />
//             <View style={styles.userInfo}>
//               <Text style={[styles.userName, { color: textColor, fontSize: 18 * scale }]}>
//                 Alex Johnson
//               </Text>
//               <Text style={[styles.userEmail, { color: subTextColor, fontSize: 14 * scale }]}>
//                 alex.j@example.com
//               </Text>
//             </View>
//             <TouchableOpacity>
//               <Feather name="chevron-right" size={24} color={subTextColor} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* --- SECTION 2: APP SETTINGS --- */}
//         <Text style={[styles.sectionHeader, { fontSize: 13 * scale }]}>APP SETTINGS</Text>
//         <View style={[styles.section, { backgroundColor: sectionBg, borderColor: separatorColor }]}>
          
//           {/* Notifications Toggle */}
//           <View style={styles.row}>
//             <View style={styles.rowLabel}>
//               <Ionicons name="notifications-outline" size={22} color={textColor} />
//               <Text style={[styles.rowText, dText(16)]}>Notifications</Text>
//             </View>
//             <Switch 
//               value={notifications} 
//               onValueChange={setNotifications} 
//               trackColor={{ false: '#767577', true: '#4CAF50' }}
//             />
//           </View>
          
//           <View style={[styles.separator, { backgroundColor: separatorColor }]} />

//           {/* Dark Mode Toggle */}
//           <View style={styles.row}>
//             <View style={styles.rowLabel}>
//               <Ionicons name="moon-outline" size={22} color={textColor} />
//               <Text style={[styles.rowText, dText(16)]}>Dark Mode</Text>
//             </View>
//             <Switch 
//               value={darkMode} 
//               onValueChange={setDarkMode} 
//               trackColor={{ false: '#767577', true: '#4CAF50' }}
//             />
//           </View>

//           <View style={[styles.separator, { backgroundColor: separatorColor }]} />

//           {/* Color Blind Mode Dropdown */}
//           <View style={styles.dropdownContainer}>
//              <TouchableOpacity 
//                 style={[styles.row, { backgroundColor: sectionBg }]} 
//                 onPress={() => setIsDropdownOpen(!isDropdownOpen)}
//              >
//                 <View style={styles.rowLabel}>
//                   <Ionicons name="eye-outline" size={22} color={textColor} />
//                   <Text style={[styles.rowText, dText(16)]}>Color Blind Mode</Text>
//                 </View>
//                 <View style={styles.dropdownValue}>
//                   <Text style={[styles.valueText, { fontSize: 15 * scale }]}>{colorBlindMode}</Text>
//                   <Feather name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={20} color={subTextColor} />
//                 </View>
//              </TouchableOpacity>

//              {isDropdownOpen && (
//                <View style={[styles.dropdownList, { backgroundColor: darkMode ? '#2C2C2E' : '#f9f9f9', borderTopColor: separatorColor }]}>
//                  {colorBlindOptions.map((option) => (
//                    <TouchableOpacity 
//                      key={option} 
//                      style={styles.dropdownItem}
//                      onPress={() => {
//                         setColorBlindMode(option);
//                         setIsDropdownOpen(false);
//                      }}
//                    >
//                      <Text style={[
//                        styles.dropdownItemText, 
//                        { color: textColor, fontSize: 15 * scale },
//                        colorBlindMode === option && styles.selectedDropdownItem
//                      ]}>
//                        {option}
//                      </Text>
//                      {colorBlindMode === option && <Feather name="check" size={18} color="#007AFF" />}
//                    </TouchableOpacity>
//                  ))}
//                </View>
//              )}
//           </View>

//           <View style={[styles.separator, { backgroundColor: separatorColor }]} />

//           {/* Font Size (Radio Style) */}
//           <View style={styles.columnRow}>
//              <View style={styles.rowLabel}>
//                 <MaterialIcons name="format-size" size={22} color={textColor} />
//                 <Text style={[styles.rowText, dText(16)]}>Font Size</Text>
//              </View>
//              <View style={styles.radioGroup}>
//                {['Small', 'Medium', 'Large'].map((size) => (
//                  <TouchableOpacity 
//                     key={size} 
//                     style={[
//                       styles.radioButton, 
//                       { backgroundColor: darkMode ? '#2C2C2E' : '#f9f9f9', borderColor: separatorColor },
//                       fontSize === size && styles.radioButtonSelected
//                     ]}
//                     onPress={() => setFontSize(size as any)}
//                  >
//                    <Text style={[
//                      styles.radioText, 
//                      { color: textColor, fontSize: 14 * scale },
//                      fontSize === size && styles.radioTextSelected
//                    ]}>
//                      {size}
//                    </Text>
//                  </TouchableOpacity>
//                ))}
//              </View>
//           </View>

//           <View style={[styles.separator, { backgroundColor: separatorColor }]} />

//           {/* Change Password */}
//           <TouchableOpacity style={styles.row} onPress={() => setModalVisible(true)}>
//             <View style={styles.rowLabel}>
//               <Ionicons name="lock-closed-outline" size={22} color={textColor} />
//               <Text style={[styles.rowText, dText(16)]}>Change Password</Text>
//             </View>
//             <Feather name="chevron-right" size={20} color={subTextColor} />
//           </TouchableOpacity>
//         </View>


//         {/* --- SECTION 3: USER ACTIVITY --- */}
//         <Text style={[styles.sectionHeader, { fontSize: 13 * scale }]}>USER ACTIVITY</Text>
//         <View style={[styles.section, { backgroundColor: sectionBg, borderColor: separatorColor }]}>
//           <View style={styles.activityRow}>
//              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
//                 <Text style={[styles.rowText, dText(16)]}>Color Accuracy</Text>
//                 <Text style={{fontWeight: 'bold', color: '#4CAF50', fontSize: 16 * scale}}>78%</Text>
//              </View>
//              <View style={styles.progressBarBackground}>
//                <View style={[styles.progressBarFill, { width: '78%' }]} />
//              </View>
//           </View>
//         </View>

//         {/* --- SECTION 4: OTHER OPTIONS --- */}
//         <Text style={[styles.sectionHeader, { fontSize: 13 * scale }]}>OTHER OPTIONS</Text>
//         <View style={[styles.section, { backgroundColor: sectionBg, borderColor: separatorColor }]}>
//           <TouchableOpacity 
//   style={styles.row} 
//   onPress={() => router.push('/FAQs')} 
// >
//   <View style={styles.rowLabel}>
//     <Feather name="help-circle" size={22} color={textColor} />
//     <Text style={[styles.rowText, dText(16)]}>Help & FAQs</Text>
//   </View>
//   <Feather name="chevron-right" size={20} color={subTextColor} />
// </TouchableOpacity>
//           {/* <TouchableOpacity style={styles.row}>
//             <View style={styles.rowLabel}>
//               <Feather name="help-circle" size={22} color={textColor} />
//               <Text style={[styles.rowText, dText(16)]}>Help & FAQs</Text>
//             </View>
//             <Feather name="chevron-right" size={20} color={subTextColor} />
//           </TouchableOpacity> */}
          
//           <View style={[styles.separator, { backgroundColor: separatorColor }]} />

//           <TouchableOpacity style={styles.row}>
//             <View style={styles.rowLabel}>
//               <Feather name="mail" size={22} color={textColor} />
//               <Text style={[styles.rowText, dText(16)]}>Contact Support</Text>
//             </View>
//             <Feather name="chevron-right" size={20} color={subTextColor} />
//           </TouchableOpacity>
//         </View>

//         {/* --- LOGOUT BUTTON --- */}
//         <TouchableOpacity 
//           style={[styles.logoutButton, { backgroundColor: sectionBg, borderColor: '#ffdddd' }]} 
//           onPress={() => Alert.alert("Logged Out")}
//         >
//           <Text style={[styles.logoutText, { fontSize: 16 * scale }]}>Log Out</Text>
//         </TouchableOpacity>

//       </ScrollView>

//       {/* --- CHANGE PASSWORD MODAL --- */}
//       {/* Note: Modals are distinct environments, we manually style them here too */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={[styles.modalContent, { backgroundColor: sectionBg }]}>
//             <Text style={[styles.modalTitle, { color: textColor }]}>Change Password</Text>
            
//             <TextInput 
//               placeholder="Current Password" 
//               placeholderTextColor="#999"
//               secureTextEntry 
//               style={[styles.input, { backgroundColor: containerBg, color: textColor }]} 
//             />
//             <TextInput 
//               placeholder="New Password" 
//               placeholderTextColor="#999"
//               secureTextEntry 
//               style={[styles.input, { backgroundColor: containerBg, color: textColor }]} 
//             />
//             <TextInput 
//               placeholder="Confirm New Password" 
//               placeholderTextColor="#999"
//               secureTextEntry 
//               style={[styles.input, { backgroundColor: containerBg, color: textColor }]} 
//             />

//             <View style={styles.modalActions}>
//               <TouchableOpacity 
//                 style={[styles.modalBtn, styles.cancelBtn]} 
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text style={{color: '#666'}}>Cancel</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={[styles.modalBtn, styles.confirmBtn]}
//                 onPress={() => {
//                    setModalVisible(false);
//                    Alert.alert("Success", "Password updated successfully");
//                 }}
//               >
//                 <Text style={{color: '#fff', fontWeight: 'bold'}}>Update</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // Background color is now handled dynamically in component
//   },
//   scrollContent: {
//     padding: 16,
//     paddingBottom: 40,
//   },
//   sectionHeader: {
//     fontWeight: '600',
//     color: '#888',
//     marginBottom: 8,
//     marginTop: 24,
//     marginLeft: 12,
//     textTransform: 'uppercase',
//   },
//   section: {
//     borderRadius: 12,
//     overflow: 'hidden',
//     borderWidth: 1,
//     // Colors handled dynamically
//   },
//   separator: {
//     height: 1,
//     marginLeft: 50,
//   },
//   userCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//   },
//   avatar: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginRight: 16,
//   },
//   userInfo: {
//     flex: 1,
//   },
//   userName: {
//     fontWeight: 'bold',
//   },
//   userEmail: {
//     marginTop: 2,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//   },
//   columnRow: {
//     padding: 16,
//   },
//   rowLabel: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   rowText: {
//     marginLeft: 12,
//   },
//   dropdownContainer: {
//     // bg handled dynamically
//   },
//   dropdownValue: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   valueText: {
//     marginRight: 8,
//     color: '#666',
//   },
//   dropdownList: {
//     borderTopWidth: 1,
//   },
//   dropdownItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 14,
//     paddingLeft: 44,
//   },
//   dropdownItemText: {
//     // font size handled dynamically
//   },
//   selectedDropdownItem: {
//     color: '#007AFF',
//     fontWeight: '600',
//   },
//   radioGroup: {
//     flexDirection: 'row',
//     marginTop: 12,
//     marginLeft: 34,
//   },
//   radioButton: {
//     paddingVertical: 6,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     borderWidth: 1,
//     marginRight: 10,
//   },
//   radioButtonSelected: {
//     backgroundColor: '#007AFF',
//     borderColor: '#007AFF',
//   },
//   radioText: {
//     // color handled dynamically
//   },
//   radioTextSelected: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   activityRow: {
//     padding: 16,
//   },
//   progressBarBackground: {
//     height: 8,
//     backgroundColor: '#E5E5EA',
//     borderRadius: 4,
//     width: '100%',
//   },
//   progressBarFill: {
//     height: '100%',
//     backgroundColor: '#4CAF50',
//     borderRadius: 4,
//   },
//   logoutButton: {
//     marginTop: 24,
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     borderWidth: 1,
//   },
//   logoutText: {
//     color: '#FF3B30',
//     fontWeight: '600',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: '85%',
//     borderRadius: 16,
//     padding: 24,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//     fontSize: 16,
//   },
//   modalActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   modalBtn: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginHorizontal: 5,
//   },
//   cancelBtn: {
//     backgroundColor: '#E5E5EA',
//   },
//   confirmBtn: {
//     backgroundColor: '#007AFF',
//   },
// });

import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Modal,
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
import { useAuth } from '@/Context/AuthContext'; // Import Auth
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

  const { user, logout } = useAuth(); // Get user from Auth
  const isGuest = user?.isGuest === true; // Check guest status

  // Local state for UI logic only
  const [notifications, setNotifications] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // 3. CALCULATE DYNAMIC STYLES
  const scale = getFontSizeMultiplier();
  const textColor = darkMode ? '#FFFFFF' : '#000000';
  const subTextColor = darkMode ? '#A1A1AA' : '#666666';
  const sectionBg = darkMode ? '#1C1C1E' : '#FFFFFF';
  const containerBg = darkMode ? '#000000' : '#F2F2F7';
  const separatorColor = darkMode ? '#38383A' : '#F0F0F0';

  // Helper for dynamic text size
  const dText = (size: number) => ({
    fontSize: size * scale,
    color: textColor
  });

  const colorBlindOptions: any[] = ['None', 'Protanopia', 'Deuteranopia', 'Tritanopia'];

  // Handle Logout / Sign Up logic
  const handleAuthAction = () => {
    if (isGuest) {
      router.push('/auth/signup');
    } else {
      Alert.alert("Logged Out", "You have been logged out successfully.", [
        { text: "OK", onPress: () => { logout(); router.replace('/auth/login'); } }
      ]);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: containerBg }]}>
      {/* Dynamic Header */}
      <Stack.Screen options={{ 
        title: 'Settings', 
        headerShadowVisible: false,
        headerStyle: { backgroundColor: containerBg },
        headerTintColor: textColor,
      }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* --- SECTION 1: USER INFO (HIDDEN FOR GUESTS) --- */}
        
              
              
        {/* --- SECTION 2: APP SETTINGS --- */}
        <Text style={[styles.sectionHeader, { fontSize: 13 * scale }]}>APP SETTINGS</Text>
        <View style={[styles.section, { backgroundColor: sectionBg, borderColor: separatorColor }]}>
          
          {/* Notifications Toggle (AVAILABLE FOR ALL) */}
          <View style={styles.row}>
            <View style={styles.rowLabel}>
              <Ionicons name="notifications-outline" size={22} color={textColor} />
              <Text style={[styles.rowText, dText(16)]}>Notifications</Text>
            </View>
            <Switch 
              value={notifications} 
              onValueChange={setNotifications} 
              trackColor={{ false: '#767577', true: '#4CAF50' }}
            />
          </View>
          
          <View style={[styles.separator, { backgroundColor: separatorColor }]} />

          {/* Dark Mode Toggle (AVAILABLE FOR ALL) */}
          <View style={styles.row}>
            <View style={styles.rowLabel}>
              <Ionicons name="moon-outline" size={22} color={textColor} />
              <Text style={[styles.rowText, dText(16)]}>Dark Mode</Text>
            </View>
            <Switch 
              value={darkMode} 
              onValueChange={setDarkMode} 
              trackColor={{ false: '#767577', true: '#4CAF50' }}
            />
          </View>

          {/* Color Blind Mode Dropdown (HIDDEN FOR GUESTS) */}
          {!isGuest && (
            <>
              <View style={[styles.separator, { backgroundColor: separatorColor }]} />
              <View style={styles.dropdownContainer}>
                <TouchableOpacity 
                  style={[styles.row, { backgroundColor: sectionBg }]} 
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <View style={styles.rowLabel}>
                    <Ionicons name="eye-outline" size={22} color={textColor} />
                    <Text style={[styles.rowText, dText(16)]}>Color Blind Mode</Text>
                  </View>
                  <View style={styles.dropdownValue}>
                    <Text style={[styles.valueText, { fontSize: 15 * scale }]}>{colorBlindMode}</Text>
                    <Feather name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={20} color={subTextColor} />
                  </View>
                </TouchableOpacity>

                {isDropdownOpen && (
                  <View style={[styles.dropdownList, { backgroundColor: darkMode ? '#2C2C2E' : '#f9f9f9', borderTopColor: separatorColor }]}>
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
                          { color: textColor, fontSize: 15 * scale },
                          colorBlindMode === option && styles.selectedDropdownItem
                        ]}>
                          {option}
                        </Text>
                        {colorBlindMode === option && <Feather name="check" size={18} color="#007AFF" />}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </>
          )}

          <View style={[styles.separator, { backgroundColor: separatorColor }]} />

          {/* Font Size (AVAILABLE FOR ALL) */}
          <View style={styles.columnRow}>
             <View style={styles.rowLabel}>
                <MaterialIcons name="format-size" size={22} color={textColor} />
                <Text style={[styles.rowText, dText(16)]}>Font Size</Text>
             </View>
             <View style={styles.radioGroup}>
               {['Small', 'Medium', 'Large'].map((size) => (
                 <TouchableOpacity 
                    key={size} 
                    style={[
                      styles.radioButton, 
                      { backgroundColor: darkMode ? '#2C2C2E' : '#f9f9f9', borderColor: separatorColor },
                      fontSize === size && styles.radioButtonSelected
                    ]}
                    onPress={() => setFontSize(size as any)}
                 >
                   <Text style={[
                     styles.radioText, 
                     { color: textColor, fontSize: 14 * scale },
                     fontSize === size && styles.radioTextSelected
                   ]}>
                     {size}
                   </Text>
                 </TouchableOpacity>
               ))}
             </View>
          </View>

          {/* Change Password (HIDDEN FOR GUESTS) */}
          {!isGuest && (
            <>
              <View style={[styles.separator, { backgroundColor: separatorColor }]} />
              <TouchableOpacity style={styles.row} onPress={() => setModalVisible(true)}>
                <View style={styles.rowLabel}>
                  <Ionicons name="lock-closed-outline" size={22} color={textColor} />
                  <Text style={[styles.rowText, dText(16)]}>Change Password</Text>
                </View>
                <Feather name="chevron-right" size={20} color={subTextColor} />
              </TouchableOpacity>
            </>
          )}
        </View>


        {/* --- SECTION 3: USER ACTIVITY (HIDDEN FOR GUESTS) --- */}
        {!isGuest && (
          <>
            <Text style={[styles.sectionHeader, { fontSize: 13 * scale }]}>USER ACTIVITY</Text>
            <View style={[styles.section, { backgroundColor: sectionBg, borderColor: separatorColor }]}>
              <View style={styles.activityRow}>
                 <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <Text style={[styles.rowText, dText(16)]}>Color Accuracy</Text>
                    <Text style={{fontWeight: 'bold', color: '#4CAF50', fontSize: 16 * scale}}>78%</Text>
                 </View>
                 <View style={styles.progressBarBackground}>
                   <View style={[styles.progressBarFill, { width: '78%' }]} />
                 </View>
              </View>
            </View>
          </>
        )}

        {/* --- SECTION 4: OTHER OPTIONS (AVAILABLE FOR ALL) --- */}
        <Text style={[styles.sectionHeader, { fontSize: 13 * scale }]}>OTHER OPTIONS</Text>
        <View style={[styles.section, { backgroundColor: sectionBg, borderColor: separatorColor }]}>
          <TouchableOpacity 
            style={styles.row} 
            onPress={() => router.push('/FAQs')} 
          >
            <View style={styles.rowLabel}>
              <Feather name="help-circle" size={22} color={textColor} />
              <Text style={[styles.rowText, dText(16)]}>Help & FAQs</Text>
            </View>
            <Feather name="chevron-right" size={20} color={subTextColor} />
          </TouchableOpacity>
          
          <View style={[styles.separator, { backgroundColor: separatorColor }]} />

          <TouchableOpacity style={styles.row}>
            <View style={styles.rowLabel}>
              <Feather name="mail" size={22} color={textColor} />
              <Text style={[styles.rowText, dText(16)]}>Contact Support</Text>
            </View>
            <Feather name="chevron-right" size={20} color={subTextColor} />
          </TouchableOpacity>
        </View>

        {/* --- LOGOUT / SIGN UP BUTTON --- */}
        <TouchableOpacity 
          style={[
            styles.logoutButton, 
            { 
              backgroundColor: sectionBg, 
              borderColor: isGuest ? '#14B8A6' : '#ffdddd' // Green for Guest, Red for User
            }
          ]} 
          onPress={handleAuthAction}
        >
          <Text style={[
            styles.logoutText, 
            { 
              fontSize: 16 * scale,
              color: isGuest ? '#14B8A6' : '#FF3B30' 
            }
          ]}>
            {isGuest ? 'Create Free Account' : 'Log Out'}
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* --- CHANGE PASSWORD MODAL (Only renders logic if not guest) --- */}
      {!isGuest && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: sectionBg }]}>
              <Text style={[styles.modalTitle, { color: textColor }]}>Change Password</Text>
              
              <TextInput 
                placeholder="Current Password" 
                placeholderTextColor="#999"
                secureTextEntry 
                style={[styles.input, { backgroundColor: containerBg, color: textColor }]} 
              />
              <TextInput 
                placeholder="New Password" 
                placeholderTextColor="#999"
                secureTextEntry 
                style={[styles.input, { backgroundColor: containerBg, color: textColor }]} 
              />
              <TextInput 
                placeholder="Confirm New Password" 
                placeholderTextColor="#999"
                secureTextEntry 
                style={[styles.input, { backgroundColor: containerBg, color: textColor }]} 
              />

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalBtn, styles.cancelBtn]} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{color: '#666'}}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalBtn, styles.confirmBtn]}
                  onPress={() => {
                     setModalVisible(false);
                     Alert.alert("Success", "Password updated successfully");
                  }}
                >
                  <Text style={{color: '#fff', fontWeight: 'bold'}}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontWeight: '600',
    color: '#888',
    marginBottom: 8,
    marginTop: 24,
    marginLeft: 12,
    textTransform: 'uppercase',
  },
  section: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  separator: {
    height: 1,
    marginLeft: 50,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
  },
  userEmail: {
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  columnRow: {
    padding: 16,
  },
  rowLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    marginLeft: 12,
  },
  dropdownContainer: {
  },
  dropdownValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    marginRight: 8,
    color: '#666',
  },
  dropdownList: {
    borderTopWidth: 1,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    paddingLeft: 44,
  },
  dropdownItemText: {
  },
  selectedDropdownItem: {
    color: '#007AFF',
    fontWeight: '600',
  },
  radioGroup: {
    flexDirection: 'row',
    marginTop: 12,
    marginLeft: 34,
  },
  radioButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  radioText: {
  },
  radioTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  activityRow: {
    padding: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  logoutButton: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  logoutText: {
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelBtn: {
    backgroundColor: '#E5E5EA',
  },
  confirmBtn: {
    backgroundColor: '#007AFF',
  },
});