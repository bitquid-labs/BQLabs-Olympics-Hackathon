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
  covername?: string | undefined,
  coverPeriod?: bigint | undefined,
  coverValue?: bigint | undefined,
  endDay?: bigint | undefined,
  isActive?: boolean | undefined,
  startDay?: bigint | undefined,
  user?: string | undefined,
}

export const enum CoverToken {
  
}