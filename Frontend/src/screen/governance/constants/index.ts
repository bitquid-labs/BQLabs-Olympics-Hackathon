export enum ProposalDetail {
  type = 'Claim Type',
  incentive = 'Incentive',
  value = 'Claim Value',
}

type TempStack = {
  [key in keyof typeof ProposalDetail]: string;
};

export const tempProposlas: TempStack[] = [
  {
    type: 'Smart Contract',
    incentive: '50 BQ',
    value: '2 WBTC',
  },
  {
    type: 'Stable Coin',
    incentive: '50 BQ',
    value: '5000 USDC',
  },
];
