import { getWalletBalance } from './shared/wallet.js';
import { validateMethod } from './shared/validation.js';

/**
 * Handler for /api/wallet-balance endpoint
 * - GET: Get the balance of a wallet
 */
export default async function handler(req, res) {
  // Handle GET request (get wallet balance)
  if (req.method === 'GET') {
    try {
      // Validate request
      if (!validateMethod(req, res, 'GET')) return;
      
      // Validate that we have an address query parameter
      const { address } = req.query;
      
      if (!address) {
        return res.status(400).json({
          success: false,
          error: "Missing required parameter: address"
        });
      }
      
      // Get the wallet balance
      const balance = await getWalletBalance(address);
      
      // Return successful response
      return res.status(200).json({
        success: true,
        data: {
          balance,
          currency: 'ETH'
        }
      });
    } catch (error) {
      console.error("Error getting wallet balance:", error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  }
  
  // Handle unsupported methods
  else {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }
}