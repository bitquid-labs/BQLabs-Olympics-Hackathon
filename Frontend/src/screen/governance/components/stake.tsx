import React from 'react';

import Button from '@/components/button/button';
import Input from '@/components/input';

export const Stake = (): JSX.Element => {
  return (
    <div className='bg-background-100 flex max-w-[570px] flex-auto flex-col gap-4 rounded-[15px] p-5'>
      <div className='text-2xl font-bold'>Stake BQ:</div>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center gap-6'>
          <Input className='border-border-200 border' />
          <button className='min-w-[100px]'>Max</button>
        </div>
        <div className='grid grid-cols-3 gap-11'>
          <Button variant='outline' size='lg' className='w-full'>
            3 months
          </Button>
          <Button variant='outline' size='lg' className='w-full'>
            6 months
          </Button>
          <Button variant='outline' size='lg' className='w-full'>
            1 year
          </Button>
        </div>
        <div className='mb-2 mt-4 flex justify-center'>
          <Button variant='primary' size='lg' className='min-w-[216px]'>
            Connect Wallet
          </Button>
        </div>
      </div>
    </div>
  );
};
