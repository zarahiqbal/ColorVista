// constants/questions.ts

export type Question = {
  id: string;
  type: 'pattern' | 'color'; // Distinguishes between the two screenshot types
  questionText: string;
  imageColor: string; // The color of the big center circle/square
  options: { id: string; color: string; label?: string; isCorrect: boolean }[];
};

export const QUIZ_DATA: Question[] = [
  // --- Easy Questions (1-5) ---
  {
    id: '1',
    type: 'pattern',
    questionText: 'What number or pattern do you see?',
    imageColor: '#e0e0e0', 
    options: [
      { id: 'a', color: '#FFFFFF', label: '12', isCorrect: false },
      { id: 'b', color: '#FFFFFF', label: '8', isCorrect: true },
      { id: 'c', color: '#FFFFFF', label: '3', isCorrect: false },
      { id: 'd', color: '#FFFFFF', label: 'Nothing', isCorrect: false },
    ],
  },
  {
    id: '2',
    type: 'color',
    questionText: 'Select the dominant color you see above',
    imageColor: '#A9A9A9',
    options: [
      { id: 'a', color: '#FFFFFF', isCorrect: false }, // White box
      { id: 'b', color: '#F5F5F5', isCorrect: false }, // Light gray box
      { id: 'c', color: '#696969', isCorrect: true },  // Dark gray box
      { id: 'd', color: '#D3D3D3', isCorrect: false }, // Medium gray box
    ],
  },
  {
    id: '3',
    type: 'pattern',
    questionText: 'Identify the number inside',
    imageColor: '#ffcccb',
    options: [
      { id: 'a', color: '#FFF', label: '5', isCorrect: true },
      { id: 'b', color: '#FFF', label: '2', isCorrect: false },
      { id: 'c', color: '#FFF', label: '6', isCorrect: false },
      { id: 'd', color: '#FFF', label: '9', isCorrect: false },
    ],
  },
  {
    id: '4',
    type: 'color',
    questionText: 'Which color matches the center?',
    imageColor: '#4A90E2',
    options: [
      { id: 'a', color: '#4A90E2', isCorrect: true },
      { id: 'b', color: '#50E3C2', isCorrect: false },
      { id: 'c', color: '#B8E986', isCorrect: false },
      { id: 'd', color: '#F8E71C', isCorrect: false },
    ],
  },
  {
    id: '5',
    type: 'pattern',
    questionText: 'What digit is visible?',
    imageColor: '#D3F8E2',
    options: [
      { id: 'a', color: '#FFF', label: '7', isCorrect: false },
      { id: 'b', color: '#FFF', label: '1', isCorrect: false },
      { id: 'c', color: '#FFF', label: '4', isCorrect: true },
      { id: 'd', color: '#FFF', label: '0', isCorrect: false },
    ],
  },

  // --- Hard Questions (6-10) ---
  // (These are only shown if difficulty = hard)
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `${i + 6}`,
    type: 'color' as const,
    questionText: `Hard Mode Q${i + 1}: Subtle Shade`,
    imageColor: `hsl(${i * 60}, 60%, 50%)`,
    options: [
      { id: '1', color: '#FF0000', isCorrect: false },
      { id: '2', color: '#00FF00', isCorrect: true },
      { id: '3', color: '#0000FF', isCorrect: false },
      { id: '4', color: '#FFFF00', isCorrect: false },
    ],
  })),
];