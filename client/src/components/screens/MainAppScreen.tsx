import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { formatAddress, formatCurrency } from '@/lib/utils';

export default function MainAppScreen() {
  const { 
    showModal, 
    wallet, 
    walletBalance, 
    refreshWalletBalance,
    transactions
  } = useAppContext();
  
  useEffect(() => {
    refreshWalletBalance();
  }, [refreshWalletBalance]);
  
  const handleCreatePaymentLink = () => {
    showModal('createPaymentLink');
  };
  
  const handleReceivePayment = () => {
    showModal('receivePayment');
  };
  
  return (
    <div className="min-h-screen flex-1 flex flex-col bg-neutral-50">
      {/* App Header */}
      <header className="bg-white shadow-sm px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-primary-600">Viavo</span>
            <span className="ml-2 px-2 py-0.5 text-xs bg-primary-100 text-primary-800 rounded-full">Beta</span>
          </div>
          <button className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
            <Icon name="settings" className="text-neutral-600" />
          </button>
        </div>
      </header>
      
      {/* Wallet Overview */}
      <section className="bg-primary-600 text-white px-4 py-6">
        <div className="max-w-lg mx-auto">
          <p className="text-primary-100 text-sm font-medium mb-1">Wallet Balance</p>
          <div className="flex items-end mb-4">
            <h2 className="text-3xl font-bold">{walletBalance}</h2>
            <span className="ml-2 font-medium">ETH</span>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="secondary"
              className="flex-1 py-2.5 bg-white text-primary-600 hover:bg-neutral-100"
            >
              <Icon name="add" className="mr-1 text-sm" />
              Add Funds
            </Button>
            <Button
              variant="outline" 
              className="w-12 h-10 bg-primary-500 text-white p-0"
            >
              <Icon name="qr_code_scanner" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Main Action Buttons */}
      <section className="px-4 -mt-5">
        <div className="max-w-lg mx-auto flex space-x-3">
          <Button 
            variant="outline"
            className="flex-1 py-3 bg-primary-50 border border-primary-100 text-primary-700 rounded-xl font-medium flex flex-col items-center shadow-sm"
            onClick={handleCreatePaymentLink}
          >
            <Icon name="send" className="mb-1" />
            Send
          </Button>
          <Button 
            variant="outline"
            className="flex-1 py-3 bg-primary-50 border border-primary-100 text-primary-700 rounded-xl font-medium flex flex-col items-center shadow-sm"
            onClick={handleReceivePayment}
          >
            <Icon name="call_received" className="mb-1" />
            Receive
          </Button>
        </div>
      </section>
      
      {/* Transaction History */}
      <section className="flex-1 px-4 py-5">
        <div className="max-w-lg mx-auto">
          <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
          
          {transactions.length === 0 ? (
            // Empty state
            <div className="bg-white rounded-xl p-6 border border-neutral-200 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 mb-3 bg-neutral-100 rounded-full flex items-center justify-center">
                <Icon name="receipt_long" className="text-neutral-400 text-2xl" />
              </div>
              <h4 className="font-medium text-neutral-800 mb-1">No transactions yet</h4>
              <p className="text-sm text-neutral-500">Your transaction history will appear here.</p>
            </div>
          ) : (
            // Transaction list
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-white p-4 rounded-xl border border-neutral-200 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                    <Icon name={tx.type === 'send' ? 'arrow_upward' : 'arrow_downward'} className="text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{tx.type === 'send' ? 'Sent payment' : 'Received payment'}</p>
                      <p className="font-medium">{formatCurrency(tx.amount, tx.currency)}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p className="text-neutral-500">
                        {tx.type === 'send' ? 'To: ' : 'From: '}{formatAddress(tx.address)}
                      </p>
                      <p className="text-neutral-500">{tx.timeAgo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
