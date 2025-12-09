// import { CameraType, CameraView, PermissionResponse } from 'expo-camera';
// import { AlertCircle, CameraOff, ScanLine } from 'lucide-react-native';
// import { useEffect, useRef, useState } from 'react';
// import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const SCREEN_WIDTH = Dimensions.get('window').width;
// const SCAN_AREA_SIZE = 220;

// interface LiveScreenProps {
//   active: boolean;
//   permission: PermissionResponse | null;
//   onRequestPermission: () => Promise<PermissionResponse>;
//   onToggleCamera: () => void;
//   facing?: CameraType;
// }

// export default function LiveScreen({ 
//   active, 
//   permission, 
//   onRequestPermission, 
//   onToggleCamera, 
//   facing = 'back' 
// }: LiveScreenProps) {

//   // Server endpoint - update IP to your computer running the Python server
//   const SERVER_FRAME_URL = 'http://192.168.1.5:5000/process-frame';

//   const [detectedColors, setDetectedColors] = useState<string[]>([]);
//   const [isConnected, setIsConnected] = useState(true);
//   const cameraRef = useRef<any>(null);
//   const isProcessingRef = useRef(false);
//   const frameIntervalRef = useRef<any>(null);
//   const targetFPS = 5; // Reduced for smoother performance

//   // Map color names returned by server to CSS color strings for UI
//   const colorMap: Record<string, string> = {
//     Red: '#FF3B30',
//     Blue: '#007AFF',
//     Green: '#34C759',
//     Yellow: '#FFCC00',
//     Orange: '#FF9500',
//     Cyan: '#5AC8FA',
//     Purple: '#AF52DE',
//     Pink: '#FF2D55',
//     White: '#FFFFFF',
//     Black: '#1F2937',
//     Gray: '#8E8E93',
//   };

//   // Handle camera ready and start frame capture
//   const handleCameraReady = () => {
//     console.log('Camera ready, starting frame capture...');
    
//     // Clear any existing interval
//     if (frameIntervalRef.current) {
//       clearInterval(frameIntervalRef.current);
//     }

//     // Start capturing frames at intervals
//     const interval = Math.round(1000 / targetFPS);
    
//     frameIntervalRef.current = setInterval(async () => {
//       if (isProcessingRef.current || !cameraRef.current || !active) return;
      
//       isProcessingRef.current = true;
      
//       try {
//         if (cameraRef.current?.takePictureAsync) {
//           const photo = await cameraRef.current.takePictureAsync({ 
//             base64: true, 
//             quality: 0.3, 
//             skipProcessing: true,
//             exif: false,
//           });
//           const base64 = (photo as any)?.base64;

//           if (base64) {
//             fetch(SERVER_FRAME_URL, {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ image: base64, mode: 'center' }),
//             })
//               .then((res) => res.json())
//               .then((json) => {
//                 if (json?.detected_colors) {
//                   setDetectedColors(json.detected_colors || []);
//                   setIsConnected(true);
//                 }
//               })
//               .catch((err) => {
//                 console.warn('Frame request error', err);
//                 setIsConnected(false);
//               });
//           }
//         }
//       } catch (err) {
//         console.warn('Capture error', err);
//       } finally {
//         isProcessingRef.current = false;
//       }
//     }, interval);
//   };

//   // Cleanup interval when component unmounts or camera stops
//   useEffect(() => {
//     if (!active || !permission?.granted) {
//       if (frameIntervalRef.current) {
//         clearInterval(frameIntervalRef.current);
//         frameIntervalRef.current = null;
//       }
//       setDetectedColors([]);
//     }

//     return () => {
//       if (frameIntervalRef.current) {
//         clearInterval(frameIntervalRef.current);
//       }
//     };
//   }, [active, permission]);
  
//   // Animation Logic for scanning line
//   const scanAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     let animation: Animated.CompositeAnimation;

//     if (active) {
//       animation = Animated.loop(
//         Animated.sequence([
//           Animated.timing(scanAnim, {
//             toValue: 1,
//             duration: 2000,
//             useNativeDriver: true,
//           }),
//           Animated.timing(scanAnim, {
//             toValue: 0,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//         ])
//       );
//       animation.start();
//     } else {
//       scanAnim.setValue(0);
//     }

//     return () => {
//       if (animation) animation.stop();
//     };
//   }, [active]);

//   const scanLineTranslateY = scanAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, SCAN_AREA_SIZE],
//   });

//   // Loading State
//   if (!permission) {
//     return (
//       <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
//         <View style={styles.container}>
//           <View style={styles.loadingContainer}>
//             <Text style={styles.loadingText}>Loading camera...</Text>
//           </View>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
//       <View style={styles.container}>
        
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.title}>Live Color Detection</Text>
//           <Text style={styles.subtitle}>Point camera at objects to detect colors</Text>
//         </View>

//         {/* Camera Viewport Container */}
//         <View style={styles.cameraContainer}>
//           <View style={styles.cameraWrapper}>
            
//             {/* Active Camera View */}
//             {active && permission.granted ? (
//               <>
//                 <CameraView
//                   ref={cameraRef}
//                   style={StyleSheet.absoluteFill}
//                   facing={facing}
//                   animateShutter={false}
//                   onCameraReady={handleCameraReady}
//                 />
                
//                 {/* Scanner Overlay */}
//                 <View style={styles.overlayContainer} pointerEvents="none">
                  
//                   {/* Bounding Box */}
//                   <View style={styles.boundingBox}>
//                     <View style={[styles.corner, styles.cornerTL]} />
//                     <View style={[styles.corner, styles.cornerTR]} />
//                     <View style={[styles.corner, styles.cornerBL]} />
//                     <View style={[styles.corner, styles.cornerBR]} />
//                   </View>

//                   {/* Animated Scan Line */}
//                   <View style={styles.scanArea}>
//                     <Animated.View
//                       style={[
//                         styles.scanLine,
//                         { transform: [{ translateY: scanLineTranslateY }] },
//                       ]}
//                     />
//                   </View>

//                   {/* Crosshair at center */}
//                   <View style={styles.crosshairContainer}>
//                     <View style={styles.crosshairLineV} />
//                     <View style={styles.crosshairLineH} />
//                     <View
//                       style={[
//                         styles.crosshairDot,
//                         detectedColors && detectedColors[0]
//                           ? { backgroundColor: colorMap[detectedColors[0]] || '#FFFFFF' }
//                           : { backgroundColor: '#FFFFFF' },
//                       ]}
//                     />
//                   </View>

//                   {/* Center color label */}
//                   {detectedColors && detectedColors[0] && (
//                     <View style={styles.centerLabelContainer}>
//                       <View style={styles.centerLabel}>
//                         <View 
//                           style={[
//                             styles.centerLabelDot, 
//                             { backgroundColor: colorMap[detectedColors[0]] || '#FFFFFF' }
//                           ]} 
//                         />
//                         <Text style={styles.centerLabelText}>{detectedColors[0]}</Text>
//                       </View>
//                     </View>
//                   )}

//                   {/* Live Indicator */}
//                   <View style={styles.liveIndicator}>
//                     <View style={[styles.recordingDot, !isConnected && styles.recordingDotDisconnected]} />
//                     <Text style={styles.liveText}>{isConnected ? 'LIVE' : 'OFFLINE'}</Text>
//                   </View>

//                   {/* All detected colors overlay */}
//                   {detectedColors?.length > 0 && (
//                     <View style={styles.colorsOverlay}>
//                       {detectedColors.slice(0, 3).map((c, idx) => (
//                         <View key={`${c}-${idx}`} style={styles.colorChip}>
//                           <View 
//                             style={[
//                               styles.colorChipDot, 
//                               { backgroundColor: colorMap[c] || '#FFFFFF' }
//                             ]} 
//                           />
//                           <Text style={styles.colorChipText}>{c}</Text>
//                         </View>
//                       ))}
//                     </View>
//                   )}
//                 </View>
//               </>
//             ) : (
//               /* Inactive State / Placeholder */
//               <View style={styles.placeholderContainer}>
//                 <View style={styles.iconCircle}>
//                   <CameraOff size={40} color="#9CA3AF" />
//                 </View>
//                 <Text style={styles.placeholderText}>Camera is Off</Text>
//                 <Text style={styles.placeholderSubtext}>
//                   Tap the button below to start detection
//                 </Text>
//               </View>
//             )}

//             {/* Permission Denied State */}
//             {!permission.granted && (
//               <View style={styles.errorContainer}>
//                 <AlertCircle size={48} color="#EF4444" />
//                 <Text style={styles.errorText}>Camera Permission Required</Text>
//                 <Text style={styles.errorSubtext}>
//                   Allow camera access to detect colors
//                 </Text>
//                 <TouchableOpacity onPress={onRequestPermission} style={styles.errorButton}>
//                   <Text style={styles.errorButtonText}>Grant Permission</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         </View>

//         {/* Controls */}
//         <View style={styles.controls}>
//           <TouchableOpacity
//             onPress={onToggleCamera}
//             activeOpacity={0.8}
//             disabled={!permission?.granted}
//             style={[
//               styles.button,
//               active ? styles.buttonStop : styles.buttonStart,
//               !permission?.granted && styles.buttonDisabled
//             ]}
//           >
//             {active ? (
//               <>
//                 <CameraOff size={24} color="#FFF" />
//                 <Text style={styles.buttonText}>Stop Detection</Text>
//               </>
//             ) : (
//               <>
//                 <ScanLine size={24} color="#FFF" />
//                 <Text style={styles.buttonText}>Start Detection</Text>
//               </>
//             )}
//           </TouchableOpacity>

//           <Text style={styles.statusText}>
//             {active 
//               ? (isConnected ? "Analyzing colors in real-time..." : "Connecting to server...") 
//               : "Ready to detect colors"}
//           </Text>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'space-between',
//   },
//   loadingContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   loadingText: {
//     fontSize: 16,
//     color: '#6B7280',
//   },
//   header: {
//     paddingVertical: 24,
//     paddingHorizontal: 24,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     letterSpacing: -0.5,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginTop: 6,
//     textAlign: 'center',
//   },
//   cameraContainer: {
//     paddingHorizontal: 20,
//     flex: 1,
//     justifyContent: 'center',
//   },
//   cameraWrapper: {
//     width: '100%',
//     aspectRatio: 3 / 4,
//     backgroundColor: '#000000',
//     borderRadius: 24,
//     overflow: 'hidden',
//     borderWidth: 2,
//     borderColor: '#E5E7EB',
//     position: 'relative',
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//   },
//   placeholderContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#F3F4F6',
//     padding: 24,
//   },
//   iconCircle: {
//     width: 80,
//     height: 80,
//     backgroundColor: '#E5E7EB',
//     borderRadius: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   placeholderText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#6B7280',
//     marginBottom: 8,
//   },
//   placeholderSubtext: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     textAlign: 'center',
//   },
//   errorContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FEF2F2',
//     padding: 32,
//     zIndex: 10,
//   },
//   errorText: {
//     color: '#EF4444',
//     marginTop: 16,
//     fontWeight: '700',
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   errorSubtext: {
//     color: '#B91C1C',
//     marginTop: 8,
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   errorButton: {
//     marginTop: 20,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     backgroundColor: '#EF4444',
//     borderRadius: 12,
//     elevation: 2,
//   },
//   errorButtonText: {
//     color: '#FFFFFF',
//     fontWeight: '700',
//     fontSize: 16,
//   },
//   overlayContainer: {
//     ...StyleSheet.absoluteFillObject,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   boundingBox: {
//     position: 'absolute',
//     width: SCAN_AREA_SIZE,
//     height: SCAN_AREA_SIZE,
//     borderWidth: 2,
//     borderColor: 'rgba(74, 222, 128, 0.6)',
//     borderRadius: 16,
//   },
//   scanArea: {
//     position: 'absolute',
//     width: SCAN_AREA_SIZE,
//     height: SCAN_AREA_SIZE,
//     overflow: 'hidden',
//   },
//   scanLine: {
//     width: '100%',
//     height: 3,
//     backgroundColor: '#4ADE80',
//     shadowColor: '#4ADE80',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 1,
//     shadowRadius: 12,
//   },
//   corner: {
//     position: 'absolute',
//     width: 24,
//     height: 24,
//     borderColor: '#22C55E',
//   },
//   cornerTL: { 
//     top: -2, 
//     left: -2, 
//     borderTopWidth: 4, 
//     borderLeftWidth: 4, 
//     borderTopLeftRadius: 6 
//   },
//   cornerTR: { 
//     top: -2, 
//     right: -2, 
//     borderTopWidth: 4, 
//     borderRightWidth: 4, 
//     borderTopRightRadius: 6 
//   },
//   cornerBL: { 
//     bottom: -2, 
//     left: -2, 
//     borderBottomWidth: 4, 
//     borderLeftWidth: 4, 
//     borderBottomLeftRadius: 6 
//   },
//   cornerBR: { 
//     bottom: -2, 
//     right: -2, 
//     borderBottomWidth: 4, 
//     borderRightWidth: 4, 
//     borderBottomRightRadius: 6 
//   },
//   crosshairContainer: {
//     position: 'absolute',
//     width: 60,
//     height: 60,
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 100,
//   },
//   crosshairLineV: {
//     position: 'absolute',
//     width: 2,
//     height: 60,
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     borderRadius: 1,
//   },
//   crosshairLineH: {
//     position: 'absolute',
//     height: 2,
//     width: 60,
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     borderRadius: 1,
//   },
//   crosshairDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 2,
//     borderColor: 'rgba(0, 0, 0, 0.3)',
//     zIndex: 101,
//   },
//   centerLabelContainer: {
//     position: 'absolute',
//     top: '50%',
//     marginTop: 40,
//     alignItems: 'center',
//     zIndex: 99,
//   },
//   centerLabel: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.75)',
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 20,
//     gap: 8,
//   },
//   centerLabelDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//   },
//   centerLabelText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '700',
//     letterSpacing: 0.5,
//   },
//   liveIndicator: {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   recordingDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#EF4444',
//   },
//   recordingDotDisconnected: {
//     backgroundColor: '#9CA3AF',
//   },
//   liveText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '700',
//     letterSpacing: 1.2,
//   },
//   colorsOverlay: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     right: 20,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     alignItems: 'center',
//   },
//   colorChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//     gap: 8,
//   },
//   colorChipDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   colorChipText: {
//     color: '#FFFFFF',
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   controls: {
//     padding: 24,
//     paddingBottom: 32,
//   },
//   button: {
//     width: '100%',
//     paddingVertical: 18,
//     borderRadius: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   buttonStart: {
//     backgroundColor: '#10B981',
//   },
//   buttonStop: {
//     backgroundColor: '#EF4444',
//   },
//   buttonDisabled: {
//     backgroundColor: '#D1D5DB',
//     opacity: 0.6,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: '700',
//     letterSpacing: 0.5,
//   },
//   statusText: {
//     textAlign: 'center',
//     color: '#9CA3AF',
//     fontSize: 13,
//     marginTop: 16,
//     fontWeight: '500',
//   },
// });

//ye opper wala Mudassir ka code. i added theme below
import { CameraType, CameraView, PermissionResponse } from 'expo-camera';
import { AlertCircle, CameraOff, ScanLine, Zap } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../Context/ThemeContext'; // Adjust path as needed

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCAN_AREA_SIZE = 220;

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
  
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const fontScale = getFontSizeMultiplier();

  // Server endpoint
  const SERVER_FRAME_URL = 'http://10.135.88.41:5000/process-frame';

  const [detectedColors, setDetectedColors] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const cameraRef = useRef<any>(null);
  const isProcessingRef = useRef(false);
  const frameIntervalRef = useRef<any>(null);
  const targetFPS = 5; 

  // Map color names returned by server to CSS color strings
  const colorMap: Record<string, string> = {
    Red: '#FF3B30', Blue: '#007AFF', Green: '#34C759', Yellow: '#FFCC00',
    Orange: '#FF9500', Cyan: '#5AC8FA', Purple: '#AF52DE', Pink: '#FF2D55',
    White: '#FFFFFF', Black: '#1F2937', Gray: '#8E8E93', 
  Zap: '#FFD60A', Lime: '#32D74B', Teal: '#64D2FF', Indigo: '#5E5CE6', 
  };

  // --- THEME & STYLES ---
  const styles = useMemo(() => {
    // EXTRACTED PALETTE FROM IMAGE
    const palette = {
      beigeBg: '#F6F3EE',       // The main background cream color
      charcoal: '#2F2F2F',      // "Continue Test" button color
      sage: '#8DA399',          // "Easy Mode" card color
      taupe: '#A9927D',         // "Hard Mode" card color
      textDark: '#1C1C1E',      // Primary Text
      textLight: '#6B6661',     // Secondary Text
      white: '#FFFFFF',
      error: '#C25B5B',         // Muted Red
    };

    // We prioritize the image aesthetic (Light/Cream), but can darken slightly for Dark Mode if needed
    // For this request, we stick to the provided image's "Earth Tone" aesthetic.
    const colors = {
      background: darkMode ? '#1C1C1E' : palette.beigeBg,
      surface: darkMode ? '#2C2C2E' : palette.white,
      textPrimary: darkMode ? '#F6F3EE' : palette.textDark,
      textSecondary: darkMode ? '#9CA3AF' : palette.textLight,
      accentMain: palette.sage,   // Main accent (Scanner, Borders)
      accentSecondary: palette.taupe,
      buttonPrimary: palette.charcoal,
      buttonText: palette.white,
      border: palette.sage,
    };

    return StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: colors.background,
      },
      container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.background,
      },
      loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      loadingText: {
        fontSize: 16 * fontScale,
        color: colors.textSecondary,
        fontFamily: 'System', // San Francisco on iOS
      },
      header: {
        paddingVertical: 30,
        paddingHorizontal: 24,
        alignItems: 'center',
      },
      title: {
        fontSize: 26 * fontScale,
        fontWeight: '800',
        color: colors.textPrimary,
        letterSpacing: -0.5,
        marginBottom: 8,
      },
      subtitle: {
        fontSize: 15 * fontScale,
        color: colors.textSecondary,
        textAlign: 'center',
        fontWeight: '500',
      },
      cameraContainer: {
        paddingHorizontal: 24,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      cameraWrapper: {
        width: '100%',
        aspectRatio: 3 / 4,
        backgroundColor: '#000',
        borderRadius: 30, // Matches the soft corners in the image
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: colors.accentMain, // Using Sage Green for border
        elevation: 10,
        shadowColor: palette.charcoal,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      placeholderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: darkMode ? '#1F2937' : '#E8E4DC', // Slightly darker beige for placeholder
        padding: 24,
      },
      iconCircle: {
        width: 80,
        height: 80,
        backgroundColor: colors.accentMain, // Sage Green circle
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: {width: 0, height: 2}
      },
      placeholderText: {
        fontSize: 18 * fontScale,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 8,
      },
      placeholderSubtext: {
        fontSize: 14 * fontScale,
        color: colors.textSecondary,
        textAlign: 'center',
      },
      errorContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
        padding: 32,
        zIndex: 10,
      },
      errorText: {
        color: palette.error,
        marginTop: 16,
        fontWeight: '700',
        fontSize: 18 * fontScale,
        textAlign: 'center',
      },
      errorButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: palette.error,
        borderRadius: 12,
      },
      errorButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
      },
      overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
      },
      // --- SCANNER STYLES UPDATED TO THEME ---
      boundingBox: {
        position: 'absolute',
        width: SCAN_AREA_SIZE,
        height: SCAN_AREA_SIZE,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.4)', // Subtle white guide
        borderRadius: 20,
      },
      scanArea: {
        position: 'absolute',
        width: SCAN_AREA_SIZE,
        height: SCAN_AREA_SIZE,
        overflow: 'hidden',
        borderRadius: 20,
      },
      scanLine: {
        width: '100%',
        height: 4,
        backgroundColor: colors.accentMain, // Sage Green Scanner
        shadowColor: colors.accentMain,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
      },
      corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: colors.accentMain, // Sage Green Corners
        borderWidth: 4,
      },
      cornerTL: { top: 0, left: 0, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 20 },
      cornerTR: { top: 0, right: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 20 },
      cornerBL: { bottom: 0, left: 0, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 20 },
      cornerBR: { bottom: 0, right: 0, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 20 },
      
      centerLabelContainer: {
        position: 'absolute',
        top: 20,
        alignSelf: 'center',
        zIndex: 99,
      },
      centerLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.buttonPrimary, // Dark Charcoal
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 30,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      centerLabelDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
      },
      centerLabelText: {
        color: '#FFFFFF',
        fontSize: 15 * fontScale,
        fontWeight: '700',
      },
      
      // --- CONTROLS ---
      controls: {
        padding: 24,
        paddingBottom: 40,
      },
      button: {
        width: '100%',
        height: 64, // Taller button like the "Continue Test" button
        borderRadius: 32, // Pill shape
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
      },
      buttonStart: {
        backgroundColor: colors.buttonPrimary, // Dark Charcoal #2F2F2F
      },
      buttonStop: {
        backgroundColor: palette.taupe, // Using Taupe for stop to keep earth tones (or use palette.error)
      },
      buttonDisabled: {
        backgroundColor: '#9CA3AF',
        opacity: 0.8,
      },
      buttonText: {
        color: '#FFFFFF',
        fontSize: 18 * fontScale,
        fontWeight: '700',
        letterSpacing: 0.5,
      },
      statusText: {
        textAlign: 'center',
        color: colors.textSecondary,
        fontSize: 13 * fontScale,
        marginTop: 16,
        fontWeight: '600',
      },
      crosshairContainer: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      },
      crosshairDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 4
      }
    });
  }, [darkMode, fontScale]);

  // Handle camera ready and start frame capture
  const handleCameraReady = () => {
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    const interval = Math.round(1000 / targetFPS);
    
    frameIntervalRef.current = setInterval(async () => {
      if (isProcessingRef.current || !cameraRef.current || !active) return;
      isProcessingRef.current = true;
      try {
        if (cameraRef.current?.takePictureAsync) {
          const photo = await cameraRef.current.takePictureAsync({ 
            base64: true, quality: 0.3, skipProcessing: true, exif: false,
          });
          if ((photo as any)?.base64) {
            fetch(SERVER_FRAME_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: (photo as any).base64, mode: 'center' }),
            })
              .then((res) => res.json())
              .then((json) => {
                if (json?.detected_colors) {
                  setDetectedColors(json.detected_colors || []);
                  setIsConnected(true);
                }
              })
              .catch(() => setIsConnected(false));
          }
        }
      } catch (err) {
        console.warn('Capture error', err);
      } finally {
        isProcessingRef.current = false;
      }
    }, interval);
  };

  useEffect(() => {
    if (!active || !permission?.granted) {
      if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
      setDetectedColors([]);
    }
    return () => { if (frameIntervalRef.current) clearInterval(frameIntervalRef.current); };
  }, [active, permission]);
  
  // Animation Logic
  const scanAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let animation: Animated.CompositeAnimation;
    if (active) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(scanAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );
      animation.start();
    } else {
      scanAnim.setValue(0);
    }
    return () => { if (animation) animation.stop(); };
  }, [active]);

  const scanLineTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCAN_AREA_SIZE],
  });

  if (!permission) return <View style={styles.loadingContainer}><Text>Loading...</Text></View>;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Color Analysis</Text>
          <Text style={styles.subtitle}>Point camera at objects to detect colors</Text>
        </View>

        {/* Camera Viewport */}
        <View style={styles.cameraContainer}>
          <View style={styles.cameraWrapper}>
            {active && permission.granted ? (
              <>
                <CameraView
                  ref={cameraRef}
                  style={StyleSheet.absoluteFill}
                  facing={facing}
                  animateShutter={false}
                  onCameraReady={handleCameraReady}
                />
                
                {/* Overlay Elements */}
                <View style={styles.overlayContainer} pointerEvents="none">
                  
                  {/* Result Pill at Top Center (Cleaner than middle) */}
                  {detectedColors && detectedColors[0] && (
                    <View style={styles.centerLabelContainer}>
                      <View style={styles.centerLabel}>
                        <View style={[styles.centerLabelDot, { backgroundColor: colorMap[detectedColors[0]] || '#FFFFFF' }]} />
                        <Text style={styles.centerLabelText}>{detectedColors[0]}</Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.boundingBox}>
                    {/* Corners */}
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

                  {/* Center Dot */}
                  <View style={styles.crosshairContainer}>
                    <View style={styles.crosshairDot} />
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.placeholderContainer}>
                <View style={styles.iconCircle}>
                  <Zap size={36} color="#FFFFFF" fill="#FFFFFF" />
                </View>
                <Text style={styles.placeholderText}>Camera Standby</Text>
                <Text style={styles.placeholderSubtext}>
                  Tap the button below to{'\n'}begin color analysis
                </Text>
              </View>
            )}

            {!permission.granted && (
              <View style={styles.errorContainer}>
                <AlertCircle size={48} color={styles.errorText.color} />
                <Text style={styles.errorText}>Camera Access Denied</Text>
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
                <CameraOff size={22} color="#FFF" />
                <Text style={styles.buttonText}>Stop Analysis</Text>
              </>
            ) : (
              <>
                <ScanLine size={22} color="#FFF" />
                <Text style={styles.buttonText}>Start Detection</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.statusText}>
            {active 
              ? (isConnected ? "Live analysis in progress..." : "Connecting to server...") 
              : "Ready to start"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
