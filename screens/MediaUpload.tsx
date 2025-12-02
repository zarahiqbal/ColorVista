import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function MediaUpload() {
  const [image, setImage] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  // Pick image from gallery
  const pickImage = async () => {
    // Request permission if needed
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5], // Instagram portrait ratio style
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setIsEnhanced(false); // Reset enhanced state on new image
    }
  };

  // Simulate an AI Enhancement process
  const handleEnhance = () => {
    if (!image) return;

    setIsEnhancing(true);
    
    // Simulate network/processing delay
    setTimeout(() => {
      setIsEnhancing(false);
      setIsEnhanced(true);
      Alert.alert("Success", "Image enhanced successfully!");
    }, 2000);
  };

  // Save image to gallery
  const handleSave = async () => {
    if (!image) return;

    try {
      if (permissionResponse?.status !== 'granted') {
        const { status } = await requestPermission();
        if (status !== 'granted') {
          Alert.alert("Permission Error", "Need permission to save to gallery");
          return;
        }
      }

      // In a real app with a real enhancer, you would save the *processed* URI here.
      // Since this is a UI demo, we save the original URI.
      await MediaLibrary.createAssetAsync(image);
      Alert.alert("Saved", "Image saved to your gallery!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not save image.");
    }
  };

  const handleReset = () => {
    setImage(null);
    setIsEnhanced(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Enhancer</Text>
      </View>

      <View style={styles.content}>
        {/* Image Preview Area */}
        <View style={styles.previewContainer}>
          {image ? (
            <View style={[
              styles.imageWrapper, 
              isEnhanced && styles.enhancedWrapper // Apply glow effect if enhanced
            ]}>
              <Image 
                source={{ uri: image }} 
                style={[
                  styles.previewImage,
                  // Simulate "Enhanced" visual by slightly adjusting opacity/contrast styled props
                  // In a real app, this would be a new URI from the backend
                  isEnhanced && { opacity: 0.95 } 
                ]} 
                resizeMode="cover" 
              />
              {isEnhanced && (
                <View style={styles.enhancedBadge}>
                  <Ionicons name="sparkles" size={12} color="#FFF" />
                  <Text style={styles.enhancedBadgeText}>ENHANCED</Text>
                </View>
              )}
              
              <TouchableOpacity style={styles.closeButton} onPress={handleReset}>
                <Ionicons name="close-circle" size={28} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.placeholderContainer} onPress={pickImage}>
              <View style={styles.iconCircle}>
                <Ionicons name="image-outline" size={40} color="#666" />
              </View>
              <Text style={styles.placeholderText}>Tap to Select Image</Text>
              <Text style={styles.subText}>Supports JPEG, PNG</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {!image ? (
            <TouchableOpacity style={styles.primaryButton} onPress={pickImage}>
              <Ionicons name="add-circle-outline" size={24} color="#FFF" />
              <Text style={styles.buttonText}>Open Gallery</Text>
            </TouchableOpacity>
          ) : (
            <>
              <View style={styles.buttonRow}>
                {/* Enhancer Button */}
                <TouchableOpacity 
                  style={[styles.actionButton, styles.enhanceButton, isEnhanced && styles.disabledButton]} 
                  onPress={handleEnhance}
                  disabled={isEnhanced || isEnhancing}
                >
                  {isEnhancing ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Ionicons name="color-wand" size={22} color={isEnhanced ? "#A0A0A0" : "#FFF"} />
                      <Text style={[styles.actionButtonText, isEnhanced && styles.disabledText]}>
                        {isEnhanced ? "Enhanced" : "Enhance"}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Save Button */}
                <TouchableOpacity 
                  style={[styles.actionButton, styles.saveButton]} 
                  onPress={handleSave}
                >
                  <Ionicons name="download-outline" size={22} color="#000" />
                  <Text style={[styles.actionButtonText, { color: '#000' }]}>Save</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
                <Text style={styles.secondaryButtonText}>Choose a different photo</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark mode background
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  placeholderContainer: {
    width: width - 40,
    height: width - 40, // Square aspect
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  placeholderText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  subText: {
    color: '#666',
    fontSize: 14,
  },
  imageWrapper: {
    width: width - 40,
    height: (width - 40) * 1.25, // 4:5 Aspect Ratio
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  enhancedWrapper: {
    borderWidth: 2,
    borderColor: '#8A2BE2', // Purple glow for enhanced state
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
  },
  enhancedBadge: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  enhancedBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  controlsContainer: {
    paddingBottom: Platform.OS === 'ios' ? 0 : 20,
  },
  primaryButton: {
    backgroundColor: '#8A2BE2', // BlueViolet
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  enhanceButton: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#444',
  },
  saveButton: {
    backgroundColor: '#FFF',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#222',
    borderColor: '#333',
  },
  disabledText: {
    color: '#666',
  },
  secondaryButton: {
    alignItems: 'center',
    padding: 10,
  },
  secondaryButtonText: {
    color: '#888',
    fontSize: 14,
  },
});