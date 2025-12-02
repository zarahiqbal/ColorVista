# ColorVista — Local Server & Setup

Short instructions for setting up and running the local Python server used by the ColorVista project.

**Quick start (Windows, using the project venv)**

- **Activate the virtual environment** (PowerShell):

```powershell
& .\.venv\Scripts\Activate.ps1
```

- **Install dependencies** (from project root):

```powershell
python -m pip install -r requirements.txt
```

- **Run the server** (recommended — uses the venv Python):

```powershell
python server\server.py
```

Alternatively (without activating), run the venv Python directly from project root:

```powershell
D:\Media\FYP\ColorVista\.venv\Scripts\python.exe server\server.py
```

Why use the venv Python?
- The `py` launcher or system `python` may not use the project's virtual environment. If you see ImportError for packages that you already installed into `.venv`, make sure you either activate the venv or use the venv's Python executable.

Troubleshooting notes
- If pip tries to build `numpy` from source and fails (error shows Meson or missing compilers), install a prebuilt wheel or use the wheel-only install flag:

```powershell
.venv\Scripts\pip.exe install --only-binary=:all: -r requirements.txt
```

- If you encounter dependency conflicts (for example `opencv-python-headless` requiring a specific numpy range), either pin `numpy` to a compatible version in `requirements.txt` or choose a compatible OpenCV package. The project currently ships `requirements.txt` pinned to a numpy release that provides prebuilt wheels for your interpreter.

- If you prefer a scientific stack manager that avoids build toolchain headaches, consider using Miniconda/Anaconda and installing packages with `conda`.

Server endpoint
- POST `http://<host>:5000/process-image` with a JSON body: `{ "image": "<base64-jpeg-data>" }`.
- Response: `{ "processed_image": "<base64-jpeg-data>" }` (JPEG with drawn circles/labels).

Notes about import checks
- `server/server.py` currently raises an ImportError with a helpful message when required dependencies are missing. This is intentional to make missing-dependency situations obvious when running the script. If you'd rather the server only log warnings so IDEs can import the module without the venv activated, tell me and I can change that behavior.

Contact / Next steps
- Want me to run the server now and verify the endpoint? Or change `server/server.py` to produce warnings instead of raising? Reply with your preference.
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
