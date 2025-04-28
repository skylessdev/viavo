import React from 'react';
import { useAppContext } from '@/context/AppContext';

export default function WelcomeScreen() {
  const { navigateTo } = useAppContext();
  
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
          background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          Welcome to Viavo
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: '#4B5563', marginBottom: '2rem' }}>
          Send and receive crypto instantly with just a tap.
        </p>
      </div>
      
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#4F46E5', marginTop: 0 }}>No Seed Phrases</h2>
        <p>Your wallet is secured by your device's biometrics - no seed phrases to remember.</p>
        
        <h2 style={{ color: '#4F46E5', marginTop: '1.5rem' }}>No Gas Fees</h2>
        <p>Send crypto without worrying about gas fees or complex blockchain interactions.</p>
        
        <h2 style={{ color: '#4F46E5', marginTop: '1.5rem' }}>Instant Payments</h2>
        <p>Create payment links and share them with anyone - no app download required.</p>
      </div>
      
      <button 
        onClick={() => navigateTo('walletCreation')}
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
        Get Started
      </button>
    </div>
  );
}