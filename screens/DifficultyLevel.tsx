// import { Brain, Target, Zap } from 'lucide-react-native';
// import React from 'react';
// import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// interface DifficultySelectionProps {
//   onSelectDifficulty: (difficulty: 'easy' | 'hard') => void;
// }

// export function DifficultySelection({ onSelectDifficulty }: DifficultySelectionProps) {
//   return (
//     <ScrollView>
//     <View style={styles.container}>
//       <View style={styles.card}>
//         <View style={styles.header}>
//           <View style={styles.iconCircle}>
//             <Target color="white" size={32} />
//           </View>
//           <Text style={styles.title}>Select Difficulty Level</Text>
//           <Text style={styles.subtitle}>Choose the level that best suits your testing needs</Text>
//         </View>

//         <View style={styles.buttonContainer}>
//           {/* Easy Mode */}
//           <Pressable
//             onPress={() => onSelectDifficulty('easy')}
//             style={({ pressed }) => [
//               styles.option,
//               styles.easyOption,
//               pressed && styles.optionPressed,
//             ]}
//           >
//             <View style={styles.optionContent}>
//               <View style={[styles.optionIcon, { backgroundColor: '#2AA198' }]}>
//                 <Zap color="white" size={32} />
//               </View>
//               <Text style={styles.optionTitle}>Easy Mode</Text>
//               <Text style={styles.optionDesc}>Perfect for beginners or quick screening</Text>
//               <View style={styles.optionList}>
//                 <Text style={styles.listItem}>• Fewer questions (6 total)</Text>
//                 <Text style={styles.listItem}>• More distinct color differences</Text>
//                 <Text style={styles.listItem}>• Simpler color patterns</Text>
//                 <Text style={styles.listItem}>• Takes about 1–2 minutes</Text>
//               </View>
//             </View>
//           </Pressable>

//           {/* Hard Mode */}
//           <Pressable
//             onPress={() => onSelectDifficulty('hard')}
//             style={({ pressed }) => [
//               styles.option,
//               styles.hardOption,
//               pressed && styles.optionPressed,
//             ]}
//           >
//             <View style={styles.optionContent}>
//               <View style={[styles.optionIcon, { backgroundColor: '#E9B44C' }]}>
//                 <Brain color="white" size={32} />
//               </View>
//               <Text style={styles.optionTitle}>Hard Mode</Text>
//               <Text style={styles.optionDesc}>Comprehensive testing for detailed analysis</Text>
//               <View style={styles.optionList}>
//                 <Text style={styles.listItem}>• More questions (12 total)</Text>
//                 <Text style={styles.listItem}>• Subtle color differences</Text>
//                 <Text style={styles.listItem}>• Complex color patterns</Text>
//                 <Text style={styles.listItem}>• Takes about 3–4 minutes</Text>
//               </View>
//             </View>
//           </Pressable>
//         </View>

//         <View style={styles.tipBox}>
//           <Text style={styles.tipText}>
//             <Text style={styles.bold}>Tip:</Text> Start with Easy mode if you're not sure.
//             You can always retake the test on Hard mode for more detailed results.
//           </Text>
//         </View>
//       </View>
//     </View></ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//     padding: 2,
//   },
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 20,
//     padding: 2,
//     elevation: 4,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   iconCircle: {
//     backgroundColor: '#475569',
//     borderRadius: 40,
//     width: 70,
//     height: 70,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 12,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#1E293B',
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#64748B',
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     gap: 16,
//   },
//   option: {
//     borderRadius: 16,
//     padding: 20,
//     borderWidth: 2,
//     elevation: 2,
//   },
//   optionPressed: {
//     transform: [{ scale: 0.97 }],
//   },
//   easyOption: {
//     backgroundColor: '#F0FDF9',
//     borderColor: '#2AA198',
//   },
//   hardOption: {
//     backgroundColor: '#FFFBEB',
//     borderColor: '#E9B44C',
//   },
//   optionContent: {
//     alignItems: 'center',
//   },
//   optionIcon: {
//     borderRadius: 40,
//     width: 64,
//     height: 64,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 12,
//   },
//   optionTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1E293B',
//     marginBottom: 8,
//   },
//   optionDesc: {
//     fontSize: 14,
//     color: '#475569',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   optionList: {
//     alignSelf: 'flex-start',
//   },
//   listItem: {
//     fontSize: 13,
//     color: '#475569',
//     marginBottom: 4,
//   },
//   tipBox: {
//     backgroundColor: '#E0F2FE',
//     borderColor: '#BAE6FD',
//     borderWidth: 2,
//     borderRadius: 12,
//     padding: 10,
//     marginTop: 16,
//   },
//   tipText: {
//     fontSize: 13,
//     color: '#334155',
//     textAlign: 'center',
//   },
//   bold: {
//     fontWeight: '700',
//   },
// });
import { useRouter } from 'expo-router';
import { Flame, Zap } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function DifficultySelection({ onSelectDifficulty }: { onSelectDifficulty: (d: 'easy' | 'hard') => void }) {
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'hard' | null>(null);

  const handleSelectDifficulty = (difficulty: 'easy' | 'hard') => {
    setSelectedDifficulty(difficulty);
  };

  const handleContinue = () => {
    if (selectedDifficulty) {
      onSelectDifficulty(selectedDifficulty);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button Only */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/welcome')}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Title */}
        <Text style={styles.title}>Choose Your Test Level</Text>

        {/* Easy Mode Card */}
        <View style={styles.cardWrapper}>
          <TouchableOpacity
            style={[
              styles.difficultyCard,
              styles.easyCard,
              selectedDifficulty === 'easy' && styles.selectedCard
            ]}
            onPress={() => handleSelectDifficulty('easy')}
          >
            {/* Icon at top center */}
            <View style={styles.cardIconTop}>
              <View style={[styles.iconCircle, { backgroundColor: '#6B7B7B' }]}>
                <Zap color="#2B2B2B" size={28} fill="#2B2B2B" />
              </View>
            </View>

            <Text style={styles.cardTitle}>Easy Mode</Text>
            <Text style={styles.cardDescription}>Perfect for beginners or quick screening.</Text>

            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <View style={styles.featureDot} />
                </View>
                <Text style={styles.featureText}>More distinct color differences</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <View style={styles.featureDot} />
                </View>
                <Text style={styles.featureText}>Simpler color patterns</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <View style={styles.featureDot} />
                </View>
                <Text style={styles.featureText}>Takes about 3-4 minutes</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Hard Mode Card */}
        <View style={styles.cardWrapper}>
          <TouchableOpacity
            style={[
              styles.difficultyCard,
              styles.hardCard,
              selectedDifficulty === 'hard' && styles.selectedCard
            ]}
            onPress={() => handleSelectDifficulty('hard')}
          >
            {/* Icon at top center */}
            <View style={styles.cardIconTop}>
              <View style={[styles.iconCircle, { backgroundColor: '#C08B6B' }]}>
                <Flame color="#2B2B2B" size={28} fill="#2B2B2B" />
              </View>
            </View>

            <Text style={styles.cardTitle}>Hard Mode</Text>
            <Text style={styles.cardDescription}>Comprehensive test for detailed analysis.</Text>

            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <View style={styles.featureDot} />
                </View>
                <Text style={styles.featureText}>More questions (12 total)</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <View style={styles.featureDot} />
                </View>
                <Text style={styles.featureText}>Subtle color differences</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <View style={styles.featureDot} />
                </View>
                <Text style={styles.featureText}>Complex color patterns</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <View style={styles.featureDot} />
                </View>
                <Text style={styles.featureText}>Takes about 8-10 minutes</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedDifficulty && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedDifficulty}
        >
          <Text style={styles.continueButtonText}>Continue Test</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#F5F0EB',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backIcon: {
    fontSize: 24,
    color: '#2B2B2B',
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2B2B2B',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B2B2B',
    textAlign: 'center',
    marginTop: 28,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  cardWrapper: {
    marginBottom: 32,
    paddingTop: 28,
  },
  difficultyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    position: 'relative',
    borderWidth: 3,
    borderColor: 'transparent',
    paddingTop: 32,
  },
  easyCard: {
    backgroundColor: '#8B9B9B',
  },
  hardCard: {
    backgroundColor: '#A89888',
  },
  selectedCard: {
    borderColor: '#2B2B2B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  cardIconTop: {
    position: 'absolute',
    top: -28,
    left: '50%',
    marginLeft: -28,
    zIndex: 10,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#F5F0EB',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2B2B2B',
    textAlign: 'left',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#2B2B2B',
    textAlign: 'left',
    marginBottom: 18,
    opacity: 0.8,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(43, 43, 43, 0.6)',
  },
  featureText: {
    fontSize: 14,
    color: '#2B2B2B',
    flex: 1,
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: '#3B3B3B',
    borderRadius: 50,
    paddingVertical: 18,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 32,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#9B9B9B',
    opacity: 0.5,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
});