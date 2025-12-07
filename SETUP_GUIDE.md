# ColorVista Server Setup Guide

## Issues Fixed

### 1. **Server Connection Failed**
   - **Problem**: Hardcoded IP address might not match your network
   - **Fix**: Updated error messages with debugging instructions

### 2. **Color Detection Not Working**
   - **Problem**: HSV color ranges were too restrictive (high saturation/value thresholds)
   - **Fix**: Relaxed color ranges for better detection:
     - Red: `[0-10, 50-255, 50-255]` and `[170-180, 50-255, 50-255]`
     - Blue: `[90-130, 50-255, 50-255]`
     - Green: `[40-90, 40-255, 40-255]`
     - Yellow: `[15-35, 50-255, 50-255]`

### 3. **Morphological Operations**
   - **Problem**: Aggressive erosion/dilation removed valid detections
   - **Fix**: Using `MORPH_OPEN` and `MORPH_CLOSE` with elliptical kernel

### 4. **Contour Area Threshold**
   - **Problem**: Minimum area was 1000px (too large)
   - **Fix**: Reduced to 500px for better detection of smaller objects

### 5. **Error Handling**
   - **Problem**: Generic error messages made debugging difficult
   - **Fix**: Detailed error messages in both frontend and backend

## Setup Instructions

### Step 1: Find Your Computer's IP Address

**Windows:**
```powershell
ipconfig
```
Look for the IPv4 Address under your WiFi adapter (usually something like `192.168.x.x`)

**Mac/Linux:**
```bash
ifconfig
```

### Step 2: Update the Server URL in MediaUpload.tsx

Edit: `d:\Media\FYP\ColorVista\screens\MediaUpload.tsx`

Replace the IP in the `SERVER_URL`:
```javascript
// Example: Change this
const SERVER_URL = 'http://192.168.1.12:5000/process-image';

// To your actual IP (keep :5000 port)
const SERVER_URL = 'http://192.168.x.x:5000/process-image';
```

### Step 3: Start the Python Server

```powershell
# Navigate to project folder
cd D:\Media\FYP\ColorVista

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install dependencies (if needed)
pip install -r requirements.txt

# Run the server
python server\server.py
```

You should see output like:
```
=== ColorVista Server Starting ===
Server will be accessible at: http://0.0.0.0:5000
...
 * Running on http://0.0.0.0:5000
```

### Step 4: Test the Connection

1. Make sure your phone/emulator and computer are **on the same WiFi network**
2. Run the Expo app
3. Navigate to Media Upload screen
4. Select an image with red, blue, green, or yellow objects
5. Tap "Identify Colors"

## Troubleshooting

### "Cannot reach server" Error
- ✓ Server is running (`python server/server.py`)
- ✓ IP address is correct in `MediaUpload.tsx`
- ✓ Both devices on same WiFi network
- ✓ Firewall not blocking port 5000

### Colors Not Detected
- Make sure objects have clear, saturated colors
- Lighting conditions matter - better with good natural light
- Try solid-colored objects first (colored paper, markers)

### Server Error 500
- Check console output for detailed error message
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Python version must be 3.8+

## Key Improvements

| Issue | Before | After |
|-------|--------|-------|
| HSV Saturation Range | 120-255 | 50-255 |
| Contour Area Threshold | 1000px | 500px |
| Error Messages | Generic | Detailed |
| Timeout Duration | 10s | 30s |
| Morphology | Aggressive | Balanced |

## Testing Checklist

- [ ] Server running without errors
- [ ] Correct IP address in `MediaUpload.tsx`
- [ ] App and server on same WiFi
- [ ] Red objects detected correctly
- [ ] Blue objects detected correctly
- [ ] Green objects detected correctly
- [ ] Yellow objects detected correctly
