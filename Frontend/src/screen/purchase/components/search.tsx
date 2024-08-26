import React, { useState } from 'react';

import Button from '@/components/button/button';
import Input from '@/components/input';

import { filters } from '@/screen/purchase/constants';

import FilterIcon from '~/svg/filter.svg';
import SearchIcon from '~/svg/search.svg';

export const Search = (): JSX.Element => {
  const [selectedFilter, setSelectedFilter] = useState<number>(0);

  return (
    <div className='flex w-full flex-col gap-6'>
      <Input
        className='pl-6'
        leftIcon={<SearchIcon className='h-5 w-5' />}
        rightIcon={
          <Button className='w-full ' size='xs'>
            <FilterIcon className='h-7 w-6' />
          </Button>
        }
        placeholder='Search for a cover product'
      />
      <div className='flex w-full gap-[22px]'>
        {filters.map((filter, index) => (
          <Button
            key={index}
            variant={selectedFilter === index ? 'default' : 'outline'}
            size='lg'
            className='w-full capitalize'
            onClick={() => setSelectedFilter(index)}
          >
            {filter}
          </Button>
        ))}
      </div>
    </div>
  );
};
