import React, { useEffect, useState } from 'react';
import { cn, convertMyStakeTypeData, convertTvl } from '@/lib/utils';
import Button from '@/components/button/button';

import LeftArrowIcon from '~/svg/left-arrow.svg';

import { useChainId, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MyStackDetail, tempMyStacks, MyStakeType } from '@/screen/stake/constants';
import { InsurancePoolContract, ICoverContract } from '@/constant/contracts';
import { MockERC20Contract } from '@/constant/contracts';
import { useAllInsurancePoolsByAddress } from '@/hooks/contracts/pool/useAllInsurancePoolsByAddress';
import { InsurancePoolType } from '@/types/main';

import { toast } from 'react-toastify';

export const MyStakeScreen = (): JSX.Element => {

  const chainId = useChainId()
  const { address, isConnected } = useAccount()
  const [myStacks, setMyStacks] = useState<MyStakeType[]>([]);
  const pools = useAllInsurancePoolsByAddress(`${address}`);

  const {
    data: hash,
    isPending,
    writeContractAsync
  } = useWriteContract({
    mutation: {
      async onSuccess(data) {
        console.log(1)
      },
      onError(error) {
        console.log(1, error)
      }
    }
  });

  const handleWriteContract = async (poolId: number): Promise<void> => {
    console.log('wallet address is: ', `${address}`);

    try {
      await writeContractAsync({
        ...InsurancePoolContract,
        functionName: 'withdraw',
        args: [BigInt(poolId.toString())],
      })
      // console.log("poolId is ", poolId);
      toast.success("Withdraw Sucess!");
    } catch (err) {
      let errorMsg = "";
      if (err instanceof Error) {
        if (err.message.includes("User denied transaction signature")) {
          errorMsg = "User denied transaction signature";
        } else {
          errorMsg = "Can't withdraw before tenure passed!";
        }
      } else {
        errorMsg = "Unexpected error";
      }

      toast.error(errorMsg);
    }
  }

  const handleClaimWriteContract = async (poolId: number): Promise<void> => {
    console.log('wallet address is: ', `${address}`);

    try {
      await writeContractAsync({
        ...ICoverContract,
        functionName: 'claimPayoutForLP',
        args: [BigInt(poolId.toString())],
      });
      toast.success("Claim Sucess!");
    } catch (err) {
      let errorMsg = "";
      if (err instanceof Error) {
        if (err.message.includes("User denied transaction signature")) {
          errorMsg = "User denied transaction signature";
        } else {
          errorMsg = "InsufficientPoolBalance!";
        }
      } else {
        errorMsg = "Unexpected error";
      }

      toast.error(errorMsg);
    }
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (pools) {
      setMyStacks(convertMyStakeTypeData(pools as InsurancePoolType[]));
      console.log(myStacks)
    }
  }, [pools]);

  return (
    <section className='flex h-full flex-auto flex-col'>
      <div className='container mx-auto flex flex-auto flex-col items-center gap-10 pt-12'>
        <div className='text-[40px] font-bold leading-[50px]'>
          Active Stake Positions
        </div>
        <div className='flex w-full flex-col gap-6'>
          {myStacks?.map((stack, index) => (
            <div
              key={index}
              className='bg-background-100 flex justify-around gap-5 rounded-[15px] p-4'
            >
              <div className='flex flex-col w-2/4 px-16 py-6'>
                <div className='flex'>
                  {Object.keys(stack).map((key, i) => (
                    <div
                      key={i}
                      className={cn(
                        `flex w-full flex-row justify-center items-center gap-6 ${i > 1 ? 'hidden' : ''}`,
                        (key === 'poolId' || key === 'tvl' || key == 'currency') && 'hidden'
                      )}
                    >
                      {i < 2 && <div className='w-11/12 gap-x-1'>
                        <div
                          className={cn(
                            `w-full rounded-full px-5 py-3 text-center `,
                            'bg-[#0699D8]'
                          )}
                        >
                          {MyStackDetail[key as keyof typeof MyStackDetail]}
                        </div>
                        <div className='font-semibold my-5 text-center'>
                          {stack[key as keyof typeof stack]}
                        </div>
                      </div>
                      }

                    </div>
                  ))}
                </div>
                <div className='flex justify-center'>
                  <Button
                    variant='gradient-outline'
                    className='bg-background-100 w-full'
                    size='lg'
                    onClick={() => handleClaimWriteContract(index + 1)}
                  >
                    Claim Yield
                  </Button>
                </div>
              </div>
              <div className='border-[0.5px] border-gray-700 w-px flex justify-center items-end relative'>
                <div className='bg-gray-700 w-1.5 h-1.5 rotate-45 absolute'></div>
              </div>
              <div className='flex flex-col w-2/4 px-16 py-6'>
                <div className='flex'>
                  {Object.keys(stack).map((key, i) => (
                    <div
                      key={i}
                      className={cn(
                        `flex w-full flex-col items-center gap-6 ${i < 2 ? 'hidden' : ''}`,
                        (key === 'poolId' || key === 'tvl' || key == 'currency') && 'hidden'
                      )}
                    >
                      {i > 1 && <div className='w-11/12 gap-x-1'>
                        <div
                          className={cn(
                            'w-full rounded-full px-5 py-3 text-center',
                            'bg-[#0699D8]'
                          )}
                        >
                          {MyStackDetail[key as keyof typeof MyStackDetail]}
                        </div>
                        <div className='font-semibold my-5 text-center'>
                          {stack[key as keyof typeof stack]}
                        </div>
                      </div>
                      }

                    </div>
                  ))}
                </div>

                <div className='flex justify-center'>
                  <Button
                    variant='gradient-outline'
                    className='bg-background-100 w-full'
                    size='lg'
                    onClick={() => handleWriteContract(index + 1)}
                  >
                    Withdraw Stake
                  </Button>
                </div>

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
