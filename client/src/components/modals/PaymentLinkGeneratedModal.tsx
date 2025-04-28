import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { getExpirationText, copyToClipboard, shareContent } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function PaymentLinkGeneratedModal() {
  const { hideModal, paymentLink } = useAppContext();
  const { toast } = useToast();
  
  if (!paymentLink) return null;
  
  const handleCopyLink = async () => {
    const success = await copyToClipboard(paymentLink.link);
    if (success) {
      toast({
        title: "Link copied to clipboard",
        duration: 2000
      });
    }
  };
  
  const handleShareLink = async () => {
    const success = await shareContent(
      "Viavo Payment Request",
      `Payment request for ${paymentLink.amount} ${paymentLink.currency}`,
      paymentLink.link
    );
    
    if (!success && navigator.share === undefined) {
      toast({
        title: "Link copied to clipboard",
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
            <h2 className="text-lg font-bold">Payment Link Ready</h2>
            <button 
              className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center"
              onClick={hideModal}
            >
              <Icon name="close" className="text-neutral-600" />
            </button>
          </div>
          
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-neutral-500">Amount</span>
              <span className="font-medium">
                {paymentLink.amount} {paymentLink.currency}
              </span>
            </div>
            {paymentLink.memo && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-neutral-500">Memo</span>
                <span className="font-medium">{paymentLink.memo}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-500">Expires</span>
              <span className="font-medium">
                {getExpirationText(paymentLink.expirationMinutes)}
              </span>
            </div>
          </div>
          
          <div className="bg-neutral-50 border border-dashed border-neutral-300 rounded-lg p-4 mb-5 text-center">
            <div className="mx-auto w-48 h-48 bg-white p-2 rounded-lg shadow-sm mb-3">
              {/* This would be a real QR code in production */}
              <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                <Icon name="qr_code_2" className="text-neutral-400 text-6xl" />
              </div>
            </div>
            
            <p className="text-sm text-neutral-600 mb-3">Your payment link:</p>
            <div className="flex bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="flex-1 p-3 truncate text-sm">
                {paymentLink.link}
              </div>
              <button 
                className="bg-primary-50 text-primary-600 px-3 border-l border-neutral-200 flex items-center justify-center"
                onClick={handleCopyLink}
              >
                <Icon name="content_copy" />
              </button>
            </div>
          </div>
          
          <Button 
            className="w-full py-6 text-base flex items-center justify-center"
            onClick={handleShareLink}
          >
            <Icon name="share" className="mr-2" />
            Share Link
          </Button>
        </div>
      </div>
    </div>
  );
}
