import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Button from '@/components/button/button';

import LeftArrowIcon from '~/svg/left-arrow.svg';

import { useReadContracts, useChainId, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MyStackDetail, tempMyStacks, MyStakeType } from '@/screen/stake/constants';
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

export const MyStakeScreen = (): JSX.Element => {

  const chainId = useChainId()

  const { address, isConnected } = useAccount()

  const [myStacks, setMyStacks] = useState<MyStakeType[]>([]);


  // const { pools } = useInsurancePool();
  // writeContract({
  //   ...MockERC20Contract,
  //   functionName: 'mint',
  //   // args: [BigInt(poolId.toString())],
  //   args: ['0x2F35A475Ac8633a10E88917e59e3c8B9aD1A9660', BigInt('1000000000000000000000')],
  // });

  const { data: contractData } = useReadContracts({
    contracts: [
      {
        ...InsurancePoolContract,
        functionName: 'getPoolsByAddress',
        args: [`${address}`],
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

  const convertData = (data: InsurancePoolType[]): MyStakeType[] => {
    console.log("mystakes size is", data.length);
    const result: MyStakeType[] = [];
    for (let i = 0; i < data.length; i++) {
      const tvl = convertTvl(Number(data[i].tvl));
      result.push({
        rating: data[i].poolName,
        apy: `${data[i].apy}%`,
        currency: 'BTCP',
        tenure: `${data[i].minPeriod} days`,
        claim: `${tvl} BTCP`,
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
          Active Stake Positions
        </div>
        <div className='flex w-full flex-col gap-6'>
          {myStacks?.map((stack, index) => (
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
                  {key === 'claim' && (
                    <div className='w-full'>
                      <Button
                        variant='gradient-outline'
                        className='bg-background-100 w-full'
                        size='lg'
                        onClick={() => handleWriteContract(index + 1, '10000000000000000000', 65)}
                      >
                        Withdraw Stake
                      </Button>
                    </div>
                  )}
                </div>
              ))}
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
