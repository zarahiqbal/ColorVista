import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  Marker,
  Polygon,
} from "react-native-svg";

// Import the Theme Hook
import { useTheme } from "@/Context/ThemeContext";

// REPLACE WITH YOUR COMPUTER'S LOCAL IP ADDRESS
const SERVER_URL = "http://192.168.1.4:5000/process-image";

type DetectionRegion = {
  label: string;
  cx: number;
  cy: number;
  badge_x: number;
  badge_y: number;
};

/** Normalized point (0–1) → view coords; use `contain` when `Image` uses `resizeMode="contain"`. */
function mapNormToDisplayed(
  nx: number,
  ny: number,
  containerW: number,
  containerH: number,
  naturalW: number,
  naturalH: number,
  mode: "contain" | "cover",
) {
  const s =
    mode === "contain"
      ? Math.min(containerW / naturalW, containerH / naturalH)
      : Math.max(containerW / naturalW, containerH / naturalH);
  const dw = naturalW * s;
  const dh = naturalH * s;
  const ox = (containerW - dw) / 2;
  const oy = (containerH - dh) / 2;
  return { x: ox + nx * dw, y: oy + ny * dh };
}

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
  const [detectionRegions, setDetectionRegions] = useState<DetectionRegion[]>(
    [],
  );
  const [previewLayout, setPreviewLayout] = useState({ w: 0, h: 0 });
  const [displayedNatural, setDisplayedNatural] = useState<{
    w: number;
    h: number;
  } | null>(null);

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
      setDetectionRegions([]);
      setDisplayedNatural(null);
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
      const rawRegions = data.detection_regions;
      const regions: DetectionRegion[] = Array.isArray(rawRegions)
        ? rawRegions.filter(
            (r: DetectionRegion) =>
              r &&
              typeof r.label === "string" &&
              [r.cx, r.cy, r.badge_x, r.badge_y].every((n) =>
                typeof n === "number" && Number.isFinite(n),
              ),
          )
        : [];
      setDetectionRegions(regions);
    } catch {
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
    setDetectionRegions([]);
    setDisplayedNatural(null);
  };

  const showLeaderOverlay =
    !!processedImage &&
    detectionRegions.length > 0 &&
    previewLayout.w > 0 &&
    previewLayout.h > 0 &&
    displayedNatural !== null &&
    displayedNatural.w > 0 &&
    displayedNatural.h > 0;

  const useContainForPreview =
    !!processedImage && detectionRegions.length > 0;
  const layoutMode = useContainForPreview ? "contain" : "cover";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upload Media</Text>
        <Text style={styles.headerSubtitle}>Analyze existing photos</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.previewContainer}>
          {image ? (
            <>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: processedImage || image }}
                  style={styles.previewImage}
                  resizeMode={layoutMode}
                  onLayout={(e) => {
                    const { width: lw, height: lh } = e.nativeEvent.layout;
                    setPreviewLayout({ w: lw, h: lh });
                  }}
                  onLoad={(ev) => {
                    const src = ev.nativeEvent.source;
                    const uri = processedImage || image;
                    if (
                      typeof src.width === "number" &&
                      typeof src.height === "number" &&
                      src.width > 0 &&
                      src.height > 0
                    ) {
                      setDisplayedNatural({ w: src.width, h: src.height });
                    } else if (uri) {
                      Image.getSize(
                        uri,
                        (w, h) => {
                          if (w > 0 && h > 0) {
                            setDisplayedNatural({ w, h });
                          }
                        },
                        () => {},
                      );
                    }
                  }}
                />
                {showLeaderOverlay && displayedNatural && (
                  <Svg
                    pointerEvents="none"
                    width={previewLayout.w}
                    height={previewLayout.h}
                    style={StyleSheet.absoluteFillObject}
                  >
                    <Defs>
                      <Marker
                        id="uploadLeaderArrow"
                        viewBox="0 0 12 12"
                        refX={10}
                        refY={6}
                        markerWidth={8}
                        markerHeight={8}
                        orient="auto"
                      >
                        <Polygon
                          points="0 0, 12 6, 0 12"
                          fill="#ffffff"
                          stroke="rgba(0,0,0,0.35)"
                          strokeWidth={0.5}
                        />
                      </Marker>
                    </Defs>
                    {detectionRegions.map((region, idx) => {
                      const start = mapNormToDisplayed(
                        region.cx,
                        region.cy,
                        previewLayout.w,
                        previewLayout.h,
                        displayedNatural.w,
                        displayedNatural.h,
                        layoutMode,
                      );
                      const badgeCenter = mapNormToDisplayed(
                        region.badge_x,
                        region.badge_y,
                        previewLayout.w,
                        previewLayout.h,
                        displayedNatural.w,
                        displayedNatural.h,
                        layoutMode,
                      );
                      // Server draws the pill above the contour; badge_x/y are pill center —
                      // end the stroke just below the pill so the arrowhead clears the label.
                      const arrowBelowBadgePx =
                        Math.max(9, 10.5 * Math.min(scale, 1.15));
                      const arrowEnd = {
                        x: badgeCenter.x,
                        y: badgeCenter.y + arrowBelowBadgePx,
                      };
                      return (
                        <G key={`${region.label}-${idx}`}>
                          <Line
                            x1={start.x}
                            y1={start.y}
                            x2={arrowEnd.x}
                            y2={arrowEnd.y}
                            stroke="rgba(0,0,0,0.45)"
                            strokeWidth={3}
                            strokeLinecap="round"
                          />
                          <Line
                            x1={start.x}
                            y1={start.y}
                            x2={arrowEnd.x}
                            y2={arrowEnd.y}
                            stroke="#ffffff"
                            strokeWidth={1.75}
                            strokeLinecap="round"
                            markerEnd="url(#uploadLeaderArrow)"
                          />
                          <Circle
                            cx={start.x}
                            cy={start.y}
                            r={5}
                            fill="rgba(255,255,255,0.95)"
                            stroke="rgba(0,0,0,0.4)"
                            strokeWidth={1.25}
                          />
                        </G>
                      );
                    })}
                  </Svg>
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleReset}
                >
                  <Ionicons name="close" size={20 * scale} color="#FFF" />
                </TouchableOpacity>
              </View>
            </>
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
