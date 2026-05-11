missing_deps = []

try:
    import cv2
except ImportError:
    missing_deps.append('opencv-python')

try:
    import numpy as np
except ImportError:
    missing_deps.append('numpy')

import base64
import time

try:
    from flask import Flask, request, jsonify
except ImportError:
    missing_deps.append('Flask')

try:
    from werkzeug.exceptions import ClientDisconnected
except ImportError:
    ClientDisconnected = Exception

if missing_deps:
    msg = (f"Missing Python dependencies: {', '.join(missing_deps)}.\n"
           "Install them with: `pip install -r requirements.txt`\n"
           "Or inside the project venv: `.venv\\Scripts\\pip.exe install -r requirements.txt` on Windows.")
    raise ImportError(msg)

app = Flask(__name__)

# ─────────────────────────────────────────────────────────────────────────────
# Extended color definitions – HSV ranges and display BGRs
# ─────────────────────────────────────────────────────────────────────────────

# Each entry: list of (lower_hsv, upper_hsv) tuples
COLOR_RANGES = {
    # ── Reds ──────────────────────────────────────────────────────────────────
    "Red":          [(np.array([0,   120,  70]),  np.array([8,   255, 255])),
                     (np.array([172, 120,  70]),  np.array([180, 255, 255]))],
    "Dark Red":     [(np.array([0,   150,  30]),  np.array([8,   255,  90])),
                     (np.array([172, 150,  30]),  np.array([180, 255,  90]))],
    "Crimson":      [(np.array([0,   180, 100]),  np.array([5,   255, 200])),
                     (np.array([175, 180, 100]),  np.array([180, 255, 200]))],
    "Coral":        [(np.array([5,    80, 180]),  np.array([12,  210, 255]))],

    # ── Oranges ───────────────────────────────────────────────────────────────
    "Orange":       [(np.array([9,   160, 120]),  np.array([20,  255, 255]))],
    "Dark Orange":  [(np.array([9,   180,  60]),  np.array([18,  255, 150]))],
    "Amber":        [(np.array([20,  160, 120]),  np.array([26,  255, 255]))],

    # ── Yellows ───────────────────────────────────────────────────────────────
    "Yellow":       [(np.array([22,  120, 130]),  np.array([33,  255, 255]))],
    "Gold":         [(np.array([22,  160,  80]),  np.array([30,  255, 200]))],
    "Khaki":        [(np.array([22,   40, 160]),  np.array([35,  110, 255]))],

    # ── Greens ────────────────────────────────────────────────────────────────
    "Lime":         [(np.array([34,  120, 120]),  np.array([47,  255, 255]))],
    "Yellow-Green": [(np.array([34,   80, 100]),  np.array([50,  200, 255]))],
    "Green":        [(np.array([48,   80,  40]),  np.array([82,  255, 255]))],
    "Forest Green": [(np.array([48,  100,  20]),  np.array([78,  255, 120]))],
    "Olive":        [(np.array([26,   60,  30]),  np.array([50,  160, 130]))],
    "Mint":         [(np.array([75,   40, 160]),  np.array([95,  140, 255]))],
    "Sea Green":    [(np.array([82,   80, 100]),  np.array([100, 220, 200]))],

    # ── Cyans ─────────────────────────────────────────────────────────────────
    "Cyan":         [(np.array([83,  100,  80]),  np.array([99,  255, 255]))],
    "Teal":         [(np.array([83,  100,  30]),  np.array([100, 255, 150]))],
    "Turquoise":    [(np.array([82,   60, 130]),  np.array([100, 200, 255]))],

    # ── Blues ─────────────────────────────────────────────────────────────────
    "Blue":         [(np.array([100, 120,  80]),  np.array([128, 255, 255]))],
    "Sky Blue":     [(np.array([97,   60, 160]),  np.array([115, 200, 255]))],
    "Navy":         [(np.array([100, 140,  20]),  np.array([128, 255, 120]))],
    "Royal Blue":   [(np.array([107, 160,  80]),  np.array([125, 255, 220]))],
    "Steel Blue":   [(np.array([100,  50,  80]),  np.array([120, 160, 200]))],
    "Cornflower":   [(np.array([107,  60, 130]),  np.array([122, 180, 255]))],
    "Periwinkle":   [(np.array([115,  40, 140]),  np.array([135, 120, 255]))],

    # ── Purples / Violets ─────────────────────────────────────────────────────
    "Indigo":       [(np.array([120, 120,  40]),  np.array([135, 255, 160]))],
    "Purple":       [(np.array([128,  80,  60]),  np.array([155, 255, 255]))],
    "Violet":       [(np.array([128,  60,  80]),  np.array([148, 220, 255]))],
    "Dark Purple":  [(np.array([128, 100,  20]),  np.array([155, 255, 100]))],
    "Lavender":     [(np.array([115,  20, 160]),  np.array([148,  90, 255]))],

    # ── Pinks / Magentas ─────────────────────────────────────────────────────
    "Magenta":      [(np.array([148,  80,  80]),  np.array([168, 255, 255]))],
    "Hot Pink":     [(np.array([148, 120, 160]),  np.array([170, 255, 255]))],
    "Pink":         [(np.array([148,  20, 160]),  np.array([175, 120, 255]))],
    "Light Pink":   [(np.array([148,  15, 200]),  np.array([175,  70, 255]))],
    "Rose":         [(np.array([0,    60, 160]),  np.array([6,   200, 255])),
                     (np.array([175,  60, 160]),  np.array([180, 200, 255]))],
    "Salmon":       [(np.array([5,    70, 180]),  np.array([13,  170, 255]))],

    # ── Browns / Earth Tones ──────────────────────────────────────────────────
    "Brown":        [(np.array([8,   100,  30]),  np.array([22,  255, 140]))],
    "Chocolate":    [(np.array([8,   150,  20]),  np.array([20,  255,  80]))],
    "Tan":          [(np.array([15,   30, 140]),  np.array([30,  100, 220]))],
    "Beige":        [(np.array([15,   10, 180]),  np.array([35,   50, 255]))],
    "Sienna":       [(np.array([8,   120,  80]),  np.array([18,  220, 180]))],

    # ── Neutrals ─────────────────────────────────────────────────────────────
    "White":        [(np.array([0,    0,  210]),  np.array([180,  25, 255]))],
    "Light Gray":   [(np.array([0,    0,  160]),  np.array([180,  20, 210]))],
    "Gray":         [(np.array([0,    0,   80]),  np.array([180,  20, 165]))],
    "Dark Gray":    [(np.array([0,    0,   30]),  np.array([180,  20,  80]))],
    "Black":        [(np.array([0,    0,    0]),  np.array([180,  50,  40]))],
    "Silver":       [(np.array([0,    0,  170]),  np.array([180,  15, 230]))],
    "Charcoal":     [(np.array([0,    0,   20]),  np.array([180,  30,  65]))],
}

# BGR display values for each color name
COLOR_BGR = {
    "Red":          (0,   0,   220),
    "Dark Red":     (0,   0,   139),
    "Crimson":      (60,  20,  220),
    "Coral":        (80,  127, 255),
    "Orange":       (0,   140, 255),
    "Dark Orange":  (0,   100, 200),
    "Amber":        (0,   191, 255),
    "Yellow":       (0,   220, 220),
    "Gold":         (0,   215, 255),
    "Khaki":        (140, 230, 240),
    "Lime":         (50,  220,  50),
    "Yellow-Green": (50,  205,  50),
    "Green":        (0,   160,   0),
    "Forest Green": (34,  139,  34),
    "Olive":        (0,   128, 128),
    "Mint":         (180, 255, 180),
    "Sea Green":    (87,  139,  46),
    "Cyan":         (220, 220,   0),
    "Teal":         (128, 128,   0),
    "Turquoise":    (208, 224,  64),
    "Blue":         (220,   0,   0),
    "Sky Blue":     (235, 206, 135),
    "Navy":         (128,   0,   0),
    "Royal Blue":   (225,  36,  14),
    "Steel Blue":   (180, 130,  70),
    "Cornflower":   (237, 149, 100),
    "Periwinkle":   (220, 180, 147),
    "Indigo":       (130,   0,  75),
    "Purple":       (128,   0, 128),
    "Violet":       (238, 130, 238),
    "Dark Purple":  (80,    0,  80),
    "Lavender":     (250, 230, 230),
    "Magenta":      (255,   0, 255),
    "Hot Pink":     (180,  20, 255),
    "Pink":         (203, 192, 255),
    "Light Pink":   (220, 210, 255),
    "Rose":         (60,   60, 220),
    "Salmon":       (114, 128, 250),
    "Brown":        (19,   69, 139),
    "Chocolate":    (30,   30, 100),
    "Tan":          (140, 180, 210),
    "Beige":        (220, 235, 245),
    "Sienna":       (45,   82, 160),
    "White":        (255, 255, 255),
    "Light Gray":   (200, 200, 200),
    "Gray":         (128, 128, 128),
    "Dark Gray":    (80,   80,  80),
    "Black":        (30,   30,  30),
    "Silver":       (192, 192, 192),
    "Charcoal":     (54,   69,  79),
}

# ─────────────────────────────────────────────────────────────────────────────
# Helper: draw a rounded-rectangle (pill) on an image
# ─────────────────────────────────────────────────────────────────────────────

def draw_rounded_rect(img, x1, y1, x2, y2, radius, color, alpha=1.0):
    """Draw a filled rounded rectangle with optional transparency."""
    overlay = img.copy()
    # Fill the body
    cv2.rectangle(overlay, (x1 + radius, y1), (x2 - radius, y2), color, -1)
    cv2.rectangle(overlay, (x1, y1 + radius), (x2, y2 - radius), color, -1)
    # Four corner circles
    for cx, cy in [(x1 + radius, y1 + radius),
                   (x2 - radius, y1 + radius),
                   (x1 + radius, y2 - radius),
                   (x2 - radius, y2 - radius)]:
        cv2.circle(overlay, (cx, cy), radius, color, -1, lineType=cv2.LINE_AA)
    if alpha < 1.0:
        cv2.addWeighted(overlay, alpha, img, 1.0 - alpha, 0, img)
    else:
        img[:] = overlay[:]


def _contrast_text_color(bgr):
    """Return white or black depending on perceived brightness of bgr."""
    b, g, r = bgr
    luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
    return (255, 255, 255) if luminance < 140 else (20, 20, 20)


def _draw_color_badge(output, label, fill_bgr, cx, cy, radius_hint):
    """
    Draw a polished pill badge above a detected colour region.
    fill_bgr  : badge background colour (matches detected colour)
    cx, cy    : centroid of the contour
    """
    font       = cv2.FONT_HERSHEY_DUPLEX
    font_scale = max(0.42, min(0.72, radius_hint / 70.0))
    thickness  = 1

    (tw, th), _ = cv2.getTextSize(label, font, font_scale, thickness)

    pad_x, pad_y = 10, 6
    bw = tw + pad_x * 2
    bh = th + pad_y * 2
    r  = bh // 2

    # Position badge above contour centre, clamped to image bounds
    bx1 = max(6, min(cx - bw // 2, output.shape[1] - bw - 6))
    by1 = max(6, cy - int(radius_hint) - bh - 8)
    by1 = max(6, min(by1, output.shape[0] - bh - 6))
    bx2 = bx1 + bw
    by2 = by1 + bh

    # Drop shadow
    shadow = img_overlay = output.copy()
    draw_rounded_rect(shadow, bx1 + 2, by1 + 2, bx2 + 2, by2 + 2, r, (0, 0, 0))
    cv2.addWeighted(shadow, 0.28, output, 0.72, 0, output)

    # Badge fill
    draw_rounded_rect(output, bx1, by1, bx2, by2, r, fill_bgr)

    # Text
    text_color = _contrast_text_color(fill_bgr)
    tx = bx1 + pad_x
    ty = by1 + pad_y + th
    cv2.putText(output, label, (tx, ty), font, font_scale, text_color, thickness, cv2.LINE_AA)

    # Subtle border for light badges
    b, g, rv = fill_bgr
    lum = 0.2126 * rv + 0.7152 * g + 0.0722 * b
    if lum > 180:
        # Draw border using individual shapes
        cv2.rectangle(output, (bx1 + r, by1), (bx2 - r, by2), (160, 160, 160), 1)
        cv2.rectangle(output, (bx1, by1 + r), (bx2, by2 - r), (160, 160, 160), 1)

    img_w = max(1, output.shape[1])
    img_h = max(1, output.shape[0])
    return ((bx1 + bx2) * 0.5 / img_w, (by1 + by2) * 0.5 / img_h)


def _draw_center_badge(output, label, fill_bgr, cx, cy):
    """Minimal centre-point badge for live/center-only mode."""
    font        = cv2.FONT_HERSHEY_DUPLEX
    font_scale  = 0.52
    thickness   = 1

    # Colour dot
    overlay = output.copy()
    cv2.circle(overlay, (cx, cy), 18, fill_bgr, -1, lineType=cv2.LINE_AA)
    cv2.addWeighted(overlay, 0.35, output, 0.65, 0, output)
    cv2.circle(output, (cx, cy), 18, fill_bgr, 2, lineType=cv2.LINE_AA)
    cv2.circle(output, (cx, cy), 4, fill_bgr, -1, lineType=cv2.LINE_AA)

    # Badge below dot
    (tw, th), _ = cv2.getTextSize(label, font, font_scale, thickness)
    pad_x, pad_y = 9, 5
    bw = tw + pad_x * 2
    bh = th + pad_y * 2
    r  = bh // 2

    bx1 = max(4, cx - bw // 2)
    by1 = cy + 24
    bx1 = max(4, min(bx1, output.shape[1] - bw - 4))
    by1 = max(4, min(by1, output.shape[0] - bh - 4))
    bx2 = bx1 + bw
    by2 = by1 + bh

    draw_rounded_rect(output, bx1, by1, bx2, by2, r, fill_bgr)
    text_color = _contrast_text_color(fill_bgr)
    cv2.putText(output, label, (bx1 + pad_x, by1 + pad_y + th),
                font, font_scale, text_color, thickness, cv2.LINE_AA)

    img_w = max(1, output.shape[1])
    img_h = max(1, output.shape[0])
    return ((bx1 + bx2) * 0.5 / img_w, (by1 + by2) * 0.5 / img_h)


# ─────────────────────────────────────────────────────────────────────────────
# Core detection
# ─────────────────────────────────────────────────────────────────────────────

def detect_and_draw_colors(image, draw=True, center_only=False, roi_size=80):
    hsv    = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    output = image.copy()

    # ── Fast center-only path ────────────────────────────────────────────────
    if center_only:
        ch, cw = hsv.shape[:2]
        half   = max(4, roi_size // 2)
        y1, y2 = max(0, ch // 2 - half), min(ch, ch // 2 + half)
        x1, x2 = max(0, cw // 2 - half), min(cw, cw // 2 + half)
        roi_hsv  = hsv[y1:y2, x1:x2]
        roi_area = roi_hsv.shape[0] * roi_hsv.shape[1]

        counts = {}
        for cname, ranges in COLOR_RANGES.items():
            mask = np.zeros(roi_hsv.shape[:2], dtype="uint8")
            for (lo, hi) in ranges:
                mask = cv2.bitwise_or(mask, cv2.inRange(roi_hsv, lo, hi))
            kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
            mask   = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
            counts[cname] = int(cv2.countNonZero(mask))

        best_color = max(counts, key=counts.get, default=None)
        if best_color and counts[best_color] < max(roi_area * 0.02, 15):
            best_color = None

        detected = [best_color] if best_color else []
        detection_regions = []

        if draw and best_color:
            cx = (x1 + x2) // 2
            cy = (y1 + y2) // 2
            badge_x, badge_y = _draw_center_badge(
                output, best_color, COLOR_BGR.get(best_color, (200, 200, 200)), cx, cy
            )
            detection_regions.append({
                "label": best_color,
                "cx": cx / float(cw),
                "cy": cy / float(ch),
                "badge_x": badge_x,
                "badge_y": badge_y,
            })

        return (output, detected, detection_regions) if draw else detected

    # ── Full-image detection ─────────────────────────────────────────────────
    h, w = hsv.shape[:2]

    # Background estimation from image border
    pad_h = max(1, int(0.04 * h))
    pad_w = max(1, int(0.04 * w))
    border_px = np.vstack([
        hsv[0:pad_h,      :].reshape(-1, 3),
        hsv[h - pad_h:h,  :].reshape(-1, 3),
        hsv[:, 0:pad_w     ].reshape(-1, 3),
        hsv[:, w - pad_w:w ].reshape(-1, 3),
    ])
    bg_h, bg_s, bg_v = np.median(border_px, axis=0).astype(int)

    color_contours = {name: [] for name in COLOR_RANGES}
    img_area       = h * w

    for cname, ranges in COLOR_RANGES.items():
        mask = np.zeros(hsv.shape[:2], dtype="uint8")
        for (lo, hi) in ranges:
            mask = cv2.bitwise_or(mask, cv2.inRange(hsv, lo, hi))

        k5  = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        k3  = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN,  k3, iterations=1)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, k5, iterations=2)

        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        for c in contours:
            area = cv2.contourArea(c)
            if area < 120:
                continue

            tmp_mask = np.zeros(hsv.shape[:2], dtype=np.uint8)
            cv2.drawContours(tmp_mask, [c], -1, 255, -1)
            mean_hsv  = cv2.mean(hsv, mask=tmp_mask)
            mean_h, mean_s, mean_v = int(mean_hsv[0]), int(mean_hsv[1]), int(mean_hsv[2])

            hue_diff = min(abs(mean_h - bg_h), 180 - abs(mean_h - bg_h))

            # Skip background-similar regions unless significantly saturated/different
            if (hue_diff <= 12 and abs(mean_s - bg_s) <= 18 and abs(mean_v - bg_v) <= 28
                    and mean_s <= 30):
                continue

            ((cx, cy), radius) = cv2.minEnclosingCircle(c)
            color_contours[cname].append({
                "contour": c,
                "area":    area,
                "center":  (int(cx), int(cy)),
                "radius":  int(radius),
            })

    # Compute totals per colour and select major ones
    totals = {n: sum(ci["area"] for ci in lst) for n, lst in color_contours.items()}

    # Adaptive threshold: at least 1.5% of image area or 600 px²
    rel_thresh    = max(0.015 * img_area, 600)
    major_colors  = [n for n, t in totals.items() if t >= rel_thresh]

    if not major_colors:
        major_colors = [n for n, _ in sorted(totals.items(), key=lambda x: x[1], reverse=True)[:4] if _ > 0]

    detected_colors = []
    detection_regions = []

    for cname in major_colors:
        fill = COLOR_BGR.get(cname, (200, 200, 200))

        for info in color_contours.get(cname, []):
            area, radius, (cx, cy), contour = (
                info["area"], info["radius"], info["center"], info["contour"]
            )

            if area < max(0.002 * img_area, 250) or radius < 7:
                continue

            if draw:
                # Translucent contour fill
                overlay = output.copy()
                cv2.drawContours(overlay, [contour], 0, fill, -1, cv2.LINE_AA)
                cv2.addWeighted(overlay, 0.15, output, 0.85, 0, output)

                # Outline: thin dark shadow + colour stroke
                cv2.drawContours(output, [contour], 0, (0, 0, 0),  2, cv2.LINE_AA)
                cv2.drawContours(output, [contour], 0, fill,       1, cv2.LINE_AA)

                # Badge label
                badge_x, badge_y = _draw_color_badge(output, cname, fill, cx, cy, radius)
                detection_regions.append({
                    "label": cname,
                    "cx": cx / float(w),
                    "cy": cy / float(h),
                    "badge_x": badge_x,
                    "badge_y": badge_y,
                })

            detected_colors.append(cname)

    detected_colors = list(dict.fromkeys(detected_colors))
    print(f"[ColorVista] Detected: {detected_colors or 'None'}")
    return (output, detected_colors, detection_regions) if draw else detected_colors


# ─────────────────────────────────────────────────────────────────────────────
# CVD normalisation
# ─────────────────────────────────────────────────────────────────────────────

def normalize_cvd_mode(raw_mode):
    if not raw_mode:
        return 'none'
    mode = str(raw_mode).strip().lower()
    if 'protan' in mode and 'deuter' in mode:
        return 'deuteranopia'
    if 'protan' in mode:
        return 'protanopia'
    if 'deuter' in mode:
        return 'deuteranopia'
    if 'tritan' in mode:
        return 'tritanopia'
    if 'normal' in mode or 'none' in mode:
        return 'none'
    return 'deuteranopia'


# ─────────────────────────────────────────────────────────────────────────────
# CVD simulation matrices (Viénot 1999 / Brettel 1997 approximations)
# ─────────────────────────────────────────────────────────────────────────────

_CVD_SIM = {
    'protanopia':  np.array([[0.56667, 0.43333, 0.0],
                              [0.55833, 0.44167, 0.0],
                              [0.0,     0.24167, 0.75833]], dtype=np.float32),
    'deuteranopia': np.array([[0.625,  0.375,  0.0],
                               [0.70,   0.30,   0.0],
                               [0.0,    0.30,   0.70 ]], dtype=np.float32),
    'tritanopia':  np.array([[0.95,   0.05,   0.0],
                              [0.0,    0.433,  0.567],
                              [0.0,    0.475,  0.525]], dtype=np.float32),
}

def _daltonize(rgb_f32, mode, boost=1.0):
    """
    rgb_f32  : float32 ndarray, shape (H, W, 3), range [0, 255]
    Returns enhanced float32 ndarray same shape.
    """
    sim_mat = _CVD_SIM.get(mode)
    if sim_mat is None:
        return rgb_f32

    sim   = cv2.transform(rgb_f32, sim_mat)
    error = rgb_f32 - sim

    corr  = np.zeros_like(rgb_f32)
    if mode in ('protanopia', 'deuteranopia'):
        corr[..., 1] = (error[..., 0] * 0.75 + error[..., 1]) * boost
        corr[..., 2] = (error[..., 0] * 0.75 + error[..., 2]) * boost
    elif mode == 'tritanopia':
        corr[..., 0] = (error[..., 0] + error[..., 2] * 0.75) * boost
        corr[..., 1] = (error[..., 1] + error[..., 2] * 0.75) * boost

    return np.clip(rgb_f32 + corr, 0.0, 255.0)


def apply_cvd_enhancement(image_bgr, cvd_mode):
    """High-quality (still) image CVD daltonization."""
    mode = normalize_cvd_mode(cvd_mode)
    if mode == 'none':
        return image_bgr
    rgb  = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB).astype(np.float32)
    enhanced = _daltonize(rgb, mode, boost=1.0)
    return cv2.cvtColor(enhanced.astype(np.uint8), cv2.COLOR_RGB2BGR)


def apply_cvd_enhancement_live(image_bgr, cvd_mode):
    """Low-latency CVD daltonization for live frames."""
    mode = normalize_cvd_mode(cvd_mode)
    if mode == 'none':
        return image_bgr
    rgb  = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB).astype(np.float32)
    enhanced = _daltonize(rgb, mode, boost=1.35)
    return cv2.cvtColor(enhanced.astype(np.uint8), cv2.COLOR_RGB2BGR)


# ─────────────────────────────────────────────────────────────────────────────
# Image encoding helpers – lossless PNG preferred for /process-image
# ─────────────────────────────────────────────────────────────────────────────

def encode_lossless(img):
    """Encode to PNG base64 (lossless – preserves full quality)."""
    _, buf = cv2.imencode('.png', img, [cv2.IMWRITE_PNG_COMPRESSION, 3])
    return base64.b64encode(buf).decode('utf-8'), 'png'


def encode_jpeg(img, quality=92):
    """Encode to high-quality JPEG base64."""
    params = [cv2.IMWRITE_JPEG_QUALITY, quality,
              cv2.IMWRITE_JPEG_OPTIMIZE, 1]
    _, buf = cv2.imencode('.jpg', img, params)
    return base64.b64encode(buf).decode('utf-8'), 'jpeg'


# ─────────────────────────────────────────────────────────────────────────────
# Flask routes
# ─────────────────────────────────────────────────────────────────────────────

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"status": "ok"})


@app.route('/process-image', methods=['POST'])
def process_image():
    """
    Full-resolution still-image processing.
    Accepts JSON: { image: <base64>, cvd_mode: <str|null>, lossless: <bool> }
    Returns: { processed_image, image_format, detected_colors, cvd_mode }
    """
    try:
        if not request.json:
            return jsonify({"error": "No JSON data provided"}), 400

        data       = request.json
        image_data = data.get('image')
        if not image_data:
            return jsonify({"error": "No image provided in request"}), 400

        # Decode incoming image
        try:
            img_bytes = base64.b64decode(image_data)
            nparr     = np.frombuffer(img_bytes, np.uint8)
            img       = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        except Exception as e:
            return jsonify({"error": f"Failed to decode image: {e}"}), 400

        if img is None:
            return jsonify({"error": "Invalid image data – could not decode"}), 400

        print(f"[ColorVista] process-image: {img.shape[1]}×{img.shape[0]}")

        cvd_mode        = normalize_cvd_mode(data.get('cvd_mode'))
        use_lossless    = bool(data.get('lossless', True))   # PNG by default

        working_img = apply_cvd_enhancement(img, cvd_mode) if cvd_mode != 'none' else img

        processed_img, detected_colors, detection_regions = detect_and_draw_colors(
            working_img, draw=True
        )

        # Encode – lossless PNG preserves every pixel; JPEG for smaller payloads
        if use_lossless:
            b64, fmt = encode_lossless(processed_img)
        else:
            b64, fmt = encode_jpeg(processed_img, quality=95)

        return jsonify({
            "processed_image":  b64,
            "image_format":     fmt,
            "detected_colors":  detected_colors,
            "detection_regions": detection_regions,
            "cvd_mode":         cvd_mode,
        })

    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/enhancement', methods=['POST'])
def enhancement():
    try:
        if not request.json:
            return jsonify({"error": "No JSON data provided"}), 400
        
        data = request.json
        image_data = data.get('image')

        if not image_data:
            return jsonify({"error": "No image provided in request"}), 400

        try:
            img_bytes = base64.b64decode(image_data)
            nparr = np.frombuffer(img_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        except Exception as decode_error:
            print(f"Decode error: {decode_error}")
            return jsonify({"error": f"Failed to decode image: {str(decode_error)}"}), 400

        if img is None:
            return jsonify({"error": "Invalid image data - could not decode"}), 400

        print(f"Processing image of size: {img.shape}")

        cvd_mode = data.get('cvd_mode')
        should_enhance = bool(cvd_mode)

        if should_enhance:
            processed_img = apply_cvd_enhancement(img, cvd_mode)
            detected_colors = []
        else:
            processed_img, detected_colors, _detection_regions = detect_and_draw_colors(
                img, draw=True
            )

        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 95]
        _, buffer = cv2.imencode('.jpg', processed_img, encode_param)
        processed_base64 = base64.b64encode(buffer).decode('utf-8')

        return jsonify({
            "processed_image": processed_base64,
            "detected_colors": detected_colors,
            "cvd_mode": normalize_cvd_mode(cvd_mode),
        })

    except Exception as e:
        print(f"Processing error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/process-frame', methods=['POST'])
def process_frame():
    """
    Medium-latency frame processing (camera / video).
    Accepts JSON: { image, cvd_mode, max_width, jpeg_quality, mode }
    """
    try:
        data       = request.get_json(silent=True) or {}
        image_data = data.get('image')
        if not image_data:
            return jsonify({"error": "No image provided in request"}), 400

        try:
            img_bytes = base64.b64decode(image_data)
            nparr     = np.frombuffer(img_bytes, np.uint8)
            img       = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        except Exception as e:
            return jsonify({"error": f"Failed to decode image: {e}"}), 400

        if img is None:
            return jsonify({"error": "Invalid image data – could not decode"}), 400

        cvd_mode     = data.get('cvd_mode')
        max_width    = int(data.get('max_width',    320) or 320)
        jpeg_quality = max(20, min(85, int(data.get('jpeg_quality', 55) or 55)))
        norm_mode    = normalize_cvd_mode(cvd_mode)

        if max_width > 0 and img.shape[1] > max_width:
            scale = max_width / float(img.shape[1])
            img   = cv2.resize(img,
                               (max(1, int(img.shape[1] * scale)),
                                max(1, int(img.shape[0] * scale))),
                               interpolation=cv2.INTER_AREA)

        detection_regions = []
        if norm_mode != 'none':
            processed_img   = apply_cvd_enhancement_live(img, norm_mode)
            detected_colors = []
        else:
            center_only     = (data.get('mode') == 'center')
            processed_img, detected_colors, detection_regions = detect_and_draw_colors(
                img, draw=True, center_only=center_only)

        b64, _ = encode_jpeg(processed_img, quality=jpeg_quality)

        return jsonify({
            "detected_colors": detected_colors,
            "detection_regions": detection_regions,
            "processed_image": b64,
            "cvd_mode":        norm_mode,
        })

    except ClientDisconnected:
        return ('', 204)
    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route('/process-live-frame', methods=['POST'])
def process_live_frame():
    """
    Dedicated ultra-low-latency VR live CVD enhancement endpoint.
    Accepts JSON: { image, cvd_mode, max_width, jpeg_quality }
    Returns: { processed_image, cvd_mode, processing_ms }
    """
    started = time.perf_counter()

    try:
        data       = request.get_json(silent=True) or {}
        image_data = data.get('image')
        if not image_data:
            return jsonify({"error": "No image provided in request"}), 400

        cvd_mode     = data.get('cvd_mode', 'none')
        max_width    = int(data.get('max_width',    160) or 160)
        jpeg_quality = max(20, min(85, int(data.get('jpeg_quality', 28) or 28)))

        img_bytes = base64.b64decode(image_data)
        nparr     = np.frombuffer(img_bytes, np.uint8)
        img       = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"error": "Invalid image data – could not decode"}), 400

        if max_width > 0 and img.shape[1] > max_width:
            scale = max_width / float(img.shape[1])
            img   = cv2.resize(img,
                               (max(1, int(img.shape[1] * scale)),
                                max(1, int(img.shape[0] * scale))),
                               interpolation=cv2.INTER_AREA)

        processed_img = apply_cvd_enhancement_live(img, cvd_mode)

        b64, _ = encode_jpeg(processed_img, quality=jpeg_quality)

        return jsonify({
            "processed_image": b64,
            "cvd_mode":        normalize_cvd_mode(cvd_mode),
            "processing_ms":   int((time.perf_counter() - started) * 1000),
        })

    except ClientDisconnected:
        return ('', 204)
    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ─────────────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    print("\n=== ColorVista Server Starting ===")
    print(f"Tracking {len(COLOR_RANGES)} distinct colours")
    print("Server:  http://0.0.0.0:5000")
    print("Ping:    http://0.0.0.0:5000/ping")
    print("Windows IP: run `ipconfig` and look for IPv4 Address")
    print("Mac/Linux:  run `ifconfig`")
    print("==================================\n")
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False, threaded=True)