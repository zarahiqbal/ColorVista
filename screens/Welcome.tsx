
// import { AlertTriangle, CheckCircle, Clock, Eye, Shield } from 'lucide-react-native';
// import React from 'react';
// import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// export default function Welcome({ onStart }: any) {
//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.card}>
//         <View style={styles.center}>
//           <View style={styles.iconCircle}>
//             <Eye color="white" size={40} />
//           </View>
//           <Text style={styles.title}>Color Vision Test</Text>
//           <Text style={styles.subtitle}>AI-Powered Color Blindness Screening</Text>
//         </View>

//         <View style={styles.infoBox}>
//           <Text style={styles.sectionTitle}>How It Works</Text>
//           <Text style={styles.paragraph}>
//             This test uses advanced analysis to evaluate your color perception across different spectrums.
//             You'll be shown various colors and asked to identify specific shades. Based on your responses,
//             our AI algorithm will analyze patterns to determine if you have any form of color vision deficiency.
//           </Text>
//         </View>

//         <View style={styles.featuresGrid}>
//           <Feature
//             icon={<Clock color="#1E40AF" size={24} />}
//             title="Quick Test"
//             description="Takes only 2–3 minutes to complete"
//           />
//           <Feature
//             icon={<CheckCircle color="#1E40AF" size={24} />}
//             title="Comprehensive"
//             description="Tests all major types of color blindness"
//           />
//           <Feature
//             icon={<Shield color="#1E40AF" size={24} />}
//             title="Private"
//             description="Anonymous and secure"
//           />
//           <Feature
//             icon={<Eye color="#1E40AF" size={24} />}
//             title="AI Analysis"
//             description="Advanced pattern detection"
//           />
//         </View>

//         <View style={styles.warningBox}>
//           <View style={styles.warningHeader}>
//   <AlertTriangle color="#6c601dff" size={20} />
//   <Text style={styles.warningsTitle}>Before You Start:</Text>
// </View>
//           <Text style={styles.warningItem}>Use a well-lit environment</Text>
//           <Text style={styles.warningItem}>Adjust screen brightness</Text>
//           <Text style={styles.warningItem}>Remove colored glasses</Text>
//           <Text style={styles.warningItem}>Take your time</Text>
//         </View>

//         {/* IMPORTANT: This now calls onStart */}
//         <TouchableOpacity style={styles.button} onPress={onStart}>
//           <Text style={styles.buttonText}>Start Color Vision Test</Text>
//         </TouchableOpacity>

//         <Text style={styles.footerText}>
//           This is a screening tool, not a medical diagnosis.
//         </Text>
//       </View>
//     </ScrollView>
//   );
// }

// const Feature = ({ icon, title, description }: any) => (
//   <View style={styles.featureItem}>
//     <View style={styles.icon}>{icon}</View>
//     <View style={{ flex: 1 }}>
//       <Text style={styles.featureTitle}>{title}</Text>
//       <Text style={styles.featureDesc}>{description}</Text>
//     </View>
//   </View>
// );

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 2,
//     alignItems: 'center',
//     backgroundColor: '',
//   },
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 20,
//     padding: 7,
//     width: '100%',
//     maxWidth: 500,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   center: { alignItems: 'center', marginBottom: 20 },
//   iconCircle: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#1E40AF',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 15,
//   },
//   title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 5 },
//   subtitle: { fontSize: 16, color: '#4B5563' },
//   infoBox: {
//     backgroundColor: '#E0F2F1',
//     borderColor: '#A7F3D0',
//     borderWidth: 2,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     marginRight: 10,
//     marginLeft: 10,
//   },
//   sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
//   paragraph: { color: '#374151', lineHeight: 20 },
//   featuresGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//     marginRight: 10,
//     marginLeft: 10,
//   },
//   featureItem: {
//     width: '48%',
//     backgroundColor: '#F3F4F6',
//     borderRadius: 12,
//     flexDirection: 'row',
//     padding: 10,
//     marginBottom: 10,
//   },
//   icon: { marginRight: 10, marginTop: 2 },
//   featureTitle: { fontWeight: '600', color: '#111827' },
//   featureDesc: { fontSize: 12, color: '#4B5563' },
//   warningBox: {
//     backgroundColor: '#e3d68d30',
//     borderColor: '#6c601dff',
//     borderWidth: 2,
//     borderRadius: 12,
//     padding: 10,
//     marginBottom: 20,
//     alignItems: 'center',
//     marginRight: 70,
//     marginLeft: 70,
//   },
//   warningTitle: { fontWeight: '600', color: '#111827', marginBottom: 5 ,},
//   warningItem: { fontSize: 13, color: '#374151', marginVertical: 1 },
//   button: {
//     backgroundColor: '#1E40AF',
//     borderRadius: 10,
//     paddingVertical: 14,
//     alignItems: 'center',
//     marginLeft: 10,
//     marginRight: 10,
//   },
//   iconWarning:{
//      display: "flex",
//      justifyContent: "center",
//      marginTop: 5,
//   },
//   buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
//   footerText: {
//     fontSize: 11,
//     color: '#6B7280',
//     textAlign: 'center',
//     marginTop: 12,
//   },
//   warningHeader: {
//   flexDirection: "row",
//   alignItems: "center",
//   gap: 6,   // or marginRight
//   marginBottom: 5,
// },

// warningsTitle: {
//   fontWeight: "600",
//   color: "#111827",
//   fontSize: 15,
// },

// });


import { Brain, CheckCircle, Clock, Shield } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Welcome({ onStart }: any) {
  // Animation values for floating circles
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation for circle 1
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: -15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation for circle 2 (different timing)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: -20,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation for circle 3 (different timing)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim3, {
          toValue: -12,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim3, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Color Vision Test</Text>
          
          {/* Illustration - Woman with magnifying glass */}
          <View style={styles.illustrationContainer}>
            <View style={styles.illustrationCircle}>
                <Image 
                  source={require('../assets/images/CVDTest.png')}
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>
            {/* Animated decorative elements around the circle */}
            <Animated.View 
              style={[
                styles.decorCircle1,
                { transform: [{ translateY: floatAnim1 }] }
              ]} 
            />
            <Animated.View 
              style={[
                styles.decorCircle2,
                { transform: [{ translateY: floatAnim2 }] }
              ]} 
            />
            <Animated.View 
              style={[
                styles.decorCircle3,
                { transform: [{ translateY: floatAnim3 }] }
              ]} 
            />
          </View>
        </View>

        {/* How It Works Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsContainer}>
            <View style={[styles.stepCard, { backgroundColor: '#B5A5B5' }]}>
              <View style={styles.stepIcon}>
                <Text style={styles.eyeIcon}>👁</Text>
              </View>
              <Text style={styles.stepText}>See Images</Text>
            </View>
            <View style={[styles.stepCard, { backgroundColor: '#B8A090' }]}>
              <View style={styles.stepIcon}>
                <Text style={styles.shapesTextDark}>□△</Text>
              </View>
              <Text style={styles.stepText}>Identify Patterns</Text>
            </View>
            <View style={[styles.stepCard, { backgroundColor: '#9B8B8B' }]}>
              <View style={styles.stepIcon}>
                <Text style={styles.chipIcon}>⚙</Text>
              </View>
              <Text style={styles.stepText}>AI Analysis</Text>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresGrid}>
            <View style={[styles.featureCard, { backgroundColor: '#9B8B9B' }]}>
              <Clock color="white" size={28} />
              <Text style={styles.featureTitle}>Quick Test</Text>
              <Text style={styles.featureSubtitle}>2-3 min</Text>
            </View>
            <View style={[styles.featureCard, { backgroundColor: '#8B7B8B' }]}>
              <CheckCircle color="white" size={28} />
              <Text style={styles.featureTitle}>Comprehensive</Text>
            </View>
            <View style={[styles.featureCard, { backgroundColor: '#3B3B3B' }]}>
              <Shield color="white" size={28} />
              <Text style={styles.featureTitle}>Private</Text>
            </View>
            <View style={[styles.featureCard, { backgroundColor: '#B89B80' }]}>
              <Brain color="white" size={28} />
              <Text style={styles.featureTitle}>AI Analysis</Text>
            </View>
          </View>
        </View>

        {/* Before You Start Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Before You Start</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipItem}>
              <View style={styles.tipIconCircle}>
                <Text style={styles.tipIconText}>☀</Text>
              </View>
              <Text style={styles.tipText}>Use a well-lit environment</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipIconCircle}>
                <Text style={styles.tipIconText}>ℹ</Text>
              </View>
              <Text style={styles.tipText}>Adjust screen brightness</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipIconCircle}>
                <Text style={styles.tipIconText}>∞</Text>
              </View>
              <Text style={styles.tipText}>Remove colored glasses</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipIconCircle}>
                <Text style={styles.tipIconText}>◎</Text>
              </View>
              <Text style={styles.tipText}>Take your time</Text>
            </View>
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity style={styles.startButton} onPress={onStart}>
          <Text style={styles.startButtonText}>Start Test →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 0,
    backgroundColor: '#C9B8A8',
  },
  card: {
    backgroundColor: '#F5F0EB',
    borderRadius: 32,
    padding: 28,
    width: '100%',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2B2B2B',
    marginBottom: 24,
  },
  illustrationContainer: {
    width: '100%',
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  illustrationCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E8DDD8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  illustration: {
    width: 120,
    height: 120,
  },
  decorCircle1: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#B8A8A8',
    position: 'absolute',
    left: '20%',
    top: 30,
    opacity: 0.6,
  },
  decorCircle2: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#C9B8B8',
    position: 'absolute',
    right: '15%',
    top: 25,
    opacity: 0.5,
  },
  decorCircle3: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#A89898',
    position: 'absolute',
    left: '25%',
    bottom: 25,
    opacity: 0.5,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B2B2B',
    marginBottom: 14,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  stepCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
  },
  stepIcon: {
    marginBottom: 8,
  },
  eyeIcon: {
    fontSize: 32,
  },
  shapesText: {
    fontSize: 28,
    color: 'white',
    fontWeight: '300',
  },
  shapesTextDark: {
    fontSize: 28,
    color: '#2B2B2B',
    fontWeight: '300',
  },
  chipIcon: {
    fontSize: 32,
  },
  stepText: {
    fontSize: 11,
    color: '#2B2B2B',
    textAlign: 'center',
    fontWeight: '500',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featureCard: {
    width: '48%',
    borderRadius: 12,
    padding: 18,
    minHeight: 100,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    marginTop: 10,
  },
  featureSubtitle: {
    fontSize: 12,
    color: 'white',
    marginTop: 2,
    opacity: 0.9,
  },
  tipsContainer: {
    gap: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#9B8B8B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipIconText: {
    fontSize: 14,
    color: '#8B7B8B',
  },
  tipText: {
    fontSize: 14,
    color: '#2B2B2B',
    flex: 1,
  },
  startButton: {
    backgroundColor: '#8B7B9B',
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 12,
  },
  startButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
});