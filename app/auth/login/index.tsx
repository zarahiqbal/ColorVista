

// import { useAuth } from '@/Context/AuthContext';
// import { Link, Stack, useRouter } from 'expo-router';
// import { useState } from 'react';
// import {
//   ActivityIndicator,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';
// // Standard icon set in Expo
// import { Ionicons } from '@expo/vector-icons';

// import { useTheme } from '@/Context/ThemeContext';

// export default function Login() {
//   const router = useRouter();
  
//   const { loginAsGuest, signIn } = useAuth();
//   const { darkMode, getFontSizeMultiplier } = useTheme();
  
//   const scale = getFontSizeMultiplier();
//   const colors = {
//     bg: darkMode ? '#000000' : '#FFFFFF',
//     text: darkMode ? '#FFFFFF' : '#000000',
//     inputBg: darkMode ? '#1C1C1E' : '#FFFFFF',
//     border: darkMode ? '#333333' : '#ccc',
//     placeholder: darkMode ? '#666' : '#999',
//     button: darkMode ? '#FFF' : '#000',
//     buttonText: darkMode ? '#000' : '#FFF',
//     error: '#FF3B30', 
//     checkboxActive: darkMode ? '#FFF' : '#000',
//   };

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [formError, setFormError] = useState(''); 
  
//   // 1. New State for Remember Me
//   const [rememberMe, setRememberMe] = useState(false);

//   // State for syntax validation
//   const [hasInvalidChar, setHasInvalidChar] = useState(false);

//   // 2. UPDATED VALIDATION: "Forbidden Characters" Check
//   const handleEmailChange = (text: string) => {
//     setEmail(text);
//     setFormError(''); 
    
//     // Regex explanation:
//     // This allows: a-z, A-Z, 0-9, @, ., _, -, +
//     // If the text contains anything NOT in that list (like a space or '?'), it returns true
//     const forbiddenCharRegex = /[^a-zA-Z0-9@._\-\+]/;
    
//     if (text.length > 0 && forbiddenCharRegex.test(text)) {
//       setHasInvalidChar(true);
//     } else {
//       setHasInvalidChar(false);
//     }
//   };

//   const handleLogin = async () => {
//     // Basic empty check
//     if (!email || !password) {
//       setFormError('Please enter a valid email and password.');
//       return;
//     }
    
//     // Prevent submit if invalid characters exist
//     if (hasInvalidChar) {
//         setFormError('Please remove invalid characters from email.');
//         return;
//     }

//     setIsLoading(true);
//     setFormError('');

//     try {
//       // Pass rememberMe state if your AuthContext supports it
//       await signIn(email.trim(), password);
//       router.replace('/dashboard');
//     } catch (err: any) {
//       console.error('Login failed:', err);
//       setFormError('Invalid email or password'); 
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGuestLogin = () => {
//     loginAsGuest(); 
//     router.replace('/dashboard');
//   };

//   return (
//     <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
//       <Stack.Screen options={{ headerShown: false }} />

//       <KeyboardAvoidingView 
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}
//       >
//         <ScrollView 
//           style={[styles.container, { backgroundColor: colors.bg }]} 
//           contentContainerStyle={styles.contentContainer}
//           keyboardShouldPersistTaps="handled"
//         >
          
//           <View style={styles.header}>
//             <Image 
//               source={require('@/assets/images/logo.png')} 
//               style={styles.logo}
//               resizeMode="contain"
//             />
//             <Text style={[styles.title, { color: colors.text, fontSize: 32 * scale }]}>
//               Welcome 
//             </Text>
//           </View>

//           <View style={styles.form}>
//             {/* EMAIL */}
//             <View style={styles.fieldContainer}>
//                 <Text style={[styles.label, { color: colors.text, fontSize: 14 * scale }]}>
//                   Email
//                 </Text>
//                 <TextInput 
//                   style={[
//                     styles.input, 
//                     { 
//                       backgroundColor: colors.inputBg, 
//                       // 3. Only turn red if forbidden chars are found (or submit error)
//                       borderColor: (hasInvalidChar || formError) ? colors.error : colors.border, 
//                       color: colors.text,
//                       fontSize: 16 * scale
//                     }
//                   ]} 
//                   value={email}
//                   onChangeText={handleEmailChange}
//                   placeholder="email@example.com" 
//                   placeholderTextColor={colors.placeholder}
//                   autoCapitalize="none"
//                   keyboardType="email-address"
//                 />
//                 {hasInvalidChar && (
//                   <Text style={{ color: colors.error, fontSize: 12 * scale, marginTop: 4 }}>
//                     Email contains invalid characters (e.g. spaces)
//                   </Text>
//                 )}
//             </View>

//             {/* PASSWORD */}
//             <View style={styles.fieldContainer}>
//                 <Text style={[styles.label, { color: colors.text, fontSize: 14 * scale }]}>
//                   Password
//                 </Text>
//                 <TextInput 
//                   style={[
//                     styles.input, 
//                     { 
//                       backgroundColor: colors.inputBg, 
//                       borderColor: formError ? colors.error : colors.border, 
//                       color: colors.text,
//                       fontSize: 16 * scale
//                     }
//                   ]} 
//                   value={password}
//                   onChangeText={(text) => {
//                     setPassword(text);
//                     setFormError(''); 
//                   }}
//                   secureTextEntry
//                   placeholder="******" 
//                   placeholderTextColor={colors.placeholder}
//                 />
//             </View>

//             {/* 4. REMEMBER ME CHECKBOX */}
//             <View style={styles.rememberContainer}>
//                 <TouchableOpacity 
//                     style={styles.checkboxRow} 
//                     onPress={() => setRememberMe(!rememberMe)}
//                     activeOpacity={0.7}
//                 >
//                     {/* Custom Checkbox UI */}
//                     <View style={[
//                         styles.checkbox, 
//                         { borderColor: colors.border },
//                         rememberMe && { backgroundColor: colors.checkboxActive, borderColor: colors.checkboxActive }
//                     ]}>
//                         {rememberMe && (
//                             <Ionicons 
//                                 name="checkmark" 
//                                 size={14} 
//                                 color={darkMode ? '#000' : '#FFF'} 
//                             />
//                         )}
//                     </View>
//                     <Text style={[styles.rememberText, { color: colors.text, fontSize: 14 * scale }]}>
//                         Remember me
//                     </Text>
//                 </TouchableOpacity>
//             </View>

//             {/* FORM ERROR MESSAGE */}
//             {formError ? (
//               <Text style={[styles.errorText, { color: colors.error, fontSize: 14 * scale }]}>
//                 {formError}
//               </Text>
//             ) : null}

//             {/* SUBMIT */}
//             <TouchableOpacity 
//               style={[styles.submitButton, { backgroundColor: colors.button }]} 
//               onPress={handleLogin}
//               disabled={isLoading}
//             >
//                {isLoading ? (
//                  <ActivityIndicator color={colors.buttonText} />
//                ) : (
//                  <Text style={[styles.submitButtonText, { color: colors.buttonText, fontSize: 16 * scale }]}>
//                    Sign In
//                  </Text>
//                )}
//             </TouchableOpacity>

//             <View style={styles.registerContainer}>
//                 <Text style={{ color: colors.text, fontSize: 14 * scale }}>
//                   Don't have an account?{' '}
//                 </Text>
//                 <Link href="/auth/signup" asChild>
//                     <TouchableOpacity>
//                         <Text style={[styles.registerLink, { color: colors.text, fontSize: 14 * scale }]}>
//                           Sign up here
//                         </Text>
//                     </TouchableOpacity>
//                 </Link>
//             </View>
//           </View>

//           <View style={{ marginTop: 16 }}>
//                <TouchableOpacity onPress={handleGuestLogin}>
//                    <Text style={[styles.continueAsGuest, { color: colors.text, fontSize: 14 * scale }]}>
//                      Continue as Guest
//                    </Text>
//                </TouchableOpacity>
//           </View>

//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1 },
//   container: { flex: 1 },
//   contentContainer: { padding: 24, justifyContent: 'center', flexGrow: 1 },
//   header: { marginBottom: 32, alignItems: 'center' },
//   logo: { width: 180, height: 130, marginBottom: 20 },
//   title: { fontWeight: 'bold' },
//   form: { width: '100%' },
//   fieldContainer: { marginBottom: 16 },
//   label: { marginBottom: 8, fontWeight: '500' },
//   input: { borderWidth: 1, borderRadius: 8, padding: 12 },
  
//   // New Styles for Checkbox
//   rememberContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
//   checkboxRow: { flexDirection: 'row', alignItems: 'center' },
//   checkbox: { 
//       width: 20, 
//       height: 20, 
//       borderWidth: 2, 
//       borderRadius: 4, 
//       justifyContent: 'center', 
//       alignItems: 'center',
//       marginRight: 8 
//   },
//   rememberText: { fontWeight: '500' },

//   errorText: { marginBottom: 16, textAlign: 'center', fontWeight: '500' },
//   submitButton: { padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
//   submitButtonText: { fontWeight: 'bold' },
//   registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
//   registerLink: { fontWeight: 'bold', textDecorationLine: 'underline' },
//   continueAsGuest: { marginTop: 16, alignItems: 'center', textAlign: 'center', textDecorationLine: 'underline' },
// });
import { useAuth } from '@/Context/AuthContext';
import { Link, Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
// Standard icon set in Expo
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/Context/ThemeContext';

export default function Login() {
  const router = useRouter();
  
  const { loginAsGuest, signIn } = useAuth();
  const { darkMode, getFontSizeMultiplier } = useTheme();
  
  const scale = getFontSizeMultiplier();
  const colors = {
    bg: darkMode ? '#000000' : '#FFFFFF',
    text: darkMode ? '#FFFFFF' : '#000000',
    inputBg: darkMode ? '#1C1C1E' : '#FFFFFF',
    border: darkMode ? '#333333' : '#ccc',
    placeholder: darkMode ? '#666' : '#999',
    button: darkMode ? '#FFF' : '#000',
    buttonText: darkMode ? '#000' : '#FFF',
    error: '#FF3B30', 
    checkboxActive: darkMode ? '#FFF' : '#000',
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(''); 
  
  // 1. New State for Remember Me
  const [rememberMe, setRememberMe] = useState(false);

  // 2. New State for Password Visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // State for syntax validation
  const [hasInvalidChar, setHasInvalidChar] = useState(false);

  // "Forbidden Characters" Check
  const handleEmailChange = (text: string) => {
    setEmail(text);
    setFormError(''); 
    
    // Regex allows: a-z, A-Z, 0-9, @, ., _, -, +
    const forbiddenCharRegex = /[^a-zA-Z0-9@._\-\+]/;
    
    if (text.length > 0 && forbiddenCharRegex.test(text)) {
      setHasInvalidChar(true);
    } else {
      setHasInvalidChar(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setFormError('Please enter a valid email and password.');
      return;
    }
    
    if (hasInvalidChar) {
        setFormError('Please remove invalid characters from email.');
        return;
    }

    setIsLoading(true);
    setFormError('');

    try {
      await signIn(email.trim(), password);
      router.replace('/dashboard');
    } catch (err: any) {
      console.error('Login failed:', err);
      setFormError('Invalid email or password'); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest(); 
    router.replace('/dashboard');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={[styles.container, { backgroundColor: colors.bg }]} 
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          
          <View style={styles.header}>
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.title, { color: colors.text, fontSize: 32 * scale }]}>
              Welcome 
            </Text>
          </View>

          <View style={styles.form}>
            {/* EMAIL */}
            <View style={styles.fieldContainer}>
                <Text style={[styles.label, { color: colors.text, fontSize: 14 * scale }]}>
                  Email
                </Text>
                <TextInput 
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: colors.inputBg, 
                      borderColor: (hasInvalidChar || formError) ? colors.error : colors.border, 
                      color: colors.text,
                      fontSize: 16 * scale
                    }
                  ]} 
                  value={email}
                  onChangeText={handleEmailChange}
                  placeholder="email@example.com" 
                  placeholderTextColor={colors.placeholder}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {hasInvalidChar && (
                  <Text style={{ color: colors.error, fontSize: 12 * scale, marginTop: 4 }}>
                    Email contains invalid characters (e.g. spaces)
                  </Text>
                )}
            </View>

            {/* PASSWORD */}
            <View style={styles.fieldContainer}>
                <Text style={[styles.label, { color: colors.text, fontSize: 14 * scale }]}>
                  Password
                </Text>
                
                {/* Wrapper View to hold Input and Eye Icon */}
                <View style={styles.passwordInputContainer}>
                  <TextInput 
                    style={[
                      styles.input, 
                      { 
                        backgroundColor: colors.inputBg, 
                        borderColor: formError ? colors.error : colors.border, 
                        color: colors.text,
                        fontSize: 16 * scale,
                        paddingRight: 50, // Add padding so text doesn't hide behind icon
                        flex: 1 // Ensure it fills width
                      }
                    ]} 
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setFormError(''); 
                    }}
                    // Toggle visibility based on state
                    secureTextEntry={!isPasswordVisible}
                    placeholder="******" 
                    placeholderTextColor={colors.placeholder}
                  />
                  
                  {/* Eye Icon Button */}
                  <TouchableOpacity 
                    style={styles.eyeIcon} 
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    activeOpacity={0.7}
                  >
                    <Ionicons 
                      name={isPasswordVisible ? "eye" : "eye-off"} 
                      size={24 * scale} 
                      color={colors.placeholder} 
                    />
                  </TouchableOpacity>
                </View>
            </View>

            {/* REMEMBER ME CHECKBOX */}
            <View style={styles.rememberContainer}>
                <TouchableOpacity 
                    style={styles.checkboxRow} 
                    onPress={() => setRememberMe(!rememberMe)}
                    activeOpacity={0.7}
                >
                    <View style={[
                        styles.checkbox, 
                        { borderColor: colors.border },
                        rememberMe && { backgroundColor: colors.checkboxActive, borderColor: colors.checkboxActive }
                    ]}>
                        {rememberMe && (
                            <Ionicons 
                                name="checkmark" 
                                size={14} 
                                color={darkMode ? '#000' : '#FFF'} 
                            />
                        )}
                    </View>
                    <Text style={[styles.rememberText, { color: colors.text, fontSize: 14 * scale }]}>
                        Remember me
                    </Text>
                </TouchableOpacity>
            </View>

            {/* FORM ERROR MESSAGE */}
            {formError ? (
              <Text style={[styles.errorText, { color: colors.error, fontSize: 14 * scale }]}>
                {formError}
              </Text>
            ) : null}

            {/* SUBMIT */}
            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: colors.button }]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
               {isLoading ? (
                 <ActivityIndicator color={colors.buttonText} />
               ) : (
                 <Text style={[styles.submitButtonText, { color: colors.buttonText, fontSize: 16 * scale }]}>
                   Sign In
                 </Text>
               )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
                <Text style={{ color: colors.text, fontSize: 14 * scale }}>
                  Don't have an account?{' '}
                </Text>
                <Link href="/auth/signup" asChild>
                    <TouchableOpacity>
                        <Text style={[styles.registerLink, { color: colors.text, fontSize: 14 * scale }]}>
                          Sign up here
                        </Text>
                    </TouchableOpacity>
                </Link>
            </View>
          </View>

          <View style={{ marginTop: 16 }}>
                <TouchableOpacity onPress={handleGuestLogin}>
                    <Text style={[styles.continueAsGuest, { color: colors.text, fontSize: 14 * scale }]}>
                      Continue as Guest
                    </Text>
                </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  contentContainer: { padding: 24, justifyContent: 'center', flexGrow: 1 },
  header: { marginBottom: 32, alignItems: 'center' },
  logo: { width: 180, height: 130, marginBottom: 20 },
  title: { fontWeight: 'bold' },
  form: { width: '100%' },
  fieldContainer: { marginBottom: 16 },
  label: { marginBottom: 8, fontWeight: '500' },
  input: { borderWidth: 1, borderRadius: 8, padding: 12 },
  
  // New: Container for Password Input to handle absolute positioning of icon
  passwordInputContainer: { 
    position: 'relative', 
    justifyContent: 'center' 
  },
  // New: Position the eye icon
  eyeIcon: {
    position: 'absolute',
    right: 12,
    height: '100%', // Match input height for easy centering
    justifyContent: 'center',
    alignItems: 'center'
  },

  rememberContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { 
      width: 20, 
      height: 20, 
      borderWidth: 2, 
      borderRadius: 4, 
      justifyContent: 'center', 
      alignItems: 'center',
      marginRight: 8 
  },
  rememberText: { fontWeight: '500' },

  errorText: { marginBottom: 16, textAlign: 'center', fontWeight: '500' },
  submitButton: { padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  submitButtonText: { fontWeight: 'bold' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  registerLink: { fontWeight: 'bold', textDecorationLine: 'underline' },
  continueAsGuest: { marginTop: 16, alignItems: 'center', textAlign: 'center', textDecorationLine: 'underline' },
});