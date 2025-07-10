import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@/hooks/useWallet';
import { useNetwork } from '@/hooks/useNetwork';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownLeft, Droplets, ExternalLink, Loader2 } from 'lucide-react';
import type { Transaction } from '@shared/schema';

export default function TransactionHistory() {
  const { user } = useWallet();
  const { selectedNetwork } = useNetwork();

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions', user?.id, selectedNetwork?.chainId],
    enabled: !!user && !!selectedNetwork,
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'receive':
        return <ArrowDownLeft className="w-5 h-5 text-secondary" />;
      case 'faucet':
        return <Droplets className="w-5 h-5 text-accent" />;
      default:
        return <ArrowUpRight className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTransactionType = (tx: Transaction): string => {
    if (tx.from.toLowerCase() === user?.walletAddress.toLowerCase()) {
      return 'send';
    } else if (tx.to.toLowerCase() === user?.walletAddress.toLowerCase()) {
      return 'receive';
    }
    return 'unknown';
  };

  const formatTransactionValue = (tx: Transaction, type: string) => {
    const value = parseFloat(tx.value);
    const symbol = tx.tokenSymbol || selectedNetwork?.symbol || 'ETH';
    const prefix = type === 'send' ? '-' : '+';
    const color = type === 'send' ? 'text-red-500' : 'text-secondary';
    
    return (
      <span className={`font-medium ${color}`}>
        {prefix}{value.toFixed(6)} {symbol}
      </span>
    );
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const txTime = new Date(timestamp);
    const diffMs = now.getTime() - txTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Less than an hour ago';
    }
  };

  const openTransaction = (hash: string) => {
    if (selectedNetwork) {
      window.open(`${selectedNetwork.explorerUrl}/tx/${hash}`, '_blank');
    }
  };

  return (
    <Card className="shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            View All
          </Button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {isLoading ? (
          <div className="p-6 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          </div>
        ) : !transactions || transactions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No transactions found</p>
            <p className="text-sm mt-1">Your transaction history will appear here</p>
          </div>
        ) : (
          transactions.slice(0, 5).map((tx) => {
            const type = getTransactionType(tx);
            const isOutgoing = type === 'send';
            
            return (
              <div 
                key={tx.hash} 
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => openTransaction(tx.hash)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {getTransactionIcon(type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">
                          {isOutgoing ? 'Send' : 'Receive'} {tx.tokenSymbol || selectedNetwork?.symbol}
                        </h4>
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">
                        {isOutgoing ? 'To:' : 'From:'} {(isOutgoing ? tx.to : tx.from).slice(0, 10)}...
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {formatTransactionValue(tx, type)}
                    <p className="text-sm text-gray-500">
                      {formatTimeAgo(tx.timestamp.toString())}
                    </p>
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
