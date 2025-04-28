import type { Address } from 'viem';

// WebAuthn related types
export interface PasskeyCredential {
  id: string;
  rawId: string;
  type: string;
  response: {
    clientDataJSON: string;
    attestationObject?: string;
    authenticatorData?: string;
    signature?: string;
    userHandle?: string;
  };
}

// Wallet types
export interface WalletInfo {
  address: Address;
  smartWalletAddress: Address;
  passkeyId: string;
}

// Payment related types
export interface PaymentLinkParams {
  amount: string;
  currency: 'ETH' | 'USDC';
  recipientAddress: Address;
  memo?: string;
  expirationMinutes?: number;
}

export interface PaymentLinkInfo extends PaymentLinkParams {
  linkId: string;
  createdAt: number;
  expiresAt: number;
  url: string;
}

export interface TransactionParams {
  fromAddress: Address;
  toAddress: Address;
  amount: string;
  currency: 'ETH' | 'USDC';
  memo?: string;
}

export interface TransactionInfo extends TransactionParams {
  id: string;
  transactionId: string;
  type: 'send' | 'receive';
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  createdAt: number;
  updatedAt: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface WalletResponse {
  address: string;
  smartWalletAddress: string;
}

export interface BalanceResponse {
  balance: string;
  currency: string;
}

export interface PaymentLinkResponse {
  link: string;
  linkId: string;
  expiresAt: number;
}

export interface TransactionResponse {
  transactionId: string;
  status: 'pending' | 'confirmed' | 'failed';
}
