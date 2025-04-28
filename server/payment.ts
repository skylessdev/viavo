import { storage } from './storage';
import { getWallet, verifyPasskeySignature } from './wallet';
import crypto from 'crypto';

/**
 * Create a payment link
 * @param params The payment link parameters
 * @returns The created payment link information or null if creation failed
 */
export async function createPaymentLink(params: {
  linkId: string;
  amount: string;
  currency: 'ETH' | 'USDC';
  recipientAddress: string;
  memo?: string;
  expirationMinutes?: number;
}): Promise<{ linkId: string; expiresAt: number } | null> {
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
export async function resolvePaymentLink(linkId: string): Promise<{
  amount: string;
  currency: 'ETH' | 'USDC';
  recipientAddress: string;
  memo?: string;
  expiresAt: number;
} | null> {
  try {
    const paymentLink = await storage.getPaymentLinkById(linkId);
    
    if (!paymentLink) {
      return null;
    }
    
    // Check if expired
    if (paymentLink.expiresAt) {
      const now = Date.now();
      const expiresAt = new Date(paymentLink.expiresAt).getTime();
      
      if (now > expiresAt) {
        return null;
      }
    }
    
    return {
      amount: paymentLink.amount,
      currency: paymentLink.currency as 'ETH' | 'USDC',
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
export async function processPayment(params: {
  linkId?: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  currency: 'ETH' | 'USDC';
  memo?: string;
  passkeySignature: any;
}): Promise<{ transactionId: string; status: 'pending' | 'confirmed' | 'failed' } | null> {
  try {
    const { 
      linkId, 
      fromAddress, 
      toAddress, 
      amount, 
      currency, 
      memo, 
      passkeySignature 
    } = params;
    
    console.log(`[PAYMENT] Processing payment: ${amount} ${currency} from ${fromAddress} to ${toAddress}`);
    
    // Get the wallet for verification
    const wallet = await getWallet(fromAddress);
    
    if (!wallet) {
      console.error(`[PAYMENT] Wallet not found: ${fromAddress}`);
      throw new Error('Wallet not found');
    }
    
    console.log(`[PAYMENT] Wallet found, verifying passkey signature`);
    
    // Verify passkey signature
    const isValid = await verifyPasskeySignature(
      wallet.passkeyId,
      passkeySignature,
      JSON.stringify({ fromAddress, toAddress, amount, currency, memo })
    );
    
    if (!isValid) {
      console.error(`[PAYMENT] Invalid passkey signature for wallet: ${fromAddress}`);
      throw new Error('Invalid passkey signature');
    }
    
    console.log(`[PAYMENT] Passkey signature verified successfully`);
    
    // Update payment link if provided
    if (linkId) {
      console.log(`[PAYMENT] Payment link ID provided: ${linkId}, updating status`);
      const paymentLink = await storage.getPaymentLinkById(linkId);
      
      if (paymentLink) {
        await storage.updatePaymentLink(linkId, {
          claimed: true,
          claimedAt: new Date(),
          claimedBy: fromAddress
        });
        console.log(`[PAYMENT] Payment link updated as claimed`);
      } else {
        console.log(`[PAYMENT] Payment link not found: ${linkId}`);
      }
    }
    
    // Generate transaction ID
    const transactionId = crypto.randomBytes(32).toString('hex');
    console.log(`[PAYMENT] Generated transaction ID: ${transactionId}`);
    
    // Create transaction record
    await storage.createTransaction({
      transactionId,
      type: 'send',
      fromAddress,
      toAddress,
      amount,
      currency,
      memo,
      status: 'pending'
    });
    
    // In production, this would submit the transaction to the blockchain via StackUp
    if (process.env.NODE_ENV === 'production') {
      console.log(`[PAYMENT] Production environment: would submit real transaction to blockchain`);
      console.log(`[PAYMENT] Transaction would be visible at: https://sepolia.basescan.org/tx/${transactionId}`);
      
      // Here we would use the StackUp API to submit a transaction
      // This will be implemented when deployed to Vercel
    } else {
      console.log(`[PAYMENT] Development environment: simulating blockchain transaction`);
      
      console.log(`
        SIMULATED TRANSACTION (Development Mode Only)
        ----------
        From: ${fromAddress}
        To: ${toAddress}
        Amount: ${amount} ${currency}
        Memo: ${memo || 'N/A'}
        Transaction ID: ${transactionId}
        Environment: ${process.env.NODE_ENV || 'development'}
        ----------
      `);
    }
    
    // Update transaction status after a delay to simulate confirmation
    setTimeout(async () => {
      await storage.updateTransaction(transactionId, {
        status: 'confirmed',
        blockNumber: Math.floor(Math.random() * 1000000) + 1000000
      });
      console.log(`[PAYMENT] Transaction ${transactionId} confirmed`);
    }, 5000);
    
    console.log(`[PAYMENT] Payment processing complete, returning pending status`);
    
    return {
      transactionId,
      status: 'pending'
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    return null;
  }
}
