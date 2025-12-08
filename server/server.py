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

try:
    from flask import Flask, request, jsonify
except ImportError:
    missing_deps.append('Flask')

if missing_deps:
    msg = (f"Missing Python dependencies: {', '.join(missing_deps)}.\n"
           "Install them with: `pip install -r requirements.txt`\n"
           "Or inside the project venv: `.venv\\Scripts\\pip.exe install -r requirements.txt` on Windows.")
    raise ImportError(msg)

app = Flask(__name__)

def detect_and_draw_colors(image, draw=True, center_only=False, roi_size=80):
    # Downscale for faster processing if needed
    h, w = image.shape[:2]
    if w > 640:
        scale = 640 / w
        new_w = int(w * scale)
        new_h = int(h * scale)
        image = cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_LINEAR)
    
    # Convert to HSV color space
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Define color ranges in HSV (available to both center-only and full modes)
    # Ranges selected to be reasonably distinct and cover common names.
    colors = {
    "Red": [
        (np.array([0, 120, 50]), np.array([8, 255, 255])),
        (np.array([170, 120, 50]), np.array([180, 255, 255]))
    ],
    "Orange": [(np.array([9, 120, 50]), np.array([20, 255, 255]))],
    "Yellow": [(np.array([20, 100, 60]), np.array([35, 255, 255]))],
    "Lime": [(np.array([35, 80, 60]), np.array([45, 255, 255]))],
    "Green": [(np.array([45, 80, 40]), np.array([85, 255, 255]))],
    "Teal": [(np.array([80, 50, 40]), np.array([100, 255, 255]))],
    "Cyan": [(np.array([85, 60, 50]), np.array([100, 255, 255]))],
    "Blue": [(np.array([100, 80, 40]), np.array([130, 255, 255]))],
    "Navy": [(np.array([100, 80, 20]), np.array([130, 255, 120]))],
    "Indigo": [(np.array([120, 80, 30]), np.array([140, 255, 210]))],
    "Purple": [(np.array([135, 50, 40]), np.array([155, 255, 255]))],
    "Violet": [(np.array([145, 30, 60]), np.array([160, 255, 255]))],
    "Magenta": [(np.array([145, 80, 60]), np.array([170, 255, 255]))],
    "Pink": [(np.array([160, 30, 120]), np.array([175, 200, 255]))],
    "Maroon": [
        (np.array([0, 80, 20]), np.array([8, 255, 120])),
        (np.array([172, 80, 20]), np.array([180, 255, 120]))
    ],
    "Brown": [(np.array([8, 100, 20]), np.array([20, 255, 140]))],
    "Olive": [(np.array([20, 40, 30]), np.array([40, 200, 160]))],
    "Coral": [(np.array([2, 100, 100]), np.array([12, 255, 255]))],
    "Salmon": [(np.array([0, 40, 100]), np.array([15, 200, 255]))],
    "Beige": [(np.array([15, 10, 160]), np.array([35, 80, 255]))],
    "Cream": [(np.array([18, 5, 200]), np.array([35, 60, 255]))],
    "Mint": [(np.array([40, 20, 160]), np.array([80, 100, 255]))],
    "Lavender": [(np.array([125, 15, 170]), np.array([155, 90, 255]))],
    "ForestGreen": [(np.array([35, 60, 20]), np.array([85, 255, 140]))],
    "SkyBlue": [(np.array([90, 30, 160]), np.array([115, 255, 255]))],
    "Turquoise": [(np.array([85, 60, 90]), np.array([100, 255, 255]))],
    "Gold": [(np.array([18, 130, 80]), np.array([30, 255, 255]))],
    "Khaki": [(np.array([20, 30, 120]), np.array([40, 120, 230]))],
    "Crimson": [
        (np.array([0, 150, 60]), np.array([4, 255, 255])),
        (np.array([175, 150, 60]), np.array([180, 255, 255]))
    ],
    "Silver": [(np.array([0, 0, 130]), np.array([180, 40, 210]))],
    "Gray": [(np.array([0, 0, 30]), np.array([180, 40, 200]))],
    "White": [(np.array([0, 0, 200]), np.array([180, 30, 255]))],
    "Black": [(np.array([0, 0, 0]), np.array([180, 255, 35]))]
}

    # Refined color palette for drawing - used for center-only marker
    # BGR values chosen to be visually distinct and correspond to HSV names above.
    color_bgr = {
        "Red": (0, 0, 220),
        "Orange": (0, 120, 255),
        "Yellow": (0, 215, 255),
        "Lime": (50, 205, 50),
        "Green": (60, 180, 75),
        "Teal": (200, 180, 50),
        "Cyan": (255, 200, 0),
        "Blue": (255, 120, 0),
        "Navy": (130, 90, 0),
        "Indigo": (160, 60, 60),
        "Purple": (200, 80, 180),
        "Violet": (215, 100, 180),
        "Magenta": (220, 60, 180),
        "Pink": (203, 192, 255),
        "Maroon": (0, 0, 110),
        "Brown": (42, 42, 165),
        "Olive": (85, 107, 47),
        "Coral": (80, 127, 255),
        "Salmon": (114, 128, 250),
        "Beige": (220, 205, 190),
        "Cream": (230, 220, 200),
        "Mint": (180, 255, 200),
        "Lavender": (230, 190, 255),
        "ForestGreen": (34, 139, 34),
        "SkyBlue": (235, 206, 135),
        "Turquoise": (208, 224, 64),
        "Gold": (0, 215, 255),
        "Khaki": (140, 150, 200),
        "Crimson": (0, 20, 180),
        "Silver": (192, 192, 192),
        "Gray": (150, 150, 150),
        "White": (255, 255, 255),
        "Black": (20, 20, 20)
    }

    # Prepare output image and overlay early so center-only path can draw markers
    output = image.copy()
    overlay = output.copy()

    # Fast center-only detection path: analyze small ROI around image center
    if center_only:
        ch, cw = hsv.shape[:2]
        half = max(4, int(roi_size / 2))
        y1 = max(0, ch // 2 - half)
        y2 = min(ch, ch // 2 + half)
        x1 = max(0, cw // 2 - half)
        x2 = min(cw, cw // 2 + half)

        roi_hsv = hsv[y1:y2, x1:x2]
        roi_bgr = image[y1:y2, x1:x2]
        roi_area = roi_hsv.shape[0] * roi_hsv.shape[1]

        # Count mask pixels for each color
        counts = {}
        for color_name, ranges in colors.items():
            mask = np.zeros(roi_hsv.shape[:2], dtype="uint8")
            for (lower, upper) in ranges:
                mask = cv2.bitwise_or(mask, cv2.inRange(roi_hsv, lower, upper))
            # small morphology to reduce noise
            kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
            mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
            counts[color_name] = int(cv2.countNonZero(mask))

        # Choose best color by max count
        best_color = None
        best_count = 0
        for k, v in counts.items():
            if v > best_count:
                best_count = v
                best_color = k

        # Threshold: require at least 1% of ROI area or >10 pixels
        if best_count < max(roi_area * 0.01, 10):
            best_color = None

        detected = []
        if best_color:
            detected = [best_color]

        # Draw small marker at center on output for UX
        if draw:
            center_x = (x1 + x2) // 2
            center_y = (y1 + y2) // 2
            if best_color:
                col = color_bgr.get(best_color, (0, 255, 255))
            else:
                col = (255, 255, 255)
            cv2.circle(output, (center_x, center_y), max(6, int(min(w, h) * 0.02)), col, 3, lineType=cv2.LINE_AA)
            # small semi-transparent inner fill
            overlay = output.copy()
            cv2.circle(overlay, (center_x, center_y), max(4, int(min(w, h) * 0.015)), col, -1, lineType=cv2.LINE_AA)
            cv2.addWeighted(overlay, 0.6, output, 0.4, 0, output)
            if best_color:
                font = cv2.FONT_HERSHEY_SIMPLEX
                # choose contrasting text color based on marker brightness
                b, g, r = col
                brightness = 0.299 * r + 0.587 * g + 0.114 * b
                text_color = (0, 0, 0) if brightness > 150 else (255, 255, 255)
                # draw small background rectangle for readability (inverse of text color)
                (text_w, text_h), baseline = cv2.getTextSize(best_color, font, 0.6, 2)
                text_x = center_x + 10
                text_y = center_y - 10
                bg_color = (255, 255, 255) if text_color == (0, 0, 0) else (0, 0, 0)
                x1 = max(0, text_x - 2)
                y1 = max(0, text_y - text_h - 2)
                x2 = min(output.shape[1], text_x + text_w + 2)
                y2 = min(output.shape[0], text_y + 2)
                cv2.rectangle(output, (x1, y1), (x2, y2), bg_color, -1)
                cv2.putText(output, best_color, (text_x, text_y), font, 0.6, text_color, 2, lineType=cv2.LINE_AA)

        return (output, detected) if draw else detected
    
    # (colors, color_bgr and output/overlay already initialized above)

    # Estimate background HSV
    h, w = hsv.shape[:2]
    pad_h = max(1, int(0.05 * h))
    pad_w = max(1, int(0.05 * w))
    samples = []
    samples.append(hsv[0:pad_h, :].reshape(-1, 3))
    samples.append(hsv[h - pad_h:h, :].reshape(-1, 3))
    samples.append(hsv[:, 0:pad_w].reshape(-1, 3))
    samples.append(hsv[:, w - pad_w:w].reshape(-1, 3))
    border_pixels = np.vstack(samples)
    bg_h, bg_s, bg_v = np.median(border_pixels, axis=0).astype(int)

    color_contours = {name: [] for name in colors.keys()}

    for color_name, ranges in colors.items():
        mask = np.zeros(hsv.shape[:2], dtype="uint8")

        for (lower, upper) in ranges:
            mask = cv2.bitwise_or(mask, cv2.inRange(hsv, lower, upper))

        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=1)

        contours, _ = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        for c in contours:
            area = cv2.contourArea(c)
            if area > 50:
                mask = np.zeros(hsv.shape[:2], dtype=np.uint8)
                cv2.drawContours(mask, [c], -1, 255, -1)
                mean_hsv = cv2.mean(hsv, mask=mask)
                mean_h = int(mean_hsv[0])
                mean_s = int(mean_hsv[1])
                mean_v = int(mean_hsv[2])

                hue_diff = abs(mean_h - bg_h)
                hue_diff = min(hue_diff, 180 - hue_diff)

                if (hue_diff <= 12 and abs(mean_v - bg_v) <= 40) or mean_s <= 30:
                    continue

                ((x, y), radius) = cv2.minEnclosingCircle(c)
                color_contours[color_name].append({
                    "contour": c,
                    "area": area,
                    "center": (int(x), int(y)),
                    "radius": int(radius)
                })

    img_area = image.shape[0] * image.shape[1]
    totals = {name: sum([ci["area"] for ci in clist]) for name, clist in color_contours.items()}

    relative_threshold = max(0.03 * img_area, 1000)
    major_colors = [name for name, total in totals.items() if total >= relative_threshold]

    if not major_colors:
        sorted_colors = sorted(totals.items(), key=lambda x: x[1], reverse=True)
        major_colors = [name for name, _ in sorted_colors[:3] if _ > 0]

    detected_colors = []

    # Refined color palette for drawing - more vibrant and elegant
    # Keep mapping consistent with the center-only palette above.
    color_bgr = {
        "Red": (0, 0, 220),
        "Orange": (0, 120, 255),
        "Yellow": (0, 215, 255),
        "Lime": (50, 205, 50),
        "Green": (60, 180, 75),
        "Teal": (200, 180, 50),
        "Cyan": (255, 200, 0),
        "Blue": (255, 120, 0),
        "Navy": (130, 90, 0),
        "Indigo": (160, 60, 60),
        "Purple": (200, 80, 180),
        "Violet": (215, 100, 180),
        "Magenta": (220, 60, 180),
        "Pink": (203, 192, 255),
        "Maroon": (0, 0, 110),
        "Brown": (42, 42, 165),
        "Olive": (85, 107, 47),
        "Coral": (80, 127, 255),
        "Salmon": (114, 128, 250),
        "Beige": (220, 205, 190),
        "Cream": (230, 220, 200),
        "Mint": (180, 255, 200),
        "Lavender": (230, 190, 255),
        "ForestGreen": (34, 139, 34),
        "SkyBlue": (235, 206, 135),
        "Turquoise": (208, 224, 64),
        "Gold": (0, 215, 255),
        "Khaki": (140, 150, 200),
        "Crimson": (0, 20, 180),
        "Silver": (192, 192, 192),
        "Gray": (150, 150, 150),
        "White": (255, 255, 255),
        "Black": (20, 20, 20)
    }

    for color_name in major_colors:
        for info in color_contours.get(color_name, []):
            area = info["area"]
            radius = info["radius"]
            (x, y) = info["center"]
            contour = info["contour"]

            if area >= max(0.005 * img_area, 500) and radius > 5:
                draw_color = color_bgr.get(color_name, (0, 255, 255))

                if draw:
                    # Draw contour with thick, bold outline for maximum visibility
                    cv2.drawContours(output, [contour], 0, draw_color, 4, lineType=cv2.LINE_AA)
                    
                    # Add extra bold outer outline for better visibility
                    cv2.drawContours(output, [contour], 0, (255, 255, 255), 1, lineType=cv2.LINE_AA)

                    # Draw circle outline as backup
                    padded_radius = max(radius + 2, int(np.sqrt(area / np.pi)) + 1)
                    cv2.circle(output, (x, y), padded_radius, draw_color, 3, lineType=cv2.LINE_AA)

                    # Add text label
                    label = color_name
                    font = cv2.FONT_HERSHEY_SIMPLEX
                    font_scale = max(0.4, min(0.8, padded_radius / 50.0))
                    thickness = 2
                    (text_w, text_h), baseline = cv2.getTextSize(label, font, font_scale, thickness)

                    # Position text above center
                    text_x = max(5, min(int(x - text_w / 2), output.shape[1] - text_w - 5))
                    text_y = max(text_h + 5, int(y - padded_radius - 5))

                    # Draw text with black background for visibility
                    cv2.rectangle(output, (text_x - 2, text_y - text_h - 2), (text_x + text_w + 2, text_y + 2), (0, 0, 0), -1)
                    cv2.putText(output, label, (text_x, text_y), font, font_scale, (255, 255, 255), thickness, lineType=cv2.LINE_AA)

                detected_colors.append(color_name)

    detected_colors = list(dict.fromkeys(detected_colors))
    print(f"Detected major colors: {detected_colors if detected_colors else 'None'}")
    if draw:
        return output, detected_colors
    else:
        return detected_colors

@app.route('/process-image', methods=['POST'])
def process_image():
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
        processed_img, detected_colors = detect_and_draw_colors(img, draw=True)

        # Use higher quality JPEG encoding
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 95]
        _, buffer = cv2.imencode('.jpg', processed_img, encode_param)
        processed_base64 = base64.b64encode(buffer).decode('utf-8')

        return jsonify({"processed_image": processed_base64, "detected_colors": detected_colors})

    except Exception as e:
        print(f"Processing error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"status": "ok"})


@app.route('/process-frame', methods=['POST'])
def process_frame():
    try:
        # Accept JSON with base64 image, or raw bytes
        if request.json:
            data = request.json
            image_data = data.get('image')
        else:
            image_data = None

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

        # If client requests center-only, do the faster path
        mode = (request.json or {}).get('mode') if request.json else None
        center_only = (mode == 'center')

        # Process with drawing enabled to show outlines and detected colors
        processed_img, detected_colors = detect_and_draw_colors(img, draw=True, center_only=center_only)
        
        # Encode with lower quality for faster transmission (faster = less latency)
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 60]
        _, buffer = cv2.imencode('.jpg', processed_img, encode_param)
        processed_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return jsonify({
            "detected_colors": detected_colors,
            "processed_image": processed_base64
        })
    except Exception as e:
        print(f"Frame processing error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("\n=== ColorVista Server Starting ===")
    print("Server will be accessible at: http://0.0.0.0:5000")
    print("To find your local IP address:")
    print("  Windows: ipconfig (look for IPv4 Address)")
    print("  Mac/Linux: ifconfig")
    print("Then update SERVER_URL in MediaUpload.tsx with your IP")
    print("Example: http://192.168.x.x:5000/process-image")
    print("==================================\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)