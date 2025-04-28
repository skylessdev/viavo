import { type Address } from 'viem';
import {
  createPasskey,
  authenticateWithPasskey,
  isPlatformAuthenticatorAvailable,
  type PasskeyCredential
} from './web-authn';
import {
  deriveAddressFromPasskey,
  getAddressBalance,
  createSignedUserOp,
  submitUserOp,
  ethToWei
} from './crypto';
import { delay } from './utils';

// Keys for storing wallet data in localStorage
const WALLET_KEY = 'viavo_wallet';
const PASSKEY_KEY = 'viavo_passkey';

// Wallet data structure
export interface WalletData {
  address: Address;
  smartWalletAddress: Address;
  passkeyId: string;
}

/**
 * Create a new wallet linked to a passkey
 * @returns The created wallet data or null if creation failed
 */
export async function createWallet(): Promise<WalletData | null> {
  try {
    // Check if platform authenticator is available
    const isPlatformAvailable = await isPlatformAuthenticatorAvailable();
    if (!isPlatformAvailable) {
      throw new Error("Platform authenticator (FaceID/TouchID) not available");
    }

    // Create a new passkey
    const passkey = await createPasskey(`user-${Date.now()}`);
    if (!passkey) {
      throw new Error("Failed to create passkey");
    }

    // Derive Ethereum address from passkey
    const ownerAddress = deriveAddressFromPasskey(passkey.id);

    // Create and sign deployment user operation
    // Smart Wallet Factory contract on Base Sepolia
    const FACTORY_ADDRESS = "0x9406Cc6185a346906296840746125a0E44976454";
    
    // Initialize deployment code for new smart wallet
    const initCode = FACTORY_ADDRESS + ownerAddress.slice(2);
    const deployOp = {
      sender: ownerAddress,
      nonce: 0,
      initCode,
      callData: "0x",
      callGasLimit: 100000,
      verificationGasLimit: 150000,
      preVerificationGas: 50000,
      maxFeePerGas: 1000000000,
      maxPriorityFeePerGas: 100000000,
      signature: "0x"
    };

    // Submit deployment transaction
    const userOpHash = await submitUserOp(deployOp);
    if (!userOpHash) {
      throw new Error("Failed to deploy smart wallet");
    }

    console.log("Deployment transaction:", `https://sepolia.basescan.org/tx/${userOpHash}`);

    // Compute counterfactual address for ERC-4337 wallet
    const initCodeHash = ethers.keccak256(initCode);
    const smartWalletAddress = ethers.getCreate2Address(
      FACTORY_ADDRESS,
      ethers.keccak256(ownerAddress),
      initCodeHash
    );
    
    console.log('Deployed wallet:', {
      ownerAddress,
      smartWalletAddress,
      txHash: userOpHash
    });

    // Save wallet and passkey info to localStorage
    const walletData: WalletData = {
      address: ownerAddress,
      smartWalletAddress,
      passkeyId: passkey.id
    };

    localStorage.setItem(WALLET_KEY, JSON.stringify(walletData));
    localStorage.setItem(PASSKEY_KEY, passkey.id);

    return walletData;
  } catch (error) {
    console.error("Error creating wallet:", error);
    return null;
  }
}

/**
 * Get saved wallet data from localStorage
 * @returns The wallet data or null if not found
 */
export function getSavedWallet(): WalletData | null {
  try {
    const walletData = localStorage.getItem(WALLET_KEY);
    if (!walletData) return null;
    return JSON.parse(walletData) as WalletData;
  } catch (error) {
    console.error("Error getting saved wallet:", error);
    return null;
  }
}

/**
 * Authenticate using the saved passkey
 * @returns True if authentication successful, false otherwise
 */
export async function authenticateWallet(): Promise<PasskeyCredential | null> {
  try {
    const passkeyId = localStorage.getItem(PASSKEY_KEY);
    if (!passkeyId) return null;

    return await authenticateWithPasskey(passkeyId);
  } catch (error) {
    console.error("Error authenticating wallet:", error);
    return null;
  }
}

/**
 * Get wallet balance
 * @param walletAddress The wallet address
 * @returns Promise resolving to the balance in ETH
 */
export async function getWalletBalance(walletAddress: Address): Promise<number> {
  return await getAddressBalance(walletAddress);
}

/**
 * Send a payment
 * @param to Recipient address
 * @param amount Amount in ETH
 * @param memo Optional memo
 * @returns Transaction hash if successful
 */
export async function sendPayment(
  to: Address, 
  amount: number, 
  memo?: string
): Promise<string | null> {
  try {
    const walletData = getSavedWallet();
    if (!walletData) {
      throw new Error("No wallet found");
    }

    // Authenticate with passkey
    const authResult = await authenticateWallet();
    if (!authResult) {
      throw new Error("Failed to authenticate with passkey");
    }

    // Convert amount to wei
    const amountWei = ethToWei(amount);

    // Create signed user operation
    const userOpHash = await createSignedUserOp(
      walletData.smartWalletAddress,
      to,
      amountWei,
      authResult.id
    );
    if (!userOpHash) {
      throw new Error("Failed to create signed user operation");
    }

    // Submit the user operation to the bundler
    const txHash = await submitUserOp(userOpHash);
    if (!txHash) {
      throw new Error("Failed to submit user operation");
    }

    return txHash;
  } catch (error) {
    console.error("Error sending payment:", error);
    return null;
  }
}

/**
 * Generate a payment link
 * @param amount Amount in ETH
 * @param currencyType ETH or USDC
 * @param expirationMinutes Expiration time in minutes
 * @param memo Optional memo
 * @returns The generated payment link
 */
export async function generatePaymentLink(
  amount: number,
  currencyType: 'ETH' | 'USDC',
  expirationMinutes: number,
  memo?: string
): Promise<string> {
  const walletData = getSavedWallet();
  if (!walletData) {
    throw new Error("No wallet found");
  }

  // In a real implementation, this would generate a secure payment link with the server
  // For now, we're creating a simple link with query parameters

  const params = new URLSearchParams();
  params.append('to', walletData.smartWalletAddress);
  params.append('amount', amount.toString());
  params.append('currency', currencyType);
  params.append('exp', (Date.now() + expirationMinutes * 60 * 1000).toString());
  if (memo) params.append('memo', memo);

  // Using the window location to generate the link base
  const baseUrl = window.location.origin;
  return `${baseUrl}/pay?${params.toString()}`;
}