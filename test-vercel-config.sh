#!/bin/bash

# Test script to verify Vercel deployment configuration

echo "Testing Vercel deployment configuration..."

# Check if client/package.json exists
if [ -f "client/package.json" ]; then
  echo "✅ client/package.json exists"
else
  echo "❌ client/package.json does not exist"
  exit 1
fi

# Check if client/package.json has a build script
if grep -q '"build": "vite build"' client/package.json; then
  echo "✅ client/package.json has a build script"
else
  echo "❌ client/package.json does not have a proper build script"
  exit 1
fi

# Check if vercel.json is minimal
if [ "$(cat vercel.json | wc -l)" -lt 5 ]; then
  echo "✅ vercel.json is minimal"
else
  echo "❌ vercel.json may have unnecessary configurations"
fi

# Check if client directory structure is correct
if [ -d "client/src" ] && [ -f "client/index.html" ]; then
  echo "✅ client directory structure is correct"
else
  echo "❌ client directory structure is incorrect"
  exit 1
fi

# Check for API endpoints
if [ -d "api" ] && [ "$(find api -name "*.js" | wc -l)" -gt 0 ]; then
  echo "✅ API endpoints exist"
else
  echo "❌ API endpoints do not exist or are in the wrong location"
  exit 1
fi

echo ""
echo "Deployment Checklist:"
echo "1. Set Root Directory to 'client' in Vercel Project Settings"
echo "2. Configure environment variables:"
echo "   - STACKUP_API_KEY"
echo "   - BASE_SEPOLIA_RPC_URL"
echo ""
echo "Tests completed successfully! The project should deploy correctly on Vercel."