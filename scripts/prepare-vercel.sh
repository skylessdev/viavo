#!/bin/bash

# Script to prepare the Viavo app for Vercel deployment

echo "=========================================="
echo "Preparing Viavo for Vercel Deployment"
echo "=========================================="

# Check if .env.example exists
if [ ! -f .env.example ]; then
  echo "Creating .env.example file..."
  cat > .env.example << EOL
# Blockchain configuration
STACKUP_API_KEY=your_stackup_api_key_here
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Server configuration
PORT=5000
NODE_ENV=production

# Add any other environment variables needed for your project
EOL
  echo "✅ Created .env.example"
else
  echo "✅ .env.example already exists"
fi

# Check if vercel.json exists
if [ ! -f vercel.json ]; then
  echo "Creating vercel.json file..."
  cat > vercel.json << EOL
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
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
          "value": "X-Requested-With, Content-Type, Accept"
        }
      ]
    }
  ]
}
EOL
  echo "✅ Created vercel.json"
else
  echo "✅ vercel.json already exists"
fi

# Create docs directory if it doesn't exist
if [ ! -d docs ]; then
  echo "Creating docs directory..."
  mkdir -p docs
  echo "✅ Created docs directory"
else
  echo "✅ docs directory already exists"
fi

# Check if deployment guide exists
if [ ! -f docs/VERCEL_DEPLOYMENT.md ]; then
  echo "Creating Vercel deployment guide..."
  cat > docs/VERCEL_DEPLOYMENT.md << EOL
# Deploying Viavo to Vercel

This document provides step-by-step instructions for deploying the Viavo application to Vercel to enable real blockchain interactions with the StackUp API.

## Why Vercel?

We're moving to Vercel from Replit because:

1. Vercel provides better network connectivity to external services like the StackUp API
2. Replit's environment has DNS resolution issues that prevent connections to api.stackup.sh
3. Vercel offers better scaling, reliability, and performance for production applications
4. Vercel's serverless functions work well with our Express.js backend

## Prerequisites

- A [GitHub](https://github.com) account
- A [Vercel](https://vercel.com) account
- A [StackUp](https://stackup.sh) account with an API key
- Git installed on your local machine

## Step 1: Prepare the Repository

1. Push your Replit project to GitHub:
   - Create a new GitHub repository
   - Initialize Git in your Replit project
   - Add the GitHub repository as a remote
   - Push your code to GitHub

   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/viavo.git
   git push -u origin main
   \`\`\`

## Step 2: Connect to Vercel

1. Log in to [Vercel](https://vercel.com)
2. Click "Add New" > "Project"
3. Find and select your GitHub repository
4. Vercel will automatically detect that this is a Vite project

## Step 3: Configure the Project

Configure the build settings:

- **Framework Preset**: Vite
- **Build Command**: \`npm run build\` (should be auto-detected)
- **Output Directory**: \`dist\` (should be auto-detected)
- **Install Command**: \`npm install\` (should be auto-detected)

## Step 4: Set Environment Variables

Add these environment variables in the Vercel project settings:

- \`STACKUP_API_KEY\`: Your StackUp API key
- \`BASE_SEPOLIA_RPC_URL\`: https://sepolia.base.org
- \`NODE_ENV\`: production

## Step 5: Deploy

Click "Deploy" and wait for the build to complete.

## Step 6: Testing the Deployment

1. Once deployed, visit your Vercel project URL
2. Test wallet creation functionality:
   - Click "Get Started"
   - Create a wallet with biometrics
   - This should now connect to the real StackUp API
3. Verify the created wallet in the [Base Sepolia Explorer](https://sepolia.basescan.org/)
4. Test payment link functionality:
   - Create a payment link
   - Open the link in a different browser or incognito mode
   - Complete a payment
   - Verify the transaction in the explorer

## Step 7: Debugging

If you encounter issues:

1. Check the Vercel build logs for errors
2. Check the Function logs in Vercel dashboard for runtime errors
3. Make sure your StackUp API key is valid and has sufficient credits
4. Verify that you're correctly setting the environment variables
EOL
  echo "✅ Created Vercel deployment guide"
else
  echo "✅ Vercel deployment guide already exists"
fi

echo ""
echo "=========================================="
echo "Preparation complete! Next steps:"
echo "1. Push your code to GitHub"
echo "2. Connect your GitHub repo to Vercel"
echo "3. Set up environment variables in Vercel"
echo "4. Deploy!"
echo "=========================================="
echo ""
echo "For detailed instructions, see docs/VERCEL_DEPLOYMENT.md"
echo ""