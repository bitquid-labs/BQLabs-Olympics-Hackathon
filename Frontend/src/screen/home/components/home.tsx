import React from 'react';

import Button from '@/components/button/button';

import Grid from '~/svg/grid.svg';

export const HomeScreen = (): JSX.Element => {
  return (
    <section className='flex h-full flex-auto flex-col'>
      <div className='layout flex flex-auto flex-col items-center justify-center gap-[70px]'>
        <div className='flex w-full max-w-[742px] flex-col items-center gap-10'>
          <div className='flex flex-col items-center text-[80px] font-bold leading-[80px]'>
            <div>Bitcoin Risk</div>
            <div>Management Layer</div>
          </div>
          <Button>Connect Wallet</Button>
        </div>
        <div className='flex gap-9'>
          <div className='to-[#4FFF4C]/52 relative h-[345px] w-[388px] overflow-hidden rounded-[15px] bg-gradient-to-br from-[#12EF0E] px-12 py-6'>
            <div className='to-[#4FFF4C]/52 absolute bg-gradient-to-br from-[#12EF0E]'></div>
            <Grid className='absolute inset-0' />
            <div className='relative z-10 flex h-full w-full flex-col justify-between'>
              <div className='text-dark text-[40px] font-bold leading-[50px]'>
                Learn About BitQuid Labs
              </div>
              <div className='flex justify-end'>
                <div className='h-40 w-40 rounded-full bg-[#D9D9D9]'></div>
              </div>
            </div>
          </div>
          <div className='to-[#FFDC5E]/63 relative h-[345px] w-[388px] overflow-hidden rounded-[15px] bg-gradient-to-br from-[#FCC608] px-12 py-6'>
            <div className='to-[#FFDC5E]/63 absolute bg-gradient-to-br from-[#FCC608]'></div>
            <Grid className='absolute inset-0' />
            <div className='relative z-10 flex h-full w-full flex-col justify-between'>
              <div className='text-dark text-[40px] font-bold leading-[50px]'>
                Protect About BitQuid Labs
              </div>
              <div className='flex justify-end'>
                <div className='h-40 w-40 rounded-full bg-[#D9D9D9]'></div>
              </div>
            </div>
          </div>
          <div className='relative h-[345px] w-[388px] overflow-hidden rounded-[15px] bg-gradient-to-br from-[#6EBDFF] to-[#3DA5FC]/75 px-12 py-6'>
            <div className='absolute bg-gradient-to-br from-[#6EBDFF] to-[#3DA5FC]/75'></div>
            <Grid className='absolute inset-0' />
            <div className='relative z-10 flex h-full w-full flex-col justify-between'>
              <div className='text-dark text-[40px] font-bold leading-[50px]'>
                Protect About BitQuid Labs
              </div>
              <div className='flex justify-end'>
                <div className='h-40 w-40 rounded-full bg-[#D9D9D9]'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
