import { useEffect } from 'react';

import { ICoverContract } from "@/constant/contracts";

import { useBlockNumber, useReadContract } from 'wagmi';
import { ICover } from "@/types/main";

export const useAllAvailableCovers = () => {
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: availableCovers, refetch } = useReadContract({
    abi: ICoverContract.abi,
    address: ICoverContract.address as `0x${string}`,
    functionName: "getAllAvailableCovers",
    args: [],
  })

  console.log('raw available:', availableCovers)

  // useEffect(() => {
  //   refetch();
  // }, [blockNumber]);

  if (!availableCovers) return [];

  try {
    const result = availableCovers as ICover[];
    if (!result) return [];

    return result;


  } catch (error) {
    return [];
  }
};
