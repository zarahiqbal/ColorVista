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

interface EnhancerScreenProps {
  onSaveImage: (imageUri?: string) => void;
}

type CVDType = "none" | "deuteranopia" | "protanopia" | "tritanopia";
const SERVER_URL = "http://192.168.1.4:5000/enhancement";

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
