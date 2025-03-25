import { useState, useEffect } from 'react';
import { Chain } from '@/lib/constants';

export interface Transaction {
  id: string;
  sourceChain: Chain;
  destChain: Chain;
  amount: string;
  sourceHash: string;
  destHash?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'failed';
  timestamp: number;
  error?: string;
}

export function useTransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('brewbridge_transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('brewbridge_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(tx =>
        tx.id === id ? { ...tx, ...updates } : tx
      )
    );
  };

  const getTransaction = (id: string) => {
    return transactions.find(tx => tx.id === id);
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    getTransaction,
  };
}