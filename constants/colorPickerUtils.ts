/**
 * Color Picker Utilities
 * Handles color detection from pixel coordinates and color name mapping
 */

export interface DetectedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  name: string;
  brightness: "light" | "dark";
}

/**
 * Comprehensive color name database using NTC.js algorithm approach
 * Maps RGB values to human-readable color names
 */
const COLOR_NAMES: { [key: string]: string } = {
  // Reds
  "#FF0000": "Red",
  "#FF1414": "Red",
  "#FF2828": "Red",
  "#FF3C3C": "Red",
  "#FF5050": "Red",
  "#FF6464": "Scarlet",
  "#FF7878": "Red",
  "#FF8C8C": "Red",
  "#FFA0A0": "Light Red",
  "#FFB4B4": "Light Red",

  // Oranges
  "#FF8800": "Orange",
  "#FF9500": "Orange",
  "#FFA200": "Orange",
  "#FFAF00": "Orange",
  "#FFBC00": "Dark Orange",
  "#FFC900": "Orange",

  // Yellows
  "#FFFF00": "Yellow",
  "#FFFF33": "Yellow",
  "#FFFF66": "Yellow",
  "#FFFF99": "Bright Yellow",
  "#FFFFCC": "Light Yellow",
  "#FFFFE0": "Light Yellow",

  // Greens
  "#00FF00": "Lime",
  "#00E000": "Green",
  "#00C000": "Green",
  "#00A000": "Dark Green",
  "#008000": "Dark Green",
  "#006400": "Forest Green",
  "#228B22": "Forest Green",
  "#32CD32": "Lime Green",
  "#90EE90": "Light Green",
  "#98FB98": "Pale Green",
  "#00FF7F": "Spring Green",
  "#00FA9A": "Medium Spring Green",

  // Cyans
  "#00FFFF": "Cyan",
  "#00EDED": "Cyan",
  "#00DBDB": "Cyan",
  "#00C9C9": "Dark Cyan",
  "#008B8B": "Dark Cyan",
  "#20B2AA": "Light Sea Green",
  "#48D1CC": "Medium Turquoise",
  "#40E0D0": "Turquoise",
  "#7FFFD4": "Aquamarine",

  // Blues
  "#0000FF": "Blue",
  "#0014FF": "Blue",
  "#0028FF": "Blue",
  "#003CFF": "Blue",
  "#0050FF": "Blue",
  "#0064FF": "Blue",
  "#0078FF": "Blue",
  "#008CFF": "Sky Blue",
  "#00A0FF": "Deep Sky Blue",
  "#1E90FF": "Dodger Blue",
  "#6495ED": "Cornflower Blue",
  "#87CEEB": "Sky Blue",
  "#87CEFA": "Light Sky Blue",
  "#B0E0E6": "Powder Blue",
  "#ADD8E6": "Light Blue",
  "#4169E1": "Royal Blue",

  // Magentas & Purples
  "#FF00FF": "Magenta",
  "#FF00ED": "Magenta",
  "#FF00DB": "Magenta",
  "#FF00C9": "Magenta",
  "#FF00B7": "Magenta",
  "#FF00A5": "Purple",
  "#FF0093": "Purple",
  "#E000FF": "Purple",
  "#C000FF": "Blue Violet",
  "#A000FF": "Purple",
  "#9400D3": "Dark Violet",
  "#8A2BE2": "Blue Violet",
  "#BA55D3": "Medium Orchid",
  "#DA70D6": "Orchid",
  "#EE82EE": "Violet",
  "#DDA0DD": "Plum",
  "#FFB6FF": "Light Pink",

  // Pinks
  "#FF69B4": "Hot Pink",
  "#FF1493": "Deep Pink",
  "#FFB6C1": "Light Pink",
  "#FFC0CB": "Pink",
  "#FFAFCA": "Light Pink",
  "#FF6B9D": "Hot Pink",

  // Browns
  "#8B4513": "Saddle Brown",
  "#A0522D": "Sienna",
  "#CD853F": "Peru",
  "#D2691E": "Chocolate",
  "#8B7355": "Burlywood",
  "#A9A9A9": "Dark Gray",
  "#D3D3D3": "Light Gray",
  "#696969": "Dim Gray",

  // Blacks, Whites, Grays
  "#000000": "Black",
  "#1C1C1C": "Black",
  "#383838": "Dark Gray",
  "#545454": "Gray",
  "#707070": "Gray",
  "#808080": "Gray",
  "#767474": "Dark Gray",
  "#C0C0C0": "Silver",
  "#a7a5a5": "Light Gray",
  "#DCDCDC": "Gainsboro",
  "#E5E5E5": "Light Gray",
  "#F5F5F5": "White Smoke",
  "#FFFFFF": "White",
};

/**
 * Convert RGB to Hex color string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r).toUpperCase()}${toHex(g).toUpperCase()}${toHex(b).toUpperCase()}`;
}

/**
 * Convert Hex to RGB
 */
export function hexToRgb(
  hex: string,
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Find nearest color name from RGB values
 * Uses Euclidean distance to find closest match
 */
function findNearestColorName(r: number, g: number, b: number): string {
  let nearestName = "Unknown";
  let minDistance = Infinity;

  Object.entries(COLOR_NAMES).forEach(([hex, name]) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return;

    // Euclidean distance in RGB space
    const distance = Math.sqrt(
      Math.pow(r - rgb.r, 2) + Math.pow(g - rgb.g, 2) + Math.pow(b - rgb.b, 2),
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestName = name;
    }
  });

  return nearestName;
}

/**
 * Calculate perceived brightness of a color
 * Using relative luminance formula (WCAG)
 */
export function getBrightness(
  r: number,
  g: number,
  b: number,
): "light" | "dark" {
  // Convert to sRGB
  const [rs, gs, bs] = [r, g, b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  // Calculate relative luminance
  const luminance = 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;

  return luminance > 0.5 ? "light" : "dark";
}

/**
 * Detect color from a canvas image data at given coordinates
 */
export function detectColorFromImageData(
  imageData: ImageData,
  x: number,
  y: number,
  width: number,
  height: number,
): DetectedColor {
  // Clamp coordinates to image bounds
  const clampedX = Math.max(0, Math.min(Math.floor(x), width - 1));
  const clampedY = Math.max(0, Math.min(Math.floor(y), height - 1));

  // Get pixel data from ImageData
  const index = (clampedY * width + clampedX) * 4;
  const data = imageData.data;

  const r = data[index];
  const g = data[index + 1];
  const b = data[index + 2];
  const a = data[index + 3];

  const hex = rgbToHex(r, g, b);
  const name = findNearestColorName(r, g, b);
  const brightness = getBrightness(r, g, b);

  return {
    hex,
    rgb: { r, g, b },
    name,
    brightness,
  };
}

/**
 * Sample multiple pixels around a point for average color
 * Useful for smoother color detection
 */
export function detectAverageColor(
  imageData: ImageData,
  x: number,
  y: number,
  width: number,
  height: number,
  sampleRadius: number = 2,
): DetectedColor {
  const data = imageData.data;
  let sumR = 0,
    sumG = 0,
    sumB = 0;
  let pixelCount = 0;

  // Sample pixels in a square around the point
  for (let dy = -sampleRadius; dy <= sampleRadius; dy++) {
    for (let dx = -sampleRadius; dx <= sampleRadius; dx++) {
      const px = Math.max(0, Math.min(Math.floor(x + dx), width - 1));
      const py = Math.max(0, Math.min(Math.floor(y + dy), height - 1));

      const index = (py * width + px) * 4;
      sumR += data[index];
      sumG += data[index + 1];
      sumB += data[index + 2];
      pixelCount++;
    }
  }

  const avgR = Math.round(sumR / pixelCount);
  const avgG = Math.round(sumG / pixelCount);
  const avgB = Math.round(sumB / pixelCount);

  const hex = rgbToHex(avgR, avgG, avgB);
  const name = findNearestColorName(avgR, avgG, avgB);
  const brightness = getBrightness(avgR, avgG, avgB);

  return {
    hex,
    rgb: { r: avgR, g: avgG, b: avgB },
    name,
    brightness,
  };
}

/**
 * Get a contrasting text color for accessibility
 */
export function getContrastingTextColor(bgColor: "light" | "dark"): string {
  return bgColor === "light" ? "#000000" : "#FFFFFF";
}

/**
 * Format color info for display
 */
export function formatColorInfo(color: DetectedColor): string {
  return `${color.name}\n${color.hex}\nRGB(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
}
