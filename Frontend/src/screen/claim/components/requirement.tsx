import React from 'react';

import Input from '@/components/input';
import Button from "@/components/button/button";
import CustomDatePicker from "@/components/DatePicker";

type RequirementType = {
  lossEventDate: Date | null,
  claimValueStr: string,
  slashingTx: string,
  description: string,
  error: string,
  maxClaimable: number,
  isSlashing: boolean,
  isLoading: boolean,
  handleLossEventDateChange: (date: Date | null) => void,
  handleClaimValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleSlashingTxChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleDescriptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleSubmitClaim: () => void,
}

export const Requirement = (props: RequirementType): JSX.Element => {
  const {lossEventDate, claimValueStr, slashingTx, description, maxClaimable, error, isSlashing, isLoading, handleLossEventDateChange, handleClaimValueChange, handleSlashingTxChange, handleDescriptionChange, handleSubmitClaim} = props;

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
              <CustomDatePicker
                selectedDate={lossEventDate}
                handleDateChange={handleLossEventDateChange}
              />
              {/* <Input
                type='number'
                className='border-border-200 max-w-full border'
                value={lossEventDate}
                onChange={(e) => {
                  handleLossEventDateChange(e)}}
              /> */}
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div>Max Claimable</div>
            <div>{maxClaimable} WBTC</div>
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
              <Input 
                className='border-border-200 border'
                value={description}  
                onChange={(e) => handleDescriptionChange(e)}
              />
            </div>
          </div>
          <div className='flex items-center justify-center'>
            <Button isLoading={isLoading} variant='primary' size='lg' className='min-w-[216px]' onClick={() => handleSubmitClaim()} disabled={!!error}>
              {error || 'Submit Claim'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
