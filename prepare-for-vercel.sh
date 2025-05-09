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
  "rootDirectory": "client"
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

# Step 5: Update or rename package.json for serverless
echo "Backing up and renaming root package.json for Vercel deployment..."
# Backup first
cp package.json .backup/package.json.bak

# Instead of modifying, rename to prevent conflicts with client/package.json
# This is important when Root Directory is set to 'client' in Vercel
mv package.json package.json.original

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
    "react-dom": "^18.2.0",
    "@tailwindcss/postcss": "^3.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
EOF

# Install dependencies in client directory
echo "Installing dependencies in client directory..."
cd client && npm install && cd ..

# Step 8: Update PostCSS configuration
echo "Updating PostCSS configuration..."
cat > client/postcss.config.js << 'EOF'
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [tailwindcss(), autoprefixer()],
};
EOF

# Step 9: Build frontend for testing
echo "Building frontend for testing..."
cd client && npm run build && cd ..

# Step 9: Restore package.json for local development
echo "Restoring original package.json for local development..."
if [ -f "package.json.original" ]; then
  mv package.json.original package.json
  echo "Original package.json restored."
else
  echo "Warning: Could not find package.json.original to restore."
fi

# Step 10: Print next steps
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