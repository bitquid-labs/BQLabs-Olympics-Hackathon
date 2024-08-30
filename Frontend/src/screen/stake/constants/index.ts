export enum StackDetail {
  rating = 'Pool Rating',
  apy = 'APY',
  currency = 'Currency',
  tenure = 'Min Tenure',
  poolId = '1',
  tvl = '10000',
}
export enum MyStackDetail {
  rating = 'Pool Rating',
  apy = 'APY',
  currency = 'Currency',
  claim = 'Staked Value',
  tenure = 'Min Tenure',
  poolId = '1',
  tvl = '10000',
}

export type StakeType = {
  [key in keyof typeof StackDetail]: string;
};

export type MyStakeType = {
  [key in keyof typeof MyStackDetail]: string;
};

export const tempStacks: StakeType[] = [
  {
    rating: 'AAA',
    apy: '3-5%',
    currency: 'WBTC',
    tenure: '2 months',
    poolId: '1',
    tvl: '10000'
  },
  {
    rating: 'BB',
    apy: '13%',
    currency: 'PWR',
    tenure: '3 months',
    poolId: '2',
    tvl: '10000'
  },
  {
    rating: 'C',
    apy: '24%',
    currency: 'USDC',
    tenure: '3 months',
    poolId: '3',
    tvl: '10000'
  },
];

export const tempMyStacks: MyStakeType[] = [
  {
    rating: 'AAA',
    apy: '3-5%',
    currency: 'WBTC',
    tenure: '2 months',
    claim: '0.15 BTC',
    poolId: '1',
    tvl: '10000'
  },
  {
    rating: 'BB',
    apy: '13%',
    currency: 'PWR',
    tenure: '3 months',
    claim: '0.14 BTC',
    poolId: '2',
    tvl: '10000'
  },
  {
    rating: 'C',
    apy: '24%',
    currency: 'USDC',
    tenure: '3 months',
    claim: '0.14 BTC',
    poolId: '3',
    tvl: '10000'
  },
];
