import React from 'react';

import { List } from '@/screen/purchase/components/list';
import { useAccount } from "wagmi";
import { useAllUserCovers } from "@/hooks/contracts/useAllUserCovers";
import { IUserCover } from "@/types/main";
import { Cover } from "@/screen/purchase/components/cover";

export const MyPurchaseScreen = (): JSX.Element => {
  const {address} = useAccount();

  const userCovers = useAllUserCovers(address as string);

  return (
    <section className='flex h-full flex-auto flex-col'>
      <div className='layout flex flex-auto flex-col items-center gap-10 p-10'>
        {userCovers.map((userCover, index) => (
          <Cover key={index} {...userCover} />          
        ))}
        {/* <List /> */}
      </div>
    </section>
  );
};
