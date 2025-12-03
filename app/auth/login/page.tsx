// // "use client"

// // import React, { useState, useEffect } from 'react';
// // import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
// // import Link from 'next/link';
// // import { useRouter } from 'next/navigation';
// // import { useAuth } from "@/context/AuthContext";

// // interface LoginFormData {
// //   email: string;
// //   password: string;
// // }

// // interface LoginResponse {
// //   message: string;
// //   user?: {
// //     firstName: string;
// //     lastName: string;
// //     email: string;
// //     role: string;
// //   };
// // }

// // const Login: React.FC = () => {
// //   const router = useRouter();
// //   const { user, setUser } = useAuth();
// //   const [formData, setFormData] = useState<LoginFormData>({
// //     email: '',
// //     password: ''
// //   });
// //   const [showPassword, setShowPassword] = useState<boolean>(false);
// //   const [isLoading, setIsLoading] = useState<boolean>(false);
// //   const [errors, setErrors] = useState<Partial<LoginFormData>>({});
// //   const [apiError, setApiError] = useState<string>('');

// //   useEffect(() => {
// //     if (user && !isLoading) {
// //       // Only redirect if user is already logged in and we're not in the middle of logging in
// //       if (user.role === 'admin') {
// //         router.replace('/productManagement');
// //       } else {
// //         router.replace('/');
// //       }
// //     }
// //   }, [user, router, isLoading]);

// //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //     // Clear errors when user starts typing
// //     if (errors[name as keyof LoginFormData]) {
// //       setErrors(prev => ({
// //         ...prev,
// //         [name]: ''
// //       }));
// //     }
// //     // Clear API error when user starts typing
// //     if (apiError) {
// //       setApiError('');
// //     }
// //   };

// //   const validateForm = (): boolean => {
// //     const newErrors: Partial<LoginFormData> = {};

// //     if (!formData.email.trim()) {
// //       newErrors.email = 'Email is required';
// //     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
// //       newErrors.email = 'Please enter a valid email address';
// //     }

// //     if (!formData.password) {
// //       newErrors.password = 'Password is required';
// //     } else if (formData.password.length < 6) {
// //       newErrors.password = 'Password must be at least 6 characters';
// //     }

// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();
    
// //     if (!validateForm()) return;

// //     setIsLoading(true);
// //     setApiError('');
    
// //     try {
// //       const response = await fetch('/api/auth/login', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           email: formData.email.trim(),
// //           password: formData.password
// //         }),
// //       });

// //       const data: LoginResponse = await response.json();

// //       if (!response.ok) {
// //         throw new Error(data.message || 'Login failed');
// //       }

// //       // Login successful
// //       console.log('Login successful:', data);
      
// //       // Set user immediately to avoid race conditions
// //       if (data.user) {
// //         setUser({
// //           ...data.user,
// //           role: data.user.role as "user" | "admin"
// //         });
// //       }
      
// //       // Redirect based on user role
// //       if (data.user?.role === 'admin') {
// //         router.push('/productManagement');
// //       } else {
// //         router.push('/');
// //       }
      
// //     } catch (error) {
// //       console.error('Login error:', error);
// //       setApiError(error instanceof Error ? error.message : 'Login failed. Please try again.');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
// //       <div className="max-w-md w-full space-y-8">
// //         <div className="text-center">
// //           <h2 className="text-3xl font-bold text-black mb-2">Welcome Back</h2>
// //           <p className="text-gray-600">Sign in to your account</p>
// //         </div>

// //         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
// //           {/* API Error Display */}
// //           {apiError && (
// //             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
// //               <p className="text-sm text-red-600">{apiError}</p>
// //             </div>
// //           )}

// //           <div className="space-y-4">
// //             {/* Email Field */}
// //             <div>
// //               <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
// //                 Email Address
// //               </label>
// //               <div className="relative">
// //                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                   <Mail className="h-5 w-5 text-gray-400" />
// //                 </div>
// //                 <input
// //                   id="email"
// //                   name="email"
// //                   type="email"
// //                   value={formData.email}
// //                   onChange={handleInputChange}
// //                   className={`block w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
// //                     errors.email ? 'border-red-500' : 'border-gray-300'
// //                   }`}
// //                   placeholder="Enter your email"
// //                   disabled={isLoading}
// //                 />
// //               </div>
// //               {errors.email && (
// //                 <p className="mt-1 text-sm text-red-500">{errors.email}</p>
// //               )}
// //             </div>

// //             {/* Password Field */}
// //             <div>
// //               <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
// //                 Password
// //               </label>
// //               <div className="relative">
// //                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                   <Lock className="h-5 w-5 text-gray-400" />
// //                 </div>
// //                 <input
// //                   id="password"
// //                   name="password"
// //                   type={showPassword ? 'text' : 'password'}
// //                   value={formData.password}
// //                   onChange={handleInputChange}
// //                   className={`block w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${
// //                     errors.password ? 'border-red-500' : 'border-gray-300'
// //                   }`}
// //                   placeholder="Enter your password"
// //                   disabled={isLoading}
// //                 />
// //                 <button
// //                   type="button"
// //                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
// //                   onClick={() => setShowPassword(!showPassword)}
// //                   disabled={isLoading}
// //                 >
// //                   {showPassword ? (
// //                     <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
// //                   ) : (
// //                     <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
// //                   )}
// //                 </button>
// //               </div>
// //               {errors.password && (
// //                 <p className="mt-1 text-sm text-red-500">{errors.password}</p>
// //               )}
// //             </div>
// //           </div>

// //           {/* Remember Me & Forgot Password */}
// //           <div className="flex items-center justify-between">
// //             <label className="flex items-center">
// //               <input
// //                 type="checkbox"
// //                 className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
// //                 disabled={isLoading}
// //               />
// //               <span className="ml-2 text-sm text-gray-600">Remember me</span>
// //             </label>
// //             <Link href="/auth/forgot-password" className="text-sm text-black hover:text-gray-700 font-medium">
// //               Forgot password?
// //             </Link>
// //           </div>

// //           {/* Submit Button */}
// //           <button
// //             type="submit"
// //             disabled={isLoading}
// //             className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
// //           >
// //             {isLoading ? (
// //               <div className="flex items-center">
// //                 <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
// //                 Signing in...
// //               </div>
// //             ) : (
// //               'Sign In'
// //             )}
// //           </button>

// //           {/* Register Link */}
// //           <div className="text-center">
// //             <p className="text-gray-600">
// //               Don&apos;t have an account?{' '}
// //               <Link href="/auth/signup" className="text-black hover:text-gray-700 font-medium">
// //                 Sign up here
// //               </Link>
// //             </p>
// //           </div>
// //         </form>

// //         {/* Divider */}
// //         <div className="mt-6">
// //           <div className="relative">
// //             <div className="absolute inset-0 flex items-center">
// //               <div className="w-full border-t border-gray-300" />
// //             </div>
// //             <div className="relative flex justify-center text-sm">
// //               <span className="px-2 bg-white text-gray-500">Or continue with</span>
// //             </div>
// //           </div>

// //           {/* Social Login Buttons */}
// //           <div className="mt-6 grid grid-cols-2 gap-3">
// //             <button 
// //               type="button"
// //               className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-500 hover:bg-black hover:text-white transition-colors disabled:opacity-50"
// //               disabled={isLoading}
// //             >
// //               <span>Google</span>
// //             </button>
// //             <button 
// //               type="button"
// //               className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-500 hover:bg-black hover:text-white transition-colors disabled:opacity-50"
// //               disabled={isLoading}
// //             >
// //               <span>Apple</span>
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;

// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import {
//     ActivityIndicator,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import { useAuth } from '../AuthContext';

// // interface LoginFormData {
// //   email: string;
// //   password: string;
// // }

// // interface LoginResponse {
// //   message: string;
// //   user?: {
// //     firstName: string;
// //     lastName: string;
// //     email: string;
// //     role: string;
// //   };
// // }

// const Login: React.FC = () => {
//   const router = useRouter();
//   const { user, setUser, isLoading: authLoading } = useAuth();
//   const [formData, setFormData] = useState<LoginFormData>({
//     email: '',
//     password: '',
//   });
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [errors, setErrors] = useState<Partial<LoginFormData>>({});
//   const [apiError, setApiError] = useState<string>('');
//   const [rememberMe, setRememberMe] = useState<boolean>(false);

//   useEffect(() => {
//     if (user && !isLoading && !authLoading) {
//       // Redirect logged-in users based on role
//       if (user.role === 'admin') {
//         router.replace('/');
//       } else {
//         router.replace('/');
//       }
//     }
//   }, [user, isLoading, authLoading]);

//   const handleInputChange = (name: keyof LoginFormData, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
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

// //   const validateForm = (): boolean => {
// //     const newErrors: Partial<LoginFormData> = {};

// //     if (!formData.email.trim()) {
// //       newErrors.email = 'Email is required';
// //     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
// //       newErrors.email = 'Please enter a valid email address';
// //     }

// //     if (!formData.password) {
// //       newErrors.password = 'Password is required';
// //     } else if (formData.password.length < 6) {
// //       newErrors.password = 'Password must be at least 6 characters';
// //     }

// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     setIsLoading(true);
//     setApiError('');

//     try {
//       const response = await fetch('YOUR_API_URL/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email: formData.email.trim(),
//           password: formData.password,
//         }),
//       });

// //       const data: LoginResponse = await response.json();

// //       if (!response.ok) {
// //         throw new Error(data.message || 'Login failed');
// //       }

//       console.log('Login successful:', data);

//       if (data.user) {
//         setUser({
//           ...data.user,
//           role: data.user.role as 'user' | 'admin',
//         });
//       }

//       // Navigation will happen automatically via useEffect
//     } catch (error) {
//       console.error('Login error:', error);
//       setApiError(
//         error instanceof Error
//           ? error.message
//           : 'Login failed. Please try again.'
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ScrollView 
//       style={styles.container} 
//       contentContainerStyle={styles.contentContainer}
//       keyboardShouldPersistTaps="handled"
//     >
//       <View style={styles.header}>
//         <Text style={styles.title}>Welcome Back</Text>
//         <Text style={styles.subtitle}>Sign in to your account</Text>
//       </View>

//       <View style={styles.form}>
//         {apiError ? (
//           <View style={styles.errorContainer}>
//             <Text style={styles.errorText}>{apiError}</Text>
//           </View>
//         ) : null}

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

//         {/* Password Field */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Password</Text>
//           <View style={[styles.inputContainer, errors.password && styles.inputError]}>
//             <Ionicons
//               name="lock-closed-outline"
//               size={20}
//               color="#9CA3AF"
//               style={styles.icon}
//             />
//             <TextInput
//               value={formData.password}
//               onChangeText={(text) => handleInputChange('password', text)}
//               style={[styles.input, styles.inputWithButton]}
//               placeholder="Enter your password"
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
//           {errors.password ? (
//             <Text style={styles.fieldError}>{errors.password}</Text>
//           ) : null}
//         </View>

//         {/* Remember Me & Forgot Password */}
//         <View style={styles.optionsContainer}>
//           <TouchableOpacity
//             style={styles.rememberMeContainer}
//             onPress={() => setRememberMe(!rememberMe)}
//             disabled={isLoading}
//           >
//             <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
//               {rememberMe && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
//             </View>
//             <Text style={styles.rememberMeText}>Remember me</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => router.push('../forgot-password')}
//             disabled={isLoading}
//           >
//             <Text style={styles.forgotPasswordText}>Forgot password?</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Submit Button */}
//         <TouchableOpacity
//           style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
//           onPress={handleSubmit}
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator color="#FFFFFF" size="small" />
//               <Text style={styles.submitButtonText}>Signing in...</Text>
//             </View>
//           ) : (
//             <Text style={styles.submitButtonText}>Sign In</Text>
//           )}
//         </TouchableOpacity>

//         {/* Register Link */}
//         <View style={styles.registerContainer}>
//           <Text style={styles.registerText}>Don't have an account? </Text>
//           <TouchableOpacity
//             onPress={() => router.push('../signup')}
//             disabled={isLoading}
//           >
//             <Text style={styles.registerLink}>Sign up here</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Divider */}
//       <View style={styles.dividerContainer}>
//         <View style={styles.divider} />
//         <Text style={styles.dividerText}>Or continue with</Text>
//         <View style={styles.divider} />
//       </View>

//       {/* Social Login Buttons */}
//       <View style={styles.socialButtonsContainer}>
//         <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
//           <Text style={styles.socialButtonText}>Google</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
//           <Text style={styles.socialButtonText}>Apple</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   // ... (same styles as before)
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   contentContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
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
//   form: {
//     width: '100%',
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
//   fieldContainer: {
//     marginBottom: 16,
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
//   optionsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   rememberMeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   checkbox: {
//     width: 18,
//     height: 18,
//     borderWidth: 2,
//     borderColor: '#D1D5DB',
//     borderRadius: 4,
//     marginRight: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   checkboxChecked: {
//     backgroundColor: '#000000',
//     borderColor: '#000000',
//   },
//   rememberMeText: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   forgotPasswordText: {
//     fontSize: 14,
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
//   registerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   registerText: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   registerLink: {
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

// export default Login;
