import React, { Component, useEffect, useState } from 'react';

import { Currency } from '@/screen/pool/components/currency';
import { Detail } from '@/screen/pool/components/detail';
import { StakeType } from '@/screen/stake/constants';
import { PieChart } from 'react-minimal-pie-chart';
import { usePoolCovers } from '@/hooks/contracts/pool/usePoolCovers';
import { cn, convertPoolCoversData } from '@/lib/utils';

export const PoolScreen = ({
  currency,
  pools,
  poolId,
}: {
  currency: string;
  poolId: string;
  pools: StakeType[];
}): JSX.Element => {
  const pool = pools.find((stake) => stake.poolId === poolId);
  const [data, setData] = useState<any[]>([]);
  // const data = [
  //   { title: 'Merlin', value: 20, color: '#c94047' },
  //   { title: 'Babylon', value: 15, color: '#dcde8a' },
  //   { title: 'PWR', value: 60, color: '#519e60' },
  // ];

  const poolCovers = usePoolCovers(poolId);
  useEffect(() => {
    if (poolCovers) {
      console.log('poolCovers', poolCovers);
      setData(convertPoolCoversData(poolCovers));
      // setMyStacks(convertStakeTypeData(insurancePools as InsurancePoolType[]));
    }
  }, [poolCovers]);

  // console.log("pool is ", pool);
  return (
    <section className='flex h-full flex-auto flex-col'>
      <div className='layout flex flex-auto flex-col items-center gap-10 p-10 pt-12'>
        <div className='flex w-full gap-10'>
          <Detail pool={pool} />
          <Currency pool={pool} />
        </div>
        <div className='flex w-full flex-col'>
          <div className='text-[40px] font-bold leading-[50px]'>
            Risk Covered
          </div>

          <div className='flex w-full items-center justify-center'>
            <div className='flex items-center gap-6'>
              <PieChart
                data={data}
                animate
                animationDuration={2000}
                animationEasing='ease-out'
                radius={42}
                lineWidth={60}
                label={({ dataEntry }) =>
                  `${dataEntry.value}%`
                }
                labelStyle={{
                  fontSize: '5px',
                  fontFamily: 'sans-serif',
                  fill: '#fff',
                }}
                labelPosition={70}
              />
              <div className='flex min-w-[420px] flex-col gap-2'>

                {data.map((key, i) => (
                  <div className='flex items-center justify-between'>
                    <div
                      className={cn(
                        'text-2xl',
                        `text-[${data[i].color}]`
                      )}>
                      {data[i].title}</div>
                    <div className='text-2xl font-bold'>{data[i].value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
