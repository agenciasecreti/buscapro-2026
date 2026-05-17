import { ChevronDown } from 'lucide-react';
import { forwardRef } from 'react';

import { cn } from '../lib/cn';

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

/**
 * Select nativo estilizado — acessível por padrão, teclado/leitor de tela,
 * sem dependências extras.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          aria-invalid={invalid || undefined}
          className={cn(
            'h-11 w-full appearance-none rounded-xl border border-input bg-muted/40 pl-4 pr-10 text-base text-foreground transition-all duration-200',
            'hover:bg-muted/60 focus-visible:border-primary focus-visible:bg-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15',
            'disabled:cursor-not-allowed disabled:opacity-50',
            invalid && 'border-destructive',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
      </div>
    );
  },
);

Select.displayName = 'Select';
