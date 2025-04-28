// Debug script to test StackUp API integration
// Run this with: node server/debug-stackup.js

import crypto from 'crypto';

async function testStackUpIntegration() {
  console.log('Testing StackUp API integration...');
  
  const STACKUP_API_KEY = process.env.STACKUP_API_KEY;
  if (!STACKUP_API_KEY) {
    console.error('ERROR: STACKUP_API_KEY is missing in environment variables');
    return;
  }
  
  console.log('StackUp API key is available');
  
  // Generate a random owner address for testing
  const walletSeed = crypto.createHash('sha256').update(`test-${Date.now()}`).digest('hex');
  const ownerAddress = '0x' + walletSeed.substring(0, 40);
  
  console.log(`Testing with owner address: ${ownerAddress}`);
  
  // SimpleAccount Factory address on Base Sepolia
  const SIMPLE_ACCOUNT_FACTORY = '0x9406Cc6185a346906296840746125a0E44976454';
  
  // EntryPoint contract address (standard for ERC-4337)
  const ENTRYPOINT_ADDRESS = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
  
  // To create the wallet, we need to generate the initialization data for SimpleAccount
  // The init data requires the owner address
  const initData = `0x${ownerAddress.slice(2).padStart(64, '0')}`;
  
  console.log('Predicting counterfactual wallet address...');
  
  try {
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
      return;
    }
    
    // Extract the wallet address from the prediction
    const userOp = predictData.result;
    const smartWalletAddress = userOp.sender;
    
    console.log('Predicted smart wallet address:', smartWalletAddress);
    console.log('Full UserOperation:', JSON.stringify(userOp, null, 2));
    
    console.log('Submitting UserOperation to deploy wallet...');
    
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
      return;
    }
    
    const userOpHash = deployResult.result;
    console.log('UserOp submitted for wallet deployment, hash:', userOpHash);
    
    // Now wait for the transaction to be included
    console.log('Waiting for transaction to be confirmed...');
    
    let receipt = null;
    for (let i = 0; i < 10; i++) {
      console.log(`Checking transaction status (attempt ${i+1}/10)...`);
      
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
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    }
    
    if (!receipt) {
      console.log('Transaction still processing. Check Base Sepolia explorer later.');
      console.log(`UserOpHash to look up: ${userOpHash}`);
      console.log(`Wallet address: ${smartWalletAddress}`);
      return;
    }
    
    console.log('Wallet deployment completed!');
    console.log('Transaction hash:', receipt.transactionHash);
    console.log('UserOp hash:', userOpHash);
    console.log('Wallet address:', smartWalletAddress);
    console.log('Owner address:', ownerAddress);
    console.log('Check on Base Sepolia Explorer: https://sepolia.basescan.org/tx/' + receipt.transactionHash);
    
  } catch (error) {
    console.error('Error in StackUp integration test:', error);
  }
}

// Run the test
testStackUpIntegration();