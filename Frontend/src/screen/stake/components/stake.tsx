import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Button from '@/components/button/button';
// import { StackDetail, tempStacks } from '@/screen/stake/constants';
import LeftArrowIcon from '~/svg/left-arrow.svg';

import { useReadContracts, useChainId, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MyStackDetail, tempMyStacks, StakeType } from '@/screen/stake/constants';
import { useInsurancePool } from '@/screen/governance/hooks/useInsurancePool';
import { InsurancePoolContract } from '@/constant/contracts';
import { MockERC20Contract } from '@/constant/contracts';

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

  const chainId = useChainId()

  const { address, isConnected } = useAccount()

  const [myStacks, setMyStacks] = useState<StakeType[]>([]);

  const { data: contractData } = useReadContracts({
    contracts: [
      {
        ...InsurancePoolContract,
        functionName: 'getAllPools',
        args: [],
      },
    ],
  });

  const {
    data: hash,
    isPending,
    writeContract
  } = useWriteContract();

  const handleWriteContract = (poolId: number, amount: string, day: number): void => {
    console.log('wallet address is: ', `${address}`);

    writeContract({
      ...MockERC20Contract,
      functionName: 'approve',
      args: [`${address}`, BigInt(amount)],
    });

    writeContract({
      ...InsurancePoolContract,
      functionName: 'deposit',
      args: [BigInt(poolId.toString()), BigInt(amount), BigInt(day.toString())],
    });
    // console.log("poolId is ", poolId);
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const convertData = (data: InsurancePoolType[]): StakeType[] => {
    const result: StakeType[] = [];
    for (let i = 0; i < data.length; i++) {
      const tvl = convertTvl(Number(data[i].tvl));
      result.push({
        rating: data[i].poolName,
        apy: `${data[i].apy}%`,
        currency: 'BTCP',
        tenure: `${data[i].minPeriod} days`,
        poolId: (i + 1).toString(),
        tvl: tvl.toString()
      });
    }
    return result;
  }

  const convertTvl = (amount: number) => {
    return amount / 10 ** 18;
  }

  useEffect(() => {
    if (contractData && contractData[0].result) {
      setMyStacks(convertData(contractData[0].result as InsurancePoolType[]));
      // console.log("111", contractData[0].result, isConnected, chainId, address);
    }

  }, [contractData]);

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
                      key === 'rating' && 'bg-[#0699D8]',
                      key === 'apy' && 'bg-[#449704]',
                      key === 'currency' && 'bg-[#DF1A1A]',
                      key === 'tenure' && 'bg-[#E915C7]'
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
                <div className='w-full rounded-full bg-[#CBA005] px-5 py-3 text-center'>
                  Stack
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
