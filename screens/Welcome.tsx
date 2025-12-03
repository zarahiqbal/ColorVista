// // import React from 'react';
// // import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
// // import { Eye, CheckCircle, Clock, Shield } from 'lucide-react-native'; // ✅ use lucide-react-native in Expo

// // interface WelcomeProps {
// //   onStart: () => void;
// // }

// // export function Welcome({ onStart }: WelcomeProps) {
// //   return (
// //     <ScrollView contentContainerStyle={styles.container}>
// //       <View style={styles.card}>
// //         <View style={styles.center}>
// //           <View style={styles.iconCircle}>
// //             <Eye color="white" size={40} />
// //           </View>
// //           <Text style={styles.title}>Color Vision Test</Text>
// //           <Text style={styles.subtitle}>AI-Powered Color Blindness Screening</Text>
// //         </View>

// //         <View style={styles.infoBox}>
// //           <Text style={styles.sectionTitle}>How It Works</Text>
// //           <Text style={styles.paragraph}>
// //             This test uses advanced analysis to evaluate your color perception across different spectrums.
// //             You'll be shown various colors and asked to identify specific shades. Based on your responses,
// //             our AI algorithm will analyze patterns to determine if you have any form of color vision deficiency.
// //           </Text>
// //         </View>

// //         <View style={styles.featuresGrid}>
// //           <Feature
// //             icon={<Clock color="#2563EB" size={24} />}
// //             title="Quick Test"
// //             description="Takes only 2–3 minutes to complete"
// //           />
// //           <Feature
// //             icon={<CheckCircle color="#2563EB" size={24} />}
// //             title="Comprehensive"
// //             description="Tests for all major types of color blindness"
// //           />
// //           <Feature
// //             icon={<Shield color="#2563EB" size={24} />}
// //             title="Private"
// //             description="Anonymous testing, results stored securely"
// //           />
// //           <Feature
// //             icon={<Eye color="#2563EB" size={24} />}
// //             title="AI Analysis"
// //             description="Intelligent pattern recognition for accurate results"
// //           />
// //         </View>

// //         <View style={styles.warningBox}>
// //           <Text style={styles.warningTitle}>Before You Start:</Text>
// //           <Text style={styles.warningItem}>• Ensure you're in a well-lit environment</Text>
// //           <Text style={styles.warningItem}>• Adjust your screen brightness to a comfortable level</Text>
// //           <Text style={styles.warningItem}>• Remove any colored glasses or filters</Text>
// //           <Text style={styles.warningItem}>• Take your time with each question</Text>
// //         </View>

// //         <TouchableOpacity style={styles.button} onPress={onStart}>
// //           <Text style={styles.buttonText}>Start Color Vision Test</Text>
// //         </TouchableOpacity>

// //         <Text style={styles.footerText}>
// //           This is a screening tool, not a medical diagnosis. Consult an eye care professional for accurate testing.
// //         </Text>
// //       </View>
// //     </ScrollView>
// //   );
// // }

// // const Feature = ({ icon, title, description }: any) => (
// //   <View style={styles.featureItem}>
// //     <View style={styles.icon}>{icon}</View>
// //     <View style={{ flex: 1 }}>
// //       <Text style={styles.featureTitle}>{title}</Text>
// //       <Text style={styles.featureDesc}>{description}</Text>
// //     </View>
// //   </View>
// // );

// // const styles = StyleSheet.create({
// //   container: {
// //     flexGrow: 1,
// //     padding: 20,
// //     alignItems: 'center',
// //     backgroundColor: '#F3F4F6',
// //   },
// //   card: {
// //     backgroundColor: 'white',
// //     borderRadius: 20,
// //     padding: 20,
// //     width: '100%',
// //     maxWidth: 500,
// //     shadowColor: '#000',
// //     shadowOpacity: 0.1,
// //     shadowRadius: 10,
// //     elevation: 5,
// //   },
// //   center: { alignItems: 'center', marginBottom: 20 },
// //   iconCircle: {
// //     width: 80,
// //     height: 80,
// //     borderRadius: 40,
// //     backgroundColor: '#2563EB',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginBottom: 15,
// //   },
// //   title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 5 },
// //   subtitle: { fontSize: 16, color: '#6B7280' },
// //   infoBox: {
// //     backgroundColor: '#EFF6FF',
// //     borderColor: '#BFDBFE',
// //     borderWidth: 2,
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 16,
// //   },
// //   sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
// //   paragraph: { color: '#374151', lineHeight: 20 },
// //   featuresGrid: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     justifyContent: 'space-between',
// //     marginBottom: 20,
// //   },
// //   featureItem: {
// //     width: '48%',
// //     backgroundColor: '#F9FAFB',
// //     borderRadius: 12,
// //     flexDirection: 'row',
// //     padding: 10,
// //     marginBottom: 10,
// //   },
// //   icon: { marginRight: 10, marginTop: 2 },
// //   featureTitle: { fontWeight: '600', color: '#1F2937' },
// //   featureDesc: { fontSize: 12, color: '#6B7280' },
// //   warningBox: {
// //     backgroundColor: '#FEF9C3',
// //     borderColor: '#FDE68A',
// //     borderWidth: 2,
// //     borderRadius: 12,
// //     padding: 10,
// //     marginBottom: 20,
// //   },
// //   warningTitle: { fontWeight: '600', color: '#1F2937', marginBottom: 5 },
// //   warningItem: { fontSize: 13, color: '#374151', marginVertical: 1 },
// //   button: {
// //     backgroundColor: '#2563EB',
// //     borderRadius: 10,
// //     paddingVertical: 14,
// //     alignItems: 'center',
// //   },
// //   buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
// //   footerText: {
// //     fontSize: 11,
// //     color: '#6B7280',
// //     textAlign: 'center',
// //     marginTop: 12,
// //   },
// // });
// import { CheckCircle, Clock, Eye, Shield } from 'lucide-react-native';
// import React from 'react';
// import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// interface WelcomeProps {
//   onStart: () => void;
// }

// export function Welcome({ onStart }: WelcomeProps) {
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
//             description="Tests for all major types of color blindness"
//           />
//           <Feature
//             icon={<Shield color="#1E40AF" size={24} />}
//             title="Private"
//             description="Anonymous testing, results stored securely"
//           />
//           <Feature
//             icon={<Eye color="#1E40AF" size={24} />}
//             title="AI Analysis"
//             description="Intelligent pattern recognition for accurate results"
//           />
//         </View>

//         <View style={styles.warningBox}>
//           <Text style={styles.warningTitle}>Before You Start:</Text>
//           <Text style={styles.warningItem}>• Ensure you're in a well-lit environment</Text>
//           <Text style={styles.warningItem}>• Adjust your screen brightness to a comfortable level</Text>
//           <Text style={styles.warningItem}>• Remove any colored glasses or filters</Text>
//           <Text style={styles.warningItem}>• Take your time with each question</Text>
//         </View>

//         <TouchableOpacity style={styles.button} onPress={onStart}>
//           <Text style={styles.buttonText}>Start Color Vision Test</Text>
//         </TouchableOpacity>

//         <Text style={styles.footerText}>
//           This is a screening tool, not a medical diagnosis. Consult an eye care professional for accurate testing.
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
//     backgroundColor: '#2570bcff',
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
//   },
//   sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
//   paragraph: { color: '#374151', lineHeight: 20 },
//   featuresGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 20,
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
//     backgroundColor: '#FFF8E1',
//     borderColor: '#F59E0B',
//     borderWidth: 2,
//     borderRadius: 12,
//     padding: 10,
//     marginBottom: 20,
//   },
//   warningTitle: { fontWeight: '600', color: '#111827', marginBottom: 5 },
//   warningItem: { fontSize: 13, color: '#374151', marginVertical: 1 },
//   button: {
//     backgroundColor: '#1E40AF',
//     borderRadius: 10,
//     paddingVertical: 14,
//     alignItems: 'center',
//   },
//   buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
//   footerText: {
//     fontSize: 11,
//     color: '#6B7280',
//     textAlign: 'center',
//     marginTop: 12,
//   },
// });

// export default Welcome;

import { AlertTriangle, CheckCircle, Clock, Eye, Shield } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Welcome({ onStart }: any) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.center}>
          <View style={styles.iconCircle}>
            <Eye color="white" size={40} />
          </View>
          <Text style={styles.title}>Color Vision Test</Text>
          <Text style={styles.subtitle}>AI-Powered Color Blindness Screening</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.paragraph}>
            This test uses advanced analysis to evaluate your color perception across different spectrums.
            You'll be shown various colors and asked to identify specific shades. Based on your responses,
            our AI algorithm will analyze patterns to determine if you have any form of color vision deficiency.
          </Text>
        </View>

        <View style={styles.featuresGrid}>
          <Feature
            icon={<Clock color="#1E40AF" size={24} />}
            title="Quick Test"
            description="Takes only 2–3 minutes to complete"
          />
          <Feature
            icon={<CheckCircle color="#1E40AF" size={24} />}
            title="Comprehensive"
            description="Tests all major types of color blindness"
          />
          <Feature
            icon={<Shield color="#1E40AF" size={24} />}
            title="Private"
            description="Anonymous and secure"
          />
          <Feature
            icon={<Eye color="#1E40AF" size={24} />}
            title="AI Analysis"
            description="Advanced pattern detection"
          />
        </View>

        <View style={styles.warningBox}>
          <View style={styles.warningHeader}>
  <AlertTriangle color="#6c601dff" size={20} />
  <Text style={styles.warningsTitle}>Before You Start:</Text>
</View>
          <Text style={styles.warningItem}>Use a well-lit environment</Text>
          <Text style={styles.warningItem}>Adjust screen brightness</Text>
          <Text style={styles.warningItem}>Remove colored glasses</Text>
          <Text style={styles.warningItem}>Take your time</Text>
        </View>

        {/* IMPORTANT: This now calls onStart */}
        <TouchableOpacity style={styles.button} onPress={onStart}>
          <Text style={styles.buttonText}>Start Color Vision Test</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          This is a screening tool, not a medical diagnosis.
        </Text>
      </View>
    </ScrollView>
  );
}

const Feature = ({ icon, title, description }: any) => (
  <View style={styles.featureItem}>
    <View style={styles.icon}>{icon}</View>
    <View style={{ flex: 1 }}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 2,
    alignItems: 'center',
    backgroundColor: '',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 7,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  center: { alignItems: 'center', marginBottom: 20 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#4B5563' },
  infoBox: {
    backgroundColor: '#E0F2F1',
    borderColor: '#A7F3D0',
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginRight: 10,
    marginLeft: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  paragraph: { color: '#374151', lineHeight: 20 },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginRight: 10,
    marginLeft: 10,
  },
  featureItem: {
    width: '48%',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
  },
  icon: { marginRight: 10, marginTop: 2 },
  featureTitle: { fontWeight: '600', color: '#111827' },
  featureDesc: { fontSize: 12, color: '#4B5563' },
  warningBox: {
    backgroundColor: '#e3d68d30',
    borderColor: '#6c601dff',
    borderWidth: 2,
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
    marginRight: 70,
    marginLeft: 70,
  },
  warningTitle: { fontWeight: '600', color: '#111827', marginBottom: 5 ,},
  warningItem: { fontSize: 13, color: '#374151', marginVertical: 1 },
  button: {
    backgroundColor: '#1E40AF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  iconWarning:{
     display: "flex",
     justifyContent: "center",
     marginTop: 5,
  },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
  footerText: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
  },
  warningHeader: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,   // or marginRight
  marginBottom: 5,
},

warningsTitle: {
  fontWeight: "600",
  color: "#111827",
  fontSize: 15,
},

});



// import { CheckCircle, Clock, Eye, Shield } from 'lucide-react-native';
// import React from 'react';
// import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// export default function Welcome({ navigation }: any) {
//   const handleStart = () => {
//     navigation.navigate("QuizScreen"); // 👈 change to your quiz screen name
//   };

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
//           <Text style={styles.warningTitle}>Before You Start:</Text>
//           <Text style={styles.warningItem}>• Use a well-lit environment</Text>
//           <Text style={styles.warningItem}>• Adjust screen brightness</Text>
//           <Text style={styles.warningItem}>• Remove colored glasses</Text>
//           <Text style={styles.warningItem}>• Take your time</Text>
//         </View>

//         <TouchableOpacity style={styles.button} onPress={handleStart}>
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
//     backgroundColor: '#2570bcff',
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
//   },
//   sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
//   paragraph: { color: '#374151', lineHeight: 20 },
//   featuresGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 20,
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
//     backgroundColor: '#FFF8E1',
//     borderColor: '#F59E0B',
//     borderWidth: 2,
//     borderRadius: 12,
//     padding: 10,
//     marginBottom: 20,
//   },
//   warningTitle: { fontWeight: '600', color: '#111827', marginBottom: 5 },
//   warningItem: { fontSize: 13, color: '#374151', marginVertical: 1 },
//   button: {
//     backgroundColor: '#1E40AF',
//     borderRadius: 10,
//     paddingVertical: 14,
//     alignItems: 'center',
//   },
//   buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
//   footerText: {
//     fontSize: 11,
//     color: '#6B7280',
//     textAlign: 'center',
//     marginTop: 12,
//   },
// });
