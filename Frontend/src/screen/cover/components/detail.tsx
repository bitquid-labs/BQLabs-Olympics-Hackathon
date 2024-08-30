import React, { ChangeEvent, ChangeEventHandler, useState } from 'react';

import Dropdown from '@/components/dropdown';
import Input from '@/components/input';
import { Slider } from '@/components/slider';

import BeLineIcon from '~/svg/be-line.svg';
import { CoverDueTo } from "@/types/main";
import { MAX_COVER_PERIOD, MIN_COVER_PERIOD } from "@/constant/config";

type DetailProps = {
  id: number;
  coverAmount: string;
  handleCoverAmountChange: (event: ChangeEvent<HTMLInputElement>) => void;
  coverPeriod: number;
  handleCoverPeriodChange: (val: number) => void;
  dueTo: CoverDueTo;
  maxCoverAmount: string;
}

export const Detail = (props: DetailProps): JSX.Element => {
  const { id, coverAmount, coverPeriod, dueTo, maxCoverAmount, handleCoverAmountChange, handleCoverPeriodChange } = props;

  const [period, setPeriod] = useState<number>(30);
  const [selectedToken, setSelectedToken] = useState<number>(0);

  return (
    <div className='bg-background-100 flex min-w-[630px] flex-col gap-4 rounded-[15px] p-6'>
      <div className='border-border-100 border-b-[0.5px] pb-4 text-2xl font-bold'>
        Cover Details {id}
      </div>
      <div className='flex flex-col gap-4'>
        <div className='border-border-300 flex flex-col gap-[13px] rounded-[15px] border p-3'>
          <div className='flex items-center justify-between'>
            <div className='flex gap-[10px]'>
              <div>Cover amount</div>
              {/* <div className='bg-background-200 h-5 w-5 rounded-full' /> */}
            </div>
            <div className='flex gap-[10px]'>
              <div className='font-semibold'>Max: {parseFloat(maxCoverAmount).toFixed(2)} BTCP</div>
              {/* <div className='bg-background-200 h-5 w-5 rounded-full' /> */}
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <Input
              type='number'
              className='p-0'
              value={coverAmount}
              onChange={(e) => handleCoverAmountChange(e)}
              classNames={{ input: '!text-xl !font-semibold' }}
            />
            {/* <Dropdown
              value={selectedToken}
              setValue={setSelectedToken}
              options={['WBTC', 'WETH', 'USDC']}
            /> */}
            <div className='py-[5px] px-[25px] rounded-full bg-[#d9d9d933]'>BTCP</div>
          </div>
        </div>
        <div className='border-border-300 flex flex-col gap-[13px] rounded-[15px] border p-3'>
          <div className='flex items-center justify-between'>
            <div className='flex gap-[10px]'>
              <div>Cover period</div>
              {/* <div className='bg-background-200 h-5 w-5 rounded-full' /> */}
            </div>
            <div className='flex items-center gap-3 font-semibold'>
              <div>28 Days</div>
              <BeLineIcon className='h-5 w-6' />
              <div>365 Days</div>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Input
                type='number'
                className='w-[40px] p-0'
                value={coverPeriod}
                onChange={(e) => {
                  handleCoverPeriodChange(Math.max(MIN_COVER_PERIOD, Math.min(MAX_COVER_PERIOD, Number(e.target.value))));
                }}
                classNames={{ input: '!text-xl !font-semibold' }}
              />
              <div className='bg-background-200/20 rounded-full px-4 py-1'>
                <div>days</div>
              </div>
            </div>
            <div className='w-[300px]'>
              <Slider
                thumbClassName='h-[14px] w-[14px]'
                defaultValue={[MIN_COVER_PERIOD]}
                value={[coverPeriod]}
                onValueChange={(val) => {
                  handleCoverPeriodChange(val[0]);
                }}
                min={MIN_COVER_PERIOD}
                max={MAX_COVER_PERIOD}
                step={1}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='border-border-100 mt-4 w-full border-b-[0.5px] pb-4 text-2xl font-bold'>
        Terms & Conditions
      </div>
      <div className='font-semibold'>
        Bundled Protocol Cover protects against a loss of funds due to{' '}
      </div>
      <div className='flex items-center gap-[10px]'>
        <div className='bg-background-200 h-4 w-4 rounded-full' />
        <div className='text-sm'>Smart contract exploits/hacks</div>
      </div>
      <div className='flex items-center gap-[10px]'>
        <div className='bg-background-200 h-4 w-4 rounded-full' />
        <div className='text-sm'>
          Severe oracle failure/manipulation, severe liquidation failure, or....
        </div>
      </div>
    </div>
  );
};
