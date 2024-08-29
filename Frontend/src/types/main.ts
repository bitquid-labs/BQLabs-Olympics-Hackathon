export const enum RiskType {
  Slashing,
  SmartContract,
  Stablecoin,
  Protocol
}

export const enum CoverDueTo {
  NoneSelected,
  SmartContract,
  SevereOracle
}

export interface ICover {
  chainId?: number | undefined,
  covername?: string | undefined,
  currentBalance?: bigint | undefined,
  description?: bigint | undefined,
  id?: bigint | undefined,
  maxAmount?: bigint | undefined,
  network?: string | undefined,
  riskType?: RiskType | undefined,
}

export interface IUserCover {
  chainId?: number | undefined,
  coverFee?: bigint | undefined,
  coverId?: bigint | undefined,
  coverName?: string | undefined,
  coverPeriod?: bigint | undefined,
  coverValue?: bigint | undefined,
  endDay?: bigint | undefined,
  isActive?: boolean | undefined,
  startDay?: bigint | undefined,
  user?: string | undefined,
}

export const enum CoverToken {
  
}

export type InsurancePoolType = {
  poolName: string;
  apy: number;
  minPeriod: number;
  acceptedToken: string;
  tvl: number;
  tcp: number;
  isActive: boolean;
};

export type ProposalType = {
  id: number;
  votesFor: number;
  votesAgainst: number;
  createdAt: number;
  deadline: number;
  executed: boolean;
  proposalParam: {
    user: string;
    coverId: number;
    description: string;
    poolId: number;
    claimAmount: number;
    riskType?: RiskType | undefined;
  };
};