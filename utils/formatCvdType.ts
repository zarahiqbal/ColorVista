/**
 * Converts the stored `cvdType` value into a human-readable label.
 *
 * Storage is canonical JSON: { hasRedGreen: boolean, hasTritan: boolean }.
 * This helper also tolerates older "legacy" prose values that may still
 * exist on accounts created before the JSON format was introduced.
 *
 * Use this ONLY for display. Logic screens (VRScreen, EnhancerScreen)
 * should keep parsing the raw JSON themselves.
 */
export function formatCvdType(raw?: string | null): string {
  if (!raw) return "Not tested";

  let hasRedGreen = false;
  let hasTritan = false;

  try {
    const parsed = JSON.parse(String(raw));
    hasRedGreen = !!parsed.hasRedGreen;
    hasTritan = !!parsed.hasTritan;
  } catch {
    // Legacy fallback for older prose labels.
    const s = String(raw).toLowerCase();
    if (s.includes("normal")) return "Normal Color Vision";
    hasRedGreen =
      s.includes("red-green") ||
      s.includes("protan") ||
      s.includes("deutan");
    hasTritan = s.includes("tritan") || s.includes("blue-yellow");
  }

  if (hasRedGreen && hasTritan) return "Red-Green & Blue-Yellow Deficiency";
  if (hasRedGreen) return "Red-Green Deficiency";
  if (hasTritan) return "Blue-Yellow (Tritan) Deficiency";
  return "Normal Color Vision";
}