import { Brain, CheckCircle, Clock, Shield } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Welcome({ onStart }: any) {
  // Animation values for floating circles
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation for circle 1
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: -15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation for circle 2 (different timing)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: -20,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation for circle 3 (different timing)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim3, {
          toValue: -12,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim3, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Color Vision Test</Text>
          
          {/* Illustration - Woman with magnifying glass */}
          <View style={styles.illustrationContainer}>
            <View style={styles.illustrationCircle}>
                <Image 
                  source={require('../assets/images/CVDTest.png')}
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>
            {/* Animated decorative elements around the circle */}
            <Animated.View 
              style={[
                styles.decorCircle1,
                { transform: [{ translateY: floatAnim1 }] }
              ]} 
            />
            <Animated.View 
              style={[
                styles.decorCircle2,
                { transform: [{ translateY: floatAnim2 }] }
              ]} 
            />
            <Animated.View 
              style={[
                styles.decorCircle3,
                { transform: [{ translateY: floatAnim3 }] }
              ]} 
            />
          </View>
        </View>

        {/* How It Works Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsContainer}>
            <View style={[styles.stepCard, { backgroundColor: '#B5A5B5' }]}>
              <View style={styles.stepIcon}>
                <Text style={styles.eyeIcon}>👁</Text>
              </View>
              <Text style={styles.stepText}>See Images</Text>
            </View>
            <View style={[styles.stepCard, { backgroundColor: '#B8A090' }]}>
              <View style={styles.stepIcon}>
                <Text style={styles.shapesTextDark}>□△</Text>
              </View>
              <Text style={styles.stepText}>Identify Patterns</Text>
            </View>
            <View style={[styles.stepCard, { backgroundColor: '#9B8B8B' }]}>
              <View style={styles.stepIcon}>
                <Text style={styles.chipIcon}>⚙</Text>
              </View>
              <Text style={styles.stepText}>AI Analysis</Text>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresGrid}>
            <View style={[styles.featureCard, { backgroundColor: '#9B8B9B' }]}>
              <Clock color="white" size={28} />
              <Text style={styles.featureTitle}>Quick Test</Text>
              <Text style={styles.featureSubtitle}>2-3 min</Text>
            </View>
            <View style={[styles.featureCard, { backgroundColor: '#8B7B8B' }]}>
              <CheckCircle color="white" size={28} />
              <Text style={styles.featureTitle}>Comprehensive</Text>
            </View>
            <View style={[styles.featureCard, { backgroundColor: '#3B3B3B' }]}>
              <Shield color="white" size={28} />
              <Text style={styles.featureTitle}>Private</Text>
            </View>
            <View style={[styles.featureCard, { backgroundColor: '#B89B80' }]}>
              <Brain color="white" size={28} />
              <Text style={styles.featureTitle}>AI Analysis</Text>
            </View>
          </View>
        </View>

        {/* Before You Start Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Before You Start</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipItem}>
              <View style={styles.tipIconCircle}>
                <Text style={styles.tipIconText}>☀</Text>
              </View>
              <Text style={styles.tipText}>Use a well-lit environment</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipIconCircle}>
                <Text style={styles.tipIconText}>ℹ</Text>
              </View>
              <Text style={styles.tipText}>Adjust screen brightness</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipIconCircle}>
                <Text style={styles.tipIconText}>∞</Text>
              </View>
              <Text style={styles.tipText}>Remove colored glasses</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipIconCircle}>
                <Text style={styles.tipIconText}>◎</Text>
              </View>
              <Text style={styles.tipText}>Take your time</Text>
            </View>
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity style={styles.startButton} onPress={onStart}>
          <Text style={styles.startButtonText}>Start Test →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 0,
    backgroundColor: '#C9B8A8',
  },
  card: {
    backgroundColor: '#F5F0EB',
    borderRadius: 32,
    padding: 28,
    width: '100%',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2B2B2B',
    marginBottom: 24,
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
    backgroundColor: '#E8DDD8',
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
  decorCircle1: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#B8A8A8',
    position: 'absolute',
    left: '20%',
    top: 30,
    opacity: 0.6,
  },
  decorCircle2: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#C9B8B8',
    position: 'absolute',
    right: '15%',
    top: 25,
    opacity: 0.5,
  },
  decorCircle3: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#A89898',
    position: 'absolute',
    left: '25%',
    bottom: 25,
    opacity: 0.5,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B2B2B',
    marginBottom: 14,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  stepCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
  },
  stepIcon: {
    marginBottom: 8,
  },
  eyeIcon: {
    fontSize: 32,
  },
  shapesText: {
    fontSize: 28,
    color: 'white',
    fontWeight: '300',
  },
  shapesTextDark: {
    fontSize: 28,
    color: '#2B2B2B',
    fontWeight: '300',
  },
  chipIcon: {
    fontSize: 32,
  },
  stepText: {
    fontSize: 11,
    color: '#2B2B2B',
    textAlign: 'center',
    fontWeight: '500',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featureCard: {
    width: '48%',
    borderRadius: 12,
    padding: 18,
    minHeight: 100,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    marginTop: 10,
  },
  featureSubtitle: {
    fontSize: 12,
    color: 'white',
    marginTop: 2,
    opacity: 0.9,
  },
  tipsContainer: {
    gap: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#9B8B8B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipIconText: {
    fontSize: 14,
    color: '#8B7B8B',
  },
  tipText: {
    fontSize: 14,
    color: '#2B2B2B',
    flex: 1,
  },
  startButton: {
    backgroundColor: '#8B7B9B',
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 12,
  },
  startButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
});