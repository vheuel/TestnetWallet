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
    <div>
      {tokens.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p>No tokens found for this network</p>
        </div>
      ) : (
        tokens.map((token) => {
          const balance = tokenBalances[token.address] || '0';
          const formattedBalance = parseFloat(balance).toFixed(4);
          
          return (
            <div key={token.address} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {token.symbol === 'ETH' ? (
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">ET</span>
                    </div>
                  ) : token.symbol === 'USDC' ? (
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">US</span>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {token.symbol.slice(0, 2)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{token.symbol}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{token.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-white">{formattedBalance}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">$0.00</div>
              </div>
            </div>
          );
        })
      )}
      
      {/* Add Token Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Dialog open={showAddTokenDialog} onOpenChange={setShowAddTokenDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full text-blue-600 hover:text-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Token
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
  );
}
