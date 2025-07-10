import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTransactionSchema, insertWalletTokenSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/users/:privyId", async (req, res) => {
    try {
      const user = await storage.getUserByPrivyId(req.params.privyId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/users/:privyId/wallet", async (req, res) => {
    try {
      const { walletAddress, encryptedPrivateKey } = req.body;
      const user = await storage.updateUserWallet(req.params.privyId, walletAddress, encryptedPrivateKey);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Network routes
  app.get("/api/networks", async (req, res) => {
    try {
      const networks = await storage.getAllNetworks();
      res.json(networks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/networks/:chainId", async (req, res) => {
    try {
      const network = await storage.getNetworkByChainId(req.params.chainId);
      if (!network) {
        return res.status(404).json({ error: "Network not found" });
      }
      res.json(network);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Token routes
  app.get("/api/tokens/:chainId", async (req, res) => {
    try {
      const tokens = await storage.getTokensByChainId(req.params.chainId);
      res.json(tokens);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/tokens/:chainId/:address", async (req, res) => {
    try {
      const token = await storage.getTokenByAddress(req.params.chainId, req.params.address);
      if (!token) {
        return res.status(404).json({ error: "Token not found" });
      }
      res.json(token);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Transaction routes
  app.get("/api/transactions/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const transactions = await storage.getTransactionsByUser(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/transactions/:userId/:chainId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const transactions = await storage.getTransactionsByUserAndChain(userId, req.params.chainId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/transactions/:hash/status", async (req, res) => {
    try {
      const { status, blockNumber } = req.body;
      const transaction = await storage.updateTransactionStatus(req.params.hash, status, blockNumber);
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Wallet token routes
  app.get("/api/wallet-tokens/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const walletTokens = await storage.getWalletTokensByUser(userId);
      res.json(walletTokens);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/wallet-tokens/:userId/:chainId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const walletTokens = await storage.getWalletTokensByUserAndChain(userId, req.params.chainId);
      res.json(walletTokens);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/wallet-tokens/:userId/:chainId/:tokenAddress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { balance } = req.body;
      const walletToken = await storage.updateWalletTokenBalance(
        userId,
        req.params.chainId,
        req.params.tokenAddress,
        balance
      );
      res.json(walletToken);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Faucet routes
  app.get("/api/faucets/:chainId", async (req, res) => {
    try {
      const faucets = await storage.getFaucetsByChainId(req.params.chainId);
      res.json(faucets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
