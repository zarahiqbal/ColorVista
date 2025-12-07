
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
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [active]);

  const scanLineTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCAN_AREA_SIZE],
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

            {/* Permission Denied State */}
            {!permission.granted && (
              <View style={styles.errorContainer}>
                <AlertCircle size={48} color="#EF4444" />
                <Text style={styles.errorText}>Camera Permission Required</Text>
                <Text style={styles.errorSubtext}>
                  Allow camera access to detect colors
                </Text>
                <TouchableOpacity onPress={onRequestPermission} style={styles.errorButton}>
                  <Text style={styles.errorButtonText}>Grant Permission</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={onToggleCamera}
            activeOpacity={0.8}
            disabled={!permission?.granted}
            style={[
              styles.button,
              active ? styles.buttonStop : styles.buttonStart,
              !permission?.granted && styles.buttonDisabled
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    paddingVertical: 24,
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
    paddingHorizontal: 20,
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
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
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
    marginBottom: 20,
  },
  placeholderText: {
    fontWeight: '500',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 10,
  },
  errorText: {
    color: '#EF4444',
    marginTop: 16,
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },
  errorSubtext: {
    color: '#B91C1C',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    elevation: 2,
  },
  errorButtonText: {
      color: '#B91C1C',
      fontWeight: '600',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boundingBox: {
    position: 'absolute',
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    borderWidth: 2,
    borderColor: 'rgba(74, 222, 128, 0.6)',
    borderRadius: 16,
  },
  scanArea: {
    position: 'absolute',
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    overflow: 'hidden',
  },
  scanLine: {
    width: '100%',
    height: 3,
    backgroundColor: '#4ADE80',
    shadowColor: '#4ADE80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#22C55E',
  },
  cornerTL: { 
    top: -2, 
    left: -2, 
    borderTopWidth: 4, 
    borderLeftWidth: 4, 
    borderTopLeftRadius: 6 
  },
  cornerTR: { 
    top: -2, 
    right: -2, 
    borderTopWidth: 4, 
    borderRightWidth: 4, 
    borderTopRightRadius: 6 
  },
  cornerBL: { 
    bottom: -2, 
    left: -2, 
    borderBottomWidth: 4, 
    borderLeftWidth: 4, 
    borderBottomLeftRadius: 6 
  },
  cornerBR: { 
    bottom: -2, 
    right: -2, 
    borderBottomWidth: 4, 
    borderRightWidth: 4, 
    borderBottomRightRadius: 6 
  },
  crosshairContainer: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  crosshairLineV: {
    position: 'absolute',
    width: 2,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 1,
  },
  crosshairLineH: {
    position: 'absolute',
    height: 2,
    width: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 1,
  },
  crosshairDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 101,
  },
  centerLabelContainer: {
    position: 'absolute',
    top: '50%',
    marginTop: 40,
    alignItems: 'center',
    zIndex: 99,
  },
  centerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  centerLabelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  centerLabelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  liveIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
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
  recordingDotDisconnected: {
    backgroundColor: '#9CA3AF',
  },
  liveText: {
    color: '#FFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  controls: {
    padding: 24,
    paddingBottom: 32,
  },
  button: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonStart: {
    backgroundColor: '#10B981',
  },
  buttonStop: {
    backgroundColor: '#EF4444',
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  statusText: {
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '500',
  },
});