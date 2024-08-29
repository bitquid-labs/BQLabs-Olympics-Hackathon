import React, { useState, useEffect } from 'react';

import Button from '@/components/button/button';
import Input from '@/components/input';
import { parseUnits } from 'ethers';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useReadContracts, useWriteContract, useAccount, useBalance, useWaitForTransactionReceipt, useConnect } from 'wagmi';
import { convertTvl } from '@/lib/utils';

export const Stake = (): JSX.Element => {

  const [amount, setAmount] = useState<string>('1');
  const [period, setPeriod] = useState<number>(30);
  const { open, close } = useWeb3Modal();

  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  return (
    <div className='bg-background-100 flex max-w-[570px] flex-auto flex-col gap-4 rounded-[15px] p-5'>
      <div className='text-2xl font-bold'>Stake BTCP:</div>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center gap-6'>
          <Input className='border-border-200 border px-6' 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
          />
          <button className='min-w-[100px]'
              onClick={() => setAmount(convertTvl(Number(balance?.value)).toString())}
          >Max</button>
        </div>
        <div className='grid grid-cols-3 gap-11'>
          <Button variant={ period === 90 ? 'primary' : 'outline'} size='lg' className='w-full' onClick={() => setPeriod(90)}>
            3 months
          </Button>
          <Button variant={ period === 180 ? 'primary' : 'outline'} size='lg' className='w-full' onClick={() => setPeriod(180)}>
            6 months
          </Button>
          <Button variant={ period === 365 ? 'primary' : 'outline'} size='lg' className='w-full' onClick={() => setPeriod(365)}>
            1 year
          </Button>
        </div>
        <div className='mb-2 mt-4 flex justify-center'>
          <Button variant='primary' size='lg' className='min-w-[216px]'
            onClick={() => isConnected ? '' : open()}
          >
          {isConnected ? 'Deposit' : 'Connect Wallet'}
          </Button>
        </div>
      </div>
    </div>
  );
};
