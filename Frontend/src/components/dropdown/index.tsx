'use client';

import React, { useState } from 'react';

import { cn } from '@/lib/utils';

import BackDrop from '@/components/backdrop';

import DownArrowIcon from '~/svg/down-arrow.svg';

type DropdownProps = {
  className?: string;
  label?: string;
  description?: string;
  value?: number;
  setValue: (value: number) => void;
  options: string[];
};

const Dropdown = ({
  className,
  label,
  description,
  value,
  setValue,
  options,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <BackDrop className={className} onClick={() => setIsOpen(false)}>
      <div className={cn('flex w-full flex-col gap-1', className)}>
        {label && <div className='text-light'>{label}</div>}
        {description && <p className='font-primary'>{description}</p>}
        <div className='relative'>
          <button
            className='bg-background-200/20 flex items-center gap-3 rounded-full px-4 py-1'
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className='flex items-center gap-2'>
              <div className='bg-background-200 h-[15px] w-[15px] rounded-full' />
              <div className='font-semibold'>
                {value ? options[value] : 'Select'}
              </div>
            </div>
            <DownArrowIcon className='h-2 w-3' />
          </button>
          {isOpen && (
            <div className='border-border-300 bg-background-100 absolute left-0 right-0 top-full z-10 mt-1 flex flex-col gap-2 rounded-lg border p-4 shadow'>
              {options.map((opt, i) => (
                <div
                  key={i}
                  className='cursor-pointer text-[14px] capitalize leading-[20px]'
                  onClick={() => {
                    setValue(i);
                    setIsOpen(false);
                  }}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </BackDrop>
  );
};

export default Dropdown;
