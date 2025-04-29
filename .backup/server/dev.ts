// Development server for Replit environment only
// This file runs a simplified development server that:
// 1. Proxies API requests to the Vercel serverless functions
// 2. Serves the frontend using Vite in development mode
// Not used in production - Vercel uses serverless functions in /api directory

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 5000;

// Parse JSON request bodies
app.use(express.json());

// Check for StackUp API key
const STACKUP_API_KEY = process.env.STACKUP_API_KEY;
if (STACKUP_API_KEY) {
  console.log('StackUp API key is configured and available for use');
} else {
  console.warn('WARNING: STACKUP_API_KEY environment variable is not set');
}

console.log('Starting Viavo in development mode...');

// Setup proxies for API requests
// These will forward all /api/* requests to their respective handlers
const setupApiProxies = async () => {
  // Wallet API
  app.use('/api/wallet', async (req, res) => {
    try {
      const { default: handler } = await import('../api/wallet.js');
      return handler(req, res);
    } catch (error) {
      console.error('Error in wallet endpoint:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
  
  // Wallet balance API
  app.use('/api/wallet-balance', async (req, res) => {
    try {
      const { default: handler } = await import('../api/wallet-balance.js');
      return handler(req, res);
    } catch (error) {
      console.error('Error in wallet-balance endpoint:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
  
  // Payment link API
  app.use('/api/payment-link', async (req, res) => {
    try {
      const { default: handler } = await import('../api/payment-link.js');
      return handler(req, res);
    } catch (error) {
      console.error('Error in payment-link endpoint:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
  
  // Payment API
  app.use('/api/payment', async (req, res) => {
    try {
      const { default: handler } = await import('../api/payment.js');
      return handler(req, res);
    } catch (error) {
      console.error('Error in payment endpoint:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
  
  // Transactions API
  app.use('/api/transactions', async (req, res) => {
    try {
      const { default: handler } = await import('../api/transactions.js');
      return handler(req, res);
    } catch (error) {
      console.error('Error in transactions endpoint:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
};

// Set up Vite development server
const setupViteServer = async () => {
  try {
    // Serve a simple static fallback page while Vite is starting up
    app.get('/', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Viavo - Starting...</title>
            <style>
              body { font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
              .loading { display: inline-block; width: 20px; height: 20px; border: 3px solid #eee; 
                         border-radius: 50%; border-top-color: #3b82f6; animation: spin 1s linear infinite; }
              @keyframes spin { to { transform: rotate(360deg); } }
            </style>
          </head>
          <body>
            <h1>Viavo</h1>
            <p>Starting development server <span class="loading"></span></p>
            <p>Please wait a moment for the app to initialize...</p>
            <script>
              // Auto refresh after 5 seconds
              setTimeout(() => { window.location.reload(); }, 5000);
            </script>
          </body>
        </html>
      `);
    });
    
    // Create Vite server
    const vite = await createServer({
      root: path.resolve(__dirname, '../client'),
      server: { 
        middlewareMode: true,
        watch: {
          // Required in WSL
          usePolling: true
        }
      },
      base: '/',
      appType: 'spa'
    });
    
    // Use Vite's connect instance as middleware
    app.use(vite.middlewares);
    
    console.log('Vite development server started successfully');
  } catch (error) {
    console.error('Error starting Vite development server:', error);
    
    // Serve a static HTML if Vite fails to start
    app.use(express.static(path.resolve(__dirname, '../public')));
    
    // Create a simple fallback page
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) return; // Skip API routes
      
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Viavo</title>
            <style>
              body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
              h1 { color: #1d4ed8; }
              .card { background: white; border-radius: 8px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
              button { background: #1d4ed8; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; }
              button:hover { background: #1e40af; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Viavo</h1>
              <p>Progressive Web App for Seamless Crypto Payments</p>
              <p>Development server is running, but Vite failed to start. This is likely a temporary issue.</p>
              <button onclick="window.location.reload()">Refresh Page</button>
            </div>
          </body>
        </html>
      `);
    });
  }
};

// Initialize the server
const startServer = async () => {
  // Setup API proxies first
  await setupApiProxies();
  
  // Then setup Vite
  await setupViteServer();
  
  // Start the server
  app.listen(port, () => {
    console.log(`Viavo development server running at http://localhost:${port}`);
    console.log(`API endpoints accessible at /api/*`);
  });
};

// Start everything
startServer().catch(err => {
  console.error('Failed to start development server:', err);
});