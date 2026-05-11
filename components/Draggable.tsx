// DraggableHueRow.tsx
// Fix: drag trigger moved to TouchableOpacity (supports onLongPress correctly)

import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, LayoutChangeEvent } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { HueTile } from "../constants/types";

const TILE_HEIGHT = 56;
const TILE_GAP    = 3;

interface DraggableHueRowProps {
  tiles: HueTile[];
  onOrderChange: (newTiles: HueTile[]) => void;
}

// ─── Single Tile ──────────────────────────────────────────────────────────────

interface TileItemProps extends RenderItemParams<HueTile> {
  tileWidth: number;
}

const TileItem: React.FC<TileItemProps> = ({ item, drag, isActive, tileWidth }) => {
  return (
    <ScaleDecorator activeScale={1.08}>
      <TouchableOpacity
        activeOpacity={1}
        onLongPress={item.isLocked ? undefined : drag}
        delayLongPress={0}
        disabled={item.isLocked}
        style={[
          styles.tile,
          {
            width:           tileWidth,
            height:          TILE_HEIGHT,
            backgroundColor: item.color,
            borderColor:     item.isLocked
              ? "rgba(0,0,0,0.5)"
              : "rgba(255,255,255,0.3)",
            borderWidth:  item.isLocked ? 2.5 : 1,
            borderRadius: 6,
          },
          isActive && styles.tileActive,
        ]}
      >
        {item.isLocked && <View style={styles.lockDot} />}
      </TouchableOpacity>
    </ScaleDecorator>
  );
};

// ─── Row ──────────────────────────────────────────────────────────────────────

const DraggableHueRow: React.FC<DraggableHueRowProps> = ({
  tiles,
  onOrderChange,
}) => {
  const [data, setData]            = useState<HueTile[]>(tiles);
  const [containerWidth, setWidth] = useState(0);

  useEffect(() => {
    setData(tiles);
  }, [tiles]);

  const tileWidth =
    containerWidth > 0
      ? (containerWidth - TILE_GAP * (tiles.length - 1)) / tiles.length
      : 0;

  const handleLayout = (e: LayoutChangeEvent) =>
    setWidth(e.nativeEvent.layout.width);

  const renderItem = useCallback(
    (params: RenderItemParams<HueTile>) => (
      <TileItem {...params} tileWidth={tileWidth} />
    ),
    [tileWidth]
  );

  const handleDragEnd = useCallback(
    ({ data: newData }: { data: HueTile[] }) => {
      const corrected = [...newData];
      const origFirst = tiles[0];
      const origLast  = tiles[tiles.length - 1];

      // Restore locked first tile
      const firstIdx = corrected.findIndex(t => t.id === origFirst.id);
      if (firstIdx !== 0) {
        [corrected[0], corrected[firstIdx]] = [corrected[firstIdx], corrected[0]];
      }

      // Restore locked last tile
      const end        = corrected.length - 1;
      const newLastIdx = corrected.findIndex(t => t.id === origLast.id);
      if (newLastIdx !== end) {
        [corrected[end], corrected[newLastIdx]] = [corrected[newLastIdx], corrected[end]];
      }

      setData(corrected);
      onOrderChange(corrected);
    },
    [tiles, onOrderChange]
  );

  if (tileWidth === 0) {
    return <View onLayout={handleLayout} />;
  }

  return (
    <View onLayout={handleLayout}>
      <DraggableFlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onDragEnd={handleDragEnd}
        horizontal
        scrollEnabled={false}
        activationDistance={1}
        ItemSeparatorComponent={() => <View style={{ width: TILE_GAP }} />}
        containerStyle={styles.flatList}
      />
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flatList: {
    paddingVertical: 8,
    overflow: "visible",
  },
  tile: {
    alignItems:     "center",
    justifyContent: "center",
    shadowColor:    "#000",
    shadowOffset:   { width: 0, height: 2 },
    shadowOpacity:  0,
    shadowRadius:   4,
    elevation:      0,
  },
  tileActive: {
    shadowOpacity: 0.3,
    shadowRadius:  12,
    shadowOffset:  { width: 0, height: 8 },
    elevation:     12,
  },
  lockDot: {
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
});

export default DraggableHueRow;