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
  id?: bigint | undefined,
  riskType?: RiskType | undefined,
  capacity?: bigint | undefined,
  chains?: string | string,
  coverName?: string | undefined,
  currentBalance?: bigint | undefined,
  dailyCost?: bigint | undefined,
  maxAmount?: bigint | undefined,
  poolId?: bigint | undefined,
  securityRating?: bigint | undefined,
}

export interface IClaim {
  claimId?: number | undefined,
}

export interface IUserCover {
  chainId?: bigint | undefined,
  claimPaid?: bigint | undefined,
  // coverFee?: bigint | undefined,
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

export type VoterType = {
  voted: boolean,
  vote: boolean, 
  weight: number
};