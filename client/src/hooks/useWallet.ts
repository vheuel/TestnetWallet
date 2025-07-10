import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { web3Service } from '@/lib/web3';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@shared/schema';

export function useWallet() {
  const { user, authenticated, login, logout } = usePrivy();
  const [walletUser, setWalletUser] = useState<User | null>(null);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (authenticated && user) {
      fetchOrCreateUser();
    }
  }, [authenticated, user]);

  const fetchOrCreateUser = async () => {
    if (!user) return;

    try {
      // Try to fetch existing user
      const response = await fetch(`/api/users/${user.id}`);
      if (response.ok) {
        const userData = await response.json();
        setWalletUser(userData);
      } else if (response.status === 404) {
        // Create new wallet for user
        await createWalletForUser();
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast({
        title: "Error",
        description: "Failed to load wallet data",
        variant: "destructive",
      });
    }
  };

  const createWalletForUser = async () => {
    if (!user) return;

    setIsCreatingWallet(true);
    try {
      const wallet = web3Service.createWallet();
      
      // In a real app, you'd want to encrypt the private key
      const userData = {
        privyId: user.id,
        walletAddress: wallet.address,
        encryptedPrivateKey: wallet.privateKey, // This should be encrypted!
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const createdUser = await response.json();
        setWalletUser(createdUser);
        toast({
          title: "Wallet Created",
          description: "Your testnet wallet has been created successfully",
        });
      } else {
        throw new Error('Failed to create wallet');
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast({
        title: "Error",
        description: "Failed to create wallet",
        variant: "destructive",
      });
    } finally {
      setIsCreatingWallet(false);
    }
  };

  const importWallet = async (privateKey: string) => {
    if (!user) return;

    try {
      const wallet = web3Service.importWallet(privateKey);
      
      const response = await fetch(`/api/users/${user.id}/wallet`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: wallet.address,
          encryptedPrivateKey: wallet.privateKey, // This should be encrypted!
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setWalletUser(updatedUser);
        toast({
          title: "Wallet Imported",
          description: "Your wallet has been imported successfully",
        });
      } else {
        throw new Error('Failed to import wallet');
      }
    } catch (error) {
      console.error('Error importing wallet:', error);
      toast({
        title: "Error",
        description: "Failed to import wallet",
        variant: "destructive",
      });
    }
  };

  const exportPrivateKey = () => {
    if (!walletUser) return null;
    // In a real app, you'd decrypt the private key here
    return walletUser.encryptedPrivateKey;
  };

  return {
    user: walletUser,
    authenticated,
    isCreatingWallet,
    wallet: walletUser ? {
      address: walletUser.walletAddress,
      privateKey: walletUser.encryptedPrivateKey,
    } : null,
    totalBalance: "0.5432", // This would come from actual balance calculation
    login,
    logout,
    createWalletForUser,
    importWallet,
    exportPrivateKey,
  };
}
