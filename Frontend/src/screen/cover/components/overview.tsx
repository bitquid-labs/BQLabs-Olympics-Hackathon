import React, { useMemo, useState } from 'react';

import Button from '@/components/button/button';
import Dropdown from '@/components/dropdown';
import { useAccount } from "wagmi";
import { useAllAvailableCovers } from "@/hooks/contracts/useAllAvailableCovers";
import { formatDate } from "@/lib/formulat";

type OverViewProps = {
  handleBuyCover: () => void;
  error: string;
  productName: string;
  coverAmount: string;
  annualCost: number;
  coverFee: number;
  coverPeriod: number;
  logo: string;
  isLoading: boolean;
}

export const Overview = (props: OverViewProps): JSX.Element => {
  const {handleBuyCover, error, productName, coverAmount, annualCost, coverFee, coverPeriod, logo, isLoading} = props;

  // const {slashingCovers: slasing} = useAllAvailableCovers();

  const [selectedToken, setSelectedToken] = useState<number>(0);
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + coverPeriod | 0);
  

  return (
    <div className='bg-background-100 flex flex-auto flex-col gap-4 rounded-[15px] p-6'>
      <div className='border-border-100 border-b-[0.5px] pb-4 text-2xl font-bold'>
        Cover Details
      </div>
      <div className='border-border-300 flex flex-col gap-[13px] rounded-[15px] border p-3'>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <div>Product</div>
            <div className='flex gap-[10px] items-center'>
              <div className='h-[32px] w-[32px] overflow-hidden'>
                <img className='w-full h-full rounded-full' src={logo} alt='logo' />
              </div>
              {/* <div className='bg-background-200 h-5 w-5 rounded-full' /> */}
              <div>{productName}</div>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex gap-[10px]'>
              <div>Cover amount</div>
              {/* <div className='bg-background-200 h-5 w-5 rounded-full' /> */}
            </div>
            <div className='flex gap-[10px]'>
              <div className='font-semibold'>{coverAmount} BTCP</div>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex gap-[10px]'>
              <div>Cover period</div>
              {/* <div className='bg-background-200 h-5 w-5 rounded-full' /> */}
            </div>
            <div className='font-semibold'>{formatDate(startDate)} - {formatDate(endDate)}</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex gap-[10px]'>
              <div>Yearly Cost</div>
              {/* <div className='bg-background-200 h-5 w-5 rounded-full' /> */}
            </div>
            <div className='font-semibold'>{annualCost}%</div>
          </div>
          <div className='bg-border-100 h-[0.5px] w-full'></div>
        </div>
        <div className='flex items-center justify-between'>
          <div className=''>Cover fee</div>
          <div className='flex items-center gap-2'>
          {!!coverFee && (<div>{coverFee.toFixed(5)}</div>)}
            {/* <Dropdown
              value={selectedToken}
              setValue={setSelectedToken}
              options={['WBTC', 'WETH', 'USDC']}
            /> */}
            <div className='py-[5px] px-[25px] rounded-full bg-[#d9d9d933]'>BTCP</div>
          </div>
        </div>
      </div>
      <div className='mb-2 mt-4 flex justify-center'>
        <Button isLoading={isLoading} variant='primary' size='lg' className='min-w-[216px]' onClick={handleBuyCover} disabled={!!error}>
          {error || 'Buy Cover'}
        </Button>
      </div>
    </div>
  );
};
