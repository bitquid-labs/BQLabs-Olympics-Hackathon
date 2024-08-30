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
  address: '0x633B9AD35da8AaB5c50807f15B543e7B4B249595',
};

export const ICoverContract: ContractType = {
  abi: ICoverABI,
  address: '0x57649f0Ab7Dc200F4b17517c2A229C0B11836Eea'
}

export const InsurancePoolContract: ContractType = {
  abi: InsurancePool,
  address: '0xFd5CbD237e28b628fBB8597d1b6E42b2a3E062e1',
};

export const MockERC20Contract: ContractType = {
  abi: MockERC20,
  address: '0xD6cD3f86F2428696393dC1ABb95B2aC56587A8C7',
};

