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
  address: '0x1e9C655f946c06c2c6bC915145818546BeE79c5d'
}

export const InsurancePoolContract: ContractType = {
  abi: InsurancePool,
  address: '0x6E836D2342112dE2FFbd1BA72dFC3f5218293f9E',
};

export const MockERC20Contract: ContractType = {
  abi: MockERC20,
  address: '0xD6cD3f86F2428696393dC1ABb95B2aC56587A8C7',
};

