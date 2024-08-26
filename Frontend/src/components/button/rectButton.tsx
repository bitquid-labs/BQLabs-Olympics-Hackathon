import { LucideIcon } from 'lucide-react';
import * as React from 'react';
import { IconType } from 'react-icons';
import { ImSpinner2 } from 'react-icons/im';

import { cn } from '@/lib/utils';

import TrapezodSvg from '~/svg/trapezoid.svg';
import TrapezodOutlineSvg from '~/svg/trapezoid-outline.svg';

export const ButtonVariant = ['default', 'outline'] as const;
export const ButtonSize = ['base'] as const;

type IconProps = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type ButtonProps = {
  isLoading?: boolean;
  variant?: (typeof ButtonVariant)[number];
  size?: (typeof ButtonSize)[number];
  leftIcon?: IconType | LucideIcon | IconProps | React.ReactNode;
  rightIcon?: IconType | LucideIcon | IconProps | React.ReactNode;
  classNames?: {
    leftIcon?: string;
    rightIcon?: string;
  };
} & React.ComponentPropsWithRef<'button'>;

const RectButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled: buttonDisabled,
      isLoading,
      variant = 'default',
      size = 'base',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      classNames,
      ...rest
    },
    ref
  ) => {
    const disabled = isLoading || buttonDisabled;

    const renderIcon = (
      icon: ButtonProps['leftIcon'] | ButtonProps['rightIcon'],
      size: string,
      className?: string
    ) => {
      if (React.isValidElement(icon)) {
        return <span className={cn(size, className)}>{icon}</span>;
      }

      if (typeof icon === 'function') {
        const IconComponent = icon as React.ComponentType<
          React.SVGProps<SVGSVGElement>
        >;
        return <IconComponent className={cn(size, className)} />;
      }

      return null;
    };

    return (
      <div
        className={cn(
          'group relative h-auto',
          'transition-all',
          'active:scale-95'
        )}
      >
        {variant === 'default' && <TrapezodSvg className='' />}
        {variant === 'outline' && (
          <>
            <TrapezodSvg className='hidden group-hover:block' />
            <TrapezodOutlineSvg className='group-hover:hidden' />
          </>
        )}

        <button
          ref={ref}
          type='button'
          disabled={disabled}
          className={cn(
            'box-border flex items-center justify-center',
            'focus-visible:ring-primary-100 focus:outline-none focus-visible:ring',
            'transition-all',
            'text-center',
            'absolute inset-0 z-10',
            [size === 'base' && ['text-2xl font-medium']],
            [
              variant === 'default' && ['text-light'],
              variant === 'outline' && ['text-light'],
            ],
            'disabled:cursor-not-allowed',
            isLoading &&
              'relative text-transparent transition-none hover:text-transparent disabled:cursor-wait',
            className
          )}
          {...rest}
        >
          {isLoading && (
            <div
              className={cn(
                'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                {
                  'text-white': ['primary', 'dark'].includes(variant),
                  'text-black': ['light'].includes(variant),
                }
              )}
            >
              <ImSpinner2 className='animate-spin' />
            </div>
          )}
          {LeftIcon &&
            renderIcon(
              LeftIcon,
              size === 'base' ? 'mr-2' : 'mr-1.5',
              classNames?.leftIcon
            )}
          {children}
          {RightIcon &&
            renderIcon(
              RightIcon,
              size === 'base' ? 'ml-2' : 'ml-1.5',
              classNames?.rightIcon
            )}
        </button>
      </div>
    );
  }
);

export default RectButton;
