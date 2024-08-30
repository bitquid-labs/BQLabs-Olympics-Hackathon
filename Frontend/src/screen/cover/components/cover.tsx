'use client';

import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Detail } from '@/screen/cover/components/detail';
import { Overview } from '@/screen/cover/components/overview';

import LeftArrowIcon from '~/svg/left-arrow.svg';
import { CoverContext } from "@/contexts/CoverContext";

import { writeContract } from '@wagmi/core'
import { config } from "@/lib/config";
import INSURANCECOVER_ABI from '@/constant/abis/InsuranceCover.json';
import { ICoverContract } from "@/constant/contracts";
import { MAX_COVER_PERIOD, MIN_COVER_PERIOD } from "@/constant/config";
import { CoverDueTo } from "@/types/main";
import { useAccount } from "wagmi";
import { bnToNumber, calculateCoverFee, numberToBN } from "@/lib/formulat";
import { parseEther, parseUnits } from "viem";
import { useBalance } from 'wagmi'
import { toast } from 'react-toastify';

export const CoverScreen = ({ id }: { id: number }): JSX.Element => {
  const router = useRouter();

  const { selectedCover } = useContext(CoverContext)!;
  const { address } = useAccount();

  const [coverAmount, setCoverAmount] = useState<string>('');
  const [coverPeriod, setCoverPeriod] = useState<number>(MIN_COVER_PERIOD);
  const [coverDueTo, setCoverDueTo] = useState<CoverDueTo>(CoverDueTo.NoneSelected);
  const coverFee = useMemo(() => calculateCoverFee(parseFloat(coverAmount), coverPeriod), [coverAmount, coverPeriod]);
  const { data: balanceData } = useBalance({
    address: address as `0x${string}`,
    unit: 'ether',
  })
  const [isLoading, setIsLoading] = useState<boolean>(false);


  console.log('cover fee:', coverFee, coverAmount, coverPeriod)

  const maxCoverAmount = useMemo(() => {
    if (!balanceData) return 0;
    return parseFloat(bnToNumber(balanceData.value));
  }, [balanceData]);

  // useEffect(() => {
  //   if (!selectedCover) {
  //     // Redirect to the list page if no card is selected
  //     router.push('/purchase');
  //   }
  // }, [selectedCover, router]);

  if (!selectedCover) return <div>Loading...</div>;

  const handleBuyCover = async () => {
    setIsLoading(true);
    const params = [
      // selectedCover?.riskType,
      Number(selectedCover?.id),
      // selectedCover.coverName,
      numberToBN(coverAmount),
      coverPeriod
    ];

    console.log('param:', params, 'value:', parseUnits((coverFee).toString(), 18))

    try {
      await writeContract(config, {
        abi: ICoverContract.abi,
        address: ICoverContract.address as `0x${string}`,
        functionName: 'purchaseCover',
        args: params,
        value: parseUnits((coverFee).toString(), 18),
        chainId: 21000001
      })

      setTimeout(() => {
        toast.success("Cover purchased!");
      }, 3000);
    } catch (err) {
      let errorMsg = "";
      if (err instanceof Error) {
        if (err.message.includes("InsufficientPoolBalance")) {
          errorMsg = "Insufficient Pool Balance.";
        } else if (err.message.includes("User denied transaction signature")) {
          errorMsg = "User denied transaction signature";
        }
         else {
          errorMsg = err.message
        }
      } else {
        errorMsg = 'Unexpected error.';
      }
      toast.error(errorMsg);
    }
    setIsLoading(false);
  }

  const handleCoverAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCoverAmount(e.target.value)
  }

  const handleCoverPeriodChange = (val: number) => {
    setCoverPeriod(val);
  }

  const error = useMemo(() => {
    if (coverAmount === '') return 'Input Cover Amount'
    if (!address) return 'Connect Wallet'
    return ''
  }, [
    address,
    coverAmount
  ])


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
          <div className='text-[40px] font-bold leading-[50px]'>Buy Cover</div>
        </div>
        <div className='flex w-full items-start gap-10'>
          <Detail
            id={id}
            coverAmount={coverAmount}
            coverPeriod={coverPeriod}
            handleCoverAmountChange={handleCoverAmountChange}
            handleCoverPeriodChange={handleCoverPeriodChange}
            dueTo={coverDueTo}
            maxCoverAmount={bnToNumber(selectedCover?.maxAmount)}
          />
          <Overview
            productName={selectedCover?.coverName || ''}
            coverAmount={coverAmount}
            annualCost={Number(selectedCover?.cost)}
            coverFee={coverFee}
            handleBuyCover={handleBuyCover}
            error={error}
            coverPeriod={coverPeriod}
            logo={selectedCover?.CID || ''}
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  );
};
