import { useEffect, useState } from 'react';
import { useReadContracts } from 'wagmi';

import { GovContract } from '@/constant/contracts';

export type ProposalType = {
  id: number;
  votesFor: number;
  votesAgainst: number;
  createdAt: number;
  deadline: number;
  executed: boolean;
  proposalParams: {
    user: string;
    validatorAddress: string;
    validator_score: number;
    riskType: string;
    coverEndDay: number;
    coverValue: number;
    description: string;
    txHash: string;
    poolId: number;
    cliamAmount: number;
  };
};

export const useGov = () => {
  const [proposals, setProposals] = useState<ProposalType[]>([]);

  const { data: contractData } = useReadContracts({
    contracts: [
      {
        ...GovContract,
        functionName: 'proposals',
        args: [],
      },
    ],
  });

  useEffect(() => {
    console.log('2222', contractData);
    if (contractData && contractData[0].result) {
      setProposals(contractData[0].result as ProposalType[]);
    }
  }, [contractData]);

  return { proposals };
};
