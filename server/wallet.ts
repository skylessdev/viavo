import { type Address } from 'viem';
import { storage } from './storage';
import crypto from 'crypto';

/**
 * Create a wallet for a user based on their passkey credential
 * @param passkeyCredential The WebAuthn credential
 * @returns The created wallet information or null if creation failed
 */
export async function createWallet(passkeyCredential: any): Promise<{ address: string, smartWalletAddress: string } | null> {
  try {
    // Generate a deterministic address from the passkey
    // In a real implementation, we'd derive this properly from the WebAuthn public key
    const passkeyId = passkeyCredential.id || crypto.randomBytes(32).toString('hex');
    const walletSeed = crypto.createHash('sha256').update(passkeyId).digest('hex');
    
    // Generate owner address (would be derived from passkey in production)
    const address = '0x' + walletSeed.substring(0, 40) as Address;
    
    console.log(`Creating real wallet for owner address: ${address}`);
    
    // Create an actual ERC-4337 smart contract wallet using StackUp
    const smartWalletAddress = await deploySimpleAccountWallet(address);
    
    if (!smartWalletAddress) {
      throw new Error('Failed to deploy smart wallet via StackUp');
    }
    
    console.log(`Successfully deployed smart wallet at address: ${smartWalletAddress}`);
    
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
async function deploySimpleAccountWallet(ownerAddress: Address): Promise<string | null> {
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
    
    const predictData = await predictResponse.json();
    
    if (predictData.error) {
      console.error('Error predicting wallet address:', predictData.error);
      return null;
    }
    
    // Extract the wallet address from the prediction
    const userOp = predictData.result;
    const smartWalletAddress = userOp.sender;
    
    console.log('Predicted smart wallet address:', smartWalletAddress);
    
    // Now deposit some ETH to the EntryPoint contract to pay for the wallet deployment
    // This step is optional if you're using a paymaster
    
    // Now actually submit the UserOperation to deploy the wallet
    const deployResponse = await fetch('https://api.stackup.sh/v1/node/base_sepolia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STACKUP_API_KEY}`
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_sendUserOperation',
        params: [userOp, ENTRYPOINT_ADDRESS]
      })
    });
    
    const deployResult = await deployResponse.json();
    
    if (deployResult.error) {
      console.error('Error deploying wallet:', deployResult.error);
      return null;
    }
    
    const userOpHash = deployResult.result;
    console.log('UserOp submitted for wallet deployment, hash:', userOpHash);
    
    // Now wait for the transaction to be included
    let receipt = null;
    for (let i = 0; i < 10; i++) {
      const receiptResponse = await fetch('https://api.stackup.sh/v1/node/base_sepolia', {
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
      
      const receiptData = await receiptResponse.json();
      
      if (receiptData.result) {
        receipt = receiptData.result;
        break;
      }
      
      console.log(`Waiting for wallet deployment transaction (attempt ${i+1}/10)...`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    }
    
    if (!receipt) {
      console.error('Timeout waiting for wallet deployment transaction');
      return null;
    }
    
    console.log('Wallet deployment completed, transaction hash:', receipt.transactionHash);
    
    // The wallet is now deployed at smartWalletAddress
    return smartWalletAddress;
  } catch (error) {
    console.error('Error deploying smart wallet:', error);
    return null;
  }
}

/**
 * Get a wallet by its smart wallet address
 * @param smartWalletAddress The smart wallet address
 * @returns The wallet information or null if not found
 */
export async function getWallet(smartWalletAddress: string): Promise<{ address: string, smartWalletAddress: string, passkeyId: string } | null> {
  try {
    return await storage.getWalletBySmartAddress(smartWalletAddress);
  } catch (error) {
    console.error('Error getting wallet:', error);
    return null;
  }
}

/**
 * Get the balance of a wallet
 * @param walletAddress The wallet address
 * @returns The balance in ETH
 */
export async function getWalletBalance(walletAddress: string): Promise<string> {
  try {
    // In a real implementation, this would query the blockchain
    // For the MVP, we'll return a mock balance
    return '0.00';
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return '0.00';
  }
}

/**
 * Verify a passkey signature
 * @param passkeyId The passkey ID
 * @param signature The signature
 * @param message The message that was signed
 * @returns Whether the signature is valid
 */
export async function verifyPasskeySignature(passkeyId: string, signature: any, message: string): Promise<boolean> {
  try {
    // In a real implementation, this would verify the WebAuthn signature
    // For the MVP, we'll always return true
    return true;
  } catch (error) {
    console.error('Error verifying passkey signature:', error);
    return false;
  }
}
