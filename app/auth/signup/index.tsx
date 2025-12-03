// "use client";

// import React, { useState } from 'react';
// import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

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
//   const router = useRouter();
//   const [formData, setFormData] = useState<RegisterFormData>({
//     firstName: '',
//     lastName: '',
//     role: 'user',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
//   const [apiError, setApiError] = useState<string>('');
//   const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear error when user starts typing
//     if (errors[name as keyof RegisterFormData]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
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
//       newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your password';
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     if (!acceptTerms) {
//       setApiError('Please accept the terms and conditions');
//       return;
//     }

//     setIsLoading(true);
//     setApiError('');
    
//     try {
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       const { confirmPassword, ...registrationData } = formData;
//       // confirmPassword is intentionally excluded from the API call
      
//       const response = await fetch('/api/auth/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(registrationData),
//       });

//       const data: SignupResponse = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Registration failed');
//       }

//       // Registration successful
//       console.log('Registration successful:', data);
      
//       // Redirect to home page after successful registration
//       router.push('/?message=Registration successful! Please log in.');
      
//     } catch (error) {
//       console.error('Registration error:', error);
//       setApiError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <h2 className="text-3xl font-bold text-black mb-2">Create Account</h2>
//           <p className="text-gray-600">Join us today and get started</p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {/* API Error Display */}
//           {apiError && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//               <p className="text-sm text-red-600">{apiError}</p>
//             </div>
//           )}

//           <div className="space-y-4">
//             {/* Name Fields */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="firstName" className="block text-sm font-medium text-black mb-2">
//                   First Name
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="firstName"
//                     name="firstName"
//                     type="text"
//                     value={formData.firstName}
//                     onChange={handleInputChange}
//                     className={`block w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
//                       errors.firstName ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     placeholder="First name"
//                     disabled={isLoading}
//                   />
//                 </div>
//                 {errors.firstName && (
//                   <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="lastName" className="block text-sm font-medium text-black mb-2">
//                   Last Name
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="lastName"
//                     name="lastName"
//                     type="text"
//                     value={formData.lastName}
//                     onChange={handleInputChange}
//                     className={`block w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
//                       errors.lastName ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     placeholder="Last name"
//                     disabled={isLoading}
//                   />
//                 </div>
//                 {errors.lastName && (
//                   <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
//                 )}
//               </div>
//             </div>

//             {/* Role Field */}
            

//             {/* Email Field */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className={`block w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
//                     errors.email ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="Enter your email"
//                   disabled={isLoading}
//                 />
//               </div>
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-500">{errors.email}</p>
//               )}
//             </div>

//             {/* Phone Field */}
//             <div>
//               <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
//                 Phone Number
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Phone className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="phone"
//                   name="phone"
//                   type="tel"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   className={`block w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
//                     errors.phone ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="Enter your phone number"
//                   disabled={isLoading}
//                 />
//               </div>
//               {errors.phone && (
//                 <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? 'text' : 'password'}
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   className={`block w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
//                     errors.password ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="Create a password"
//                   disabled={isLoading}
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setShowPassword(!showPassword)}
//                   disabled={isLoading}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-500">{errors.password}</p>
//               )}
//             </div>

//             {/* Confirm Password Field */}
//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-2">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   value={formData.confirmPassword}
//                   onChange={handleInputChange}
//                   className={`block w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
//                     errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="Confirm your password"
//                   disabled={isLoading}
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   disabled={isLoading}
//                 >
//                   {showConfirmPassword ? (
//                     <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   )}
//                 </button>
//               </div>
//               {errors.confirmPassword && (
//                 <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
//               )}
//             </div>
//           </div>

//           {/* Terms and Conditions */}
//           <div className="flex items-start">
//             <input
//               id="acceptTerms"
//               type="checkbox"
//               checked={acceptTerms}
//               onChange={(e) => setAcceptTerms(e.target.checked)}
//               className="mt-1 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
//               disabled={isLoading}
//             />
//             <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-600">
//               I agree to the{' '}
//               <a href="#" className="text-black hover:text-gray-700 font-medium">
//                 Terms of Service
//               </a>{' '}
//               and{' '}
//               <a href="#" className="text-black hover:text-gray-700 font-medium">
//                 Privacy Policy
//               </a>
//             </label>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             {isLoading ? (
//               <div className="flex items-center">
//                 <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
//                 Creating account...
//               </div>
//             ) : (
//               'Create Account'
//             )}
//           </button>

//           {/* Login Link */}
//           <div className="text-center">
//             <p className="text-gray-600">
//               Already have an account?{' '}
//               <Link href="/auth/login" className="text-black hover:text-gray-700 font-medium">
//                 Sign in here
//               </Link>
//             </p>
//           </div>
//         </form>

//         {/* Divider */}
//         <div className="mt-6">
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300" />
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white text-gray-500">Or register with</span>
//             </div>
//           </div>

//           {/* Social Register Buttons */}
//           <div className="mt-6 grid grid-cols-2 gap-3">
//             <button 
//               type="button"
//               className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-500 hover:bg-black hover:text-white transition-colors disabled:opacity-50"
//               disabled={isLoading}
//             >
//               <span>Google</span>
//             </button>
//             <button 
//               type="button"
//               className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-500 hover:bg-black hover:text-white transition-colors disabled:opacity-50"
//               disabled={isLoading}
//             >
//               <span>Apple</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // or react-native-vector-icons
import { useNavigation } from '@react-navigation/native';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface SignupResponse {
  message: string;
}

const Register: React.FC = () => {
  const navigation = useNavigation();
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
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

//     if (!acceptTerms) {
//       setApiError('Please accept the terms and conditions');
//       return;
//     }

    setIsLoading(true);
    setApiError('');

    try {
      const { confirmPassword, ...registrationData } = formData;

      const response = await fetch('YOUR_API_URL/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data: SignupResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Registration successful
      Alert.alert('Success', 'Registration successful! Please log in.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login' as never),
        },
      ]);
    } catch (error) {
      console.error('Registration error:', error);
      setApiError(
        error instanceof Error
          ? error.message
          : 'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join us today and get started</Text>
      </View>

      {/* API Error Display */}
      {apiError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{apiError}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        {/* Name Fields */}
        <View style={styles.rowContainer}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>First Name</Text>
            <View style={[styles.inputContainer, errors.firstName && styles.inputError]}>
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
            {errors.firstName ? (
              <Text style={styles.fieldError}>{errors.firstName}</Text>
            ) : null}
          </View>

          <View style={styles.halfWidth}>
            <Text style={styles.label}>Last Name</Text>
            <View style={[styles.inputContainer, errors.lastName && styles.inputError]}>
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
            {errors.lastName ? (
              <Text style={styles.fieldError}>{errors.lastName}</Text>
            ) : null}
          </View>
        </View>

        {/* Email Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email Address</Text>
          <View style={[styles.inputContainer, errors.email && styles.inputError]}>
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
          {errors.email ? <Text style={styles.fieldError}>{errors.email}</Text> : null}
        </View>

        {/* Phone Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={[styles.inputContainer, errors.phone && styles.inputError]}>
            <Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.icon} />
            <TextInput
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              editable={!isLoading}
            />
          </View>
          {errors.phone ? <Text style={styles.fieldError}>{errors.phone}</Text> : null}
        </View>

        {/* Password Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={[styles.inputContainer, errors.password && styles.inputError]}>
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.icon} />
            <TextInput
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              style={[styles.input, styles.inputWithButton]}
              placeholder="Create a password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              disabled={isLoading}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
          {errors.password ? <Text style={styles.fieldError}>{errors.password}</Text> : null}
        </View>

        {/* Confirm Password Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.icon} />
            <TextInput
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
              style={[styles.input, styles.inputWithButton]}
              placeholder="Confirm your password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showConfirmPassword}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeButton}
              disabled={isLoading}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword ? (
            <Text style={styles.fieldError}>{errors.confirmPassword}</Text>
          ) : null}
        </View>

        {/* Terms and Conditions */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAcceptTerms(!acceptTerms)}
          disabled={isLoading}
        >
          <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
            {acceptTerms && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxLabel}>
            I agree to the{' '}
            <Text style={styles.link}>Terms of Service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={styles.submitButtonText}>Creating account...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
            <Text style={styles.loginLink}>Sign in here</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Or register with</Text>
        <View style={styles.divider} />
      </View>

      {/* Social Register Buttons */}
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          disabled={isLoading}
        >
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.socialButton}
          disabled={isLoading}
        >
          <Text style={styles.socialButtonText}>Apple</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
  },
  form: {
    width: '100%',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
  },
  inputWithButton: {
    paddingRight: 40,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  fieldError: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 8,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
  },
  link: {
    color: '#000000',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  dividerText: {
    fontSize: 14,
    color: '#6B7280',
    marginHorizontal: 8,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
});

export default Register;
