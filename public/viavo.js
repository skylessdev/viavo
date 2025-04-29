
console.log('Viavo MVP loaded');

// Create a basic welcome screen
document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  const loadingElement = document.querySelector('.loading');
  const loadingText = document.querySelector('.container > p');
  
  if (loadingElement) loadingElement.style.display = 'none';
  if (loadingText) loadingText.style.display = 'none';
  
  if (root) {
    root.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
          <h1 style="color: #1d4ed8; margin-bottom: 1.5rem;">Welcome to Viavo</h1>
          
          <div style="margin: 2rem 0;">
            <p style="font-size: 1.2rem; margin-bottom: 1.5rem;">Create your wallet with biometric security</p>
            
            <button id="create-wallet-btn" style="background-color: #1d4ed8; color: white; border: none; padding: 1rem 2rem; font-size: 1.1rem; border-radius: 0.5rem; cursor: pointer; transition: background-color 0.3s;">
              Create Wallet
            </button>
          </div>
          
          <div style="margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb;">
            <h3 style="margin-bottom: 1rem;">About Viavo</h3>
            <p style="line-height: 1.6;">Viavo is a progressive web app for seamless crypto payments, featuring smart wallet technology and advanced authentication. Securely send and receive cryptocurrency with just a few taps.</p>
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners
    document.getElementById('create-wallet-btn').addEventListener('click', function() {
      this.textContent = 'Creating Wallet...';
      this.disabled = true;
      this.style.opacity = '0.7';
      
      // Simulate wallet creation
      setTimeout(() => {
        showWalletCreationSuccess();
      }, 2000);
    });
  }
});

// Simulate wallet creation success
function showWalletCreationSuccess() {
  const root = document.getElementById('root');
  
  if (root) {
    root.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
          <div style="color: #16a34a; margin-bottom: 1.5rem; font-size: 4rem;">✅</div>
          <h1 style="color: #16a34a; margin-bottom: 1.5rem;">Wallet Created!</h1>
          
          <div style="margin: 2rem 0;">
            <p style="font-size: 1.2rem; margin-bottom: 1.5rem;">Your wallet is ready to use</p>
            <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 1.5rem;">Wallet Address: 0x1234...5678</p>
            
            <button id="continue-btn" style="background-color: #1d4ed8; color: white; border: none; padding: 1rem 2rem; font-size: 1.1rem; border-radius: 0.5rem; cursor: pointer; transition: background-color 0.3s;">
              Continue to App
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners
    document.getElementById('continue-btn').addEventListener('click', function() {
      this.textContent = 'Loading...';
      this.disabled = true;
      this.style.opacity = '0.7';
      
      // Simulate main app loading
      setTimeout(() => {
        showMainApp();
      }, 1500);
    });
  }
}

// Simulate main app
function showMainApp() {
  const root = document.getElementById('root');
  
  if (root) {
    root.innerHTML = `
      <div style="height: 100vh; display: flex; flex-direction: column;">
        <!-- Header -->
        <header style="background: #1d4ed8; color: white; padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-weight: bold; font-size: 1.25rem;">Viavo</div>
          <div>Balance: 0.05 ETH</div>
        </header>
        
        <!-- Main content -->
        <main style="flex: 1; padding: 1.5rem; overflow-y: auto;">
          <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 1.5rem;">
            <h2 style="margin-bottom: 1rem;">Quick Actions</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <button style="background: #f3f4f6; padding: 1rem; border: none; border-radius: 0.5rem; cursor: pointer;">
                Send
              </button>
              <button style="background: #f3f4f6; padding: 1rem; border: none; border-radius: 0.5rem; cursor: pointer;">
                Receive
              </button>
            </div>
          </div>
          
          <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <h2 style="margin-bottom: 1rem;">Recent Transactions</h2>
            <div style="color: #9ca3af; text-align: center; padding: 2rem;">
              No transactions yet
            </div>
          </div>
        </main>
        
        <!-- Footer/navigation -->
        <footer style="background: white; padding: 1rem; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-around;">
          <button style="background: none; border: none; padding: 0.5rem 1rem; cursor: pointer; color: #1d4ed8;">Home</button>
          <button style="background: none; border: none; padding: 0.5rem 1rem; cursor: pointer; color: #6b7280;">Transactions</button>
          <button style="background: none; border: none; padding: 0.5rem 1rem; cursor: pointer; color: #6b7280;">Settings</button>
        </footer>
      </div>
    `;
  }
}
