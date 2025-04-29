# Viavo Serverless Deployment Guide

This document provides a comprehensive guide for deploying the Viavo application using a serverless architecture on Vercel.

## Architecture Overview

Viavo follows a pure serverless approach:

- Frontend: React application built with Vite
- Backend: Vercel serverless functions in the `/api` directory
- Database: External database services (configured through environment variables)

## File Structure

```
viavo/
├── api/                  # Serverless API functions for Vercel
│   ├── wallet.js         # Wallet management endpoints
│   ├── wallet-balance.js # Wallet balance endpoint
│   ├── payment-link.js   # Payment link generation
│   ├── payment.js        # Payment processing
│   ├── transactions.js   # Transaction history
│   └── shared/           # Shared utilities for API functions
├── client/               # Frontend React application
│   ├── src/              # React source code
│   └── index.html        # HTML entry point
├── shared/               # Shared code between frontend and API
├── docs/                 # Documentation
├── vercel.json           # Vercel deployment configuration
└── package.json          # Project dependencies and scripts
```

## Key Configuration Files

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

### 2. package.json (Simplified for Serverless)

```json
{
  "name": "viavo",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  // dependencies...
}
```

### 3. vite.config.ts (Simplified for Serverless)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@assets': path.resolve(__dirname, 'attached_assets'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
```

## Required Environment Variables

The following environment variables must be set in Vercel:

- `STACKUP_API_KEY`: API key for StackUp bundler
- `BASE_SEPOLIA_RPC_URL`: Base Sepolia RPC URL (for testnet)

## Deployment Steps

### Initial Setup

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Set the required environment variables

### Preparing the Repository for Deployment

To simplify the deployment preparation, you can use the included helper script:

```bash
# Make the script executable
chmod +x prepare-for-vercel.sh

# Run the script
./prepare-for-vercel.sh
```

This script will:
1. Back up your current configuration files
2. Apply a simplified `vercel.json` optimized for serverless deployment
3. Build the frontend for testing
4. Provide next steps for deployment

Alternatively, you can manually prepare the repository:

1. Ensure your project follows the file structure outlined above
2. Remove any server/ directory: `rm -rf server/`
3. Update vercel.json to use the simplified configuration
4. Push changes to your GitHub repository

### Vercel Deployment

1. Navigate to your project on the Vercel dashboard
2. Trigger a manual deployment (or let it automatically deploy from GitHub)
3. Verify that the build completes successfully
4. Check the deployment logs for any errors

## Local Development

For local development, you can use the Vite development server:

```bash
npm run dev
```

Since Vercel functions can't be run locally in the same way, you may need to:

1. Use mock data for API responses during development
2. Create local development proxies for API testing
3. Use services like Vercel CLI for local function testing

## Troubleshooting

### Build Failures

If your build fails on Vercel:

1. Check the build logs for specific errors
2. Verify that all dependencies are correctly listed in package.json
3. Ensure your build command is correctly specified in vercel.json

### API Function Issues

If API functions are not working:

1. Check the function logs in the Vercel dashboard
2. Verify that all required environment variables are set
3. Check for any CORS configuration issues

### Frontend Issues

If the frontend is not working properly:

1. Check for JavaScript errors in the browser console
2. Verify that the build output is being correctly served from the specified output directory
3. Ensure that all API endpoints are being called with the correct paths

## Maintenance and Updates

### Updating the Application

1. Make changes to your codebase locally
2. Test thoroughly
3. Push changes to your GitHub repository
4. Vercel will automatically deploy the updates

### Monitoring

Vercel provides built-in monitoring and analytics:

1. Function invocations and performance metrics
2. Error tracking
3. Deployment history

## Conclusion

By following this serverless approach, Viavo can be deployed and scaled efficiently on Vercel without the need for managing servers or complex infrastructure. The serverless architecture provides excellent scalability, reliability, and reduced operational overhead.