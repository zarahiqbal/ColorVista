export type SignalCategory = "safe" | "caution" | "danger";
export type SignalShape = "circle" | "triangle" | "square" | "diamond" | "hex";
export type SignalIcon = "check" | "exclamation" | "cross" | "arrow";

export interface SignalDefinition {
  id: string;
  category: SignalCategory;
  shape: SignalShape;
  icon: SignalIcon;
  label: string;
}

export interface SignalRound {
  target: SignalCategory;
  signals: SignalDefinition[];
  timeLimit: number;
  showLabels: boolean;
  question: string;
  level: number;
}

export interface SignalRoundOptions {
  cvdType?: "normal" | "protanopia" | "deuteranopia" | "tritanopia";
}

const SIGNAL_LIBRARY: SignalDefinition[] = [
  {
    id: "safe-circle-check",
    category: "safe",
    shape: "circle",
    icon: "check",
    label: "Safe",
  },
  {
    id: "safe-square-check",
    category: "safe",
    shape: "square",
    icon: "check",
    label: "Safe",
  },
  {
    id: "safe-hex-arrow",
    category: "safe",
    shape: "hex",
    icon: "arrow",
    label: "Safe",
  },
  {
    id: "caution-triangle-exclamation",
    category: "caution",
    shape: "triangle",
    icon: "exclamation",
    label: "Caution",
  },
  {
    id: "caution-diamond-exclamation",
    category: "caution",
    shape: "diamond",
    icon: "exclamation",
    label: "Caution",
  },
  {
    id: "caution-square-exclamation",
    category: "caution",
    shape: "square",
    icon: "exclamation",
    label: "Caution",
  },
  {
    id: "danger-triangle-cross",
    category: "danger",
    shape: "triangle",
    icon: "cross",
    label: "Danger",
  },
  {
    id: "danger-circle-cross",
    category: "danger",
    shape: "circle",
    icon: "cross",
    label: "Danger",
  },
  {
    id: "danger-diamond-cross",
    category: "danger",
    shape: "diamond",
    icon: "cross",
    label: "Danger",
  },
];

const CATEGORIES: SignalCategory[] = ["safe", "caution", "danger"];

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const pickRandom = <T,>(items: T[]) =>
  items[Math.floor(Math.random() * items.length)];

const ICON_LABELS: Record<SignalIcon, string> = {
  check: "check",
  exclamation: "exclamation",
  cross: "cross",
  arrow: "arrow",
};

export const createSignalRound = (
  level: number,
  options: SignalRoundOptions = {},
): SignalRound => {
  const { cvdType = "normal" } = options;
  const signalCount = Math.min(6, 3 + Math.floor(level / 2));
  const showLabels = level <= 2 || cvdType !== "normal";
  const timeLimit = Math.max(6, 12 - level);

  const target = pickRandom(CATEGORIES);
  const targetSignals = SIGNAL_LIBRARY.filter((signal) => signal.category === target);
  const targetSignal = pickRandom(targetSignals);

  const remaining = shuffle(
    SIGNAL_LIBRARY.filter((signal) => signal.id !== targetSignal.id),
  ).slice(0, signalCount - 1);

  const question =
    cvdType === "normal"
      ? `Tap the ${target.toUpperCase()} signal`
      : `Tap the ${target.toUpperCase()} signal (${targetSignal.shape} with ${ICON_LABELS[targetSignal.icon]})`;

  return {
    target,
    signals: shuffle([targetSignal, ...remaining]),
    timeLimit,
    showLabels,
    question,
    level,
  };
};

const CVD_PALETTES: Record<
  "normal" | "protanopia" | "deuteranopia" | "tritanopia",
  Record<SignalCategory, { fill: string; stroke: string }>
> = {
  normal: {
    safe: { fill: "#3B82F6", stroke: "#1D4ED8" },
    caution: { fill: "#F59E0B", stroke: "#B45309" },
    danger: { fill: "#EF4444", stroke: "#991B1B" },
  },
  protanopia: {
    safe: { fill: "#2563EB", stroke: "#1E40AF" },
    caution: { fill: "#F97316", stroke: "#C2410C" },
    danger: { fill: "#7C3AED", stroke: "#5B21B6" },
  },
  deuteranopia: {
    safe: { fill: "#0EA5E9", stroke: "#0369A1" },
    caution: { fill: "#F97316", stroke: "#C2410C" },
    danger: { fill: "#A855F7", stroke: "#6D28D9" },
  },
  tritanopia: {
    safe: { fill: "#22C55E", stroke: "#15803D" },
    caution: { fill: "#F43F5E", stroke: "#BE123C" },
    danger: { fill: "#0F172A", stroke: "#020617" },
  },
};

export const getSignalPalette = (
  category: SignalCategory,
  cvdType: "normal" | "protanopia" | "deuteranopia" | "tritanopia" = "normal",
) => CVD_PALETTES[cvdType][category];
