import { Brain, Target, Zap } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface DifficultySelectionProps {
  onSelectDifficulty: (difficulty: 'easy' | 'hard') => void;
}

export function DifficultySelection({ onSelectDifficulty }: DifficultySelectionProps) {
  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Target color="white" size={32} />
          </View>
          <Text style={styles.title}>Select Difficulty Level</Text>
          <Text style={styles.subtitle}>Choose the level that best suits your testing needs</Text>
        </View>

        <View style={styles.buttonContainer}>
          {/* Easy Mode */}
          <Pressable
            onPress={() => onSelectDifficulty('easy')}
            style={({ pressed }) => [
              styles.option,
              styles.easyOption,
              pressed && styles.optionPressed,
            ]}
          >
            <View style={styles.optionContent}>
              <View style={[styles.optionIcon, { backgroundColor: '#2AA198' }]}>
                <Zap color="white" size={32} />
              </View>
              <Text style={styles.optionTitle}>Easy Mode</Text>
              <Text style={styles.optionDesc}>Perfect for beginners or quick screening</Text>
              <View style={styles.optionList}>
                <Text style={styles.listItem}>• Fewer questions (6 total)</Text>
                <Text style={styles.listItem}>• More distinct color differences</Text>
                <Text style={styles.listItem}>• Simpler color patterns</Text>
                <Text style={styles.listItem}>• Takes about 1–2 minutes</Text>
              </View>
            </View>
          </Pressable>

          {/* Hard Mode */}
          <Pressable
            onPress={() => onSelectDifficulty('hard')}
            style={({ pressed }) => [
              styles.option,
              styles.hardOption,
              pressed && styles.optionPressed,
            ]}
          >
            <View style={styles.optionContent}>
              <View style={[styles.optionIcon, { backgroundColor: '#E9B44C' }]}>
                <Brain color="white" size={32} />
              </View>
              <Text style={styles.optionTitle}>Hard Mode</Text>
              <Text style={styles.optionDesc}>Comprehensive testing for detailed analysis</Text>
              <View style={styles.optionList}>
                <Text style={styles.listItem}>• More questions (12 total)</Text>
                <Text style={styles.listItem}>• Subtle color differences</Text>
                <Text style={styles.listItem}>• Complex color patterns</Text>
                <Text style={styles.listItem}>• Takes about 3–4 minutes</Text>
              </View>
            </View>
          </Pressable>
        </View>

        <View style={styles.tipBox}>
          <Text style={styles.tipText}>
            <Text style={styles.bold}>Tip:</Text> Start with Easy mode if you're not sure.
            You can always retake the test on Hard mode for more detailed results.
          </Text>
        </View>
      </View>
    </View></ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 2,
    elevation: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    backgroundColor: '#475569',
    borderRadius: 40,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  option: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    elevation: 2,
  },
  optionPressed: {
    transform: [{ scale: 0.97 }],
  },
  easyOption: {
    backgroundColor: '#F0FDF9',
    borderColor: '#2AA198',
  },
  hardOption: {
    backgroundColor: '#FFFBEB',
    borderColor: '#E9B44C',
  },
  optionContent: {
    alignItems: 'center',
  },
  optionIcon: {
    borderRadius: 40,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  optionDesc: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 10,
    textAlign: 'center',
  },
  optionList: {
    alignSelf: 'flex-start',
  },
  listItem: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 4,
  },
  tipBox: {
    backgroundColor: '#E0F2FE',
    borderColor: '#BAE6FD',
    borderWidth: 2,
    borderRadius: 12,
    padding: 10,
    marginTop: 16,
  },
  tipText: {
    fontSize: 13,
    color: '#334155',
    textAlign: 'center',
  },
  bold: {
    fontWeight: '700',
  },
});
