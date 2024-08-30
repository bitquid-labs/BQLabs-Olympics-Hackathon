import React, { useState } from 'react';

import Button from '@/components/button/button';

type CurrencyProps = {
  isLive: boolean;
  onSelectProposalType: (value: boolean) => void;
};

export const VotingPower = ( { onSelectProposalType, isLive }: CurrencyProps ): JSX.Element => {
  
  return (
    <div className='flex items-center'>
      <div className='mt-5 flex items-end gap-8'>
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
