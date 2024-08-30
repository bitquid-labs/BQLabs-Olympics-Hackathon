import React, { useEffect, useState } from 'react';

import { Proposals } from '@/screen/governance/components/proposals';
import { Stake } from '@/screen/governance/components/stake';
import { VotingPower } from '@/screen/governance/components/votingPower';
import { ProposalType, VoterType } from '@/types/main';
import { useAllLiveProposals } from '@/hooks/contracts/governance/useAllLiveProposals';

export const GovernanceScreen = (): JSX.Element => {

  const liveProposals = useAllLiveProposals();
  const pastProposals: ProposalType[] = [];
  const [proposals, setProposals] = useState<ProposalType[]>(liveProposals);
  const [isLive, setIsLive] = useState<boolean>(true);

  const setLive = (value: boolean) => {
    if (value) {
      setProposals(liveProposals);
    } else {
      setProposals(pastProposals);
    }
    setIsLive(value);
  }
  useEffect(() => {
    setLive(true);
    console.log('proposals liveProposals pastProposals isLive is', proposals, liveProposals, pastProposals, isLive);
  }, []);

  return (
    <section className='flex h-full flex-auto flex-col'>
      <div className='layout flex flex-auto flex-col items-center gap-12 p-10 pt-12'>
        <div className='flex w-full justify-between gap-[90px]'>
          <VotingPower isLive={isLive} onSelectProposalType={setLive}/>
          <Stake />
        </div>
        <Proposals proposals={proposals}/>
      </div>
    </section>
  );
};
