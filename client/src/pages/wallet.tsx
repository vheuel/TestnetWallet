import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { usePrivy } from '@privy-io/react-auth';
import { useWallet } from '@/hooks/useWallet';
import { useNetwork } from '@/hooks/useNetwork';
import { FlaskConical, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NetworkSelector from '@/components/wallet/NetworkSelector';
import WalletOverview from '@/components/wallet/WalletOverview';
import TokenList from '@/components/wallet/TokenList';
import TransactionHistory from '@/components/wallet/TransactionHistory';
import FaucetPanel from '@/components/wallet/FaucetPanel';
import NetworkInfo from '@/components/wallet/NetworkInfo';
import WalletTools from '@/components/wallet/WalletTools';

export default function WalletPage() {
  const [, setLocation] = useLocation();
  const { ready, authenticated, logout } = usePrivy();
  const { user, isCreatingWallet } = useWallet();
  const { selectedNetwork } = useNetwork();

  useEffect(() => {
    if (ready && !authenticated) {
      setLocation('/login');
    }
  }, [ready, authenticated, setLocation]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  if (isCreatingWallet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <FlaskConical className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Creating Your Wallet
            </h2>
            <p className="text-gray-600 text-sm">
              Please wait while we set up your testnet wallet...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TestNet Wallet</h1>
                <p className="text-xs text-accent font-medium">TESTNET ONLY</p>
              </div>
            </div>

            {/* Network Selector and User Profile */}
            <div className="hidden md:flex items-center space-x-4">
              <NetworkSelector />
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.walletAddress?.slice(0, 2).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.walletAddress ? 
                    `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 
                    'Loading...'
                  }
                </span>
                <Button
                  onClick={logout}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Logout
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <NetworkSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedNetwork ? (
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="pt-8 pb-8 text-center">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No Network Selected
              </h2>
              <p className="text-gray-600 text-sm">
                Please select a testnet to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Wallet Overview */}
            <div className="lg:col-span-2 space-y-6">
              <WalletOverview />
              <TokenList />
              <TransactionHistory />
            </div>

            {/* Right Column - Tools and Info */}
            <div className="space-y-6">
              <FaucetPanel />
              <NetworkInfo />
              <WalletTools />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
