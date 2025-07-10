import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useNetwork } from '@/hooks/useNetwork';
import { useTokens } from '@/hooks/useTokens';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Download, Droplets, AlertTriangle, RefreshCw } from 'lucide-react';
import SendModal from '@/components/modals/SendModal';
import ReceiveModal from '@/components/modals/ReceiveModal';
import FaucetModal from '@/components/modals/FaucetModal';

export default function WalletOverview() {
  const { user } = useWallet();
  const { selectedNetwork } = useNetwork();
  const { tokenBalances, isRefreshing, refreshBalances } = useTokens();
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showFaucetModal, setShowFaucetModal] = useState(false);

  // Calculate total balance in USD (would need price data in real app)
  const totalBalance = '0.00';
  const change24h = '+$0.00 (0%)';

  // Get native token balance
  const nativeBalance = selectedNetwork ? 
    tokenBalances['0x0000000000000000000000000000000000000000'] || '0' : 
    '0';

  return (
    <>
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Portfolio</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-accent font-medium">
                <AlertTriangle className="w-4 h-4" />
                <span>Testnet Funds Only</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshBalances}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {selectedNetwork ? `${parseFloat(nativeBalance).toFixed(4)} ${selectedNetwork.symbol}` : '$0.00'}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">24h change:</span>
              <span className="text-sm font-medium text-secondary">{change24h}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => setShowSendModal(true)}
              className="flex flex-col items-center p-4 bg-primary text-white hover:bg-primary/90 h-auto"
            >
              <Send className="w-5 h-5 mb-2" />
              <span className="text-sm font-medium">Send</span>
            </Button>
            <Button
              onClick={() => setShowReceiveModal(true)}
              className="flex flex-col items-center p-4 bg-secondary text-white hover:bg-secondary/90 h-auto"
            >
              <Download className="w-5 h-5 mb-2" />
              <span className="text-sm font-medium">Receive</span>
            </Button>
            <Button
              onClick={() => setShowFaucetModal(true)}
              className="flex flex-col items-center p-4 bg-accent text-white hover:bg-accent/90 h-auto"
            >
              <Droplets className="w-5 h-5 mb-2" />
              <span className="text-sm font-medium">Faucet</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <SendModal 
        isOpen={showSendModal} 
        onClose={() => setShowSendModal(false)} 
      />
      <ReceiveModal 
        isOpen={showReceiveModal} 
        onClose={() => setShowReceiveModal(false)} 
      />
      <FaucetModal 
        isOpen={showFaucetModal} 
        onClose={() => setShowFaucetModal(false)} 
      />
    </>
  );
}
