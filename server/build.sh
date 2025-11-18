#!/bin/bash
# Build script for Railway deployment
# This builds the frontend and installs server dependencies

echo "Building frontend..."
cd ..
npm install
npm run build

echo "Installing server dependencies..."
cd server
npm install

echo "Build complete!"

