# Viavo - Crypto Wallet PWA

Viavo is a progressive web app (PWA) for cryptocurrency management that enables users to create and manage wallets with enhanced security features. The app focuses on simplified cryptocurrency payments with features like payment links, transaction management, and biometric authentication.

## Key Features

- **Secure Wallet Creation**: Create wallets secured with biometric authentication (Passkeys)
- **Payment Links**: Generate and share payment links for receiving cryptocurrency
- **Transaction Management**: Track and manage crypto transactions
- **Smart Contract Wallets**: Use ERC-4337 smart contract wallets for enhanced security
- **Multi-Chain Support**: Support for various blockchain networks (currently Base Sepolia testnet)

## Technology Stack

- **Frontend**: React, TypeScript, Shadcn UI components
- **Backend**: Vercel Serverless Functions
- **Authentication**: WebAuthn (Passkeys)
- **Blockchain**: StackUp API for ERC-4337 smart contract wallet deployment
- **Data Storage**: In-memory storage (development) / External storage services (production)

## Deploying to Vercel

### Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [StackUp](https://stackup.sh) account with an API key
3. Git installed on your machine

### Deployment Steps

1. **Fork or Clone the Repository**

   ```
   git clone <repository-url>
   cd viavo
   ```

2. **Prepare for Serverless Deployment**

   Run the included helper script to prepare the project for serverless deployment:

   ```bash
   # Make the script executable
   chmod +x prepare-for-vercel.sh

   # Run the script
   ./prepare-for-vercel.sh
   ```

   This script will:
   - Back up your current configuration files
   - Apply a simplified `vercel.json` optimized for serverless deployment
   - Build the frontend for testing
   - Provide next steps for deployment

3. **Set up Environment Variables**

   You'll need to set these environment variables in your Vercel project settings:

   ```
   STACKUP_API_KEY=your_stackup_api_key_here
   BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
   ```

4. **Deploy to Vercel**

   There are two ways to deploy to Vercel:

   **Option 1: Using Vercel CLI**
   
   ```
   npm install -g vercel
   vercel login
   vercel
   ```

   **Option 2: Connect to GitHub and deploy from Vercel Dashboard**
   
   - Push your code to a GitHub repository
   - Log in to your Vercel account
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project:
     - Framework preset: Vite
     - Build command: `npm run build`
     - Output directory: `dist`
     - Install command: `npm install`
   - Add environment variables in the Vercel project settings
   - Deploy!

For detailed deployment instructions, see [SERVERLESS-DEPLOYMENT-GUIDE.md](./docs/SERVERLESS-DEPLOYMENT-GUIDE.md)

### Verifying Deployment

1. After deployment, visit your Vercel project URL
2. Test wallet creation - this should now connect to StackUp API
3. Verify the wallet address on [Base Sepolia Explorer](https://sepolia.basescan.org/)
4. Test payment links to ensure they work correctly

## Testing in Development

For local development, the application includes fallback mechanisms when the StackUp API is unavailable. This allows development and testing of the UI and flow without requiring real blockchain transactions.

```
npm run dev
```

## Production vs Development

- In development mode, the app will use simulated blockchain transactions if it cannot connect to StackUp
- In production mode (on Vercel), the app will connect to the real StackUp API for actual blockchain transactions
- The `NODE_ENV` environment variable controls this behavior