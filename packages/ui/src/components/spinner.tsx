import { Loader2 } from 'lucide-react';

import { cn } from '../lib/cn';

export interface SpinnerProps {
  className?: string;
  /** Rótulo acessível — anunciado por leitores de tela. */
  label?: string;
}

export function Spinner({ className, label = 'Carregando' }: SpinnerProps) {
  return (
    <span role="status" aria-live="polite" className="inline-flex">
      <Loader2
        className={cn('size-5 animate-spin text-muted-foreground', className)}
        aria-hidden
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

/** Estado de carregamento de página/seção inteira. */
export function LoadingState({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 py-12">
      <Spinner className="size-7" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
