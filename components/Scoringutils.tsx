// scoringUtils.ts
// Scoring logic inspired by the Farnsworth-Munsell 100 Hue Test methodology.
// Computes positional error, per-tile displacement, and Tritan-weighted scores.

import { ColorTile, RowData, RowResult, TestResult } from "./Types";

/**
 * Calculates the error score for a single row.
 *
 * FM-100 methodology: for each tile, compare its neighbors in the user's
 * arrangement vs the correct arrangement. A perfect sequence scores 0.
 *
 * We use a simplified positional displacement metric:
 *   - For each middle tile (1–8), compute |userPosition - correctPosition|
 *   - Sum all displacements = raw row score
 *
 * Lower score = better performance.
 */
export function scoreRow(
  userTiles: ColorTile[],
  row: RowData,
): { rowScore: number; perTileErrors: number[] } {
  const perTileErrors: number[] = [];

  for (let i = 0; i < userTiles.length; i++) {
    const tile = userTiles[i];
    const correctPosition = tile.correctIndex;
    const userPosition = i;
    const error = Math.abs(userPosition - correctPosition);
    perTileErrors.push(error);
  }

  // Only count errors for the shuffleable middle tiles (indices 1–8)
  const middleErrors = perTileErrors.slice(1, 9);
  const rowScore = middleErrors.reduce((sum, e) => sum + e, 0);

  return { rowScore, perTileErrors };
}

/**
 * Calculates the total test result from all row results.
 *
 * tritanWeightedScore applies row-specific weights that emphasize
 * hue transitions most diagnostic for Tritanopia.
 */
export function calculateTestResult(
  rowResults: RowResult[],
  rows: RowData[],
): TestResult {
  const rowScores = rowResults.map((r) => r.rowScore);

  const totalScore = rowScores.reduce((sum, s) => sum + s, 0);

  const tritanWeightedScore = rowResults.reduce((sum, result, index) => {
    const weight = rows[index]?.tritanWeight ?? 1.0;
    return sum + result.rowScore * weight;
  }, 0);

  return {
    totalScore,
    rowScores,
    tritanWeightedScore,
    rowResults,
  };
}

/**
 * Builds a RowResult object from the user's submitted tile arrangement.
 */
export function buildRowResult(
  userTiles: ColorTile[],
  row: RowData,
): RowResult {
  const { rowScore, perTileErrors } = scoreRow(userTiles, row);

  const userArrangement = userTiles.map((t) => t.correctIndex);
  const correctArrangement = row.tiles
    .slice()
    .sort((a, b) => a.correctIndex - b.correctIndex)
    .map((t) => t.correctIndex);

  return {
    rowId: row.rowId,
    userArrangement,
    correctArrangement,
    rowScore,
    perTileErrors,
  };
}

/**
 * Interprets a tritanWeightedScore for clinical feedback.
 *
 * Score range context:
 *   - Perfect arrangement     → 0
 *   - Minor errors            → 1–8
 *   - Mild deficiency range   → 9–24
 *   - Moderate deficiency     → 25–52
 *   - Strong deficiency       → 53+
 *
 * With 8 shuffleable tiles × 4 rows, a fully random arrangement
 * averages ~64 raw score, weighted to ~108. Thresholds are spread
 * accordingly so "Normal" is only returned for genuinely good performance.
 */
export function interpretScore(tritanWeightedScore: number): string {
  if (tritanWeightedScore === 0) return "Perfect score — Normal color vision";
  if (tritanWeightedScore <= 8) return "Normal color vision";
  if (tritanWeightedScore <= 24) return "Mild Tritan-axis difficulty";
  if (tritanWeightedScore <= 52) return "Moderate Tritan-axis deficiency";
  return "Strong Tritan-axis deficiency likely";
}
