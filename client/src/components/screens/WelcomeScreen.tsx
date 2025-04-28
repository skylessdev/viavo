import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function WelcomeScreen() {
  const { navigateTo } = useAppContext();
  
  const handleContinue = () => {
    navigateTo('walletCreation');
  };
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-6">
      <div className="w-full max-w-xs flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-primary-100">
          <Icon name="payment" className="text-primary-600 text-4xl" />
        </div>
        
        <h1 className="text-2xl font-bold text-neutral-900">Welcome to Viavo</h1>
        
        <p className="text-neutral-600 mb-6">
          Instant crypto payments with just one tap. No seed phrases. No gas handling.
        </p>
        
        <Button 
          className="w-full py-6 text-base"
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
