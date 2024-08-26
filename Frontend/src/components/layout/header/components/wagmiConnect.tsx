import { useWeb3Modal } from '@web3modal/wagmi/react';
import React from 'react';
import { useAccount } from 'wagmi';

import Button from '@/components/button/button';

export const ConnectButton = (): JSX.Element => {
  const { open, close } = useWeb3Modal();
  const { address, isConnecting, isConnected, isDisconnected } = useAccount();

  // Function to truncate Ethereum address
  const truncateAddress = (address: string) => {
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  return (
    <div>
      {isConnected && address ? (
        <Button
          variant='gradient-outline'
          size='xl'
          className='bg-background-100'
          onClick={close}
        >
          {truncateAddress(address)}
        </Button>
      ) : (
        <Button variant='primary' size='xl' onClick={() => open()}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
};
