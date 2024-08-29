'use client';

import React, { useEffect, useState } from 'react';

import { PoolScreen } from '@/screen/pool';
import { convertStakeTypeData, convertTvl } from '@/lib/utils';
import { useAllInsurancePools } from '@/hooks/contracts/pool/useAllInsurancePools';

export const DefaultClientPage = ({
  params: { currency, poolid },
}: {
  params: { currency: string, poolid: string };
}): JSX.Element => {
  const pools = useAllInsurancePools();
  return <PoolScreen currency={currency} pools={convertStakeTypeData(pools)} poolId={poolid} />;
};
