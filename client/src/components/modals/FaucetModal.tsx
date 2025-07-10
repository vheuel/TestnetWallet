import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@/hooks/useWallet';
import { useNetwork } from '@/hooks/useNetwork';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Droplets, ExternalLink, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { getTokenIcon } from '@/lib/tokens';
import type { Faucet } from '@shared/schema';

interface FaucetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FaucetModal({ isOpen, onClose }: FaucetModalProps) {
  const { user } = useWallet();
  const { selectedNetwork } = useNetwork();
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState<string | null>(null);

  const { data: faucets, isLoading } = useQuery<Faucet[]>({
    queryKey: ['/api/faucets', selectedNetwork?.chainId],
    enabled: !!selectedNetwork && isOpen,
  });

  const handleFaucetRequest = async (faucet: Faucet) => {
    if (!user || !selectedNetwork) return;

    setIsRequesting(faucet.id.toString());
    try {
      // Open faucet URL in new tab
      window.open(faucet.url, '_blank');
      
      toast({
        title: "Faucet Opened",
        description: `${faucet.tokenSymbol} faucet opened in new tab`,
      });
    } catch (error) {
      console.error('Error opening faucet:', error);
      toast({
        title: "Error",
        description: "Failed to open faucet",
        variant: "destructive",
      });
    } finally {
      setIsRequesting(null);
    }
  };

  if (!user || !selectedNetwork) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Testnet Faucet</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-gray-500">Wallet not connected</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Testnet Faucet</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Droplets className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Get Testnet Tokens
            </h3>
            <p className="text-gray-600 text-sm">
              Request free testnet tokens for development and testing purposes.
            </p>
          </div>

          {/* Network and Wallet Info */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Network:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {selectedNetwork.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-900">{selectedNetwork.name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Your Address:</span>
                  <span className="text-sm text-gray-900 font-mono">
                    {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Faucets */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Available Faucets</h4>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : !faucets || faucets.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center">
                  <Droplets className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No faucets available</p>
                  <p className="text-gray-400 text-xs mt-1">
                    No faucets found for {selectedNetwork.name}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {faucets.map((faucet) => (
                  <Card key={faucet.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
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
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center absolute inset-0">
                              <span className="text-white text-xs font-bold">
                                {faucet.tokenSymbol.slice(0, 2)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {faucet.tokenSymbol}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>{faucet.amount} {faucet.tokenSymbol}</span>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{faucet.cooldownHours}h cooldown</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleFaucetRequest(faucet)}
                          disabled={isRequesting === faucet.id.toString()}
                          className="bg-primary text-white hover:bg-primary/90"
                        >
                          {isRequesting === faucet.id.toString() ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              Get {faucet.tokenSymbol}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Rate Limit Notice */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">Rate Limits</p>
                <p className="text-xs text-blue-700 mt-1">
                  Most faucets have rate limits. If a faucet doesn't work, try again after the cooldown period.
                </p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">Testnet Tokens</p>
                <p className="text-xs text-amber-700 mt-1">
                  These tokens have no real-world value and are only for testing purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
