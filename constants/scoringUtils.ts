// scoringUtils.ts
// Farnsworth-Munsell style positional error scoring adapted for Tritanopia detection.

import { HueTile, RowResult, TestResult } from '../constants/types';
import { TRITAN_ROW_WEIGHTS } from './colorData';

/**
 * Shuffles only the draggable (non-locked) tiles in a row,
 * keeping the first and last tile in place.
 */
export function shuffleDraggableTiles(tiles: HueTile[]): HueTile[] {
  const result = [...tiles];
  // Indices of draggable tiles (1 through length-2)
  const draggableIndices = result
    .map((_, i) => i)
    .filter(i => !result[i].isLocked);

  // Fisher-Yates shuffle on the draggable subset
  const draggableItems = draggableIndices.map(i => result[i]);
  for (let i = draggableItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [draggableItems[i], draggableItems[j]] = [draggableItems[j], draggableItems[i]];
  }

  draggableIndices.forEach((idx, i) => {
    result[idx] = draggableItems[i];
  });

  return result;
}

/**
 * Calculates the Farnsworth-Munsell total error score for a single row.
 *
 * Algorithm:
 *  For each tile at position p (1 through N-2), compare its neighbours.
 *  Error = |correctIndex(left) - correctIndex(tile)| + |correctIndex(tile) - correctIndex(right)|
 *  minus the expected value of 2 (perfect neighbours differ by 1 each).
 *  Sum all positive deviations.
 */
export function calculateRowError(userOrderedTiles: HueTile[]): number {
  let totalError = 0;
  const n = userOrderedTiles.length;

  // Skip first and last (they're always correct anchors)
  for (let p = 1; p < n - 1; p++) {
    const leftIdx  = userOrderedTiles[p - 1].correctIndex;
    const currIdx  = userOrderedTiles[p].correctIndex;
    const rightIdx = userOrderedTiles[p + 1].correctIndex;

    // Ideal difference from each neighbour is exactly 1
    const leftDiff  = Math.abs(currIdx - leftIdx);
    const rightDiff = Math.abs(rightIdx - currIdx);

    // Error contribution: deviation above the ideal of (1+1)=2
    const contribution = Math.max(0, leftDiff + rightDiff - 2);
    totalError += contribution;
  }

  return totalError;
}

/**
 * Calculates a Tritanopia-weighted score for a row.
 * Errors in the critical blue-yellow axis are weighted higher.
 */
export function calculateTritanScore(
  userOrderedTiles: HueTile[],
  rowId: string
): number {
  const rawError = calculateRowError(userOrderedTiles);
  const weight = TRITAN_ROW_WEIGHTS[rowId] ?? 1.0;
  return rawError * weight;
}

/**
 * Builds a RowResult from the user's submitted tile order.
 */
export function buildRowResult(
  rowId: string,
  label: string,
  userOrderedTiles: HueTile[]
): RowResult {
  const errorScore  = calculateRowError(userOrderedTiles);
  const tritanScore = calculateTritanScore(userOrderedTiles, rowId);

  const correctlySorted = [...userOrderedTiles].sort(
    (a, b) => a.correctIndex - b.correctIndex
  );

  return {
    rowId,
    label,
    errorScore,
    tritanScore,
    userOrder:    userOrderedTiles.map(t => t.id),
    correctOrder: correctlySorted.map(t => t.id),
  };
}

/**
 * Aggregates all row results into the final TestResult.
 * Tritanopia likelihood thresholds are calibrated for the 4-row, 8-draggable-tile version.
 *
 * Maximum possible raw error per row ≈ 56 (worst case with 8 draggable tiles).
 * Max weighted total ≈ 56*(1.0+0.8+1.5+1.5) = 56*4.8 = 268.8
 *
 * Thresholds (empirically derived for this shortened test):
 *   Low      : tritanTotal < 30
 *   Moderate : 30 ≤ tritanTotal < 80
 *   High     : tritanTotal ≥ 80
 */
export function buildTestResult(rowResults: RowResult[]): TestResult {
  const totalErrorScore = rowResults.reduce((s, r) => s + r.errorScore,  0);
  const totalTritanScore = rowResults.reduce((s, r) => s + r.tritanScore, 0);

  let tritanopiaLikelihood: TestResult['tritanopiaLikelihood'];
  if (totalTritanScore < 30) {
    tritanopiaLikelihood = 'Low';
  } else if (totalTritanScore < 80) {
    tritanopiaLikelihood = 'Moderate';
  } else {
    tritanopiaLikelihood = 'High';
  }

  return {
    totalErrorScore,
    totalTritanScore,
    rowResults,
    tritanopiaLikelihood,
    completedAt: new Date().toISOString(),
  };
}