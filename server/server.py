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

    # Enhanced color ranges with better accuracy
    colors = {
        "Red": [
            (np.array([0, 100, 70]), np.array([10, 255, 255])),
            (np.array([170, 100, 70]), np.array([180, 255, 255]))
        ],
        "Orange": [(np.array([11, 100, 100]), np.array([25, 255, 255]))],
        "Yellow": [(np.array([26, 80, 100]), np.array([38, 255, 255]))],
        "Lime": [(np.array([39, 100, 100]), np.array([50, 255, 255]))],
        "Green": [(np.array([51, 80, 50]), np.array([85, 255, 255]))],
        "Cyan": [(np.array([86, 80, 80]), np.array([100, 255, 255]))],
        "Blue": [(np.array([101, 100, 80]), np.array([130, 255, 255]))],
        "Purple": [(np.array([131, 80, 80]), np.array([155, 255, 255]))],
        "Magenta": [(np.array([156, 80, 80]), np.array([169, 255, 255]))],
        "Pink": [(np.array([160, 30, 150]), np.array([175, 180, 255]))],
        "Brown": [(np.array([10, 100, 20]), np.array([25, 255, 120]))],
        "White": [(np.array([0, 0, 200]), np.array([180, 25, 255]))],
        "Gray": [(np.array([0, 0, 50]), np.array([180, 25, 200]))],
        "Black": [(np.array([0, 0, 0]), np.array([180, 255, 50]))]
    }

    # Refined BGR values for drawing - more accurate and vibrant
    color_bgr = {
        "Red": (0, 0, 255),
        "Orange": (0, 165, 255),
        "Yellow": (0, 255, 255),
        "Lime": (0, 255, 0),
        "Green": (0, 128, 0),
        "Cyan": (255, 255, 0),
        "Blue": (255, 0, 0),
        "Purple": (128, 0, 128),
        "Magenta": (255, 0, 255),
        "Pink": (203, 192, 255),
        "Brown": (19, 69, 139),
        "White": (255, 255, 255),
        "Gray": (128, 128, 128),
        "Black": (0, 0, 0)
    }

    # Prepare output image
    output = image.copy()

    # Fast center-only detection path
    if center_only:
        ch, cw = hsv.shape[:2]
        half = max(4, int(roi_size / 2))
        y1 = max(0, ch // 2 - half)
        y2 = min(ch, ch // 2 + half)
        x1 = max(0, cw // 2 - half)
        x2 = min(cw, cw // 2 + half)

        roi_hsv = hsv[y1:y2, x1:x2]
        roi_area = roi_hsv.shape[0] * roi_hsv.shape[1]

        # Count mask pixels for each color
        counts = {}
        for color_name, ranges in colors.items():
            mask = np.zeros(roi_hsv.shape[:2], dtype="uint8")
            for (lower, upper) in ranges:
                mask = cv2.bitwise_or(mask, cv2.inRange(roi_hsv, lower, upper))
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

        # Threshold: require at least 2% of ROI area
        if best_count < max(roi_area * 0.02, 15):
            best_color = None

        detected = [best_color] if best_color else []

        # Draw minimal, aesthetic marker at center
        if draw:
            center_x = (x1 + x2) // 2
            center_y = (y1 + y2) // 2
            
            if best_color:
                col = color_bgr.get(best_color, (255, 255, 255))
                # Outer circle with semi-transparent fill
                overlay = output.copy()
                cv2.circle(overlay, (center_x, center_y), 20, col, -1, lineType=cv2.LINE_AA)
                cv2.addWeighted(overlay, 0.3, output, 0.7, 0, output)
                
                # Inner bright ring
                cv2.circle(output, (center_x, center_y), 20, col, 3, lineType=cv2.LINE_AA)
                
                # Text with modern styling
                font = cv2.FONT_HERSHEY_DUPLEX
                text = best_color
                font_scale = 0.5
                thickness = 1
                
                (text_w, text_h), baseline = cv2.getTextSize(text, font, font_scale, thickness)
                
                # Position text below the circle
                text_x = center_x - text_w // 2
                text_y = center_y + 35
                
                # Ensure text stays within bounds
                text_x = max(5, min(text_x, output.shape[1] - text_w - 5))
                text_y = max(text_h + 5, min(text_y, output.shape[0] - 5))
                
                # Semi-transparent rounded background
                padding = 6
                bg_x1 = text_x - padding
                bg_y1 = text_y - text_h - padding
                bg_x2 = text_x + text_w + padding
                bg_y2 = text_y + padding
                
                overlay = output.copy()
                cv2.rectangle(overlay, (bg_x1, bg_y1), (bg_x2, bg_y2), (0, 0, 0), -1)
                cv2.addWeighted(overlay, 0.6, output, 0.4, 0, output)
                
                # White text for maximum contrast
                cv2.putText(output, text, (text_x, text_y), font, font_scale, (255, 255, 255), thickness, lineType=cv2.LINE_AA)

        return (output, detected) if draw else detected
    
    # Full image detection
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
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)

        contours, _ = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        for c in contours:
            area = cv2.contourArea(c)
            if area > 100:
                mask_temp = np.zeros(hsv.shape[:2], dtype=np.uint8)
                cv2.drawContours(mask_temp, [c], -1, 255, -1)
                mean_hsv = cv2.mean(hsv, mask=mask_temp)
                mean_h = int(mean_hsv[0])
                mean_s = int(mean_hsv[1])
                mean_v = int(mean_hsv[2])

                hue_diff = abs(mean_h - bg_h)
                hue_diff = min(hue_diff, 180 - hue_diff)

                # Improved background filtering
                if (hue_diff <= 10 and abs(mean_s - bg_s) <= 20 and abs(mean_v - bg_v) <= 30) or mean_s <= 25:
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

    relative_threshold = max(0.02 * img_area, 800)
    major_colors = [name for name, total in totals.items() if total >= relative_threshold]

    if not major_colors:
        sorted_colors = sorted(totals.items(), key=lambda x: x[1], reverse=True)
        major_colors = [name for name, _ in sorted_colors[:3] if _ > 0]

    detected_colors = []

    for color_name in major_colors:
        for info in color_contours.get(color_name, []):
            area = info["area"]
            radius = info["radius"]
            (x, y) = info["center"]
            contour = info["contour"]

            if area >= max(0.003 * img_area, 300) and radius > 8:
                draw_color = color_bgr.get(color_name, (255, 255, 255))

                if draw:
                    # Semi-transparent contour fill
                    overlay = output.copy()
                    cv2.drawContours(overlay, [contour], 0, draw_color, -1, lineType=cv2.LINE_AA)
                    cv2.addWeighted(overlay, 0.15, output, 0.85, 0, output)
                    
                    # Bold outline
                    cv2.drawContours(output, [contour], 0, draw_color, 3, lineType=cv2.LINE_AA)

                    # Minimal text label with modern styling
                    label = color_name
                    font = cv2.FONT_HERSHEY_DUPLEX
                    font_scale = max(0.4, min(0.7, radius / 60.0))
                    thickness = 1
                    (text_w, text_h), baseline = cv2.getTextSize(label, font, font_scale, thickness)

                    # Position text at top-center of detected region
                    text_x = x - text_w // 2
                    text_y = y - radius - 8

                    # Keep text within image bounds
                    text_x = max(5, min(text_x, output.shape[1] - text_w - 5))
                    text_y = max(text_h + 5, min(text_y, output.shape[0] - 5))

                    # Semi-transparent rounded background
                    padding = 5
                    bg_x1 = text_x - padding
                    bg_y1 = text_y - text_h - padding
                    bg_x2 = text_x + text_w + padding
                    bg_y2 = text_y + padding
                    
                    overlay = output.copy()
                    cv2.rectangle(overlay, (bg_x1, bg_y1), (bg_x2, bg_y2), (0, 0, 0), -1)
                    cv2.addWeighted(overlay, 0.7, output, 0.3, 0, output)
                    
                    # White text for maximum visibility
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