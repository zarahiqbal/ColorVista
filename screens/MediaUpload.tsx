// import { Ionicons } from '@expo/vector-icons';
// import * as FileSystem from 'expo-file-system';
// import * as ImagePicker from 'expo-image-picker';
// import * as MediaLibrary from 'expo-media-library';
// import React, { useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   Platform,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// const { width } = Dimensions.get('window');

// // REPLACE WITH YOUR COMPUTER'S LOCAL IP ADDRESS (e.g., 192.168.1.5)
// const SERVER_URL = 'http://192.168.1.12:5000/process-image'; 

// export default function MediaUpload() {
//   const [image, setImage] = useState<string | null>(null);
//   const [processedImage, setProcessedImage] = useState<string | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

//   // Pick image from gallery
//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
//     if (status !== 'granted') {
//       Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true, // Crops to square/portrait usually
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//       setProcessedImage(null); // Reset state on new image
//     }
//   };

//   // Send image to Python Backend for OpenCV processing
//   const handleDetectColors = async () => {
//     if (!image) return;

//     setIsProcessing(true);

//     try {
//       // 1. Convert image to Base64
//       const base64 = await FileSystem.readAsStringAsync(image, {
//         encoding: 'base64' as any,
//       });

//       // 2. Send to Backend
//       // Note: Use a try/catch block with a timeout fallback for demonstration
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

//       const response = await fetch(SERVER_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ image: base64 }),
//         signal: controller.signal
//       });

//       clearTimeout(timeoutId);

//       if (!response.ok) {
//         throw new Error('Server error');
//       }

//       const data = await response.json();

//       // 3. Display Result (Data should be base64 string)
//       setProcessedImage(`data:image/jpeg;base64,${data.processed_image}`);
//       Alert.alert("Success", "Objects detected and labeled!");

//     } catch (error) {
//       console.log("Processing failed, falling back to simulation:", error);
      
//       // FALLBACK SIMULATION (If no python server is running)
//       // This is just so the UI interaction works in the demo
//       setTimeout(() => {
//         setProcessedImage(image); // Just shows original in simulation
//         Alert.alert(
//           "Simulation Mode", 
//           "Server not connected. In a real setup, the Python script would return the labeled image. (Check console for connection error)"
//         );
//       }, 1500);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleSave = async () => {
//     const targetImage = processedImage || image;
//     if (!targetImage) return;

//     try {
//       if (permissionResponse?.status !== 'granted') {
//         const { status } = await requestPermission();
//         if (status !== 'granted') {
//           Alert.alert("Permission Error", "Need permission to save to gallery");
//           return;
//         }
//       }

//       // If it's a base64 string (from server), we need to write it to a file first
//       if (targetImage.startsWith('data:image')) {
//         // Robustly strip the data URL prefix for any image mime type
//         const base64Code = targetImage.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

//         const docDir = (FileSystem as any).documentDirectory ?? (FileSystem as any).cacheDirectory ?? '';
//         if (!docDir) throw new Error('No writable document directory available');

//         const filename = docDir + 'processed_cv.jpg';
//         await FileSystem.writeAsStringAsync(filename, base64Code, {
//           encoding: 'base64' as any,
//         });
//         await MediaLibrary.createAssetAsync(filename);
//       } else {
//         // It's a local URI
//         await MediaLibrary.createAssetAsync(targetImage);
//       }
      
//       Alert.alert("Saved", "Image saved to your gallery!");
//     } catch (error) {
//       console.error(error);
//       Alert.alert("Error", "Could not save image.");
//     }
//   };

//   const handleReset = () => {
//     setImage(null);
//     setProcessedImage(null);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Color Detector</Text>
//       </View>

//       <View style={styles.content}>
//         {/* Image Preview Area */}
//         <View style={styles.previewContainer}>
//           {image ? (
//             <View style={[styles.imageWrapper, processedImage && styles.enhancedWrapper]}>
//               <Image 
//                 source={{ uri: processedImage || image }} 
//                 style={styles.previewImage} 
//                 resizeMode="contain" 
//               />
              
//               {processedImage && (
//                 <View style={styles.enhancedBadge}>
//                   <Ionicons name="checkmark-circle" size={12} color="#FFF" />
//                   <Text style={styles.enhancedBadgeText}>PROCESSED</Text>
//                 </View>
//               )}
              
//               <TouchableOpacity style={styles.closeButton} onPress={handleReset}>
//                 <Ionicons name="close-circle" size={28} color="#FFF" />
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <TouchableOpacity style={styles.placeholderContainer} onPress={pickImage}>
//               <View style={styles.iconCircle}>
//                 <Ionicons name="scan-outline" size={40} color="#666" />
//               </View>
//               <Text style={styles.placeholderText}>Select Image to Scan</Text>
//               <Text style={styles.subText}>Detects: Red, Blue, Green, Yellow</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Controls */}
//         <View style={styles.controlsContainer}>
//           {!image ? (
//             <TouchableOpacity style={styles.primaryButton} onPress={pickImage}>
//               <Ionicons name="images-outline" size={24} color="#FFF" />
//               <Text style={styles.buttonText}>Open Gallery</Text>
//             </TouchableOpacity>
//           ) : (
//             <>
//               <View style={styles.buttonRow}>
//                 {/* Detect Button */}
//                 <TouchableOpacity 
//                   style={[styles.actionButton, styles.enhanceButton, processedImage && styles.disabledButton]} 
//                   onPress={handleDetectColors}
//                   disabled={!!processedImage || isProcessing}
//                 >
//                   {isProcessing ? (
//                     <ActivityIndicator color="#FFF" />
//                   ) : (
//                     <>
//                       <Ionicons name="color-filter" size={22} color={processedImage ? "#A0A0A0" : "#FFF"} />
//                       <Text style={[styles.actionButtonText, processedImage && styles.disabledText]}>
//                         {processedImage ? "Done" : "Identify Colors"}
//                       </Text>
//                     </>
//                   )}
//                 </TouchableOpacity>

//                 {/* Save Button */}
//                 <TouchableOpacity 
//                   style={[styles.actionButton, styles.saveButton]} 
//                   onPress={handleSave}
//                 >
//                   <Ionicons name="download-outline" size={22} color="#000" />
//                   <Text style={[styles.actionButtonText, { color: '#000' }]}>Save</Text>
//                 </TouchableOpacity>
//               </View>
              
//               <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
//                 <Text style={styles.secondaryButtonText}>Choose a different photo</Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#121212', // Dark mode background
//   },
//   header: {
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#2A2A2A',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: '700',
//     letterSpacing: 0.5,
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'space-between',
//     padding: 20,
//   },
//   previewContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   placeholderContainer: {
//     width: width - 40,
//     height: width - 40, // Square aspect
//     borderWidth: 2,
//     borderColor: '#333',
//     borderStyle: 'dashed',
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//   },
//   iconCircle: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#2A2A2A',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   placeholderText: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 5,
//   },
//   subText: {
//     color: '#666',
//     fontSize: 14,
//   },
//   imageWrapper: {
//     width: width - 40,
//     height: (width - 40) * 1.25, // 4:5 Aspect Ratio
//     borderRadius: 20,
//     overflow: 'hidden',
//     backgroundColor: '#000',
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//   },
//   enhancedWrapper: {
//     borderWidth: 2,
//     borderColor: '#8A2BE2', // Purple glow for enhanced state
//   },
//   previewImage: {
//     width: '100%',
//     height: '100%',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 15,
//     right: 15,
//     zIndex: 10,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 15,
//   },
//   enhancedBadge: {
//     position: 'absolute',
//     bottom: 15,
//     right: 15,
//     backgroundColor: '#8A2BE2',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   enhancedBadgeText: {
//     color: '#FFF',
//     fontSize: 10,
//     fontWeight: 'bold',
//     marginLeft: 6,
//   },
//   controlsContainer: {
//     paddingBottom: Platform.OS === 'ios' ? 0 : 20,
//   },
//   primaryButton: {
//     backgroundColor: '#8A2BE2', // BlueViolet
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 16,
//     borderRadius: 16,
//   },
//   buttonText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 10,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     marginBottom: 15,
//   },
//   actionButton: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 16,
//     borderRadius: 16,
//     marginHorizontal: 7,
//   },
//   enhanceButton: {
//     backgroundColor: '#333',
//     borderWidth: 1,
//     borderColor: '#444',
//   },
//   saveButton: {
//     backgroundColor: '#FFF',
//   },
//   actionButtonText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   disabledButton: {
//     backgroundColor: '#222',
//     borderColor: '#333',
//   },
//   disabledText: {
//     color: '#666',
//   },
//   secondaryButton: {
//     alignItems: 'center',
//     padding: 10,
//   },
//   secondaryButtonText: {
//     color: '#888',
//     fontSize: 14,
//   },
// });

import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// 1. USE SAFER CONTEXT VIEW
import { SafeAreaView } from 'react-native-safe-area-context';
// 2. IMPORT THEME HOOK
import { useTheme } from '../Context/ThemeContext';

const { width } = Dimensions.get('window');

// REPLACE WITH YOUR LOCAL IP
const SERVER_URL = 'http://192.168.1.12:5000/process-image'; 

export default function MediaUpload() {
  // 3. CONSUME THEME CONTEXT
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const scale = getFontSizeMultiplier();

  // 4. DEFINE DYNAMIC COLORS
  const theme = {
    bg: darkMode ? '#121212' : '#F9FAFB',
    text: darkMode ? '#FFFFFF' : '#1F2937',
    subText: darkMode ? '#A0A0A0' : '#6B7280',
    cardBg: darkMode ? '#1E1E1E' : '#FFFFFF',
    border: darkMode ? '#333333' : '#E5E7EB',
    iconCircle: darkMode ? '#2A2A2A' : '#F3F4F6',
    primary: '#8A2BE2', // BlueViolet (Brand Color)
    buttonEnhanceBg: darkMode ? '#333333' : '#E5E7EB',
    buttonEnhanceText: darkMode ? '#FFFFFF' : '#1F2937',
    buttonSaveBg: darkMode ? '#FFFFFF' : '#1F2937',
    buttonSaveText: darkMode ? '#000000' : '#FFFFFF',
    shadow: darkMode ? '#000' : '#CCC',
  };

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, 
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setProcessedImage(null); 
    }
  };

  // Send image to Backend
  const handleDetectColors = async () => {
    if (!image) return;

    setIsProcessing(true);

    try {
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: 'base64' as any,
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); 

      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Server error');

      const data = await response.json();
      setProcessedImage(`data:image/jpeg;base64,${data.processed_image}`);
      Alert.alert("Success", "Objects detected and labeled!");

    } catch (error) {
      console.log("Processing failed, falling back to simulation");
      
      // FALLBACK SIMULATION
      setTimeout(() => {
        setProcessedImage(image); 
        Alert.alert(
          "Simulation Mode", 
          "Server connection failed. Showing original image as simulation."
        );
      }, 1500);
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

      if (targetImage.startsWith('data:image')) {
        const base64Code = targetImage.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
        const docDir = (FileSystem as any).documentDirectory ?? (FileSystem as any).cacheDirectory ?? '';
        const filename = docDir + 'processed_cv.jpg';
        await FileSystem.writeAsStringAsync(filename, base64Code, { encoding: 'base64' as any });
        await MediaLibrary.createAssetAsync(filename);
      } else {
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text, fontSize: 18 * scale }]}>Color Detector</Text>
      </View>

      <View style={styles.content}>
        {/* Image Preview Area */}
        <View style={styles.previewContainer}>
          {image ? (
            <View style={[
                styles.imageWrapper, 
                processedImage && { borderColor: theme.primary, borderWidth: 2 },
                { backgroundColor: theme.cardBg, shadowColor: theme.shadow }
            ]}>
              <Image 
                source={{ uri: processedImage || image }} 
                style={styles.previewImage} 
                resizeMode="contain" 
              />
              
              {processedImage && (
                <View style={[styles.enhancedBadge, { backgroundColor: theme.primary }]}>
                  <Ionicons name="checkmark-circle" size={12 * scale} color="#FFF" />
                  <Text style={[styles.enhancedBadgeText, { fontSize: 10 * scale }]}>PROCESSED</Text>
                </View>
              )}
              
              <TouchableOpacity style={styles.closeButton} onPress={handleReset}>
                <Ionicons name="close-circle" size={28 * scale} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
                style={[styles.placeholderContainer, { borderColor: theme.border, backgroundColor: theme.cardBg }]} 
                onPress={pickImage}
            >
              <View style={[styles.iconCircle, { backgroundColor: theme.iconCircle }]}>
                <Ionicons name="scan-outline" size={40 * scale} color={theme.subText} />
              </View>
              <Text style={[styles.placeholderText, { color: theme.text, fontSize: 18 * scale }]}>
                Select Image to Scan
              </Text>
              <Text style={[styles.subText, { color: theme.subText, fontSize: 14 * scale }]}>
                Detects: Red, Blue, Green, Yellow
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {!image ? (
            <TouchableOpacity 
                style={[styles.primaryButton, { backgroundColor: theme.primary }]} 
                onPress={pickImage}
            >
              <Ionicons name="images-outline" size={24 * scale} color="#FFF" />
              <Text style={[styles.buttonText, { fontSize: 16 * scale }]}>Open Gallery</Text>
            </TouchableOpacity>
          ) : (
            <>
              <View style={styles.buttonRow}>
                {/* Detect Button */}
                <TouchableOpacity 
                  style={[
                      styles.actionButton, 
                      { 
                          backgroundColor: processedImage ? theme.iconCircle : theme.buttonEnhanceBg,
                          borderColor: theme.border,
                          borderWidth: 1
                      }
                  ]} 
                  onPress={handleDetectColors}
                  disabled={!!processedImage || isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator color={theme.text} />
                  ) : (
                    <>
                      <Ionicons 
                        name="color-filter" 
                        size={22 * scale} 
                        color={processedImage ? theme.subText : theme.buttonEnhanceText} 
                      />
                      <Text style={[
                          styles.actionButtonText, 
                          { 
                              color: processedImage ? theme.subText : theme.buttonEnhanceText,
                              fontSize: 16 * scale 
                          }
                      ]}>
                        {processedImage ? "Done" : "Identify"}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Save Button */}
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: theme.buttonSaveBg }]} 
                  onPress={handleSave}
                >
                  <Ionicons name="download-outline" size={22 * scale} color={theme.buttonSaveText} />
                  <Text style={[styles.actionButtonText, { color: theme.buttonSaveText, fontSize: 16 * scale }]}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
                <Text style={[styles.secondaryButtonText, { color: theme.subText, fontSize: 14 * scale }]}>
                    Choose a different photo
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  headerTitle: {
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
    height: width - 40, 
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  placeholderText: {
    fontWeight: '600',
    marginBottom: 5,
  },
  subText: {
    // handled dynamically
  },
  imageWrapper: {
    width: width - 40,
    height: (width - 40) * 1.25, // 4:5 Aspect Ratio
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  enhancedBadgeText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  controlsContainer: {
    paddingBottom: Platform.OS === 'ios' ? 0 : 20,
  },
  primaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  buttonText: {
    color: '#FFF',
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
  actionButtonText: {
    fontWeight: '600',
    marginLeft: 6,
  },
  secondaryButton: {
    alignItems: 'center',
    padding: 10,
  },
  secondaryButtonText: {
    // handled dynamically
  },
});