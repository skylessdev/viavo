import React from 'react';
import { SimpleProvider, useSimpleContext } from './context/SimpleContext';

// Component that uses the context (must be inside the provider)
function HelloViavo() {
  // Use our simple context
  const { appName, version } = useSimpleContext();
  
  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem'
      }}>
        Hello {appName}!
      </h1>
      
      <p style={{ fontSize: '1.25rem', color: '#4B5563', marginBottom: '2rem' }}>
        Welcome to our minimal working example (v{version})
      </p>
      
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#4F46E5', marginTop: 0 }}>Getting Started</h2>
        <p>This is a minimal React app with context working properly.</p>
        <p>Once we confirm this works, we'll gradually add the full Viavo functionality.</p>
      </div>
      
      <button style={{
        background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}>
        Continue
      </button>
    </div>
  );
}

// Main app component that wraps everything with the provider
function MinimalApp() {
  return (
    <SimpleProvider>
      <HelloViavo />
    </SimpleProvider>
  );
}

export default MinimalApp;