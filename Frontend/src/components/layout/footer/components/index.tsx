import React from 'react';

import { Link } from '@/components/layout/footer/components/link';

import Copy from '~/svg/copyright.svg';

const Footer = (): JSX.Element => {
  return (
    <footer className='w-full'>
      <div className='layout border-border-100 flex w-full items-center justify-between border-t-[0.5px] px-[100px] pb-7 pt-5'>
        <div className='flex items-center gap-2'>
          <Copy className='h-5 w-5' />
          <div>2024 BitQuid Labs. all Right Reserved</div>
        </div>
        {/* <div className='flex items-center gap-7'>
          <div>Contact Us</div>
          <div>Terms of Use</div>
          <div>Help Center</div>
        </div> */}
        <Link />
      </div>
    </footer>
  );
};

export default Footer;
