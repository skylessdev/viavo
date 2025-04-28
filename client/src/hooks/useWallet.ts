import { useState, useCallback, useEffect } from 'react';
import type { Address } from 'viem';
import {
  createWallet,
  getSavedWallet,
  getWalletBalance,
  type WalletData
} from '@/lib/wallet';
import { authenticateWithPasskey } from '@/lib/web-authn';

export function useWallet() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [walletBalance, setWalletBalance] = useState<string>('0.00');
  const [isCreatingWallet, setIsCreatingWallet] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if wallet exists in localStorage
  const checkWalletExists = useCallback(async () => {
    try {
      const savedWallet = getSavedWallet();
      if (savedWallet) {
        setWallet(savedWallet);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error checking wallet:', err);
      setError('Failed to check for existing wallet');
      return false;
    }
  }, []);
  
  // Create a new wallet
  const createUserWallet = useCallback(async () => {
    try {
      setIsCreatingWallet(true);
      setError(null);
      
      const newWallet = await createWallet();
      if (newWallet) {
        setWallet(newWallet);
        return true;
      } else {
        setError('Failed to create wallet');
        return false;
      }
    } catch (err) {
      console.error('Error creating wallet:', err);
      setError('Failed to create wallet');
      return false;
    } finally {
      setIsCreatingWallet(false);
    }
  }, []);
  
  // Refresh wallet balance
  const refreshWalletBalance = useCallback(async () => {
    if (!wallet) return;
    
    try {
      const balance = await getWalletBalance(wallet.smartWalletAddress);
      setWalletBalance(balance.toFixed(5));
    } catch (err) {
      console.error('Error refreshing balance:', err);
      setError('Failed to refresh wallet balance');
    }
  }, [wallet]);
  
  // Authenticate with passkey
  const authenticate = useCallback(async () => {
    if (!wallet) return null;
    
    try {
      return await authenticateWithPasskey(wallet.passkeyId);
    } catch (err) {
      console.error('Error authenticating:', err);
      setError('Failed to authenticate with biometrics');
      return null;
    }
  }, [wallet]);
  
  return {
    wallet,
    walletBalance,
    isCreatingWallet,
    error,
    checkWalletExists,
    createUserWallet,
    refreshWalletBalance,
    authenticate,
  };
}
