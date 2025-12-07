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