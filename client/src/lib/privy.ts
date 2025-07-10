import { PrivyProvider, usePrivy } from '@privy-io/react-auth';
import type { PrivyClientConfig } from '@privy-io/react-auth';

export const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID || 'your-privy-app-id';

export const privyConfig: PrivyClientConfig = {
  loginMethods: ['email', 'wallet'],
  appearance: {
    theme: 'light' as const,
    accentColor: '#6366F1',
    logo: 'https://your-logo-url.com/logo.png',
  },
  embeddedWallets: {
    createOnLogin: 'all-users' as const,
  },
};

export { PrivyProvider, usePrivy };
