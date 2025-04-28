import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createWallet, getWalletBalance } from "./wallet";
import { createPaymentLink, resolvePaymentLink, processPayment } from "./payment";
import crypto from "crypto";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Make sure we have the StackUp API key
  const STACKUP_API_KEY = process.env.STACKUP_API_KEY;
  if (!STACKUP_API_KEY) {
    console.error("ERROR: STACKUP_API_KEY is missing in environment variables");
  } else {
    console.log("StackUp API key is configured and available for use");
  }
  
  // StackUp API proxy endpoint for security (so API key doesn't need to be exposed to client)
  app.post("/api/stackup/proxy", async (req, res) => {
    try {
      if (!STACKUP_API_KEY) {
        return res.status(500).json({
          success: false,
          error: "StackUp API key not configured on server"
        });
      }
      
      const { method, params } = req.body;
      
      if (!method || !params) {
        return res.status(400).json({
          success: false,
          error: "Missing required parameters: method, params"
        });
      }
      
      const bundlerUrl = 'https://api.stackup.sh/v1/node/base_sepolia';
      const response = await fetch(bundlerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STACKUP_API_KEY}`
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method,
          params
        })
      });
      
      const data = await response.json();
      return res.json(data);
    } catch (error) {
      console.error("Error proxying StackUp API call:", error);
      return res.status(500).json({
        success: false,
        error: "Error calling StackUp API"
      });
    }
  });
  
  // Endpoint to get status of a userOp
  app.get("/api/stackup/userop/:userOpHash", async (req, res) => {
    try {
      if (!STACKUP_API_KEY) {
        return res.status(500).json({
          success: false,
          error: "StackUp API key not configured on server"
        });
      }
      
      const { userOpHash } = req.params;
      
      if (!userOpHash) {
        return res.status(400).json({
          success: false,
          error: "Missing required parameter: userOpHash"
        });
      }
      
      const bundlerUrl = 'https://api.stackup.sh/v1/node/base_sepolia';
      const response = await fetch(bundlerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STACKUP_API_KEY}`
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getUserOperationReceipt',
          params: [userOpHash]
        })
      });
      
      const data = await response.json();
      return res.json(data);
    } catch (error) {
      console.error("Error getting UserOp receipt:", error);
      return res.status(500).json({
        success: false,
        error: "Error getting UserOp receipt"
      });
    }
  });

  // API routes
  
  // Wallet endpoints
  app.post("/api/wallet", async (req, res) => {
    try {
      const schema = z.object({
        passkeyCredential: z.any(),
      });

      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid request data" 
        });
      }

      const { passkeyCredential } = req.body;
      
      console.log("Creating wallet for passkey ID:", passkeyCredential.id);
      
      const wallet = await createWallet(passkeyCredential);

      if (!wallet) {
        console.error("Wallet creation failed - null result returned from createWallet function");
        return res.status(500).json({ 
          success: false, 
          error: "Failed to create wallet" 
        });
      }
      
      console.log("Wallet created successfully on server side:", wallet.smartWalletAddress);

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
  });

  app.get("/api/wallet/:address/balance", async (req, res) => {
    try {
      const { address } = req.params;
      
      if (!address) {
        return res.status(400).json({ 
          success: false, 
          error: "Wallet address is required" 
        });
      }

      const balance = await getWalletBalance(address);
      
      return res.json({ 
        success: true, 
        data: { 
          balance, 
          currency: "ETH" 
        } 
      });
    } catch (error) {
      console.error("Error getting wallet balance:", error);
      return res.status(500).json({ 
        success: false, 
        error: "Internal server error" 
      });
    }
  });

  // Payment link endpoints
  app.post("/api/payment-link", async (req, res) => {
    try {
      const schema = z.object({
        amount: z.string(),
        currency: z.enum(["ETH", "USDC"]),
        recipientAddress: z.string(),
        memo: z.string().optional(),
        expirationMinutes: z.number().optional()
      });

      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid request data" 
        });
      }

      const { amount, currency, recipientAddress, memo, expirationMinutes } = req.body;
      
      // Generate a unique link ID
      const linkId = crypto.randomBytes(8).toString("hex");
      
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

      const host = req.headers.host || "localhost:5000";
      const protocol = req.protocol || "http";
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
        error: "Internal server error" 
      });
    }
  });

  app.get("/api/payment-link/:linkId", async (req, res) => {
    try {
      const { linkId } = req.params;
      
      if (!linkId) {
        return res.status(400).json({ 
          success: false, 
          error: "Link ID is required" 
        });
      }

      const paymentLink = await resolvePaymentLink(linkId);
      
      if (!paymentLink) {
        return res.status(404).json({ 
          success: false, 
          error: "Payment link not found or expired" 
        });
      }

      return res.json({ 
        success: true, 
        data: paymentLink 
      });
    } catch (error) {
      console.error("Error resolving payment link:", error);
      return res.status(500).json({ 
        success: false, 
        error: "Internal server error" 
      });
    }
  });

  // Process payment endpoint
  app.post("/api/payment", async (req, res) => {
    try {
      const schema = z.object({
        linkId: z.string().optional(),
        fromAddress: z.string(),
        toAddress: z.string(),
        amount: z.string(),
        currency: z.enum(["ETH", "USDC"]),
        memo: z.string().optional(),
        passkeySignature: z.any()
      });

      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid request data" 
        });
      }

      const { 
        linkId, 
        fromAddress, 
        toAddress, 
        amount, 
        currency, 
        memo, 
        passkeySignature 
      } = req.body;

      const transaction = await processPayment({
        linkId,
        fromAddress,
        toAddress,
        amount,
        currency,
        memo,
        passkeySignature
      });

      if (!transaction) {
        return res.status(500).json({ 
          success: false, 
          error: "Failed to process payment" 
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          transactionId: transaction.transactionId,
          status: transaction.status
        }
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      return res.status(500).json({ 
        success: false, 
        error: "Internal server error" 
      });
    }
  });

  return httpServer;
}
