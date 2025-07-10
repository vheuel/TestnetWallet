import type { Token } from '@shared/schema';

export const DEFAULT_TESTNET_TOKENS: Token[] = [
  // Sepolia tokens
  {
    id: 1,
    chainId: "11155111",
    address: "0x0000000000000000000000000000000000000000",
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    logoUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    isNative: true
  },
  {
    id: 2,
    chainId: "11155111",
    address: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    isNative: false
  },
  // Mumbai tokens
  {
    id: 3,
    chainId: "80001",
    address: "0x0000000000000000000000000000000000000000",
    symbol: "MATIC",
    name: "Polygon",
    decimals: 18,
    logoUrl: "https://cryptologos.cc/logos/polygon-matic-logo.png",
    isNative: true
  },
  // BSC Testnet tokens
  {
    id: 4,
    chainId: "97",
    address: "0x0000000000000000000000000000000000000000",
    symbol: "BNB",
    name: "Binance Coin",
    decimals: 18,
    logoUrl: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
    isNative: true
  },
  // Avalanche Fuji tokens
  {
    id: 5,
    chainId: "43113",
    address: "0x0000000000000000000000000000000000000000",
    symbol: "AVAX",
    name: "Avalanche",
    decimals: 18,
    logoUrl: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
    isNative: true
  }
];

export const getTokenIcon = (symbol: string): string => {
  const iconMap: Record<string, string> = {
    ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    MATIC: "https://cryptologos.cc/logos/polygon-matic-logo.png",
    BNB: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
    AVAX: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
    USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  };
  
  return iconMap[symbol] || "https://via.placeholder.com/32x32?text=" + symbol.substring(0, 2);
};
