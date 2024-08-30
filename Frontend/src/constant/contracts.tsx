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
  address: '0x532656807B59DB53C940f984076D32fE653Db758',
};

export const ICoverContract: ContractType = {
  abi: ICoverABI,
  address: '0x9689a2EAdF13DE136E7c7AC993Bb4Fc114669160'
}

export const InsurancePoolContract: ContractType = {
  abi: InsurancePool,
  address: '0x89AE684d499bDecC283EDdc1122390C6e2355504',
};

export const MockERC20Contract: ContractType = {
  abi: MockERC20,
  address: '0xb650bedaAAf173366D59d8ef74f571aCAFA0a6f1',
};

