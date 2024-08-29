import React from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import {
  useReadContracts,
  useWriteContract,
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useConnect,
  useDisconnect,
} from 'wagmi';

import Button from '@/components/button/button';

import Grid from '~/svg/grid.svg';
import AboutSectionImage from '~/images/home/locker-dynamic-premium.svg';
import BQTokenSectionImage from '~/images/home/star.svg';
import BTCPSectionImage from '~/images/home/shield.svg';

export const HomeScreen = (): JSX.Element => {
  const { open, close } = useWeb3Modal();
  const { address, isConnecting, isConnected, isDisconnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const handleDisconnect = async () => {
    try {
      await disconnectAsync();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error disconnecting:', error);
    }
  };

  return (
    <section className='flex h-full flex-auto flex-col'>
      <div className='layout flex flex-auto flex-col items-center justify-center gap-[70px]'>
        <div className='flex w-full max-w-[742px] flex-col items-center gap-10'>
          <div className='flex flex-col items-center text-[80px] font-bold leading-[80px]'>
            <div>Bitcoin Risk</div>
            <div>Management Layer</div>
          </div>
          <Button
            variant='primary'
            size='lg'
            className='min-w-[216px]'
            onClick={async () => (isConnected ? handleDisconnect() : open())}
          >
            {isConnected ? 'Disconnect' : 'Connect Wallet'}
          </Button>
        </div>
        <div className='flex gap-9'>
          <div className='to-[#4FFF4C]/52 relative h-[345px] w-[388px] overflow-hidden rounded-[15px] bg-gradient-to-br from-[#12EF0E] px-12 py-6'>
            <div className='to-[#4FFF4C]/52 absolute bg-gradient-to-br from-[#12EF0E]'></div>
            <Grid className='absolute inset-0' />
            <div className='relative z-10 flex h-full w-full flex-col justify-between'>
              <div className='text-dark text-[40px] font-bold leading-[50px]'>
                About BQ Labs
              </div>
              <div className='flex justify-center'>
                {/* <div className='h-40 w-40 rounded-full bg-[#D9D9D9]'></div> */}
                <AboutSectionImage className='h-[200px] w-[200px]' />
              </div>
            </div>
          </div>
          <div className='to-[#FFDC5E]/63 relative h-[345px] w-[388px] overflow-hidden rounded-[15px] bg-gradient-to-br from-[#FCC608] px-12 py-6'>
            <div className='to-[#FFDC5E]/63 absolute bg-gradient-to-br from-[#FCC608]'></div>
            <Grid className='absolute inset-0' />
            <div className='relative z-10 flex h-full w-full flex-col justify-between'>
              <div className='text-dark text-[40px] font-bold leading-[50px]'>
                BQ Token Faucet
              </div>
              <div className='flex justify-center'>
                {/* <div className='h-40 w-40 rounded-full bg-[#D9D9D9]'></div> */}
                <BQTokenSectionImage className='h-[200px] w-[200px]' />
              </div>
            </div>
          </div>
          <div className='relative h-[345px] w-[388px] overflow-hidden rounded-[15px] bg-gradient-to-br from-[#6EBDFF] to-[#3DA5FC]/75 px-12 py-6'>
            <div className='absolute bg-gradient-to-br from-[#6EBDFF] to-[#3DA5FC]/75'></div>
            <Grid className='absolute inset-0' />
            <div className='relative z-10 flex h-full w-full flex-col justify-between'>
              <div className='text-dark text-[40px] font-bold leading-[50px]'>
                BTCP Token Faucet
              </div>
              <div className='flex justify-center'>
                {/* <div className='h-40 w-40 rounded-full bg-[#D9D9D9]'></div> */}
                <BTCPSectionImage className='h-[200px] w-[200px]' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
