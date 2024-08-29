import { JsonFragment } from '@ethersproject/abi';
import Gov from './abis/Gov.json';
import ICoverABI from './abis/InsuranceCover.json';

import InsurancePool from './abis/InsurancePool.json';
import MockERC20 from './abis/MockERC20.json';

export type ContractType = {
  abi: JsonFragment[];
  address: `0x${string}`;
};

export const GovContract: ContractType = {
  abi: Gov as JsonFragment[],
  address: '0x7cBDCa7f78B3A43Da33892bdF7D10c80351b799c',
};

export const ICoverContract: ContractType = {
  abi: ICoverABI,
  address: '0xDA99aFE557cb207E9d7e8e89f2D18990B30460f7'
}

export const InsurancePoolContract: ContractType = {
  abi: InsurancePool,
  address: '0x08c835Fe23989cb85d40018114c7e3d064a2AE48',
};

export const MockERC20Contract: ContractType = {
  abi: MockERC20,
  address: '0x119d0D5b257E4855fC5bA4e79538A2B7F589F6b0',
};
