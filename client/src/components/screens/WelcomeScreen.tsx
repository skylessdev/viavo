import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/button';

const WelcomeScreen: React.FC = () => {
  const { navigateTo } = useAppContext();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-blue-600">
            Welcome to Viavo
          </h1>
          <p className="text-lg text-gray-600">
            Your secure wallet for crypto payments
          </p>
        </div>

        <div className="py-8">
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  Everything you need in one place
                </h2>
                <p className="text-gray-600">
                  Create your wallet with biometric security, send and receive payments,
                  and manage your crypto with ease.
                </p>
              </div>

              <ul className="space-y-2 text-left">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Secure biometric wallet</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Easy payment links</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Multi-chain support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => navigateTo('walletCreation')}
            className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
          >
            Create Wallet
          </Button>
          <p className="text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;