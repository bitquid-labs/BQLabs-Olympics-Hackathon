export const enum RiskType {
  Slashing,
  SmartContract,
  Stablecoin,
  Protocol
}

export const riskTypeNames = [
  "Slashing Vulnerability",
  "SmartContract Vulnerability",
  "Stablecoin Vulnerability",
  "Protocol Vulnerability"
];

export const enum CoverDueTo {
  NoneSelected,
  SmartContract,
  SevereOracle
}

export interface ICover {
  id?: bigint | undefined,
  riskType?: RiskType | undefined,
  capacity?: bigint | undefined,
  capacityAmount?: bigint | undefined,
  chains?: string | string,
  CID?: string | undefined,
  cost?: bigint | undefined,
  coverName?: string | undefined,
  coverValues?: bigint | undefined,
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
  riskType?: number | undefined,
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
  status: PropsalStatus;
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

export interface IIcon {
  className?: string;
  fill?: string;
}
export type VoterType = {
  voted: boolean,
  vote: boolean, 
  weight: number
};

export type PoolCoverType = {
  id: number;
  coverName: string;
  riskType: number;
  chains: string;
  capacity: number;
  cost: number;
  capacityAmount: number;
  coverValues: number;
  maxAmount: number;
  poolId: number;
  CID: string;
}

export enum PropsalStatus {
  Submitted, 
  Pending,
  Executed,
  Rejected
}