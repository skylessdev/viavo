import { users, type User, type InsertUser } from "@shared/schema";

// Wallet-related types
interface Wallet {
  address: string;
  smartWalletAddress: string;
  passkeyId: string;
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
