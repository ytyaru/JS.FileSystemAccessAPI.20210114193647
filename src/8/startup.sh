#!/bin/bash
python3 -m http.server 8000 &
sleep 1
chromium-browser http://0.0.0.0:8000/

