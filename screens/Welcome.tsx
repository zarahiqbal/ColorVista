import { useTheme } from "@/Context/ThemeContext";
import { useRouter } from "expo-router";
import {
  AlertTriangle,
  ArrowRight,
  BarChart2,
  Brain,
  CheckCircle,
  Clock,
  Eye,
  Hash,
  ShieldCheck,
} from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  BackHandler,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Design Tokens ────────────────────────────────────────────────────────────
const TOKENS = {
  teal: "#1A7A6A",
  tealLight: "#E8F5F2",
  tealMid: "#2DA891",
  indigo: "#4338CA",
  indigoLight: "#EEF2FF",
  amber: "#B8620A",
  amberLight: "#FEF3E8",
  purple: "#9333EA",
  ink: "#0D0D0D",
  ink2: "#3A3A3A",
  ink3: "#888888",
  ink4: "#BDBDBD",
  cream: "#FAF8F5",
  white: "#FFFFFF",
  border: "#ECEAE6",
  border2: "#D8D4CE",
  heroText: "rgba(255,255,255,0.9)",
  heroSub: "rgba(255,255,255,0.45)",
  heroChip: "rgba(255,255,255,0.12)",
  heroChipBorder: "rgba(255,255,255,0.14)",
  heroChipText: "rgba(255,255,255,0.72)",
  heroAccent: "rgba(26,122,106,0.18)",
  heroAccent2: "rgba(255,255,255,0.05)",
} as const;

const DARK = {
  cream: "#111110",
  white: "#1C1C1E",
  card: "#1C1C1E",
  border: "#2A2A2A",
  border2: "#383838",
  ink: "#F5F3EF",
  ink2: "#C8C5C0",
  ink3: "#888",
  ink4: "#555",
  tealLight: "#0D2E2A",
  indigoLight: "#1A1A3A",
  amberLight: "#2A1800",
} as const;

// ─── Types ─────────────────────────────────────────────────────────────────────
interface WelcomeProps {
  onStart: () => void;
}

interface StepItem {
  num: string;
  title: string;
  desc: string;
  badgeBg: string;
  badgeColor: string;
  iconBg: string;
  iconColor: string;
  Icon: React.ComponentType<{
    size: number;
    color: string;
    strokeWidth?: number;
  }>;
}

interface TipItem {
  text: string;
  dotColor: string;
}

// ─── Data ──────────────────────────────────────────────────────────────────────
const STEPS: StepItem[] = [
  {
    num: "1",
    title: "View the plates",
    desc: "A series of Ishihara color plates",
    badgeBg: TOKENS.tealLight,
    badgeColor: TOKENS.teal,
    iconBg: TOKENS.tealLight,
    iconColor: TOKENS.teal,
    Icon: Eye,
  },
  {
    num: "2",
    title: "Identify numbers",
    desc: "Tap what you see in each image",
    badgeBg: TOKENS.indigoLight,
    badgeColor: TOKENS.indigo,
    iconBg: TOKENS.indigoLight,
    iconColor: TOKENS.indigo,
    Icon: Hash,
  },
  {
    num: "3",
    title: "Get your results",
    desc: "Instant analysis",
    badgeBg: TOKENS.amberLight,
    badgeColor: TOKENS.amber,
    iconBg: TOKENS.amberLight,
    iconColor: TOKENS.amber,
    Icon: BarChart2,
  },
];

const TIPS: TipItem[] = [
  { text: "Bright, evenly lit room", dotColor: TOKENS.teal },
  { text: "Screen brightness at maximum", dotColor: TOKENS.indigo },
  { text: "Remove tinted lenses or glasses", dotColor: TOKENS.amber },
  { text: "Hold screen ~35 cm from eyes", dotColor: TOKENS.purple },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

/** Animated iris with pulsing ring */
const IrisEye: React.FC<{ pulseAnim: Animated.Value }> = ({ pulseAnim }) => {
  const ringOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.18, 0],
  });
  const ringScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.55],
  });

  return (
    <View style={styles.eyeWrap}>
      <Animated.View
        style={[
          styles.pulseRing,
          { opacity: ringOpacity, transform: [{ scale: ringScale }] },
        ]}
      />
      <View style={styles.eyeOuter}>
        <View style={styles.iris}>
          {["#4EC9B0", "#A3E635", "#FCD34D", "#F87171", "#818CF8"].map(
            (c, i) => (
              <View
                key={i}
                style={[
                  styles.irisSegment,
                  {
                    backgroundColor: c,
                    transform: [{ rotate: `${i * 72}deg` }],
                  },
                ]}
              />
            ),
          )}
          <View style={styles.pupil} />
        </View>
      </View>
    </View>
  );
};

/** Hero section */
const Hero: React.FC<{ pulseAnim: Animated.Value }> = ({ pulseAnim }) => (
  <View style={styles.hero}>
    <View style={styles.heroAccent} />
    <View style={styles.heroAccent2} />
    <IrisEye pulseAnim={pulseAnim} />
    <Text style={styles.heroTitle}>
      Color Vision{"\n"}
      <Text style={styles.heroTitleItalic}>Test</Text>
    </Text>
    <Text style={styles.heroSub}>
      Ishihara-based color deficiency screening{"\n"}with intelligent pattern
      analysis
    </Text>
    <View style={styles.chipRow}>
      {[
        { icon: Clock, label: "Quick" },
        { icon: ShieldCheck, label: "Private" },
        { icon: Brain, label: "Quick Analysis" },
      ].map(({ icon: Icon, label }) => (
        <View key={label} style={styles.chip}>
          <Icon size={10} color={TOKENS.heroChipText} strokeWidth={2} />
          <Text style={styles.chipText}>{label}</Text>
        </View>
      ))}
    </View>
  </View>
);

/** Disclaimer banner */
const Disclaimer: React.FC = () => (
  <View style={styles.disclaimer}>
    <View style={styles.discIcon}>
      <AlertTriangle size={16} color={TOKENS.amber} strokeWidth={2} />
    </View>
    <View style={styles.discContent}>
      <Text style={styles.discHead}>Not a medical diagnosis</Text>
      <Text style={styles.discBody}>
        This screening is for informational purposes only and does not replace
        an evaluation by a licensed optometrist or ophthalmologist. Consult a
        professional for any vision concerns.
      </Text>
    </View>
  </View>
);

/** How-it-works step row */
const StepRow: React.FC<{ item: StepItem; isLast: boolean }> = ({
  item,
  isLast,
}) => (
  <View style={[styles.stepRow, !isLast && styles.stepRowBorder]}>
    <View style={[styles.stepBadge, { backgroundColor: item.badgeBg }]}>
      <Text style={[styles.stepBadgeText, { color: item.badgeColor }]}>
        {item.num}
      </Text>
    </View>
    <View style={styles.stepInfo}>
      <Text style={styles.stepTitle}>{item.title}</Text>
      <Text style={styles.stepDesc}>{item.desc}</Text>
    </View>
    <View style={[styles.stepIconWrap, { backgroundColor: item.iconBg }]}>
      <item.Icon size={16} color={item.iconColor} strokeWidth={1.8} />
    </View>
  </View>
);

/** Pre-flight tip row */
const TipRow: React.FC<{ item: TipItem; isLast: boolean }> = ({
  item,
  isLast,
}) => (
  <View style={[styles.tipRow, !isLast && styles.tipRowBorder]}>
    <View style={[styles.tipDot, { backgroundColor: item.dotColor }]} />
    <Text style={styles.tipText}>{item.text}</Text>
    <View style={styles.tipCheck}>
      <CheckCircle size={13} color={TOKENS.ink4} strokeWidth={1.5} />
    </View>
  </View>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Welcome({ onStart }: WelcomeProps) {
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const scale = getFontSizeMultiplier();
  const router = useRouter();

  const pulseAnim = useRef(new Animated.Value(0)).current;
  const heroAnim = useRef(new Animated.Value(0)).current;
  const bodyAnim = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(800),
      ]),
    ).start();

    Animated.stagger(120, [
      Animated.spring(heroAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 9,
      }),
      Animated.spring(bodyAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 9,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const backAction = () => {
      router.replace("/dashboard");
      return true;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => sub.remove();
  }, [router]);

  const heroTranslate = heroAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });
  const bodyTranslate = bodyAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [32, 0],
  });

  const handlePressIn = () => {
    Animated.spring(btnScale, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(btnScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };

  const dm = darkMode;

  return (
    <ScrollView
      style={{ backgroundColor: dm ? DARK.cream : TOKENS.cream }}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: dm ? DARK.cream : TOKENS.cream },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Top bar */}
      <View style={styles.topbar}>
        <Text
          style={[styles.topbarTitle, { color: dm ? DARK.ink3 : TOKENS.ink3 }]}
        >
          {/* Vision Health */}
        </Text>
      </View>

      {/* Hero */}
      <Animated.View
        style={{
          opacity: heroAnim,
          transform: [{ translateY: heroTranslate }],
        }}
      >
        <Hero pulseAnim={pulseAnim} />
      </Animated.View>

      {/* Body */}
      <Animated.View
        style={[
          styles.body,
          { opacity: bodyAnim, transform: [{ translateY: bodyTranslate }] },
        ]}
      >
        <Disclaimer />

        {/* How it works */}
        <View style={styles.sectionHead}>
          <Text
            style={[
              styles.sectionLabel,
              { color: dm ? DARK.ink3 : TOKENS.ink3 },
            ]}
          >
            How it works
          </Text>
          <Text
            style={[
              styles.sectionCount,
              { color: dm ? DARK.ink4 : TOKENS.ink4 },
            ]}
          >
            3 steps
          </Text>
        </View>
        <View
          style={[
            styles.card,
            {
              backgroundColor: dm ? DARK.card : TOKENS.white,
              borderColor: dm ? DARK.border : TOKENS.border,
            },
          ]}
        >
          {STEPS.map((step, i) => (
            <StepRow
              key={step.num}
              item={step}
              isLast={i === STEPS.length - 1}
            />
          ))}
        </View>

        {/* Tips */}
        <View style={styles.sectionHead}>
          <Text
            style={[
              styles.sectionLabel,
              { color: dm ? DARK.ink3 : TOKENS.ink3 },
            ]}
          >
            Before you start
          </Text>
        </View>
        <View
          style={[
            styles.card,
            {
              backgroundColor: dm ? DARK.card : TOKENS.white,
              borderColor: dm ? DARK.border : TOKENS.border,
            },
          ]}
        >
          {TIPS.map((tip, i) => (
            <TipRow key={tip.text} item={tip} isLast={i === TIPS.length - 1} />
          ))}
        </View>

        {/* CTA */}
        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <TouchableOpacity
            style={[
              styles.ctaMain,
              { backgroundColor: dm ? "#F5F3EF" : TOKENS.ink },
            ]}
            onPress={onStart}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
          >
            {/* Subtle teal shimmer on dark background */}
            <View style={styles.ctaShimmer} />

            <View style={styles.ctaLeft}>
              <View
                style={[
                  styles.ctaIconWrap,
                  {
                    backgroundColor: dm
                      ? "rgba(0,0,0,0.07)"
                      : "rgba(255,255,255,0.1)",
                  },
                ]}
              >
                <Eye
                  size={18}
                  color={dm ? TOKENS.ink : TOKENS.white}
                  strokeWidth={1.8}
                />
              </View>
              <View style={styles.ctaTextWrap}>
                <Text
                  style={[
                    styles.ctaLabel,
                    { color: dm ? TOKENS.ink : TOKENS.white },
                  ]}
                >
                  Begin the test
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.ctaArrow,
                {
                  backgroundColor: dm
                    ? "rgba(0,0,0,0.08)"
                    : "rgba(255,255,255,0.12)",
                },
              ]}
            >
              <ArrowRight
                size={18}
                color={dm ? TOKENS.ink : TOKENS.white}
                strokeWidth={2}
              />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Info link */}
      </Animated.View>
    </ScrollView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 16,
  },

  // Top bar
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: Platform.OS === "ios" ? 56 : 20,
    paddingBottom: 10,
  },
  topbarTitle: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },

  // Hero
  hero: {
    marginHorizontal: 18,
    marginBottom: 0,
    backgroundColor: TOKENS.ink,
    borderRadius: 24,
    padding: 30,
    paddingBottom: 26,
    overflow: "hidden",
    position: "relative",
  },
  heroAccent: {
    position: "absolute",
    top: -32,
    right: -32,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: TOKENS.heroAccent,
  },
  heroAccent2: {
    position: "absolute",
    bottom: -20,
    left: 16,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: TOKENS.heroAccent2,
  },

  // Eye
  eyeWrap: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  pulseRing: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  eyeOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  iris: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#111",
  },
  irisSegment: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    top: 0,
    left: 10,
    opacity: 0.85,
  },
  pupil: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: TOKENS.ink,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
    zIndex: 2,
  },

  heroTitle: {
    fontSize: 30,
    fontWeight: "600",
    color: TOKENS.heroText,
    lineHeight: 36,
    marginBottom: 8,
  },
  heroTitleItalic: {
    fontStyle: "italic",
    color: "rgba(255,255,255,0.5)",
    fontWeight: "400",
  },
  heroSub: {
    fontSize: 13,
    color: TOKENS.heroSub,
    lineHeight: 20,
    fontWeight: "300",
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 18,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: TOKENS.heroChip,
    borderWidth: 1,
    borderColor: TOKENS.heroChipBorder,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "500",
    color: TOKENS.heroChipText,
    letterSpacing: 0.3,
  },

  // Body
  body: {
    paddingHorizontal: 18,
    paddingTop: 20,
  },

  // Disclaimer
  disclaimer: {
    backgroundColor: TOKENS.amberLight,
    borderWidth: 1,
    borderColor: "#F0D4B0",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 22,
  },
  discIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#FDE8CC",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  discContent: { flex: 1 },
  discHead: {
    fontSize: 12,
    fontWeight: "600",
    color: TOKENS.amber,
    marginBottom: 3,
    letterSpacing: 0.1,
  },
  discBody: {
    fontSize: 11,
    color: "#8B5000",
    lineHeight: 16.5,
    fontWeight: "400",
  },

  // Section header
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.0,
    textTransform: "uppercase",
  },
  sectionCount: {
    fontSize: 11,
    fontWeight: "300",
  },

  // Card container
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 22,
  },

  // Steps
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  stepRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.border,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  stepInfo: { flex: 1 },
  stepTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: TOKENS.ink,
    lineHeight: 18,
  },
  stepDesc: {
    fontSize: 11,
    color: TOKENS.ink3,
    marginTop: 1,
    fontWeight: "300",
  },
  stepIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // Tips
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  tipRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.border,
  },
  tipDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: TOKENS.ink2,
    fontWeight: "400",
  },
  tipCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: TOKENS.border2,
    alignItems: "center",
    justifyContent: "center",
  },

  // CTA — redesigned
  ctaMain: {
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    position: "relative",
    marginBottom: 0,
    // Elevation / shadow
    shadowColor: TOKENS.ink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaShimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  ctaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  ctaIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaTextWrap: {
    flexDirection: "column",
    gap: 2,
  },
  ctaLabel: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  ctaSub: {
    fontSize: 11,
    fontWeight: "300",
  },
  ctaArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  // Info link
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 16,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12,
    fontWeight: "400",
    letterSpacing: 0.2,
  },
});
// import { useTheme } from "@/Context/ThemeContext";
// import { useRouter } from "expo-router";
// import {
//   AlertTriangle,
//   ArrowRight,
//   BarChart2,
//   Brain,
//   CheckCircle,
//   Clock,
//   Eye,
//   Hash,
//   Info,
//   ShieldCheck,
// } from "lucide-react-native";
// import React, { useEffect, useRef } from "react";
// import {
//   Animated,
//   BackHandler,
//   Dimensions,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

// // ─── Design Tokens ────────────────────────────────────────────────────────────
// const TOKENS = {
//   teal: "#1A7A6A",
//   tealLight: "#E8F5F2",
//   tealMid: "#2DA891",
//   indigo: "#4338CA",
//   indigoLight: "#EEF2FF",
//   amber: "#B8620A",
//   amberLight: "#FEF3E8",
//   purple: "#9333EA",
//   ink: "#0D0D0D",
//   ink2: "#3A3A3A",
//   ink3: "#888888",
//   ink4: "#BDBDBD",
//   cream: "#FAF8F5",
//   white: "#FFFFFF",
//   border: "#ECEAE6",
//   border2: "#D8D4CE",
//   heroText: "rgba(255,255,255,0.9)",
//   heroSub: "rgba(255,255,255,0.45)",
//   heroChip: "rgba(255,255,255,0.12)",
//   heroChipBorder: "rgba(255,255,255,0.14)",
//   heroChipText: "rgba(255,255,255,0.72)",
//   heroAccent: "rgba(26,122,106,0.18)",
//   heroAccent2: "rgba(255,255,255,0.05)",
// } as const;

// const DARK = {
//   cream: "#111110",
//   white: "#1C1C1E",
//   card: "#1C1C1E",
//   border: "#2A2A2A",
//   border2: "#383838",
//   ink: "#F5F3EF",
//   ink2: "#C8C5C0",
//   ink3: "#888",
//   ink4: "#555",
//   tealLight: "#0D2E2A",
//   indigoLight: "#1A1A3A",
//   amberLight: "#2A1800",
// } as const;

// // ─── Types ─────────────────────────────────────────────────────────────────────
// interface WelcomeProps {
//   onStart: () => void;
// }

// interface StepItem {
//   num: string;
//   title: string;
//   desc: string;
//   badgeBg: string;
//   badgeColor: string;
//   iconBg: string;
//   iconColor: string;
//   Icon: React.ComponentType<{
//     size: number;
//     color: string;
//     strokeWidth?: number;
//   }>;
// }

// interface FeatureItem {
//   title: string;
//   desc: string;
//   bg: string;
//   iconColor: string;
//   Icon: React.ComponentType<{
//     size: number;
//     color: string;
//     strokeWidth?: number;
//   }>;
// }

// interface TipItem {
//   text: string;
//   dotColor: string;
// }

// // ─── Data ──────────────────────────────────────────────────────────────────────
// const STEPS: StepItem[] = [
//   {
//     num: "1",
//     title: "View the plates",
//     desc: "A series of Ishihara color plates",
//     badgeBg: TOKENS.tealLight,
//     badgeColor: TOKENS.teal,
//     iconBg: TOKENS.tealLight,
//     iconColor: TOKENS.teal,
//     Icon: Eye,
//   },
//   {
//     num: "2",
//     title: "Identify numbers",
//     desc: "Tap what you see in each image",
//     badgeBg: TOKENS.indigoLight,
//     badgeColor: TOKENS.indigo,
//     iconBg: TOKENS.indigoLight,
//     iconColor: TOKENS.indigo,
//     Icon: Hash,
//   },
//   {
//     num: "3",
//     title: "Get your results",
//     desc: "Instant analysis",
//     badgeBg: TOKENS.amberLight,
//     badgeColor: TOKENS.amber,
//     iconBg: TOKENS.amberLight,
//     iconColor: TOKENS.amber,
//     Icon: BarChart2,
//   },
// ];

// // const FEATURES: FeatureItem[] = [
// //   {
// //     title: "Quick test",
// //     desc: "Done in ~5 minutes",
// //     bg: TOKENS.tealLight,
// //     iconColor: TOKENS.teal,
// //     Icon: Clock,
// //   },
// //   {
// //     title: "Accurate",
// //     desc: "Ishihara standard",
// //     bg: TOKENS.indigoLight,
// //     iconColor: TOKENS.indigo,
// //     Icon: CheckCircle,
// //   },
// //   {
// //     title: "Private",
// //     desc: "Stays on device",
// //     bg: "#FCE7F3",
// //     iconColor: "#BE185D",
// //     Icon: ShieldCheck,
// //   },
// //   {
// //     title: "Analysis",
// //     desc: "Instant insights",
// //     bg: TOKENS.amberLight,
// //     iconColor: TOKENS.amber,
// //     Icon: Brain,
// //   },
// // ];

// const TIPS: TipItem[] = [
//   { text: "Bright, evenly lit room", dotColor: TOKENS.teal },
//   { text: "Screen brightness at maximum", dotColor: TOKENS.indigo },
//   { text: "Remove tinted lenses or glasses", dotColor: TOKENS.amber },
//   { text: "Hold screen ~35 cm from eyes", dotColor: TOKENS.purple },
// ];

// // ─── Sub-components ────────────────────────────────────────────────────────────

// /** Animated iris with pulsing ring */
// const IrisEye: React.FC<{ pulseAnim: Animated.Value }> = ({ pulseAnim }) => {
//   const ringOpacity = pulseAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0.18, 0],
//   });
//   const ringScale = pulseAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [1, 1.55],
//   });

//   return (
//     <View style={styles.eyeWrap}>
//       {/* Pulse ring */}
//       <Animated.View
//         style={[
//           styles.pulseRing,
//           { opacity: ringOpacity, transform: [{ scale: ringScale }] },
//         ]}
//       />
//       {/* Outer ring */}
//       <View style={styles.eyeOuter}>
//         {/* Iris */}
//         <View style={styles.iris}>
//           {/* Color arc segments */}
//           {["#4EC9B0", "#A3E635", "#FCD34D", "#F87171", "#818CF8"].map(
//             (c, i) => (
//               <View
//                 key={i}
//                 style={[
//                   styles.irisSegment,
//                   {
//                     backgroundColor: c,
//                     transform: [{ rotate: `${i * 72}deg` }],
//                   },
//                 ]}
//               />
//             ),
//           )}
//           {/* Pupil overlay */}
//           <View style={styles.pupil} />
//         </View>
//       </View>
//     </View>
//   );
// };

// /** Hero section */
// const Hero: React.FC<{ pulseAnim: Animated.Value }> = ({ pulseAnim }) => (
//   <View style={styles.hero}>
//     <View style={styles.heroAccent} />
//     <View style={styles.heroAccent2} />
//     <IrisEye pulseAnim={pulseAnim} />
//     <Text style={styles.heroTitle}>
//       Color Vision{"\n"}
//       <Text style={styles.heroTitleItalic}>Test</Text>
//     </Text>
//     <Text style={styles.heroSub}>
//       Ishihara-based color deficiency screening{"\n"}with intelligent pattern
//       analysis
//     </Text>
//     {/* Chips */}
//     <View style={styles.chipRow}>
//       {[
//         { icon: Clock, label: "~5 min" },
//         { icon: ShieldCheck, label: "Private" },
//         { icon: Brain, label: "Quick Analysis" },
//       ].map(({ icon: Icon, label }) => (
//         <View key={label} style={styles.chip}>
//           <Icon size={10} color={TOKENS.heroChipText} strokeWidth={2} />
//           <Text style={styles.chipText}>{label}</Text>
//         </View>
//       ))}
//     </View>
//   </View>
// );

// /** Disclaimer banner */
// const Disclaimer: React.FC = () => (
//   <View style={styles.disclaimer}>
//     <View style={styles.discIcon}>
//       <AlertTriangle size={16} color={TOKENS.amber} strokeWidth={2} />
//     </View>
//     <View style={styles.discContent}>
//       <Text style={styles.discHead}>Not a medical diagnosis</Text>
//       <Text style={styles.discBody}>
//         This screening is for informational purposes only and does not replace
//         an evaluation by a licensed optometrist or ophthalmologist. Consult a
//         professional for any vision concerns.
//       </Text>
//     </View>
//   </View>
// );

// /** How-it-works step row */
// const StepRow: React.FC<{ item: StepItem; isLast: boolean }> = ({
//   item,
//   isLast,
// }) => (
//   <View style={[styles.stepRow, !isLast && styles.stepRowBorder]}>
//     <View style={[styles.stepBadge, { backgroundColor: item.badgeBg }]}>
//       <Text style={[styles.stepBadgeText, { color: item.badgeColor }]}>
//         {item.num}
//       </Text>
//     </View>
//     <View style={styles.stepInfo}>
//       <Text style={styles.stepTitle}>{item.title}</Text>
//       <Text style={styles.stepDesc}>{item.desc}</Text>
//     </View>
//     <View style={[styles.stepIconWrap, { backgroundColor: item.iconBg }]}>
//       <item.Icon size={16} color={item.iconColor} strokeWidth={1.8} />
//     </View>
//   </View>
// );

// /** Feature card */
// // const FeatureCard: React.FC<{ item: FeatureItem }> = ({ item }) => (
// //   <View style={styles.featCard}>
// //     <View style={[styles.featIconWrap, { backgroundColor: item.bg }]}>
// //       <item.Icon size={18} color={item.iconColor} strokeWidth={1.8} />
// //     </View>
// //     <Text style={styles.featTitle}>{item.title}</Text>
// //     <Text style={styles.featDesc}>{item.desc}</Text>
// //   </View>
// // );

// /** Pre-flight tip row */
// const TipRow: React.FC<{ item: TipItem; isLast: boolean }> = ({
//   item,
//   isLast,
// }) => (
//   <View style={[styles.tipRow, !isLast && styles.tipRowBorder]}>
//     <View style={[styles.tipDot, { backgroundColor: item.dotColor }]} />
//     <Text style={styles.tipText}>{item.text}</Text>
//     <View style={styles.tipCheck}>
//       <CheckCircle size={13} color={TOKENS.ink4} strokeWidth={1.5} />
//     </View>
//   </View>
// );

// // ─── Main Component ────────────────────────────────────────────────────────────
// export default function Welcome({ onStart }: WelcomeProps) {
//   const { darkMode, getFontSizeMultiplier } = useTheme();
//   const scale = getFontSizeMultiplier();
//   const router = useRouter();

//   // Pulse animation for iris ring
//   const pulseAnim = useRef(new Animated.Value(0)).current;

//   // Staggered entrance animations
//   const heroAnim = useRef(new Animated.Value(0)).current;
//   const bodyAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1800,
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 0,
//           duration: 200,
//           useNativeDriver: true,
//         }),
//         Animated.delay(800),
//       ]),
//     ).start();

//     Animated.stagger(120, [
//       Animated.spring(heroAnim, {
//         toValue: 1,
//         useNativeDriver: true,
//         tension: 60,
//         friction: 9,
//       }),
//       Animated.spring(bodyAnim, {
//         toValue: 1,
//         useNativeDriver: true,
//         tension: 60,
//         friction: 9,
//       }),
//     ]).start();
//   }, []);

//   useEffect(() => {
//     const backAction = () => {
//       router.replace("/dashboard");
//       return true;
//     };
//     const sub = BackHandler.addEventListener("hardwareBackPress", backAction);
//     return () => sub.remove();
//   }, [router]);

//   const heroTranslate = heroAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [24, 0],
//   });
//   const bodyTranslate = bodyAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [32, 0],
//   });

//   const dm = darkMode;

//   return (
//     <ScrollView
//       style={{ backgroundColor: dm ? DARK.cream : TOKENS.cream }}
//       contentContainerStyle={[
//         styles.container,
//         { backgroundColor: dm ? DARK.cream : TOKENS.cream },
//       ]}
//       showsVerticalScrollIndicator={false}
//     >
//       {/* Top bar */}
//       <View style={styles.topbar}>
//         <Text
//           style={[styles.topbarTitle, { color: dm ? DARK.ink3 : TOKENS.ink3 }]}
//         >
//           Vision Health
//         </Text>
//       </View>

//       {/* Hero */}
//       <Animated.View
//         style={{
//           opacity: heroAnim,
//           transform: [{ translateY: heroTranslate }],
//         }}
//       >
//         <Hero pulseAnim={pulseAnim} />
//       </Animated.View>

//       {/* Body */}
//       <Animated.View
//         style={[
//           styles.body,
//           { opacity: bodyAnim, transform: [{ translateY: bodyTranslate }] },
//         ]}
//       >
//         <Disclaimer />

//         {/* How it works */}
//         <View style={styles.sectionHead}>
//           <Text
//             style={[
//               styles.sectionLabel,
//               { color: dm ? DARK.ink3 : TOKENS.ink3 },
//             ]}
//           >
//             How it works
//           </Text>
//           <Text
//             style={[
//               styles.sectionCount,
//               { color: dm ? DARK.ink4 : TOKENS.ink4 },
//             ]}
//           >
//             3 steps
//           </Text>
//         </View>
//         <View
//           style={[
//             styles.card,
//             {
//               backgroundColor: dm ? DARK.card : TOKENS.white,
//               borderColor: dm ? DARK.border : TOKENS.border,
//             },
//           ]}
//         >
//           {STEPS.map((step, i) => (
//             <StepRow
//               key={step.num}
//               item={step}
//               isLast={i === STEPS.length - 1}
//             />
//           ))}
//         </View>

//         {/* Features */}
//         <View style={styles.sectionHead}></View>
//         {/* <View style={styles.featsGrid}>
//           {FEATURES.map((f) => (
//             <FeatureCard key={f.title} item={f} />
//           ))}
//         </View> */}

//         {/* Tips */}
//         <View style={styles.sectionHead}>
//           <Text
//             style={[
//               styles.sectionLabel,
//               { color: dm ? DARK.ink3 : TOKENS.ink3 },
//             ]}
//           >
//             Before you start
//           </Text>
//         </View>
//         <View
//           style={[
//             styles.card,
//             {
//               backgroundColor: dm ? DARK.card : TOKENS.white,
//               borderColor: dm ? DARK.border : TOKENS.border,
//             },
//           ]}
//         >
//           {TIPS.map((tip, i) => (
//             <TipRow key={tip.text} item={tip} isLast={i === TIPS.length - 1} />
//           ))}
//         </View>

//         {/* CTA */}
//         <View style={styles.ctaRow}>
//           <TouchableOpacity
//             style={[
//               styles.ctaMain,
//               { backgroundColor: dm ? "#F5F3EF" : TOKENS.ink },
//             ]}
//             onPress={onStart}
//             activeOpacity={0.85}
//           >
//             <View style={styles.ctaTextWrap}>
//               <Text
//                 style={[
//                   styles.ctaLabel,
//                   { color: dm ? TOKENS.ink : TOKENS.white },
//                 ]}
//               >
//                 Begin the test
//               </Text>
//               <Text
//                 style={[
//                   styles.ctaSub,
//                   { color: dm ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.42)" },
//                 ]}
//               >
//                 Approx. 5 minutes
//               </Text>
//             </View>
//             <View
//               style={[
//                 styles.ctaArrow,
//                 {
//                   backgroundColor: dm
//                     ? "rgba(0,0,0,0.08)"
//                     : "rgba(255,255,255,0.12)",
//                 },
//               ]}
//             >
//               <ArrowRight
//                 size={18}
//                 color={dm ? TOKENS.ink : TOKENS.white}
//                 strokeWidth={2}
//               />
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.ctaInfo,
//               {
//                 backgroundColor: TOKENS.tealLight,
//                 borderColor: dm ? DARK.border : TOKENS.border,
//               },
//             ]}
//             activeOpacity={0.75}
//           >
//             <Info size={20} color={TOKENS.teal} strokeWidth={1.8} />
//           </TouchableOpacity>
//         </View>
//       </Animated.View>
//     </ScrollView>
//   );
// }

// // ─── Styles ────────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     paddingBottom: 16,
//   },

//   // Top bar
//   topbar: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 22,
//     paddingTop: Platform.OS === "ios" ? 56 : 20,
//     paddingBottom: 10,
//   },
//   topbarTitle: {
//     fontSize: 11,
//     fontWeight: "600",
//     letterSpacing: 1.2,
//     textTransform: "uppercase",
//   },
//   topbarBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//     backgroundColor: TOKENS.tealLight,
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//   },
//   topbarBadgeText: {
//     fontSize: 10,
//     fontWeight: "600",
//     color: TOKENS.teal,
//     letterSpacing: 0.4,
//   },

//   // Hero
//   hero: {
//     marginHorizontal: 18,
//     marginBottom: 0,
//     backgroundColor: TOKENS.ink,
//     borderRadius: 24,
//     padding: 30,
//     paddingBottom: 26,
//     overflow: "hidden",
//     position: "relative",
//   },
//   heroAccent: {
//     position: "absolute",
//     top: -32,
//     right: -32,
//     width: 140,
//     height: 140,
//     borderRadius: 70,
//     backgroundColor: TOKENS.heroAccent,
//   },
//   heroAccent2: {
//     position: "absolute",
//     bottom: -20,
//     left: 16,
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: TOKENS.heroAccent2,
//   },

//   // Eye
//   eyeWrap: {
//     width: 64,
//     height: 64,
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 20,
//   },
//   pulseRing: {
//     position: "absolute",
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     borderWidth: 1.5,
//     borderColor: "rgba(255,255,255,0.3)",
//   },
//   eyeOuter: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     borderWidth: 1.5,
//     borderColor: "rgba(255,255,255,0.18)",
//     backgroundColor: "rgba(255,255,255,0.06)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   iris: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     alignItems: "center",
//     justifyContent: "center",
//     overflow: "hidden",
//     backgroundColor: "#111",
//   },
//   irisSegment: {
//     position: "absolute",
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     top: 0,
//     left: 10,
//     opacity: 0.85,
//   },
//   pupil: {
//     width: 18,
//     height: 18,
//     borderRadius: 9,
//     backgroundColor: TOKENS.ink,
//     borderWidth: 2,
//     borderColor: "rgba(255,255,255,0.15)",
//     zIndex: 2,
//   },

//   heroTitle: {
//     fontSize: 30,
//     fontWeight: "600",
//     color: TOKENS.heroText,
//     lineHeight: 36,
//     marginBottom: 8,
//   },
//   heroTitleItalic: {
//     fontStyle: "italic",
//     color: "rgba(255,255,255,0.5)",
//     fontWeight: "400",
//   },
//   heroSub: {
//     fontSize: 13,
//     color: TOKENS.heroSub,
//     lineHeight: 20,
//     fontWeight: "300",
//   },
//   chipRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginTop: 18,
//   },
//   chip: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//     backgroundColor: TOKENS.heroChip,
//     borderWidth: 1,
//     borderColor: TOKENS.heroChipBorder,
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   chipText: {
//     fontSize: 11,
//     fontWeight: "500",
//     color: TOKENS.heroChipText,
//     letterSpacing: 0.3,
//   },

//   // Body
//   body: {
//     paddingHorizontal: 18,
//     paddingTop: 20,
//   },

//   // Disclaimer
//   disclaimer: {
//     backgroundColor: TOKENS.amberLight,
//     borderWidth: 1,
//     borderColor: "#F0D4B0",
//     borderRadius: 16,
//     padding: 14,
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 12,
//     marginBottom: 22,
//   },
//   discIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 10,
//     backgroundColor: "#FDE8CC",
//     alignItems: "center",
//     justifyContent: "center",
//     flexShrink: 0,
//   },
//   discContent: { flex: 1 },
//   discHead: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: TOKENS.amber,
//     marginBottom: 3,
//     letterSpacing: 0.1,
//   },
//   discBody: {
//     fontSize: 11,
//     color: "#8B5000",
//     lineHeight: 16.5,
//     fontWeight: "400",
//   },

//   // Section header
//   sectionHead: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 12,
//     marginTop: 2,
//   },
//   sectionLabel: {
//     fontSize: 11,
//     fontWeight: "600",
//     letterSpacing: 1.0,
//     textTransform: "uppercase",
//   },
//   sectionCount: {
//     fontSize: 11,
//     fontWeight: "300",
//   },

//   // Card container
//   card: {
//     borderRadius: 18,
//     borderWidth: 1,
//     overflow: "hidden",
//     marginBottom: 22,
//   },

//   // Steps
//   stepRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 14,
//     paddingHorizontal: 18,
//     paddingVertical: 14,
//   },
//   stepRowBorder: {
//     borderBottomWidth: 1,
//     borderBottomColor: TOKENS.border,
//   },
//   stepBadge: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   stepBadgeText: {
//     fontSize: 11,
//     fontWeight: "600",
//   },
//   stepInfo: { flex: 1 },
//   stepTitle: {
//     fontSize: 13,
//     fontWeight: "500",
//     color: TOKENS.ink,
//     lineHeight: 18,
//   },
//   stepDesc: {
//     fontSize: 11,
//     color: TOKENS.ink3,
//     marginTop: 1,
//     fontWeight: "300",
//   },
//   stepIconWrap: {
//     width: 32,
//     height: 32,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   // Features
//   featsGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 10,
//     marginBottom: 22,
//   },
//   featCard: {
//     width: (SCREEN_WIDTH - 18 * 2 - 10) / 2,
//     backgroundColor: TOKENS.white,
//     borderWidth: 1,
//     borderColor: TOKENS.border,
//     borderRadius: 16,
//     padding: 16,
//   },
//   featIconWrap: {
//     width: 36,
//     height: 36,
//     borderRadius: 11,
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//   },
//   featTitle: {
//     fontSize: 13,
//     fontWeight: "500",
//     color: TOKENS.ink,
//     marginBottom: 2,
//   },
//   featDesc: {
//     fontSize: 11,
//     color: TOKENS.ink3,
//     lineHeight: 15,
//     fontWeight: "300",
//   },

//   // Tips
//   tipRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     paddingHorizontal: 18,
//     paddingVertical: 13,
//   },
//   tipRowBorder: {
//     borderBottomWidth: 1,
//     borderBottomColor: TOKENS.border,
//   },
//   tipDot: {
//     width: 7,
//     height: 7,
//     borderRadius: 4,
//   },
//   tipText: {
//     flex: 1,
//     fontSize: 13,
//     color: TOKENS.ink2,
//     fontWeight: "400",
//   },
//   tipCheck: {
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     borderWidth: 1,
//     borderColor: TOKENS.border2,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   // CTA
//   ctaRow: {
//     flexDirection: "row",
//     gap: 10,
//     marginTop: 4,
//     marginBottom: 32,
//   },
//   ctaMain: {
//     flex: 1,
//     borderRadius: 16,
//     paddingVertical: 17,
//     paddingHorizontal: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   ctaTextWrap: {
//     flexDirection: "column",
//     gap: 2,
//   },
//   ctaLabel: {
//     fontSize: 15,
//     fontWeight: "500",
//   },
//   ctaSub: {
//     fontSize: 11,
//     fontWeight: "300",
//   },
//   ctaArrow: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   ctaInfo: {
//     width: 56,
//     borderRadius: 16,
//     borderWidth: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
