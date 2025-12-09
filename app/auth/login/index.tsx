import { useAuth } from '@/Context/AuthContext';
import { Link, Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Ensure this path matches your project structure
import { useTheme } from '@/Context/ThemeContext';

export default function Login() {
  const router = useRouter();
  
  // 1. GET AUTH FUNCTIONS
  const { setUser, loginAsGuest } = useAuth();
  
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
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate API Fetch
    setTimeout(() => {
        setIsLoading(false);
        // MOCK LOGIN: Replace this with your actual API response mapping
        setUser({
            firstName: 'Alex',
            lastName: 'Doe',
            email: email,
            role: 'user',
            isGuest: false // Important: Real user
        });
        console.log("Login Success");
        router.replace('/dashboard'); 
    }, 1000);
  };

  // 2. NEW GUEST HANDLER
  const handleGuestLogin = () => {
    loginAsGuest(); // Sets global state to { isGuest: true, ... }
    router.replace('/dashboard');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView 
        style={[styles.container, { backgroundColor: colors.bg }]} 
        contentContainerStyle={styles.contentContainer}
      >
        
        {/* HEADER */}
        <View style={styles.header}>
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

          {/* PASSWORD */}
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

          {/* SUBMIT */}
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

          {/* SIGNUP LINK */}
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

        {/* 3. UPDATED GUEST BUTTON */}
        <View style={{ marginTop: 16 }}>
             <TouchableOpacity onPress={handleGuestLogin}>
                 <Text style={[styles.continueAsGuest, { color: colors.text, fontSize: 14 * scale }]}>
                   Continue as Guest
                 </Text>
             </TouchableOpacity>
        </View>

      </ScrollView>
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
  submitButton: { padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  submitButtonText: { fontWeight: 'bold' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  registerLink: { fontWeight: 'bold', textDecorationLine: 'underline' },
  continueAsGuest: { marginTop: 16, alignItems: 'center', textAlign: 'center', textDecorationLine: 'underline' },
});