import { useEffect } from 'react';
import {useBlockNumber, useReadContract} from 'wagmi';
import { InsurancePoolContract } from "@/constant/contracts";
import { PoolCoverType } from "@/types/main";

export const usePoolCovers = (poolId: string) => {
  const {data: blockNumber} = useBlockNumber({watch: true});
  const {data: poolCovers, refetch} = useReadContract({
    abi: InsurancePoolContract.abi,
    address: InsurancePoolContract.address as `0x${string}`,
    functionName: 'getPoolCovers',
    args: [Number(poolId)],
  })

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  console.log('poolCovers Hook', poolCovers);
  if (!poolCovers) return [];

  try {
    const result = poolCovers as PoolCoverType[];
    if (!result) return [];

    return result;


  } catch (error) {
    return [];
  }
};
