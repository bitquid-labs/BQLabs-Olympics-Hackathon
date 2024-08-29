import Link from 'next/link';
import React from 'react';

import Button from '@/components/button/button';

import { ProposalDetail, tempProposlas } from '@/screen/governance/constants';

export const Proposals = (): JSX.Element => {
  return (
    <div className='flex w-full flex-col gap-6'>
      {tempProposlas.map((proposal, index) => (
        <div
          key={index}
          className='bg-background-100 flex w-full gap-5 rounded-[15px] p-4'
        >
          {Object.keys(proposal).map((key, i) => (
            <div key={i} className='flex w-full flex-col items-center gap-6'>
              <div className='border-border-200 w-full rounded-full border px-5 py-3 text-center'>
                {ProposalDetail[key as keyof typeof ProposalDetail]}
              </div>
              <div className='font-semibold'>
                {proposal[key as keyof typeof proposal]}
              </div>
            </div>
          ))}
          <div className='flex w-full flex-col gap-[13px]'>
            <Button variant='primary' size='lg' className='w-full'>
              Accept
            </Button>
            <Button
              variant='gradient-outline'
              size='lg'
              className='bg-background-100 w-full'
            >
              Decline
            </Button>
          </div>
          <div className='flex w-full items-end justify-center gap-6'>
            <Link
              href='/'
              className='font-semibold underline underline-offset-4'
            >
              Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
