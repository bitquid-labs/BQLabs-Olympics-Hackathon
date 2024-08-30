import React from 'react';

import Discord from '~/svg/discord.svg';
import Telegram from '~/svg/telegram.svg';
import Linkedin from '~/svg/linkedin.svg';
import Twitter from '~/svg/x.svg';
import Medium from '~/svg/medium.svg';

export const Link = (): JSX.Element => {
  return (
    <div className='flex gap-6'>
      <a href='https://www.linkedin.com/company/bq-labs' target='blank'>
        <Linkedin className='h-8 w-8' />
      </a>
      <a href='https://discord.gg/wrFmetGCa7' target='blank'>
        <Discord className='h-8 w-8' />
      </a>
      <a href='https://t.me/+xj1JDLHhA8VhZjJl'>
        <Telegram className='h-8 w-8' />
      </a>
      <a href='' target='blank'>
        <Medium className='h-8 w-8' />
      </a>
      <a href='https://twitter.com/bitquidlabs' target='blank'>
        <Twitter className='h-8 w-8' />
      </a>
    </div>
  );
};
