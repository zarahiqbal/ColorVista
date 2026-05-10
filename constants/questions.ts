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
