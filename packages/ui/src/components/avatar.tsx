import { cn } from '../lib/cn';

const sizes = {
  sm: 'size-8 text-xs',
  md: 'size-11 text-sm',
  lg: 'size-16 text-lg',
  xl: 'size-24 text-2xl',
} as const;

export interface AvatarProps {
  name: string;
  src?: string | null;
  size?: keyof typeof sizes;
  className?: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const base = cn(
    'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold',
    sizes[size],
    className,
  );

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(base, 'object-cover')}
        loading="lazy"
      />
    );
  }

  return (
    <span
      className={cn(base, 'bg-primary/10 text-primary')}
      aria-label={name}
      role="img"
    >
      {initials(name)}
    </span>
  );
}
