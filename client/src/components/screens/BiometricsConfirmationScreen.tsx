import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/button';

const BiometricsConfirmationScreen: React.FC = () => {
  const { navigateTo, createWallet } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateWallet = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await createWallet();
      navigateTo('walletCreationSuccess');
    } catch (err) {
      console.error('Error creating wallet:', err);
      setError(typeof err === 'string' ? err : 'Failed to create wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Biometric Authentication
          </h1>
          <p className="text-gray-600">
            Use your device's biometrics to secure your wallet
          </p>
        </div>

        <div className="py-6">
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <div className="space-y-6">
              <div className="flex items-center justify-center p-4">
                <svg className="w-20 h-20 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  Confirm with biometrics
                </h2>
                <p className="text-gray-600">
                  Your device will prompt you to use your fingerprint, face recognition, 
                  or other biometric method to create your secure wallet.
                </p>
              </div>

              <div className="p-4 text-left bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> Your biometric data never leaves your device. 
                  It's used to create a secure passkey that will protect your crypto assets.
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Button 
            onClick={handleCreateWallet}
            disabled={isLoading}
            className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Creating Wallet...' : 'Create Secure Wallet'}
          </Button>
          
          <button 
            onClick={() => navigateTo('walletCreation')}
            className="text-sm text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BiometricsConfirmationScreen;