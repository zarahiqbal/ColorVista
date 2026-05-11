// import { useTheme } from "@/Context/ThemeContext"; // Ensure this path matches your project structure
// import { Flame, Zap } from "lucide-react-native";
// import { useMemo, useState } from "react";
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// // Define the Props Interface
// interface DifficultySelectionProps {
//   onSelectDifficulty: (difficulty: "easy" | "hard") => void;
// }

// export function DifficultySelection({
//   onSelectDifficulty,
// }: DifficultySelectionProps) {
//   // 1. CONSUME THEME CONTEXT
//   const { darkMode, getFontSizeMultiplier } = useTheme();
//   const scale = getFontSizeMultiplier();

//   // 2. DEFINE DYNAMIC STYLES & COLORS
//   const { styles, colors } = useMemo(() => {
//     // --- EARTH TONE PALETTE ---
//     const palette = {
//       beigeBg: "#F6F3EE", // Main Screen Background
//       charcoal: "#2F2F2F", // Text & Buttons
//       sage: "#8DA399", // Easy Mode Card
//       sageDark: "#6B7B7B", // Easy Mode Icon Circle
//       taupe: "#AA957B", // Hard Mode Card
//       taupeDark: "#8B7B6B", // Hard Mode Icon Circle
//       white: "#FFFFFF",
//       surfaceDark: "#1C1C1E",
//     };

//     const dynamicColors = {
//       background: darkMode ? palette.surfaceDark : palette.beigeBg,
//       text: palette.charcoal,
//       btnActive: palette.charcoal,
//       btnInactive: "#9CA3AF",
//       btnText: "#FFFFFF",
//       // Specific Card Colors
//       easyCardBg: palette.sage,
//       hardCardBg: palette.taupe,
//       // Icon Circle Colors
//       easyIconBg: palette.sageDark,
//       hardIconBg: palette.taupeDark,
//       // Ring border matches background to create "cutout" effect
//       ringBorder: darkMode ? palette.surfaceDark : palette.beigeBg,
//       activeBorder: palette.charcoal,
//     };

//     const styleSheet = StyleSheet.create({
//       container: {
//         flex: 1,
//         backgroundColor: dynamicColors.background,
//       },
//       scrollContent: {
//         paddingBottom: 40,
//         paddingTop: 40,
//       },
//       title: {
//         fontSize: 26 * scale,
//         fontWeight: "800",
//         color: darkMode ? "#F6F3EE" : dynamicColors.text,
//         textAlign: "center",
//         marginTop: 60,
//         marginBottom: 40,
//         letterSpacing: -0.5,
//       },
//       // Wrapper for spacing the floating icon
//       cardWrapper: {
//         marginBottom: 40,
//         paddingTop: 30,
//         marginHorizontal: 24,
//       },
//       difficultyCard: {
//         borderRadius: 24,
//         padding: 24,
//         paddingTop: 40,
//         borderWidth: 4,
//         borderColor: "transparent", // Default border
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.15,
//         shadowRadius: 8,
//         elevation: 6,
//         alignItems: "center",
//       },
//       // Specific Card Styles
//       easyCard: { backgroundColor: dynamicColors.easyCardBg },
//       hardCard: { backgroundColor: dynamicColors.hardCardBg },

//       selectedCard: {
//         borderColor: dynamicColors.activeBorder,
//         transform: [{ scale: 1.02 }],
//         shadowOpacity: 0.3,
//       },

//       // Floating Icon Styles
//       cardIconTop: {
//         position: "absolute",
//         top: -30,
//         left: "50%",
//         marginLeft: -34, // Half of 68px width
//         zIndex: 10,
//       },
//       iconCircle: {
//         width: 68,
//         height: 68,
//         borderRadius: 34,
//         justifyContent: "center",
//         alignItems: "center",
//         borderWidth: 5,
//         borderColor: dynamicColors.ringBorder,
//       },

//       cardTitle: {
//         fontSize: 22 * scale,
//         fontWeight: "800",
//         color: palette.charcoal,
//         marginBottom: 6,
//         textAlign: "center",
//       },
//       cardDescription: {
//         fontSize: 15 * scale,
//         color: palette.charcoal,
//         opacity: 0.8,
//         textAlign: "center",
//         fontWeight: "600",
//       },

//       // Button Styles
//       continueButton: {
//         backgroundColor: dynamicColors.btnActive,
//         borderRadius: 50,
//         paddingVertical: 20,
//         marginHorizontal: 24,
//         marginTop: 20,
//         alignItems: "center",
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.25,
//         shadowRadius: 8,
//         elevation: 6,
//       },
//       continueButtonDisabled: {
//         backgroundColor: dynamicColors.btnInactive,
//         opacity: 0.7,
//         elevation: 0,
//         shadowOpacity: 0,
//       },
//       continueButtonText: {
//         color: dynamicColors.btnText,
//         fontSize: 18 * scale,
//         fontWeight: "700",
//         letterSpacing: 0.5,
//       },
//     });

//     return { styles: styleSheet, colors: dynamicColors };
//   }, [darkMode, scale]);

//   // 3. STATE
//   const [selectedDifficulty, setSelectedDifficulty] = useState<
//     "basic" | "advanced" | null
//   >(null);

//   // 4. HANDLERS
//   const handleSelectDifficulty = (difficulty: "basic" | "advanced") => {
//     setSelectedDifficulty(difficulty);
//   };

//   const handleContinue = () => {
//     if (selectedDifficulty) {
//       onSelectDifficulty(selectedDifficulty);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <Text style={styles.title}>Choose Your Test Level</Text>

//         {/* Easy Mode Card */}
//         <View style={styles.cardWrapper}>
//           <TouchableOpacity
//             style={[
//               styles.difficultyCard,
//               styles.easyCard,
//               selectedDifficulty === "basic" && styles.selectedCard,
//             ]}
//             onPress={() => handleSelectDifficulty("basic")}
//             activeOpacity={0.9}
//           >
//             <View style={styles.cardIconTop}>
//               <View
//                 style={[
//                   styles.iconCircle,
//                   { backgroundColor: colors.easyIconBg },
//                 ]}
//               >
//                 <Zap color="#FFF" size={32} fill="#FFF" />
//               </View>
//             </View>
//             <Text style={styles.cardTitle}>Easy Mode</Text>
//             <Text style={styles.cardDescription}>Perfect for beginners.</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Hard Mode Card */}
//         <View style={styles.cardWrapper}>
//           <TouchableOpacity
//             style={[
//               styles.difficultyCard,
//               styles.hardCard,
//               selectedDifficulty === "advanced" && styles.selectedCard,
//             ]}
//             onPress={() => handleSelectDifficulty("advanced")}
//             activeOpacity={0.9}
//           >
//             <View style={styles.cardIconTop}>
//               <View
//                 style={[
//                   styles.iconCircle,
//                   { backgroundColor: colors.hardIconBg },
//                 ]}
//               >
//                 <Flame color="#FFF" size={32} fill="#FFF" />
//               </View>
//             </View>
//             <Text style={styles.cardTitle}>Hard Mode</Text>
//             <Text style={styles.cardDescription}>Comprehensive analysis.</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Continue Button */}
//         <TouchableOpacity
//           style={[
//             styles.continueButton,
//             !selectedDifficulty && styles.continueButtonDisabled,
//           ]}
//           onPress={handleContinue}
//           disabled={!selectedDifficulty}
//         >
//           <Text style={styles.continueButtonText}>Continue Test</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// }
import { useTheme } from "@/Context/ThemeContext";
import { ArrowRight, Flame, Zap } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const TOKENS = {
  teal: "#1A7A6A",
  tealLight: "#E8F5F2",
  amber: "#B8620A",
  amberLight: "#FEF3E8",
  ink: "#0D0D0D",
  ink2: "#3A3A3A",
  ink3: "#888888",
  cream: "#FAF8F5",
  white: "#FFFFFF",
  border: "#ECEAE6",
  border2: "#D8D4CE",
} as const;

const DARK = {
  cream: "#111110",
  card: "#1C1C1E",
  border: "#2A2A2A",
  border2: "#383838",
  ink: "#F5F3EF",
  ink2: "#C8C5C0",
  ink3: "#888",
} as const;

// ─── Types ─────────────────────────────────────────────────────────────────────
type DifficultyLevel = "basic" | "advanced";

interface DifficultySelectionProps {
  onSelectDifficulty: (difficulty: DifficultyLevel) => void;
}

// ─── Card Data ─────────────────────────────────────────────────────────────────
const CARDS = [
  {
    key: "basic" as DifficultyLevel,
    label: "Basic Mode",
    sublabel: "Standard screening",
    desc: "14 Ishihara plates covering the most common red-green deficiencies. Ideal for a quick personal check.",
    accent: TOKENS.teal,
    accentLight: TOKENS.tealLight,
    accentLightDark: "#0D2E2A",
    Icon: Zap,
    tags: ["14 plates", "~5 min", "Red-green focus"],
  },
  {
    key: "advanced" as DifficultyLevel,
    label: "Advanced Mode",
    sublabel: "Comprehensive analysis",
    desc: "Extended plate set covering subtle hue shifts, blue-yellow variants and brightness sensitivity.",
    accent: TOKENS.amber,
    accentLight: TOKENS.amberLight,
    accentLightDark: "#2A1800",
    Icon: Flame,
    tags: ["24 plates", "~10 min", "Full spectrum"],
  },
];

// ─── Difficulty Card ───────────────────────────────────────────────────────────
const DifficultyCard = ({
  item,
  selected,
  onPress,
  dm,
}: {
  item: (typeof CARDS)[number];
  selected: boolean;
  onPress: () => void;
  dm: boolean;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.985,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };

  const accentBg = dm ? item.accentLightDark : item.accentLight;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          {
            backgroundColor: dm ? DARK.card : TOKENS.white,
            borderColor: selected
              ? item.accent
              : dm
                ? DARK.border
                : TOKENS.border,
            borderWidth: selected ? 1.5 : 1,
            shadowColor: selected ? item.accent : TOKENS.ink,
            shadowOpacity: selected ? 0.14 : 0.06,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={[styles.cardIconWrap, { backgroundColor: accentBg }]}>
            <item.Icon size={18} color={item.accent} strokeWidth={1.8} />
          </View>

          <View style={styles.cardHeaderText}>
            <Text
              style={[styles.cardTitle, { color: dm ? DARK.ink : TOKENS.ink }]}
            >
              {item.label}
            </Text>

            <Text
              style={[
                styles.cardSublabel,
                { color: dm ? DARK.ink3 : TOKENS.ink3 },
              ]}
            >
              {item.sublabel}
            </Text>
          </View>

          {/* Radio */}
          <View
            style={[
              styles.radioOuter,
              {
                borderColor: selected
                  ? item.accent
                  : dm
                    ? DARK.border2
                    : TOKENS.border2,
                backgroundColor: selected ? item.accent : "transparent",
              },
            ]}
          >
            {selected && <View style={styles.radioDot} />}
          </View>
        </View>

        {/* Divider */}
        <View
          style={[
            styles.cardDivider,
            {
              backgroundColor: dm ? DARK.border : TOKENS.border,
            },
          ]}
        />

        {/* Description */}
        <Text
          style={[styles.cardDesc, { color: dm ? DARK.ink2 : TOKENS.ink2 }]}
        >
          {item.desc}
        </Text>

        {/* Tags */}
        <View style={styles.tagRow}>
          {item.tags.map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: accentBg }]}>
              <Text style={[styles.tagText, { color: item.accent }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
export function DifficultySelection({
  onSelectDifficulty,
}: DifficultySelectionProps) {
  const { darkMode } = useTheme();
  const dm = darkMode;

  const [selected, setSelected] = useState<DifficultyLevel | null>(null);

  const btnScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!selected) return;

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

  const handleContinue = () => {
    if (selected) {
      onSelectDifficulty(selected);
    }
  };

  const selectedCard = CARDS.find((c) => c.key === selected);

  return (
    <ScrollView
      style={{
        backgroundColor: dm ? DARK.cream : TOKENS.cream,
      }}
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: dm ? DARK.cream : TOKENS.cream,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Topbar */}
      <View style={styles.topbar}>
        <Text
          style={[
            styles.topbarTitle,
            {
              color: dm ? DARK.ink3 : TOKENS.ink3,
            },
          ]}
        >
          Color Vista
        </Text>
      </View>

      {/* Heading */}
      <View style={styles.headingWrap}>
        <Text
          style={[
            styles.heading,
            {
              color: dm ? DARK.ink : TOKENS.ink,
            },
          ]}
        >
          Choose Your{"\n"}
          <Text
            style={[
              styles.headingItalic,
              {
                color: dm ? DARK.ink3 : TOKENS.ink3,
              },
            ]}
          >
            Test Level
          </Text>
        </Text>

        <Text
          style={[
            styles.headingSub,
            {
              color: dm ? DARK.ink3 : TOKENS.ink3,
            },
          ]}
        >
          Select the mode that fits your goal
        </Text>
      </View>

      {/* Cards */}
      <View style={styles.cardsWrap}>
        {CARDS.map((card) => (
          <DifficultyCard
            key={card.key}
            item={card}
            selected={selected === card.key}
            onPress={() => setSelected(card.key)}
            dm={dm}
          />
        ))}
      </View>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        <Animated.View
          style={{
            transform: [{ scale: btnScale }],
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            disabled={!selected}
            onPress={handleContinue}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
              styles.ctaMain,
              {
                backgroundColor: selected
                  ? dm
                    ? "#F5F3EF"
                    : TOKENS.ink
                  : dm
                    ? "#2A2A2A"
                    : "#D0CEC9",
              },
            ]}
          >
            <View style={styles.ctaLeft}>
              <View
                style={[
                  styles.ctaIconWrap,
                  {
                    backgroundColor: selected
                      ? dm
                        ? "rgba(0,0,0,0.07)"
                        : "rgba(255,255,255,0.1)"
                      : "rgba(255,255,255,0.06)",
                  },
                ]}
              >
                {selectedCard ? (
                  <selectedCard.Icon
                    size={18}
                    color={dm ? TOKENS.ink : TOKENS.white}
                    strokeWidth={1.8}
                  />
                ) : (
                  <Zap
                    size={18}
                    color="rgba(255,255,255,0.3)"
                    strokeWidth={1.8}
                  />
                )}
              </View>

              <View>
                <Text
                  style={[
                    styles.ctaLabel,
                    {
                      color: selected
                        ? dm
                          ? TOKENS.ink
                          : TOKENS.white
                        : "rgba(255,255,255,0.35)",
                    },
                  ]}
                >
                  {selectedCard
                    ? `Start ${selectedCard.label}`
                    : "Select a level to continue"}
                </Text>

                {selectedCard && (
                  <Text
                    style={[
                      styles.ctaSub,
                      {
                        color: dm
                          ? "rgba(0,0,0,0.4)"
                          : "rgba(255,255,255,0.42)",
                      },
                    ]}
                  >
                    {selectedCard.tags[1]} · {selectedCard.tags[0]}
                  </Text>
                )}
              </View>
            </View>

            {selected && (
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
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  topbar: {
    flexDirection: "row",
    alignItems: "center",
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

  headingWrap: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 28,
  },

  heading: {
    fontSize: 30,
    fontWeight: "600",
    lineHeight: 36,
    marginBottom: 8,
  },

  headingItalic: {
    fontStyle: "italic",
    fontWeight: "400",
  },

  headingSub: {
    fontSize: 13,
    fontWeight: "300",
    lineHeight: 20,
  },

  cardsWrap: {
    paddingHorizontal: 18,
    gap: 12,
    marginBottom: 24,
  },

  card: {
    borderRadius: 18,
    padding: 18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },

  cardIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  cardHeaderText: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },

  cardSublabel: {
    fontSize: 11,
    fontWeight: "400",
    marginTop: 1,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },

  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.9)",
  },

  cardDivider: {
    height: 1,
    marginBottom: 14,
  },

  cardDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  tag: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  tagText: {
    fontSize: 11,
    fontWeight: "500",
  },

  ctaWrap: {
    paddingHorizontal: 18,
  },

  ctaMain: {
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
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

  ctaLabel: {
    fontSize: 15,
    fontWeight: "600",
  },

  ctaSub: {
    fontSize: 11,
    marginTop: 2,
  },

  ctaArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
