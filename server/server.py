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
    # 1. Convert to HSV color space
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    # Define color ranges (Lower, Upper) in HSV
    # Note: HSV in OpenCV is H: 0-179, S: 0-255, V: 0-255
    # Ranges are more lenient to detect colors better
    colors = {
        "Red": [
            (np.array([0, 50, 50]), np.array([10, 255, 255])),
            (np.array([170, 50, 50]), np.array([180, 255, 255])) # Red wraps around
        ],
        "Blue": [(np.array([90, 50, 50]), np.array([130, 255, 255]))],
        "Green": [(np.array([40, 40, 40]), np.array([90, 255, 255]))],
        "Yellow": [(np.array([15, 50, 50]), np.array([35, 255, 255]))]
    }
    
    output = image.copy()
    detected_colors = []  # Track detected colors
    
    # Loop through each color definition
    for color_name, ranges in colors.items():
        mask = np.zeros(hsv.shape[:2], dtype="uint8")
        
        # Combine masks if multiple ranges exist (like Red)
        for (lower, upper) in ranges:
            mask = cv2.bitwise_or(mask, cv2.inRange(hsv, lower, upper))
            
        # Clean up noise with adaptive morphology
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=1)
        
        # Find contours
        contours, _ = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        for c in contours:
            area = cv2.contourArea(c)
            # Filter small blobs (noise) - adjusted threshold
            if area > 500:
                # 2. Encircle the object (Minimum Enclosing Circle)
                ((x, y), radius) = cv2.minEnclosingCircle(c)
                
                # Only draw if radius is reasonable
                if radius > 5:
                    # Draw the circle with color-specific color
                    circle_color = (0, 255, 255) if color_name != "Yellow" else (0, 255, 255)
                    cv2.circle(output, (int(x), int(y)), int(radius), circle_color, 3)
                    
                    # 3. Write the color name on top
                    text_x = int(x) - 40
                    text_y = int(y) - int(radius) - 15
                    
                    # Ensure text is within bounds
                    text_x = max(10, text_x)
                    text_y = max(30, text_y)
                    
                    # Add background for text readability
                    cv2.putText(output, color_name, (text_x, text_y), 
                               cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 0), 5) # Black border
                    cv2.putText(output, color_name, (text_x, text_y), 
                               cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2) # White text
                    
                    detected_colors.append(color_name)
    
    print(f"Detected colors: {detected_colors if detected_colors else 'None'}")
    return output

@app.route('/process-image', methods=['POST'])
def process_image():
    try:
        # Validate request
        if not request.json:
            return jsonify({"error": "No JSON data provided"}), 400
        
        data = request.json
        image_data = data.get('image')

        if not image_data:
            return jsonify({"error": "No image provided in request"}), 400

        try:
            # Decode base64 to image
            img_bytes = base64.b64decode(image_data)
            nparr = np.frombuffer(img_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        except Exception as decode_error:
            print(f"Decode error: {decode_error}")
            return jsonify({"error": f"Failed to decode image: {str(decode_error)}"}), 400

        if img is None:
            return jsonify({"error": "Invalid image data - could not decode"}), 400

        # Process image
        print(f"Processing image of size: {img.shape}")
        processed_img = detect_and_draw_colors(img)

        # Encode back to base64
        _, buffer = cv2.imencode('.jpg', processed_img)
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
    
    # Run on 0.0.0.0 to be accessible from other devices (like your phone)
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)