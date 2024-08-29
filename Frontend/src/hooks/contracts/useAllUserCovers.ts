import {useEffect} from 'react';

import { ICoverContract } from "@/constant/contracts";

import {useBlockNumber, useReadContract} from 'wagmi';
import { IUserCover } from "@/types/main";

export const useAllUserCovers = (address: string) => {
  const {data: blockNumber} = useBlockNumber({watch: true});
  const {data: userCovers, refetch} = useReadContract({
    abi: ICoverContract.abi,
    address: ICoverContract.address as `0x${string}`,
    functionName: 'getAllUserCovers',
    args: [address],
  })

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  if (!userCovers) return [];

  try {
    const result = userCovers as IUserCover[];
    if (!result) return [];

    return result;


  } catch (error) {
    return [];
  }
};
