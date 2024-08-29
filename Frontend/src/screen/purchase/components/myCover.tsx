import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';

import Button from '@/components/button/button';

import { MyCoverType } from '@/screen/purchase/types';
import { IUserCover } from "@/types/main";
import { bnToNumber, UNIXToDate } from "@/lib/formulat";

export type CoverProps = {
  onSubmit?: () => void;
} & IUserCover;

export const MyCover = (props: CoverProps): JSX.Element => {
  const { coverId, coverName, coverValue: coverValueBN, endDay: endTimeStamp } = props;
  const endDate = UNIXToDate(endTimeStamp || 0n);
  const router = useRouter();

  const coverValue = bnToNumber(coverValueBN || 0n);

  const handleLinkDetail = useCallback(() => {
    router.push(`/cover/${coverId}`);
  }, [coverId, router]);

  return (
    <div className='bg-background-100 flex w-full flex-col gap-5 rounded-[15px] p-5'>
      <div className='flex items-center gap-[10px]'>
        <div className='h-[60px] w-[60px] rounded-full bg-white' />
        <div className='flex flex-col gap-1'>
          <div className='text-lg font-semibold leading-[22px]'>{coverName}</div>
          <div className='flex items-center gap-1'>
            <div className='h-5 w-5 rounded-full bg-white' />
            {/* <div className='text-sm'>{detail}</div> */}
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <div>Cover value</div>
          <div>{coverValue}</div>
        </div>
        <div className='flex items-center justify-between'>
          <div>Cover Expiry</div>
          <div>{endDate.toLocaleDateString()}</div>
        </div>
      </div>
      <div className='flex justify-center'>
        <Button
          variant='primary'
          size='lg'
          className='min-w-[216px]'
          onClick={handleLinkDetail}
        >
          Claim Cover
        </Button>
      </div>
    </div>
  );
};
