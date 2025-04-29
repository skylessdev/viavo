// Vercel functions don't maintain state between invocations
// Use a simple in-memory storage with data in a global scope if needed
// For production, consider using Vercel KV, Postgres, or other persistent storage

// Cache object that will live in global scope (still ephemeral between deployments)
// This is only for development/demo purposes
let walletCache = {};
let passkeyToWalletMap = {};
let paymentLinksCache = {};
let transactionsCache = {};

/**
 * Storage utility for Vercel serverless functions
 * In production, this would be replaced with a real database
 */
export const storage = {
  // Wallet methods
  createWallet: async (wallet) => {
    walletCache[wallet.smartWalletAddress] = wallet;
    passkeyToWalletMap[wallet.passkeyId] = wallet.smartWalletAddress;
    return wallet;
  },
  
  getWalletBySmartAddress: async (smartWalletAddress) => {
    return walletCache[smartWalletAddress] || null;
  },
  
  getWalletByPasskeyId: async (passkeyId) => {
    const smartWalletAddress = passkeyToWalletMap[passkeyId];
    if (!smartWalletAddress) return null;
    return walletCache[smartWalletAddress] || null;
  },
  
  // Payment link methods
  createPaymentLink: async (paymentLink) => {
    paymentLinksCache[paymentLink.linkId] = paymentLink;
    return paymentLink;
  },
  
  getPaymentLinkById: async (linkId) => {
    const paymentLink = paymentLinksCache[linkId] || null;
    
    // Check if expired
    if (paymentLink && paymentLink.expiresAt) {
      const now = Date.now();
      const expiresAt = new Date(paymentLink.expiresAt).getTime();
      
      if (now > expiresAt) {
        return null;
      }
    }
    
    return paymentLink;
  },
  
  updatePaymentLink: async (linkId, update) => {
    const existingLink = paymentLinksCache[linkId];
    if (!existingLink) return null;
    
    const updatedLink = { ...existingLink, ...update };
    paymentLinksCache[linkId] = updatedLink;
    
    return updatedLink;
  },
  
  // Transaction methods
  createTransaction: async (transactionData) => {
    const now = new Date();
    const transaction = {
      ...transactionData,
      createdAt: now,
      updatedAt: now
    };
    
    transactionsCache[transaction.transactionId] = transaction;
    return transaction;
  },
  
  getTransactionById: async (transactionId) => {
    return transactionsCache[transactionId] || null;
  },
  
  updateTransaction: async (transactionId, update) => {
    const existingTransaction = transactionsCache[transactionId];
    if (!existingTransaction) return null;
    
    const updatedTransaction = { 
      ...existingTransaction, 
      ...update, 
      updatedAt: new Date() 
    };
    
    transactionsCache[transactionId] = updatedTransaction;
    return updatedTransaction;
  },
  
  getTransactionsByAddress: async (address) => {
    return Object.values(transactionsCache).filter(
      transaction => transaction.fromAddress === address || transaction.toAddress === address
    );
  }
};

export default storage;