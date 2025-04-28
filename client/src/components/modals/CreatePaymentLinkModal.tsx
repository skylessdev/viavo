import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

export default function CreatePaymentLinkModal() {
  const { hideModal, generatePaymentLink } = useAppContext();
  
  const [amount, setAmount] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [currency, setCurrency] = useState<'ETH' | 'USDC'>('ETH');
  const [expiration, setExpiration] = useState<string>('30');
  
  const handleGenerateLink = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    generatePaymentLink({
      amount: parseFloat(amount),
      currency,
      expirationMinutes: parseInt(expiration),
      memo
    });
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-neutral-900 bg-opacity-50">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-5 max-h-[90vh] overflow-auto">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold">Create Payment Link</h2>
            <button 
              className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center"
              onClick={hideModal}
            >
              <Icon name="close" className="text-neutral-600" />
            </button>
          </div>
          
          {/* Currency toggle */}
          <div className="bg-neutral-100 p-1 rounded-lg flex mb-5" role="radiogroup">
            <button 
              className={`flex-1 py-2 px-4 rounded-md font-medium text-sm ${
                currency === 'ETH' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500'
              }`}
              onClick={() => setCurrency('ETH')}
              aria-checked={currency === 'ETH'}
              role="radio"
            >
              ETH
            </button>
            <button 
              className={`flex-1 py-2 px-4 rounded-md font-medium text-sm ${
                currency === 'USDC' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500'
              }`}
              onClick={() => setCurrency('USDC')}
              aria-checked={currency === 'USDC'}
              role="radio"
            >
              USDC
            </button>
          </div>
          
          {/* Amount input */}
          <div className="mb-5">
            <Label htmlFor="payment-amount" className="block text-sm font-medium text-neutral-700 mb-1">
              Amount
            </Label>
            <div className="relative">
              <Input
                id="payment-amount"
                type="number"
                className="pr-12"
                placeholder="0.00"
                min="0"
                step="0.0001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-neutral-500">{currency}</span>
              </div>
            </div>
          </div>
          
          {/* Memo input */}
          <div className="mb-5">
            <Label htmlFor="payment-memo" className="block text-sm font-medium text-neutral-700 mb-1">
              Memo (optional)
            </Label>
            <Input
              id="payment-memo"
              type="text"
              placeholder="What's this payment for?"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>
          
          {/* Expiration setting */}
          <div className="mb-6">
            <Label htmlFor="expiration-time" className="block text-sm font-medium text-neutral-700 mb-1">
              Expires after
            </Label>
            <Select 
              value={expiration} 
              onValueChange={setExpiration}
            >
              <SelectTrigger id="expiration-time">
                <SelectValue placeholder="Select expiration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="1440">24 hours</SelectItem>
                <SelectItem value="0">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            className="w-full py-6 text-base"
            onClick={handleGenerateLink}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            Generate Link
          </Button>
        </div>
      </div>
    </div>
  );
}
