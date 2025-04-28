import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { formatAddress } from '@/lib/utils';

export default function PaymentConfirmationModal() {
  const { hideModal, showModal, confirmPayment, pendingPayment } = useAppContext();
  
  if (!pendingPayment) return null;
  
  const handleConfirmWithBiometrics = () => {
    confirmPayment();
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-neutral-900 bg-opacity-50">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-5">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold">Confirm Payment</h2>
            <button 
              className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center"
              onClick={hideModal}
            >
              <Icon name="close" className="text-neutral-600" />
            </button>
          </div>
          
          <div className="text-center mb-5">
            <p className="text-sm text-neutral-500 mb-1">You're sending</p>
            <p className="text-3xl font-bold mb-1">
              {pendingPayment.amount} {pendingPayment.currency}
            </p>
            {pendingPayment.memo && (
              <p className="text-neutral-600">{pendingPayment.memo}</p>
            )}
          </div>
          
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-neutral-200 mr-3"></div>
              <div>
                <p className="font-medium">{pendingPayment.recipientName || 'Unknown recipient'}</p>
                <p className="text-sm text-neutral-500 truncate">
                  {formatAddress(pendingPayment.recipientAddress, 6)}
                </p>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Network fee</span>
              <span className="font-medium text-neutral-700">Covered by Viavo</span>
            </div>
          </div>
          
          <Button 
            className="w-full py-6 text-base flex items-center justify-center"
            onClick={handleConfirmWithBiometrics}
          >
            <Icon name="fingerprint" className="mr-2" />
            Confirm with Biometrics
          </Button>
        </div>
      </div>
    </div>
  );
}
