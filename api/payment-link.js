import { createPaymentLink, resolvePaymentLink } from './shared/payment.js';
import { validateMethod, validateBody } from './shared/validation.js';
import crypto from 'crypto';

/**
 * Handler for /api/payment-link endpoint
 * - POST: Create a new payment link
 * - GET: Get a payment link by ID
 */
export default async function handler(req, res) {
  // Handle POST request (create payment link)
  if (req.method === 'POST') {
    try {
      // Validate request
      if (!validateMethod(req, res, 'POST')) return;
      
      // Schema for payment link creation
      const schema = {
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
        recipientAddress: {
          required: true,
          validate: (val) => {
            if (!val || typeof val !== 'string' || !val.startsWith('0x')) {
              return 'Invalid recipient address format';
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
        expirationMinutes: {
          required: false,
          validate: (val) => {
            if (val !== undefined && (typeof val !== 'number' || val < 0)) {
              return 'Expiration minutes must be a non-negative number';
            }
            return true;
          }
        }
      };
      
      // Validate body against schema
      const validation = validateBody(req, res, schema);
      if (!validation.valid) return;
      
      // Extract validated data
      const { amount, currency, recipientAddress, memo, expirationMinutes } = validation.data;
      
      // Generate a unique link ID
      const linkId = crypto.randomBytes(8).toString('hex');
      
      // Create the payment link
      const paymentLink = await createPaymentLink({
        linkId,
        amount,
        currency,
        recipientAddress,
        memo,
        expirationMinutes
      });

      if (!paymentLink) {
        return res.status(500).json({ 
          success: false, 
          error: "Failed to create payment link" 
        });
      }

      // Determine the host and protocol for generating the full URL
      // In Vercel, we can use the host from headers or the VERCEL_URL environment variable
      const host = req.headers.host || 
                  process.env.VERCEL_URL || 
                  'localhost:5000';
      
      const protocol = (host.includes('localhost') || host.includes('127.0.0.1')) ? 'http' : 'https';
      const link = `${protocol}://${host}/pay/${linkId}`;

      return res.status(201).json({
        success: true,
        data: {
          link,
          linkId,
          expiresAt: paymentLink.expiresAt
        }
      });
    } catch (error) {
      console.error("Error creating payment link:", error);
      return res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  }
  
  // Handle GET request (get payment link)
  else if (req.method === 'GET') {
    try {
      // Validate that we have a linkId query parameter
      const { linkId } = req.query;
      
      if (!linkId) {
        return res.status(400).json({
          success: false,
          error: "Missing required parameter: linkId"
        });
      }
      
      // Get the payment link
      const paymentLink = await resolvePaymentLink(linkId);
      
      if (!paymentLink) {
        return res.status(404).json({
          success: false,
          error: "Payment link not found or expired"
        });
      }
      
      // Return successful response
      return res.status(200).json({
        success: true,
        data: paymentLink
      });
    } catch (error) {
      console.error("Error getting payment link:", error);
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