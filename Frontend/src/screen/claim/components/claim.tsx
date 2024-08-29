import React, { useMemo, useState } from 'react';

import { Covers } from '@/screen/claim/components/covers';
import { Requirement } from '@/screen/claim/components/requirement';
import { Status } from '@/screen/claim/components/status';

import LeftArrowIcon from '~/svg/left-arrow.svg';
import { useAllUserCovers } from "@/hooks/contracts/useAllUserCovers";
import { useAccount } from "wagmi";
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";
import { IUserCover } from "@/types/main";
import { writeContract } from "@wagmi/core";
import { config } from "@/lib/config";
import { GovContract, ICoverContract } from "@/constant/contracts";

type ClaimScreenType = {
  coverId?: string | null
}

export const ClaimScreen: React.FC<ClaimScreenType> = (props): JSX.Element => {
  const { coverId } = props;
  const { address } = useAccount();
  const router = useRouter();
  const [currentCover, setCurrentCover] = useState<IUserCover>();

  const userCovers = useAllUserCovers(address as string);

  const products = useMemo(() => {
    return userCovers.map((cover, index) => {
      let isSelected = false;
      if (Number(cover?.coverId).toString() === coverId) {
        isSelected = true;
        setCurrentCover(cover);
      }
      return {
        name: cover?.coverName,
        isSelected: isSelected
      }
    });
  }, [userCovers]);

  const [lossEventDate, setLossEventDate] = useState('');
  const [claimValueStr, setClaimValueStr] = useState<string>('');
  const [slashingTx, setSlashingTx] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [isSlashing, setIsSlashing] = useState<boolean>(false);


  const error = useMemo(() => {
    // if (lossEventDate === '') return 'Input Loss Event Date'
    if (claimValueStr === '') return 'Input Claim Amount';
    if (isSlashing && slashingTx === '') return 'Enter Slashing Tx'
    // if (description === '') return ''
    if (!address) return 'Connect Wallet'
    return ''
  }, [
    address,
    lossEventDate,
    claimValueStr,
    slashingTx,
    description
  ])

  const handleSubmitClaim = async () => {
    const params = {
      user: address,
      riskType: 0n, // riskType
      coverId: currentCover?.coverId,
      description: 'test claim',
      poolId: 1n, // poolId
      claimAmount: 1000000n, // claimAmount
      // currentCover?.
    };

    try {
      await writeContract(config, {
        abi: GovContract.abi,
        address: GovContract.address as `0x${string}`,
        functionName: 'createProposal',
        args: [{
          user: address as `0x${string}`,
          riskType: 0, // riskType
          coverId: 1,
          description: "test claim",
          poolId: 1, // poolId
          claimAmount: 100, // claimAmount    
        }],
        chainId: 21000001
      })
    } catch (e) {
      console.log('error', e);
    }
  }

  const handleSlashingTxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSlashingTx(event.target.value);
  }

  const handleClaimValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('value:')
    setClaimValueStr(event.target.value);
  }

  const handleLossEventDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('event date change')
    setLossEventDate(event.target.value);
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  }


  return (
    <section className='flex h-full flex-auto flex-col'>
      <div className='layout flex flex-auto flex-col items-center gap-10 p-10 pt-12'>
        <div className='flex w-full items-center justify-start gap-6'>
          <div className='bg-background-100 flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full hover:bg-white/30 active:scale-95'
            onClick={() => router.push('/purchase/me')}
          >
            <LeftArrowIcon className='h-[13px] w-[23px]' />
          </div>
          <div className='text-[40px] font-bold leading-[50px]'>Claim</div>
        </div>
        <Covers
          products={products}
        />
        <div className='flex w-full'>
          <Requirement
            lossEventDate={lossEventDate}
            claimValueStr={claimValueStr}
            slashingTx={slashingTx}
            description={description}
            error={''}
            isSlashing={isSlashing}
            handleLossEventDateChange={handleLossEventDateChange}
            handleClaimValueChange={handleClaimValueChange}
            handleSlashingTxChange={handleSlashingTxChange}
            handleDescriptionChange={handleDescriptionChange}
            handleSubmitClaim={handleSubmitClaim}
          />
          <Status />
        </div>
      </div>
    </section>
  );
};
