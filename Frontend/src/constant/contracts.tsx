import Gov from './abis/Gov.json';

export type ContractType = {
  abi: any;
  address: `0x${string}`;
};

export const GovContract: ContractType = {
  abi: Gov,
  address: '0x7cBDCa7f78B3A43Da33892bdF7D10c80351b799c',
};
