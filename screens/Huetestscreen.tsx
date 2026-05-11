// HueTestScreen.tsx
// Interactive hue-arrangement quiz screen for Color Vision Deficiency detection.
// Inspired by the Farnsworth-Munsell 100 Hue Test, adapted for Tritanopia detection.
//
// Prerequisites in your app:
//   npm install react-native-reanimated react-native-gesture-handler react-native-draggable-flatlist
//   Follow reanimated + gesture-handler setup guides for your RN version.
//
// Navigation: Plug HueTestParamList into your existing RootStackParamList and
// call navigation.navigate('Result', { testResult }) from your own Result screen.

import DraggableHueRow from "@/components/Draggable";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
    FadeIn,
    FadeOut,
    SlideInRight,
    SlideOutLeft,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { HUE_ROWS } from "../constants/colorData";
import {
    buildRowResult,
    buildTestResult,
    shuffleDraggableTiles,
} from "../constants/scoringUtils";
import { HueTile, RowResult } from "../constants/types";

// ─── Types ────────────────────────────────────────────────────────────────────

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_ROWS = HUE_ROWS.length;

// ─── Component ────────────────────────────────────────────────────────────────

const HueTestScreen: React.FC = () => {
  const router = useRouter();
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [rowResults, setRowResults] = useState<RowResult[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Track current user order for the active row
  const currentUserOrder = useRef<HueTile[]>([]);

  // Initialise the current row with shuffled draggable tiles
  const [shuffledRow, setShuffledRow] = useState<HueTile[]>(() =>
    shuffleDraggableTiles(HUE_ROWS[0].tiles),
  );

  // Button pulse animation
  const buttonScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const currentRowData = HUE_ROWS[currentRowIndex];

  // Keep ref in sync whenever the draggable row reports a change
  const handleOrderChange = useCallback((newTiles: HueTile[]) => {
    currentUserOrder.current = newTiles;
  }, []);

  // Initialise ref when a new row loads
  React.useEffect(() => {
    currentUserOrder.current = shuffledRow;
  }, [shuffledRow]);

  const handleSubmitRow = () => {
    if (isTransitioning) return;

    // Pulse the button
    buttonScale.value = withSequence(
      withTiming(0.94, { duration: 80 }),
      withTiming(1.0, { duration: 120 }),
    );

    const userTiles =
      currentUserOrder.current.length > 0
        ? currentUserOrder.current
        : shuffledRow;

    const rowResult = buildRowResult(
      currentRowData.rowId,
      currentRowData.label,
      userTiles,
    );

    const updatedResults = [...rowResults, rowResult];
    setRowResults(updatedResults);

    const isLastRow = currentRowIndex === TOTAL_ROWS - 1;

    if (isLastRow) {
      const testResult = buildTestResult(updatedResults);
      const blueYellowScore = Math.max(
        0,
        100 - Math.min(100, Math.round(testResult.totalTritanScore)),
      );

      router.push({
        pathname: "/result",
        params: {
          results: JSON.stringify({
            redGreen: { correct: 100, total: 100 },
            blueYellow: { correct: blueYellowScore, total: 100 },
          }),
        },
      });
      return;
    }

    // Transition to next row
    setIsTransitioning(true);
    setTimeout(() => {
      const nextIndex = currentRowIndex + 1;
      setCurrentRowIndex(nextIndex);
      setShuffledRow(shuffleDraggableTiles(HUE_ROWS[nextIndex].tiles));
      currentUserOrder.current = [];
      setIsTransitioning(false);
    }, 350); // matches exit animation duration
  };

  const isLastRow = currentRowIndex === TOTAL_ROWS - 1;
  const buttonText = isLastRow ? "Submit Test" : "Next Row >";

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor="#F4F4F0" />

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hue Arrangement Test</Text>
          <View style={styles.progressContainer}>
            {Array.from({ length: TOTAL_ROWS }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  i < currentRowIndex && styles.progressDotDone,
                  i === currentRowIndex && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
          <Text style={styles.progressLabel}>
            Row {currentRowIndex + 1} of {TOTAL_ROWS}
          </Text>
        </View>

        {/* ── Instruction Card ── */}
        <View style={styles.instructionCard}>
          <Text style={styles.instructionText}>
            Arrange the tiles in a smooth colour gradient from left to right.
            The{" "}
            <Text style={styles.instructionBold}>
              first and last tiles are fixed.
            </Text>
          </Text>
        </View>

        {/* ── Row Label ── */}
        <Animated.View
          key={`label-${currentRowIndex}`}
          entering={FadeIn.duration(250)}
          exiting={FadeOut.duration(200)}
          style={styles.rowLabelContainer}
        >
          <Text style={styles.rowLabel}>{currentRowData.label}</Text>
        </Animated.View>

        {/* ── Draggable Hue Row ── */}
        <Animated.View
          key={`row-${currentRowIndex}`}
          entering={SlideInRight.duration(320).springify().damping(18)}
          exiting={SlideOutLeft.duration(280)}
          style={styles.rowWrapper}
        >
          <View style={styles.rowSurface}>
            <DraggableHueRow
              tiles={shuffledRow}
              onOrderChange={handleOrderChange}
            />
          </View>
        </Animated.View>

        {/* ── Hint ── */}
        <Text style={styles.hint}>
          Press and drag tiles horizontally to rearrange them
        </Text>

        {/* ── Action Button ── */}
        <View style={styles.buttonArea}>
          <Animated.View style={[styles.buttonWrapper, buttonStyle]}>
            <TouchableOpacity
              style={[styles.button, isTransitioning && styles.buttonDisabled]}
              onPress={handleSubmitRow}
              disabled={isTransitioning}
              activeOpacity={0.88}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Row score preview after first submission */}
          {rowResults.length > 0 && (
            <Animated.View
              entering={FadeIn.duration(300)}
              style={styles.scorePreview}
            >
              {rowResults.map((r) => (
                <Text key={r.rowId} style={styles.scorePreviewText}>
                  {r.label}: {r.errorScore} pts
                </Text>
              ))}
            </Animated.View>
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const ORANGE = "#F5960A";
const BG = "#F4F4F0";
const SURFACE = "#FFFFFF";
const TEXT_PRIMARY = "#1A1A2E";
const TEXT_SECONDARY = "#6B6B80";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "android" ? 16 : 0,
  },

  // ── Header ──
  header: {
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 16 : 8,
    paddingBottom: 12,
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    letterSpacing: 0.3,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 8,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D8D8D8",
  },
  progressDotDone: {
    backgroundColor: "#4CAF82",
  },
  progressDotActive: {
    backgroundColor: ORANGE,
    transform: [{ scale: 1.25 }],
  },
  progressLabel: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontWeight: "500",
  },

  // ── Instruction Card ──
  instructionCard: {
    backgroundColor: SURFACE,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  instructionText: {
    fontSize: 13.5,
    color: TEXT_SECONDARY,
    lineHeight: 20,
    textAlign: "center",
  },
  instructionBold: {
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },

  // ── Row Label ──
  rowLabelContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_PRIMARY,
    letterSpacing: 0.2,
  },

  // ── Row Surface ──
  rowWrapper: {
    marginBottom: 12,
  },
  rowSurface: {
    backgroundColor: SURFACE,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  // ── Hint ──
  hint: {
    fontSize: 11.5,
    color: TEXT_SECONDARY,
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.75,
  },

  // ── Button ──
  buttonArea: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 8,
    gap: 12,
  },
  buttonWrapper: {
    borderRadius: 14,
    overflow: "hidden",
  },
  button: {
    backgroundColor: ORANGE,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: "center",
    shadowColor: ORANGE,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },

  // ── Score Preview ──
  scorePreview: {
    backgroundColor: SURFACE,
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  scorePreviewText: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    textAlign: "center",
  },
});

export default HueTestScreen;
