import React from 'react';

import Input from '@/components/input';
import Button from "@/components/button/button";

type RequirementType = {
  lossEventDate: string,
  claimValueStr: string,
  slashingTx: string,
  description: string,
  error: string,
  isSlashing: boolean,
  handleLossEventDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleClaimValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleSlashingTxChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleDescriptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleSubmitClaim: () => void,
}

export const Requirement = (props: RequirementType): JSX.Element => {
  const {lossEventDate, claimValueStr, slashingTx, description, error, isSlashing, handleLossEventDateChange, handleClaimValueChange, handleSlashingTxChange, handleDescriptionChange, handleSubmitClaim} = props;

  return (
    <div className='flex w-full flex-col gap-10'>
      <div className='text-[40px] font-bold leading-[50px]'>
        Claim Requirements
      </div>
      <div className='bg-background-100 flex flex-auto flex-col gap-6 rounded-[15px] p-6'>
        <div className='flex flex-col gap-6 text-xl'>
          <div className='flex items-center justify-between'>
            <div>Loss Event Date</div>
            <div className='h-[40px] w-[140px]'>
              <Input
                type='number'
                className='border-border-200 max-w-full border'
                value={lossEventDate}
                onChange={(e) => {
                  handleLossEventDateChange(e)}}
              />
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div>Max Claimable</div>
            <div>4 WBTC</div>
          </div>
          <div className='flex items-center justify-between'>
            <div>Claim Value</div>
            <div className='h-[40px] w-[140px]'>
              <Input
                type='number'
                className='border-border-200 border'
                rightIcon={<div>WBTC</div>}
                value={claimValueStr}
                onChange={(e) => handleClaimValueChange(e)}
              />
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div>Slashing Tnx Hash</div>
            <div className='h-[40px] w-[140px]'>
              <Input 
                className='border-border-200 border' 
                value={slashingTx}
                disabled={isSlashing}
                onChange={(e) => handleSlashingTxChange(e)}  
              />
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div>Description</div>
            <div className='h-[40px] w-[140px]'>
              <Input className='border-border-200 border' />
            </div>
          </div>
          <div className='flex items-center justify-center'>
            <Button variant='primary' size='lg' className='min-w-[216px]' onClick={() => handleSubmitClaim()} disabled={!!error}>
              {error || 'Submit Claim'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
