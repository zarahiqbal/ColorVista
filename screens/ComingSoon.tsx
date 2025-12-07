import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/Context/ThemeContext';

export default function ComingSoonScreen() {
  const router = useRouter();
  const { featureName } = useLocalSearchParams();
  const displayTitle = featureName ? featureName.toString() : 'New Feature';

  // THEME HOOKS (We still respect dark mode toggle if you want, 
  // but we default to the image's specific look for the "Light" version)
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const scale = getFontSizeMultiplier();

  // 1. THEME EXTRACTED FROM YOUR IMAGE
  const brandColors = {
    lavender: '#B59FBC',  // Matches "See Images" card
    tan: '#C4A48C',       // Matches "Identify Patterns" card
    darkGray: '#3D3D3D',  // Matches "Private" card
    bgLight: '#FAFAFA',   // Clean background
  };

  const theme = {
    bg: darkMode ? '#121212' : brandColors.bgLight,
    text: darkMode ? '#FFFFFF' : '#1A1A1A',
    subText: darkMode ? '#9CA3AF' : '#666666',
    // Main visual background
    heroCardBg: darkMode ? '#2C2C2E' : brandColors.lavender, 
    // Button colors
    primaryBtn: brandColors.darkGray,
    secondaryBorder: brandColors.tan,
    iconColor: '#FFFFFF',
  };

  const [notified, setNotified] = useState(false);

  const handleNotify = () => {
    setNotified(true);
    Alert.alert("Success", "We'll notify you when this feature is ready!");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28 * scale} color={theme.text} />
        </TouchableOpacity>
        {/* Empty view to balance header if needed, or title */}
        <View style={{ width: 28 }} /> 
      </View>

      <View style={styles.content}>
        
        {/* 2. MAIN VISUAL (Updated to Rounded Square like image cards) */}
        <View style={[styles.heroCard, { backgroundColor: theme.heroCardBg }]}>
          <MaterialCommunityIcons 
            name="rocket-launch" 
            size={60 * scale} 
            color={theme.iconColor} 
          />
          <Text style={[styles.heroCardText, { fontSize: 14 * scale }]}>
            In Progress
          </Text>
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
            <Text style={[styles.title, { color: theme.text, fontSize: 28 * scale }]}>
            Coming Soon
            </Text>
            
            <Text style={[styles.subtitle, { color: brandColors.tan, fontSize: 22 * scale }]}>
            {displayTitle}
            </Text>

            <Text style={[styles.description, { color: theme.subText, fontSize: 16 * scale }]}>
            We are crafting this feature with care. It will be available in the next update.
            </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          
          {/* Notify Me Button (Solid Dark Gray like "Private" card) */}
          <TouchableOpacity 
            style={[
              styles.primaryButton, 
              { backgroundColor: notified ? '#10B981' : theme.primaryBtn }
            ]}
            onPress={handleNotify}
            disabled={notified}
          >
            <Ionicons 
              name={notified ? "checkmark-circle" : "notifications"} 
              size={20 * scale} 
              color="#FFF" 
            />
            <Text style={[styles.primaryButtonText, { fontSize: 16 * scale }]}>
              {notified ? "You're on the list!" : "Notify Me"}
            </Text>
          </TouchableOpacity>

          {/* Return Button (Outline) */}
          <TouchableOpacity 
            style={[styles.secondaryButton, { borderColor: theme.secondaryBorder }]}
            onPress={() => router.replace('/dashboard')}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.text, fontSize: 16 * scale }]}>
              Back to Dashboard
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
    marginLeft: -8, // Align with padding
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60, 
  },
  // MATCHING THE IMAGE CARD STYLE
  heroCard: {
    width: 140,
    height: 140,
    borderRadius: 24, // Matching the large rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  heroCardText: {
    color: '#FFF',
    fontWeight: '600',
    marginTop: 12,
    opacity: 0.9,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16, // Matching button radius from image
    gap: 10,
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  secondaryButtonText: {
    fontWeight: '600',
  },
});