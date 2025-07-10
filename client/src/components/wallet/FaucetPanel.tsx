import { useQuery } from '@tanstack/react-query';
import { useNetwork } from '@/hooks/useNetwork';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets, ExternalLink, Loader2 } from 'lucide-react';
import { getTokenIcon } from '@/lib/tokens';
import type { Faucet } from '@shared/schema';

export default function FaucetPanel() {
  const { selectedNetwork } = useNetwork();

  const { data: faucets, isLoading } = useQuery<Faucet[]>({
    queryKey: ['/api/faucets', selectedNetwork?.chainId],
    enabled: !!selectedNetwork,
  });

  const openFaucet = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Testnet Faucets</h3>
        <p className="text-sm text-gray-600 mb-4">
          Get free testnet tokens for development and testing
        </p>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : !faucets || faucets.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <p>No faucets available for this network</p>
          </div>
        ) : (
          <div className="space-y-3">
            {faucets.map((faucet) => (
              <div 
                key={`${faucet.chainId}-${faucet.tokenAddress}`}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={getTokenIcon(faucet.tokenSymbol)}
                      alt={faucet.tokenSymbol}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {faucet.tokenSymbol.slice(0, 2)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedNetwork?.name} {faucet.tokenSymbol}
                    </p>
                    <p className="text-xs text-gray-500">
                      {faucet.amount} {faucet.tokenSymbol} per {faucet.cooldownHours}h
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => openFaucet(faucet.url)}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  Get {faucet.tokenSymbol}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Droplets className="w-4 h-4 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Faucet Tips</p>
              <p className="text-xs text-amber-700 mt-1">
                Most faucets have rate limits. If one doesn't work, try another or wait a few hours.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
