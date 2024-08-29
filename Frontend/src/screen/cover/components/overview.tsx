import React, { useMemo, useState } from 'react';

import Button from '@/components/button/button';
import Dropdown from '@/components/dropdown';
import { useAccount } from "wagmi";
import { useAllAvailableCovers } from "@/hooks/contracts/useAllAvailableCovers";

type OverViewProps = {
  handleBuyCover: () => void;
  error: string;
}

export const Overview = (props: OverViewProps): JSX.Element => {
  const {handleBuyCover, error} = props;

  const {slashingCovers: slasing} = useAllAvailableCovers();

  const [selectedToken, setSelectedToken] = useState<number>(0);

  return (
    <div className='bg-background-100 flex flex-auto flex-col gap-4 rounded-[15px] p-6'>
      <div className='border-border-100 border-b-[0.5px] pb-4 text-2xl font-bold'>
        Cover Details
      </div>
      <div className='border-border-300 flex flex-col gap-[13px] rounded-[15px] border p-3'>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <div>Product</div>
            <div className='flex gap-[10px]'>
              <div className='bg-background-200 h-5 w-5 rounded-full' />
              <div>Beefy CLM + Pancakeswap</div>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex gap-[10px]'>
              <div>Cover amount</div>
              <div className='bg-background-200 h-5 w-5 rounded-full' />
            </div>
            <div className='flex gap-[10px]'>
              <div className='font-semibold'>1 ETH</div>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex gap-[10px]'>
              <div>Cover period</div>
              <div className='bg-background-200 h-5 w-5 rounded-full' />
            </div>
            <div className='font-semibold'>7/27/2024 - 8/26/2024</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex gap-[10px]'>
              <div>Yearly Cost</div>
              <div className='bg-background-200 h-5 w-5 rounded-full' />
            </div>
            <div className='font-semibold'>7.64%</div>
          </div>
          <div className='bg-border-100 h-[0.5px] w-full'></div>
        </div>
        <div className='flex items-center justify-between'>
          <div className='text-xl font-semibold'>1</div>
          <div className='flex items-center gap-2'>
            <div>0.0062</div>
            <Dropdown
              value={selectedToken}
              setValue={setSelectedToken}
              options={['WBTC', 'WETH', 'USDC']}
            />
          </div>
        </div>
      </div>
      <div className='mb-2 mt-4 flex justify-center'>
        <Button variant='primary' size='lg' className='min-w-[216px]' onClick={handleBuyCover} disabled={!!error}>
          {error || 'Buy Cover'}
        </Button>
      </div>
    </div>
  );
};
