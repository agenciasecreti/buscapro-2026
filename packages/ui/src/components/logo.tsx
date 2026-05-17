import { cn } from '../lib/cn';

export interface LogoProps {
  className?: string;
  /** Mostra apenas o símbolo, sem o wordmark. */
  iconOnly?: boolean;
}

/**
 * Marca BuscaPRO — símbolo (pin + busca) + wordmark.
 * Vetorial, herda cores dos tokens, escala sem perda.
 */
export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-2.5', className)}
      aria-label="BuscaPRO"
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-brand-gradient shadow-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-5 text-primary-foreground"
          aria-hidden
        >
          <path
            d="M11 3a7 7 0 1 0 4.2 12.6l4.1 4.1a1 1 0 0 0 1.4-1.4l-4.1-4.1A7 7 0 0 0 11 3Zm0 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z"
            fill="currentColor"
          />
        </svg>
      </span>
      {!iconOnly && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          Busca<span className="text-primary">PRO</span>
        </span>
      )}
    </span>
  );
}
