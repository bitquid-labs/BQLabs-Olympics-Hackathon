import React from 'react';

import FaceBook from '~/svg/facebook.svg';
import Instagram from '~/svg/instagram.svg';
import Linkedin from '~/svg/linkedin.svg';
import Twitter from '~/svg/twitter.svg';
import Youtube from '~/svg/youtube.svg';

export const Link = (): JSX.Element => {
  return (
    <div className='flex gap-6'>
      <FaceBook className='h-8 w-8' />
      <Instagram className='h-8 w-8' />
      <Youtube className='h-8 w-8' />
      <Twitter className='h-8 w-8' />
      <Linkedin className='h-8 w-8' />
    </div>
  );
};
