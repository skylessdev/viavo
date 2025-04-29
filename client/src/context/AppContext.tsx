import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Address } from 'viem';

// Define screen and modal types
type ScreenType = 'welcome' | 'walletCreation' | 'biometricsConfirmation' | 'walletCreationSuccess' | 'mainApp';
type ModalType = 'createPaymentLink' | 'paymentLinkGenerated' | 'receivePayment' | 'paymentConfirmation' | 'paymentSuccess' | null;

// Define the context interface
interface AppContextInterface {
  // Navigation state
  screen: ScreenType;
  modal: ModalType;
  navigateTo: (screen: ScreenType) => void;
  showModal: (modal: ModalType) => void;
  hideModal: () => void;
  
  // Wallet state
  hasWallet: boolean;
  walletBalance: string;
  isWalletLoading: boolean;
  wallet: { smartWalletAddress: string } | null;
  
  // Basic wallet functions
  checkIfWalletExists: () => Promise<void>;
  createWallet: () => Promise<any>;
}

// Create the context with default values
const AppContext = createContext<AppContextInterface>({
  screen: 'welcome',
  modal: null,
  navigateTo: () => {},
  showModal: () => {},
  hideModal: () => {},
  
  hasWallet: false,
  walletBalance: '0',
  isWalletLoading: false,
  wallet: null,
  
  checkIfWalletExists: async () => {},
  createWallet: async () => {},
});

// Provider component that wraps the app and makes context available
export function AppProvider({ children }: { children: ReactNode }) {
  // Navigation state
  const [screen, setScreen] = useState<ScreenType>('welcome');
  const [modal, setModal] = useState<ModalType>(null);
  
  // Wallet state
  const [hasWallet, setHasWallet] = useState(false);
  const [walletBalance, setWalletBalance] = useState('0');
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [wallet, setWallet] = useState<{ smartWalletAddress: string } | null>(null);
  
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
  
  // Wallet functions
  const checkIfWalletExists = useCallback(async () => {
    try {
      setIsWalletLoading(true);
      
      // Simulated API call to check if wallet exists
      // In a real app, this would be an API call to the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll assume no wallet exists initially
      setHasWallet(false);
      setWallet(null);
      
      // If we found a wallet, navigate to main app
      // if (wallet) {
      //   setHasWallet(true);
      //   navigateTo('mainApp');
      // }
    } catch (error) {
      console.error('Error checking wallet:', error);
    } finally {
      setIsWalletLoading(false);
    }
  }, []);
  
  const createWallet = useCallback(async () => {
    try {
      setIsWalletLoading(true);
      
      // Simulated API call to create wallet
      // In a real app, this would use WebAuthn and call the backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock wallet for demo purposes
      const mockWallet = {
        smartWalletAddress: '0x1234567890abcdef1234567890abcdef12345678'
      };
      
      setWallet(mockWallet);
      setHasWallet(true);
      setWalletBalance('0.05');
      
      return mockWallet;
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    } finally {
      setIsWalletLoading(false);
    }
  }, []);
  
  // Assemble the context value
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
    createWallet,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook for using the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}