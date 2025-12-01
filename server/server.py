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
    colors = {
        "Red": [
            (np.array([0, 120, 70]), np.array([10, 255, 255])),
            (np.array([170, 120, 70]), np.array([180, 255, 255])) # Red wraps around
        ],
        "Blue": [(np.array([94, 80, 2]), np.array([126, 255, 255]))],
        "Green": [(np.array([25, 52, 72]), np.array([102, 255, 255]))],
        "Yellow": [(np.array([20, 100, 100]), np.array([30, 255, 255]))]
    }
    
    output = image.copy()
    
    # Loop through each color definition
    for color_name, ranges in colors.items():
        mask = np.zeros(hsv.shape[:2], dtype="uint8")
        
        # Combine masks if multiple ranges exist (like Red)
        for (lower, upper) in ranges:
            mask = cv2.bitwise_or(mask, cv2.inRange(hsv, lower, upper))
            
        # Clean up noise
        mask = cv2.erode(mask, None, iterations=2)
        mask = cv2.dilate(mask, None, iterations=2)
        
        # Find contours
        contours, _ = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        for c in contours:
            # Filter small blobs (noise)
            if cv2.contourArea(c) > 1000:
                # 2. Encircle the object (Minimum Enclosing Circle)
                ((x, y), radius) = cv2.minEnclosingCircle(c)
                
                # Draw the circle
                cv2.circle(output, (int(x), int(y)), int(radius), (0, 255, 255), 3)
                
                # 3. Write the color name on top
                text_x = int(x) - 20
                text_y = int(y) - int(radius) - 10
                
                # Add background for text readability
                cv2.putText(output, color_name, (text_x, text_y), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 4) # Black border
                cv2.putText(output, color_name, (text_x, text_y), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2) # White text

    return output

@app.route('/process-image', methods=['POST'])
def process_image():
    try:
        data = request.json
        image_data = data.get('image')

        if not image_data:
            return jsonify({"error": "No image provided"}), 400

        # Decode base64 to image
        img_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"error": "Invalid image data"}), 400

        # Process image
        processed_img = detect_and_draw_colors(img)

        # Encode back to base64
        _, buffer = cv2.imencode('.jpg', processed_img)
        processed_base64 = base64.b64encode(buffer).decode('utf-8')

        return jsonify({"processed_image": processed_base64})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run on 0.0.0.0 to be accessible from other devices (like your phone)
    app.run(host='0.0.0.0', port=5000, debug=True)