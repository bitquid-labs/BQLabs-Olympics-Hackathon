import React, { useContext } from 'react';

import { Cover } from '@/screen/purchase/components/cover';
import { useAllAvailableCovers } from "@/hooks/contracts/useAllAvailableCovers";
import { useAccount } from "wagmi";
import { ICover } from "@/types/main";

export const List = (): JSX.Element => {
  const { address } = useAccount();
  const availableCovers = useAllAvailableCovers();

  return (
    <div className='grid w-full grid-cols-3 gap-[38px]'>
      {availableCovers.map((cover: ICover, index) => (
        <Cover key={index} {...cover} />
      ))}
    </div>
  );
};
