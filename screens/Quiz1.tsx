import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import IshiharaPlate from '../components/IshiharaPlate';
import { generateQuiz, QuizQuestion } from '../constants/questions';

interface Quiz1Props {
  difficulty: 'easy' | 'hard';
}

export default function Quiz1({ difficulty }: Quiz1Props) {
  const router = useRouter();
  const { darkMode, getFontSizeMultiplier } = useTheme();
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

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: number; correct: boolean; type: string }[]>([]);

  useEffect(() => {
    // Generate quiz based on difficulty
    const q = generateQuiz(difficulty);
    setQuestions(q);
  }, [difficulty]);

  if (questions.length === 0) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={{ marginTop: 20, color: themeColors.text }}>Generating Plates...</Text>
      </View>
    );
  }

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleAnswer = (selectedNumber: string) => {
    const isCorrect = selectedNumber === currentQ.numberShown;
    if (isCorrect) setScore(prev => prev + 1);

    // Track answer with type
    const newAnswers = [
      ...answers,
      {
        questionId: currentQ.id,
        correct: isCorrect,
        type: currentQ.type
      }
    ];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate results by color spectrum
      const results = calculateResults(newAnswers);
      router.push({
        pathname: '/result',
        params: { results: JSON.stringify(results) }
      });
    }
  };

  const calculateResults = (answers: { questionId: number; correct: boolean; type: string }[]) => {
    const redGreenAnswers = answers.filter(a => a.type === 'red-green');
    const blueYellowAnswers = answers.filter(a => a.type === 'blue-yellow');

    return {
      redGreen: {
        correct: redGreenAnswers.filter(a => a.correct).length,
        total: redGreenAnswers.length
      },
      blueYellow: {
        correct: blueYellowAnswers.filter(a => a.correct).length,
        total: blueYellowAnswers.length
      }
    };
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColors.background }]}> 
      <Text style={[styles.counter, { color: themeColors.subText }]}> 
        Plate {currentIndex + 1} of {totalQuestions}
      </Text>
      <View style={styles.plateWrapper}>
        <IshiharaPlate 
          number={currentQ.numberShown}
          fgColor={currentQ.correctColor}
          bgColor={currentQ.bgColor}
          size={300}
          difficulty={difficulty}
        />
      </View>
      <Text style={[styles.question, { color: themeColors.text }]}>{currentQ.description}</Text>
      <Text style={[styles.helperText, { color: themeColors.subText }]}>(Select 'Nothing' if you can't see a number)</Text>
      <View style={styles.optionsGrid}>
        {currentQ.options.map((opt: string, index: number) => (
          <TouchableOpacity 
            key={index} 
            style={styles.optionBtn} 
            onPress={() => handleAnswer(opt)}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity 
          style={[styles.optionBtn, styles.nothingBtn]} 
          onPress={() => handleAnswer('nothing')}
        >
          <Text style={styles.optionText}>Nothing</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  counter: { fontSize: 14, textTransform: 'uppercase', color: '#999', marginBottom: 20, letterSpacing: 1 },
  plateWrapper: { marginBottom: 30 },
  question: { fontSize: 20, fontWeight: 'bold', marginBottom: 5, textAlign: 'center', color: '#333' },
  helperText: { fontSize: 14, color: '#777', marginBottom: 25, fontStyle: 'italic' },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  optionBtn: { 
    width: '40%', 
    backgroundColor: '#F3F4F6', 
    paddingVertical: 18, 
    borderRadius: 12, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  nothingBtn: { width: '85%', backgroundColor: '#FFF0F0', borderColor: '#FFCDD2' },
  optionText: { fontSize: 18, fontWeight: '600', color: '#374151' }
});

