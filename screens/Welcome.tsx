import { useTheme } from '@/Context/ThemeContext'; // Ensure this path matches your project structure
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Brain, CheckCircle, Clock, Shield } from 'lucide-react-native';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, BackHandler, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Welcome({ onStart }: any) {
  // 1. CONSUME THEME CONTEXT
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const scale = getFontSizeMultiplier();

  // 2. DEFINE PALETTE & DYNAMIC STYLES
  const styles = useMemo(() => {
    // Earth Tone Palette (Matching your design system)
    const palette = {
      beigeBg: '#F6F3EE',       // Cream
      charcoal: '#2F2F2F',      // Primary Dark
      sage: '#8DA399',          // Accent 1 (Green-ish)
      taupe: '#AA957B',         // Accent 2 (Brown-ish)
      white: '#FFFFFF',
      textLight: '#6B6661',
      surfaceDark: '#1C1C1E',
    };

    const colors = {
      background: darkMode ? palette.surfaceDark : '#C9B8A8', // Outer background
      card: darkMode ? '#2C2C2E' : '#F5F0EB', // Inner card background
      text: darkMode ? '#F6F3EE' : palette.charcoal,
      subText: darkMode ? '#A1A1AA' : palette.textLight,
      iconBg: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      decor1: darkMode ? '#4A4A4A' : '#B8A8A8',
      decor2: darkMode ? '#5A5A5A' : '#C9B8B8',
      decor3: darkMode ? '#3A3A3A' : '#A89898',
      // Button Colors
      accent3: palette.charcoal,
    };

    return StyleSheet.create({
      container: {
        flexGrow: 1,
        backgroundColor: colors.background,
      },
      card: {
        backgroundColor: colors.card,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: 20, 
        padding: 28,
        flex: 1, 
        minHeight: '100%',
      },
      header: {
        alignItems: 'center',
        marginBottom: 28,
      },
      title: {
        fontSize: 28 * scale,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 24,
        textAlign: 'center',
      },
      illustrationContainer: {
        width: '100%',
        height: 180,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        position: 'relative',
      },
      illustrationCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: darkMode ? '#3A3A3C' : '#E8DDD8',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
      },
      illustration: {
        width: 120,
        height: 120,
      },
      // Floating Decor Circles
      decorCircle1: {
        width: 20, height: 20, borderRadius: 10,
        backgroundColor: colors.decor1,
        position: 'absolute', left: '20%', top: 30, opacity: 0.6,
      },
      decorCircle2: {
        width: 16, height: 16, borderRadius: 8,
        backgroundColor: colors.decor2,
        position: 'absolute', right: '15%', top: 25, opacity: 0.5,
      },
      decorCircle3: {
        width: 24, height: 24, borderRadius: 12,
        backgroundColor: colors.decor3,
        position: 'absolute', left: '25%', bottom: 25, opacity: 0.5,
      },
      section: {
        marginBottom: 32,
      },
      sectionTitle: {
        fontSize: 18 * scale,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 16,
      },
      stepsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
      },
      stepCard: {
        flex: 1,
        borderRadius: 16,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
        // Background color is handled inline for specific card colors
      },
      stepIcon: { marginBottom: 8 },
      stepIconText: { fontSize: 24 },
      stepText: {
        fontSize: 12 * scale,
        color: '#FFFFFF', // White text on colored cards
        textAlign: 'center',
        fontWeight: '600',
      },
      featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
      },
      featureCard: {
        width: '48%',
        borderRadius: 16,
        padding: 18,
        minHeight: 110,
        justifyContent: 'center',
      },
      featureTitle: {
        fontSize: 15 * scale,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 10,
      },
      featureSubtitle: {
        fontSize: 12 * scale,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 2,
      },
      tipsContainer: { gap: 12 },
      tipItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      },
      tipIconCircle: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: colors.iconBg,
        alignItems: 'center', justifyContent: 'center',
      },
      tipIconText: {
        fontSize: 16,
        color: palette.taupe, 
      },
      tipText: {
        fontSize: 14 * scale,
        color: colors.text,
        flex: 1,
        fontWeight: '500',
      },
      startButton: {
        backgroundColor: colors.accent3, // Charcoal
        borderRadius: 50,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
      },
      startButtonText: {
        color: '#FFFFFF',
        fontSize: 18 * scale,
        fontWeight: '700',
        letterSpacing: 0.5,
      },
      startButtonArrow: {
        color: '#FFFFFF',
        fontSize: 18 * scale,
        fontWeight: '700',
      }
    });
  }, [darkMode, scale]);

  // Specific Palette Colors for inline usage
  const colors = {
      accent1: '#8DA399', // Sage
      accent2: '#AA957B', // Taupe
      accent3: '#2F2F2F', // Charcoal
      accent4: '#6B6661', // Dark Taupe
  };

  // Animation Refs
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createLoop = (anim: Animated.Value, toValue: number, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue, duration, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration, useNativeDriver: true }),
        ])
      );
    };

    createLoop(floatAnim1, -15, 2000).start();
    createLoop(floatAnim2, -20, 2500).start();
    createLoop(floatAnim3, -12, 1800).start();
  }, []);

  // Intercept back navigation from Welcome to go to Dashboard
  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    const goToDashboard = () => {
      try {
        router.replace('/dashboard');
      } catch (e) {
        router.push('/dashboard');
      }
      return true;
    };

    if (Platform.OS === 'android') {
      const sub = BackHandler.addEventListener('hardwareBackPress', goToDashboard);
      return () => sub.remove();
    }

    return undefined;
  }, [router]);

  useEffect(() => {
    const beforeRemove = (e: any) => {
      e.preventDefault();
      try {
        router.replace('/dashboard');
      } catch (err) {
        router.push('/dashboard');
      }
    };

    const unsubscribe = navigation.addListener('beforeRemove', beforeRemove as any);
    return unsubscribe;
  }, [navigation, router]);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Color Vision Test</Text>
          
          <View style={styles.illustrationContainer}>
            <View style={styles.illustrationCircle}>
                <Image 
                  source={require('../assets/images/CVDTest.png')}
                  style={styles.illustration}
                  resizeMode="contain"
                />
            </View>
            <Animated.View style={[styles.decorCircle1, { transform: [{ translateY: floatAnim1 }] }]} />
            <Animated.View style={[styles.decorCircle2, { transform: [{ translateY: floatAnim2 }] }]} />
            <Animated.View style={[styles.decorCircle3, { transform: [{ translateY: floatAnim3 }] }]} />
          </View>
        </View>

        {/* How It Works Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsContainer}>
            <View style={[styles.stepCard, { backgroundColor: colors.accent1 }]}>
              <View style={styles.stepIcon}><Text style={styles.stepIconText}>👁</Text></View>
              <Text style={styles.stepText}>See Images</Text>
            </View>
            <View style={[styles.stepCard, { backgroundColor: colors.accent2 }]}>
              <View style={styles.stepIcon}><Text style={styles.stepIconText}>□△</Text></View>
              <Text style={styles.stepText}>Identify Patterns</Text>
            </View>
            <View style={[styles.stepCard, { backgroundColor: colors.accent3 }]}>
              <View style={styles.stepIcon}><Text style={styles.stepIconText}>⚙</Text></View>
              <Text style={styles.stepText}>AI Analysis</Text>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresGrid}>
            <View style={[styles.featureCard, { backgroundColor: colors.accent1 }]}> 
              <Clock color="white" size={28} />
              <Text style={styles.featureTitle}>Quick Test</Text>
              <Text style={styles.featureSubtitle}>2-3 min</Text>
            </View>
            <View style={[styles.featureCard, { backgroundColor: colors.accent2 }]}> 
              <CheckCircle color="white" size={28} />
              <Text style={styles.featureTitle}>Accurate</Text>
            </View>
            <View style={[styles.featureCard, { backgroundColor: colors.accent3 }]}> 
              <Shield color="white" size={28} />
              <Text style={styles.featureTitle}>Private</Text>
            </View>
            <View style={[styles.featureCard, { backgroundColor: colors.accent4 }]}> 
              <Brain color="white" size={28} />
              <Text style={styles.featureTitle}>AI Powered</Text>
            </View>
          </View>
        </View>

        {/* Before You Start Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Before You Start</Text>
          <View style={styles.tipsContainer}>
            {[
              { icon: '☀', text: 'Use a well-lit environment' },
              { icon: 'ℹ', text: 'Adjust screen brightness' },
              { icon: '∞', text: 'Remove colored glasses' },
              { icon: '◎', text: 'Take your time' }
            ].map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <View style={styles.tipIconCircle}>
                  <Text style={styles.tipIconText}>{tip.icon}</Text>
                </View>
                <Text style={styles.tipText}>{tip.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity style={styles.startButton} onPress={onStart}>
          <Text style={styles.startButtonText}>Start Test</Text>
          <Text style={styles.startButtonArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}