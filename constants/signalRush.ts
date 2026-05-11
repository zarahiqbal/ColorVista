// Signal Rush — CVD-aware "traffic coach" trainer.
// The player is given a target color BY NAME (e.g. "Tap the GREEN
// light") and must pick the matching signal among a row of colored
// lights. Distractors are pulled from the same confusion line as the
// target so the user actively practises distinguishing the colors
// they confuse most.

export type CvdType = "normal" | "protanopia" | "deuteranopia" | "tritanopia";
export type SignalCategory = "safe" | "caution" | "danger";
export type SignalShape = "circle" | "square" | "diamond" | "hex" | "triangle";
export type SignalIcon = "check" | "exclamation" | "cross" | "arrow";

// Re-exported so existing app code that imports these types keeps
// compiling. They're no longer used to drive the gameplay logic.
export interface SignalDefinition {
  id: string;
  category: SignalCategory;
  shape: SignalShape;
  icon: SignalIcon;
  label: string;
}

export interface SignalColor {
  id: string;
  name: string;
  // Color shown to the user.
  hex: string;
  // Daltonized variant used by the Boost hint.
  boostHex: string;
  // Coarse hue family used to build confusable distractor sets.
  family:
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "teal"
    | "blue"
    | "purple"
    | "pink"
    | "brown"
    | "gray";
  // Real-world meaning of this color in a traffic / signage context,
  // shown after a correct answer to reinforce learning.
  meaning: string;
}

export interface SignalLight {
  // Unique slot id.
  id: string;
  color: SignalColor;
}

export interface SignalRound {
  level: number;
  target: SignalColor;
  lights: SignalLight[];
  timeLimit: number;
  // Localised prompt, e.g. "Tap the RED light".
  question: string;
}

export interface SignalRoundOptions {
  cvdType?: CvdType;
}

const COLOR_DECK: SignalColor[] = [
  {
    id: "red",
    name: "Red",
    hex: "#E63946",
    boostHex: "#FF0033",
    family: "red",
    meaning: "Stop / Danger",
  },
  {
    id: "amber",
    name: "Amber",
    hex: "#F4A261",
    boostHex: "#FF8800",
    family: "orange",
    meaning: "Caution / Slow down",
  },
  {
    id: "yellow",
    name: "Yellow",
    hex: "#F1E15B",
    boostHex: "#FFE600",
    family: "yellow",
    meaning: "Warning",
  },
  {
    id: "green",
    name: "Green",
    hex: "#2A9D8F",
    boostHex: "#00C66B",
    family: "green",
    meaning: "Go / Safe",
  },
  {
    id: "olive",
    name: "Olive",
    hex: "#9AA257",
    boostHex: "#8FBF3F",
    family: "green",
    meaning: "Caution (military / utility)",
  },
  {
    id: "blue",
    name: "Blue",
    hex: "#2D5BAF",
    boostHex: "#1845CF",
    family: "blue",
    meaning: "Information / Mandatory",
  },
  {
    id: "purple",
    name: "Purple",
    hex: "#7B3FA8",
    boostHex: "#8A2BE2",
    family: "purple",
    meaning: "Radiation / Special hazard",
  },
  {
    id: "pink",
    name: "Pink",
    hex: "#E477A6",
    boostHex: "#FF4D9D",
    family: "pink",
    meaning: "Temporary / Construction",
  },
  {
    id: "brown",
    name: "Brown",
    hex: "#8B5A2B",
    boostHex: "#A0522D",
    family: "brown",
    meaning: "Recreational / Cultural",
  },
];

const CONFUSION_PAIRS: Record<CvdType, [SignalColor["family"], SignalColor["family"]][]> = {
  normal: [
    ["red", "orange"],
    ["blue", "purple"],
  ],
  protanopia: [
    ["red", "green"],
    ["red", "brown"],
    ["orange", "yellow"],
    ["purple", "blue"],
    ["pink", "orange"],
  ],
  deuteranopia: [
    ["red", "green"],
    ["green", "brown"],
    ["green", "yellow"],
    ["purple", "blue"],
    ["pink", "orange"],
  ],
  tritanopia: [
    ["blue", "green"],
    ["yellow", "pink"],
    ["purple", "red"],
  ],
};

const shuffle = <T,>(items: T[]): T[] => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const buildDistractors = (
  target: SignalColor,
  cvdType: CvdType,
  level: number,
  count: number,
): SignalColor[] => {
  const pairs = CONFUSION_PAIRS[cvdType] || CONFUSION_PAIRS.normal;
  const confusableFamilies = new Set<string>();
  pairs.forEach(([a, b]) => {
    if (a === target.family) confusableFamilies.add(b);
    if (b === target.family) confusableFamilies.add(a);
  });

  const confusable = COLOR_DECK.filter(
    (c) => c.id !== target.id && confusableFamilies.has(c.family),
  );
  const easy = COLOR_DECK.filter(
    (c) => c.id !== target.id && !confusableFamilies.has(c.family) && c.family !== target.family,
  );

  // Higher level → mostly confusables. Lower level → mostly easy.
  const confusableTarget = Math.min(count, Math.max(1, Math.floor(level / 2)));
  const confusablePicks = shuffle(confusable).slice(0, Math.min(confusableTarget, confusable.length));
  const easyPicks = shuffle(easy).slice(0, count - confusablePicks.length);
  return shuffle([...confusablePicks, ...easyPicks]);
};

export const createSignalRound = (
  level: number,
  options: SignalRoundOptions = {},
): SignalRound => {
  const cvdType: CvdType = (options.cvdType as CvdType) || "normal";
  const lightCount = Math.min(6, 3 + Math.floor(level / 2));
  const timeLimit = Math.max(5, 11 - Math.floor(level / 2));

  const target = pick(COLOR_DECK);
  const distractors = buildDistractors(target, cvdType, level, lightCount - 1);

  const lights: SignalLight[] = shuffle([target, ...distractors]).map((color, index) => ({
    id: `light-${index}-${color.id}`,
    color,
  }));

  const question = `Tap the ${target.name.toUpperCase()} light`;

  return { level, target, lights, timeLimit, question };
};

export const describeConfusionPairs = (cvdType: CvdType): string[] => {
  const pairs = CONFUSION_PAIRS[cvdType] || CONFUSION_PAIRS.normal;
  return pairs.slice(0, 3).map(([a, b]) => `${capitalize(a)} ↔ ${capitalize(b)}`);
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// --- Legacy helpers kept for backward-compat with anything still
// importing the old shape-based API. The new gameplay no longer relies
// on them, but exporting stubs prevents callers from breaking.

const LEGACY_PALETTES: Record<CvdType, Record<SignalCategory, { fill: string; stroke: string }>> = {
  normal: {
    safe: { fill: "#2A9D8F", stroke: "#1F6F65" },
    caution: { fill: "#F4A261", stroke: "#C2410C" },
    danger: { fill: "#E63946", stroke: "#9B1C2E" },
  },
  protanopia: {
    safe: { fill: "#2563EB", stroke: "#1E40AF" },
    caution: { fill: "#F4A261", stroke: "#C2410C" },
    danger: { fill: "#7C3AED", stroke: "#5B21B6" },
  },
  deuteranopia: {
    safe: { fill: "#0EA5E9", stroke: "#0369A1" },
    caution: { fill: "#F4A261", stroke: "#C2410C" },
    danger: { fill: "#A855F7", stroke: "#6D28D9" },
  },
  tritanopia: {
    safe: { fill: "#2A9D8F", stroke: "#1F6F65" },
    caution: { fill: "#E477A6", stroke: "#BE123C" },
    danger: { fill: "#0F172A", stroke: "#020617" },
  },
};

export const getSignalPalette = (category: SignalCategory, cvdType: CvdType = "normal") =>
  (LEGACY_PALETTES[cvdType] || LEGACY_PALETTES.normal)[category];
