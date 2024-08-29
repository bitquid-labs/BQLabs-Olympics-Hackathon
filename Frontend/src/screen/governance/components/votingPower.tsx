import React, { useState } from 'react';

import Button from '@/components/button/button';

type CurrencyProps = {
  isLive: boolean;
  onSelectProposalType: (value: boolean) => void;
};

export const VotingPower = ( { onSelectProposalType, isLive }: CurrencyProps ): JSX.Element => {
  
  return (
    <div className='flex flex-col items-start justify-between'>
      <div className='flex flex-col items-start text-[40px] font-bold leading-[50px]'>
        <div>Become a Governance</div>
        <div>Member By Staking BTCP</div>
      </div>
      <div className='text-2xl font-medium'>Voting Power - 100</div>
      <div className='mt-5 flex items-center gap-8'>
        <Button variant={ isLive ? 'primary' : 'gradient-outline'} size='lg'
          onClick={() => onSelectProposalType(true)}
        >
          Live Proposals
        </Button>
        <Button variant={ !isLive ? 'primary' : 'gradient-outline'} size='lg'
          onClick={() => onSelectProposalType(false)}
          >
          Past Proposals
        </Button>
      </div>
    </div>
  );
};
