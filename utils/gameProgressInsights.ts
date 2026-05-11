import type { GameProgressDoc } from "@/Context/userProfileFirestore";

export function pctAccuracy(ratio: number): string {
  return `${Math.round(Math.min(1, Math.max(0, ratio)) * 100)}%`;
}

/** Positive = last game accuracy above your running average */
export function accuracyTrendVsAverage(p: GameProgressDoc): number {
  return p.lastAccuracy - p.avgAccuracy;
}

export function lastScoreVsBestPct(p: GameProgressDoc): number {
  if (p.bestScore <= 0) return 0;
  return Math.min(100, Math.round((p.lastScore / p.bestScore) * 100));
}

export function insightLine(p: GameProgressDoc): string {
  if (p.gamesPlayed <= 0) return "Play a round to start tracking progress.";
  if (p.gamesPlayed === 1) {
    return `First game logged — keep going to unlock trend insights.`;
  }
  const delta = accuracyTrendVsAverage(p);
  const scorePct = lastScoreVsBestPct(p);
  const bits: string[] = [];
  if (scorePct >= 95) bits.push(`Last score is near your personal best (${scorePct}% of best).`);
  else if (scorePct >= 70) bits.push(`Last score reached ${scorePct}% of your best — room to climb.`);
  else bits.push(`Last score was ${scorePct}% of your best — try another run!`);

  const deltaPts = Math.round(Math.abs(delta) * 100);
  if (delta > 0.04) {
    bits.push(`Last game beat your average accuracy by ${deltaPts} pts.`);
  } else if (delta < -0.04) {
    bits.push(`Last game was ${deltaPts} pts under your average — normal variance.`);
  } else {
    bits.push(`Accuracy is steady vs your average.`);
  }
  return bits.join(" ");
}
