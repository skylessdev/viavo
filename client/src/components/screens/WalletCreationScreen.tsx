import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function WalletCreationScreen() {
  const { createUserWallet } = useAppContext();
  
  const handleSetupBiometrics = () => {
    createUserWallet();
  };
  
  return (
    <div className="fixed inset-0 z-40 bg-white p-6">
      <div className="w-full max-w-xs mx-auto flex flex-col items-center text-center space-y-6 pt-12">
        <div className="relative w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-primary-100 pulse-ring">
          <Icon name="fingerprint" className="text-primary-600 text-4xl" />
        </div>
        
        <h1 className="text-2xl font-bold text-neutral-900">Secure Your Wallet</h1>
        
        <p className="text-neutral-600 mb-4">
          Use your device biometrics to create an invisible wallet. No seed phrases to remember.
        </p>
        
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 w-full">
          <div className="flex items-center mb-2">
            <Icon name="security" className="text-primary-600 mr-2" />
            <span className="font-medium">Your crypto, your control</span>
          </div>
          <p className="text-sm text-neutral-600 text-left">
            Your wallet is non-custodial and secured by your device's biometrics.
          </p>
        </div>
        
        <Button 
          className="w-full mt-6 py-6 text-base flex items-center justify-center"
          onClick={handleSetupBiometrics}
        >
          <Icon name="face" className="mr-2" />
          Set up with FaceID/Fingerprint
        </Button>
        
        <p className="text-xs text-neutral-500 mt-4">
          By continuing, you agree to our <a href="#" className="text-primary-600">Terms</a> and <a href="#" className="text-primary-600">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
