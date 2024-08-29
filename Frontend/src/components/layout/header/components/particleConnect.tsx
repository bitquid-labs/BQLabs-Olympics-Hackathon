import {
  useAccount,
  useDisconnect,
  useModal,
} from '@particle-network/connectkit';
import React from 'react';

import Button from '@/components/button/button';

export const ConnectButton = (): JSX.Element => {
  const { setOpen } = useModal();
  const { disconnectAsync } = useDisconnect();

  const { address, isConnected } = useAccount();

  // Function to truncate Ethereum address
  const truncateAddress = (address: string) => {
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  const handleDisconnect = async () => {
    try {
      await disconnectAsync();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error disconnecting:', error);
    }
  };

  return (
    <div>
      {isConnected && address ? (
        <Button
          variant='gradient-outline'
          size='xl'
          className='bg-background-100'
          onClick={async () => handleDisconnect()}
        >
          {truncateAddress(address)}
        </Button>
      ) : (
        <Button variant='primary' size='xl' onClick={() => setOpen(true)}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
};
