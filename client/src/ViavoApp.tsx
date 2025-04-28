import React from 'react';

function ViavoApp() {
  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{
        background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
        padding: '20px',
        borderRadius: '12px',
        color: 'white',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: '0', fontSize: '28px' }}>Viavo</h1>
        <p style={{ margin: '10px 0 0' }}>Instant crypto payments with just one tap</p>
      </header>
      
      <main>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#4F46E5', marginTop: '0' }}>Welcome to Viavo</h2>
          <p>Create an invisible wallet secured by your device's biometrics.</p>
          <p>Send and receive ETH/USDC instantly via payment links.</p>
          
          <button style={{
            background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '20px',
            display: 'block',
            width: '100%'
          }}>
            Get Started
          </button>
        </div>
        
        <div style={{
          marginTop: '30px',
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            flex: '1',
            minWidth: '200px',
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#4F46E5', marginTop: '0' }}>No Seed Phrases</h3>
            <p>Secure your crypto with just your fingerprint or face ID.</p>
          </div>
          
          <div style={{
            flex: '1',
            minWidth: '200px',
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#4F46E5', marginTop: '0' }}>No Gas Handling</h3>
            <p>Transactions are processed automatically without manual gas fees.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ViavoApp;