import { COVER_FEE_RATE } from "@/constant/config";
import { formatUnits, parseUnits } from "viem";

export const calculateCoverFee = (coverAmount: number, coverPeriod: number) => {
  return coverAmount * COVER_FEE_RATE * coverPeriod / 365;
}


export function numberToBN(value: number | string, unit: number = 18) {
  if (typeof value === 'string' && Number.isNaN(parseFloat(value))) return BigInt('0');
  return value ? parseUnits(value.toString(), unit) : BigInt('0');
}

export function bnToNumber(value: bigint, decimals: number = 18) {
  if (!value) return '0';
  return formatUnits(value, decimals);
}


export function UNIXToDate(timestamp: bigint) {
  return new Date(Number(timestamp) * 1000); 
}