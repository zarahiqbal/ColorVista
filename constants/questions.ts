// constants/quizData.ts
// export type Difficulty = "easy" | "hard";
// export interface QuizQuestion {
//   id: number;
//   type: "red-green" | "blue-yellow" | "grayscale";
//   correctColor: string; // Foreground (Number) color
//   bgColor: string; // Background dots color
//   numberShown: string; // The actual number to display
//   options: string[]; // Multiple choice options
//   difficulty: Difficulty;
//   description: string;
// }
// // Your exact color adjustment logic
// export function adjustColor(color: string): string {
//   const r = parseInt(color.slice(1, 3), 16);
//   const g = parseInt(color.slice(3, 5), 16);
//   const b = parseInt(color.slice(5, 7), 16);

//   const variation = 30;
//   const newR = Math.max(
//     0,
//     Math.min(255, r + (Math.random() - 0.5) * variation),
//   );
//   const newG = Math.max(
//     0,
//     Math.min(255, g + (Math.random() - 0.5) * variation),
//   );
//   const newB = Math.max(
//     0,
//     Math.min(255, b + (Math.random() - 0.5) * variation),
//   );

//   return `#${Math.round(newR).toString(16).padStart(2, "0")}${Math.round(newG).toString(16).padStart(2, "0")}${Math.round(newB).toString(16).padStart(2, "0")}`;
// }

// // --- DATA SETS (Adapted) ---

// // Helper to assign background colors based on contrast theory
// const RG_BG = "#90EE90"; // Light Green (Standard background for Red/Green tests)
// const BY_BG = "#ADD8E6"; // Light Blue (Standard background for Blue/Yellow tests)
// const GS_BG = "#E0E0E0"; // Light Gray

// const redGreenTestsEasy = [
//   { correctAnswer: "#DC143C", description: "What number do you see?" },
//   { correctAnswer: "#228B22", description: "What number do you see?" },
//   { correctAnswer: "#8B0000", description: "What number do you see?" },
// ];

// const redGreenTestsHard = [
//   { correctAnswer: "#DC143C", description: "Red pattern" },
//   { correctAnswer: "#8B0000", description: "Dark Red pattern" },
//   { correctAnswer: "#228B22", description: "Green pattern" },
//   { correctAnswer: "#32CD32", description: "Lime pattern" },
//   { correctAnswer: "#FF6347", description: "Tomato pattern" },
//   { correctAnswer: "#8FBC8F", description: "Sea Green pattern" },
//   { correctAnswer: "#CD5C5C", description: "Indian Red pattern" },
//   { correctAnswer: "#00FF00", description: "Pure Green pattern" },
//   { correctAnswer: "#FF0000", description: "Pure Red pattern" },
// ];

// const blueYellowTestsEasy = [
//   { correctAnswer: "#1E90FF", description: "Blue pattern" },
//   { correctAnswer: "#FFD700", description: "Gold pattern" },
// ];

// const blueYellowTestsHard = [
//   { correctAnswer: "#1E90FF", description: "Blue pattern" },
//   { correctAnswer: "#FFD700", description: "Gold pattern" },
//   { correctAnswer: "#4169E1", description: "Royal Blue pattern" },
//   { correctAnswer: "#87CEEB", description: "Sky Blue pattern" },
//   { correctAnswer: "#F0E68C", description: "Khaki pattern" },
// ];

// const grayscaleTestsEasy = [
//   { correctAnswer: "#696969", description: "Dim Gray pattern" },
// ];

// const grayscaleTestsHard = [
//   { correctAnswer: "#A9A9A9", description: "Dark Gray pattern" },
//   { correctAnswer: "#FFFFFF", description: "White pattern" },
// ];

// function shuffleArray<T>(array: T[]): T[] {
//   const newArray = [...array];
//   for (let i = newArray.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
//   }
//   return newArray;
// }

// // --- GENERATOR FUNCTION ---

// export function generateQuiz(difficulty: Difficulty = "easy"): QuizQuestion[] {
//   const questions: QuizQuestion[] = [];
//   let id = 1;

//   const rgSource =
//     difficulty === "easy" ? redGreenTestsEasy : redGreenTestsHard;
//   const bySource =
//     difficulty === "easy" ? blueYellowTestsEasy : blueYellowTestsHard;
//   const gsSource =
//     difficulty === "easy" ? grayscaleTestsEasy : grayscaleTestsHard;

//   // Total questions: 10 for easy, 15 for hard
//   const totalQuestions = difficulty === "easy" ? 10 : 15;

//   // Distribute questions across color spectrums
//   // Easy: 5 red-green, 3 blue-yellow, 2 grayscale
//   // Hard: 7 red-green, 5 blue-yellow, 3 grayscale
//   const distribution =
//     difficulty === "easy" ? { rg: 5, by: 3, gs: 2 } : { rg: 7, by: 5, gs: 3 };

//   const processSet = (
//     source: typeof rgSource,
//     type: QuizQuestion["type"],
//     bgColor: string,
//     count: number,
//   ) => {
//     // Repeat source if needed to have enough variations
//     const repeatedSource = [];
//     for (let i = 0; i < count; i++) {
//       repeatedSource.push(source[i % source.length]);
//     }

//     repeatedSource.forEach((test) => {
//       // Generate a random number between 10 and 99
//       const correctNumber = Math.floor(Math.random() * 89) + 10;

//       // Generate wrong options
//       const options = [
//         correctNumber.toString(),
//         (correctNumber + 1).toString(),
//         (correctNumber - 1).toString(),
//         (Math.floor(Math.random() * 89) + 10).toString(),
//       ];

//       questions.push({
//         id: id++,
//         type,
//         correctColor: test.correctAnswer,
//         bgColor: bgColor,
//         numberShown: correctNumber.toString(),
//         options: shuffleArray(options),
//         difficulty,
//         description: test.description,
//       });
//     });
//   };

//   processSet(rgSource, "red-green", RG_BG, distribution.rg);
//   processSet(bySource, "blue-yellow", BY_BG, distribution.by);
//   processSet(gsSource, "grayscale", GS_BG, distribution.gs);

//   return shuffleArray(questions);
// }
export interface PlateQuestion {
  id: number;

  // Common
  image: any;

  // Ishihara
  correctAnswer?: string;
  confusionAnswers?: string[];
  category?: "demonstration" | "red-green" | "tritan";

  // HRR
  hiddenSymbol?: string;
  options?: string[];
  tritanopiaLikelyAnswer?: string;
  description?: string;
  colors?: {
    background: string;
    symbol: string;
  };

  // Shared type
  type: "ishihara" | "hrr" | "demo" | "screening" | "tritan" | "severity";
}

export const PLATE_DATA: PlateQuestion[] = [
  // =========================
  // ISHIHARA PLATES
  // =========================

  {
    id: 1,
    image: require("../assets/images/ishihara/ish-01.png"),
    correctAnswer: "12",
    confusionAnswers: ["12"],
    type: "ishihara",
    category: "demonstration",
  },
  {
    id: 2,
    image: require("../assets/images/ishihara/ish-02.png"),
    correctAnswer: "8",
    confusionAnswers: ["3"],
    type: "ishihara",
    category: "red-green",
  },
  {
    id: 3,
    image: require("../assets/images/ishihara/ish-03.png"),
    correctAnswer: "29",
    confusionAnswers: ["70"],
    type: "ishihara",
    category: "red-green",
  },
  {
    id: 4,
    image: require("../assets/images/ishihara/ish-04.png"),
    correctAnswer: "5",
    confusionAnswers: ["2"],
    type: "ishihara",
    category: "red-green",
  },
  {
    id: 5,
    image: require("../assets/images/ishihara/ish-05.png"),
    correctAnswer: "3",
    confusionAnswers: ["5"],
    type: "ishihara",
    category: "red-green",
  },
  {
    id: 6,
    image: require("../assets/images/ishihara/ish-06.png"),
    correctAnswer: "15",
    confusionAnswers: ["17"],
    type: "ishihara",
    category: "red-green",
  },
  {
    id: 7,
    image: require("../assets/images/ishihara/ish-07.png"),
    correctAnswer: "74",
    confusionAnswers: ["21"],
    type: "ishihara",
    category: "red-green",
  },
  {
    id: 8,
    image: require("../assets/images/ishihara/ish-08.png"),
    correctAnswer: "6",
    confusionAnswers: ["Nothing"],
    type: "ishihara",
    category: "red-green",
  },
  {
    id: 9,
    image: require("../assets/images/ishihara/ish-09.png"),
    correctAnswer: "45",
    confusionAnswers: ["Nothing"],
    type: "ishihara",
    category: "red-green",
  },
  {
    id: 10,
    image: require("../assets/images/ishihara/ish-10.png"),
    correctAnswer: "5",
    confusionAnswers: ["Nothing"],
    type: "ishihara",
    category: "red-green",
  },
  {
    id: 11,
    image: require("../assets/images/ishihara/ish-11.png"),
    correctAnswer: "7",
    confusionAnswers: ["Nothing"],
    type: "ishihara",
    category: "red-green",
  },
  {
    id: 12,
    image: require("../assets/images/ishihara/ish-12.png"),
    correctAnswer: "16",
    confusionAnswers: ["Nothing"],
    type: "ishihara",
    category: "red-green",
  },

  // =========================
  // HRR / TRITAN PLATES
  // =========================

  {
    id: 13,
    type: "demo",
    image: require("../assets/images/hrr/hrr-01.png"),
    hiddenSymbol: "Circle",
    options: ["Circle", "Triangle", "Square", "None"],
    correctAnswer: "Circle",
    tritanopiaLikelyAnswer: "Circle",
    description: "Visible to everyone. Demonstration plate.",
    colors: {
      background: "#7EC8E3",
      symbol: "#4CAF50",
    },
  },

  {
    id: 14,
    type: "demo",
    image: require("../assets/images/hrr/hrr-02.png"),
    hiddenSymbol: "Triangle",
    options: ["Triangle", "Cross", "Circle", "None"],
    correctAnswer: "Triangle",
    tritanopiaLikelyAnswer: "Triangle",
    description: "Visible to everyone. Demonstration plate.",
    colors: {
      background: "#B0BEC5",
      symbol: "#FFD54F",
    },
  },

  {
    id: 15,
    type: "screening",
    image: require("../assets/images/hrr/hrr-03.png"),
    hiddenSymbol: "Square",
    options: ["Square", "Circle", "Triangle", "None"],
    correctAnswer: "Square",
    tritanopiaLikelyAnswer: "None",
    description: "Blue-yellow confusion plate.",
    colors: {
      background: "#4FC3F7",
      symbol: "#FFF176",
    },
  },

  {
    id: 16,
    type: "screening",
    image: require("../assets/images/hrr/hrr-04.png"),
    hiddenSymbol: "Cross",
    options: ["Cross", "Triangle", "Square", "None"],
    correctAnswer: "Cross",
    tritanopiaLikelyAnswer: "Triangle",
    description: "Low contrast tritan confusion.",
    colors: {
      background: "#81D4FA",
      symbol: "#CE93D8",
    },
  },

  {
    id: 17,
    type: "screening",
    image: require("../assets/images/hrr/hrr-05.png"),
    hiddenSymbol: "Triangle",
    options: ["Triangle", "Circle", "Cross", "None"],
    correctAnswer: "Triangle",
    tritanopiaLikelyAnswer: "None",
    description: "Yellow-violet discrimination test.",
    colors: {
      background: "#AED581",
      symbol: "#5C6BC0",
    },
  },

  {
    id: 18,
    type: "tritan",
    image: require("../assets/images/hrr/hrr-06.png"),
    hiddenSymbol: "Circle",
    options: ["Circle", "Square", "Cross", "None"],
    correctAnswer: "Circle",
    tritanopiaLikelyAnswer: "Square",
    description: "Blue-green confusion axis.",
    colors: {
      background: "#4DD0E1",
      symbol: "#7986CB",
    },
  },

  {
    id: 19,
    type: "tritan",
    image: require("../assets/images/hrr/hrr-07.png"),
    hiddenSymbol: "Square",
    options: ["Square", "Circle", "Triangle", "None"],
    correctAnswer: "Square",
    tritanopiaLikelyAnswer: "None",
    description: "Weak tritan discrimination.",
    colors: {
      background: "#90CAF9",
      symbol: "#FFF59D",
    },
  },

  {
    id: 20,
    type: "tritan",
    image: require("../assets/images/hrr/hr--08.png"),
    hiddenSymbol: "Cross",
    options: ["Cross", "Triangle", "Circle", "None"],
    correctAnswer: "Cross",
    tritanopiaLikelyAnswer: "Triangle",
    description: "Strong blue-yellow confusion.",
    colors: {
      background: "#4DB6AC",
      symbol: "#BA68C8",
    },
  },

  {
    id: 21,
    type: "severity",
    image: require("../assets/images/hrr/hrr-09.png"),
    hiddenSymbol: "Triangle",
    options: ["Triangle", "Cross", "Square", "None"],
    correctAnswer: "Triangle",
    tritanopiaLikelyAnswer: "None",
    description: "Moderate-to-strong tritan deficiency indicator.",
    colors: {
      background: "#26C6DA",
      symbol: "#DCE775",
    },
  },

  {
    id: 22,
    type: "severity",
    image: require("../assets/images/hrr/hrr-10.png"),
    hiddenSymbol: "Circle",
    options: ["Circle", "Triangle", "Cross", "None"],
    correctAnswer: "Circle",
    tritanopiaLikelyAnswer: "None",
    description: "High difficulty tritan plate.",
    colors: {
      background: "#80DEEA",
      symbol: "#9575CD",
    },
  },
];

// =========================
// OPTION SHUFFLER
// =========================

export const getShuffledOptions = (question: PlateQuestion) => {
  // HRR plates already contain options
  if (question.options) {
    return [...question.options].sort(() => Math.random() - 0.5);
  }

  // Ishihara fallback options
  const defaults = [
    "1",
    "2",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "12",
    "29",
    "45",
    "74",
    "Nothing",
  ];

  let options = new Set([
    question.correctAnswer,
    ...(question.confusionAnswers || []),
  ]);

  while (options.size < 4) {
    const random = defaults[Math.floor(Math.random() * defaults.length)];
    options.add(random);
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
};
// export interface PlateQuestion {
//   id: number;
//   image: any; // require() path
//   correctAnswer: string;
//   confusionAnswers: string[]; // Numbers usually seen by CVD patients
//   type: "ishihara" | "hrr";
//   category: "demonstration" | "red-green" | "tritan";
// }

// export const PLATE_DATA: PlateQuestion[] = [
//   {
//     id: 1,
//     image: require("../assets/ishihara/ish-01.png"),
//     correctAnswer: "12",
//     confusionAnswers: ["12"], // Everyone sees 12
//     type: "ishihara",
//     category: "demonstration",
//   },
//   {
//     id: 2,
//     image: require("../assets/ishihara/ish-02.png"),
//     correctAnswer: "8",
//     confusionAnswers: ["3"],
//     type: "ishihara",
//     category: "red-green",
//   },
//   {
//     id: 3,
//     image: require("../assets/ishihara/ish-03.png"),
//     correctAnswer: "6",
//     confusionAnswers: ["5"],
//     type: "ishihara",
//     category: "red-green",
//   },
//   {
//     id: 4,
//     image: require("../assets/ishihara/ish-04.png"),
//     correctAnswer: "29",
//     confusionAnswers: ["70"],
//     type: "ishihara",
//     category: "red-green",
//   },
//   {
//     id: 5,
//     image: require("../assets/ishihara/ish-05.png"),
//     correctAnswer: "45",
//     confusionAnswers: ["73"],
//     type: "ishihara",
//     category: "red-green",
//   },
//   {
//     id: 6,
//     image: require("../assets/ishihara/ish-06.png"),
//     correctAnswer: "5",
//     confusionAnswers: ["2"],
//     type: "ishihara",
//     category: "red-green",
//   },
//   {
//     id: 7,
//     image: require("../assets/ishihara/ish-07.png"),
//     correctAnswer: "74",
//     confusionAnswers: ["21"],
//     type: "ishihara",
//     category: "red-green",
//   },
//   {
//     id: 8,
//     image: require("../assets/ishihara/ish-08.png"),
//     correctAnswer: "Nothing",
//     confusionAnswers: ["Nothing"], // Many see nothing
//     type: "ishihara",
//     category: "red-green",
//   },
//   {
//     id: 9,
//     image: require("../assets/ishihara/ish-09.png"),
//     correctAnswer: "Nothing",
//     confusionAnswers: ["Nothing"], // Many see nothing
//     type: "ishihara",
//     category: "red-green",
//   },
//   {
//     id: 10,
//     image: require("../assets/ishihara/ish-10.png"),
//     correctAnswer: "Nothing",
//     confusionAnswers: ["Nothing"], // Many see nothing
//     type: "ishihara",
//     category: "red-green",
//   },
//   {
//     id: 11,
//     image: require("../assets/ishihara/ish-11.png"),
//     correctAnswer: "Nothing",
//     confusionAnswers: ["Nothing"], // Many see nothing
//     type: "ishihara",
//     category: "red-green",
//   },
//   {
//     id: 12,
//     image: require("../assets/ishihara/ish-12.png"),
//     correctAnswer: "Nothing",
//     confusionAnswers: ["Nothing"], // Many see nothing
//     type: "ishihara",
//     category: "red-green",
//   },

//   // Add HRR Plates for Tritanopia
//  {
//     id: 1,
//     type: "demo",
//     image: "plate1.png",
//     hiddenSymbol: "Circle",
//     options: ["Circle", "Triangle", "Square", "None"],
//     correctAnswer: "Circle",
//     tritanopiaLikelyAnswer: "Circle",
//     description: "Visible to everyone. Demonstration plate.",
//     colors: {
//       background: "#7EC8E3",
//       symbol: "#4CAF50",
//     },
//   },

//   {
//     id: 2,
//     type: "demo",
//     image: "plate2.png",
//     hiddenSymbol: "Triangle",
//     options: ["Triangle", "Cross", "Circle", "None"],
//     correctAnswer: "Triangle",
//     tritanopiaLikelyAnswer: "Triangle",
//     description: "Visible to everyone. Demonstration plate.",
//     colors: {
//       background: "#B0BEC5",
//       symbol: "#FFD54F",
//     },
//   },

//   {
//     id: 3,
//     type: "screening",
//     image: "plate3.png",
//     hiddenSymbol: "Square",
//     options: ["Square", "Circle", "Triangle", "None"],
//     correctAnswer: "Square",
//     tritanopiaLikelyAnswer: "None",
//     description: "Blue-yellow confusion plate.",
//     colors: {
//       background: "#4FC3F7",
//       symbol: "#FFF176",
//     },
//   },

//   {
//     id: 4,
//     type: "screening",
//     image: "plate4.png",
//     hiddenSymbol: "Cross",
//     options: ["Cross", "Triangle", "Square", "None"],
//     correctAnswer: "Cross",
//     tritanopiaLikelyAnswer: "Triangle",
//     description: "Low contrast tritan confusion.",
//     colors: {
//       background: "#81D4FA",
//       symbol: "#CE93D8",
//     },
//   },

//   {
//     id: 5,
//     type: "screening",
//     image: "plate5.png",
//     hiddenSymbol: "Triangle",
//     options: ["Triangle", "Circle", "Cross", "None"],
//     correctAnswer: "Triangle",
//     tritanopiaLikelyAnswer: "None",
//     description: "Yellow-violet discrimination test.",
//     colors: {
//       background: "#AED581",
//       symbol: "#5C6BC0",
//     },
//   },

//   {
//     id: 6,
//     type: "tritan",
//     image: "plate6.png",
//     hiddenSymbol: "Circle",
//     options: ["Circle", "Square", "Cross", "None"],
//     correctAnswer: "Circle",
//     tritanopiaLikelyAnswer: "Square",
//     description: "Blue-green confusion axis.",
//     colors: {
//       background: "#4DD0E1",
//       symbol: "#7986CB",
//     },
//   },

//   {
//     id: 7,
//     type: "tritan",
//     image: "plate7.png",
//     hiddenSymbol: "Square",
//     options: ["Square", "Circle", "Triangle", "None"],
//     correctAnswer: "Square",
//     tritanopiaLikelyAnswer: "None",
//     description: "Weak tritan discrimination.",
//     colors: {
//       background: "#90CAF9",
//       symbol: "#FFF59D",
//     },
//   },

//   {
//     id: 8,
//     type: "tritan",
//     image: "plate8.png",
//     hiddenSymbol: "Cross",
//     options: ["Cross", "Triangle", "Circle", "None"],
//     correctAnswer: "Cross",
//     tritanopiaLikelyAnswer: "Triangle",
//     description: "Strong blue-yellow confusion.",
//     colors: {
//       background: "#4DB6AC",
//       symbol: "#BA68C8",
//     },
//   },

//   {
//     id: 9,
//     type: "severity",
//     image: "plate9.png",
//     hiddenSymbol: "Triangle",
//     options: ["Triangle", "Cross", "Square", "None"],
//     correctAnswer: "Triangle",
//     tritanopiaLikelyAnswer: "None",
//     description: "Moderate-to-strong tritan deficiency indicator.",
//     colors: {
//       background: "#26C6DA",
//       symbol: "#DCE775",
//     },
//   },

//   {
//     id: 10,
//     type: "severity",
//     image: "plate10.png",
//     hiddenSymbol: "Circle",
//     options: ["Circle", "Triangle", "Cross", "None"],
//     correctAnswer: "Circle",
//     tritanopiaLikelyAnswer: "None",
//     description: "High difficulty tritan plate.",
//     colors: {
//       background: "#80DEEA",
//       symbol: "#9575CD",
//     },
//   },
// ];

// // Helper to shuffle options and ensure the UI isn't memorized
// export const getShuffledOptions = (question: PlateQuestion) => {
//   const defaults = [
//     "1",
//     "2",
//     "5",
//     "6",
//     "7",
//     "8",
//     "9",
//     "0",
//     "12",
//     "29",
//     "45",
//     "74",
//   ];
//   // Mix correct answer + confusion answer + 2 random defaults
//   let options = new Set([question.correctAnswer, ...question.confusionAnswers]);

//   while (options.size < 4) {
//     const random = defaults[Math.floor(Math.random() * defaults.length)];
//     options.add(random);
//   }

//   return Array.from(options).sort(() => Math.random() - 0.5);
// };
