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

  // Wallet functions (simplified mocks for now)
  const checkIfWalletExists = useCallback(async () => {
    console.log('Checking if wallet exists...');
    setIsWalletLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // For testing, we'll just say no wallet exists initially
      setHasWallet(false);
      setIsWalletLoading(false);
    }, 500);
  }, []);

  const createWallet = useCallback(async () => {
    console.log('Creating wallet...');
    setIsWalletLoading(true);
    
    // Simulate API call to create wallet
    setTimeout(() => {
      setHasWallet(true);
      setWalletBalance('0.05');
      setIsWalletLoading(false);
      navigateTo('biometricsConfirmation');
    }, 1000);
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