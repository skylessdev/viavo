import crypto from 'crypto';
import { storage } from './storage.js';

/**
 * Create a wallet for a user based on their passkey credential
 * @param passkeyCredential The WebAuthn credential
 * @returns The created wallet information or null if creation failed
 */
export async function createWallet(passkeyCredential) {
  try {
    // Generate a deterministic address from the passkey
    // In a real implementation, we'd derive this properly from the WebAuthn public key
    const passkeyId = passkeyCredential.id || crypto.randomBytes(32).toString('hex');
    const walletSeed = crypto.createHash('sha256').update(passkeyId).digest('hex');
    
    // Generate owner address (would be derived from passkey in production)
    const address = '0x' + walletSeed.substring(0, 40);
    
    console.log(`Creating real wallet for owner address: ${address}`);
    
    // Try to create an actual ERC-4337 smart contract wallet using StackUp
    let smartWalletAddress = null;
    try {
      console.log('[WALLET] Attempting to deploy ERC-4337 smart wallet via StackUp bundler');
      smartWalletAddress = await deploySimpleAccountWallet(address);
      
      if (smartWalletAddress) {
        console.log(`[WALLET] Successfully deployed smart wallet at address: ${smartWalletAddress}`);
        console.log(`[WALLET] View on block explorer: https://sepolia.basescan.org/address/${smartWalletAddress}`);
      }
    } catch (error) {
      console.error('[WALLET] Error deploying smart wallet:', error);
      
      if (process.env.VERCEL) {
        // In production (Vercel), we want to fail if we can't connect to StackUp
        // This will make the error visible in Vercel logs
        console.error('[WALLET] Production environment: failing on StackUp connection error');
        throw new Error(`Failed to connect to StackUp API: ${error.message || 'Unknown error'}`);
      } else {
        // FALLBACK: Only for development environments, generate a simulated address
        console.log('[WALLET] Development environment: using fallback wallet address generation');
        const smartWalletSeed = crypto.createHash('sha256').update(address).digest('hex');
        smartWalletAddress = '0x' + smartWalletSeed.substring(0, 40);
        
        // Log the transaction that would have been created
        console.log(`
          SIMULATED TRANSACTION (Development Mode Only)
          ----------
          Type: Smart wallet deployment
          Owner: ${address}
          Wallet: ${smartWalletAddress}
          Network: Base Sepolia
          Factory: 0x9406Cc6185a346906296840746125a0E44976454
          ----------
        `);
      }
    }
    
    // Store wallet in our database
    await storage.createWallet({
      address,
      smartWalletAddress,
      passkeyId
    });
    
    return { address, smartWalletAddress };
  } catch (error) {
    console.error('Error creating wallet:', error);
    return null;
  }
}

/**
 * Deploy a SimpleAccount ERC-4337 smart wallet using StackUp
 * @param ownerAddress The owner's EOA address
 * @returns The address of the deployed smart wallet
 */
async function deploySimpleAccountWallet(ownerAddress) {
  try {
    // Make sure we have the StackUp API key
    const STACKUP_API_KEY = process.env.STACKUP_API_KEY;
    if (!STACKUP_API_KEY) {
      console.error('ERROR: STACKUP_API_KEY missing for wallet deployment');
      return null;
    }
    
    // SimpleAccount Factory address on Base Sepolia
    const SIMPLE_ACCOUNT_FACTORY = '0x9406Cc6185a346906296840746125a0E44976454';
    
    // EntryPoint contract address (standard for ERC-4337)
    const ENTRYPOINT_ADDRESS = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
    
    // To create the wallet, we need to generate the initialization data for SimpleAccount
    // The init data requires the owner address
    const initData = `0x${ownerAddress.slice(2).padStart(64, '0')}`;
    
    // Calculate the counterfactual address of the wallet
    const predictResponse = await fetch('https://api.stackup.sh/v1/node/base_sepolia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STACKUP_API_KEY}`
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_sendUserOperation',
        params: [{
          // This is a deploy operation with our factory
          sender: '0x', // Will be filled by the bundler's prediction
          factory: SIMPLE_ACCOUNT_FACTORY,
          factoryData: initData,
          callData: '0x', // No initial call
          nonce: '0x0',
          callGasLimit: '0x55555',
          verificationGasLimit: '0x55555',
          preVerificationGas: '0x55555',
          maxFeePerGas: '0x55555',
          maxPriorityFeePerGas: '0x55555',
          paymasterAndData: '0x'
        }, ENTRYPOINT_ADDRESS]
      })
    });
    
    if (!predictResponse.ok) {
      const errorText = await predictResponse.text();
      throw new Error(`Error from StackUp API: ${errorText}`);
    }
    
    const predictData = await predictResponse.json();
    
    if (predictData.error) {
      throw new Error(`StackUp API returned error: ${JSON.stringify(predictData.error)}`);
    }
    
    // The wallet address should be in the predictData.result
    if (!predictData.result || !predictData.result.sender) {
      throw new Error(`Unexpected response format from StackUp API: ${JSON.stringify(predictData)}`);
    }
    
    return predictData.result.sender;
  } catch (error) {
    console.error('Error deploying SimpleAccount wallet:', error);
    throw error; // Re-throw to be handled by caller
  }
}

/**
 * Get a wallet by its smart wallet address
 * @param smartWalletAddress The smart wallet address
 * @returns The wallet information or null if not found
 */
export async function getWallet(smartWalletAddress) {
  return storage.getWalletBySmartAddress(smartWalletAddress);
}

/**
 * Get the balance of a wallet
 * @param walletAddress The wallet address
 * @returns The balance in ETH
 */
export async function getWalletBalance(walletAddress) {
  // In a real implementation, we would use viem or ethers to query the blockchain
  // For now, just return a simulated balance
  return '0.05';
}

/**
 * Verify a passkey signature
 * @param passkeyId The passkey ID
 * @param signature The signature
 * @param message The message that was signed
 * @returns Whether the signature is valid
 */
export async function verifyPasskeySignature(passkeyId, signature, message) {
  // In a real implementation, we would verify the WebAuthn signature
  // For now, just return true to simulate a valid signature
  return true;
}

export default {
  createWallet,
  getWallet,
  getWalletBalance,
  verifyPasskeySignature
};