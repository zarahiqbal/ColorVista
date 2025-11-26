// import React, { useState, useEffect } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";

// export default function LiveScreen() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const [active, setActive] = useState(false);

//   if (!permission) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.center}>
//         <Text>We need your permission to show the camera</Text>
//         <TouchableOpacity onPress={requestPermission} style={styles.button}>
//           <Text style={styles.buttonText}>Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Live Detection</Text>

//       <View style={styles.cameraBox}>
//         {active ? (
//           <CameraView style={StyleSheet.absoluteFill} facing="back" />
//         ) : (
//           <Text style={styles.placeholder}>Camera is Off</Text>
//         )}
//       </View>

//       <TouchableOpacity
//         style={[styles.button, active ? styles.stopBtn : styles.startBtn]}
//         onPress={() => setActive(!active)}
//       >
//         <Text style={styles.buttonText}>
//           {active ? "Stop Detection" : "Start Live Detection"}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#fff" },
//   title: { fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 20 },
//   cameraBox: {
//     width: "100%",
//     height: 350,
//     backgroundColor: "#ddd",
//     borderRadius: 15,
//     overflow: "hidden",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   placeholder: { fontSize: 18, color: "#555" },
//   button: { padding: 15, borderRadius: 12, alignItems: "center", marginTop: 20 },
//   startBtn: { backgroundColor: "#2ECC71" },
//   stopBtn: { backgroundColor: "#E74C3C" },
//   buttonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
// });
// import { CameraType, CameraView, PermissionResponse } from 'expo-camera';
// import { AlertCircle, CameraOff, ScanLine } from 'lucide-react-native';
// import React, { useEffect, useRef } from 'react';
// import { Animated, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// const SCAN_AREA_HEIGHT = 300;

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
  
//   // Animation Logic
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
//       scanAnim.stopAnimation();
//     }

//     return () => {
//       if (animation) animation.stop();
//     };
//   }, [active]);

//   const scanLineTranslateY = scanAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, SCAN_AREA_HEIGHT],
//   });

//   // Loading State
//   if (!permission) {
//     return <View style={styles.container} />;
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
        
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.title}>Live Detection</Text>
//           <Text style={styles.subtitle}>Object recognition stream</Text>
//         </View>

//         {/* Camera Viewport Container */}
//         <View style={styles.cameraContainer}>
//           <View style={styles.cameraWrapper}>
            
//             {/* Active Camera View */}
//             {active && permission.granted ? (
//               <CameraView
//                 style={StyleSheet.absoluteFill}
//                 facing={facing}
//                 animateShutter={false}
//               />
//             ) : (
//               /* Inactive State / Placeholder */
//               <View style={styles.placeholderContainer}>
//                 <View style={styles.iconCircle}>
//                   <CameraOff size={32} color="#9CA3AF" />
//                 </View>
//                 <Text style={styles.placeholderText}>Camera is Off</Text>
//               </View>
//             )}

//             {/* Permission Denied State */}
//             {!permission.granted && !permission.canAskAgain && (
//               <View style={styles.errorContainer}>
//                 <AlertCircle size={48} color="#EF4444" />
//                 <Text style={styles.errorText}>Camera permission denied</Text>
//                 <TouchableOpacity onPress={onRequestPermission} style={styles.errorButton}>
//                     <Text style={styles.errorButtonText}>Grant Permission</Text>
//                 </TouchableOpacity>
//               </View>
//             )}

//             {/* Scanner Overlay (Visible when active) */}
//             {active && permission.granted && (
//               <View style={styles.overlayContainer} pointerEvents="none">
//                 {/* Bounding Box */}
//                 <View style={styles.boundingBox}>
//                   <View style={[styles.corner, styles.cornerTL]} />
//                   <View style={[styles.corner, styles.cornerTR]} />
//                   <View style={[styles.corner, styles.cornerBL]} />
//                   <View style={[styles.corner, styles.cornerBR]} />
//                 </View>

//                 {/* Animated Scan Line */}
//                 <View style={styles.scanArea}>
//                   <Animated.View
//                     style={[
//                       styles.scanLine,
//                       { transform: [{ translateY: scanLineTranslateY }] },
//                     ]}
//                   />
//                 </View>

//                 {/* Live Indicator */}
//                 <View style={styles.liveIndicator}>
//                   <View style={styles.recordingDot} />
//                   <Text style={styles.liveText}>LIVE</Text>
//                 </View>
//               </View>
//             )}
//           </View>
//         </View>

//         {/* Controls */}
//         <View style={styles.controls}>
//           <TouchableOpacity
//             onPress={onToggleCamera}
//             activeOpacity={0.8}
//             style={[
//               styles.button,
//               active ? styles.buttonStop : styles.buttonStart
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
//                 <Text style={styles.buttonText}>Start Live Detection</Text>
//               </>
//             )}
//           </TouchableOpacity>

//           <Text style={styles.statusText}>
//             {active ? "Processing video frames..." : "Ready to start camera stream"}
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
//   header: {
//     paddingTop: 20,
//     paddingBottom: 20,
//     paddingHorizontal: 24,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1F2937',
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginTop: 4,
//   },
//   cameraContainer: {
//     paddingHorizontal: 24,
//     flex: 1,
//     justifyContent: 'center',
//   },
//   cameraWrapper: {
//     width: '100%',
//     aspectRatio: 3 / 4,
//     backgroundColor: '#F3F4F6',
//     borderRadius: 24,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     position: 'relative',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   placeholderContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#F3F4F6',
//   },
//   iconCircle: {
//     width: 64,
//     height: 64,
//     backgroundColor: '#E5E7EB',
//     borderRadius: 32,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 16,
//   },
//   placeholderText: {
//     fontWeight: '500',
//     color: '#9CA3AF',
//   },
//   errorContainer: {
//     position: 'absolute',
//     inset: 0,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FEF2F2',
//     padding: 24,
//     zIndex: 10,
//   },
//   errorText: {
//     color: '#EF4444',
//     marginTop: 16,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   errorButton: {
//       marginTop: 12,
//       paddingHorizontal: 16,
//       paddingVertical: 8,
//       backgroundColor: '#FEE2E2',
//       borderRadius: 8
//   },
//   errorButtonText: {
//       color: '#B91C1C',
//       fontWeight: '600',
//       fontSize: 12
//   },
//   overlayContainer: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   boundingBox: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     width: 200,
//     height: 200,
//     transform: [{ translateX: -100 }, { translateY: -100 }],
//     borderWidth: 2,
//     borderColor: 'rgba(74, 222, 128, 0.5)',
//     borderRadius: 12,
//   },
//   scanArea: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     width: 200,
//     height: 200,
//     transform: [{ translateX: -100 }, { translateY: -100 }],
//     overflow: 'hidden',
//   },
//   scanLine: {
//     width: '100%',
//     height: 4,
//     backgroundColor: '#4ADE80',
//     shadowColor: '#4ADE80',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.8,
//     shadowRadius: 10,
//   },
//   corner: {
//     position: 'absolute',
//     width: 20,
//     height: 20,
//     borderColor: '#22C55E',
//   },
//   cornerTL: { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 4 },
//   cornerTR: { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 4 },
//   cornerBL: { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 4 },
//   cornerBR: { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 4 },
//   liveIndicator: {
//     position: 'absolute',
//     top: 16,
//     right: 16,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 999,
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
//   liveText: {
//     color: '#FFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//     letterSpacing: 1,
//   },
//   controls: {
//     padding: 24,
//     paddingBottom: 40,
//   },
//   button: {
//     width: '100%',
//     paddingVertical: 16,
//     borderRadius: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   buttonStart: {
//     backgroundColor: '#10B981',
//   },
//   buttonStop: {
//     backgroundColor: '#EF4444',
//   },
//   buttonText: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   statusText: {
//     textAlign: 'center',
//     color: '#9CA3AF',
//     fontSize: 12,
//     marginTop: 16,
//   },
// });

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
// 1. Change this import to fix the deprecation warning
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { CameraView, CameraType, PermissionResponse } from 'expo-camera';
import { ScanLine, CameraOff, AlertCircle } from 'lucide-react-native';

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
    return <View style={styles.container} />;
  }

  return (
    // 2. Used SafeAreaView from the new context library
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Live Detection</Text>
          <Text style={styles.subtitle}>Object recognition stream</Text>
        </View>

        {/* Camera Viewport Container */}
        <View style={styles.cameraContainer}>
          <View style={styles.cameraWrapper}>
            
            {/* Active Camera View */}
            {active && permission.granted ? (
              <CameraView
                style={StyleSheet.absoluteFill}
                facing={facing}
                animateShutter={false}
              />
            ) : (
              /* Inactive State / Placeholder */
              <View style={styles.placeholderContainer}>
                <View style={styles.iconCircle}>
                  <CameraOff size={32} color="#9CA3AF" />
                </View>
                <Text style={styles.placeholderText}>Camera is Off</Text>
              </View>
            )}

            {/* Permission Denied State */}
            {!permission.granted && !permission.canAskAgain && (
              <View style={styles.errorContainer}>
                <AlertCircle size={48} color="#EF4444" />
                <Text style={styles.errorText}>Camera permission denied</Text>
                <TouchableOpacity onPress={onRequestPermission} style={styles.errorButton}>
                    <Text style={styles.errorButtonText}>Grant Permission</Text>
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
                  <Text style={styles.liveText}>LIVE</Text>
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
                <CameraOff size={24} color="#FFF" />
                <Text style={styles.buttonText}>Stop Detection</Text>
              </>
            ) : (
              <>
                <ScanLine size={24} color="#FFF" />
                <Text style={styles.buttonText}>Start Live Detection</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.statusText}>
            {active ? "Processing video frames..." : "Ready to start camera stream"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
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
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    backgroundColor: '#F3F4F6',
  },
  iconCircle: {
    width: 64,
    height: 64,
    backgroundColor: '#E5E7EB',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    fontWeight: '500',
    color: '#9CA3AF',
  },
  errorContainer: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
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
      fontSize: 12
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
    fontSize: 12,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 16,
  },
});