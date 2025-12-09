import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 1. Import the Theme Hook
import { useTheme } from '@/Context/ThemeContext';

const { width } = Dimensions.get('window');

// REPLACE WITH YOUR COMPUTER'S LOCAL IP ADDRESS
const SERVER_URL = 'http://10.135.64.101:5000/process-image'; 

export default function MediaUpload() {
  // 2. Consume Theme Context
  const { darkMode, getFontSizeMultiplier, colorBlindMode } = useTheme();
  const scale = getFontSizeMultiplier();
  
  // 3. Define Theme & Palette based on Reference Images
  const styles = useMemo(() => {
    const palette = {
      beigeBg: '#F6F3EE',       // Main background
      charcoal: '#2F2F2F',      // Primary buttons
      sage: '#8DA399',          // "Easy Mode" color / Upload Card
      taupe: '#A9927D',         // "Hard Mode" color / Identify Button
      textDark: '#1C1C1E',      // Primary Text
      textLight: '#6B6661',     // Secondary Text
      white: '#FFFFFF',
      surfaceDark: '#1C1C1E',   // Dark mode surface
    };

    const colors = {
      background: darkMode ? palette.surfaceDark : palette.beigeBg,
      cardSurface: darkMode ? '#2C2C2E' : palette.sage, // Using Sage for the upload card base
      cardSurfaceActive: darkMode ? '#000000' : palette.white, // When image is present
      textPrimary: darkMode ? '#F6F3EE' : palette.textDark,
      textSecondary: darkMode ? '#D1D5DB' : palette.textLight,
      textOnBrand: '#FFFFFF',
      buttonPrimary: palette.charcoal,
      buttonSecondary: palette.taupe,
      buttonTertiary: palette.sage,
      border: palette.sage,
    };

    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      header: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        alignItems: 'center',
      },
      headerTitle: {
        fontSize: 24 * scale,
        fontWeight: '800',
        color: colors.textPrimary,
        letterSpacing: -0.5,
      },
      headerSubtitle: {
        fontSize: 14 * scale,
        color: colors.textSecondary,
        marginTop: 4,
        fontWeight: '500',
      },
      content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 40,
      },
      previewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
      },
      // Mimicking the "Easy Mode" card style from image
      placeholderContainer: {
        width: '100%',
        aspectRatio: 1.1,
        backgroundColor: colors.cardSurface, // Sage Green
        borderRadius: 30, // Soft corners like reference
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: palette.charcoal,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
        padding: 20,
      },
      placeholderIconCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.25)', // Semi-transparent white
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
      },
      placeholderText: {
        fontSize: 20 * scale,
        fontWeight: '700',
        color: palette.charcoal, // Dark text on Sage background
        marginBottom: 8,
        textAlign: 'center',
      },
      placeholderSubText: {
        fontSize: 14 * scale,
        color: '#2F2F2F', // Dark text on Sage
        opacity: 0.7,
        textAlign: 'center',
      },
      // Image Present State
      imageWrapper: {
        width: '100%',
        aspectRatio: 3/4,
        borderRadius: 30,
        backgroundColor: colors.cardSurfaceActive,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: palette.charcoal,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
      },
      previewImage: {
        width: '100%',
        height: '100%',
      },
      closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
        backgroundColor: palette.charcoal,
        borderRadius: 20,
        padding: 4,
      },
      enhancedBadge: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: palette.charcoal,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: {width: 0, height: 2}
      },
      enhancedBadgeText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 12 * scale,
        marginLeft: 8,
        letterSpacing: 0.5,
      },
      // Controls
      controlsContainer: {
        gap: 16,
      },
      // Pill button style from "Continue Test"
      primaryButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.buttonPrimary, // Charcoal
        paddingVertical: 18,
        borderRadius: 32,
        shadowColor: palette.charcoal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
      },
      buttonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 17 * scale,
        marginLeft: 10,
        letterSpacing: 0.5,
      },
      buttonRow: {
        flexDirection: 'row',
        gap: 12,
      },
      actionButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        borderRadius: 24, // Slightly less rounded for side-by-side
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      // Using Taupe and Sage for action buttons to match Hard/Easy cards
      identifyBtn: {
        backgroundColor: palette.taupe, 
      },
      saveBtn: {
        backgroundColor: palette.sage,
      },
      actionButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16 * scale,
        marginLeft: 8,
      },
      disabledButton: {
        backgroundColor: '#9CA3AF',
        opacity: 0.8,
      },
      secondaryButton: {
        alignItems: 'center',
        padding: 12,
      },
      secondaryButtonText: {
        color: colors.textSecondary,
        fontSize: 15 * scale,
        fontWeight: '600',
      },
    });
  }, [darkMode, scale]);

  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setProcessedImage(null);
    }
  };

  const handleDetectColors = async () => {
    if (!image) return;
    setIsProcessing(true);

    try {
      const base64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' as any });
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            image: base64,
            cvd_mode: colorBlindMode 
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Server error (${response.status}): ${errorData}`);
      }

      const data = await response.json();
      if (!data.processed_image) throw new Error('No processed image in response');

      setProcessedImage(`data:image/jpeg;base64,${data.processed_image}`);
      Alert.alert("Success", "Colors detected and labeled!");

    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      if (errorMessage.includes('Network') || errorMessage.includes('abort')) {
         Alert.alert("Connection Error", "Check server URL and connection.");
      } else {
         Alert.alert("Error", errorMessage);
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
        if (status !== 'granted') return;
      }

      if (targetImage.startsWith('data:image')) {
        const base64Code = targetImage.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
        const docDir = (FileSystem as any).cacheDirectory ?? (FileSystem as any).documentDirectory;
        const filename = docDir + `processed_cv_${Date.now()}.jpg`;
        await FileSystem.writeAsStringAsync(filename, base64Code, { encoding: 'base64' });
        await MediaLibrary.createAssetAsync(filename);
      } else {
        await MediaLibrary.createAssetAsync(targetImage);
      }
      Alert.alert("Saved", "Image saved to your gallery!");
    } catch (error: any) {
      Alert.alert("Error", "Could not save image.");
    }
  };

  const handleReset = () => {
    setImage(null);
    setProcessedImage(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upload Media</Text>
        <Text style={styles.headerSubtitle}>Analyze existing photos from your gallery</Text>
      </View>

      <View style={styles.content}>
        {/* Image Preview Area */}
        <View style={styles.previewContainer}>
          {image ? (
            <View style={styles.imageWrapper}>
              <Image 
                source={{ uri: processedImage || image }} 
                style={styles.previewImage} 
                resizeMode="cover" 
              />
              
              {processedImage && (
                <View style={styles.enhancedBadge}>
                  <Ionicons name="checkmark-done-circle" size={16 * scale} color="#FFF" />
                  <Text style={styles.enhancedBadgeText}>ANALYSIS COMPLETE</Text>
                </View>
              )}
              
              <TouchableOpacity style={styles.closeButton} onPress={handleReset}>
                <Ionicons name="close" size={20 * scale} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            // Placeholder styled like "Easy Mode" card
            <TouchableOpacity 
                style={styles.placeholderContainer} 
                onPress={pickImage}
                activeOpacity={0.9}
            >
              <View style={styles.placeholderIconCircle}>
                <Ionicons name="images" size={32 * scale} color="#2F2F2F" />
              </View>
              <Text style={styles.placeholderText}>
                Choose from Gallery
              </Text>
              <Text style={styles.placeholderSubText}>
                Tap here to upload an image
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {!image ? (
            // Primary Button styled like "Continue Test"
            <TouchableOpacity 
                style={styles.primaryButton} 
                onPress={pickImage}
                activeOpacity={0.9}
            >
              <Ionicons name="add-circle-outline" size={24 * scale} color="#FFF" />
              <Text style={styles.buttonText}>Open Gallery</Text>
            </TouchableOpacity>
          ) : (
            <>
              <View style={styles.buttonRow}>
                {/* Identify Button styled like "Hard Mode" card (Taupe) */}
                <TouchableOpacity 
                  style={[
                      styles.actionButton, 
                      styles.identifyBtn,
                      processedImage && styles.disabledButton
                  ]} 
                  onPress={handleDetectColors}
                  disabled={!!processedImage || isProcessing}
                  activeOpacity={0.9}
                >
                  {isProcessing ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Ionicons name="scan" size={20 * scale} color="#FFF" />
                      <Text style={styles.actionButtonText}>
                        {processedImage ? "Analyzed" : "Identify"}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Save Button styled like "Easy Mode" card (Sage) */}
                <TouchableOpacity 
                  style={[styles.actionButton, styles.saveBtn]} 
                  onPress={handleSave}
                  activeOpacity={0.9}
                >
                  <Ionicons name="download-outline" size={20 * scale} color="#FFF" />
                  <Text style={styles.actionButtonText}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
                <Text style={styles.secondaryButtonText}>
                    Choose a different photo
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
// import { Ionicons } from '@expo/vector-icons';
// import * as FileSystem from 'expo-file-system/legacy';
// import * as ImagePicker from 'expo-image-picker';
// import * as MediaLibrary from 'expo-media-library';
// import { useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   Platform,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// // 1. Import the Theme Hook
// import { useTheme } from '@/Context/ThemeContext';

// const { width } = Dimensions.get('window');

// // REPLACE WITH YOUR COMPUTER'S LOCAL IP ADDRESS
// const SERVER_URL = 'http://192.168.1.5:5000/process-image'; 

// export default function MediaUpload() {
//   // 2. Consume Theme Context
//   const { darkMode, getFontSizeMultiplier, colorBlindMode } = useTheme();
  
//   // 3. Calculate dynamic values
//   const scale = getFontSizeMultiplier();
  
//   // 4. Define Dynamic Colors based on DarkMode
//   const theme = {
//     bg: darkMode ? '#121212' : '#F9FAFB',
//     text: darkMode ? '#FFFFFF' : '#111827',
//     subText: darkMode ? '#A1A1AA' : '#6B7280',
//     cardBg: darkMode ? '#1E1E1E' : '#FFFFFF',
//     borderColor: darkMode ? '#333333' : '#E5E7EB',
//     iconCircle: darkMode ? '#2A2A2A' : '#F3F4F6',
//     primary: '#8A2BE2', // Brand color remains constant usually
//     buttonText: '#FFFFFF',
//     secondaryBtnBg: darkMode ? '#333' : '#FFF',
//     placeholderBorder: darkMode ? '#333' : '#D1D5DB',
//   };

//   const [image, setImage] = useState<string | null>(null);
//   const [processedImage, setProcessedImage] = useState<string | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: 'images',
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//       setProcessedImage(null);
//     }
//   };

//   const handleDetectColors = async () => {
//     if (!image) return;
//     setIsProcessing(true);

//     try {
//       const base64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' as any });
      
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 30000);

//       // Optional: Pass colorBlindMode to backend if your Python script supports it
//       const response = await fetch(SERVER_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//             image: base64,
//             cvd_mode: colorBlindMode // Sending context to backend
//         }),
//         signal: controller.signal
//       });

//       clearTimeout(timeoutId);

//       if (!response.ok) {
//         const errorData = await response.text();
//         throw new Error(`Server error (${response.status}): ${errorData}`);
//       }

//       const data = await response.json();
//       if (!data.processed_image) throw new Error('No processed image in response');

//       setProcessedImage(`data:image/jpeg;base64,${data.processed_image}`);
//       Alert.alert("Success", "Colors detected and labeled!");

//     } catch (error: any) {
//       const errorMessage = error?.message || String(error);
//       if (errorMessage.includes('Network') || errorMessage.includes('abort')) {
//          Alert.alert("Connection Error", "Check server URL and connection.");
//       } else {
//          Alert.alert("Error", errorMessage);
//       }
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
//         if (status !== 'granted') return;
//       }

//       if (targetImage.startsWith('data:image')) {
//         const base64Code = targetImage.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
//         const docDir = (FileSystem as any).cacheDirectory ?? (FileSystem as any).documentDirectory;
//         const filename = docDir + `processed_cv_${Date.now()}.jpg`;
//         await FileSystem.writeAsStringAsync(filename, base64Code, { encoding: 'base64' });
//         await MediaLibrary.createAssetAsync(filename);
//       } else {
//         await MediaLibrary.createAssetAsync(targetImage);
//       }
//       Alert.alert("Saved", "Image saved to your gallery!");
//     } catch (error: any) {
//       Alert.alert("Error", "Could not save image.");
//     }
//   };

//   const handleReset = () => {
//     setImage(null);
//     setProcessedImage(null);
//   };

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      
//       {/* Header */}
//       <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
//         <Text style={[styles.headerTitle, { color: theme.text, fontSize: 18 * scale }]}>
//           Color Detector
//         </Text>
//       </View>

//       <View style={styles.content}>
//         {/* Image Preview Area */}
//         <View style={styles.previewContainer}>
//           {image ? (
//             <View style={[
//                 styles.imageWrapper, 
//                 processedImage && { borderColor: theme.primary, borderWidth: 2 },
//                 { backgroundColor: theme.cardBg } // Dynamic bg behind image
//             ]}>
//               <Image 
//                 source={{ uri: processedImage || image }} 
//                 style={styles.previewImage} 
//                 resizeMode="contain" 
//               />
              
//               {processedImage && (
//                 <View style={[styles.enhancedBadge, { backgroundColor: theme.primary }]}>
//                   <Ionicons name="checkmark-circle" size={12 * scale} color="#FFF" />
//                   <Text style={[styles.enhancedBadgeText, { fontSize: 10 * scale }]}>PROCESSED</Text>
//                 </View>
//               )}
              
//               <TouchableOpacity style={styles.closeButton} onPress={handleReset}>
//                 <Ionicons name="close-circle" size={28 * scale} color="#FFF" />
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <TouchableOpacity 
//                 style={[styles.placeholderContainer, { borderColor: theme.placeholderBorder, backgroundColor: theme.cardBg }]} 
//                 onPress={pickImage}
//             >
//               <View style={[styles.iconCircle, { backgroundColor: theme.iconCircle }]}>
//                 <Ionicons name="scan-outline" size={40 * scale} color={theme.subText} />
//               </View>
//               <Text style={[styles.placeholderText, { color: theme.text, fontSize: 18 * scale }]}>
//                 Select Image to Scan
//               </Text>
//               <Text style={[styles.subText, { color: theme.subText, fontSize: 14 * scale }]}>
//                 Detects: Red, Blue, Green, Yellow
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Controls */}
//         <View style={styles.controlsContainer}>
//           {!image ? (
//             <TouchableOpacity 
//                 style={[styles.primaryButton, { backgroundColor: theme.primary }]} 
//                 onPress={pickImage}
//             >
//               <Ionicons name="images-outline" size={24 * scale} color="#FFF" />
//               <Text style={[styles.buttonText, { fontSize: 16 * scale }]}>Open Gallery</Text>
//             </TouchableOpacity>
//           ) : (
//             <>
//               <View style={styles.buttonRow}>
//                 {/* Detect Button */}
//                 <TouchableOpacity 
//                   style={[
//                       styles.actionButton, 
//                       { 
//                           backgroundColor: theme.secondaryBtnBg, 
//                           borderColor: theme.borderColor,
//                           borderWidth: 1
//                       }, 
//                       processedImage && styles.disabledButton
//                   ]} 
//                   onPress={handleDetectColors}
//                   disabled={!!processedImage || isProcessing}
//                 >
//                   {isProcessing ? (
//                     <ActivityIndicator color={theme.text} />
//                   ) : (
//                     <>
//                       <Ionicons name="color-filter" size={22 * scale} color={processedImage ? theme.subText : theme.text} />
//                       <Text style={[
//                           styles.actionButtonText, 
//                           { color: theme.text, fontSize: 16 * scale }, 
//                           processedImage && { color: theme.subText }
//                       ]}>
//                         {processedImage ? "Done" : "Identify"}
//                       </Text>
//                     </>
//                   )}
//                 </TouchableOpacity>

//                 {/* Save Button */}
//                 <TouchableOpacity 
//                   style={[styles.actionButton, { backgroundColor: theme.cardBg }]} 
//                   onPress={handleSave}
//                 >
//                   <Ionicons name="download-outline" size={22 * scale} color={theme.text} />
//                   <Text style={[styles.actionButtonText, { color: theme.text, fontSize: 16 * scale }]}>
//                     Save
//                   </Text>
//                 </TouchableOpacity>
//               </View>
              
//               <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
//                 <Text style={[styles.secondaryButtonText, { color: theme.subText, fontSize: 14 * scale }]}>
//                     Choose a different photo
//                 </Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// // 5. Styles (Structural styles remain static, Colors/Sizes moved to inline)
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     alignItems: 'center',
//   },
//   headerTitle: {
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
//     height: width - 40,
//     borderWidth: 2,
//     borderStyle: 'dashed',
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   iconCircle: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   placeholderText: {
//     fontWeight: '600',
//     marginBottom: 5,
//   },
//   subText: {
//     // Dynamic styles applied inline
//   },
//   imageWrapper: {
//     width: width - 40,
//     height: (width - 40) * 1.25,
//     borderRadius: 20,
//     overflow: 'hidden',
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
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
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   enhancedBadgeText: {
//     color: '#FFF',
//     fontWeight: 'bold',
//     marginLeft: 6,
//   },
//   controlsContainer: {
//     paddingBottom: Platform.OS === 'ios' ? 0 : 20,
//   },
//   primaryButton: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 16,
//     borderRadius: 16,
//   },
//   buttonText: {
//     color: '#FFF',
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
//     elevation: 2, // Slight shadow for buttons
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   actionButtonText: {
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
//   secondaryButton: {
//     alignItems: 'center',
//     padding: 10,
//   },
//   secondaryButtonText: {
//     // Dynamic size/color applied inline
//   },
// });