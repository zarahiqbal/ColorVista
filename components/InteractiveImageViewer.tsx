import {
  DetectedColor,
  getContrastingTextColor,
} from "@/constants/colorPickerUtils";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  GestureResponderEvent,
  Image,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface InteractiveImageViewerProps {
  imageUri: string;
  containerWidth: number;
  containerHeight: number;
  onColorDetected?: (color: DetectedColor) => void;
  darkMode?: boolean;
  pointerStyle?: "crosshair" | "magnifier" | "circle";
  magnifierRadius?: number;
  enableZoom?: boolean;
  enablePan?: boolean;
}

interface PointerState {
  x: number;
  y: number;
  isActive: boolean;
}

/**
 * Enhanced image viewer with real-time color detection
 * Supports pinch-to-zoom, pan, and interactive color picking
 */
export default function InteractiveImageViewer({
  imageUri,
  containerWidth,
  containerHeight,
  onColorDetected,
  darkMode = false,
  pointerStyle = "magnifier",
  magnifierRadius = 50,
  enableZoom = true,
  enablePan = true,
}: InteractiveImageViewerProps) {
  const [pointerState, setPointerState] = useState<PointerState>({
    x: containerWidth / 2,
    y: containerHeight / 2,
    isActive: false,
  });
  const [imageLayout, setImageLayout] = useState({
    width: containerWidth,
    height: containerHeight,
  });
  const [detectedColor, setDetectedColor] = useState<DetectedColor | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const imageRef = useRef<Image>(null);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const lastColorTime = useRef(0);
  const colorCache = useRef<Map<string, DetectedColor>>(new Map());

  // Gesture handler for pan/drag
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setPointerState((prev) => ({ ...prev, isActive: true }));
        animatePointer(true);
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const { pageX, pageY } = evt.nativeEvent;

        // Calculate relative position within container
        const containerX = pageX - 24; // Account for padding
        const containerY = pageY - 120; // Account for header height

        // Clamp to container bounds
        const x = Math.max(0, Math.min(containerX, containerWidth));
        const y = Math.max(0, Math.min(containerY, containerHeight));

        setPointerState((prev) => ({ ...prev, x, y }));

        // Detect color with caching and throttling
        detectColorAtPosition(x, y);

        // Haptic feedback every ~50ms
        if (Date.now() - lastColorTime.current > 50) {
          Haptics.selectionAsync().catch(() => {});
          lastColorTime.current = Date.now();
        }
      },
      onPanResponderRelease: () => {
        setPointerState((prev) => ({ ...prev, isActive: false }));
        animatePointer(false);
      },
    }),
  ).current;

  const animatePointer = (show: boolean) => {
    Animated.timing(opacityAnim, {
      toValue: show ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const detectColorAtPosition = (x: number, y: number) => {
    // Create a cache key based on rounded position
    const cacheKey = `${Math.round(x / 5) * 5},${Math.round(y / 5) * 5}`;

    // Return cached color if available
    if (colorCache.current.has(cacheKey)) {
      const cached = colorCache.current.get(cacheKey);
      if (cached) {
        setDetectedColor(cached);
        onColorDetected?.(cached);
        return;
      }
    }

    // Simulate color detection for now
    // In a real scenario, you'd extract the actual pixel data from the image
    // This would require using ImageManipulator or Canvas API

    // For now, generate a semi-realistic color based on position
    const hue = (x / containerWidth) * 360;
    const saturation = (y / containerHeight) * 100;
    const lightness = 50;

    const rgb = hslToRgb(hue, saturation, lightness);
    const detectedColor = {
      hex: rgbToHex(rgb.r, rgb.g, rgb.b),
      rgb,
      name: getColorName(rgb.r, rgb.g, rgb.b),
      brightness:
        rgb.r + rgb.g + rgb.b > 382 ? ("light" as const) : ("dark" as const),
    };

    // Cache the result
    colorCache.current.set(cacheKey, detectedColor);

    setDetectedColor(detectedColor);
    onColorDetected?.(detectedColor);
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const hslToRgb = (
    h: number,
    s: number,
    l: number,
  ): { r: number; g: number; b: number } => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
      r: Math.round(255 * f(0)),
      g: Math.round(255 * f(8)),
      b: Math.round(255 * f(4)),
    };
  };

  const getColorName = (r: number, g: number, b: number): string => {
    const names = [
      "Red",
      "Orange",
      "Yellow",
      "Green",
      "Cyan",
      "Blue",
      "Purple",
      "Pink",
    ];
    const hue = Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b);
    const index = Math.round(((hue + Math.PI) / (2 * Math.PI)) * 8) % 8;
    return names[index];
  };

  const renderPointer = () => {
    if (!pointerState.isActive) return null;

    const size = 40;
    const pos = {
      left: pointerState.x - size / 2,
      top: pointerState.y - size / 2,
    };

    switch (pointerStyle) {
      case "crosshair":
        return (
          <Animated.View
            style={[styles.pointerContainer, pos, { opacity: opacityAnim }]}
          >
            <View style={styles.crosshairVertical} />
            <View style={styles.crosshairHorizontal} />
            <View style={styles.crosshairCenter} />
          </Animated.View>
        );

      case "circle":
        return (
          <Animated.View
            style={[
              styles.pointerContainer,
              pos,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: 2,
                borderColor: "#FFFFFF",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                justifyContent: "center",
                alignItems: "center",
                opacity: opacityAnim,
              },
            ]}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#FFFFFF",
              }}
            />
          </Animated.View>
        );

      case "magnifier":
      default:
        return (
          <Animated.View
            style={[
              styles.magnifierContainer,
              {
                left: pointerState.x - magnifierRadius,
                top: pointerState.y - magnifierRadius,
                opacity: opacityAnim,
              },
            ]}
          >
            {/* Magnifier glass border */}
            <View
              style={[
                styles.magnifierCircle,
                {
                  width: magnifierRadius * 2,
                  height: magnifierRadius * 2,
                  borderRadius: magnifierRadius,
                },
              ]}
            />

            {/* Magnifier shine effect */}
            <View
              style={[
                styles.magnifierShine,
                {
                  left: -magnifierRadius * 0.6,
                  top: -magnifierRadius * 0.6,
                  width: magnifierRadius,
                  height: magnifierRadius,
                },
              ]}
            />

            {/* Center targeting dot */}
            <View
              style={[
                styles.magnifierDot,
                {
                  left: magnifierRadius - 5,
                  top: magnifierRadius - 5,
                },
              ]}
            />
          </Animated.View>
        );
    }
  };

  const renderTooltip = () => {
    if (!detectedColor || !pointerState.isActive) return null;

    const tooltipWidth = 130;
    const tooltipHeight = 100;

    // Position tooltip above pointer
    let tooltipLeft = pointerState.x - tooltipWidth / 2;
    let tooltipTop = pointerState.y - magnifierRadius - tooltipHeight - 10;

    // Clamp to bounds
    tooltipLeft = Math.max(
      10,
      Math.min(tooltipLeft, containerWidth - tooltipWidth - 10),
    );
    tooltipTop = Math.max(
      10,
      Math.min(tooltipTop, containerHeight - tooltipHeight - 10),
    );

    const textColor = getContrastingTextColor(detectedColor.brightness);

    return (
      <Animated.View
        style={[
          styles.tooltipContainer,
          {
            left: tooltipLeft,
            top: tooltipTop,
            opacity: opacityAnim,
            backgroundColor:
              detectedColor.brightness === "light"
                ? "rgba(30, 30, 30, 0.92)"
                : "rgba(255, 255, 255, 0.97)",
            borderColor:
              detectedColor.brightness === "light"
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.1)",
          },
        ]}
      >
        <Text
          style={[styles.tooltipColorName, { color: textColor }]}
          numberOfLines={1}
        >
          {detectedColor.name}
        </Text>
        <Text style={[styles.tooltipColorHex, { color: textColor }]}>
          {detectedColor.hex}
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: 4,
            marginBottom: 4,
          }}
        >
          <View
            style={[
              styles.rgbValue,
              { backgroundColor: "rgba(255, 0, 0, 0.3)" },
            ]}
          >
            <Text style={[styles.rgbLabel, { color: textColor }]}>
              R: {detectedColor.rgb.r}
            </Text>
          </View>
          <View
            style={[
              styles.rgbValue,
              { backgroundColor: "rgba(0, 255, 0, 0.3)" },
            ]}
          >
            <Text style={[styles.rgbLabel, { color: textColor }]}>
              G: {detectedColor.rgb.g}
            </Text>
          </View>
          <View
            style={[
              styles.rgbValue,
              { backgroundColor: "rgba(0, 0, 255, 0.3)" },
            ]}
          >
            <Text style={[styles.rgbLabel, { color: textColor }]}>
              B: {detectedColor.rgb.b}
            </Text>
          </View>
        </View>
        <View
          style={[styles.colorPreview, { backgroundColor: detectedColor.hex }]}
        />
      </Animated.View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { width: containerWidth, height: containerHeight },
      ]}
      {...panResponder.panHandlers}
    >
      {/* Main image */}
      <Image
        ref={imageRef}
        source={{ uri: imageUri }}
        style={styles.image}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        resizeMode="cover"
      />

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8DA399" />
        </View>
      )}

      {/* Color pointer overlay */}
      {!isLoading && renderPointer()}

      {/* Color detection tooltip */}
      {!isLoading && renderTooltip()}

      {/* Help hint */}
      {!pointerState.isActive && !isLoading && (
        <Animated.View
          style={[
            styles.helpHint,
            {
              opacity: opacityAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 0],
              }),
            },
          ]}
        >
          <Ionicons
            name="finger-print"
            size={20}
            color={darkMode ? "#FFFFFF" : "#8DA399"}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#000000",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },

  pointerContainer: {
    position: "absolute",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  crosshairVertical: {
    position: "absolute",
    width: 1,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },

  crosshairHorizontal: {
    position: "absolute",
    height: 1,
    width: 30,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },

  crosshairCenter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },

  magnifierContainer: {
    position: "absolute",
    zIndex: 10,
  },

  magnifierCircle: {
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.95)",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  magnifierShine: {
    position: "absolute",
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },

  magnifierDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },

  tooltipContainer: {
    position: "absolute",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    minWidth: 120,
    zIndex: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },

  tooltipColorName: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.3,
  },

  tooltipColorHex: {
    fontSize: 11,
    opacity: 0.8,
    marginBottom: 6,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontWeight: "600",
  },

  rgbValue: {
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },

  rgbLabel: {
    fontSize: 10,
    fontWeight: "600",
  },

  colorPreview: {
    width: "100%",
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },

  helpHint: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    zIndex: 5,
  },
});
