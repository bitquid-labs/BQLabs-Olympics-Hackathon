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
import { useAllProposals } from "@/hooks/contracts/useAllProposals";
import { bnToNumber, numberToBN } from "@/lib/formulat";
import { toast } from 'react-toastify';
import { useProposalByCoverId } from '@/hooks/contracts/useProposalByCover';

type ClaimScreenType = {
  coverId?: string | null
}

export const ClaimScreen: React.FC<ClaimScreenType> = (props): JSX.Element => {
  const { coverId } = props;
  const { address } = useAccount();
  const router = useRouter();
  const [currentCover, setCurrentCover] = useState<IUserCover>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentCoverId = useMemo(() => {
    return currentCover?.coverId ? Number(currentCover?.coverId) : 0;
  }, [currentCover?.coverId])

  const proposal = useProposalByCoverId(currentCoverId.toString());

  console.log('current proposal', proposal);

  const userCovers = useAllUserCovers(address as string);

  const products = useMemo(() => {
    let foundMatch = false;
  
    const updatedProducts = userCovers.map((cover, index) => {
      let isSelected = false;
      if (Number(cover?.coverId).toString() === coverId) {
        isSelected = true;
        setCurrentCover(cover); // Set the matching cover
        foundMatch = true;
      }
      return {
        name: cover?.coverName,
        coverId: cover?.coverId ? Number(cover?.coverId) : '',
        isSelected: isSelected
      };
    });
  
    // If no match was found, select the first item
    if (!foundMatch && updatedProducts.length > 0) {
      setCurrentCover(userCovers[0]);
      updatedProducts[0].isSelected = true;
    }
  
    return updatedProducts;
  }, [userCovers, coverId]);
  
  

  const [lossEventDate, setLossEventDate] = useState<Date | null>(new Date());
  const [claimValueStr, setClaimValueStr] = useState<string>('');
  const [slashingTx, setSlashingTx] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [isSlashing, setIsSlashing] = useState<boolean>(false);
  const maxClaimableNum = useMemo(() => {
    return parseFloat(bnToNumber(currentCover?.coverValue));    
  }, [currentCover?.coverValue])

  // useAllProposals();


  const error = useMemo(() => {
    // if (lossEventDate === '') return 'Input Loss Event Date'
    if (!address) return 'Connect Wallet'
    if (claimValueStr === '') return 'Input Claim Amount';
    if (isSlashing && slashingTx === '') return 'Enter Slashing Tx'
    if (parseFloat(claimValueStr) > maxClaimableNum) return 'Over Claimable Amount'
    // if (description === '') return ''
    return ''
  }, [
    address,
    lossEventDate,
    claimValueStr,
    slashingTx,
    description
  ])

  const handleSubmitClaim = async () => {
    setIsLoading(true);
    const params = {
      user: address,
      riskType: 0, // riskType
      coverId: currentCover?.coverId,
      description: description,
      poolId: 1n, // poolId
      claimAmount: numberToBN(claimValueStr), // claimAmount
      // currentCover?.
    };

    try {
      await writeContract(config, {
        abi: GovContract.abi,
        address: GovContract.address as `0x${string}`,
        functionName: 'createProposal',
        args: [params],
      })

      toast.success("Proposal submitted!");
    } catch (err) {
      let errorMsg = "";
      if (err instanceof Error) {
        if (err.message.includes("User denied transaction signature")) {
          errorMsg = "User denied transaction signature";
        } else {
          errorMsg = "Failed to submit proposal";
        }
      } else {
        errorMsg = "Unexpected error";
      }

      toast.error(errorMsg);
    }

    setIsLoading(false);
  }

  const handleSlashingTxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSlashingTx(event.target.value);
  }

  const handleClaimValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('value:')
    setClaimValueStr(event.target.value);
  }

  const handleLossEventDateChange = (date: Date | null) => {
    setLossEventDate(date);
  };

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
            isLoading={isLoading}
            lossEventDate={lossEventDate}
            claimValueStr={claimValueStr}
            slashingTx={slashingTx}
            description={description}
            maxClaimable={maxClaimableNum}
            error={error}
            isSlashing={isSlashing}
            handleLossEventDateChange={handleLossEventDateChange}
            handleClaimValueChange={handleClaimValueChange}
            handleSlashingTxChange={handleSlashingTxChange}
            handleDescriptionChange={handleDescriptionChange}
            handleSubmitClaim={handleSubmitClaim}
          />
          <Status
            status={proposal?.status}
          />
        </div>
      </div>
    </section>
  );
};
