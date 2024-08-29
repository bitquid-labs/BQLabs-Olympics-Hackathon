import { COVER_FEE_RATE } from "@/constant/config";
import { parseUnits } from "viem";

export const calculateCoverFee = (coverAmount: number, coverPeriod: number) => {
  return coverAmount * COVER_FEE_RATE * coverPeriod / 365;
}


export function numberToBN(value: number | string, unit: number = 6) {
  if (typeof value === 'string' && Number.isNaN(parseFloat(value))) return BigInt('0');
  return value ? parseUnits(value.toString(), unit) : BigInt('0');
}
