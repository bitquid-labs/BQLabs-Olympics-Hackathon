import { GovContract, MockERC20Contract } from '@/constant/contracts';
import { MetaMaskInpageProvider } from '@metamask/providers';

export async function addTokenToMetaMask() {
  const tokenAddress = MockERC20Contract.address; // Replace with your token contract address
  const tokenSymbol = 'BQ'; // Replace with your token's symbol (e.g., 'SYM')
  const tokenDecimals = 18; // Replace with your token's decimals (commonly 18 for ERC20 tokens)

  try {
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
        },
      },
    });

    if (wasAdded) {
      console.log('Token added successfully!');
    } else {
      console.log('Token addition was rejected.');
    }
  } catch (error) {
    console.error('There was an error adding the token:', error);
  }
}