import { useEffect } from 'react';

import { InsurancePoolContract } from "@/constant/contracts";

import {useBlockNumber, useReadContract} from 'wagmi';
import { InsurancePoolType } from "@/types/main";

export const useAllInsurancePools = () => {
  const {data: blockNumber} = useBlockNumber({watch: true});
  const {data: insurancePools, refetch} = useReadContract({
    abi: InsurancePoolContract.abi,
    address: InsurancePoolContract.address as `0x${string}`,
    functionName: 'getAllPools',
    args: [],
  })

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  if (!insurancePools) return [];

  try {
    const result = insurancePools as InsurancePoolType[];
    if (!result) return [];

    return result;


  } catch (error) {
    return [];
  }
};
