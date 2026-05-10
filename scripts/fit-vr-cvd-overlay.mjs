/**
 * Fits 2–3 source-over RGBA layers so that compositing over RGB swatches
 * approximates daltonize (boost=1.35). Run: node scripts/fit-vr-cvd-overlay.mjs
 */

const MODES = ["protanopia", "deuteranopia", "tritanopia"];

const MAT = {
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

function matVec(m, r, g, b) {
  return [
    m[0][0] * r + m[0][1] * g + m[0][2] * b,
    m[1][0] * r + m[1][1] * g + m[1][2] * b,
    m[2][0] * r + m[2][1] * g + m[2][2] * b,
  ];
}

function dalton(r, g, b, mode, boost) {
  const m = MAT[mode];
  const sim = matVec(m, r, g, b);
  const er0 = r - sim[0];
  const er1 = g - sim[1];
  const er2 = b - sim[2];
  let cr = 0,
    cg = 0,
    cb = 0;
  if (mode === "protanopia" || mode === "deuteranopia") {
    cg = (er0 * 0.75 + er1) * boost;
    cb = (er0 * 0.75 + er2) * boost;
  } else {
    cr = (er0 + er2 * 0.75) * boost;
    cg = (er1 + er2 * 0.75) * boost;
  }
  return [
    Math.max(0, Math.min(255, r + cr)),
    Math.max(0, Math.min(255, g + cg)),
    Math.max(0, Math.min(255, b + cb)),
  ];
}

function compose3(r, g, b, layers) {
  let [R, G, B] = [r, g, b];
  for (const { tr, tg, tb, a } of layers) {
    const ia = 1 - a;
    R = ia * R + a * tr;
    G = ia * G + a * tg;
    B = ia * B + a * tb;
  }
  return [R, G, B];
}

const STEPS = [0, 51, 102, 153, 204, 255];
const BOOST = 1.35;

function rgbError(mode, layers) {
  let s = 0;
  let n = 0;
  for (const r of STEPS) {
    for (const g of STEPS) {
      for (const b of STEPS) {
        const dt = dalton(r, g, b, mode, BOOST);
        const pr = compose3(r, g, b, layers);
        const d0 = pr[0] - dt[0];
        const d1 = pr[1] - dt[1];
        const d2 = pr[2] - dt[2];
        s += d0 * d0 + d1 * d1 + d2 * d2;
        n += 3;
      }
    }
  }
  const sumA = layers.reduce((u, L) => u + L.a, 0);
  const pen = sumA > 0.52 ? 8000 * (sumA - 0.52) ** 2 : 0;
  return s / n + pen;
}

function randomLayer() {
  return {
    tr: Math.random() * 255,
    tg: Math.random() * 255,
    tb: Math.random() * 255,
    a: 0.06 + Math.random() * 0.14,
  };
}

function randomGreyLayer() {
  const L = Math.random() * 255;
  return { tr: L, tg: L, tb: L, a: 0.04 + Math.random() * 0.1 };
}

function refine(mode, iterations = 120000) {
  let best = null;
  let bestL = null;
  for (let i = 0; i < iterations; i++) {
    const layers = [randomLayer(), randomLayer(), randomGreyLayer()];
    const e = rgbError(mode, layers);
    if (best === null || e < best) {
      best = e;
      bestL = layers;
    }
  }
  return { error: best, layers: bestL };
}

function localJitters(mode, layers, rounds = 8000) {
  let cur = structuredClone(layers);
  let curE = rgbError(mode, cur);
  for (let r = 0; r < rounds; r++) {
    const cand = structuredClone(cur);
    const idx = Math.floor(Math.random() * 3);
    const key = idx === 2 ? ["tr"] : Math.random() < 0.5 ? ["a"] : ["tr", "tg", "tb"];
    if (key[0] === "a") {
      cand[idx].a = clamp(cand[idx].a + (Math.random() - 0.5) * 0.04, 0.03, 0.22);
    } else {
      cand[idx].tr = clamp(cand[idx].tr + (Math.random() - 0.5) * 24, 0, 255);
      cand[idx].tg = clamp(cand[idx].tg + (Math.random() - 0.5) * 24, 0, 255);
      cand[idx].tb = clamp(cand[idx].tb + (Math.random() - 0.5) * 24, 0, 255);
    }
    const e = rgbError(mode, cand);
    if (e < curE) {
      cur = cand;
      curE = e;
    }
  }
  return { error: curE, layers: cur };
}

function clamp(x, lo, hi) {
  return Math.max(lo, Math.min(hi, x));
}

for (const mode of MODES) {
  const seed = refine(mode, 350000);
  const { error, layers } = localJitters(mode, seed.layers, 25000);
  console.log("\n//", mode, "rmse~", Math.sqrt(error));
  layers.forEach((L, j) => {
    const r = Math.round(L.tr);
    const g = Math.round(L.tg);
    const b = Math.round(L.tb);
    const a = L.a.toFixed(3);
    console.log(
      `// L${j}: rgba(${r}, ${g}, ${b}, ${a})`,
    );
  });
  console.log(JSON.stringify({ mode, mse: error, layers }, null, 2));
}
