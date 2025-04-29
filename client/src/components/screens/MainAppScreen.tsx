import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/button';
import { formatAddress, formatCurrency } from '../../lib/utils';

const MainAppScreen: React.FC = () => {
  const { wallet, walletBalance, isWalletLoading, showModal } = useAppContext();
  const [activeTab, setActiveTab] = useState<'wallet' | 'activity'>('wallet');
  
  // Simulated transactions for the UI demo
  const transactions = [
    { 
      id: '1', 
      type: 'receive', 
      amount: 0.05, 
      currency: 'ETH', 
      address: '0x1234567890abcdef1234567890abcdef12345678', 
      timeAgo: '2 hours ago',
      memo: 'For coffee'
    },
    { 
      id: '2', 
      type: 'send', 
      amount: 0.01, 
      currency: 'ETH', 
      address: '0xabcdef1234567890abcdef1234567890abcdef12', 
      timeAgo: '1 day ago' 
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 px-4 py-4 bg-white shadow">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <h1 className="text-xl font-bold text-blue-600">Viavo</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              className="p-2 text-gray-600 rounded-full hover:bg-gray-100"
              onClick={() => {/* Profile settings */}}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Wallet card */}
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-500">Wallet Address</h2>
                <div className="text-xs font-mono text-gray-500">
                  {wallet?.smartWalletAddress ? 
                    formatAddress(wallet.smartWalletAddress) : 
                    'Loading...'}
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500">Balance</h3>
                <p className="text-3xl font-bold">
                  {isWalletLoading ? 
                    'Loading...' : 
                    formatCurrency(parseFloat(walletBalance || '0'), 'ETH')}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  onClick={() => showModal('receivePayment')}
                  className="w-full py-5 font-medium bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="inline-block w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  Receive
                </Button>
                
                <Button
                  onClick={() => showModal('createPaymentLink')}
                  className="w-full py-5 font-medium bg-green-600 hover:bg-green-700"
                >
                  <svg className="inline-block w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                  </svg>
                  Send
                </Button>
              </div>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex mt-6 border-b">
            <button
              onClick={() => setActiveTab('wallet')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'wallet'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Wallet
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'activity'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Activity
            </button>
          </div>

          {/* Tab content */}
          <div className="py-4">
            {activeTab === 'wallet' ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => showModal('createPaymentLink')}
                    className="flex flex-col items-center p-4 space-y-2 bg-white rounded-lg shadow hover:bg-gray-50"
                  >
                    <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 010-5.656l4-4a4 4 0 015.656 5.656l-1.1 1.1" />
                    </svg>
                    <span className="text-sm font-medium text-gray-800">Payment Link</span>
                  </button>
                  
                  <button
                    className="flex flex-col items-center p-4 space-y-2 bg-white rounded-lg shadow hover:bg-gray-50"
                  >
                    <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-800">Scan QR</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                
                <div className="space-y-3">
                  {transactions.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 bg-white rounded-lg shadow">
                      No transactions yet
                    </div>
                  ) : (
                    transactions.map((tx) => (
                      <div 
                        key={tx.id} 
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            tx.type === 'receive' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            {tx.type === 'receive' ? (
                              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                              </svg>
                            )}
                          </div>
                          
                          <div>
                            <div className="font-medium text-gray-900">
                              {tx.type === 'receive' ? 'Received' : 'Sent'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatAddress(tx.address)} · {tx.timeAgo}
                            </div>
                            {tx.memo && (
                              <div className="text-xs text-gray-500">
                                Memo: {tx.memo}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className={`font-medium ${
                          tx.type === 'receive' ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {tx.type === 'receive' ? '+' : '-'} {formatCurrency(tx.amount, tx.currency as 'ETH')}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainAppScreen;