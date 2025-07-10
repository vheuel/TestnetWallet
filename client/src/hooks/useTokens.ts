import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { web3Service } from '@/lib/web3';
import { useWallet } from './useWallet';
import { useNetwork } from './useNetwork';
import type { Token, WalletToken } from '@shared/schema';

export function useTokens() {
  const { user } = useWallet();
  const { selectedNetwork } = useNetwork();
  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: tokens, isLoading: tokensLoading } = useQuery<Token[]>({
    queryKey: ['/api/tokens', selectedNetwork?.chainId],
    enabled: !!selectedNetwork,
  });

  const { data: walletTokens, isLoading: walletTokensLoading } = useQuery<WalletToken[]>({
    queryKey: ['/api/wallet-tokens', user?.id, selectedNetwork?.chainId],
    enabled: !!user && !!selectedNetwork,
  });

  useEffect(() => {
    if (user && selectedNetwork && tokens) {
      refreshBalances();
    }
  }, [user, selectedNetwork, tokens]);

  const refreshBalances = async () => {
    if (!user || !selectedNetwork || !tokens) return;

    setIsRefreshing(true);
    const balances: Record<string, string> = {};

    try {
      // Get balances for all tokens
      await Promise.all(
        tokens.map(async (token) => {
          let balance = '0';
          
          if (token.isNative) {
            balance = await web3Service.getBalance(selectedNetwork, user.walletAddress);
          } else {
            balance = await web3Service.getTokenBalance(
              selectedNetwork,
              token.address,
              user.walletAddress,
              token.decimals
            );
          }

          balances[token.address] = balance;

          // Update balance in backend
          await fetch(`/api/wallet-tokens/${user.id}/${selectedNetwork.chainId}/${token.address}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ balance }),
          });
        })
      );

      setTokenBalances(balances);
    } catch (error) {
      console.error('Error refreshing balances:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getTokenBalance = (tokenAddress: string): string => {
    return tokenBalances[tokenAddress] || '0';
  };

  const addCustomToken = async (tokenAddress: string) => {
    if (!selectedNetwork || !user) return;

    try {
      // Get token info from blockchain
      const provider = web3Service.getProvider(selectedNetwork);
      const contract = new (await import('ethers')).ethers.Contract(
        tokenAddress,
        [
          'function name() view returns (string)',
          'function symbol() view returns (string)',
          'function decimals() view returns (uint8)',
        ],
        provider
      );

      const [name, symbol, decimals] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
      ]);

      const token = {
        chainId: selectedNetwork.chainId,
        address: tokenAddress,
        symbol,
        name,
        decimals,
        logoUrl: null,
        isNative: false,
      };

      // Add token to backend
      await fetch('/api/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(token),
      });

      // Add to user's wallet
      await fetch('/api/wallet-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          chainId: selectedNetwork.chainId,
          tokenAddress,
          balance: '0',
          isVisible: true,
        }),
      });

      // Refresh balances
      await refreshBalances();
    } catch (error) {
      console.error('Error adding custom token:', error);
      throw error;
    }
  };

  return {
    tokens: tokens || [],
    walletTokens: walletTokens || [],
    tokenBalances,
    isLoading: tokensLoading || walletTokensLoading,
    isRefreshing,
    getTokenBalance,
    refreshBalances,
    addCustomToken,
  };
}
