import { JsonFragment } from '@ethersproject/abi';
import Gov from './abis/Gov.json';
import ICoverABI from './abis/InsuranceCover.json';

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
