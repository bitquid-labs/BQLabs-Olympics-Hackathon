export enum StackDetail {
  rating = 'Pool Rating',
  apy = 'APY',
  currency = 'Currency',
  tenure = 'Min Tenure',
}
export enum MyStackDetail {
  rating = 'Pool Rating',
  apy = 'APY',
  currency = 'Currency',
  tenure = 'Min Tenure',
  claim = 'Claim Yield',
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
  },
  {
    rating: 'BB',
    apy: '13%',
    currency: 'PWR',
    tenure: '3 months',
  },
  {
    rating: 'C',
    apy: '24%',
    currency: 'USDC',
    tenure: '3 months',
  },
];

export const tempMyStacks: MyStakeType[] = [
  {
    rating: 'AAA',
    apy: '3-5%',
    currency: 'WBTC',
    tenure: '2 months',
    claim: '0.14 BTC',
  },
  {
    rating: 'BB',
    apy: '13%',
    currency: 'PWR',
    tenure: '3 months',
    claim: '0.14 BTC',
  },
  {
    rating: 'C',
    apy: '24%',
    currency: 'USDC',
    tenure: '3 months',
    claim: '0.14 BTC',
  },
];
