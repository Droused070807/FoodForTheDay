#!/bin/bash
# Railway build script - builds frontend and installs server deps
echo "Installing frontend dependencies..."
npm install

echo "Building frontend..."
npm run build

echo "Installing server dependencies..."
cd server
npm install

echo "Build complete!"

