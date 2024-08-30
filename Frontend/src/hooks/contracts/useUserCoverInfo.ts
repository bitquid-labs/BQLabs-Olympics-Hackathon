import {useEffect} from 'react';

import { ICoverContract } from "@/constant/contracts";

import {useBlockNumber, useReadContract} from 'wagmi';
import { IUserCover } from "@/types/main";

export const useUserCoverInfo = (address: string, coverId: number) => {
  const {data: blockNumber} = useBlockNumber({watch: true});
  const {data: userCover, refetch} = useReadContract({
    abi: ICoverContract.abi,
    address: ICoverContract.address as `0x${string}`,
    functionName: 'getUserCoverInfo',
    args: [address, coverId],
  })

  console.log('raw user cover info:', userCover)

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  if (!userCover) return undefined;

  try {
    const result = userCover as IUserCover;
    if (!result) return undefined;

    return result;


  } catch (error) {
    return undefined;
  }
};
