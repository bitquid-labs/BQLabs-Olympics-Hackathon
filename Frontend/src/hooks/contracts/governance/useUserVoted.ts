import { useEffect } from 'react';
import {useBlockNumber, useReadContract} from 'wagmi';
import { ProposalType } from "@/types/main";
import { GovContract } from "@/constant/contracts";

export const useUserVoted = (proposalId: number, user: string) => {
  const {data: blockNumber} = useBlockNumber({watch: true});
  const {data: proposals, refetch} = useReadContract({
    abi: GovContract.abi,
    address: GovContract.address as `0x${string}`,
    functionName: 'getUserVoted',
    args: [proposalId, user],
  })

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  if (!proposals) return [];
  try {
    const result = proposals as any[];
    if (!result) return [];

    return result;


  } catch (error) {
    return [];
  }
};
