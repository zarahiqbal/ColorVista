import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { QUIZ_DATA } from '../constants/questions';

// Helper: Fisher-Yates Shuffle
const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 1. Define Props Interface
interface Quiz1Props {
  difficulty: 'easy' | 'hard';
}

export default function Quiz1({ difficulty }: Quiz1Props) {
  const router = useRouter();
  const { darkMode, getFontSizeMultiplier } = useTheme();

  // 2. Use the "difficulty" prop directly (Logic remains the same)
  const totalQuestions = difficulty === 'hard' ? 10 : 5;

  // 3. Randomize Questions
  const questions = useMemo(() => {
    const pool = QUIZ_DATA.slice(0, totalQuestions);
    return shuffleArray(pool);
  }, [totalQuestions]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Theme Helpers
  const fontScale = getFontSizeMultiplier();
  const themeColors = {
    background: darkMode ? '#121212' : '#F5F9FF',
    text: darkMode ? '#FFFFFF' : '#1A1A1A',
    cardBg: darkMode ? '#1E1E1E' : '#FFFFFF',
    subText: darkMode ? '#AAAAAA' : '#666666',
    border: darkMode ? '#333333' : '#E0E0E0',
    primary: '#2D5BFF',
    danger: '#ff4444'
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore(prev => prev + 1);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const currentQuestion = questions[currentIndex];
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  if (!currentQuestion) return null;

  // --- RESULT VIEW ---
  if (quizFinished) {
    const passed = score >= (totalQuestions / 2);
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.resultContainer}>
          <Ionicons 
            name={passed ? "trophy" : "alert-circle"} 
            size={80} 
            color={passed ? themeColors.primary : themeColors.danger} 
          />
          <Text style={[styles.resultTitle, { color: themeColors.text, fontSize: 24 * fontScale }]}>
            {passed ? "Quiz Completed!" : "Good Effort!"}
          </Text>
          <Text style={[styles.resultScore, { color: themeColors.subText, fontSize: 18 * fontScale }]}>
            You scored {score} out of {totalQuestions}
          </Text>
          <Text style={[styles.resultBadge, { fontSize: 16 * fontScale, color: themeColors.subText }]}>
            {difficulty.toUpperCase()} MODE
          </Text>

          <View style={styles.resultActions}>
            <TouchableOpacity 
              style={[styles.restartButton, { backgroundColor: themeColors.primary }]}
              onPress={() => router.replace('/difficulty')} 
            >
              <Text style={[styles.buttonText, { fontSize: 16 * fontScale }]}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.homeButton, { borderColor: themeColors.border }]}
              onPress={() => router.replace('/welcome')}
            >
              <Text style={[styles.homeButtonText, { color: themeColors.text, fontSize: 16 * fontScale }]}>
                Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // --- QUIZ VIEW ---
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.questionCounter, { color: themeColors.subText, fontSize: 14 * fontScale }]}>
            Question {currentIndex + 1} of {totalQuestions}
          </Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${progressPercentage}%`, backgroundColor: themeColors.primary }]} />
          </View>
        </View>

        {/* Question Text */}
        <Text style={[styles.questionText, { color: themeColors.text, fontSize: 22 * fontScale }]}>
          {currentQuestion.questionText}
        </Text>

        {/* Image Placeholder */}
        <View style={styles.imageContainer}>
          <View style={[styles.placeholderImage, { backgroundColor: currentQuestion.imageColor }]}>
             <View style={styles.blobDecoration} />
             <View style={[styles.blobDecoration, { width: 80, height: 80, top: 40, left: 40 }]} />
          </View>
        </View>

        {/* Options */}
        <View style={styles.optionsGrid}>
          {currentQuestion.options.map((option: any) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard, 
                { 
                  backgroundColor: option.label ? themeColors.cardBg : option.color,
                  borderColor: themeColors.border 
                }
              ]}
              onPress={() => handleAnswer(option.isCorrect)}
            >
              {option.label && (
                <Text style={[styles.optionText, { color: themeColors.text, fontSize: 18 * fontScale }]}>
                  {option.label}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  questionCounter: { fontWeight: '600', marginRight: 10 },
  progressBarContainer: { flex: 1, height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  questionText: { fontWeight: 'bold', marginBottom: 20, textAlign: 'left' },
  imageContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  placeholderImage: { width: 280, height: 280, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  blobDecoration: { position: 'absolute', width: 150, height: 150, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 75, top: -20, right: -20 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 15 },
  optionCard: { width: '47%', aspectRatio: 1.3, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  optionText: { fontWeight: '600' },
  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  resultTitle: { fontWeight: 'bold', marginTop: 20 },
  resultScore: { marginTop: 10, marginBottom: 10 },
  resultBadge: { marginBottom: 40, fontWeight: '800', opacity: 0.5 },
  resultActions: { width: '100%', alignItems: 'center', gap: 15 },
  restartButton: { width: '80%', paddingVertical: 15, borderRadius: 30, alignItems: 'center' },
  homeButton: { width: '80%', paddingVertical: 15, borderRadius: 30, alignItems: 'center', borderWidth: 1, backgroundColor: 'transparent' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  homeButtonText: { fontWeight: '600' }
});

