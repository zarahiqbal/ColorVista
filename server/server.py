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

def detect_and_draw_colors(image):
    # Convert to HSV color space
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    # Define color ranges in HSV
    colors = {
        "Red": [
            (np.array([0, 50, 50]), np.array([10, 255, 255])),
            (np.array([170, 50, 50]), np.array([180, 255, 255]))
        ],
        "Blue": [(np.array([90, 50, 50]), np.array([130, 255, 255]))],
        "Green": [(np.array([40, 40, 40]), np.array([90, 255, 255]))],
        "Yellow": [(np.array([15, 50, 50]), np.array([35, 255, 255]))],
        "Orange": [(np.array([10, 100, 20]), np.array([25, 255, 255]))],
        "Cyan": [(np.array([80, 50, 50]), np.array([100, 255, 255]))],
        "Purple": [(np.array([130, 50, 50]), np.array([145, 255, 255]))],
        "Pink": [(np.array([145, 50, 50]), np.array([170, 255, 255]))],
        "White": [(np.array([0, 0, 200]), np.array([180, 50, 255]))],
        "Black": [(np.array([0, 0, 0]), np.array([180, 255, 30]))],
        "Gray": [(np.array([0, 0, 50]), np.array([180, 50, 200]))]
    }
    
    # Create a copy with slight brightness boost for better visibility
    output = image.copy()
    
    # Create an overlay for semi-transparent effects
    overlay = output.copy()

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
    color_bgr = {
        "Red": (0, 50, 255),
        "Blue": (255, 120, 0),
        "Green": (80, 220, 100),
        "Yellow": (0, 220, 255),
        "Orange": (0, 140, 255),
        "Cyan": (255, 240, 0),
        "Purple": (220, 100, 180),
        "Pink": (180, 150, 255),
        "White": (240, 240, 240),
        "Black": (40, 40, 40),
        "Gray": (150, 150, 150)
    }

    for color_name in major_colors:
        for info in color_contours.get(color_name, []):
            area = info["area"]
            radius = info["radius"]
            (x, y) = info["center"]

            if area >= max(0.005 * img_area, 500) and radius > 5:
                draw_color = color_bgr.get(color_name, (0, 255, 255))

                # Subtle radius padding
                padded_radius = max(radius + 3, int(np.sqrt(area / np.pi)) + 2)

                # Draw semi-transparent filled circle for subtle highlight
                cv2.circle(overlay, (x, y), padded_radius, draw_color, -1, lineType=cv2.LINE_AA)
                
                # Blend the overlay (15% opacity for subtle effect)
                cv2.addWeighted(overlay, 0.15, output, 0.85, 0, output)
                overlay = output.copy()

                # Draw thin, elegant circle outline
                cv2.circle(output, (x, y), padded_radius, draw_color, 2, lineType=cv2.LINE_AA)

                # Refined text styling
                label = color_name
                font = cv2.FONT_HERSHEY_SIMPLEX
                font_scale = max(0.5, min(0.9, padded_radius / 60.0))
                thickness = 2
                (text_w, text_h), baseline = cv2.getTextSize(label, font, font_scale, thickness)

                # Position text elegantly above the circle
                text_x = int(x - text_w / 2)
                text_y = int(y - padded_radius - 8)
                
                if text_y - text_h < 5:
                    text_y = int(y - padded_radius / 2)

                # Draw text with subtle shadow for depth
                shadow_offset = 2
                cv2.putText(output, label, (text_x + shadow_offset, text_y + shadow_offset), 
                           font, font_scale, (0, 0, 0), thickness + 1, lineType=cv2.LINE_AA)
                
                # Main text in white for contrast
                cv2.putText(output, label, (text_x, text_y), 
                           font, font_scale, (255, 255, 255), thickness, lineType=cv2.LINE_AA)

                detected_colors.append(color_name)

    detected_colors = list(dict.fromkeys(detected_colors))
    print(f"Detected major colors: {detected_colors if detected_colors else 'None'}")
    return output

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
        processed_img = detect_and_draw_colors(img)

        # Use higher quality JPEG encoding
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 95]
        _, buffer = cv2.imencode('.jpg', processed_img, encode_param)
        processed_base64 = base64.b64encode(buffer).decode('utf-8')

        return jsonify({"processed_image": processed_base64})

    except Exception as e:
        print(f"Processing error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"status": "ok"})

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