#!/usr/bin/env node

/**
 * Script to verify that the environment is correctly configured
 * for Vercel deployment of the Viavo application.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check for required environment variables
const requiredEnvVars = [
  { name: 'STACKUP_API_KEY', description: 'API key for StackUp bundler' }
];

// Check if build script exists
const packageJsonPath = path.join(process.cwd(), 'package.json');

console.log('\n=== Viavo Vercel Deployment Verification ===\n');

// Check if package.json exists
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found!');
  process.exit(1);
}

// Read package.json
let packageJson;
try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log('✅ package.json found and parsed successfully');
} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
  process.exit(1);
}

// Check for build script
if (!packageJson.scripts || !packageJson.scripts.build) {
  console.error('❌ Build script not found in package.json!');
  console.error('  - Vercel needs a "build" script to build your application');
  process.exit(1);
} else {
  console.log('✅ Build script found in package.json:', packageJson.scripts.build);
}

// Check for environment variables
console.log('\nChecking for required environment variables:');
let missingVars = false;

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar.name]) {
    console.error(`❌ Missing ${envVar.name}: ${envVar.description}`);
    missingVars = true;
  } else {
    console.log(`✅ ${envVar.name} is set`);
  }
});

// Check for vercel.json
const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
if (fs.existsSync(vercelJsonPath)) {
  console.log('\n✅ vercel.json found');
  try {
    const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    console.log('  - Framework:', vercelJson.framework || 'Not set (will be auto-detected)');
    console.log('  - Build command:', vercelJson.buildCommand || 'Not set (will use package.json)');
    console.log('  - Output directory:', vercelJson.outputDirectory || 'Not set (will be auto-detected)');
  } catch (error) {
    console.error('❌ Error parsing vercel.json:', error.message);
  }
} else {
  console.log('\n⚠️ vercel.json not found. Vercel will use auto-detection for project settings.');
}

// Check for .env.example
const envExamplePath = path.join(process.cwd(), '.env.example');
if (fs.existsSync(envExamplePath)) {
  console.log('\n✅ .env.example found');
} else {
  console.log('\n⚠️ .env.example not found. You should create this to document required environment variables.');
}

// Check for necessary files
const requiredFiles = [
  { path: 'client/index.html', description: 'Client entry point' },
  { path: 'server/index.ts', description: 'Server entry point' },
  { path: 'server/wallet.ts', description: 'Wallet functionality' },
  { path: 'server/routes.ts', description: 'API routes' }
];

console.log('\nChecking for required files:');
requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file.path);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file.path} (${file.description})`);
  } else {
    console.error(`❌ Missing ${file.path} (${file.description})`);
  }
});

// Final summary
console.log('\n=== Verification Summary ===');
if (missingVars) {
  console.log('⚠️ Some environment variables are missing. Make sure to add them in Vercel.');
} else {
  console.log('✅ Environment variables look good!');
}
console.log('\n=== Next Steps ===');
console.log('1. Push your code to GitHub');
console.log('2. Create a new project in Vercel and connect it to your GitHub repository');
console.log('3. Configure environment variables in Vercel project settings');
console.log('4. Deploy!');
console.log('\nFor detailed instructions, see docs/VERCEL_DEPLOYMENT.md\n');