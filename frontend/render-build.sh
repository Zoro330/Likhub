#!/bin/bash

# Print commands for debugging
set -x

# Navigate to frontend directory if needed
# cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Set CI to false to ignore warnings
export CI=false

# Build the app
npm run build

# Verify build directory exists
if [ -d "build" ]; then
  echo "✅ Build directory exists!"
  ls -la build
else
  echo "❌ Build directory does not exist!"
  pwd
  ls -la
  exit 1
fi 