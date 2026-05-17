import { cn } from '../lib/cn';

/**
 * Placeholder de carregamento. Use larguras/alturas via className
 * para refletir o conteúdo real (evita layout shift).
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}
