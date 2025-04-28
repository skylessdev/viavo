import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import WelcomeScreen from '@/components/screens/WelcomeScreen';
import WalletCreationScreen from '@/components/screens/WalletCreationScreen';
import BiometricsConfirmationScreen from '@/components/screens/BiometricsConfirmationScreen';
import WalletCreationSuccessScreen from '@/components/screens/WalletCreationSuccessScreen';
import MainAppScreen from '@/components/screens/MainAppScreen';
import CreatePaymentLinkModal from '@/components/modals/CreatePaymentLinkModal';
import PaymentLinkGeneratedModal from '@/components/modals/PaymentLinkGeneratedModal';
import ReceivePaymentModal from '@/components/modals/ReceivePaymentModal';
import PaymentConfirmationModal from '@/components/modals/PaymentConfirmationModal';
import PaymentSuccessModal from '@/components/modals/PaymentSuccessModal';

// Using this component to wrap the actual app content
// This ensures that the useAppContext hook is only called after the AppProvider is mounted
function AppContent() {
  const { screen, modal, checkIfWalletExists } = useAppContext();

  useEffect(() => {
    // Check if user already has a wallet when app loads
    checkIfWalletExists();
  }, [checkIfWalletExists]);

  return (
    <div className="min-h-screen flex flex-col safe-area">
      {/* Screens */}
      {screen === 'welcome' && <WelcomeScreen />}
      {screen === 'walletCreation' && <WalletCreationScreen />}
      {screen === 'biometricsConfirmation' && <BiometricsConfirmationScreen />}
      {screen === 'walletCreationSuccess' && <WalletCreationSuccessScreen />}
      {screen === 'mainApp' && <MainAppScreen />}

      {/* Modals */}
      {modal === 'createPaymentLink' && <CreatePaymentLinkModal />}
      {modal === 'paymentLinkGenerated' && <PaymentLinkGeneratedModal />}
      {modal === 'receivePayment' && <ReceivePaymentModal />}
      {modal === 'paymentConfirmation' && <PaymentConfirmationModal />}
      {modal === 'paymentSuccess' && <PaymentSuccessModal />}
    </div>
  );
}

// Main App component that doesn't use any hooks that depend on context
function App() {
  return <AppContent />;
}

export default App;
