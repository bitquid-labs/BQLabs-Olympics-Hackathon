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
  address: '0x4980A362613A018e83165B53e7c26348Dd33Ab1A',
};

export const ICoverContract: ContractType = {
  abi: ICoverABI,
  address: '0x15c4ff1dda6cFD7bfC7370D9EDFAD6f756306B4d'
}

export const InsurancePoolContract: ContractType = {
  abi: InsurancePool,
  address: '0xFd5CbD237e28b628fBB8597d1b6E42b2a3E062e1',
};

export const MockERC20Contract: ContractType = {
  abi: MockERC20,
  address: '0xD6cD3f86F2428696393dC1ABb95B2aC56587A8C7',
};

