import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Key, 
  List, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Copy, 
  Eye, 
  EyeOff,
  AlertTriangle
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function WalletTools() {
  const { user, exportPrivateKey, importWallet } = useWallet();
  const { toast } = useToast();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [privateKeyInput, setPrivateKeyInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [revealedPrivateKey, setRevealedPrivateKey] = useState(false);

  const handleCopyPrivateKey = () => {
    const privateKey = exportPrivateKey();
    if (privateKey) {
      navigator.clipboard.writeText(privateKey);
      toast({
        title: "Copied",
        description: "Private key copied to clipboard",
      });
    }
  };

  const handleCopyAddress = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      toast({
        title: "Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const handleImportWallet = async () => {
    if (!privateKeyInput.trim()) return;

    setIsImporting(true);
    try {
      await importWallet(privateKeyInput.trim());
      setPrivateKeyInput('');
      setShowImportDialog(false);
      toast({
        title: "Success",
        description: "Wallet imported successfully",
      });
    } catch (error) {
      console.error('Error importing wallet:', error);
      toast({
        title: "Error",
        description: "Failed to import wallet. Please check the private key.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    // In a real app, this would clear the wallet data
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Tools</h3>
        
        <div className="space-y-3">
          {/* Export Private Key */}
          <Dialog open={showPrivateKey} onOpenChange={setShowPrivateKey}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <Key className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Export Private Key</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Private Key</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Security Warning</p>
                      <p className="text-xs text-red-700 mt-1">
                        Never share your private key with anyone. Anyone with your private key can access your funds.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Private Key</Label>
                  <div className="relative mt-1">
                    <Input
                      type={revealedPrivateKey ? 'text' : 'password'}
                      value={exportPrivateKey() || ''}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRevealedPrivateKey(!revealedPrivateKey)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    >
                      {revealedPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button onClick={handleCopyPrivateKey} className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Private Key
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Import Wallet */}
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <Plus className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Import Wallet</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Wallet</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="privateKeyInput">Private Key</Label>
                  <Input
                    id="privateKeyInput"
                    type="password"
                    value={privateKeyInput}
                    onChange={(e) => setPrivateKeyInput(e.target.value)}
                    placeholder="Enter your private key..."
                    className="mt-1"
                  />
                </div>
                
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Import Notice</p>
                      <p className="text-xs text-amber-700 mt-1">
                        This will replace your current wallet. Make sure to backup your current private key first.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleImportWallet} 
                  disabled={!privateKeyInput.trim() || isImporting}
                  className="w-full"
                >
                  {isImporting ? 'Importing...' : 'Import Wallet'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Copy Address */}
          <Button 
            variant="ghost" 
            onClick={handleCopyAddress}
            className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <Copy className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Copy Address</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Button>

          {/* Reset Wallet */}
          <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <Trash2 className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium text-red-500">Reset Wallet</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset Wallet</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Danger Zone</p>
                      <p className="text-xs text-red-700 mt-1">
                        This will permanently delete your wallet data. Make sure to backup your private key first.
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">
                  Are you sure you want to reset your wallet? This action cannot be undone.
                </p>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setShowResetDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleReset}
                >
                  Reset Wallet
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
