import {
    DetectedColor,
    getContrastingTextColor
} from "@/constants/colorPickerUtils";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    GestureResponderEvent,
    PanResponder,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface ColorPickerOverlayProps {
  imageUri: string;
  containerWidth: number;
  containerHeight: number;
  onColorDetected?: (color: DetectedColor) => void;
  enabled?: boolean;
  pointerStyle?: "crosshair" | "magnifier" | "circle";
  magnifierRadius?: number;
  darkMode?: boolean;
}

interface PointerPosition {
  x: number;
  y: number;
}

export default function ColorPickerOverlay({
  imageUri,
  containerWidth,
  containerHeight,
  onColorDetected,
  enabled = true,
  pointerStyle = "magnifier",
  magnifierRadius = 50,
  darkMode = false,
}: ColorPickerOverlayProps) {
  const [pointerPos, setPointerPos] = useState<PointerPosition>({
    x: containerWidth / 2,
    y: containerHeight / 2,
  });
  const [detectedColor, setDetectedColor] = useState<DetectedColor | null>(
    null,
  );
  const [isActive, setIsActive] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [magnifierVisible, setMagnifierVisible] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => enabled,
      onMoveShouldSetPanResponder: () => enabled,
      onPanResponderGrant: () => {
        setIsActive(true);
        setMagnifierVisible(true);
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        if (!enabled) return;

        const { nativeEvent } = evt;
        const newX = Math.max(
          0,
          Math.min(nativeEvent.pageX - 24, containerWidth),
        ); // 24 = paddingHorizontal
        const newY = Math.max(
          0,
          Math.min(nativeEvent.pageY - 100, containerHeight),
        ); // Approximate top offset

        setPointerPos({ x: newX, y: newY });

        // Trigger haptic feedback every 50px of movement
        if (Math.random() > 0.8) {
          Haptics.selectionAsync();
        }

        detectColor(newX, newY);
      },
      onPanResponderRelease: () => {
        setIsActive(false);
        setTimeout(() => setMagnifierVisible(false), 300);
      },
    }),
  ).current;

  const detectColor = (x: number, y: number) => {
    // This will be called from the parent with actual image data
    // For now, we'll emit the position event
    onColorDetected?.({
      hex: "#000000",
      rgb: { r: 0, g: 0, b: 0 },
      name: "Detecting...",
      brightness: "dark",
    });
  };

  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (magnifierVisible) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [magnifierVisible]);

  const renderPointer = () => {
    const size = 40;
    const pos = {
      left: pointerPos.x - size / 2,
      top: pointerPos.y - size / 2,
    };

    switch (pointerStyle) {
      case "crosshair":
        return (
          <View style={[styles.pointerContainer, pos]}>
            <View style={styles.crosshairVertical} />
            <View style={styles.crosshairHorizontal} />
            <View style={styles.crosshairCenter} />
          </View>
        );

      case "circle":
        return (
          <View
            style={[
              styles.pointerContainer,
              pos,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: 2,
                borderColor: "rgba(255, 255, 255, 0.9)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <View
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#FFFFFF",
              }}
            />
          </View>
        );

      case "magnifier":
      default:
        return (
          <Animated.View
            style={[
              styles.magnifierContainer,
              {
                left: pointerPos.x - magnifierRadius,
                top: pointerPos.y - magnifierRadius,
                opacity: opacityAnim,
              },
            ]}
          >
            {/* Magnifier circle border */}
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

            {/* Center dot */}
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
    if (!detectedColor || !magnifierVisible) return null;

    const tooltipWidth = 120;
    const tooltipHeight = 90;
    let tooltipLeft = pointerPos.x - tooltipWidth / 2;
    let tooltipTop = pointerPos.y - 80;

    // Clamp to container bounds
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
                ? "rgba(0, 0, 0, 0.85)"
                : "rgba(255, 255, 255, 0.95)",
          },
        ]}
      >
        {/* Tooltip content */}
        <Text
          style={[
            styles.tooltipColorName,
            { color: textColor, fontWeight: "700" },
          ]}
          numberOfLines={1}
        >
          {detectedColor.name}
        </Text>
        <Text style={[styles.tooltipColorHex, { color: textColor }]}>
          {detectedColor.hex}
        </Text>
        <View
          style={[styles.colorPreview, { backgroundColor: detectedColor.hex }]}
        />
      </Animated.View>
    );
  };

  if (!enabled) return null;

  return (
    <View
      style={[
        styles.overlay,
        { width: containerWidth, height: containerHeight },
      ]}
      {...panResponder.panHandlers}
    >
      {renderPointer()}
      {renderTooltip()}

      {/* Help text when first touching */}
      {!isActive && !magnifierVisible && (
        <View style={styles.helpTextContainer}>
          <Ionicons
            name={pointerStyle === "magnifier" ? "search" : "finger-print"}
            size={24}
            color={darkMode ? "#FFFFFF" : "#8DA399"}
          />
          <Text
            style={[
              styles.helpText,
              { color: darkMode ? "#FFFFFF" : "#8DA399" },
            ]}
          >
            Drag to detect colors
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 5,
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },

  crosshairHorizontal: {
    position: "absolute",
    height: 1,
    width: 30,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },

  crosshairCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },

  magnifierContainer: {
    position: "absolute",
    zIndex: 10,
  },

  magnifierCircle: {
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.9)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },

  magnifierDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },

  tooltipContainer: {
    position: "absolute",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 100,
    zIndex: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
  },

  tooltipColorName: {
    fontSize: 13,
    marginBottom: 4,
  },

  tooltipColorHex: {
    fontSize: 11,
    opacity: 0.8,
    marginBottom: 6,
    fontFamily: "monospace",
  },

  colorPreview: {
    width: "100%",
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },

  helpTextContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    alignItems: "center",
    opacity: 0.6,
  },

  helpText: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: "500",
  },
});
