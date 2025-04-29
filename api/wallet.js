import { createWallet, getWallet } from './shared/wallet.js';
import { validateMethod, validateBody } from './shared/validation.js';

/**
 * Handler for /api/wallet endpoint
 * - POST: Create a new wallet for the user
 * - GET: Get an existing wallet by address
 */
export default async function handler(req, res) {
  // Handle POST request (create wallet)
  if (req.method === 'POST') {
    try {
      // Validate request
      if (!validateMethod(req, res, 'POST')) return;
      
      // Schema for wallet creation
      const schema = {
        passkeyCredential: {
          required: true,
          validate: (val) => {
            if (!val || typeof val !== 'object' || !val.id) {
              return 'Invalid passkey credential format';
            }
            return true;
          }
        }
      };
      
      // Validate body against schema
      const validation = validateBody(req, res, schema);
      if (!validation.valid) return;
      
      // Extract validated data
      const { passkeyCredential } = validation.data;
      
      console.log("Creating wallet for passkey ID:", passkeyCredential.id);
      
      // Create the wallet
      const wallet = await createWallet(passkeyCredential);

      if (!wallet) {
        console.error("Wallet creation failed - null result returned from createWallet function");
        return res.status(500).json({ 
          success: false, 
          error: "Failed to create wallet" 
        });
      }
      
      console.log("Wallet created successfully:", wallet.smartWalletAddress);

      // Return successful response
      return res.status(201).json({ 
        success: true, 
        data: wallet 
      });
    } catch (error) {
      console.error("Error creating wallet:", error);
      return res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  }
  
  // Handle GET request (get wallet)
  else if (req.method === 'GET') {
    try {
      // Validate that we have an address query parameter
      const { address } = req.query;
      
      if (!address) {
        return res.status(400).json({
          success: false,
          error: "Missing required parameter: address"
        });
      }
      
      // Get the wallet
      const wallet = await getWallet(address);
      
      if (!wallet) {
        return res.status(404).json({
          success: false,
          error: "Wallet not found"
        });
      }
      
      // Return successful response
      return res.status(200).json({
        success: true,
        data: wallet
      });
    } catch (error) {
      console.error("Error getting wallet:", error);
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