import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useNetwork } from '@/hooks/useNetwork';
import { useTokens } from '@/hooks/useTokens';
import { web3Service } from '@/lib/web3';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2 } from 'lucide-react';

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SendModal({ isOpen, onClose }: SendModalProps) {
  const { user } = useWallet();
  const { selectedNetwork } = useNetwork();
  const { tokens, getTokenBalance } = useTokens();
  const { toast } = useToast();
  
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!user || !selectedNetwork || !selectedToken || !recipientAddress || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const token = tokens.find(t => t.address === selectedToken);
    if (!token) {
      toast({
        title: "Error",
        description: "Token not found",
        variant: "destructive",
      });
      return;
    }

    const balance = parseFloat(getTokenBalance(token.address));
    const sendAmount = parseFloat(amount);

    if (sendAmount > balance) {
      toast({
        title: "Error",
        description: "Insufficient balance",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      let txHash: string;
      
      if (token.isNative) {
        txHash = await web3Service.sendTransaction(
          selectedNetwork,
          user.encryptedPrivateKey, // Should be decrypted in real app
          recipientAddress,
          amount
        );
      } else {
        txHash = await web3Service.sendTokenTransaction(
          selectedNetwork,
          user.encryptedPrivateKey, // Should be decrypted in real app
          token.address,
          recipientAddress,
          amount,
          token.decimals
        );
      }

      // Save transaction to backend
      await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          chainId: selectedNetwork.chainId,
          hash: txHash,
          from: user.walletAddress,
          to: recipientAddress,
          value: amount,
          tokenAddress: token.isNative ? null : token.address,
          tokenSymbol: token.symbol,
          status: 'pending',
        }),
      });

      toast({
        title: "Transaction Sent",
        description: `Transaction hash: ${txHash.slice(0, 10)}...`,
      });

      // Reset form
      setSelectedToken('');
      setRecipientAddress('');
      setAmount('');
      onClose();
    } catch (error) {
      console.error('Error sending transaction:', error);
      toast({
        title: "Error",
        description: "Failed to send transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const setMaxAmount = () => {
    if (selectedToken) {
      const balance = getTokenBalance(selectedToken);
      setAmount(balance);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Tokens</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="token">Token</Label>
            <Select value={selectedToken} onValueChange={setSelectedToken}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.address} value={token.address}>
                    {token.symbol} - {token.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="0x..."
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="amount">Amount</Label>
            <div className="relative mt-1">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="pr-16"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={setMaxAmount}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary h-6 px-2"
              >
                MAX
              </Button>
            </div>
            {selectedToken && (
              <p className="text-xs text-gray-500 mt-1">
                Available: {getTokenBalance(selectedToken)} {tokens.find(t => t.address === selectedToken)?.symbol}
              </p>
            )}
          </div>
          
          <Button
            onClick={handleSend}
            disabled={!selectedToken || !recipientAddress || !amount || isSending}
            className="w-full"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Transaction
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
