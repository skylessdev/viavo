import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { formatAddress, copyToClipboard, shareContent } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function ReceivePaymentModal() {
  const { hideModal, wallet } = useAppContext();
  const { toast } = useToast();
  
  if (!wallet) return null;
  
  const walletAddress = wallet.smartWalletAddress;
  
  const handleCopyAddress = async () => {
    const success = await copyToClipboard(walletAddress);
    if (success) {
      toast({
        title: "Address copied to clipboard",
        duration: 2000
      });
    }
  };
  
  const handleShareAddress = async () => {
    const success = await shareContent(
      "Viavo Wallet Address",
      "Send ETH to my wallet address",
      walletAddress
    );
    
    if (!success && navigator.share === undefined) {
      toast({
        title: "Address copied to clipboard",
        description: "Share functionality not available",
        duration: 3000
      });
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-neutral-900 bg-opacity-50">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-5">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold">Receive Payment</h2>
            <button 
              className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center"
              onClick={hideModal}
            >
              <Icon name="close" className="text-neutral-600" />
            </button>
          </div>
          
          <div className="bg-neutral-50 border border-dashed border-neutral-300 rounded-lg p-4 mb-5 text-center">
            <p className="text-sm text-neutral-600 mb-3">Scan this QR code to send me ETH</p>
            <div className="mx-auto w-48 h-48 bg-white p-2 rounded-lg shadow-sm mb-3">
              {/* This would be a real QR code in production */}
              <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                <Icon name="qr_code_2" className="text-neutral-400 text-6xl" />
              </div>
            </div>
            
            <p className="text-sm text-neutral-600 mb-2">Your wallet address:</p>
            <div className="flex bg-white rounded-lg border border-neutral-200 overflow-hidden mb-3">
              <div className="flex-1 p-3 truncate text-sm">
                {walletAddress}
              </div>
              <button 
                className="bg-primary-50 text-primary-600 px-3 border-l border-neutral-200 flex items-center justify-center"
                onClick={handleCopyAddress}
              >
                <Icon name="content_copy" />
              </button>
            </div>
            
            <p className="text-xs text-neutral-500">Funds will be added to your wallet automatically</p>
          </div>
          
          <Button 
            className="w-full py-6 text-base flex items-center justify-center"
            onClick={handleShareAddress}
          >
            <Icon name="share" className="mr-2" />
            Share Address
          </Button>
        </div>
      </div>
    </div>
  );
}
