import { useRouter } from 'next/navigation'
import React, { useCallback, useContext } from 'react';

import Button from '@/components/button/button';

import { MyCoverType } from '@/screen/purchase/types';
import { IUserCover } from "@/types/main";
import { bnToNumber, getRiskTypeName, UNIXToDate } from "@/lib/formulat";
import { ClaimContext } from "@/contexts/ClaimContext";
import { useUserCoverInfo } from "@/hooks/contracts/useUserCoverInfo";
import { useAccount } from "wagmi";
import { useCoverInfo } from "@/hooks/contracts/useCoverInfo";

export type CoverProps = {
  onSubmit?: () => void;
} & IUserCover;

export const MyCover = (props: CoverProps): JSX.Element => {
  const { coverId, coverName, coverValue: coverValueBN, endDay: endTimeStamp, riskType } = props;
  const endDate = UNIXToDate(endTimeStamp || 0n);
  const router = useRouter();
  const riskTypeName = getRiskTypeName(riskType);

  const coverValue = bnToNumber(coverValueBN || 0n);

  const { address } = useAccount();

  const coverInfo = useCoverInfo(Number(coverId))

  console.log('coverinfo:', coverInfo)

  const handleLinkDetail = useCallback(() => {
    router.push(`/claim/?coverId=${coverId}`);
  }, [coverId, router]);

  return (
    <div className='bg-background-100 flex w-full flex-col gap-5 rounded-[15px] p-5'>
      <div className='flex items-center gap-[10px]'>
        <div className='h-[60px] w-[60px] rounded-full overflow-hidden'>
          <img src={coverInfo?.CID} className="w-full h-full" alt='logo' />
        </div>
        <div className='flex flex-col gap-1'>
          <div className='text-lg font-semibold leading-[22px]'>{coverName}</div>
          <div className='flex items-center gap-1'>
            {/* <div className='h-5 w-5 rounded-full bg-white' /> */}
            {riskTypeName && (<div className='text-sm'>{riskTypeName}</div>)}
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
