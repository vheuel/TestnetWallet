import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  privyId: text("privy_id").notNull().unique(),
  walletAddress: text("wallet_address").notNull(),
  encryptedPrivateKey: text("encrypted_private_key").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const networks = pgTable("networks", {
  id: serial("id").primaryKey(),
  chainId: text("chain_id").notNull().unique(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  rpcUrl: text("rpc_url").notNull(),
  explorerUrl: text("explorer_url").notNull(),
  isTestnet: boolean("is_testnet").notNull().default(true),
  iconUrl: text("icon_url"),
});

export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  chainId: text("chain_id").notNull(),
  address: text("address").notNull(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  decimals: integer("decimals").notNull(),
  logoUrl: text("logo_url"),
  isNative: boolean("is_native").notNull().default(false),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  chainId: text("chain_id").notNull(),
  hash: text("hash").notNull(),
  from: text("from").notNull(),
  to: text("to").notNull(),
  value: text("value").notNull(),
  tokenAddress: text("token_address"),
  tokenSymbol: text("token_symbol"),
  blockNumber: integer("block_number"),
  status: text("status").notNull().default("pending"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const walletTokens = pgTable("wallet_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  chainId: text("chain_id").notNull(),
  tokenAddress: text("token_address").notNull(),
  balance: text("balance").notNull().default("0"),
  isVisible: boolean("is_visible").notNull().default(true),
});

export const faucets = pgTable("faucets", {
  id: serial("id").primaryKey(),
  chainId: text("chain_id").notNull(),
  tokenAddress: text("token_address").notNull(),
  tokenSymbol: text("token_symbol").notNull(),
  url: text("url").notNull(),
  amount: text("amount").notNull(),
  cooldownHours: integer("cooldown_hours").notNull().default(24),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertNetworkSchema = createInsertSchema(networks).omit({
  id: true,
});

export const insertTokenSchema = createInsertSchema(tokens).omit({
  id: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  timestamp: true,
});

export const insertWalletTokenSchema = createInsertSchema(walletTokens).omit({
  id: true,
});

export const insertFaucetSchema = createInsertSchema(faucets).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Network = typeof networks.$inferSelect;
export type InsertNetwork = z.infer<typeof insertNetworkSchema>;

export type Token = typeof tokens.$inferSelect;
export type InsertToken = z.infer<typeof insertTokenSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type WalletToken = typeof walletTokens.$inferSelect;
export type InsertWalletToken = z.infer<typeof insertWalletTokenSchema>;

export type Faucet = typeof faucets.$inferSelect;
export type InsertFaucet = z.infer<typeof insertFaucetSchema>;
