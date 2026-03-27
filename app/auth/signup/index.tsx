// import { useAuth } from '@/Context/AuthContext';
// import { Ionicons } from '@expo/vector-icons'; // or react-native-vector-icons
// import { useNavigation } from '@react-navigation/native';
// import { router } from 'expo-router';
// import React, { useState } from 'react';
// import {
//     ActivityIndicator,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View
// } from 'react-native';

// interface RegisterFormData {
//   firstName: string;
//   lastName: string;
//   role: string;
//   email: string;
//   phone: string;
//   password: string;
//   confirmPassword: string;
// }

// interface SignupResponse {
//   message: string;
// }

// const Register: React.FC = () => {
//   const navigation = useNavigation();
//   const { signUp } = useAuth();
//   const [formData, setFormData] = useState<RegisterFormData>({
//     firstName: '',
//     lastName: '',
//     role: 'user',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
//   const [apiError, setApiError] = useState<string>('');
//   const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

//   const handleInputChange = (name: keyof RegisterFormData, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: '',
//       }));
//     }
//     if (apiError) {
//       setApiError('');
//     }
//   };

//   const validateForm = (): boolean => {
//     const newErrors: Partial<RegisterFormData> = {};

//     if (!formData.firstName.trim()) {
//       newErrors.firstName = 'First name is required';
//     }

//     if (!formData.lastName.trim()) {
//       newErrors.lastName = 'Last name is required';
//     }

//     if (!formData.role.trim()) {
//       newErrors.role = 'Role is required';
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Phone number is required';
//     } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
//       newErrors.phone = 'Please enter a valid phone number';
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 8) {
//       newErrors.password = 'Password must be at least 8 characters';
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
//       newErrors.password =
//         'Password must contain at least one uppercase letter, one lowercase letter, and one number';
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your password';
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

// //     if (!acceptTerms) {
// //       setApiError('Please accept the terms and conditions');
// //       return;
// //     }

//     setIsLoading(true);
//     setApiError('');

//     try {
//       const { confirmPassword, ...registrationData } = formData;
//       // Use AuthContext signUp which integrates with Firebase
//       await signUp({
//         firstName: registrationData.firstName,
//         lastName: registrationData.lastName,
//         email: registrationData.email,
//         phone: registrationData.phone,
//         password: registrationData.password,
//       });

//       // After successful signup the auth listener will update context
//       router.replace('/dashboard');
//     } catch (error) {
//       console.error('Registration error:', error);
//       setApiError(
//         error instanceof Error ? error.message : 'Registration failed. Please try again.'
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Create Account</Text>
//         <Text style={styles.subtitle}>Join us today and get started</Text>
//       </View>

//       {/* API Error Display */}
//       {apiError ? (
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>{apiError}</Text>
//         </View>
//       ) : null}

//       <View style={styles.form}>
//         {/* Name Fields */}
//         <View style={styles.rowContainer}>
//           <View style={styles.halfWidth}>
//             <Text style={styles.label}>First Name</Text>
//             <View style={[styles.inputContainer, errors.firstName && styles.inputError]}>
//               <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.icon} />
//               <TextInput
//                 value={formData.firstName}
//                 onChangeText={(text) => handleInputChange('firstName', text)}
//                 style={styles.input}
//                 placeholder="First name"
//                 placeholderTextColor="#9CA3AF"
//                 editable={!isLoading}
//               />
//             </View>
//             {errors.firstName ? (
//               <Text style={styles.fieldError}>{errors.firstName}</Text>
//             ) : null}
//           </View>

//           <View style={styles.halfWidth}>
//             <Text style={styles.label}>Last Name</Text>
//             <View style={[styles.inputContainer, errors.lastName && styles.inputError]}>
//               <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.icon} />
//               <TextInput
//                 value={formData.lastName}
//                 onChangeText={(text) => handleInputChange('lastName', text)}
//                 style={styles.input}
//                 placeholder="Last name"
//                 placeholderTextColor="#9CA3AF"
//                 editable={!isLoading}
//               />
//             </View>
//             {errors.lastName ? (
//               <Text style={styles.fieldError}>{errors.lastName}</Text>
//             ) : null}
//           </View>
//         </View>

//         {/* Email Field */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Email Address</Text>
//           <View style={[styles.inputContainer, errors.email && styles.inputError]}>
//             <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.icon} />
//             <TextInput
//               value={formData.email}
//               onChangeText={(text) => handleInputChange('email', text)}
//               style={styles.input}
//               placeholder="Enter your email"
//               placeholderTextColor="#9CA3AF"
//               keyboardType="email-address"
//               autoCapitalize="none"
//               editable={!isLoading}
//             />
//           </View>
//           {errors.email ? <Text style={styles.fieldError}>{errors.email}</Text> : null}
//         </View>

//         {/* Phone Field */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Phone Number</Text>
//           <View style={[styles.inputContainer, errors.phone && styles.inputError]}>
//             <Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.icon} />
//             <TextInput
//               value={formData.phone}
//               onChangeText={(text) => handleInputChange('phone', text)}
//               style={styles.input}
//               placeholder="Enter your phone number"
//               placeholderTextColor="#9CA3AF"
//               keyboardType="phone-pad"
//               editable={!isLoading}
//             />
//           </View>
//           {errors.phone ? <Text style={styles.fieldError}>{errors.phone}</Text> : null}
//         </View>

//         {/* Password Field */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Password</Text>
//           <View style={[styles.inputContainer, errors.password && styles.inputError]}>
//             <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.icon} />
//             <TextInput
//               value={formData.password}
//               onChangeText={(text) => handleInputChange('password', text)}
//               style={[styles.input, styles.inputWithButton]}
//               placeholder="Create a password"
//               placeholderTextColor="#9CA3AF"
//               secureTextEntry={!showPassword}
//               editable={!isLoading}
//             />
//             <TouchableOpacity
//               onPress={() => setShowPassword(!showPassword)}
//               style={styles.eyeButton}
//               disabled={isLoading}
//             >
//               <Ionicons
//                 name={showPassword ? 'eye-off-outline' : 'eye-outline'}
//                 size={20}
//                 color="#9CA3AF"
//               />
//             </TouchableOpacity>
//           </View>
//           {errors.password ? <Text style={styles.fieldError}>{errors.password}</Text> : null}
//         </View>

//         {/* Confirm Password Field */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Confirm Password</Text>
//           <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
//             <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.icon} />
//             <TextInput
//               value={formData.confirmPassword}
//               onChangeText={(text) => handleInputChange('confirmPassword', text)}
//               style={[styles.input, styles.inputWithButton]}
//               placeholder="Confirm your password"
//               placeholderTextColor="#9CA3AF"
//               secureTextEntry={!showConfirmPassword}
//               editable={!isLoading}
//             />
//             <TouchableOpacity
//               onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//               style={styles.eyeButton}
//               disabled={isLoading}
//             >
//               <Ionicons
//                 name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
//                 size={20}
//                 color="#9CA3AF"
//               />
//             </TouchableOpacity>
//           </View>
//           {errors.confirmPassword ? (
//             <Text style={styles.fieldError}>{errors.confirmPassword}</Text>
//           ) : null}
//         </View>

//         {/* Terms and Conditions */}
//         <TouchableOpacity
//           style={styles.checkboxContainer}
//           onPress={() => setAcceptTerms(!acceptTerms)}
//           disabled={isLoading}
//         >
//           <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
//             {acceptTerms && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
//           </View>
//           <Text style={styles.checkboxLabel}>
//             I agree to the{' '}
//             <Text style={styles.link}>Terms of Service</Text> and{' '}
//             <Text style={styles.link}>Privacy Policy</Text>
//           </Text>
//         </TouchableOpacity>

//         {/* Submit Button */}
//         <TouchableOpacity
//           style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
//           onPress={handleSubmit}
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator color="#FFFFFF" size="small" />
//               <Text style={styles.submitButtonText}>Creating account...</Text>
//             </View>
//           ) : (
//             <Text style={styles.submitButtonText}>Create Account</Text>
//           )}
//         </TouchableOpacity>

//         {/* Login Link */}
//         <View style={styles.loginContainer}>
//           <Text style={styles.loginText}>Already have an account? </Text>
//           <TouchableOpacity onPress={() => router.push('/auth/login')}>
//           <Text style={styles.loginLink}>Sign in here</Text>
//         </TouchableOpacity>
//         </View>
//       </View>

//       {/* Divider */}
//       <View style={styles.dividerContainer}>
//       </View>

//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   contentContainer: {
//     paddingHorizontal: 24,
//     paddingVertical: 40,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#000000',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#6B7280',
//   },
//   errorContainer: {
//     backgroundColor: '#FEF2F2',
//     borderWidth: 1,
//     borderColor: '#FECACA',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//   },
//   errorText: {
//     fontSize: 14,
//     color: '#DC2626',
//   },
//   form: {
//     width: '100%',
//   },
//   fieldContainer: {
//     marginBottom: 16,
//   },
//   rowContainer: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 16,
//   },
//   halfWidth: {
//     flex: 1,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#000000',
//     marginBottom: 8,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#D1D5DB',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     backgroundColor: '#FFFFFF',
//   },
//   inputError: {
//     borderColor: '#EF4444',
//   },
//   icon: {
//     marginRight: 8,
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: '#000000',
//   },
//   inputWithButton: {
//     paddingRight: 40,
//   },
//   eyeButton: {
//     position: 'absolute',
//     right: 12,
//     padding: 4,
//   },
//   fieldError: {
//     fontSize: 12,
//     color: '#EF4444',
//     marginTop: 4,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 24,
//   },
//   checkbox: {
//     width: 20,
//     height: 20,
//     borderWidth: 2,
//     borderColor: '#D1D5DB',
//     borderRadius: 4,
//     marginRight: 8,
//     marginTop: 2,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   checkboxChecked: {
//     backgroundColor: '#000000',
//     borderColor: '#000000',
//   },
//   checkboxLabel: {
//     flex: 1,
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   link: {
//     color: '#000000',
//     fontWeight: '500',
//   },
//   submitButton: {
//     backgroundColor: '#000000',
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 16,
//   },
//   submitButtonDisabled: {
//     opacity: 0.5,
//   },
//   submitButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   loadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   loginContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loginText: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   loginLink: {
//     fontSize: 14,
//     color: '#000000',
//     fontWeight: '500',
//   },
//   dividerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 24,
//   },
//   divider: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#D1D5DB',
//   },
//   dividerText: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginHorizontal: 8,
//   },
//   socialButtonsContainer: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 24,
//   },
//   socialButton: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 8,
//     paddingVertical: 10,
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//   },
//   socialButtonText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#6B7280',
//   },
// });

// export default Register;

import { useAuth } from '@/Context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// --- 1. COUNTRY DATA CONFIGURATION ---
const COUNTRIES = [
  { code: 'US', dial_code: '+1',  limit: 10, flag: '🇺🇸', name: 'United States' },
  { code: 'PK', dial_code: '+92', limit: 10, flag: '🇵🇰', name: 'Pakistan' },
  { code: 'UK', dial_code: '+44', limit: 10, flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'CA', dial_code: '+1',  limit: 10, flag: '🇨🇦', name: 'Canada' },
  { code: 'AU', dial_code: '+61', limit: 9,  flag: '🇦🇺', name: 'Australia' },
];

interface RegisterFormData {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string; 
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { signUp } = useAuth();
  
  // 2. STATE FOR COUNTRY SELECTION
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // Default US
  const [isCountryPickerVisible, setCountryPickerVisible] = useState(false);

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    role: 'user',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [apiError, setApiError] = useState<string>('');
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

  const handleInputChange = (name: keyof RegisterFormData, value: string) => {
    // Special handling for Phone to only allow numbers
    if (name === 'phone') {
        const numericValue = value.replace(/[^0-9]/g, ''); // Strip non-numbers
        setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    setApiError(''); 

    // --- Real-time Validation ---
    let fieldError = '';

    // Name Validation
    if (name === 'firstName' || name === 'lastName') {
      const nameRegex = /^[a-zA-Z\s\-]*$/; 
      if (!nameRegex.test(value)) {
        fieldError = 'Only letters allowed';
      }
    }

    // Email Validation
    if (name === 'email') {
      const forbiddenCharRegex = /[^a-zA-Z0-9@._\-\+]/; 
      if (forbiddenCharRegex.test(value)) {
        fieldError = 'Email contains invalid characters';
      }
    }

    // 3. PHONE VALIDATION (Dynamic based on selected country)
    if (name === 'phone') {
        // Remove non-digits just in case
        const cleanNumber = value.replace(/[^0-9]/g, '');
        
        // Check strict length
        if (cleanNumber.length > 0 && cleanNumber.length !== selectedCountry.limit) {
            // We only show error if they are done typing (approximated here) 
            // or if we want strict feedback:
            if (cleanNumber.length > selectedCountry.limit) {
                 fieldError = `Max ${selectedCountry.limit} digits allowed`;
            }
        }
    }

    setErrors(prev => ({ ...prev, [name]: fieldError }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    else if (!/^[a-zA-Z\s\-]+$/.test(formData.firstName)) newErrors.firstName = 'Only letters allowed';

    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    else if (!/^[a-zA-Z\s\-]+$/.test(formData.lastName)) newErrors.lastName = 'Only letters allowed';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';

    // 4. STRICT PHONE VALIDATION
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.length !== selectedCountry.limit) {
      newErrors.phone = `Phone number must be exactly ${selectedCountry.limit} digits for ${selectedCountry.code}`;
    }

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Min 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) newErrors.password = 'Must have 1 uppercase, 1 lowercase, 1 number';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!acceptTerms) {
       setApiError('Please accept the terms and conditions');
       return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      // 5. COMBINE CODE AND NUMBER
      const fullPhoneNumber = `${selectedCountry.dial_code}${formData.phone}`;

      const { confirmPassword, ...registrationData } = formData;
      await signUp({
        ...registrationData,
        phone: fullPhoneNumber, // Send the combined E.164 number
      });

      router.replace('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setApiError(error instanceof Error ? error.message : 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to render country item in modal
  const renderCountryItem = ({ item }: { item: typeof COUNTRIES[0] }) => (
    <TouchableOpacity 
      style={styles.countryItem} 
      onPress={() => {
        setSelectedCountry(item);
        setCountryPickerVisible(false);
        // Clear phone error when country changes
        setErrors(prev => ({ ...prev, phone: '' }));
        // Optional: truncate phone if existing number is too long for new country
        if (formData.phone.length > item.limit) {
            handleInputChange('phone', formData.phone.substring(0, item.limit));
        }
      }}
    >
      <Text style={styles.countryFlag}>{item.flag}</Text>
      <Text style={styles.countryName}>{item.name} ({item.dial_code})</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us today and get started</Text>
        </View>

        {apiError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{apiError}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          {/* Name Fields */}
          <View style={styles.rowContainer}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>First Name <Text style={styles.asterisk}>*</Text></Text>
              <View style={[styles.inputContainer, errors.firstName ? styles.inputError : null]}>
                <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.icon} />
                <TextInput
                  value={formData.firstName}
                  onChangeText={(text) => handleInputChange('firstName', text)}
                  style={styles.input}
                  placeholder="First name"
                  placeholderTextColor="#9CA3AF"
                  editable={!isLoading}
                />
              </View>
              {errors.firstName && <Text style={styles.fieldError}>{errors.firstName}</Text>}
            </View>

            <View style={styles.halfWidth}>
              <Text style={styles.label}>Last Name <Text style={styles.asterisk}>*</Text></Text>
              <View style={[styles.inputContainer, errors.lastName ? styles.inputError : null]}>
                <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.icon} />
                <TextInput
                  value={formData.lastName}
                  onChangeText={(text) => handleInputChange('lastName', text)}
                  style={styles.input}
                  placeholder="Last name"
                  placeholderTextColor="#9CA3AF"
                  editable={!isLoading}
                />
              </View>
              {errors.lastName && <Text style={styles.fieldError}>{errors.lastName}</Text>}
            </View>
          </View>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email Address <Text style={styles.asterisk}>*</Text></Text>
            <View style={[styles.inputContainer, errors.email ? styles.inputError : null]}>
              <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.icon} />
              <TextInput
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
            {errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}
          </View>

          {/* 6. MODIFIED PHONE FIELD WITH DROPDOWN */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Phone Number <Text style={styles.asterisk}>*</Text></Text>
            
            <View style={[styles.phoneRowContainer, errors.phone ? styles.inputError : null]}>
                {/* Country Code Selector */}
                <TouchableOpacity 
                    style={styles.countryCodeSelector}
                    onPress={() => setCountryPickerVisible(true)}
                    disabled={isLoading}
                >
                    <Text style={styles.flagText}>{selectedCountry.flag}</Text>
                    <Text style={styles.dialCodeText}>{selectedCountry.dial_code}</Text>
                    <Ionicons name="chevron-down" size={12} color="#000" />
                </TouchableOpacity>

                <View style={styles.verticalDivider} />

                {/* Input Field */}
                <TextInput
                    value={formData.phone}
                    onChangeText={(text) => handleInputChange('phone', text)}
                    style={styles.phoneInput}
                    placeholder={`123456789 (Max ${selectedCountry.limit})`}
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    editable={!isLoading}
                    maxLength={selectedCountry.limit} // 7. ENFORCE FIXED LENGTH
                />
            </View>
            {errors.phone && <Text style={styles.fieldError}>{errors.phone}</Text>}
          </View>

          {/* Password Fields */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Password <Text style={styles.asterisk}>*</Text></Text>
            <View style={[styles.inputContainer, errors.password ? styles.inputError : null]}>
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.icon} />
              <TextInput
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                style={[styles.input, styles.inputWithButton]}
                placeholder="Create password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.fieldError}>{errors.password}</Text>}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Confirm Password <Text style={styles.asterisk}>*</Text></Text>
            <View style={[styles.inputContainer, errors.confirmPassword ? styles.inputError : null]}>
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.icon} />
              <TextInput
                value={formData.confirmPassword}
                onChangeText={(text) => handleInputChange('confirmPassword', text)}
                style={[styles.input, styles.inputWithButton]}
                placeholder="Confirm password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
                <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.fieldError}>{errors.confirmPassword}</Text>}
          </View>

          {/* Terms */}
          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAcceptTerms(!acceptTerms)}>
            <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
              {acceptTerms && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </View>
            <Text style={styles.checkboxLabel}>
              I agree to the <Text style={styles.link}>Terms</Text> and <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.submitButtonText}>Creating...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.loginLink}>Sign in here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 8. COUNTRY PICKER MODAL */}
      <Modal
        visible={isCountryPickerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCountryPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select Country</Text>
                    <TouchableOpacity onPress={() => setCountryPickerVisible(false)}>
                        <Ionicons name="close" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={COUNTRIES}
                    keyExtractor={(item) => item.code}
                    renderItem={renderCountryItem}
                />
            </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  contentContainer: { paddingHorizontal: 24, paddingVertical: 40, flexGrow: 1 },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000000', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280' },
  errorContainer: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 8, padding: 12, marginBottom: 16 },
  errorText: { fontSize: 14, color: '#DC2626' },
  form: { width: '100%' },
  fieldContainer: { marginBottom: 16 },
  rowContainer: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  halfWidth: { flex: 1 },
  label: { fontSize: 14, fontWeight: '500', color: '#000000', marginBottom: 8 },
  asterisk: { color: '#EF4444', fontWeight: 'bold' },
  
  // Standard Inputs
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#FFFFFF' },
  inputError: { borderColor: '#EF4444' },
  icon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#000000' },
  inputWithButton: { paddingRight: 40 },
  eyeButton: { position: 'absolute', right: 12, padding: 4 },
  fieldError: { fontSize: 12, color: '#EF4444', marginTop: 4 },

  // Phone Specific Styles
  phoneRowContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#D1D5DB', borderRadius: 8, backgroundColor: '#FFFFFF', overflow: 'hidden' },
  countryCodeSelector: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#F3F4F6' },
  flagText: { fontSize: 20, marginRight: 6 },
  dialCodeText: { fontSize: 16, fontWeight: '500', marginRight: 4 },
  verticalDivider: { width: 1, height: '100%', backgroundColor: '#D1D5DB' },
  phoneInput: { flex: 1, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, color: '#000000' },

  // Checkbox & Buttons
  checkboxContainer: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24 },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: '#D1D5DB', borderRadius: 4, marginRight: 8, marginTop: 2, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#000000', borderColor: '#000000' },
  checkboxLabel: { flex: 1, fontSize: 14, color: '#6B7280' },
  link: { color: '#000000', fontWeight: '500' },
  submitButton: { backgroundColor: '#000000', borderRadius: 8, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '500' },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText: { fontSize: 14, color: '#6B7280' },
  loginLink: { fontSize: 14, color: '#000000', fontWeight: '500' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '50%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  countryItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  countryFlag: { fontSize: 24, marginRight: 16 },
  countryName: { fontSize: 16, color: '#000' },
});

export default Register;
// import { useAuth } from '@/Context/AuthContext';
// import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import React, { useState } from 'react';
// import {
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';

// interface RegisterFormData {
//   firstName: string;
//   lastName: string;
//   role: string;
//   email: string;
//   phone: string;
//   password: string;
//   confirmPassword: string;
// }

// const Register: React.FC = () => {
//   const { signUp } = useAuth();
  
//   const [formData, setFormData] = useState<RegisterFormData>({
//     firstName: '',
//     lastName: '',
//     role: 'user',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
//   const [apiError, setApiError] = useState<string>('');
//   const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

//   const handleInputChange = (name: keyof RegisterFormData, value: string) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setApiError(''); 

//     // --- Real-time Validation Logic ---
//     let fieldError = '';

//     // 1. Name Validation (Letters only)
//     if (name === 'firstName' || name === 'lastName') {
//       const nameRegex = /^[a-zA-Z\s\-]*$/; 
//       if (!nameRegex.test(value)) {
//         fieldError = 'Only letters allowed';
//       }
//     }

//     // 2. Email Validation (Forbidden chars)
//     if (name === 'email') {
//       const forbiddenCharRegex = /[^a-zA-Z0-9@._\-\+]/; 
//       if (forbiddenCharRegex.test(value)) {
//         fieldError = 'Email contains invalid characters (e.g. spaces)';
//       }
//     }

//     // 3. Phone Validation (Numbers, +, -, space only)
//     if (name === 'phone') {
//         // Allow leading +, followed by digits, spaces, or hyphens
//         const phoneRegex = /^[+]?[\d\s-]*$/;
//         if (!phoneRegex.test(value)) {
//             fieldError = 'Invalid phone format (digits only)';
//         }
//     }

//     setErrors(prev => ({
//       ...prev,
//       [name]: fieldError 
//     }));
//   };

//   const validateForm = (): boolean => {
//     const newErrors: Partial<RegisterFormData> = {};

//     // First Name
//     if (!formData.firstName.trim()) {
//       newErrors.firstName = 'First name is required';
//     } else if (!/^[a-zA-Z\s\-]+$/.test(formData.firstName)) {
//       newErrors.firstName = 'Only letters allowed';
//     }

//     // Last Name
//     if (!formData.lastName.trim()) {
//       newErrors.lastName = 'Last name is required';
//     } else if (!/^[a-zA-Z\s\-]+$/.test(formData.lastName)) {
//       newErrors.lastName = 'Only letters allowed';
//     }

//     // Email
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     // Phone
//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Phone number is required';
//     } else if (!/^[+]?[\d\s-]{10,15}$/.test(formData.phone)) {
//         // Enforce min 10 and max 15 digits roughly
//         newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
//     }

//     // Password
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 8) {
//       newErrors.password = 'Password must be at least 8 characters';
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
//       newErrors.password = 'Password must have 1 uppercase, 1 lowercase, 1 number';
//     }

//     // Confirm Password
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your password';
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;
    
//     if (!acceptTerms) {
//        setApiError('Please accept the terms and conditions');
//        return;
//     }

//     setIsLoading(true);
//     setApiError('');

//     try {
//       const { confirmPassword, ...registrationData } = formData;
//       await signUp({
//         firstName: registrationData.firstName,
//         lastName: registrationData.lastName,
//         email: registrationData.email,
//         phone: registrationData.phone,
//         password: registrationData.password,
//       });

//       router.replace('/dashboard');
//     } catch (error) {
//       console.error('Registration error:', error);
//       setApiError(
//         error instanceof Error ? error.message : 'Registration failed. Please try again.'
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView 
//       style={styles.container} 
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <ScrollView contentContainerStyle={styles.contentContainer}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Create Account</Text>
//           <Text style={styles.subtitle}>Join us today and get started</Text>
//         </View>

//         {apiError ? (
//           <View style={styles.errorContainer}>
//             <Text style={styles.errorText}>{apiError}</Text>
//           </View>
//         ) : null}

//         <View style={styles.form}>
//           {/* Name Fields */}
//           <View style={styles.rowContainer}>
//             <View style={styles.halfWidth}>
//               <Text style={styles.label}>
//                 First Name <Text style={styles.asterisk}>*</Text>
//               </Text>
//               <View style={[styles.inputContainer, errors.firstName ? styles.inputError : null]}>
//                 <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.icon} />
//                 <TextInput
//                   value={formData.firstName}
//                   onChangeText={(text) => handleInputChange('firstName', text)}
//                   style={styles.input}
//                   placeholder="First name"
//                   placeholderTextColor="#9CA3AF"
//                   editable={!isLoading}
//                 />
//               </View>
//               {errors.firstName ? (
//                 <Text style={styles.fieldError}>{errors.firstName}</Text>
//               ) : null}
//             </View>

//             <View style={styles.halfWidth}>
//               <Text style={styles.label}>
//                 Last Name <Text style={styles.asterisk}>*</Text>
//               </Text>
//               <View style={[styles.inputContainer, errors.lastName ? styles.inputError : null]}>
//                 <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.icon} />
//                 <TextInput
//                   value={formData.lastName}
//                   onChangeText={(text) => handleInputChange('lastName', text)}
//                   style={styles.input}
//                   placeholder="Last name"
//                   placeholderTextColor="#9CA3AF"
//                   editable={!isLoading}
//                 />
//               </View>
//               {errors.lastName ? (
//                 <Text style={styles.fieldError}>{errors.lastName}</Text>
//               ) : null}
//             </View>
//           </View>

//           {/* Email Field */}
//           <View style={styles.fieldContainer}>
//             <Text style={styles.label}>
//               Email Address <Text style={styles.asterisk}>*</Text>
//             </Text>
//             <View style={[styles.inputContainer, errors.email ? styles.inputError : null]}>
//               <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.icon} />
//               <TextInput
//                 value={formData.email}
//                 onChangeText={(text) => handleInputChange('email', text)}
//                 style={styles.input}
//                 placeholder="Enter your email"
//                 placeholderTextColor="#9CA3AF"
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 editable={!isLoading}
//               />
//             </View>
//             {errors.email ? <Text style={styles.fieldError}>{errors.email}</Text> : null}
//           </View>

//           {/* Phone Field */}
//           <View style={styles.fieldContainer}>
//             <Text style={styles.label}>
//               Phone Number <Text style={styles.asterisk}>*</Text>
//             </Text>
//             <View style={[styles.inputContainer, errors.phone ? styles.inputError : null]}>
//               <Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.icon} />
//               <TextInput
//                 value={formData.phone}
//                 onChangeText={(text) => handleInputChange('phone', text)}
//                 style={styles.input}
//                 placeholder="Enter your phone number"
//                 placeholderTextColor="#9CA3AF"
//                 keyboardType="phone-pad"
//                 editable={!isLoading}
//                 // 4. LIMIT INPUT LENGTH (E.164 max is 15 digits)
//                 maxLength={15} 
//               />
//             </View>
//             {errors.phone ? <Text style={styles.fieldError}>{errors.phone}</Text> : null}
//           </View>

//           {/* Password Field */}
//           <View style={styles.fieldContainer}>
//             <Text style={styles.label}>
//               Password <Text style={styles.asterisk}>*</Text>
//             </Text>
//             <View style={[styles.inputContainer, errors.password ? styles.inputError : null]}>
//               <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.icon} />
//               <TextInput
//                 value={formData.password}
//                 onChangeText={(text) => handleInputChange('password', text)}
//                 style={[styles.input, styles.inputWithButton]}
//                 placeholder="Create a password"
//                 placeholderTextColor="#9CA3AF"
//                 secureTextEntry={!showPassword}
//                 editable={!isLoading}
//               />
//               <TouchableOpacity
//                 onPress={() => setShowPassword(!showPassword)}
//                 style={styles.eyeButton}
//                 disabled={isLoading}
//               >
//                 <Ionicons
//                   name={showPassword ? 'eye-off-outline' : 'eye-outline'}
//                   size={20}
//                   color="#9CA3AF"
//                 />
//               </TouchableOpacity>
//             </View>
//             {errors.password ? <Text style={styles.fieldError}>{errors.password}</Text> : null}
//           </View>

//           {/* Confirm Password Field */}
//           <View style={styles.fieldContainer}>
//             <Text style={styles.label}>
//               Confirm Password <Text style={styles.asterisk}>*</Text>
//             </Text>
//             <View style={[styles.inputContainer, errors.confirmPassword ? styles.inputError : null]}>
//               <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.icon} />
//               <TextInput
//                 value={formData.confirmPassword}
//                 onChangeText={(text) => handleInputChange('confirmPassword', text)}
//                 style={[styles.input, styles.inputWithButton]}
//                 placeholder="Confirm your password"
//                 placeholderTextColor="#9CA3AF"
//                 secureTextEntry={!showConfirmPassword}
//                 editable={!isLoading}
//               />
//               <TouchableOpacity
//                 onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//                 style={styles.eyeButton}
//                 disabled={isLoading}
//               >
//                 <Ionicons
//                   name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
//                   size={20}
//                   color="#9CA3AF"
//                 />
//               </TouchableOpacity>
//             </View>
//             {errors.confirmPassword ? (
//               <Text style={styles.fieldError}>{errors.confirmPassword}</Text>
//             ) : null}
//           </View>

//           {/* Terms and Conditions */}
//           <TouchableOpacity
//             style={styles.checkboxContainer}
//             onPress={() => setAcceptTerms(!acceptTerms)}
//             disabled={isLoading}
//           >
//             <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
//               {acceptTerms && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
//             </View>
//             <Text style={styles.checkboxLabel}>
//               I agree to the{' '}
//               <Text style={styles.link}>Terms of Service</Text> and{' '}
//               <Text style={styles.link}>Privacy Policy</Text>
//             </Text>
//           </TouchableOpacity>

//           {/* Submit Button */}
//           <TouchableOpacity
//             style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
//             onPress={handleSubmit}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator color="#FFFFFF" size="small" />
//                 <Text style={styles.submitButtonText}>Creating account...</Text>
//               </View>
//             ) : (
//               <Text style={styles.submitButtonText}>Create Account</Text>
//             )}
//           </TouchableOpacity>

//           {/* Login Link */}
//           <View style={styles.loginContainer}>
//             <Text style={styles.loginText}>Already have an account? </Text>
//             <TouchableOpacity onPress={() => router.push('/auth/login')}>
//               <Text style={styles.loginLink}>Sign in here</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={styles.dividerContainer}></View>

//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   contentContainer: {
//     paddingHorizontal: 24,
//     paddingVertical: 40,
//     flexGrow: 1,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#000000',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#6B7280',
//   },
//   errorContainer: {
//     backgroundColor: '#FEF2F2',
//     borderWidth: 1,
//     borderColor: '#FECACA',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//   },
//   errorText: {
//     fontSize: 14,
//     color: '#DC2626',
//   },
//   form: {
//     width: '100%',
//   },
//   fieldContainer: {
//     marginBottom: 16,
//   },
//   rowContainer: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 16,
//   },
//   halfWidth: {
//     flex: 1,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#000000',
//     marginBottom: 8,
//   },
//   asterisk: {
//     color: '#EF4444', 
//     fontWeight: 'bold',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#D1D5DB',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     backgroundColor: '#FFFFFF',
//   },
//   inputError: {
//     borderColor: '#EF4444',
//   },
//   icon: {
//     marginRight: 8,
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: '#000000',
//   },
//   inputWithButton: {
//     paddingRight: 40,
//   },
//   eyeButton: {
//     position: 'absolute',
//     right: 12,
//     padding: 4,
//   },
//   fieldError: {
//     fontSize: 12,
//     color: '#EF4444',
//     marginTop: 4,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 24,
//   },
//   checkbox: {
//     width: 20,
//     height: 20,
//     borderWidth: 2,
//     borderColor: '#D1D5DB',
//     borderRadius: 4,
//     marginRight: 8,
//     marginTop: 2,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   checkboxChecked: {
//     backgroundColor: '#000000',
//     borderColor: '#000000',
//   },
//   checkboxLabel: {
//     flex: 1,
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   link: {
//     color: '#000000',
//     fontWeight: '500',
//   },
//   submitButton: {
//     backgroundColor: '#000000',
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 16,
//   },
//   submitButtonDisabled: {
//     opacity: 0.5,
//   },
//   submitButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   loadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   loginContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loginText: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   loginLink: {
//     fontSize: 14,
//     color: '#000000',
//     fontWeight: '500',
//   },
//   dividerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 24,
//   },
// });

// export default Register;