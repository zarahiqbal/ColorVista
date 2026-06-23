/**
 * VR_CVD_DALTON_MATCHED_OVERLAY
 * ─────────────────────────────
 * Simulates the effect of EnChroma-style spectral notch-filter glasses using
 * stacked RGBA layers on a React Native camera view.
 *
 * HOW REAL CVD GLASSES WORK
 * ─────────────────────────
 * EnChroma / Pilestone / VINO glasses don't "add" color — they selectively
 * BLOCK a narrow band of wavelengths (~545–575 nm) that sits in the overlap
 * zone between M (green) and L (red) cones. Removing this overlap region
 * forces the brain to see a cleaner separation between red and green signals.
 *
 * RGBA LAYER TRANSLATION
 * ──────────────────────
 * We can't block wavelengths in software, but we can:
 *   1. Add a COMPLEMENTARY color to the confusion zone (opponent-color theory)
 *   2. Use multiple low-opacity layers that compose to shift hue perception
 *   3. Keep total opacity LOW so the real scene remains fully visible —
 *      the camera feed must be legible, not tinted like sunglasses.
 *
 * TARGET ALPHA BUDGET:
 *   Total cumulative alpha across all layers ≤ ~0.30 (sum of individual alphas)
 *   This keeps the overlay subtle while still shifting hue perception.
 *
 * LAYER ORDER: bottom → top (first renders below, last on top)
 */

export type CVDType = "deuteranopia" | "protanopia" | "tritanopia";

export interface OverlayLayer {
  key: string;
  backgroundColor: string; // rgba(r, g, b, alpha)
  baseAlpha: number;        // raw alpha at intensity = 1.0
}

export interface CVDOverlayConfig {
  a11yHint: string;
  layers: OverlayLayer[];
}

// ─────────────────────────────────────────────────────────────────────────────
// DEUTERANOPIA  — missing M-cones (green ~530 nm)
//
// Confusion: red ↔ green  (both look brownish-yellow)
// Notch fix: magenta (opponent of green) cuts the 545–575 nm M/L overlap zone
//   → forces cleaner M/L cone separation.
//   Cyan secondary lifts blue-channel so it doesn't bleed into shifted greens.
// ─────────────────────────────────────────────────────────────────────────────
const DEUTERANOPIA: CVDOverlayConfig = {
  a11yHint: "Deuteranopia lens active",
  layers: [
    // Primary notch: magenta opponent to green — narrows green cone overlap
    {
      key: "d_magenta_notch",
      backgroundColor: "rgba(210, 0, 110, 0.18)",
      baseAlpha: 0.18,
    },
    // Secondary: mild cyan lifts blue-channel separation from shifted greens
    {
      key: "d_cyan_sep",
      backgroundColor: "rgba(0, 185, 210, 0.08)",
      baseAlpha: 0.08,
    },
    // Tertiary: faint red warmth re-anchors reds against the magenta field
    {
      key: "d_red_anchor",
      backgroundColor: "rgba(255, 30, 0, 0.04)",
      baseAlpha: 0.04,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PROTANOPIA  — missing L-cones (red ~560–580 nm)
//
// Confusion: red ↔ green  (reds appear very dark / black; red-green collapse)
// Notch fix: cyan (opponent of red) acts as a notch against the long-wavelength
//   L/M overlap. Violet push re-introduces an artificial luminance cue for
//   the missing L channel via S-cone pathway.
// ─────────────────────────────────────────────────────────────────────────────
const PROTANOPIA: CVDOverlayConfig = {
  a11yHint: "Protanopia lens active",
  layers: [
    // Primary notch: cyan opponent to red — separates L/M overlap zone
    {
      key: "p_cyan_notch",
      backgroundColor: "rgba(0, 200, 195, 0.20)",
      baseAlpha: 0.20,
    },
    // Secondary: violet introduces S-cone path as proxy for missing L signal
    {
      key: "p_violet_proxy",
      backgroundColor: "rgba(110, 0, 210, 0.07)",
      baseAlpha: 0.07,
    },
    // Tertiary: warm yellow micro-boost keeps yellows distinct from boosted cyans
    {
      key: "p_yellow_anchor",
      backgroundColor: "rgba(255, 220, 0, 0.04)",
      baseAlpha: 0.04,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TRITANOPIA  — missing S-cones (blue ~430 nm)
//
// Confusion: blue ↔ green  |  yellow ↔ pink/violet
// Notch fix: amber-orange (opponent of blue) creates a notch against the
//   S/M overlap at ~490 nm. Violet push re-introduces short-wavelength cue
//   to simulate the missing S-cone signal.
// ─────────────────────────────────────────────────────────────────────────────
const TRITANOPIA: CVDOverlayConfig = {
  a11yHint: "Tritanopia lens active",
  layers: [
    // Primary notch: amber opponent to blue — cuts S/M overlap
    {
      key: "t_amber_notch",
      backgroundColor: "rgba(255, 150, 0, 0.17)",
      baseAlpha: 0.17,
    },
    // Secondary: violet re-introduces S-cone short-wavelength cue
    {
      key: "t_violet_scone",
      backgroundColor: "rgba(130, 0, 200, 0.09)",
      baseAlpha: 0.09,
    },
    // Tertiary: faint cyan to keep greens from merging with violet shift
    {
      key: "t_cyan_sep",
      backgroundColor: "rgba(0, 200, 180, 0.04)",
      baseAlpha: 0.04,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────
export const VR_CVD_DALTON_MATCHED_OVERLAY: Record<CVDType, CVDOverlayConfig> =
  {
    deuteranopia: DEUTERANOPIA,
    protanopia:   PROTANOPIA,
    tritanopia:   TRITANOPIA,
  };