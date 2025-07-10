import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { web3Service } from '@/lib/web3';
import type { Network } from '@shared/schema';

export function useNetwork() {
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [rpcStatus, setRpcStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  const { data: networks, isLoading } = useQuery<Network[]>({
    queryKey: ['/api/networks'],
  });

  useEffect(() => {
    if (networks && networks.length > 0 && !selectedNetwork) {
      // Default to first network (Sepolia)
      setSelectedNetwork(networks[0]);
    }
  }, [networks, selectedNetwork]);

  useEffect(() => {
    if (selectedNetwork) {
      checkRpcStatus();
    }
  }, [selectedNetwork]);

  const checkRpcStatus = async () => {
    if (!selectedNetwork) return;

    setRpcStatus('connecting');
    try {
      const blockNumber = await web3Service.getLatestBlockNumber(selectedNetwork);
      setRpcStatus(blockNumber > 0 ? 'connected' : 'disconnected');
    } catch (error) {
      console.error('RPC check failed:', error);
      setRpcStatus('disconnected');
    }
  };

  const switchNetwork = (network: Network) => {
    setSelectedNetwork(network);
    localStorage.setItem('selectedNetwork', JSON.stringify(network));
  };

  // Load saved network from localStorage
  useEffect(() => {
    const savedNetwork = localStorage.getItem('selectedNetwork');
    if (savedNetwork) {
      try {
        const network = JSON.parse(savedNetwork);
        setSelectedNetwork(network);
      } catch (error) {
        console.error('Error parsing saved network:', error);
      }
    }
  }, []);

  return {
    networks: networks || [],
    selectedNetwork,
    rpcStatus,
    isLoading,
    switchNetwork,
    checkRpcStatus,
  };
}
