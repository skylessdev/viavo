import React from 'react';
import { useAppContext } from '@/context/AppContext';

export default function MainAppScreen() {
  const { showModal, walletBalance, wallet } = useAppContext();
  
  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ 
          fontSize: '1.75rem',
          background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0
        }}>
          Viavo
        </h1>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          alignItems: 'flex-end'
        }}>
          <div style={{
            background: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <span style={{ fontWeight: 'bold', color: '#4F46E5' }}>{walletBalance} ETH</span>
          </div>
          <div style={{
            background: 'rgba(79, 70, 229, 0.1)',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.875rem'
          }}>
            Wallet: {wallet?.smartWalletAddress.slice(0,6)}...{wallet?.smartWalletAddress.slice(-4)}
          </div>
        </div>
      </header>
      
      <div style={{
        background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
        padding: '2rem',
        borderRadius: '0.75rem',
        color: 'white',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.5rem' }}>
          Welcome to your wallet
        </h2>
        <p style={{ margin: '0 0 1.5rem', opacity: 0.9 }}>
          Send and receive crypto instantly with just a tap.
        </p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <button 
          onClick={() => showModal('createPaymentLink')}
          style={{
            background: 'white',
            border: 'none',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{
            fontSize: '2rem',
            marginBottom: '0.75rem',
            color: '#4F46E5'
          }}>
            💸
          </div>
          <div style={{ fontWeight: 'bold', color: '#4F46E5' }}>
            Create Payment Link
          </div>
        </button>
        
        <button 
          onClick={() => showModal('receivePayment')}
          style={{
            background: 'white',
            border: 'none',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{
            fontSize: '2rem',
            marginBottom: '0.75rem',
            color: '#4F46E5'
          }}>
            📥
          </div>
          <div style={{ fontWeight: 'bold', color: '#4F46E5' }}>
            Receive Payment
          </div>
        </button>
      </div>
      
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ margin: '0 0 1rem', color: '#4F46E5' }}>Recent Transactions</h2>
        <div style={{ color: '#6B7280', textAlign: 'center', padding: '2rem 0' }}>
          No transactions yet
        </div>
      </div>
    </div>
  );
}