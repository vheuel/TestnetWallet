import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Wallet, Droplets, Send, Settings } from "lucide-react";
import { useNetwork } from "@/hooks/useNetwork";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import NetworkSelector from "@/components/wallet/NetworkSelector";
import TokenList from "@/components/wallet/TokenList";
import TransactionHistory from "@/components/wallet/TransactionHistory";
import SendModal from "@/components/modals/SendModal";
import ReceiveModal from "@/components/modals/ReceiveModal";
import FaucetModal from "@/components/modals/FaucetModal";
import { Link } from "wouter";

export default function WalletPage() {
  const { authenticated, user, logout } = usePrivy();
  const { currentNetwork } = useNetwork();
  const { wallet, totalBalance } = useWallet();
  const { toast } = useToast();
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [faucetModalOpen, setFaucetModalOpen] = useState(false);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">TestNet Wallet</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please log in to access your wallet
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to login...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCopyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-10)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto">
        {/* Header with Network Selector */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm">
          <NetworkSelector />
          <Button variant="ghost" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>

        {/* Wallet Address and Balance */}
        <div className="bg-white dark:bg-gray-800 px-4 py-6 text-center">
          {wallet?.address && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                {formatAddress(wallet.address)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6"
                onClick={handleCopyAddress}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
            {totalBalance || "0.0000"}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            {currentNetwork?.name || "Select Network"}
          </div>
        </div>

        {/* Assets and Recent Transactions Tabs */}
        <div className="bg-white dark:bg-gray-800">
          <Tabs defaultValue="assets" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-sky-100 dark:bg-sky-900/20 m-0 rounded-none">
              <TabsTrigger 
                value="assets" 
                className="data-[state=active]:bg-sky-500 data-[state=active]:text-white rounded-none"
              >
                Assets
              </TabsTrigger>
              <TabsTrigger 
                value="transactions"
                className="data-[state=active]:bg-sky-500 data-[state=active]:text-white rounded-none"
              >
                Recent Transaction
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="assets" className="mt-0 p-0">
              <div className="min-h-[400px]">
                <TokenList />
              </div>
            </TabsContent>
            
            <TabsContent value="transactions" className="mt-0 p-0">
              <div className="min-h-[400px] p-4">
                <TransactionHistory />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-md mx-auto grid grid-cols-4 gap-1 p-2">
            {/* Wallet (Current Page) */}
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 py-3 px-2 text-blue-600 dark:text-blue-400"
            >
              <Wallet className="h-6 w-6" />
              <span className="text-xs">Wallet</span>
            </Button>

            {/* Faucet */}
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 py-3 px-2 text-gray-600 dark:text-gray-400"
              onClick={() => setFaucetModalOpen(true)}
            >
              <Droplets className="h-6 w-6" />
              <span className="text-xs">Faucet</span>
            </Button>

            {/* Send */}
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 py-3 px-2 text-gray-600 dark:text-gray-400"
              onClick={() => setSendModalOpen(true)}
              disabled={!wallet}
            >
              <div className="relative">
                <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Send className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-xs">Send</span>
            </Button>

            {/* Settings */}
            <Link href="/settings">
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 py-3 px-2 text-gray-600 dark:text-gray-400"
              >
                <Settings className="h-6 w-6" />
                <span className="text-xs">Settings</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Add bottom padding to account for fixed navigation */}
        <div className="h-20"></div>

        {/* Modals */}
        <SendModal 
          isOpen={sendModalOpen} 
          onClose={() => setSendModalOpen(false)} 
        />
        <ReceiveModal 
          isOpen={receiveModalOpen} 
          onClose={() => setReceiveModalOpen(false)} 
        />
        <FaucetModal 
          isOpen={faucetModalOpen} 
          onClose={() => setFaucetModalOpen(false)} 
        />
      </div>
    </div>
  );
}