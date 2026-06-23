// colorData.ts
// Tritan-focused hue transitions based on the Farnsworth-Munsell 100 Hue Test
// Each row uses hue progressions most relevant to Tritanopia (blue-yellow axis)

import { RowData } from './Types';

/**
 * Generates a linear interpolation between two hex colors across N steps.
 */
function lerpHex(hex1: string, hex2: string, steps: number): string[] {
  const parse = (h: string) => {
    const v = h.replace('#', '');
    return [
      parseInt(v.slice(0, 2), 16),
      parseInt(v.slice(2, 4), 16),
      parseInt(v.slice(4, 6), 16),
    ];
  };
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');

  const [r1, g1, b1] = parse(hex1);
  const [r2, g2, b2] = parse(hex2);

  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    const r = r1 + (r2 - r1) * t;
    const g = g1 + (g2 - g1) * t;
    const b = b1 + (b2 - b1) * t;
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  });
}

/**
 * Builds a RowData object from two endpoint colors.
 * Tiles 0 and 9 are locked; tiles 1–8 are the shuffleable middle.
 */
function buildRow(
  rowId: number,
  startColor: string,
  endColor: string,
  description: string,
  tritanWeight: number
): RowData {
  const colors = lerpHex(startColor, endColor, 10);

  const tiles = colors.map((color, index) => ({
    id: `row${rowId}_tile${index}`,
    color,
    correctIndex: index,
    isLocked: index === 0 || index === 9,
  }));

  return { rowId, tiles, description, tritanWeight };
}

/**
 * The four test rows, each targeting a different Tritan-sensitive hue transition.
 * tritanWeight > 1.0 emphasizes rows where blue-yellow confusion is most diagnostic.
 */
export const TEST_ROWS: RowData[] = [
  // Row 1: Teal → Cyan (high Tritan relevance — blue-green confusion)
  buildRow(0, '#00897B', '#00E5FF', 'Teal → Cyan', 1.8),

  // Row 2: Blue → Turquoise (core Tritan axis — blue-green transition)
  buildRow(1, '#1565C0', '#00BCD4', 'Blue → Turquoise', 2.0),

  // Row 3: Blue-Green → Aqua (moderate Tritan relevance)
  buildRow(2, '#006064', '#80DEEA', 'Blue-Green → Aqua', 1.5),

  // Row 4: Olive → Yellow-Green (yellow axis — Tritan confusion with blue-yellow)
  buildRow(3, '#827717', '#C6FF00', 'Olive → Yellow-Green', 1.6),
];

export const TOTAL_ROWS = TEST_ROWS.length;

/**
 * Returns a shuffled copy of the middle tiles (indices 1–8) for a row.
 * The locked endpoints (0 and 9) remain in place.
 * Retries up to 10 times to avoid accidentally producing a near-sorted result.
 */
export function getShuffledRow(row: RowData): RowData {
  const tiles = [...row.tiles];
  const middle = tiles.slice(1, 9);

  const isSorted = () =>
    middle.every((tile, i) => tile.correctIndex === i + 1);

  let attempts = 0;
  do {
    // Fisher-Yates shuffle
    for (let i = middle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [middle[i], middle[j]] = [middle[j], middle[i]];
    }
    attempts++;
  } while (attempts < 10 && isSorted());

  return {
    ...row,
    tiles: [tiles[0], ...middle, tiles[9]],
  };
}