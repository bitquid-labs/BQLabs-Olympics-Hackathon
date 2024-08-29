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
  address: '0xe21E5a8241124486dA077D380788d4011212882A',
};

export const ICoverContract: ContractType = {
  abi: ICoverABI,
  address: '0xDA99aFE557cb207E9d7e8e89f2D18990B30460f7'
}

export const InsurancePoolContract: ContractType = {
  abi: InsurancePool,
  address: '0xd12e397A207f68E8cD53F7740c70D8828bBd0C18',
};

export const MockERC20Contract: ContractType = {
  abi: MockERC20,
  address: '0x119d0D5b257E4855fC5bA4e79538A2B7F589F6b0',
};
