#!/bin/bash

# Leapcell Build Script
# This script ensures both backend and frontend are properly built

echo "🚀 Starting build process..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install --include=dev

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Return to root
cd ..

echo "✅ Build complete!"
echo "📁 Frontend dist directory:"
ls -la frontend/dist/

echo "🎉 Ready to start server!"
