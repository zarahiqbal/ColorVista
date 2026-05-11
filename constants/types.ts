// types.ts

export interface HueTile {
  id: string;
  color: string;       // hex color string
  correctIndex: number; // 0-based position in the correct sequence
  isLocked: boolean;   // first and last tiles
}

export interface HueRow {
  rowId: string;
  label: string;        // e.g. "Teal → Cyan"
  tiles: HueTile[];    // full ordered sequence (10 tiles)
}

export interface RowResult {
  rowId: string;
  label: string;
  errorScore: number;         // raw positional error
  tritanScore: number;        // weighted score emphasizing blue-yellow errors
  userOrder: string[];        // tile ids in user's submitted order
  correctOrder: string[];     // tile ids in correct order
}

export interface TestResult {
  totalErrorScore: number;
  totalTritanScore: number;
  rowResults: RowResult[];
  tritanopiaLikelihood: 'Low' | 'Moderate' | 'High';
  completedAt: string;        // ISO timestamp
}

// Navigation param types — merge into your existing RootStackParamList
export type HueTestParamList = {
  HueTest: undefined;
  Result: { testResult: TestResult };
};