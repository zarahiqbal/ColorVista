import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
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
import { useUserData } from "./Context/useUserData";

interface EnhancerScreenProps {
  onSaveImage: (imageUri?: string) => void;
  onSavePreferences: () => void;
  onApplySystem: () => void;
}

type CVDType = "none" | "deuteranopia" | "protanopia" | "tritanopia";

const SERVER_URL = "http://192.168.1.3:5000/process-image";

const normalizeCvdType = (rawType?: string | null): CVDType => {
  if (!rawType) return "none";

  const normalized = rawType.toLowerCase().trim();

  if (normalized.includes("protan") && normalized.includes("deuter")) {
    return "deuteranopia";
  }

  if (normalized.includes("protan")) return "protanopia";
  if (normalized.includes("deuter")) return "deuteranopia";
  if (normalized.includes("tritan")) return "tritanopia";

  if (
    normalized.includes("normal") ||
    normalized.includes("none") ||
    normalized.includes("no cvd")
  ) {
    return "none";
  }

  return "deuteranopia";
};

export default function EnhancerScreen({ onSaveImage }: EnhancerScreenProps) {
  const { userData } = useUserData();

  const [imageUri, setImageUri] = useState("https://picsum.photos/id/28/600/400");
  const [enhancedImageUri, setEnhancedImageUri] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const dbCvdType = useMemo(
    () => normalizeCvdType(userData?.cvdType),
    [userData?.cvdType],
  );

  const imageToDisplay =
    showOriginal || !enhancedImageUri ? imageUri : enhancedImageUri;

  const cvdTypeDescription: Record<CVDType, string> = {
    none: "No CVD correction",
    deuteranopia: "Deuteranopia correction",
    protanopia: "Protanopia correction",
    tritanopia: "Tritanopia correction",
  };

  const enhanceImageForUri = async (targetUri: string): Promise<string | null> => {
    if (!targetUri || targetUri.startsWith("http")) {
      return null;
    }

    if (dbCvdType === "none") {
      setEnhancedImageUri(targetUri);
      return targetUri;
    }

    try {
      setIsEnhancing(true);

      const base64 = await FileSystem.readAsStringAsync(targetUri, {
        encoding: "base64" as any,
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64,
          cvd_mode: dbCvdType,
          mode: "full",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      if (!data?.processed_image) {
        throw new Error("No processed image received from server.");
      }

      const dataUri = `data:image/jpeg;base64,${data.processed_image}`;
      setEnhancedImageUri(dataUri);
      return dataUri;
    } catch (error: any) {
      const message = error?.message || String(error);
      const isNetworkIssue =
        message.toLowerCase().includes("network") ||
        message.toLowerCase().includes("abort");

      Alert.alert(
        isNetworkIssue ? "Connection Error" : "Enhancement failed",
        isNetworkIssue
          ? "Could not reach enhancement server. Verify SERVER_URL and make sure the backend is running."
          : message,
      );
      return null;
    } finally {
      setIsEnhancing(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera roll permissions to make this work!",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setImageUri(selectedUri);
      setEnhancedImageUri(null);
      await enhanceImageForUri(selectedUri);
    }
  };

  const saveImageToLibrary = async () => {
    try {
      setIsSaving(true);

      let targetUri = enhancedImageUri;
      if (!targetUri) {
        targetUri = await enhanceImageForUri(imageUri);
      }

      if (!targetUri) {
        Alert.alert("No image", "Please upload an image first.");
        return;
      }

      const { status } = await MediaLibrary.requestPermissionsAsync(true, ["photo"]);
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "We need photo library permission to save your image.",
        );
        return;
      }

      let assetUri = targetUri;
      if (targetUri.startsWith("data:image")) {
        const base64Code = targetUri.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
        const docDir =
          (FileSystem as any).cacheDirectory ||
          (FileSystem as any).documentDirectory;
        const fileName = `${docDir}enhanced_cvd_${Date.now()}.jpg`;
        await FileSystem.writeAsStringAsync(fileName, base64Code, {
          encoding: "base64" as any,
        });
        assetUri = fileName;
      }

      await MediaLibrary.createAssetAsync(assetUri);
      onSaveImage?.(assetUri);
      Alert.alert("Saved", "Enhanced image downloaded to your gallery.");
    } catch (_error) {
      Alert.alert("Save failed", "Could not save the enhanced image.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>
          IMAGE <Text style={styles.headerTitleEnhancer}>ENHANCER</Text>
        </Text>

        <Text style={styles.infoText}>Stored CVD type: {dbCvdType.toUpperCase()}</Text>
        <Text style={styles.infoSubText}>
          {isEnhancing
            ? "Enhancing automatically based on your stored profile..."
            : `Active correction: ${cvdTypeDescription[dbCvdType]}`}
        </Text>

        <View style={styles.imageCard}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: imageToDisplay }}
              style={styles.originalImage}
              resizeMode="cover"
            />

            <TouchableOpacity
              style={styles.compareButton}
              disabled={!enhancedImageUri}
              onPressIn={() => setShowOriginal(true)}
              onPressOut={() => setShowOriginal(false)}
            >
              <Text style={styles.compareButtonText}>
                {!enhancedImageUri
                  ? "Upload image to compare"
                  : showOriginal
                    ? "Showing Original"
                    : "Hold to View Original"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.mainActionButton, { backgroundColor: "#a1584c" }]}
          disabled={isEnhancing}
          onPress={pickImage}
        >
          {isEnhancing ? (
            <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
          ) : (
            <Ionicons
              name="image-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
          )}
          <Text style={styles.mainActionButtonText}>
            {isEnhancing ? "ENHANCING..." : "UPLOAD & AUTO-ENHANCE"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.mainActionButton,
            { backgroundColor: isSaving ? "#8f8f8f" : "#262626" },
          ]}
          disabled={isSaving || isEnhancing}
          onPress={saveImageToLibrary}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
          ) : (
            <Ionicons
              name="download-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
          )}
          <Text style={styles.mainActionButtonText}>
            {isSaving ? "DOWNLOADING..." : "DOWNLOAD ENHANCED IMAGE"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    color: "#43372f",
    marginBottom: 14,
    textAlign: "center",
  },
  headerTitleEnhancer: { color: "#a1584c" },
  infoText: {
    width: "100%",
    color: "#43372f",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  infoSubText: {
    width: "100%",
    color: "#6b5c53",
    fontSize: 13,
    marginBottom: 14,
  },
  imageCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageWrapper: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 16,
    aspectRatio: 3 / 2,
    backgroundColor: "#eee",
  },
  originalImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  compareButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.65)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  compareButtonText: { color: "#43372f", fontSize: 10, fontWeight: "bold" },
  mainActionButton: {
    flexDirection: "row",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: "100%",
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  mainActionButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
});
