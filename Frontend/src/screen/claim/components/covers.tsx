import React from 'react';

import RectButton from '@/components/button/rectButton';

type ProductType = {
  name: string | undefined,
  isSelected: boolean;
}


type CoversType = {
  products: ProductType[]
}

export const Covers = (props: CoversType): JSX.Element => {
  const { products } = props;

  return (
    <div className='flex w-full flex-col gap-6'>
      <div className='text-[32px] font-bold leading-[40px]'>My Covers</div>
      <div className='grid grid-cols-3 gap-9'>
        {products.map((product, index) => (
          <RectButton variant={product.isSelected ? 'default': 'outline'}>{product.name || ''}</RectButton>
        ))}
        {/* <RectButton>Babylon Slashing</RectButton>
        <RectButton variant='outline'>Palladium Stablecoin</RectButton>
        <RectButton variant='outline'>Stacking DAO Smart Contract</RectButton> */}
      </div>
    </div>
  );
};
