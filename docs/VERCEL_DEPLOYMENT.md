# Deploying Viavo to Vercel

This guide explains how to deploy the Viavo app to Vercel using serverless functions.

## Project Structure

The project has been restructured for Vercel deployment:

```
viavo/
├── api/                     # Serverless API functions (one file = one endpoint)
│   ├── wallet.js            # /api/wallet endpoint
│   ├── wallet-balance.js    # /api/wallet-balance endpoint
│   ├── payment-link.js      # /api/payment-link endpoint
│   ├── payment.js           # /api/payment endpoint
│   ├── transactions.js      # /api/transactions endpoint
│   └── shared/              # Shared utilities for API functions
│       ├── storage.js       # Data storage utilities
│       ├── wallet.js        # Wallet functionality
│       ├── payment.js       # Payment functionality
│       └── validation.js    # Request validation utilities
├── client/                  # React/Vite frontend code
├── dist/                    # Build output (generated)
├── vercel.json              # Vercel configuration
└── build.sh                 # Build script for Vercel
```

## Deployment Steps

1. **Push your code to GitHub**:
   - Create a GitHub repository and push your code.

2. **Create a new project in Vercel**:
   - Go to [Vercel](https://vercel.com) and sign in.
   - Click "Add New" > "Project".
   - Connect to your GitHub repository.
   - Select the repository containing the Viavo project.

3. **Configure environment variables**:
   - Add the following environment variables:
     - `STACKUP_API_KEY`: Your StackUp API key for ERC-4337 wallet deployment
     - `BASE_SEPOLIA_RPC_URL`: RPC URL for the Base Sepolia testnet (optional)
   - These can be added in the Vercel project settings under "Environment Variables".

4. **Deploy**:
   - Click "Deploy".
   - Vercel will automatically use the configuration in `vercel.json`.
   - The build script `build.sh` will be used to build the project.

## How It Works

### API Functions
Each file in the `/api` directory becomes a serverless function endpoint:

- `/api/wallet.js` → `https://yourdomain.com/api/wallet`
- `/api/payment-link.js` → `https://yourdomain.com/api/payment-link`

### Frontend
The React frontend is built with Vite and served as static files.

### Configuration
The `vercel.json` file configures:
- Build command (`build.sh`)
- Output directory (`dist/public`)
- Rewrites for API paths and client-side routing

## Troubleshooting

### Build Errors
If you encounter build errors:
1. Check if any files still reference `server/index.ts`
2. Make sure all imports in API functions use the `.js` extension
3. Verify that all environment variables are set correctly

### API Not Working
If API endpoints return 404 errors:
1. Check that the file names in `/api` match the URLs you're calling
2. Verify that `vercel.json` has the correct rewrites
3. Look at function logs in the Vercel dashboard