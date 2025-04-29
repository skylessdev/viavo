import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/button';

const WalletCreationScreen: React.FC = () => {
  const { navigateTo } = useAppContext();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create Your Wallet
          </h1>
          <p className="text-gray-600">
            Your Viavo wallet will be secured with biometric authentication
          </p>
        </div>

        <div className="py-6">
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <div className="space-y-6">
              <div className="flex items-center justify-center p-4">
                <svg className="w-20 h-20 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  Secure by design
                </h2>
                <p className="text-gray-600">
                  Your wallet will be secured using passkeys - the same biometric 
                  security you use to unlock your device.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-800">Benefits:</h3>
                <ul className="space-y-2 text-left">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>No password to remember</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Resistant to phishing</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Device-based protection</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => navigateTo('biometricsConfirmation')}
            className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
          >
            Continue
          </Button>
          <button 
            onClick={() => navigateTo('welcome')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletCreationScreen;