import { forwardRef } from 'react';

import { cn } from '../lib/cn';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid || undefined}
        className={cn(
          'flex w-full rounded-xl border border-input bg-muted/40 px-4 py-3 text-base text-foreground transition-all duration-200 placeholder:text-muted-foreground',
          'hover:bg-muted/60 focus-visible:border-primary focus-visible:bg-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15',
          'disabled:cursor-not-allowed disabled:opacity-50',
          invalid &&
            'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/15',
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
