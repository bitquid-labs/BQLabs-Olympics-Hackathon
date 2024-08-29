import React from 'react';

import Input from '@/components/input';

export const Requirement = (): JSX.Element => {
  return (
    <div className='flex w-full flex-col gap-10'>
      <div className='text-[40px] font-bold leading-[50px]'>
        Claim Requirements
      </div>
      <div className='bg-background-100 flex flex-auto flex-col gap-6 rounded-[15px] p-6'>
        <div className='flex flex-col gap-6 text-xl'>
          <div className='flex items-center justify-between'>
            <div>Loss Event Date</div>
            <div className='h-[40px] w-[140px]'>
              <Input
                type='number'
                className='border-border-200 max-w-full border'
              />
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div>Max Claimable</div>
            <div>4 WBTC</div>
          </div>
          <div className='flex items-center justify-between'>
            <div>Claim Value</div>
            <div className='h-[40px] w-[140px]'>
              <Input
                type='number'
                className='border-border-200 border'
                rightIcon={<div>WBTC</div>}
              />
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div>Slashing Tnx Hash</div>
            <div className='h-[40px] w-[140px]'>
              <Input className='border-border-200 border' />
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div>Description</div>
            <div className='h-[40px] w-[140px]'>
              <Input className='border-border-200 border' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
