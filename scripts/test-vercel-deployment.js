import fetch from 'node-fetch';
import readline from 'readline';

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get Vercel deployment URL from the user
const promptVercelUrl = () => {
  return new Promise((resolve) => {
    rl.question('Enter your Vercel deployment URL (e.g., https://viavo.vercel.app): ', (url) => {
      resolve(url.trim());
    });
  });
};

// Test wallet creation
const testWalletCreation = async (baseUrl) => {
  console.log('\n----- Testing Wallet Creation -----');
  try {
    // Create mock passkey credential
    const mockPasskey = {
      id: `test-passkey-${Date.now()}`,
      type: 'public-key',
      rawId: Buffer.from(`test-passkey-${Date.now()}`).toString('base64'),
      response: {
        clientDataJSON: JSON.stringify({
          type: 'webauthn.create',
          challenge: 'test-challenge',
          origin: baseUrl
        })
      }
    };

    console.log(`Sending wallet creation request to ${baseUrl}/api/wallet`);
    
    const response = await fetch(`${baseUrl}/api/wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ passkeyCredential: mockPasskey })
    });

    const data = await response.json();
    
    if (data.success && data.data) {
      console.log('✅ Wallet creation successful!');
      console.log('Wallet Details:');
      console.log(`- Owner Address: ${data.data.address}`);
      console.log(`- Smart Wallet Address: ${data.data.smartWalletAddress}`);
      console.log(`- View on Block Explorer: https://sepolia.basescan.org/address/${data.data.smartWalletAddress}`);
      return data.data;
    } else {
      console.log('❌ Wallet creation failed:');
      console.log(data);
      return null;
    }
  } catch (error) {
    console.error('❌ Error testing wallet creation:', error);
    return null;
  }
};

// Test payment link creation
const testPaymentLink = async (baseUrl, walletAddress) => {
  console.log('\n----- Testing Payment Link Creation -----');
  try {
    const paymentLinkData = {
      amount: '0.001',
      currency: 'ETH',
      recipientAddress: walletAddress,
      memo: 'Test payment link',
      expirationMinutes: 60
    };

    console.log(`Sending payment link creation request to ${baseUrl}/api/payment-link`);
    
    const response = await fetch(`${baseUrl}/api/payment-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentLinkData)
    });

    const data = await response.json();
    
    if (data.success && data.data) {
      console.log('✅ Payment link creation successful!');
      console.log('Payment Link Details:');
      console.log(`- Link: ${data.data.link}`);
      console.log(`- Link ID: ${data.data.linkId}`);
      console.log(`- Expires At: ${new Date(data.data.expiresAt).toLocaleString()}`);
      return data.data;
    } else {
      console.log('❌ Payment link creation failed:');
      console.log(data);
      return null;
    }
  } catch (error) {
    console.error('❌ Error testing payment link creation:', error);
    return null;
  }
};

// Main test function
const runTests = async () => {
  try {
    const vercelUrl = await promptVercelUrl();
    
    console.log(`\nRunning tests against ${vercelUrl}...`);
    
    // Test wallet creation
    const wallet = await testWalletCreation(vercelUrl);
    
    if (wallet) {
      // Test payment link creation
      await testPaymentLink(vercelUrl, wallet.smartWalletAddress);
    }
    
    console.log('\n----- Test Summary -----');
    console.log('Wallet Creation:', wallet ? '✅ Success' : '❌ Failed');
    
    console.log('\nNote: These tests only check the API endpoints. For a complete test:');
    console.log('1. Visit your deployed app in a browser');
    console.log('2. Create a wallet using the UI');
    console.log('3. Create and share a payment link');
    console.log('4. Complete a payment using another device or browser');
    
  } catch (error) {
    console.error('Error running tests:', error);
  } finally {
    rl.close();
  }
};

// Run the tests
runTests();