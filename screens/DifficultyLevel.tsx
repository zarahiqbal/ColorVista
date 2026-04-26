import { useTheme } from '@/Context/ThemeContext'; // Ensure this path matches your project structure
import { Flame, Zap } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Define the Props Interface
interface DifficultySelectionProps {
  onSelectDifficulty: (difficulty: 'easy' | 'hard') => void;
}

export function DifficultySelection({ onSelectDifficulty }: DifficultySelectionProps) {
  // 1. CONSUME THEME CONTEXT
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const scale = getFontSizeMultiplier();

  // 2. DEFINE DYNAMIC STYLES & COLORS
  const { styles, colors } = useMemo(() => {
    // --- EARTH TONE PALETTE ---
    const palette = {
      beigeBg: '#F6F3EE',       // Main Screen Background
      charcoal: '#2F2F2F',      // Text & Buttons
      sage: '#8DA399',          // Easy Mode Card
      sageDark: '#6B7B7B',      // Easy Mode Icon Circle
      taupe: '#AA957B',         // Hard Mode Card
      taupeDark: '#8B7B6B',     // Hard Mode Icon Circle
      white: '#FFFFFF',
      surfaceDark: '#1C1C1E',
    };

    const dynamicColors = {
      background: darkMode ? palette.surfaceDark : palette.beigeBg,
      text: palette.charcoal,
      btnActive: palette.charcoal,
      btnInactive: '#9CA3AF',
      btnText: '#FFFFFF',
      // Specific Card Colors
      easyCardBg: palette.sage,
      hardCardBg: palette.taupe,
      // Icon Circle Colors
      easyIconBg: palette.sageDark,
      hardIconBg: palette.taupeDark,
      // Ring border matches background to create "cutout" effect
      ringBorder: darkMode ? palette.surfaceDark : palette.beigeBg,
      activeBorder: palette.charcoal,
    };

    const styleSheet = StyleSheet.create({
      container: { 
        flex: 1, 
        backgroundColor: dynamicColors.background 
      },
      scrollContent: { 
        paddingBottom: 40, 
        paddingTop: 40 
      },
      title: { 
        fontSize: 26 * scale, 
        fontWeight: '800', 
        color: darkMode ? '#F6F3EE' : dynamicColors.text, 
        textAlign: 'center', 
        marginBottom: 40,
        letterSpacing: -0.5
      },
      // Wrapper for spacing the floating icon
      cardWrapper: { 
        marginBottom: 40, 
        paddingTop: 30, 
        marginHorizontal: 24,
      },
      difficultyCard: { 
        borderRadius: 24, 
        padding: 24, 
        paddingTop: 40, 
        borderWidth: 4, 
        borderColor: 'transparent', // Default border
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        alignItems: 'center',
      },
      // Specific Card Styles
      easyCard: { backgroundColor: dynamicColors.easyCardBg },
      hardCard: { backgroundColor: dynamicColors.hardCardBg },
      
      selectedCard: { 
        borderColor: dynamicColors.activeBorder, 
        transform: [{ scale: 1.02 }], 
        shadowOpacity: 0.3,
      },
      
      // Floating Icon Styles
      cardIconTop: { 
        position: 'absolute', 
        top: -30, 
        left: '50%', 
        marginLeft: -34, // Half of 68px width
        zIndex: 10 
      },
      iconCircle: { 
        width: 68, 
        height: 68, 
        borderRadius: 34, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 5, 
        borderColor: dynamicColors.ringBorder, 
      },
      
      cardTitle: { 
        fontSize: 22 * scale, 
        fontWeight: '800', 
        color: palette.charcoal, 
        marginBottom: 6,
        textAlign: 'center',
      },
      cardDescription: { 
        fontSize: 15 * scale, 
        color: palette.charcoal, 
        opacity: 0.8,
        textAlign: 'center',
        fontWeight: '600',
      },

      // Button Styles
      continueButton: { 
        backgroundColor: dynamicColors.btnActive, 
        borderRadius: 50, 
        paddingVertical: 20, 
        marginHorizontal: 24, 
        marginTop: 20, 
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
      },
      continueButtonDisabled: { 
        backgroundColor: dynamicColors.btnInactive, 
        opacity: 0.7,
        elevation: 0,
        shadowOpacity: 0,
      },
      continueButtonText: { 
        color: dynamicColors.btnText, 
        fontSize: 18 * scale, 
        fontWeight: '700',
        letterSpacing: 0.5,
      },
    });

    return { styles: styleSheet, colors: dynamicColors };
  }, [darkMode, scale]);

  // 3. STATE
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'hard' | null>(null);

  // 4. HANDLERS
  const handleSelectDifficulty = (difficulty: 'easy' | 'hard') => {
    setSelectedDifficulty(difficulty);
  };

  const handleContinue = () => {
    if (selectedDifficulty) {
      onSelectDifficulty(selectedDifficulty);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Choose Your Test Level</Text>

        {/* Easy Mode Card */}
        <View style={styles.cardWrapper}>
          <TouchableOpacity
            style={[
              styles.difficultyCard,
              styles.easyCard,
              selectedDifficulty === 'easy' && styles.selectedCard
            ]}
            onPress={() => handleSelectDifficulty('easy')}
            activeOpacity={0.9}
          >
            <View style={styles.cardIconTop}>
              <View style={[styles.iconCircle, { backgroundColor: colors.easyIconBg }]}>
                <Zap color="#FFF" size={32} fill="#FFF" />
              </View>
            </View>
            <Text style={styles.cardTitle}>Easy Mode</Text>
            <Text style={styles.cardDescription}>Perfect for beginners.</Text>
          </TouchableOpacity>
        </View>

        {/* Hard Mode Card */}
        <View style={styles.cardWrapper}>
          <TouchableOpacity
            style={[
              styles.difficultyCard,
              styles.hardCard,
              selectedDifficulty === 'hard' && styles.selectedCard
            ]}
            onPress={() => handleSelectDifficulty('hard')}
            activeOpacity={0.9}
          >
            <View style={styles.cardIconTop}>
              <View style={[styles.iconCircle, { backgroundColor: colors.hardIconBg }]}>
                <Flame color="#FFF" size={32} fill="#FFF" />
              </View>
            </View>
            <Text style={styles.cardTitle}>Hard Mode</Text>
            <Text style={styles.cardDescription}>Comprehensive analysis.</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedDifficulty && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedDifficulty}
        >
          <Text style={styles.continueButtonText}>Continue Test</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
