import React, { useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import WelcomeScreen from '@/components/screens/WelcomeScreen';
import WalletCreationScreen from '@/components/screens/WalletCreationScreen';
import BiometricsConfirmationScreen from '@/components/screens/BiometricsConfirmationScreen';
import WalletCreationSuccessScreen from '@/components/screens/WalletCreationSuccessScreen';
import MainAppScreen from '@/components/screens/MainAppScreen';

// Using this component to wrap the actual app content
// This ensures that we separate the AppProvider from the components using the context
function AppContent() {
  const { screen, checkIfWalletExists } = useAppContext();
  
  useEffect(() => {
    // Check if user already has a wallet when app loads
    checkIfWalletExists();
  }, [checkIfWalletExists]);
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
      {/* Screens */}
      {screen === 'welcome' && <WelcomeScreen />}
      {screen === 'walletCreation' && <WalletCreationScreen />}
      {screen === 'biometricsConfirmation' && <BiometricsConfirmationScreen />}
      {screen === 'walletCreationSuccess' && <WalletCreationSuccessScreen />}
      {screen === 'mainApp' && <MainAppScreen />}
      
      {/* TODO: Add modal components later */}
    </div>
  );
}

// Main App component that wraps everything with the provider
function ViavoMVP() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default ViavoMVP;