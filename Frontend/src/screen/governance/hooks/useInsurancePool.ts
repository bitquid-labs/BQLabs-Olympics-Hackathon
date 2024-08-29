import { useEffect, useState } from 'react';
import { useReadContracts } from 'wagmi';

import { InsurancePoolContract } from '@/constant/contracts';

export type InsurancePoolType = {
  poolName: string;
  apy: number;
  minPeriod: number;
  acceptedToken: string;
  tvl: number;
  tcp: number;
  isActive: boolean;
};

export const useInsurancePool = () => {
  const [pools, setPools] = useState<InsurancePoolType[]>([]);

  const { data: contractData } = useReadContracts({
    contracts: [
      {
        ...InsurancePoolContract,
        functionName: 'getAllPools',
        args: [],
      },
    ],
  });

  useEffect(() => {
    console.log("111", contractData);
    if (contractData && contractData[0].result) {
      console.log("1111", contractData[0].result);
      setPools(contractData[0].result as InsurancePoolType[]);
      console.log('123123', pools);
    }
  }, [contractData]);

  return { pools };
};
