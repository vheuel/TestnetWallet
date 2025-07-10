import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Network, Key, Download, Upload, Copy, ExternalLink } from "lucide-react";
import { useNetwork } from "@/hooks/useNetwork";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import NetworkInfo from "@/components/wallet/NetworkInfo";

export default function SettingsPage() {
  const { currentNetwork } = useNetwork();
  const { wallet, exportPrivateKey, importWallet } = useWallet();
  const { toast } = useToast();
  const [importKey, setImportKey] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const handleExportPrivateKey = async () => {
    try {
      const privateKey = await exportPrivateKey();
      if (privateKey) {
        navigator.clipboard.writeText(privateKey);
        toast({
          title: "Private Key Copied",
          description: "Your private key has been copied to clipboard",
        });
        setShowPrivateKey(true);
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export private key",
        variant: "destructive",
      });
    }
  };

  const handleImportWallet = async () => {
    if (!importKey.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid private key",
        variant: "destructive",
      });
      return;
    }

    try {
      await importWallet(importKey);
      toast({
        title: "Wallet Imported",
        description: "Your wallet has been imported successfully",
      });
      setImportKey("");
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import wallet. Please check your private key.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto pt-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 px-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h1>
          </div>
        </div>

        <div className="space-y-6 px-4">
          {/* Network Information */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Network Information</CardTitle>
              </div>
              <CardDescription>Current network details and configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <NetworkInfo />
            </CardContent>
          </Card>

          {/* Wallet Tools */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Wallet Tools</CardTitle>
              </div>
              <CardDescription>Manage your wallet keys and backup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Export Private Key */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Export Private Key</Label>
                <Button 
                  onClick={handleExportPrivateKey}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Private Key
                </Button>
                {showPrivateKey && (
                  <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                    ⚠️ Private key copied to clipboard. Keep it secure!
                  </p>
                )}
              </div>

              <Separator />

              {/* Import Wallet */}
              <div className="space-y-2">
                <Label htmlFor="importKey" className="text-sm font-medium">Import Wallet</Label>
                <Input
                  id="importKey"
                  type="password"
                  placeholder="Enter private key to import wallet"
                  value={importKey}
                  onChange={(e) => setImportKey(e.target.value)}
                />
                <Button 
                  onClick={handleImportWallet}
                  variant="outline" 
                  className="w-full justify-start"
                  disabled={!importKey.trim()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Wallet
                </Button>
              </div>

              <Separator />

              {/* Current Wallet Address */}
              {wallet?.address && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Current Wallet Address</Label>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <code className="text-xs text-gray-600 dark:text-gray-400 flex-1 truncate">
                      {wallet.address}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(wallet.address);
                        toast({
                          title: "Copied",
                          description: "Wallet address copied to clipboard",
                        });
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Testnet Faucets */}
          {currentNetwork && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-lg">Testnet Faucets</CardTitle>
                </div>
                <CardDescription>Get free testnet tokens for development</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/">
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Access Faucets from Wallet
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}