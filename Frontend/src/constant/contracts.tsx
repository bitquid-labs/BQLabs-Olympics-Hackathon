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
  abi: Gov,
  address: '0xE29294E14ed708511b021a221Fa2903F1DebDB1f',
};

export const ICoverContract: ContractType = {
  abi: ICoverABI,
  address: '0x0036D7d2312b2f5a2a0583314c94b59dA0Fc4efB'
}

export const InsurancePoolContract: ContractType = {
  abi: InsurancePool,
  address: '0xFd5CbD237e28b628fBB8597d1b6E42b2a3E062e1',
};

export const MockERC20Contract: ContractType = {
  abi: MockERC20,
  address: '0xD6cD3f86F2428696393dC1ABb95B2aC56587A8C7',
};

