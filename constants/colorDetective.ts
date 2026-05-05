export type DetectiveShape = "circle" | "square" | "triangle" | "hex";
export type DetectivePattern = "solid" | "stripes" | "dots";

export interface DetectiveColor {
  name: string;
  hex: string;
}

export interface DetectiveObject {
  id: string;
  shape: DetectiveShape;
  pattern: DetectivePattern;
  color: DetectiveColor;
  rotation: number;
  scale: number;
  borderWidth: number;
  stripeGap: number;
  dotRadius: number;
}

export interface DetectiveRound {
  objects: DetectiveObject[];
  oddId: string;
  timeLimit: number;
  level: number;
}

export interface DetectiveRoundOptions {
  accessibilityMode?: "normal" | "colorblind";
}

const SHAPES: DetectiveShape[] = ["circle", "square", "triangle", "hex"];
const PATTERNS: DetectivePattern[] = ["solid", "stripes", "dots"];
const COLORS: DetectiveColor[] = [
  { name: "Sky", hex: "#56B4E9" },
  { name: "Orange", hex: "#E69F00" },
  { name: "Green", hex: "#009E73" },
  { name: "Vermillion", hex: "#D55E00" },
  { name: "Purple", hex: "#CC79A7" },
  { name: "Yellow", hex: "#F0E442" },
];

const randomItem = <T,>(items: T[]) =>
  items[Math.floor(Math.random() * items.length)];

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const pickDifferent = <T,>(items: T[], current: T) => {
  const choices = items.filter((item) => item !== current);
  return choices.length ? randomItem(choices) : current;
};

export const createDetectiveRound = (
  level: number,
  options: DetectiveRoundOptions = {},
): DetectiveRound => {
  const { accessibilityMode = "normal" } = options;
  const count = Math.min(8, 4 + Math.floor(level / 2));
  const timeLimit = Math.max(7, 15 - level);

  const baseShape = randomItem(SHAPES);
  const basePattern = randomItem(PATTERNS);
  const baseColor = randomItem(COLORS);
  const baseObject: DetectiveObject = {
    id: "base",
    shape: baseShape,
    pattern: basePattern,
    color: baseColor,
    rotation: 0,
    scale: 1,
    borderWidth: 3,
    stripeGap: 8,
    dotRadius: 3,
  };

  const oddObject: DetectiveObject = {
    ...baseObject,
    id: "odd",
    color: pickDifferent(COLORS, baseColor),
  };

  const enforcePatternDifference = accessibilityMode === "colorblind";

  if (level <= 2) {
    if (enforcePatternDifference) {
      oddObject.pattern = pickDifferent(PATTERNS, basePattern);
    }
  } else if (level <= 4) {
    oddObject.pattern = pickDifferent(PATTERNS, basePattern);
  } else {
    const tweak = randomItem(["border", "rotation", "scale", "stripe", "dot"] as const);
    switch (tweak) {
      case "border":
        oddObject.borderWidth = baseObject.borderWidth + 2;
        break;
      case "rotation":
        oddObject.rotation = 0.3;
        break;
      case "scale":
        oddObject.scale = 0.9;
        break;
      case "stripe":
        oddObject.stripeGap = baseObject.stripeGap + 3;
        break;
      case "dot":
      default:
        oddObject.dotRadius = baseObject.dotRadius + 1;
        break;
    }
  }

  if (enforcePatternDifference && oddObject.pattern === basePattern) {
    oddObject.pattern = pickDifferent(PATTERNS, basePattern);
  }

  const objects = shuffle(
    Array.from({ length: count }, (_, index) => ({
      ...baseObject,
      id: `base-${index}`,
    })).map((object) => ({ ...object })),
  );

  const oddIndex = Math.floor(Math.random() * objects.length);
  objects[oddIndex] = { ...oddObject, id: "odd" };

  return {
    objects,
    oddId: "odd",
    timeLimit,
    level,
  };
};
