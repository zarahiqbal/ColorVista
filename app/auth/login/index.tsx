

// import { useAuth } from '@/Context/AuthContext'; // Adjust path based on location
// import { Link, useRouter } from 'expo-router'; // Import Link for navigation
// import React, { useState } from 'react';
// import {
//   ActivityIndicator,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// export default function Login() {
//   const router = useRouter(); // <--- WE USE THIS FOR EXPO ROUTING
//   const { setUser } = useAuth();
  
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleLogin = async () => {
//     setIsLoading(true);
//     // ... Perform your API fetch here ...
    
//     // MOCK SUCCESS FOR NOW
//     setTimeout(() => {
//         setIsLoading(false);
//         console.log("Login Success");
        
//         // --- NAVIGATION LOGIC ---
//         // navigate to the dashboard (assumes app/dashboard/index.tsx exists)
//         router.replace('/dashboard'); 
//     }, 1000);
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
//       <View style={styles.header}>
//         <Text style={styles.title}>Welcome Back</Text>
//       </View>

//       <View style={styles.form}>
//         {/* EMAIL INPUT */}
//         <View style={styles.fieldContainer}>
//             <Text style={styles.label}>Email</Text>
//             <TextInput 
//                 style={styles.input} 
//                 value={email}
//                 onChangeText={setEmail}
//                 placeholder="email@example.com" 
//             />
//         </View>

//         {/* PASSWORD INPUT */}
//         <View style={styles.fieldContainer}>
//             <Text style={styles.label}>Password</Text>
//             <TextInput 
//                 style={styles.input} 
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry
//                 placeholder="******" 
//             />
//         </View>

//         {/* SUBMIT BUTTON */}
//         <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
//            {isLoading ? (
//              <ActivityIndicator color="#fff" />
//            ) : (
//              <Text style={styles.submitButtonText}>Sign In</Text>
//            )}
//         </TouchableOpacity>

//         {/* LINK TO SIGNUP */}
//         <View style={styles.registerContainer}>
//             <Text>Don't have an account? </Text>
//             {/* Using Expo Router Link is better for performance than router.push for simple links */}
//             <Link href="/auth/signup" asChild>
//                 <TouchableOpacity>
//                     <Text style={styles.registerLink}>Sign up here</Text>
//                 </TouchableOpacity>
//             </Link>
//         </View>
//       </View>
//       <View>
//         <Link href="/dashboard" asChild>
//                 <TouchableOpacity>
//                     <Text style={styles.continueAsGuest}>Continue as Guest</Text>
//                 </TouchableOpacity>
//             </Link>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FFF' },
//   contentContainer: { padding: 24, justifyContent: 'center', flexGrow: 1 },
//   header: { marginBottom: 32, alignItems: 'center' },
//   title: { fontSize: 28, fontWeight: 'bold' },
//   form: { width: '100%' },
//   fieldContainer: { marginBottom: 16 },
//   label: { marginBottom: 8, fontWeight: '500' },
//   input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
//   submitButton: { backgroundColor: '#000', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
//   submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
//   registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
//   registerLink: { fontWeight: 'bold', color: '#000' },
//   continueAsGuest: { marginTop: 16, alignItems: 'center' , color: '#000', textAlign: 'center', textDecorationLine: 'underline' },
// });
// import { useAuth } from '@/Context/AuthContext'; // Adjust path if needed
// import { Link, Stack, useRouter } from 'expo-router';
// import { useState } from 'react';
// import {
//   ActivityIndicator,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';

// // 1. IMPORT THEME HOOK
// // Ensure this path matches where you created the file (e.g., '@/context/ThemeContext')
// import { useTheme } from '@/Context/ThemeContext';

// export default function Login() {
//   const router = useRouter();
//   const { setUser } = useAuth();
  
//   // 2. CONSUME GLOBAL THEME STATE
//   const { darkMode, getFontSizeMultiplier } = useTheme();
  
//   // 3. CALCULATE DYNAMIC STYLES
//   const scale = getFontSizeMultiplier();
//   const colors = {
//     bg: darkMode ? '#000000' : '#FFFFFF',
//     text: darkMode ? '#FFFFFF' : '#000000',
//     inputBg: darkMode ? '#1C1C1E' : '#FFFFFF', // Dark gray for inputs in dark mode
//     border: darkMode ? '#333333' : '#ccc',
//     placeholder: darkMode ? '#666' : '#999',
//     button: darkMode ? '#FFF' : '#000',
//     buttonText: darkMode ? '#000' : '#FFF',
//   };

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleLogin = async () => {
//     setIsLoading(true);
//     // ... Perform your API fetch here ...
    
//     setTimeout(() => {
//         setIsLoading(false);
//         console.log("Login Success");
//         router.replace('/dashboard'); 
//     }, 1000);
//   };

//   return (
//     <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
//       {/* Hide default header if using Expo Router's stack */}
//       <Stack.Screen options={{ headerShown: false }} />

//       <ScrollView 
//         style={[styles.container, { backgroundColor: colors.bg }]} 
//         contentContainerStyle={styles.contentContainer}
//       >
        
       

//         <View style={styles.header}>
//           <Text style={[styles.title, { color: colors.text, fontSize: 28 * scale }]}>
//             Welcome Back
//           </Text>
//         </View>

//         <View style={styles.form}>
//           {/* EMAIL INPUT */}
//           <View style={styles.fieldContainer}>
//               <Text style={[styles.label, { color: colors.text, fontSize: 14 * scale }]}>
//                 Email
//               </Text>
//               <TextInput 
//                 style={[
//                   styles.input, 
//                   { 
//                     backgroundColor: colors.inputBg, 
//                     borderColor: colors.border, 
//                     color: colors.text,
//                     fontSize: 16 * scale
//                   }
//                 ]} 
//                 value={email}
//                 onChangeText={setEmail}
//                 placeholder="email@example.com" 
//                 placeholderTextColor={colors.placeholder}
//                 autoCapitalize="none"
//               />
//           </View>

//           {/* PASSWORD INPUT */}
//           <View style={styles.fieldContainer}>
//               <Text style={[styles.label, { color: colors.text, fontSize: 14 * scale }]}>
//                 Password
//               </Text>
//               <TextInput 
//                 style={[
//                   styles.input, 
//                   { 
//                     backgroundColor: colors.inputBg, 
//                     borderColor: colors.border, 
//                     color: colors.text,
//                     fontSize: 16 * scale
//                   }
//                 ]} 
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry
//                 placeholder="******" 
//                 placeholderTextColor={colors.placeholder}
//               />
//           </View>

//           {/* SUBMIT BUTTON */}
//           <TouchableOpacity 
//             style={[styles.submitButton, { backgroundColor: colors.button }]} 
//             onPress={handleLogin}
//           >
//              {isLoading ? (
//                <ActivityIndicator color={colors.buttonText} />
//              ) : (
//                <Text style={[styles.submitButtonText, { color: colors.buttonText, fontSize: 16 * scale }]}>
//                  Sign In
//                </Text>
//              )}
//           </TouchableOpacity>

//           {/* LINK TO SIGNUP */}
//           <View style={styles.registerContainer}>
//               <Text style={{ color: colors.text, fontSize: 14 * scale }}>
//                 Don't have an account?{' '}
//               </Text>
//               <Link href="/auth/signup" asChild>
//                   <TouchableOpacity>
//                       <Text style={[styles.registerLink, { color: colors.text, fontSize: 14 * scale }]}>
//                         Sign up here
//                       </Text>
//                   </TouchableOpacity>
//               </Link>
//           </View>
//         </View>

//         {/* GUEST LINK */}
//         <View>
//           <Link href="/dashboard" asChild>
//               <TouchableOpacity>
//                   <Text style={[styles.continueAsGuest, { color: colors.text, fontSize: 14 * scale }]}>
//                     Continue as Guest
//                   </Text>
//               </TouchableOpacity>
//             </Link>
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//   },
//   container: { 
//     flex: 1, 
//   },
//   contentContainer: { 
//     padding: 24, 
//     justifyContent: 'center', 
//     flexGrow: 1 
//   },
//   settingsContainer: {
//     alignItems: 'flex-end',
//     marginBottom: 10,
//   },
//   header: { 
//     marginBottom: 32, 
//     alignItems: 'center' 
//   },
//   title: { 
//     fontWeight: 'bold' 
//   },
//   form: { 
//     width: '100%' 
//   },
//   fieldContainer: { 
//     marginBottom: 16 
//   },
//   label: { 
//     marginBottom: 8, 
//     fontWeight: '500' 
//   },
//   input: { 
//     borderWidth: 1, 
//     borderRadius: 8, 
//     padding: 12, 
//   },
//   submitButton: { 
//     padding: 16, 
//     borderRadius: 8, 
//     alignItems: 'center', 
//     marginTop: 16 
//   },
//   submitButtonText: { 
//     fontWeight: 'bold', 
//   },
//   registerContainer: { 
//     flexDirection: 'row', 
//     justifyContent: 'center', 
//     marginTop: 24 
//   },
//   registerLink: { 
//     fontWeight: 'bold', 
//     textDecorationLine: 'underline' 
//   },
//   continueAsGuest: { 
//     marginTop: 16, 
//     alignItems: 'center', 
//     textAlign: 'center', 
//     textDecorationLine: 'underline' 
//   },
// });
import { useAuth } from '@/Context/AuthContext'; // Adjust path if needed
import { Link, Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image, // <--- 1. ADDED IMAGE IMPORT
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// 1. IMPORT THEME HOOK
// Ensure this path matches where you created the file (e.g., '@/context/ThemeContext')
import { useTheme } from '@/Context/ThemeContext';

export default function Login() {
  const router = useRouter();
  const { setUser } = useAuth();
  
  // 2. CONSUME GLOBAL THEME STATE
  const { darkMode, getFontSizeMultiplier } = useTheme();
  
  // 3. CALCULATE DYNAMIC STYLES
  const scale = getFontSizeMultiplier();
  const colors = {
    bg: darkMode ? '#000000' : '#FFFFFF',
    text: darkMode ? '#FFFFFF' : '#000000',
    inputBg: darkMode ? '#1C1C1E' : '#FFFFFF', // Dark gray for inputs in dark mode
    border: darkMode ? '#333333' : '#ccc',
    placeholder: darkMode ? '#666' : '#999',
    button: darkMode ? '#FFF' : '#000',
    buttonText: darkMode ? '#000' : '#FFF',
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    // ... Perform your API fetch here ...
    
    setTimeout(() => {
        setIsLoading(false);
        console.log("Login Success");
        router.replace('/dashboard'); 
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      {/* Hide default header if using Expo Router's stack */}
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView 
        style={[styles.container, { backgroundColor: colors.bg }]} 
        contentContainerStyle={styles.contentContainer}
      >
        
        {/* HEADER WITH LOGO AND TITLE */}
        <View style={styles.header}>
          {/* 2. ADDED LOGO IMAGE HERE */}
          {/* IMPORTANT: Replace the require path with the path to your actual logo asset */}
          <Image 
            source={require('@/assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.text, fontSize: 28 * scale }]}>
            Welcome Back
          </Text>
        </View>

        <View style={styles.form}>
          {/* EMAIL INPUT */}
          <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: colors.text, fontSize: 14 * scale }]}>
                Email
              </Text>
              <TextInput 
                style={[
                  styles.input, 
                  { 
                    backgroundColor: colors.inputBg, 
                    borderColor: colors.border, 
                    color: colors.text,
                    fontSize: 16 * scale
                  }
                ]} 
                value={email}
                onChangeText={setEmail}
                placeholder="email@example.com" 
                placeholderTextColor={colors.placeholder}
                autoCapitalize="none"
              />
          </View>

          {/* PASSWORD INPUT */}
          <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: colors.text, fontSize: 14 * scale }]}>
                Password
              </Text>
              <TextInput 
                style={[
                  styles.input, 
                  { 
                    backgroundColor: colors.inputBg, 
                    borderColor: colors.border, 
                    color: colors.text,
                    fontSize: 16 * scale
                  }
                ]} 
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="******" 
                placeholderTextColor={colors.placeholder}
              />
          </View>

          {/* SUBMIT BUTTON */}
          <TouchableOpacity 
            style={[styles.submitButton, { backgroundColor: colors.button }]} 
            onPress={handleLogin}
          >
             {isLoading ? (
               <ActivityIndicator color={colors.buttonText} />
             ) : (
               <Text style={[styles.submitButtonText, { color: colors.buttonText, fontSize: 16 * scale }]}>
                 Sign In
               </Text>
             )}
          </TouchableOpacity>

          {/* LINK TO SIGNUP */}
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

        {/* GUEST LINK */}
        <View>
          <Link href="/dashboard" asChild>
              <TouchableOpacity>
                  <Text style={[styles.continueAsGuest, { color: colors.text, fontSize: 14 * scale }]}>
                    Continue as Guest
                  </Text>
              </TouchableOpacity>
            </Link>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: { 
    flex: 1, 
  },
  contentContainer: { 
    padding: 24, 
    justifyContent: 'center', 
    flexGrow: 1 
  },
  settingsContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  header: { 
    marginBottom: 32, 
    alignItems: 'center' 
  },
  // 3. ADDED LOGO STYLE
  logo: {
    width: 180,
    height: 130,
    marginBottom: 20, // Adds space between logo and text
  },
  title: { 
    fontWeight: 'bold' 
  },
  form: { 
    width: '100%' 
  },
  fieldContainer: { 
    marginBottom: 16 
  },
  label: { 
    marginBottom: 8, 
    fontWeight: '500' 
  },
  input: { 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 12, 
  },
  submitButton: { 
    padding: 16, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 16 
  },
  submitButtonText: { 
    fontWeight: 'bold', 
  },
  registerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 24 
  },
  registerLink: { 
    fontWeight: 'bold', 
    textDecorationLine: 'underline' 
  },
  continueAsGuest: { 
    marginTop: 16, 
    alignItems: 'center', 
    textAlign: 'center', 
    textDecorationLine: 'underline' 
  },
});