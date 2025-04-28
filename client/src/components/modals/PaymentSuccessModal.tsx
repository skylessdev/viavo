import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { formatAddress } from '@/lib/utils';

export default function PaymentSuccessModal() {
  const { hideModal, completedPayment } = useAppContext();
  
  if (!completedPayment) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-white p-5 flex items-center justify-center">
      <div className="max-w-lg mx-auto text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary-100 flex items-center justify-center">
          <Icon name="check_circle" className="text-secondary-600 text-4xl" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Payment Sent!</h2>
        <p className="text-neutral-600 mb-8">Your transaction has been submitted to the network.</p>
        
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6 text-left">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-neutral-500">Amount</span>
            <span className="font-medium">
              {completedPayment.amount} {completedPayment.currency}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-neutral-500">To</span>
            <span className="font-medium truncate">
              {formatAddress(completedPayment.recipientAddress, 6)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-500">Transaction ID</span>
            <a 
              href={`https://basescan.org/tx/${completedPayment.transactionId}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 text-sm truncate"
            >
              {formatAddress(completedPayment.transactionId, 6)}
            </a>
          </div>
        </div>
        
        <Button 
          className="w-full py-6 text-base"
          onClick={hideModal}
        >
          Done
        </Button>
      </div>
    </div>
  );
}
