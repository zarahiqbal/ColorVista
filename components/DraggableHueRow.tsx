// DraggableHueRow.tsx
// Horizontal drag-and-drop row for the Farnsworth-Munsell style hue test.

import React, { useCallback, useEffect, useState } from 'react';
import {
  LayoutChangeEvent,
  StyleSheet,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { HueTile } from '../constants/types';

const TILE_HEIGHT = 56;
const TILE_GAP = 3;
const SPRING_CONFIG = { damping: 20, stiffness: 300 };

interface DraggableHueRowProps {
  tiles: HueTile[];
  onOrderChange: (newTiles: HueTile[]) => void;
}

interface DraggableTileProps {
  tile: HueTile;
  index: number;
  totalTiles: number;
  tileWidth: number;
  isBeingDragged: boolean;
  getSlotX: (index: number) => number;
  slotIndexForX: (absX: number) => number;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onMoveTile: (toIndex: number, draggedId: string) => void;
}

const DraggableTile: React.FC<DraggableTileProps> = ({
  tile,
  index,
  totalTiles,
  tileWidth,
  isBeingDragged,
  getSlotX,
  slotIndexForX,
  onDragStart,
  onDragEnd,
  onMoveTile,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: isBeingDragged ? 999 : 1,
    shadowOpacity: isBeingDragged ? 0.35 : 0,
    shadowRadius: isBeingDragged ? 8 : 0,
    elevation: isBeingDragged ? 8 : 0,
  }));

  let startX = 0;
  let currentIdx = index;

  const gesture = tile.isLocked
    ? Gesture.Pan().enabled(false)
    : Gesture.Pan()
        .activateAfterLongPress(0)
        .onStart(() => {
          startX = getSlotX(index);
          currentIdx = index;
          scale.value = withSpring(1.12, SPRING_CONFIG);
          translateY.value = withSpring(-4, SPRING_CONFIG);
          runOnJS(onDragStart)(tile.id);
        })
        .onUpdate(event => {
          translateX.value = event.translationX;

          const absoluteX = startX + event.translationX + tileWidth / 2;
          const proposed = slotIndexForX(absoluteX);

          if (proposed !== currentIdx && proposed !== 0 && proposed !== totalTiles - 1) {
            runOnJS(onMoveTile)(proposed, tile.id);
            currentIdx = proposed;
          }
        })
        .onEnd(() => {
          translateX.value = withSpring(0, SPRING_CONFIG);
          translateY.value = withSpring(0, SPRING_CONFIG);
          scale.value = withSpring(1, SPRING_CONFIG);
          runOnJS(onDragEnd)();
        })
        .onFinalize(() => {
          translateX.value = withTiming(0, { duration: 150 });
          translateY.value = withTiming(0, { duration: 150 });
          scale.value = withTiming(1, { duration: 150 });
          runOnJS(onDragEnd)();
        });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.tile,
          {
            width: tileWidth,
            height: TILE_HEIGHT,
            backgroundColor: tile.color,
            borderColor: tile.isLocked ? '#1A1A2E' : 'rgba(255,255,255,0.25)',
            borderRadius: 6,
            borderWidth: tile.isLocked ? 2.5 : 1,
          },
          animStyle,
        ]}
      >
        {tile.isLocked && <View style={styles.lockDot} />}
      </Animated.View>
    </GestureDetector>
  );
};

const DraggableHueRow: React.FC<DraggableHueRowProps> = ({
  tiles,
  onOrderChange,
}) => {
  const [orderedTiles, setOrderedTiles] = useState<HueTile[]>(tiles);
  const [containerWidth, setContainerWidth] = useState(0);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  useEffect(() => {
    setOrderedTiles(tiles);
  }, [tiles]);

  const tileWidth = containerWidth > 0
    ? (containerWidth - TILE_GAP * (orderedTiles.length - 1)) / orderedTiles.length
    : 0;

  const getSlotX = useCallback(
    (index: number) => index * (tileWidth + TILE_GAP),
    [tileWidth],
  );

  const slotIndexForX = useCallback(
    (absX: number): number => {
      const raw = Math.round(absX / (tileWidth + TILE_GAP));
      return Math.max(0, Math.min(orderedTiles.length - 1, raw));
    },
    [orderedTiles.length, tileWidth],
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const reorderTiles = useCallback(
    (toIndex: number, draggedId: string) => {
      setOrderedTiles(prev => {
        const fromIndex = prev.findIndex(tile => tile.id === draggedId);
        if (fromIndex === -1 || fromIndex === toIndex) return prev;
        if (prev[toIndex].isLocked) return prev;

        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        onOrderChange(next);
        return next;
      });
    },
    [onOrderChange],
  );

  if (tileWidth === 0) {
    return <View style={styles.row} onLayout={handleLayout} />;
  }

  return (
    <View style={styles.row} onLayout={handleLayout}>
      {orderedTiles.map((tile, index) => (
        <DraggableTile
          key={tile.id}
          tile={tile}
          index={index}
          totalTiles={orderedTiles.length}
          tileWidth={tileWidth}
          isBeingDragged={draggingId === tile.id}
          getSlotX={getSlotX}
          slotIndexForX={slotIndexForX}
          onDragStart={setDraggingId}
          onDragEnd={() => setDraggingId(null)}
          onMoveTile={reorderTiles}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: TILE_GAP,
    paddingVertical: 8,
  },
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
  },
  lockDot: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 3,
    height: 6,
    width: 6,
  },
});

export default DraggableHueRow;
