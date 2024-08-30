import {useEffect} from 'react';

import { GovContract } from "@/constant/contracts";

import {useBlockNumber, useReadContract} from 'wagmi';
import { ICover, RiskType } from "@/types/main";
import { bnToNumber } from "@/lib/formulat";

// type CoverType = [
//   bigint,
//   string,
//   RiskType,
//   string,
//   bigint,
//   bigint,
//   bigint,
//   bigint,
//   string,
// ]

export const useProposalById = (proposalId: number) => {
  const {data: blockNumber} = useBlockNumber({watch: true});
  const {data: proposal, refetch} = useReadContract({
    abi: GovContract.abi,
    address: GovContract.address as `0x${string}`,
    functionName: 'proposals',
    args: [proposalId],
  })

  console.log('raw proposal info:', proposal)

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  if (!proposal) return undefined;

  return undefined;

  // try {
  //   const result = userCover as CoverType;
  //   if (!result) return undefined;

  //   return {
  //     id: Number(result[0]),
  //     coverName: result[1],
  //     riskType: result[2],
  //     chains: result[3],
  //     capacity: Number(result[4]),
  //     cost: Number(result[5]),
  //     maxAmount: bnToNumber(result[6]),
  //     poolId: Number(result[7]),
  //     CID: result[8],
  //   };


  // } catch (error) {
  //   return undefined;
  // }
};
