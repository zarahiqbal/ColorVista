#!/bin/bash
cd "$(dirname "$0")"
exec gunicorn --bind=0.0.0.0:${PORT:-8000} --workers=1 --threads=2 --timeout=600 app:app
