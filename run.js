// This is a proxy script to run the .mjs file
// It addresses the issue with the workflow configuration which we cannot directly edit
require('child_process').spawn('node', ['vite-with-api.mjs'], { 
  stdio: 'inherit',
  shell: true 
});