import React from 'react';

import { cn } from '@/lib/utils';

import Button from '@/components/button/button';

import { MyStackDetail, tempMyStacks } from '@/screen/stake/constants';

import LeftArrowIcon from '~/svg/left-arrow.svg';

export const MyStakeScreen = (): JSX.Element => {
  return (
    <section className='flex h-full flex-auto flex-col'>
      <div className='layout flex flex-auto flex-col items-center gap-10 p-10 pt-12'>
        <div className='text-[40px] font-bold leading-[50px]'>
          Active Stake Positions
        </div>
        <div className='flex w-full flex-col gap-6'>
          {tempMyStacks.map((stack, index) => (
            <div
              key={index}
              className='bg-background-100 flex w-full gap-5 rounded-[15px] p-4'
            >
              {Object.keys(stack).map((key, i) => (
                <div
                  key={i}
                  className='flex w-full flex-col items-center gap-6'
                >
                  <div
                    className={cn(
                      'w-full rounded-full px-5 py-3 text-center',
                      'bg-[#0699D8]'
                    )}
                  >
                    {MyStackDetail[key as keyof typeof MyStackDetail]}
                  </div>
                  <div className='font-semibold'>
                    {stack[key as keyof typeof stack]}
                  </div>
                  {key === 'claim' && (
                    <div className='w-full'>
                      <Button
                        variant='gradient-outline'
                        className='bg-background-100 w-full'
                        size='lg'
                      >
                        Withdraw Stake
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-6'>
            <div className='text-2xl font-semibold'>
              Looking for custom solutions for your business
            </div>
            <Button variant='gradient-outline' size='lg'>
              Reach out to us
            </Button>
          </div>
          <div className='flex items-center gap-8'>
            <div className='bg-background-100 flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full hover:bg-white/30 active:scale-95'>
              <LeftArrowIcon className='h-[13px] w-[23px]' />
            </div>
            <div className='bg-background-100 flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full hover:bg-white/30 active:scale-95'>
              <LeftArrowIcon className='h-[13px] w-[23px] rotate-180' />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
