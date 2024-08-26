import React from 'react';

import { Currency } from '@/screen/pool/components/currency';
import { Detail } from '@/screen/pool/components/detail';
import { tempStacks } from '@/screen/stake/constants';

import RiskImage from '~/svg/risk.svg';

export const PoolScreen = ({ currency }: { currency: string }): JSX.Element => {
  const pool = tempStacks.find((stake) => stake.currency === currency);

  return (
    <section className='flex h-full flex-auto flex-col'>
      <div className='layout flex flex-auto flex-col items-center gap-10 p-10 pt-12'>
        <div className='flex w-full gap-10'>
          <Detail pool={pool} />
          <Currency pool={pool} />
        </div>
        <div className='flex w-full flex-col'>
          <div className='text-[40px] font-bold leading-[50px]'>
            Risk Covered
          </div>
          <div className='flex w-full items-center justify-center'>
            <div className='flex items-center gap-6'>
              <RiskImage className='h-[316px] w-[316px]' />
              <div className='flex min-w-[420px] flex-col gap-8'>
                <div className='flex items-center justify-between'>
                  <div className='text-2xl'>Merlin Slashing</div>
                  <div className='text-2xl font-bold'>20%</div>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='text-2xl'>Babylon Slashing</div>
                  <div className='text-2xl font-bold'>15%</div>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='text-2xl'>PWR Slashing</div>
                  <div className='text-2xl font-bold'>65%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
