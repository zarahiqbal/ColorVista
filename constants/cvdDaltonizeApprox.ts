/**
 * Client-side mirror of server.py `_daltonize` / Viénot–Brettel matrices.
 * Used to document / validate VR overlay tuning; full daltonisation still requires
 * per-pixel processing (server or GPU).
 */

export type CvdDaltonizeMode = "protanopia" | "deuteranopia" | "tritanopia";

/** Same as `apply_cvd_enhancement_live(..., boost=1.35)` in server/server.py */
export const DALTON_LIVE_BOOST = 1.35 as const;

/** Same rows as `_CVD_SIM` in server/server.py */
const CVD_SIM: Record<CvdDaltonizeMode, readonly [readonly number[], readonly number[], readonly number[]]> = {
  protanopia: [
    [0.56667, 0.43333, 0.0],
    [0.55833, 0.44167, 0.0],
    [0.0, 0.24167, 0.75833],
  ],
  deuteranopia: [
    [0.625, 0.375, 0.0],
    [0.7, 0.3, 0.0],
    [0.0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0.0],
    [0.0, 0.433, 0.567],
    [0.0, 0.475, 0.525],
  ],
};

function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

function matVec(
  m: readonly [readonly number[], readonly number[], readonly number[]],
  r: number,
  g: number,
  b: number,
): [number, number, number] {
  return [
    m[0][0] * r + m[0][1] * g + m[0][2] * b,
    m[1][0] * r + m[1][1] * g + m[1][2] * b,
    m[2][0] * r + m[2][1] * g + m[2][2] * b,
  ];
}

/**
 * Daltonise one sRGB-ish triplet [0–255]. Matches `_daltonize` in server.py.
 */
export function daltonizeRgb(
  r: number,
  g: number,
  b: number,
  mode: CvdDaltonizeMode,
  boost: number,
): [number, number, number] {
  const mat = CVD_SIM[mode];
  const sim = matVec(mat, r, g, b);
  const er0 = r - sim[0];
  const er1 = g - sim[1];
  const er2 = b - sim[2];

  let cr = 0;
  let cg = 0;
  let cb = 0;
  if (mode === "protanopia" || mode === "deuteranopia") {
    cg = (er0 * 0.75 + er1) * boost;
    cb = (er0 * 0.75 + er2) * boost;
  } else {
    cr = (er0 + er2 * 0.75) * boost;
    cg = (er1 + er2 * 0.75) * boost;
  }

  return [clamp(r + cr, 0, 255), clamp(g + cg, 0, 255), clamp(b + cb, 0, 255)];
}

/** Standard source-over: one opaque tint RGB with scalar alpha */
export function compositeTint(
  r: number,
  g: number,
  b: number,
  tr: number,
  tg: number,
  tb: number,
  alpha: number,
): [number, number, number] {
  const ia = 1 - alpha;
  return [ia * r + alpha * tr, ia * g + alpha * tg, ia * b + alpha * tb];
}
