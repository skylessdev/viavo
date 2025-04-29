# Viavo Deployment Guide

This document outlines the deployment structure for the Viavo application.

## Architecture Overview

Viavo follows a hybrid approach:

1. **Development Mode**: 
   - Uses a custom Express server (server/index.ts) in Replit for local development
   - Serves a simplified frontend for testing
   - Routes API requests to the serverless functions in the `/api` directory

2. **Production Mode (Vercel)**:
   - Fully serverless architecture
   - React frontend built with Vite
   - API endpoints implemented as Vercel serverless functions in `/api` directory
   - No Express server in production

## Deployment Configuration

### Vercel Configuration (vercel.json)

```json
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "vite build",
  "outputDirectory": "dist",
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "X-Requested-With, Content-Type, Accept, Authorization"
        }
      ]
    }
  ],
  "rewrites": [
    { "source": "/api/wallet", "destination": "/api/wallet.js" },
    { "source": "/api/wallet-balance", "destination": "/api/wallet-balance.js" },
    { "source": "/api/payment-link", "destination": "/api/payment-link.js" },
    { "source": "/api/payment", "destination": "/api/payment.js" },
    { "source": "/api/transactions", "destination": "/api/transactions.js" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Required Environment Variables

The following environment variables must be set in Vercel:

- `STACKUP_API_KEY`: API key for StackUp bundler
- `BASE_SEPOLIA_RPC_URL`: Base Sepolia RPC URL (for testnet)

## Deployment Process

1. **Local Development:**
   - Run `npm run dev` to start the Express development server
   - Access frontend at http://localhost:5000
   - API endpoints available at /api/*

2. **Vercel Deployment:**
   - Push changes to your GitHub repository
   - Vercel will automatically build and deploy using the configuration in vercel.json
   - The build process creates static assets in the 'dist' directory
   - API functions in the /api directory are deployed as serverless functions

## Troubleshooting

### CORS Issues
If you encounter CORS issues, ensure that the CORS headers in vercel.json are properly configured.

### API Endpoint Issues
If API endpoints are not working, check:
1. The API handler files in the /api directory
2. The rewrites configuration in vercel.json
3. That all required environment variables are set in Vercel

### Frontend Issues
If the frontend is not loading correctly, check:
1. The Vite build configuration
2. That the outputDirectory in vercel.json matches the build output path
3. Browser console for any JavaScript errors

## Additional Notes

- The hybrid approach allows for development in Replit while maintaining a clean serverless architecture for production
- The Express server in server/index.ts is only used for development and is not part of the production deployment
- All backend logic should be implemented in the API handlers in the /api directory