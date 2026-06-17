// types.ts

export interface ColorTile {
  id: string;
  color: string; // hex color string
  correctIndex: number; // 0-based position in the correct sequence
  isLocked: boolean;
}

export interface RowData {
  rowId: number;
  tiles: ColorTile[]; // 10 tiles total
  description: string; // e.g. "Teal → Cyan"
  tritanWeight: number; // weighting multiplier for scoring (1.0–2.0)
}

export interface RowResult {
  rowId: number;
  userArrangement: number[]; // correctIndex values in user order
  correctArrangement: number[]; // expected correctIndex order
  rowScore: number;
  perTileErrors: number[];
}

export interface TestResult {
  totalScore: number;
  rowScores: number[];
  tritanWeightedScore: number;
  rowResults: RowResult[];
}

export type TilePosition = number; // 0-based index in the 10-tile row

export interface SwapAnimation {
  fromIndex: number;
  toIndex: number;
}