import { useState } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { useNetwork } from '@/hooks/useNetwork';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { getTokenIcon } from '@/lib/tokens';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function TokenList() {
  const { tokens, tokenBalances, isLoading, addCustomToken } = useTokens();
  const { selectedNetwork } = useNetwork();
  const { toast } = useToast();
  const [isAddingToken, setIsAddingToken] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');
  const [showAddTokenDialog, setShowAddTokenDialog] = useState(false);

  const handleAddToken = async () => {
    if (!tokenAddress.trim()) return;

    setIsAddingToken(true);
    try {
      await addCustomToken(tokenAddress.trim());
      setTokenAddress('');
      setShowAddTokenDialog(false);
      toast({
        title: "Token Added",
        description: "Custom token has been added to your wallet",
      });
    } catch (error) {
      console.error('Error adding token:', error);
      toast({
        title: "Error",
        description: "Failed to add token. Please check the address.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToken(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Assets</h3>
          <Dialog open={showAddTokenDialog} onOpenChange={setShowAddTokenDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                <Plus className="w-4 h-4 mr-1" />
                Add Token
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Token</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tokenAddress">Token Contract Address</Label>
                  <Input
                    id="tokenAddress"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    placeholder="0x..."
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={handleAddToken} 
                  disabled={!tokenAddress.trim() || isAddingToken}
                  className="w-full"
                >
                  {isAddingToken ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Token'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {tokens.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No tokens found for this network</p>
          </div>
        ) : (
          tokens.map((token) => {
            const balance = tokenBalances[token.address] || '0';
            const formattedBalance = parseFloat(balance).toFixed(token.decimals > 6 ? 6 : token.decimals);
            
            return (
              <div key={token.address} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={getTokenIcon(token.symbol)}
                        alt={token.symbol}
                        className="w-10 h-10 rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {token.symbol.slice(0, 2)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{token.symbol}</h4>
                      <p className="text-sm text-gray-500">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formattedBalance}</p>
                    <p className="text-sm text-gray-500">$0.00</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
