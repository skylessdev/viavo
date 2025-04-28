import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function WalletCreationScreen() {
  const { createWallet, isWalletLoading } = useAppContext();
  const [isCheckingCompatibility, setIsCheckingCompatibility] = useState(false);
  
  const handleCreateWallet = async () => {
    setIsCheckingCompatibility(true);
    
    // Simulate checking device compatibility
    setTimeout(() => {
      setIsCheckingCompatibility(false);
      createWallet();
    }, 1000);
  };
  
  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      justifyContent: 'center'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          color: '#4F46E5',
          marginBottom: '1rem'
        }}>
          Secure Your Wallet
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: '#4B5563', marginBottom: '2rem' }}>
          Create a wallet secured by your device's biometrics
        </p>
      </div>
      
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '96px',
          height: '96px',
          margin: '0 auto 1.5rem',
          borderRadius: '50%',
          background: 'rgba(79, 70, 229, 0.1)',
          color: '#4F46E5',
          fontSize: '2rem'
        }}>
          👆
        </div>
        
        <h2 style={{ color: '#4F46E5', marginTop: 0 }}>Setup with FaceID or Fingerprint</h2>
        <p>Your crypto wallet will be secured by your device's biometrics.</p>
        <p>No seed phrases needed - just use your face or fingerprint to access your wallet.</p>
      </div>
      
      <button 
        onClick={handleCreateWallet}
        disabled={isWalletLoading || isCheckingCompatibility}
        style={{
          background: isWalletLoading || isCheckingCompatibility ? '#CBD5E1' : 'linear-gradient(to right, #4F46E5, #7C3AED)',
          color: isWalletLoading || isCheckingCompatibility ? '#64748B' : 'white',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '0.5rem',
          fontSize: '1.125rem',
          fontWeight: 'bold',
          cursor: isWalletLoading || isCheckingCompatibility ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        {isCheckingCompatibility ? 'Checking Device Compatibility...' : 
         isWalletLoading ? 'Creating Wallet...' : 
         'Create Wallet with Biometrics'}
      </button>
    </div>
  );
}