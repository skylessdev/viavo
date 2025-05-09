# Viavo Serverless Deployment Guide

This guide explains how to deploy the Viavo project to Vercel as a serverless application.

## Project Structure

The Viavo project uses a specific structure:
- Frontend code is in the `client/` directory (including index.html)
- API endpoints are in the `api/` directory
- Shared types and schemas are in the `shared/` directory

## Deployment Configuration

The deployment to Vercel relies on two key configuration files:

### 1. vercel.json

```json
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 2. vite.config.ts

```typescript
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
```

## Important Notes

1. **Client Directory**: The frontend code is in the `client/` directory, so Vite needs to be configured with `root: 'client'` to find index.html.

2. **Build Output**: The build output is configured to go to the root-level `dist/` directory with `outDir: '../dist'` in vite.config.ts.

3. **API Routes**: The API endpoints in the `api/` directory will be automatically deployed as serverless functions by Vercel.

## Deployment Steps

1. **Prepare Project**: 
   ```bash
   ./prepare-for-vercel.sh
   ```
   This script sets up the correct configuration for Vercel deployment.

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for serverless deployment"
   git push origin main
   ```

3. **Import to Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - **Important**: In Project Settings → General → Root Directory, set it to `client`
   - Configure the following environment variables:
     - `STACKUP_API_KEY`: Your StackUp API key
     - `BASE_SEPOLIA_RPC_URL`: The Sepolia RPC URL

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build and deployment to complete

## Troubleshooting

### "Could not resolve entry module 'index.html'" Error

This error occurs when Vite cannot find the index.html file. Make sure:
- Your vite.config.ts has `root: 'client'` to tell Vite where to find index.html
- Your build output is set to `outDir: '../dist'` to ensure files go to the correct directory

### API Routes Not Working

Make sure:
- Your API routes are in the `api/` directory at the root level
- Each API file has a proper default export function

### "npm run build" Error (Exit Code 127)

This error occurs when Vercel can't find the build script. Make sure:
- You've set the Root Directory to `client` in Vercel Project Settings
- The client/package.json file exists and contains:
  ```json
  {
    "scripts": {
      "build": "vite build"
    },
    "devDependencies": {
      "vite": "^5.0.0",
      "@vitejs/plugin-react": "^4.0.0",
      "react": "^18.2.0",
      "react-dom": "^18.2.0"
    }
  }
  ```
- The dependencies are installed in the client directory
- You don't have conflicting Vercel configuration settings

### Root package.json Conflicts

If you have a build script in your root package.json, it might conflict with Vercel deployment even when you set Root Directory to `client`. To fix this:

1. Rename or remove the root package.json before deployment:
   ```bash
   # Backup and rename root package.json
   cp package.json package.json.backup
   mv package.json package.json.original
   ```

2. Or remove the build script from the root package.json:
   ```json
   {
     "scripts": {
       "dev": "node vite-with-api.js",
       // Remove the "build" script or rename it to something else
     }
   }
   ```

The prepare-for-vercel.sh script handles this by renaming the root package.json during preparation.

### "vite: command not found" Error

This error occurs when the vite dependency is missing. Make sure:
- vite is included in the devDependencies section of client/package.json
- Run `cd client && npm install` before deployment to install the required packages

### Other Deployment Issues

If you encounter other deployment issues:
1. Check the Vercel deployment logs for specific errors
2. Verify that all environment variables are correctly set
3. Ensure that package.json has the correct build script: `"build": "vite build"`