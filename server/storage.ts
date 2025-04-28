// Define user types as needed
export interface User {
  id: number;
  username: string;
  [key: string]: any;
}

export interface InsertUser {
  username: string;
  [key: string]: any;
}

// Wallet-related types
interface Wallet {
  address: string;
  smartWalletAddress: string;
  passkeyId: string;
}

// Payment-related types
interface PaymentLink {
  linkId: string;
  amount: string;
  currency: 'ETH' | 'USDC';
  recipientAddress: string;
  memo?: string;
  expiresAt: Date | null;
  claimed?: boolean;
  claimedAt?: Date;
  claimedBy?: string;
}

// Transaction-related types
interface Transaction {
  transactionId: string;
  type: 'send' | 'receive';
  fromAddress: string;
  toAddress: string;
  amount: string;
  currency: 'ETH' | 'USDC';
  memo?: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Wallet methods
  createWallet(wallet: Wallet): Promise<Wallet>;
  getWalletBySmartAddress(smartWalletAddress: string): Promise<Wallet | null>;
  getWalletByPasskeyId(passkeyId: string): Promise<Wallet | null>;
  
  // Payment link methods
  createPaymentLink(paymentLink: PaymentLink): Promise<PaymentLink>;
  getPaymentLinkById(linkId: string): Promise<PaymentLink | null>;
  updatePaymentLink(linkId: string, update: Partial<PaymentLink>): Promise<PaymentLink | null>;
  
  // Transaction methods
  createTransaction(transaction: Omit<Transaction, 'createdAt' | 'updatedAt'>): Promise<Transaction>;
  getTransactionById(transactionId: string): Promise<Transaction | null>;
  updateTransaction(transactionId: string, update: Partial<Transaction>): Promise<Transaction | null>;
  getTransactionsByAddress(address: string): Promise<Transaction[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private wallets: Map<string, Wallet>; // Key is smartWalletAddress
  private passkeyToWallet: Map<string, string>; // Maps passkeyId to smartWalletAddress
  
  currentId: number;

  constructor() {
    this.users = new Map();
    this.wallets = new Map();
    this.passkeyToWallet = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Wallet methods
  async createWallet(wallet: Wallet): Promise<Wallet> {
    this.wallets.set(wallet.smartWalletAddress, wallet);
    this.passkeyToWallet.set(wallet.passkeyId, wallet.smartWalletAddress);
    return wallet;
  }
  
  async getWalletBySmartAddress(smartWalletAddress: string): Promise<Wallet | null> {
    return this.wallets.get(smartWalletAddress) || null;
  }
  
  async getWalletByPasskeyId(passkeyId: string): Promise<Wallet | null> {
    const smartWalletAddress = this.passkeyToWallet.get(passkeyId);
    if (!smartWalletAddress) return null;
    return this.wallets.get(smartWalletAddress) || null;
  }
}

export const storage = new MemStorage();
