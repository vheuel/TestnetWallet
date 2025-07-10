import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { usePrivy } from '@privy-io/react-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlaskConical, Wallet, Shield, Globe } from 'lucide-react';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login, authenticated, ready } = usePrivy();

  useEffect(() => {
    if (ready && authenticated) {
      setLocation('/');
    }
  }, [ready, authenticated, setLocation]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <FlaskConical className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">TestNet Wallet</h1>
          <p className="text-lg text-accent font-medium mt-2">TESTNET ONLY</p>
          <p className="text-gray-600 mt-2">
            Your secure gateway to blockchain testnets
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0">
          <CardContent className="pt-8 pb-8">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Connect Your Wallet
                </h2>
                <p className="text-gray-600 text-sm">
                  Sign in to access your testnet wallet and start exploring blockchain testnets
                </p>
              </div>

              <Button
                onClick={login}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 h-auto"
                size="lg"
              >
                <Wallet className="w-5 h-5 mr-2" />
                Connect with Privy
              </Button>

              <div className="space-y-4 mt-8">
                <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <Shield className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Testnet Notice</p>
                    <p className="text-xs text-amber-700">
                      This wallet only supports testnet tokens. Never send mainnet funds.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Globe className="w-6 h-6 text-primary mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-900">Multi-Chain</p>
                    <p className="text-xs text-gray-600">Support for multiple testnets</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <FlaskConical className="w-6 h-6 text-secondary mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-900">Free Tokens</p>
                    <p className="text-xs text-gray-600">Get testnet tokens from faucets</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Powered by Privy • Built for developers</p>
        </div>
      </div>
    </div>
  );
}
