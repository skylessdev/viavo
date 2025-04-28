import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function WalletCreationSuccessScreen() {
  const { navigateTo } = useAppContext();
  
  const handleContinue = () => {
    navigateTo('mainApp');
  };
  
  return (
    <div className="fixed inset-0 z-20 bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xs flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 mb-6 rounded-full bg-secondary-100 flex items-center justify-center">
          <Icon name="check_circle" className="text-secondary-600 text-4xl" />
        </div>
        
        <h1 className="text-2xl font-bold text-neutral-900">Wallet Created!</h1>
        
        <p className="text-neutral-600">
          Your wallet is ready to use. No seed phrases required.
        </p>
        
        <Button 
          className="w-full mt-4 py-6 text-base"
          onClick={handleContinue}
        >
          Continue to App
        </Button>
      </div>
    </div>
  );
}
