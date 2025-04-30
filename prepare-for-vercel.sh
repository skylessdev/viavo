#!/bin/bash
# Script to prepare the Viavo project for Vercel serverless deployment

echo "Preparing Viavo for serverless deployment on Vercel..."

# Step 1: Backup current configuration
echo "Backing up current configuration files..."
mkdir -p .backup
cp vercel.json .backup/vercel.json.bak 2>/dev/null || true
cp package.json .backup/package.json.bak 2>/dev/null || true
cp vite.config.ts .backup/vite.config.ts.bak 2>/dev/null || true

# Step 2: Remove server directory
echo "Removing server directory..."
if [ -d "server" ]; then
  echo "Backing up server directory..."
  mkdir -p .backup/server
  cp -r server/* .backup/server/ 2>/dev/null || true
  echo "Removing server directory..."
  rm -rf server
  echo "Server directory removed and backed up to .backup/server/"
else
  echo "Server directory not found, skipping removal"
fi

# Step 3: Apply simplified vercel.json
echo "Applying simplified vercel.json..."
cat > vercel.json << 'EOF'
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "NODE_ENV": "production"
  }
}
EOF

# Step 4: Apply simplified vite.config.ts
echo "Applying simplified vite.config.ts..."
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: 'client',              // Tell Vite where to find index.html
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@assets': path.resolve(__dirname, 'attached_assets'),
    },
  },
  build: {
    outDir: '../dist',         // Output to root-level for Vercel
    emptyOutDir: true,
  },
});
EOF

# Step 5: Update package.json for serverless
echo "Updating package.json scripts for serverless deployment..."
# We'll create a temporary file with jq if available, otherwise use a simple cat approach
if command -v jq >/dev/null 2>&1; then
  echo "Using jq to update package.json..."
  jq '.scripts = {"dev": "node vite-with-api.js", "dev:vite": "vite", "build": "vite build", "preview": "vite preview"}' package.json > package.json.tmp
  mv package.json.tmp package.json
else
  echo "jq not found, using template file..."
  cp docs/clean-package-with-scripts.json.txt package.json.tmp
  # Preserve the existing dependencies section
  # This is a simplified approach and might need manual review
  echo "NOTE: Dependencies section might need manual adjustment"
fi

# Step 6: Update workflow configuration
echo "Updating workflow configuration..."
if [ -f ".replit" ]; then
  echo "Found .replit file, updating workflow..."
  # Backup the original
  cp .replit .backup/.replit.bak
  
  # Update the workflow command
  sed -i 's/NODE_ENV=development tsx server\/index.ts/node vite-with-api.js/g' .replit || echo "Failed to update workflow command, please update manually"
fi

# Step 7: Create client/package.json
echo "Creating client/package.json for Vercel deployment..."
cat > client/package.json << 'EOF'
{
  "name": "viavo-client",
  "version": "1.0.0",
  "type": "module",
  "license": "MIT",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
EOF

# Install dependencies in client directory
echo "Installing dependencies in client directory..."
cd client && npm install && cd ..

# Step 8: Build frontend for testing
echo "Building frontend for testing..."
npm run build

# Step 9: Print next steps
echo ""
echo "==========================================================="
echo "🚀 Preparation Complete!"
echo "==========================================================="
echo ""
echo "To deploy to Vercel:"
echo ""
echo "1. Push your changes to GitHub:"
echo "   git add ."
echo "   git commit -m \"Prepare for serverless deployment\""
echo "   git push origin main"
echo ""
echo "2. Import the repository in Vercel"
echo ""
echo "3. In Project Settings → General → Root Directory, set it to 'client'"
echo ""
echo "4. Configure the following environment variables in Vercel:"
echo "   - STACKUP_API_KEY"
echo "   - BASE_SEPOLIA_RPC_URL"
echo ""
echo "5. Deploy the project"
echo ""
echo "Note: For detailed deployment instructions, refer to:"
echo "docs/SERVERLESS-DEPLOYMENT-GUIDE.md"
echo ""