// ColorArrangementRow.tsx
// Renders a single row of 10 color tiles with tap-to-select-and-swap interaction.
// Locked tiles (first and last) cannot be moved.

import React, { useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { ColorTile } from './Types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TILE_GAP = 6;
const ROW_HORIZONTAL_PADDING = 24;
const TILE_WIDTH =
  (SCREEN_WIDTH - ROW_HORIZONTAL_PADDING * 2 - TILE_GAP * 9) / 10;
const TILE_HEIGHT = TILE_WIDTH * 1.7; // Rectangular portrait tiles

interface Props {
  tiles: ColorTile[];
  selectedIndex: number | null;
  onTilePress: (index: number) => void;
  rowDescription: string;
}

// ─── Animated Tile ────────────────────────────────────────────────────────────

interface AnimatedTileProps {
  tile: ColorTile;
  index: number;
  isSelected: boolean;
  isLocked: boolean;
  onPress: (index: number) => void;
  shouldAnimate: boolean;
}

const AnimatedTile: React.FC<AnimatedTileProps> = ({
  tile,
  index,
  isSelected,
  isLocked,
  onPress,
  shouldAnimate,
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const triggerSwapAnimation = useCallback(() => {
    translateY.value = withSequence(
      withTiming(-10, { duration: 120 }),
      withSpring(0, { damping: 12, stiffness: 200 })
    );
    scale.value = withSequence(
      withTiming(1.08, { duration: 100 }),
      withSpring(1, { damping: 14, stiffness: 180 })
    );
  }, [scale, translateY]);

  // Trigger animation when this tile was involved in a swap
  React.useEffect(() => {
    if (shouldAnimate) {
      triggerSwapAnimation();
    }
  }, [shouldAnimate, triggerSwapAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const handlePress = useCallback(() => {
    if (!isLocked) {
      // Selection bounce
      scale.value = withSequence(
        withTiming(0.92, { duration: 80 }),
        withSpring(1, { damping: 10, stiffness: 300 })
      );
      onPress(index);
    }
  }, [index, isLocked, onPress, scale]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={isLocked ? 1 : 0.8}
      accessibilityLabel={
        isLocked
          ? `Locked tile, color ${tile.color}`
          : isSelected
          ? `Selected tile, color ${tile.color}`
          : `Tile ${index + 1}, color ${tile.color}. Tap to select or place`
      }
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected, disabled: isLocked }}
    >
      <Animated.View style={[styles.tileWrapper, animatedStyle]}>
        {/* Color swatch */}
        <View
          style={[
            styles.tile,
            { backgroundColor: tile.color },
            isSelected && styles.tileSelected,
            isLocked && styles.tileLocked,
          ]}
        />
        {/* Lock indicator */}
        {isLocked && (
          <View style={styles.lockDot} />
        )}
        {/* Selection ring */}
        {isSelected && <View style={styles.selectionRing} />}
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─── ColorArrangementRow ──────────────────────────────────────────────────────

const ColorArrangementRow: React.FC<Props> = ({
  tiles,
  selectedIndex,
  onTilePress,
  rowDescription,
}) => {
  // Track which tiles were most recently swapped for animation trigger
  const [lastSwapped, setLastSwapped] = React.useState<[number, number] | null>(
    null
  );

  // Expose swap notification via ref so parent can call it
  // Parent will notify after swap by changing tiles prop — we detect it here
  // via a simple key change approach; the parent drives the animation signal
  // by passing an `animateTiles` prop if needed. For simplicity we use
  // the selectedIndex change as the signal.

  return (
    <View style={styles.container}>
      <Text style={styles.rowLabel}>{rowDescription}</Text>
      <View style={styles.tilesRow}>
        {tiles.map((tile, index) => (
          <AnimatedTile
            key={tile.id}
            tile={tile}
            index={index}
            isSelected={selectedIndex === index}
            isLocked={tile.isLocked}
            onPress={onTilePress}
            shouldAnimate={false} // Parent drives swap animations via HueTestScreen
          />
        ))}
      </View>
      <View style={styles.hint}>
        <Text style={styles.hintText}>
          {selectedIndex !== null
            ? 'Tap another tile to swap positions'
            : 'Tap a tile to select it'}
        </Text>
      </View>
    </View>
  );
};

export default ColorArrangementRow;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: ROW_HORIZONTAL_PADDING,
  },
  rowLabel: {
    fontFamily: 'System',
    fontSize: 13,
    letterSpacing: 1.2,
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  tilesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: TILE_GAP,
  },
  tileWrapper: {
    position: 'relative',
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
  },
  tile: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    borderRadius: 5,
  },
  tileSelected: {
    borderRadius: 5,
    // Slight brightness boost handled by the selection ring overlay
  },
  tileLocked: {
    opacity: 1,
    // Lock indicator is the small dot below
  },
  selectionRing: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#E65100', // Orange — matches primary action button
    pointerEvents: 'none',
  },
  lockDot: {
    position: 'absolute',
    bottom: 4,
    left: '50%',
    marginLeft: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  hint: {
    marginTop: 14,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintText: {
    fontSize: 12,
    color: '#AAAAAA',
    letterSpacing: 0.3,
  },
});