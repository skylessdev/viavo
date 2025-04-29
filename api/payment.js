import { processPayment, resolvePaymentLink } from './shared/payment.js';
import { validateMethod, validateBody } from './shared/validation.js';

/**
 * Handler for /api/payment endpoint
 * - POST: Process a payment
 */
export default async function handler(req, res) {
  // Handle POST request (process payment)
  if (req.method === 'POST') {
    try {
      // Validate request
      if (!validateMethod(req, res, 'POST')) return;
      
      // Schema for payment processing
      const schema = {
        fromAddress: {
          required: true,
          validate: (val) => {
            if (!val || typeof val !== 'string' || !val.startsWith('0x')) {
              return 'Invalid sender address format';
            }
            return true;
          }
        },
        toAddress: {
          required: true,
          validate: (val) => {
            if (!val || typeof val !== 'string' || !val.startsWith('0x')) {
              return 'Invalid recipient address format';
            }
            return true;
          }
        },
        amount: {
          required: true,
          validate: (val) => {
            if (!val || typeof val !== 'string') {
              return 'Amount must be a string';
            }
            return true;
          }
        },
        currency: {
          required: true,
          validate: (val) => {
            if (!val || (val !== 'ETH' && val !== 'USDC')) {
              return 'Currency must be either ETH or USDC';
            }
            return true;
          }
        },
        signature: {
          required: true,
          validate: (val) => {
            if (!val) {
              return 'Signature is required';
            }
            return true;
          }
        },
        passkeyId: {
          required: true,
          validate: (val) => {
            if (!val || typeof val !== 'string') {
              return 'Passkey ID is required';
            }
            return true;
          }
        },
        memo: {
          required: false,
          validate: (val) => {
            if (val !== undefined && typeof val !== 'string') {
              return 'Memo must be a string';
            }
            return true;
          }
        },
        linkId: {
          required: false,
          validate: (val) => {
            if (val !== undefined && typeof val !== 'string') {
              return 'Link ID must be a string';
            }
            return true;
          }
        }
      };
      
      // Validate body against schema
      const validation = validateBody(req, res, schema);
      if (!validation.valid) return;
      
      // Extract validated data
      const { fromAddress, toAddress, amount, currency, signature, passkeyId, memo, linkId } = validation.data;
      
      // If linkId is provided, verify that the payment matches the link
      if (linkId) {
        const paymentLink = await resolvePaymentLink(linkId);
        
        if (!paymentLink) {
          return res.status(404).json({
            success: false,
            error: "Payment link not found or expired"
          });
        }
        
        // Verify that the payment details match the link
        if (
          paymentLink.amount !== amount ||
          paymentLink.currency !== currency ||
          paymentLink.recipientAddress !== toAddress
        ) {
          return res.status(400).json({
            success: false,
            error: "Payment details do not match the payment link"
          });
        }
      }
      
      // Process the payment
      const transaction = await processPayment({
        fromAddress,
        toAddress,
        amount,
        currency,
        signature,
        passkeyId,
        memo
      });
      
      if (!transaction) {
        return res.status(500).json({
          success: false,
          error: "Failed to process payment"
        });
      }
      
      // Return successful response
      return res.status(200).json({
        success: true,
        data: transaction
      });
    } catch (error) {
      console.error("Error processing payment:", error);
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