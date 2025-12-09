// Context/geminiService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with your API key
// Make sure to set the GEMINI_API_KEY environment variable
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

if (!API_KEY) {
  console.warn(
    'GEMINI_API_KEY is not set. CVD analysis will not work. ' +
    'Please set EXPO_PUBLIC_GEMINI_API_KEY in your environment variables.'
  );
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface QuizResult {
  score: number;
  totalQuestions: number;
  difficulty: 'easy' | 'hard';
  userAnswers: { questionId: string; selectedAnswer: string; correct: string; isCorrect: boolean }[];
}

export interface CVDAnalysis {
  cvdType: 'Normal' | 'Protanopia' | 'Deuteranopia' | 'Tritanopia' | 'Achromatopsia';
  confidence: number; // 0-100
  description: string;
  recommendations: string[];
  detailedAnalysis: string;
}

/**
 * Analyzes quiz results using Gemini AI to detect potential CVD types
 * @param quizResult - The user's quiz result
 * @returns CVD analysis with type and recommendations
 */
export async function analyzeCVDResults(quizResult: QuizResult): Promise<CVDAnalysis> {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Prepare the prompt with quiz data
    const wrongAnswers = quizResult.userAnswers.filter(a => !a.isCorrect);
    const analysisPrompt = `
You are an expert in Color Vision Deficiency (CVD) analysis based on Ishihara color blindness tests.

Analyze the following quiz results from an Ishihara CVD detection test:

QUIZ RESULTS:
- Score: ${quizResult.score} out of ${quizResult.totalQuestions}
- Difficulty Level: ${quizResult.difficulty}
- Accuracy Rate: ${((quizResult.score / quizResult.totalQuestions) * 100).toFixed(1)}%

WRONG ANSWERS (${wrongAnswers.length} incorrect):
${wrongAnswers.map(wa => `- Question: "${wa.questionId}", Expected: "${wa.correct}", User Selected: "${wa.selectedAnswer}"`).join('\n')}

Based on this Ishihara test performance, provide your analysis in the following JSON format:
{
  "cvdType": "one of: Normal, Protanopia, Deuteranopia, Tritanopia, Achromatopsia, Mild, Moderate, Severe",
  "confidence": "number between 0-100 representing confidence level",
  "description": "brief description of the detected CVD type (2-3 sentences)",
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "detailedAnalysis": "detailed technical analysis of the CVD type and how it relates to the test results"
}

Important guidelines:
- Protanopia: Red color blindness (red-green color blindness affecting red perception)
- Deuteranopia: Green color blindness (red-green color blindness affecting green perception)
- Tritanopia: Blue color blindness (less common)
- Achromatopsia: Complete color blindness (very rare, monochromatic vision)
- Normal: No color vision deficiency detected

Scoring Guidelines:
- Score 80-100%: Likely Normal vision
- Score 60-79%: Possible mild CVD
- Score 40-59%: Possible moderate CVD
- Score <40%: Possible severe CVD

Return ONLY valid JSON, no additional text.
`;

    const response = await model.generateContent(analysisPrompt);
    const responseText = response.response.text();

    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }

    const analysis = JSON.parse(jsonMatch[0]) as CVDAnalysis;

    // Ensure all required fields are present
    return {
      cvdType: analysis.cvdType || 'Normal',
      confidence: Math.min(Math.max(analysis.confidence || 0, 0), 100),
      description: analysis.description || 'Unable to determine CVD type.',
      recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : [],
      detailedAnalysis: analysis.detailedAnalysis || responseText,
    };
  } catch (error) {
    console.error('Error analyzing CVD results:', error);

    // Return a default response if Gemini fails
    return {
      cvdType: 'Normal',
      confidence: 0,
      description: 'Unable to process analysis at this time. Please consult an eye care professional for accurate CVD assessment.',
      recommendations: [
        'Consult an ophthalmologist for professional CVD testing',
        'Take the test again in a well-lit environment',
        'Ensure device brightness is optimized',
      ],
      detailedAnalysis: `Error during analysis: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again later.`,
    };
  }
}

/**
 * Simple synchronous analysis fallback if Gemini is unavailable
 */
export function analyzeCVDResultsFallback(quizResult: QuizResult): CVDAnalysis {
  const accuracyRate = (quizResult.score / quizResult.totalQuestions) * 100;

  let cvdType: CVDAnalysis['cvdType'] = 'Normal';
  let confidence = 95;
  let description = '';

  if (accuracyRate >= 80) {
    cvdType = 'Normal';
    confidence = 90;
    description =
      'Your performance suggests normal color vision. No significant color vision deficiency detected based on this Ishihara test.';
  }
  return {
    cvdType,
    confidence,
    description,
    recommendations: [
      'Consult an ophthalmologist for professional CVD evaluation',
      'Avoid safety-critical roles requiring accurate color discrimination',
      'Use accessibility features and color-blind friendly tools in daily life',
    ],
    detailedAnalysis: `Score: ${quizResult.score}/${quizResult.totalQuestions} (${accuracyRate.toFixed(1)}%) - Difficulty: ${quizResult.difficulty}`,
  };
}
