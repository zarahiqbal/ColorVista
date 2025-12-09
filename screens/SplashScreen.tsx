import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Styles {
  container: ViewStyle;
  backgroundCircle: ViewStyle;
  gradientOverlay: ViewStyle;
  logoContainer: ViewStyle;
  logo: ImageStyle;
  appName: ViewStyle;
  colorText: TextStyle;
  vistaText: TextStyle;
  tagline: TextStyle;
  particlesContainer: ViewStyle;
  particle: ViewStyle;
  loadingContainer: ViewStyle;
  loadingBar: ViewStyle;
  loadingFill: ViewStyle;
}

const SplashScreen: React.FC = () => {
  const router = useRouter();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const textSlideAnim = useRef(new Animated.Value(50)).current;
  const loadingProgress = useRef(new Animated.Value(0)).current;
  
  // Particle animations
  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;
  const particle3 = useRef(new Animated.Value(0)).current;
  const particle4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered animations
    Animated.parallel([
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Scale up logo
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // Rotate logo slightly
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Text slide in after logo
    setTimeout(() => {
      Animated.timing(textSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 400);

    // Floating particles animation
    const animateParticles = () => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(particle1, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(particle1, {
              toValue: 0,
              duration: 3000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(particle2, {
              toValue: 1,
              duration: 4000,
              useNativeDriver: true,
            }),
            Animated.timing(particle2, {
              toValue: 0,
              duration: 4000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(particle3, {
              toValue: 1,
              duration: 3500,
              useNativeDriver: true,
            }),
            Animated.timing(particle3, {
              toValue: 0,
              duration: 3500,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(particle4, {
              toValue: 1,
              duration: 4500,
              useNativeDriver: true,
            }),
            Animated.timing(particle4, {
              toValue: 0,
              duration: 4500,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    setTimeout(animateParticles, 600);

    // Loading bar animation
    setTimeout(() => {
      Animated.timing(loadingProgress, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    }, 1000);

    // Navigate to main screen after splash
    const timer = setTimeout(() => {
      // Replace the splash with dashboard so the splash isn't on the stack
      router.replace('../auth/login');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const logoRotation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '0deg'],
  });

  const getParticleStyle = (animValue: Animated.Value, delay: number) => ({
    opacity: animValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 0],
    }),
    transform: [
      {
        translateY: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -100],
        }),
      },
      {
        scale: animValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.5, 1, 0.5],
        }),
      },
    ],
  });

  const loadingWidth = loadingProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Background decorative circles */}
      <Animated.View
        style={[
          styles.backgroundCircle,
          {
            opacity: fadeAnim,
            top: height * 0.1,
            left: -width * 0.2,
            backgroundColor: 'rgba(59, 183, 179, 0.1)',
          },
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundCircle,
          {
            opacity: fadeAnim,
            bottom: height * 0.15,
            right: -width * 0.15,
            backgroundColor: 'rgba(244, 179, 80, 0.1)',
          },
        ]}
      />

      {/* Floating color particles */}
      <View style={styles.particlesContainer}>
        <Animated.View
          style={[
            styles.particle,
            { backgroundColor: '#3BB7B3', top: '20%', left: '15%' },
            getParticleStyle(particle1, 0),
          ]}
        />
        <Animated.View
          style={[
            styles.particle,
            { backgroundColor: '#5BC7DE', top: '30%', right: '20%' },
            getParticleStyle(particle2, 200),
          ]}
        />
        <Animated.View
          style={[
            styles.particle,
            { backgroundColor: '#F4B350', bottom: '35%', left: '25%' },
            getParticleStyle(particle3, 400),
          ]}
        />
        <Animated.View
          style={[
            styles.particle,
            { backgroundColor: '#E8D983', bottom: '25%', right: '15%' },
            getParticleStyle(particle4, 600),
          ]}
        />
      </View>

      {/* Logo Container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { rotate: logoRotation },
            ],
          },
        ]}
      >
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* App Name */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: textSlideAnim }],
        }}
      >
        <View style={styles.appName}>
          <Text style={styles.colorText}>Color</Text>
          <Text style={styles.vistaText}>Vista</Text>
        </View>
        <Text style={styles.tagline}>See the World in Full Spectrum</Text>
      </Animated.View>

      {/* Loading Bar */}
      <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
        <View style={styles.loadingBar}>
          <Animated.View
            style={[
              styles.loadingFill,
              { width: loadingWidth },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundCircle: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
  },
  gradientOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 200,
  },
  appName: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  colorText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#5BC7DE',
    letterSpacing: -1,
  },
  vistaText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#E8D983',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    width: width * 0.6,
    alignItems: 'center',
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingFill: {
    height: '100%',
    backgroundColor: '#14B8A6',
    borderRadius: 2,
  },
});

export default SplashScreen;