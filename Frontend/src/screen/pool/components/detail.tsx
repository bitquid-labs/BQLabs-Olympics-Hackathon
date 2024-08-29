import React from 'react';

import { StakeType } from '@/screen/stake/constants';

type DetailProps = {
  pool: StakeType | undefined;
};

export const Detail = ({ pool }: DetailProps): JSX.Element => {
  return (
    <div className='flex w-full flex-col gap-10'>
      <div className='text-[40px] font-bold leading-[50px]'>{`Pool: ${pool?.rating}`}</div>
      <div className='bg-background-100 flex flex-auto flex-col gap-4 rounded-[15px] p-6'>
        <div className='text-2xl font-bold'>Pool Details:</div>
        <div className='flex flex-col gap-6 text-xl'>
          <div className='flex items-center justify-between'>
            <div>APY</div>
            <div>{pool?.apy}</div>
          </div>
          <div className='flex items-center justify-between'>
            <div>Total value Stacked</div>
            <div>{pool?.tvl} BTCP</div>
          </div>
          <div className='flex items-center justify-between'>
            <div>Payout Mechanism</div>
            <div>Automatic</div>
          </div>
          <div className='flex items-center justify-between'>
            <div>Payout Currency</div>
            {/* <div>{pool?.currency}</div> */}
            <div>BTCP</div>
          </div>
        </div>
      </div>
    </div>
  );
};
