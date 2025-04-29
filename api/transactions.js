import { storage } from './shared/storage.js';
import { validateMethod } from './shared/validation.js';

/**
 * Handler for /api/transactions endpoint
 * - GET: Get transactions for a wallet
 */
export default async function handler(req, res) {
  // Handle GET request (get transactions)
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
      
      // Get transactions for the address
      const transactions = await storage.getTransactionsByAddress(address);
      
      // Format transactions for API response
      const formattedTransactions = transactions.map(tx => ({
        id: tx.transactionId,
        type: tx.fromAddress === address ? 'send' : 'receive',
        amount: tx.amount,
        currency: tx.currency,
        address: tx.fromAddress === address ? tx.toAddress : tx.fromAddress,
        timeAgo: formatTimeAgo(tx.createdAt),
        memo: tx.memo,
        status: tx.status
      }));
      
      // Return successful response
      return res.status(200).json({
        success: true,
        data: formattedTransactions
      });
    } catch (error) {
      console.error("Error getting transactions:", error);
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

/**
 * Format a date as a relative time (e.g. "2 hours ago")
 * @param date The date to format
 * @returns A string representing the relative time
 */
function formatTimeAgo(date) {
  if (!date) return 'Unknown';
  
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  
  // Convert to seconds
  const seconds = Math.floor(diff / 1000);
  
  if (seconds < 60) {
    return 'Just now';
  }
  
  // Convert to minutes
  const minutes = Math.floor(seconds / 60);
  
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }
  
  // Convert to hours
  const hours = Math.floor(minutes / 60);
  
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  
  // Convert to days
  const days = Math.floor(hours / 24);
  
  if (days < 7) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
  
  // If more than a week, just show the date
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
}