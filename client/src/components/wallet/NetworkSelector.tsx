import { useState } from 'react';
import { useNetwork } from '@/hooks/useNetwork';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Globe, Wifi, WifiOff } from 'lucide-react';
import { getNetworkIcon } from '@/lib/networks';

export default function NetworkSelector() {
  const { networks, selectedNetwork, rpcStatus, switchNetwork } = useNetwork();
  const [isOpen, setIsOpen] = useState(false);

  const handleNetworkSelect = (network: typeof selectedNetwork) => {
    if (network) {
      switchNetwork(network);
      setIsOpen(false);
    }
  };

  if (!selectedNetwork) {
    return (
      <Button variant="outline" disabled>
        <Globe className="w-4 h-4 mr-2" />
        Select Network
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <img
            src={getNetworkIcon(selectedNetwork.chainId)}
            alt={selectedNetwork.name}
            className="w-5 h-5 rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {selectedNetwork.symbol.slice(0, 2)}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            {selectedNetwork.name}
          </span>
          <div className="flex items-center space-x-1">
            {rpcStatus === 'connected' && (
              <Wifi className="w-3 h-3 text-secondary" />
            )}
            {rpcStatus === 'disconnected' && (
              <WifiOff className="w-3 h-3 text-red-500" />
            )}
            {rpcStatus === 'connecting' && (
              <div className="w-3 h-3 border border-gray-300 border-t-primary rounded-full animate-spin"></div>
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-2">
          <div className="text-xs font-medium text-gray-500 mb-2 px-2">
            Available Testnets
          </div>
          {networks.map((network) => (
            <DropdownMenuItem
              key={network.chainId}
              onClick={() => handleNetworkSelect(network)}
              className="flex items-center space-x-3 p-3 cursor-pointer"
            >
              <img
                src={getNetworkIcon(network.chainId)}
                alt={network.name}
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {network.symbol.slice(0, 2)}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{network.name}</p>
                <p className="text-xs text-gray-500">{network.symbol}</p>
              </div>
              {selectedNetwork.chainId === network.chainId && (
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
