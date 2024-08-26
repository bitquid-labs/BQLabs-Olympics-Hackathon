'use client';

import React from 'react';

import { PoolScreen } from '@/screen/pool';

export const DefaultClientPage = ({
  params: { currency },
}: {
  params: { currency: string };
}): JSX.Element => {
  return <PoolScreen currency={currency} />;
};
