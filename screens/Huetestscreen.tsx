// HueTestScreen.tsx
// Main screen for the Farnsworth-Munsell inspired Tritan hue arrangement test.
// Manages row progression, tile selection/swap, scoring, and navigation.

import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../Context/ThemeContext";

import ColorArrangementRow from "../components/Colorarrangementrow";
import { TEST_ROWS, TOTAL_ROWS, getShuffledRow } from "../components/Colordata";
import {
    buildRowResult,
    calculateTestResult,
} from "../components/Scoringutils";
import { ColorTile, RowResult, TestResult } from "../components/Types";

// ─── HueTestScreen ────────────────────────────────────────────────────────────

const HueTestScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { ishiharaResult: ishParam } = useLocalSearchParams();
  const ishiharaResult = ishParam ? JSON.parse(ishParam as string) : null;
  const { getFontSizeMultiplier } = useTheme();
  const fontScale = getFontSizeMultiplier();

  // ── State ──────────────────────────────────────────────────────────────────

  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [currentTiles, setCurrentTiles] = useState<ColorTile[]>(
    () => getShuffledRow(TEST_ROWS[0]).tiles,
  );
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(
    null,
  );
  const [rowResults, setRowResults] = useState<RowResult[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [swapAnimKey, setSwapAnimKey] = useState(0); // forces re-render for swap anim

  // Progress bar animation
  const progressAnim = useSharedValue(1 / TOTAL_ROWS);

  // Row transition animation
  const rowOpacity = useSharedValue(1);
  const rowTranslateX = useSharedValue(0);

  // ── Computed ───────────────────────────────────────────────────────────────

  const currentRow = TEST_ROWS[currentRowIndex];
  const isLastRow = currentRowIndex === TOTAL_ROWS - 1;
  const progress = (currentRowIndex + 1) / TOTAL_ROWS;

  // ── Progress bar animated style ────────────────────────────────────────────

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%`,
  }));

  useEffect(() => {
    progressAnim.value = withTiming(progress, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, progressAnim]);

  // ── Tile Tap Handler ───────────────────────────────────────────────────────

  const handleTilePress = useCallback(
    (pressedIndex: number) => {
      if (isTransitioning) return;

      const pressedTile = currentTiles[pressedIndex];

      // Cannot select a locked tile
      if (pressedTile.isLocked) return;

      // First tap — select the tile
      if (selectedTileIndex === null) {
        setSelectedTileIndex(pressedIndex);
        return;
      }

      // Tapping the same tile — deselect
      if (selectedTileIndex === pressedIndex) {
        setSelectedTileIndex(null);
        return;
      }

      // Second tap on a locked tile — deselect first tile, don't swap
      if (pressedTile.isLocked) {
        setSelectedTileIndex(null);
        return;
      }

      // Second tap on a different moveable tile — swap
      const newTiles = [...currentTiles];
      const temp = newTiles[selectedTileIndex];
      newTiles[selectedTileIndex] = newTiles[pressedIndex];
      newTiles[pressedIndex] = temp;

      setCurrentTiles(newTiles);
      setSelectedTileIndex(null);
      setSwapAnimKey((k) => k + 1); // trigger re-render for swap visual
    },
    [currentTiles, isTransitioning, selectedTileIndex],
  );

  // ── Reset Current Row ──────────────────────────────────────────────────────

  const handleReset = useCallback(() => {
    if (isTransitioning) return;
    setCurrentTiles(getShuffledRow(currentRow).tiles);
    setSelectedTileIndex(null);
  }, [currentRow, isTransitioning]);

  // ── Submit Row ─────────────────────────────────────────────────────────────

  const handleSubmit = useCallback(async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Score the row
    const result = buildRowResult(currentTiles, currentRow);
    const newResults = [...rowResults, result];
    setRowResults(newResults);

    if (isLastRow) {
      // ── Final row submitted — calculate and navigate ──────────────────────
      const testResult: TestResult = calculateTestResult(newResults, TEST_ROWS);

      // If Advanced mode supplied Ishihara results, include them in the final payload
      const finalResult = ishiharaResult
        ? { ...testResult, ishiharaResult }
        : testResult;

      // Animate out
      rowOpacity.value = withTiming(0, { duration: 300 });

      setTimeout(() => {
        router.replace(
          `./result?results=${encodeURIComponent(JSON.stringify(finalResult))}`,
        );
      }, 350);
    } else {
      // ── Animate row transition ─────────────────────────────────────────────
      rowOpacity.value = withTiming(0, { duration: 200 });
      rowTranslateX.value = withTiming(-40, { duration: 220 });

      setTimeout(() => {
        const nextIndex = currentRowIndex + 1;
        const nextRow = getShuffledRow(TEST_ROWS[nextIndex]);

        setCurrentRowIndex(nextIndex);
        setCurrentTiles(nextRow.tiles);
        setSelectedTileIndex(null);

        // Reset animation values and fade in
        rowTranslateX.value = 40;
        rowOpacity.value = 0;

        setTimeout(() => {
          rowOpacity.value = withTiming(1, { duration: 260 });
          rowTranslateX.value = withSpring(0, { damping: 18, stiffness: 180 });
          setIsTransitioning(false);
        }, 50);
      }, 240);
    }
  }, [
    currentRow,
    currentRowIndex,
    currentTiles,
    isLastRow,
    isTransitioning,
    router,
    rowOpacity,
    rowResults,
    rowTranslateX,
  ]);

  // ── Row animated style ─────────────────────────────────────────────────────

  const rowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: rowOpacity.value,
    transform: [{ translateX: rowTranslateX.value }],
  }));

  // ─── Render ─────────────────────────────────────────────────────────────────

  // Create theme-aware colors
  const themeColors = useMemo(
    () => ({
      screenBg: "#F5F5F0",
      headerText: "#1A1A1A",
      subText: "#888",
      progressBg: "#E0E0DA",
      progressFill: "#E65100",
      instructionBg: "#F5F5F0",
      instructionText: "#333",
      instructionDot: "#E65100",
      resetButtonBg: "#F0F0F0",
      resetButtonText: "#1A1A1A",
      submitButtonBg: "#E65100",
      submitButtonText: "#FFFFFF",
      submitButtonDisabledBg: "#D0D0D0",
      legendBg: "#F9F9F9",
      legendLabel: "#666",
    }),
    [],
  );

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: themeColors.screenBg,
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 16,
        },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={themeColors.screenBg}
      />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            { color: themeColors.headerText, fontSize: 20 * fontScale },
          ]}
        >
          Hue Arrangement Test
        </Text>
        <Text
          style={[
            styles.headerSubtitle,
            { color: themeColors.subText, fontSize: 12 * fontScale },
          ]}
        >
          Tritan Color Deficiency Screen
        </Text>
      </View>

      {/* ── Progress ──────────────────────────────────────────────────────── */}
      <View style={styles.progressSection}>
        <View style={styles.progressLabelRow}>
          <Text
            style={[
              styles.progressLabel,
              { color: themeColors.subText, fontSize: 13 * fontScale },
            ]}
          >
            Row {currentRowIndex + 1} of {TOTAL_ROWS}
          </Text>
        </View>
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: themeColors.progressBg },
          ]}
        >
          <Animated.View
            style={[
              styles.progressFill,
              progressBarStyle,
              { backgroundColor: themeColors.progressFill },
            ]}
          />
        </View>
        {/* Row step dots */}
        <View style={styles.stepDots}>
          {Array.from({ length: TOTAL_ROWS }).map((_, i) => (
            <View
              key={`step-dot-${TEST_ROWS[i].rowId}`}
              style={[
                styles.stepDot,
                {
                  backgroundColor:
                    i < currentRowIndex
                      ? themeColors.progressFill
                      : themeColors.progressBg,
                },
                i === currentRowIndex && {
                  backgroundColor: themeColors.progressFill,
                  width: 20,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* ── Tile Row ──────────────────────────────────────────────────────── */}
      <View style={styles.tileSection}>
        <Animated.View style={rowAnimatedStyle}>
          <ColorArrangementRow
            key={`row-${currentRowIndex}-${swapAnimKey}`}
            tiles={currentTiles}
            selectedIndex={selectedTileIndex}
            onTilePress={handleTilePress}
            rowDescription={currentRow.description}
          />
        </Animated.View>
      </View>

      {/* ── Instructions Card ─────────────────────────────────────────────── */}
      <View
        style={[
          styles.instructionCard,
          { backgroundColor: themeColors.instructionBg },
        ]}
      >
        <View
          style={[
            styles.instructionDot,
            { backgroundColor: themeColors.instructionDot },
          ]}
        />
        <Text
          style={[
            styles.instructionText,
            { color: themeColors.instructionText, fontSize: 13 * fontScale },
          ]}
        >
          Arrange the middle tiles so colors flow smoothly between the locked
          endpoints
        </Text>
      </View>

      {/* ── Legend ────────────────────────────────────────────────────────── */}
      <View style={[styles.legend, { backgroundColor: themeColors.legendBg }]}>
        <View style={styles.legendItem}>
          <View style={styles.legendSwatch}>
            <View style={styles.legendSwatchInner} />
            <View
              style={[
                styles.legendDot,
                { backgroundColor: themeColors.progressFill },
              ]}
            />
          </View>
          <Text
            style={[
              styles.legendLabel,
              { color: themeColors.legendLabel, fontSize: 12 * fontScale },
            ]}
          >
            Fixed
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendSwatch,
              { borderColor: themeColors.progressFill, borderWidth: 2 },
            ]}
          >
            <View style={styles.legendSwatchInner} />
          </View>
          <Text
            style={[
              styles.legendLabel,
              { color: themeColors.legendLabel, fontSize: 12 * fontScale },
            ]}
          >
            Selected
          </Text>
        </View>
      </View>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.resetButton,
            { backgroundColor: themeColors.resetButtonBg },
          ]}
          onPress={handleReset}
          accessibilityLabel="Reset this row"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.resetButtonText,
              { color: themeColors.resetButtonText, fontSize: 14 * fontScale },
            ]}
          >
            Reset Row
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor: isTransitioning
                ? themeColors.submitButtonDisabledBg
                : themeColors.submitButtonBg,
            },
            isTransitioning && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isTransitioning}
          accessibilityLabel={
            isLastRow ? "Finish test" : "Submit row and continue"
          }
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.submitButtonText,
              { color: themeColors.submitButtonText, fontSize: 14 * fontScale },
            ]}
          >
            {isLastRow ? "Finish Test" : "Submit Row →"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HueTestScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: "center",
  },
  headerTitle: {
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    marginTop: 2,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  // Progress
  progressSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontWeight: "500",
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  stepDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Tile area
  tileSection: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 8,
  },

  // Instruction card
  instructionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 24,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    gap: 10,
  },
  instructionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
    flexShrink: 0,
  },
  instructionText: {
    flex: 1,
    lineHeight: 19,
  },

  // Legend
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendSwatch: {
    width: 20,
    height: 28,
    borderRadius: 4,
    backgroundColor: "#B0BEC5",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  legendSwatchInner: {
    width: 14,
    height: 22,
    borderRadius: 3,
    backgroundColor: "#78909C",
  },
  legendDot: {
    position: "absolute",
    bottom: 3,
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  legendLabel: {
    fontWeight: "400",
  },

  // Actions
  actions: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    alignItems: "center",
  },
  resetButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#CCCCCA",
    justifyContent: "center",
    alignItems: "center",
  },
  resetButtonText: {
    fontWeight: "500",
  },
  submitButton: {
    flex: 2,
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  submitButtonDisabled: {
    opacity: 0.55,
  },
  submitButtonText: {
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
