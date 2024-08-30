import React, { useMemo, useState } from 'react';

import { List } from '@/screen/purchase/components/list';
import { Search } from '@/screen/purchase/components/search';
import { useAllAvailableCovers } from "@/hooks/contracts/useAllAvailableCovers";
import { RiskType } from "@/types/main";

export const PurchaseScreen = (): JSX.Element => {
  const availableCovers = useAllAvailableCovers();

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<RiskType | undefined>(undefined);

  const filteredCovers = useMemo(() => {
    // Convert search keyword to lowercase once for efficiency
    const keyword = searchKeyword.trim().toLowerCase();

    // If no filter is applied and no search keyword, return early
    if (filterCategory === undefined && !keyword) return availableCovers;

    return availableCovers.filter((cover) => {
      // Check category filter
      const matchesCategory = filterCategory === undefined || cover.riskType === filterCategory;

      // Check search keyword filter (case-insensitive)
      const matchesSearch = keyword === '' || cover.coverName?.toLowerCase().includes(keyword);

      // Return true only if both conditions are met
      return matchesCategory && matchesSearch;
    });
  }, [availableCovers, searchKeyword, filterCategory]);

  console.log('filtered:', filteredCovers)
  
  return (
    <section className='flex h-full flex-auto flex-col'>
      <div className='layout flex flex-auto flex-col items-center gap-10 p-10'>
        <Search
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
        />
        <List
          covers={filteredCovers}
        />
      </div>
    </section>
  );
};
