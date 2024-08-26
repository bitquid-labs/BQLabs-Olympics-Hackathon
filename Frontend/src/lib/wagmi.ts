import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage } from 'wagmi';

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

export const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

export const arbitrum = {
  id: 21000001,
  name: 'Bitcoinplus Pwrlabs',
  network: 'bitcoinplus',
  iconBackground: 'transparent',
  nativeCurrency: {
    name: 'BTC',
    symbol: 'BTC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://bitcoinplus.pwrlabs.io/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Arbiscan',
      url: 'https://btcplusexplorer.pwrlabs.io/',
    },
  },
};

// Create wagmiConfig
const chains = [arbitrum] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
