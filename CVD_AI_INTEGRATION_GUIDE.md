# CVD Detection Quiz - Ishihara AI Integration Guide

## Overview

Your ColorVista application has been transformed into an **Ishihara-based CVD (Color Vision Deficiency) Detection Quiz** with **Gemini AI-powered analysis**. The app now uses advanced AI to analyze quiz results and detect potential color vision deficiencies.

## Key Changes Made

### 1. **Updated Quiz Questions** (`constants/questions.ts`)
- Converted all quiz questions to Ishihara test format
- 5 Easy mode questions targeting basic red-green color blindness detection
- 5 Hard mode questions testing subtle color discrimination
- Each question includes:
  - Proper Ishihara plate colors
  - Expected correct answers
  - Multiple choice options
  - Difficulty level classification

### 2. **Gemini AI Service** (`Context/geminiService.ts`)
New service that:
- Integrates with Google Generative AI (Gemini API)
- Analyzes quiz results to detect CVD types:
  - **Normal**: No color vision deficiency
  - **Protanopia**: Red color blindness
  - **Deuteranopia**: Green color blindness
  - **Tritanopia**: Blue color blindness
  - **Achromatopsia**: Complete color blindness
  - **Mild/Moderate/Severe**: Graded CVD severity

- Provides:
  - CVD type classification
  - Confidence score (0-100%)
  - Medical description
  - Actionable recommendations
  - Technical analysis

- Includes fallback analysis if Gemini is unavailable

### 3. **Enhanced Quiz Component** (`screens/Quiz1.tsx`)
Updated to include:
- Integration with Gemini AI analysis
- Real-time user answer tracking
- Loading state during AI analysis
- Comprehensive result display showing:
  - CVD type with icon indicators
  - Confidence score visualization
  - Quiz performance percentage
  - Medical description of findings
  - Personalized recommendations
  - Technical analysis details

## Setup Instructions

### Step 1: Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key" 
3. Copy your API key

### Step 2: Configure Environment Variables

**Option A: Using `.env` file (Recommended for local development)**

1. Create a `.env.local` file in your project root:
```bash
EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

2. For Expo, you can use the `.env` file pattern or add to your `app.json`:

**Option B: Using `app.json` (Recommended for builds)**

Edit your `app.json` and add:
```json
{
  "expo": {
    "extra": {
      "geminiApiKey": "your_api_key_here"
    }
  }
}
```

Then import in your service:
```typescript
import Constants from 'expo-constants';
const apiKey = Constants.expoConfig?.extra?.geminiApiKey;
```

**Option C: Environment Variables**

Set as system environment variable:
```bash
# Windows PowerShell
$env:EXPO_PUBLIC_GEMINI_API_KEY="your_api_key_here"

# macOS/Linux
export EXPO_PUBLIC_GEMINI_API_KEY="your_api_key_here"
```

### Step 3: Verify Installation

The app is ready to use! When users complete the quiz:

1. Their answers are tracked
2. Gemini AI analyzes their performance
3. A detailed CVD assessment is displayed
4. Users get personalized recommendations

## CVD Detection Logic

The system analyzes quiz performance based on:

### Accuracy Scoring:
- **80-100%**: Likely Normal vision
- **60-79%**: Possible Mild CVD
- **40-59%**: Possible Moderate CVD
- **<40%**: Possible Severe CVD

### Pattern Recognition:
- Tracks which questions were answered incorrectly
- Analyzes patterns in wrong answers
- Uses Gemini to correlate patterns with CVD types

### Confidence Calculation:
- Higher consistency in responses = Higher confidence
- Score distribution = Additional confidence factor

## API Usage and Costs

### Gemini API Pricing:
- **Free tier**: Limited requests available
- **Paid tier**: Pay-per-request model
- Check [Google AI Pricing](https://ai.google.dev/pricing) for current rates

### Monitoring Usage:
Monitor API calls in Google Cloud Console to track usage and costs.

## Fallback Behavior

If Gemini API is unavailable or not configured:
- App automatically uses fallback analysis
- Results based on score percentage
- Users still get actionable recommendations
- No service disruption

## Testing the Integration

1. Start the app: `npm start` or `expo start`
2. Run through Easy or Hard mode
3. Complete the quiz
4. Observe the CVD analysis results

### Example Result Output:
```json
{
  "cvdType": "Deuteranopia",
  "confidence": 85,
  "description": "Your results suggest possible Deuteranopia (green color blindness). You may have significant difficulty distinguishing green and red hues.",
  "recommendations": [
    "Consult an ophthalmologist for professional evaluation",
    "Use accessibility features for color-blind friendly tools",
    "Avoid safety-critical roles requiring accurate color discrimination"
  ],
  "detailedAnalysis": "Score: 3/5 (60%) - Difficulty: easy. Pattern analysis indicates consistent inability to distinguish green tones..."
}
```

## Troubleshooting

### Issue: "GEMINI_API_KEY is not set" warning
**Solution**: 
1. Ensure your API key is set in environment variables
2. Check variable name is exactly `EXPO_PUBLIC_GEMINI_API_KEY`
3. Restart Expo development server after setting variables

### Issue: API Returns Invalid Response
**Solution**:
1. Verify API key is valid and active
2. Check API quota in Google Cloud Console
3. App will automatically fall back to local analysis

### Issue: Analysis Takes Too Long
**Solution**:
1. Normal Gemini API response time is 2-5 seconds
2. Check network connectivity
3. Verify API key has proper permissions

## Security Considerations

- Never commit `.env` files with API keys to version control
- Use `.env.local` for local development (add to `.gitignore`)
- Store production API keys in secure environment variable managers
- Consider implementing API key validation/refresh mechanisms for production

## File Structure

```
Context/
├── geminiService.ts          # Gemini AI integration
├── firebase.ts               # Firebase config (unchanged)
├── ThemeContext.tsx          # Theme management
└── AuthContext.tsx           # Auth management

constants/
└── questions.ts              # Ishihara quiz questions

screens/
├── Quiz1.tsx                 # Updated quiz component
└── ... (other screens)

.env.example                  # API configuration template
```

## Next Steps

1. **Obtain Gemini API Key** from Google AI Studio
2. **Set Environment Variable** following Step 2 above
3. **Test the Quiz** with sample runs
4. **Monitor API Usage** in Google Cloud Console
5. **Deploy** with proper environment variables set

## Medical Disclaimer

⚠️ **Important**: This app provides **screening purposes only** and is not a substitute for professional medical evaluation. Users should:
- Consult an ophthalmologist for professional CVD testing
- Not make medical decisions based solely on these results
- Understand this is a preliminary assessment tool

## Support & References

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Ishihara Test Information](https://en.wikipedia.org/wiki/Ishihara_test)
- [Color Vision Deficiency - Medical Info](https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness)
