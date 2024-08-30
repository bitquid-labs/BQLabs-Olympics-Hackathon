import { useEffect } from 'react';

import { GovContract } from "@/constant/contracts";

import { useBlockNumber, useReadContract } from 'wagmi';
import { ICover } from "@/types/main";


export const useAllProposals = () => {
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: proposals, refetch } = useReadContract({
    abi: GovContract.abi,
    address: GovContract.address as `0x${string}`,
    functionName: 'getAllProposals',
    args: [],
  })

  console.log('all proposals:', proposals)

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  if (!proposals) return [];

  try {
    const result = proposals as ICover[];
    if (!result) return [];

    return result;


  } catch (error) {
    return [];
  }
};
