import React from 'react';

import { Proposals } from '@/screen/governance/components/proposals';
import { Stake } from '@/screen/governance/components/stake';
import { VotingPower } from '@/screen/governance/components/votingPower';

export const GovernanceScreen = (): JSX.Element => {
  return (
    <section className='flex h-full flex-auto flex-col'>
      <div className='layout flex flex-auto flex-col items-center gap-12 p-10 pt-12'>
        <div className='flex w-full justify-between gap-[90px]'>
          <VotingPower />
          <Stake />
        </div>
        <Proposals />
      </div>
    </section>
  );
};
