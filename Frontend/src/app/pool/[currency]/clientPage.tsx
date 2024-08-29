'use client';

import React, { useEffect, useState } from 'react';

import { PoolScreen } from '@/screen/pool';
import { useReadContracts } from 'wagmi';
import { StakeType } from '@/screen/stake/constants';
import { InsurancePoolContract } from '@/constant/contracts';
import { InsurancePoolType } from '@/screen/stake/components/myStake';

export const DefaultClientPage = ({
  params: { currency },
}: {
  params: { currency: string };
}): JSX.Element => {

  const [pools, setPools] = useState<StakeType[]>([]);
  const { data: contractData } = useReadContracts({
    contracts: [
      {
        ...InsurancePoolContract,
        functionName: 'getAllPools',
        args: [],
      },
    ],
  });

  const convertData = (data: InsurancePoolType[]): StakeType[] => {
    const result: StakeType[] = [];
    for (let i = 0; i < data.length; i++) {
      const tvl = convertTvl(Number(data[i].tvl));
      result.push({
        rating: data[i].poolName,
        apy: `${data[i].apy}%`,
        currency: 'BQ',
        tenure: `${data[i].minPeriod} days`,
        poolId: '',
        tvl: ''
      });
    }
    return result;
  }

  const convertTvl = (amount: number) => {
    return amount / 10 ** 18;
  }

  useEffect(() => {
    if (contractData && contractData[0].result) {
      setPools(convertData(contractData[0].result as InsurancePoolType[]));
    }

  }, [contractData]);

  return <PoolScreen currency={currency} pools={pools} poolId={''} />;
};
