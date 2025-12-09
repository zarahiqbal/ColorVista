// constants/quizData.ts

export type Difficulty = 'easy' | 'hard';

export interface QuizQuestion {
  id: number;
  type: 'red-green' | 'blue-yellow' | 'grayscale';
  correctColor: string; // Foreground (Number) color
  bgColor: string;      // Background dots color
  numberShown: string;  // The actual number to display
  options: string[];    // Multiple choice options
  difficulty: Difficulty;
  description: string;
}

// Your exact color adjustment logic
export function adjustColor(color: string): string {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  const variation = 30;
  const newR = Math.max(0, Math.min(255, r + (Math.random() - 0.5) * variation));
  const newG = Math.max(0, Math.min(255, g + (Math.random() - 0.5) * variation));
  const newB = Math.max(0, Math.min(255, b + (Math.random() - 0.5) * variation));

  return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
}

// --- DATA SETS (Adapted from your reference) ---

// Helper to assign background colors based on contrast theory
const RG_BG = '#90EE90'; // Light Green (Standard background for Red/Green tests)
const BY_BG = '#ADD8E6'; // Light Blue (Standard background for Blue/Yellow tests)
const GS_BG = '#E0E0E0'; // Light Gray

const redGreenTestsEasy = [
  { correctAnswer: '#DC143C', description: 'What number do you see?' },
  { correctAnswer: '#228B22', description: 'What number do you see?' },
  { correctAnswer: '#8B0000', description: 'What number do you see?' }
];

const redGreenTestsHard = [
  { correctAnswer: '#DC143C', description: 'Red pattern' },
  { correctAnswer: '#8B0000', description: 'Dark Red pattern' },
  { correctAnswer: '#228B22', description: 'Green pattern' },
  { correctAnswer: '#32CD32', description: 'Lime pattern' },
  { correctAnswer: '#FF6347', description: 'Tomato pattern' },
  { correctAnswer: '#8FBC8F', description: 'Sea Green pattern' },
  { correctAnswer: '#CD5C5C', description: 'Indian Red pattern' },
  { correctAnswer: '#00FF00', description: 'Pure Green pattern' },
  { correctAnswer: '#FF0000', description: 'Pure Red pattern' }
];

const blueYellowTestsEasy = [
  { correctAnswer: '#1E90FF', description: 'Blue pattern' },
  { correctAnswer: '#FFD700', description: 'Gold pattern' }
];

const blueYellowTestsHard = [
  { correctAnswer: '#1E90FF', description: 'Blue pattern' },
  { correctAnswer: '#FFD700', description: 'Gold pattern' },
  { correctAnswer: '#4169E1', description: 'Royal Blue pattern' },
  { correctAnswer: '#87CEEB', description: 'Sky Blue pattern' },
  { correctAnswer: '#F0E68C', description: 'Khaki pattern' }
];

const grayscaleTestsEasy = [
  { correctAnswer: '#696969', description: 'Dim Gray pattern' }
];

const grayscaleTestsHard = [
  { correctAnswer: '#A9A9A9', description: 'Dark Gray pattern' },
  { correctAnswer: '#FFFFFF', description: 'White pattern' }
];

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// --- GENERATOR FUNCTION ---

export function generateQuiz(difficulty: Difficulty = 'easy'): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  let id = 1;

  const rgSource = difficulty === 'easy' ? redGreenTestsEasy : redGreenTestsHard;
  const bySource = difficulty === 'easy' ? blueYellowTestsEasy : blueYellowTestsHard;
  const gsSource = difficulty === 'easy' ? grayscaleTestsEasy : grayscaleTestsHard;

  const processSet = (source: typeof rgSource, type: QuizQuestion['type'], bgColor: string) => {
    source.forEach((test) => {
      // Generate a random number between 10 and 99
      const correctNumber = Math.floor(Math.random() * 89) + 10;
      
      // Generate wrong options
      const options = [
        correctNumber.toString(),
        (correctNumber + 1).toString(),
        (correctNumber - 1).toString(),
        (Math.floor(Math.random() * 89) + 10).toString()
      ];

      questions.push({
        id: id++,
        type,
        correctColor: test.correctAnswer,
        bgColor: bgColor,
        numberShown: correctNumber.toString(),
        options: shuffleArray(options),
        difficulty,
        description: test.description
      });
    });
  };

  processSet(rgSource, 'red-green', RG_BG);
  processSet(bySource, 'blue-yellow', BY_BG);
  processSet(gsSource, 'grayscale', GS_BG);

  return shuffleArray(questions);
}