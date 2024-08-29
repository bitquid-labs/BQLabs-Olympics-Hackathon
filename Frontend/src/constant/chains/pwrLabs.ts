import { defineChain } from 'viem'

export const pwrlabs = defineChain({
  id: 21000001,
  name: 'BTC+ Network',
  nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 8 },
  rpcUrls: {
    default: { http: ['https://bitcoinplus.pwrlabs.io/'] },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://btcplusexplorer.pwrlabs.io/' },
  },
  contracts: {
  },
})