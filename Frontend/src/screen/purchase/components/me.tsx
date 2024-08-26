import { useRouter } from 'next/navigation';
import React from 'react';

import { MyList } from '@/screen/purchase/components/myList';

import LeftArrowIcon from '~/svg/left-arrow.svg';

export const MyPurchaseScreen = (): JSX.Element => {
  const router = useRouter();

  return (
    <section className='flex h-full flex-auto flex-col'>
      <div className='layout flex flex-auto flex-col items-center gap-10 p-10'>
        <div className='flex w-full items-center justify-start gap-6'>
          <div
            className='bg-background-100 flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full hover:bg-white/30 active:scale-95'
            onClick={() => router.push('/purchase')}
          >
            <LeftArrowIcon className='h-[13px] w-[23px]' />
          </div>
          <div className='text-[40px] font-bold leading-[50px]'>My Cover</div>
        </div>
        <MyList />
      </div>
    </section>
  );
};
