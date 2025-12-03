import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Define the shape of a question for TypeScript
interface Question {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: string;
}

export default function Quiz1({ difficulty }: { difficulty: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const totalQuestions = difficulty === "easy" ? 6 : 12;

  // --- Initialize Gemini SDK ---
  // WARNING: In a production app, do not store API keyys directly in the client code.
  // Use a backend proxy or environment variables (e.g., react-native-dotenv).
  const API_KEY = "AIzaSyCbgrAzbDixjiMEel-jfxLdP6f2yEVyHRA"; 
  const genAI = new GoogleGenerativeAI(API_KEY);

  // --- Fetch AI Questions ---
  const loadQuestions = async () => {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", // Using the correct, currently available model
        generationConfig: {
          responseMimeType: "application/json", // Forces strict JSON response
          temperature: 0.7,
        }
      });

      const prompt = `Generate ${totalQuestions} multiple-choice questions about color blindness theory and facts ${difficulty} difficulty. 
      Output strictly a JSON array where each object has: 
      - "question": string
      - "options": object with keys A, B, C, D
      - "answer": string (one of "A", "B", "C", "D")`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      console.log("AI Response:", text);

      // Parse the JSON
      const parsedQuestions: Question[] = JSON.parse(text);
      
      setQuestions(parsedQuestions);
      setLoading(false);

    } catch (error) {
      console.error("Gemini Fetch Error:", error);
      Alert.alert("Error", "Failed to load quiz. Please check your internet connection or API Key.");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  // --- Handle Answer ---
  const handleAnswer = (key: string) => {
    if (key === questions[current].answer) {
      setScore(score + 1);
    }

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  // --- Loading Screen ---
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E40AF" />
        <Text style={styles.loadingText}>Generating {difficulty} questions...</Text>
      </View>
    );
  }

  // --- Finished Screen ---
  if (finished) {
    return (
      <View style={styles.center}>
        <Text style={styles.resultTitle}>Quiz Completed!</Text>
        <Text style={styles.resultText}>
          Your score: {score}/{questions.length}
        </Text>
      </View>
    );
  }

  // Safety check if questions failed to load but loading is false
  if (questions.length === 0) {
    return (
        <View style={styles.center}>
          <Text>No questions available.</Text>
        </View>
    )
  }

  const q = questions[current];

  // --- Quiz UI ---
  return (
    <View style={styles.container}>
      <Text style={styles.questionNumber}>
        Question {current + 1} of {questions.length}
      </Text>

      <Text style={styles.question}>{q.question}</Text>

      {Object.keys(q.options).map((key) => (
        <TouchableOpacity
          key={key}
          style={styles.option}
          onPress={() => handleAnswer(key)}
        >
          <Text style={styles.optionText}>
            {key}. {q.options[key as keyof typeof q.options]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22, backgroundColor: "#FFFFFF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  loadingText: { marginTop: 12, fontSize: 16, color: "#475569" },

  questionNumber: {
    fontSize: 16,
    marginBottom: 10,
    color: "#64748B",
  },
  question: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    color: "#0F172A",
  },

  option: {
    padding: 14,
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    color: "#0F172A",
  },

  resultTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  resultText: { fontSize: 20, marginTop: 10 },
});