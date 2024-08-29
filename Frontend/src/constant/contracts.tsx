import Gov from './abis/Gov.json';
import InsurancePool from './abis/InsurancePool.json';
import MockERC20 from './abis/MockERC20.json';

export type ContractType = {
  abi: any;
  address: `0x${string}`;
};

export const GovContract: ContractType = {
  abi: Gov,
  address: '0x742a64760B98358bD6b2D5acE2B208FE14AcF729',
};

export const InsurancePoolContract: ContractType = {
  abi: InsurancePool,
  address: '0x08c835Fe23989cb85d40018114c7e3d064a2AE48',
};

export const MockERC20Contract: ContractType = {
  abi: MockERC20,
  address: '0x119d0D5b257E4855fC5bA4e79538A2B7F589F6b0',
};

