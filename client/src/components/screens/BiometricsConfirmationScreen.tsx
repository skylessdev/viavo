import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function BiometricsConfirmationScreen() {
  const { navigateTo } = useAppContext();
  const [isVerifying, setIsVerifying] = useState(true);
  
  useEffect(() => {
    // Simulate biometric verification process
    const timer = setTimeout(() => {
      setIsVerifying(false);
      // Navigate to success screen after verification
      setTimeout(() => {
        navigateTo('walletCreationSuccess');
      }, 500);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [navigateTo]);
  
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
          Biometric Verification
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: '#4B5563', marginBottom: '2rem' }}>
          Confirm using your device biometrics
        </p>
      </div>
      
      <div style={{
        background: 'white',
        padding: '3rem 2rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '120px',
          height: '120px',
          margin: '0 auto 1.5rem',
          borderRadius: '50%',
          background: 'rgba(79, 70, 229, 0.1)',
          color: '#4F46E5',
          fontSize: '2.5rem',
          position: 'relative'
        }}>
          {isVerifying ? (
            // Animated scanning indicator
            <>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '2px solid #4F46E5',
                animation: 'pulse 1.5s infinite',
                opacity: 0.7
              }} />
              👆
            </>
          ) : (
            // Success indicator
            <>✅</>
          )}
        </div>
        
        <h2 style={{ color: '#4F46E5', marginTop: 0 }}>
          {isVerifying ? 'Verifying Biometrics...' : 'Verification Complete'}
        </h2>
        
        <p style={{ color: '#4B5563' }}>
          {isVerifying 
            ? 'Please wait while we verify your biometrics...' 
            : 'Your wallet has been created and secured with your biometrics.'}
        </p>
      </div>
      
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(0.95);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.3;
            }
            100% {
              transform: scale(0.95);
              opacity: 0.7;
            }
          }
        `}
      </style>
    </div>
  );
}