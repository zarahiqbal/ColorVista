// colorData.ts
// Farnsworth-Munsell inspired hue sequences targeting Tritanopia detection.
// Each row has exactly 10 tiles; first (index 0) and last (index 9) are locked.
// Colors deliberately chosen from blue-yellow confusion axes.

import { HueRow } from '../constants/types';

/**
 * Row 1 — Teal → Cyan transition
 * Tritanopes confuse teal/cyan with grey or pink in this axis.
 */
const row1: HueRow = {
  rowId: 'row_1',
  label: 'Teal → Cyan',
  tiles: [
    { id: 'r1_t0',  color: '#3D8C8C', correctIndex: 0, isLocked: true  },
    { id: 'r1_t1',  color: '#3D9999', correctIndex: 1, isLocked: false },
    { id: 'r1_t2',  color: '#3DA6A6', correctIndex: 2, isLocked: false },
    { id: 'r1_t3',  color: '#3DB3B3', correctIndex: 3, isLocked: false },
    { id: 'r1_t4',  color: '#3DC0BF', correctIndex: 4, isLocked: false },
    { id: 'r1_t5',  color: '#3DCCCC', correctIndex: 5, isLocked: false },
    { id: 'r1_t6',  color: '#3DD9D9', correctIndex: 6, isLocked: false },
    { id: 'r1_t7',  color: '#3DE6E6', correctIndex: 7, isLocked: false },
    { id: 'r1_t8',  color: '#3DF2F2', correctIndex: 8, isLocked: false },
    { id: 'r1_t9',  color: '#3DFFFF', correctIndex: 9, isLocked: true  },
  ],
};

/**
 * Row 2 — Olive → Yellow-Green transition
 * Tritanopes often confuse olive-yellow with blue-grey.
 */
const row2: HueRow = {
  rowId: 'row_2',
  label: 'Olive → Yellow-Green',
  tiles: [
    { id: 'r2_t0',  color: '#6B7C2A', correctIndex: 0, isLocked: true  },
    { id: 'r2_t1',  color: '#728533', correctIndex: 1, isLocked: false },
    { id: 'r2_t2',  color: '#7A8E3C', correctIndex: 2, isLocked: false },
    { id: 'r2_t3',  color: '#829745', correctIndex: 3, isLocked: false },
    { id: 'r2_t4',  color: '#8AA04E', correctIndex: 4, isLocked: false },
    { id: 'r2_t5',  color: '#92A957', correctIndex: 5, isLocked: false },
    { id: 'r2_t6',  color: '#9AB260', correctIndex: 6, isLocked: false },
    { id: 'r2_t7',  color: '#A2BB69', correctIndex: 7, isLocked: false },
    { id: 'r2_t8',  color: '#AAC472', correctIndex: 8, isLocked: false },
    { id: 'r2_t9',  color: '#B2CC7B', correctIndex: 9, isLocked: true  },
  ],
};

/**
 * Row 3 — Blue → Turquoise transition
 * Core blue-yellow confusion axis for Tritanopia.
 */
const row3: HueRow = {
  rowId: 'row_3',
  label: 'Blue → Turquoise',
  tiles: [
    { id: 'r3_t0',  color: '#2B7FBF', correctIndex: 0, isLocked: true  },
    { id: 'r3_t1',  color: '#2B8EBF', correctIndex: 1, isLocked: false },
    { id: 'r3_t2',  color: '#2B9DBF', correctIndex: 2, isLocked: false },
    { id: 'r3_t3',  color: '#2BAABF', correctIndex: 3, isLocked: false },
    { id: 'r3_t4',  color: '#2BB8BF', correctIndex: 4, isLocked: false },
    { id: 'r3_t5',  color: '#2BBFBA', correctIndex: 5, isLocked: false },
    { id: 'r3_t6',  color: '#2BBFAD', correctIndex: 6, isLocked: false },
    { id: 'r3_t7',  color: '#2BBFA0', correctIndex: 7, isLocked: false },
    { id: 'r3_t8',  color: '#2CBF93', correctIndex: 8, isLocked: false },
    { id: 'r3_t9',  color: '#2DBF86', correctIndex: 9, isLocked: true  },
  ],
};

/**
 * Row 4 — Violet → Pink transition
 * Short-wavelength (S-cone) confusion axis — highly diagnostic for Tritanopia.
 */
const row4: HueRow = {
  rowId: 'row_4',
  label: 'Violet → Pink',
  tiles: [
    { id: 'r4_t0',  color: '#7B68C8', correctIndex: 0, isLocked: true  },
    { id: 'r4_t1',  color: '#8968C4', correctIndex: 1, isLocked: false },
    { id: 'r4_t2',  color: '#9768BF', correctIndex: 2, isLocked: false },
    { id: 'r4_t3',  color: '#A568B9', correctIndex: 3, isLocked: false },
    { id: 'r4_t4',  color: '#B268B3', correctIndex: 4, isLocked: false },
    { id: 'r4_t5',  color: '#BF68AE', correctIndex: 5, isLocked: false },
    { id: 'r4_t6',  color: '#BF68A2', correctIndex: 6, isLocked: false },
    { id: 'r4_t7',  color: '#C26896', correctIndex: 7, isLocked: false },
    { id: 'r4_t8',  color: '#C5688A', correctIndex: 8, isLocked: false },
    { id: 'r4_t9',  color: '#C8687E', correctIndex: 9, isLocked: true  },
  ],
};

export const HUE_ROWS: HueRow[] = [row1, row2, row3, row4];

/**
 * Weights for each row in Tritan scoring.
 * Rows 3 & 4 are the most diagnostically relevant for Tritanopia.
 */
export const TRITAN_ROW_WEIGHTS: Record<string, number> = {
  row_1: 1.0,
  row_2: 0.8,
  row_3: 1.5,
  row_4: 1.5,
};