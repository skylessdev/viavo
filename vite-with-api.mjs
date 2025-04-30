// Simple Vite development server with API support
// This script is a lightweight replacement for the Express server
// that proxies API requests to the Vercel serverless functions
import { createServer } from 'vite';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 5001;

// Check for StackUp API key
const STACKUP_API_KEY = process.env.STACKUP_API_KEY;
if (STACKUP_API_KEY) {
  console.log('StackUp API key is configured and available for use');
} else {
  console.warn('WARNING: STACKUP_API_KEY environment variable is not set');
}

async function startServer() {
  // Create Express server for API handling
  const app = express();
  app.use(express.json());
  
  // Configure API routes
  console.log('Setting up API routes...');
  
  // Wallet API
  app.use('/api/wallet', async (req, res) => {
    try {
      const { default: handler } = await import('./api/wallet.js');
      return handler(req, res);
    } catch (error) {
      console.error('Error in wallet endpoint:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
  
  // Wallet balance API
  app.use('/api/wallet-balance', async (req, res) => {
    try {
      const { default: handler } = await import('./api/wallet-balance.js');
      return handler(req, res);
    } catch (error) {
      console.error('Error in wallet-balance endpoint:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
  
  // Payment link API
  app.use('/api/payment-link', async (req, res) => {
    try {
      const { default: handler } = await import('./api/payment-link.js');
      return handler(req, res);
    } catch (error) {
      console.error('Error in payment-link endpoint:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
  
  // Payment API
  app.use('/api/payment', async (req, res) => {
    try {
      const { default: handler } = await import('./api/payment.js');
      return handler(req, res);
    } catch (error) {
      console.error('Error in payment endpoint:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
  
  // Transactions API
  app.use('/api/transactions', async (req, res) => {
    try {
      const { default: handler } = await import('./api/transactions.js');
      return handler(req, res);
    } catch (error) {
      console.error('Error in transactions endpoint:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
  
  // Start API server
  const apiServer = app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
    console.log(`API endpoints available at http://localhost:${port}/api/*`);
  });
  
  // Create and start Vite server
  console.log('Starting Vite dev server...');
  try {
    const viteServer = await createServer({
      root: path.resolve(__dirname, 'client'),
      server: {
        port: 3000,
        strictPort: true,
        proxy: {
          // Proxy API requests to our Express server
          '/api': {
            target: `http://localhost:${port}`,
            changeOrigin: true,
            secure: false,
          }
        }
      }
    });
    
    await viteServer.listen();
    console.log(`Vite server running at ${viteServer.resolvedUrls.local[0]}`);
    console.log(`Frontend available at ${viteServer.resolvedUrls.local[0]}`);
    console.log(`API requests will be proxied to http://localhost:${port}/api/*`);
    
    // Handle shutdown
    const shutdown = () => {
      console.log('Shutting down servers...');
      viteServer.close();
      apiServer.close();
      process.exit(0);
    };
    
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    
  } catch (error) {
    console.error('Error starting Vite server:', error);
    process.exit(1);
  }
}

startServer().catch(error => {
  console.error('Failed to start development server:', error);
  process.exit(1);
});