import { createPublicClient, http, type Address, parseEther, formatEther } from 'viem';
import { base } from 'viem/chains';

// API Key for a bundler service (using Stackup in this example)
const BUNDLER_API_KEY = import.meta.env.VITE_BUNDLER_API_KEY;
if (!BUNDLER_API_KEY) {
  throw new Error('Bundler API key not found in environment variables');
}

// Initialize the client for Base chain
export const publicClient = createPublicClient({
  chain: base,
  transport: http('https://sepolia.base.org')
});

/**
 * Derive an Ethereum address from a passkey public key
 * @param publicKey The passkey public key
 * @returns The derived Ethereum address
 */
export function deriveAddressFromPasskey(passkey: string): Address {
  // In a real implementation, this would use the public key from the passkey
  // and derive an Ethereum address from it
  
  // This is a placeholder implementation that returns a mock address for demonstration
  // In production, you would use a proper cryptographic derivation
  const mockAddress = '0x' + Array(40).fill(0).map(() => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('') as Address;
  
  return mockAddress;
}

/**
 * Get the balance of an Ethereum address
 * @param address The Ethereum address
 * @returns Promise resolving to the balance in ETH
 */
export async function getAddressBalance(address: Address): Promise<number> {
  try {
    const balance = await publicClient.getBalance({ address });
    return Number(formatEther(balance));
  } catch (error) {
    console.error('Error getting balance:', error);
    return 0;
  }
}

/**
 * Convert ETH amount to wei
 * @param amount Amount in ETH
 * @returns Amount in wei as bigint
 */
export function ethToWei(amount: number): bigint {
  return parseEther(amount.toString());
}

/**
 * Deploy a smart wallet for a user using ERC-4337
 * @param ownerAddress The owner address (derived from passkey)
 * @returns The address of the deployed smart wallet
 */
export async function deploySmartWallet(ownerAddress: Address): Promise<Address | null> {
  try {
    // In a real implementation, this would deploy an ERC-4337 smart wallet contract
    // For the MVP, we're simulating this with a mock address
    
    // Simulate the wallet creation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a deterministic mock address for the user's wallet
    // In production, this would be the actual deployed wallet address
    const walletAddress = '0x' + Array(40).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('') as Address;
    
    return walletAddress;
  } catch (error) {
    console.error('Error deploying smart wallet:', error);
    return null;
  }
}

/**
 * Create a signed user operation for ERC-4337
 * @param walletAddress The wallet address
 * @param to Recipient address
 * @param amount Amount to send
 * @param passkeySignature Signature from passkey
 * @returns Promise resolving to the userOp hash if successful
 */
export async function createSignedUserOp(
  walletAddress: Address,
  to: Address,
  amount: bigint,
  passkeySignature: string
): Promise<string | null> {
  try {
    // In a real implementation, this would create a signed user operation
    // For the MVP, we're simulating this with a mock hash
    
    // Simulate the signing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock user operation hash
    const userOpHash = '0x' + Array(64).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    return userOpHash;
  } catch (error) {
    console.error('Error creating signed user operation:', error);
    return null;
  }
}

/**
 * Submit a user operation to the bundler
 * @param userOpHash The userOp hash
 * @returns Promise resolving to the transaction hash if successful
 */
export async function submitUserOp(userOp: any): Promise<string | null> {
  try {
    const bundlerUrl = 'https://api.stackup.sh/v1/node/base_sepolia';
    const response = await fetch(bundlerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BUNDLER_API_KEY}`
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_sendUserOperation',
        params: [userOp, "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789"] // EntryPoint contract address
      })
    });

    const data = await response.json();
    if (data.error) {
      console.error('Bundler error:', data.error);
      throw new Error(data.error.message);
    }

    // Wait for user operation to be included
    const userOpHash = data.result;
    const receipt = await waitForUserOpReceipt(userOpHash);
    return receipt?.transactionHash || null;
  } catch (error) {
    console.error('Error submitting user operation:', error);
    return null;
  }
}
async function waitForUserOpReceipt(userOpHash: string, maxAttempts = 10): Promise<any> {
  const bundlerUrl = 'https://api.stackup.sh/v1/node/base_sepolia';
  
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(bundlerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BUNDLER_API_KEY}`
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getUserOperationReceipt',
        params: [userOpHash]
      })
    });

    const data = await response.json();
    if (data.result) {
      return data.result;
    }

    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between attempts
  }
  
  throw new Error('User operation receipt not found after maximum attempts');
}
