"""Azure App Service entry point (Oryx runs from the extracted app root)."""
import os
import sys

SERVER_DIR = os.path.join(os.path.dirname(__file__), "server")
sys.path.insert(0, SERVER_DIR)
os.chdir(SERVER_DIR)

from server import app  # noqa: E402,F401
