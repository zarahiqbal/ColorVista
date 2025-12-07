
import { CameraType, CameraView, PermissionResponse } from 'expo-camera';
import { AlertCircle, CameraOff, ScanLine } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 1. IMPORT THEME HOOK
import { useTheme } from '../Context/ThemeContext';

const SCAN_AREA_HEIGHT = 300;

interface LiveScreenProps {
  active: boolean;
  permission: PermissionResponse | null;
  onRequestPermission: () => Promise<PermissionResponse>;
  onToggleCamera: () => void;
  facing?: CameraType;
}

export default function LiveScreen({ 
  active, 
  permission, 
  onRequestPermission, 
  onToggleCamera, 
  facing = 'back' 
}: LiveScreenProps) {
  
  // 2. CONSUME THEME CONTEXT
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const scale = getFontSizeMultiplier();

  // 3. DEFINE DYNAMIC COLORS
  const theme = {
    bg: darkMode ? '#000000' : '#F9FAFB',
    text: darkMode ? '#FFFFFF' : '#1F2937',
    subText: darkMode ? '#A1A1AA' : '#6B7280',
    cameraBg: darkMode ? '#1C1C1E' : '#F3F4F6', // Dark gray placeholder
    borderColor: darkMode ? '#333333' : '#E5E7EB',
    iconCircle: darkMode ? '#2C2C2E' : '#E5E7EB',
    iconColor: darkMode ? '#6B7280' : '#9CA3AF',
    statusText: darkMode ? '#666' : '#9CA3AF',
    errorBg: darkMode ? '#3E1A1A' : '#FEF2F2', // Darker red bg for dark mode
    errorText: '#EF4444', // Keep red for alerts
  };

  // Animation Logic
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation;

    if (active) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      scanAnim.setValue(0);
      scanAnim.stopAnimation();
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [active]);

  const scanLineTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCAN_AREA_HEIGHT],
  });

  // Loading State
  if (!permission) {
    return <View style={[styles.container, { backgroundColor: theme.bg }]} />;
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text, fontSize: 24 * scale }]}>
            Live Detection
          </Text>
          <Text style={[styles.subtitle, { color: theme.subText, fontSize: 14 * scale }]}>
            Object recognition stream
          </Text>
        </View>

        {/* Camera Viewport Container */}
        <View style={styles.cameraContainer}>
          <View style={[styles.cameraWrapper, { borderColor: theme.borderColor, backgroundColor: theme.cameraBg }]}>
            
            {/* Active Camera View */}
            {active && permission.granted ? (
              <CameraView
                style={StyleSheet.absoluteFill}
                facing={facing}
                animateShutter={false}
              />
            ) : (
              /* Inactive State / Placeholder */
              <View style={[styles.placeholderContainer, { backgroundColor: theme.cameraBg }]}>
                <View style={[styles.iconCircle, { backgroundColor: theme.iconCircle }]}>
                  <CameraOff size={32 * scale} color={theme.iconColor} />
                </View>
                <Text style={[styles.placeholderText, { color: theme.iconColor, fontSize: 16 * scale }]}>
                    Camera is Off
                </Text>
              </View>
            )}

            {/* Permission Denied State */}
            {!permission.granted && !permission.canAskAgain && (
              <View style={[styles.errorContainer, { backgroundColor: theme.errorBg }]}>
                <AlertCircle size={48 * scale} color={theme.errorText} />
                <Text style={[styles.errorText, { fontSize: 16 * scale }]}>Camera permission denied</Text>
                <TouchableOpacity onPress={onRequestPermission} style={styles.errorButton}>
                    <Text style={[styles.errorButtonText, { fontSize: 12 * scale }]}>Grant Permission</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Scanner Overlay (Visible when active) */}
            {active && permission.granted && (
              <View style={styles.overlayContainer} pointerEvents="none">
                {/* Bounding Box */}
                <View style={styles.boundingBox}>
                  <View style={[styles.corner, styles.cornerTL]} />
                  <View style={[styles.corner, styles.cornerTR]} />
                  <View style={[styles.corner, styles.cornerBL]} />
                  <View style={[styles.corner, styles.cornerBR]} />
                </View>

                {/* Animated Scan Line */}
                <View style={styles.scanArea}>
                  <Animated.View
                    style={[
                      styles.scanLine,
                      { transform: [{ translateY: scanLineTranslateY }] },
                    ]}
                  />
                </View>

                {/* Live Indicator */}
                <View style={styles.liveIndicator}>
                  <View style={styles.recordingDot} />
                  <Text style={[styles.liveText, { fontSize: 12 * scale }]}>LIVE</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={onToggleCamera}
            activeOpacity={0.8}
            style={[
              styles.button,
              active ? styles.buttonStop : styles.buttonStart
            ]}
          >
            {active ? (
              <>
                <CameraOff size={24 * scale} color="#FFF" />
                <Text style={[styles.buttonText, { fontSize: 18 * scale }]}>Stop Detection</Text>
              </>
            ) : (
              <>
                <ScanLine size={24 * scale} color="#FFF" />
                <Text style={[styles.buttonText, { fontSize: 18 * scale }]}>Start Live Detection</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={[styles.statusText, { color: theme.statusText, fontSize: 12 * scale }]}>
            {active ? "Processing video frames..." : "Ready to start camera stream"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Static Layout Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 4,
  },
  cameraContainer: {
    paddingHorizontal: 24,
    flex: 1,
    justifyContent: 'center',
  },
  cameraWrapper: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    fontWeight: '500',
  },
  errorContainer: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 10,
  },
  errorText: {
    color: '#EF4444',
    marginTop: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorButton: {
      marginTop: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: '#FEE2E2',
      borderRadius: 8
  },
  errorButtonText: {
      color: '#B91C1C',
      fontWeight: '600',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  boundingBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 200,
    height: 200,
    transform: [{ translateX: -100 }, { translateY: -100 }],
    borderWidth: 2,
    borderColor: 'rgba(74, 222, 128, 0.5)',
    borderRadius: 12,
  },
  scanArea: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 200,
    height: 200,
    transform: [{ translateX: -100 }, { translateY: -100 }],
    overflow: 'hidden',
  },
  scanLine: {
    width: '100%',
    height: 4,
    backgroundColor: '#4ADE80',
    shadowColor: '#4ADE80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#22C55E',
  },
  cornerTL: { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 4 },
  cornerTR: { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 4 },
  cornerBL: { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 4 },
  cornerBR: { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 4 },
  liveIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  liveText: {
    color: '#FFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  controls: {
    padding: 24,
    paddingBottom: 40,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonStart: {
    backgroundColor: '#10B981',
  },
  buttonStop: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  statusText: {
    textAlign: 'center',
    marginTop: 16,
  },
});