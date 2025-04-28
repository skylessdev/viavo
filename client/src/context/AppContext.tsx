import { createContext, useState, useContext, useCallback, ReactNode, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { usePayment, type PaymentParams, type Transaction } from '@/hooks/usePayment';
import { usePasskey } from '@/hooks/usePasskey';
import { useToast } from '@/hooks/use-toast';

// Screen and modal types
type ScreenType = 'welcome' | 'walletCreation' | 'biometricsConfirmation' | 'walletCreationSuccess' | 'mainApp';
type ModalType = 'createPaymentLink' | 'paymentLinkGenerated' | 'receivePayment' | 'paymentConfirmation' | 'paymentSuccess' | null;

// Context interface
interface AppContextInterface {
  screen: ScreenType;
  modal: ModalType;
  navigateTo: (screen: ScreenType) => void;
  showModal: (modal: ModalType) => void;
  hideModal: () => void;
  wallet: ReturnType<typeof useWallet>['wallet'];
  walletBalance: string;
  isCreatingWallet: boolean;
  isProcessingPayment: boolean;
  paymentLink: ReturnType<typeof usePayment>['paymentLink'];
  pendingPayment: ReturnType<typeof usePayment>['pendingPayment'];
  completedPayment: ReturnType<typeof usePayment>['completedPayment'];
  transactions: Transaction[];
  checkIfWalletExists: () => Promise<void>;
  createUserWallet: () => Promise<void>;
  refreshWalletBalance: () => Promise<void>;
  generatePaymentLink: (params: PaymentParams) => Promise<void>;
  confirmPayment: () => Promise<void>;
  isPasskeySupported: boolean | null;
}

// Create context with default values to avoid undefined errors
const defaultContextValue: AppContextInterface = {
  screen: 'welcome',
  modal: null,
  navigateTo: () => {},
  showModal: () => {},
  hideModal: () => {},
  wallet: null,
  walletBalance: '0.00',
  isCreatingWallet: false,
  isProcessingPayment: false,
  paymentLink: null,
  pendingPayment: null,
  completedPayment: null,
  transactions: [],
  checkIfWalletExists: async () => {},
  createUserWallet: async () => {},
  refreshWalletBalance: async () => {},
  generatePaymentLink: async () => {},
  confirmPayment: async () => {},
  isPasskeySupported: null,
};

// Create context with default values
const AppContext = createContext<AppContextInterface>(defaultContextValue);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<ScreenType>('welcome');
  const [modal, setModal] = useState<ModalType>(null);
  
  const { toast } = useToast();
  const { isSupported: isPasskeySupported } = usePasskey();
  
  const {
    wallet,
    walletBalance,
    isCreatingWallet,
    createUserWallet: createWallet,
    checkWalletExists,
    refreshWalletBalance,
  } = useWallet();
  
  const {
    paymentLink,
    pendingPayment,
    completedPayment,
    isProcessing: isProcessingPayment,
    transactions,
    createPaymentLink,
    setupPayment,
    confirmPayment: confirmPaymentAction
  } = usePayment();

  // Navigate to a different screen
  const navigateTo = useCallback((newScreen: ScreenType) => {
    setScreen(newScreen);
    setModal(null);
  }, []);

  // Show a modal
  const showModal = useCallback((newModal: ModalType) => {
    setModal(newModal);
  }, []);

  // Hide the current modal
  const hideModal = useCallback(() => {
    setModal(null);
    
    // If we just completed a payment, go back to the main app
    if (modal === 'paymentSuccess') {
      refreshWalletBalance();
      navigateTo('mainApp');
    }
  }, [modal, navigateTo, refreshWalletBalance]);

  // Check if wallet exists and navigate to the appropriate screen
  const checkIfWalletExists = useCallback(async () => {
    try {
      const exists = await checkWalletExists();
      if (exists) {
        navigateTo('mainApp');
      } else {
        navigateTo('welcome');
      }
    } catch (error) {
      console.error('Error checking if wallet exists:', error);
      navigateTo('welcome');
    }
  }, [checkWalletExists, navigateTo]);

  // Create wallet with biometric confirmation
  const createUserWallet = useCallback(async () => {
    navigateTo('biometricsConfirmation');
    
    try {
      const success = await createWallet();
      if (success) {
        // After a short delay, show success screen
        setTimeout(() => {
          navigateTo('walletCreationSuccess');
        }, 2000);
      } else {
        // Show error toast and go back to wallet creation screen
        toast({
          title: "Error",
          description: "Failed to create wallet. Please try again.",
          variant: "destructive"
        });
        navigateTo('walletCreation');
      }
    } catch (error) {
      console.error('Error in createUserWallet:', error);
      toast({
        title: "Error",
        description: "Failed to create wallet. Please try again.",
        variant: "destructive"
      });
      navigateTo('walletCreation');
    }
  }, [createWallet, navigateTo, toast]);

  // Generate payment link and show the link modal
  const generatePaymentLink = useCallback(async (params: PaymentParams) => {
    try {
      const link = await createPaymentLink(params);
      if (link) {
        showModal('paymentLinkGenerated');
      }
    } catch (error) {
      console.error('Error in generatePaymentLink:', error);
      toast({
        title: "Error",
        description: "Failed to generate payment link. Please try again.",
        variant: "destructive"
      });
    }
  }, [createPaymentLink, showModal, toast]);

  // Confirm payment with biometrics and show success modal
  const confirmPayment = useCallback(async () => {
    try {
      const success = await confirmPaymentAction();
      if (success) {
        showModal('paymentSuccess');
      }
    } catch (error) {
      console.error('Error in confirmPayment:', error);
      toast({
        title: "Error",
        description: "Failed to confirm payment. Please try again.",
        variant: "destructive"
      });
      hideModal();
    }
  }, [confirmPaymentAction, hideModal, showModal, toast]);

  // Check for passkey support on mount
  useEffect(() => {
    if (isPasskeySupported === false) {
      toast({
        title: "Device not supported",
        description: "Your device does not support biometric authentication. Some features may not work.",
        variant: "destructive",
        duration: 5000
      });
    }
  }, [isPasskeySupported, toast]);

  const value = {
    screen,
    modal,
    navigateTo,
    showModal,
    hideModal,
    wallet,
    walletBalance,
    isCreatingWallet,
    isProcessingPayment,
    paymentLink,
    pendingPayment,
    completedPayment,
    transactions,
    checkIfWalletExists,
    createUserWallet,
    refreshWalletBalance,
    generatePaymentLink,
    confirmPayment,
    isPasskeySupported,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use the app context
export function useAppContext() {
  const context = useContext(AppContext);
  return context;
}
