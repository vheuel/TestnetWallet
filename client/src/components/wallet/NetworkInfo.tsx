import { useEffect, useState } from 'react';
import { useNetwork } from '@/hooks/useNetwork';
import { web3Service } from '@/lib/web3';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';

export default function NetworkInfo() {
  const { selectedNetwork, rpcStatus, checkRpcStatus } = useNetwork();
  const [latestBlock, setLatestBlock] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (selectedNetwork) {
      fetchLatestBlock();
    }
  }, [selectedNetwork]);

  const fetchLatestBlock = async () => {
    if (!selectedNetwork) return;

    setIsRefreshing(true);
    try {
      const blockNumber = await web3Service.getLatestBlockNumber(selectedNetwork);
      setLatestBlock(blockNumber);
    } catch (error) {
      console.error('Error fetching latest block:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([
      checkRpcStatus(),
      fetchLatestBlock(),
    ]);
  };

  const openExplorer = () => {
    if (selectedNetwork) {
      window.open(selectedNetwork.explorerUrl, '_blank');
    }
  };

  if (!selectedNetwork) {
    return (
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Info</h3>
          <p className="text-gray-500 text-sm">No network selected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Network Info</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Network</span>
            <span className="text-sm font-medium text-gray-900">{selectedNetwork.name}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Chain ID</span>
            <span className="text-sm font-medium text-gray-900">{selectedNetwork.chainId}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">RPC Status</span>
            <div className="flex items-center space-x-2">
              {rpcStatus === 'connected' && (
                <>
                  <Wifi className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium text-secondary">Connected</span>
                </>
              )}
              {rpcStatus === 'disconnected' && (
                <>
                  <WifiOff className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-500">Disconnected</span>
                </>
              )}
              {rpcStatus === 'connecting' && (
                <>
                  <div className="w-4 h-4 border border-gray-300 border-t-primary rounded-full animate-spin"></div>
                  <span className="text-sm font-medium text-gray-500">Connecting...</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Block Height</span>
            <span className="text-sm font-medium text-gray-900">
              {latestBlock > 0 ? latestBlock.toLocaleString() : 'Loading...'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Explorer</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={openExplorer}
              className="text-primary hover:text-primary/80 p-0 h-auto"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Testnet Notice</p>
              <p className="text-xs text-amber-700 mt-1">
                This wallet only supports testnet tokens. Do not send mainnet funds.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
