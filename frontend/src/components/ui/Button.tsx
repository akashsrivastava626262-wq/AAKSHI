'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'luxury';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-rose-gold text-white hover:bg-rose-gold-dark shadow-md hover:shadow-lg',
      secondary: 'bg-champagne text-premium-black hover:bg-champagne-light',
      outline: 'border-2 border-rose-gold text-rose-gold hover:bg-rose-gold hover:text-white',
      ghost: 'text-rose-gold hover:bg-beige',
      luxury: 'bg-gradient-to-r from-rose-gold to-champagne text-white btn-luxury shadow-lg hover:shadow-xl',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs tracking-wider',
      md: 'px-6 py-3 text-sm tracking-wider',
      lg: 'px-8 py-4 text-base tracking-widest',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
