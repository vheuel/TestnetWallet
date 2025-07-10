import type { Network } from '@shared/schema';

export const DEFAULT_TESTNET_NETWORKS: Network[] = [
  {
    id: 1,
    chainId: "11155111",
    name: "Sepolia Testnet",
    symbol: "ETH",
    rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/demo",
    explorerUrl: "https://sepolia.etherscan.io",
    isTestnet: true,
    iconUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png"
  },
  {
    id: 2,
    chainId: "80001",
    name: "Polygon Mumbai",
    symbol: "MATIC",
    rpcUrl: "https://polygon-mumbai.g.alchemy.com/v2/demo",
    explorerUrl: "https://mumbai.polygonscan.com",
    isTestnet: true,
    iconUrl: "https://cryptologos.cc/logos/polygon-matic-logo.png"
  },
  {
    id: 3,
    chainId: "97",
    name: "BSC Testnet",
    symbol: "BNB",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    explorerUrl: "https://testnet.bscscan.com",
    isTestnet: true,
    iconUrl: "https://cryptologos.cc/logos/bnb-bnb-logo.png"
  },
  {
    id: 4,
    chainId: "43113",
    name: "Avalanche Fuji",
    symbol: "AVAX",
    rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
    explorerUrl: "https://testnet.snowtrace.io",
    isTestnet: true,
    iconUrl: "https://cryptologos.cc/logos/avalanche-avax-logo.png"
  }
];

export const NETWORK_ICONS: Record<string, string> = {
  "11155111": "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  "80001": "https://cryptologos.cc/logos/polygon-matic-logo.png",
  "97": "https://cryptologos.cc/logos/bnb-bnb-logo.png",
  "43113": "https://cryptologos.cc/logos/avalanche-avax-logo.png",
};

export const getNetworkIcon = (chainId: string): string => {
  return NETWORK_ICONS[chainId] || "https://via.placeholder.com/32x32?text=?";
};
