import React from 'react';

import { Cover } from '@/screen/purchase/components/cover';
import { covers } from '@/screen/purchase/constants';

export const List = (): JSX.Element => {
  return (
    <div className='grid w-full grid-cols-3 gap-[38px]'>
      {covers.map((cover, index) => (
        <Cover key={index} {...cover} />
      ))}
    </div>
  );
};
