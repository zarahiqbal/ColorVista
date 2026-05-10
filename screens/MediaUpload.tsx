// import { Ionicons } from "@expo/vector-icons";
// import * as FileSystem from "expo-file-system/legacy";
// import * as ImagePicker from "expo-image-picker";
// import * as MediaLibrary from "expo-media-library";
// import { useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// import { useTheme } from "@/Context/ThemeContext";
// import ColorDetectionPanel from "@/components/ColorDetectionPanel";
// import InteractiveImageViewer from "@/components/InteractiveImageViewer";
// import { DetectedColor } from "@/constants/colorPickerUtils";

// const { width } = Dimensions.get("window");

// // REPLACE WITH YOUR COMPUTER'S LOCAL IP ADDRESS
// const SERVER_URL = "http://10.135.50.103:5000/process-image";

// export default function MediaUpload() {
//   const { darkMode, getFontSizeMultiplier, colorBlindMode } = useTheme();
//   const scale = getFontSizeMultiplier();

//   const styles = useMemo(() => {
//     const palette = {
//       beigeBg: "#F6F3EE",
//       charcoal: "#2F2F2F",
//       sage: "#8DA399",
//       taupe: "#A9927D",
//       textDark: "#1C1C1E",
//       textLight: "#6B6661",
//       white: "#FFFFFF",
//       surfaceDark: "#121212",
//       cardDark: "#1E1E1E",
//     };

//     const colors = {
//       background: darkMode ? palette.surfaceDark : palette.beigeBg,
//       cardSurface: darkMode ? palette.cardDark : palette.sage,
//       cardSurfaceActive: darkMode ? "#000000" : palette.white,
//       textPrimary: darkMode ? "#FFFFFF" : palette.textDark,
//       textSecondary: darkMode ? "#A1A1A1" : palette.textLight,
//       textOnBrand: "#FFFFFF",
//       buttonPrimary: darkMode ? "#3a3a3c" : palette.charcoal,
//       border: darkMode ? "#333333" : palette.sage,
//       iconColor: darkMode ? "#FFFFFF" : palette.charcoal,
//     };

//     return StyleSheet.create({
//       container: {
//         flex: 1,
//         backgroundColor: colors.background,
//       },
//       header: {
//         paddingHorizontal: 24,
//         paddingVertical: 20,
//         alignItems: "center",
//       },
//       headerTitle: {
//         fontSize: 24 * scale,
//         fontWeight: "800",
//         color: colors.textPrimary,
//         letterSpacing: -0.5,
//       },
//       headerSubtitle: {
//         fontSize: 14 * scale,
//         color: colors.textSecondary,
//         marginTop: 4,
//         fontWeight: "500",
//       },
//       content: {
//         flex: 1,
//         justifyContent: "space-between",
//         paddingHorizontal: 24,
//         paddingBottom: 40,
//       },
//       previewContainer: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         marginVertical: 10,
//       },
//       placeholderContainer: {
//         width: "100%",
//         aspectRatio: 1.1,
//         backgroundColor: colors.cardSurface,
//         borderRadius: 30,
//         justifyContent: "center",
//         alignItems: "center",
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 8 },
//         shadowOpacity: darkMode ? 0.3 : 0.15,
//         shadowRadius: 12,
//         elevation: 6,
//         padding: 20,
//         borderWidth: darkMode ? 1 : 0,
//         borderColor: "#333",
//       },
//       placeholderIconCircle: {
//         width: 70,
//         height: 70,
//         borderRadius: 35,
//         backgroundColor: darkMode
//           ? "rgba(255, 255, 255, 0.1)"
//           : "rgba(255, 255, 255, 0.25)",
//         justifyContent: "center",
//         alignItems: "center",
//         marginBottom: 16,
//       },
//       placeholderText: {
//         fontSize: 20 * scale,
//         fontWeight: "700",
//         color: darkMode ? "#FFFFFF" : palette.charcoal,
//         marginBottom: 8,
//         textAlign: "center",
//       },
//       placeholderSubText: {
//         fontSize: 14 * scale,
//         color: darkMode ? "#FFFFFF" : palette.charcoal,
//         opacity: 0.7,
//         textAlign: "center",
//       },
//       imageWrapper: {
//         width: "100%",
//         aspectRatio: 3 / 4,
//         borderRadius: 30,
//         backgroundColor: colors.cardSurfaceActive,
//         overflow: "hidden",
//         borderWidth: 4,
//         borderColor: darkMode ? "#333" : palette.charcoal,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 8 },
//         shadowOpacity: 0.4,
//         shadowRadius: 16,
//         elevation: 8,
//       },
//       previewImage: {
//         width: "100%",
//         height: "100%",
//       },
//       closeButton: {
//         position: "absolute",
//         top: 20,
//         right: 20,
//         zIndex: 10,
//         backgroundColor: "rgba(0,0,0,0.6)",
//         borderRadius: 20,
//         padding: 4,
//       },
//       enhancedBadge: {
//         position: "absolute",
//         bottom: 20,
//         alignSelf: "center",
//         paddingHorizontal: 16,
//         paddingVertical: 10,
//         borderRadius: 20,
//         backgroundColor: palette.charcoal,
//         flexDirection: "row",
//         alignItems: "center",
//       },
//       enhancedBadgeText: {
//         color: "#FFFFFF",
//         fontWeight: "700",
//         fontSize: 12 * scale,
//         marginLeft: 8,
//         letterSpacing: 0.5,
//       },
//       controlsContainer: {
//         gap: 16,
//       },
//       primaryButton: {
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: colors.buttonPrimary,
//         paddingVertical: 18,
//         borderRadius: 32,
//         elevation: 4,
//       },
//       buttonText: {
//         color: "#FFFFFF",
//         fontWeight: "700",
//         fontSize: 17 * scale,
//         marginLeft: 10,
//       },
//       buttonRow: {
//         flexDirection: "row",
//         gap: 12,
//       },
//       actionButton: {
//         flex: 1,
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center",
//         paddingVertical: 18,
//         borderRadius: 24,
//       },
//       identifyBtn: {
//         backgroundColor: palette.taupe,
//       },
//       saveBtn: {
//         backgroundColor: palette.sage,
//       },
//       colorPickerBtn: {
//         backgroundColor: "#6B5ACD",
//       },
//       actionButtonText: {
//         color: "#FFFFFF",
//         fontWeight: "700",
//         fontSize: 16 * scale,
//         marginLeft: 8,
//       },
//       disabledButton: {
//         backgroundColor: "#555",
//         opacity: 0.6,
//       },
//       secondaryButton: {
//         alignItems: "center",
//         padding: 12,
//       },
//       secondaryButtonText: {
//         color: colors.textSecondary,
//         fontSize: 15 * scale,
//         fontWeight: "600",
//       },
//       savedColorsContainer: {
//         paddingHorizontal: 12,
//         marginBottom: 12,
//         flexDirection: "row",
//         flexWrap: "wrap",
//         gap: 8,
//       },
//       colorTag: {
//         flexDirection: "row",
//         alignItems: "center",
//         paddingHorizontal: 10,
//         paddingVertical: 6,
//         borderRadius: 16,
//         backgroundColor: "rgba(0, 0, 0, 0.1)",
//         gap: 6,
//       },
//       colorTagText: {
//         fontSize: 12 * scale,
//         fontWeight: "600",
//       },
//       colorSwatch: {
//         width: 16,
//         height: 16,
//         borderRadius: 8,
//         borderWidth: 1,
//         borderColor: "rgba(0, 0, 0, 0.2)",
//       },
//     });
//   }, [darkMode, scale]);

//   const [image, setImage] = useState<string | null>(null);
//   const [processedImage, setProcessedImage] = useState<string | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
//   const [colorPickerActive, setColorPickerActive] = useState(false);
//   const [detectedColor, setDetectedColor] = useState<DetectedColor | null>(
//     null,
//   );
//   const [colorPanelVisible, setColorPanelVisible] = useState(false);
//   const [savedColors, setSavedColors] = useState<DetectedColor[]>([]);

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permission needed", "We need camera roll permissions!");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//       setProcessedImage(null);
//       setColorPickerActive(false);
//       setSavedColors([]);
//     }
//   };

//   const handleDetectColors = async () => {
//     if (!image) return;
//     setIsProcessing(true);
//     try {
//       const base64 = await FileSystem.readAsStringAsync(image, {
//         encoding: FileSystem.EncodingType.Base64,
//       });

//       const response = await fetch(SERVER_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           image: base64,
//           cvd_mode: colorBlindMode,
//           lossless: true,
//         }),
//       });

//       if (!response.ok) throw new Error("Server error");
//       const data = await response.json();
//       const imageFormat = data.image_format || "jpeg";
//       setProcessedImage(
//         `data:image/${imageFormat};base64,${data.processed_image}`,
//       );
//     } catch (error) {
//       Alert.alert("Error", "Could not process image.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       if (permissionResponse?.status !== "granted") {
//         const { status } = await requestPermission();

//         if (status !== "granted") {
//           Alert.alert("Permission Denied", "Gallery permission is required.");
//           return;
//         }
//       }

//       // If processed image exists (base64)
//       if (processedImage) {
//         const fileUri =
//           FileSystem.cacheDirectory + `enhanced_${Date.now()}.jpg`;

//         // Remove data:image/jpeg;base64, prefix
//         const base64Data = processedImage.replace(
//           /^data:image\/\w+;base64,/,
//           "",
//         );

//         // Write image to temporary file
//         await FileSystem.writeAsStringAsync(fileUri, base64Data, {
//           encoding: FileSystem.EncodingType.Base64,
//         });

//         // Save file to gallery
//         await MediaLibrary.createAssetAsync(fileUri);

//         Alert.alert("Saved", "Enhanced image saved to gallery!");
//         return;
//       }

//       // Save original image directly
//       if (image) {
//         await MediaLibrary.createAssetAsync(image);

//         Alert.alert("Saved", "Image saved to gallery!");
//       }
//     } catch (error) {
//       console.log(error);
//       Alert.alert("Error", "Could not save image.");
//     }
//   };

//   const handleReset = () => {
//     setImage(null);
//     setProcessedImage(null);
//     setColorPickerActive(false);
//     setSavedColors([]);
//     setDetectedColor(null);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Upload Media</Text>
//         <Text style={styles.headerSubtitle}>
//           Analyze photos & pick colors in real-time
//         </Text>
//       </View>

//       <View style={styles.content}>
//         <View style={styles.previewContainer}>
//           {image ? (
//             <>
//               {colorPickerActive ? (
//                 <View style={styles.imageWrapper}>
//                   <InteractiveImageViewer
//                     imageUri={processedImage || image}
//                     containerWidth={width - 48}
//                     containerHeight={width - 48}
//                     onColorDetected={handleColorDetected}
//                     darkMode={darkMode}
//                     pointerStyle="magnifier"
//                     magnifierRadius={50}
//                   />
//                 </View>
//               ) : (
//                 <View style={styles.imageWrapper}>
//                   <Image
//                     source={{ uri: processedImage || image }}
//                     style={styles.previewImage}
//                     resizeMode="cover"
//                   />
//                   {processedImage && (
//                     <View style={styles.enhancedBadge}>
//                       <Ionicons
//                         name="checkmark-done-circle"
//                         size={16 * scale}
//                         color="#FFF"
//                       />
//                       <Text style={styles.enhancedBadgeText}>
//                         ANALYSIS COMPLETE
//                       </Text>
//                     </View>
//                   )}
//                 </View>
//               )}
//               <TouchableOpacity
//                 style={styles.closeButton}
//                 onPress={handleReset}
//               >
//                 <Ionicons name="close" size={20 * scale} color="#FFF" />
//               </TouchableOpacity>
//             </>
//           ) : (
//             <TouchableOpacity
//               style={styles.placeholderContainer}
//               onPress={pickImage}
//             >
//               <View style={styles.placeholderIconCircle}>
//                 <Ionicons
//                   name="images"
//                   size={32 * scale}
//                   color={darkMode ? "#FFF" : "#2F2F2F"}
//                 />
//               </View>
//               <Text style={styles.placeholderText}>Choose from Gallery</Text>
//               <Text style={styles.placeholderSubText}>
//                 Tap to upload an image
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {savedColors.length > 0 && (
//           <View style={styles.savedColorsContainer}>
//             {savedColors.map((color, index) => (
//               <View
//                 key={index}
//                 style={[
//                   styles.colorTag,
//                   {
//                     backgroundColor: darkMode
//                       ? "rgba(255, 255, 255, 0.1)"
//                       : "rgba(0, 0, 0, 0.05)",
//                   },
//                 ]}
//               >
//                 <View
//                   style={[styles.colorSwatch, { backgroundColor: color.hex }]}
//                 />
//                 <Text
//                   style={[
//                     styles.colorTagText,
//                     { color: darkMode ? "#FFFFFF" : "#000000" },
//                   ]}
//                 >
//                   {color.name}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         )}

//         <View style={styles.controlsContainer}>
//           {!image ? (
//             <TouchableOpacity style={styles.primaryButton} onPress={pickImage}>
//               <Ionicons
//                 name="add-circle-outline"
//                 size={24 * scale}
//                 color="#FFF"
//               />
//               <Text style={styles.buttonText}>Open Gallery</Text>
//             </TouchableOpacity>
//           ) : (
//             <>
//               <View style={styles.buttonRow}>
//                 <TouchableOpacity
//                   style={[styles.actionButton, styles.colorPickerBtn]}
//                   onPress={() => setColorPickerActive(!colorPickerActive)}
//                 >
//                   <Ionicons
//                     name="color-palette-outline"
//                     size={20 * scale}
//                     color="#FFF"
//                   />
//                   <Text style={styles.actionButtonText}>
//                     {colorPickerActive ? "Exit Picker" : "Pick Colors"}
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={[
//                     styles.actionButton,
//                     styles.identifyBtn,
//                     processedImage && styles.disabledButton,
//                   ]}
//                   onPress={handleDetectColors}
//                   disabled={!!processedImage || isProcessing}
//                 >
//                   {isProcessing ? (
//                     <ActivityIndicator color="#FFF" />
//                   ) : (
//                     <>
//                       <Ionicons name="scan" size={20 * scale} color="#FFF" />
//                       <Text style={styles.actionButtonText}>
//                         {processedImage ? "Analyzed" : "Identify"}
//                       </Text>
//                     </>
//                   )}
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.buttonRow}>
//                 <TouchableOpacity
//                   style={[styles.actionButton, styles.saveBtn]}
//                   onPress={handleSave}
//                 >
//                   <Ionicons
//                     name="download-outline"
//                     size={20 * scale}
//                     color="#FFF"
//                   />
//                   <Text style={styles.actionButtonText}>Save Image</Text>
//                 </TouchableOpacity>
//               </View>

//               <TouchableOpacity
//                 style={styles.secondaryButton}
//                 onPress={pickImage}
//               >
//                 <Text style={styles.secondaryButtonText}>
//                   Choose a different photo
//                 </Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//       </View>

//       <ColorDetectionPanel
//         color={detectedColor}
//         visible={colorPanelVisible}
//         onClose={() => setColorPanelVisible(false)}
//         onSave={handleSaveColor}
//         darkMode={darkMode}
//       />
//     </SafeAreaView>
//   );
// }
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import the Theme Hook
import { useTheme } from "@/Context/ThemeContext";

const { width } = Dimensions.get("window");

// REPLACE WITH YOUR COMPUTER'S LOCAL IP ADDRESS
const SERVER_URL = "http://192.168.100.231:5000/process-image";

export default function MediaUpload() {
  // Consume Theme Context
  const { darkMode, getFontSizeMultiplier, colorBlindMode } = useTheme();
  const scale = getFontSizeMultiplier();

  // Define Theme & Palette
  const styles = useMemo(() => {
    const palette = {
      beigeBg: "#F6F3EE", // Light Mode Bg
      charcoal: "#2F2F2F", // Primary Dark
      sage: "#8DA399", // Easy Mode Green
      taupe: "#A9927D", // Hard Mode Brown
      textDark: "#1C1C1E", // Dark Text
      textLight: "#6B6661", // Muted Text
      white: "#FFFFFF",
      surfaceDark: "#121212", // Deeper Dark Mode Bg
      cardDark: "#1E1E1E", // Dark Mode Card
    };

    const colors = {
      background: darkMode ? palette.surfaceDark : palette.beigeBg,
      cardSurface: darkMode ? palette.cardDark : palette.sage,
      cardSurfaceActive: darkMode ? "#000000" : palette.white,
      textPrimary: darkMode ? "#FFFFFF" : palette.textDark,
      textSecondary: darkMode ? "#A1A1A1" : palette.textLight,
      // For text inside the Sage/Taupe buttons specifically
      textOnBrand: "#FFFFFF",
      // For text inside the placeholder (which is Sage in Light Mode)
      textOnPlaceholder: darkMode ? "#FFFFFF" : palette.charcoal,
      buttonPrimary: darkMode ? "#3a3a3c" : palette.charcoal,
      border: darkMode ? "#333333" : palette.sage,
      iconColor: darkMode ? "#FFFFFF" : palette.charcoal,
    };

    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      header: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        alignItems: "center",
      },
      headerTitle: {
        fontSize: 24 * scale,
        fontWeight: "800",
        color: colors.textPrimary,
        letterSpacing: -0.5,
      },
      headerSubtitle: {
        fontSize: 14 * scale,
        color: colors.textSecondary,
        marginTop: 4,
        fontWeight: "500",
      },
      content: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingBottom: 40,
      },
      previewContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
      },
      placeholderContainer: {
        width: "100%",
        aspectRatio: 1.1,
        backgroundColor: colors.cardSurface,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: darkMode ? 0.3 : 0.15,
        shadowRadius: 12,
        elevation: 6,
        padding: 20,
        borderWidth: darkMode ? 1 : 0,
        borderColor: "#333",
      },
      placeholderIconCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: darkMode
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(255, 255, 255, 0.25)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
      },
      placeholderText: {
        fontSize: 20 * scale,
        fontWeight: "700",
        color: colors.textOnPlaceholder,
        marginBottom: 8,
        textAlign: "center",
      },
      placeholderSubText: {
        fontSize: 14 * scale,
        color: colors.textOnPlaceholder,
        opacity: 0.7,
        textAlign: "center",
      },
      imageWrapper: {
        width: "100%",
        aspectRatio: 3 / 4,
        borderRadius: 30,
        backgroundColor: colors.cardSurfaceActive,
        overflow: "hidden",
        borderWidth: 4,
        borderColor: darkMode ? "#333" : palette.charcoal,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
      },
      previewImage: {
        width: "100%",
        height: "100%",
      },
      closeButton: {
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 10,
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 20,
        padding: 4,
      },
      enhancedBadge: {
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: palette.charcoal,
        flexDirection: "row",
        alignItems: "center",
      },
      enhancedBadgeText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 12 * scale,
        marginLeft: 8,
        letterSpacing: 0.5,
      },
      controlsContainer: {
        gap: 16,
      },
      primaryButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.buttonPrimary,
        paddingVertical: 18,
        borderRadius: 32,
        elevation: 4,
      },
      buttonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 17 * scale,
        marginLeft: 10,
      },
      buttonRow: {
        flexDirection: "row",
        gap: 12,
      },
      actionButton: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 18,
        borderRadius: 24,
      },
      identifyBtn: {
        backgroundColor: palette.taupe,
      },
      saveBtn: {
        backgroundColor: palette.sage,
      },
      actionButtonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 16 * scale,
        marginLeft: 8,
      },
      disabledButton: {
        backgroundColor: "#555",
        opacity: 0.6,
      },
      secondaryButton: {
        alignItems: "center",
        padding: 12,
      },
      secondaryButtonText: {
        color: colors.textSecondary,
        fontSize: 15 * scale,
        fontWeight: "600",
      },
    });
  }, [darkMode, scale]);

  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "We need camera roll permissions!");
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

  const handleDetectColors = async () => {
    if (!image) return;
    setIsProcessing(true);
    try {
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await fetch(SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64,
          cvd_mode: colorBlindMode,
          lossless: true,
        }),
      });

      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      const imageFormat = data.image_format || "jpeg";
      setProcessedImage(
        `data:image/${imageFormat};base64,${data.processed_image}`,
      );
    } catch (error) {
      Alert.alert("Error", "Could not process image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    try {
      if (permissionResponse?.status !== "granted") {
        const { status } = await requestPermission();

        if (status !== "granted") {
          Alert.alert("Permission Denied", "Gallery permission is required.");
          return;
        }
      }

      // If processed image exists (base64)
      if (processedImage) {
        const fileUri =
          FileSystem.cacheDirectory + `enhanced_${Date.now()}.jpg`;

        // Remove data:image/jpeg;base64, prefix
        const base64Data = processedImage.replace(
          /^data:image\/\w+;base64,/,
          "",
        );

        // Write image to temporary file
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Save file to gallery
        await MediaLibrary.createAssetAsync(fileUri);

        Alert.alert("Saved", "Enhanced image saved to gallery!");
        return;
      }

      // Save original image directly
      if (image) {
        await MediaLibrary.createAssetAsync(image);

        Alert.alert("Saved", "Image saved to gallery!");
      }
    } catch (error) {
      console.log(error);
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
        <Text style={styles.headerTitle}>Upload Media</Text>
        <Text style={styles.headerSubtitle}>Analyze existing photos</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.previewContainer}>
          {image ? (
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: processedImage || image }}
                style={styles.previewImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleReset}
              >
                <Ionicons name="close" size={20 * scale} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.placeholderContainer}
              onPress={pickImage}
            >
              <View style={styles.placeholderIconCircle}>
                <Ionicons
                  name="images"
                  size={32 * scale}
                  color={darkMode ? "#FFF" : "#2F2F2F"}
                />
              </View>
              <Text style={styles.placeholderText}>Choose from Gallery</Text>
              <Text style={styles.placeholderSubText}>Tap here to upload</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.controlsContainer}>
          {!image ? (
            <TouchableOpacity style={styles.primaryButton} onPress={pickImage}>
              <Ionicons
                name="add-circle-outline"
                size={24 * scale}
                color="#FFF"
              />
              <Text style={styles.buttonText}>Open Gallery</Text>
            </TouchableOpacity>
          ) : (
            <>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.identifyBtn,
                    processedImage && styles.disabledButton,
                  ]}
                  onPress={handleDetectColors}
                  disabled={!!processedImage || isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.actionButtonText}>Identify</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.saveBtn]}
                  onPress={handleSave}
                >
                  <Text style={styles.actionButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={pickImage}
              >
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
