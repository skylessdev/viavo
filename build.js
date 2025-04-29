#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execPromise = promisify(exec);

async function runCommand(command) {
  console.log(`🚀 Running: ${command}`);
  try {
    const { stdout, stderr } = await execPromise(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    return true;
  } catch (error) {
    console.error(`❌ Error executing ${command}:`, error.message);
    return false;
  }
}

async function buildProject() {
  console.log('=== Viavo Build Script ===');
  console.log('Building project for Vercel deployment...');

  // Step 1: Build the Vite frontend
  console.log('\n📦 Step 1: Building frontend...');
  const frontendBuildSuccess = await runCommand('vite build');
  
  if (!frontendBuildSuccess) {
    console.error('❌ Frontend build failed.');
    process.exit(1);
  }
  
  console.log('✅ Frontend built successfully');
  
  // Step 2: Create a simple build marker file
  console.log('\n📝 Step 2: Creating build marker...');
  const buildInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    vercel: true
  };
  
  try {
    fs.writeFileSync(
      path.join('dist', 'build-info.json'), 
      JSON.stringify(buildInfo, null, 2)
    );
    console.log('✅ Build marker created');
  } catch (error) {
    console.error('❌ Error creating build marker:', error.message);
  }
  
  console.log('\n🎉 Build completed successfully!');
  console.log('The project is ready for deployment on Vercel.');
}

buildProject().catch(error => {
  console.error('Unhandled error in build script:', error);
  process.exit(1);
});