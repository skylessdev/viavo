#!/bin/bash
# Build script for Viavo on Vercel

# Set production environment
export NODE_ENV=production

# Step 1: Build the frontend with Vite
echo "Building frontend with Vite..."
npx vite build

# Step 2: Create a build marker
echo "{\"timestamp\":\"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",\"environment\":\"production\",\"vercel\":true}" > dist/build-info.json

echo "Build completed successfully!"