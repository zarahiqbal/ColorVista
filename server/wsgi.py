import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
os.chdir(os.path.dirname(__file__))

from server import app

if __name__ == "__main__":
    app.run()
