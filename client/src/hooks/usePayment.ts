import { useState, useCallback } from 'react';
import type { Address } from 'viem';
import { generatePaymentLink, sendPayment } from '@/lib/wallet';
import { useToast } from '@/hooks/use-toast';

export type PaymentParams = {
  amount: number;
  currency: 'ETH' | 'USDC';
  expirationMinutes: number;
  memo?: string;
};

export type PaymentLinkData = PaymentParams & {
  link: string;
};

export type PendingPaymentData = {
  amount: number;
  currency: 'ETH' | 'USDC';
  recipientAddress: Address;
  recipientName?: string;
  memo?: string;
};

export type CompletedPaymentData = PendingPaymentData & {
  transactionId: string;
  timestamp: number;
};

export type Transaction = {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  currency: 'ETH' | 'USDC';
  address: Address;
  timeAgo: string;
  memo?: string;
  transactionId?: string;
};

export function usePayment() {
  const [paymentLink, setPaymentLink] = useState<PaymentLinkData | null>(null);
  const [pendingPayment, setPendingPayment] = useState<PendingPaymentData | null>(null);
  const [completedPayment, setCompletedPayment] = useState<CompletedPaymentData | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();
  
  // Generate a payment link
  const createPaymentLink = useCallback(async (params: PaymentParams) => {
    try {
      setIsProcessing(true);
      
      const link = await generatePaymentLink(
        params.amount,
        params.currency,
        params.expirationMinutes,
        params.memo
      );
      
      setPaymentLink({
        ...params,
        link
      });
      
      return link;
    } catch (error) {
      console.error('Error generating payment link:', error);
      toast({
        title: "Error",
        description: "Failed to generate payment link",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);
  
  // Set up a payment to be confirmed
  const setupPayment = useCallback((paymentData: PendingPaymentData) => {
    setPendingPayment(paymentData);
  }, []);
  
  // Confirm and send a payment
  const confirmPayment = useCallback(async () => {
    if (!pendingPayment) return false;
    
    try {
      setIsProcessing(true);
      
      const txHash = await sendPayment(
        pendingPayment.recipientAddress,
        pendingPayment.amount,
        pendingPayment.memo
      );
      
      if (!txHash) {
        throw new Error('Failed to send payment');
      }
      
      const completedPayment: CompletedPaymentData = {
        ...pendingPayment,
        transactionId: txHash,
        timestamp: Date.now()
      };
      
      setCompletedPayment(completedPayment);
      
      // Add to transactions history
      const newTransaction: Transaction = {
        id: txHash,
        type: 'send',
        amount: pendingPayment.amount,
        currency: pendingPayment.currency,
        address: pendingPayment.recipientAddress,
        timeAgo: 'Just now',
        memo: pendingPayment.memo,
        transactionId: txHash
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      return true;
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast({
        title: "Error",
        description: "Failed to send payment",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [pendingPayment, toast]);
  
  return {
    paymentLink,
    pendingPayment,
    completedPayment,
    isProcessing,
    transactions,
    createPaymentLink,
    setupPayment,
    confirmPayment
  };
}
