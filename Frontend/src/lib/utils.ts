import { TempProposalType } from '@/screen/governance/constants';
import { MyStakeType, StakeType } from '@/screen/stake/constants';
import { InsurancePoolType, ProposalType } from '@/types/main';
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge classes with tailwind-merge with clsx full feature */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertTvl = (amount: number) => {
  return amount / 10 ** 18;
}

export const convertAmount = (amount: string): string => {
  const num = Number(amount) * (10 ** 8);
  return num.toString() + '0000000000';
}

export const convertStakeTypeData = (data: InsurancePoolType[]): StakeType[] => {
  const result: StakeType[] = [];
  for (let i = 0; i < data.length; i++) {
    const tvl = convertTvl(Number(data[i].tvl));
    result.push({
      rating: data[i].poolName,
      apy: `${data[i].apy}%`,
      currency: 'BTCP',
      tenure: `${data[i].minPeriod} days`,
      poolId: (i + 1).toString(),
      tvl: tvl.toString()
    });
  }
  return result;
}

export const convertTempProposalTypeData = (data: ProposalType[]): TempProposalType[] => {
  const result: any[] = [];
  for (let i = 0; i < data.length; i++) {
    const tvl = convertTvl(Number(data[i].proposalParam.claimAmount));
    result.push({
      type: `${data[i].proposalParam.riskType?.toString()}`,
      incentive: `${tvl} BTCP`,
      value: `${tvl} BTCP`
    });
  }
  return result;
}

export const convertMyStakeTypeData = (data: InsurancePoolType[]): MyStakeType[] => {
  console.log("mystakes size is", data.length);
  const result: MyStakeType[] = [];
  for (let i = 0; i < data.length; i++) {
    const tvl = convertTvl(Number(data[i].tvl));
    result.push({
      rating: data[i].poolName,
      apy: `${data[i].apy}%`,
      currency: 'BTCP',
      tenure: `${data[i].minPeriod} days`,
      claim: `${tvl} BTCP`,
      poolId: (i + 1).toString(),
      tvl: tvl.toString()
    });
  }
  return result;
}

