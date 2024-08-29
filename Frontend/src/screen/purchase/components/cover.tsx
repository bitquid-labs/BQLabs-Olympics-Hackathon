import { useRouter } from 'next/navigation';
import React, { useCallback, useContext, useMemo } from 'react';

import Button from '@/components/button/button';

import { CoverType } from '@/screen/purchase/types';
import { ICover } from "@/types/main";
import { CoverContext } from "@/contexts/CoverContext";

export type CoverProps = {
  onSubmit?: () => void;
} & CoverType;

export const Cover = (cover: ICover): JSX.Element => {
  const { coverName, chains, dailyCost, capacity, id } = cover;
  console.log('cover:', cover)
  const annualCost = useMemo(() => { return Number(dailyCost) * 365 }, [dailyCost]);

  const { setSelectedCover } = useContext(CoverContext)!;
  const router = useRouter();

  const handleLinkDetail = useCallback((cover: ICover) => {
    setSelectedCover(cover);
    router.push(`/cover/${id}`);
  }, [id, router]);

  return (
    <div className='bg-background-100 flex w-full flex-col gap-5 rounded-[15px] p-5'>
      <div className='flex items-center gap-[10px]'>
        <div className='h-[60px] w-[60px] rounded-full bg-white' />
        <div className='flex flex-col gap-1'>
          <div className='text-lg font-semibold leading-[22px]'>{coverName}</div>
          <div className='flex items-center gap-1'>
            <div className='h-5 w-5 rounded-full bg-white' />
            <div className='text-sm'>Smart Contract Vulnerability</div>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4 my-[20px]'>
        {/* {items.map((item, i) => (
          <div key={i} className='text-base capitalize leading-[20px]'>
            {item}
          </div>
        ))} */}
        <div className='text-base capitalize leading-[20px] flex items-center justify-between'>
          <div>chains</div>
          <div className='font-semibold'>{chains}</div>
        </div>
        <div className='text-base capitalize leading-[20px] flex items-center justify-between'>
          <div>Annual Cost</div>
          <div className='font-semibold'>{annualCost}</div>
        </div>
        <div className='text-base capitalize leading-[20px] flex items-center justify-between'>
          <div>Max Capacity</div>
          <div className='font-semibold'>{capacity}</div>
        </div>
      </div>
      <div className='flex justify-center'>
        <Button
          variant='primary'
          size='lg'
          className='min-w-[216px]'
          onClick={() => handleLinkDetail(cover)}
        >
          Buy Cover
        </Button>
      </div>
    </div>
  );
};
