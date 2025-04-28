import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Wallet table for storing user wallet information
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  smartWalletAddress: text("smart_wallet_address").notNull().unique(),
  passkeyId: text("passkey_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Payment links table
export const paymentLinks = pgTable("payment_links", {
  id: serial("id").primaryKey(),
  linkId: text("link_id").notNull().unique(),
  amount: text("amount").notNull(),
  currency: text("currency").notNull(),
  recipientAddress: text("recipient_address").notNull(),
  memo: text("memo"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  claimed: boolean("claimed").default(false),
  claimedAt: timestamp("claimed_at"),
  claimedBy: text("claimed_by"),
  transactionId: text("transaction_id"),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  transactionId: text("transaction_id").notNull().unique(),
  type: text("type").notNull(), // send or receive
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  amount: text("amount").notNull(),
  currency: text("currency").notNull(),
  memo: text("memo"),
  status: text("status").notNull(), // pending, confirmed, failed
  blockNumber: integer("block_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertWalletSchema = createInsertSchema(wallets).pick({
  address: true,
  smartWalletAddress: true,
  passkeyId: true,
});

export const insertPaymentLinkSchema = createInsertSchema(paymentLinks).pick({
  linkId: true,
  amount: true,
  currency: true,
  recipientAddress: true,
  memo: true,
  expiresAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  transactionId: true,
  type: true,
  fromAddress: true,
  toAddress: true,
  amount: true,
  currency: true,
  memo: true,
  status: true,
});

// Types
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Wallet = typeof wallets.$inferSelect;

export type InsertPaymentLink = z.infer<typeof insertPaymentLinkSchema>;
export type PaymentLink = typeof paymentLinks.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
