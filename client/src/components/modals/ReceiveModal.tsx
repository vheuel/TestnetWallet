import { useState } from 'react';
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
import { Copy, QrCode, AlertTriangle, Check } from 'lucide-react';

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReceiveModal({ isOpen, onClose }: ReceiveModalProps) {
  const { user } = useWallet();
  const { selectedNetwork } = useNetwork();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    if (!user?.walletAddress) return;

    try {
      await navigator.clipboard.writeText(user.walletAddress);
      setCopied(true);
      toast({
        title: "Address Copied",
        description: "Wallet address has been copied to clipboard",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
      toast({
        title: "Error",
        description: "Failed to copy address to clipboard",
        variant: "destructive",
      });
    }
  };

  if (!user || !selectedNetwork) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Receive Tokens</DialogTitle>
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Receive Tokens</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* QR Code Section */}
          <div className="text-center">
            <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">QR Code</p>
                <p className="text-xs text-gray-400 mt-1">
                  Scan to get address
                </p>
              </div>
            </div>
          </div>

          {/* Network Info */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {selectedNetwork.symbol.slice(0, 2)}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {selectedNetwork.name}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Only send {selectedNetwork.symbol} and tokens on {selectedNetwork.name}
            </p>
          </div>

          {/* Wallet Address */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2 text-center">
              Your wallet address:
            </p>
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between space-x-2">
                  <p className="text-sm font-mono text-gray-900 break-all flex-1">
                    {user.walletAddress}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyAddress}
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-secondary" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Copy Button */}
          <Button
            onClick={handleCopyAddress}
            className="w-full"
            variant="outline"
          >
            <Copy className="w-4 h-4 mr-2" />
            {copied ? 'Copied!' : 'Copy Address'}
          </Button>

          {/* Warning */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">Testnet Only</p>
                <p className="text-xs text-amber-700 mt-1">
                  Only send testnet tokens to this address. Mainnet tokens will be lost forever.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
