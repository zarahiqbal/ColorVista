// Color Detective — CVD-aware color identification trainer.
// Rounds train the user to (a) match colors against a labeled target and
// (b) name colors they see, with distractors deliberately drawn from each
// CVD type's confusion lines (red↔green for protan/deuter, blue↔yellow
// for tritan, etc.).

export type CvdType = "normal" | "protanopia" | "deuteranopia" | "tritanopia";
export type DetectiveMode = "match" | "name";
export type DetectiveShape = "circle" | "square" | "rounded";

export interface DetectiveColor {
  id: string;
  name: string;
  // Base hex shown to the user.
  hex: string;
  // High-contrast / daltonized variant used by the Boost hint to make
  // the difference between confusable colors visually pop for the user.
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
}

export interface DetectiveTile {
  // Unique tile id (slot id), independent of the colour it holds.
  id: string;
  color: DetectiveColor;
  shape: DetectiveShape;
}

export interface DetectiveRound {
  level: number;
  mode: DetectiveMode;
  target: DetectiveColor;
  // For "match" rounds — grid of tiles, some matching the target.
  tiles: DetectiveTile[];
  // Indices in `tiles` that are correct answers.
  matchingTileIds: string[];
  // For "name" rounds — the answer options (color names).
  nameOptions: DetectiveColor[];
  timeLimit: number;
}

export interface DetectiveRoundOptions {
  cvdType?: CvdType;
}

// Curated, named colour deck with confusion-line metadata.
// Hex values are picked to be visually distinct under normal vision while
// boostHex values increase saturation / luminance separation along the
// problematic axis for each family — a lightweight daltonization aid.
const COLOR_DECK: DetectiveColor[] = [
  { id: "red", name: "Red", hex: "#E63946", boostHex: "#FF1F3A", family: "red" },
  { id: "crimson", name: "Crimson", hex: "#9B1C2E", boostHex: "#C40233", family: "red" },
  { id: "orange", name: "Orange", hex: "#F4A261", boostHex: "#FF8800", family: "orange" },
  { id: "amber", name: "Amber", hex: "#E9C46A", boostHex: "#FFC300", family: "yellow" },
  { id: "yellow", name: "Yellow", hex: "#F1E15B", boostHex: "#FFE600", family: "yellow" },
  { id: "olive", name: "Olive", hex: "#9AA257", boostHex: "#8FBF3F", family: "green" },
  { id: "green", name: "Green", hex: "#2A9D8F", boostHex: "#00B964", family: "green" },
  { id: "forest", name: "Forest", hex: "#264E36", boostHex: "#1E7A3B", family: "green" },
  { id: "teal", name: "Teal", hex: "#3A86A8", boostHex: "#00B4D8", family: "teal" },
  { id: "sky", name: "Sky Blue", hex: "#5BB0E2", boostHex: "#1FA8FF", family: "blue" },
  { id: "blue", name: "Blue", hex: "#2D5BAF", boostHex: "#1845CF", family: "blue" },
  { id: "violet", name: "Violet", hex: "#7B3FA8", boostHex: "#8A2BE2", family: "purple" },
  { id: "purple", name: "Purple", hex: "#5C2F8C", boostHex: "#7B1FA2", family: "purple" },
  { id: "pink", name: "Pink", hex: "#E477A6", boostHex: "#FF4D9D", family: "pink" },
  { id: "brown", name: "Brown", hex: "#8B5A2B", boostHex: "#A0522D", family: "brown" },
  { id: "gray", name: "Gray", hex: "#8E9196", boostHex: "#6C6F73", family: "gray" },
];

// Confusion lines: for each CVD type, list pairs of hue families that
// commonly get confused. The game pulls distractors from the same
// confusion line as the target so the user is genuinely tested on
// (and trained on) their problem pairs.
const CONFUSION_PAIRS: Record<CvdType, [DetectiveColor["family"], DetectiveColor["family"]][]> = {
  normal: [
    ["red", "orange"],
    ["blue", "purple"],
    ["green", "teal"],
  ],
  protanopia: [
    ["red", "green"],
    ["red", "brown"],
    ["orange", "yellow"],
    ["purple", "blue"],
    ["pink", "gray"],
  ],
  deuteranopia: [
    ["red", "green"],
    ["green", "brown"],
    ["green", "yellow"],
    ["pink", "gray"],
    ["purple", "blue"],
  ],
  tritanopia: [
    ["blue", "green"],
    ["yellow", "pink"],
    ["yellow", "purple"],
    ["purple", "red"],
  ],
};

const SHAPES: DetectiveShape[] = ["circle", "rounded", "square"];

const shuffle = <T,>(items: T[]): T[] => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

export const getColorById = (id: string): DetectiveColor | undefined =>
  COLOR_DECK.find((c) => c.id === id);

export const getAllColors = (): DetectiveColor[] => COLOR_DECK.slice();

// Build a pool of distractor colors for a target, biased toward the
// user's CVD confusion families. As level rises, more confusable
// distractors are included.
const buildDistractorPool = (
  target: DetectiveColor,
  cvdType: CvdType,
  level: number,
): DetectiveColor[] => {
  const pairs = CONFUSION_PAIRS[cvdType] || CONFUSION_PAIRS.normal;
  const confusableFamilies = new Set<string>();
  pairs.forEach(([a, b]) => {
    if (a === target.family) confusableFamilies.add(b);
    if (b === target.family) confusableFamilies.add(a);
  });

  const confusable = COLOR_DECK.filter(
    (c) => c.id !== target.id && confusableFamilies.has(c.family),
  );
  const easyOthers = COLOR_DECK.filter(
    (c) => c.id !== target.id && !confusableFamilies.has(c.family) && c.family !== target.family,
  );

  // Higher level → more confusables, fewer easy distractors.
  const confusableCount = Math.min(confusable.length, 1 + Math.floor(level / 2));
  const confusablePicks = shuffle(confusable).slice(0, confusableCount);
  const easyPicks = shuffle(easyOthers).slice(0, 6);
  return [...confusablePicks, ...easyPicks];
};

const buildMatchRound = (
  level: number,
  cvdType: CvdType,
): Omit<DetectiveRound, "mode" | "timeLimit"> => {
  const target = pick(COLOR_DECK);
  // Number of tiles scales with level (3x3 → 4x4 grid roughly).
  const tileCount = Math.min(16, 6 + Math.floor(level / 1.5) * 2);
  // How many of the tiles are the correct color.
  const matchCount = Math.max(1, Math.min(4, 1 + Math.floor(level / 3)));

  const distractorPool = buildDistractorPool(target, cvdType, level);
  const distractors: DetectiveColor[] = [];
  while (distractors.length < tileCount - matchCount) {
    distractors.push(distractorPool[distractors.length % distractorPool.length]);
  }

  const tileColors: DetectiveColor[] = shuffle([
    ...Array.from({ length: matchCount }, () => target),
    ...distractors,
  ]);

  const tiles: DetectiveTile[] = tileColors.map((color, index) => ({
    id: `tile-${index}`,
    color,
    shape: pick(SHAPES),
  }));

  const matchingTileIds = tiles.filter((t) => t.color.id === target.id).map((t) => t.id);

  return {
    level,
    target,
    tiles,
    matchingTileIds,
    nameOptions: [],
  };
};

const buildNameRound = (
  level: number,
  cvdType: CvdType,
): Omit<DetectiveRound, "mode" | "timeLimit"> => {
  const target = pick(COLOR_DECK);
  const optionCount = Math.min(6, 3 + Math.floor(level / 2));
  const distractorPool = buildDistractorPool(target, cvdType, level);
  const optionDistractors = shuffle(distractorPool).slice(0, optionCount - 1);
  const nameOptions = shuffle([target, ...optionDistractors]);

  // One target-colored tile centred for the prompt — `tiles` is reused
  // to render the "swatch on display" element so the UI stays uniform.
  const tiles: DetectiveTile[] = [
    { id: "swatch", color: target, shape: "rounded" },
  ];

  return {
    level,
    target,
    tiles,
    matchingTileIds: [],
    nameOptions,
  };
};

export const createDetectiveRound = (
  level: number,
  options: DetectiveRoundOptions = {},
): DetectiveRound => {
  const cvdType: CvdType = (options.cvdType as CvdType) || "normal";
  // Alternate modes so the user practises both naming and matching.
  // Odd-numbered rounds = match (visual), even = name (verbal).
  const mode: DetectiveMode = level % 2 === 0 ? "name" : "match";
  const timeLimit = Math.max(8, 18 - Math.floor(level / 2));

  const base =
    mode === "match" ? buildMatchRound(level, cvdType) : buildNameRound(level, cvdType);

  return { ...base, mode, timeLimit };
};

// Lightweight helper used by the UI to describe what a confusion pair
// looks like, so we can render insightful tips on the game-over screen.
export const describeConfusionPairs = (cvdType: CvdType): string[] => {
  const pairs = CONFUSION_PAIRS[cvdType] || CONFUSION_PAIRS.normal;
  return pairs.slice(0, 3).map(([a, b]) => `${capitalize(a)} ↔ ${capitalize(b)}`);
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
