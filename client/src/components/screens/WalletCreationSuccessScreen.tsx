import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/button';
import { formatAddress } from '../../lib/utils';

const WalletCreationSuccessScreen: React.FC = () => {
  const { navigateTo, wallet } = useAppContext();

  // Automatically navigate to main app after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      navigateTo('mainApp');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigateTo]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-full bg-green-100">
              <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Wallet Created!
          </h1>
          <p className="text-gray-600">
            Your secure crypto wallet is ready to use
          </p>
        </div>

        <div className="py-6">
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  Wallet Details
                </h2>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-mono text-sm break-all">
                    {wallet?.smartWalletAddress ? 
                      formatAddress(wallet.smartWalletAddress, 8) : 
                      'Wallet address loading...'}
                  </p>
                </div>
                
                <p className="mt-4 text-gray-600">
                  Your wallet is secured with biometric authentication and ready to receive funds.
                </p>
              </div>

              <div className="p-4 text-left bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> You'll be automatically redirected to the main app in a few seconds.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => navigateTo('mainApp')}
            className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
          >
            Continue to Wallet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WalletCreationSuccessScreen;