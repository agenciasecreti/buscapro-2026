'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import { forwardRef } from 'react';

import { cn } from '../lib/cn';

export const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    required?: boolean;
  }
>(({ className, children, required, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'flex items-center gap-1 text-sm font-medium text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-60',
      className,
    )}
    {...props}
  >
    {children}
    {required && (
      <span className="text-destructive" aria-hidden>
        *
      </span>
    )}
  </LabelPrimitive.Root>
));

Label.displayName = 'Label';
