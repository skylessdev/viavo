import { storage } from './storage.js';
import { getWallet, verifyPasskeySignature } from './wallet.js';
import crypto from 'crypto';

/**
 * Create a payment link
 * @param params The payment link parameters
 * @returns The created payment link information or null if creation failed
 */
export async function createPaymentLink(params) {
  try {
    const { linkId, amount, currency, recipientAddress, memo, expirationMinutes = 30 } = params;
    
    // Calculate expiration time
    const now = Date.now();
    const expiresAt = expirationMinutes === 0 ? 0 : now + expirationMinutes * 60 * 1000;
    
    // Store payment link
    await storage.createPaymentLink({
      linkId,
      amount,
      currency,
      recipientAddress,
      memo,
      expiresAt: expiresAt === 0 ? null : new Date(expiresAt)
    });
    
    return { linkId, expiresAt };
  } catch (error) {
    console.error('Error creating payment link:', error);
    return null;
  }
}

/**
 * Resolve a payment link by its ID
 * @param linkId The payment link ID
 * @returns The payment link information or null if not found or expired
 */
export async function resolvePaymentLink(linkId) {
  try {
    const paymentLink = await storage.getPaymentLinkById(linkId);
    
    if (!paymentLink) {
      return null;
    }
    
    return {
      amount: paymentLink.amount,
      currency: paymentLink.currency,
      recipientAddress: paymentLink.recipientAddress,
      memo: paymentLink.memo,
      expiresAt: paymentLink.expiresAt ? new Date(paymentLink.expiresAt).getTime() : 0
    };
  } catch (error) {
    console.error('Error resolving payment link:', error);
    return null;
  }
}

/**
 * Process a payment
 * @param params The payment parameters
 * @returns The transaction information or null if processing failed
 */
export async function processPayment(params) {
  try {
    const { fromAddress, toAddress, amount, currency, signature, passkeyId, memo } = params;
    
    // Verify the signature
    const verified = await verifyPasskeySignature(passkeyId, signature, `${fromAddress}:${toAddress}:${amount}:${currency}`);
    
    if (!verified) {
      console.error('Payment signature verification failed');
      return null;
    }
    
    // In a real implementation, this would send the transaction on-chain
    // For now, just create a record of the transaction
    
    // Generate a transaction ID
    const transactionId = crypto.randomBytes(16).toString('hex');
    
    // Store the transaction
    const transaction = await storage.createTransaction({
      transactionId,
      type: 'send',
      fromAddress,
      toAddress,
      amount,
      currency,
      memo,
      status: 'confirmed'
    });
    
    if (!transaction) {
      return null;
    }
    
    return {
      transactionId: transaction.transactionId,
      status: transaction.status
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    return null;
  }
}

export default {
  createPaymentLink,
  resolvePaymentLink,
  processPayment
};