import { useEffect, useState } from 'react';
import { GovContract } from "@/constant/contracts";
import { useBlockNumber, useReadContract } from 'wagmi';
import { ICover, ProposalType } from "@/types/main";

export const useProposalByCoverId = (coverId?: string) => {
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: proposals, refetch } = useReadContract({
    abi: GovContract.abi,
    address: GovContract.address as `0x${string}`,
    functionName: 'getAllProposals',
    args: [], // Modify this if your contract function requires arguments
  });

  console.log('all proposals:', proposals)

  const [filteredProposals, setFilteredProposals] = useState<ProposalType>();

  useEffect(() => {
    if (proposals) {
      const result = proposals as ProposalType[];
      if (coverId !== undefined) {
        const filtered = result.find(proposal => Number(proposal.proposalParam.coverId).toString() === coverId);
        setFilteredProposals(filtered);
      } else {
        // If coverId is undefined, return all proposals
        setFilteredProposals(undefined);
      }
    }
  }, [proposals, coverId]);

  useEffect(() => {
    refetch();
  }, [blockNumber, coverId]);

  return filteredProposals;
};
