// TapSwapHueRow.tsx
// Tap-to-Move Hue Arrangement Row

import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";

import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { HueTile } from "../constants/types";

const TILE_HEIGHT = 56;
const TILE_GAP = 4;
const DROP_ZONE_WIDTH = 12;

interface TapSwapHueRowProps {
  tiles: HueTile[];
  onOrderChange: (tiles: HueTile[]) => void;
}

interface TileProps {
  tile: HueTile;
  width: number;
  isSelected: boolean;
  onPress: () => void;
}

interface DropZoneProps {
  active: boolean;
  onPress: () => void;
}

const Tile = ({ tile, width, isSelected, onPress }: TileProps) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(isSelected ? 1.08 : 1, {
      damping: 14,
      stiffness: 220,
    });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    elevation: interpolate(scale.value, [1, 1.08], [1, 8]),
    shadowOpacity: interpolate(scale.value, [1, 1.08], [0.08, 0.3]),
  }));

  return (
    <Animated.View
      style={[
        styles.tile,
        {
          width,
          backgroundColor: tile.color,

          borderColor: tile.isLocked
            ? "#1A1A2E"
            : isSelected
              ? "#FFFFFF"
              : "rgba(255,255,255,0.22)",

          borderWidth: tile.isLocked ? 2.5 : isSelected ? 3 : 1,
        },
        animatedStyle,
      ]}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={onPress} hitSlop={12}>
        {tile.isLocked && <View style={styles.lockDot} />}
      </Pressable>
    </Animated.View>
  );
};

const DropZone = ({ active, onPress }: DropZoneProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={!active}
      hitSlop={6}
      style={[styles.dropZone, active && styles.activeDropZone]}
    />
  );
};

export default function TapSwapHueRow({
  tiles,
  onOrderChange,
}: TapSwapHueRowProps) {
  const [orderedTiles, setOrderedTiles] = useState<HueTile[]>(tiles);

  const [selectedTile, setSelectedTile] = useState<HueTile | null>(null);

  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    setOrderedTiles(tiles);
  }, [tiles]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const totalDropZoneWidth = (orderedTiles.length + 1) * DROP_ZONE_WIDTH;

  const totalGapWidth = TILE_GAP * (orderedTiles.length - 1);

  const tileWidth =
    containerWidth > 0
      ? (containerWidth - totalDropZoneWidth - totalGapWidth) /
        orderedTiles.length
      : 0;

  const handleTilePress = (tile: HueTile) => {
    if (tile.isLocked) {
      return;
    }

    if (selectedTile && selectedTile.id === tile.id) {
      setSelectedTile(null);
      return;
    }

    setSelectedTile(tile);
  };

  const moveTileToPosition = (targetIndex: number) => {
    if (!selectedTile) {
      return;
    }

    const currentIndex = orderedTiles.findIndex(
      (t) => t.id === selectedTile.id,
    );

    if (currentIndex === -1) {
      return;
    }

    const updated = [...orderedTiles];

    const [removedTile] = updated.splice(currentIndex, 1);

    let insertIndex = targetIndex;

    if (currentIndex < targetIndex) {
      insertIndex--;
    }

    updated.splice(insertIndex, 0, removedTile);

    setOrderedTiles(updated);
    onOrderChange(updated);

    setSelectedTile(null);
  };

  return (
    <View style={styles.row} onLayout={handleLayout}>
      {tileWidth > 0 && (
        <>
          {/* First insertion point */}
          <DropZone
            active={selectedTile !== null}
            onPress={() => moveTileToPosition(0)}
          />

          {orderedTiles.map((tile, index) => (
            <React.Fragment key={tile.id}>
              <Tile
                tile={tile}
                width={tileWidth}
                isSelected={selectedTile?.id === tile.id}
                onPress={() => handleTilePress(tile)}
              />

              <DropZone
                active={selectedTile !== null}
                onPress={() => moveTileToPosition(index + 1)}
              />
            </React.Fragment>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    flexWrap: "nowrap",
  },

  tile: {
    height: TILE_HEIGHT,

    borderRadius: 7,

    justifyContent: "center",
    alignItems: "center",

    marginHorizontal: TILE_GAP / 2,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowRadius: 6,

    overflow: "hidden",
  },

  dropZone: {
    width: DROP_ZONE_WIDTH,
    height: TILE_HEIGHT,
    borderRadius: 4,
  },

  activeDropZone: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  lockDot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    backgroundColor: "rgba(255,255,255,0.55)",

    alignSelf: "center",
    marginTop: TILE_HEIGHT / 2 - 3,
  },
});
