import {useEffect} from 'react';

import { ICoverContract } from "@/constant/contracts";

import {useBlockNumber, useReadContract} from 'wagmi';
import { ICover, RiskType } from "@/types/main";
import { bnToNumber } from "@/lib/formulat";

type CoverType = [
  bigint,
  string,
  RiskType,
  string,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  string,
]

export const useCoverInfo = (coverId: number) => {
  const {data: blockNumber} = useBlockNumber({watch: true});
  const {data: userCover, refetch} = useReadContract({
    abi: ICoverContract.abi,
    address: ICoverContract.address as `0x${string}`,
    functionName: 'covers',
    args: [coverId],
  })

  console.log('raw cover info:', userCover)

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  if (!userCover) return undefined;

  try {
    const result = userCover as CoverType;
    if (!result) return undefined;

    return {
      id: Number(result[0]),
      coverName: result[1],
      riskType: result[2],
      chains: result[3],
      capacity: Number(result[4]),
      cost: Number(result[5]),
      capacityAmount: bnToNumber(result[6]),
      coverValues: bnToNumber(result[7]),
      maxAmount: bnToNumber(result[8]),
      poolId: Number(result[9]),
      CID: result[10],
    };


  } catch (error) {
    return undefined;
  }
};
