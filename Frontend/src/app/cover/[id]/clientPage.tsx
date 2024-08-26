'use client';

import React from 'react';

import { CoverScreen } from '@/screen/cover';

export const DefaultClientPage = ({
  params: { id },
}: {
  params: { id: number };
}): JSX.Element => {
  return <CoverScreen id={id} />;
};
