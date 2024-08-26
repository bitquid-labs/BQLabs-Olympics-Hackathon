import React from 'react';

import Button from '@/components/button/button';

export const Status = (): JSX.Element => {
  return (
    <div className='border-border-200 ml-[109px] flex w-full flex-col gap-10 border-l pl-[60px]'>
      <div className='text-[40px] font-bold leading-[50px]'>Claim Status</div>
      <Button className='w-full' variant='primary' size='xl'>
        Submitted
      </Button>
      <Button className='w-full' variant='gradient-outline' size='xl'>
        Pending
      </Button>
      <Button className='w-full' variant='gradient-outline' size='xl'>
        Withdraw
      </Button>
    </div>
  );
};
