import React from 'react';

import { List } from '@/screen/purchase/components/list';
import { Search } from '@/screen/purchase/components/search';

export const PurchaseScreen = (): JSX.Element => {
  return (
    <section className='flex h-full flex-auto flex-col'>
      <div className='layout flex flex-auto flex-col items-center gap-10 p-10'>
        <Search />
        <List />
      </div>
    </section>
  );
};
