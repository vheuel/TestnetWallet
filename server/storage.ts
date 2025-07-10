import { users, networks, tokens, transactions, walletTokens, faucets, type User, type InsertUser, type Network, type InsertNetwork, type Token, type InsertToken, type Transaction, type InsertTransaction, type WalletToken, type InsertWalletToken, type Faucet, type InsertFaucet } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByPrivyId(privyId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserWallet(privyId: string, walletAddress: string, encryptedPrivateKey: string): Promise<User>;

  // Network methods
  getAllNetworks(): Promise<Network[]>;
  getNetworkByChainId(chainId: string): Promise<Network | undefined>;
  createNetwork(network: InsertNetwork): Promise<Network>;

  // Token methods
  getTokensByChainId(chainId: string): Promise<Token[]>;
  getTokenByAddress(chainId: string, address: string): Promise<Token | undefined>;
  createToken(token: InsertToken): Promise<Token>;

  // Transaction methods
  getTransactionsByUser(userId: number): Promise<Transaction[]>;
  getTransactionsByUserAndChain(userId: number, chainId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStatus(hash: string, status: string, blockNumber?: number): Promise<Transaction>;

  // Wallet token methods
  getWalletTokensByUser(userId: number): Promise<WalletToken[]>;
  getWalletTokensByUserAndChain(userId: number, chainId: string): Promise<WalletToken[]>;
  updateWalletTokenBalance(userId: number, chainId: string, tokenAddress: string, balance: string): Promise<WalletToken>;
  addWalletToken(walletToken: InsertWalletToken): Promise<WalletToken>;

  // Faucet methods
  getFaucetsByChainId(chainId: string): Promise<Faucet[]>;
  createFaucet(faucet: InsertFaucet): Promise<Faucet>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private networks: Map<string, Network> = new Map();
  private tokens: Map<string, Token> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private walletTokens: Map<string, WalletToken> = new Map();
  private faucets: Map<string, Faucet> = new Map();
  private currentUserId = 1;
  private currentNetworkId = 1;
  private currentTokenId = 1;
  private currentTransactionId = 1;
  private currentWalletTokenId = 1;
  private currentFaucetId = 1;

  constructor() {
    this.initializeTestnetData();
  }

  private initializeTestnetData() {
    // Initialize testnet networks
    const testnetNetworks: InsertNetwork[] = [
      {
        chainId: "11155111",
        name: "Sepolia Testnet",
        symbol: "ETH",
        rpcUrl: "https://sepolia.infura.io/v3/",
        explorerUrl: "https://sepolia.etherscan.io",
        isTestnet: true,
        iconUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png"
      },
      {
        chainId: "80001",
        name: "Polygon Mumbai",
        symbol: "MATIC",
        rpcUrl: "https://rpc-mumbai.maticvigil.com",
        explorerUrl: "https://mumbai.polygonscan.com",
        isTestnet: true,
        iconUrl: "https://cryptologos.cc/logos/polygon-matic-logo.png"
      },
      {
        chainId: "97",
        name: "BSC Testnet",
        symbol: "BNB",
        rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
        explorerUrl: "https://testnet.bscscan.com",
        isTestnet: true,
        iconUrl: "https://cryptologos.cc/logos/bnb-bnb-logo.png"
      },
      {
        chainId: "43113",
        name: "Avalanche Fuji",
        symbol: "AVAX",
        rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
        explorerUrl: "https://testnet.snowtrace.io",
        isTestnet: true,
        iconUrl: "https://cryptologos.cc/logos/avalanche-avax-logo.png"
      }
    ];

    testnetNetworks.forEach(network => {
      const networkWithId = { ...network, id: this.currentNetworkId++ };
      this.networks.set(network.chainId, networkWithId);
    });

    // Initialize testnet tokens
    const testnetTokens: InsertToken[] = [
      // Sepolia tokens
      {
        chainId: "11155111",
        address: "0x0000000000000000000000000000000000000000",
        symbol: "ETH",
        name: "Ethereum",
        decimals: 18,
        logoUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
        isNative: true
      },
      {
        chainId: "11155111",
        address: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        logoUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
        isNative: false
      },
      // Mumbai tokens
      {
        chainId: "80001",
        address: "0x0000000000000000000000000000000000000000",
        symbol: "MATIC",
        name: "Polygon",
        decimals: 18,
        logoUrl: "https://cryptologos.cc/logos/polygon-matic-logo.png",
        isNative: true
      },
      // BSC Testnet tokens
      {
        chainId: "97",
        address: "0x0000000000000000000000000000000000000000",
        symbol: "BNB",
        name: "Binance Coin",
        decimals: 18,
        logoUrl: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
        isNative: true
      },
      // Avalanche Fuji tokens
      {
        chainId: "43113",
        address: "0x0000000000000000000000000000000000000000",
        symbol: "AVAX",
        name: "Avalanche",
        decimals: 18,
        logoUrl: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
        isNative: true
      }
    ];

    testnetTokens.forEach(token => {
      const tokenWithId = { ...token, id: this.currentTokenId++ };
      this.tokens.set(`${token.chainId}-${token.address}`, tokenWithId);
    });

    // Initialize faucets
    const testnetFaucets: InsertFaucet[] = [
      {
        chainId: "11155111",
        tokenAddress: "0x0000000000000000000000000000000000000000",
        tokenSymbol: "ETH",
        url: "https://sepoliafaucet.com",
        amount: "0.5",
        cooldownHours: 24
      },
      {
        chainId: "80001",
        tokenAddress: "0x0000000000000000000000000000000000000000",
        tokenSymbol: "MATIC",
        url: "https://faucet.polygon.technology",
        amount: "0.1",
        cooldownHours: 24
      },
      {
        chainId: "97",
        tokenAddress: "0x0000000000000000000000000000000000000000",
        tokenSymbol: "BNB",
        url: "https://testnet.binance.org/faucet-smart",
        amount: "0.1",
        cooldownHours: 24
      },
      {
        chainId: "43113",
        tokenAddress: "0x0000000000000000000000000000000000000000",
        tokenSymbol: "AVAX",
        url: "https://faucet.avax-test.network",
        amount: "2.0",
        cooldownHours: 24
      }
    ];

    testnetFaucets.forEach(faucet => {
      const faucetWithId = { ...faucet, id: this.currentFaucetId++ };
      this.faucets.set(`${faucet.chainId}-${faucet.tokenAddress}`, faucetWithId);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByPrivyId(privyId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.privyId === privyId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      createdAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUserWallet(privyId: string, walletAddress: string, encryptedPrivateKey: string): Promise<User> {
    const user = await this.getUserByPrivyId(privyId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, walletAddress, encryptedPrivateKey };
    this.users.set(user.id, updatedUser);
    return updatedUser;
  }

  async getAllNetworks(): Promise<Network[]> {
    return Array.from(this.networks.values());
  }

  async getNetworkByChainId(chainId: string): Promise<Network | undefined> {
    return this.networks.get(chainId);
  }

  async createNetwork(network: InsertNetwork): Promise<Network> {
    const networkWithId = { ...network, id: this.currentNetworkId++ };
    this.networks.set(network.chainId, networkWithId);
    return networkWithId;
  }

  async getTokensByChainId(chainId: string): Promise<Token[]> {
    return Array.from(this.tokens.values()).filter(token => token.chainId === chainId);
  }

  async getTokenByAddress(chainId: string, address: string): Promise<Token | undefined> {
    return this.tokens.get(`${chainId}-${address}`);
  }

  async createToken(token: InsertToken): Promise<Token> {
    const tokenWithId = { ...token, id: this.currentTokenId++ };
    this.tokens.set(`${token.chainId}-${token.address}`, tokenWithId);
    return tokenWithId;
  }

  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(tx => tx.userId === userId);
  }

  async getTransactionsByUserAndChain(userId: number, chainId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(tx => 
      tx.userId === userId && tx.chainId === chainId
    );
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const transactionWithId = { 
      ...transaction, 
      id: this.currentTransactionId++, 
      timestamp: new Date() 
    };
    this.transactions.set(transaction.hash, transactionWithId);
    return transactionWithId;
  }

  async updateTransactionStatus(hash: string, status: string, blockNumber?: number): Promise<Transaction> {
    const transaction = this.transactions.get(hash);
    if (!transaction) throw new Error("Transaction not found");
    
    const updatedTransaction = { ...transaction, status, blockNumber };
    this.transactions.set(hash, updatedTransaction);
    return updatedTransaction;
  }

  async getWalletTokensByUser(userId: number): Promise<WalletToken[]> {
    return Array.from(this.walletTokens.values()).filter(wt => wt.userId === userId);
  }

  async getWalletTokensByUserAndChain(userId: number, chainId: string): Promise<WalletToken[]> {
    return Array.from(this.walletTokens.values()).filter(wt => 
      wt.userId === userId && wt.chainId === chainId
    );
  }

  async updateWalletTokenBalance(userId: number, chainId: string, tokenAddress: string, balance: string): Promise<WalletToken> {
    const key = `${userId}-${chainId}-${tokenAddress}`;
    const existing = this.walletTokens.get(key);
    
    if (existing) {
      const updated = { ...existing, balance };
      this.walletTokens.set(key, updated);
      return updated;
    } else {
      const newWalletToken = {
        id: this.currentWalletTokenId++,
        userId,
        chainId,
        tokenAddress,
        balance,
        isVisible: true
      };
      this.walletTokens.set(key, newWalletToken);
      return newWalletToken;
    }
  }

  async addWalletToken(walletToken: InsertWalletToken): Promise<WalletToken> {
    const walletTokenWithId = { ...walletToken, id: this.currentWalletTokenId++ };
    const key = `${walletToken.userId}-${walletToken.chainId}-${walletToken.tokenAddress}`;
    this.walletTokens.set(key, walletTokenWithId);
    return walletTokenWithId;
  }

  async getFaucetsByChainId(chainId: string): Promise<Faucet[]> {
    return Array.from(this.faucets.values()).filter(faucet => faucet.chainId === chainId);
  }

  async createFaucet(faucet: InsertFaucet): Promise<Faucet> {
    const faucetWithId = { ...faucet, id: this.currentFaucetId++ };
    this.faucets.set(`${faucet.chainId}-${faucet.tokenAddress}`, faucetWithId);
    return faucetWithId;
  }
}

export const storage = new MemStorage();
