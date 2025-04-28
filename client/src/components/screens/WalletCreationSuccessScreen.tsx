import React from 'react';
import { useAppContext } from '@/context/AppContext';

export default function WalletCreationSuccessScreen() {
  const { navigateTo, walletBalance } = useAppContext();
  
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80px',
          height: '80px',
          margin: '0 auto 1.5rem',
          borderRadius: '50%',
          background: '#10B981',
          color: 'white',
          fontSize: '2.5rem'
        }}>
          ✓
        </div>
        
        <h1 style={{ 
          fontSize: '2.5rem', 
          color: '#10B981',
          marginBottom: '1rem'
        }}>
          Wallet Created!
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: '#4B5563', marginBottom: '2rem' }}>
          Your wallet is ready to use
        </p>
      </div>
      
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#4F46E5', marginTop: 0 }}>Wallet Details</h2>
        
        <div style={{
          background: 'rgba(79, 70, 229, 0.1)',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          marginTop: '1rem'
        }}>
          <p style={{ margin: '0 0 0.5rem', color: '#6B7280' }}>
            Current Balance
          </p>
          <p style={{ 
            margin: 0, 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#4F46E5'
          }}>
            {walletBalance} ETH
          </p>
        </div>
        
        <p style={{ marginTop: '1.5rem', color: '#4B5563' }}>
          Your wallet is secured by your device's biometrics. You can now send and receive crypto instantly.
        </p>
      </div>
      
      <button 
        onClick={() => navigateTo('mainApp')}
        style={{
          background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '0.5rem',
          fontSize: '1.125rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        Go to Wallet
      </button>
    </div>
  );
}