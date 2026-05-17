import { forwardRef } from 'react';

import { cn } from '../lib/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        aria-invalid={invalid || undefined}
        className={cn(
          'flex h-11 w-full rounded-xl border border-input bg-muted/40 px-4 text-base text-foreground transition-all duration-200 placeholder:text-muted-foreground',
          'hover:bg-muted/60 focus-visible:border-primary focus-visible:bg-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          invalid &&
            'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/15',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
