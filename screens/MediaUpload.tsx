import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
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
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

// REPLACE WITH YOUR COMPUTER'S LOCAL IP ADDRESS (e.g., 192.168.1.5)
// Make sure to include the protocol (http://) so fetch can connect.
const SERVER_URL = 'http://10.135.55.162:5000/process-image'; 

export default function MediaUpload() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  // Pick image from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images' as any,
      allowsEditing: true, // Crops to square/portrait usually
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setProcessedImage(null); // Reset state on new image
    }
  };

  // Send image to Python Backend for OpenCV processing
  const handleDetectColors = async () => {
    if (!image) return;

    setIsProcessing(true);

    try {
      // 1. Convert image to Base64
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: 'base64' as any,
      });

      // 2. Send to Backend with enhanced error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout for processing

      console.log('Sending request to:', SERVER_URL);

      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Server error (${response.status}): ${errorData}`);
      }

      const data = await response.json();

      if (!data.processed_image) {
        throw new Error('No processed image in response');
      }

      // 3. Display Result (Data should be base64 string)
      setProcessedImage(`data:image/jpeg;base64,${data.processed_image}`);
      Alert.alert("Success", "Colors detected and labeled!");

    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      console.error("Processing error:", errorMessage);
      
      if (errorMessage.includes('Network')) {
        Alert.alert(
          "Connection Error", 
          `Cannot reach server at ${SERVER_URL}\n\nMake sure:\n1. Python server is running\n2. IP address is correct\n3. Both devices are on same WiFi`
        );
      } else if (errorMessage.includes('timeout')) {
        Alert.alert(
          "Timeout Error", 
          "Server took too long to respond. Please try again."
        );
      } else {
        Alert.alert(
          "Processing Failed", 
          errorMessage
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    const targetImage = processedImage || image;
    if (!targetImage) return;

    try {
      if (permissionResponse?.status !== 'granted') {
        const { status } = await requestPermission();
        if (status !== 'granted') {
          Alert.alert("Permission Error", "Need permission to save to gallery");
          return;
        }
      }

      // If it's a base64 string (from server), we need to write it to a file first
      if (targetImage.startsWith('data:image')) {
        // Robustly strip the data URL prefix for any image mime type
        const base64Code = targetImage.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

        const docDir = (FileSystem as any).documentDirectory ?? (FileSystem as any).cacheDirectory ?? '';
        if (!docDir) throw new Error('No writable document directory available');

        const filename = docDir + 'processed_cv.jpg';
        await FileSystem.writeAsStringAsync(filename, base64Code, {
          encoding: 'base64' as any,
        });
        await MediaLibrary.createAssetAsync(filename);
      } else {
        // It's a local URI
        await MediaLibrary.createAssetAsync(targetImage);
      }
      
      Alert.alert("Saved", "Image saved to your gallery!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not save image.");
    }
  };

  const handleReset = () => {
    setImage(null);
    setProcessedImage(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Color Detector</Text>
      </View>

      <View style={styles.content}>
        {/* Image Preview Area */}
        <View style={styles.previewContainer}>
          {image ? (
            <View style={[styles.imageWrapper, processedImage && styles.enhancedWrapper]}>
              <Image 
                source={{ uri: processedImage || image }} 
                style={styles.previewImage} 
                resizeMode="contain" 
              />
              
              {processedImage && (
                <View style={styles.enhancedBadge}>
                  <Ionicons name="checkmark-circle" size={12} color="#FFF" />
                  <Text style={styles.enhancedBadgeText}>PROCESSED</Text>
                </View>
              )}
              
              <TouchableOpacity style={styles.closeButton} onPress={handleReset}>
                <Ionicons name="close-circle" size={28} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.placeholderContainer} onPress={pickImage}>
              <View style={styles.iconCircle}>
                <Ionicons name="scan-outline" size={40} color="#666" />
              </View>
              <Text style={styles.placeholderText}>Select Image to Scan</Text>
              <Text style={styles.subText}>Detects: Red, Blue, Green, Yellow</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {!image ? (
            <TouchableOpacity style={styles.primaryButton} onPress={pickImage}>
              <Ionicons name="images-outline" size={24} color="#FFF" />
              <Text style={styles.buttonText}>Open Gallery</Text>
            </TouchableOpacity>
          ) : (
            <>
              <View style={styles.buttonRow}>
                {/* Detect Button */}
                <TouchableOpacity 
                  style={[styles.actionButton, styles.enhanceButton, processedImage && styles.disabledButton]} 
                  onPress={handleDetectColors}
                  disabled={!!processedImage || isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Ionicons name="color-filter" size={22} color={processedImage ? "#A0A0A0" : "#FFF"} />
                      <Text style={[styles.actionButtonText, processedImage && styles.disabledText]}>
                        {processedImage ? "Done" : "Identify Colors"}
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
};

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
  },
  enhancedBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 6,
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
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginHorizontal: 7,
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