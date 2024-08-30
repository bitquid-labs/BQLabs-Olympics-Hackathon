import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { cn, convertStakeTypeData, convertTvl } from '@/lib/utils';
import Button from '@/components/button/button';
import LeftArrowIcon from '~/svg/left-arrow.svg';

import {
  useReadContracts,
  useChainId,
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import {
  MyStackDetail,
  tempMyStacks,
  StakeType,
} from '@/screen/stake/constants';
import { MockERC20Contract } from '@/constant/contracts';
import { useAllInsurancePools } from '@/hooks/contracts/pool/useAllInsurancePools';

export type InsurancePoolType = {
  poolName: string;
  apy: number;
  minPeriod: number;
  acceptedToken: string;
  tvl: number;
  tcp: number;
  isActive: boolean;
};

export const StakeScreen = (): JSX.Element => {
  const chainId = useChainId();

  const { address, isConnected } = useAccount();

  const [myStacks, setMyStacks] = useState<StakeType[]>([]);

  const insurancePools = useAllInsurancePools();
  const { data: hash, isPending, writeContract } = useWriteContract();

  const handleWriteContract = (
    poolId: number,
    amount: string,
    day: number
  ): void => {
    console.log('wallet address is: ', `${address}`);

    writeContract({
      ...MockERC20Contract,
      functionName: 'approve',
      args: [`${address}`, BigInt(amount)],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (insurancePools) {
      setMyStacks(convertStakeTypeData(insurancePools as InsurancePoolType[]));
    }
  }, [insurancePools]);

  return (
    <section className='flex h-full flex-auto flex-col'>
      <div className='layout flex flex-auto flex-col items-center gap-10 p-10 pt-12'>
        <div className='text-[40px] font-bold leading-[50px]'>
          Stake Idle Assets To Secure And Earn
        </div>
        <div className='flex w-full flex-col gap-6'>
          {myStacks.map((stack, index) => (
            <div
              key={index}
              className='bg-background-100 flex w-full gap-5 rounded-[15px] p-4'
            >
              {Object.keys(stack).map((key, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex w-full flex-col items-center gap-6',
                    (key === 'poolId' || key === 'tvl') && 'hidden'
                  )}
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
                </div>
              ))}
              <div className='flex w-full flex-col items-center gap-6'>
                <div className='w-full rounded-full bg-gradient-to-t from-teal-400 to-blue-500 px-5 py-3 text-center hover:from-pink-500 hover:to-orange-500'>
                  <Link
                    href={`/pool/${stack.currency}/${index + 1}`}
                    className='font-semibold underline-offset-4'
                  >
                    Stake Now
                  </Link>
                </div>
                <Link
                  href={`/pool/${stack.currency}/${index + 1}`}
                  className='font-semibold underline underline-offset-4'
                >
                  Details
                </Link>
              </div>
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
