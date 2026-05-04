// import { Ionicons } from "@expo/vector-icons";
// import * as FileSystem from "expo-file-system/legacy";
// import * as ImagePicker from "expo-image-picker";
// import * as MediaLibrary from "expo-media-library";
// import { StatusBar } from "expo-status-bar";
// import { useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useUserData } from "./Context/useUserData";

// interface EnhancerScreenProps {
//   onSaveImage: (imageUri?: string) => void;
//   onSavePreferences: () => void;
//   onApplySystem: () => void;
// }

// type CVDType = "none" | "deuteranopia" | "protanopia" | "tritanopia";

// const SERVER_URL = "http://172.20.10.3:5000/process-image";

// const normalizeCvdType = (rawType?: string | null): CVDType => {
//   if (!rawType) return "none";

//   const normalized = rawType.toLowerCase().trim();

//   if (normalized.includes("protan") && normalized.includes("deuter")) {
//     return "deuteranopia";
//   }

//   if (normalized.includes("protan")) return "protanopia";
//   if (normalized.includes("deuter")) return "deuteranopia";
//   if (normalized.includes("tritan")) return "tritanopia";

//   if (
//     normalized.includes("normal") ||
//     normalized.includes("none") ||
//     normalized.includes("no cvd")
//   ) {
//     return "none";
//   }

//   return "deuteranopia";
// };

// export default function EnhancerScreen({ onSaveImage }: EnhancerScreenProps) {
//   const { userData } = useUserData();

//   const [imageUri, setImageUri] = useState(
//     "https://picsum.photos/id/28/600/400",
//   );
//   const [enhancedImageUri, setEnhancedImageUri] = useState<string | null>(null);
//   const [isEnhancing, setIsEnhancing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [showOriginal, setShowOriginal] = useState(false);

//   const dbCvdType = useMemo(
//     () => normalizeCvdType(userData?.cvdType),
//     [userData?.cvdType],
//   );

//   const imageToDisplay =
//     showOriginal || !enhancedImageUri ? imageUri : enhancedImageUri;

//   const cvdTypeDescription: Record<CVDType, string> = {
//     none: "No CVD correction",
//     deuteranopia: "Deuteranopia correction",
//     protanopia: "Protanopia correction",
//     tritanopia: "Tritanopia correction",
//   };

//   const enhanceImageForUri = async (
//     targetUri: string,
//   ): Promise<string | null> => {
//     if (!targetUri || targetUri.startsWith("http")) {
//       return null;
//     }

//     if (dbCvdType === "none") {
//       setEnhancedImageUri(targetUri);
//       return targetUri;
//     }

//     try {
//       setIsEnhancing(true);

//       const base64 = await FileSystem.readAsStringAsync(targetUri, {
//         encoding: "base64" as any,
//       });

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 30000);

//       const response = await fetch(SERVER_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           image: base64,
//           cvd_mode: dbCvdType,
//           mode: "full",
//         }),
//         signal: controller.signal,
//       });

//       clearTimeout(timeoutId);

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Server error (${response.status}): ${errorText}`);
//       }

//       const data = await response.json();
//       if (!data?.processed_image) {
//         throw new Error("No processed image received from server.");
//       }

//       const dataUri = `data:image/jpeg;base64,${data.processed_image}`;
//       setEnhancedImageUri(dataUri);
//       return dataUri;
//     } catch (error: any) {
//       const message = error?.message || String(error);
//       const isNetworkIssue =
//         message.toLowerCase().includes("network") ||
//         message.toLowerCase().includes("abort");

//       Alert.alert(
//         isNetworkIssue ? "Connection Error" : "Enhancement failed",
//         isNetworkIssue
//           ? "Could not reach enhancement server. Verify SERVER_URL and make sure the backend is running."
//           : message,
//       );
//       return null;
//     } finally {
//       setIsEnhancing(false);
//     }
//   };

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert(
//         "Permission needed",
//         "Sorry, we need camera roll permissions to make this work!",
//       );
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ["images"],
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const selectedUri = result.assets[0].uri;
//       setImageUri(selectedUri);
//       setEnhancedImageUri(null);
//       await enhanceImageForUri(selectedUri);
//     }
//   };

//   const saveImageToLibrary = async () => {
//     try {
//       setIsSaving(true);

//       let targetUri = enhancedImageUri;
//       if (!targetUri) {
//         targetUri = await enhanceImageForUri(imageUri);
//       }

//       if (!targetUri) {
//         Alert.alert("No image", "Please upload an image first.");
//         return;
//       }

//       const { status } = await MediaLibrary.requestPermissionsAsync(true, [
//         "photo",
//       ]);
//       if (status !== "granted") {
//         Alert.alert(
//           "Permission required",
//           "We need photo library permission to save your image.",
//         );
//         return;
//       }

//       let assetUri = targetUri;
//       if (targetUri.startsWith("data:image")) {
//         const base64Code = targetUri.replace(
//           /^data:image\/[a-zA-Z]+;base64,/,
//           "",
//         );
//         const docDir =
//           (FileSystem as any).cacheDirectory ||
//           (FileSystem as any).documentDirectory;
//         const fileName = `${docDir}enhanced_cvd_${Date.now()}.jpg`;
//         await FileSystem.writeAsStringAsync(fileName, base64Code, {
//           encoding: "base64" as any,
//         });
//         assetUri = fileName;
//       }

//       await MediaLibrary.createAssetAsync(assetUri);
//       onSaveImage?.(assetUri);
//       Alert.alert("Saved", "Enhanced image downloaded to your gallery.");
//     } catch (_error) {
//       Alert.alert("Save failed", "Could not save the enhanced image.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar style="auto" />

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <Text style={styles.headerTitle}>
//           IMAGE <Text style={styles.headerTitleEnhancer}>ENHANCER</Text>
//         </Text>

//         <Text style={styles.infoText}>
//           Stored CVD type: {dbCvdType.toUpperCase()}
//         </Text>
//         <Text style={styles.infoSubText}>
//           {isEnhancing
//             ? "Enhancing automatically based on your stored profile..."
//             : `Active correction: ${cvdTypeDescription[dbCvdType]}`}
//         </Text>

//         <View style={styles.imageCard}>
//           <View style={styles.imageWrapper}>
//             <Image
//               source={{ uri: imageToDisplay }}
//               style={styles.originalImage}
//               resizeMode="cover"
//             />

//             <TouchableOpacity
//               style={styles.compareButton}
//               disabled={!enhancedImageUri}
//               onPressIn={() => setShowOriginal(true)}
//               onPressOut={() => setShowOriginal(false)}
//             >
//               <Text style={styles.compareButtonText}>
//                 {!enhancedImageUri
//                   ? "Upload image to compare"
//                   : showOriginal
//                     ? "Showing Original"
//                     : "Hold to View Original"}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <TouchableOpacity
//           style={[styles.mainActionButton, { backgroundColor: "#a1584c" }]}
//           disabled={isEnhancing}
//           onPress={pickImage}
//         >
//           {isEnhancing ? (
//             <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
//           ) : (
//             <Ionicons
//               name="image-outline"
//               size={20}
//               color="#fff"
//               style={{ marginRight: 8 }}
//             />
//           )}
//           <Text style={styles.mainActionButtonText}>
//             {isEnhancing ? "ENHANCING..." : "UPLOAD & AUTO-ENHANCE"}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.mainActionButton,
//             { backgroundColor: isSaving ? "#8f8f8f" : "#262626" },
//           ]}
//           disabled={isSaving || isEnhancing}
//           onPress={saveImageToLibrary}
//         >
//           {isSaving ? (
//             <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
//           ) : (
//             <Ionicons
//               name="download-outline"
//               size={20}
//               color="#fff"
//               style={{ marginRight: 8 }}
//             />
//           )}
//           <Text style={styles.mainActionButtonText}>
//             {isSaving ? "DOWNLOADING..." : "DOWNLOAD ENHANCED IMAGE"}
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   scrollContent: {
//     paddingHorizontal: 16,
//     paddingBottom: 20,
//     alignItems: "center",
//   },
//   headerTitle: {
//     fontSize: 24,
//     color: "#43372f",
//     marginBottom: 14,
//     textAlign: "center",
//   },
//   headerTitleEnhancer: { color: "#a1584c" },
//   infoText: {
//     width: "100%",
//     color: "#43372f",
//     fontSize: 14,
//     fontWeight: "700",
//     marginBottom: 4,
//   },
//   infoSubText: {
//     width: "100%",
//     color: "#6b5c53",
//     fontSize: 13,
//     marginBottom: 14,
//   },
//   imageCard: {
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     padding: 12,
//     marginBottom: 16,
//     width: "100%",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   imageWrapper: {
//     position: "relative",
//     overflow: "hidden",
//     borderRadius: 16,
//     aspectRatio: 3 / 2,
//     backgroundColor: "#eee",
//   },
//   originalImage: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//   },
//   compareButton: {
//     position: "absolute",
//     bottom: 12,
//     right: 12,
//     backgroundColor: "rgba(255,255,255,0.65)",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   compareButtonText: { color: "#43372f", fontSize: 10, fontWeight: "bold" },
//   mainActionButton: {
//     flexDirection: "row",
//     borderRadius: 30,
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     width: "100%",
//     marginBottom: 12,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   mainActionButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
// });
// import { Ionicons } from "@expo/vector-icons";
// import * as FileSystem from "expo-file-system/legacy";
// import * as ImagePicker from "expo-image-picker";
// import * as MediaLibrary from "expo-media-library";
// import { StatusBar } from "expo-status-bar";
// import { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useTheme } from "./Context/ThemeContext";
// import { useUserData } from "./Context/useUserData";

// interface EnhancerScreenProps {
//   onSaveImage: (imageUri?: string) => void;
// }

// type CVDType = "none" | "deuteranopia" | "protanopia" | "tritanopia";
// const SERVER_URL = "http://172.20.10.3:5000/process-image";

// export default function EnhancerScreen({ onSaveImage }: EnhancerScreenProps) {
//   const { userData } = useUserData();

//   // ── State ──
//   const [imageUri, setImageUri] = useState(
//     "https://picsum.photos/id/28/600/400",
//   );
//   const [enhancedImageUri, setEnhancedImageUri] = useState<string | null>(null);
//   const [isEnhancing, setIsEnhancing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [showOriginal, setShowOriginal] = useState(false);
//   const [aspectRatio, setAspectRatio] = useState(1.5);

//   // ── CVD Normalization ──
//   const dbCvdType = useMemo(() => {
//     const raw = userData?.cvdType?.toLowerCase() || "none";
//     if (raw.includes("protan")) return "protanopia";
//     if (raw.includes("tritan")) return "tritanopia";
//     if (raw.includes("deuter")) return "deuteranopia";
//     return "none";
//   }, [userData?.cvdType]);

//   const { darkMode, fontSize, getFontSizeMultiplier } = useTheme();
//   const textScale = getFontSizeMultiplier();

//   // Handle initial image ratio
//   useEffect(() => {
//     Image.getSize(imageUri, (w, h) => setAspectRatio(w / h));
//   }, []);

//   // ── Image Picker ──
//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permission Denied", "Gallery access is required.");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const asset = result.assets[0];
//       setImageUri(asset.uri);
//       setEnhancedImageUri(null);
//       setAspectRatio(asset.width / asset.height);

//       // Auto-start server processing
//       enhanceImage(asset.uri);
//     }
//   };

//   // ── Server Logic ──
//   const enhanceImage = async (uri: string) => {
//     try {
//       setIsEnhancing(true);
//       const base64 = await FileSystem.readAsStringAsync(uri, {
//         encoding: "base64" as any,
//       });

//       const response = await fetch(SERVER_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           image: base64,
//           cvd_mode: dbCvdType,
//           mode: "full",
//         }),
//       });

//       const data = await response.json();
//       if (data.processed_image) {
//         setEnhancedImageUri(`data:image/jpeg;base64,${data.processed_image}`);
//       }
//     } catch (e) {
//       Alert.alert(
//         "Connection Error",
//         "Could not connect to the enhancement server.",
//       );
//     } finally {
//       setIsEnhancing(false);
//     }
//   };

//   // ── Save Logic (Fixed) ──
//   const saveImageToLibrary = async () => {
//     try {
//       setIsSaving(true);
//       const targetUri = enhancedImageUri || imageUri;

//       // Request permissions with 'writeOnly' intent
//       const { status } = await MediaLibrary.requestPermissionsAsync(true);
//       if (status !== "granted") {
//         Alert.alert("Permission Denied", "Cannot save without gallery access.");
//         return;
//       }

//       let fileUri = targetUri;

//       // If it's a base64 data string, write to file first
//       if (targetUri.startsWith("data:image")) {
//         const base64Data = targetUri.split("base64,")[1];
//         const filename = `${FileSystem.cacheDirectory}saved_img_${Date.now()}.jpg`;

//         await FileSystem.writeAsStringAsync(filename, base64Data, {
//           encoding: FileSystem.EncodingType.Base64,
//         });
//         fileUri = filename;
//       }

//       await MediaLibrary.createAssetAsync(fileUri);
//       onSaveImage?.(fileUri);
//       Alert.alert("Success ✅", "Image saved to your photo gallery.");
//     } catch (err: any) {
//       Alert.alert("Save Failed", err.message || "An error occurred.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <SafeAreaView
//       style={[
//         styles.container,
//         { backgroundColor: darkMode ? "#111" : "#F7F5F0" },
//       ]}
//     >
//       <StatusBar style={darkMode ? "light" : "dark"} />
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.header}>
//           <Text
//             style={[
//               styles.title,
//               {
//                 color: darkMode ? "#F7F5F0" : "#43372f",
//                 fontSize: 26 * textScale,
//               },
//             ]}
//           >
//             IMAGE{" "}
//             <Text style={{ color: darkMode ? "#f2c9ad" : "#a1584c" }}>
//               ENHANCER
//             </Text>
//           </Text>
//           <Text
//             style={[
//               styles.subtitle,
//               {
//                 color: darkMode ? "#d3c7b8" : "#7A6C61",
//                 fontSize: 13 * textScale,
//               },
//             ]}
//           >
//             Stored Profile: {dbCvdType.toUpperCase()} • Font: {fontSize}
//           </Text>
//         </View>

//         <View
//           style={[
//             styles.card,
//             { backgroundColor: darkMode ? "#1c1c1c" : "#fff" },
//           ]}
//         >
//           <View style={[styles.imageWrapper, { aspectRatio }]}>
//             <Image
//               source={{
//                 uri:
//                   showOriginal || !enhancedImageUri
//                     ? imageUri
//                     : enhancedImageUri,
//               }}
//               style={[
//                 styles.img,
//                 { backgroundColor: darkMode ? "#111" : "#f0f0f0" },
//               ]}
//               resizeMode="contain"
//             />

//             {enhancedImageUri && (
//               <TouchableOpacity
//                 style={[
//                   styles.compareBtn,
//                   {
//                     backgroundColor: darkMode
//                       ? "rgba(255,255,255,0.12)"
//                       : "rgba(255,255,255,0.9)",
//                   },
//                 ]}
//                 onPressIn={() => setShowOriginal(true)}
//                 onPressOut={() => setShowOriginal(false)}
//                 activeOpacity={0.9}
//               >
//                 <Ionicons
//                   name="eye-outline"
//                   size={14}
//                   color={darkMode ? "#fff" : "#43372f"}
//                   style={{ marginRight: 4 }}
//                 />
//                 <Text
//                   style={[
//                     styles.compareText,
//                     { color: darkMode ? "#fff" : "#43372f" },
//                   ]}
//                 >
//                   {showOriginal ? "Showing Original" : "Hold to Compare"}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         <View style={styles.buttonGroup}>
//           <TouchableOpacity
//             style={[
//               styles.btn,
//               { backgroundColor: darkMode ? "#8f6a52" : "#a1584c" },
//             ]}
//             onPress={pickImage}
//             disabled={isEnhancing}
//           >
//             {isEnhancing ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.btnText}>UPLOAD & AUTO-ENHANCE</Text>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.btn,
//               { backgroundColor: darkMode ? "#4d4d4d" : "#262626" },
//               !enhancedImageUri &&
//                 imageUri.startsWith("http") && { opacity: 0.5 },
//             ]}
//             onPress={saveImageToLibrary}
//             disabled={
//               isSaving ||
//               isEnhancing ||
//               (!enhancedImageUri && imageUri.startsWith("http"))
//             }
//           >
//             {isSaving ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.btnText}>DOWNLOAD ENHANCED IMAGE</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F7F5F0" },
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: "center",
//     paddingHorizontal: 20,
//     paddingVertical: 40,
//     alignItems: "center",
//   },
//   header: { alignItems: "center", marginBottom: 25 },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "#43372f",
//     letterSpacing: 0.5,
//   },
//   subtitle: { fontSize: 13, color: "#7A6C61", marginTop: 6, fontWeight: "600" },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 24,
//     padding: 12,
//     width: "100%",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//     marginBottom: 20,
//   },
//   imageWrapper: {
//     width: "100%",
//     borderRadius: 16,
//     overflow: "hidden",
//     backgroundColor: "#f0f0f0",
//   },
//   img: { width: "100%", height: "100%" },
//   compareBtn: {
//     position: "absolute",
//     bottom: 12,
//     right: 12,
//     backgroundColor: "rgba(255,255,255,0.9)",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   compareText: { fontSize: 11, fontWeight: "bold", color: "#43372f" },
//   buttonGroup: { width: "100%", gap: 12 },
//   btn: {
//     paddingVertical: 18,
//     borderRadius: 15,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   btnText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 15,
//     letterSpacing: 0.5,
//   },
// });
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Context & Custom Components
import { useTheme } from "./Context/ThemeContext";
import { useUserData } from "./Context/useUserData";
import BackButton from "./components/BackButton";

interface EnhancerScreenProps {
  onSaveImage: (imageUri?: string) => void;
}

type CVDType = "none" | "deuteranopia" | "protanopia" | "tritanopia";
const SERVER_URL = "http://172.20.10.3:5000/process-image";

export default function EnhancerScreen({ onSaveImage }: EnhancerScreenProps) {
  const { userData } = useUserData();
  const { darkMode, fontSize, getFontSizeMultiplier } = useTheme();
  const textScale = getFontSizeMultiplier();

  // ── State ──
  const [imageUri, setImageUri] = useState(
    "https://picsum.photos/id/28/600/400",
  );
  const [enhancedImageUri, setEnhancedImageUri] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1.5);

  // ── CVD Normalization ──
  const dbCvdType = useMemo(() => {
    const raw = userData?.cvdType?.toLowerCase() || "none";
    if (raw.includes("protan")) return "protanopia";
    if (raw.includes("tritan")) return "tritanopia";
    if (raw.includes("deuter")) return "deuteranopia";
    return "none";
  }, [userData?.cvdType]);

  // Handle initial image ratio
  useEffect(() => {
    Image.getSize(imageUri, (w, h) => setAspectRatio(w / h));
  }, []);

  // ── Image Picker ──
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Gallery access is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setEnhancedImageUri(null);
      setAspectRatio(asset.width / asset.height);

      // Auto-start server processing
      enhanceImage(asset.uri);
    }
  };

  // ── Server Logic ──
  const enhanceImage = async (uri: string) => {
    try {
      setIsEnhancing(true);
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64" as any,
      });

      const response = await fetch(SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64,
          cvd_mode: dbCvdType,
          mode: "full",
        }),
      });

      const data = await response.json();
      if (data.processed_image) {
        setEnhancedImageUri(`data:image/jpeg;base64,${data.processed_image}`);
      }
    } catch (e) {
      Alert.alert(
        "Connection Error",
        "Could not connect to the enhancement server.",
      );
    } finally {
      setIsEnhancing(false);
    }
  };

  // ── Save Logic ──
  const saveImageToLibrary = async () => {
    try {
      setIsSaving(true);
      const targetUri = enhancedImageUri || imageUri;

      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Cannot save without gallery access.");
        return;
      }

      let fileUri = targetUri;

      if (targetUri.startsWith("data:image")) {
        const base64Data = targetUri.split("base64,")[1];
        const filename = `${FileSystem.cacheDirectory}saved_img_${Date.now()}.jpg`;

        await FileSystem.writeAsStringAsync(filename, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        fileUri = filename;
      }

      await MediaLibrary.createAssetAsync(fileUri);
      onSaveImage?.(fileUri);
      Alert.alert("Success ✅", "Image saved to your photo gallery.");
    } catch (err: any) {
      Alert.alert("Save Failed", err.message || "An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: darkMode ? "#111" : "#F7F5F0" },
      ]}
    >
      <StatusBar style={darkMode ? "light" : "dark"} />

      {/* --- BACK BUTTON --- */}
      <View style={styles.backButtonWrapper}>
        <BackButton />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: darkMode ? "#F7F5F0" : "#43372f",
                fontSize: 26 * textScale,
              },
            ]}
          >
            IMAGE{" "}
            <Text style={{ color: darkMode ? "#f2c9ad" : "#a1584c" }}>
              ENHANCER
            </Text>
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: darkMode ? "#d3c7b8" : "#7A6C61",
                fontSize: 13 * textScale,
              },
            ]}
          >
            Stored Profile: {dbCvdType.toUpperCase()} • Font: {fontSize}
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: darkMode ? "#1c1c1c" : "#fff" },
          ]}
        >
          <View style={[styles.imageWrapper, { aspectRatio }]}>
            <Image
              source={{
                uri:
                  showOriginal || !enhancedImageUri
                    ? imageUri
                    : enhancedImageUri,
              }}
              style={[
                styles.img,
                { backgroundColor: darkMode ? "#111" : "#f0f0f0" },
              ]}
              resizeMode="contain"
            />

            {enhancedImageUri && (
              <TouchableOpacity
                style={[
                  styles.compareBtn,
                  {
                    backgroundColor: darkMode
                      ? "rgba(255,255,255,0.12)"
                      : "rgba(255,255,255,0.9)",
                  },
                ]}
                onPressIn={() => setShowOriginal(true)}
                onPressOut={() => setShowOriginal(false)}
                activeOpacity={0.9}
              >
                <Ionicons
                  name="eye-outline"
                  size={14}
                  color={darkMode ? "#fff" : "#43372f"}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.compareText,
                    { color: darkMode ? "#fff" : "#43372f" },
                  ]}
                >
                  {showOriginal ? "Showing Original" : "Hold to Compare"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.btn,
              { backgroundColor: darkMode ? "#8f6a52" : "#a1584c" },
            ]}
            onPress={pickImage}
            disabled={isEnhancing}
          >
            {isEnhancing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>UPLOAD & AUTO-ENHANCE</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btn,
              { backgroundColor: darkMode ? "#4d4d4d" : "#262626" },
              !enhancedImageUri &&
                imageUri.startsWith("http") && { opacity: 0.5 },
            ]}
            onPress={saveImageToLibrary}
            disabled={
              isSaving ||
              isEnhancing ||
              (!enhancedImageUri && imageUri.startsWith("http"))
            }
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>DOWNLOAD ENHANCED IMAGE</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButtonWrapper: {
    position: "absolute",
    top: 10, // Adjust if your BackButton already has top padding
    left: 20,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
  },
  header: { alignItems: "center", marginBottom: 25 },
  title: {
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  subtitle: { marginTop: 6, fontWeight: "600" },
  card: {
    borderRadius: 24,
    padding: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  imageWrapper: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  img: { width: "100%", height: "100%" },
  compareBtn: {
    position: "absolute",
    bottom: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  compareText: { fontSize: 11, fontWeight: "bold" },
  buttonGroup: { width: "100%", gap: 12 },
  btn: {
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
// import { Ionicons } from "@expo/vector-icons";
// import * as FileSystem from "expo-file-system/legacy";
// import * as ImagePicker from "expo-image-picker";
// import * as MediaLibrary from "expo-media-library";
// import { StatusBar } from "expo-status-bar";
// import { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useUserData } from "./Context/useUserData"; // Adjust path as needed

// // Helper to get screen width for responsive sizing
// const { width: SCREEN_WIDTH } = Dimensions.get("window");

// interface EnhancerScreenProps {
//   onSaveImage: (imageUri?: string) => void;
//   // Note: These props were in your original interface but unused in the logic provided.
//   // Kept here for interface compatibility.
//   onSavePreferences?: () => void;
//   onApplySystem?: () => void;
// }

// type CVDType = "none" | "deuteranopia" | "protanopia" | "tritanopia";

// // Adjust this URL to your actual backend server IP
// const SERVER_URL = "http://172.20.10.3:5000/process-image";

// const normalizeCvdType = (rawType?: string | null): CVDType => {
//   if (!rawType) return "none";
//   const normalized = rawType.toLowerCase().trim();
//   if (normalized.includes("protan") && normalized.includes("deuter"))
//     return "deuteranopia";
//   if (normalized.includes("protan")) return "protanopia";
//   if (normalized.includes("deuter")) return "deuteranopia";
//   if (normalized.includes("tritan")) return "tritanopia";
//   if (
//     normalized.includes("normal") ||
//     normalized.includes("none") ||
//     normalized.includes("no cvd")
//   )
//     return "none";
//   return "deuteranopia";
// };

// export default function EnhancerScreen({ onSaveImage }: EnhancerScreenProps) {
//   const { userData } = useUserData();

//   // ── Image & UI State ──
//   const [imageUri, setImageUri] = useState(
//     "https://picsum.photos/id/28/600/400",
//   );
//   const [enhancedImageUri, setEnhancedImageUri] = useState<string | null>(null);
//   const [isEnhancing, setIsEnhancing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [showOriginal, setShowOriginal] = useState(false);

//   // ── New State for Dynamic Aspect Ratio ──
//   const [aspectRatio, setAspectRatio] = useState(1.5); // Default (3:2)

//   // ── Calculate Aspect Ratio for INITIAL Image ──
//   useEffect(() => {
//     // We use getSize to get the dimensions of the default/placeholder image
//     Image.getSize(
//       imageUri,
//       (width, height) => {
//         if (width && height) {
//           setAspectRatio(width / height);
//         }
//       },
//       (error) => console.error("Initial size error:", error),
//     );
//   }, []);

//   const dbCvdType = useMemo(
//     () => normalizeCvdType(userData?.cvdType),
//     [userData?.cvdType],
//   );

//   const imageToDisplay =
//     showOriginal || !enhancedImageUri ? imageUri : enhancedImageUri;

//   const cvdTypeDescription: Record<CVDType, string> = {
//     none: "No CVD correction",
//     deuteranopia: "Deuteranopia correction",
//     protanopia: "Protanopia correction",
//     tritanopia: "Tritanopia correction",
//   };

//   // ── Core Enhancement Logic (Kept Same) ──
//   const enhanceImageForUri = async (
//     targetUri: string,
//   ): Promise<string | null> => {
//     if (!targetUri || targetUri.startsWith("http")) return null;
//     if (dbCvdType === "none") {
//       setEnhancedImageUri(targetUri);
//       return targetUri;
//     }

//     try {
//       setIsEnhancing(true);
//       const base64 = await FileSystem.readAsStringAsync(targetUri, {
//         encoding: "base64" as any,
//       });
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 45000); // Increased timeout slightly

//       const response = await fetch(SERVER_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           image: base64,
//           cvd_mode: dbCvdType,
//           mode: "full",
//         }),
//         signal: controller.signal,
//       });

//       clearTimeout(timeoutId);

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Server error (${response.status}): ${errorText}`);
//       }

//       const data = await response.json();
//       if (!data?.processed_image)
//         throw new Error("No processed image received.");

//       const dataUri = `data:image/jpeg;base64,${data.processed_image}`;
//       setEnhancedImageUri(dataUri);
//       return dataUri;
//     } catch (error: any) {
//       const message = error?.message || String(error);
//       const isNetworkIssue =
//         message.toLowerCase().includes("network") ||
//         message.toLowerCase().includes("abort");
//       Alert.alert(
//         isNetworkIssue ? "Connection Error" : "Enhancement failed",
//         isNetworkIssue
//           ? "Could not reach server. Verify SERVER_URL and network."
//           : message,
//       );
//       return null;
//     } finally {
//       setIsEnhancing(false);
//     }
//   };

//   // ── Image Picker Logic (Updated with Ratio Calculation) ──
//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permission needed", "We need camera roll permissions!");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images, // Updated for newer Expo
//       allowsEditing: true, // Native cropper helps fit image nicely
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const selectedAsset = result.assets[0];
//       setImageUri(selectedAsset.uri);
//       setEnhancedImageUri(null);

//       // Calculate and set aspect ratio for the NEWly selected image
//       if (selectedAsset.width && selectedAsset.height) {
//         setAspectRatio(selectedAsset.width / selectedAsset.height);
//       } else {
//         // Fallback: If picker doesn't provide width/height, fetch it manually
//         Image.getSize(selectedAsset.uri, (w, h) => setAspectRatio(w / h));
//       }

//       await enhanceImageForUri(selectedAsset.uri);
//     }
//   };

//   // ── Save Logic (Kept Same) ──
//   const saveImageToLibrary = async () => {
//     try {
//       setIsSaving(true);
//       let targetUri = enhancedImageUri;
//       if (!targetUri) targetUri = await enhanceImageForUri(imageUri);
//       if (!targetUri) {
//         Alert.alert("No image", "Please upload an image first.");
//         return;
//       }

//       const { status } = await MediaLibrary.requestPermissionsAsync(true, [
//         "photo",
//       ]);
//       if (status !== "granted") {
//         Alert.alert(
//           "Permission required",
//           "We need permission to save images.",
//         );
//         return;
//       }

//       let assetUri = targetUri;
//       if (targetUri.startsWith("data:image")) {
//         const base64Code = targetUri.replace(
//           /^data:image\/[a-zA-Z]+;base64,/,
//           "",
//         );
//         const docDir =
//           (FileSystem as any).cacheDirectory ||
//           (FileSystem as any).documentDirectory;
//         const fileName = `${docDir}enhanced_cvd_${Date.now()}.jpg`;
//         await FileSystem.writeAsStringAsync(fileName, base64Code, {
//           encoding: "base64" as any,
//         });
//         assetUri = fileName;
//       }

//       await MediaLibrary.createAssetAsync(assetUri);
//       onSaveImage?.(assetUri);
//       Alert.alert("Saved", "Enhanced image downloaded to your gallery.");
//     } catch (_error) {
//       Alert.alert("Save failed", "Could not save the enhanced image.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar style="dark" />

//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header Section - Modern Centered */}
//         <View style={styles.headerContainer}>
//           <Text style={styles.headerTitle}>
//             IMAGE <Text style={styles.headerTitleEnhancer}>ENHANCER</Text>
//           </Text>
//           <Text style={styles.infoText}>
//             Stored CVD type:{" "}
//             <Text style={styles.boldText}>{dbCvdType.toUpperCase()}</Text>
//           </Text>
//           <Text style={styles.infoSubText}>
//             {isEnhancing
//               ? "Enhancing automatically based on profile..."
//               : `Active correction: ${cvdTypeDescription[dbCvdType]}`}
//           </Text>
//         </View>

//         {/* ── Image Card: Dynamic Aspect Ratio applied here ── */}
//         <View style={[styles.imageCard]}>
//           {/* We apply the state-driven aspectRatio to this wrapper */}
//           <View style={[styles.imageWrapper, { aspectRatio: aspectRatio }]}>
//             <Image
//               source={{ uri: imageToDisplay }}
//               style={styles.image}
//               resizeMode="contain" // Contain ensures whole image shows within dynamic box
//             />

//             {/* Premium Compare Button */}
//             <TouchableOpacity
//               style={[
//                 styles.compareButton,
//                 !enhancedImageUri && styles.compareButtonDisabled,
//               ]}
//               disabled={!enhancedImageUri}
//               onPressIn={() => setShowOriginal(true)}
//               onPressOut={() => setShowOriginal(false)}
//               activeOpacity={0.8}
//             >
//               <Ionicons
//                 name={showOriginal ? "eye" : "eye-outline"}
//                 size={14}
//                 color="#43372f"
//                 style={{ marginRight: 5 }}
//               />
//               <Text style={styles.compareButtonText}>
//                 {!enhancedImageUri
//                   ? "Upload image to compare"
//                   : showOriginal
//                     ? "Showing Original"
//                     : "Hold to Compare"}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Action Buttons Section */}
//         <View style={styles.actionsContainer}>
//           <TouchableOpacity
//             style={[
//               styles.mainActionButton,
//               { backgroundColor: "#a1584c" },
//               isEnhancing && styles.buttonDisabled,
//             ]}
//             disabled={isEnhancing}
//             onPress={pickImage}
//             activeOpacity={0.85}
//           >
//             {isEnhancing ? (
//               <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
//             ) : (
//               <Ionicons
//                 name="image-outline"
//                 size={22}
//                 color="#fff"
//                 style={{ marginRight: 10 }}
//               />
//             )}
//             <Text style={styles.mainActionButtonText}>
//               {isEnhancing ? "ENHANCING..." : "UPLOAD & AUTO-ENHANCE"}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.mainActionButton,
//               { backgroundColor: "#262626" },
//               (isSaving || isEnhancing) && styles.buttonDisabled,
//               !enhancedImageUri && { opacity: 0.5 }, // Visual state if no enhanced image exists
//             ]}
//             disabled={isSaving || isEnhancing || !enhancedImageUri}
//             onPress={saveImageToLibrary}
//             activeOpacity={0.85}
//           >
//             {isSaving ? (
//               <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
//             ) : (
//               <Ionicons
//                 name="download-outline"
//                 size={22}
//                 color="#fff"
//                 style={{ marginRight: 10 }}
//               />
//             )}
//             <Text style={styles.mainActionButtonText}>
//               {isSaving ? "DOWNLOADING..." : "DOWNLOAD ENHANCED IMAGE"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F7F5F0", // Slightly off-white for better visual contrast
//   },
//   scrollContent: {
//     flexGrow: 1, // Crucial for centering vertically
//     justifyContent: "center", // Centers the card vertically in empty space
//     paddingHorizontal: 20,
//     paddingVertical: 30,
//     alignItems: "center",
//   },
//   headerContainer: {
//     width: "100%",
//     alignItems: "center",
//     marginBottom: 25,
//   },
//   headerTitle: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "#43372f",
//     marginBottom: 10,
//     textAlign: "center",
//     letterSpacing: 0.5,
//   },
//   headerTitleEnhancer: { color: "#a1584c" },
//   boldText: { fontWeight: "bold" },
//   infoText: {
//     color: "#43372f",
//     fontSize: 15,
//     fontWeight: "600",
//     marginBottom: 4,
//     textAlign: "center",
//   },
//   infoSubText: {
//     color: "#7A6C61", // Slightly softer brown
//     fontSize: 13,
//     textAlign: "center",
//   },
//   imageCard: {
//     backgroundColor: "#fff",
//     borderRadius: 24, // Softer corners
//     padding: 12,
//     marginBottom: 25,
//     width: "100%",
//     // Enhanced shadow for depth
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.12,
//     shadowRadius: 12,
//     elevation: 6,
//   },
//   imageWrapper: {
//     position: "relative",
//     overflow: "hidden",
//     borderRadius: 18,
//     backgroundColor: "#eee",
//     width: "100%",
//     // The aspectRatio is now applied inline in the component logic
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//   },
//   compareButton: {
//     position: "absolute",
//     bottom: 12,
//     right: 12,
//     backgroundColor: "rgba(255,255,255,0.85)", // More opaque for readability
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 20, // Fully rounded
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   compareButtonDisabled: {
//     opacity: 0.6,
//     backgroundColor: "rgba(255,255,255,0.5)",
//   },
//   compareButtonText: {
//     color: "#43372f",
//     fontSize: 11,
//     fontWeight: "700",
//     letterSpacing: 0.2,
//   },
//   actionsContainer: {
//     width: "100%",
//     gap: 12,
//   },
//   mainActionButton: {
//     flexDirection: "row",
//     borderRadius: 16, // Softer buttons
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     width: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//     // Shadow for depth
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   buttonDisabled: {
//     backgroundColor: "#8f8f8f", // Consistent gray when busy
//     opacity: 0.8,
//   },
//   mainActionButtonText: {
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: "bold",
//     letterSpacing: 0.5,
//   },
// });
