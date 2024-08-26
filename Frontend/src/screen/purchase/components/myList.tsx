import React from 'react';

import { MyCover } from '@/screen/purchase/components/myCover';
import { myCovers } from '@/screen/purchase/constants';

export const MyList = (): JSX.Element => {
  return (
    <div className='grid w-full grid-cols-3 gap-[38px]'>
      {myCovers.map((cover, index) => (
        <MyCover key={index} {...cover} />
      ))}
    </div>
  );
};
