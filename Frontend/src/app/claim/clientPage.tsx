'use client';

import React from 'react';

import { ClaimScreen } from "@/screen/claim";
import { useSearchParams } from 'next/navigation';

export const DefaultClientPage = (): JSX.Element => {
  const searchParams = useSearchParams();
  const coverId = searchParams.get('coverId');
  return <ClaimScreen coverId={coverId} />;
};
