import { ethers } from 'ethers';
import type { Network } from '@shared/schema';

export class Web3Service {
  private providers: Map<string, ethers.JsonRpcProvider> = new Map();

  getProvider(network: Network): ethers.JsonRpcProvider {
    if (!this.providers.has(network.chainId)) {
      const provider = new ethers.JsonRpcProvider(network.rpcUrl);
      this.providers.set(network.chainId, provider);
    }
    return this.providers.get(network.chainId)!;
  }

  async getBalance(network: Network, address: string): Promise<string> {
    try {
      const provider = this.getProvider(network);
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }

  async getTokenBalance(network: Network, tokenAddress: string, walletAddress: string, decimals: number): Promise<string> {
    try {
      const provider = this.getProvider(network);
      const contract = new ethers.Contract(
        tokenAddress,
        [
          'function balanceOf(address owner) view returns (uint256)',
          'function decimals() view returns (uint8)',
          'function symbol() view returns (string)',
        ],
        provider
      );
      
      const balance = await contract.balanceOf(walletAddress);
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error('Error getting token balance:', error);
      return '0';
    }
  }

  async sendTransaction(network: Network, privateKey: string, to: string, amount: string): Promise<string> {
    try {
      const provider = this.getProvider(network);
      const wallet = new ethers.Wallet(privateKey, provider);
      
      const transaction = {
        to,
        value: ethers.parseEther(amount),
        gasLimit: 21000,
      };

      const tx = await wallet.sendTransaction(transaction);
      return tx.hash;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  async sendTokenTransaction(
    network: Network,
    privateKey: string,
    tokenAddress: string,
    to: string,
    amount: string,
    decimals: number
  ): Promise<string> {
    try {
      const provider = this.getProvider(network);
      const wallet = new ethers.Wallet(privateKey, provider);
      
      const contract = new ethers.Contract(
        tokenAddress,
        [
          'function transfer(address to, uint256 amount) returns (bool)',
        ],
        wallet
      );

      const tx = await contract.transfer(to, ethers.parseUnits(amount, decimals));
      return tx.hash;
    } catch (error) {
      console.error('Error sending token transaction:', error);
      throw error;
    }
  }

  async getTransactionReceipt(network: Network, hash: string) {
    try {
      const provider = this.getProvider(network);
      return await provider.getTransactionReceipt(hash);
    } catch (error) {
      console.error('Error getting transaction receipt:', error);
      return null;
    }
  }

  async getLatestBlockNumber(network: Network): Promise<number> {
    try {
      const provider = this.getProvider(network);
      return await provider.getBlockNumber();
    } catch (error) {
      console.error('Error getting latest block:', error);
      return 0;
    }
  }

  createWallet(): { address: string; privateKey: string; mnemonic: string } {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase || '',
    };
  }

  importWallet(privateKey: string): { address: string; privateKey: string } {
    const wallet = new ethers.Wallet(privateKey);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
    };
  }

  importWalletFromMnemonic(mnemonic: string): { address: string; privateKey: string; mnemonic: string } {
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: mnemonic,
    };
  }
}

export const web3Service = new Web3Service();
