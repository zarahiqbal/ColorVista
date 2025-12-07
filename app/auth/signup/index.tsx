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
