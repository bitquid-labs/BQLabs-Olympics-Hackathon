export enum StackDetail {
  rating = 'Pool Rating',
  apy = 'APY',
  currency = 'Currency',
  tenure = 'Min Tenure',
}

export type StakeType = {
  [key in keyof typeof StackDetail]: string;
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
