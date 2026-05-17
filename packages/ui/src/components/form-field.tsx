import { AlertCircle } from 'lucide-react';

import { cn } from '../lib/cn';

import { Label } from './label';

export interface FormFieldProps {
  /** Deve casar com o id/name do controle filho. */
  htmlFor: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Agrupa rótulo + controle + ajuda/erro com semântica acessível.
 * O controle filho deve usar `id={htmlFor}` e
 * `aria-describedby={`${htmlFor}-msg`}`.
 */
export function FormField({
  htmlFor,
  label,
  required,
  hint,
  error,
  className,
  children,
}: FormFieldProps) {
  const messageId = `${htmlFor}-msg`;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {error ? (
        <p
          id={messageId}
          role="alert"
          className="flex items-center gap-1.5 text-sm font-medium text-destructive"
        >
          <AlertCircle className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
