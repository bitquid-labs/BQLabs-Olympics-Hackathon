'use client';

import React from 'react';

import { ClaimScreen } from "@/screen/claim/components/claim";

export const DefaultClientPage = ({
  params: { id },
}: {
  params: { id: number };
}): JSX.Element => {
  return <ClaimScreen id={id} />;
};
