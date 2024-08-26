import React from 'react';

import { Covers } from '@/screen/claim/components/covers';
import { Requirement } from '@/screen/claim/components/requirement';
import { Status } from '@/screen/claim/components/status';

import LeftArrowIcon from '~/svg/left-arrow.svg';

export const ClaimScreen = (): JSX.Element => {
  return (
    <section className='flex h-full flex-auto flex-col'>
      <div className='layout flex flex-auto flex-col items-center gap-10 p-10 pt-12'>
        <div className='flex w-full items-center justify-start gap-6'>
          <div className='bg-background-100 flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full hover:bg-white/30 active:scale-95'>
            <LeftArrowIcon className='h-[13px] w-[23px]' />
          </div>
          <div className='text-[40px] font-bold leading-[50px]'>Claim</div>
        </div>
        <Covers />
        <div className='flex w-full'>
          <Requirement />
          <Status />
        </div>
      </div>
    </section>
  );
};
