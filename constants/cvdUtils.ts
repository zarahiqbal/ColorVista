export type CvdSimulation = "Protanopia" | "Deuteranopia" | "Tritanopia";
export type CvdSelection = CvdSimulation | "Combined";

const ALL_SIMULATIONS: CvdSimulation[] = [
  "Protanopia",
  "Deuteranopia",
  "Tritanopia",
];

export const isNormalVision = (cvdType?: string | null) => {
  if (!cvdType) return true;
  return /normal|none/i.test(cvdType);
};

export const extractCvdTypes = (cvdType?: string | null): CvdSimulation[] => {
  if (!cvdType) return [];
  const value = cvdType.toLowerCase();

  if (value.includes("severe") || value.includes("multiple")) {
    return [...ALL_SIMULATIONS];
  }

  const types: CvdSimulation[] = [];
  if (value.includes("protan")) types.push("Protanopia");
  if (value.includes("deuter")) types.push("Deuteranopia");
  if (value.includes("tritan")) types.push("Tritanopia");

  return Array.from(new Set(types));
};

export const getAllowedSimulations = (cvdType?: string | null) => {
  if (isNormalVision(cvdType)) {
    return { isNormal: true, types: [] as CvdSimulation[], allowCombined: false };
  }

  const extracted = extractCvdTypes(cvdType);
  const types = extracted.length ? extracted : ["Deuteranopia"];
  return {
    isNormal: false,
    types,
    allowCombined: types.length > 1,
  };
};

export const formatCvdLabel = (cvdType?: string | null) => {
  if (!cvdType) return "Normal Vision";
  if (isNormalVision(cvdType)) return "Normal Vision";
  return cvdType;
};
