import React from 'react';

import Button from '@/components/button/button';

export const VotingPower = (): JSX.Element => {
  return (
    <div className='flex flex-col items-start justify-between'>
      <div className='flex flex-col items-start text-[40px] font-bold leading-[50px]'>
        <div>Become a Governance</div>
        <div>Member By Staking BQ</div>
      </div>
      <div className='text-2xl font-medium'>Voting Power - 100</div>
      <div className='mt-5 flex items-center gap-8'>
        <Button variant='primary' size='lg'>
          Live Proposals
        </Button>
        <Button variant='gradient-outline' size='lg'>
          Past Proposals
        </Button>
      </div>
    </div>
  );
};
