import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';

// Basic screen and modal types
type ScreenType = 'welcome' | 'walletCreation' | 'biometricsConfirmation' | 'walletCreationSuccess' | 'mainApp';
type ModalType = 'createPaymentLink' | 'paymentLinkGenerated' | 'receivePayment' | 'paymentConfirmation' | 'paymentSuccess' | null;

// Define a minimal version of the context interface
interface AppContextInterface {
  // Navigation state
  screen: ScreenType;
  modal: ModalType;
  navigateTo: (screen: ScreenType) => void;
  showModal: (modal: ModalType) => void;
  hideModal: () => void;
  
  // Wallet state (simplified for now)
  hasWallet: boolean;
  walletBalance: string;
  isWalletLoading: boolean;
  wallet: { smartWalletAddress: string } | null;
  
  // Basic wallet functions
  checkIfWalletExists: () => Promise<void>;
  createWallet: () => Promise<void>;
}

// Create context with default values
const AppContext = createContext<AppContextInterface | undefined>(undefined);

// Create a provider component
export function AppProvider({ children }: { children: ReactNode }) {
  // State
  const [screen, setScreen] = useState<ScreenType>('welcome');
  const [modal, setModal] = useState<ModalType>(null);
  const [hasWallet, setHasWallet] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<string>('0.00');
  const [isWalletLoading, setIsWalletLoading] = useState<boolean>(false);

  // Navigation functions
  const navigateTo = useCallback((newScreen: ScreenType) => {
    setScreen(newScreen);
  }, []);

  const showModal = useCallback((newModal: ModalType) => {
    setModal(newModal);
  }, []);

  const hideModal = useCallback(() => {
    setModal(null);
  }, []);

  // Wallet state
  const [wallet, setWallet] = useState<{ smartWalletAddress: string } | null>(null);

  // Wallet functions
  const checkIfWalletExists = useCallback(async () => {
    console.log('Checking if wallet exists...');
    setIsWalletLoading(true);
    
    const savedWallet = localStorage.getItem('viavo_wallet');
    if (savedWallet) {
      const walletData = JSON.parse(savedWallet);
      setWallet(walletData);
      setHasWallet(true);
      setWalletBalance('0.05'); // This would be fetched from the chain
    }
    setIsWalletLoading(false);
  }, []);

  const createWallet = useCallback(async () => {
    console.log('Creating wallet...');
    setIsWalletLoading(true);
    
    try {
      // Create the wallet and get the transaction
      const newWallet = {
        smartWalletAddress: '0x9406Cc6185a346906296840746125a0E44976454' // This should come from your wallet.ts
      };
      
      localStorage.setItem('viavo_wallet', JSON.stringify(newWallet));
      setWallet(newWallet);
      setHasWallet(true);
      setWalletBalance('0.05');
      navigateTo('biometricsConfirmation');
    } catch (err) {
      console.error('Error creating wallet:', err);
    } finally {
      setIsWalletLoading(false);
    }
  }, [navigateTo]);

  // Combine all values
  const value: AppContextInterface = {
    screen,
    modal,
    navigateTo,
    showModal,
    hideModal,
    hasWallet,
    walletBalance,
    isWalletLoading,
    wallet,
    checkIfWalletExists,
    createWallet
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use this context
export function useAppContext() {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
}