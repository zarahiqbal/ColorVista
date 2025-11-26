import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Quiz1({ difficulty }: { difficulty: string }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const totalQuestions = difficulty === "easy" ? 6 : 12;

  // --- Fetch AI Questions from Gemini ---
  const loadQuestions = async () => {
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyC_A2MqbvglFNOLEP6ORkxld9Ys4tL1R8s",
        {
          method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [
      {
        parts: [
          {
            // Updated prompt to be more specific about the JSON structure
            text: `Generate ${totalQuestions} multiple-choice questions about color blindness theory and facts.
            
            Return the result specifically as a JSON Array of objects.
            Schema:
            [
              {
                "question": "string",
                "options": { "A": "string", "B": "string", "C": "string", "D": "string" },
                "answer": "string (A, B, C, or D)"
              }
            ]`
          }
        ]
      }
    ],
          })
        }
      );

      const data = await response.json();

      // Extract AI text
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

      // Convert text → JSON array
      console.log("AI Response Text:", aiText);
      const parsed = JSON.parse(aiText);

      setQuestions(parsed);
      setLoading(false);
    } catch (error) {
      console.log("Gemini Fetch Error:", error);
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
        <Text style={styles.loadingText}>Generating questions...</Text>
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
            {key}. {q.options[key]}
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
