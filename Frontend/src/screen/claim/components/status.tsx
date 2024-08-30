import React from 'react';

import Button from '@/components/button/button';

import { PropsalStatus } from '@/types/main';

type StatusType = {
  status: PropsalStatus | undefined;
}

const StatusText = [
  'Submitted',
  'Pending',
  'Withdraw'
]

export const Status: React.FC<StatusType> = ({ status }): JSX.Element => {
  return (
    <div className='border-border-200 ml-[109px] flex w-full flex-col gap-10 border-l pl-[60px]'>
      <div className='text-[40px] font-bold leading-[50px]'>Claim Status</div>
      {StatusText.map((text, index) => (
      <Button key={index} className='w-full' variant={status == index ? 'primary' : 'gradient-outline'} size='xl'>{text}</Button>  
      ))}
      {/* <Button className='w-full' variant='primary' size='xl'>
        Submitted
      </Button>
      <Button className='w-full' variant='gradient-outline' size='xl'>
        Pending
      </Button>
      <Button className='w-full' variant='gradient-outline' size='xl'>
        Withdraw
      </Button> */}
    </div>
  );
};
